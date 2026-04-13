# Requirements: Cron Jobs Hardening

**Defined:** 2026-04-13  
**Core Value:** Cron jobs must feel reliable, understandable, and safely contained whether they run from the root workspace or from a client workspace.

## v1 Requirements

### CLI Experience

- [ ] **CLI-01**: User can start the cron daemon from the CLI and immediately understand whether a daemon was started, already running, or blocked by another runtime state
- [ ] **CLI-02**: User can inspect cron status from the CLI through structured, human-friendly output that shows runtime owner, leader state, PID, heartbeat freshness, and workspace count
- [ ] **CLI-03**: User can inspect daemon logs from the CLI through readable output with clear headings, recent context, and file path hints
- [ ] **CLI-04**: User can stop the cron daemon from the CLI and immediately understand what changed

### Runtime Ownership

- [ ] **OWNR-01**: User can tell whether cron scheduling is currently owned by the CLI daemon, the in-process UI runtime, or neither
- [ ] **OWNR-02**: User sees consistent ownership state in both the CLI and the UI for the same workspace
- [ ] **OWNR-03**: User does not get duplicate scheduled cron execution when the CLI daemon and UI server are both running
- [ ] **OWNR-04**: User can understand when a cron run was skipped because another run or runtime already owned execution

### Windows Background Execution

- [ ] **WIN-01**: User can start the CLI daemon on Windows without a visible terminal window appearing
- [ ] **WIN-02**: User can let a daemon-triggered cron job run on Windows without visible terminal popups during execution
- [ ] **WIN-03**: Windows hidden-background behavior preserves daemon logging, status reporting, and clean stop behavior

### Client Isolation

- [ ] **CLNT-01**: User can run a client cron job and have it execute inside the selected client workspace, not the root workspace
- [ ] **CLNT-02**: User can run a client cron job and have any generated outputs land only inside allowed directories of that client workspace
- [ ] **CLNT-03**: User can view client cron logs and status files only inside that client's workspace and history views
- [ ] **CLNT-04**: User can inspect root and client cron jobs with the same slug without the UI mixing their state, history, or controls
- [ ] **CLNT-05**: User can run, edit, toggle, delete, and inspect a cron job in the UI while the selected client scope is preserved end to end
- [ ] **CLNT-06**: Generated client cron wrappers correctly target the shared root runtime while preserving the selected client workspace for execution

### Safety and Verification

- [ ] **SAFE-01**: User gets a visible warning or failure state if a client cron run writes outside the selected client workspace
- [ ] **SAFE-02**: User can trust cron run history because interrupted or partially recovered runs are not silently reported as successful
- [ ] **SAFE-03**: Regression coverage exists for root-vs-client execution, same-slug isolation, runtime leadership, and Windows hidden execution behavior

## v2 Requirements

### Convenience Improvements

- **CONV-01**: User can create or edit cron jobs through natural-language guidance
- **CONV-02**: User can duplicate or template common cron job setups
- **CONV-03**: User can preview when a schedule will run before saving
- **CONV-04**: User can inspect richer cross-workspace summaries and cost analytics for cron jobs

## Out of Scope

| Feature | Reason |
|---------|--------|
| Replacing the cron system with an OS scheduler | Preserve the existing shared runtime model |
| Building a cloud or remote cron service | This project is limited to the local Agentic OS runtime |
| Broad redesign of the full task system | This stream is specifically about cron behavior and cron UX |
| Full visual automation builder | Too large for a hardening stream |
| Deep performance analytics | Nice to have later, not required for trust and containment |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| CLI-01 | TBD | Pending |
| CLI-02 | TBD | Pending |
| CLI-03 | TBD | Pending |
| CLI-04 | TBD | Pending |
| OWNR-01 | TBD | Pending |
| OWNR-02 | TBD | Pending |
| OWNR-03 | TBD | Pending |
| OWNR-04 | TBD | Pending |
| WIN-01 | TBD | Pending |
| WIN-02 | TBD | Pending |
| WIN-03 | TBD | Pending |
| CLNT-01 | TBD | Pending |
| CLNT-02 | TBD | Pending |
| CLNT-03 | TBD | Pending |
| CLNT-04 | TBD | Pending |
| CLNT-05 | TBD | Pending |
| CLNT-06 | TBD | Pending |
| SAFE-01 | TBD | Pending |
| SAFE-02 | TBD | Pending |
| SAFE-03 | TBD | Pending |

**Coverage:**
- v1 requirements: 20 total
- Mapped to phases: 0
- Unmapped: 20 ⚠️

---
*Requirements defined: 2026-04-13*  
*Last updated: 2026-04-13 after initial definition*
