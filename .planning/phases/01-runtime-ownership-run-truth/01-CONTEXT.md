# Phase 1: Runtime Ownership & Run Truth - Context

**Gathered:** 2026-04-13
**Status:** Ready for planning
**Source:** User brief + existing cron hardening notes

<domain>
## Phase Boundary

This phase defines and exposes one trustworthy runtime-ownership model for cron scheduling across the workspace. It must make it clear whether scheduling is currently owned by the CLI daemon, the in-process UI runtime, or nobody, and it must make cron run outcomes truthful when runs are skipped, interrupted, recovered, or blocked by another owner.

This phase is about shared runtime truth and shared visibility. It is not the phase for full client containment, client-vs-root UI history separation, or broad CLI visual polish beyond what is required to expose the new runtime truth.

</domain>

<decisions>
## Implementation Decisions

### Runtime Model
- Preserve the existing shared single-leader runtime model in `.command-centre`; do not introduce a second scheduler or a split ownership design.
- Treat the CLI daemon and the UI runtime as separate processes that may coexist, but only one may own scheduling and queued cron execution at a time.
- Make one canonical runtime status contract the source of truth for both CLI and UI so they report the same owner, freshness, and skip reason for the same workspace.

### User Truth
- Users must be able to understand ownership without reading raw lock files or low-level daemon logs.
- If a run is skipped because another runtime or another run already owns execution, that reason must be visible instead of being silently flattened into success.
- Interrupted, partially recovered, or skipped runs must not be reported as successful unless completion is actually confirmed.

### Product Constraints
- Keep planning artifacts in English.
- Preserve the current root-workspace cron flow while making runtime truth more visible.
- Prefer transparent state and debuggable signals over hidden magic.
- Keep user-facing behavior understandable for non-technical users.

### Phase Scope Discipline
- Windows hidden-window behavior is a downstream implementation phase, but this phase may define the ownership/status surfaces that Phase 4 will rely on.
- Client wrapper fixes and client output containment belong to later phases and should only be referenced here when they affect the shared runtime contract.

### the agent's Discretion
- The exact shape of the canonical status object, helper boundaries, naming, and shared utility placement are at the agent's discretion.
- The exact UI surface for ownership display is at the agent's discretion as long as it follows the shared runtime contract and does not over-expand scope.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project intent
- `projects/briefs/cron-jobs-hardening/2026-04-13_cron-jobs-hardening-brief.md` — confirmed problem statement, constraints, and acceptance criteria
- `projects/briefs/cron-jobs-hardening/2026-04-13_cron-jobs-hardening-plan.md` — earlier workstream breakdown and known risks
- `.planning/ROADMAP.md` — official phase goal, dependency order, and success criteria
- `.planning/REQUIREMENTS.md` — requirement IDs mapped to this phase

### Shared repository rules
- `AGENTS.md` — project operating rules, multi-client architecture, and cron model constraints

### Runtime ownership source files
- `projects/briefs/command-centre/src/lib/cron-runtime.js` — shared runtime/leader logic
- `projects/briefs/command-centre/src/lib/cron-scheduler.ts` — scheduling orchestration
- `projects/briefs/command-centre/src/lib/queue-watcher.ts` — queued cron execution and leader-sensitive behavior
- `projects/briefs/command-centre/src/lib/cron-system-status.ts` — system status aggregation
- `projects/briefs/command-centre/src/app/api/cron/system-status/route.ts` — API surface for runtime status
- `projects/briefs/command-centre/scripts/cron-daemon.cjs` — CLI daemon entrypoint and lifecycle
- `projects/briefs/command-centre/src/lib/subprocess.ts` — existing hidden-process spawning patterns already used elsewhere

### UI and state surfaces affected by runtime truth
- `projects/briefs/command-centre/src/store/cron-store.ts` — client-facing cron state store
- `projects/briefs/command-centre/src/app/cron/page.tsx` — main cron management page
- `projects/briefs/command-centre/src/components/cron/cron-table.tsx` — cron list surface
- `projects/briefs/command-centre/src/components/cron/cron-row.tsx` — per-job UI actions and indicators
- `projects/briefs/command-centre/src/components/cron/run-history.tsx` — history surface that must stay truthful about outcomes

</canonical_refs>

<specifics>
## Specific Ideas

- The current understanding is that the UI runtime and CLI daemon are separate processes, but they already share a single-leader model instead of intentionally running duplicate schedulers.
- The queue watcher already skips queued cron execution when the daemon is leader.
- The main product need for this phase is to turn that existing technical truth into clear user-visible truth in both CLI and UI.
- This phase should define the ownership/status foundation that later phases can reuse for Windows daemon fixes, client isolation, and CLI UX polish.

</specifics>

<deferred>
## Deferred Ideas

- Full CLI visual redesign for `start`, `status`, `logs`, and `stop` belongs mainly to Phase 5.
- Hidden Windows background execution fixes belong mainly to Phase 4.
- Client wrapper repair, workspace containment, and root-vs-client output enforcement belong mainly to Phase 2.
- Root/client UI history isolation and same-slug separation belong mainly to Phase 3.

</deferred>
