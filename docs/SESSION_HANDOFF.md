# Library Session Handoff

Updated: 2026-09-07T17:06:04+07:00

## Current state

- Project: The Knowledge Shelf at `https://hermes2545.github.io/`.
- Branch: `main` is ahead of no remotes locally; public production is still the previously published Library state until App push is explicitly approved.
- Public Reading shelf contains 32 books; public Audio shelf contains 56 audio books; local App shelf now contains 7 apps after the HEIC converter import.
- Private local work cache remains untracked; do not stage private workspace files.

## Local App work completed

- Added **HEIC to JPG Batch Converter** from `https://github.com/starlink2569/heic2jpg`.
  - Pinned source commit: `ee777bc671d7e5bb351ca31f4b9e7b7605a74207`.
  - Upstream commit date: `2026-09-07 16:54:49 +0700`.
  - Upstream `index.html` SHA-256: `15a05341a7125bfbc3bc77ea0da446efcdd00e1e840f9db211581033d45c2307`.
  - Stable local launcher: `app/heic2jpg.html`.
  - Runtime directory: `app/heic2jpg/`.
- Imported as `hardened-derivative` because the upstream app had external Google Fonts requests and no per-file size guard.
  - Removed `fonts.googleapis.com` and `fonts.gstatic.com` links from the runtime HTML.
  - Added `MAX_FILE_SIZE_BYTES = 80 * 1024 * 1024` guard with Thai status messages before accepting files.
  - Kept vendor libraries local: `vendor/heic2any.min.js`, `vendor/jszip.min.js`.
  - Excluded `.git`, `test-sample.heic`, `server.cjs`, `package.json`, and `package-lock.json` from the public runtime.
- Added `app/heic2jpg/UPSTREAM.md` noting source provenance, Library hardening changes, dependency metadata, and publication caveat.
- Added catalog record to `data/apps.json`:
  - ID: `heic2jpg`
  - Category: `Utility`
  - Short title: `HEIC→JPG`
  - Published: `2026-09-07T16:54:49+07:00`
  - Sticker: `null` text-first utility label
- Regenerated `app-library.html` from `scripts/build_app_library.py`.
- Updated `tests/test_app_library.py` from 6 to 7 apps and added focused heic2jpg regression coverage.
- Updated `docs/wiki/log.md` with durable local-change context.

## Verification completed

- RED check before implementation:
  - `python -m unittest tests.test_app_library.AppLibraryTests.test_catalog_has_seven_unique_apps_with_required_metadata tests.test_app_library.AppLibraryTests.test_catalog_owns_exact_source_provenance_and_public_urls tests.test_app_library.AppLibraryTests.test_heic2jpg_imports_hardened_browser_runtime_with_local_vendor_libraries -v` failed because `heic2jpg` catalog/runtime did not yet exist.
- Focused GREEN:
  - `python scripts/build_app_library.py && python -m unittest tests.test_app_library -v` → OK, 18 tests.
- Full gates:
  - `python -m unittest discover -s tests -v` → OK, 126 tests.
  - `python scripts/build_catalog.py --check` → current, 32 books.
  - `python scripts/build_audio_library.py --check` → current, 56 audio books.
  - `python scripts/build_app_library.py --check` → current, 7 apps.
  - `python scripts/build_gallery.py --check` → current, 8 artworks.
  - `git diff --check` → OK.
- Local HTTP asset checks returned 200 for:
  - `app-library.html`
  - `app/heic2jpg.html`
  - `app/heic2jpg/index.html`
  - `app/heic2jpg/app.js`
  - both vendor JS files.
- Local Playwright preview/smoke at 1365×900 and 390×844:
  - App Shelf rendered 7 cards; first card ID `heic2jpg`.
  - 7 App HTML download controls present.
  - Searching `HEIC` left only the `heic2jpg` card visible.
  - Launcher iframe loaded with no console/page errors.
  - Upstream sample HEIC converted successfully to `test-sample.jpg`.
  - Shelf and runtime horizontal overflow were both 0.
  - Runtime had 0 external font links.
- Pre-share scan notes:
  - No actual private path/cache/token/Drive ID was found in project-authored new files.
  - `app/heic2jpg/vendor/heic2any.min.js` contains Emscripten virtual filesystem home-directory strings; these are browser runtime internals, not local absolute paths.
  - Existing strings such as `pdf-password-remover` and test assertions include the word `password`; they are catalog content/test text, not credentials.

## Publication status / blockers

- Not pushed or committed in this session because the current App request did not explicitly say `push` or `publish`.
- Upstream repository has **no LICENSE file at the pinned commit**. Local implementation is ready, but public push should be treated as requiring explicit owner acceptance of this license scope or upstream license clarification.
- If owner approves publication, run pre-push browser verification/pre-share scan again, stage only the scoped public files, commit, push to `origin` and `backup`, then verify remote HEADs and production App Shelf/runtime.

## Current working tree notes

- Expected public working-tree changes:
  - `M app-library.html`
  - `M data/apps.json`
  - `M docs/SESSION_HANDOFF.md`
  - `M docs/wiki/log.md`
  - `M tests/test_app_library.py`
  - `?? app/heic2jpg.html`
  - `?? app/heic2jpg/`
- Private/untracked working-cache files remain local, including temporary Playwright install/script; do not stage them.
- Local HTTP preview server `proc_2ddea90cf76e` was killed after verification.
