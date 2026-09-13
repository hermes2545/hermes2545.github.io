# Library Session Handoff

Updated: 2026-09-13T15:15:48+07:00

## Current state

- Project: The Knowledge Shelf at `https://hermes2545.github.io/`.
- Branch: `main`; latest published content commit remains `42f2a610e336bc4833b2de3d3261eb410aa83ad3`.
- Current local work: prepared a new Reading entry **One Project. Any AI. — คู่มือใช้ Codex และ Claude ร่วมกัน** from owner-supplied HTML and cover, plus a Reading Shelf hover fix for the missing front-cover flip.
- Publication state: local-only, not committed and not pushed. Reading publication still requires explicit current-turn push/publish approval.

## New Reading book details

- Stable catalog item:
  - ID: `codex-claude-shared-project-folder-manual`
  - HTML href: `codex-claude-shared-project-folder-manual-th-v4-complete.html`
  - Cover path: `assets/covers/custom/codex-claude-shared-project-folder-manual.webp`
  - Category: `AI Collaboration`
  - Published timestamp used for local addition: `2026-09-13T15:15:48+07:00`
- Owner-supplied HTML:
  - Preserved byte-for-byte.
  - SHA-256: `39bac142899520970330ce1909bf0f0b09e18f9c7fb59ccb3d3f859a98ac04e4`
  - Browser QA: title `Shared Project Folder — Codex + Claude Manual`, 22 sections/nav buttons, desktop/mobile zero overflow, no console/page errors.
- Public cover derivative:
  - Format/dimensions: EXIF-free 600×900 RGB WebP
  - SHA-256: `cbed26a1c2af452ee58e9127b57e957c57eb265542729e8747a6645157f7cea6`
  - Normalization: fill scale from 989×1484 to the 600×900 Reading frame with only minimal center crop; no padding, no added border, no stretch, no text/color/design edits.

## Hover/page-flip diagnosis and local fix

- Cause found in current Reading Shelf CSS: the v8 effect was CSS-only under `@media (hover: hover)` and only opened from `.book-cover-wrap:hover`; on hybrid/touch+mouse environments or when the pointer was over the stable card area rather than the exact wrapper, the cover could appear not to flip.
- Local v9 fix keeps the owner-approved CSS-only front-cover contract:
  - `rotateY(-24deg)` only on `.book-cover`;
  - `cardTransform: none`;
  - direct parent `perspective: 1100px`;
  - square/no-radius cover and paper block;
  - `prefers-reduced-motion` suppression.
- Local v9 additions:
  - stylesheet/script cache-busts to `reading-cover-hover-v9`;
  - `@media (hover: hover), (any-hover: hover)`;
  - `.reading-page .book-card:hover .book-cover` plus existing `.book-cover-wrap:hover .book-cover`.

## Verification completed this session

- TDD RED confirmed before implementation:
  - New focused tests failed for missing catalog entry, missing HTML, missing cover, missing v9 hover selector/cache-bust, and old 34-book count.
- Focused GREEN:
  - `python -m unittest tests.test_codex_claude_shared_project_folder_reading ... tests.test_build_catalog.HomepageBuildTests.test_coffee_theme_is_loaded_only_by_the_reading_collection -v` → OK, 9 tests.
- Full local gates:
  - `python -m unittest discover -s tests -v` → OK, 140 tests.
  - `python scripts/build_catalog.py --check` → current, 35 books.
  - `python scripts/build_audio_library.py --check` → current, 58 audio books.
  - `python scripts/build_app_library.py --check` → current, 9 apps.
  - `python scripts/build_gallery.py --check` → current, 8 artworks.
  - `git diff --check` → OK.
- Local Playwright Reading Shelf QA via private script:
  - Desktop 1365×900 and mobile 390×844.
  - 35 Reading cards.
  - First/newest card: `One Project. Any AI.`
  - CSS/JS loaded with `reading-cover-hover-v9`.
  - Desktop hover opened to `matrix3d(0.913545...)`; `cardTransform: none`; `perspective: 1100px`; cover natural dimensions 600×900.
  - Zero horizontal overflow and no console/page errors.
- Local Playwright manual QA via private script:
  - Desktop 1365×900 and mobile 390×844.
  - 22 sections/nav buttons.
  - Active initial nav: `00ภาพรวมระบบ`.
  - Zero horizontal overflow and no console/page errors.

## Working tree / private artifacts

- Public working tree has uncommitted local changes for the prepared Reading addition, hover fix, tests, log, and handoff.
- Untracked public files expected for the local change:
  - `assets/covers/custom/codex-claude-shared-project-folder-manual.webp`
  - `codex-claude-shared-project-folder-manual-th-v4-complete.html`
  - `tests/test_codex_claude_shared_project_folder_reading.py`
- Private/untracked `.hermes/` workspace remains present and includes temporary Playwright QA scripts/screenshots and npm install cache; do not stage it broadly.
- Background HTTP server used for local QA (`proc_48dbaba727b7`) was stopped after verification.
