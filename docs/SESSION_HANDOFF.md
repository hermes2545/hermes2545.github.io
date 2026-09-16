# Library Session Handoff

Updated: 2026-09-16T23:07:54+07:00

## Current state

- Project: The Knowledge Shelf at `https://hermes2545.github.io/`.
- Branch: `main`.
- Latest local Reading work: added the owner-supplied **แก้ภาพดีเลย์กล้อง Xiaomi ด้วย Local RTSP Bridge** manual and cover to the Reading shelf.
- Publication state: local verified only; public push/publish remains pending explicit Reading approval.

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
- Full suite: `python -m unittest discover -s tests -v` → OK, 148 tests.
- `python scripts/build_catalog.py --check` → current, 37 books.
- `python scripts/build_audio_library.py --check` → current, 60 audio books.
- `python scripts/build_app_library.py --check` → current, 9 apps.
- `python scripts/build_gallery.py --check` → current, 8 artworks.
- `git diff --check` → OK.
- Public-safety scan over intended public files → OK; no concrete private paths, cache IDs, token patterns, or image metadata leaks.
- Playwright local browser checks at 1365×900 and 390×844 → OK: 37 Reading cards, Xiaomi card first, 600×900 cover loaded, Home Assistant plaque filter works, manual has 22 nav items / 22 content sections, and shelf/manual horizontal overflow is zero.

## Follow-up / local state

- Ready for scoped commit and push when the owner explicitly approves Reading publication.
- Private `.hermes/` preview/test workspace remains untracked and must not be committed.
- Temporary local HTTP preview server may still be running and should be stopped before session close.
