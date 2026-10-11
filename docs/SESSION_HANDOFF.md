# Library Session Handoff

Updated: 2026-10-11T12:50:53+07:00

## Current state

- Project: The Knowledge Shelf at `https://hermes2545.github.io/`.
- Branch: `main`.
- Latest published Reading addition: **48 HOURS — เมื่อระบบล่ม เราจะดูแลกันอย่างไร**.
- Public and private remotes match content commit `cc575f33625af3e8dc24ec4ca319138ab89980bd` before this documentation follow-up.
- Project-private local workspace remains untracked/private and must not be committed.

## Published Reading addition: 48 HOURS

- Added the owner-supplied HTML byte-for-byte at `48-hours-survival-playbook.html`.
- Added `48-hours-survival-playbook` to `data/books.json` as the newest Reading entry:
  - title: `48 HOURS — เมื่อระบบล่ม เราจะดูแลกันอย่างไร`
  - short title: `48 Hours เอาตัวรอด`
  - category: `Emergency Preparedness`
  - href: `48-hours-survival-playbook.html`
  - cover: `assets/covers/custom/48-hours-survival-playbook.webp`
  - timestamp: `2026-10-11T12:50:53+07:00`
- Normalized the owner-supplied cover only for the shelf: exact-ratio resize from 1024×1536 PNG to EXIF-free 600×900 RGB WebP, SHA-256 `38598dfc384d07120138fcfe550ef946630313558dfba634f1be4114aafaf778`.
- Added public-safe cover provenance note at `templates/48-hours-survival-playbook-cover.template.md`.
- Regenerated `index.html`; the Reading shelf now renders 41 books with **48 Hours เอาตัวรอด** first.
- Published content in commit `cc575f33625af3e8dc24ec4ca319138ab89980bd` to both public and private remotes.

## Verification completed

- TDD RED: `python -m unittest tests.test_48_hours_survival_playbook_reading -v` failed before implementation because the catalog record, HTML, and cover were absent.
- Focused GREEN: `python -m unittest tests.test_48_hours_survival_playbook_reading tests.test_catalog tests.test_quantum_dhamma_reading tests.test_web_anatomy_dictionary_reading -v` passed.
- Full local gates passed before publication:
  - `python -m unittest discover -s tests -v` → OK, 172 tests.
  - `python scripts/build_catalog.py --check` → `index.html is current (41 books)`.
  - `python scripts/build_audio_library.py --check` → `audio-library.html is current (60 audio books)`.
  - `python scripts/build_app_library.py --check` → `app-library.html is current (9 apps)`.
  - `python scripts/build_gallery.py --check` → `gallery.html is current (8 artworks)`.
  - `git diff --check` → OK.
- Staged pre-share scan covered 17 files and found no concrete local home path, cache document/image ID, GitHub token marker, API key marker, private-key marker, signed URL marker, EXIF, or ICC metadata leak.
- Local Playwright verification passed on desktop 1365px and mobile 390px:
  - Reading shelf: 41 cards, first card **48 Hours เอาตัวรอด**, cover natural size 600×900, no horizontal overflow, category plaque filter/reset works.
  - Manual: title matched, 9 sections, search present, no horizontal overflow, no console/page errors.
- Publication verification:
  - Public remote, private backup remote, and local HEAD matched `cc575f33625af3e8dc24ec4ca319138ab89980bd`.
  - Production HTTP hash read-back matched Local for `index.html`, `48-hours-survival-playbook.html`, and `assets/covers/custom/48-hours-survival-playbook.webp`.
  - Production DOM/browser read-back confirmed 41 Reading cards with **48 Hours เอาตัวรอด** first, href/download target `48-hours-survival-playbook.html`, live cover 600×900, 9 manual sections, search present, no horizontal overflow, and no console/page errors on desktop/mobile.

## Remaining / next actions

- Commit and push this documentation follow-up if not already done in the current turn, then verify public/private remote HEAD equality again.
- Keep `.hermes/` untracked and private.
