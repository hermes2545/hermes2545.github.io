# Library Session Handoff

Updated: 2026-09-13T21:18:00+07:00

## Current state

- Project: The Knowledge Shelf at `https://hermes2545.github.io/`.
- Branch: `main`.
- Latest content commit: `68021693c83c5a1fc42a8d7d352e7df5f9b01db8` (`Add Grok Bot usage router reading guide`).
- Public origin and private backup both matched that SHA after push.
- Newest Reading entry: **ใช้ Grok Bot ให้คุ้มกว่าเดิม — CLI Usage Router**.

## What changed

- Added owner-supplied HTML as `grok-bot-cli-usage-router-manual.html`, byte-preserved at SHA-256 `0f6d6dc41924416f3276d1251ee7cf74a803a22be2f17c03bb3704405f431c95`.
- Added owner-supplied cover derivative `assets/covers/custom/grok-bot-cli-usage-router-manual.webp`, EXIF-free RGB WebP 600×900 at SHA-256 `8f3e86e863cd0deb0a9a68106a08257d3ef2b047e918be339633b8c6b79a5c3f`.
- Added catalog record `grok-bot-cli-usage-router-manual` as the newest/first Reading book with short title `ใช้ Grok Bot ให้คุ้มกว่าเดิม`.
- Regenerated `index.html` to 36 Reading books.
- Added regression coverage in `tests/test_grok_bot_cli_usage_router_reading.py`; shifted older fixed-position Reading tests by one slot.

## Verification completed

Pre-push gates:

- Focused TDD RED first failed because the catalog/html/cover were absent.
- Focused GREEN: `python -m unittest tests.test_grok_bot_cli_usage_router_reading tests.test_catalog -v` → OK.
- Full suite: `python -m unittest discover -s tests -v` → OK, 143 tests.
- `python scripts/build_catalog.py --check` → current, 36 books.
- `python scripts/build_audio_library.py --check` → current, 58 audio books.
- `python scripts/build_app_library.py --check` → current, 9 apps.
- `python scripts/build_gallery.py --check` → current, 8 artworks.
- `git diff --check` → OK.
- Pre-share scan over intended files → no private paths, `.hermes` paths, cache IDs, token patterns, private keys, or image EXIF markers found.

Publication verification:

- `git ls-remote origin refs/heads/main` and `git ls-remote backup refs/heads/main` both returned `68021693c83c5a1fc42a8d7d352e7df5f9b01db8`.
- Production HTTP hash read-back matched Local for:
  - `index.html` SHA-256 `a3372bf13754…`
  - `grok-bot-cli-usage-router-manual.html` SHA-256 `0f6d6dc41924…`
  - `assets/covers/custom/grok-bot-cli-usage-router-manual.webp` SHA-256 `8f3e86e863cd…`
- Static production DOM checks confirmed 36 Reading cards, first card title/href/download target for the new guide, 600×900 cover, 11 manual chapters/nav targets, and embedded AI execution markers.
- GitHub CLI Actions metadata unavailable because `gh` is not authenticated. Browser/CDP/Playwright automation is not available in this environment, so verification used remote HEAD equality plus production HTTP hash/static DOM read-back.

## Follow-up / local state

- This handoff plus `docs/wiki/log.md` and `docs/wiki/index.md` were updated after content publication and should be committed/pushed as a small documentation follow-up.
- Private preview script remains under `.hermes/previews/` and must not be committed.
- Local HTTP server `proc_b1a9b9aa3204` may still be running and should be stopped before closing the session.
