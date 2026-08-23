---
title: Add an Audio Book
type: runbook
status: active
visibility: public
created: 2026-08-23
updated: 2026-08-23
sources: [data/audio-books.json, scripts/build_audio_library.py]
tags: [library, audio, youtube]
---

# Add an Audio Book

1. Resolve playlist metadata through an approved non-direct metadata source or user-provided data.
2. Deduplicate by video ID and preserve playlist position for timestamp ties.
3. Cache the authorized thumbnail locally and verify image integrity/metadata.
4. Add one record to `data/audio-books.json` with video ID, title, URL, cover, duration, publish timestamp, position, and uploader.
5. Sort newest-first, regenerate `audio-library.html`, and run the full tests.
6. Preview desktop/mobile shelves, full 4:3 thumbnail, play panel, date, duration, search, and new-tab link.
7. Run a pre-share scan and request approval before public push.
