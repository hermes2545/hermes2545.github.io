# Library Session Handoff

Updated: 2026-09-10T17:15:00+07:00

## Current state

- Project: The Knowledge Shelf at `https://hermes2545.github.io/`.
- Branch: `main`; latest published commit is `73544795e8b25acb2d34aac2ebcf67656c6c8327` (`Match reading cover hover proof`).
- Latest published work: Reading Shelf hover behavior was adapted to match the owner-supplied `reading-cover-hover-test-v2.html` proof more closely.
- The published v5 shelf keeps the stronger `rotateY(-42deg)` reveal and changes the real shelf toward the proof file's behavior: `.42s cubic-bezier(.2,.8,.2,1)` transition, absolute 100% cover layer, visible page-block/spine layer, CSS hover without a media gate, `.is-open` fallback, and document-level mouse/pointer detector.
- The document-level fallback uses `event.target.closest(".book-card")` plus `elementFromPoint(event.clientX, event.clientY)` and listens with capture to `mousemove`, `pointermove`, `mouseover`, and `pointerover`.
- Reading template/generated index cache-bust both `reading-library.css` and `library.js` with `v=reading-cover-hover-v5`.

## Verification completed this session

- TDD RED confirmed the regression failed before v2-style transition/layer/document-detector markers were implemented.
- Focused tests passed after the v5 CSS/JS/template updates.
- Full local gates passed before push:
  - `python -m unittest discover -s tests -v` → OK, 136 tests.
  - `python scripts/build_catalog.py --check` → current, 34 books.
  - `python scripts/build_audio_library.py --check` → current, 58 audio books.
  - `python scripts/build_app_library.py --check` → current, 9 apps.
  - `python scripts/build_gallery.py --check` → current, 8 artworks.
  - `git diff --check` → OK.
- Pre-share scan of intended public files found no private paths, cache IDs, token/private-key patterns, or other credential-like bytes.
- Publication verification passed after owner-approved push:
  - `git push origin main` and `git push backup main` completed.
  - Public/private remote HEADs both matched `73544795e8b25acb2d34aac2ebcf67656c6c8327`.
  - Production HTTP hash read-back matched Local for `index.html`, `assets/css/reading-library.css`, `assets/js/library.js`, and `docs/wiki/log.md`.
  - Production browser checks confirmed 34 Reading cards with `งานของผม` first, CSS/JS v5 loaded, CSS hover opens the cover to `matrix3d(0.743145...)`, JS fallback via `mousemove` opens the same way, `cardTransform: none`, direct `perspective: 1100px`, cover layer `position: absolute`, `.42s` transition, no console/page errors, and zero overflow on desktop/mobile.

## Private artifacts

- Local preview screenshots remain private/untracked and must not be staged.
- Local private project workspace/cache remains untracked and must not be staged.

## Remaining local state

- Only this post-publication documentation follow-up may remain until committed/pushed.
- Temporary local HTTP server used for preview was killed.
- Private workspace/cache directory remains untracked and must stay unstaged.
