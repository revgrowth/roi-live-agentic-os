# Architecture Research: Cron Hardening

**Domain:** Brownfield local-first multi-client workspace app  
**Researched:** 2026-04-13  
**Overall confidence:** HIGH

## Executive Summary

The current system is already close to the right shape. The hardening work should keep the same overall model and make it stricter, clearer, and more explicit:

- one leader per root workspace
- many workspace-scoped jobs
- one shared queue and database
- root-scoped control-plane state
- workspace-scoped execution, logs, status, and outputs

The biggest risk is not the scheduler itself. It is the mismatch between control-plane scope and execution scope.

## Current Evidence

- Leadership is already root-scoped and shared through `.command-centre/cron-runtime-lock.json`, daemon PID, and heartbeat.
- The UI queue watcher already skips queued cron execution when the daemon is the active leader.
- Cron job files, logs, and status files are already workspace-local.
- `cron_runs` already stores `clientId`.
- The UI store still keeps some state keyed only by `slug`.
- `updateJob()` still bypasses a client-aware query helper.
- Client scripts are copied into each client workspace and currently resolve the Command Centre path incorrectly.
- Child cron execution inherits root-level environment unless explicitly overridden.

## Recommended Architecture

### System Shape

Keep this structure:

- **Root workspace = control plane**
- **Root + each client workspace = execution/data plane**
- **One scheduler leader at a time**
- **One shared queue and database**
- **Workspace-local logs, status, prompts, and outputs**

### Root vs Client Boundaries

| Boundary | Root workspace owns | Client workspace owns |
|---|---|---|
| Runtime | `.command-centre/`, leader lock, daemon PID/log, SQLite, workspace discovery | Nothing runtime-global |
| Job definitions | `cron/jobs/` for root jobs | `clients/<id>/cron/jobs/` |
| Job logs | `cron/logs/` for root jobs | `clients/<id>/cron/logs/` |
| Job status files | `cron/status/` for root jobs | `clients/<id>/cron/status/` |
| Prompt context | root `AGENTS.md`, `brand_context/`, `context/` | client-local equivalents |
| Outputs | root `projects/`, `brand_context/`, `context/` for root jobs only | same folders under the client workspace for client jobs only |

**Decision:** do not create per-client `.command-centre/` state.

## Component Boundaries

| Component | Responsibility | Root-scoped? | Notes |
|---|---|---:|---|
| Runtime ownership service | leader claim, heartbeat, stale lock recovery, daemon PID/log | Yes | single source of truth |
| Workspace resolver | map `clientId -> workspaceDir`, derive `workspaceKey` | Yes | shared utility |
| Cron scheduler | sweep schedules, catch-up, dedupe, enqueue | Yes | only leader schedules |
| Cron queue executor | drain queued cron tasks | Yes, leader-only | UI host or daemon host can own it |
| Job execution adapter | spawn Claude in the correct workspace | No | must receive explicit workspace contract |
| Job log/status writer | write per-job logs and status | No | always workspace-local |
| Cron API read model | return jobs/history/log/source/status | Yes | always filter by `clientId` |
| UI cron store | cache and merge cron state | No | keys must include workspace identity |
| Client script adapters | forward commands to root runtime | No | adapters only, never local runtime owners |

## Canonical Identities

| Thing | Canonical identity |
|---|---|
| Runtime owner | root workspace path + runtime identifier |
| Workspace | `workspaceKey = root` or `workspaceKey = <clientId>` |
| Job | `jobKey = ${workspaceKey}:${slug}` |
| Run | `cronRun.id` |
| Task | `task.id` with `clientId` on the task row |
| UI localStorage keys | must include `workspaceKey` |

## Queue Execution Model

### Rule

Every cron execution should enter through the same queue contract.

### Implications

1. Scheduled runs enqueue a task plus `cron_runs` row.
2. UI “Run now” enqueues a manual cron task.
3. CLI `run-job` should also enqueue instead of bypassing.
4. Only the current leader drains queued cron tasks.
5. Non-leader hosts may stay alive, but they do not execute cron queue work.

## Execution Environment Contract

Separate:

- `runtimeRoot`: the root Agentic OS workspace
- `jobWorkspaceDir`: the root or client workspace where the job actually runs

Job processes must use `jobWorkspaceDir` as the real execution scope:

- `cwd = jobWorkspaceDir`
- prompt instructions name the selected workspace
- output scanning stays inside `jobWorkspaceDir`
- inherited root-scoped env must not silently re-root the job

**Recommendation:** override child-process `AGENTIC_OS_DIR` to the selected workspace and, if needed, pass a separate `AGENTIC_OS_RUNTIME_ROOT`.

## Logs and Outputs

### Logs

Use two log layers:

| Log type | Scope | Location | Purpose |
|---|---|---|---|
| Runtime log | Root | `.command-centre/cron-daemon.log` | leader changes, sweeps, queue decisions, daemon lifecycle |
| Job log | Workspace | `{workspace}/cron/logs/{slug}.log` | job-specific stdout/stderr and retries |

### Outputs

Allowed roots should stay:

- `projects/`
- `brand_context/`
- `context/`

But they must be interpreted inside the selected workspace only.

Persist output paths relative to the selected workspace root, not the install root.

## UI State Rules

Every one of these must include `workspaceKey`:

- expanded row state
- active run state
- run history cache
- drag order cache
- pinned jobs cache
- React list keys

Examples:

- `expandedJobKey = root:daily-brief`
- `activeRuns["acme-inc:morning-check"]`
- `runHistory["acme-inc:morning-check"]`
- `localStorage["cron-job-order:acme-inc"]`

## Recommended Build Order

1. Lock the runtime contract and ownership visibility
2. Fix execution scope (`runtimeRoot` vs `jobWorkspaceDir`)
3. Unify queue execution
4. Unify logs and outputs
5. Fix UI composite keys
6. Polish CLI UX on top of stable runtime truth
7. Verify end to end across root/client and UI/daemon paths

## Open Questions

- The exact single root cause of the observed root-level client output is still not fully proven. The strongest candidates are:
  - broken copied client wrappers
  - inherited root `AGENTIC_OS_DIR`
- Whether cron outputs should remain allowed under `brand_context/` and `context/`, or whether policy should narrow to `projects/` only

## Sources

- `.planning/PROJECT.md`
- `projects/briefs/cron-jobs-hardening/2026-04-13_cron-jobs-hardening-brief.md`
- `projects/briefs/cron-jobs-hardening/2026-04-13_cron-jobs-hardening-plan.md`
- `.planning/codebase/ARCHITECTURE.md`
- `.planning/codebase/STRUCTURE.md`
- `.planning/codebase/INTEGRATIONS.md`
- `projects/briefs/command-centre/src/lib/cron-runtime.js`
- `projects/briefs/command-centre/src/lib/cron-scheduler.ts`
- `projects/briefs/command-centre/src/lib/queue-watcher.ts`
- `projects/briefs/command-centre/scripts/cron-daemon.cjs`
- `projects/briefs/command-centre/src/store/cron-store.ts`
- `scripts/add-client.sh`
- Node.js `child_process` docs: https://nodejs.org/api/child_process.html
