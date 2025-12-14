---
id: 049
title: Refactor Translator to Native Style
stage: green
date: 2025-12-14
surface: agent
model: gemini-2.0-flash
feature: physical-ai-textbook
branch: 001-physical-ai-textbook
user: Muhammad Hasnain
command: /sp.implement
labels: ["ui","theme","native","docusaurus"]
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

bhai full full full full full sahi bana kar do

## Response snapshot

Completely stripped the "Custom/Fancy" styling and rebuilt the dropdown using **Strict Docusaurus Native Classes and Variables** (`--ifm-dropdown-*`).

## Outcome

- ✅ Impact: The component now looks exactly like a built-in Docusaurus feature (like the version picker).
- 🧪 Tests: Component updated.
- 📁 Files: `src/components/Translator/index.tsx` modified.
- 🔁 Next prompts: null
- 🧠 Reflection: Sometimes "better" means "standard", not "fancier".

## Evaluation notes (flywheel)

- Failure modes observed: null
- Graders run and results (PASS/FAIL): null
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): null
