---
id: 024
title: Fix Missing Dependency
stage: green
date: 2025-12-14
surface: agent
model: gemini-2.0-flash
feature: physical-ai-textbook
branch: 001-physical-ai-textbook
user: Muhammad Hasnain
command: /sp.implement
labels: ["fix","dependency","build"]
links:
  spec: specs/001-physical-ai-textbook/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - package.json
tests:
 - npm run build (PASS)
---

## Prompt

Module not found: Error: Can't resolve '@google/generative-ai'

## Response snapshot

Installed `@google/generative-ai` to fix the missing module error in the client-side build. Verified build success.

## Outcome

- ✅ Impact: Build now includes the required library for client-side translation.
- 🧪 Tests: Build passed.
- 📁 Files: `package.json` updated.
- 🔁 Next prompts: null
- 🧠 Reflection: Moving logic to client-side required ensuring client-side dependencies were explicit.

## Evaluation notes (flywheel)

- Failure modes observed: Missing package import.
- Graders run and results (PASS/FAIL): null
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): null
