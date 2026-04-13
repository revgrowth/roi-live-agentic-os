# Phase 1 Research: Runtime Ownership & Run Truth

**Phase:** 1  
**Name:** Runtime Ownership & Run Truth  
**Date:** 2026-04-13

## Executive Summary

The codebase already has the right high-level runtime model for cron scheduling: the CLI daemon and the in-process UI scheduler compete for the same lock file, and the queue watcher already defers queued cron execution when the daemon is leader. The main problem is not duplicate architecture; it is missing user-visible truth and incomplete run-truth semantics.

Planning should therefore avoid redesigning scheduling. Phase 1 should instead standardize one canonical runtime-status contract, surface it in both CLI and UI, and make run outcomes honest when tasks are skipped, orphaned, or recovered.

## Confirmed Architecture

### Shared Leadership Model

- `projects/briefs/command-centre/src/lib/cron-runtime.js` owns the shared runtime lock and heartbeat model.
- `claimRuntimeLeadership()` writes a single lock file with `runtime`, `identifier`, `pid`, `heartbeatAt`, `lastSweepAt`, and `workspaceCount`.
- `projects/briefs/command-centre/src/lib/cron-scheduler.ts` uses the same lock flow for the in-process scheduler.
- `projects/briefs/command-centre/scripts/cron-daemon.cjs` uses the same lock flow for the daemon.

### Duplicate Scheduling Protection Already Exists

- The in-process scheduler only runs scheduled work after it successfully claims leadership.
- The daemon only runs scheduled work after it successfully claims leadership.
- `projects/briefs/command-centre/src/lib/queue-watcher.ts` explicitly skips queued cron execution when `getCronSystemStatus()` reports `runtime === "daemon"`.

### Existing Status Surface Exists but Is Thin

- `projects/briefs/command-centre/src/types/cron.ts` already defines `CronSystemStatus`.
- `projects/briefs/command-centre/src/app/api/cron/system-status/route.ts` already exposes runtime status.
- `projects/briefs/command-centre/src/lib/cron-system-status.ts` is only a thin pass-through to `getManagedCronRuntimeStatus()`.
- The cron UI does not appear to visibly consume this status today, so the truth exists technically but is mostly invisible to the user.

## Planning-Critical Gaps

### 1. Runtime Status Is Technically Present but Operationally Incomplete

`getManagedRuntimeStatus()` currently returns:

- `runtime`
- `leader`
- `identifier`
- `pid`
- `workspaceCount`
- `heartbeatAt`
- start/stop/logs/status commands

This is enough for debugging, but not enough for user truth. It does not explicitly say:

- whether the leader record is fresh or stale
- whether the current process is merely present vs actually leading
- why execution was skipped
- whether a daemon process exists without a valid leadership record

This creates a gap between "system knows enough to operate" and "user knows enough to trust it."

### 2. Run History Can Drift into False Success

Two recovery paths are especially risky:

- In `queue-watcher.ts`, stuck `cron_runs` rows are reconciled to `success` when the linked task is terminal and has no `errorMessage`. That is only a heuristic.
- Also in `queue-watcher.ts`, tasks stuck in `running + needsInput` with no active session update their `cron_runs` row to `result = 'success'`.

That means the system can report success after recovery even when the real story was "interrupted and auto-closed" rather than "completed normally."

This is the strongest signal behind requirement `SAFE-02`.

### 3. CLI and UI Are Not Yet Guaranteed to Speak the Same Language

The CLI daemon script prints raw text via `formatStatus()`. The API returns JSON. There is no obvious shared formatter or shared "status interpretation" layer. Even before visual CLI polish in Phase 5, Phase 1 should define one canonical meaning for:

- who owns scheduling
- whether that owner is healthy
- whether the local process is active but not leader
- what happened to skipped or recovered runs

Without this, Phase 5 can polish the wrong semantics.

### 4. There Is Little or No Dedicated Regression Coverage for These Cases

No focused test coverage was found for:

- runtime leadership arbitration
- daemon-present-but-lock-stale behavior
- queue watcher skip logic based on runtime ownership
- recovery transitions for interrupted cron runs
- truthful reporting of recovered vs successful outcomes

This means the phase plan must include regression work, even if deeper coverage lands fully in Phase 6.

## Recommended Technical Direction

### A. Standardize a Canonical Runtime Truth Contract

Create one shared runtime-truth layer that both CLI and UI consume. It should extend the existing `CronSystemStatus` shape or wrap it with a richer derived view.

Minimum recommended fields:

- `runtime`: `daemon | in-process | stopped`
- `leader`: boolean
- `identifier`
- `pid`
- `heartbeatAt`
- `workspaceCount`
- `leaderState`: `active | stale | absent`
- `localRuntimePresent`: boolean
- `skipReason`: nullable string for leader-related skip cases
- `statusSummary`: short human-readable sentence derived from the raw fields

The key planning rule is that the raw lock/process facts and the derived user-facing truth should live in one place, not be reimplemented independently by CLI and UI.

### B. Separate "Completion" from "Recovery"

Do not let recovery code silently reuse `success` when the system only knows that the task ended without an active process.

Safer options:

1. Extend cron-run result semantics with explicit terminal states such as `interrupted` and `recovered`.
2. Keep `result` coarse, but add a required `completionReason` or `finalizationMode` field.

For this phase, the important planning decision is not the exact naming. The important decision is to stop encoding uncertain recovery paths as plain success.

### C. Make Queue-Watcher Recovery Truthful

`queue-watcher.ts` should become a first-class truth-preservation layer, not just a cleanup layer. Any auto-healed cron state should preserve evidence of:

- why the original run stopped
- whether the process disappeared
- whether the final state was inferred vs observed

### D. Keep Scheduling Logic Stable

Do not rework the scheduler/daemon competition model in this phase. The current direction is already correct:

- both runtimes share the same lock
- only the leader schedules
- queue watcher already defers to daemon leadership

The safer path is to expose and harden this model, not replace it.

## Recommended Phase-1 Implementation Order

1. Define the canonical runtime-truth contract and the rules for deriving user-facing status from lock + PID + heartbeat state.
2. Refactor `getManagedRuntimeStatus()` / `cron-system-status.ts` so both CLI and UI consume the same derived truth.
3. Thread that truth into the current UI cron surface and any immediate CLI status consumers needed for ownership visibility.
4. Audit recovery paths in `queue-watcher.ts` and `cron-runtime.js` so interrupted/recovered/skipped runs are not flattened into success.
5. Add regression coverage around lock ownership, queue skip behavior, stale lock interpretation, and recovery result truth.

This order keeps the phase aligned with roadmap scope: ownership truth first, run truth second, presentation third.

## Likely Touchpoints

### Must Read / Likely Change

- `projects/briefs/command-centre/src/lib/cron-runtime.js`
- `projects/briefs/command-centre/src/lib/cron-system-status.ts`
- `projects/briefs/command-centre/src/lib/cron-service.ts`
- `projects/briefs/command-centre/src/lib/queue-watcher.ts`
- `projects/briefs/command-centre/src/lib/cron-scheduler.ts`
- `projects/briefs/command-centre/src/app/api/cron/system-status/route.ts`
- `projects/briefs/command-centre/src/types/cron.ts`

### May Need Small UI Surface Changes

- `projects/briefs/command-centre/src/store/cron-store.ts`
- `projects/briefs/command-centre/src/components/cron/cron-table.tsx`
- `projects/briefs/command-centre/src/components/cron/cron-row.tsx`
- `projects/briefs/command-centre/src/components/cron/run-history.tsx`

### Defer to Later Phases

- `projects/briefs/command-centre/scripts/cron-daemon.cjs` for user-friendly CLI output (Phase 5)
- Windows hidden-background spawning changes (Phase 4)
- client scoping and wrapper repair (Phases 2 and 3)

## Phase-1 Risks

### Scope Creep into CLI Polish

The phase should define truth and maybe expose a minimal visible status, but not drift into the full install-like CLI presentation work. That belongs to Phase 5.

### Scope Creep into Client Isolation

Client leakage is real, but this phase should only touch it where it affects the shared runtime truth contract. Full workspace containment belongs later.

### Semantics Migration Risk

If run-history semantics change, older rows may still only have `success | failure | timeout | running`. The plan should decide whether Phase 1 backfills, tolerates mixed history, or starts truthful semantics only for new runs.

## Validation Architecture

### Unit-Level Targets

- runtime truth derivation from lock file + PID + heartbeat combinations
- stale-record handling
- daemon-present-but-not-leader interpretation
- in-process-present-but-not-leader interpretation

### Integration Targets

- daemon and UI alive at the same time, with exactly one leader
- queue watcher skipping daemon-owned queued cron tasks
- recovered/interrupted cron runs being recorded truthfully

### Manual Targets

- user can tell who owns scheduling from the UI without reading files
- user can tell the same ownership from the CLI/system status surface
- a recovered/skipped run no longer looks like a normal success

## Planning Implications

- The phase needs at least one plan dedicated to runtime status truth and at least one plan dedicated to run-history/result truth.
- A small UI plan is likely required even though the phase is mostly backend, because requirement `OWNR-02` explicitly says CLI and UI must show consistent ownership state.
- The plan should avoid large CLI presentation work and instead build the shared truth primitives that Phase 5 can polish later.
