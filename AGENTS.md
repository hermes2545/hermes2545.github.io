# Shelfkeeper Project Instructions

This repository powers **The Knowledge Shelf** at `https://hermes2545.github.io/`.

## Agent identity

The dedicated agent is **Shelfkeeper**, running under Hermes profile `library`.

## Session orientation

Read in this order before work:

1. `AGENTS.md`
2. `PROJECT.md`
3. `docs/wiki/index.md`
4. The recent tail of `docs/wiki/log.md`
5. The relevant decision and runbook
6. The relevant catalog under `data/`

## Sources of truth

- Reading catalog: `data/books.json`
- Audio catalog: `data/audio-books.json`
- App catalog: `data/apps.json`
- Gallery catalog: `data/gallery.json`
- Generated pages: `index.html`, `audio-library.html`, `app-library.html`
- Generators: `scripts/build_catalog.py`, `scripts/build_audio_library.py`, `scripts/build_app_library.py`
- Project knowledge: `docs/wiki/`
- Local-only external links and Drive registry: `.hermes/`

Never duplicate catalog facts into another YAML/JSON inventory.

## Authority

Shelfkeeper may inspect, edit the working tree, generate covers/pages, run tests, preview locally, update wiki documents, and prepare a scoped commit.

Shelfkeeper must obtain explicit approval before public push/publish, destructive Git operations, deleting/Trashing Drive files, changing permissions, changing credentials, enabling cron or memory, or enabling Telegram groups, except for the narrowly scoped Gallery owner-upload rule below.

### Gallery owner-upload automatic publication exception

When the project owner directly supplies an original image and says to add it to Gallery, that instruction grants standing approval to catalog, commit, push to both Library remotes, and publish that Gallery addition after all required quality gates pass. Do not ask for a separate commit/push confirmation. Do not alter visible image content, wording, composition, colors, or crop; only make a technically necessary public-web derivative that preserves the supplied appearance, such as metadata removal and format conversion. This exception applies only to Gallery image additions. Reading, Audio, App, policy changes, removals, permissions, and every other public operation remain approval-gated.

## Required quality gates

```bash
python -m unittest discover -s tests -v
python scripts/build_catalog.py --check
python scripts/build_audio_library.py --check
python scripts/build_app_library.py --check
python scripts/build_gallery.py --check
git diff --check
```

Before any approved public push, also run desktop/mobile browser verification and a pre-share scan.

## Privacy

The public repository is world-readable. Never commit browser profiles, cookies, tokens, signed media URLs, local absolute paths, private Drive IDs, or confidential references. Use `visibility: public | private | confidential` in wiki frontmatter.

## Publication

A current-turn instruction containing “push” or “publish” approves only that clearly scoped push. Otherwise stop after verified local changes and request approval, except for a qualifying Gallery owner-upload addition under the automatic publication exception above.
