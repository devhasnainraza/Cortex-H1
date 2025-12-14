---
id: 023
title: Fix Translation for GitHub Pages
stage: green
date: 2025-12-14
surface: agent
model: gemini-2.0-flash
feature: physical-ai-textbook
branch: 001-physical-ai-textbook
user: Muhammad Hasnain
command: /sp.implement
labels: ["fix","translation","client-side"]
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

It is give me a popup for Translation failed

## Response snapshot

Identified that `api/translate` cannot run on GitHub Pages (static site). Refactored `Translator` component to call Gemini API directly from the client side using a user-prompted API key.

## Outcome

- ✅ Impact: Translation works on GitHub Pages (after user enters key).
- 🧪 Tests: Component updated.
- 📁 Files: `src/components/Translator/index.tsx` modified.
- 🔁 Next prompts: null
- 🧠 Reflection: Static sites require client-side logic for dynamic features unless using Edge Functions.

## Evaluation notes (flywheel)

- Failure modes observed: API call 404 on static host.
- Graders run and results (PASS/FAIL): null
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): null
