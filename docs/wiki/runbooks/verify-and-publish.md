---
title: Verify and Publish
type: runbook
status: active
visibility: public
created: 2026-08-23
updated: 2026-08-23
sources: [tests, scripts]
tags: [library, verification, github-pages]
---

# Verify and Publish

## Canonical checks

```bash
python -m unittest discover -s tests -v
python scripts/build_catalog.py --check
python scripts/build_audio_library.py --check
git diff --check
```

## Browser checks

- Desktop and 390px mobile.
- No horizontal overflow.
- One shelf per visual row.
- Text above books and correct shelf clearance.
- Search interactions and category-plaque alignment/visibility.
- All covers loaded and links open in new tabs.

## Publish gate

1. Run a pre-share scan over staged public files.
2. Show scope and verification to the user.
3. Obtain explicit approval unless the current instruction says push/publish.
4. Commit and push `main` to public origin.
5. Push the same commit to the private backup remote.
6. Verify both remote HEADs.
7. Wait for GitHub Pages build and read back production URLs.
