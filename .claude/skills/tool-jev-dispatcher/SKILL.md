---
name: tool-jev-dispatcher
description: >
  Label an incoming job with pinned Jev 1.13.0 and write one JSON handoff
  into that seat's queue. Use for dispatcher, route a job, which seat,
  which worker, Jev dispatcher, worker queue. Asks Choice, Score, and
  Noul in one call. Grok Heavy is never a destination. Dry-run unless
  ENABLED.on exists. Does not execute work, send email, change ClickUp,
  or create ENABLED.on.
---

# Jev Dispatcher

Label a job and queue a handoff. The dispatcher does not do the job.

**Principle:** Jev picks the seat. Code applies the confidence rule, the risk rule, capacity, and the Tempo hop limit. Nothing in this skill sends, publishes, or edits ClickUp.

## Outcome

Under the automation root (default `clients/roi-live/projects/jev-dispatcher-2026-09/`):

- dry-run audit at `out/audit.jsonl` when `ENABLED.on` is absent
- one handoff at `queues/<seat>/<job_id>.json` only when `ENABLED.on` is present
- `out/TOKEN_LEDGER.jsonl` with pool, seat, api, tokens, and dollars
- `out/KILL.md` if the resolved model is not `jev-1.13.0`

This skill must not create `ENABLED.on`.

## Context Needs

| File | Load level | Purpose |
|------|-----------|---------|
| `context/learnings.md` | `## tool-jev-dispatcher` | Routing gotchas |
| Tempo `references/model-router-policy-draft.md` | summary | T0–T3 ladder and hop limit |
| `config/dispatcher.json` | full | Seats, capacity, thresholds |

No brand context. Do not load agency page SOPs.

## Dependencies

| Skill / service | Required? | What it provides | Without it |
|-----------------|-----------|------------------|------------|
| `tool-tempo-efficiency` | Required | Gate, kill, audit, hop limit, tier ladder | Do not copy those rules into a second config |
| `tool-polaris-df` | Required for live calls | `HttpJevClient` to `POST /v1/systemone` | Tests use a mock client |
| TypeSafe Jev | Required to label live | Pinned `jev-1.13.0` | Dry-run with no key records `skipped_no_client` and does not queue |

## Commands

```bash
bash scripts/jev-dispatcher --root clients/roi-live/projects/jev-dispatcher-2026-09 --job job.json
```

On Windows, with `TYPESAFE_API_KEY` set in the session:

```powershell
.\.claude\skills\tool-jev-dispatcher\scripts\live-eval.ps1
```

There is no `--send` flag.

## Routing

One System One call asks three questions:

| Question | Type | Use |
|----------|------|-----|
| `destination` | Choice | Seat menu built this run |
| `complexity` | Score | Recorded on the handoff |
| `needs_human_or_publish_risk` | Noul | Yes sends the job to human review |

Menu rules, applied in code before Jev answers:

- Grok Heavy is coordinator only and is never an option
- A seat marked `at_cap` in `seat-capacity.json` is left out
- ChatGPT 20X Max A, B, and C rotate. Only the current open seat is offered

After Jev answers, code overrides the choice when:

- choice confidence is below `confidence_threshold` (start at 0.85)
- the risk noul is at or above `risk_noul_threshold` (start at 0.50)
- blast radius is `ymyl-adjacent`
- the job already used Tempo's hop limit (`MAX_ESCALATE_HOPS`, currently 2)
- the choice is missing, at cap, or Grok

`handoff_complete` is true only after the queue file is read back. Confidence does not count as a write.

## Hard pins

- Request and response model must be `jev-1.13.0`. Anything else kills the run.
- `BOT_EXEC` stays off. This package cannot turn it on.
- Dollar work-model caps stay null until Jason sets them in Tempo. Jev's own token price is confirmed separately in `pricing.py`.
- Same `job_id` is queued once.

## Must not

Execute a job. Send email or chat. Mutate ClickUp. Create `ENABLED.on`. Select Grok as a worker. Treat a confident answer as proof the handoff file exists.
