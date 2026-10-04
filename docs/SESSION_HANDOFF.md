# Library Session Handoff

Updated: 2026-10-04T17:15:25+07:00

## Current state

- Project: The Knowledge Shelf at `https://hermes2545.github.io/`.
- Branch: `main`.
- Current local prepared App update: **PDF Password Remover — Local Browser Utility** at `app/pdf-password-remover.html`.
- Public push/publish has **not** been explicitly approved in the current turn; changes are local only and uncommitted.
- Project-private local workspace remains untracked/private and must not be committed.

## PDF Password Remover update

- Replaced `app/pdf-password-remover.html` with the owner-supplied updated standalone HTML, preserving the supplied file bytes at SHA-256 `4f2c9aacaa5613eff72eef0025a03b130cd93d19255c2e87ba33812b427874ab`.
- Updated `data/apps.json` `source_sha256` for `pdf-password-remover`; source repository/commit remain `null` and `import_mode` remains `user-supplied-preserved`.
- Added regression coverage for the new hash and safety/runtime markers: password input autocomplete disabled, password passed to qpdf via `--password-file`, save handle selected while the user gesture is still active, and no old inline qpdf password argument.
- `app-library.html` did not need regeneration because the rendered shelf metadata is unchanged; `python scripts/build_app_library.py --check` confirmed it is current.

## Files changed locally

- `app/pdf-password-remover.html`
- `data/apps.json`
- `tests/test_app_library.py`
- `docs/wiki/index.md`
- `docs/wiki/log.md`
- `docs/SESSION_HANDOFF.md`

## Verification completed

- TDD RED: `python -m unittest tests.test_app_library.AppLibraryTests.test_pdf_password_remover_preserves_user_supplied_bytes_and_verified_cdn_pins -v` failed on the old catalog hash before implementation.
- Focused GREEN: same focused test passed after replacing the file and updating the catalog hash.
- Full local gates passed:
  - `python -m unittest discover -s tests -v` → OK, 166 tests.
  - `python scripts/build_catalog.py --check` → `index.html is current (39 books)`.
  - `python scripts/build_audio_library.py --check` → `audio-library.html is current (60 audio books)`.
  - `python scripts/build_app_library.py --check` → `app-library.html is current (9 apps)`.
  - `python scripts/build_gallery.py --check` → `gallery.html is current (8 artworks)`.
  - `git diff --check` → OK.
- Local browser/CDP verification against `http://127.0.0.1:8765/app/pdf-password-remover.html` confirmed:
  - Desktop page title `PDF Password Remover`, Thai H1 `ถอดรหัส PDF แบบไม่อัปโหลดไฟล์`, 3 main cards, zero horizontal overflow, `showSaveFilePicker` available, and password input `autocomplete="off"` present.
  - Mobile 390×844 layout collapsed hero/grid to one column, zero horizontal overflow, and Thai controls rendered.
  - Password-preset UI smoke test added one temporary preset, displayed a masked password, and did not create password/pass localStorage keys.
- Pre-share scan over touched public files found no local cache path, profile path, obvious token/private-key marker, or sample password leak.
- Full encrypted-PDF browser transformation smoke test was not run because this host currently lacks `qpdf`, Playwright, and Python PDF libraries (`pypdf`, `PyPDF2`, `reportlab`).

## Remaining / next actions

- Ask the owner for explicit commit/push/publish approval before publishing the App update to public GitHub Pages/private backup.
- After approved push, verify public/private remote HEADs and production HTTP/browser read-back for `app/pdf-password-remover.html` and `data/apps.json`/App shelf state.
- Stop the local preview server `proc_b97e387c79cb` if still running before ending the work session.
