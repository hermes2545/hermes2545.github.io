# Library Session Handoff

Updated: 2026-11-23T00:59:39+07:00

## Current state

- Project: The Knowledge Shelf at `https://hermes2545.github.io/`.
- Branch: `main`.
- Latest published Reading addition: **คู่มือสร้างระบบ Hermes Full Disaster Recovery Backup**.
- Content publication commit: `702bc45cd035956fcc9aa595edc1a134aeaff92a`.
- Public and private remotes matched the content commit before this documentation follow-up.
- Project-private `.hermes/` routing remains untracked/private and must not be committed.

## Published Reading addition

- Added the owner-supplied interactive HTML byte-for-byte at `Hermes_Full_Disaster_Recovery_Interactive_Manual.html`.
- HTML SHA-256: `179e91a7037e89a4c0dc86771f9d7272e13d27a7ee35ee5aeb561ce5cdb41f16`.
- Added `hermes-full-disaster-recovery` to `data/books.json` as the newest Reading entry:
  - title: `คู่มือสร้างระบบ Hermes Full Disaster Recovery Backup`
  - short title: `Hermes Full Disaster Recovery`
  - category: `Disaster Recovery`
  - href: `Hermes_Full_Disaster_Recovery_Interactive_Manual.html`
  - cover: `assets/covers/custom/hermes-full-disaster-recovery.webp`
  - timestamp: `2026-11-23T00:52:34+07:00`
- Used the project-owner supplied PNG cover at 1086×1448.
- Normalized it without cropping or stretching to an EXIF-free 600×900 RGB WebP using aspect-preserving containment and source-edge color padding.
- Public cover SHA-256: `228f6c1ce93c0accb5ee3e268953c4b715d5c3a361e68a17e952965100e29ec3`.
- Added public-safe provenance at `templates/hermes-full-disaster-recovery-cover.template.md`.
- Regenerated `index.html`; Reading now renders 44 books with the Full Disaster Recovery guide first.

## Verification completed

- TDD RED/GREEN covered catalog metadata, newest position, HTML/cover/embedded-hero hashes, 31 navigation entries, 31 chapter sections, 57 code-copy controls, 33 checklist boxes, JavaScript syntax, public-safety conditions, and cover normalization.
- Full local gates passed before publication:
  - `python -m unittest discover -s tests -v` → OK, 181 tests.
  - All four generated-page drift checks → current.
  - `git diff --check` → OK.
- Staged pre-share scan covered 20 intended files and found no concrete home path, private workspace path, private key, GitHub/OpenAI token, cache artifact ID, signed URL, or staged `.hermes/` file. Embedded image payloads were excluded from textual secret-pattern matching to avoid random base64 false positives.
- GitHub Pages run `45052392726` completed successfully.
- Production SHA-256 matched Local for `index.html`, `Hermes_Full_Disaster_Recovery_Interactive_Manual.html`, and the 600×900 cover.
- Production browser verification passed for the shelf and manual controls at desktop and 390px mobile:
  - 44 Reading cards; the Full Disaster Recovery guide is first.
  - Shelf cover loaded at 600×900.
  - Manual rendered 31 navigation entries/chapters and 57 copy controls.
  - Mobile menu, search, chapter navigation, Light/Dark theme, and font scaling worked.
  - Reading shelf and manual landing page horizontal overflow was 0.
- Preserved-source limitation: the wide comparison table in Part 1 expands the mobile document by 178 px at 390px viewport with font scale 110%. The source HTML was intentionally preserved byte-for-byte rather than silently modified.

## Working-tree note

- The original project working tree still contains pre-existing/unrelated local changes. Publication was made from an isolated clean worktree with explicit staging so those files were not included.
- Temporary preview/browser processes must be stopped and the isolated worktree removed after the documentation follow-up is pushed and verified.
