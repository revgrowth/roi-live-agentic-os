# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2025-03-25)

**Core value:** A user can describe a task, watch it run, and get the output -- without ever opening a terminal.
**Current focus:** Phase 2: Core Loop (Plan 1 of 3 complete, Wave 2 ready)

## Current Position

Phase: 2 of 5 (Core Loop)
Plan: 1 of 3 in current phase
Status: In progress
Last activity: 2026-03-25 -- Completed 02-01-PLAN.md (Foundation & API)

Progress: [███░░░░░░░] 30%

## Performance Metrics

**Velocity:**
- Total plans completed: 3
- Average duration: ~5 minutes
- Total execution time: ~15 minutes

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 1. Design Prompts | 2/2 | ~9 min | ~5 min |
| 2. Core Loop | 1/3 | ~6 min | ~6 min |

**Recent Trend:**
- Last 5 plans: 01-01 (~5 min), 01-02 (~4 min), 02-01 (~6 min)
- Trend: Consistent

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- Design-first approach -- all views designed in Google Stitch before any code is written
- Phase 1 produces copy-paste-ready Stitch prompts, not design files directly -- user pastes prompts into Stitch to generate designs
- Research Stitch prompting best practices and study design references (Vibe Kanban, OpenClaw, Claude Task Viewer) before crafting prompts
- Claude CLI subprocess (not API) -- inherits full agentic-os context automatically
- SQLite for persistence -- simple, local, no setup
- SSE for live updates -- lightweight, no WebSocket complexity
- Agent-first API design -- Claude sessions self-report status/outputs
- Inter + JetBrains Mono font pairing for UI and data values (01-01)
- 4px base spacing unit for design system (01-01)
- Skeleton loading over spinners for loading states (01-01)
- 3px left-border colour for card status indication (01-01)
- #FAFBFC near-white page background for eye strain reduction (01-01)
- Inline design tokens in every Stitch prompt for self-contained copy-paste use (01-02)
- Client switcher as component states grid rather than full page (01-02)
- Slide-out panel pattern reused for Brand and Context editing (01-02)
- Next.js 16 with Turbopack for dev server performance (02-01)
- Separate /status endpoint for agent self-reporting vs general PATCH (02-01)
- EventEmitter-based in-process pub/sub for SSE bridge (02-01)
- Auto-calculate durationMs on status transitions (02-01)

### Pending Todos

None yet.

### Blockers/Concerns

- Claude CLI headless output format needs hands-on validation in Phase 2 (parse progress, cost, tokens from stream-json)
- Agent self-reporting mechanism (how dashboard URL reaches Claude session) needs decision before Phase 3
- dnd-kit React 19 compatibility -- VERIFIED: @dnd-kit/core@6.3.1 installed successfully with React 19.2.4 (peer dep: react >= 16.8.0)

## Session Continuity

Last session: 2026-03-25
Stopped at: Completed 02-01-PLAN.md (Foundation & API). Wave 2 plans (02-02, 02-03) ready for parallel execution.
Resume file: None
