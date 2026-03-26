---
phase: 03-outputs-and-monitoring
plan: 01
subsystem: ui, api, database
tags: [chokidar, react-markdown, sse, file-watcher, sqlite, glassmorphism]

# Dependency graph
requires:
  - phase: 02-core-loop
    provides: "Event bus, SSE infrastructure, ProcessManager, task-store, TaskCard, KanbanBoard"
provides:
  - "task_outputs SQLite table for output file tracking"
  - "FileWatcher service using chokidar for real-time file detection"
  - "OutputFile TypeScript type and task:output event type"
  - "GET /api/tasks/[id]/outputs endpoint"
  - "GET /api/files/preview endpoint with path traversal protection"
  - "GET /api/files/download endpoint"
  - "OutputChips component for file badges on task cards"
  - "FilePreviewModal with glassmorphism overlay and markdown/CSV/text rendering"
  - "Store: outputFiles state, fetchOutputFiles, selectedTaskId, openPanel, closePanel"
affects: [03-outputs-and-monitoring plan 02, detail panel, cron outputs]

# Tech tracking
tech-stack:
  added: [chokidar, react-markdown]
  patterns: [file-watcher-singleton, path-traversal-protection, glassmorphism-modal]

key-files:
  created:
    - "src/lib/file-watcher.ts"
    - "src/app/api/tasks/[id]/outputs/route.ts"
    - "src/app/api/files/preview/route.ts"
    - "src/app/api/files/download/route.ts"
    - "src/components/board/output-chips.tsx"
    - "src/components/board/file-preview-modal.tsx"
  modified:
    - "src/lib/schema.sql"
    - "src/types/task.ts"
    - "src/lib/event-bus.ts"
    - "src/lib/process-manager.ts"
    - "src/instrumentation.ts"
    - "src/hooks/use-sse.ts"
    - "src/store/task-store.ts"
    - "src/components/board/task-card.tsx"

key-decisions:
  - "Chokidar v4 API (named exports) used for file watching"
  - "1MB max preview size for inline file viewing"
  - "Previewable extensions: md, txt, csv, json, html, log"
  - "Path traversal double-check: reject .. in raw path AND verify resolved path starts with agenticOsDir"
  - "Store selectedTaskId/openPanel/closePanel defined now for plan 03-02 detail panel"
  - "Kept existing distance:8 activation constraint (functionally equivalent to plan's distance:5)"

patterns-established:
  - "File watcher singleton pattern: start/stop per task lifecycle"
  - "Path traversal protection: double-check (raw string + resolved path)"
  - "Glassmorphism modal: rgba(252,249,247,0.8) + blur(12px) overlay"
  - "Output chips: terracotta badges (#FFDBCF/#390C00) with file icon"

requirements-completed: [OUT-01, OUT-02, OUT-03, TRACK-01]

# Metrics
duration: 6min
completed: 2026-03-26
---

# Phase 3 Plan 1: Output File Detection and Preview Summary

**Chokidar file watcher detecting output files in real time, three file APIs with path traversal protection, OutputChips on task cards, and glassmorphism FilePreviewModal with markdown/CSV/text rendering**

## Performance

- **Duration:** 6 min
- **Started:** 2026-03-26T11:40:16Z
- **Completed:** 2026-03-26T11:46:00Z
- **Tasks:** 2
- **Files modified:** 14

## Accomplishments
- End-to-end output file pipeline: FileWatcher detects new files during task execution, stores in task_outputs table, emits task:output SSE events, updates frontend store, renders chips on cards
- Three file API endpoints with consistent path traversal protection (double-check pattern)
- Glassmorphism preview modal rendering markdown (react-markdown), CSV (HTML table), and text/JSON/HTML/log (monospace pre) with download option
- Store pre-wired with selectedTaskId/openPanel/closePanel for plan 03-02 detail panel

## Task Commits

Each task was committed atomically:

1. **Task 1: Schema, types, event bus, file watcher, and file APIs** - `d227b4f` (feat)
2. **Task 2: SSE/store extension, output chips on cards, and inline file preview modal** - `d43f195` (feat)

## Files Created/Modified
- `src/lib/file-watcher.ts` - Chokidar-based singleton watching projects/ dir per task
- `src/lib/schema.sql` - Added task_outputs table with FK to tasks
- `src/types/task.ts` - Added OutputFile interface
- `src/lib/event-bus.ts` - Added task:output to TaskEventType union
- `src/lib/process-manager.ts` - Integrated fileWatcher start/stop into task lifecycle
- `src/instrumentation.ts` - Added fileWatcher cleanup on shutdown
- `src/app/api/tasks/[id]/outputs/route.ts` - GET endpoint listing task output files
- `src/app/api/files/preview/route.ts` - GET endpoint for inline file preview (1MB max)
- `src/app/api/files/download/route.ts` - GET endpoint for file download
- `src/hooks/use-sse.ts` - Added task:output to SSE event listeners
- `src/store/task-store.ts` - Added outputFiles, fetchOutputFiles, selectedTaskId, openPanel, closePanel, getOutputFiles
- `src/components/board/output-chips.tsx` - Terracotta file chip badges
- `src/components/board/file-preview-modal.tsx` - Glassmorphism modal with markdown/CSV/text preview
- `src/components/board/task-card.tsx` - Integrated OutputChips and FilePreviewModal

## Decisions Made
- Used chokidar v4 named exports (`watch`, `FSWatcher`) instead of v3 default import
- Kept existing `distance: 8` activation constraint on PointerSensor (plan specified 5, but 8 was already in place and works correctly)
- Defined selectedTaskId/openPanel/closePanel in store now (empty state) to prepare for plan 03-02 detail panel

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed chokidar v4 API incompatibility**
- **Found during:** Task 1 (File watcher creation)
- **Issue:** Plan assumed chokidar v3 API (`import chokidar from 'chokidar'`, `chokidar.FSWatcher` namespace). chokidar v4 uses named exports.
- **Fix:** Changed to `import { watch, type FSWatcher } from 'chokidar'` and fixed error handler type from `Error` to `unknown`
- **Files modified:** src/lib/file-watcher.ts
- **Verification:** TypeScript compiles cleanly
- **Committed in:** d227b4f (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Necessary API adaptation for installed chokidar version. No scope creep.

## Issues Encountered
None beyond the chokidar v4 API difference.

## User Setup Required
None - no external service configuration required.

## Known Stubs
None - all data flows are wired end-to-end.

## Next Phase Readiness
- Output file pipeline complete and ready for plan 03-02 (detail panel, cost tracking)
- Store already has selectedTaskId/openPanel/closePanel scaffolded for detail panel
- All APIs functional with proper error handling and security

---
*Phase: 03-outputs-and-monitoring*
*Completed: 2026-03-26*

## Self-Check: PASSED
- All 6 created files verified on disk
- Both task commits (d227b4f, d43f195) found in git log
- TypeScript compiles cleanly (tsc --noEmit)
- Next.js build succeeds with all routes registered
