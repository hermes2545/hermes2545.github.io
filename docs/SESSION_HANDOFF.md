# Library Session Handoff

Updated: 2026-09-22T23:16:00+07:00

## Current state

- Project: The Knowledge Shelf at `https://hermes2545.github.io/`.
- Branch: `main`.
- Latest published Reading work: **Hermes Bot Cheat Code — Practical Guide / Playbook**.
- Publication state: content commit `17d580cd4a64bedc0a385a3dd3a9a790962c655c` pushed to both public and private remotes and production-verified.
- GitHub Pages deployment: run `35751673424` completed successfully.

## Reading Shelf update

- Added `hermes-bot-cheat-code-practical-guide.html` as a byte-preserved owner-supplied HTML Reading guide.
- HTML SHA-256: `2a2aa8ede49d4750e34f6f26c72759bfdf2d589ed5ebb881634895d2f0e373cb`.
- Added the catalog record `hermes-bot-cheat-code-practical-guide` as the first/newest Reading book.
- Shelf title: **Hermes Bot Cheat Code**.
- Full title: **Hermes Bot Cheat Code — Practical Guide / Playbook**.
- Category: **Hermes Guide**.
- Cover: `assets/covers/custom/hermes-bot-cheat-code-practical-guide.webp`.
- Cover processing: owner-supplied 1024×1536 RGB image resized to 600×900 RGB WebP, no crop/padding/recolor/text edits, EXIF/ICC stripped.
- Cover SHA-256: `496d885a8e8bac12ef08d578216f867df25736347cf1d94cc584e8a05215f53f`.
- Added regression coverage in `tests/test_hermes_bot_cheat_code_reading.py` and shifted older fixed-position Reading tests by one slot.

## Verification completed

- TDD RED: focused Hermes Bot Cheat Code Reading test failed before the catalog/HTML/cover existed.
- Focused test after implementation: `python -m unittest tests.test_hermes_bot_cheat_code_reading -v` → OK, 3 tests.
- Full suite before commit: `python -m unittest discover -s tests -v` → OK, 151 tests.
- Generated-page checks before commit: Reading current at 38 books, Audio current at 60 audio books, App current at 9 apps, Gallery current at 8 artworks.
- `git diff --check` → OK.
- Public-safety scan over intended public files → OK; no concrete private paths, cache IDs, token patterns, or image metadata leaks.
- Local Playwright checks at 1365×900 and 390×844 → OK: 38 Reading cards, Hermes Bot Cheat Code first, cover path/600×900 dimensions, manual has 11 sections / 11 nav buttons, and shelf/manual horizontal overflow is zero.
- Remote HEAD verification: local commit, `origin/main`, and `backup/main` matched `17d580cd4a64bedc0a385a3dd3a9a790962c655c`.
- Production HTTP read-back hash-matched Local for `index.html`, the manual, and the cover.
- Production browser/CDP checks confirmed 38 Reading cards, the guide first/newest, download/read href parity, 11-section manual, 600×900 cover delivery, zero desktop/mobile overflow, and no console/page errors observed in the checked pages.

## Follow-up / local state

- Documentation log/index/handoff were updated after publication; commit/push of this documentation follow-up may be the only remaining local change if not already completed.
- Private `.hermes/` project registry copied into the temporary worktree only for local tests; it remains untracked and must not be committed.
- The temporary local preview server `proc_26dc18351c85` should be stopped if still running.
- The primary project working tree still has pre-existing CMS/backend local changes unrelated to this Reading publication.
