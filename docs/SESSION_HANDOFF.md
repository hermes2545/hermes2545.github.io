# Library Session Handoff

Updated: 2026-09-13T17:26:44+07:00

## Current state

- Project: The Knowledge Shelf at `https://hermes2545.github.io/`.
- Branch: `main`.
- Latest pushed commit: `3094aaeffd307571a1c9c171a0daa80b6b02b012` (`Document reading hover v11 publication`).
- A v12 hybrid-mouse hover fix is prepared locally but has not been committed or pushed.

## Why v12 was prepared

- The owner reported that even after v11, mouse hover on the book cover still did not open the cover.
- Production diagnosis on v11 showed:
  - Default desktop browser: `hover=true`, `anyHover=true`, hover opened to `matrix3d(0.913545...)`.
  - Touch/hybrid-emulated browser: `hover=false`, `anyHover=false`; the card/link/wrap still matched `:hover`, but the CSS-only `@media (hover: hover)` gate did not apply, so the cover stayed at identity transform.
- This explains the owner-visible failure without changing the CSS_3D contract: some hybrid/touch-capable browser environments suppress hover media queries even while a real mouse hover is present.

## Prepared v12 behavior

Changed local files:

- `assets/css/reading-library.css`
- `assets/js/library.js`
- `templates/index.template.html`
- `index.html`
- `tests/test_build_catalog.py`
- `tests/test_codex_claude_shared_project_folder_reading.py`
- `docs/wiki/log.md`
- `docs/SESSION_HANDOFF.md`

v12 preserves the owner-supplied `CSS_3D.txt` visual contract:

- `rotateY(-24deg)` only on `.book-cover`.
- `1.05s cubic-bezier(.42, 0, .2, 1)` transition.
- Relative real-image cover layer with `height: auto`.
- Stationary paper block behind the cover at `z-index: -1`.
- `perspective: 1100px` on cover wrappers/volume.
- `cardTransform: none`.
- Keyboard focus and `prefers-reduced-motion` preserved.
- No click-open, PDF, page-turn, or `.is-open` behavior.

v12 adds robust mouse-triggering for hybrid devices:

- CSS media query broadened to `@media (hover: hover), (any-hover: hover)`.
- Reading-only JS function `bindReadingCoverHoverFallback()` toggles `.is-hovering` on the stable `.book-card` using:
  - `pointerenter` for `pointerType === "mouse"`,
  - `mouseenter`,
  - capture-phase `document.addEventListener("mousemove", ...)`,
  - `document.elementFromPoint(...)` fallback.
- Hidden cards clear `.is-hovering` during search/filter updates.
- Reduced-motion CSS includes `.book-card.is-hovering .book-cover` so the fallback does not animate when the user requests reduced motion.
- CSS/JS cache-busted to `reading-cover-hover-v12`.

## Verification completed locally

- TDD RED confirmed v11 failed new hybrid expectations.
- Focused tests passed after implementation.
- Full gates:
  - `python -m unittest discover -s tests -v` → OK, 140 tests.
  - `python scripts/build_catalog.py --check` → current, 35 books.
  - `python scripts/build_audio_library.py --check` → current, 58 audio books.
  - `python scripts/build_app_library.py --check` → current, 9 apps.
  - `python scripts/build_gallery.py --check` → current, 8 artworks.
  - `git diff --check` → OK.
- Pre-share scan over changed public/test/doc files → no findings.
- Local browser QA at `http://127.0.0.1:8768/index.html`:
  - 35 Reading cards.
  - First title: `One Project. Any AI.`
  - CSS/JS: `reading-cover-hover-v12`.
  - Normal desktop: `hover=true`, `anyHover=true`, `.is-hovering=true`, transform `matrix3d(0.913545...)`.
  - Touch/hybrid emulation: `hover=false`, `anyHover=false`, but `.is-hovering=true` and transform still `matrix3d(0.913545...)` from the fallback.
  - Transition remains `1.05s cubic-bezier(0.42, 0, 0.2, 1)`.
  - `cardTransform: none`.
  - `wrapPerspective: 1100px`, `volPerspective: 1100px`.
  - `coverPosition: relative`, paper `z-index: -1`.
  - Reduced-motion transform remains identity.
  - Desktop/mobile overflow: 0.
  - Console/page errors: none.

## Publication status

- v12 is local only and has not been committed or pushed.
- If the owner approves publication, use a scoped commit/push for the eight changed public/test/doc files above; do not stage `.hermes/`.
- Suggested commit message: `Fix reading shelf hover on hybrid mouse devices`.

## Private artifacts / processes

- Private Playwright scripts/screenshots remain under `.hermes/` and must not be committed.
- Local HTTP server `proc_3f94bb9a240b` was used for v12 QA and was stopped after verification.
