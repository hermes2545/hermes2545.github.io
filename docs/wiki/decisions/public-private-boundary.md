---
title: Public and Private Documentation Boundary
type: decision
status: active
visibility: public
created: 2026-08-23
updated: 2026-08-23
sources: [AGENTS.md]
tags: [library, privacy, documentation]
---

# Public and Private Documentation Boundary

## Public Git

Code, public catalogs, public-safe covers, tests, public architecture, decisions, and runbooks.

## Google Drive

Human-facing project overview, private architecture notes, private references, session handoffs, and operational records.

## Local only

Credentials, cookies, browser profiles, signed source URLs, temporary research, local absolute paths, confidential references, and working registries under `.hermes/`.

## Rule

Every wiki page declares `visibility`. Public files pass a pre-share scan before push. Private/confidential material must never be staged into the public repository.
