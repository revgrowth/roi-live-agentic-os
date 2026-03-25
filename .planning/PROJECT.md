# Agentic OS Command Centre

## What This Is

A locally hosted dashboard that replaces the terminal as the daily interface for non-technical Agentic OS users. Business owners and Academy students describe work in plain language, monitor agents executing it in real time, and review/download outputs — all from a single visual interface. The terminal becomes invisible infrastructure.

## Core Value

A user can describe a task, watch it run, and get the output — without ever opening a terminal.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Kanban board with Backlog, Queued, Running, Review, and Done columns
- [ ] Three task levels: Task (single job), Project (multi-step), GSD (product-level initiative)
- [ ] Task cards visually distinguish between levels; Project/GSD cards expand to show child tasks and progress
- [ ] Skill auto-routing: system reads task description and matches to the right Agentic OS skill
- [ ] Claude CLI spawned as subprocess within the user's agentic-os directory, inheriting all context (CLAUDE.md, skills, brand, memory)
- [ ] Configurable agentic-os folder path: defaults to current directory, configurable via settings
- [ ] SSE-based live updates: status changes plus output files appearing as they're created
- [ ] SQLite persistence for all board state, task history, and run data
- [ ] Output file management: files listed on cards, inline preview for markdown/text/CSV, download for everything else
- [ ] Output versioning for cron jobs: compare runs side by side
- [ ] Cron job scheduling: daily, weekly, monthly, or custom cron expression
- [ ] Cron Jobs view: run history, average duration, average cost, next execution, active/paused status
- [ ] Cost and token tracking per task: tokens used, cost, duration
- [ ] Global stats bar: tasks running, tasks completed, active crons, today's spend
- [ ] Task detail slide-out panel: level, skill used, schedule, progress, stats, and full output file list with previews
- [ ] Context tab: view and edit memory/context files from the agentic-os project
- [ ] Brand tab: view and edit brand context files (voice, positioning, ICP, style)
- [ ] Skills tab: browsable list of installed skills with name, trigger description, dependencies
- [ ] Client switcher in nav bar: scope all views to a specific client folder or root
- [ ] Clean light theme, no emojis, minimal UI inspired by Vibe Kanban
- [ ] One-command local install (local dev now, npm publish when ready)
- [ ] No accounts, no cloud dependency — everything runs and stores locally
- [ ] REST API designed for agent consumption (Claude sessions update their own status and register output files)

### Out of Scope

- Cloud hosting or SaaS version — local-only for v1
- Git/diff/branch visibility — this is a business tool, not a dev tool
- OAuth or user authentication — single-user local app
- Mobile app — desktop browser only
- Real-time collaborative editing — single user per instance
- Google Stitch setup — handled separately before build phases begin
- npm publish — local distribution to students first, publish later

## Context

**Target users:** Non-technical business owners and students in Simon's Academy program who use Agentic OS daily. They currently manage Claude Code via terminal, which creates friction — spinning up terminals, typing commands, managing sessions. The command centre removes that friction entirely.

**Design approach:** UI design happens in Google Stitch (handled separately) before production code is written. Design references include Vibe Kanban (vibekanban.com) for layout/aesthetic, Claude Task Viewer for session monitoring patterns, and OpenClaw dashboards for Kanban + agent orchestration patterns.

**Technical architecture:** Next.js + React + Tailwind + Zustand + SQLite + SSE. The dashboard is a separate app that points at an agentic-os installation. Claude CLI subprocesses run from within the agentic-os directory so they inherit the full context stack. REST API + SSE designed agent-first — Claude sessions update their own task status and register output files as they work.

**Agentic OS integration:** The command centre reads project structure at runtime — output file conventions, skill definitions, brand context files, memory files. No hardcoded paths. Context/Brand/Skills tabs are windows into the same files Claude Code reads. Client switching filters by subfolder following existing multi-client architecture.

**Existing reference:** Full spec at `docs/kanban.md`. Design references at Vibe Kanban, Claude Task Viewer (github.com/L1AD/claude-task-viewer), OpenClaw dashboards, and Paperclip (paperclip.ing).

## Constraints

- **Tech stack**: Next.js + React + Tailwind + Zustand + SQLite + SSE — per spec
- **Install**: Must work as one-command local install; no accounts, no cloud
- **Design**: UI designed in Google Stitch before production build (Stitch setup is separate)
- **Users**: Non-technical — no terminal concepts, git concepts, or dev jargon in the interface
- **Data**: All data stored locally in SQLite; no external services required
- **Agentic OS**: Must read file conventions from project docs at runtime, not hardcode paths
- **Distribution**: Local dev first, npm publish later

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Claude CLI subprocess (not API) | Inherits full agentic-os context (CLAUDE.md, skills, brand, memory) automatically | — Pending |
| SQLite for persistence | Simple, local, no setup — matches one-command install goal | — Pending |
| SSE for live updates | Lightweight, works with local architecture, no WebSocket complexity | — Pending |
| Agent-first API design | Claude sessions self-report status/outputs — not retrofitted from human-only tool | — Pending |
| Configurable agentic-os path | Dashboard is separate app pointing at user's install — defaults to cwd, configurable | — Pending |
| Design in Stitch first | Pixel-level fidelity from design spec, not "make it look nice" during build | — Pending |
| Local-only for v1 | Simplifies everything — no auth, no cloud, no accounts | — Pending |

---
*Last updated: 2025-03-25 after initialization*
