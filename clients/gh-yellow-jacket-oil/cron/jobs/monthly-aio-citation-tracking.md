---
name: G&H Monthly AIO Citation Tracking
time: '07:00'
days: mon
active: 'true'
model: sonnet
notify: on_finish
description: 'Monthly SERP re-pull for the 32 Phase 1 keywords. Tracks AI Overview citation share over time per the Phase 2 retainer AEO monitoring deliverable.'
timeout: 30m
retry: '0'
---
You are running as a scheduled cron job for the gh-yellow-jacket-oil client.

Read CLAUDE.md and clients/gh-yellow-jacket-oil/AGENTS.md for context.

This job runs every Monday but should only execute on the **first Monday of each month**. On every other Monday, write a single line `Not first Monday — skipping` to today's session memory and end your response with `[SILENT]` on its own line. Do not call DataForSEO on non-first Mondays.

## First Monday Workflow

### Task

Re-pull SERP data for the 32 Phase 1 keywords, save a dated snapshot, and write a delta report against the previous month's snapshot. The point of this job is to track AI Overview citation share over the 15-month engagement — who is being cited, who has gained or lost citations, and whether `ghdiv.com` and competitor domains (especially `repeatprecision.com`) are moving up or down the citation board.

### Step 1: Set up paths

Let `MONTH` = today's date in `YYYY-MM` format. Snapshot directory:

```
clients/gh-yellow-jacket-oil/projects/aio-tracking/{MONTH}/
```

Create the directory.

### Step 2: Re-pull SERP data with --force

Use the `tool-dataforseo` skill. Read `.claude/skills/tool-dataforseo/SKILL.md` first if you need a refresher on its options.

Run:

```
node .claude/skills/tool-dataforseo/scripts/validate-keywords.js \
  --input clients/gh-yellow-jacket-oil/projects/cluster-map.json \
  --output-dir clients/gh-yellow-jacket-oil/projects/aio-tracking/{MONTH} \
  --output-name keyword-validation \
  --force
```

`--force` is required — caching is what we're explicitly bypassing. Otherwise the job would never see new SERP data.

Expected runtime: 3–5 minutes for 27 unique keywords. Expected cost: ~$0.08–$0.10. If the run fails partway through, paid-but-incomplete responses are still cached per-keyword in `aio-tracking/{MONTH}/raw/serp/`. A second run would resume from there. If the run errors out completely (HTTP 401, network failure), exit and log the error to today's memory — do not retry blindly.

### Step 3: Compute deltas vs. last month

Find the most recent prior snapshot at `clients/gh-yellow-jacket-oil/projects/aio-tracking/`. If none exists (first run), skip Step 3 and produce a baseline report instead at Step 4.

If a prior month exists, for each of the 32 deliverables compare this month vs. last month:

- **AIO presence change.** Did this keyword gain an AI Overview that wasn't there last month? Lose one that was?
- **Citation domain churn.** For keywords with AIO in both months: which domains were added to the citation set, which were removed, which are stable?
- **`ghdiv.com` movement.** Did G&H gain a new AIO citation? Lose one? List every keyword where this happened.
- **Competitor movement.** Same analysis for `repeatprecision.com`, `wellboss.com`, `dynaenergetics.com`, `huntingplc.com`, and any new domain that appears in 3+ keywords this month for the first time.

Read the per-keyword JSON from this month and last month's `raw/serp/` directories to do the comparison. Do not re-derive from the markdown table — the JSON has the citation refs.

### Step 4: Write the delta report

Save to `clients/gh-yellow-jacket-oil/projects/aio-tracking/{MONTH}/delta.md`.

Include:

```markdown
# AIO Citation Tracking — {MONTH}

**Comparison against:** {prior MONTH or "baseline (no prior snapshot)"}
**Run date:** {YYYY-MM-DD}
**Keywords with AIO this month:** {N} / 32
**Keywords with AIO last month:** {N} / 32

## Headline Movement

- **G&H (`ghdiv.com`) citations:** {N} this month, {N} last month. Net: {+/- N}
- **Repeat Precision citations:** {N} this month, {N} last month. Net: {+/- N}
- {Other notable competitor movement in 1-2 lines}

## AIO Gained This Month

- `keyword` — gained AIO ({title})
- ...

## AIO Lost This Month

- `keyword` — lost AIO ({title})
- ...

## Citation Domain Churn (AIO present both months)

| Keyword | Domains Added | Domains Removed |
|---|---|---|
| `frac plug` | example1.com | example2.com |
| ... | ... | ... |

## G&H Citation Detail

- **Gained:** {keyword list, or "None"}
- **Lost:** {keyword list, or "None"}
- **Held:** {keyword list with "still cited" — confirms persistence}

## Competitor Citation Detail

- **Repeat Precision gained:** {keyword list}
- **Repeat Precision lost:** {keyword list}
- **New domains appearing in 3+ AIOs for the first time:** {list, or "None"}

## Action Items

- {1-3 concrete suggestions based on the movement: keywords where G&H lost citations are candidates for content refresh, competitors gaining citations on G&H's existing keywords are urgency signals, etc.}

## Raw Data

- This month: `aio-tracking/{MONTH}/keyword-validation.md`
- This month per-keyword JSON: `aio-tracking/{MONTH}/raw/serp/`
- Prior month: `aio-tracking/{prior MONTH}/keyword-validation.md`
```

### Step 5: Notify

If the delta report contains any of the following, end the response normally (the user gets a desktop notification):

- G&H lost an AIO citation it previously held
- Repeat Precision gained an AIO citation on a keyword where G&H is also cited
- Net AIO citation change for G&H is negative
- A new competitor domain appeared in 3+ AIOs

Otherwise (movement is neutral or favourable), end the response with `[SILENT]` on its own line so no notification fires. The monthly snapshot is still saved either way — silent just means no need to interrupt the user.

### Failure modes to watch for

- **DataForSEO credentials missing or invalid.** Exit, log to today's memory.
- **Skill script not found.** The path `.claude/skills/tool-dataforseo/scripts/validate-keywords.js` must exist. If it doesn't, the skill was removed or moved — exit and flag the gap.
- **First-run baseline.** No prior snapshot. Produce only the "this month" data — no delta tables. Note "baseline run" in the report header.
- **Cluster map drift.** If `cluster-map.json` differs from prior month (keywords added/removed), note it in the report. Phase 2 will add new monthly content per the retainer; the cluster will grow.

### Update cluster-map.json before running

If new content was published since last month and new keywords need tracking, update `clients/gh-yellow-jacket-oil/projects/cluster-map.json` first — it's the canonical input. The cron job picks up whatever is in that file.
