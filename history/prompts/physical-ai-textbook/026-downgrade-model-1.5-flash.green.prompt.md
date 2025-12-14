---
id: 026
title: Downgrade Model to 1.5 Flash
stage: green
date: 2025-12-14
surface: agent
model: gemini-2.0-flash
feature: physical-ai-textbook
branch: 001-physical-ai-textbook
user: Muhammad Hasnain
command: /sp.implement
labels: ["fix","quota","gemini-1.5"]
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

Quota exceeded ... model: gemini-2.0-flash

## Response snapshot

User hit rate limits on `gemini-2.0-flash`. Switched the client-side call to use the stable `gemini-1.5-flash` model which has higher availability. Confirmed file change locally.

## Outcome

- ✅ Impact: Translation should work reliably without 429 errors.
- 🧪 Tests: File verified.
- 📁 Files: `src/components/Translator/index.tsx` modified.
- 🔁 Next prompts: null
- 🧠 Reflection: Always default to stable models for production/demos unless experimental features are strictly required.

## Evaluation notes (flywheel)

- Failure modes observed: Google API Quota Exceeded.
- Graders run and results (PASS/FAIL): null
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): null
