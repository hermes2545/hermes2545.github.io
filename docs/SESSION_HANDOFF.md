# Library Session Handoff

Updated: 2026-09-10T16:50:32+07:00

## Current state

- Project: The Knowledge Shelf at `https://hermes2545.github.io/`.
- Branch: `main`; latest published commit before this handoff update is pending from the current approved Reading Shelf hover-angle hotfix.
- Latest prepared work: Reading Shelf front-cover reveal angle increased from `rotateY(-24deg)` to `rotateY(-42deg)` so the deployed shelf matches the owner-approved standalone hover proof's visible opening strength.
- Existing Reading Shelf hover fallback remains active: CSS opens from stable book/card states including `.book-card:hover`, `.book-card.is-open`, and `.book-cover-link:hover`; JavaScript fallback toggles `.is-open` on pointer/mouse/focus events.
- The hotfix preserves the stationary card (`cardTransform: none`), direct `perspective: 1100px`, keyboard focus reveal, reduced-motion suppression, and the 3px shelf clearance.

## Verification completed this session

- Production diagnosis before the hotfix confirmed the v3 CSS/JS fallback was loaded and hover toggled `.is-open`, but the previous `-24deg` rotation was visually too subtle at shelf size.
- TDD RED confirmed the regression test failed when expecting `rotateY(-42deg)` while CSS still used `-24deg`.
- After changing the Reading CSS angle to `-42deg`, focused tests passed.
- Local browser verification passed on desktop and mobile:
  - 34 Reading cards.
  - first card title `งานของผม`.
  - cover natural size 600×900.
  - hover/fallback produced `matrix3d(0.743145...)`, matching the stronger `-42deg` angle.
  - `cardTransform: none`.
  - zero horizontal overflow and no console/page errors.
- Full local gates passed:
  - `python -m unittest discover -s tests -v` → OK, 136 tests.
  - `python scripts/build_catalog.py --check` → current, 34 books.
  - `python scripts/build_audio_library.py --check` → current, 58 audio books.
  - `python scripts/build_app_library.py --check` → current, 9 apps.
  - `python scripts/build_gallery.py --check` → current, 8 artworks.
  - `git diff --check` → OK.
- Public-safety scan of the intended staged files found no private paths, cache IDs, token/private-key patterns, or other credential-like bytes.

## Private artifacts

- Local preview screenshots remain private/untracked and must not be staged.
- Local private project workspace/cache remains untracked and must not be staged.

## Remaining local state

- Push was explicitly approved in the current turn and should publish only the scoped Reading Shelf hover-angle hotfix plus this log/handoff record.
- Temporary local HTTP server used for preview was killed.
- Private workspace/cache directory remains untracked and must stay unstaged.
