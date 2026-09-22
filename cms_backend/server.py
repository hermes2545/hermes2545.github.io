"""Minimal Cloud Run compatible HTTP API for the owner CMS.

The first production deploy accepts JSON payloads with base64-encoded files so
we can avoid storing credentials or GitHub tokens in the public static site.
"""

from __future__ import annotations

import base64
import json
import os
from pathlib import Path
from wsgiref.simple_server import make_server

from cms_backend.auth import AuthError, verify_owner_id_token
from cms_backend.ingest import CmsValidationError, collection_registry, stage_reading_book_upload
from cms_backend.publish import PublishError, github_token_from_env, publish_changed_paths

ROOT = Path(os.environ.get("LIBRARY_REPO_ROOT", Path(__file__).resolve().parents[1]))


def _json(start_response, status: str, payload: dict):
    body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    start_response(status, [("Content-Type", "application/json; charset=utf-8"), ("Content-Length", str(len(body))), ("Access-Control-Allow-Origin", os.environ.get("CMS_ALLOWED_ORIGIN", "https://hermes2545.github.io")), ("Access-Control-Allow-Headers", "content-type, authorization"), ("Access-Control-Allow-Methods", "GET, POST, OPTIONS"), ("Access-Control-Allow-Private-Network", "true")])
    return [body]


def _read_json(environ) -> dict:
    length = int(environ.get("CONTENT_LENGTH") or 0)
    raw = environ["wsgi.input"].read(length) if length else b"{}"
    return json.loads(raw.decode("utf-8"))


def _require_owner(environ) -> dict:
    header = environ.get("HTTP_AUTHORIZATION", "")
    if not header.startswith("Bearer "):
        raise AuthError("missing bearer token")
    return verify_owner_id_token(header.removeprefix("Bearer ").strip())


def application(environ, start_response):
    method = environ.get("REQUEST_METHOD", "GET")
    path = environ.get("PATH_INFO", "/")
    if method == "OPTIONS":
        return _json(start_response, "204 No Content", {})
    try:
        if method == "GET" and path == "/api/health":
            return _json(start_response, "200 OK", {"ok": True, "service": "knowledge-shelf-cms"})
        if method == "GET" and path == "/api/collections":
            _require_owner(environ)
            return _json(start_response, "200 OK", {"collections": {key: config.__dict__ | {"catalog_path": str(config.catalog_path), "output_path": str(config.output_path)} for key, config in collection_registry().items()}})
        if method == "POST" and path in {"/api/reading/stage", "/api/reading/publish"}:
            _require_owner(environ)
            payload = _read_json(environ)
            result = stage_reading_book_upload(
                ROOT,
                html_bytes=base64.b64decode(payload["html_base64"]),
                cover_bytes=base64.b64decode(payload["cover_base64"]),
                metadata=payload["metadata"],
            )
            response = {"ok": True, "book": result.book, "changed_paths": [str(path) for path in result.changed_paths]}
            if path == "/api/reading/publish":
                published = publish_changed_paths(
                    ROOT,
                    changed_paths=result.changed_paths,
                    token=github_token_from_env(),
                    owner=os.environ.get("GITHUB_REPO_OWNER", "hermes2545"),
                    repo_name=os.environ.get("GITHUB_REPO_NAME", "hermes2545.github.io"),
                    branch=os.environ.get("GITHUB_BRANCH", "main"),
                    base_sha=str(payload.get("base_sha") or os.environ.get("GITHUB_BASE_SHA") or ""),
                    message=str(payload.get("commit_message") or f"Add reading book: {result.book['short_title']}"),
                )
                response["publish"] = {"commit_sha": published.commit_sha, "changed_paths": published.changed_paths}
            return _json(start_response, "200 OK", response)
        return _json(start_response, "404 Not Found", {"ok": False, "error": "not found"})
    except (AuthError, CmsValidationError, PublishError, KeyError, json.JSONDecodeError, ValueError) as exc:
        return _json(start_response, "400 Bad Request", {"ok": False, "error": str(exc)})


def main() -> None:
    port = int(os.environ.get("PORT", "8080"))
    host = os.environ.get("HOST", "127.0.0.1")
    with make_server(host, port, application) as httpd:
        print(f"Knowledge Shelf CMS API listening on {host}:{port}", flush=True)
        httpd.serve_forever()


if __name__ == "__main__":
    main()
