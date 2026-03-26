---
phase: 05-client-switching
plan: 01
subsystem: api, database
tags: [multi-client, filesystem-detection, sqlite-migration, nextjs-api]

requires:
  - phase: 02-core-loop
    provides: Task types, DB schema, config module, API route patterns
provides:
  - Client type definition with deterministic color assignment
  - Client filesystem detection module (detectClients, getClientDir)
  - GET /api/clients endpoint
  - clientId column on tasks table with auto-migration
  - getClientAgenticOsDir config helper
affects: [05-02 board scoping UI, 05-03 view scoping]

tech-stack:
  added: []
  patterns: [djb2 hash for deterministic color, PRAGMA table_info migration pattern]

key-files:
  created:
    - projects/briefs/command-centre/src/types/client.ts
    - projects/briefs/command-centre/src/lib/clients.ts
    - projects/briefs/command-centre/src/app/api/clients/route.ts
  modified:
    - projects/briefs/command-centre/src/lib/config.ts
    - projects/briefs/command-centre/src/lib/db.ts
    - projects/briefs/command-centre/src/lib/schema.sql
    - projects/briefs/command-centre/src/types/task.ts
    - projects/briefs/command-centre/src/app/api/tasks/route.ts
    - projects/briefs/command-centre/src/store/task-store.ts

key-decisions:
  - "djb2 hash algorithm for deterministic client color assignment from slug"
  - "PRAGMA table_info migration pattern for adding clientId column safely"

patterns-established:
  - "Client detection via filesystem scan of clients/ directory"
  - "Auto-migration pattern: check column existence via PRAGMA before ALTER TABLE"

requirements-completed: [CLIENT-01]

duration: 5min
completed: 2026-03-26
---

# Phase 05 Plan 01: Client Foundation Summary

**Client type definitions, filesystem detection scanning clients/ directory, GET /api/clients endpoint, and SQLite auto-migration adding clientId to tasks table**

## Performance

- **Duration:** 5 min
- **Started:** 2026-03-26T12:05:22Z
- **Completed:** 2026-03-26T12:10:00Z
- **Tasks:** 2
- **Files modified:** 9

## Accomplishments
- Client type with slug, name, path, and deterministic color from djb2 hash
- detectClients() scans agentic-os clients/ directory for subdirectories, returns Client array
- GET /api/clients endpoint returns detected client list as JSON
- clientId column auto-migrates onto tasks table with index for query performance
- getClientAgenticOsDir() helper resolves client-specific agentic-os directories

## Task Commits

Each task was committed atomically:

1. **Task 1: Client types, detection module, API endpoint, and config helper** - `c78b3c9` (feat)
2. **Task 2: DB migration for clientId column and Task type update** - `8b9082a` (feat)

## Files Created/Modified
- `src/types/client.ts` - Client interface, getClientColor(), slugToName() helpers
- `src/lib/clients.ts` - detectClients() filesystem scan, getClientDir() resolver
- `src/app/api/clients/route.ts` - GET endpoint returning detected clients
- `src/lib/config.ts` - Added getClientAgenticOsDir() helper
- `src/lib/db.ts` - Auto-migration adding clientId column via PRAGMA check
- `src/lib/schema.sql` - Migration documentation comment
- `src/types/task.ts` - clientId field on Task, TaskCreateInput, TaskUpdateInput
- `src/app/api/tasks/route.ts` - Added clientId: null to task creation literal
- `src/store/task-store.ts` - Added clientId: null to optimistic task creation

## Decisions Made
- Used djb2 hash algorithm for deterministic client color assignment from slug string
- PRAGMA table_info migration pattern chosen because ALTER TABLE ADD COLUMN is not idempotent in SQLite

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed Task object literals missing clientId**
- **Found during:** Task 2 (DB migration and type update)
- **Issue:** Adding clientId to Task interface caused TS2741 errors in tasks/route.ts and task-store.ts where Task objects were constructed without clientId
- **Fix:** Added `clientId: null` to both Task object literals
- **Files modified:** src/app/api/tasks/route.ts, src/store/task-store.ts
- **Verification:** npx tsc --noEmit passes cleanly
- **Committed in:** 8b9082a (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Auto-fix was necessary for TypeScript compilation. No scope creep.

## Issues Encountered
- The git exclude file (``.git/info/exclude``) had a `clients/` rule that blocked adding `src/app/api/clients/route.ts`. Resolved with `git add -f`.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Client types and detection ready for Plan 02 (board scoping UI) to build client switcher component
- clientId column ready for Plan 03 (view scoping) to filter tasks by client
- GET /api/clients endpoint ready for frontend consumption

## Self-Check: PASSED

All 7 key files verified on disk. Both commit hashes (c78b3c9, 8b9082a) confirmed in git log.

---
*Phase: 05-client-switching*
*Completed: 2026-03-26*
