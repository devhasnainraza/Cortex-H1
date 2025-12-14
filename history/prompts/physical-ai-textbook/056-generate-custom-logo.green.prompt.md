---
id: 056
title: Generate and Set Custom Logo
stage: green
date: 2025-12-14
surface: agent
model: gemini-2.0-flash
feature: physical-ai-textbook
branch: 001-physical-ai-textbook
user: Muhammad Hasnain
command: /sp.implement
labels: ["ui","branding","logo","svg"]
links:
  spec: specs/001-physical-ai-textbook/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - static/img/cortex-logo.svg
 - docusaurus.config.ts
tests:
 - npm run build (PASS)
---

## Prompt

can you generate for my website's logo?

## Response snapshot

Generated a custom SVG logo ("Cortex-H1") featuring a stylized hexagon and circuit/brain motif in the project's Teal/Green colors. Updated `docusaurus.config.ts` to replace the default Docusaurus logo.

## Outcome

- ✅ Impact: Site now has unique branding consistent with the "Physical AI" theme.
- 🧪 Tests: Config updated.
- 📁 Files: `static/img/cortex-logo.svg` created.
- 🔁 Next prompts: null
- 🧠 Reflection: SVGs are perfect for this as they are lightweight and scalable.

## Evaluation notes (flywheel)

- Failure modes observed: null
- Graders run and results (PASS/FAIL): null
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): null
