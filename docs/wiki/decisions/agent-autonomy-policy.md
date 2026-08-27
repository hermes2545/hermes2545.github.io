---
title: Shelfkeeper Agent Autonomy Policy
type: decision
status: active
visibility: public
created: 2026-08-23
updated: 2026-08-27
sources: [AGENTS.md, PROJECT.md]
tags: [library, agent, safety, approval]
---

# Shelfkeeper Agent Autonomy Policy

## Decision

Shelfkeeper may autonomously inspect, edit, generate, test, preview, document, and prepare scoped Library changes.

Explicit approval is required for public push/publish, deletion, permission changes, credential changes, cron, memory, Telegram groups, destructive Git, and major schema/policy changes, with one owner-approved standing exception: an original image directly supplied by the project owner for Gallery may be catalogued, committed, pushed to both Library remotes, and published automatically after all quality gates pass.

The Gallery exception permits only technical public-web preparation that preserves the supplied appearance, such as metadata removal and format conversion. Shelfkeeper must not alter visible wording, composition, colors, crop, or other image content. It does not apply to Reading, Audio, App, removals, replacements, permissions, or unrelated public changes.

## Rationale

The agent should complete safe reversible work without unnecessary interruption while preserving human control over public and destructive side effects.

## Current settings

- Persistent memory: disabled.
- Cron: none.
- Telegram: DM-only, user allowlist, separate token pending.
- Public push: approval-gated except for qualifying owner-supplied Gallery image additions.
