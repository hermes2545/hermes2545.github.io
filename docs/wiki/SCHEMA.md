---
title: Library Wiki Schema
type: meta
status: active
visibility: public
created: 2026-08-23
updated: 2026-08-23
sources: []
tags: [library, schema, documentation]
---

# Library Wiki Schema

## Required frontmatter

Every synthesized wiki page must contain:

- `title`
- `type`: `architecture | runbook | decision | incident | query | meta`
- `status`: `draft | active | superseded | archived`
- `visibility`: `public | private | confidential`
- `created`: ISO date
- `updated`: ISO date
- `sources`: related files or public URLs
- `tags`: short English slugs

## Rules

1. `docs/wiki/index.md` must link every active synthesized page.
2. Material changes append to `docs/wiki/log.md`; never rewrite history silently.
3. Preserve contradictions and superseded decisions with links.
4. Generated HTML is not a wiki source of truth; edit catalog/template/generator sources.
5. Public pages must contain no secrets, private Drive IDs, signed media URLs, personal account identifiers, or local absolute paths.
6. Private pages mirror to the dedicated Drive folder using `.hermes/document-registry.json`.
7. Confidential pages remain local unless the user explicitly approves a destination.
8. Create a new page only for reusable procedures, stable decisions, architecture, or material incidents.
