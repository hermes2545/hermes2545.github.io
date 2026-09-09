# Library Session Handoff

Updated: 2026-09-09T21:20:00+07:00

## Current state

- Project: The Knowledge Shelf at `https://hermes2545.github.io/`.
- Branch: `main` is published to both Library remotes. Latest content commit: `d260006ce549e80c6d562bed8e12858502de368a` (`Replace What I Do guide and cover`).
- Public Reading Shelf now has 34 books; newest/first item is **งานของผม** at `WHAT-I-DO-final.html`.
- Private production files and browser/tool caches remain in the local `.hermes/` workspace and must not be staged.

## Reading addition completed

- Owner supplied final HTML: `WHAT-I-DO-final.html`; deployed file is byte-preserved at SHA-256 `d81ba5282a99e4089e57721f0e3e5b5524d653cf05ba1ec4da4644bbe5389051`.
- Owner supplied cover PNG was first normalized with contain/padding, then corrected after owner feedback because the white margins did not look like a real book on the shelf. Current deployed cover is EXIF-free RGB WebP, 600×900, full-height scale plus narrow center crop, no added white padding/border, and no text/color/design edits. Deployed cover: `assets/covers/custom/what-i-do.webp`, SHA-256 `ef849089b23ef5e13c0065b8bfce8ce5aa6b597e9e44eb481a57595ab4075bba`.
- Catalog record: `id` `what-i-do`, category `Work System`, published `2026-09-09T00:00:00+07:00`, accent `#E53935`.
- Generated `index.html` from `data/books.json`; no generated page was hand-edited independently.

## Verification completed

- RED focused test initially failed because the catalog record, HTML, and cover were absent; after implementation `python -m unittest tests.test_what_i_do_reading -v` passed.
- Full local gates passed:
  - `python -m unittest discover -s tests -v` → OK, 133 tests.
  - `python scripts/build_catalog.py --check` → current, 34 books.
  - `python scripts/build_audio_library.py --check` → current, 57 audio books.
  - `python scripts/build_app_library.py --check` → current, 8 apps.
  - `python scripts/build_gallery.py --check` → current, 8 artworks.
  - `git diff --check` → OK.
- Pre-share scan over the intended public files found no credentials, private absolute paths, cache IDs, or token/private-key markers; cover metadata check showed WebP 600×900 RGB and no EXIF.
- Local Playwright desktop/mobile previews showed Reading shelf 34 cards, first title **งานของผม**, first href/download `WHAT-I-DO-final.html`, cover natural size 600×900, search returning one result, manual title **งานของผม**, 21 page sections, 20 nav items, active `home`, and zero horizontal overflow.
- Pushed `main` to `origin` and `backup`; both remote HEADs matched `31c6756317e8bed0b1310b9348ec29cf8fd4e1d7`.
- GitHub CLI Actions metadata was unavailable because `gh` is not authenticated; deployment was verified by remote HEAD equality plus cache-busted Production read-back.
- Production HTTP hash read-back matched Local:
  - `index.html`: `f723dd089eca04f8e377e06e3f59f1b95abe2d51e1256f801f59ebd4678e777d`.
  - `WHAT-I-DO-final.html`: `d81ba5282a99e4089e57721f0e3e5b5524d653cf05ba1ec4da4644bbe5389051`.
  - `assets/covers/custom/what-i-do.webp`: `ef849089b23ef5e13c0065b8bfce8ce5aa6b597e9e44eb481a57595ab4075bba`.
- Production Playwright desktop/mobile checks confirmed the same shelf/manual counts, search result, 600×900 cover, and zero horizontal overflow.

## Remaining local state

- `.hermes/` remains untracked private workspace/cache and must not be staged.
- Temporary local HTTP server `proc_6673c4bee384` was used for preview and should be killed before final close.

## Cover correction verification

- Commit `a71657666edeafaf0006d498bca2645168202d8a` replaced only `assets/covers/custom/what-i-do.webp`, `templates/what-i-do-cover.template.md`, and the focused regression test.
- Local verification passed `python -m unittest tests.test_what_i_do_reading -v`, 133 full tests, all four generated-page drift checks, `git diff --check`, pre-share scan, and Playwright desktop/mobile cover preview.
- Pushed the correction to both remotes; Production cover/template hashes matched Local after cache-busted read-back.
- Production Playwright desktop/mobile confirmed 34 Reading cards, **งานของผม** first, `WHAT-I-DO-final.html` href, cover natural size 600×900, and zero horizontal overflow.

## Replacement mobile-fixed HTML and final cover

- Owner supplied replacement HTML `WHAT-I-DO-mobile-fixed.html` and a new physical-book-style cover; both were used to replace the existing **งานของผม** item at the stable public URL/path.
- Commit `d260006ce549e80c6d562bed8e12858502de368a` replaced `WHAT-I-DO-final.html`, `assets/covers/custom/what-i-do.webp`, `templates/what-i-do-cover.template.md`, and updated `tests/test_what_i_do_reading.py`.
- Current deployed HTML SHA-256: `98d44ad1f69aede0b8015cd343984485461f2b67971338e774e0c02eddef3e0a`.
- Current deployed cover SHA-256: `113629318f32a35fd328b2090388fc0270cf50c54a5fd73470cea3845916d549`; normalized from a 1024×1536 RGBA PNG to a 600×900 RGB WebP with no crop, no padding, and no added border because the supplied art was already 2:3.
- Local and Production verification passed: 133 tests, generated page checks, pre-share scan, desktop/mobile shelf/manual DOM checks, production hash read-back for `index.html`, `WHAT-I-DO-final.html`, and cover, with zero horizontal overflow.
