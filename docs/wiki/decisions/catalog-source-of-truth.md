---
title: Catalog Source of Truth
type: decision
status: active
visibility: public
created: 2026-08-23
updated: 2026-08-23
sources: [data/books.json, data/audio-books.json]
tags: [library, catalog, json]
---

# Catalog Source of Truth

## Decision

`data/books.json` is the sole reading inventory and `data/audio-books.json` is the sole audio inventory.

Do not duplicate these facts into YAML, wiki tables, or Drive spreadsheets.

## Rules

- Stable unique IDs and URLs.
- `published_at` controls newest-first order.
- Cover paths must resolve locally.
- Generated HTML must match generator output.
- Wiki pages explain policy and link to catalogs rather than copying rows.
