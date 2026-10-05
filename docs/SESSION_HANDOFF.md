# Library Session Handoff

Updated: 2026-10-05T23:30:45+07:00

## Current state

- Project: The Knowledge Shelf at `https://hermes2545.github.io/`.
- Branch: `main`.
- Current local prepared Reading addition: **ธรรมะกับควอนตัม**.
- Public push/publish has **not** been explicitly approved in the current turn; changes are local only and uncommitted.
- Project-private local workspace remains untracked/private and must not be committed.

## Reading addition: ธรรมะกับควอนตัม

- Added `quantum/index.html` as the Reading shelf target for the interactive Quantum/Dhamma microsite mirrored from `https://hermes2545.github.io/quantum/`.
- Mirrored the supporting `quantum/` microsite assets locally: 186 files total, including 9 PDF source books and the interactive pages/assets needed by the shelf.
- Added `quantum-dhamma-series` to `data/books.json` as the newest Reading entry:
  - title/short title: `ธรรมะกับควอนตัม`
  - category: `Dhamma & Quantum`
  - href: `quantum/index.html`
  - cover: `assets/covers/custom/quantum-dhamma-series.webp`
  - timestamp: `2026-10-05T23:30:45+07:00`
- Normalized the owner-supplied cover only for the shelf: EXIF-free 600×900 RGB WebP, SHA-256 `4b22397e4112078f68eeb219f0f53e7efcbdf9999f76916b8ba06f49e7e9cb89`.
- Added cover provenance note at `templates/quantum-dhamma-series-cover.template.md` using public-safe wording.
- Regenerated `index.html`; the Reading shelf now renders 40 books with **ธรรมะกับควอนตัม** first.

## Files changed locally

- `assets/covers/custom/quantum-dhamma-series.webp`
- `data/books.json`
- `docs/SESSION_HANDOFF.md`
- `docs/wiki/index.md`
- `docs/wiki/log.md`
- `index.html`
- `quantum/` (mirrored microsite files)
- `templates/quantum-dhamma-series-cover.template.md`
- `tests/test_catalog.py`
- `tests/test_quantum_dhamma_reading.py`
- Older Reading fixed-position tests shifted by one newest item:
  - `tests/test_web_anatomy_dictionary_reading.py`
  - `tests/test_hermes_bot_cheat_code_reading.py`
  - `tests/test_xiaomi_legacy_camera_local_rtsp_reading.py`
  - `tests/test_what_i_do_reading.py`
  - `tests/test_grok_bot_interactive_manual_reading.py`
  - `tests/test_hermes_bot_mode_reading.py`
  - `tests/test_podcast_visual_storyboard_ai_prompting_reading.py`
  - `tests/test_human_ai_communication_framework_reading.py`
  - `tests/test_grokrouter_reading.py`

## Verification completed

- TDD RED: `python -m unittest tests.test_quantum_dhamma_reading -v` failed before implementation because the catalog record, mirrored target, and normalized cover were absent.
- Focused GREEN: `python -m unittest tests.test_quantum_dhamma_reading tests.test_catalog -v` passed after implementation.
- Full local gates passed:
  - `python -m unittest discover -s tests -v` → OK, 169 tests.
  - `python scripts/build_catalog.py --check` → `index.html is current (40 books)`.
  - `python scripts/build_audio_library.py --check` → `audio-library.html is current (60 audio books)`.
  - `python scripts/build_app_library.py --check` → `app-library.html is current (9 apps)`.
  - `python scripts/build_gallery.py --check` → `gallery.html is current (8 artworks)`.
  - `git diff --check` → OK.
- Cover verification: `WEBP`, 600×900, RGB, one frame, no EXIF, no ICC profile, 77,078 bytes.
- Pre-share scan over 195 touched/mirrored files found no concrete local home path, profile path, cache image ID, document ID, GitHub token marker, API key marker, or private-key marker.
- Local Playwright screenshots verified:
  - Reading desktop/mobile show 40 books with **ธรรมะกับควอนตัม** first and the supplied cover visible.
  - Mirrored Quantum desktop/mobile show the 9-book shelf and normal layout.
  - Static DOM read-back confirmed first Reading href/download target `quantum/index.html`, cover path, 9 Quantum book cards, and 9 PDF links.

## Remaining / next actions

- Ask the owner for explicit commit/push/publish approval before publishing the Reading addition to public GitHub Pages/private backup.
- After approved push, verify public/private remote HEADs and production HTTP/browser read-back for `index.html`, `quantum/index.html`, the cover, and representative Quantum PDFs/assets.
- Stop the local preview server `proc_29b091cbe00e` if still running before ending the work session.
