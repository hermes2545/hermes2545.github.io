# Library Session Handoff

Updated: 2026-11-23T17:55:20+07:00

## Current state

- Project: The Knowledge Shelf at `https://hermes2545.github.io/`.
- Branch: `main`.
- Latest published Reading addition: **Hermes installation manual — การติดตั้ง Hermes บนเครื่องของคุณ**.
- Content publication commit: `42f28b4d9628bef4c9e0c4bb21a0f5c6b53ba3d8`.
- Public and private remotes matched the content commit before this documentation follow-up.
- GitHub Pages run `45160249031` completed successfully.
- Project-private `.hermes/` routing remains untracked/private and must not be committed.

## Published Reading addition

- Added the owner-supplied PDF byte-for-byte at `Hermes-installation-manual.pdf`.
- PDF SHA-256: `baf44008dfadadd6b23a6084a1146f67a20b82554a3795d4f56642c4a24b2b18`.
- PDF facts: 444,397 bytes, PDF 1.7, 26 A4 pages, not encrypted.
- Safety inspection found no attachments, JavaScript, OpenAction, AcroForm, concrete home path, cache artifact ID, private key, GitHub/OpenAI token, or signed URL.
- Added `hermes-installation-manual` to `data/books.json` as the newest Reading entry:
  - title: `Hermes installation manual — การติดตั้ง Hermes บนเครื่องของคุณ`
  - short title: `Hermes installation manual`
  - category: `Installation Guide`
  - href: `Hermes-installation-manual.pdf`
  - cover: `assets/covers/custom/hermes-installation-manual.webp`
  - timestamp: `2026-11-23T17:41:27+07:00`
- Used the project-owner supplied JPEG cover at 906×1280.
- Color-managed it to sRGB and normalized it without cropping or stretching to a metadata-free 600×900 RGB WebP using aspect-preserving containment and source-edge color padding.
- Public cover SHA-256: `e126488560c02bcb354d8cc2b208239929558ffe41556141477ab6cd53b2e151`.
- Added public-safe provenance at `templates/hermes-installation-manual-pdf.template.md` and `templates/hermes-installation-manual-cover.template.md`.
- Extended catalog completeness coverage to include root-level Reading PDFs.
- Regenerated `index.html`; Reading now renders 45 books with the installation manual first.

## Verification completed

- TDD RED/GREEN covered catalog metadata, newest position, exact PDF hash/size/structure, PDF safety, cover normalization/provenance, and older fixed-position Reading tests.
- Full local gates passed before publication:
  - `python -m unittest discover -s tests -v` → OK, 184 tests.
  - All four generated-page drift checks → current.
  - `git diff --check` → OK.
- Staged pre-share scan covered 22 intended files and found no newly added concrete home path, private workspace path, private key, GitHub/OpenAI token, cache artifact ID, or staged `.hermes/` file.
- Local and Production browser verification passed at desktop and 390px mobile:
  - 45 Reading cards; the installation manual is first.
  - Shelf cover loaded at 600×900.
  - Open and download links target `Hermes-installation-manual.pdf`.
  - Shelf horizontal overflow was 0 at both viewport sizes.
  - Chrome PDF Viewer rendered page 1 and showed all 26 page thumbnails without an error or blank document.
- Production SHA-256 matched Local for `index.html`, `Hermes-installation-manual.pdf`, and the 600×900 cover.
- Production served the PDF with HTTP 200, `Content-Type: application/pdf`, and `Content-Length: 444397`.

## Working-tree note

- The original project working tree still contains pre-existing/unrelated local changes. Publication was made from an isolated clean worktree with explicit staging so those files were not included.
- Temporary local preview/browser processes and the isolated worktree must be stopped/removed after this documentation follow-up is pushed and verified.
