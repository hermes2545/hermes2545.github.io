---
title: Add Gallery Artwork
type: runbook
status: active
visibility: public
created: 2026-08-26
updated: 2026-08-27
sources: [data/gallery.json, scripts/build_gallery.py, templates/gallery.template.html]
tags: [library, gallery, artwork]
---

# Add Gallery Artwork

## Interpretation rule

When the project owner says **“เอารูปเข้าแกลเลอรี”**, treat it as an instruction to add the supplied image to the Gallery catalog and generated page. Inspect the image only to derive safe catalog metadata and verify quality; do not answer with an image description instead of performing the catalog operation. If no publication date is supplied, use the date the artwork is added locally and report that assumption.

This instruction also carries standing approval for a scoped commit, push to both Library remotes, and public Gallery publication after every quality gate passes. Do not request a separate commit/push confirmation for a qualifying owner-supplied Gallery image. Preserve the visible image exactly: do not rewrite text, crop, recolor, retouch, rearrange, or otherwise edit its content. Technical public-web preparation may remove metadata and convert format while preserving the supplied appearance. All non-Gallery collections and non-addition operations retain their normal approval gates.

1. Confirm the image is approved for public use and record public-safe attribution without local paths.
2. Write a focused failing test for the stable ID, exact minimal catalog fields, local image path, dimensions, mode, and metadata.
3. Place an EXIF-free local image under `assets/gallery/artworks/`; do not hotlink remote assets or copy private design sources.
4. Add one record to `data/gallery.json` with exactly `id`, `title`, `category`, `format`, `published_at`, `image`, `alt`, and `featured_order`.
5. Run `python scripts/build_gallery.py`; do not hand-edit `gallery.html`.
6. Run the focused Gallery tests, full suite, all four generator drift checks, project-knowledge validation, JavaScript syntax checks, and `git diff --check`.
7. Preview desktop and 390px mobile. Verify 4/2/1 columns, filter/sort, grid/list, lightbox arrows/Escape, focus restoration, image loading, and no horizontal overflow.
8. Run a pre-share scan. For a qualifying owner-supplied Gallery image, commit and push automatically; otherwise obtain explicit approval before commit or public push.
9. Verify both remote HEADs, the GitHub Pages deployment, the Production catalog count/title/date, image loading, and desktop/mobile overflow after publication.
