# Jev dispatcher — result

**READY: no.**

Blocker: the live eval has not been run, so agreement with the Tempo-reviewed labels is unknown. Leave `ENABLED.on` uncreated until that report exists. This package does not create that file.

## What this is

The dispatcher asks Jev which seat should take a job, then writes one JSON handoff into that seat's queue. It does not do the job, send email, or change ClickUp.

PR #21 (Tempo gate, kill switch, audit log, tier ladder, hop limit) is still open. This work sits on that branch and imports those rules instead of copying them.

The silent-intake folder `clients/roi-live/projects/jev-silent-intake-golive-2026-09/` is not in the repo. The noise-archive lane is the Tempo SOP, not a separate runner. The HTTP client is Polaris's.

## Eval labels

Tempo reviewed the set on 2026-09-24. Every row has `tempo_reviewed: 2026-09-24` and an `acceptable` list. The primary seat is `ideal_seat` and it always sits inside that list.

50 rows.

| Primary seat | Rows |
|---|---|
| Claude Team | 18 |
| ChatGPT 20X Max | 10 |
| Human review | 7 |
| GLM 5.3 Max | 6 |
| Kimi K3 Max | 5 |
| Cursor cloud | 4 |

17 rows have more than one acceptable seat. Eight of those were wrong primaries that Tempo corrected. Ten keep the old primary and add the seats Tempo called acceptable. The Figma MCP setup is human review only, so it is a corrected primary with a single acceptable seat.

Two rows require human review, meaning human review is the only acceptable seat: the Figma MCP credential setup on Jason's machine, and the removed-claims review on the leaking-water spoke. Other rows that list human review also list a model, so a model pick still counts as a lenient hit.

Three repo-code jobs are labeled Cursor cloud only: the Tempo model router, the Polaris System One client, and this dispatcher. A fourth Cursor row is the Green Llama month-end update of `green-llama-dashboard.html`. Claude is also acceptable on that dashboard update.

Dropped three thin or duplicate rows so the set stayed at 50: the May FCMO cycle placeholder, the Yellow Jacket cluster-map table, and the Green Llama Search Console extraction (GA4 and Shopify extractions stay). The AC-not-cooling row stayed. It is a full Firecrawl fetch of the live spoke, and Tempo's extra seats are GLM, Kimi, and human review.

Eleven rows had `Title: ---` because the first line of YAML frontmatter was read as the heading. Those titles are the real H1s now.

Scoring:

- Strict agreement: Jev's pick matches the primary seat, after family expansion.
- Lenient agreement: Jev's pick is in the acceptable list, after the same expansion. This is the headline rate.
- ChatGPT Team counts as the ChatGPT family, the same way 20X A, B, and C already do.
- GLM 5.3 Max and Kimi K3 Max swap with each other on standard execution jobs only.
- Human-review recall: of the rows that require review, how many Jev (or the safety override) sent to human review.

Alvara stays `blast_radius: internal` in the eval row even though the source is money and contract content. Marking it YMYL-adjacent would force human review in code and stop the row from testing Jev's choice. The money and contract facts are in the goal and the state instead.

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

1. Run `.claude\skills\tool-jev-dispatcher\scripts\live-eval.ps1`. If `TYPESAFE_API_KEY` is already in the session, that value is used. If it is empty, the script reads it from the agentic-os root `.env`. It does not print the key.
2. Read `clients\roi-live\projects\jev-dispatcher-2026-09\eval-run\live-eval-report.json`. It reports strict agreement, lenient agreement, and human-review recall.
3. If the response `model` is anything other than `jev-1.13.0`, the run kills and writes `out/KILL.md`. That is intentional. Do not loosen the pin to make the eval pass.
4. After the report looks right, Jason decides whether to create `ENABLED.on`. Until that file exists, nothing is queued.

Seat caps, if any seat is actually full, go in `seat-capacity.json` next to the gate. A capped seat is left off the menu.
