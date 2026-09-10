# Library Session Handoff

Updated: 2026-09-10T17:04:17+07:00

## Current state

- Project: The Knowledge Shelf at `https://hermes2545.github.io/`.
- Branch: `main`; latest published commit before the v5 push was `d639ef73479af6f263c4887160e62c49beea4c5c`; the current turn explicitly approves publishing the v5 hover adaptation.
- Latest approved work: Reading Shelf hover behavior was adapted to match the owner-supplied `reading-cover-hover-test-v2.html` proof more closely.
- The prepared v5 shelf keeps the stronger `rotateY(-42deg)` reveal and changes the real shelf toward the proof file's behavior: `.42s cubic-bezier(.2,.8,.2,1)` transition, absolute 100% cover layer, visible page-block/spine layer, CSS hover without a media gate, `.is-open` fallback, and document-level mouse/pointer detector.
- The document-level fallback uses `event.target.closest(".book-card")` plus `elementFromPoint(event.clientX, event.clientY)` and listens with capture to `mousemove`, `pointermove`, `mouseover`, and `pointerover`.
- Reading template/generated index now cache-bust both `reading-library.css` and `library.js` with `v=reading-cover-hover-v5`.

## Verification completed this session

- TDD RED confirmed the regression failed before v2-style transition/layer/document-detector markers were implemented.
- Focused tests passed after the v5 CSS/JS/template updates.
- Local browser verification passed:
  - CSS hover opens the first Reading card to `matrix3d(0.743145...)`.
  - JS fallback via dispatched `mousemove` on `.book-card` opens the same card to `matrix3d(0.743145...)`.
  - `cardTransform: none`.
  - direct `perspective: 1100px`.
  - CSS/JS v5 URLs loaded.
  - zero horizontal overflow and no console/page errors.
- Full local gates passed:
  - `python -m unittest discover -s tests -v` → OK, 136 tests.
  - `python scripts/build_catalog.py --check` → current, 34 books.
  - `python scripts/build_audio_library.py --check` → current, 58 audio books.
  - `python scripts/build_app_library.py --check` → current, 9 apps.
  - `python scripts/build_gallery.py --check` → current, 8 artworks.
  - `git diff --check` → OK.
- Pre-share scan of intended public files found no private paths, cache IDs, token/private-key patterns, or other credential-like bytes.

## Private artifacts

- Local preview screenshots remain private/untracked and must not be staged.
- Local private project workspace/cache remains untracked and must not be staged.

## Remaining local state

- Current v5 hover adaptation has explicit push approval in this turn; publish the scoped files, then verify remote HEADs and production read-back.
- Temporary local HTTP server used for preview should be killed before final reporting.
- Private workspace/cache directory remains untracked and must stay unstaged.
