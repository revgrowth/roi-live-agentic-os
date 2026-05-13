---
name: tool-dataforseo
description: >
  Pull keyword research and SERP data from DataForSEO. Three scripts:
  keyword-overview (search volume, KD, competition, intent for a keyword
  list), serp-advanced (full SERP for one or more keywords with AI Overview
  detection and citation domains), and validate-keywords (combined pipeline:
  runs both for a deliverables list and produces a markdown validation table).
  All paid output is cached per-keyword on disk so re-runs skip API calls.
  Requires DATAFORSEO_LOGIN + DATAFORSEO_PASSWORD in .env.
  Triggers on: "keyword research", "search volume", "keyword difficulty",
  "validate keywords", "SERP analysis", "AI Overview citations",
  "AEO competitor audit", "DataForSEO", "what shows up for", "what's the volume for".
  Used as a data source by str-ai-seo and other research skills.
  Does NOT trigger for content writing, brand voice, ICP, or general web search.
---

# DataForSEO Tool

Utility skill for pulling keyword and SERP data from DataForSEO. Three scripts, three jobs:

- **`keyword-overview`** — bulk volume / KD / competition / intent for a keyword list
- **`serp-advanced`** — full SERP per keyword (AI Overview, organic, features, citations)
- **`validate-keywords`** — combined pipeline: runs both for a list of deliverables and emits a single validation markdown table

Used standalone for ad-hoc research, and as the data backend for `str-ai-seo` and other strategy skills.

## Outcome

DataForSEO API output saved to disk under `projects/tool-dataforseo/` (or a custom `--output-dir`):

- Raw JSON per call, persisted per-keyword (idempotent — re-runs skip cached files)
- Human-readable markdown summary with the parsed data

## Context Needs

| File | Load level | Purpose |
|------|-----------|---------|
| `context/learnings.md` | `## tool-dataforseo` section | Known issues, response-shape gotchas, pricing changes |

No brand_context files needed — this is a utility skill.

## Dependencies

| Service | Key | Required For | Without It |
|---------|-----|-------------|------------|
| DataForSEO | `DATAFORSEO_LOGIN` + `DATAFORSEO_PASSWORD` | All three scripts | No fallback. Skill is non-functional without credentials. |

Get credentials at https://app.dataforseo.com/register. Pay-as-you-go pricing — first ~$1 of credits comes free with a new account.

Node.js 18+ required (uses native `fetch`). Zero npm dependencies.

## Step 1: Check Credentials

Before any call, verify `DATAFORSEO_LOGIN` and `DATAFORSEO_PASSWORD` exist in the workspace `.env`. The `lib/client.js` helper auto-discovers `.env` by walking up from the working directory.

If credentials are missing, follow the External Services rules in `AGENTS.md`:

1. Tell the user what DataForSEO would do for the specific task.
2. Tell them how to get it: "Sign up at https://app.dataforseo.com/register, then add `DATAFORSEO_LOGIN=your-email` and `DATAFORSEO_PASSWORD=your-api-password` to `.env`."
3. There is no fallback for this service — pause and ask the user before attempting workarounds.

## Step 2: Determine the Request Type

| Request | What to use |
|---------|-------------|
| "What's the volume for X?" / "Pull KD for these keywords" | Step 3 — keyword-overview |
| "What does the SERP look like for X?" / "Is there an AI Overview on X?" | Step 4 — serp-advanced |
| "Validate this cluster map" / "Build a keyword research table" | Step 5 — validate-keywords (combined) |
| Another skill needs SERP data | Provide whichever script output it expects |

## Step 3: Keyword Overview

```bash
node .claude/skills/tool-dataforseo/scripts/keyword-overview.js \
  --keywords "frac plug,wireline,perforating gun" \
  --output-dir projects/tool-dataforseo/
```

Or read keywords from a file (one per line, `#` comments allowed):

```bash
node .claude/skills/tool-dataforseo/scripts/keyword-overview.js \
  --keywords-file path/to/list.txt \
  --output-dir projects/tool-dataforseo/
```

Outputs `keyword-overview.json` (raw) and `keyword-overview.md` (table).

## Step 4: SERP Advanced

```bash
node .claude/skills/tool-dataforseo/scripts/serp-advanced.js \
  --keywords "frac plug,bridge plug" \
  --output-dir projects/tool-dataforseo/serp/
```

Each keyword's response is persisted to `{slug}.json` immediately on return — a mid-run crash cannot lose paid output. Re-runs reuse cached files. Pass `--force` to bypass.

`load_async_ai_overview: true` is on by default — produces full AI Overview content + citation domains. Pass `--no-aio` to skip (faster, less data).

Also produces a `summary.md` with feature inventory and AIO citation roll-up.

## Step 5: Validate Keywords (Combined Pipeline)

```bash
node .claude/skills/tool-dataforseo/scripts/validate-keywords.js \
  --input projects/cluster-map.json \
  --output-dir projects/
```

`--input` accepts either:

- An array of deliverables: `[{ "id": 1, "cluster": "...", "type": "pillar", "title": "...", "keyword": "..." }, ...]`
- A flat array of keyword strings: `["frac plug", "wireline", ...]`

Or pass keywords directly with `--keywords` / `--keywords-file`.

Writes:
- `{output-dir}/raw/keyword-overview.json`
- `{output-dir}/raw/serp/{slug}.json` (one per unique keyword)
- `{output-dir}/keyword-validation.md` — single combined table grouped by cluster, with LOW_VOLUME / HIGH_KD / AIO_PRESENT flags, AIO citation domains, and top-10 organic per keyword

Idempotent — every paid call is cached. Re-runs only call the API for missing keywords.

## Common Options (All Scripts)

| Flag | Default | Notes |
|---|---|---|
| `--location-code` | `2840` | DataForSEO location code (US default) |
| `--language-code` | `en` | Language code |
| `--output-dir` | `projects/tool-dataforseo/` | Where to write JSON + markdown |
| `--force` | off | Re-call API even if cached file exists |
| `--env` | auto-discovered | Path to `.env` if not in repo root |
| `--delay-ms` | `400` | Inter-SERP-request delay (rate-limit margin) |

## Step 6: Save Output

All scripts save to disk by default. Read the output paths from the script logs and surface them to the user. **Do not** attempt to render the full markdown table in chat — they are large (often 600+ lines for a cluster map). Summarize: count of keywords, count flagged, count with AIO, then show the file path.

## Step 7: Collect Feedback

If used standalone, ask: "Pulled the data. Want me to dig into anything specific — flagged keywords, AIO competitors, basin-specific variants?"

Log feedback to `context/learnings.md` → `## tool-dataforseo`.

---

## Rules

*Updated automatically when the user flags issues. Read before every run.*

- **Never re-call the API for a keyword that has a cached JSON file** unless the user explicitly passes `--force`. Paid output stays paid.
- **Persist paid responses immediately.** Each SERP call writes to disk before the next call starts. Do not batch writes — a mid-run crash will lose data.
- **Treat missing overview rows as a soft LOW_VOLUME signal**, not as an error. DataForSEO Labs omits keywords with insufficient measured volume from the response.
- **Check both response shapes for AI Overview references.** Some responses put citation refs at `item.references`; others nest them inside `item.items[].references`. The summariser handles both — keep that pattern.

---

## Self-Update

If the user flags an issue — wrong location code, missing AIO citations, response-shape change — update the `## Rules` section and `references/api-guide.md` immediately with the correction and today's date.

---

## Troubleshooting

- **"DATAFORSEO_LOGIN / DATAFORSEO_PASSWORD missing"** — credentials not in `.env`. Add them per Step 1.
- **`HTTP 401`** — bad credentials. Re-check the email/password against the DataForSEO dashboard.
- **`API status 40400` / "no result"** — the keyword returned no SERP. Try a different device, or accept that the term is a dead lookup.
- **AI Overview missing on a keyword that visibly has one in Google** — `load_async_ai_overview` may have timed out. Retry with `--force` for that keyword. AIO presence also varies by location and device — try `--device mobile`.
- **`projects/tool-dataforseo/` doesn't exist** — scripts auto-create it. If you see ENOENT errors, the parent path is invalid; check `--output-dir`.
- **Re-run finished suspiciously fast** — that's the cache working. Pass `--force` if you genuinely need fresh data.
- **Cost spiked unexpectedly** — check whether `--force` was passed, or whether the keyword list grew. Per-call cost is logged in the `references/api-guide.md`.
