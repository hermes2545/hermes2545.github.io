#!/usr/bin/env python3
"""Build the static Hermes Library homepage from data/books.json."""

from __future__ import annotations

import argparse
from datetime import datetime
import html
import json
from pathlib import Path
from typing import Iterable

ROOT = Path(__file__).resolve().parents[1]
CATALOG_PATH = ROOT / "data" / "books.json"
TEMPLATE_PATH = ROOT / "templates" / "index.template.html"
INDEX_PATH = ROOT / "index.html"
SHELF_SIZE = 5


def load_books(path: Path = CATALOG_PATH) -> list[dict]:
    books = json.loads(path.read_text(encoding="utf-8"))
    return sorted(books, key=lambda book: (book["published_at"], book["title"]), reverse=True)


def esc(value: object, *, quote: bool = True) -> str:
    return html.escape(str(value), quote=quote)


def render_filter(category: str, *, active: bool = False) -> str:
    pressed = "true" if active else "false"
    return (
        f'<button class="filter-button" type="button" data-category="{esc(category)}" '
        f'aria-pressed="{pressed}">{esc(category)}</button>'
    )


def render_book(book: dict) -> str:
    searchable = " ".join((book["title"], book["short_title"], book["category"], book["summary"]))
    published = datetime.fromisoformat(book["published_at"]).strftime("%d/%m/%Y")
    return f'''<article class="book-card" data-category="{esc(book["category"])}" data-search="{esc(searchable)}" style="--book-accent:{esc(book["accent"])}">
  <a class="book-link" href="{esc(book["href"])}" target="_blank" rel="noopener" aria-label="เปิดอ่าน {esc(book["title"])} ในแท็บใหม่">
    <div class="book-cover-wrap">
      <img class="book-cover" src="{esc(book["cover"])}" alt="ปกหนังสือ {esc(book["short_title"])}" width="600" height="900" loading="lazy">
    </div>
    <div class="book-meta">
      <span class="book-category">{esc(book["category"])}</span>
      <h3 class="book-title">{esc(book["short_title"])}</h3>
      <time class="publish-date" datetime="{esc(book["published_at"])}">publish on {published}</time>
      <p class="book-summary">{esc(book["summary"])}</p>
    </div>
  </a>
</article>'''


def chunks(items: list[dict], size: int) -> Iterable[list[dict]]:
    for start in range(0, len(items), size):
        yield items[start : start + size]


def render_shelf(books: list[dict], number: int) -> str:
    cards = "\n".join(render_book(book) for book in books)
    return f'''<section class="shelf" aria-label="ชั้นหนังสือที่ {number}">
  <div class="book-grid">
{cards}
  </div>
  <div class="shelf-plank" aria-hidden="true"></div>
</section>'''


def render_homepage(books: list[dict], template_path: Path = TEMPLATE_PATH) -> str:
    template = template_path.read_text(encoding="utf-8")
    categories = sorted({book["category"] for book in books})
    filters = "\n          ".join(
        [render_filter("ทั้งหมด", active=True), *(render_filter(category) for category in categories)]
    )
    shelves = "\n      ".join(render_shelf(group, number) for number, group in enumerate(chunks(books, SHELF_SIZE), 1))
    return (
        template.replace("{{BOOK_COUNT}}", str(len(books)))
        .replace("{{FILTERS}}", filters)
        .replace("{{BOOKSHELVES}}", shelves)
    )


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="fail when index.html differs from generated output")
    args = parser.parse_args()

    output = render_homepage(load_books())
    if args.check:
        if not INDEX_PATH.exists() or INDEX_PATH.read_text(encoding="utf-8") != output:
            print("index.html is out of date; run scripts/build_catalog.py")
            return 1
        print(f"index.html is current ({len(load_books())} books)")
        return 0

    INDEX_PATH.write_text(output, encoding="utf-8")
    print(f"Built {INDEX_PATH} with {len(load_books())} books")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
