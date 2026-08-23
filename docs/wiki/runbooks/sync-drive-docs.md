---
title: Sync Project Documents to Drive
type: runbook
status: active
visibility: public
created: 2026-08-23
updated: 2026-08-23
sources: [.hermes/document-registry.json]
tags: [library, google-drive, sync]
---

# Sync Project Documents to Drive

1. Read `.hermes/document-registry.json` and the dedicated Drive parent ID.
2. Determine document visibility; never upload confidential material without explicit approval.
3. Search the exact filename in the exact parent before writing.
4. Update/copy the registered file rather than creating `(1)`/`(2)` duplicates.
5. Verify destination ID, name, MIME type, parent, and active/non-trashed state.
6. For relocation, copy first, verify, then Trash the old file and verify both states.
7. Update the local registry only after remote verification succeeds.
8. Never move the Hermes DR Pack `daily/latest` hierarchy into the Project Library folder.
