# Library Session Handoff

Updated: 2026-11-24T10:08:22+07:00

## Current task

- Add and publish the project-owner supplied **คู่มือให้ AI Agent มองเห็นและตรวจจับวัตถุ** as the newest Reading Shelf entry.
- The current-turn instruction explicitly authorizes immediate scoped commit and push.
- Work is isolated from the original dirty project working tree in a clean temporary Git worktree based on matching `origin/main` and `backup/main` commit `9502984abe90ab1b845d84851d87ac4a9147309e`.

## Prepared public files

- `AI-Agent-Vision-Interactive-Guide-TH.html`
  - preserved byte-for-byte from the supplied final HTML;
  - 394,544 bytes;
  - SHA-256 `bcb48cd24a68b7e807fa9b09013805a691ac91a99e75a1f978f3ecf30e8187f1`;
  - 23 interactive pages and 23 navigation entries.
- `assets/covers/custom/ai-agent-vision-interactive-guide-th.webp`
  - owner-supplied 1055×1491 RGB PNG normalized to EXIF-free 600×900 RGB WebP;
  - aspect-preserving 600×848 containment with source-edge extension above and below;
  - no cropping, stretching, visible-content rewrite, or redesign;
  - SHA-256 `c876348db2c5c14883d59bc3b9c7b1bdd908247453639b80d7b976d46079a03f`.
- `data/books.json`
  - one newest record under `Home Assistant`;
  - stable ID `ai-agent-vision-interactive-guide-th`;
  - direct HTML open/download behavior retained.
- `index.html` regenerated from the 46-item Reading catalog.
- Focused regression test and public-safe cover provenance added; older fixed-position Reading tests shifted by one.
- Wiki index/log and this handoff updated.

## Verification completed

- Focused TDD test first failed because the catalog/artifacts were absent, then passed after implementation.
- Full suite: 193 tests passed.
- All four generator drift checks passed: Reading 46, Audio 60, Apps 9, Gallery 8.
- `git diff --check` passed.
- Real Chrome desktop/mobile checks passed:
  - Reading Shelf count 46 with **AI Agent Vision** first;
  - title/cover direct-open links and separate HTML download all target the exact preserved HTML;
  - live cover is 600×900;
  - Home Assistant category filter showed two relevant books and restored all 46;
  - guide page 0 loaded with 23 pages/navigation entries;
  - navigation, search, dark theme, font enlargement, source download, mobile menu, and mobile chapter selection worked;
  - desktop and 390px mobile horizontal overflow were 0;
  - screenshots visually showed no clipping, overlap, crop, stretch, or layout defect.

## Remaining publication steps

1. Stage explicit intended public paths only and run the final staged pre-share scan.
2. Rerun final gates, commit, and push to both Library remotes under the current-turn approval.
3. Verify remote HEAD equality and exact-sha GitHub Pages deployment.
4. Cache-bust and compare Production hashes for the shelf, HTML, cover, catalog, and documentation.
5. Repeat desktop/mobile browser DOM and interaction verification on Production.
6. Update the durable log/handoff from prepared to published, push the documentation follow-up, verify it, stop local QA processes, and remove the isolated worktree.

## Isolation note

- `.hermes/project-links.json` and `.hermes/document-registry.json` were copied into the isolated worktree only as untracked private test prerequisites; they must never be staged or committed.
- The original project working tree remains dirty/behind with unrelated pre-existing work and must not be reset, cleaned, stashed, merged, or included in this publication.
