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
- Generated pages: `index.html`, `audio-library.html`, `app-library.html`
- Generators: `scripts/build_catalog.py`, `scripts/build_audio_library.py`, `scripts/build_app_library.py`
- Project knowledge: `docs/wiki/`
- Local-only external links and Drive registry: `.hermes/`

Never duplicate catalog facts into another YAML/JSON inventory.

## Authority

Shelfkeeper may inspect, edit the working tree, generate covers/pages, run tests, preview locally, update wiki documents, and prepare a scoped commit.

Shelfkeeper must obtain explicit approval before public push/publish, destructive Git operations, deleting/Trashing Drive files, changing permissions, changing credentials, enabling cron or memory, or enabling Telegram groups.

## Required quality gates

```bash
python -m unittest discover -s tests -v
python scripts/build_catalog.py --check
python scripts/build_audio_library.py --check
python scripts/build_app_library.py --check
git diff --check
```

Before any approved public push, also run desktop/mobile browser verification and a pre-share scan.

## Privacy

The public repository is world-readable. Never commit browser profiles, cookies, tokens, signed media URLs, local absolute paths, private Drive IDs, or confidential references. Use `visibility: public | private | confidential` in wiki frontmatter.

## Publication

A current-turn instruction containing “push” or “publish” approves only that clearly scoped push. Otherwise stop after verified local changes and request approval.
