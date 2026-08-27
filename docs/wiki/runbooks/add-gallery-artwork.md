---
title: Add Gallery Artwork
type: runbook
status: active
visibility: public
created: 2026-08-26
updated: 2026-08-26
sources: [data/gallery.json, scripts/build_gallery.py, templates/gallery.template.html]
tags: [library, gallery, artwork]
---

# Add Gallery Artwork

## Interpretation rule

When the project owner says **“เอารูปเข้าแกลเลอรี”**, treat it as an instruction to add the supplied image to the Gallery catalog and generated page. Inspect the image only to derive safe catalog metadata and verify quality; do not answer with an image description instead of performing the catalog operation. If no publication date is supplied, use the date the artwork is added locally and report that assumption.

1. Confirm the image is approved for public use and record public-safe attribution without local paths.
2. Write a focused failing test for the stable ID, exact minimal catalog fields, local image path, dimensions, mode, and metadata.
3. Place an EXIF-free local image under `assets/gallery/artworks/`; do not hotlink remote assets or copy private design sources.
4. Add one record to `data/gallery.json` with exactly `id`, `title`, `category`, `format`, `published_at`, `image`, `alt`, and `featured_order`.
5. Run `python scripts/build_gallery.py`; do not hand-edit `gallery.html`.
6. Run the focused Gallery tests, full suite, all four generator drift checks, project-knowledge validation, JavaScript syntax checks, and `git diff --check`.
7. Preview desktop and 390px mobile. Verify 4/2/1 columns, filter/sort, grid/list, lightbox arrows/Escape, focus restoration, image loading, and no horizontal overflow.
8. Run a pre-share scan and obtain explicit approval before commit or public push when not already authorized.
