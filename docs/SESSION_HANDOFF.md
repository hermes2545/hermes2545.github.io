# Library Session Handoff

Updated: 2026-09-07T14:29:47+07:00

## Current state

- Project: The Knowledge Shelf at `https://hermes2545.github.io/`.
- Branch: `main` published to both Library remotes at content commit `956de3d140feb41f57b840a8ba63b14dc3a7d31e`.
- Public Reading shelf now contains 32 books; newest/first entry is **Hermes Bot Mode · Interactive Reference Manual**.
- `.hermes/` remains untracked and private; do not stage it.

## Completed this session

- Added the owner-supplied HTML `hermes-bot-mode-interactive-manual.html` as a byte-preserved Reading guide.
  - HTML SHA-256: `c7724865fe16653fe4156810138693e4e836ece4d45636be38e1f8d50db12258`.
  - Stable public URL: `https://hermes2545.github.io/hermes-bot-mode-interactive-manual.html`.
- Normalized the owner-supplied cover only for Reading shelf delivery:
  - Source image SHA-256: `bd21f0264d1b57277c643dae8f5550dcf10c7a5aca801b89972cdea763b7cc2a`.
  - Public derivative: `assets/covers/custom/hermes-bot-mode-interactive-manual.webp`.
  - Derivative SHA-256: `f996efbc94ebb98b068f45045b9329230716e4c8c65cf28ba12f54705100c9b0`.
  - Format: 600×900 RGB WebP, no EXIF; aspect-preserving containment, no crop/recolor/text edits.
- Catalogued the book in `data/books.json` as:
  - ID: `hermes-bot-mode-interactive-manual`
  - Short title: `Hermes Bot Mode`
  - Category: `Hermes Guide`
  - Published: `2026-09-07T14:29:47+07:00`
- Regenerated `index.html` from `scripts/build_catalog.py`.
- Added regression coverage in `tests/test_hermes_bot_mode_reading.py` and updated reading-count/newest-position tests.
- Pushed the scoped content commit to both `origin` and `backup` after current-turn publication approval.

## Verification completed

- RED check before implementation: `python -m unittest tests.test_hermes_bot_mode_reading -v` failed because the catalog item, HTML, and cover were absent.
- Focused GREEN checks: `python -m unittest tests.test_hermes_bot_mode_reading tests.test_catalog -v` → OK, 21 tests.
- Full gates:
  - `python -m unittest discover -s tests -v` → OK, 125 tests.
  - `python scripts/build_catalog.py --check` → current, 32 books.
  - `python scripts/build_audio_library.py --check` → current, 56 audio books.
  - `python scripts/build_app_library.py --check` → current, 6 apps.
  - `python scripts/build_gallery.py --check` → current, 8 artworks.
  - `git diff --check` → OK.
- Local Playwright preview at 1365×900 and 390×844:
  - Reading shelf rendered 32 cards; first card title/href/download target = Hermes Bot Mode.
  - Cover natural size 600×900 and no horizontal overflow.
  - Manual title matched, with 14 `<h2>`, 23 `<h3>`, 15 sections, and no horizontal overflow.
- Staged pre-share scan over 10 intended public files found no private path/cache-token/API-key patterns.
- Remote verification after push:
  - Local HEAD, public `origin/main`, and private `backup/main` all matched `956de3d140feb41f57b840a8ba63b14dc3a7d31e`.
  - GitHub CLI is installed but unauthenticated, so no Actions run ID was available.
  - Production HTTP read-back returned 200 for `index.html`, the manual HTML, and the WebP cover; all three production hashes matched local.
- Production Playwright verification at 1365×900 and 390×844:
  - Shelf rendered 32 cards with **Hermes Bot Mode** first/newest.
  - New card href and HTML download target both point to `hermes-bot-mode-interactive-manual.html`.
  - Cover loaded at 600×900 natural dimensions.
  - Manual rendered with correct title, section/headings counts, Overview active nav, and zero horizontal overflow.

## Current working tree notes

- After the content publication, only closeout documentation edits should remain pending until the follow-up documentation commit is made.
- Background local preview server may still be running as `proc_44eaaca55dcc`; stop it before final response if no longer needed.
- Keep `.hermes/` untracked/private.
