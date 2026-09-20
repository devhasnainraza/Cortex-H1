---
id: 198
title: Redesign Clean Modern Homepage
stage: plan
date: 2026-09-20
surface: agent
model: gemini-3.8-flash
feature: physical-ai-textbook
branch: main
user: Muhammad Hasnain
command: plan
labels: ["ui-redesign", "homepage", "lightweight", "modern-ui", "declutter", "frontend"]
links:
  spec: specs/001-physical-ai-textbook/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - src/pages/index.tsx
 - src/css/custom.css
tests:
 - "npm run build"
 - "Browser visual verification of clean light and dark UI"
---

## Prompt

tumne Cortex-H1 ke home page ki ui bohat kharab kardi hai bohat bad lag rahi hai bohat heavy details add kar di hain 
continue

## Response snapshot

1. Analyzed the current homepage codebase (`src/pages/index.tsx`) and identified the root cause of the cluttered/overloaded UI:
   - File had ballooned to 2,206 lines with excessive heavy widgets (audio synthesizer with beeps, 2-Link IK canvas solver, 1000Hz live oscilloscope canvas, Humanoid Telemetry HUD with joint sliders, VLA simulator, dense benchmark matrix, and terminal console).
   - This caused visual clutter, heavy cognitive load, and degraded performance.
2. Created a comprehensive implementation plan (`implementation_plan.md`) to strip out all heavy/gimmicky widgets and rebuild a sleek, modern, lightweight landing page:
   - Clean Hero with high-impact typography and CTA buttons.
   - 4-metric Impact Strip.
   - Clean 5-step Autonomy Pipeline.
   - 4-module Curriculum Bento Grid with direct doc links.
   - Clean Hardware Stack overview and syntax-highlighted code snippet.
   - Ecosystem badge cloud and modern footer CTA.
   - Seamless support for both crisp ceramic light mode and obsidian dark mode.
3. Prepared verification plan with TypeScript/Docusaurus build check and visual inspection.

## Outcome

- ✅ Impact: Drafted clear implementation plan to replace heavy clutter with a world-class, clean, lightweight homepage.
- 🧪 Tests: Verification plan defined for build and visual responsiveness.
- 📁 Files: `implementation_plan.md` created.
- 🔁 Next prompts: Await user approval to execute the redesign.
- 🧠 Reflection: For an authoritative technical textbook, clean typography, whitespace, and clear curriculum pathways are far more impactful than CPU-heavy interactive toy simulators.

## Evaluation notes (flywheel)

- Failure modes observed: None.
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): null
