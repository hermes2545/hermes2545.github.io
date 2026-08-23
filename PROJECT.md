# The Knowledge Shelf Project

## Purpose

Maintain a public static library of practical guides and audio content with reproducible catalogs, covers, generators, tests, documentation, and safe publication workflows.

## Agent

- Hermes profile: `library`
- Dedicated agent: **Shelfkeeper — The Knowledge Shelf Librarian**
- Persistent memory: disabled
- Cron: none
- Telegram: dedicated DM-only bot, pending BotFather setup
- Public push: explicit approval required

## Project systems

- Public site: `https://hermes2545.github.io/`
- Public repository: `https://github.com/hermes2545/hermes2545.github.io`
- Private Git mirror: `https://github.com/hermes2545/hermes2545.github.io-backup-private`
- Google Drive: dedicated Project Library folder, linked privately under `.hermes/project-links.json`

## Collections

- Reading collection uses `data/books.json`.
- Audio collection uses `data/audio-books.json`.
- Reading covers use matched original public post artwork.
- Audio covers use locally cached playlist thumbnails.
- Newest publication sorts to the upper-left.

## Knowledge system

- `docs/wiki/SCHEMA.md` defines documentation rules.
- `docs/wiki/index.md` is the knowledge map.
- `docs/wiki/log.md` is append-only durable change context.
- `docs/wiki/decisions/` records why stable policies exist.
- `docs/wiki/runbooks/` defines repeatable work.
- `docs/wiki/incidents/` records material recurring failures only.
- `.hermes/document-registry.json` links local private docs to Drive IDs and is never public.

## Resume

Use: `เปิด session Library ต่อ`
