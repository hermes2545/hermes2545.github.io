# Library Session Handoff

Updated: 2026-11-16T14:08:24+07:00

## Current state

- Project: The Knowledge Shelf at `https://hermes2545.github.io/`.
- Branch: `main`.
- Latest published Reading addition: **ขีดความสามารถในการดูแลระบบ Windows ระยะไกลด้วย AI Agent**.
- Content publication commit: `6b26ab87c36cc3a80e8dfcdca0cbfc7cad502440`.
- Public and private remotes matched the content commit before this documentation follow-up.
- Project-private `.hermes/` routing remains untracked/private and must not be committed.

## Published Reading addition

- Added the owner-supplied HTML byte-for-byte at `Windows_AI_Agent_Remote_Maintenance_Guide.html`.
- HTML SHA-256: `26db6fb1d75a5ec7f297332a1c04270e789cd13ec94b4c0e0868f79ece300184`.
- Added `windows-ai-agent-remote-maintenance-guide` to `data/books.json` as the newest Reading entry:
  - title: `ขีดความสามารถในการดูแลระบบ Windows ระยะไกลด้วย AI Agent`
  - short title: `ดูแล Windows ระยะไกลด้วย AI`
  - category: `AI Operations`
  - href: `Windows_AI_Agent_Remote_Maintenance_Guide.html`
  - cover: `assets/covers/custom/windows-ai-agent-remote-maintenance-guide.webp`
  - timestamp: `2026-11-16T14:00:13+07:00`
- Used the project-owner supplied 915×835 WebP artwork embedded in the HTML.
- Normalized it without cropping or stretching to an EXIF-free 600×900 RGB WebP using aspect-preserving containment and source-edge color padding.
- Public cover SHA-256: `62f4ef4c53009368ed50ae531d015663ded8cb597638827c65bc60a3813c94e2`.
- Added public-safe provenance at `templates/windows-ai-agent-remote-maintenance-guide-cover.template.md`.
- Regenerated `index.html`; Reading now renders 43 books with the Windows guide first.

## Verification completed

- TDD RED/GREEN covered catalog metadata, newest position, HTML/artwork hashes, 23 manual entries (22 chapters plus summary), JavaScript syntax, public-safety conditions, and cover normalization.
- Full local gates passed before publication:
  - `python -m unittest discover -s tests -v` → OK, 178 tests.
  - All four generated-page drift checks → current.
  - `git diff --check` → OK.
- Staged pre-share scan covered 19 intended files and found no concrete home path, private workspace path, private key, GitHub/OpenAI token, cache artifact ID, signed URL, or staged `.hermes/` file.
- GitHub Pages run `43821471643` completed successfully.
- Production SHA-256 matched Local for `index.html`, `Windows_AI_Agent_Remote_Maintenance_Guide.html`, and the 600×900 cover.
- Production browser verification passed at desktop and 390px mobile:
  - 43 Reading cards; the Windows guide is first.
  - Shelf cover loaded at 600×900.
  - Manual rendered 23 entries and 24 navigation buttons including Home.
  - Mobile menu, chapter navigation, Light/Dark theme, and font scaling worked.
  - Horizontal overflow was 0.

## Working-tree note

- The original project working tree still contains pre-existing/unrelated local changes. Publication was made from an isolated clean worktree with explicit staging so those files were not included.
- Temporary preview/browser processes must be stopped and the isolated worktree removed after the documentation follow-up is pushed and verified.
