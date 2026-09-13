# Library Session Handoff

Updated: 2026-09-13T16:48:25+07:00

## Current state

- Project: The Knowledge Shelf at `https://hermes2545.github.io/`.
- Branch: `main`; latest pushed commit is `f72cb3f4b68b0d26d40c7d5e2a90a0423a9031c6`.
- Latest published content: **One Project. Any AI. — คู่มือใช้ Codex และ Claude ร่วมกัน** plus the Reading Shelf hover v10 correction.
- Current working tree has a prepared but unpushed v11 correction that restores the owner-supplied `CSS_3D.txt` contract.

## Why v11 was prepared

- The owner supplied `CSS_3D.txt` again and asked why the shelf no longer followed the previous working CSS 3D sample.
- Root cause: process drift from later hotfixes. v9 preserved `-24deg` but broadened triggers; v10 changed the accepted sample to a more visible `-42deg`, faster `.42s` timing, absolute front layer, and paper `z-index: 0`.
- The owner’s current instruction makes the supplied CSS_3D sample the active behavioral contract again.

## Prepared v11 contract

Changed public source files:

- `assets/css/reading-library.css`
- `templates/index.template.html`
- `index.html`
- `tests/test_build_catalog.py`
- `tests/test_codex_claude_shared_project_folder_reading.py`
- `docs/wiki/log.md`
- `docs/SESSION_HANDOFF.md`

Behavioral details now locked by tests:

- The cover image and paper/page block are separate layers.
- Stable hover target stays still; the card/book volume does not rotate or translate.
- Only `.book-cover` rotates from the left spine.
- Hover/focus angle is `rotateY(-24deg)`.
- Perspective is `1100px` on the Reading book wrappers.
- Transition is exactly `1.05s cubic-bezier(.42, 0, .2, 1)` for transform and shadow.
- Stationary paper block uses layered page-edge gradient, subtle shadow, `inset: 2px -7px 0 3px`, and `z-index: -1`.
- Cover is a relative real-image layer with `height: auto`, not the v10 absolute full front layer.
- Sample corner radii from CSS_3D are restored: paper `1px 6px 6px 1px`, cover `1px 3px 3px 1px`, focus outline `4px`.
- CSS hover is under `@media (hover: hover)` and Reading-scoped selectors only.
- Keyboard focus reveal and `prefers-reduced-motion` suppression are preserved.
- No `.is-open` JS fallback, click-open/PDF/page-turn system, or broad image selector change was added.
- Reading template and generated index now use `reading-cover-hover-v11` cache-busting.

## Verification completed locally

- TDD RED:
  - Updated focused hover tests first; they failed against published v10 for missing `rotateY(-24deg)`, `1.05s cubic-bezier(.42, 0, .2, 1)`, paper `z-index: -1`, relative cover layer, CSS_3D radii, and v11 asset URLs.
- GREEN:
  - `python scripts/build_catalog.py` rebuilt `index.html` with 35 books.
  - Focused hover tests passed.
- Full gates:
  - `python -m unittest discover -s tests -v` → OK, 140 tests.
  - `python scripts/build_catalog.py --check` → current, 35 books.
  - `python scripts/build_audio_library.py --check` → current, 58 audio books.
  - `python scripts/build_app_library.py --check` → current, 9 apps.
  - `python scripts/build_gallery.py --check` → current, 8 artworks.
  - `git diff --check` → OK.
- Local browser QA on actual generated page at `http://127.0.0.1:8767/index.html`:
  - 35 Reading cards.
  - First title: `One Project. Any AI.`
  - CSS/JS: `reading-cover-hover-v11`.
  - Hover/media: `(hover: hover)` true and link/wrap hover matched.
  - Cover transform: `matrix3d(0.913545, 0, 0.406737, ...)`, matching `-24deg`.
  - Transition: `transform 1.05s cubic-bezier(0.42, 0, 0.2, 1), box-shadow 1.05s cubic-bezier(0.42, 0, 0.2, 1)`.
  - `cardTransform: none`.
  - `wrapPerspective: 1100px`, `volPerspective: 1100px`.
  - `coverPosition: relative`, `coverHeight: 217.5px`.
  - Cover radius: `1px 3px 3px 1px`; paper radius: `1px 6px 6px 1px`; paper z-index: `-1`.
  - Reduced-motion hover transform: `none`.
  - Cover natural size: 600×900.
  - Desktop/mobile horizontal overflow: 0.
  - Console/page errors: none.

## Publication status

- v11 is local only and has not been committed or pushed.
- Reading collection publication requires explicit current-turn approval such as `push v11` / `publish`.
- If approved, stage only the seven public files listed above; do not stage `.hermes/`.

## Private artifacts / processes

- Private Playwright scripts and screenshots are under the untracked `.hermes/` workspace; do not commit them.
- Local HTTP server `proc_fddedb5db203` was used for QA and was stopped after verification.
