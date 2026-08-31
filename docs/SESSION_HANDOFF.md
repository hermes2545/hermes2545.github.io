# The Knowledge Shelf — Session Handoff

**Updated:** 2026-08-31

**Public site:** https://hermes2545.github.io/

**Audio collection:** https://hermes2545.github.io/audio-library.html

**Source repository:** https://github.com/hermes2545/hermes2545.github.io

**Private mirror:** https://github.com/hermes2545/hermes2545.github.io-backup-private

## Current state

The site is a static GitHub Pages library branded **The Knowledge Shelf** with four generated collections: Reading, Audio, App, and Gallery.

### Workflow policy

- Owner-confirmed skill fidelity rule: reuse recorded original skill/runbook/history patterns by default for every Library workflow. Ask before changing established formats, methods, role splits, artifact structures, or verification patterns unless the owner explicitly requests a different approach in the current task.
- Non-trivial multi-part work should use Shelfkeeper as orchestrator with worker/reviewer specialist agents when prior pattern or risk calls for it. Inspect project history first; if no pattern exists, design a new workflow deliberately and record it after verification.

### Reading collection

- 28 standalone HTML guides indexed from `data/books.json`.
- The Reading storefront title is **Coffee and Books**. Its environment uses a bright sunlit outdoor garden photograph containing only trees, foliage, grass, and natural daylight, plus heavy translucent iOS-inspired glass walls and shelves and one seamless user-approved 1044×237 retouched header image. The header removes baked UI on the left while preserving the original cup, latte art, table, garden, and lighting on the right; the site logo and title remain semantic HTML.
- The Navigation bar, Title banner, Reading/Search panel, and Bookshelf panel share one responsive width: 1180px maximum on desktop and the same 4px side gutters on mobile. The garden wallpaper uses the photograph's natural color with no brightness/saturation/contrast filter and no color-wash overlay. The retouched header image uses `cover`, so no blank cream strip appears when the banner widens.
- Coffee and Books styles live only in `assets/css/reading-library.css`, loaded only by the Reading template. Shared `assets/css/library.css` is restored byte-for-byte to the pre-Coffee `ca74827` baseline so the App and Audio collections cannot inherit the Reading wallpaper, glass panels, geometry, or header treatment.
- Book titles and publish dates above each cover are intentionally text-only: no label panel, border, shadow, or metadata backdrop. Readability comes from dark typography and restrained text shadow while the book covers remain dominant.
- Reading shelf cards now include an icon-only **glass circle** HTML download control immediately after each publish date. The control is a sibling `<a download>` pointing to the same book HTML, not nested inside the read links; titles and covers still open guides in new tabs.
- `Gemini_Live_API_Guide_TH.html` is the previous newest Reading guide: after owner feedback it was rebuilt from the provisional article layout into the same Interactive Reference Manual pattern used by the latest successful book work (`interactive-reference-manuals` + owner-supplied catalog artifacts). It now has sidebar/topbar navigation, 10 switchable views, hash navigation, search, theme/font state, copy control, print mode, and reader-facing Thai without `ค่ะ`. A later owner correction removed the cover image from the Overview content; the owner-supplied cover remains only as the shelf/catalog cover normalized to an EXIF-free 600×900 RGB WebP at `assets/covers/custom/gemini-live-api-guide.webp`.
- `Hermes_Profile_Migration_Linux_Server_Guide_TH.html` is the newest Reading guide: built from the owner-supplied Markdown source into the established 10-view `interactive-reference-manuals` pattern with sidebar/topbar navigation, hash routing, search, theme/font controls, copy buttons, print mode, and no reader-facing `ค่ะ`. The large “คู่มือย้าย Hermes Profile” hero appears only in the Overview view per owner correction, not above every menu. The owner-supplied cover is used only as the shelf/catalog cover at `assets/covers/custom/hermes-profile-migration-linux-server-guide.webp`, normalized to EXIF-free 600×900 RGB WebP.
- `AgentReach_Thai_Guide.html` is the previous newest guide: the owner-supplied 170,001-byte HTML is preserved byte-for-byte at SHA-256 `e3c92f5eafafdf8b498a593fc825f11c1f2bb78cb479a6d6e94ea436bd1bad90`, with 10 responsive sections/navigation items and the supplied artwork normalized only to a 600×900 EXIF-free RGB WebP.
- The imported `hermes-memory` and `hermes-guardian` repositories retain their original source commits under dedicated subdirectories.
- Shelf-facing titles remain Thai-first except the user-specified English titles **Claude Prompt Caching** and **Grok Bot vs Claude Code vs Codex**, while necessary product and technical terms are retained.
- Newest publication appears at the upper-left, then flows right and downward.
- Every guide opens in a new browser tab.
- All 28 reading books use individually designed or owner-approved 600×900 custom WebP covers under `assets/covers/custom/`; no active catalog entry uses Facebook artwork. The newest Visual Art Director Agent manual, Profile Migration guide, Gemini Live API, Agent Reach guide, and Computer Use guide use owner-supplied final covers without redesign.
- Reproducible cover designs live under `templates/`, including `grok-bot-vs-claude-codex-cover.template.html`, `claude-prompt-caching-cover.template.html`, `vault-ai-safety-cover.template.html`, `agent-reach-comparison-cover.template.html`, and `hermes-concepts-for-everyone-cover.template.html`; legacy Facebook assets remain archived but unused.
- **Claude Prompt Caching** is a byte-preserved user-supplied interactive guide dated 21 June 2026. Its cover uses the officially documented Claude Code Spark cue in an independent editorial context with a visible non-affiliation notice.
- **Claude Interactive Manual** is a local Vite/React build imported from `https://github.com/p2544/claude-interactive-course` commit `d4fdc70`, published at `claude-interactive-manual/index.html` with relative assets and `manual500p.pdf`; source example paths were public-safety sanitized from absolute home-directory form to `~/claude/`. It is dated 6 July 2026 and uses the owner-selected Visual Art Director Option 3 AI-generated cover normalized to `assets/covers/custom/claude-interactive-manual.webp`.
- **Grok Bot vs Claude Code vs Codex** is an 11-view standalone comparison with 13 official sources and embedded transparent Grok/Claude/Codex logo assets. Its editorial cover distinguishes a persistent teammate from temporary spawned workers and carries a visible non-affiliation notice.

### Audio collection

- 52 YouTube entries indexed from `data/audio-books.json`; the newest is **Grok AI ทางลัดสำหรับมือใหม่: ต่างจาก Claude, ChatGPT และ DeepSeek อย่างไร?** (`YivD8OO85TM`). It is Public, Not made for kids, 18:47, 1080p30, uses the approved Glass Spectrum Equalizer and owner-supplied custom thumbnail, includes five verified source URLs, and is verified at position 1 in the exact Public `tech (Ai)` playlist. Female speech drives the Purple/Pink left equalizer and male speech drives the Green/Cyan right equalizer. The original Hermes podcast `KtHYNnLM_Dk` remains Unlisted and is not referenced by the active catalog.
- Newest publication appears at the upper-left.
- Local thumbnail assets are stored under `assets/audio-covers/`.
- Each audio item uses a large iPod-style device at the existing book footprint: a full 4:3 thumbnail screen above a click wheel, with duration at the upper-right of the lower control panel and a PLAY label below.
- Audio titles no longer show the redundant `AUDIO BOOK` kicker.
- Each item and the playlist button open YouTube in a new tab.
- The Audio room uses a light premium technology-retail theme inspired by Apple Fifth Avenue's architectural materials: a luminous glass-cube mark, circular skylights, pale stone/off-white terrazzo surfaces, stainless-steel details, translucent dark navigation, and maple display tables. Apple Blue is reserved for interactive controls.
- The Audio room now uses the project-owner supplied bright retail/listening-room interior photograph as a local 1440×806 EXIF-free RGB WebP wallpaper at `assets/audio-room/owner-supplied-retail-listening-room.webp`. Navigation, header, search/tools, disclosure controls, the full bookshelf wall, and shelf planks use Audio-scoped iOS-style Liquid Glass surfaces (30px room blur, 24px shelf blur); all 52 iPods remain foreground content. Public-safe provenance is recorded in `docs/reports/AUDIO_ROOM_IMAGE_ATTRIBUTION.md`.
- Audio uses progressive disclosure to keep the initial page short: JavaScript starts with the newest 10 entries, loads 10 more per click, can reveal all 52, or can collapse back to 10. A lightweight year archive is generated from existing `time[datetime]` values (currently 2026 and 2025) without changing catalog schema. Search always checks all 52 entries and clearing a query resets the newest-10 view; No-JS users still receive all 52 server-rendered cards.
- The Audio collection header is titled **The Audio Shelf** while the Reading collection is titled **Coffee and Books**.

### App collection

- 6 browser apps indexed from `data/apps.json`: **PDF Password Remover**, **Pac-Man**, **ตุ่มเงิน**, **Bakery Center**, **Battle Tank**, and **Lode Runner**.
- The generated shelf is `app-library.html`; stable launchers include `app/pdf-password-remover.html`, `app/pacman.html`, `app/tumngern.html`, `app/bakery-center.html`, `app/battle-tank.html`, and `app/loderunner.html`.
- PDF Password Remover is a byte-preserved user-supplied single-file app (`user-supplied-preserved`). It processes authorized PDFs locally in the browser, keeps password presets in page memory only, and loads version-pinned `qpdf-run@0.2.1` worker/JavaScript/WASM assets through verified SHA-384 SRI values.
- Battle Tank preserves its imported source HTML byte-for-byte. Bakery Center records the pinned upstream hash but is published as a Library-hardened derivative with schema validation, safe IDs/icons/photos, stored-data migration, and Stored-XSS regression coverage.
- Lode Runner keeps its multi-file runtime under `app/loderunner/`; `app/loderunner.html` is a minimal same-origin fullscreen wrapper.
- ตุ่มเงิน keeps its PWA runtime under `app/tumngern/`; the only Source modifications are deployment-base changes from `/tumngern/` to `/app/tumngern/` plus matching Workbox revisions. Its optional Sync feature is user-initiated, not enabled by default, and openly warns that server payloads are not yet end-to-end encrypted.
- Development tools, executable files, source disk images, repository metadata, and unrelated README files are excluded from the imported Lode Runner runtime.
- Every App appears as a CSS-rendered 3.5-inch diskette with a content-specific sticker label rather than a book cover.
- Pac-Man, Battle Tank, Lode Runner, and ตุ่มเงิน carry local source-derived WebP stickers; Bakery and PDF Password Remover retain paper utility labels.
- The App room uses the project-owner supplied bright monochrome Pantip Plaza / technology-mall photograph as a local 1672×941 EXIF-free RGB WebP wallpaper at `assets/app-room/owner-supplied-pantip-plaza-wallpaper.webp`. Navigation, header, footer, and the full App shelf wall use App-scoped translucent retail/glass surfaces. The `เลือก App จากชั้นดิสก์` tools/search area is a separate rounded glass retail panel with safe inset edges, a subtle cyan/gold top light strip, Windows 95-style search module, and no clipped side borders. Public-safe provenance is recorded in `docs/reports/APP_ROOM_IMAGE_ATTRIBUTION.md`.
- The App header is branded **พันธุ์ทิพย์พลาซ่า** and uses the user-supplied Pantip Plaza logo at the upper-left instead of the former `3½` badge. Its long Thai LED shop message scrolls continuously from right to left at a restrained 28-second pace and changes red → green → yellow → blue on each completed loop.
- The App LED is functional storefront signage, not decorative motion. `app-library.css` explicitly preserves its 28-second infinite animation even when the browser reports `prefers-reduced-motion: reduce`; this narrowly overrides the shared decorative-animation reduction without changing other pages.

### Gallery collection

- 8 user/project-owner supplied EXIF-free WebP artworks are indexed from `data/gallery.json` and generated into `gallery.html`. The newest additions are **Skills vs Plugin vs Connector ใน Claude** and **ระบบ Memory, Project และ Computer ของ Grok Bot**, both dated 28 August 2026 and catalogued as AI/16:9 at featured orders 7–8. The eight original prototype PNG examples were removed from the public catalog and assets at the user's request; their private design sources remain under `.hermes/` only.
- The hero is a user/project-owner supplied image converted locally to an EXIF-free 1280×559 RGB WebP at `assets/gallery/gallery-hero.webp`; public-safe attribution is recorded in `docs/reports/GALLERY_IMAGE_ATTRIBUTION.md`.
- The page supports category filtering, Featured/Newest/Title sorting, grid/list views, and a modal lightbox with previous/next controls, arrow keys, Escape, and focus restoration.
- The Gallery lightbox supports 100–400% zoom with −/+/reset controls, keyboard `+`/`-`/`0`, and clamped pointer panning for mouse, touch, and pen. Changing images and closing the viewer reset the viewport to 100%.
- The image now pans inside a dedicated `.lightbox-media` viewport while the caption stays outside that viewport; this keeps the image geometrically centered and makes all four image edges reachable at maximum zoom.
- The responsive artwork grid uses 4 columns on desktop, 2 on tablet, and 1 on mobile. All runtime assets are local.

### Shared visual behavior

- All four collections load `assets/css/library-dock.css` last and share one centered Sticky Floating Library Dock. Desktop uses a maximum 720×56px four-segment Liquid Glass switcher fixed 12px below the viewport top while scrolling; mobile uses the available width with 46px minimum hit targets 8px from the top. Labels and icons remain visible, and the current collection uses its own accent.
- All four generated collection pages now share the owner-selected **Option 4 — Pill Dock** footer locally: `Knowledge for Humans. Structured for AI.` plus `READ · LISTEN · SEE · USE`, with `assets/icons/facebook-f.webp` as an icon-only Facebook link. The requested Facebook URL is used only as the anchor `href` and must not render as visible footer text.
- Responsive shelves rebuild to one real shelf per visual row: 5/4/3/2 books at desktop/tablet/mobile breakpoints.
- Reading titles and publication dates sit above each cover; audio titles and publication dates sit above each iPod-style player.
- Reading categories are removed from the title block and rendered as realistic metal plaques aligned to each book on the shelf edge.
- Reading category plaques are interactive filters; clicking a plaque filters to that category and clicking the active category again restores all books.
- Book covers rest 3–4px above the shelf lip, leaving enough clearance for the 12px hover lift without overlapping the shelf.
- Navigation includes reading-glasses and headphones icons.
- Navigation order is Reading, Audio, Gallery, then App on every collection page.
- `assets/icons/shelfkeeper-librarian.webp` is the shared Reading/Audio header icon and favicon for all four collection pages; the App storefront header keeps the Pantip logo.
- Search uses `assets/js/library.js`; the separate reading-category filter row is intentionally removed because categories are shown on shelf plaques.

## Sources of truth

- Reading catalog: `data/books.json`
- Audio catalog: `data/audio-books.json`
- App catalog and source provenance: `data/apps.json`
- Gallery catalog: `data/gallery.json`
- Reading generator: `scripts/build_catalog.py`
- Audio generator: `scripts/build_audio_library.py`
- App generator: `scripts/build_app_library.py`
- Gallery generator: `scripts/build_gallery.py`
- Custom reading-cover design sources: `templates/reading-cover-designs.template.html`, `templates/mega-prompt-business-book-cover.template.html`, and `templates/reading-cover-assets/`
- Legacy Facebook-cover generator: `scripts/build_facebook_covers.py` (retained but not used by the active catalog)
- Shared template/styles: `templates/`, `assets/css/library.css`, `assets/js/`; Reading-only environment styles: `assets/css/reading-library.css`
- Tests: `tests/`

## Verification commands

```bash
python -m unittest discover -s tests -v
python scripts/build_catalog.py --check
python scripts/build_audio_library.py --check
python scripts/build_app_library.py --check
python scripts/build_gallery.py --check
git diff --check
```

Expected verified result at close: **107 tests passed**, all four generated pages current, and no diff-check errors.

## Publication workflow

1. Change catalog/source/template files.
2. Regenerate the appropriate page.
3. Run the verification commands above.
4. Preview desktop and mobile layouts over local HTTP.
5. Run a pre-share scan.
6. Commit and push `main` to both `origin` and `backup`.
7. Verify the GitHub Pages build and read back the production URL.

## Intentional boundaries

- The dedicated Library profile has no cron jobs and persistent memory is disabled.
- Browser sessions, cookies, credentials, local `.hermes/` working notes, `AGENTS.md`, and `PROJECT.md` are not part of the public repository.
- The private backup mirrors committed Git history only.

## Next recommended step

After the approved Audio wallpaper push, verify `audio-library.html`, the new wallpaper hash/dimensions, Audio count 52, and production desktop/mobile Liquid Glass readability. Future Reading/Audio/App publications remain approval-gated unless the current user instruction explicitly approves push; qualifying original Gallery image uploads remain auto-publishable after full quality gates.

## Latest close checkpoint — 2026-08-31

- Implemented the owner-selected **Option 4 — Pill Dock** footer locally across `index.html`, `audio-library.html`, `gallery.html`, and `app-library.html` by updating the generated templates and CSS sources rather than hand-editing generated pages.
- The footer copy is `Knowledge for Humans. Structured for AI.` and `READ · LISTEN · SEE · USE`; the owner-supplied Facebook logo is normalized to `assets/icons/facebook-f.webp` and appears as an icon-only link with no visible URL text in the rendered footer.
- Added `tests/test_shared_footer.py` and updated existing new-tab count assertions for the additional footer social link. Verification passed: `python -m unittest discover -s tests -v` with **107 tests**, all four generator `--check` commands, `git diff --check`, and a local public-safety/visibility scan of the changed footer files. Public push remains pending explicit owner approval.

## Latest close checkpoint — 2026-08-31

- Added **Claude Interactive Manual** from `p2544/claude-interactive-course` as Reading catalog ID `claude-interactive-manual`, dated `2026-07-06T00:00:00+07:00`, with public href `claude-interactive-manual/index.html`.
- Built the upstream Vite/React course locally, copied the static runtime and bundled `manual500p.pdf`, kept asset links relative, and sanitized bundled absolute home-directory example paths to `~/claude/` for public safety.
- Published the owner-selected Visual Art Director **Option 3 — Course Object** cover as `assets/covers/custom/claude-interactive-manual.webp`, normalized to 600×900 RGB WebP with no EXIF. Regression coverage in `tests/test_claude_interactive_manual.py` locks catalog metadata, runtime presence, syntax, public-safety scan, and cover normalization.
- Verification before the owner-approved scoped push passed: `python -m unittest discover -s tests -v` with **103 tests**, all four generator `--check` commands, `git diff --check`, static desktop/mobile responsive checks, and a pre-share scan of intended public files with no credential/private-path findings.

## Latest close checkpoint — 2026-08-31

- Fixed **Visual Art Director Agent — Interactive Reference Manual** mobile side navigation: the sidebar brand row now includes a mobile-only `×` close button (`id="sidebarClose"`, Thai `aria-label`), Escape closes the drawer, and the mobile/desktop navigation buttons keep `aria-expanded` synchronized. Desktop collapse remains available from the toolbar; mobile users can close from inside the opened menu.
- Updated `tests/test_visual_art_director_reading.py` with a regression test for the close control and locked the approved HTML SHA-256 to `bdb9af09e0b3441a84cf0f0951423fa21e47b81c026b2bac7efa0907917a430d`.
- Verification before the approved scoped push passed: focused RED→GREEN sidebar test, full `python -m unittest discover -s tests -v` with **99 tests**, all four generator `--check` commands current, `git diff --check`, static navigation checks, and pre-share scan of touched files.

## Latest close checkpoint — 2026-08-30

- Implemented the owner-selected **Glass Circle** direct HTML download control for the Reading shelf. `scripts/build_catalog.py` now renders a small icon-only download link immediately after every publish date, with `download`, title `ดาวน์โหลด HTML`, and an accessible `aria-label`; read actions remain separate title/cover links with `target="_blank" rel="noopener"` and no nested anchors.
- Added Reading-scoped CSS in `assets/css/reading-library.css` for the translucent circular control, inline date row, SVG icon, hover, and focus-visible states without adding a new text line.
- Added regression coverage in `tests/test_build_catalog.py` for one glass-circle download link per Reading book, href parity with the HTML guide, after-date placement, no nested anchors, and CSS glass markers. Regenerated `index.html`; full verification passed with **98 tests**, all four generated-page checks current, and `git diff --check` clean. Desktop and 390px browser preview with injected production-equivalent controls confirmed 27 icons, no horizontal overflow, no broken images, and no obvious clipping/overlap. Publication remains pending explicit push approval.

## Previous close checkpoint — 2026-08-30

- Replaced the Audio Library wallpaper with the project-owner supplied retail/listening-room interior image at `assets/audio-room/owner-supplied-retail-listening-room.webp`.
- Preserved the supplied appearance while converting the JPEG into an EXIF-free 1440×806 RGB WebP for public web use; no visible crop, retouching, generative edit, text overlay, or redesign was applied.
- Updated `assets/css/audio-library.css` to use the new local wallpaper while keeping the Audio-scoped Liquid Glass panels, disclosure controls, iPod cards, search, and 52-entry catalog behavior intact.
- Updated `docs/reports/AUDIO_ROOM_IMAGE_ATTRIBUTION.md` with public-safe project-owner provenance and removed the previous third-party attribution from the active wallpaper record.
- Verification before push passed: focused Audio wallpaper regression, full `python -m unittest discover -s tests -v` with **96 tests**, all four generator `--check` commands, `git diff --check`, public-safety scan, and desktop/mobile visual QA.

## Previous close checkpoint — 2026-08-30

- Added local Reading guide **Visual Art Director Agent — Interactive Reference Manual** at `Visual_Art_Director_Agent_Interactive_Manual.html` and catalog ID `visual-art-director-agent`.
- Preserved the owner-supplied HTML byte-for-byte at SHA-256 `2817badb48fb59f89e76a68a678f93eb80dc31fe796b5f07fe8fa6f87fc1b58e`, with 11 chapter views/navigation items, localStorage, clipboard copy controls, print CSS, desktop/mobile layout, and no reader-facing `ค่ะ`.
- Owner-supplied Visual Art Director cover was normalized only for shelf requirements to `assets/covers/custom/visual-art-director-agent.webp` as an EXIF-free 600×900 RGB WebP.
- Reading now contains 27 local books; the Visual Art Director entry is first/newest with category plaque `AI Design Workflow`.
- Verification before push passed: focused Visual Art Director tests, full `python -m unittest discover -s tests -v` with **96 tests**, all four generator `--check` commands, and `git diff --check`.

## Previous close checkpoint — 2026-08-30

- Added local Reading guide **คู่มือย้าย Hermes Profile ไปยัง Linux Server เครื่องใหม่** at `Hermes_Profile_Migration_Linux_Server_Guide_TH.html` and catalog ID `hermes-profile-migration-linux-server-guide`.
- Built the guide from the owner-supplied Markdown into the established 10-view interactive manual pattern: 10 `sec` views, 10 `nav-item` controls, sidebar/topbar navigation, hash routing, `localStorage`, `navigator.clipboard`, `searchResults`, theme/font controls, copy buttons, and print CSS.
- Applied the owner correction that the large “คู่มือย้าย Hermes Profile” hero/header appears only in the first Overview view, not above every menu.
- Owner-supplied cover was normalized only for shelf requirements to `assets/covers/custom/hermes-profile-migration-linux-server-guide.webp` as an EXIF-free 600×900 RGB WebP.
- Reading now contains 26 local books; the Profile Migration entry is first/newest with category plaque `Hermes Guide`.
- Verification before push passed: focused Profile Migration tests, full `python -m unittest discover -s tests -v` with **93 tests**, all four generator `--check` commands, and `git diff --check`.

## Previous close checkpoint — 2026-08-30

- Added local Reading guide **Gemini Live API — คู่มือสร้าง Voice Agent แบบ Real-Time** at `Gemini_Live_API_Guide_TH.html` and catalog ID `gemini-live-api-guide`.
- Owner-supplied cover was normalized only for shelf requirements to `assets/covers/custom/gemini-live-api-guide.webp` as a 600×900 RGB WebP; no redesign was applied.
- Reading now contains 25 local books; the Gemini Live API entry is first/newest with `publish on 30/08/2026` and category plaque `AI Voice Agents`.
- Verification before the first content push passed: focused Gemini tests, full `python -m unittest discover -s tests -v` with **90 tests**, all four generator `--check` commands, and `git diff --check`; the first HTML was later superseded by the owner-requested interactive-manual correction.
- Initial content commit `6983d66cb88902628d7e68d40a5a33c9431d21e4` and publication-record commit `38ae02c7a3d834a8fd1f80ba05f76e77f6672ff1` were pushed to both public `origin/main` and private `backup/main` before the correction.
- Corrected Gemini Live API HTML now follows the latest successful book/manual pattern and was published in commit `8e659b46eae9c90d3a770d355b4b06bbfd82d7c6`: 10 `sec` views, 10 `nav-item` controls, sidebar/topbar navigation, `localStorage` state, `navigator.clipboard` copy support, search results, theme/font controls, print CSS, and no reader-facing `ค่ะ`.
- Local/public/private HEADs for the correction matched `8e659b46eae9c90d3a770d355b4b06bbfd82d7c6`; Production read-back matched Local SHA-256 for the corrected `Gemini_Live_API_Guide_TH.html` (`5d7b180c…`) and `index.html` (`07d7274…`).
- Production DOM confirmed the corrected manual shape: 10 sections, 10 navigation items, active Overview, no in-content `<img>` or `gemini-live-api-guide.webp` reference, `localStorage`/`navigator.clipboard`/print CSS present, no reader-facing `ค่ะ`, and no horizontal overflow.
- Pre-share scan of intended public files found no private local paths, cache paths, tokens, or credential patterns. All six external source URLs returned HTTP 200.
- Temporary local HTTP server `proc_29c02dcc191d` exited after preview; no Library preview server remains running.

## Previous close checkpoint — 2026-08-29

- Gallery content commit: `68448291cfb5db7eda3f373e19612f1eed5cc7aa` (`Add two Gallery infographics`).
- Local `main`, public `origin/main`, and private `backup/main` matched at that content commit before this close-document update.
- GitHub Pages deployment run `33055457583` completed successfully.
- Reading production contains 22 books; the newest is **Grok Bot vs Claude Code vs Codex** at `https://hermes2545.github.io/grok-bot-vs-claude-code-vs-codex.html`.
- The newest guide has 11 interactive views, 13 official sources, three embedded transparent logos, a 600×900 custom cover, and verified desktop/mobile navigation, search, theme, drawer, and overflow behavior.
- YouTube podcast `VQdCzVNhTmI` is Public, Not made for kids, 20:23, published on **manny calavara**, uses the approved Tricolor Segment Bars video and approved title/description, and is verified in the exact `tech (Ai)` playlist.
- Audio Production contains 52 entries; `YivD8OO85TM` is playlist/catalog position 1 at `https://hermes2545.github.io/audio-library.html`.
- Latest Gallery content/policy commit: `129a98113e537223a61dc01b44465172e808505e` (`Add Grok Bot Gallery safety infographic`). Public and private remote HEADs matched at this commit; GitHub Pages deployment `33056751785` succeeded.
- Latest published full verification: **87 tests passed**; Reading 24, Audio 52, App 6, Gallery 8; all generators current and project knowledge valid.
- Reading publication commit: `4b6f48054d3555ab6a9ae96b7de4260c3ebcc96f` (`Add Hermes advanced computer use guide`). Public and private remote HEADs matched; GitHub Pages deployment `33061438459` succeeded.
- Production Reading contains 23 books with **คู่มือ Hermes Agent Advance Computer Use** first/newest at 27/08/2026. Full verification passed with **82 tests**; all generators current, project knowledge valid, inline JavaScript syntax valid, desktop/mobile visuals passed, interactive CDP checks passed, and no diff-check errors.
- Original publication SHA-256 `d66393c8cb363376c8fc88754c3918de5978b1183a4bf5db3771d667f343f8f1` was production-verified before the owner-supplied branding replacement below.
- Branding update commit: `52cd987cff707fe2d562d301286d2457b65cb382` (`Update Hermes Computer Use guide branding`). Public/private remote HEADs matched; GitHub Pages deployment `33062292220` succeeded.
- Current Production SHA-256: `1ff59d838fc50843f964c71ab3757051b2eeabd5f0701fc515794ac00ddf9581`, matching the supplied update and Local exactly. It preserves 13 panels/13 navigation items, adds one embedded EXIF-free 160×160 JPEG Hermes Agent logo with accessible label, keeps the stable URL/title/date/cover/catalog record unchanged, and passed JavaScript, Search/Tabs/Theme/Font, mobile navigation/Escape, desktop/mobile visual, Production DOM, and overflow verification.
- Production Gallery contains 8 artworks. The newest additions are **Skills vs Plugin vs Connector ใน Claude** and **ระบบ Memory, Project และ Computer ของ Grok Bot**, both dated 28/08/2026 as AI/16:9. Desktop and 390px mobile previews passed with no clipping, overlap, or horizontal overflow; Production AI filter/lightbox/title/date/dimensions read-back passed and both artwork hashes matched Local exactly.
- Pre-share scan of all twelve changed/new files passed with no credentials, PII, private paths, or Drive IDs. The published artwork is a single-frame 1024×1280 RGB WebP with no EXIF.
- Standing approval is active for qualifying original Gallery image uploads: preserve visible content, run all gates, then commit, push both Library remotes, publish, and production-verify automatically. All other collections and operations remain approval-gated.
- Current approved verification passed **87 tests** with Reading 24, Audio 52, App 6, and Gallery 8; all generators are current and `git diff --check` passes. The Grok AI beginner and Alex Finn Audio Shelf additions are Production-verified.
- Alex Finn Audio publication commit: `4275d4337b0d6692c3eb1601d8b9a2ddcfefe607` (`Publish Alex Finn podcast on Audio Shelf`). Local, public `origin/main`, and private `backup/main` matched at this commit before the close-document update; Pages run `33204031199` succeeded.
- Grok AI beginner Audio publication commit: `091b72f01e4504610e25d3504e735e9487b25b4b` (`Publish Grok AI beginner podcast on Audio Shelf`). Local, public `origin/main`, and private `backup/main` matched; Pages run `33207676100` succeeded.
- Production Audio contains 52 cards with `YivD8OO85TM` first/newest, date 29/08/2026, duration 18:47, exact playlist URL, and a 480×360 local cover. Production cover SHA-256 `caec7d3343f0420daf52f5dbe2f93e2dde533161f9ea8799809956ef9be55327` matched Local. Desktop/mobile search/reset, first-card, broken-image, and overflow checks passed.
- YouTube video `YivD8OO85TM` is Public, Not made for kids, 18:47, published by **manny calavara**, uses the approved custom thumbnail, has clean checks, includes five verified source URLs, and is playlist position 1 in the Public `tech (Ai)` playlist.
- Current pre-share scan covered 33 changed/new files: no credential, private key, private local path, Drive ID, or image EXIF/ICC was found. Tumngern retains one owner-published contact Email from its Public upstream; this intentional public contact is documented in `docs/reports/APP_IMPORT_SOURCE_AUDIT.md`.
- Content publication commit: `9ad661fed5a9a4f33c1127cdebcdcdc3465206cf` (`Publish Agent Reach and Tumngern additions`). Local, public `origin/main`, and private `backup/main` matched at this commit before the close-document update.
- GitHub Pages deployment `33070600654` completed successfully for the content commit.
- Production contains Reading 24, Audio 52, App 6, and Gallery 8. Grok AI beginner is first/newest in Audio; Agent Reach remains first/newest in Reading; Tumngern shows `publish on 30/07/2026` in the App Shelf; the two newest AI infographics appear in Gallery dated 28/08/2026.
- Nine sampled Production artifacts—including Agent Reach HTML/covers and Tumngern launcher/runtime/manifest/bundle/splash—matched Local byte-for-byte. Production Tumngern mobile loaded all runtime resources with HTTP 200, no runtime exceptions, empty initial storage, and no horizontal overflow.
- Gallery content commit: `6b5f5f6ad1de810d8114e35e165f3431cdb038c3` (`Add Personal Infrastructure Wiki to Gallery`). Local, public, and private HEADs matched before this close-document update; Pages run `33166761238` succeeded.
- Personal Infrastructure Wiki Production SHA-256 is `56e46ad17e43b3c2765541b65e91902423c04bbcaf636f6d8754fb62b887c47a`, matching Local. Production browser checks passed at 1440px and 390px with six cards, image/lightbox natural size 1280×720, no runtime events, and no horizontal overflow.
- Two-image Gallery content commit: `99fab2b5333ea051ffc562a7898705566415e486` (`Add Claude and Grok Bot infographics to Gallery`). Local, public, and private HEADs matched before this close-document update; Pages run `33172361550` succeeded.
- Production SHA-256 values are `8691b61cd24a0bb2e9c17021e7048927f763b66d936b96fed6faa758dd41730f` for the Claude infographic and `4cc3f89a2e7c7579ae92eab22fd5993dcf80bf54a2d99919c4c972d9321c09bb` for the Grok Bot infographic, both matching Local. Production browser checks passed at 1440px and 390px with eight cards, both lightboxes at natural dimensions, no runtime events, and no horizontal overflow.
- No Library QA server, Studio browser, headless browser, or render process remains running.
- The only untracked working-tree path is local private `.hermes/`; never stage or push it.

## Published artifact

- `DEDICATED_LIBRARY_AGENT_PROFILE_BLUEPRINT.md` has been rendered as a self-contained interactive HTML manual.
- The review copy is stored in the user-designated Google Drive folder and registered locally for update-in-place sync.
- Reader-facing HTML prose omits the polite particle `ค่ะ`; keep the Markdown source unchanged unless the user explicitly requests otherwise.
- Published and verified as the newest reading guide at `https://hermes2545.github.io/DEDICATED_LIBRARY_AGENT_PROFILE_BLUEPRINT.html`.

## Resume phrase

`เปิด session Library ต่อ`
