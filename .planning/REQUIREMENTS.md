# Requirements: Agentic OS Command Centre

**Defined:** 2025-03-25
**Core Value:** A user can describe a task, watch it run, and get the output — without ever opening a terminal.

## v1 Requirements

### Design

- [ ] **DESIGN-01**: Copy-paste-ready Google Stitch prompts produced for all dashboard views before code is written
- [ ] **DESIGN-02**: Stitch prompts cover Board, Cron Jobs, Context, Brand, Skills views and client switcher — one prompt per view/screen
- [ ] **DESIGN-03**: A design language document defines shared tokens (colours, typography, spacing, component styles) referenced by all prompts
- [ ] **DESIGN-04**: Each Stitch prompt specifies all relevant view states: empty, loading, running, completed, and error

### Infrastructure

- [ ] **INFRA-01**: App initializes SQLite database on first launch with full schema
- [ ] **INFRA-02**: App starts via single command from project directory
- [ ] **INFRA-03**: App accepts configurable agentic-os directory path (defaults to cwd, configurable via settings)
- [ ] **INFRA-04**: REST API endpoints for all task CRUD operations
- [ ] **INFRA-05**: SSE endpoint streams live task status updates and output file events to frontend

### Board

- [ ] **BOARD-01**: Kanban board displays 5 columns: Backlog, Queued, Running, Review, Done
- [ ] **BOARD-02**: User can create a task by typing a natural language description
- [ ] **BOARD-03**: User can drag and drop cards between columns
- [ ] **BOARD-04**: Cards visually distinguish between Task, Project, and GSD levels
- [ ] **BOARD-05**: Project and GSD cards expand to show child tasks and progress

### Execution

- [ ] **EXEC-01**: Dashboard spawns Claude CLI as subprocess within configured agentic-os directory
- [ ] **EXEC-02**: Claude CLI subprocess inherits full agentic-os context (CLAUDE.md, skills, brand, memory)
- [ ] **EXEC-03**: Running tasks show live progress via SSE (status changes + output files appearing)
- [ ] **EXEC-04**: Process manager handles cleanup on task cancel/error (no zombie processes)

### Tracking

- [ ] **TRACK-01**: Each task logs tokens used, cost, and duration
- [ ] **TRACK-02**: Global stats bar shows: tasks running, tasks completed, active crons, today's spend

### Outputs

- [ ] **OUT-01**: Completed tasks display list of output files on the card
- [ ] **OUT-02**: User can preview markdown, text, and CSV files inline without leaving the board
- [ ] **OUT-03**: User can download any output file

### Detail Panel

- [ ] **PANEL-01**: Clicking a card opens a slide-out panel with task level, skill used, progress, and stats
- [ ] **PANEL-02**: Panel shows full list of output files with inline preview capability

### Cron

- [ ] **CRON-01**: User can create recurring tasks with daily, weekly, monthly, or custom cron expression
- [ ] **CRON-02**: Dedicated Cron Jobs view shows run history, average duration, average cost, next run, and active/paused status

### Management Tabs

- [ ] **CTX-01**: Context tab displays and allows editing of memory/context files from the agentic-os project
- [ ] **BRAND-01**: Brand tab displays and allows editing of brand context files (voice, positioning, ICP, style)
- [ ] **SKILL-01**: Skills tab shows browsable list of installed skills with name, trigger description, and dependencies

### Client Switching

- [ ] **CLIENT-01**: Client switcher in nav bar scopes all views to a specific client folder or root
- [ ] **CLIENT-02**: Board, cron jobs, context, brand, and skills all filter by selected client

### Design (UI Implementation)

- [ ] **UI-01**: Clean light theme with minimal UI inspired by Vibe Kanban — no emojis, no dev jargon
- [ ] **UI-02**: Nav structure: Board | Cron Jobs | Context | Brand | Skills with client switcher in top bar

## v2 Requirements

### Smart Routing

- **ROUTE-01**: Skill auto-routing matches task description to the right Agentic OS skill automatically
- **ROUTE-02**: User can override auto-selected skill before execution

### Output Versioning

- **VER-01**: Cron job outputs versioned by run for side-by-side comparison
- **VER-02**: User can view diff between consecutive cron run outputs

### Detail Panel Enhancements

- **PANEL-03**: Project/GSD cards show sub-task breakdown with per-task output files
- **PANEL-04**: Cron tasks show schedule info, next run, and run history in panel

### Budget Controls

- **BUDGET-01**: User can set budget limits per task level
- **BUDGET-02**: Dashboard warns when approaching budget threshold

### Distribution

- **DIST-01**: App distributable via npx (one-command install from npm registry)
- **DIST-02**: Setup script handles native dependency compilation gracefully

## Out of Scope

| Feature | Reason |
|---------|--------|
| Cloud hosting / SaaS | Local-only for v1 — simplifies everything (no auth, no infra) |
| Git/diff/branch visibility | Business tool, not a developer tool — no dev concepts in UI |
| OAuth / user authentication | Single-user local app — no accounts needed |
| Mobile app | Desktop browser only — dashboard is a workstation tool |
| Real-time collaborative editing | Single user per instance |
| Agent SDK integration | Claude CLI subprocess is simpler and proven; revisit if SDK matures |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| DESIGN-01 | Phase 1 | Pending |
| DESIGN-02 | Phase 1 | Pending |
| DESIGN-03 | Phase 1 | Pending |
| DESIGN-04 | Phase 1 | Pending |
| INFRA-01 | Phase 2 | Pending |
| INFRA-02 | Phase 2 | Pending |
| INFRA-03 | Phase 2 | Pending |
| INFRA-04 | Phase 2 | Pending |
| INFRA-05 | Phase 2 | Pending |
| BOARD-01 | Phase 2 | Pending |
| BOARD-02 | Phase 2 | Pending |
| BOARD-03 | Phase 2 | Pending |
| BOARD-04 | Phase 2 | Pending |
| BOARD-05 | Phase 2 | Pending |
| EXEC-01 | Phase 2 | Pending |
| EXEC-02 | Phase 2 | Pending |
| EXEC-03 | Phase 2 | Pending |
| EXEC-04 | Phase 2 | Pending |
| TRACK-01 | Phase 3 | Pending |
| TRACK-02 | Phase 3 | Pending |
| OUT-01 | Phase 3 | Pending |
| OUT-02 | Phase 3 | Pending |
| OUT-03 | Phase 3 | Pending |
| PANEL-01 | Phase 3 | Pending |
| PANEL-02 | Phase 3 | Pending |
| CRON-01 | Phase 4 | Pending |
| CRON-02 | Phase 4 | Pending |
| CTX-01 | Phase 4 | Pending |
| BRAND-01 | Phase 4 | Pending |
| SKILL-01 | Phase 4 | Pending |
| CLIENT-01 | Phase 5 | Pending |
| CLIENT-02 | Phase 5 | Pending |
| UI-01 | Phase 2 | Pending |
| UI-02 | Phase 2 | Pending |

**Coverage:**
- v1 requirements: 34 total
- Mapped to phases: 34
- Unmapped: 0

---
*Requirements defined: 2025-03-25*
*Last updated: 2025-03-25 — revised DESIGN requirements to reflect Stitch prompt output (not design files)*
