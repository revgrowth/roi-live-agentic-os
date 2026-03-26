---
phase: 05-client-switching
plan: 02
subsystem: ui, api
tags: [zustand, persist, sse, client-switching, sidebar, scope-bar]

requires:
  - phase: 05-01
    provides: Client type, detectClients, getClientAgenticOsDir, clientId column in tasks table
provides:
  - Client switcher dropdown in sidebar with Root + all clients
  - Scope bar in header showing active client
  - Client-filtered GET /api/tasks endpoint
  - Client-aware POST /api/tasks (stores clientId)
  - Client-scoped process manager (runs Claude CLI in client directory)
  - Client-aware task store (fetchTasks/createTask include clientId)
  - Client-filtered SSE events
affects: [06-detail-panel, 07-cron-jobs]

tech-stack:
  added: [zustand/persist]
  patterns: [cross-store reading via getState(), upward-opening dropdown, localStorage persistence]

key-files:
  created:
    - projects/briefs/command-centre/src/store/client-store.ts
    - projects/briefs/command-centre/src/components/layout/client-switcher.tsx
    - projects/briefs/command-centre/src/components/layout/scope-bar.tsx
  modified:
    - projects/briefs/command-centre/src/app/api/tasks/route.ts
    - projects/briefs/command-centre/src/lib/process-manager.ts
    - projects/briefs/command-centre/src/components/layout/sidebar.tsx
    - projects/briefs/command-centre/src/components/layout/app-shell.tsx
    - projects/briefs/command-centre/src/store/task-store.ts
    - projects/briefs/command-centre/src/hooks/use-sse.ts

key-decisions:
  - "Cross-store reading via useClientStore.getState() for task store and SSE hook"
  - "Zustand persist middleware with partialize to only persist selectedClientId in localStorage"
  - "Upward-opening dropdown since switcher is at sidebar bottom"
  - "SSE client filtering at event handler level rather than server-side"

patterns-established:
  - "Cross-store pattern: stores read other stores via getState() for non-reactive reads"
  - "Scope bar pattern: conditional header bar for context indication"
  - "Upward dropdown pattern: absolute positioning with bottom: 100% for bottom-of-sidebar elements"

requirements-completed: [CLIENT-01, CLIENT-02]

duration: 3min
completed: 2026-03-26
---

# Phase 5 Plan 2: Client Switcher UI Summary

**Client switcher dropdown in sidebar with scope bar, client-filtered task API, client-scoped process manager, and SSE event filtering**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-26T12:13:46Z
- **Completed:** 2026-03-26T12:17:14Z
- **Tasks:** 2
- **Files modified:** 10

## Accomplishments
- Task API GET/POST endpoints filter and store clientId for client-scoped task management
- Process manager spawns Claude CLI in client-specific directory when task has clientId
- Client switcher dropdown in sidebar with Tactile Editorial design, upward-opening dropdown, Root + all clients
- Scope bar in header shows active client name with "Switch to Root" link
- Selected client persists in localStorage across page refresh via Zustand persist middleware
- Task store and SSE events are client-aware, filtering by selected client

## Task Commits

Each task was committed atomically:

1. **Task 1: Client-scoped task API filtering and process manager** - `2981487` (feat)
2. **Task 2: Client switcher UI, scope bar, and client-scoped store wiring** - `811b817` (feat)

## Files Created/Modified
- `src/store/client-store.ts` - Zustand store with persist middleware for selected client state
- `src/components/layout/client-switcher.tsx` - Sidebar dropdown for switching between Root and clients
- `src/components/layout/scope-bar.tsx` - Header bar showing active client scope with switch-to-root
- `src/app/api/tasks/route.ts` - GET filters by clientId param, POST stores clientId from body
- `src/lib/process-manager.ts` - Spawns Claude CLI in client-specific directory
- `src/components/layout/sidebar.tsx` - Mounts ClientSwitcher at bottom with divider
- `src/components/layout/app-shell.tsx` - Mounts ScopeBar after header
- `src/store/task-store.ts` - fetchTasks/createTask include clientId from client store
- `src/hooks/use-sse.ts` - SSE events filtered by selected client

## Decisions Made
- Cross-store reading via `useClientStore.getState()` for non-reactive reads in task store and SSE hook
- Zustand persist with `partialize` to only persist `selectedClientId` (not full client list)
- Upward-opening dropdown (bottom: 100%) since the switcher sits at the bottom of the sidebar
- SSE client filtering done client-side at event handler level for simplicity

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## Known Stubs

None - all data sources are wired to live APIs.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Client switching fully functional for board view
- Ready for detail panel and cron job views to also respect client scope

---
*Phase: 05-client-switching*
*Completed: 2026-03-26*
