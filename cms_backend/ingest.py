"""Catalog-safe ingest helpers for The Knowledge Shelf CMS.

The public GitHub Pages site must never hold credentials. These helpers are
pure/local file operations used by the private backend after authentication.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
import io
import json
from pathlib import Path
import re
from typing import Mapping

from PIL import Image, ImageOps

from scripts.build_catalog import load_books, render_homepage


class CmsValidationError(ValueError):
    """Raised when a CMS payload is unsafe or invalid."""


@dataclass(frozen=True)
class CollectionConfig:
    key: str
    label: str
    catalog_path: Path
    generator_command: list[str]
    output_path: Path
    upload_mode: str


@dataclass(frozen=True)
class ReadingStageResult:
    book: dict
    changed_paths: list[Path]


def collection_registry() -> dict[str, CollectionConfig]:
    """Return the CMS collection model for all public shelves.

    Reading is fully implemented first; Audio/Gallery/App share the same auth,
    preview, safety, and GitHub publish backend but have collection-specific
    metadata and asset validators.
    """

    return {
        "reading": CollectionConfig(
            key="reading",
            label="หนังสืออ่าน",
            catalog_path=Path("data/books.json"),
            generator_command=["python", "scripts/build_catalog.py"],
            output_path=Path("index.html"),
            upload_mode="html-plus-cover",
        ),
        "audio": CollectionConfig(
            key="audio",
            label="หนังสือเสียง",
            catalog_path=Path("data/audio-books.json"),
            generator_command=["python", "scripts/build_audio_library.py"],
            output_path=Path("audio-library.html"),
            upload_mode="youtube-audio-metadata-plus-cover",
        ),
        "gallery": CollectionConfig(
            key="gallery",
            label="แกลอรี่",
            catalog_path=Path("data/gallery.json"),
            generator_command=["python", "scripts/build_gallery.py"],
            output_path=Path("gallery.html"),
            upload_mode="image-artwork",
        ),
        "app": CollectionConfig(
            key="app",
            label="App",
            catalog_path=Path("data/apps.json"),
            generator_command=["python", "scripts/build_app_library.py"],
            output_path=Path("app-library.html"),
            upload_mode="app-html-or-runtime-plus-sticker",
        ),
    }


_SLUG_RE = re.compile(r"[^a-z0-9]+")
_SECRET_PATTERNS: tuple[tuple[str, re.Pattern[bytes]], ...] = (
    ("github token pattern", re.compile(rb"(?:ghp_|github_pat_)[A-Za-z0-9_]+")),
    ("google api key pattern", re.compile(rb"AIza[0-9A-Za-z_\-]{20,}")),
    ("google oauth token pattern", re.compile(rb"ya29\.")),
    ("openai-style token pattern", re.compile(rb"sk-[A-Za-z0-9]{16,}")),
    ("private key block", re.compile(rb"BEGIN [A-Z ]*PRIVATE KEY")),
    ("local absolute path", re.compile(rb"/(?:home|Users)/[A-Za-z0-9_.-]+")),
    ("signed URL pattern", re.compile(rb"(?:X-Amz-Signature|GoogleAccessId|Signature=|Expires=)")),
)


def clean_slug(value: str) -> str:
    base = value.strip().lower()
    if base.endswith(".html"):
        base = base[:-5]
    base = _SLUG_RE.sub("-", base).strip("-")
    if not base:
        raise CmsValidationError("slug is required")
    return base


def safe_public_html_name(value: str) -> str:
    raw = value.strip()
    if not raw or raw.startswith(("/", "\\", ".")) or "/" in raw or "\\" in raw or ".." in raw:
        raise CmsValidationError("HTML filename must be a single public relative filename")
    suffix = Path(raw).suffix.lower()
    if suffix and suffix != ".html":
        raise CmsValidationError("HTML filename must end in .html")
    slug = clean_slug(raw)
    return f"{slug}.html"


def scan_public_safety(data: bytes) -> list[str]:
    findings: list[str] = []
    for label, pattern in _SECRET_PATTERNS:
        if pattern.search(data):
            findings.append(label)
    return findings


def normalize_cover_to_webp(image_bytes: bytes, *, size: tuple[int, int] = (600, 900)) -> bytes:
    try:
        with Image.open(io.BytesIO(image_bytes)) as source:
            image = ImageOps.exif_transpose(source).convert("RGB")
            fitted = ImageOps.fit(image, size, method=Image.Resampling.LANCZOS, centering=(0.5, 0.5))
            out = io.BytesIO()
            fitted.save(out, format="WEBP", quality=92, method=6, exif=b"")
            return out.getvalue()
    except Exception as exc:  # pragma: no cover - exact Pillow subclasses vary
        raise CmsValidationError(f"invalid cover image: {exc}") from exc


def _validate_metadata(metadata: Mapping[str, str]) -> dict:
    required = ("id", "title", "short_title", "category", "summary", "accent", "published_at")
    missing = [key for key in required if not str(metadata.get(key, "")).strip()]
    if missing:
        raise CmsValidationError(f"missing required metadata: {', '.join(missing)}")
    book_id = clean_slug(str(metadata["id"]))
    if not re.fullmatch(r"#[0-9A-Fa-f]{6}", str(metadata["accent"])):
        raise CmsValidationError("accent must be #RRGGBB")
    try:
        datetime.fromisoformat(str(metadata["published_at"]))
    except ValueError as exc:
        raise CmsValidationError("published_at must be ISO 8601 with timezone") from exc
    return {
        "id": book_id,
        "title": str(metadata["title"]).strip(),
        "short_title": str(metadata["short_title"]).strip(),
        "href": safe_public_html_name(str(metadata.get("href") or book_id)),
        "cover": f"assets/covers/custom/{book_id}.webp",
        "category": str(metadata["category"]).strip(),
        "summary": str(metadata["summary"]).strip(),
        "accent": str(metadata["accent"]).strip().upper(),
        "published_at": str(metadata["published_at"]).strip(),
    }


def stage_reading_book_upload(
    repo_root: str | Path,
    *,
    html_bytes: bytes,
    cover_bytes: bytes,
    metadata: Mapping[str, str],
) -> ReadingStageResult:
    """Stage a Reading book in a repository checkout and regenerate index.html."""

    repo = Path(repo_root)
    if not repo.exists():
        raise CmsValidationError("repo root does not exist")
    findings = scan_public_safety(html_bytes) + scan_public_safety(cover_bytes)
    if findings:
        raise CmsValidationError("public-safety scan failed: " + ", ".join(sorted(set(findings))))
    book = _validate_metadata(metadata)
    catalog_path = repo / "data" / "books.json"
    catalog = json.loads(catalog_path.read_text(encoding="utf-8"))
    if any(existing["id"] == book["id"] for existing in catalog):
        raise CmsValidationError(f"duplicate book id: {book['id']}")
    if any(existing["href"] == book["href"] for existing in catalog):
        raise CmsValidationError(f"duplicate book href: {book['href']}")

    html_path = repo / book["href"]
    cover_rel = Path(book["cover"])
    cover_path = repo / cover_rel
    html_path.write_bytes(html_bytes)
    cover_path.parent.mkdir(parents=True, exist_ok=True)
    cover_path.write_bytes(normalize_cover_to_webp(cover_bytes))
    catalog.insert(0, book)
    catalog_path.write_text(json.dumps(catalog, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    output = render_homepage(load_books(catalog_path), template_path=repo / "templates" / "index.template.html")
    (repo / "index.html").write_text(output, encoding="utf-8")
    return ReadingStageResult(
        book=book,
        changed_paths=[Path(book["href"]), cover_rel, Path("data/books.json"), Path("index.html")],
    )
