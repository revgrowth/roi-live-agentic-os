# Feature Landscape: Cron Job Management UX

**Domain:** Local cron / scheduled job management inside a developer tool  
**Researched:** 2026-04-13  
**Overall confidence:** HIGH for table stakes, MEDIUM for differentiator prioritization

## Boundary for This Hardening Stream

For this project, v1 hardening should solve **trust**, **clarity**, and **containment**.

A non-technical user should be able to answer these questions without reading code:

1. What jobs exist, and when do they run?
2. Is cron currently running, and which runtime is in charge?
3. Did the last run work, fail, time out, or get skipped?
4. Where did the output go, and did it stay inside the right workspace/client?

If the product cannot answer those four questions clearly, it is missing table stakes.

## Table Stakes

| Feature | Why Expected | Complexity | Notes for This Stream |
|---------|--------------|------------|-----------------------|
| Clear job list with plain-English schedule | Users expect to see what is scheduled without decoding raw syntax | Low | Show job name, active/paused, schedule, and root/client scope |
| Last run, next run, current state | Users expect basic state at a glance | Medium | Include `running`, `success`, `failure`, `timeout`, `skipped`, and `paused` |
| Pause/resume and run-now controls | Basic control is standard | Low | Must behave consistently in UI and CLI |
| Readable per-job logs and run history | Users expect to inspect what happened | Medium | Logs should be easy to scan, not raw dumps |
| Failure and missed-run visibility | Users expect clear signal when something breaks | Medium | For local use, visible state plus native notification is enough |
| Runtime ownership visibility | This product has two possible hosts, so ownership must be obvious | Medium | This is table stakes here, not optional polish |
| Safe client/workspace isolation | Multi-client users expect strict containment | High | Outputs, history, logs, source lookup, and rows must stay scoped |
| Quiet background behavior on Windows | Background tools should not flash terminals | Medium | This affects perceived reliability directly |
| Duplicate-run protection with clear skipped reason | Users expect the system to avoid pileups | Medium | Explain why a run was skipped |
| Simple recovery hints | Non-technical users need guidance when something is wrong | Medium | Example: daemon stopped, UI owns scheduling, invalid client path |
| Human-friendly lifecycle scripts | CLI should explain what happened in plain language | Low | Similar quality bar to `scripts/install.sh` |

## Differentiators

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Natural-language job creation/editing | Fits the assistant-first product direction | Medium | Valuable later, not required for hardening |
| Plain-English “Why didn’t this run?” explanations | Lowers debugging burden | Medium | Good follow-up once runtime truth is stable |
| Smarter notification noise control | Reduces useless pings | Low/Med | Nice later improvement |
| Job templates and cloning | Speeds setup of common jobs | Medium | Defer until core trust issues are fixed |
| Schedule preview / dry-run tester | Helps users validate schedules before saving | Medium/High | Useful, but outside this hardening stream |
| Cost visibility per job | Helpful because runs consume model credits | Medium | Differentiator, not core hardening |
| Rich cross-workspace summary view | Helpful for agencies with many clients | Medium | Safe scoping comes first |

## Anti-Features

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Full visual automation builder | Expands scope into a new product | Keep markdown job files and improve clarity around them |
| Cloud or remote cron service | Conflicts with the local runtime model | Keep the single local shared runtime |
| OS scheduler integration as the main path | The project explicitly moved away from this | Keep manual `start`, `stop`, `status`, and improve them |
| Broad task-system redesign | This stream is cron-focused | Limit changes to cron UX, runtime ownership, Windows behavior, and client isolation |
| Deep performance analytics | Nice for power users, not required for non-technical use | Show run result, duration, and logs instead |

## Feature Dependencies

```text
Runtime ownership visibility -> trustworthy CLI/UI status
Workspace/client identity -> isolated execution -> isolated logs/history/outputs
Run result model -> useful notifications -> plain-English troubleshooting
Human-readable schedule -> safer job review/editing
Readable logs/history -> faster diagnosis -> lower support burden
```

## V1 Hardening Recommendation

Prioritize in this order:

1. Clear runtime ownership and daemon status
2. Full client/workspace isolation
3. Job state, history, and readable logs
4. Pause/resume/run-now behavior consistency
5. Quiet Windows background execution
6. Friendly CLI output and recovery hints

Defer:
- Natural-language scheduling
- Templates and cloning
- Dry-run preview/test console
- Cost analytics
- Rich multi-client rollups beyond safe scoping

## Sources

- Cronicle official site: https://cronicle.net/index.html
- Crontab UI GitHub README: https://github.com/alseambusher/crontab-ui
- Healthchecks GitHub README: https://github.com/healthchecks/healthchecks
- Cronitor docs: https://cronitor.io/docs/cron-job-monitoring
- Crontab Guru Dashboard: https://crontab.guru/dashboard.html
