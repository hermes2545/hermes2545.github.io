# Library Session Handoff

Updated: 2026-09-07T17:21:38+07:00

## Current state

- Project: The Knowledge Shelf at `https://hermes2545.github.io/`.
- Branch: `main` is published to both Library remotes at `573010d40ddd445afd80b8f18beebf855549c9c8`.
- Public App shelf still contains the previously published HEIC app until this local update is explicitly pushed.
- Local App shelf contains 7 apps, with **HEIC to JPG Batch Converter** updated to upstream commit `05b42790a39316d0232a25650b9940b757de8916`.
- Private local work cache remains untracked; do not stage private workspace files.

## Local App update completed

- Updated **HEIC to JPG Batch Converter** from source repository `https://github.com/starlink2569/heic2jpg`.
  - Previous pinned source commit: `ee777bc671d7e5bb351ca31f4b9e7b7605a74207`.
  - New pinned source commit: `05b42790a39316d0232a25650b9940b757de8916`.
  - New upstream commit date: `2026-09-07 17:07:09 +0700`.
  - New upstream `index.html` SHA-256: `925e0b4a6952c459546f43f8c6fb917ccc1d87c845502646e7dffdca0a6c86c5`.
  - New upstream app icon SHA-256: `46de51a2ecdac7bfa4acdbf9f9de0ea2e9c4b68c36c8ff80df54505cd2b58dda`.
- Imported the upstream interface update:
  - `app/heic2jpg/index.html` now includes the new brand row and `assets/app-icon.png` favicon/icon reference.
  - `app/heic2jpg/styles.css` includes the new `.brand-row` and `.app-icon` styling.
  - `app/heic2jpg/assets/app-icon.png` added unchanged from upstream as a 1254×1254 RGB PNG with no Pillow metadata fields.
- Preserved Library hardening:
  - External Google Fonts links remain removed from runtime HTML.
  - The 80 MB per-file guard remains in `app/heic2jpg/app.js`.
  - Vendored `heic2any` and `JSZip` files remain local and unchanged.
  - Non-runtime source files are still excluded from the public runtime.
- Updated `data/apps.json` provenance/date/summary for the new source commit.
- Regenerated `app-library.html` from `scripts/build_app_library.py`.
- Updated `tests/test_app_library.py` to lock the new commit/hash and app icon runtime files.
- Updated `docs/wiki/log.md` with durable local-update context.

## Verification completed

- RED check before implementation:
  - `python -m unittest tests.test_app_library.AppLibraryTests.test_catalog_owns_exact_source_provenance_and_public_urls tests.test_app_library.AppLibraryTests.test_heic2jpg_imports_hardened_browser_runtime_with_local_vendor_libraries -v` failed because local catalog/runtime still pointed to previous commit/hash.
- Focused GREEN:
  - `python scripts/build_app_library.py && python -m unittest tests.test_app_library -v` → OK, 18 tests.
- Full local gates:
  - `python -m unittest discover -s tests -v` → OK, 126 tests.
  - `python scripts/build_catalog.py --check` → current, 32 books.
  - `python scripts/build_audio_library.py --check` → current, 56 audio books.
  - `python scripts/build_app_library.py --check` → current, 7 apps.
  - `python scripts/build_gallery.py --check` → current, 8 artworks.
  - `git diff --check` → OK.
- Image inspection:
  - `app/heic2jpg/assets/app-icon.png`: PNG, RGB, 1254×1254, 1,608,005 bytes, no Pillow metadata fields.
- Local pre-share scan over intended files passed.
  - `app/heic2jpg/vendor/heic2any.min.js` contains Emscripten virtual filesystem home-directory strings; these are browser runtime internals, not local absolute paths.
- Local Playwright preview/smoke at 1365×900 and 390×844:
  - App Shelf rendered 7 cards; first card ID `heic2jpg` and title `HEIC→JPG`.
  - 7 App HTML download controls present.
  - Searching `HEIC` returned exactly `heic2jpg`.
  - Launcher iframe loaded with no console/page errors.
  - New app icon loaded at natural size 1254×1254 and favicon points to `./assets/app-icon.png`.
  - Upstream sample HEIC converted successfully to `test-sample.jpg`.
  - Shelf and runtime horizontal overflow were both 0.
  - Runtime had 0 external font links.

## Publication status

- Not committed or pushed yet. The current user request asked whether Shelfkeeper can update the version; it did not explicitly say `push` or `publish` for this update.
- If the owner says `push`, stage only the scoped files, rerun pre-push gates/pre-share scan if needed, commit, push to `origin` and `backup`, then verify production HTTP hashes and production Playwright smoke.

## Current working tree notes

- Expected local public changes:
  - `M app-library.html`
  - `M app/heic2jpg/UPSTREAM.md`
  - `M app/heic2jpg/index.html`
  - `M app/heic2jpg/styles.css`
  - `M data/apps.json`
  - `M docs/SESSION_HANDOFF.md`
  - `M docs/wiki/log.md`
  - `M tests/test_app_library.py`
  - `?? app/heic2jpg/assets/`
- Private/untracked working-cache files remain local, including temporary Playwright install/script; do not stage them.
- Local HTTP preview server was killed after verification.
