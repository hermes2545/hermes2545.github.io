---
title: Add a Reading Book
type: runbook
status: active
visibility: public
created: 2026-08-23
updated: 2026-08-23
sources: [data/books.json, scripts/build_catalog.py, templates/reading-cover-designs.template.html]
tags: [library, reading, html, covers]
---

# Add a Reading Book

1. Preserve the user-supplied HTML unchanged unless edits are explicitly requested.
2. Inspect filename, `<title>`, headings, assets, links, and privacy risks.
3. Choose a stable public path; do not break existing URLs.
4. Design a distinct content-matched cover using the reusable design sources under `templates/`; do not require Facebook artwork.
5. Render and visually verify a 600×900 cover, then save the approved WebP as `assets/covers/custom/<book-id>.webp`.
6. Add one record to `data/books.json` with unique ID, title, href, cover, category, summary, accent, and ISO `published_at`.
7. Run the catalog tests first, regenerate `index.html`, then run the full suite.
8. Preview desktop/mobile shelves, verify the category appears as a metal plaque aligned to the book, click the plaque to filter and click it again to restore all books, then verify the new link opens in a new tab.
9. Run a pre-share scan.
10. Request approval before public push unless the current instruction already says to push/publish.
