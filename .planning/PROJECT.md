# Cron Jobs Hardening

## What This Is

This project hardens the Cron Jobs experience inside Agentic OS across both the CLI daemon flow and the Command Centre UI. It focuses on making scheduling easier to understand, safer in mixed runtime scenarios, invisible to users when running in the background on Windows, and fully isolated inside each client workspace.

## Core Value

Cron jobs must feel reliable, understandable, and safely contained whether they run from the root workspace or from a client workspace.

## Requirements

### Validated

- ✓ Managed cron scheduling already exists across the root workspace and client workspaces — existing
- ✓ CLI scripts already exist for starting, stopping, checking status, and viewing daemon logs — existing
- ✓ The Command Centre UI already manages cron jobs and can trigger cron runs — existing
- ✓ Runtime leadership already uses a shared lock model so the UI runtime and CLI daemon do not intentionally schedule in parallel — existing

### Active

- [ ] Cron-related CLI scripts present friendly, visual, high-signal output that is easy for non-technical users to understand
- [ ] Runtime ownership between the UI runtime and CLI daemon is visible so users can tell which process currently owns scheduling
- [ ] Windows cron execution started from the CLI daemon runs without opening visible terminal windows
- [ ] Client cron jobs are fully isolated across execution, outputs, logs, history, and UI presentation

### Out of Scope

- Replacing the current cron architecture with an operating-system scheduler — the current shared runtime model should be preserved
- Building a remote or cloud cron service — this work is limited to the local Agentic OS runtime
- Broad redesign of the entire task system — only cron-related behavior should change unless a small supporting fix is required
- Merging pull requests automatically — the user wants to test first and approve PR creation later

## Context

Agentic OS already includes a managed cron runtime inside the Command Centre project plus shell and PowerShell scripts for daemon lifecycle management. A previous codebase map confirms that cron state is persisted in SQLite, runtime leadership is tracked under `.command-centre`, and both root and client workspaces are discovered by the same runtime. A planning brief already exists in `projects/briefs/cron-jobs-hardening/` and frames the work as four connected problems: CLI UX, runtime ownership clarity, Windows daemon pop-up terminals, and incomplete client isolation. The current repo also has unrelated local changes, so this project must avoid touching unrelated work while planning and implementing fixes.

## Constraints

- **Architecture**: Preserve the shared single-runtime leadership model — the fix should clarify ownership, not introduce two schedulers
- **Compatibility**: Do not break the existing root-workspace cron flow while fixing client isolation
- **User Experience**: CLI output must stay simple and readable for non-technical users
- **Platform**: Windows daemon behavior must match the hidden background experience already achieved by the UI-triggered path
- **Workflow**: Planning artifacts should be written in English, while direct collaboration with the user stays in Portuguese
- **Delivery**: The work should be executed in parallel where practical, and PRs should only be prepared after the user tests the result

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Treat this as one focused hardening project with multiple parallel workstreams | The four issues are distinct on the surface but converge on the same cron runtime and workspace boundaries | — Pending |
| Use the existing cron-jobs-hardening brief as source material for initialization | The brief already captures the current findings and avoids re-discovering the same scope | — Pending |
| Keep planning artifacts in English | The user explicitly requested English planning documents | ✓ Good |
| Optimize for parallel execution using strong sub-agents where useful | The user explicitly wants parallel execution and high-capability delegated work | — Pending |
| Delay GitHub PR creation until after user testing | The user wants to validate behavior before authorizing PRs to `origin/dev` | ✓ Good |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-13 after initialization*
