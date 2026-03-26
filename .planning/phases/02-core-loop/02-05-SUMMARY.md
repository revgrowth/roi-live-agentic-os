---
phase: 02-core-loop
plan: 05
status: complete
started: 2026-03-26
completed: 2026-03-26
gap_closure: true
---

## Summary

Fixed two UX/layout gaps from UAT: drag-and-drop now uses DragOverlay with a floating card clone and dashed placeholder, and the layout is fully responsive with a collapsible sidebar and reduced column widths. Also fixed an SSE duplicate race condition and drag reorder gaps discovered during human verification.

## Key Changes

### DragOverlay (UAT test 5)
- Added `DragOverlay` from `@dnd-kit/core` to `kanban-board.tsx` with `activeTask` state tracking
- `TaskCard` accepts `isOverlay` prop — overlay renders with elevated shadow, original renders as dashed placeholder
- Drop animation eases card into final position

### Collapsible Sidebar & Responsive Layout (UAT test 9)
- Sidebar collapses from 256px to 64px icon-only mode with chevron toggle
- Column `minWidth` reduced from 260px to 200px — all five columns fit without horizontal scrolling
- `AppShell` manages `sidebarCollapsed` state, passed to `Sidebar` via props

### Bug Fixes (discovered during UAT)
- SSE duplicate race condition: pending optimistic creates now reconcile with SSE events that arrive before the API response
- Drag reorder gaps: `moveTask` reindexes all `columnOrder` values in affected columns
- Delete is now optimistic with rollback on error

## Key Files

- `src/components/board/kanban-board.tsx` — DragOverlay, activeTask tracking
- `src/components/board/task-card.tsx` — isOverlay prop, placeholder rendering
- `src/components/layout/sidebar.tsx` — collapsed/onToggle props, icon-only mode
- `src/components/layout/app-shell.tsx` — sidebarCollapsed state
- `src/components/board/kanban-column.tsx` — minWidth 200px
- `src/store/task-store.ts` — SSE dedup fix, moveTask reindex, optimistic delete

## Deviations

- Added SSE duplicate fix and drag reorder fix (not in original plan) — discovered during human verification checkpoint
