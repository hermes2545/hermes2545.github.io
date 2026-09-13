# Library Session Handoff

Updated: 2026-09-13T15:33:00+07:00

## Current state

- Project: The Knowledge Shelf at `https://hermes2545.github.io/`.
- Branch: `main`; latest published content commit is `0ab1b13dc85d00a76edd414ee7b5faf7e7d99e5b`.
- Latest published work: added the Reading entry **One Project. Any AI. — คู่มือใช้ Codex และ Claude ร่วมกัน** and fixed the Reading Shelf front-cover hover trigger/cache-bust to v9.
- A documentation follow-up commit may exist after the content commit if this handoff/log update is committed separately.

## Published Reading book details

- Stable catalog item:
  - ID: `codex-claude-shared-project-folder-manual`
  - HTML href: `codex-claude-shared-project-folder-manual-th-v4-complete.html`
  - Cover path: `assets/covers/custom/codex-claude-shared-project-folder-manual.webp`
  - Category: `AI Collaboration`
  - Published timestamp: `2026-09-13T15:15:48+07:00`
- Owner-supplied HTML:
  - Preserved byte-for-byte.
  - SHA-256: `39bac142899520970330ce1909bf0f0b09e18f9c7fb59ccb3d3f859a98ac04e4`
  - Production QA: title `Shared Project Folder — Codex + Claude Manual`, 22 sections/nav buttons, desktop/mobile zero overflow, no console/page errors.
- Public cover derivative:
  - Format/dimensions: EXIF-free 600×900 RGB WebP
  - SHA-256: `cbed26a1c2af452ee58e9127b57e957c57eb265542729e8747a6645157f7cea6`
  - Normalization: fill scale from 989×1484 to the 600×900 Reading frame with only minimal center crop; no padding, no added border, no stretch, no text/color/design edits.

## Hover/page-flip fix

- Cause found in the pre-existing Reading Shelf CSS: the v8 effect was CSS-only under `@media (hover: hover)` and opened only from `.book-cover-wrap:hover`; on hybrid/touch+mouse environments or when the pointer was over the stable card area rather than the exact wrapper, the cover could appear not to flip.
- Published v9 keeps the owner-approved CSS-only front-cover contract:
  - `rotateY(-24deg)` only on `.book-cover`;
  - `cardTransform: none`;
  - direct parent `perspective: 1100px`;
  - square/no-radius cover and paper block;
  - `prefers-reduced-motion` suppression.
- Published v9 additions:
  - stylesheet/script cache-busts to `reading-cover-hover-v9`;
  - `@media (hover: hover), (any-hover: hover)`;
  - `.reading-page .book-card:hover .book-cover` plus existing `.book-cover-wrap:hover .book-cover`.

## Verification completed this session

- TDD RED confirmed before implementation:
  - New focused tests failed for missing catalog entry, missing HTML, missing cover, missing v9 hover selector/cache-bust, and old 34-book count.
- Full local gates before push:
  - `python -m unittest discover -s tests -v` → OK, 140 tests.
  - `python scripts/build_catalog.py --check` → current, 35 books.
  - `python scripts/build_audio_library.py --check` → current, 58 audio books.
  - `python scripts/build_app_library.py --check` → current, 9 apps.
  - `python scripts/build_gallery.py --check` → current, 8 artworks.
  - `git diff --check` → OK.
  - Pre-share scan over intended public files → no concrete local home path, cache IDs, GitHub token, API key, or private key findings.
- Commit/push:
  - Content commit: `0ab1b13dc85d00a76edd414ee7b5faf7e7d99e5b` (`Add Codex Claude shared project folder reading guide`).
  - Pushed to public `origin/main` and private `backup/main`.
  - Local/public/private remote HEADs matched `0ab1b13dc85d00a76edd414ee7b5faf7e7d99e5b`.
- Production HTTP hash read-back matched Local for:
  - `index.html` → `1e8d2e0c51e1ac438ea450523ccdb6bdad4b51b0b4e889a9d51ec35d77d51696`
  - new manual HTML → `39bac142899520970330ce1909bf0f0b09e18f9c7fb59ccb3d3f859a98ac04e4`
  - new cover WebP → `cbed26a1c2af452ee58e9127b57e957c57eb265542729e8747a6645157f7cea6`
  - `assets/css/reading-library.css` → `4697a6b466e13c129390876466a16117650ba8aac36987bdd21f2da1199e49e9`
  - `assets/js/library.js` → `7cbe8bbe095747109d7481bb3afd62fc83152810a0b9efaf1c6f9270df7ca186`
- Production Playwright checks:
  - Desktop 1365×900 and mobile 390×844.
  - 35 Reading cards.
  - First/newest card: `One Project. Any AI.`
  - CSS/JS loaded with `reading-cover-hover-v9`.
  - Desktop hover opened to `matrix3d(0.913545...)`; `cardTransform: none`; `perspective: 1100px`; cover natural dimensions 600×900.
  - New manual has 22 sections/nav buttons, active initial nav `00ภาพรวมระบบ`, zero horizontal overflow, and no console/page errors.
- GitHub CLI Actions metadata was not used; verification used remote HEAD equality plus production HTTP hash/browser read-back.

## Working tree / private artifacts

- Only private/untracked `.hermes/` workspace should remain after documentation follow-up is committed/pushed.
- Private `.hermes/` includes temporary Playwright QA scripts/screenshots and npm install cache; do not stage it broadly.
- No active background HTTP server remains from this session.
