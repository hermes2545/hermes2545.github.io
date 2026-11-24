# Library Session Handoff

Updated: 2026-11-24T10:08:22+07:00

## Published state

- Project: The Knowledge Shelf at `https://hermes2545.github.io/`.
- Published content commit: `2b52b1be7d2af7082566a92d4cdbd63138bcb4cc`.
- Public `origin/main` and private `backup/main` matched that commit before this documentation follow-up.
- GitHub Pages content run `45318278058` completed successfully.
- The 46th and newest Reading entry is **คู่มือให้ AI Agent มองเห็นและตรวจจับวัตถุ**, shown on the shelf as **AI Agent Vision** under `Home Assistant`.

## Published artifact

- Stable URL: `AI-Agent-Vision-Interactive-Guide-TH.html`.
- The project-owner supplied final HTML is preserved byte-for-byte:
  - 394,544 bytes;
  - SHA-256 `bcb48cd24a68b7e807fa9b09013805a691ac91a99e75a1f978f3ecf30e8187f1`;
  - 23 interactive pages and 23 navigation entries.
- The owner-supplied 1055×1491 RGB PNG cover was normalized only for the shelf:
  - 600×900 RGB WebP with no EXIF/ICC metadata;
  - aspect-preserving 600×848 containment and touching-edge pixel extension above/below;
  - no cropping, stretching, visible-content rewrite, or redesign;
  - SHA-256 `c876348db2c5c14883d59bc3b9c7b1bdd908247453639b80d7b976d46079a03f`.
- The catalog continues using its single source of truth at `data/books.json`.
- Because this artifact is HTML, title/cover open the HTML directly and the glass-circle download control downloads that same original HTML; the PDF Flip Viewer is not involved.

## Verification completed

- TDD RED failed first because the catalog/artifacts were absent, then passed after implementation.
- Full suite: 193 tests passed.
- Generator drift checks passed: Reading 46, Audio 60, Apps 9, Gallery 8.
- `git diff --check` passed.
- The 25-file staged pre-share scan found no concrete home path, private profile/cache path, cache artifact ID, private key, GitHub/OpenAI token, signed URL, or staged `.hermes/` path.
- Local and Production Chrome checks passed at desktop and 390px mobile:
  - 46 Reading cards with **AI Agent Vision** first;
  - exact direct-open and direct-download HTML target;
  - 600×900 loaded shelf cover;
  - Home Assistant category filter showed two matching books and restored all 46;
  - guide page 0, 23-page navigation, search, theme, font enlargement, source download, mobile drawer, and mobile chapter selection worked;
  - zero horizontal overflow;
  - visual review found no clipping, overlap, crop, stretch, or layout defect.
- Cache-busted Production SHA-256 matched Local for the shelf, guide HTML, cover, catalog, wiki index/log, and handoff.
- Production served the guide as `text/html; charset=utf-8` with 394,544 bytes and the cover as `image/webp` with 112,102 bytes.

## Close steps

- Commit and push this documentation follow-up to both remotes, wait for its Pages deployment, and verify Production documentation hashes.
- Stop the local preview server and both QA Chrome processes.
- Remove the isolated worktree and temporary branch.
- The original project working tree remains dirty/behind with unrelated pre-existing work and must not be reset, cleaned, stashed, or merged as part of this task.
