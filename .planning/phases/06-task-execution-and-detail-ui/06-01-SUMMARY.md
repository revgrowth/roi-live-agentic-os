---
phase: 06-task-execution-and-detail-ui
plan: 01
subsystem: api
tags: [claude-cli, stdin, sse, stream-json, question-detection]

requires:
  - phase: 02-core-loop-kanban-sse
    provides: process-manager, claude-parser, event-bus, task CRUD APIs
provides:
  - Task description field in types, schema, migration, and CRUD APIs
  - LogEntry and LogEntryType types for structured log streaming
  - Parser question detection with onQuestion callback
  - Parser tool_use and tool_result log entry emission
  - Process manager stdin pipe for two-way communication
  - replyToTask method for sending user input to running Claude process
  - In-memory log entry storage with getLogEntries accessor
  - POST /api/tasks/[id]/reply endpoint
  - task:question and task:log SSE event types
affects: [06-02, 06-03]

tech-stack:
  added: []
  patterns:
    - "detectQuestion heuristic for question-ending and common Claude patterns"
    - "SessionEntry wrapper type for ChildProcess + stdin tracking"
    - "In-memory log entry storage per task on ProcessManager"
    - "Prompt construction from title+description for richer task briefs"

key-files:
  created:
    - projects/briefs/command-centre/src/app/api/tasks/[id]/reply/route.ts
  modified:
    - projects/briefs/command-centre/src/types/task.ts
    - projects/briefs/command-centre/src/lib/schema.sql
    - projects/briefs/command-centre/src/lib/db.ts
    - projects/briefs/command-centre/src/lib/claude-parser.ts
    - projects/briefs/command-centre/src/lib/process-manager.ts
    - projects/briefs/command-centre/src/lib/event-bus.ts
    - projects/briefs/command-centre/src/app/api/tasks/route.ts
    - projects/briefs/command-centre/src/app/api/tasks/[id]/route.ts
    - projects/briefs/command-centre/src/store/task-store.ts

key-decisions:
  - "SessionEntry wrapper type instead of raw ChildProcess in sessions Map for stdin access"
  - "In-memory log entry storage on ProcessManager rather than SQLite for streaming performance"
  - "Question detection via last-line heuristic with question-mark and common Claude patterns"
  - "task:log event type added alongside task:question for fine-grained SSE streaming"

patterns-established:
  - "Two-way CLI communication: stdin pipe + question detection + reply API"
  - "Log entry emission pattern: parser emits LogEntry, ProcessManager stores and broadcasts"

requirements-completed: [EXEC-06-01, EXEC-06-02, EXEC-06-03]

duration: 5min
completed: 2026-03-26
---

# Phase 06 Plan 01: Task Execution Backend Summary

**Two-way Claude CLI communication with stdin pipe, question detection, structured log streaming, and reply API**

## Performance

- **Duration:** 5 min
- **Started:** 2026-03-26T14:37:36Z
- **Completed:** 2026-03-26T14:42:37Z
- **Tasks:** 2
- **Files modified:** 10

## Accomplishments
- Task description field added end-to-end: types, schema, migration, CRUD APIs, and store
- Parser extended with tool_use/tool_result handling and question detection heuristic
- Process manager switched from stdin:ignore to stdin:pipe with replyToTask method
- Reply API endpoint created for piping user input to running Claude processes
- Event bus extended with task:question and task:log event types

## Task Commits

Each task was committed atomically:

1. **Task 1: Extend types, schema, DB migration, and task API for description field** - `e09a749` (feat)
2. **Task 2: Extend parser with question detection, process manager with stdin pipe and reply, create reply API** - `ac1fa6b` (feat)

## Files Created/Modified
- `src/types/task.ts` - Added description field, LogEntry/LogEntryType types
- `src/lib/schema.sql` - Added description TEXT column
- `src/lib/db.ts` - Added description column migration
- `src/lib/event-bus.ts` - Added task:question, task:log event types and questionText field
- `src/app/api/tasks/route.ts` - POST accepts description in body and INSERT
- `src/app/api/tasks/[id]/route.ts` - PATCH allows description in allowedFields
- `src/store/task-store.ts` - createTask accepts description parameter
- `src/lib/claude-parser.ts` - onLogEntry/onQuestion callbacks, tool_use/tool_result handlers, detectQuestion
- `src/lib/process-manager.ts` - SessionEntry type, stdin pipe, replyToTask, log storage, handleQuestion
- `src/app/api/tasks/[id]/reply/route.ts` - POST endpoint for user replies

## Decisions Made
- Used SessionEntry wrapper type (proc + stdin) instead of raw ChildProcess in sessions Map for clean stdin access
- Stored log entries in-memory on ProcessManager rather than SQLite for streaming performance -- they are ephemeral per session
- Implemented question detection via last-line heuristic (ends with ? or matches common Claude question patterns)
- Added task:log event type alongside task:question for granular SSE log streaming

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed task-store.ts missing description field**
- **Found during:** Task 1 (TypeScript compilation)
- **Issue:** Adding description to Task interface caused TS2741 in task-store.ts optimistic create
- **Fix:** Added description field to tempTask and updated createTask signature to accept description parameter
- **Files modified:** src/store/task-store.ts
- **Verification:** TypeScript compiles without errors
- **Committed in:** e09a749 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Auto-fix necessary for TypeScript compilation. No scope creep.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Backend fully supports two-way task communication
- Frontend can now build task detail modal with live log streaming (plan 06-03)
- Reply mechanism ready for question/answer UI flow

---
*Phase: 06-task-execution-and-detail-ui*
*Completed: 2026-03-26*

## Self-Check: PASSED
- All 10 files verified on disk
- Both commit hashes (e09a749, ac1fa6b) verified in git history
