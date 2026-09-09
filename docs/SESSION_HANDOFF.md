# Library Session Handoff

Updated: 2026-09-09T20:18:00+07:00

## Current state

- Project: The Knowledge Shelf at `https://hermes2545.github.io/`.
- Branch: `main` is published to both Library remotes. Latest content commit: `31c6756317e8bed0b1310b9348ec29cf8fd4e1d7` (`Add What I Do reading guide`).
- Public Reading Shelf now has 34 books; newest/first item is **งานของผม** at `WHAT-I-DO-final.html`.
- Private production files and browser/tool caches remain in the local `.hermes/` workspace and must not be staged.

## Reading addition completed

- Owner supplied final HTML: `WHAT-I-DO-final.html`; deployed file is byte-preserved at SHA-256 `d81ba5282a99e4089e57721f0e3e5b5524d653cf05ba1ec4da4644bbe5389051`.
- Owner supplied cover PNG was normalized only for shelf delivery: EXIF-free RGB WebP, 600×900, aspect-preserving contain/padding, no visible redesign/crop/recolor/text edit. Deployed cover: `assets/covers/custom/what-i-do.webp`, SHA-256 `5fbff9c45c3cb861752fada07d0765bf479bf28288ab4b93b6a89c2b33e34c4c`.
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
  - `assets/covers/custom/what-i-do.webp`: `5fbff9c45c3cb861752fada07d0765bf479bf28288ab4b93b6a89c2b33e34c4c`.
- Production Playwright desktop/mobile checks confirmed the same shelf/manual counts, search result, 600×900 cover, and zero horizontal overflow.

## Remaining local state

- `.hermes/` remains untracked private workspace/cache and must not be staged.
- Temporary local HTTP server `proc_6673c4bee384` was used for preview and should be killed before final close.
