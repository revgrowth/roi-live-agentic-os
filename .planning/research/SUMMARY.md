# Project Research Summary

**Project:** Agentic OS Command Centre
**Domain:** Local-first AI agent dashboard (Kanban + process orchestration + real-time monitoring)
**Researched:** 2026-03-25
**Confidence:** HIGH

## Executive Summary

The Agentic OS Command Centre is a locally hosted web dashboard for non-technical business users to create, monitor, and retrieve outputs from Claude CLI agent sessions. The market is validated — multiple AI agent Kanban tools exist (Vibe Kanban, OpenClaw, AgentsBoard, Paperclip) — but every competitor targets developers managing coding agents. The gap for business users managing business outputs (content, reports, emails) is real and unoccupied. The recommended approach is Next.js 15 with SQLite persistence, server-sent events for real-time updates, and `child_process.spawn()` to orchestrate Claude CLI sessions. This stack is proven, local-only, and delivers the one-command install experience non-technical users require.

The critical architectural insight is the agent-first API pattern: Claude sessions running inside the agentic-os directory actively self-report status and register output files via REST endpoints. The dashboard is a window into the agentic-os context stack, not a replacement. Claude CLI must always be spawned with `cwd` set to the agentic-os path so it inherits CLAUDE.md, skills, brand context, and memory. Bypassing this — even via the Anthropic HTTP API directly — loses all the intelligence that makes the system valuable.

The highest risks are all in Phase 1: zombie processes when the dashboard exits unexpectedly, SSE buffering by Next.js compression middleware, and the native module compilation requirement for `better-sqlite3` complicating future npx distribution. All three must be solved before any feature work begins. The architecture research prescribes a clear build order — SQLite/Events first, then Process Manager, then Kanban UI — with a critical path of six phases. Following this order eliminates rework caused by dependency inversion.

## Key Findings

### Recommended Stack

The stack is well-specified and high-confidence. User-specified core choices (Next.js 15, Tailwind v4, Zustand) are validated as correct for the domain. Key additions from research: `better-sqlite3` with Drizzle ORM for type-safe synchronous SQLite access, native SSE via `TransformStream` for real-time updates (no socket.io needed), and `tree-kill` for safe process tree cleanup. React 19 ships with Next.js 15 and is compatible with all selected libraries.

**Core technologies:**
- **Next.js 15 + React 19**: Full-stack framework — ships together, App Router Route Handlers handle both REST and SSE with `runtime = 'nodejs'`
- **Tailwind CSS v4**: CSS-first configuration, no tailwind.config.js needed, 100x faster incremental builds
- **Zustand 5**: Client state — single store per domain, persist middleware for localStorage survival across refreshes
- **better-sqlite3 + Drizzle ORM**: Synchronous SQLite — zero async overhead, type-safe schema-as-code, `drizzle-kit push` for local dev
- **Native SSE via TransformStream**: Server-to-client push — no library, no WebSocket upgrade, auto-reconnects via EventSource
- **child_process.spawn() + tree-kill**: Process orchestration — stream-based stdout, kills entire process tree including Claude subprocesses
- **@dnd-kit**: Kanban drag-and-drop — actively maintained, React 19 compatible, replaces unmaintained react-beautiful-dnd
- **shadcn/ui**: Components — code-owned, not a dependency, compatible with Tailwind v4 + React 19

**Critical version warning:** Use `shadcn@latest` not `shadcn@2.3.0` (v3 only). Verify `@dnd-kit 6.x` React 19 compatibility on install.

### Expected Features

**Must have (table stakes — v1):**
- Kanban board with drag-and-drop across 5 fixed columns (Backlog/Queued/Running/Review/Done)
- Task creation with plain-language description — skill auto-routing behind the scenes
- Real-time task status updates via SSE — cards move automatically as agents self-report
- Output files listed on cards — files appear as agents register them
- Task detail slide-out panel — metadata, status, output files, inline markdown preview
- File download — non-negotiable for any file-producing tool
- Global stats bar — tasks running, completed today, today's spend
- Cost/token tracking per task — per-task granularity, not just global totals
- Configurable agentic-os path — settings page with validation against CLAUDE.md existence
- Clean light theme — business-friendly, no dev jargon, no terminal aesthetics

**Should have (competitive differentiators — v1.x):**
- Skill auto-routing from task description to skill frontmatter trigger phrases
- Three-level task hierarchy (Task/Project/GSD) with progress rollup
- Cron job scheduling with versioned output comparison (weekly/daily presets)
- Context/Brand/Skills read-only tabs — dashboard as a window into the full agentic-os
- Client switching — scopes all views to a client subfolder

**Defer (v2+):**
- GSD-level task management with .planning/ integration
- Semantic (embedding-based) skill routing
- Context/Brand inline editing
- npm publish / npx distribution
- Budget limits per task type
- Desktop notifications

**Deliberate anti-features — do not build:**
- Real-time log streaming (exposes terminal complexity to non-technical users)
- Git/diff/branch visibility (dev-focused, wrong audience)
- In-app output editing (scope creep into document editor territory)
- Custom Kanban columns (breaks agent state semantic meaning)
- Multi-user collaboration (requires auth, permissions, sync — out of scope for v1)

### Architecture Approach

The architecture is a single Next.js process with four logical layers: Browser (React + Zustand), API Layer (App Router Route Handlers), Server Services (Process Manager, Cron Scheduler, File System Integration), and Data Layer (SQLite + agentic-os directory). Communication between browser and server uses REST for mutations and a single multiplexed SSE stream for all push events. Server services communicate internally via a typed Node.js EventEmitter (event bus) that bridges subprocess events to the SSE route. SQLite owns dashboard state; the agentic-os filesystem owns project state. No bidirectional sync — clear ownership boundaries.

**Major components:**
1. **Process Manager** — singleton that spawns `claude` CLI via `spawn()`, tracks state machine per process (idle/starting/running/complete/failed/cancelled), emits typed events to event bus, cleans up on exit
2. **Event Bus** — in-process typed EventEmitter that decouples process events from SSE delivery; all server services emit here, SSE route subscribes
3. **SSE Route (`/api/events`)** — single endpoint, single connection per browser, multiplexes all task/cron/file events with taskId routing
4. **Zustand Store** — four domain stores (tasks, cron, events, UI); SSE event-store subscribes and dispatches to domain stores
5. **File System Integration** — reads agentic-os directory on-demand (skills, brand, memory, outputs); uses chokidar for output file watching; never writes except via Context/Brand editor
6. **Drizzle + SQLite** — synchronous queries via better-sqlite3, WAL mode from first init, global singleton with globalThis HMR guard

**Key pattern:** Singleton services attach to `globalThis` in development to survive Next.js hot module reloading. Essential — without this, ProcessManager resets on every file save and orphans running processes.

### Critical Pitfalls

1. **Zombie Claude CLI processes** — register SIGINT/SIGTERM/exit/uncaughtException handlers before any spawn; use `tree-kill` not `process.kill`; store PIDs in SQLite with session ID; on startup offer to kill stale PIDs from previous sessions. Never skip this — non-technical users cannot debug orphan processes.

2. **Next.js SSE buffering** — gzip compression silently batches SSE events. Fix: `Cache-Control: no-cache, no-transform`, `Content-Encoding: none`, `X-Accel-Buffering: no`; return `ReadableStream` immediately; start async work after returning Response. Validate SSE in production build (`next build && next start`) not just dev mode — they behave differently.

3. **better-sqlite3 native module distribution** — compiles C++ on install, breaks with Node.js version mismatches on clean machines. For v1 local dev this is acceptable; pin an `engines` Node range and fail fast. Before npx distribution, evaluate `@libsql/sqlite3` (Rust-based, better prebuilt coverage) or Node 22 built-in `node:sqlite`.

4. **Working directory context loss** — Claude CLI spawned without `cwd: agenticOsPath` produces generic Claude behavior with no skills, brand, or memory. Validate path on startup: check CLAUDE.md exists. Always use absolute paths. Show configured path prominently in Settings. Auto-detect on first run.

5. **Claude CLI PTY requirements** — spawning with pipe stdio may alter CLI behavior (no color, missed prompts, silent failures). Validate early: compare task output from dashboard vs terminal. Abstract the subprocess layer to support switching from pipe mode to `node-pty` if needed.

6. **SQLite write contention** — multiple concurrent tasks update status simultaneously. Enable WAL mode and `busy_timeout=5000` immediately on DB init. Keep write transactions short — never hold open across async work.

## Implications for Roadmap

Based on the build order prescribed in ARCHITECTURE.md and the dependency graph from FEATURES.md, six phases are recommended:

### Phase 1: Core Infrastructure
**Rationale:** Every other phase depends on these three systems: SQLite persistence, event bus + SSE streaming, and Claude CLI subprocess management. The architecture explicitly names this as the critical path. All six critical pitfalls must be addressed here — retrofitting process cleanup or SSE fixes into later phases creates rework.
**Delivers:** Working end-to-end: create task, spawn Claude CLI, receive SSE status update, see card update in real time, persist across refresh
**Addresses:** SQLite setup (WAL mode, connection singleton), event bus, SSE route, Process Manager with cleanup, agentic-os path config + validation
**Avoids:** Zombie processes, SSE buffering, write contention, working directory context loss

### Phase 2: Kanban Board + Task Creation
**Rationale:** With the core infrastructure proven, the primary user-facing feature can be built on a stable foundation. Skill auto-routing must be included here because it is required for task creation — it is not a differentiator to add later.
**Delivers:** Full Kanban board with drag-and-drop, task creation with plain-language description, skill auto-routing (keyword matching), task detail slide-out panel
**Uses:** @dnd-kit for DnD, shadcn/ui components, Zustand task-store subscribing to SSE
**Implements:** Kanban Board, Task Detail Panel, Task Card components at all three levels

### Phase 3: Output Management + Monitoring
**Rationale:** The core loop — describe, run, get output — is only complete when output files surface on cards. This phase delivers the output file watcher, inline preview, file download, and the global stats bar with cost tracking. Cost/token tracking must also land here since it requires agent self-reporting via the API.
**Delivers:** Output files on cards, inline markdown preview, file download, global stats bar, per-task cost/token tracking
**Implements:** File System Integration, output watcher, /api/files route, agent-first self-reporting endpoints

### Phase 4: File System Integration (Context/Brand/Skills)
**Rationale:** Read-only views into the agentic-os directory are low-risk, high-value differentiators that depend only on the File System Integration service built in Phase 3. They validate the multi-tab dashboard concept before adding the complexity of cron scheduling.
**Delivers:** Context tab, Brand tab, Skills browser tab — all read-only
**Uses:** agentic-os reader (skills.ts, brand.ts, memory.ts), file serving API

### Phase 5: Cron Scheduling + Run History
**Rationale:** Cron is a major differentiator but depends on Process Manager (Phase 1), task creation (Phase 2), and output management (Phase 3). It is the highest-complexity remaining feature and is explicitly gated as v1.x (post-validation).
**Delivers:** Cron job creation with schedule presets, run history view, output versioning for recurring tasks
**Implements:** Cron Scheduler (node-cron), Cron View, RunHistory component

### Phase 6: Client Switching + Multi-Client Scoping
**Rationale:** Client switching is a filter layer over everything built in Phases 1-5. Building it last means it is added to a stable system without disrupting any feature development. The clients.ts reader and client slug pattern are already in scope from architecture.
**Delivers:** Client switcher in nav, all views scoped to selected client, root view shows cross-client totals
**Implements:** ClientSwitcher component, client-aware API filtering, cron scoping per client

### Phase Ordering Rationale

- **Phases 1-3 are the critical path** — they deliver the core promise ("describe, watch, get output") and must ship together before any v1.x features are added
- **Phase 4 before Phase 5** because file system reading is low-risk and validates the multi-section dashboard layout before the complexity of cron scheduling
- **Phase 6 last** because client switching is a cross-cutting filter, not a standalone feature — it is much easier to add scoping to a working system than to build scoping in from the start
- **Skill auto-routing in Phase 2 not Phase 3** because FEATURES.md explicitly marks it as a required dependency of task creation, not an enhancement

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 1 (Claude CLI integration):** PTY vs pipe behavior needs empirical validation before committing. Test with actual Claude CLI headless mode early. GitHub issue #771 documents a known Node.js stdin workaround — verify it applies to the current Claude CLI version.
- **Phase 3 (Agent self-reporting):** The agent-first API requires Claude sessions to call REST endpoints via Bash tool. The exact mechanism (environment variable injection of the dashboard URL, CLAUDE.md instruction, or MCP tool) needs a decision with UX implications.
- **Phase 5 (Cron):** node-cron behavior with Next.js HMR needs verification — the singleton pattern with globalThis guard must extend to the cron scheduler or jobs fire multiple times in dev mode.

Phases with standard patterns (skip research-phase):
- **Phase 2 (Kanban):** @dnd-kit is well-documented, shadcn/ui patterns are established. Standard implementation.
- **Phase 4 (File system tabs):** Reading and displaying markdown files is a solved problem. No novel complexity.
- **Phase 6 (Client switching):** Query param scoping on API routes is standard. Client folder detection is already designed in architecture.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Core choices user-specified and verified against official docs. Library versions confirmed compatible. |
| Features | HIGH | Competitor analysis across 8+ existing tools validates the gap. Feature dependencies are explicit and consistent with architecture. |
| Architecture | HIGH | Primarily sourced from official docs (Next.js, Drizzle, Node.js, Claude Code docs). Two known GitHub issues (CLI spawn, Agent SDK overhead) confirmed with original issue threads. |
| Pitfalls | HIGH | Most pitfalls verified through official docs, GitHub issues, or documented failures in similar projects. Distribution pitfall (better-sqlite3) confirmed via Claude Code team's own experience. |

**Overall confidence:** HIGH

### Gaps to Address

- **Claude CLI headless output format:** Research references `--output-format stream-json` but the exact JSON schema for parsing progress, tool use, cost, and token data needs hands-on validation in Phase 1. Build a spike that parses live output before designing the Process Manager's parsing logic.
- **Agent self-reporting mechanism:** Research describes Claude calling `POST /api/tasks/[id]/status` via its Bash tool, but how the dashboard URL reaches the Claude session (environment variable? CLAUDE.md instruction?) is not fully specified. This needs a decision in Phase 1 before Phase 3 agent-first API design.
- **better-sqlite3 distribution path:** For v1 local dev this is fine. The decision point for switching to a distribution-safe driver (libsql or Node built-in sqlite) must happen before any npx/npm publish work begins. Flag this explicitly at the start of any Phase 7+ distribution work.
- **dnd-kit React 19 compatibility:** Research notes this was added in later 6.x releases — verify on install that the installed version includes the compatibility fix. If not, pin to a known-good 6.x minor.

## Sources

### Primary (HIGH confidence)
- [Next.js 15 release blog](https://nextjs.org/blog/next-15) — version confirmation, React 19 bundling
- [Next.js v16 upgrade guide](https://nextjs.org/docs/app/guides/upgrading/version-16) — breaking changes, Turbopack default
- [Claude Code headless mode docs](https://code.claude.com/docs/en/headless) — CLI spawn pattern, stdio behavior
- [Claude Agent SDK TypeScript reference](https://platform.claude.com/docs/en/agent-sdk/typescript) — SDK vs CLI tradeoffs
- [Claude CLI Node.js spawn issue #771](https://github.com/anthropics/claude-code/issues/771) — stdin workaround
- [Agent SDK 12s overhead issue #34](https://github.com/anthropics/claude-agent-sdk-typescript/issues/34) — performance caveat
- [Drizzle ORM SQLite quickstart](https://orm.drizzle.team/docs/quick-sqlite/better-sqlite3/) — driver setup, sync API
- [Tailwind CSS v4.0 release](https://tailwindcss.com/blog/tailwindcss-v4) — CSS-first config
- [shadcn/ui Next.js installation](https://ui.shadcn.com/docs/installation/next) — React 19 + Tailwind v4 compatibility
- [SQLite WAL mode documentation](https://sqlite.org/wal.html) — concurrency model
- [Node.js child_process docs](https://nodejs.org/api/child_process.html) — spawn vs exec tradeoffs
- [better-sqlite3 distribution issue #1367](https://github.com/WiseLibs/better-sqlite3/issues/1367) — native module distribution

### Secondary (MEDIUM confidence)
- [Next.js SSE discussion #48427](https://github.com/vercel/next.js/discussions/48427) — SSE buffering workarounds, community-verified
- [Vibe Kanban GitHub](https://github.com/BloopAI/vibe-kanban) — competitor feature reference
- [OpenClaw Dashboard](https://github.com/mudrii/openclaw-dashboard) — agent-first API pattern validation
- [Paperclip GitHub](https://github.com/paperclipai/paperclip) — budget enforcement and task hierarchy patterns
- [Auto-Claude zombie process issue #1252](https://github.com/AndyMik90/Auto-Claude/issues/1252) — process cleanup failures in similar projects
- [Long-running tasks with Next.js](https://dev.to/bardaq/long-running-tasks-with-nextjs-a-journey-of-reinventing-the-wheel-1cjg) — ProcessManager + SSE integration pattern

### Tertiary (LOW confidence)
- [ansi-to-html npm](https://www.npmjs.com/package/ansi-to-html) — ANSI rendering; needs validation against actual Claude CLI output format

---
*Research completed: 2026-03-25*
*Ready for roadmap: yes*
