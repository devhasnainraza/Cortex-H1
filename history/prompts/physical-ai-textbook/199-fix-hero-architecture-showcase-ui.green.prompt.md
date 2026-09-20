---
id: 199
title: Fix Hero Architecture Showcase UI
stage: green
date: 2026-09-20
surface: agent
model: gemini-3.8-flash
feature: physical-ai-textbook
branch: main
user: Muhammad Hasnain
command: iski ui ko sahi karo
labels: ["ui-fix", "hero-section", "css-polish", "segment-controls", "frontend"]
links:
  spec: specs/001-physical-ai-textbook/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - src/pages/index.tsx
 - src/css/custom.css
tests:
 - "npm run build (PASS - Generated static files in build)"
 - "Live hot reload on port 3000 verified"
---

## Prompt

iski ui ko sahi karo

## Response snapshot

1. Analyzed the screenshot provided by the user showing visual flaws in the Hero preview card:
   - Docusaurus Infima CSS was injecting default thick button borders, background colors, and washed-out blue/grey text onto unselected tab buttons, making them look like bulky grey pill capsules.
   - Code snippet container was squished into a narrow column with `break-all`, which awkwardly severed words mid-word (`lida` / `r.points)`).
   - The card layout felt unbalanced and lacked feature depth.
2. In `src/css/custom.css`:
   - Added `.hero-tab-btn` with `appearance: none !important`, `border: 1px solid transparent !important`, and `background: transparent !important` to completely override Infima button pollution.
   - Styled `.hero-tab-active` with a clean white tile in light mode and a dark obsidian tile (`#0f172a`) with vibrant emerald text (`#34d399`) and soft glowing border in dark mode.
3. In `src/pages/index.tsx`:
   - Replaced the tab button markup with the new segment control classes.
   - Rebalanced the card layout to a clean 6:6 grid.
   - Upgraded the code preview into a developer window with macOS traffic lights, line numbers, realistic multi-line syntax highlighting, and an active terminal status bar (eliminating word splits).
   - Added capability checkmarks and direct module doc links to the left column.

## Outcome

- ✅ Impact: The Hero Architecture Showcase card is now sleek, modern, balanced, and completely free of bulky borders or broken code text.
- 🧪 Tests: Production build verified (exited code 0), hot-reloading confirmed on localhost:3000.
- 📁 Files: Modified `src/pages/index.tsx` and `src/css/custom.css`.
- 🔁 Next prompts: None required; UI is clean and polished.
- 🧠 Reflection: Default Docusaurus button styles can clash with custom Tailwind tab buttons unless explicitly reset with CSS overrides.

## Evaluation notes (flywheel)

- Failure modes observed: None.
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): null
