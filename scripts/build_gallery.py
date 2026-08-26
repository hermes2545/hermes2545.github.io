#!/usr/bin/env python3
"""Build the static Gallery from data/gallery.json."""

from __future__ import annotations

import argparse
from datetime import datetime
import html
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CATALOG_PATH = ROOT / "data" / "gallery.json"
TEMPLATE_PATH = ROOT / "templates" / "gallery.template.html"
OUTPUT_PATH = ROOT / "gallery.html"

IMAGE_SIZES = {
    "01-how-ai-agents-work-16x9.png": (1600, 900),
    "02-rag-architecture-4x3.png": (1200, 900),
    "03-cloud-vs-on-premise-square.png": (1080, 1080),
    "04-system-design-overview-16x9.png": (1600, 900),
    "05-cybersecurity-checklist-square.png": (1080, 1080),
    "06-git-workflow-4x3.png": (1200, 900),
    "07-evolution-of-ai-tall-poster.png": (900, 1600),
    "08-linux-command-cheat-sheet-a4.png": (1240, 1754),
}
CATEGORY_ORDER = ("AI", "Data", "Security", "Development")


def esc(value: object) -> str:
    return html.escape(str(value), quote=True)


def load_gallery(path: Path = CATALOG_PATH) -> list[dict]:
    items = json.loads(path.read_text(encoding="utf-8"))
    return sorted(items, key=lambda item: (item["featured_order"], item["title"]))


def render_filters(items: list[dict]) -> str:
    categories = {item["category"] for item in items}
    controls = ['<button class="chip" type="button" data-filter="All" aria-pressed="true">All</button>']
    controls.extend(
        f'<button class="chip" type="button" data-filter="{esc(category)}" aria-pressed="false">{esc(category)}</button>'
        for category in CATEGORY_ORDER
        if category in categories
    )
    return "\n          ".join(controls)


def render_artwork(item: dict) -> str:
    width, height = IMAGE_SIZES[Path(item["image"]).name]
    published = datetime.fromisoformat(item["published_at"]).strftime("%d/%m/%Y")
    return f'''<article class="art-card" data-id="{esc(item["id"])}" data-category="{esc(item["category"])}" data-date="{esc(item["published_at"])}" data-title="{esc(item["title"])}" data-featured="{esc(item["featured_order"])}">
  <button class="art-button" type="button" aria-label="เปิดภาพเต็ม {esc(item["title"])}">
    <img src="{esc(item["image"])}" alt="{esc(item["alt"])}" width="{width}" height="{height}" loading="lazy">
  </button>
  <div class="meta">
    <div class="meta-row"><span class="category">{esc(item["category"])}</span><span class="format">{esc(item["format"])}</span></div>
    <h3>{esc(item["title"])}</h3>
    <div class="meta-foot"><time datetime="{esc(item["published_at"])}">{published}</time><button class="view-link" type="button">ดูภาพเต็ม</button></div>
  </div>
</article>'''


def render_gallery(items: list[dict], template_path: Path = TEMPLATE_PATH) -> str:
    template = template_path.read_text(encoding="utf-8")
    artworks = "\n        ".join(render_artwork(item) for item in items)
    return (
        template.replace("{{ITEM_COUNT}}", str(len(items)))
        .replace("{{FILTERS}}", render_filters(items))
        .replace("{{ARTWORKS}}", artworks)
    )


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="fail when gallery.html differs from generated output")
    args = parser.parse_args()
    items = load_gallery()
    output = render_gallery(items)
    if args.check:
        if not OUTPUT_PATH.exists() or OUTPUT_PATH.read_text(encoding="utf-8") != output:
            print("gallery.html is out of date; run scripts/build_gallery.py")
            return 1
        print(f"gallery.html is current ({len(items)} artworks)")
        return 0
    OUTPUT_PATH.write_text(output, encoding="utf-8")
    print(f"Built {OUTPUT_PATH} with {len(items)} artworks")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
