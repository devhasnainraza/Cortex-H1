---
id: 029
title: Try Specific Model Version
stage: green
date: 2025-12-14
surface: agent
model: gemini-2.0-flash
feature: physical-ai-textbook
branch: 001-physical-ai-textbook
user: Muhammad Hasnain
command: /sp.implement
labels: ["fix","model","gemini-1.5-flash-001"]
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

Translation failed: [GoogleGenerativeAI Error] [404] models/gemini-pro is not found

## Response snapshot

Both `gemini-1.5-flash` and `gemini-pro` returned 404. Switching to the explicit versioned model name `gemini-1.5-flash-001` which is often required for specific API keys or regions.

## Outcome

- ✅ Impact: Attempting to resolve 404 by being specific.
- 🧪 Tests: File updated.
- 📁 Files: `src/components/Translator/index.tsx` modified.
- 🔁 Next prompts: null
- 🧠 Reflection: API Model naming is the most brittle part of GenAI integration.

## Evaluation notes (flywheel)

- Failure modes observed: Model Name confusion.
- Graders run and results (PASS/FAIL): null
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): null
