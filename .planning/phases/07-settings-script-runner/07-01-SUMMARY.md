---
phase: 07-settings-script-runner
plan: 01
subsystem: ui, api
tags: [settings, env-parser, script-runner, ndjson-streaming, next-api-routes]

requires:
  - phase: 02-core-loop
    provides: file-service.ts atomic write pattern, config.ts getConfig()
provides:
  - Settings page skeleton with four-tab router
  - Sidebar Settings navigation entry with divider
  - env-parser library (parseEnv/serializeEnv)
  - script-registry library (11 script definitions, getScriptById)
  - GET/PUT API routes for .env, .mcp.json, .claude/settings.json
  - Script list GET API route
  - Script run POST API with NDJSON streaming
affects: [07-02, 07-03, 07-04]

tech-stack:
  added: []
  patterns:
    - "NDJSON streaming via ReadableStream + TextEncoder for script output"
    - "Module-level Set for script concurrency protection"
    - "Split navItems into mainNavItems/bottomNavItems with divider for sidebar sections"

key-files:
  created:
    - projects/briefs/command-centre/src/lib/env-parser.ts
    - projects/briefs/command-centre/src/lib/script-registry.ts
    - projects/briefs/command-centre/src/app/api/settings/env/route.ts
    - projects/briefs/command-centre/src/app/api/settings/mcp/route.ts
    - projects/briefs/command-centre/src/app/api/settings/claude-settings/route.ts
    - projects/briefs/command-centre/src/app/api/settings/scripts/route.ts
    - projects/briefs/command-centre/src/app/api/settings/scripts/run/route.ts
    - projects/briefs/command-centre/src/components/settings/settings-tabs.tsx
    - projects/briefs/command-centre/src/app/settings/page.tsx
  modified:
    - projects/briefs/command-centre/src/components/layout/sidebar.tsx

key-decisions:
  - "NDJSON streaming for script output instead of SSE — simpler for request-response script execution"
  - "Module-level Set for runningScripts concurrency — prevents same script running twice"
  - "Split sidebar navItems into main and bottom groups with visual divider"

patterns-established:
  - "Config file API pattern: GET returns {content, exists, lastModified}, PUT with atomic write + optimistic concurrency"
  - "JSON config routes validate with JSON.parse before saving, return 400 on invalid"

requirements-completed: [SETTINGS-01, SCRIPT-01]

duration: 2min
completed: 2026-03-26
---

# Phase 7 Plan 01: Settings Page Skeleton & API Routes Summary

**Settings page with four-tab router, sidebar entry, five API routes for config file editing and script execution with NDJSON streaming**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-26T18:08:38Z
- **Completed:** 2026-03-26T18:10:56Z
- **Tasks:** 2
- **Files modified:** 10

## Accomplishments
- Built env-parser and script-registry shared libraries for downstream tab UIs
- Created five API routes covering .env, .mcp.json, .claude/settings.json read/write, script listing, and script execution with live NDJSON streaming
- Added Settings page with four-tab component and sidebar navigation entry with visual divider

## Task Commits

Each task was committed atomically:

1. **Task 1: Lib modules, API routes, and script streaming endpoint** - `66a8cb4` (feat)
2. **Task 2: Settings page, tab bar component, and sidebar navigation** - `0c726ba` (feat)

## Files Created/Modified
- `src/lib/env-parser.ts` - Parse/serialize .env format preserving comments and blank lines
- `src/lib/script-registry.ts` - 11 script definitions with args, destructive flags, and getScriptById helper
- `src/app/api/settings/env/route.ts` - GET/PUT .env with atomic write and optimistic concurrency
- `src/app/api/settings/mcp/route.ts` - GET/PUT .mcp.json with JSON validation and atomic write
- `src/app/api/settings/claude-settings/route.ts` - GET/PUT .claude/settings.json with JSON validation and atomic write
- `src/app/api/settings/scripts/route.ts` - GET script registry listing
- `src/app/api/settings/scripts/run/route.ts` - POST script execution with NDJSON stdout/stderr/exit streaming
- `src/components/settings/settings-tabs.tsx` - Four-tab bar with lucide icons and terracotta active state
- `src/app/settings/page.tsx` - Settings page with AppShell and tab router
- `src/components/layout/sidebar.tsx` - Added Settings entry with visual divider separator

## Decisions Made
- Used NDJSON streaming (application/x-ndjson) for script output rather than extending SSE event bus — script execution is a simple request-response pattern, not a persistent subscription
- Module-level Set for runningScripts concurrency protection — prevents same script from running twice simultaneously
- Split sidebar navItems into mainNavItems and bottomNavItems with a visual divider to separate core navigation from utility items

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All five API routes are live and ready for tab UI components in Plans 02-04
- env-parser.ts ready for Environment tab key-value editor
- script-registry.ts ready for Scripts tab listing and execution UI
- Settings page container with tab router ready to receive tab content components

## Self-Check: PASSED

All 9 created files verified on disk. Both commit hashes (66a8cb4, 0c726ba) found in git log.

---
*Phase: 07-settings-script-runner*
*Completed: 2026-03-26*
