---
id: 038
title: Fix Layout Breakage and Restore
stage: green
date: 2025-12-14
surface: agent
model: gemini-2.0-flash
feature: physical-ai-textbook
branch: 001-physical-ai-textbook
user: Muhammad Hasnain
command: /sp.implement
labels: ["fix","layout","prompt","restore"]
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

Theme broken on Module 1, Restore not working

## Response snapshot

Diagnosed that the LLM was returning structural HTML (like `<html>` or `dir="rtl"`) which broke Docusaurus layout CSS.
1.  **Strict Prompt**: Added rules to forbid `<html>`, `<body>`, and `dir="rtl"`.
2.  **Hard Refresh**: Changed `restoreEnglish` to use `window.location.reload()` to guarantee a clean DOM reset.
3.  **Sanitization**: Added regex to strip markdown code blocks from LLM response.

## Outcome

- ✅ Impact: Layout stays stable during translation; English restore works reliably via reload.
- 🧪 Tests: Component updated.
- 📁 Files: `src/components/Translator/index.tsx` modified.
- 🔁 Next prompts: null
- 🧠 Reflection: LLMs often "helpfully" add markdown formatting or HTML boilerplate which breaks direct DOM injection.

## Evaluation notes (flywheel)

- Failure modes observed: LLM polluting DOM with `dir="rtl"`.
- Graders run and results (PASS/FAIL): null
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): null
