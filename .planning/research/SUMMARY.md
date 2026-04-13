# Research Summary: Cron Jobs Hardening

**Project:** Cron Jobs Hardening  
**Date:** 2026-04-13

## Key Findings

### 1. The core runtime model is mostly right already

The current system already behaves like a shared single-runtime scheduler with one leader at a time. The UI runtime and CLI daemon are not supposed to schedule independently in parallel. The correct direction is to preserve this model and make ownership clearer to users.

### 2. The biggest risk is execution scope, not scheduler design

The main architecture problem is mismatch between:

- root-scoped control-plane state
- workspace-scoped job execution

Jobs already carry `clientId`, but some execution paths still inherit root-level assumptions. That is the most plausible explanation for a client job creating output under root.

### 3. Client isolation is a product-critical issue

Strict client containment is table stakes, not a nice-to-have. That includes:

- execution `cwd`
- inherited env
- output capture
- per-job logs
- run history
- source lookup
- UI row state

### 4. Windows popup behavior should be fixed by reusing existing hidden-process patterns

The UI task path already uses a Windows-hidden subprocess helper. The daemon path still uses a raw detached spawn. This should be unified instead of patched in two different places.

### 5. Friendly CLI UX should come after runtime truth is stabilized

The CLI should be more visual and user-friendly, but only on top of a stable shared runtime-status model. Otherwise it risks becoming prettier but misleading.

## Recommended Order

1. Lock runtime ownership and visibility
2. Fix execution scope and client wrapper resolution
3. Unify manual and scheduled cron execution through the same queue contract
4. Tighten output/log containment
5. Fix UI composite keys (`workspaceKey + slug`)
6. Polish CLI UX
7. Verify root/client and UI/daemon paths end to end

## Table Stakes for v1 Hardening

- Clear runtime ownership and daemon status
- Full client/workspace isolation
- Readable logs and run history
- Consistent pause/resume/run-now behavior
- Quiet Windows background execution
- Friendly lifecycle scripts with recovery hints

## Biggest Risks

- client jobs writing outside the selected workspace
- same-slug collisions between root and client jobs
- leader handoff races creating duplicate or dropped runs
- Windows popup fixes that break daemon lifecycle
- weak regression coverage creating false confidence

## What Not To Change

- do not replace the single-leader runtime model
- do not add per-client schedulers
- do not broaden this into a general task-system redesign
- do not add cloud or OS-scheduler integration in this stream

## Sources Used

- `.planning/research/STACK.md`
- `.planning/research/FEATURES.md`
- `.planning/research/ARCHITECTURE.md`
- `.planning/research/PITFALLS.md`
