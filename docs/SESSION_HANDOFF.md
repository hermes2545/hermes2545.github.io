# Library Session Handoff

Updated: 2026-09-10T23:25:11+07:00

## Current state

- Project: The Knowledge Shelf at `https://hermes2545.github.io/`.
- Branch: `main`; latest published content commit is `42f2a610e336bc4833b2de3d3261eb410aa83ad3`.
- Latest published work: replaced the Reading Shelf cover for **Hermes Bot Mode · Interactive Reference Manual** using the owner-supplied PNG attachment.
- Publication verification completed by remote HEAD equality, production HTTP hash read-back, and production Playwright desktop/mobile DOM checks. GitHub CLI Actions metadata remains unavailable because `gh` is not authenticated.

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
- Full local gates before push:
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
- Commit/push:
  - Content commit: `42f2a610e336bc4833b2de3d3261eb410aa83ad3` (`Replace Hermes Bot Mode reading cover`).
  - Pushed to public `origin/main` and private `backup/main`.
  - Local/public/private remote HEADs matched `42f2a610e336bc4833b2de3d3261eb410aa83ad3`.
- Production verification:
  - Cache-busted production `index.html` hash matched Local: `02aac3bd0c17ce1cb56929c34dc8dac13b37068eb59aca940de1d5b3d59d1f5a`.
  - Cache-busted production cover hash matched Local after propagation: `f92982e0a4e9f003a2a4a40b765b3b8a62a0ea22e9411ec7b5d6b5f5a86f0064`.
  - Production Playwright desktop/mobile checks confirmed 34 Reading cards, Hermes Bot Mode card index 2, live cover natural dimensions 600×900, no horizontal overflow, and no console/page errors.

## Working tree / private artifacts

- Documentation was updated after content publication; a small follow-up documentation commit may be needed if this handoff/log update is not yet pushed.
- Untracked private workspace/cache directory remains present; do not stage it broadly.
- Local preview screenshots/scripts were created in the private workspace for QA only and must remain private/untracked unless the owner asks to see them.
- No background HTTP server is running.
