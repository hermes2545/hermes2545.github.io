#!/usr/bin/env python3
"""Validate Shelfkeeper's project knowledge skeleton and public-safety rules."""

from __future__ import annotations

import json
import re
from pathlib import Path

REQUIRED_FRONTMATTER = {"title", "type", "status", "visibility", "created", "updated", "sources", "tags"}
ALLOWED_VISIBILITY = {"public", "private", "confidential"}
PUBLIC_FORBIDDEN = {
    "local_absolute_path": re.compile(r"/(?:home|Users)/[^/\s]+/"),
    "secret_assignment": re.compile(r"(?i)(?:api[_-]?key|password|access[_-]?token|client[_-]?secret)\s*[:=]\s*\S+"),
    "private_key": re.compile(r"BEGIN [A-Z ]*PRIVATE KEY"),
    "github_token": re.compile(r"(?:ghp|gho|github_pat)_[A-Za-z0-9_]{20,}"),
}


def parse_frontmatter(text: str) -> dict[str, str]:
    if not text.startswith("---\n"):
        return {}
    end = text.find("\n---\n", 4)
    if end < 0:
        return {}
    data: dict[str, str] = {}
    for line in text[4:end].splitlines():
        if ":" in line and not line.startswith((" ", "\t", "-")):
            key, value = line.split(":", 1)
            data[key.strip()] = value.strip()
    return data


def validate_project_knowledge(root: Path) -> list[str]:
    errors: list[str] = []
    required = [
        root / "AGENTS.md",
        root / "PROJECT.md",
        root / "docs/wiki/SCHEMA.md",
        root / "docs/wiki/index.md",
        root / "docs/wiki/log.md",
        root / ".hermes/project-links.json",
        root / ".hermes/document-registry.json",
    ]
    for path in required:
        if not path.is_file():
            errors.append(f"missing required file: {path.relative_to(root)}")

    wiki = root / "docs/wiki"
    index_path = wiki / "index.md"
    index_text = index_path.read_text(encoding="utf-8") if index_path.exists() else ""
    core_meta = {wiki / "SCHEMA.md", wiki / "index.md", wiki / "log.md"}

    for path in sorted(wiki.rglob("*.md")):
        text = path.read_text(encoding="utf-8")
        frontmatter = parse_frontmatter(text)
        missing = REQUIRED_FRONTMATTER - frontmatter.keys()
        if missing:
            errors.append(f"{path.relative_to(root)} missing frontmatter: {sorted(missing)}")
            continue
        visibility = frontmatter.get("visibility")
        if visibility not in ALLOWED_VISIBILITY:
            errors.append(f"{path.relative_to(root)} invalid visibility: {visibility}")
        if visibility == "public":
            for name, pattern in PUBLIC_FORBIDDEN.items():
                if pattern.search(text):
                    errors.append(f"{path.relative_to(root)} public-safety hit: {name}")
        if path not in core_meta and path.name != "SESSION_HANDOFF.md":
            rel = path.relative_to(wiki).as_posix()
            if rel not in index_text:
                errors.append(f"active wiki page missing from index: {rel}")

    for match in re.finditer(r"\[[^\]]+\]\(([^)]+\.md)\)", index_text):
        linked = (index_path.parent / match.group(1)).resolve()
        if not linked.is_file():
            errors.append(f"broken index link: {match.group(1)}")

    for path in [root / ".hermes/project-links.json", root / ".hermes/document-registry.json"]:
        if path.exists():
            try:
                json.loads(path.read_text(encoding="utf-8"))
            except Exception as exc:
                errors.append(f"invalid JSON {path.relative_to(root)}: {exc}")

    return errors


def main() -> int:
    root = Path(__file__).resolve().parents[1]
    errors = validate_project_knowledge(root)
    if errors:
        for error in errors:
            print(f"ERROR: {error}")
        return 1
    print("Project knowledge validation passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
