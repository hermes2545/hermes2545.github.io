# Library Session Handoff

Updated: 2026-11-10T13:23:49+07:00

## Current state

- Project: The Knowledge Shelf at `https://hermes2545.github.io/`.
- Branch: `main`.
- Latest published Reading addition: **HERMES AT WORK — คู่มือเครื่องมือและการทำงานของทีม AI 5 แผนก**.
- Content publication commit: `f42f9eb4fe651a75fd8e7428776a85ae28cc8346`.
- Public and private remotes matched the content commit before this documentation follow-up.
- Project-private `.hermes/` routing remains untracked/private and must not be committed.

## Published Reading addition: HERMES AT WORK

- Added the owner-supplied HTML byte-for-byte at `hermes-at-work-public-edition.html`.
- HTML SHA-256: `47aa69c361243ae90f73ead84ca9cfeb119850b25761a0986993fc201b7c74a6`.
- Added `hermes-at-work` to `data/books.json` as the newest Reading entry:
  - title: `HERMES AT WORK — คู่มือเครื่องมือและการทำงานของทีม AI 5 แผนก`
  - short title: `HERMES AT WORK`
  - category: `Hermes Guide`
  - href: `hermes-at-work-public-edition.html`
  - cover: `assets/covers/custom/hermes-at-work.webp`
  - timestamp: `2026-11-10T12:50:27+07:00`
- Used the separately owner-supplied PNG cover, which is byte-identical to the cover embedded in the HTML.
- Normalized the cover without cropping from 1086×1448 to an EXIF-free 600×900 RGB WebP with edge-color padding; output SHA-256: `e3b4f3e497273948ff1cbd6a7aa6ead80dc9729c87e4a7d51d46b9c0af563af2`.
- Added public-safe provenance at `templates/hermes-at-work-cover.template.md`.
- Regenerated `index.html`; Reading now renders 42 books with **HERMES AT WORK** first.

## Verification completed

- TDD RED/GREEN covered catalog metadata, owner source/provenance hashes, HTML byte preservation, 11 navigation topics, 27 tools, JavaScript syntax, public-safety conditions, and cover normalization.
- Full local gates passed before publication:
  - `python -m unittest discover -s tests -v` → OK, 175 tests.
  - All four generated-page drift checks → current.
  - `git diff --check` → OK.
- Staged pre-share scan covered 21 intended files and found no concrete home path, private key, GitHub token, API key, cache artifact ID, signed URL, or staged `.hermes/` file.
- GitHub Pages run `42767282823` completed successfully.
- Production SHA-256 matched Local for `index.html`, `hermes-at-work-public-edition.html`, and `assets/covers/custom/hermes-at-work.webp`.
- Production browser verification passed at desktop and 390px mobile:
  - 42 Reading cards; **HERMES AT WORK** first.
  - 600×900 shelf cover loaded.
  - Manual rendered 11 navigation topics.
  - Thai/English and Light/Dark interactions worked.
  - Mobile navigation opened correctly.
  - Horizontal overflow was 0.

## Working-tree note

- The original project working tree still contains pre-existing/unrelated local changes. Publication was made from an isolated clean worktree with explicit staging so those files were not included.
- The temporary browser process used for Production verification must be stopped before session close.
