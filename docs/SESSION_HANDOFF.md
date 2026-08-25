# The Knowledge Shelf — Session Handoff

**Updated:** 2026-08-25

**Public site:** https://hermes2545.github.io/

**Audio collection:** https://hermes2545.github.io/audio-library.html

**Source repository:** https://github.com/hermes2545/hermes2545.github.io

**Private mirror:** https://github.com/hermes2545/hermes2545.github.io-backup-private

## Current state

The site is a static GitHub Pages library branded **The Knowledge Shelf** with three generated collections: Reading, Audio, and App.

### Reading collection

- 20 standalone HTML guides indexed from `data/books.json`.
- `VAULT_AI_Safety_Interactive_Guide_TH.html` is the newest guide, explaining how to verify AI outputs, choose deterministic/AI/hybrid workflows, place human approval gates, and keep inspectable evidence; it uses the selected Cobalt Ice 600×900 custom WebP cover.
- The imported `hermes-memory` and `hermes-guardian` repositories retain their original source commits under dedicated subdirectories.
- All 20 shelf-facing short titles use Thai-first labels while retaining necessary product and technical terms.
- Newest publication appears at the upper-left, then flows right and downward.
- Every guide opens in a new browser tab.
- All 20 reading books use individually designed 600×900 custom WebP covers under `assets/covers/custom/`; no active catalog entry uses Facebook artwork.
- Reproducible cover designs live under `templates/`, including `vault-ai-safety-cover.template.html`, `agent-reach-comparison-cover.template.html`, and `hermes-concepts-for-everyone-cover.template.html`; legacy Facebook assets remain archived but unused.

### Audio collection

- 48 YouTube entries indexed from `data/audio-books.json`; the newest is **คุม AI ไม่ให้พลาด: กรอบ VAULT สำหรับระบบที่ตรวจสอบได้และควบคุมความเสี่ยง** (`lL2eb4GeoAU`). The original Hermes podcast `KtHYNnLM_Dk` remains Unlisted and is not referenced by the active catalog.
- Newest publication appears at the upper-left.
- Local thumbnail assets are stored under `assets/audio-covers/`.
- Each audio item uses a large iPod-style device at the existing book footprint: a full 4:3 thumbnail screen above a click wheel, with duration at the upper-right of the lower control panel and a PLAY label below.
- Audio titles no longer show the redundant `AUDIO BOOK` kicker.
- Each item and the playlist button open YouTube in a new tab.
- The Audio room uses a light premium technology-retail theme inspired by Apple Fifth Avenue's architectural materials: a luminous glass-cube mark, circular skylights, pale stone/off-white terrazzo surfaces, stainless-steel details, translucent dark navigation, and maple display tables. Apple Blue is reserved for interactive controls.
- The Audio collection header is titled **The Audio Shelf** while the Reading collection retains **The Knowledge Shelf**.

### App collection

- 7 browser apps indexed from `data/apps.json`: **Pac-Man**, **Bakery Center**, **Battle Tank**, **Lode Runner**, **RL Battle City**, **New Rally-X**, and **Galaga**.
- The generated shelf is `app-library.html`; stable launchers are `app/pacman.html`, `app/bakery-center.html`, `app/battle-tank.html`, `app/loderunner.html`, `app/rl-battle-city.html`, `app/new-rally-x.html`, and `app/galaga.html`.
- Battle Tank preserves its imported source HTML byte-for-byte. Bakery Center records the pinned upstream hash but is published as a Library-hardened derivative with schema validation, safe IDs/icons/photos, stored-data migration, and Stored-XSS regression coverage.
- Lode Runner keeps its multi-file runtime under `app/loderunner/`; `app/loderunner.html` is a minimal same-origin fullscreen wrapper.
- Development tools, executable files, source disk images, repository metadata, and unrelated README files are excluded from the imported Lode Runner runtime.
- Every App appears as a CSS-rendered 3.5-inch diskette with a content-specific sticker label rather than a book cover.
- Every Diskette except Bakery Center carries a local 360×220 WebP sticker made from source-derived runtime imagery and original-game visual research; Bakery retains its paper utility label.
- The App room uses a light Pantip Plaza 1990s software-floor visual language: pale retail wall, perforated metal display board, LED signage, Windows 95-style search panel, and metal shelf edges.
- The App header is branded **พันธุ์ทิพย์พลาซ่า** and uses the user-supplied Pantip Plaza logo at the upper-left instead of the former `3½` badge. Its long Thai LED shop message scrolls continuously from right to left at a restrained 28-second pace and changes red → green → yellow → blue on each completed loop.

### Shared visual behavior

- Responsive shelves rebuild to one real shelf per visual row: 5/4/3/2 books at desktop/tablet/mobile breakpoints.
- Reading titles and publication dates sit above each cover; audio titles and publication dates sit above each iPod-style player.
- Reading categories are removed from the title block and rendered as realistic metal plaques aligned to each book on the shelf edge.
- Reading category plaques are interactive filters; clicking a plaque filters to that category and clicking the active category again restores all books.
- Book covers rest 3–4px above the shelf lip, leaving enough clearance for the 12px hover lift without overlapping the shelf.
- Navigation includes reading-glasses and headphones icons.
- Navigation includes Reading, Audio, and App destinations; the App destination uses a software-window icon.
- `assets/icons/shelfkeeper-librarian.webp` is the shared Reading/Audio header icon and favicon for all three collection pages; the App storefront header keeps the Pantip logo.
- Search uses `assets/js/library.js`; the separate reading-category filter row is intentionally removed because categories are shown on shelf plaques.

## Sources of truth

- Reading catalog: `data/books.json`
- Audio catalog: `data/audio-books.json`
- App catalog and source provenance: `data/apps.json`
- Reading generator: `scripts/build_catalog.py`
- Audio generator: `scripts/build_audio_library.py`
- App generator: `scripts/build_app_library.py`
- Custom reading-cover design sources: `templates/reading-cover-designs.template.html`, `templates/mega-prompt-business-book-cover.template.html`, and `templates/reading-cover-assets/`
- Legacy Facebook-cover generator: `scripts/build_facebook_covers.py` (retained but not used by the active catalog)
- Shared template/styles: `templates/`, `assets/css/`, `assets/js/`
- Tests: `tests/`

## Verification commands

```bash
python -m unittest discover -s tests -v
python scripts/build_catalog.py --check
python scripts/build_audio_library.py --check
python scripts/build_app_library.py --check
git diff --check
```

Expected verified result at close: **59 tests passed**, all three generated pages current, and no diff-check errors.

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

For the current App Shelf work, review the prepared desktop/mobile screenshots and approve or revise the diskette direction. Public push remains blocked until explicitly approved.

## Published artifact

- `DEDICATED_LIBRARY_AGENT_PROFILE_BLUEPRINT.md` has been rendered as a self-contained interactive HTML manual.
- The review copy is stored in the user-designated Google Drive folder and registered locally for update-in-place sync.
- Reader-facing HTML prose omits the polite particle `ค่ะ`; keep the Markdown source unchanged unless the user explicitly requests otherwise.
- Published and verified as the newest reading guide at `https://hermes2545.github.io/DEDICATED_LIBRARY_AGENT_PROFILE_BLUEPRINT.html`.

## Resume phrase

`เปิด session Library ต่อ`
