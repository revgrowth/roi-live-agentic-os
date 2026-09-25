# Jev dispatcher — result

**READY: no.**

Blocker: the live eval has not been run, so agreement with the 50 Tempo-review labels is unknown. Leave `ENABLED.on` uncreated until that report exists. This package does not create that file.

## What this is

The dispatcher asks Jev which seat should take a job, then writes one JSON handoff into that seat's queue. It does not do the job, send email, or change ClickUp.

PR #21 (Tempo gate, kill switch, audit log, tier ladder, hop limit) is still open. This work sits on that branch and imports those rules instead of copying them.

The silent-intake folder `clients/roi-live/projects/jev-silent-intake-golive-2026-09/` is not in the repo. The noise-archive lane is the Tempo SOP, not a separate runner. The HTTP client is Polaris's.

## Grok wakes

Assumption: today, one Grok chat wake routes each job. That routing is what burned 30–35% of the monthly Grok allowance in a day. The target is under 13% a day.

This dispatcher never calls Grok. Grok Heavy stays the coordinator and is not a seat Jev can pick.

| | Grok routing wakes |
|---|---|
| Grok bot routes every job | 1 per job |
| This dispatcher | 0 per job |
| Saved | 1 per job (all routing wakes) |

If that 30–35% was the routing bots, the routing share of the allowance goes to 0%, which is under 13% a day. Coordinator chat on Grok is unchanged, because this tool does not take that work. The job count behind the 30–35% is not in the repo, so the save is stated per job rather than as a guessed daily total.

Jev 1.13 is $0.042 per million input tokens and $0 for output. Source: the TypeSafe models page, https://docs.typesafe.ai/models, checked 2026-09-25. The ledger has a `usd` column using that rate. One million input tokens is $0.042. A normal routing call is a fraction of a cent. Tempo's caps on the worker models are still blank until Jason sets them.

## What A6 still has to run

1. Set `TYPESAFE_API_KEY` in the PowerShell session. Do not put the key in the repo and do not print it.
2. Run `.claude\skills\tool-jev-dispatcher\scripts\live-eval.ps1`.
3. Read `clients\roi-live\projects\jev-dispatcher-2026-09\eval-run\live-eval-report.json` for agreement and misses.
4. Have Tempo review the 50 labels. They are marked `needs_tempo_review` on purpose.
5. If the response `model` is anything other than `jev-1.13.0`, the run kills and writes `out/KILL.md`. That is intentional. Do not loosen the pin to make the eval pass.
6. After the report looks right, Jason decides whether to create `ENABLED.on`. Until that file exists, nothing is queued.

Seat caps, if any seat is actually full, go in `seat-capacity.json` next to the gate. A capped seat is left off the menu.
