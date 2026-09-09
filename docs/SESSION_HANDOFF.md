# Library Session Handoff

Updated: 2026-09-09T22:56:57+07:00

## Current state

- Project: The Knowledge Shelf at `https://hermes2545.github.io/`.
- Branch: `main` is published to both Library remotes. Latest content commit: `1bb731e6d61aecf8318de8f2aa02b98677877cb0` (`Add CSS 3D reading cover peek`).
- Public Reading Shelf has 34 books; every generated Reading card now uses the CSS 3D front-cover peek effect.
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

## Recent What I Do publication context

- Owner supplied replacement HTML `WHAT-I-DO-mobile-fixed.html` and a final physical-book-style cover; both replaced the existing **งานของผม** item at the stable public URL/path in commit `d260006ce549e80c6d562bed8e12858502de368a`.
- Current deployed HTML SHA-256: `98d44ad1f69aede0b8015cd343984485461f2b67971338e774e0c02eddef3e0a`.
- Current deployed cover SHA-256: `113629318f32a35fd328b2090388fc0270cf50c54a5fd73470cea3845916d549`; normalized from a 1024×1536 RGBA PNG to a 600×900 RGB WebP with no crop, no padding, and no added border because the supplied art was already 2:3.

## Remaining local state

- Local private workspace/cache files remain untracked and must not be staged.
- No local preview HTTP server should remain running after close.
