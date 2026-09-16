# Library Session Handoff

Updated: 2026-09-16T23:25:00+07:00

## Current state

- Project: The Knowledge Shelf at `https://hermes2545.github.io/`.
- Branch: `main`.
- Latest published Reading work: **แก้ภาพดีเลย์กล้อง Xiaomi ด้วย Local RTSP Bridge**.
- Publication state: content commit `1f17b72541a9f2f2f37d307b4233d336d5e7e971` pushed to both public and private remotes and production-verified.

## Reading Shelf update

- Added `xiaomi-legacy-camera-local-rtsp-interactive-manual.html` as a byte-preserved owner-supplied HTML Reading guide.
- HTML SHA-256: `5f561d60ef634b55e0ba7ac87d992186bad6a6b96e283c9c26670526238bd062`.
- Added the catalog record `xiaomi-legacy-camera-local-rtsp` as the first/newest Reading book.
- Shelf title: **ปลุกกล้อง Xiaomi เก่า**.
- Full title: **แก้ภาพดีเลย์กล้อง Xiaomi ด้วย Local RTSP Bridge**.
- Category: **Home Assistant**.
- Cover: `assets/covers/custom/xiaomi-legacy-camera-local-rtsp.webp`.
- Cover processing: owner-supplied 1024×1536 RGB image resized to 600×900 RGB WebP, no crop/padding/recolor/text edits, EXIF/ICC stripped.
- Cover SHA-256: `0b444f1bab3a1c83c17be08a99bbd9593333cb8c009c06ea371de88441c3a52e`.
- Added regression coverage in `tests/test_xiaomi_legacy_camera_local_rtsp_reading.py` and shifted older fixed-position Reading tests by one slot.

## Verification completed

- TDD RED: focused Xiaomi Reading test failed before the catalog/HTML/cover existed.
- Focused Xiaomi test after implementation: `python -m unittest tests.test_xiaomi_legacy_camera_local_rtsp_reading -v` → OK, 3 tests.
- Full suite before commit: `python -m unittest discover -s tests -v` → OK, 148 tests.
- Generated-page checks before commit: Reading current at 37 books, Audio current at 60 audio books, App current at 9 apps, Gallery current at 8 artworks.
- `git diff --check` → OK.
- Public-safety scan over intended public files → OK; no concrete private paths, cache IDs, token patterns, or image metadata leaks.
- Local Playwright checks at 1365×900 and 390×844 → OK: 37 Reading cards, Xiaomi card first, 600×900 cover loaded, Home Assistant plaque filter works, manual has 22 nav items / 22 content sections, and shelf/manual horizontal overflow is zero.
- Remote HEAD verification: local `main`, `origin/main`, and `backup/main` matched `1f17b72541a9f2f2f37d307b4233d336d5e7e971`.
- Production HTTP read-back hash-matched Local for `index.html`, the Xiaomi manual, and the cover.
- Production Playwright desktop/mobile checks confirmed 37 Reading cards, Xiaomi first/newest, working Home Assistant filter, 22-section manual, 600×900 cover, zero overflow, and no console/page errors.
- GitHub CLI Actions metadata was unavailable because `gh` was not authenticated; deployment verification used remote HEAD equality plus production hash/DOM read-back.

## Follow-up / local state

- Documentation log/handoff were updated after publication; commit/push of this documentation follow-up may be the only remaining local change if not already completed.
- Private `.hermes/` preview/test workspace remains untracked and must not be committed.
- No long-running preview server is required.
