---
title: Site Architecture Overview
type: architecture
status: active
visibility: public
created: 2026-08-23
updated: 2026-08-23
sources: [data/books.json, data/audio-books.json, scripts/build_catalog.py, scripts/build_audio_library.py]
tags: [library, architecture, static-site]
---

# Site Architecture Overview

The Knowledge Shelf is a static GitHub Pages site with two generated collections.

## Reading

`data/books.json` → `scripts/build_catalog.py` + reading template → `index.html`.

## Audio

`data/audio-books.json` → `scripts/build_audio_library.py` + audio template → `audio-library.html`.

## Shared presentation

- Shared CSS/JavaScript under `assets/`.
- Responsive JavaScript rebuilds one physical shelf per visual row.
- Covers and metadata are local assets; external content opens in a new tab.

## Publication

The local repository is authoritative. Public GitHub hosts the site; a private Git remote mirrors approved commits. Google Drive stores human-facing project documents, not generated website code.
