# Pitfalls Research

**Domain:** Locally hosted AI agent dashboard (Next.js + CLI subprocess spawning + SQLite + SSE)
**Researched:** 2026-03-25
**Confidence:** HIGH (most pitfalls verified through official docs, GitHub issues, and multiple sources)

## Critical Pitfalls

### Pitfall 1: Zombie Claude CLI Processes After Dashboard Close

**What goes wrong:**
The dashboard spawns Claude CLI as child processes via `child_process.spawn()`. When the dashboard process exits (crash, Ctrl+C, window close, uncaught exception), child processes are orphaned. They continue running invisibly, consuming CPU, potentially writing to files, and accumulating with each dashboard restart. Non-technical users have no way to detect or kill these processes. On macOS, Activity Monitor shows multiple `node` or `claude` processes with no obvious parent.

**Why it happens:**
Node.js does not automatically kill child processes when the parent exits. The OS reparents orphaned children to PID 1 (launchd on macOS). Most tutorials only show `spawn()` without cleanup. The problem compounds because Claude CLI sessions can run for minutes to hours on complex tasks.

**How to avoid:**
- Track all spawned PIDs in a Set or Map at the process level (not just in Zustand)
- Register cleanup on `process.on('exit')`, `SIGINT`, `SIGTERM`, and `uncaughtException`
- Use `tree-kill` package (not just `process.kill`) because Claude CLI may spawn its own subprocesses
- On startup, check for and offer to kill stale processes from a previous session (store PIDs in SQLite with dashboard session ID)
- Set a maximum lifetime per task type and auto-kill processes that exceed it

**Warning signs:**
- Users reporting "my Mac is slow" or "fan running constantly" after using the dashboard
- Multiple identical `claude` or `node` processes visible in Activity Monitor
- SQLite showing tasks in "Running" state from previous sessions that never completed

**Phase to address:**
Phase 1 (Core Infrastructure). Process lifecycle management must be built into the subprocess spawning layer from day one. Retrofitting cleanup into an existing spawn system is error-prone.

---

### Pitfall 2: better-sqlite3 Native Module Breaks npx Distribution

**What goes wrong:**
better-sqlite3 is a native C++ addon that requires compilation or prebuilt binaries matching the exact Node.js version and platform. When distributed via npx, users hit: NODE_MODULE_VERSION mismatches (compiled for Node 20 but user has Node 22), build failures when prebuilt binaries are unavailable, Python virtual environment conflicts that break `npm rebuild`, and pnpm/yarn users getting different native module resolution. The Claude Code team hit this exact issue (GitHub issue #1367) and ultimately abandoned better-sqlite3 for distribution, switching to a single compiled binary.

**Why it happens:**
Native addons are compiled against a specific Node.js ABI version. The npm prebuilt binary system works for common configurations but fails silently for edge cases. Non-technical users do not have build tools (Xcode CLT, Python, node-gyp) installed and cannot debug compilation errors.

**How to avoid:**
- **Option A (recommended for v1):** Use better-sqlite3 for local dev but accept that npx distribution will be fragile. Require a specific Node.js version range in `engines` field and fail fast with a clear message if mismatched.
- **Option B (recommended for distribution):** Use `sql.js` (pure WASM SQLite, zero native dependencies) which works everywhere but is slower for writes. Or use Node.js 22+ built-in `node:sqlite` (experimental, zero deps).
- **Option C:** Use `@libsql/sqlite3` which provides a better-sqlite3-compatible API with Rust-based bindings and better prebuilt binary coverage.
- Regardless of choice, test installation on a clean macOS machine with only Node.js (no Xcode CLT, no Python) as part of CI.

**Warning signs:**
- Installation takes more than 30 seconds (native compilation happening)
- Users report "gyp ERR!" or "Could not locate the bindings file" errors
- Works on your machine, fails on a test machine with a different Node version

**Phase to address:**
Phase 1 (Database Setup). The SQLite driver choice is foundational. Switching later means migrating schema code, changing sync/async patterns, and retesting everything. Decide on distribution-safe driver before writing any database code.

---

### Pitfall 3: Next.js Silently Buffers SSE Responses

**What goes wrong:**
Next.js applies gzip compression by default, and its response handling waits for the route handler to complete before sending data. SSE streams appear to work in development but deliver all events in a single burst (or not at all) because: the compression middleware buffers chunks waiting for enough content to compress, the `res.write()` calls are held until `res.end()`, and `Content-Encoding: gzip` defeats streaming entirely.

**Why it happens:**
SSE requires unbuffered, chunked responses. Next.js is optimized for request-response, not streaming. The default middleware chain includes compression which is fundamentally incompatible with SSE. This is a well-documented issue (Next.js Discussion #48427, Issue #9965) with workarounds but no built-in fix.

**How to avoid:**
- Use Route Handlers (not Pages API routes) with `export const dynamic = 'force-dynamic'`
- Set headers: `Content-Type: text/event-stream`, `Cache-Control: no-cache, no-transform`, `Connection: keep-alive`, `Content-Encoding: none`, `X-Accel-Buffering: no`
- Return a `Response` with `ReadableStream` immediately; start async work after return
- Disable compression globally for SSE routes in `next.config.js` or selectively via `Content-Encoding: none`
- Send a heartbeat comment (`: heartbeat\n\n`) every 15 seconds to keep the connection alive
- Build a proof-of-concept SSE route before committing to the architecture; test with actual Claude CLI output volume

**Warning signs:**
- Events arrive in bursts instead of one-by-one
- First event only appears after the task completes
- Works in dev mode but breaks in production build (`next build && next start`)
- Browser EventSource shows connection open but no events received

**Phase to address:**
Phase 1 (Core Infrastructure). SSE streaming must be validated as a working pattern in the actual Next.js setup before building any features on top of it. Build a minimal proof: spawn a process, stream stdout lines to the browser via SSE, confirm they arrive incrementally.

---

### Pitfall 4: Claude CLI Requires PTY for Interactive Features

**What goes wrong:**
Claude CLI may use interactive terminal features (color codes, progress indicators, prompt confirmations, terminal width detection). When spawned with `child_process.spawn()` using pipe stdio, the CLI detects it is not in a TTY and may: disable color output (cosmetic), skip interactive prompts and fail silently, behave differently in non-interactive mode, or truncate output that was formatted for terminal width. More critically, if Claude CLI expects user confirmation for certain operations (permission prompts, tool approvals), a piped stdin cannot relay these from the dashboard UI.

**Why it happens:**
`spawn()` with `{ stdio: 'pipe' }` creates pipes, not pseudo-terminals. Many CLI tools check `process.stdout.isTTY` and change behavior accordingly. Claude CLI is designed as an interactive terminal tool, not a headless subprocess.

**How to avoid:**
- Test Claude CLI behavior thoroughly in non-TTY mode before building the integration
- Use `node-pty` (native module from Microsoft, used by VS Code's terminal) to spawn Claude CLI in a pseudo-terminal if non-TTY mode is insufficient
- If using node-pty: note this adds another native dependency (same distribution problems as better-sqlite3)
- Pass `--no-interactive` or equivalent flags if Claude CLI supports them
- Design the subprocess layer as an abstraction that can switch between pipe mode and PTY mode
- Parse and strip ANSI escape codes from output before sending to the frontend

**Warning signs:**
- Claude CLI output looks different in dashboard vs terminal (missing formatting, truncated lines)
- Tasks that require tool approval hang indefinitely
- Claude CLI exits with code 1 but no error in stderr

**Phase to address:**
Phase 1 (Claude CLI Integration). This must be validated early because it affects the entire subprocess architecture. If PTY is required, it changes the native dependency story and distribution approach.

---

### Pitfall 5: Working Directory and Environment Context Loss

**What goes wrong:**
Claude CLI must run from within the agentic-os directory to inherit the full context stack (CLAUDE.md, skills, brand context, memory). If `cwd` is wrong, Claude starts without any of the agentic-os personality, skills, or brand context. The user sees generic Claude behavior instead of their configured agent. This is invisible to the user and hard to debug because Claude still "works" -- it just loses everything that makes it useful.

**Why it happens:**
The dashboard is a separate application from the agentic-os directory. The `cwd` option in `spawn()` must be explicitly set to the agentic-os path. If the user configures the path incorrectly, or the path has spaces (common on macOS: `/Users/John Smith/Projects/agentic-os`), or the path is relative and the dashboard's own cwd shifts, the spawn fails or runs in the wrong directory. Environment variables like `PATH` also need careful handling.

**How to avoid:**
- Validate the configured agentic-os path on startup: check that `CLAUDE.md` exists at the path
- Always use absolute paths for `cwd`, never relative
- Quote/escape paths properly (spaces in macOS usernames are common)
- After spawning, verify context is loaded by checking early CLI output or using a canary mechanism
- Show the configured path prominently in the UI Settings tab
- On first run, auto-detect if the dashboard is inside an agentic-os directory and pre-fill the path

**Warning signs:**
- Claude responses are generic (no brand voice, no skill routing)
- "File not found" errors in Claude CLI output referencing agentic-os paths
- Tasks that should trigger skills instead run as plain Claude conversations

**Phase to address:**
Phase 1 (Configuration and CLI Integration). Path configuration and validation must be built into the initial setup flow.

---

### Pitfall 6: SQLite Write Contention Under Concurrent Tasks

**What goes wrong:**
Multiple Claude CLI processes run simultaneously, each updating task status, registering output files, and logging token counts via the REST API. SQLite allows only one writer at a time. Without WAL mode and proper busy timeout configuration, concurrent writes produce "database is locked" errors. Tasks appear stuck, status updates are lost, and the UI shows stale data.

**Why it happens:**
SQLite's default journal mode uses exclusive file locking for writes. Even in WAL mode, writes are serialized (one at a time). If write transactions are long-running (wrapping multiple inserts without committing), they block all other writers. The REST API handler may hold a write transaction open across multiple async operations.

**How to avoid:**
- Enable WAL mode immediately on database creation: `PRAGMA journal_mode=WAL`
- Set busy timeout: `PRAGMA busy_timeout=5000` (5 seconds)
- Keep write transactions as short as possible: insert, commit, done. Never hold a write transaction across async work
- Use a single database connection for writes (serialized write queue) and separate connections for reads
- Batch related writes into single transactions (e.g., update task status + register output file in one transaction)
- Use `better-sqlite3`'s synchronous API which naturally avoids holding transactions across async boundaries

**Warning signs:**
- "SQLITE_BUSY" or "database is locked" errors in API logs
- Task status in UI not updating even though the CLI process is running
- Intermittent failures that only appear when multiple tasks run simultaneously

**Phase to address:**
Phase 1 (Database Setup). WAL mode and connection management patterns must be established before any feature code writes to the database.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Polling instead of SSE for live updates | Simpler to implement, no streaming issues | Higher server load, delayed updates, battery drain on laptops | Never for running task output; acceptable for low-frequency data like cron status |
| Storing task output in SQLite BLOBs | Single storage location, simple queries | Database bloat, slow backups, cannot preview files in filesystem | Never -- store file paths in SQLite, files on disk |
| Hardcoding agentic-os file conventions | Faster initial development | Breaks when agentic-os conventions change (they will) | Only in MVP if you extract to a config layer before Phase 2 |
| Skipping process cleanup on crash | Faster to ship v1 | Zombie processes accumulate, users blame the dashboard | Never -- this is critical for non-technical users |
| Inline SQL strings throughout codebase | Faster initial development | Unmaintainable, SQL injection risk from task descriptions | Only in Phase 1 prototype; extract to a data access layer before Phase 2 |
| Single SQLite connection for everything | Simpler connection management | Write contention blocks reads, UI freezes during heavy writes | Only acceptable in Phase 1 if task concurrency is limited to 1 |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Claude CLI subprocess | Passing `env: { CUSTOM_VAR: 'value' }` which **replaces** the entire environment (loses PATH, HOME, etc.) | Use `env: { ...process.env, CUSTOM_VAR: 'value' }` to merge with existing environment |
| Claude CLI subprocess | Using `exec()` instead of `spawn()` for long-running processes | `exec()` buffers all output in memory; `spawn()` streams it. Claude sessions can produce megabytes of output |
| SQLite from Next.js API routes | Opening a new database connection per request | Open once at module scope, reuse across requests. better-sqlite3 connections are synchronous and safe to share |
| SSE from Next.js | Using Pages API routes (`/pages/api/`) for SSE | Use App Router Route Handlers (`/app/api/`) with `ReadableStream` -- Pages API routes have worse streaming support |
| File system watching | Using `fs.watch()` for output file detection | `fs.watch()` is unreliable across platforms. Use `chokidar` or have Claude CLI explicitly register files via the REST API |
| Agentic-os path config | Accepting user input without validation | Validate on save: check path exists, contains CLAUDE.md, is readable. Show inline validation in settings UI |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Reading entire output files for preview | UI freezes when previewing large markdown files | Read first 200 lines for preview, full file only on explicit "View Full" action | Files over 1MB (common for research outputs) |
| Unbounded SSE event history in memory | Dashboard memory grows continuously during long sessions | Ring buffer for recent events (last 1000), persist to SQLite, load on reconnect | After ~2 hours of continuous task streaming |
| Scanning agentic-os directory tree on every request | API response times degrade as project grows | Cache directory structure with file watcher invalidation, refresh on explicit action | Projects with 500+ files in output directories |
| No pagination on task history | Board view slows as completed tasks accumulate | Archive completed tasks after 30 days, paginate history views, virtual scrolling for lists | After ~200 completed tasks |
| SQLite checkpoint starvation in WAL mode | WAL file grows unbounded, eventually slowing all operations | Schedule periodic checkpoints (`PRAGMA wal_checkpoint(TRUNCATE)`) during idle periods | After days of continuous use without restart |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Passing unsanitized task descriptions to CLI via shell | Command injection: user types `; rm -rf /` as a task title and it executes | Always use `spawn()` with argument array, never `exec()` with string interpolation. Task descriptions go via stdin or temp file, never as shell arguments |
| Exposing the REST API on 0.0.0.0 instead of localhost | Anyone on the local network can create tasks, read outputs, and control Claude CLI | Bind exclusively to `127.0.0.1`. No LAN access. Add a startup warning if the user explicitly overrides this |
| Storing API keys or .env contents in SQLite | Database file is unencrypted and easily readable | Never read or store .env contents. The dashboard reads file metadata only, not secrets. Claude CLI handles its own env |
| No rate limiting on task creation | Runaway script or accidental double-click spawns unlimited Claude processes | Cap concurrent running processes (default: 3). Queue excess tasks in "Queued" column |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Showing raw CLI output with ANSI codes | Users see `\e[1m\e[32m` garbage instead of readable text | Strip ANSI codes before display. Optionally render basic formatting (bold, color) in a styled component |
| No feedback during task startup (2-5 second delay) | User thinks click did not register, clicks again, spawns duplicate | Immediately move card to "Running" with a spinner. Show "Starting Claude..." placeholder before first output arrives |
| Error messages using technical language | "ENOENT: no such file or directory" means nothing to non-technical users | Map common errors to human messages: "Could not find your Agentic OS folder. Check the path in Settings." |
| Requiring terminal for initial setup | Defeats the entire purpose of the dashboard | Setup wizard in the browser: detect agentic-os path, verify installation, configure settings. Only require terminal for `npx` launch command |
| No indication of cost before running a task | Users surprised by API spend after running expensive tasks | Show estimated cost range based on task type/skill before confirming. Show running cost total in real time on the task card |
| Silent task failures | Task fails but card stays in "Running" forever | Detect process exit codes, timeout thresholds, and stderr patterns. Move failed tasks to a visible "Failed" state with human-readable error summary |

## "Looks Done But Isn't" Checklist

- [ ] **SSE streaming:** Test with `next build && next start` (production mode), not just `next dev`. Compression behavior differs between dev and production.
- [ ] **Process cleanup:** Kill the dashboard process with `kill -9` (not graceful shutdown) and verify no Claude processes survive. Repeat with multiple running tasks.
- [ ] **Path with spaces:** Test with an agentic-os path containing spaces (e.g., `/Users/John Smith/My Projects/agentic-os`). Both spawn cwd and file operations must handle this.
- [ ] **Concurrent writes:** Run 3+ tasks simultaneously that all update status at the same moment. Verify no "database is locked" errors.
- [ ] **SSE reconnection:** Kill the SSE connection (browser DevTools > Network > close connection). Verify the client reconnects and receives missed events.
- [ ] **Long-running tasks:** Run a task that takes 10+ minutes. Verify SSE connection stays alive (heartbeats working), output continues streaming, and no timeout kills the process.
- [ ] **Output file encoding:** Test with output files containing Unicode, emoji, and special characters in both filename and content.
- [ ] **Cold start performance:** Time from `npx` command to usable dashboard. Target: under 10 seconds. Native module compilation can add 60+ seconds.
- [ ] **Browser refresh during task:** Refresh the page while a task is running. Verify the task card reappears in "Running" with output resuming (from SSE reconnection + SQLite state).
- [ ] **Disk full:** Fill the disk and verify SQLite writes fail gracefully with a user-facing message, not a crash.

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Zombie processes accumulated | LOW | Add a "Kill All Running" button in dashboard. On startup, scan for orphaned processes by checking stored PIDs against running processes |
| SQLite database corrupted | MEDIUM | Implement automatic WAL checkpoint on clean shutdown. Keep daily SQLite backups (copy with `.backup` API). Provide a "Reset Database" option that preserves the agentic-os project data |
| Wrong agentic-os path configured | LOW | Add a "Test Connection" button in Settings that verifies CLAUDE.md exists and lists detected skills/clients. Re-run setup wizard if path is wrong |
| SSE connection permanently broken | LOW | Client-side: detect EventSource error state, show "Reconnecting..." banner, fall back to polling after 3 failed reconnection attempts. Provide manual "Refresh Connection" button |
| Native module build failure on install | HIGH | If better-sqlite3 fails, cannot recover without build tools. Prevention is the only strategy: choose a distribution-safe SQLite driver or bundle prebuilt binaries for all target platforms |
| Task stuck in "Running" state | LOW | Add a manual "Force Stop" button per task card. On dashboard startup, check all "Running" tasks against actual process list and move orphans to "Failed" |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Zombie processes | Phase 1: Core Infrastructure | Kill dashboard with `kill -9` during multi-task run; verify zero orphaned processes |
| Native module distribution | Phase 1: Database Setup | Run `npx` install on clean macOS (no Xcode CLT) and clean Ubuntu; both succeed |
| SSE buffering in Next.js | Phase 1: Core Infrastructure | Production build streams events incrementally (not batched) with 3+ concurrent SSE connections |
| Claude CLI PTY requirements | Phase 1: CLI Integration | Claude CLI spawned from dashboard produces identical behavior to terminal usage (skills, brand voice, permissions) |
| Working directory context loss | Phase 1: CLI Integration | Task run from dashboard uses correct brand voice and triggers skills, verified by output inspection |
| SQLite write contention | Phase 1: Database Setup | 5 simultaneous task status updates complete without SQLITE_BUSY errors |
| Raw ANSI output in UI | Phase 2: Task UI | All CLI output renders as clean readable text with no escape code artifacts |
| No startup feedback | Phase 2: Task UI | Card moves to "Running" within 200ms of click, before Claude CLI even starts |
| Silent task failures | Phase 2: Task UI | Process exit code > 0 moves card to "Failed" with error summary within 2 seconds |
| Error messages too technical | Phase 2: Task UI | Every known error code maps to a human-readable message; unknown errors show "Something went wrong" with a details expander |
| Cost visibility | Phase 3: Analytics | Running cost displayed on task card; historical cost per task in detail panel |
| Stale process detection on startup | Phase 1: Core Infrastructure | Dashboard startup checks for PIDs from previous sessions and offers cleanup |

## Sources

- [Node.js child_process documentation](https://nodejs.org/api/child_process.html) -- spawn options, environment inheritance, pipe behavior
- [better-sqlite3 distribution issue #1367](https://github.com/WiseLibs/better-sqlite3/issues/1367) -- Claude Code team's experience distributing native modules via npm
- [Next.js SSE Discussion #48427](https://github.com/vercel/next.js/discussions/48427) -- compression buffering workarounds
- [Next.js SSE Issue #9965](https://github.com/vercel/next.js/issues/9965) -- long-standing SSE streaming problems in API routes
- [SSE Production Readiness (DEV Community)](https://dev.to/miketalbot/server-sent-events-are-still-not-production-ready-after-a-decade-a-lesson-for-me-a-warning-for-you-2gie) -- proxy buffering, corporate network failures
- [SQLite WAL mode documentation](https://sqlite.org/wal.html) -- concurrency model, checkpoint behavior
- [SQLite concurrent writes and locking](https://tenthousandmeters.com/blog/sqlite-concurrent-writes-and-database-is-locked-errors/) -- write serialization, busy timeout strategies
- [node-pty (Microsoft)](https://github.com/microsoft/node-pty) -- PTY spawning for interactive CLI tools
- [Auto-Claude zombie process issue #1252](https://github.com/AndyMik90/Auto-Claude/issues/1252) -- process cleanup failures in similar Claude-spawning projects
- [libsql/sqlite3 as better-sqlite3 alternative](https://github.com/tursodatabase/libsql-js) -- distribution-friendly SQLite driver
- [Node.js built-in SQLite module](https://blog.logrocket.com/using-built-in-sqlite-module-node-js/) -- zero-dependency option in Node 22+

---
*Pitfalls research for: Agentic OS Command Centre -- locally hosted AI agent dashboard*
*Researched: 2026-03-25*
