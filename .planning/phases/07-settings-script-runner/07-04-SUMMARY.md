---
phase: 07-settings-script-runner
plan: 04
subsystem: settings-ui
tags: [scripts, streaming, terminal, confirmation-dialog]
dependency_graph:
  requires: [07-01]
  provides: [script-list-ui, script-runner-ui, script-confirm-modal]
  affects: [settings-page]
tech_stack:
  added: []
  patterns: [ndjson-stream-reader, abort-controller-cleanup, arg-form-expansion]
key_files:
  created:
    - projects/briefs/command-centre/src/components/settings/script-confirm-modal.tsx
    - projects/briefs/command-centre/src/components/settings/script-runner.tsx
    - projects/briefs/command-centre/src/components/settings/script-list.tsx
  modified:
    - projects/briefs/command-centre/src/app/settings/page.tsx
decisions:
  - ScriptRunner uses fetch + getReader for NDJSON streaming instead of EventSource for simpler request-response pattern
  - Arg form expands inline below script card rather than modal to reduce dialog fatigue
  - Single runningScript state prevents concurrent script execution at UI level
metrics:
  duration: 2min
  completed: 2026-03-26T18:15:06Z
  tasks: 2
  files: 4
requirements_completed: [SCRIPT-02, SCRIPT-03, SCRIPT-04, SCRIPT-05]
---

# Phase 07 Plan 04: Script Runner Frontend Summary

Scripts tab with full execution UI: registry display, argument forms, destructive confirmation dialogs, and live NDJSON terminal streaming with auto-scroll.

## What Was Built

### ScriptConfirmModal (script-confirm-modal.tsx)
Destructive action confirmation dialog with AlertTriangle warning icon, red styling, description text, and "Run Anyway" / "Cancel" buttons. Backdrop click dismisses.

### ScriptRunner (script-runner.tsx)
Terminal-style output panel that streams script execution via NDJSON. Uses fetch with ReadableStream getReader and TextDecoder for live line parsing. Auto-scrolls output area. Shows running/success/error status with pulsing green dot animation. Displays exit code in footer. AbortController cleanup on unmount.

### ScriptList (script-list.tsx)
Main script management component. Fetches script registry from API, renders cards with labels, descriptions, destructive/long-running badges, and last-result indicators. Scripts with arguments expand inline arg forms with validation. Execution flow: Run click -> arg form (if needed) -> confirm modal (if destructive) -> ScriptRunner streaming. Only one script can run at a time (disabled buttons during execution).

### Settings Page Wiring
Scripts tab now renders ScriptList instead of placeholder text. Integrated alongside existing EnvEditor and JsonEditor tabs.

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| 1 | 4c666ce | ScriptConfirmModal and ScriptRunner components |
| 2 | a2730e7 | ScriptList component and Settings page wiring |

## Deviations from Plan

None - plan executed exactly as written.

## Known Stubs

None - all components are fully wired to the API endpoints from Plan 01.

## Self-Check: PASSED
