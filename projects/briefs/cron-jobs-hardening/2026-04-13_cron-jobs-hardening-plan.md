# Cron Jobs Hardening Implementation Plan

## Planning Summary

This plan extends the existing Command Centre project without creating a second top-level GSD project. The work is grouped into four workstreams because the user-facing problems look separate, but they all converge on the same cron runtime and multi-client boundaries.

## Workstream 1: CLI Cron UX

### Objective

Make the cron CLI scripts feel trustworthy and easy to understand for non-technical users.

### Scope

- Replace plain text output in cron scripts with structured, human-friendly output.
- Show runtime state, active leader, PID, workspace count, and next action hints.
- Make `logs` output easier to scan by adding headings, truncation rules, and guidance.

### Likely Touchpoints

- `scripts/start-crons.ps1`
- `scripts/status-crons.ps1`
- `scripts/logs-crons.ps1`
- `scripts/stop-crons.ps1`
- Shell equivalents in `scripts/*.sh`
- Shared formatting helpers if needed

### Acceptance

- `start-crons` clearly says whether it started a daemon or found one already running.
- `status-crons` reads like a status panel, not raw key-value dump.
- `logs-crons` shows recent daemon activity in a readable block with clear path hints.

### Notes

This should visually follow the tone of `scripts/install.sh`, but stay simpler and faster.

## Workstream 2: Runtime Ownership and Windows Background Behavior

### Objective

Keep the single-runtime leadership model, but make it visible and remove Windows console popups.

### Scope

- Surface runtime ownership clearly in CLI and UI.
- Keep daemon/UI coexistence safe through the existing lock-based leader model.
- Hide Windows console windows for daemon start and cron-triggered task execution.

### Confirmed Technical Direction

- Preserve the existing shared lock model in `.command-centre`.
- Do not introduce a second scheduler.
- Align cron daemon spawning on Windows with the UI task spawning strategy that already uses hidden-window options.

### Likely Touchpoints

- `projects/briefs/command-centre/scripts/cron-daemon.cjs`
- `projects/briefs/command-centre/src/lib/cron-runtime.js`
- `projects/briefs/command-centre/src/lib/cron-scheduler.ts`
- `projects/briefs/command-centre/src/lib/queue-watcher.ts`
- `projects/briefs/command-centre/src/app/api/cron/system-status/route.ts`

### Acceptance

- The system can clearly report whether the leader is `daemon`, `in-process`, or `stopped`.
- The UI and daemon may both exist as processes, but only one is leader at a time.
- Windows cron jobs launched from the CLI daemon do not open visible terminals.

## Workstream 3: Client Isolation and Cron Data Scoping

### Objective

Guarantee that client cron jobs stay inside the client workspace from execution through UI history.

### Scope

- Fix generated client cron wrappers so they target the shared Command Centre runtime correctly.
- Ensure client cron runs execute with an unambiguous client workspace contract.
- Prevent UI state collisions when two workspaces reuse the same cron slug.
- Ensure run history, source, logs, outputs, and manual-run actions remain client-aware end to end.

### Known Risks to Address

- Client scripts are currently copied from root and appear to resolve Command Centre paths incorrectly when run inside `clients/<slug>/scripts/`.
- The UI cron store uses `slug`-only keys for some local state, which can collide across clients.
- `updateJob` in the cron store currently bypasses the client query helper.
- A real client cron run already produced a root-level file while being stored as a client-scoped run.

### Likely Touchpoints

- `scripts/add-client.sh`
- Generated client cron wrappers under `clients/*/scripts/`
- `projects/briefs/command-centre/src/lib/cron-runtime.js`
- `projects/briefs/command-centre/src/store/cron-store.ts`
- `projects/briefs/command-centre/src/components/cron/cron-row.tsx`
- `projects/briefs/command-centre/src/components/cron/run-history.tsx`
- `projects/briefs/command-centre/src/app/api/cron/**`

### Acceptance

- Client cron wrappers work from inside the client workspace.
- A client cron run writes outputs only under `clients/<slug>/...`.
- The UI never mixes root and client history/log/source/output data for same-slug jobs.
- Manual run, edit, toggle, delete, source, history, and log actions all respect the selected client.

### Recommended Guardrails

1. Add explicit workspace instructions to cron task execution prompts for client jobs.
2. Key UI cron state by `workspaceKey + slug`, not by `slug` alone.
3. Add regression tests for same-slug jobs in root and client workspaces.

## Workstream 4: Verification and Rollout

### Objective

Prove the hardening work with realistic root/client scenarios before shipping.

### Verification Matrix

1. Root workspace daemon start/status/logs on macOS/Linux shell path.
2. Root workspace daemon start/status/logs on Windows PowerShell path.
3. UI-only runtime leadership with daemon stopped.
4. Daemon leadership while UI is also running.
5. Client cron job execution from the UI.
6. Client cron job execution from the CLI wrappers.
7. Same cron slug in root and client workspace without UI state collisions.
8. Windows daemon cron run with no visible terminal window.

### Recommended Tests

- Unit coverage for runtime status/leadership helpers.
- Regression coverage for client wrapper path resolution.
- Integration coverage for client-aware cron API routes and store behavior.
- Manual smoke test for a client cron output landing inside `clients/<slug>/projects/`.

## Sequencing

### Phase A: Stabilize the Runtime Contract

Start with runtime ownership and Windows behavior, because every other fix depends on understanding who is allowed to execute queued cron work.

### Phase B: Fix Client Isolation

Next, fix client wrapper resolution and client-aware state handling. This is the highest product-risk area because it can create silent cross-workspace leakage.

### Phase C: Polish the CLI UX

Once the runtime contract is stable, improve the CLI presentation around the now-correct behavior.

### Phase D: Verify End to End

Finish with regression coverage and smoke tests across root and client workspaces.

## Parallelization Notes

- Workstream 1 can begin in parallel with the early part of Workstream 2.
- Workstream 3 should wait until runtime ownership expectations are locked.
- Workstream 4 depends on all earlier workstreams.

## Definition of Done

This stream is done when:

1. Cron leadership is understandable.
2. Windows daemon execution is silent.
3. Client cron jobs are contained to the client workspace.
4. UI cron data is isolated per workspace.
5. CLI scripts are friendly enough that a user can operate cron without reading source code.
