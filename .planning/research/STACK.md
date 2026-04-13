# Implementation Patterns: Cron Hardening

**Domain:** Cron hardening for a brownfield local-first Next.js/Node/PowerShell/Bash product  
**Researched:** 2026-04-13  
**Overall confidence:** HIGH

## Recommended Patterns

### 1. Keep one shared runtime control plane at the root

**Recommendation:** Preserve `.command-centre/` as the single source of truth for leader lock, daemon PID, runtime log, and SQLite state.

**Why:** The current code already uses one shared lock model across the UI runtime and CLI daemon. Replacing it would introduce more risk than value.

**Implementation notes:**
- Keep leadership, heartbeat, PID, and queue ownership root-scoped.
- Do not create per-client daemon state.
- Expose the same runtime status model to both CLI and UI.

**What not to change:** Do not introduce two independent schedulers.

**Confidence:** HIGH

## 2. Separate `runtimeRoot` from `jobWorkspaceDir`

**Recommendation:** Make the execution contract explicit: the runtime is rooted at the install root, but each cron job runs inside a selected workspace.

**Why:** The main architecture risk is root-vs-client leakage caused by inherited root-level state even when the DB row correctly says `clientId = <slug>`.

**Implementation notes:**
- Continue resolving runtime ownership from the root workspace.
- Resolve `jobWorkspaceDir` from `clientId` for every cron execution path.
- Ensure child cron processes use:
  - `cwd = jobWorkspaceDir`
  - `AGENTIC_OS_DIR = jobWorkspaceDir`
  - optionally `AGENTIC_OS_RUNTIME_ROOT = <root>` if control-plane access is needed
- Make output scanning relative to `jobWorkspaceDir`, not the install root.

**What not to change:** Do not rely on prompt wording alone for containment.

**Confidence:** HIGH

## 3. Reuse the existing Windows hidden-process helper everywhere

**Recommendation:** Use the same hidden-window spawn strategy already present in [`projects/briefs/command-centre/src/lib/subprocess.ts`](C:/Users/gmsal/Code%20Projects/AgenticOS%20-%20dev%202026-04-13/projects/briefs/command-centre/src/lib/subprocess.ts) for:
- daemon startup
- queued cron task execution
- any other cron-managed child processes on Windows

**Why:** The current daemon launcher still uses raw `spawn(..., { detached: true })`, while the UI task path already centralizes Windows hiding behavior.

**Implementation notes:**
- On Windows, use `windowsHide: true`.
- Avoid `detached: true` for task child processes on Windows unless there is a proven need.
- If the daemon itself still needs background behavior, verify hidden launch + logging + stop behavior together as one package.
- Prefer one shared helper instead of separate Windows spawn logic in `cron-daemon.cjs` and `cron-runtime.js`.

**Primary-source notes:**
- Node.js documents `windowsHide` as the way to hide the subprocess console window.
- Node.js also documents that `detached: true` gives the child its own console window on Windows.

**What not to change:** Do not land a Windows popup fix that only hides the window but breaks daemon logs or stop semantics.

**Confidence:** HIGH

## 4. Use one enqueue-first execution model for scheduled and manual runs

**Recommendation:** Make scheduled runs, UI “Run now”, and CLI manual runs all go through the same queue-first path.

**Why:** Different execution paths create inconsistent history, logging, output capture, and failure behavior.

**Implementation notes:**
- Scheduled tick enqueues due jobs.
- UI manual run enqueues a manual cron task.
- CLI `run-job` should enqueue instead of bypassing the queue.
- Only the current leader drains queued cron tasks.

**What not to change:** Do not let manual cron execution become a special path with different behavior.

**Confidence:** HIGH

## 5. Key job-facing state by `workspaceKey + slug`

**Recommendation:** Treat `jobKey = ${workspaceKey}:${slug}` as the canonical UI identity.

**Why:** Root and client workspaces can reuse the same slug. Slug-only state is unsafe.

**Implementation notes:**
- Use composite keys for:
  - expanded row state
  - active run state
  - history cache
  - pinned jobs
  - row ordering
  - React list keys
- Keep `clientId` persisted in SQLite; derive `workspaceKey` in the API/UI layer.

**What not to change:** Do not invent a second persisted scope field unless query pressure truly demands it.

**Confidence:** HIGH

## 6. Build friendly CLI output from a shared runtime-status model

**Recommendation:** Make `start`, `status`, `logs`, and `stop` scripts render structured information from the same shared runtime status contract used by the UI.

**Why:** CLI UX should be friendlier, but it must stay truthful and consistent with UI state.

**Implementation notes:**
- Show:
  - runtime owner (`daemon`, `in-process`, `stopped`)
  - leader status
  - PID
  - heartbeat freshness
  - workspace count
  - next action hints
- Follow the tone of `scripts/install.sh`: simple, visual, high-signal.
- Render warnings for stale state instead of overconfident labels.

**What not to change:** Do not beautify raw process output without first stabilizing the runtime truth model.

**Confidence:** HIGH

## 7. Add hard guards for workspace-scoped outputs

**Recommendation:** Treat output outside the selected workspace as an anomaly, not a silent miss.

**Why:** A client run writing into root `projects/` is a trust-breaking issue, and current output capture can miss it.

**Implementation notes:**
- Allowed output roots should stay:
  - `projects/`
  - `brand_context/`
  - `context/`
- But interpret them inside the selected workspace only.
- If a client run changes files outside `clients/<slug>/`, fail loudly or at least flag the run for review.
- Add regression coverage for “client run must not modify root workspace content”.

**What not to change:** Do not silently broaden output scanning to the whole repo.

**Confidence:** HIGH

## 8. Restore real cron-focused regression coverage

**Recommendation:** Add focused tests around runtime ownership, client isolation, and same-slug collisions.

**Why:** The codebase map already flagged weak cron test coverage, and this hardening work touches high-regression areas.

**Implementation notes:**
- Add tests for:
  - root vs client same-slug jobs
  - leader handoff with UI + daemon both alive
  - Windows hidden launch path
  - client wrapper path resolution
  - output containment
- Ensure the declared `test:cron` path actually exists and runs.

**What not to change:** Do not depend only on manual smoke tests for these fixes.

**Confidence:** HIGH

## Defer for Later

- Natural-language cron creation/editing
- Templates and cloning
- Dry-run schedule preview
- Rich cost analytics
- Broader task-system redesign

## Sources

**Internal**
- `.planning/PROJECT.md`
- `projects/briefs/cron-jobs-hardening/2026-04-13_cron-jobs-hardening-brief.md`
- `projects/briefs/cron-jobs-hardening/2026-04-13_cron-jobs-hardening-plan.md`
- `.planning/codebase/STACK.md`
- `.planning/codebase/ARCHITECTURE.md`
- `projects/briefs/command-centre/src/lib/cron-runtime.js`
- `projects/briefs/command-centre/src/lib/cron-scheduler.ts`
- `projects/briefs/command-centre/src/lib/queue-watcher.ts`
- `projects/briefs/command-centre/src/lib/subprocess.ts`
- `projects/briefs/command-centre/scripts/cron-daemon.cjs`
- `scripts/add-client.sh`

**Primary sources**
- Node.js `child_process` docs: https://nodejs.org/api/child_process.html
- PowerShell `Start-Process` docs: https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/start-process?view=powershell-7.5
