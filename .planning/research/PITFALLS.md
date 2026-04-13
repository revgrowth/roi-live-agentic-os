# Domain Pitfalls

**Domain:** Cron hardening for Windows and multi-client workspaces  
**Researched:** 2026-04-13  
**Overall confidence:** HIGH

## Highest-Risk Areas

- silent cross-workspace writes
- same-slug UI collisions
- duplicate or misreported runs during leader changes
- Windows fixes that remove popups but break daemon behavior

## Critical Pitfalls

### 1. Client jobs appear scoped in the DB but still write into root

**What goes wrong:** A run is stored with the right `clientId`, but files land in root `projects/` or another workspace.

**Warning signs:**
- client run succeeds but `task_outputs` is empty
- root files change right after a client run
- logs show output creation but client history shows nothing

**Prevention:**
- make workspace resolution explicit at execution time
- add a hard guard for writes outside the selected workspace
- fix client launcher resolution before UI polish

**Suggested phase ownership:** client isolation phase + final verification phase

### 2. Same-slug jobs collide in the UI

**What goes wrong:** Root and client jobs with the same slug share local state or mutate the wrong record.

**Warning signs:**
- the wrong history panel stays expanded after client switching
- a job appears “running” in the wrong workspace
- pin/order state bleeds across workspaces

**Prevention:**
- key all state by `workspaceKey + slug`
- require `clientId` on every write path
- scope localStorage by workspace

**Suggested phase ownership:** client isolation phase + regression tests

### 3. Leader handoff bugs create duplicate execution or dropped runs

**What goes wrong:** UI and daemon both think they can execute queued cron work, or both back off unexpectedly.

**Warning signs:**
- two `cron_runs` rows for the same job and same scheduled minute
- the same output file produced twice
- leader status flips unexpectedly between UI and daemon

**Prevention:**
- keep one authoritative leader check before enqueue and execute
- preserve dedupe on `jobSlug + clientId + scheduledFor`
- add explicit leader-claim and leader-release diagnostics

**Suggested phase ownership:** runtime/ownership phase + final verification

### 4. Restart recovery reports incomplete work as success

**What goes wrong:** After a crash or restart, a run is inferred as success even though it did not finish cleanly.

**Warning signs:**
- a run flips to success during recovery
- log ends mid-stream but history says success
- success rows have zero outputs and suspiciously short duration

**Prevention:**
- only mark success from the known success path
- consider an explicit `interrupted` result
- preserve interruption reason and runtime metadata

**Suggested phase ownership:** runtime/ownership phase

### 5. Windows popup fix breaks daemon lifecycle

**What goes wrong:** The popup disappears, but daemon logging, stopping, or child task execution breaks on Windows.

**Warning signs:**
- PID file exists but process is dead
- no log growth after start
- stop script reports success but daemon is still alive

**Prevention:**
- centralize Windows spawn behavior
- test hidden launch, logging, stop, and task completion together

**Suggested phase ownership:** runtime/ownership phase + Windows verification

## Moderate Pitfalls

### 6. Existing client workspaces keep old broken launchers

**Why it matters:** `add-client.sh` copies scripts into client workspaces, so old clients can keep stale wrappers after the root fix lands.

**Prevention:** add a migration/repair path or replace copied scripts with thin adapters.

### 7. UI and CLI ownership messages disagree

**Why it matters:** Mixed signals destroy trust even if runtime logic is correct.

**Prevention:** make both surfaces read the same shared runtime status source and show stale-state warnings.

### 8. Output capture misses real files

**Why it matters:** Successful runs look empty in the UI.

**Prevention:** treat files outside allowed roots as anomalies, not silent misses.

### 9. Test gate stays weak

**Why it matters:** This stream touches high-regression code, but current cron test coverage is weak.

**Prevention:** restore a real `test:cron` entrypoint and add focused regression tests for root/client and same-slug scenarios.

## Minor Pitfall

### 10. CLI polish arrives before runtime truth is stable

**Why it matters:** A prettier CLI with stale data becomes more misleading, not more useful.

**Prevention:** build formatting on top of the final shared runtime status contract.

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|----------------|------------|
| Runtime ownership | duplicate or dropped runs | add diagnostics and restart-race tests |
| Windows behavior | popup fix breaks lifecycle | test start, status, logs, stop, and one scheduled run |
| Client isolation | client run leaks into root | add negative assertions that root files do not change |
| UI/store scoping | same-slug collisions | key everything by `workspaceKey + slug` |
| Client launcher repair | old clients keep stale scripts | test one new client and one older client workspace |
| CLI UX | polished but misleading output | render from shared runtime truth only |
| Verification | false green due to weak tests | restore cron tests and targeted type/test checks |

## Sources

- `.planning/PROJECT.md`
- `projects/briefs/cron-jobs-hardening/2026-04-13_cron-jobs-hardening-brief.md`
- `projects/briefs/cron-jobs-hardening/2026-04-13_cron-jobs-hardening-plan.md`
- `.planning/codebase/TESTING.md`
- `.planning/codebase/CONCERNS.md`
- `scripts/add-client.sh`
- `scripts/start-crons.ps1`
- `scripts/status-crons.ps1`
- `scripts/logs-crons.ps1`
- `projects/briefs/command-centre/scripts/cron-daemon.cjs`
- `projects/briefs/command-centre/src/lib/cron-runtime.js`
- `projects/briefs/command-centre/src/lib/cron-scheduler.ts`
- `projects/briefs/command-centre/src/lib/queue-watcher.ts`
- `projects/briefs/command-centre/src/lib/subprocess.ts`
- `projects/briefs/command-centre/src/store/cron-store.ts`
