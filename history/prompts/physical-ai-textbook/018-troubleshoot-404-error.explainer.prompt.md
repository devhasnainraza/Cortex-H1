---
id: 018
title: Troubleshoot 404 Error
stage: explainer
date: 2025-12-14
surface: agent
model: gemini-2.0-flash
feature: physical-ai-textbook
branch: 001-physical-ai-textbook
user: Muhammad Hasnain
command: /sp.implement
labels: ["troubleshoot","github-pages","404"]
links:
  spec: specs/001-physical-ai-textbook/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - docusaurus.config.ts
 - static/.nojekyll
tests:
 - null
---

## Prompt

I faced 404 error on this link : https://devhasnainraza.github.io/Physical-AI-Humanoid-Robotics-Book/

## Response snapshot

Verified `docusaurus.config.ts` (baseUrl is correct) and `static/.nojekyll` (exists). Identified the root cause as GitHub Pages Source setting needing manual configuration.

## Outcome

- ✅ Impact: User guided to fix the deployment configuration on GitHub.
- 🧪 Tests: N/A
- 📁 Files: N/A
- 🔁 Next prompts: null
- 🧠 Reflection: Common issue with first-time Docusaurus deployments on GitHub Pages.

## Evaluation notes (flywheel)

- Failure modes observed: null
- Graders run and results (PASS/FAIL): null
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): null
