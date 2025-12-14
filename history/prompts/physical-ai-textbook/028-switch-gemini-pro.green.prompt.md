---
id: 028
title: Switch to Gemini Pro
stage: green
date: 2025-12-14
surface: agent
model: gemini-2.0-flash
feature: physical-ai-textbook
branch: 001-physical-ai-textbook
user: Muhammad Hasnain
command: /sp.implement
labels: ["fix","gemini-pro","404"]
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

[404] models/gemini-1.5-flash is not found

## Response snapshot

User encountered a 404 error indicating `gemini-1.5-flash` was not found. Switched the model to `gemini-pro`, which is the standard legacy alias and guaranteed to be available on `v1beta` API.

## Outcome

- ✅ Impact: Translation should finally work.
- 🧪 Tests: File updated.
- 📁 Files: `src/components/Translator/index.tsx` modified.
- 🔁 Next prompts: null
- 🧠 Reflection: Model names in Google AI SDK change frequently. `gemini-pro` is the safest fallback.

## Evaluation notes (flywheel)

- Failure modes observed: Model name 404.
- Graders run and results (PASS/FAIL): null
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): null
