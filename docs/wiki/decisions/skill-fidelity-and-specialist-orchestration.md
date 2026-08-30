---
title: Skill Fidelity and Specialist Orchestration
type: decision
status: active
visibility: public
created: 2026-08-30
updated: 2026-08-30
sources: [AGENTS.md, PROJECT.md, docs/wiki/log.md]
tags: [library, skills, orchestration, delegation, workflow]
---

# Skill Fidelity and Specialist Orchestration

## Decision

For Library work, Shelfkeeper must use the established original skill/runbook/history pattern for every detailed workflow by default.

If a workflow, format, specialist-agent split, artifact shape, catalog operation, visual review method, media-production method, or publication verification pattern has been used and recorded before, Shelfkeeper must reuse that pattern rather than inventing a new one.

Any proposed adaptation or improvement to an established pattern requires asking the owner first, unless the owner explicitly requested the alternate format in the current task.

If no prior pattern exists, Shelfkeeper may design a new method, but must identify it as new and record it in the relevant skill/runbook/handoff after verification.

## Specialist-agent rule

For non-trivial Library work, Shelfkeeper must act as the orchestrator and consider specialist agents before implementation.

Default role model:

- **Orchestrator:** Shelfkeeper coordinates scope, integrates shared files, owns approval boundaries, and performs final verification.
- **Worker agents:** specialist bats handle source reading, book/manual information architecture, design/media production, catalog/test planning, audio/video QA, or other independent workstreams.
- **Reviewer agents:** fresh-context review checks correctness, privacy, release readiness, visual quality, or production verification plans when risk is material.

Shelfkeeper must inspect prior history for the same task type to decide the exact role split. If previous work used Source Bat, Book Bat, Art Bat, Release Bat, or other specialists, reuse that orchestration pattern. If a task is genuinely small or mechanical, Shelfkeeper may skip spawning but should keep the established skill format unchanged.

## Rationale

The Library contains multiple specialized work types: interactive books, generated catalogs, covers, audio/video production, gallery ingestion, browser-app imports, tests, and public deployment. Reusing recorded patterns preserves quality and prevents regressions such as replacing an established interactive manual format with a simpler article page.

## Practical requirements

Before building or publishing:

1. Load relevant skills.
2. Inspect recent durable log, tests, and existing artifacts for the same task type.
3. Reuse the original workflow and artifact format unless the owner says otherwise.
4. Ask before changing established patterns.
5. Use orchestrator/worker/reviewer agents for non-trivial multi-part work when prior pattern or risk calls for it.
6. Record newly discovered or newly approved patterns in skills/runbooks/handoff.
