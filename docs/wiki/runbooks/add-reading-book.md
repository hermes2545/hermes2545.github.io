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

1. Detect the supplied reading artifact type before cataloging it:
   - HTML: preserve it unchanged unless edits are explicitly requested, and keep the existing direct-open behavior.
   - PDF: preserve it byte-for-byte at a stable direct `.pdf` path, structurally inspect it, and keep that path as the catalog/download source.
2. Inspect filename, title/topic, headings or page count, assets, links, active PDF objects, and privacy risks.
3. Choose a stable public path; do not break existing URLs.
4. Design a distinct content-matched cover using the reusable design sources under `templates/`; do not require Facebook artwork.
5. Render and visually verify a 600×900 cover, then save the approved WebP as `assets/covers/custom/<book-id>.webp`.
6. Add one record to `data/books.json` with unique ID, title, href, cover, category, summary, accent, and ISO `published_at`.
7. Run the catalog tests first, regenerate `index.html`, then run the full suite.
8. Preview desktop/mobile shelves, verify the category appears as a metal plaque aligned to the book, click the plaque to filter and click it again to restore all books, then verify the new link opens in a new tab.
   - For HTML, the title and cover continue opening the supplied HTML directly.
   - For PDF, the title and cover automatically open `flip-viewer.html?id=<catalog-id>`, while the sibling download control downloads the exact original PDF.
   - Exercise PDF page turning, mouse-wheel zoom, bounded left-button drag pan while zoomed, touch layout, fullscreen control, page navigation, and the PDF download target. Verify the viewer uses only validated catalog IDs and locally vendored PDF.js/StPageFlip dependencies.
9. Run a pre-share scan.
10. Request approval before public push unless the current instruction already says to push/publish.
