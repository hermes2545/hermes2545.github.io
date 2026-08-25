---
title: Add an App
type: runbook
status: active
visibility: public
created: 2026-08-25
updated: 2026-08-25
sources: [data/apps.json, scripts/build_app_library.py, app]
tags: [library, app, import, diskette]
---

# Add an App

1. Clone the exact source repository into a temporary directory and record its 40-character source commit.
2. Inspect the entry point, runtime assets, network/storage APIs, external dependencies, license or attribution, secrets, PII, and files not required at runtime.
3. Choose a stable launcher URL at `app/<app-id>.html`; never break an existing App URL.
4. Preserve a single-file source app byte-for-byte when feasible.
5. For a multi-file app, copy only required runtime files under `app/<app-id>/` and create a minimal stable launcher wrapper at `app/<app-id>.html`. Exclude `.git`, development tools, executables, source disk images, credentials, and unrelated documentation.
6. Write a failing test first for the App ID, launcher URL, source repository/commit, source hash where preservation is required, runtime assets, and diskette markup.
7. Add one record to `data/apps.json`. The catalog owns App metadata and source provenance; do not create a duplicate registry.
8. Design the App as a 3.5-inch diskette. Use a content-specific sticker label with a distinct kicker, monogram, version, primary color, accent, and ink color—never render it as a book cover.
9. Run `python scripts/build_app_library.py`, regenerate the reading and audio pages when shared navigation changes, and run the full suite.
10. Preview the App Shelf at desktop and mobile widths. Verify one physical shelf per visual row, search, category plaques, new-tab launchers, and no horizontal overflow.
11. Launch every imported App over local HTTP. Exercise its main entry path, storage initialization, canvas/runtime assets, and console exception path as applicable.
12. Run the pre-share scan and all build-drift checks. Request explicit approval before public push unless the current instruction already says `push` or `publish`.
