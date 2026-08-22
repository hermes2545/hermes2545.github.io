#!/usr/bin/env python3
"""Build the static YouTube audio-book shelf from data/audio-books.json."""

from __future__ import annotations

import argparse
from datetime import datetime
import html
import json
from pathlib import Path
from typing import Iterable

ROOT = Path(__file__).resolve().parents[1]
CATALOG_PATH = ROOT / "data" / "audio-books.json"
TEMPLATE_PATH = ROOT / "templates" / "audio-library.template.html"
OUTPUT_PATH = ROOT / "audio-library.html"
PLAYLIST_URL = "https://www.youtube.com/playlist?list=PLiC0CkxoTk9TKjqaZG8n_1EXaiHKTOxFl"
SHELF_SIZE = 5


def load_audio_books(path: Path = CATALOG_PATH) -> list[dict]:
    items = json.loads(path.read_text(encoding="utf-8"))
    return sorted(items, key=lambda item: (-item["published_epoch_ms"], item["playlist_position"]))


def esc(value: object) -> str:
    return html.escape(str(value), quote=True)


def format_duration(seconds: int) -> str:
    hours, remainder = divmod(seconds, 3600)
    minutes, secs = divmod(remainder, 60)
    return f"{hours}:{minutes:02d}:{secs:02d}" if hours else f"{minutes}:{secs:02d}"


def render_audio_book(item: dict) -> str:
    published = datetime.fromisoformat(item["published_at"]).strftime("%d/%m/%Y")
    duration = format_duration(item["duration_seconds"])
    searchable = f'{item["title"]} {item["uploader"]} {published}'
    return f'''<article class="book-card audio-card" data-category="หนังสือเสียง" data-search="{esc(searchable)}">
  <a class="book-link" href="{esc(item["youtube_url"])}" target="_blank" rel="noopener" aria-label="เปิดฟัง {esc(item["title"])} ในแท็บใหม่">
    <div class="book-cover-wrap audio-cover-wrap">
      <img class="book-cover audio-cover" src="{esc(item["cover"])}" alt="ปกหนังสือเสียง {esc(item["title"])}" width="480" height="360" loading="lazy">
      <span class="audio-mark" aria-hidden="true">▶</span>
    </div>
    <div class="book-meta audio-meta">
      <span class="book-category">AUDIO BOOK</span>
      <h3 class="book-title">{esc(item["title"])}</h3>
      <span class="audio-duration">{duration}</span>
      <time class="publish-date" datetime="{esc(item["published_at"])}">publish on {published}</time>
    </div>
  </a>
</article>'''


def chunks(items: list[dict], size: int) -> Iterable[list[dict]]:
    for start in range(0, len(items), size):
        yield items[start : start + size]


def render_shelf(items: list[dict], number: int) -> str:
    cards = "\n".join(render_audio_book(item) for item in items)
    return f'''<section class="shelf" aria-label="ชั้นหนังสือเสียงที่ {number}">
  <div class="book-grid">
{cards}
  </div>
  <div class="shelf-plank" aria-hidden="true"></div>
</section>'''


def render_audio_library(items: list[dict], template_path: Path = TEMPLATE_PATH) -> str:
    template = template_path.read_text(encoding="utf-8")
    shelves = "\n      ".join(
        render_shelf(group, number)
        for number, group in enumerate(chunks(items, SHELF_SIZE), 1)
    )
    return (
        template.replace("{{ITEM_COUNT}}", str(len(items)))
        .replace("{{PLAYLIST_URL}}", esc(PLAYLIST_URL))
        .replace("{{AUDIO_SHELVES}}", shelves)
    )


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    items = load_audio_books()
    output = render_audio_library(items)
    if args.check:
        if not OUTPUT_PATH.exists() or OUTPUT_PATH.read_text(encoding="utf-8") != output:
            print("audio-library.html is out of date")
            return 1
        print(f"audio-library.html is current ({len(items)} audio books)")
        return 0
    OUTPUT_PATH.write_text(output, encoding="utf-8")
    print(f"Built {OUTPUT_PATH} with {len(items)} audio books")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
