# Library Session Handoff

Updated: 2026-09-13T17:02:00+07:00

## Current state

- Project: The Knowledge Shelf at `https://hermes2545.github.io/`.
- Branch: `main`.
- Latest functional Reading hover commit: `f89eaf0bd6745c35739711d5b7f1ce393ac87d19` (`Restore reading shelf CSS 3D cover contract`).
- The owner-supplied `CSS_3D.txt` contract has been restored, committed, pushed to public and private remotes, and verified live on Production.

## Why v11 was needed

- The owner supplied `CSS_3D.txt` again and asked why the shelf no longer followed the previous working CSS 3D sample.
- Root cause: process drift from later hotfixes. v9 preserved `-24deg` but broadened triggers; v10 changed the accepted sample to a more visible `-42deg`, faster `.42s` timing, absolute front layer, and paper `z-index: 0`.
- v11 restores the owner’s explicit CSS_3D contract and adds anti-drift regression tests so later visibility experiments do not silently replace it.

## v11 contract now published

Changed public source files in `f89eaf0`:

- `assets/css/reading-library.css`
- `templates/index.template.html`
- `index.html`
- `tests/test_build_catalog.py`
- `tests/test_codex_claude_shared_project_folder_reading.py`
- `docs/wiki/log.md`
- `docs/SESSION_HANDOFF.md`

Behavioral details locked by tests:

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
- Reading template and generated index use `reading-cover-hover-v11` cache-busting.

## Verification completed

Pre-push gates:

- `python -m unittest discover -s tests -v` → OK, 140 tests.
- `python scripts/build_catalog.py --check` → current, 35 books.
- `python scripts/build_audio_library.py --check` → current, 58 audio books.
- `python scripts/build_app_library.py --check` → current, 9 apps.
- `python scripts/build_gallery.py --check` → current, 8 artworks.
- `git diff --check` → OK.
- Pre-share scan over the seven changed public/test/doc files → no findings.

Push verification:

- Public origin and private backup both updated to `f89eaf0bd6745c35739711d5b7f1ce393ac87d19`.
- Production HTTP hash read-back matched Local for:
  - `index.html` SHA-256 `84597e3946424edde04f67614b8032be6a0b10ce2169c4a36baf0b39385f31b6`
  - `assets/css/reading-library.css` SHA-256 `198bd842802c11837718f493e6280f45db80c7db2e8ff4dc5912e8efae19b10d`
  - `assets/js/library.js` SHA-256 `7cbe8bbe095747109d7481bb3afd62fc83152810a0b9efaf1c6f9270df7ca186`

Production Playwright QA:

- 35 Reading cards.
- First title: `One Project. Any AI.`
- CSS/JS: `reading-cover-hover-v11`.
- Hover transform: `matrix3d(0.913545, 0, 0.406737, ...)`, matching `-24deg`.
- Transition: `transform 1.05s cubic-bezier(0.42, 0, 0.2, 1), box-shadow 1.05s cubic-bezier(0.42, 0, 0.2, 1)`.
- `cardTransform: none`.
- `wrapPerspective: 1100px`, `volPerspective: 1100px`.
- `coverPosition: relative`, `coverHeight: 217.5px`.
- Cover radius: `1px 3px 3px 1px`; paper radius: `1px 6px 6px 1px`; paper z-index: `-1`.
- Reduced-motion hover transform: `none`.
- Cover natural size: 600×900.
- Desktop/mobile horizontal overflow: 0.
- Console/page errors: none.

## Publication follow-up

- This handoff and `docs/wiki/log.md` were updated after Production verification and should be committed as a small documentation follow-up if not already committed.
- Private Playwright scripts/screenshots remain under `.hermes/` and must not be committed.
- No background HTTP server remains active from v11 QA.
