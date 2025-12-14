---
id: 055
title: Upgrade Curriculum UI
stage: green
date: 2025-12-14
surface: agent
model: gemini-2.0-flash
feature: physical-ai-textbook
branch: 001-physical-ai-textbook
user: Muhammad Hasnain
command: /sp.implement
labels: ["ui","homepage","curriculum","design"]
links:
  spec: specs/001-physical-ai-textbook/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - src/pages/index.tsx
tests:
 - npm run build (PASS)
---

## Prompt

more better down side home page

## Response snapshot

Revamped the "Curriculum" section of the homepage.
1.  **Timeline**: Added a subtle dashed gradient line connecting the steps.
2.  **Icons**: Replaced generic numbers with emoji/SVG icons in floating bubbles.
3.  **Cards**: Added glassmorphism hover effects and cleaner typography.
4.  **Background**: Added a subtle grid pattern for a "blueprint" feel.

## Outcome

- ✅ Impact: The lower half of the homepage now matches the premium quality of the Hero section.
- 🧪 Tests: Component visual structure updated.
- 📁 Files: `src/pages/index.tsx` modified.
- 🔁 Next prompts: null
- 🧠 Reflection: Consistency in design language (gradients, rounded corners) is key for a cohesive site.

## Evaluation notes (flywheel)

- Failure modes observed: null
- Graders run and results (PASS/FAIL): null
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): null
