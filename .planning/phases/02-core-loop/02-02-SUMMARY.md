---
phase: 02-core-loop
plan: 02
subsystem: process-management, api
tags: [child-process, claude-cli, stream-json, queue-watcher, instrumentation, sse]

# Dependency graph
requires:
  - phase: 02-01-foundation-api
    provides: SQLite DB, event bus, task types, config, REST API routes
provides:
  - Claude CLI process spawning with stream-json parsing
  - Live cost/tokens/activity label extraction from Claude output
  - Automatic task execution when status enters 'queued'
  - Task cancellation with clean SIGTERM/SIGKILL process teardown
  - Server startup initialization via Next.js instrumentation hook
  - Execute and cancel API endpoints
affects: [02-03-kanban-ui, 03-agent-integration]

# Tech tracking
tech-stack:
  added: []
  patterns: [singleton-process-manager, stream-json-parser, queue-watcher-event-pattern, instrumentation-hook-init, throttled-progress-events]

key-files:
  created:
    - projects/briefs/command-centre/src/lib/claude-parser.ts
    - projects/briefs/command-centre/src/lib/process-manager.ts
    - projects/briefs/command-centre/src/lib/queue-watcher.ts
    - projects/briefs/command-centre/src/instrumentation.ts
    - projects/briefs/command-centre/src/app/api/tasks/[id]/execute/route.ts
    - projects/briefs/command-centre/src/app/api/tasks/[id]/cancel/route.ts
    - projects/briefs/command-centre/scripts/test-parser.ts
  modified: []

key-decisions:
  - "ClaudeOutputParser as stateful class with feedLine method for stream processing"
  - "ProcessManager singleton with Map<taskId, ChildProcess> for concurrent session tracking"
  - "Throttle progress events to max 1/second to avoid flooding SSE clients"
  - "Queue watcher via event bus listener (not polling) for instant execution trigger"
  - "Next.js instrumentation.ts for server-startup initialization (avoids circular deps)"
  - "Cancelled tasks return to backlog with all runtime fields cleared"

patterns-established:
  - "Process lifecycle: queued -> running -> review (success) or review (error)"
  - "SIGTERM first, SIGKILL after 5s timeout for clean process teardown"
  - "Dynamic import in instrumentation.ts to keep server-only code out of client bundles"
  - "Recovery pattern: scan for orphaned queued tasks on startup"

# Metrics
duration: 5min
completed: 2026-03-25
---

# Phase 2 Plan 2: Process Manager Summary

**Claude CLI process manager with stream-json parsing, queue watcher for auto-execution, and execute/cancel API endpoints**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-03-25T20:37:00Z
- **Completed:** 2026-03-25T20:41:49Z
- **Tasks:** 2
- **Files created:** 7

## Accomplishments
- ClaudeOutputParser extracts cost, tokens, and activity labels from Claude CLI stream-json output with malformed-line resilience
- ProcessManager singleton spawns Claude CLI sessions with concurrent tracking, throttled progress events, and clean shutdown
- Queue watcher auto-triggers execution when tasks enter 'queued' status via event bus (no polling)
- Server startup initializes queue watcher via Next.js instrumentation hook with queued-task recovery
- Execute/cancel API endpoints with proper error codes (409 for already running, 400 for not running)
- Parser verified with 14 fixture tests covering all message types and edge cases

## Task Commits

Each task was committed atomically:

1. **Task 1: Claude CLI process manager and output parser** - `0737c65` (feat)
2. **Task 2: Queue watcher, instrumentation, execute/cancel routes** - `213bfec` (feat)

## Files Created/Modified
- `projects/briefs/command-centre/src/lib/claude-parser.ts` - Stream-json parser with onProgress/onComplete/onError callbacks
- `projects/briefs/command-centre/src/lib/process-manager.ts` - Singleton managing Claude CLI child processes per task
- `projects/briefs/command-centre/src/lib/queue-watcher.ts` - Event listener triggering execution on queued status
- `projects/briefs/command-centre/src/instrumentation.ts` - Next.js server startup hook for queue watcher init
- `projects/briefs/command-centre/src/app/api/tasks/[id]/execute/route.ts` - Manual execution trigger endpoint (POST)
- `projects/briefs/command-centre/src/app/api/tasks/[id]/cancel/route.ts` - Task cancellation endpoint (POST)
- `projects/briefs/command-centre/scripts/test-parser.ts` - Parser fixture tests (14 assertions)

## Decisions Made
- **Stateful parser class:** ClaudeOutputParser tracks completion state to prevent duplicate result/error handling
- **1-second throttle on progress:** Prevents SSE flooding while still providing responsive live updates
- **Event-driven queue watcher:** Listens on event bus rather than DB polling -- instant trigger, no wasted queries
- **Instrumentation hook:** Next.js convention for server startup code, avoids circular import issues
- **Cancelled tasks to backlog:** All runtime fields (cost, tokens, duration, activity, error, timestamps) cleared on cancel

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- Parallel wave execution (02-03) had staged files that needed to be excluded from Task 2 commit -- resolved by resetting and restaging only task-specific files

## User Setup Required
None - no external service configuration required. Claude CLI must be in PATH for actual task execution.

## Next Phase Readiness
- Process manager ready for UI integration (02-03 kanban board can trigger execute/cancel)
- SSE events flow: process manager emits task:status and task:progress through event bus
- All API endpoints verified working (build passes, routes recognized, curl tests successful)
- Queue watcher auto-initializes on server startup with recovery for orphaned queued tasks

---
*Phase: 02-core-loop*
*Completed: 2026-03-25*
