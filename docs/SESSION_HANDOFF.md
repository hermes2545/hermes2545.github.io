# Library Session Handoff

Updated: 2026-11-16T14:16:40+07:00

## Current state

- Project: The Knowledge Shelf at `https://hermes2545.github.io/`.
- Branch: `main`.
- Latest published Reading addition: **ขีดความสามารถในการดูแลระบบ Windows ระยะไกลด้วย AI Agent**.
- Content publication commit: `6b26ab87c36cc3a80e8dfcdca0cbfc7cad502440`.
- Final cover replacement commit: `4d8863eb8ba314a7f674dcc646ce5b3ef074ca02`.
- Public and private remotes matched the cover replacement commit before this documentation follow-up.
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
- Initially used the 915×835 WebP artwork embedded in the supplied HTML as a provisional shelf cover.
- Replaced it with the project-owner supplied final JPEG cover while preserving the stable catalog ID, title, HTML, href, date, and cover path.
- Final cover source: JPEG, RGB, 906×1280, SHA-256 `a3657e69d33bf1845415b03a70894c2d0a57e9e23beda5fe8358676e49ce13ab`.
- Converted through the supplied color profile to sRGB and normalized without cropping or stretching to an EXIF-free 600×900 RGB WebP using aspect-preserving containment and source-edge color padding.
- Final public cover SHA-256: `6e5b34978bee16904f33a80d726d960180d02f9f54c436c3484bc3457b5f23d9`.
- Added public-safe provenance at `templates/windows-ai-agent-remote-maintenance-guide-cover.template.md`.
- Regenerated `index.html`; Reading now renders 43 books with the Windows guide first.

## Verification completed

- TDD RED/GREEN covered catalog metadata, newest position, HTML/artwork hashes, 23 manual entries (22 chapters plus summary), JavaScript syntax, public-safety conditions, and cover normalization.
- Full local gates passed before publication:
  - `python -m unittest discover -s tests -v` → OK, 178 tests.
  - All four generated-page drift checks → current.
  - `git diff --check` → OK.
- The initial publication staged pre-share scan covered 19 intended files; the final-cover replacement scan covered three scoped files. Neither found a concrete home path, private workspace path, private key, GitHub/OpenAI token, cache artifact ID, signed URL, or staged `.hermes/` file.
- Initial GitHub Pages run `43821471643` and final-cover run `43822532484` completed successfully.
- Production SHA-256 matched Local for `index.html`, `Windows_AI_Agent_Remote_Maintenance_Guide.html`, and the final 600×900 cover.
- Production browser verification passed at desktop and 390px mobile:
  - 43 Reading cards; the Windows guide is first.
  - Shelf cover loaded at 600×900.
  - Manual rendered 23 entries and 24 navigation buttons including Home.
  - Mobile menu, chapter navigation, Light/Dark theme, and font scaling worked.
  - Horizontal overflow was 0.

## Working-tree note

- The original project working tree still contains pre-existing/unrelated local changes. Publication was made from an isolated clean worktree with explicit staging so those files were not included.
- Temporary preview/browser processes must be stopped and the isolated worktree removed after the documentation follow-up is pushed and verified.
