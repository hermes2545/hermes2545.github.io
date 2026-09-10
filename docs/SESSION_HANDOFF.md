# Library Session Handoff

Updated: 2026-09-10T22:22:57+07:00

## Current state

- Project: The Knowledge Shelf at `https://hermes2545.github.io/`.
- Branch: `main`; latest published commit remains `f433e2af764b59d2da219e3b1fc758a84190c107` before the current local Reading cover-peek corrections.
- Latest local prepared work: Reading Shelf cover-peek restored to the owner-supplied `message.txt` CSS 3D contract, then squared after owner feedback that the effect works but book corners should not be rounded.
- Prepared v8 removes the `.is-open` JavaScript hover fallback entirely and returns the effect to CSS-only hover/focus behavior.
- Prepared v8 contract: stable `.book-cover-wrap` hover area, separate `.book-cover-volume::before` stationary paper block, only `.book-cover` rotates from the left spine by `rotateY(-24deg)`, `perspective: 1100px`, `1.05s cubic-bezier(.42, 0, .2, 1)` timing, square/no-radius book corners (`border-radius: 0` on visible cover, paper block, and cover-link focus outline), keyboard focus, and `prefers-reduced-motion` suppression.
- Reading template/generated index cache-bust both `reading-library.css` and `library.js` with `v=reading-cover-hover-v8` so browsers drop the broken v5/v6/v7 assets.

## Verification completed this session

- TDD RED confirmed the regression failed while the code still contained `-42deg`/`.is-open`/document mouse fallback residue.
- Focused tests passed after restoring the message.txt CSS contract and removing JS fallback residue.
- Latest focused TDD check passed after square-corner update:
  - `python -m unittest tests.test_build_catalog.HomepageBuildTests.test_reading_book_cover_uses_stable_css_3d_front_cover_peek tests.test_build_catalog.HomepageBuildTests.test_coffee_theme_is_loaded_only_by_the_reading_collection -v` → OK.
- Full local gates passed after v8 square-corner update:
  - `python -m unittest discover -s tests -v` → OK, 136 tests.
  - `python scripts/build_catalog.py --check` → current, 34 books.
  - `python scripts/build_audio_library.py --check` → current, 58 audio books.
  - `python scripts/build_app_library.py --check` → current, 9 apps.
  - `python scripts/build_gallery.py --check` → current, 8 artworks.
  - `git diff --check` → OK.
- Local browser verification passed on desktop and mobile:
  - 34 Reading cards and first card `งานของผม`.
  - CSS hover on `.book-cover-wrap` opens to `matrix3d(0.913545...)`, matching `rotateY(-24deg)`.
  - no `.is-open` residue in the generated page/script.
  - `cardTransform: none`.
  - cover, paper block, and cover-link focus radii verify as `0px`.
  - paper block pseudo-element `z-index: -1`.
  - transition includes `1.05s`.
  - direct `perspective: 1100px`.
  - zero horizontal overflow and no console/page errors.
- Pre-share scan of intended public files found no private paths, cache IDs, token/private-key patterns, or other credential-like bytes.

## Private artifacts

- Local preview screenshots remain private/untracked and must not be staged.
- Local private project workspace/cache remains untracked and must not be staged.

## Remaining local state

- Current v8 square-corner correction is local only and not pushed yet; publication requires an explicit current-turn `push` instruction.
- Temporary local HTTP server used for preview should be killed before final reporting.
- Private workspace/cache directory remains untracked and must stay unstaged.
