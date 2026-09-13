# Library Session Handoff

Updated: 2026-09-13T16:03:00+07:00

## Current state

- Project: The Knowledge Shelf at `https://hermes2545.github.io/`.
- Branch: `main`; latest pushed commit is `83ab9f83833e1bf199a4344e70280730c6441282`.
- Latest published content: **One Project. Any AI. — คู่มือใช้ Codex และ Claude ร่วมกัน** plus the Reading Shelf hover v10 correction.
- Public and private remotes match the local HEAD.
- GitHub Pages retry deployment for `83ab9f8` completed successfully.

## Published v10 Reading Shelf hover correction

Reason:

- The owner reported that the live shelf still did not visibly “เผยอปก”.
- Production v9 was not stale: live HTML loaded `reading-cover-hover-v9`, hover media matched, and Playwright hover produced `matrix3d(0.913545...)` with `cardTransform: none` and `perspective: 1100px`.
- Screenshot inspection showed the v9 `rotateY(-24deg)` shelf-thumbnail effect was technically present but visually too subtle: the cover mostly still looked flat.

Published v10 behavior:

- Promotes the visible cover angle from `rotateY(-24deg)` to `rotateY(-42deg)`.
- Shortens transition timing to `.42s cubic-bezier(.2,.8,.2,1)`.
- Makes `.book-cover` an absolute full front layer with `inset: 0`, `height: 100%`, `object-fit: cover`, `will-change: transform`, `pointer-events: none`.
- Keeps `.book-card` stationary with `transform: none`.
- Keeps `.book-cover-volume` perspective at `1100px` and `transform-style: preserve-3d`.
- Raises the stationary paper layer from `z-index: -1` to `z-index: 0` so the revealed page block is visible behind the rotating cover.
- Adds `.book-cover-link:hover .book-cover` alongside `.book-card:hover` and `.book-cover-wrap:hover`.
- Keeps keyboard focus reveal and reduced-motion suppression.
- Bumps Reading CSS/JS query string to `reading-cover-hover-v10` in the template and regenerated `index.html`.

Commits:

- `6d725746ee4bb44bb5205696567d0b96ffdd1da9` — `Strengthen reading shelf cover hover`.
- `83ab9f83833e1bf199a4344e70280730c6441282` — empty retry commit after the first GitHub Pages deploy step failed; retry succeeded.

## Verification completed

Local before push:

- TDD RED: focused hover tests failed against v9 for missing `rotateY(-42deg)`, `.42s` timing, absolute front layer, `z-index: 0`, and v10 asset URLs.
- `python scripts/build_catalog.py` rebuilt `index.html` with 35 books.
- `python -m unittest discover -s tests -v` → OK, 140 tests.
- `python scripts/build_catalog.py --check` → current, 35 books.
- `python scripts/build_audio_library.py --check` → current, 58 audio books.
- `python scripts/build_app_library.py --check` → current, 9 apps.
- `python scripts/build_gallery.py --check` → current, 8 artworks.
- `git diff --check` → OK.
- Pre-share scan over 7 intended public files → no findings.

Production after push:

- Public/private remotes matched `83ab9f83833e1bf199a4344e70280730c6441282`.
- Pages run `34748685106` for `83ab9f8` completed successfully.
- Production HTTP hash read-back matched Local for:
  - `index.html` → `71962212c308e5c44bd05653e05633be76505c7baebe509f85db4eaa5ee81bad`
  - `assets/css/reading-library.css` → `6c2a00ad824af597b426f1247e860832bc4ac35d50351eacd98c8d2b46d3c2ec`
  - `assets/js/library.js` → `7cbe8bbe095747109d7481bb3afd62fc83152810a0b9efaf1c6f9270df7ca186`
  - `docs/wiki/log.md` → `1535a01c151eac1f5748ed3b52a1a6b56f890d703784c074f213317541649fd0`
- Production Playwright QA:
  - Desktop 1365×900 and mobile 390×844.
  - 35 Reading cards.
  - First title: `One Project. Any AI.`
  - CSS/JS: `reading-cover-hover-v10`.
  - Desktop hover selectors matched: card, wrap, and cover link.
  - Cover transform: `matrix3d(0.743145, 0, 0.669131, ...)`, matching `-42deg`.
  - `cardTransform: none`.
  - `volPerspective: 1100px`.
  - `coverPosition: absolute`, `coverObjectFit: cover`, paper pseudo-element `z-index: 0`.
  - Cover natural size: 600×900.
  - Horizontal overflow: 0.
  - Console/page errors: none.

## Working tree / private artifacts

- Only private/untracked `.hermes/` workspace should remain after this documentation follow-up is committed/pushed.
- Private Playwright scripts and screenshots are under `.hermes/`; do not commit them.
- No active background HTTP server remains from this session.
