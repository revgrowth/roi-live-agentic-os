---
phase: 01-design-prompts
plan: 02
subsystem: design
tags: [stitch, prompts, ui-design, kanban, cron, context, brand, skills, client-switcher]
depends_on:
  requires: ["01-01"]
  provides: ["six copy-paste-ready Stitch prompts covering all Command Centre views"]
  affects: ["02-build"]
tech-stack:
  added: []
  patterns: ["five-layer Stitch prompt structure", "inline design tokens for self-contained prompts", "state-variant sections per view"]
key-files:
  created:
    - .planning/phases/01-design-prompts/stitch-prompt-board.md
    - .planning/phases/01-design-prompts/stitch-prompt-cron-jobs.md
    - .planning/phases/01-design-prompts/stitch-prompt-context.md
    - .planning/phases/01-design-prompts/stitch-prompt-brand.md
    - .planning/phases/01-design-prompts/stitch-prompt-skills.md
    - .planning/phases/01-design-prompts/stitch-prompt-client-switcher.md
  modified: []
decisions:
  - decision: "Inline design tokens in every prompt rather than referencing external file"
    rationale: "Each prompt must be self-contained for copy-paste into Stitch -- Stitch has no way to follow file references"
  - decision: "Client switcher shown as component states side-by-side on one screen"
    rationale: "It is a component not a full page view, so showing all 4 states together gives Stitch better context for generating all variants"
  - decision: "Slide-out panel pattern reused for Brand and Context editing"
    rationale: "Consistent with the Board's task detail panel from the design language, keeps UI patterns predictable"
metrics:
  duration: "~4 minutes"
  completed: "2026-03-25"
---

# Phase 1 Plan 2: Stitch Prompt Crafting Summary

Six self-contained Google Stitch prompts covering every Command Centre view, each embedding the full design language inline and specifying all view states (empty, loading, running/normal, completed, error).

## Tasks Completed

| Task | Name | Commit | Key Output |
|------|------|--------|------------|
| 1 | Board and Cron Jobs prompts | 40b5786 | stitch-prompt-board.md (206 lines), stitch-prompt-cron-jobs.md (183 lines) |
| 2 | Context, Brand, Skills, Client Switcher prompts | d3e6d79 | stitch-prompt-context.md (182 lines), stitch-prompt-brand.md (141 lines), stitch-prompt-skills.md (168 lines), stitch-prompt-client-switcher.md (144 lines) |

## What Was Built

### Board View Prompt (stitch-prompt-board.md)
- Five-column Kanban: Backlog, Queued, Running, Review, Done
- Three card levels: Task (simple), Project (expandable with progress), GSD (expandable with phase tracking)
- Stats bar with 4 metrics: Tasks Running (pulsing dot), Tasks Completed, Active Crons, Today's Spend
- Task creation input with "Run" button
- Drag-and-drop affordances: grab handle, lift shadow, dashed drop zones
- 11 realistic task cards with real skill names, costs, durations
- All 5 states plus interactive hover/focus states

### Cron Jobs View Prompt (stitch-prompt-cron-jobs.md)
- Table layout with 8 columns: Job Name, Schedule, Next Run, Last Run, Avg Duration, Avg Cost, Status, Actions
- Expandable run history per job with per-run status, cost, output files
- Job creation slide-out panel with schedule selector (daily/weekly/monthly/custom)
- 7 realistic cron jobs with human-readable schedules
- Active/paused toggle switch per job

### Context Tab Prompt (stitch-prompt-context.md)
- File tree panel (260px) with folder expand/collapse for memory/, SOUL.md, USER.md, learnings.md
- Content viewer with Preview/Edit mode toggle
- Preview mode: rendered markdown with heading hierarchy, code blocks
- Edit mode: raw markdown textarea in JetBrains Mono with Save/Cancel

### Brand Tab Prompt (stitch-prompt-brand.md)
- 2x2 card grid: Voice Profile, Positioning, ICP, Writing Samples
- Each card: category-coloured icon, file name, last modified, content preview with fade gradient
- Slide-out panel for full content view/edit (same pattern as Board detail panel)

### Skills Tab Prompt (stitch-prompt-skills.md)
- Search input + category filter pills (All, Marketing, Strategy, Visual, System, Utility)
- 2-column card grid with expandable detail: triggers, dependencies, context needs, output
- 6 category badge colour schemes matching skill prefixes (mkt, str, ops, viz, meta, tool)
- 8 realistic skills populated

### Client Switcher Prompt (stitch-prompt-client-switcher.md)
- Sidebar dropdown at bottom with "WORKSPACE" label
- 4 component states shown side-by-side: Closed (Root), Open (dropdown), Client Selected (scope bar), Loading
- 4 realistic clients with unique colour dots
- Scope indicator bar for non-Root selection
- Empty and error states for edge cases

## Design Language Integration

Every prompt embeds the complete design language inline:
- Full colour palette (backgrounds, text, status, borders, level badges)
- Typography scale (Inter + JetBrains Mono, all 8 size tokens)
- Spacing scale (4px base, all specific values)
- Component styles (card, button, input, badge, stats bar)
- State patterns (empty, loading, error, interactive hover/focus)

This ensures each prompt is truly copy-paste-ready -- no external context needed.

## Deviations from Plan

None -- plan executed exactly as written.

## Decisions Made

1. **Inline design tokens in every prompt** -- Stitch cannot follow external file references, so every prompt must be self-contained. This means some duplication across prompts, but guarantees consistent output.

2. **Client switcher as component states grid** -- Since the client switcher is a component (not a full page), the prompt asks Stitch to render 4 sidebar instances side-by-side showing each state. This gives Stitch full context for all variants.

3. **Slide-out panel for Brand and Context editing** -- Reuses the same 480px slide-out pattern defined in the design language for consistency with the Board's task detail panel.

## Verification Results

- All 6 stitch-prompt-*.md files exist
- Design language tokens referenced 186 times across all prompts
- All states covered in every prompt
- Board prompt includes 3 card levels and drag-and-drop
- Cron Jobs prompt includes run history table and schedule selector
- Context and Brand prompts include file browser and editor patterns
- Skills prompt includes search, filter, and expandable detail
- Client Switcher describes nav bar dropdown with scope indicator

## Next Phase Readiness

Phase 1 is complete. All 6 Stitch prompts are ready for the user to paste into Google Stitch and generate designs. The designs produced will become the build reference for Phase 2 (Build).

No blockers for Phase 2. The design language and prompts provide a complete visual specification.
