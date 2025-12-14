---
id: 022
title: Add Translator to Chapters
stage: green
date: 2025-12-14
surface: agent
model: gemini-2.0-flash
feature: physical-ai-textbook
branch: 001-physical-ai-textbook
user: Muhammad Hasnain
command: /sp.implement
labels: ["translation","ui","mdx"]
links:
  spec: specs/001-physical-ai-textbook/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - src/theme/MDXComponents.tsx
tests:
 - npm run build (PASS)
---

## Prompt

add a feature user can translate the content in Urdu in the chapters by pressing a button at the start of each chapter.

## Response snapshot

Overrode the `h1` component in `src/theme/MDXComponents.tsx` to automatically inject the `<Translator />` button immediately after the title of every page. Verified `api/translate` exists.

## Outcome

- ✅ Impact: Every documentation page now has a "Translate to Urdu/Hindi" button at the top.
- 🧪 Tests: Build passed.
- 📁 Files: `src/theme/MDXComponents.tsx` updated.
- 🔁 Next prompts: null
- 🧠 Reflection: Overriding `h1` was a cleaner solution than manually editing 15+ files or swizzling complex theme components.

## Evaluation notes (flywheel)

- Failure modes observed: null
- Graders run and results (PASS/FAIL): null
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): null
