# Library Session Handoff

Updated: 2026-10-05T23:58:00+07:00

## Current state

- Project: The Knowledge Shelf at `https://hermes2545.github.io/`.
- Branch: `main`.
- Latest published Reading addition: **ธรรมะกับควอนตัม**.
- Public and private remotes match commit `f39db66285725e9d88c53b8334bb237c0db6525c` for the content push before this documentation follow-up.
- Project-private local workspace remains untracked/private and must not be committed.

## Published Reading addition: ธรรมะกับควอนตัม

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
- Published content in commit `f7e30f9` and a follow-up source-preservation correction `f39db66` so `quantum/index.html` matches the production/source URL bytes.

## Verification completed

- TDD RED: `python -m unittest tests.test_quantum_dhamma_reading -v` failed before implementation because the catalog record, mirrored target, and normalized cover were absent.
- Focused GREEN: `python -m unittest tests.test_quantum_dhamma_reading tests.test_catalog -v` passed after implementation.
- Full local gates passed before publication:
  - `python -m unittest discover -s tests -v` → OK, 169 tests.
  - `python scripts/build_catalog.py --check` → `index.html is current (40 books)`.
  - `python scripts/build_audio_library.py --check` → `audio-library.html is current (60 audio books)`.
  - `python scripts/build_app_library.py --check` → `app-library.html is current (9 apps)`.
  - `python scripts/build_gallery.py --check` → `gallery.html is current (8 artworks)`.
  - `git diff --check` → OK.
- Cover verification: `WEBP`, 600×900, RGB, one frame, no EXIF, no ICC profile, 77,078 bytes.
- Pre-share scan over 195 touched/mirrored files found no concrete local home path, profile path, cache image ID, document ID, GitHub token marker, API key marker, or private-key marker.
- Local Playwright screenshots verified:
  - Reading desktop/mobile showed 40 books with **ธรรมะกับควอนตัม** first and the supplied cover visible.
  - Mirrored Quantum desktop/mobile showed the 9-book shelf and normal layout.
  - Static DOM read-back confirmed first Reading href/download target `quantum/index.html`, cover path, 9 Quantum book cards, and 9 PDF links.
- Publication verification:
  - Public remote, private backup remote, and local HEAD matched `f39db66285725e9d88c53b8334bb237c0db6525c`.
  - GitHub Pages deployment run `37343441452` for the main content push completed successfully.
  - Production HTTP hash read-back matched Local for `index.html`, `quantum/index.html`, `assets/covers/custom/quantum-dhamma-series.webp`, `quantum/assets/js/context.js`, and representative PDF `quantum/pdf/trilaksana-quantum.pdf`.
  - Production DOM read-back confirmed 40 Reading cards, **ธรรมะกับควอนตัม** first, first href `quantum/index.html`, 9 Quantum book cards, and 9 PDF links.

## Remaining / next actions

- Commit and push this documentation follow-up if not already done in the current turn, then verify public/private remote HEAD equality again.
- Keep `.hermes/` untracked and private.
