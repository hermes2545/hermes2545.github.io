# Library Session Handoff

Updated: 2026-09-13T21:40:00+07:00

## Current state

- Project: The Knowledge Shelf at `https://hermes2545.github.io/`.
- Branch: `main`.
- Latest functional commit: `b482eae22c72f4ae2e04608d8df47e1616597e6e` (`Fix reading cover hover trigger`).
- Public origin and private backup both matched that SHA after push.
- Reading Shelf hover is now cache-busted to `reading-cover-hover-v13`.

## Why v13 was needed

- The owner reported again that mouse hover still did not visibly open the Reading book cover, after many earlier fixes.
- v12 had preserved `CSS_3D.txt` and added JS `.is-hovering`, but the real owner environment still could fail if hover media gating or JS fallback did not fire reliably.
- v13 removes that fragile dependency by adding a plain Reading-scoped card hover trigger while keeping the exact visual contract.

## v13 behavior

Preserved from `CSS_3D.txt`:

- Cover and paper/page block are separate layers.
- Only `.book-cover` rotates; card/volume stay still.
- `rotateY(-24deg)`.
- `perspective: 1100px`.
- `1.05s cubic-bezier(.42, 0, .2, 1)`.
- Paper block remains stationary at `z-index: -1`.
- Cover remains relative real image layer with `height: auto`.
- Keyboard focus and `prefers-reduced-motion` preserved.
- No click-open, PDF, page-turn, or `.is-open` behavior.

New robust trigger:

- Added `.reading-page .book-card:hover .book-cover` outside the hover media query.
- Kept existing `.book-cover-link:hover`, `.book-cover-wrap:hover`, and `.book-card.is-hovering` fallback.
- Reduced-motion suppression now includes `.book-card:hover .book-cover`.
- Template/index use `reading-cover-hover-v13` for both CSS and JS.

## Verification completed

- TDD RED: focused tests failed before implementation because `.book-card:hover .book-cover` and v13 cache-bust were absent.
- Focused GREEN: `python -m unittest tests.test_build_catalog tests.test_codex_claude_shared_project_folder_reading -v` → OK.
- Full suite: `python -m unittest discover -s tests -v` → OK, 143 tests.
- `python scripts/build_catalog.py --check` → current, 36 books.
- `python scripts/build_audio_library.py --check` → current, 58 audio books.
- `python scripts/build_app_library.py --check` → current, 9 apps.
- `python scripts/build_gallery.py --check` → current, 8 artworks.
- `git diff --check` → OK.
- Pre-share scan over intended public/test files → no findings.

Publication verification:

- Public origin and private backup both matched `b482eae22c72f4ae2e04608d8df47e1616597e6e`.
- Production HTTP hash read-back matched Local for `index.html`, `assets/css/reading-library.css`, and `assets/js/library.js`.
- Production static checks confirmed `reading-cover-hover-v13`, 36 Reading cards, `.book-card:hover`, `.book-card.is-hovering`, `rotateY(-24deg)`, 1.05s timing, and no `rotateY(-42deg)`.

## Follow-up / local state

- This handoff and `docs/wiki/log.md` were updated after Production verification and should be committed/pushed as a small documentation follow-up.
- Browser/CDP automation remains unavailable in this environment, so live verification used hash/read-back/static contract checks.
- `.hermes/` remains untracked private workspace content and must not be committed.
