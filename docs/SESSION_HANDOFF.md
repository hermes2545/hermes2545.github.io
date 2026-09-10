# Library Session Handoff

Updated: 2026-09-10T23:11:34+07:00

## Current state

- Project: The Knowledge Shelf at `https://hermes2545.github.io/`.
- Branch: `main`; latest published content commit remains `5f6d761e57fa874c7c1cf9f586650f80023767f1` unless a newer approved push happens after this handoff.
- Latest local work: replaced the Reading Shelf cover for **Hermes Bot Mode · Interactive Reference Manual** using the owner-supplied PNG attachment.
- Public push/publication has **not** been performed for this Reading cover replacement; explicit owner approval is still required.

## Hermes Bot Mode cover replacement details

- Stable catalog item preserved:
  - ID: `hermes-bot-mode-interactive-manual`
  - HTML href: `hermes-bot-mode-interactive-manual.html`
  - Cover path: `assets/covers/custom/hermes-bot-mode-interactive-manual.webp`
- Source cover attachment:
  - Format/dimensions: 1003×1455 RGBA PNG
  - SHA-256: `4a18827d9bc397ad32ea09857f3b6c4bc7d935e5984f7e87416b9d1b753b231b`
- Public cover derivative:
  - Format/dimensions: EXIF-free 600×900 RGB WebP
  - SHA-256: `f92982e0a4e9f003a2a4a40b765b3b8a62a0ea22e9411ec7b5d6b5f5a86f0064`
  - Normalization: fill scale to 620×900, center-crop x=10..610 to 600×900; no padding, no added white border, no stretch, no text/color/design edits.

## Verification completed this session

- TDD RED:
  - `python -m unittest tests.test_hermes_bot_mode_reading -v` failed before template/cover replacement because the new owner-supplied cover SHA was absent from the provenance file.
- Focused GREEN:
  - `python -m unittest tests.test_hermes_bot_mode_reading -v` → OK, 3 tests.
- Full local gates:
  - `python -m unittest discover -s tests -v` → OK, 136 tests.
  - `python scripts/build_catalog.py --check` → current, 34 books.
  - `python scripts/build_audio_library.py --check` → current, 58 audio books.
  - `python scripts/build_app_library.py --check` → current, 9 apps.
  - `python scripts/build_gallery.py --check` → current, 8 artworks.
  - `git diff --check` → OK.
- Pre-share scan of intended public files passed: cover WebP, provenance template, focused test, log, and handoff contain no concrete local home path, image-cache ID, GitHub token, API-key, or private-key byte patterns.
- Local Playwright shelf-card verification via a private QA script passed:
  - desktop 1365×900 and mobile 390×900;
  - 34 Reading cards;
  - Hermes Bot Mode card index 2;
  - cover path `assets/covers/custom/hermes-bot-mode-interactive-manual.webp`;
  - natural image dimensions 600×900;
  - no horizontal overflow;
  - no console/page errors;
  - card transform remains `none`, perspective remains `1100px`.

## Working tree / private artifacts

- Modified public files:
  - `assets/covers/custom/hermes-bot-mode-interactive-manual.webp`
  - `templates/hermes-bot-mode-interactive-manual-cover.template.md`
  - `tests/test_hermes_bot_mode_reading.py`
  - `docs/wiki/log.md`
  - `docs/SESSION_HANDOFF.md`
- Untracked private workspace/cache directory remains present; do not stage it broadly.
- Local preview screenshots/scripts were created in the private workspace for QA only and must remain private/untracked unless the owner asks to see them.
- Temporary local HTTP server should be killed before final close if still running.
