# Library Session Handoff

Updated: 2026-09-13T15:47:06+07:00

## Current state

- Project: The Knowledge Shelf at `https://hermes2545.github.io/`.
- Branch: `main`; latest pushed commit is `90c4f34ce9361866e0f5f93692e100d52bd2345b`.
- Latest published content: **One Project. Any AI. — คู่มือใช้ Codex และ Claude ร่วมกัน** at `codex-claude-shared-project-folder-manual-th-v4-complete.html`.
- Current working tree has a prepared but unpushed Reading Shelf hover v10 correction after the owner reported the live shelf still did not visibly “เผยอปก”.

## Why v10 was prepared

- Production v9 was not stale: live HTML loaded `reading-cover-hover-v9`, hover media matched, and Playwright hover produced `matrix3d(0.913545...)` with `cardTransform: none` and `perspective: 1100px`.
- Screenshot inspection showed the v9 `rotateY(-24deg)` shelf-thumbnail effect was technically present but visually too subtle: the cover mostly still looked flat.
- Local v10 makes the effect plainly visible while preserving the Reading-only CSS front-cover model.

## Prepared v10 change

Changed public source files:

- `assets/css/reading-library.css`
- `templates/index.template.html`
- `index.html`
- `tests/test_build_catalog.py`
- `tests/test_codex_claude_shared_project_folder_reading.py`
- `docs/wiki/log.md`
- `docs/SESSION_HANDOFF.md`

Behavioral details:

- Promotes the visible cover angle from `rotateY(-24deg)` to `rotateY(-42deg)`.
- Shortens transition timing to `.42s cubic-bezier(.2,.8,.2,1)`.
- Makes `.book-cover` an absolute full front layer with `inset: 0`, `height: 100%`, `object-fit: cover`, `will-change: transform`, `pointer-events: none`.
- Keeps `.book-card` stationary with `transform: none`.
- Keeps `.book-cover-volume` perspective at `1100px` and `transform-style: preserve-3d`.
- Raises the stationary paper layer from `z-index: -1` to `z-index: 0` so the revealed page block is visible behind the rotating cover.
- Adds `.book-cover-link:hover .book-cover` alongside `.book-card:hover` and `.book-cover-wrap:hover`.
- Keeps keyboard focus reveal and reduced-motion suppression.
- Bumps Reading CSS/JS query string to `reading-cover-hover-v10` in the template and regenerated `index.html`.

## Verification completed locally

- TDD RED:
  - Updated focused hover tests first; they failed against v9 for missing `rotateY(-42deg)`, `.42s` timing, absolute front layer, `z-index: 0`, and v10 asset URLs.
- GREEN:
  - `python scripts/build_catalog.py` rebuilt `index.html` with 35 books.
  - Focused hover tests passed.
- Browser QA on local generated page through `http://127.0.0.1:8766/index.html`:
  - 35 Reading cards.
  - First title: `One Project. Any AI.`
  - CSS/JS: `reading-cover-hover-v10`.
  - Hover/media: `(hover: hover)` true, `(any-hover: hover)` true.
  - Hover selectors matched: card, wrap, and cover link.
  - Cover transform: `matrix3d(0.743145, 0, 0.669131, ...)`, matching `-42deg`.
  - `cardTransform: none`.
  - `volPerspective: 1100px`.
  - `coverPosition: absolute`, `coverObjectFit: cover`, paper pseudo-element `z-index: 0`.
  - Cover natural size: 600×900.
  - Horizontal overflow: 0.
  - Console/page errors: none.
  - Screenshot diff before/after hover: 60.369% pixels changed at threshold >1; screenshot after hover visibly exposes the page block behind the cover.
- Full gates:
  - `python -m unittest discover -s tests -v` → OK, 140 tests.
  - `python scripts/build_catalog.py --check` → current, 35 books.
  - `python scripts/build_audio_library.py --check` → current, 58 audio books.
  - `python scripts/build_app_library.py --check` → current, 9 apps.
  - `python scripts/build_gallery.py --check` → current, 8 artworks.
  - `git diff --check` → OK.

## Publication status

- v10 is local only and has not been committed or pushed.
- Reading collection publication still requires explicit current-turn approval such as `push` / `publish`.
- If approved, stage only the seven public files listed above; do not stage `.hermes/`.

## Private artifacts / processes

- Private Playwright scripts and screenshots are under the untracked `.hermes/` workspace; do not commit them.
- Local HTTP server `proc_c1602cf3c9cf` was used for QA and was stopped after verification.
