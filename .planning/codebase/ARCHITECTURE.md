# Architecture

**Analysis Date:** 2026-04-13

## Pattern Overview

**Overall:** Workspace-centric monolith with an embedded full-stack Next.js control panel

**Key Characteristics:**
- One repository plays two roles at once: operating system template and working application
- Local-first design with filesystem state, SQLite, and host scripts
- App Router API routes call shared libraries directly
- Scheduled automation is handled by a large local cron runtime, not a separate service

## Layers

**Workspace Layer:**
- Purpose: Holds shared instructions, skills, scripts, cron jobs, docs, and client workspaces
- Contains: `AGENTS.md`, `.claude/`, `.agents/`, `scripts/`, `cron/`, `context/`, `brand_context/`, `clients/`
- Depends on: Host machine tools and repo conventions
- Used by: Command centre, scripts, cron runtime, and Claude/GSD workflows

**Presentation Layer:**
- Purpose: Render the dashboard and interactive control views
- Contains: `src/app`, `src/components`, `src/hooks`, `src/store`
- Depends on: API routes, Zustand store, markdown renderers, and SSE updates
- Used by: Browser clients

**Application / Orchestration Layer:**
- Purpose: Coordinate tasks, scripts, file access, cron state, and workspace discovery
- Contains: `src/app/api/*`, `src/lib/*`
- Depends on: SQLite, filesystem access, subprocess spawning, and route-level input parsing
- Used by: UI actions, background sync, and scheduled automation

**Persistence / Execution Layer:**
- Purpose: Store durable state and run background jobs
- Contains: `src/lib/db.ts`, `src/lib/schema.sql`, `src/lib/cron-runtime.js`, shell scripts
- Depends on: `.command-centre/data.db`, local files, Claude CLI, Bash/PowerShell
- Used by: API routes, SSE updates, and cron management

## Data Flow

**Interactive UI Request:**
1. User opens the command centre in the browser
2. React components read/write state through Zustand stores
3. The store calls a Next.js API route under `src/app/api`
4. The route uses `src/lib/*` helpers for DB access, files, scripts, or cron work
5. Results return as JSON or stream data back over SSE

**Live Update Flow:**
1. Browser connects to `/api/events`
2. API route subscribes to the in-process event bus
3. Task or chat updates are emitted from server-side code
4. SSE pushes the update to connected clients
5. The client store reconciles local state

**Scheduled Job Flow:**
1. Cron scheduler discovers jobs from workspace folders
2. Runtime enqueues and tracks execution in SQLite
3. `cron-runtime.js` spawns Claude CLI with the configured prompt/job
4. Output is captured, stored, and linked back to the task or cron run
5. Event updates and UI refresh expose the result

**State Management:**
- Persistent state lives in SQLite
- Workspace content lives in the filesystem
- Short-lived live updates use an in-process EventEmitter
- Client-side state lives in Zustand stores

## Key Abstractions

**Workspace Root Detection:**
- Purpose: Decide which folder the system should treat as the Agentic OS root
- Examples: `getConfig()`, `getClientAgenticOsDir()`
- Pattern: Config discovery from marker files plus optional env override

**Task and Cron Records:**
- Purpose: Represent work items, logs, outputs, schedules, and execution history
- Examples: `tasks`, `task_logs`, `task_outputs`, `cron_runs`, `projects`
- Pattern: SQLite tables with additive migration logic in application code

**Command / Script Registry:**
- Purpose: Expose selected workspace scripts to the web UI
- Examples: `script-registry.ts`, `/api/settings/scripts/run`
- Pattern: Whitelist registry plus subprocess execution

**Client Workspace Scoping:**
- Purpose: Let one install manage multiple client sub-workspaces
- Examples: `clients.ts`, `clients/<slug>/...`
- Pattern: Shared root plus duplicated client-local context folders

## Entry Points

**Workspace Launcher:**
- Location: `scripts/centre.sh` and `scripts/centre.ps1`
- Triggers: User runs the launcher from the shell
- Responsibilities: Install dependencies when needed, start the Next.js app, and open the browser

**Web App Entry:**
- Location: `projects/briefs/command-centre/src/app/page.tsx`
- Triggers: Browser request to the command centre
- Responsibilities: Render tabs, connect to stores, and compose the main UI

**API Routes:**
- Location: `projects/briefs/command-centre/src/app/api/*`
- Triggers: Browser fetches or SSE connection
- Responsibilities: Task CRUD, events, files, context, settings scripts, cron data, and chat features

**Scheduled Automation:**
- Location: `src/lib/cron-runtime.js`, `src/lib/cron-scheduler.ts`, root cron scripts
- Triggers: In-process scheduler or shell scripts
- Responsibilities: Discover jobs, hold leadership, execute work, and persist status

## Error Handling

**Strategy:** Mixed and mostly local rather than centralized

**Patterns:**
- Helper libraries throw errors upward
- Route handlers perform inline validation and response shaping
- Logging relies heavily on `console.log` and `console.error`
- Operational scripts use defensive shell options like `set -euo pipefail`

## Cross-Cutting Concerns

**Configuration:**
- Rooted in `AGENTS.md`, `.claude/settings.json`, `.env`, and command-centre config files

**Validation:**
- Mostly ad hoc inside route handlers and utility functions

**Logging:**
- Console logging in app libraries and scripts
- Structured persistence in SQLite for task and cron activity

**Multi-Client Support:**
- Shared system at the root
- Client-specific context inside `clients/<slug>`
- The app switches context by choosing a client workspace path

*Architecture analysis: 2026-04-13*
