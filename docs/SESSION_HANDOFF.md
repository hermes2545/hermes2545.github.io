# Library Session Handoff

Updated: 2026-11-23T18:20:46+07:00

## Current state

- Project: The Knowledge Shelf at `https://hermes2545.github.io/`.
- Latest published commit: `422e79869aea1215b44fef7d2be53d7033804b53`.
- Public `origin/main` and private `backup/main` matched that commit before this documentation follow-up.
- GitHub Pages run `45164104764` completed successfully.
- Reading Shelf PDF entries now open through the published Flip PDF Viewer; HTML entries retain their established direct-open behavior.
- The original project working tree still contains unrelated pre-existing changes and was not modified for this implementation.
- Project-private `.hermes/` routing remains untracked/private and must not be committed.

## Published Flip PDF behavior

- Reading artifact routing is automatic from the existing catalog `href`:
  - `.pdf`: title and cover open `flip-viewer.html?id=<catalog-id>`; the separate glass download control downloads the exact original PDF.
  - HTML: title, cover, and download behavior remain unchanged.
- The catalog continues storing the stable original PDF path; no second inventory or schema field was added.
- The viewer resolves only one validated catalog ID and rejects unknown IDs, HTML targets, traversal, absolute paths, and external PDF URLs.
- Runtime capabilities:
  - realistic StPageFlip page-turn animation and page-turn audio;
  - previous/next, direct page number, fullscreen, and shelf-return controls;
  - mouse-wheel zoom from 100–250%;
  - bounded left-button drag pan while zoomed;
  - touch pinch zoom, double-tap zoom, and touch pan;
  - reduced-motion handling;
  - direct original-PDF download button.
- Browser dependencies are vendored locally:
  - PDF.js / `pdfjs-dist` 6.4.299;
  - StPageFlip / `page-flip` 2.0.7;
  - all CMaps, standard fonts, WASM fallback files, and license texts.
- Third-party provenance is recorded in `docs/reports/FLIP_PDF_THIRD_PARTY_NOTICES.md`.
- The runbook and owner-supplied artifact skill record PDF-versus-HTML auto-detection for future Reading additions.

## Verification completed

- TDD RED/GREEN was observed before implementing the viewer and generator routing.
- Full local gates:
  - `python -m unittest discover -s tests -v` → OK, 190 tests.
  - Reading, Audio, App, and Gallery generator drift checks → current.
  - `node --check assets/flip-viewer/viewer.js` → OK.
  - `git diff --check` → OK.
- The staged pre-share scan covered 218 intended files, including 210 new files, and found no concrete home path, private profile/cache path, cache artifact ID, private key, GitHub/OpenAI token, signed URL, or staged `.hermes/` path.
- Local and Production Chrome verification with the 26-page Hermes installation manual:
  - page 1 rendered successfully and next changed the viewer to page 2;
  - wheel input changed the transform to `scale(1.1)` and enabled pan mode;
  - left-button drag changed bounded translation to `55px, 35px`;
  - direct download target remained `Hermes-installation-manual.pdf`;
  - desktop/mobile viewer and shelf horizontal overflow were 0;
  - the 390px mobile control bar measured 382px and stayed inside the viewport.
- Production SHA-256 matched Local for `index.html`, `flip-viewer.html`, viewer JavaScript/CSS, StPageFlip, PDF.js main/worker, and the unchanged owner PDF.
- Production served correct MIME types for HTML, JavaScript modules, and `application/pdf`.
- Visual review passed for Production desktop page 1, page 2 spread, zoom/pan state, mobile viewer, and desktop/mobile Reading shelf.

## Working-tree note

- This follow-up documentation update must be committed and pushed to both remotes, then its Pages deployment and Production documentation hashes verified.
- After that verification, stop the Production Chrome QA process and remove the isolated worktree/temporary branch.
