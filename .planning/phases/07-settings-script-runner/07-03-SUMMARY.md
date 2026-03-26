---
phase: 07-settings-script-runner
plan: 03
subsystem: ui
tags: [json-editor, settings, mcp, claude-settings, validation, textarea]

requires:
  - phase: 07-settings-script-runner
    provides: API routes for .mcp.json and .claude/settings.json (Plan 01)
provides:
  - Reusable JsonEditor component with JSON.parse validation and inline error display
  - MCP tab wired to /api/settings/mcp
  - Claude Settings tab wired to /api/settings/claude-settings
affects: []

tech-stack:
  added: []
  patterns:
    - "Reusable JsonEditor component with configurable apiEndpoint, title, description, emptyMessage props"
    - "Client-side JSON validation with approximate line number extraction from parse error position"
    - "Optimistic concurrency via lastModified header on config file saves"

key-files:
  created:
    - projects/briefs/command-centre/src/components/settings/json-editor.tsx
  modified:
    - projects/briefs/command-centre/src/app/settings/page.tsx

key-decisions:
  - "Monospace textarea with JetBrains Mono font instead of Monaco/CodeMirror — zero bundle cost, matches project minimal-dependency philosophy"
  - "Regex-based line number extraction from JSON.parse error position for user-friendly error messages"
  - "Create File button for non-existent config files initializes with empty JSON object"

patterns-established:
  - "JsonEditor reusable pattern: same component for any JSON config file, differentiated by apiEndpoint prop"

requirements-completed: [SETTINGS-04, SETTINGS-05, SETTINGS-06]

duration: 2min
completed: 2026-03-26
---

# Phase 7 Plan 03: JSON Editor for MCP and Claude Settings Summary

**Reusable JsonEditor component with real-time JSON.parse validation, approximate line number errors, and optimistic concurrency — wired into MCP and Claude Settings tabs**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-26T18:12:58Z
- **Completed:** 2026-03-26T18:15:30Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Built reusable JsonEditor component with JSON.parse validation on every keystroke
- Inline error display with approximate line number extraction from parse error position
- Wired MCP and Claude Settings tabs to their respective API endpoints with full edit/save flow

## Task Commits

Each task was committed atomically:

1. **Task 1: Reusable JsonEditor component** - `ab4d1d7` (feat)
2. **Task 2: Wire JsonEditor into MCP and Claude Settings tabs** - `49da7f5` (feat)

## Files Created/Modified
- `src/components/settings/json-editor.tsx` - Reusable JSON textarea editor with validation, error display, save with concurrency, and create-file flow
- `src/app/settings/page.tsx` - Added JsonEditor import and conditional rendering for mcp and claude tabs

## Decisions Made
- Used monospace textarea with JetBrains Mono instead of Monaco/CodeMirror — zero new dependencies, consistent with project philosophy
- Extract approximate line number from JSON.parse error position via regex on the error message, counting newlines up to that position
- Create File button for non-existent configs initializes with `{}` — lets users create .mcp.json or settings.json from the UI

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- JsonEditor component is fully reusable for any future JSON config editing needs
- MCP and Claude Settings tabs are functional with validation and save
- Scripts tab placeholder remains for Plan 04

## Self-Check: PASSED

All created files verified on disk. Both commit hashes (ab4d1d7, 49da7f5) found in git log.

---
*Phase: 07-settings-script-runner*
*Completed: 2026-03-26*
