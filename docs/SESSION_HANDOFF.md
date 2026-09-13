# Library Session Handoff

Updated: 2026-09-13T17:39:00+07:00

## Current state

- Project: The Knowledge Shelf at `https://hermes2545.github.io/`.
- Branch: `main`.
- Latest functional Reading hover commit: `adc2ec21e013af41271c845b002924e36670978f` (`Fix reading shelf hover on hybrid mouse devices`).
- v12 is published and verified live on Production.

## Why v12 was needed

- The owner reported that even after v11, mouse hover on the book cover still did not open the cover.
- Production diagnosis on v11 showed:
  - Default desktop browser: `hover=true`, `anyHover=true`, hover opened to `matrix3d(0.913545...)`.
  - Touch/hybrid-emulated browser: `hover=false`, `anyHover=false`; the card/link/wrap still matched `:hover`, but the CSS-only `@media (hover: hover)` gate did not apply, so the cover stayed at identity transform.
- v12 fixes this without changing the owner’s `CSS_3D.txt` angle/timing/layer contract.

## v12 behavior now published

Changed files in `adc2ec2`:

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

## Verification completed

Pre-push gates:

- `python -m unittest discover -s tests -v` → OK, 140 tests.
- `python scripts/build_catalog.py --check` → current, 35 books.
- `python scripts/build_audio_library.py --check` → current, 58 audio books.
- `python scripts/build_app_library.py --check` → current, 9 apps.
- `python scripts/build_gallery.py --check` → current, 8 artworks.
- `git diff --check` → OK.
- Pre-share scan over changed public/test/doc files → no findings.

Push verification:

- Public origin and private backup both updated to `adc2ec21e013af41271c845b002924e36670978f`.
- Production HTTP hash read-back matched Local for:
  - `index.html` SHA-256 `46b2cec31ec887fe493b427eb58cfe84131da8b976b8d6a1803ffd42d60c2922`
  - `assets/css/reading-library.css` SHA-256 `44b5447c940eea0cf68c416d7aea9a7535e34a5afd36a7a42e9fb6e871a50ce2`
  - `assets/js/library.js` SHA-256 `e2ff94ea3e766353fe9cb965d5063e3964da41376b667872975222848d288931`

Production Playwright QA:

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

## Publication follow-up

- This handoff and `docs/wiki/log.md` were updated after Production verification and should be committed as a small documentation follow-up if not already committed.
- Private Playwright scripts/screenshots remain under `.hermes/` and must not be committed.
- No background HTTP server remains active from v12 QA.
