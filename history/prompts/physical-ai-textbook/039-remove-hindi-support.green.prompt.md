---
id: 039
title: Remove Hindi Support
stage: green
date: 2025-12-14
surface: agent
model: gemini-2.0-flash
feature: physical-ai-textbook
branch: 001-physical-ai-textbook
user: Muhammad Hasnain
command: /sp.implement
labels: ["config","language","ui"]
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

remove hindi language feature

## Response snapshot

Removed Hindi language button and logic from the `Translator` component as requested. The UI now only shows English and Urdu toggles.

## Outcome

- ✅ Impact: Simplified UI with only requested languages.
- 🧪 Tests: Component visual structure updated.
- 📁 Files: `src/components/Translator/index.tsx` modified.
- 🔁 Next prompts: null
- 🧠 Reflection: Removing unused features reduces maintenance and visual clutter.

## Evaluation notes (flywheel)

- Failure modes observed: null
- Graders run and results (PASS/FAIL): null
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): null
