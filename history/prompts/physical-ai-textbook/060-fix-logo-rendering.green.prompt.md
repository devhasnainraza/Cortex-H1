---
id: 060
title: Fix Logo Rendering Issue
stage: green
date: 2025-12-14
surface: agent
model: gemini-2.0-flash
feature: physical-ai-textbook
branch: 001-physical-ai-textbook
user: Muhammad Hasnain
command: /sp.implement
labels: ["fix","logo","svg","rendering"]
links:
  spec: specs/001-physical-ai-textbook/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - static/img/cortex-logo.svg
tests:
 - npm run build (PASS)
---

## Prompt

logo not showing on navbar only alt text

## Response snapshot

Simplified the SVG logo code to remove `defs` and `url()` gradients, which can sometimes fail to render in certain browser/img contexts. Switched to standard hex color fills (`#25C2A0`).

## Outcome

- ✅ Impact: Logo should now render reliably on all devices.
- 🧪 Tests: SVG format simplified.
- 📁 Files: `static/img/cortex-logo.svg` modified.
- 🔁 Next prompts: null
- 🧠 Reflection: Complexity in SVGs (filters, masks) is often the enemy of compatibility.

## Evaluation notes (flywheel)

- Failure modes observed: Broken image link (Alt text only).
- Graders run and results (PASS/FAIL): null
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): null
