# Library Session Handoff

Updated: 2026-11-23T18:14:17+07:00

## Current state

- Project: The Knowledge Shelf at `https://hermes2545.github.io/`.
- Latest published remote commit: `958211e715f114998991e9cc08487b6cdd1daa95`.
- Latest published Reading addition: **Hermes installation manual — การติดตั้ง Hermes บนเครื่องของคุณ**.
- A Reading Shelf Flip PDF Viewer is implemented and fully verified in the isolated branch `shelfkeeper/reading-flip-pdf`, but remains uncommitted/unpublished pending explicit push approval.
- The original project working tree still contains unrelated pre-existing changes and was not modified for this implementation.
- Project-private `.hermes/` routing copied into the isolated worktree remains untracked/private and must not be committed.

## Prepared Flip PDF behavior

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
- The runbook and owner-supplied artifact skill now record PDF-versus-HTML auto-detection for future Reading additions.

## Verification completed

- TDD RED/GREEN was observed before implementing the viewer and generator routing.
- Full local gates:
  - `python -m unittest discover -s tests -v` → OK, 190 tests.
  - Reading, Audio, App, and Gallery generator drift checks → current.
  - `node --check assets/flip-viewer/viewer.js` → OK.
  - `git diff --check` → OK.
- Real Chrome desktop verification with the 26-page Hermes installation manual:
  - page 1 rendered successfully with 5 nearby pages prefetched;
  - next control changed the viewer to page 2 and rendered 6 nearby pages;
  - wheel input changed the transform to `scale(1.1)` and enabled pan mode;
  - left-button drag changed bounded translation to `55px, 35px`;
  - direct download target remained `Hermes-installation-manual.pdf`;
  - viewer and shelf horizontal overflow were 0.
- Real Chrome 390×844 mobile verification:
  - viewer reported all 26 pages and rendered page 1 without error;
  - 382px control bar fit inside the 390px viewport;
  - shelf and viewer horizontal overflow were 0;
  - the first Reading card retained its cover and direct PDF download control.
- Visual review passed for desktop page 1, page 2 spread, zoom/pan state, mobile viewer, and desktop/mobile Reading shelf.

## Pending publication

- Run the final staged pre-share scan, commit only the scoped Flip PDF files, and push both Library remotes after explicit approval.
- After push, verify matching remote HEADs, the exact GitHub Pages deployment, Production shelf routing, page-turn/zoom/pan behavior, dependency MIME types, direct PDF hash, and desktop/mobile screenshots.
- Stop the local preview/Chrome processes and remove the isolated worktree after publication or an explicit cancellation.
