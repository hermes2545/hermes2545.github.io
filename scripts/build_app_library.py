#!/usr/bin/env python3
"""Build the static App Shelf from data/apps.json."""

from __future__ import annotations

import argparse
from datetime import datetime
import html
import json
from pathlib import Path
from typing import Iterable

ROOT = Path(__file__).resolve().parents[1]
CATALOG_PATH = ROOT / "data" / "apps.json"
TEMPLATE_PATH = ROOT / "templates" / "app-library.template.html"
OUTPUT_PATH = ROOT / "app-library.html"
SHELF_SIZE = 4


def load_apps(path: Path = CATALOG_PATH) -> list[dict]:
    apps = json.loads(path.read_text(encoding="utf-8"))
    return sorted(apps, key=lambda app: (app["published_at"], app["title"]), reverse=True)


def esc(value: object) -> str:
    return html.escape(str(value), quote=True)


def render_app(app: dict) -> str:
    published = datetime.fromisoformat(app["published_at"]).strftime("%d/%m/%Y")
    searchable = " ".join((app["title"], app["short_title"], app["category"], app["summary"]))
    label = app["label"]
    return f'''<article class="app-card" data-app-id="{esc(app["id"])}" data-category="{esc(app["category"])}" data-search="{esc(searchable)}" style="--label-primary:{esc(label["primary"])};--label-accent:{esc(label["accent"])};--label-ink:{esc(label["ink"])}">
  <a class="app-link" href="{esc(app["href"])}" target="_blank" rel="noopener" aria-label="เปิด App {esc(app["title"])} ในแท็บใหม่">
    <div class="app-meta">
      <h3 class="app-title">{esc(app["short_title"])}</h3>
      <time class="publish-date" datetime="{esc(app["published_at"])}">publish on {published}</time>
      <p class="app-summary">{esc(app["summary"])}</p>
    </div>
    <div class="diskette" aria-hidden="true">
      <div class="diskette-shutter"><span></span></div>
      <div class="diskette-label">
        <span class="label-kicker">{esc(label["kicker"])}</span>
        <span class="label-mark">{esc(label["mark"])}</span>
        <strong>{esc(app["short_title"])}</strong>
        <span class="label-version">{esc(label["version"])}</span>
      </div>
      <span class="diskette-write-protect"></span>
      <span class="diskette-hub"></span>
      <span class="diskette-arrow">▶</span>
    </div>
  </a>
</article>'''


def chunks(items: list[dict], size: int) -> Iterable[list[dict]]:
    for start in range(0, len(items), size):
        yield items[start : start + size]


def render_shelf(apps: list[dict], number: int) -> str:
    cards = "\n".join(render_app(app) for app in apps)
    labels = "\n      ".join(
        f'<button class="app-category-plaque" type="button" data-category-filter="{esc(app["category"])}" aria-pressed="false">{esc(app["category"])}</button>'
        for app in apps
    )
    return f'''<section class="app-shelf" aria-label="ชั้น App ที่ {number}">
  <div class="app-grid">
{cards}
  </div>
  <div class="app-shelf-plank">
    <div class="app-label-grid">
      {labels}
    </div>
  </div>
</section>'''


def render_app_library(apps: list[dict], template_path: Path = TEMPLATE_PATH) -> str:
    template = template_path.read_text(encoding="utf-8")
    shelves = "\n      ".join(
        render_shelf(group, number)
        for number, group in enumerate(chunks(apps, SHELF_SIZE), 1)
    )
    return template.replace("{{APP_COUNT}}", str(len(apps))).replace("{{APP_SHELVES}}", shelves)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="fail when app-library.html differs from generated output")
    args = parser.parse_args()
    apps = load_apps()
    output = render_app_library(apps)
    if args.check:
        if not OUTPUT_PATH.exists() or OUTPUT_PATH.read_text(encoding="utf-8") != output:
            print("app-library.html is out of date; run scripts/build_app_library.py")
            return 1
        print(f"app-library.html is current ({len(apps)} apps)")
        return 0
    OUTPUT_PATH.write_text(output, encoding="utf-8")
    print(f"Built {OUTPUT_PATH} with {len(apps)} apps")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
