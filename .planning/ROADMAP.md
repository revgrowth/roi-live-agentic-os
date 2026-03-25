# Roadmap: Agentic OS Command Centre

## Overview

This roadmap delivers a locally hosted dashboard that replaces the terminal for non-technical Agentic OS users. The build follows five phases: first designing all views in Google Stitch to establish a visual source of truth, then proving the end-to-end core loop (create task, spawn agent, see live updates), then surfacing outputs and monitoring, then adding cron scheduling and management tabs, and finally layering client switching over the working system. Each phase delivers a coherent, testable capability.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3, 4, 5): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Design** - All dashboard views designed in Google Stitch with full design spec before any code is written
- [ ] **Phase 2: Core Loop** - Infrastructure, Kanban board, task execution, and live updates working end-to-end
- [ ] **Phase 3: Outputs and Monitoring** - Output files surface on cards with preview/download, cost tracking, and detail panel
- [ ] **Phase 4: Scheduling and Management** - Cron job scheduling plus Context, Brand, and Skills tabs
- [ ] **Phase 5: Client Switching** - Multi-client scoping across all views

## Phase Details

### Phase 1: Design
**Goal**: Every dashboard view is designed and documented before a single line of code is written, giving all build phases a pixel-level visual source of truth
**Depends on**: Nothing (first phase)
**Requirements**: DESIGN-01, DESIGN-02, DESIGN-03, DESIGN-04
**Success Criteria** (what must be TRUE):
  1. All five views (Board, Cron Jobs, Context, Brand, Skills) plus the client switcher are designed as visual mockups in Google Stitch
  2. The design spec defines colours, typography, spacing, component styles, and layout patterns that apply across all views
  3. Every view has designs for all relevant states: empty, loading, running, completed, and error
  4. Design references (Vibe Kanban for layout/aesthetic, OpenClaw dashboards, Claude Task Viewer) are visibly reflected in the output
**Plans**: TBD
**Tools**: Google Stitch, viz-stitch-design skill, tool-stitch MCP

### Phase 2: Core Loop
**Goal**: A user can create a task, watch it execute via a live Kanban board, and see the card move through columns in real time
**Depends on**: Phase 1 (design spec is the build reference)
**Requirements**: INFRA-01, INFRA-02, INFRA-03, INFRA-04, INFRA-05, BOARD-01, BOARD-02, BOARD-03, BOARD-04, BOARD-05, EXEC-01, EXEC-02, EXEC-03, EXEC-04, UI-01, UI-02
**Success Criteria** (what must be TRUE):
  1. User can open the dashboard in a browser via a single terminal command and see a Kanban board with five columns
  2. User can type a plain-language task description and see a card appear on the board
  3. User can drag cards between columns and the position persists across browser refresh
  4. When a task runs, the card moves automatically from Queued to Running to Review/Done via live updates -- no manual refresh needed
  5. Cards visually distinguish between Task, Project, and GSD levels, and Project/GSD cards expand to show child tasks
**Plans**: 3 plans

Plans:
- [ ] 02-01: Next.js scaffolding, SQLite schema, REST API, SSE streaming, agentic-os path configuration
- [ ] 02-02: Claude CLI process manager with spawn, state machine, cleanup, and event bus integration
- [ ] 02-03: Kanban board UI with drag-and-drop, task creation, card levels, live SSE subscription, and nav/theme

### Phase 3: Outputs and Monitoring
**Goal**: The core promise is complete -- users can describe a task, watch it run, and retrieve outputs without touching a terminal
**Depends on**: Phase 2
**Requirements**: OUT-01, OUT-02, OUT-03, TRACK-01, TRACK-02, PANEL-01, PANEL-02
**Success Criteria** (what must be TRUE):
  1. Completed task cards display their output files, and new files appear in real time as the agent produces them
  2. User can preview markdown, text, and CSV files inline and download any output file
  3. Clicking a card opens a detail panel showing task level, skill used, progress, cost, tokens, duration, and all output files
  4. A global stats bar shows tasks running, tasks completed, active crons, and today's spend at all times
**Plans**: 2 plans

Plans:
- [ ] 03-01: Output file watcher, file listing on cards, inline preview, and download API
- [ ] 03-02: Task detail slide-out panel, cost/token/duration tracking, and global stats bar

### Phase 4: Scheduling and Management
**Goal**: Users can schedule recurring tasks and browse their agentic-os configuration (context, brand, skills) from the dashboard
**Depends on**: Phase 3
**Requirements**: CRON-01, CRON-02, CTX-01, BRAND-01, SKILL-01
**Success Criteria** (what must be TRUE):
  1. User can create a recurring task with daily, weekly, monthly, or custom cron schedule
  2. A dedicated Cron Jobs view shows each job's run history, average duration, average cost, next execution, and active/paused toggle
  3. User can browse memory/context files, brand context files, and installed skills from dedicated tabs in the dashboard
**Plans**: 2 plans

Plans:
- [ ] 04-01: Cron scheduler service, cron job CRUD, Cron Jobs view with run history and stats
- [ ] 04-02: Context tab, Brand tab, and Skills tab reading from agentic-os directory

### Phase 5: Client Switching
**Goal**: Multi-client users can scope the entire dashboard to a specific client workspace
**Depends on**: Phase 4
**Requirements**: CLIENT-01, CLIENT-02
**Success Criteria** (what must be TRUE):
  1. A client switcher in the nav bar lists available client folders and a root option
  2. Selecting a client scopes board, cron jobs, context, brand, and skills views to that client's subfolder
**Plans**: 1 plan

Plans:
- [ ] 05-01: Client detection, nav switcher component, client-scoped API filtering across all views

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5

| Phase | Plans Complete | Status | Completed |
|-------|---------------|--------|-----------|
| 1. Design | 0/TBD | Not started | - |
| 2. Core Loop | 0/3 | Not started | - |
| 3. Outputs and Monitoring | 0/2 | Not started | - |
| 4. Scheduling and Management | 0/2 | Not started | - |
| 5. Client Switching | 0/1 | Not started | - |
