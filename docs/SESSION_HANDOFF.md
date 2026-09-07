# Library Session Handoff

Updated: 2026-09-07T19:06:22+07:00

## Current state

- Project: The Knowledge Shelf at `https://hermes2545.github.io/`.
- Branch: `main` has a prepared Reading addition for **17 ขั้นตอนการใช้ Grok Bot อย่างมืออาชีพ — Interactive Reference Manual**.
- Current-turn owner instruction explicitly approved the scoped Reading push: “เสร็จแล้ว push ได้ ไม่ต้องรอยืนยัน”.
- Private local work cache remains untracked; do not stage private workspace files.

## Reading addition completed locally

- Added one Reading catalog record at the top of `data/books.json`:
  - `id`: `grok-bot-interactive-manual`
  - `href`: `grok-bot-interactive-manual.html`
  - cover: `assets/covers/custom/grok-bot-interactive-manual.webp`
  - category: `Grok Bot`
  - published_at: `2026-09-07T18:56:56+07:00`
- Copied the owner-supplied Grok Bot manual into the public root file.
- Browser QA found 60px horizontal overflow on the standalone manual at 390px mobile from the off-canvas sidebar. Applied one minimal technical CSS containment change, adding `overflow-x:hidden` on `html`, without changing manual prose/content or visible cover design.
- Final HTML SHA-256: `9500ea5cbb70cf89108c6f97f5193907fe108eb017c2a386b4bed0bd4257f669`.
- Normalized the owner-supplied PNG cover from 1024×1536 RGB to an EXIF-free 600×900 RGB WebP.
- Cover SHA-256: `87a107f53e1320f0c18feecacccc27a38a19f269ac1bee7de02c0c594d01d1af`.
- Added `templates/grok-bot-interactive-manual-cover.template.md` with public-safe owner-supplied cover provenance.
- Regenerated `index.html`, which now renders 33 Reading books.
- Added focused regression coverage in `tests/test_grok_bot_interactive_manual_reading.py` and updated brittle newest-position/count tests.
- Added the new guide to `docs/wiki/index.md` and appended durable context to `docs/wiki/log.md`.

## Verification completed

- RED test before implementation:
  - `python -m unittest tests.test_grok_bot_interactive_manual_reading -v` failed because the catalog record, HTML, and cover were absent.
- Focused GREEN:
  - `python -m unittest tests.test_grok_bot_interactive_manual_reading tests.test_catalog -v` → OK, 21 tests.
- Full local gates:
  - `python -m unittest discover -s tests -v` → OK, 129 tests.
  - `python scripts/build_catalog.py --check` → current, 33 books.
  - `python scripts/build_audio_library.py --check` → current, 56 audio books.
  - `python scripts/build_app_library.py --check` → current, 7 apps.
  - `python scripts/build_gallery.py --check` → current, 8 artworks.
  - `git diff --check` → OK.
- Pre-share scan over intended public/test/docs files passed; no real local paths, cache IDs, token patterns, or cover EXIF found.
- Local Playwright desktop/mobile verification via HTTP server:
  - Reading shelf rendered 33 cards; first card title `ใช้ Grok Bot อย่างมืออาชีพ`, href/download `grok-bot-interactive-manual.html`, category `Grok Bot`.
  - First cover loaded at natural 600×900.
  - Standalone manual rendered 33 pages and 33 nav buttons.
  - Language toggle changed `lang` from `en` to `th` and updated the active title.
  - Search for `approval` returned 20 results.
  - Desktop and mobile shelf/manual horizontal overflow were 0 after the containment fix.

## Publication next step

- Stage only the scoped public/docs/test files plus this handoff, commit, push `main` to `origin` and `backup`, then verify remote HEAD equality and production read-back hashes for `index.html`, `grok-bot-interactive-manual.html`, and `assets/covers/custom/grok-bot-interactive-manual.webp`.
- Local HTTP preview server `proc_093ff6b40a6d` should be killed after production verification.
