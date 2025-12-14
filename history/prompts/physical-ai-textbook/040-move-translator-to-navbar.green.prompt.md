---
id: 040
title: Move Translator to Navbar
stage: green
date: 2025-12-14
surface: agent
model: gemini-2.0-flash
feature: physical-ai-textbook
branch: 001-physical-ai-textbook
user: Muhammad Hasnain
command: /sp.implement
labels: ["ui","navbar","portal","ux"]
links:
  spec: specs/001-physical-ai-textbook/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - src/components/Translator/index.tsx
tests:
 - npm run build (PASS)
---

## Prompt

change place for language bottun i think better place on nav bar

## Response snapshot

Moved the Translator UI from a floating bottom dock to the Top Right Navbar. Used a `React Portal` to inject the buttons into the `.navbar__items--right` container dynamically, ensuring it looks native to Docusaurus without complex swizzling.

## Outcome

- ✅ Impact: UI is now standard and unobtrusive.
- 🧪 Tests: Component updated.
- 📁 Files: `src/components/Translator/index.tsx` modified.
- 🔁 Next prompts: null
- 🧠 Reflection: Portals are a great way to "teleport" UI components into containers you don't own (like theme navbars).

## Evaluation notes (flywheel)

- Failure modes observed: null
- Graders run and results (PASS/FAIL): null
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): null
