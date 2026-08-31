---
title: Claude Interactive Manual cover source notes
type: design-source
status: active
visibility: public
created: 2026-08-31
sources:
  - https://github.com/p2544/claude-interactive-course
  - https://commons.wikimedia.org/wiki/File:Claude_AI_logo.svg
tags: [reading-cover, claude, visual-art-director]
---

# Claude Interactive Manual cover source notes

Selected cover: **Option 3 — Course Object**.

Production path: `assets/covers/custom/claude-interactive-manual.webp`.

Visual Art Director pipeline used for the owner-approved cover:

1. Inspect the public source repository `p2544/claude-interactive-course` at commit `d4fdc70`.
2. Build an art-direction brief around the course themes: 8 chapters, interactive learning cycle, workflows, cookbook, glossary, quiz, and progress tracking.
3. Generate a portrait 2:3 visual base with OpenAI Codex image generation, model `gpt-image-2-medium`, requesting a premium bookstore-quality course/manual object with no readable generated text and clean typography zones.
4. Add exact deterministic finishing: official Claude wordmark from Wikimedia Commons, exact title text, subtitle, shelf-safe crop, and 600×900 export.
5. Convert the selected result to RGB WebP, strip metadata, and verify shelf thumbnail legibility.

Public-safety notes:

- The image is a project cover preview/derivative and does not imply endorsement by Anthropic.
- No API keys, account IDs, QR codes, local paths, or private document IDs are embedded in the public cover.
- The checked-in source course is already public; this note records only reproducible design context, not private generation cache paths.
