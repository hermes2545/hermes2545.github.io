---
title: Site Architecture Overview
type: architecture
status: active
visibility: public
created: 2026-08-23
updated: 2026-08-25
sources: [data/books.json, data/audio-books.json, data/apps.json, scripts/build_catalog.py, scripts/build_audio_library.py, scripts/build_app_library.py]
tags: [library, architecture, static-site]
---

# Site Architecture Overview

The Knowledge Shelf is a static GitHub Pages site with three generated collections.

## Reading

`data/books.json` → `scripts/build_catalog.py` + reading template → `index.html`.

## Audio

`data/audio-books.json` → `scripts/build_audio_library.py` + audio template → `audio-library.html`.

## App

`data/apps.json` → `scripts/build_app_library.py` + App template → `app-library.html`.

- Stable public app launchers use `app/<app-id>.html`.
- Single-file source apps are preserved byte-for-byte when feasible.
- Multi-file runtimes live under `app/<app-id>/`; a stable wrapper keeps the public launcher URL unchanged.
- App shelf objects are CSS-rendered 3.5-inch diskettes with content-specific labels rather than book covers.

## Shared presentation

- Shared CSS/JavaScript under `assets/`.
- Responsive JavaScript rebuilds one physical shelf per visual row.
- Covers, labels, runtime assets, and metadata are local; collection items open in a new tab.

## Publication

The local repository is authoritative. Public GitHub hosts the site; a private Git remote mirrors approved commits. Google Drive stores human-facing project documents, not generated website code.
