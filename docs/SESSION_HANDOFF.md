# The Knowledge Shelf — Session Handoff

**Closed:** 2026-08-23

**Public site:** https://hermes2545.github.io/

**Audio collection:** https://hermes2545.github.io/audio-library.html

**Source repository:** https://github.com/hermes2545/hermes2545.github.io

**Private mirror:** https://github.com/hermes2545/hermes2545.github.io-backup-private

## Current state

The site is a static GitHub Pages library branded **The Knowledge Shelf** with the subtitle **Curated Guides, Ideas & Audio**.

### Reading collection

- 15 standalone HTML guides indexed from `data/books.json`.
- `Hermes_Trustworthy_Autonomy_Manual.html` is the newest guide, with an industrial safety-standard 600×900 custom WebP cover.
- The imported `hermes-memory` and `hermes-guardian` repositories retain their original source commits under dedicated subdirectories.
- All 15 shelf-facing short titles use Thai-first labels while retaining necessary product and technical terms.
- Newest publication appears at the upper-left, then flows right and downward.
- Every guide opens in a new browser tab.
- All 15 reading books use individually designed 600×900 custom WebP covers under `assets/covers/custom/`; no active catalog entry uses Facebook artwork.
- Reproducible cover designs live under `templates/`, including `hermes-trustworthy-autonomy-cover.template.html`; legacy Facebook assets remain archived but unused.

### Audio collection

- 44 YouTube playlist entries indexed from `data/audio-books.json`.
- Newest publication appears at the upper-left.
- Local thumbnail assets are stored under `assets/audio-covers/`.
- Each audio item uses a large iPod-style device at the existing book footprint: a full 4:3 thumbnail screen above a click wheel, with duration at the upper-right of the lower control panel and a PLAY label below.
- Audio titles no longer show the redundant `AUDIO BOOK` kicker.
- Each item and the playlist button open YouTube in a new tab.

### Shared visual behavior

- Responsive shelves rebuild to one real shelf per visual row: 5/4/3/2 books at desktop/tablet/mobile breakpoints.
- Reading titles and publication dates sit above each cover; audio titles and publication dates sit above each iPod-style player.
- Reading categories are removed from the title block and rendered as realistic metal plaques aligned to each book on the shelf edge.
- Book covers rest 3–4px above the shelf lip, leaving enough clearance for the 12px hover lift without overlapping the shelf.
- Navigation includes reading-glasses and headphones icons.
- `assets/icons/library.svg` is the shared site icon and favicon.
- Search uses `assets/js/library.js`; the separate reading-category filter row is intentionally removed because categories are shown on shelf plaques.

## Sources of truth

- Reading catalog: `data/books.json`
- Audio catalog: `data/audio-books.json`
- Reading generator: `scripts/build_catalog.py`
- Audio generator: `scripts/build_audio_library.py`
- Custom reading-cover design sources: `templates/reading-cover-designs.template.html`, `templates/mega-prompt-business-book-cover.template.html`, and `templates/reading-cover-assets/`
- Legacy Facebook-cover generator: `scripts/build_facebook_covers.py` (retained but not used by the active catalog)
- Shared template/styles: `templates/`, `assets/css/`, `assets/js/`
- Tests: `tests/`

## Verification commands

```bash
python -m unittest discover -s tests -v
python scripts/build_catalog.py --check
python scripts/build_audio_library.py --check
git diff --check
```

Expected verified result at close: **35 tests passed**, both generated pages current, and no diff-check errors.

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

When a new HTML guide is supplied, match it to its original post image, generate the new vertical cover, add `published_at` metadata, rebuild the reading page, and verify both responsive shelf layout and production links.

## Published artifact

- `DEDICATED_LIBRARY_AGENT_PROFILE_BLUEPRINT.md` has been rendered as a self-contained interactive HTML manual.
- The review copy is stored in the user-designated Google Drive folder and registered locally for update-in-place sync.
- Reader-facing HTML prose omits the polite particle `ค่ะ`; keep the Markdown source unchanged unless the user explicitly requests otherwise.
- Published and verified as the newest reading guide at `https://hermes2545.github.io/DEDICATED_LIBRARY_AGENT_PROFILE_BLUEPRINT.html`.

## Resume phrase

`เปิด session Library ต่อ`
