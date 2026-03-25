# Architecture Research

**Domain:** Local-first AI agent dashboard (CLI process orchestrator + Kanban UI)
**Researched:** 2026-03-25
**Confidence:** HIGH

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        BROWSER (React + Zustand)                     │
│  ┌───────────┐  ┌───────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │  Kanban    │  │  Cron     │  │ Context/ │  │  Task Detail     │  │
│  │  Board     │  │  View     │  │ Brand/   │  │  Slide-out       │  │
│  │           │  │           │  │ Skills   │  │  Panel           │  │
│  └─────┬─────┘  └─────┬─────┘  └────┬─────┘  └───────┬──────────┘  │
│        │              │             │                │              │
│        └──────────────┴─────────────┴────────────────┘              │
│                              │                                       │
│                    Zustand Store (client state)                       │
│                              │                                       │
├──────────────────────────────┼───────────────────────────────────────┤
│                     SSE ↑    │ REST ↕                                 │
├──────────────────────────────┼───────────────────────────────────────┤
│                     NEXT.JS API LAYER (Route Handlers)               │
│  ┌────────────┐  ┌──────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ /api/tasks │  │ /api/cron│  │ /api/events  │  │ /api/files   │  │
│  │ CRUD       │  │ CRUD     │  │ SSE stream   │  │ FS read/serve│  │
│  └─────┬──────┘  └────┬─────┘  └──────┬───────┘  └──────┬───────┘  │
│        │              │               │                 │           │
├────────┴──────────────┴───────────────┴─────────────────┴───────────┤
│                        SERVER SERVICES                               │
│  ┌─────────────────┐  ┌─────────────┐  ┌────────────────────────┐   │
│  │ Process Manager │  │ Cron        │  │ File System            │   │
│  │ (Agent SDK or   │  │ Scheduler   │  │ Integration            │   │
│  │  CLI spawn)     │  │ (node-cron) │  │ (agentic-os reader)    │   │
│  └────────┬────────┘  └──────┬──────┘  └───────────┬────────────┘   │
│           │                  │                     │                │
├───────────┴──────────────────┴─────────────────────┴────────────────┤
│                        DATA LAYER                                    │
│  ┌──────────────────────────┐  ┌────────────────────────────────┐   │
│  │ SQLite (better-sqlite3)  │  │ Agentic OS Directory           │   │
│  │ via Drizzle ORM          │  │ (skills, brand, memory, output)│   │
│  │ tasks, runs, crons,      │  │ Read-only at runtime           │   │
│  │ settings, cost tracking  │  │                                │   │
│  └──────────────────────────┘  └────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

| Component | Responsibility | Communicates With |
|-----------|----------------|-------------------|
| **Kanban Board** | Task visualization, drag-drop state transitions, card rendering by level (Task/Project/GSD) | Zustand store, REST API |
| **Cron View** | Display scheduled jobs, run history, average cost/duration, active/paused toggle | Zustand store, REST API |
| **Context/Brand/Skills Tabs** | Read and edit agentic-os files (memory, brand context, skill definitions) | REST API -> File System Integration |
| **Task Detail Panel** | Slide-out showing full task info: progress, stats, output files, inline preview | Zustand store, REST API, SSE events |
| **Zustand Store** | Client-side state: board state, SSE event buffer, UI state, optimistic updates | React components, SSE stream |
| **REST API Routes** | CRUD for tasks/crons/settings, file serving, agent-callable endpoints for self-reporting | Process Manager, Drizzle/SQLite, File System |
| **SSE Event Stream** | Single `/api/events` endpoint pushing task status changes, output file notifications, cost updates | Process Manager (emits events), Zustand store (consumes) |
| **Process Manager** | Spawns Claude CLI processes, tracks lifecycle (starting/running/complete/failed), captures streaming output, extracts cost/token data | Claude Agent SDK or CLI subprocess, SSE emitter, SQLite |
| **Cron Scheduler** | Triggers tasks on schedule (node-cron), manages next-run times, handles missed runs | Process Manager, SQLite |
| **File System Integration** | Reads agentic-os directory structure: discovers skills, brand context, memory files, output conventions. Serves output files for preview/download | Agentic OS directory (read-only), REST API |
| **SQLite via Drizzle** | Persistence for tasks, run history, cron definitions, cost/token tracking, settings, output file registry | All server-side services |

## Recommended Project Structure

```
command-centre/
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── layout.tsx             # Root layout with nav, client switcher, global stats bar
│   │   ├── page.tsx               # Kanban board (default view)
│   │   ├── cron/
│   │   │   └── page.tsx           # Cron jobs view
│   │   ├── context/
│   │   │   └── page.tsx           # Context/memory viewer-editor
│   │   ├── brand/
│   │   │   └── page.tsx           # Brand context viewer-editor
│   │   ├── skills/
│   │   │   └── page.tsx           # Skills browser
│   │   ├── settings/
│   │   │   └── page.tsx           # Settings (agentic-os path, preferences)
│   │   └── api/
│   │       ├── tasks/
│   │       │   ├── route.ts       # GET (list), POST (create)
│   │       │   └── [id]/
│   │       │       ├── route.ts   # GET, PATCH, DELETE
│   │       │       ├── run/
│   │       │       │   └── route.ts   # POST (trigger execution)
│   │       │       └── outputs/
│   │       │           └── route.ts   # GET (list output files)
│   │       ├── cron/
│   │       │   ├── route.ts       # GET, POST
│   │       │   └── [id]/
│   │       │       └── route.ts   # PATCH, DELETE
│   │       ├── events/
│   │       │   └── route.ts       # GET (SSE stream)
│   │       ├── files/
│   │       │   └── route.ts       # GET (serve agentic-os files)
│   │       ├── skills/
│   │       │   └── route.ts       # GET (list installed skills)
│   │       ├── clients/
│   │       │   └── route.ts       # GET (list client workspaces)
│   │       └── settings/
│   │           └── route.ts       # GET, PATCH
│   ├── components/
│   │   ├── board/                 # Kanban board components
│   │   │   ├── Board.tsx
│   │   │   ├── Column.tsx
│   │   │   ├── TaskCard.tsx
│   │   │   └── TaskDetailPanel.tsx
│   │   ├── cron/                  # Cron view components
│   │   │   ├── CronList.tsx
│   │   │   └── RunHistory.tsx
│   │   ├── editor/                # Context/brand file editor
│   │   │   └── MarkdownEditor.tsx
│   │   ├── layout/                # Shell components
│   │   │   ├── NavBar.tsx
│   │   │   ├── ClientSwitcher.tsx
│   │   │   └── StatsBar.tsx
│   │   └── shared/                # Reusable UI primitives
│   │       ├── FilePreview.tsx
│   │       └── Badge.tsx
│   ├── lib/
│   │   ├── db/
│   │   │   ├── index.ts           # Drizzle client singleton
│   │   │   ├── schema.ts          # All table definitions
│   │   │   └── migrate.ts         # Auto-migration on startup
│   │   ├── process/
│   │   │   ├── manager.ts         # Process Manager — spawns and tracks Claude sessions
│   │   │   ├── event-bus.ts       # In-process event emitter (bridges process events to SSE)
│   │   │   └── output-watcher.ts  # Watches for new output files during task execution
│   │   ├── cron/
│   │   │   ├── scheduler.ts       # node-cron wrapper, manages all scheduled jobs
│   │   │   └── runner.ts          # Triggers task execution from cron
│   │   ├── agentic-os/
│   │   │   ├── reader.ts          # Reads agentic-os directory structure
│   │   │   ├── skills.ts          # Parses skill YAML frontmatter
│   │   │   ├── brand.ts           # Reads brand_context/ files
│   │   │   ├── memory.ts          # Reads context/memory/ files
│   │   │   └── clients.ts         # Discovers client workspaces
│   │   ├── sse/
│   │   │   └── stream.ts          # SSE response helper (ReadableStream factory)
│   │   └── config.ts              # Runtime configuration (agentic-os path, etc.)
│   ├── store/
│   │   ├── task-store.ts          # Zustand: tasks, board state
│   │   ├── cron-store.ts          # Zustand: cron jobs
│   │   ├── event-store.ts         # Zustand: SSE connection, event buffering
│   │   └── ui-store.ts            # Zustand: panel state, active client, filters
│   └── types/
│       ├── task.ts                # Task, Run, Output types
│       ├── cron.ts                # CronJob, CronRun types
│       ├── events.ts              # SSE event type discriminated union
│       └── agentic-os.ts          # Skill, BrandContext, MemoryFile types
├── drizzle/
│   └── migrations/                # Generated migration files
├── data/
│   └── command-centre.db          # SQLite database (gitignored)
├── drizzle.config.ts
├── next.config.ts
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

### Structure Rationale

- **`src/app/api/`:** API routes live inside the App Router. Agent-first design means Claude sessions call these endpoints to self-report status. Each resource gets its own directory with RESTful sub-routes.
- **`src/lib/`:** All server-side business logic. Separated by domain (process, cron, agentic-os, db) so each concern is isolated. This code never imports React — it runs only on the server.
- **`src/components/`:** Feature-grouped React components. Board, cron, editor, layout, and shared. No "atoms/molecules" — too abstract for a focused app.
- **`src/store/`:** Zustand stores split by domain. One store per concern avoids a monolithic state blob. Stores subscribe to SSE events for real-time updates.
- **`src/types/`:** Shared TypeScript types. Both client and server import from here.
- **`drizzle/`:** Migration files generated by `drizzle-kit`. Separate from src because they are artifacts, not source code.
- **`data/`:** SQLite database file location. Gitignored. Created on first run.

## Architectural Patterns

### Pattern 1: Event Bus for SSE Bridging

**What:** An in-process EventEmitter bridges server-side events (process lifecycle, output discovery) to the SSE response stream. All server services emit typed events to the bus. The SSE route handler subscribes and forwards them to connected clients.

**When to use:** Any time a server-side action needs to push a real-time update to the browser.

**Trade-offs:** Simple and zero-dependency (Node EventEmitter). Works because this is a single-process, single-user app. Would not scale to multi-instance, but that is out of scope.

**Example:**
```typescript
// lib/process/event-bus.ts
import { EventEmitter } from "events";
import type { SSEEvent } from "@/types/events";

class TaskEventBus extends EventEmitter {
  emit(event: "task-event", data: SSEEvent): boolean {
    return super.emit("task-event", data);
  }
  on(event: "task-event", listener: (data: SSEEvent) => void): this {
    return super.on("task-event", listener);
  }
}

export const eventBus = new TaskEventBus();

// api/events/route.ts
export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      const handler = (data: SSEEvent) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };
      eventBus.on("task-event", handler);
      // Clean up on close handled by AbortSignal
    },
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
```

### Pattern 2: Process Manager as State Machine

**What:** Each spawned Claude session is tracked as a state machine: `idle -> starting -> running -> complete | failed | cancelled`. The Process Manager owns all subprocess lifecycle and emits events on transitions.

**When to use:** Every task execution. The Process Manager is the single authority on what is running.

**Trade-offs:** Centralizes process control, prevents orphan processes. Adds complexity versus raw spawn-and-forget, but orphan processes would be a critical bug for a local app.

**Example:**
```typescript
// lib/process/manager.ts
type ProcessState = "idle" | "starting" | "running" | "complete" | "failed" | "cancelled";

interface ManagedProcess {
  taskId: string;
  state: ProcessState;
  pid?: number;
  startedAt?: Date;
  cost?: number;
  tokensUsed?: number;
}

class ProcessManager {
  private processes = new Map<string, ManagedProcess>();

  async spawn(taskId: string, prompt: string, cwd: string): Promise<void> {
    // Update state: starting
    // Spawn claude -p with --output-format stream-json
    // Parse streaming JSON for status, cost, token data
    // Update state: running -> complete/failed
    // Emit events to eventBus at each transition
  }

  cancel(taskId: string): void {
    // Kill subprocess, update state to cancelled
  }

  getRunning(): ManagedProcess[] {
    return [...this.processes.values()].filter(p => p.state === "running");
  }
}

export const processManager = new ProcessManager();
```

### Pattern 3: Two Integration Paths for Claude CLI

**What:** Support two approaches for spawning Claude, selectable by configuration:

1. **CLI spawn (recommended for v1):** Use `child_process.spawn("claude", ["-p", prompt, "--output-format", "stream-json", ...], { cwd: agenticOsPath, stdio: ["inherit", "pipe", "pipe"] })`. Parse the streaming JSON line-by-line for progress, cost, and token data.

2. **Agent SDK (future upgrade):** Use `@anthropic-ai/claude-agent-sdk` query() function with the agentic-os directory as cwd. Provides typed async generator output, session management, and structured message types.

**When to use:** Start with CLI spawn — it is simpler, well-documented, and avoids the ~12s cold-start overhead per query() call noted in Agent SDK issues. Migrate to Agent SDK when its performance improves or when session continuation features are needed.

**Trade-offs:**
- CLI spawn: simpler, proven, but requires parsing JSON streams manually. The `stdio: ["inherit", "pipe", "pipe"]` workaround is needed due to a known Node.js piping issue with Claude CLI.
- Agent SDK: typed output, session management, tool approval callbacks. But currently has ~12s overhead per call and is still maturing.

### Pattern 4: Agentic OS Directory as Read-Only Data Source

**What:** The dashboard reads the agentic-os directory structure at runtime to discover skills, brand context, memory files, output conventions, and client workspaces. It never writes to these files except through the Context/Brand editor (which writes directly to the file system, same as a text editor would).

**When to use:** Always. The agentic-os directory is the source of truth. The dashboard is a window into it, not a replacement.

**Trade-offs:** Requires file system watching for changes made by Claude sessions running in the background. `chokidar` or `fs.watch` can detect new output files. Avoids database-filesystem sync issues by treating the filesystem as authoritative.

### Pattern 5: Singleton Services via Module Scope

**What:** Server-side services (ProcessManager, EventBus, Cron Scheduler, Drizzle DB client) are instantiated as module-level singletons. In Next.js API routes, these modules are imported and share state within the Node.js process.

**When to use:** All server services. This works because the app is single-user, single-process.

**Trade-offs:** Next.js in dev mode has hot module reloading that can re-instantiate singletons. Mitigate by attaching to `globalThis` in development:

```typescript
// lib/db/index.ts
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as { db: ReturnType<typeof drizzle> };

export const db =
  globalForDb.db ??
  drizzle(new Database("data/command-centre.db"), { schema });

if (process.env.NODE_ENV !== "production") globalForDb.db = db;
```

## Data Flow

### Task Execution Flow (Primary)

```
User creates task (Kanban UI)
    │
    ▼
POST /api/tasks ──► SQLite: insert task (status: backlog)
    │
    ▼
User drags to "Queued" or clicks "Run"
    │
    ▼
POST /api/tasks/[id]/run
    │
    ▼
Process Manager: spawn("claude", ["-p", prompt, ...], { cwd: agenticOsPath })
    │
    ├── State: starting ──► eventBus.emit({ type: "task-status", status: "running" })
    │                              │
    │                              ▼
    │                        SSE /api/events ──► Zustand store ──► UI re-renders card
    │
    ├── Streaming JSON lines arrive on stdout:
    │   ├── Text deltas ──► eventBus.emit({ type: "task-progress", text })
    │   ├── Tool use events ──► eventBus.emit({ type: "task-tool-use", tool })
    │   └── Result message ──► extract cost, tokens, duration
    │
    ├── Output watcher detects new files in projects/ directory
    │   └── eventBus.emit({ type: "output-file", taskId, path, filename })
    │       │
    │       ▼
    │     SQLite: insert output file record
    │
    └── Process exits
        ├── Exit 0: state → complete, save run record to SQLite
        └── Exit !0: state → failed, save error to SQLite
                │
                ▼
          eventBus.emit({ type: "task-status", status: "complete" | "failed" })
                │
                ▼
          SSE ──► Zustand ──► Card moves to Review/Done column
```

### SSE Connection Flow

```
Browser opens EventSource("/api/events?client=root")
    │
    ▼
API route creates ReadableStream
    │
    ▼
eventBus.on("task-event") ──► filter by client scope ──► encode as SSE ──► push to stream
    │
    ▼
Zustand event-store receives events via onmessage callback
    │
    ├── "task-status" ──► task-store.updateStatus()
    ├── "task-progress" ──► task-store.updateProgress()
    ├── "output-file" ──► task-store.addOutput()
    ├── "cron-triggered" ──► cron-store.updateLastRun()
    └── "cost-update" ──► task-store.updateCost()
```

### Agent Self-Reporting Flow (Agent-First API)

```
Claude session running inside agentic-os directory
    │
    ▼
Claude calls dashboard API (via Bash tool or MCP tool):
    POST /api/tasks/[id]/status   { status: "running", progress: "Generating email copy..." }
    POST /api/tasks/[id]/outputs  { file: "projects/mkt-copywriting/2026-03-25_email.md" }
    │
    ▼
API route updates SQLite + emits to eventBus
    │
    ▼
SSE ──► Browser updates in real time
```

This agent-first pattern is critical: Claude sessions are not just passively monitored. They actively report their own status. The dashboard provides a simple REST API that Claude can call via its Bash tool. This is more reliable than parsing subprocess output alone.

### Cron Execution Flow

```
node-cron tick matches schedule
    │
    ▼
Cron scheduler looks up job definition in SQLite
    │
    ▼
Creates a new task run (linked to cron job)
    │
    ▼
Delegates to Process Manager (same as manual task execution)
    │
    ▼
Run history saved: duration, cost, tokens, output files
    │
    ▼
Cron view updates via SSE with run result
```

## Key Data Flows Summary

1. **Task lifecycle:** UI -> REST API -> Process Manager -> Claude CLI -> Event Bus -> SSE -> Zustand -> UI
2. **Agent self-report:** Claude session -> REST API -> SQLite + Event Bus -> SSE -> UI
3. **Cron trigger:** node-cron -> Cron Runner -> Process Manager -> (same as task lifecycle)
4. **File discovery:** Output Watcher (fs.watch) -> Event Bus -> SSE -> UI
5. **Context/Brand read:** UI -> REST API -> File System Integration -> agentic-os directory -> Response
6. **Client switching:** UI -> Zustand (active client) -> REST API requests scoped to client path -> filtered results

## Anti-Patterns

### Anti-Pattern 1: Custom Server Wrapping Next.js

**What people do:** Create an Express/Fastify server that wraps Next.js to manage subprocesses and cron.
**Why it is wrong:** Disables Next.js Automatic Static Optimization, complicates deployment, and breaks the one-command-start goal. Custom servers are officially discouraged by Vercel.
**Do this instead:** Use Next.js API Route Handlers (App Router) with `export const runtime = "nodejs"` for routes that need Node APIs. Singleton services live in `src/lib/` and are imported by route handlers. The Next.js dev server IS the server.

### Anti-Pattern 2: Polling Instead of SSE

**What people do:** Set up `setInterval` polling from the client to check task status every N seconds.
**Why it is wrong:** Wasteful, introduces latency proportional to poll interval, and creates unnecessary load. For a local app with real-time subprocess output, polling feels sluggish.
**Do this instead:** Single SSE connection per client. Event bus pushes updates instantly. Zustand store subscribes. If SSE disconnects, reconnect with exponential backoff (EventSource does this by default).

### Anti-Pattern 3: Storing Output Files in the Database

**What people do:** Read file contents into SQLite BLOBs or store full text in columns.
**Why it is wrong:** Files belong on the filesystem (agentic-os already manages them). Duplicating in SQLite wastes space, creates sync issues, and makes files inaccessible to Claude sessions.
**Do this instead:** Store file metadata in SQLite (path, filename, size, created timestamp, associated task). Serve the actual file from disk via `/api/files?path=...`. The filesystem is the source of truth for file content.

### Anti-Pattern 4: Running Claude via the Anthropic HTTP API Directly

**What people do:** Call the Anthropic Messages API from the dashboard, bypassing Claude CLI.
**Why it is wrong:** Loses all agentic-os context: CLAUDE.md instructions, skills, brand context, memory files, hooks, MCP servers. The entire value of Agentic OS is the context stack that Claude CLI loads automatically from the working directory.
**Do this instead:** Always spawn `claude` CLI (or use Agent SDK) with `cwd` set to the agentic-os directory. Claude CLI loads the full context stack. The dashboard orchestrates the CLI, never replaces it.

### Anti-Pattern 5: Bidirectional File Sync Between DB and Filesystem

**What people do:** Try to keep SQLite and the agentic-os filesystem in perfect sync with watchers and reconciliation loops.
**Why it is wrong:** Creates race conditions, missed events, and phantom state. Two sources of truth is zero sources of truth.
**Do this instead:** SQLite owns dashboard state (tasks, runs, cron schedules, settings). The filesystem owns agentic-os state (skills, brand, memory, output files). The dashboard reads the filesystem on-demand and caches briefly. No sync, no reconciliation — clear ownership boundaries.

## Integration Points

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Browser <-> API | REST (CRUD) + SSE (push) | SSE is read-only push. All mutations go through REST. |
| API Routes <-> Process Manager | Direct function calls (same process) | ProcessManager is a singleton imported by route handlers |
| API Routes <-> SQLite | Drizzle ORM queries (synchronous via better-sqlite3) | better-sqlite3 is synchronous — no connection pooling needed |
| Process Manager <-> Claude CLI | child_process.spawn with stdio piping | stdout: pipe (streaming JSON), stderr: pipe (errors), stdin: inherit |
| Process Manager <-> Event Bus | EventEmitter.emit() | Typed events, same-process |
| Event Bus <-> SSE Route | EventEmitter.on() inside ReadableStream | Listener registered per SSE connection, cleaned up on disconnect |
| File System Integration <-> Agentic OS dir | fs.readFile, fs.readdir, chokidar.watch | Read-only. Path resolved from runtime config, never hardcoded |

### External Integration: Claude CLI

| Aspect | Detail |
|--------|--------|
| Binary | `claude` (must be on PATH) |
| Invocation | `claude -p "{prompt}" --output-format stream-json --verbose --allowedTools "Read,Edit,Bash,..."` |
| Working directory | Set to configured agentic-os path |
| Stdin | `inherit` (workaround for known Node.js piping issue) |
| Stdout | `pipe` — streaming JSON lines parsed for progress, cost, tokens |
| Stderr | `pipe` — captured for error reporting |
| Session continuation | `--resume {sessionId}` for multi-turn tasks |
| Context loading | Automatic — Claude CLI reads CLAUDE.md, skills, brand, memory from cwd |

## Scaling Considerations

This is a single-user local application. "Scaling" means handling concurrent tasks gracefully, not horizontal scaling.

| Concern | 1-3 concurrent tasks | 5-10 concurrent tasks | 10+ concurrent tasks |
|---------|----------------------|-----------------------|----------------------|
| Process management | Map of processes, trivial | May need max-concurrency limit | Queue with configurable parallelism |
| SSE throughput | Single stream, no issue | Batch events if many rapid updates | Debounce/batch events per 100ms window |
| SQLite writes | Synchronous, trivial | WAL mode for concurrent reads during writes | WAL mode + write queue if contention appears |
| Memory (Node.js) | ~100-200MB total | Monitor per-process memory | Consider streaming output to disk vs memory |
| CPU (user's machine) | Claude CLI is the bottleneck, not the dashboard | Each Claude process uses significant CPU | Warn user, suggest limiting concurrency |

### Scaling Priorities

1. **First bottleneck:** Claude CLI processes consuming CPU/memory on the user's machine. Mitigation: configurable max concurrent tasks (default: 3). Queue additional tasks.
2. **Second bottleneck:** SQLite write contention if many cron jobs complete simultaneously. Mitigation: enable WAL mode on database init (`PRAGMA journal_mode=WAL`).

## Build Order Implications

Components have clear dependencies that dictate build order:

```
Phase 1: Foundation (no dependencies)
├── SQLite + Drizzle schema + migrations
├── Runtime config (agentic-os path)
├── Event bus
└── SSE route + client hook

Phase 2: Process Manager (depends on Phase 1)
├── Claude CLI spawn with streaming JSON parse
├── Process state machine
├── Event emission on state transitions
└── Basic task CRUD API routes

Phase 3: Kanban Board (depends on Phases 1-2)
├── Zustand task store + SSE subscription
├── Board, Column, Card components
├── Task creation + execution flow
└── Task detail panel with live updates

Phase 4: File System Integration (depends on Phase 1)
├── Agentic OS directory reader
├── Skills parser, brand reader, memory reader
├── Output file watcher
├── File serving API route

Phase 5: Cron System (depends on Phases 1-2)
├── node-cron scheduler
├── Cron CRUD API routes
├── Run history tracking
└── Cron view UI

Phase 6: Context/Brand/Skills Tabs (depends on Phase 4)
├── File editor components
├── Skills browser
└── Client switcher + multi-client scoping
```

The critical path is: SQLite/Events -> Process Manager -> Kanban UI. Everything else can be parallelized after Phase 2.

## Sources

- [Claude Code headless mode / programmatic usage](https://code.claude.com/docs/en/headless) — HIGH confidence (official docs)
- [Claude Agent SDK TypeScript reference](https://platform.claude.com/docs/en/agent-sdk/typescript) — HIGH confidence (official docs)
- [Claude CLI Node.js spawn issue #771](https://github.com/anthropics/claude-code/issues/771) — HIGH confidence (official GitHub issue, documents stdio workaround)
- [Agent SDK 12s overhead issue #34](https://github.com/anthropics/claude-agent-sdk-typescript/issues/34) — HIGH confidence (official GitHub issue)
- [Next.js App Router SSE discussion #48427](https://github.com/vercel/next.js/discussions/48427) — MEDIUM confidence (community-verified pattern)
- [Drizzle ORM + better-sqlite3 quickstart](https://orm.drizzle.team/docs/quick-sqlite/better-sqlite3/) — HIGH confidence (official docs)
- [Next.js custom server docs](https://nextjs.org/docs/pages/guides/custom-server) — HIGH confidence (official docs, confirms custom server is discouraged)
- [Claude Task Viewer](https://github.com/L1AD/claude-task-viewer) — MEDIUM confidence (reference project using file-watching + SSE pattern)
- [Next.js project structure](https://nextjs.org/docs/app/getting-started/project-structure) — HIGH confidence (official docs)

---
*Architecture research for: Agentic OS Command Centre*
*Researched: 2026-03-25*
