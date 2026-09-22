"""GitHub publication helpers for the owner CMS backend."""

from __future__ import annotations

from dataclasses import dataclass
import base64
import json
import os
from pathlib import Path
import subprocess
from typing import Callable, Iterable
from urllib import error, request


class PublishError(RuntimeError):
    """Raised when publishing to GitHub cannot be completed safely."""


@dataclass(frozen=True)
class PublishResult:
    commit_sha: str
    changed_paths: list[str]


Transport = Callable[[str, str, str, dict | None], dict]


def github_api_request(method: str, path: str, token: str, payload: dict | None = None) -> dict:
    """Call GitHub's REST API and return a decoded JSON object."""

    if not token:
        raise PublishError("missing GitHub token")
    body = None if payload is None else json.dumps(payload).encode("utf-8")
    req = request.Request(
        f"https://api.github.com{path}",
        data=body,
        method=method,
        headers={
            "Accept": "application/vnd.github+json",
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "User-Agent": "knowledge-shelf-cms",
            "X-GitHub-Api-Version": "2022-11-28",
        },
    )
    try:
        with request.urlopen(req, timeout=30) as response:
            raw = response.read()
    except error.HTTPError as exc:  # pragma: no cover - exercised against live API
        detail = exc.read().decode("utf-8", errors="replace")
        raise PublishError(f"GitHub API {method} {path} failed: {exc.code} {detail}") from exc
    except OSError as exc:  # pragma: no cover - network dependent
        raise PublishError(f"GitHub API {method} {path} failed: {exc}") from exc
    return json.loads(raw.decode("utf-8")) if raw else {}


def _safe_changed_path(repo_root: Path, path: Path) -> tuple[str, Path]:
    rel = Path(path)
    if rel.is_absolute() or ".." in rel.parts:
        raise PublishError(f"unsafe changed path: {path}")
    full = (repo_root / rel).resolve()
    try:
        full.relative_to(repo_root.resolve())
    except ValueError as exc:
        raise PublishError(f"unsafe changed path: {path}") from exc
    if not full.is_file():
        raise PublishError(f"changed path does not exist: {path}")
    return rel.as_posix(), full


def publish_changed_paths(
    repo_root: str | Path,
    *,
    changed_paths: Iterable[Path],
    token: str,
    owner: str,
    repo_name: str,
    branch: str,
    base_sha: str,
    message: str,
    transport: Transport = github_api_request,
) -> PublishResult:
    """Publish changed files as one atomic Git commit and move the branch ref."""

    repo = Path(repo_root)
    if not token:
        raise PublishError("missing GitHub token")
    if not base_sha:
        ref = transport("GET", f"/repos/{owner}/{repo_name}/git/ref/heads/{branch}", token, None)
        base_sha = ref.get("object", {}).get("sha", "")
    if not base_sha:
        raise PublishError("missing base commit sha")

    safe_paths = [_safe_changed_path(repo, Path(p)) for p in changed_paths]

    commit = transport("GET", f"/repos/{owner}/{repo_name}/git/commits/{base_sha}", token, None)
    base_tree = commit.get("tree", {}).get("sha")
    if not base_tree:
        raise PublishError("base commit response did not include tree sha")

    entries: list[dict] = []
    published_paths: list[str] = []
    for rel_path, full_path in safe_paths:
        blob = transport(
            "POST",
            f"/repos/{owner}/{repo_name}/git/blobs",
            token,
            {"content": base64.b64encode(full_path.read_bytes()).decode("ascii"), "encoding": "base64"},
        )
        blob_sha = blob.get("sha")
        if not blob_sha:
            raise PublishError(f"blob response missing sha for {rel_path}")
        entries.append({"path": rel_path, "mode": "100644", "type": "blob", "sha": blob_sha})
        published_paths.append(rel_path)

    tree = transport(
        "POST",
        f"/repos/{owner}/{repo_name}/git/trees",
        token,
        {"base_tree": base_tree, "tree": entries},
    )
    tree_sha = tree.get("sha")
    if not tree_sha:
        raise PublishError("tree response missing sha")

    new_commit = transport(
        "POST",
        f"/repos/{owner}/{repo_name}/git/commits",
        token,
        {"message": message, "tree": tree_sha, "parents": [base_sha]},
    )
    new_commit_sha = new_commit.get("sha")
    if not new_commit_sha:
        raise PublishError("commit response missing sha")

    transport(
        "PATCH",
        f"/repos/{owner}/{repo_name}/git/refs/heads/{branch}",
        token,
        {"sha": new_commit_sha, "force": False},
    )
    return PublishResult(commit_sha=new_commit_sha, changed_paths=published_paths)


def github_token_from_env() -> str:
    """Return a GitHub token from backend env or the owner-authorized gh CLI."""

    token = os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN")
    if token:
        return token
    try:
        result = subprocess.run(["gh", "auth", "token"], check=False, capture_output=True, text=True, timeout=10)
    except (OSError, subprocess.TimeoutExpired):
        return ""
    if result.returncode != 0:
        return ""
    return result.stdout.strip()
