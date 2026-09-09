# Library Session Handoff

Updated: 2026-09-10T01:05:46+07:00

## Current state

- Project: The Knowledge Shelf at `https://hermes2545.github.io/`.
- Branch: `main` is published to both Library remotes. Latest content commit: `4a50a418ada63a54df2c6b848f4773b98a861046` (`Fix reading cover hover perspective`).
- Public Reading Shelf has 34 books; every generated Reading card now uses the CSS 3D front-cover peek effect.
- Local working tree has an unpushed Reading Shelf hover fallback update prepared after the owner confirmed the standalone v2 hover/JS test worked.
- Newest/first item remains **งานของผม** at `WHAT-I-DO-final.html`.
- Private production files and browser/tool caches remain in the local private workspace and must not be staged.

## Reading Shelf CSS 3D cover effect

- Commit `1bb731e6d61aecf8318de8f2aa02b98677877cb0` updates `scripts/build_catalog.py`, `index.html`, `assets/css/reading-library.css`, and `tests/test_build_catalog.py`.
- Generated markup now wraps each real cover image in `book-cover-volume`, with the cover image kept as `book-cover` and `draggable="false"`.
- The paper block is a stationary `book-cover-volume::before` pseudo-element; only the front cover rotates on hover/focus.
- CSS behavior follows the owner-supplied reference: `perspective: 1100px`, `transform-origin: left center`, `rotateY(-24deg)`, `1.05s cubic-bezier(.42, 0, .2, 1)`, scoped selectors under `.reading-page`, keyboard `:focus-visible`, and `prefers-reduced-motion` suppression.
- The old Reading card hover pop/lift is overridden so the card/book object remains stationary and the hover target does not jitter.

## Verification completed

- RED regression test was added first: `test_reading_book_cover_uses_stable_css_3d_front_cover_peek` in `tests/test_build_catalog.py`.
- Full local gates passed:
  - `python -m unittest discover -s tests -v` → OK, 134 tests.
  - `python scripts/build_catalog.py --check` → current, 34 books.
  - `python scripts/build_audio_library.py --check` → current, 57 audio books.
  - `python scripts/build_app_library.py --check` → current, 8 apps.
  - `python scripts/build_gallery.py --check` → current, 8 artworks.
  - `git diff --check` → OK.
- Pre-share scan over the touched public files found no credentials, private absolute paths, cache IDs, or token/private-key markers.
- Local Playwright desktop/mobile checks confirmed 34 Reading cards, 34 `book-cover-volume` layers, 34 cover images, first title **งานของผม**, live cover natural size 600×900, transparent cover wrapper, `1100px` perspective, hover matrix3d front-cover rotation, `cardTransform: none`, reduced-motion `coverTransform: none`, and zero horizontal overflow.
- Pushed `main` to `origin` and `backup`; both remote HEADs matched `1bb731e6d61aecf8318de8f2aa02b98677877cb0`.
- Production HTTP hash read-back matched Local for `index.html` and `assets/css/reading-library.css` on the first cache-busted attempt.
- Production Playwright desktop/mobile checks confirmed the same 34-card/34-volume shape, hover behavior, reduced-motion behavior, and zero horizontal overflow.

## Reading Shelf 3px clearance adjustment

- Commit `d65bd703c044ab939356823f77e2fb7382a40bd6` lowers all Reading Shelf books closer to the shelf after owner review.
- The Reading-specific CSS keeps the cover wrapper at `padding: 16px 16px 0` and sets `.reading-page .book-grid { padding-bottom: .875rem; }`, which measured as a 3px book-to-shelf gap on both desktop and 390px mobile.
- The adjustment does not change the CSS 3D front-cover hinge: real cover images still rotate from the left spine, paper blocks stay behind, cards do not pop upward, and reduced-motion behavior remains intact.
- Verification passed 134 tests, all generated-page checks, `git diff --check`, pre-share scan, local Playwright desktop/mobile geometry, Production hash read-back, and Production Playwright desktop/mobile geometry (`firstGapPx`, `minGapPx`, and `maxGapPx` all 3px).

## Reading Shelf hover visibility fix

- Commit `4a50a418ada63a54df2c6b848f4773b98a861046` fixes the owner-reported issue where mousing over a book did not visibly reveal the front cover.
- Production reproduction confirmed hover was firing, but the perspective context was too far out in the DOM; the fix adds `perspective: 1100px` directly to `.reading-page .book-cover-volume`, the direct parent of `.book-cover`.
- The hover selector now also includes `.reading-page .book-card:hover .book-cover`, so hovering the physical card area triggers the same cover-only reveal as hovering the cover link.
- The fix preserves the owner-approved contract: only the front cover rotates, `cardTransform` remains `none`, the shelf clearance stays at 3px, keyboard focus still opens the cover, and reduced-motion users get no transform.
- Production Playwright verified desktop/mobile: 34 cards, 34 cover volumes, `volumePerspective: 1100px`, hover `coverTransform: matrix3d(...)`, `cardTransform: none`, gap/minGap/maxGap all 3px, reduced-motion transform `none`, and zero horizontal overflow.

## Reading Shelf hover fallback v3 — local, not pushed yet

- Owner tested the standalone v2 HTML proof and reported it works; the real shelf now mirrors that fallback pattern without the test buttons.
- `assets/css/reading-library.css` now removes the hover media-query gate for the cover reveal and also opens from `.reading-page .book-card.is-open .book-cover`.
- `assets/js/library.js` now binds Reading-only `pointerenter`, `mouseenter`, `mousemove`, `pointerleave`, `mouseleave`, `focusin`, and `focusout` events to toggle `.is-open` on `.book-card`; hidden cards clear the state.
- `templates/index.template.html` and regenerated `index.html` now cache-bust both `reading-library.css` and `library.js` with `v=reading-cover-hover-v3` so the owner does not receive stale assets.
- TDD evidence: focused tests were first made to fail for the missing `.is-open` fallback and v3 cache-bust, then passed after the source changes.
- Verification passed locally: `python -m unittest discover -s tests -v` → OK, 134 tests; all four generated-page checks current; `git diff --check` OK; pre-share scan of touched public files clean.
- Local Playwright verified the actual Reading page on desktop and 390px mobile: v3 CSS/JS loaded, `.is-open=true` after hover, cover `matrix3d(...)`, `cardTransform: none`, `perspective: 1100px`, zero horizontal overflow, and no console/page errors.
- Preview screenshots remain private/untracked and must not be staged.

## Recent What I Do publication context

- Owner supplied replacement HTML `WHAT-I-DO-mobile-fixed.html` and a final physical-book-style cover; both replaced the existing **งานของผม** item at the stable public URL/path in commit `d260006ce549e80c6d562bed8e12858502de368a`.
- Current deployed HTML SHA-256: `98d44ad1f69aede0b8015cd343984485461f2b67971338e774e0c02eddef3e0a`.
- Current deployed cover SHA-256: `113629318f32a35fd328b2090388fc0270cf50c54a5fd73470cea3845916d549`; normalized from a 1024×1536 RGBA PNG to a 600×900 RGB WebP with no crop, no padding, and no added border because the supplied art was already 2:3.

## Remaining local state

- Local private workspace/cache files remain untracked and must not be staged.
- No local preview HTTP server should remain running after close.
- Unpushed public/source files currently modified for the v3 hover fallback: `assets/css/reading-library.css`, `assets/js/library.js`, `templates/index.template.html`, `index.html`, `tests/test_build_catalog.py`, plus this log/handoff documentation.
