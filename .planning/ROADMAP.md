# Roadmap: Cron Jobs Hardening

## Overview

This roadmap hardens cron around the actual v1 problem clusters in the project: runtime ownership truth, client workspace containment, client-safe state isolation, quiet Windows daemon execution, and clearer CLI lifecycle operations. The build order starts by making runtime ownership trustworthy, then lets containment work, Windows behavior, and CLI improvements move in parallel where dependencies allow. The stream closes with a regression and user-validation gate, and PR preparation stays after that gate rather than inside it.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [ ] **Phase 1: Runtime Ownership & Run Truth** - Make one visible runtime owner and truthful run outcomes the shared source of cron truth.
- [ ] **Phase 2: Workspace Execution Containment** - Ensure client jobs run in the selected workspace and cannot leak outputs across boundaries.
- [ ] **Phase 3: Client State Isolation in UI & History** - Separate root and client job state, logs, and controls end to end.
- [ ] **Phase 4: Quiet Windows Background Execution** - Remove visible Windows terminal popups without breaking daemon lifecycle behavior.
- [ ] **Phase 5: Friendly CLI Cron Operations** - Make cron start, status, logs, and stop readable and trustworthy for non-technical users.
- [ ] **Phase 6: Regression Coverage & User Validation** - Prove the hardening holds across root/client, daemon/UI, and Windows flows before any PR work.

## Phase Details

### Phase 1: Runtime Ownership & Run Truth
**Goal**: Users and operators can trust one clear runtime owner and accurate cron run outcomes across the workspace.
**Depends on**: Nothing (first phase)
**Requirements**: [OWNR-01, OWNR-02, OWNR-03, OWNR-04, SAFE-02]
**Success Criteria** (what must be TRUE):
  1. User can see whether cron scheduling is owned by the CLI daemon, the in-process UI runtime, or neither without reading lock files or raw process output.
  2. CLI and UI show the same runtime owner, leader freshness, and skipped-run reason for the same workspace.
  3. Running the CLI daemon and UI server at the same time does not create duplicate scheduled runs for the same job.
  4. Interrupted, recovered, or skipped runs are shown with truthful outcomes instead of being silently reported as successful.
**Plans**: TBD
**UI hint**: yes

### Phase 2: Workspace Execution Containment
**Goal**: Client cron execution is fully anchored to the selected workspace instead of inheriting root-scoped behavior.
**Depends on**: Phase 1
**Requirements**: [CLNT-01, CLNT-02, CLNT-06, SAFE-01]
**Success Criteria** (what must be TRUE):
  1. User can run a client cron job and have it execute inside the selected client workspace, not the root workspace.
  2. Files created by a client cron run land only inside allowed directories for that client workspace.
  3. A client cron run that attempts to write outside the selected workspace is visibly flagged or failed instead of silently passing.
  4. Generated client cron wrappers still target the shared root runtime while preserving the selected client workspace during execution.
**Plans**: TBD

### Phase 3: Client State Isolation in UI & History
**Goal**: Root and client cron jobs stay separated across logs, history, and controls even when slugs overlap.
**Depends on**: Phase 2
**Requirements**: [CLNT-03, CLNT-04, CLNT-05]
**Success Criteria** (what must be TRUE):
  1. User can inspect a client job's logs and status only within that client context and its own history surfaces.
  2. Root and client jobs that share the same slug never mix their state, history, or control actions.
  3. User can run, edit, toggle, delete, and inspect a cron job in the UI while the selected root/client scope is preserved end to end.
**Plans**: TBD
**UI hint**: yes

### Phase 4: Quiet Windows Background Execution
**Goal**: Windows cron daemon and scheduled execution stay invisible in the background without losing control or diagnostics.
**Depends on**: Phase 1
**Requirements**: [WIN-01, WIN-02, WIN-03]
**Success Criteria** (what must be TRUE):
  1. User can start the CLI daemon on Windows without a visible terminal window appearing.
  2. Daemon-triggered cron runs on Windows do not open visible terminal popups during execution.
  3. Hidden Windows execution still preserves daemon logging, status inspection, and clean stop behavior.
**Plans**: TBD

### Phase 5: Friendly CLI Cron Operations
**Goal**: Non-technical users can operate cron from the CLI with clear lifecycle feedback and readable diagnostics.
**Depends on**: Phase 1
**Requirements**: [CLI-01, CLI-02, CLI-03, CLI-04]
**Success Criteria** (what must be TRUE):
  1. User can start the cron daemon from the CLI and immediately understand whether a daemon was started, already running, or blocked by current runtime state.
  2. User can inspect cron status from the CLI through structured, human-friendly output that explains runtime owner, leader freshness, PID, workspace count, and recovery hints.
  3. User can inspect daemon logs from the CLI through readable output with clear headings, recent context, and file path hints.
  4. User can stop the cron daemon from the CLI and immediately understand what changed or what still needs attention.
**Plans**: TBD

### Phase 6: Regression Coverage & User Validation
**Goal**: The hardening stream is proven through targeted regression coverage and explicit user validation before any PR preparation.
**Depends on**: Phase 3, Phase 4, Phase 5
**Requirements**: [SAFE-03]
**Success Criteria** (what must be TRUE):
  1. Maintainer can run regression coverage for root-vs-client execution, same-slug isolation, runtime leadership, and Windows hidden execution behavior and see it pass.
  2. User can complete end-to-end validation for root and client cron flows before any PR branch or pull request preparation begins.
  3. The project ends with a clear pass/fail validation record for containment, ownership, Windows background behavior, and CLI lifecycle flows.
**Plans**: TBD

## Execution Notes

- Phase 1 is the dependency anchor because Windows behavior and CLI clarity must sit on top of a stable runtime truth model.
- After Phase 1, Phase 2, Phase 4, and Phase 5 can be implemented in parallel where practical.
- Phase 3 should follow Phase 2 because client-safe UI state depends on correct workspace execution and file placement.
- Phase 6 is the shared regression and user-testing gate, and it happens before any PR preparation.

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Runtime Ownership & Run Truth | 0/TBD | Not started | - |
| 2. Workspace Execution Containment | 0/TBD | Not started | - |
| 3. Client State Isolation in UI & History | 0/TBD | Not started | - |
| 4. Quiet Windows Background Execution | 0/TBD | Not started | - |
| 5. Friendly CLI Cron Operations | 0/TBD | Not started | - |
| 6. Regression Coverage & User Validation | 0/TBD | Not started | - |
