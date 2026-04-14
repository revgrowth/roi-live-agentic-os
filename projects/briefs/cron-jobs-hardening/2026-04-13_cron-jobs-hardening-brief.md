---
project: cron-jobs-hardening
status: active
level: 2
created: 2026-04-13
---

# Cron Jobs Hardening Brief

## Goal

Improve the Cron Jobs experience across the CLI and Command Centre so scheduling feels reliable, understandable, and safe in both root and client workspaces.

## Why This Work Exists

Recent inspection of the current implementation surfaced four linked problems:

1. The CLI cron scripts work, but their output is much less friendly than the install flow.
2. Users can end up with both the CLI daemon process and the UI server process running at the same time, which is easy to forget and hard to reason about.
3. On Windows, cron execution started through the CLI daemon can open visible terminal windows, which breaks the intended background-daemon experience.
4. Client-scoped cron jobs are not fully isolated yet. Logs and job files are stored per client, but at least one client job produced output in the root `projects/` directory and the UI/store layer still has client-scoping gaps.

## Current Findings

### Confirmed

- The UI scheduler and CLI daemon do not intentionally run the same cron queue in parallel. They share a single runtime lock in `.command-centre`, and only one runtime becomes leader at a time.
- The UI queue watcher explicitly skips queued cron execution when the daemon is the active leader.
- Cron runs are already persisted with `clientId`, and client logs/status files are already written under `clients/<slug>/cron/...`.
- The Windows CLI daemon path does not currently apply the same hidden-window spawning strategy that the UI execution path uses.
- Client workspaces currently copy the root cron scripts verbatim, which makes the generated client-side wrappers resolve the Command Centre script path incorrectly.

### Still Open

- Why a client cron run created `projects/mock-test.md` in the root workspace instead of inside `clients/acme-inc/projects/`.

What is already known:

- The task and cron run were stored with `clientId = acme-inc`.
- The run produced no captured outputs for that client task.
- This means the execution was treated as a client job, but the resulting file was not detected inside the client workspace.

## Deliverables

1. A friendlier CLI cron UX for `start`, `status`, `logs`, and related scripts.
2. Clear runtime ownership visibility so users can tell whether cron leadership belongs to the daemon or the in-process UI runtime.
3. A hidden-window Windows daemon/task execution path that behaves like a true background service.
4. Full client isolation for cron jobs across execution, logging, output capture, UI history, and source/log/run-history retrieval.
5. Regression coverage for root workspace jobs and client workspace jobs.

## Acceptance Criteria

1. Starting or inspecting cron from the CLI shows readable, structured, high-signal output similar in quality to `scripts/install.sh`.
2. When both the UI server and CLI daemon are alive, only one runtime owns scheduling and queued cron execution, and the user can see which one is active.
3. Running cron jobs through the Windows CLI daemon does not open visible terminal windows.
4. A client cron job can only create and report files inside that client's workspace unless explicitly allowed by design.
5. Cron history, logs, source, and outputs shown in the UI are keyed by both `clientId` and job identity, so same-slug jobs from different workspaces do not collide.
6. Generated client cron wrappers correctly target the shared Command Centre runtime instead of assuming a local copy inside the client folder.

## Constraints

- Do not break the current root-workspace cron flow while fixing client isolation.
- Preserve the single-runtime leadership model rather than introducing two independent schedulers.
- Keep the UX understandable for non-technical users.
- Prefer additive guardrails over hidden behavior that is difficult to debug later.

## Dependencies

- Existing Command Centre cron runtime in `projects/briefs/command-centre/`
- Root CLI scripts in `scripts/`
- Client workspace generation in `scripts/add-client.sh`

## Suggested Execution Shape

This work should be delivered as one focused hardening stream with multiple worktracks:

1. CLI UX polish
2. Runtime ownership and Windows daemon behavior
3. Client isolation and UI scoping fixes
4. Verification and regression coverage

## Out of Scope

- Replacing the current cron architecture with an operating-system scheduler
- Building a cloud scheduler or remote cron service
- Broad redesign of the entire Command Centre task system
- Non-cron client isolation issues outside the scope of scheduled jobs
