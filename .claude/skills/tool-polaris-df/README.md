# Polaris Decision Fabric

Operator runtime for TypeSafe Jev inside ROI.LIVE agentic-os.

Jev is a System One decision engine. It returns typed `noul` / `choice` / `score` answers with probabilities. It does not write. This package is the catalog, router, log, and Search Command adapter around that API.

Measure what you can. Decide what you must. Generate only what you ship.

## Install / import

No extra runtime packages. Python 3.10+.

```bash
# from repo root
export PYTHONPATH=".claude/skills/tool-polaris-df${PYTHONPATH:+:$PYTHONPATH}"
python3 -m polaris_df --help

# or
bash scripts/polaris-df --help

# optional editable install
pip install -e .claude/skills/tool-polaris-df
```

`str-search-command` is not in this repo snapshot. Call the portable shim (or the adapter) from that skill when it lands:

```python
from integrations.str_search_command_soft_gates import classify_serp_shape, run_gate
# or: from polaris_df.adapters.search_command import judge_purity_row, classify_serp_shape
```

See `INTEGRATION_SEARCH_COMMAND.md`.

## Environment

| Variable | Purpose |
|----------|---------|
| `TYPESAFE_API_KEY` | Live Jev. Never commit. Listed in `.env.example`. |
| `TYPESAFE_BASE_URL` | Default `https://api.typesafe.ai` |
| `POLARIS_JEV_MODEL` or `TYPESAFE_DEFAULT_MODEL` | Pin. Prod default `jev-1.13.0`. |
| `POLARIS_DF_LOG` | Optional JSONL path override |
| `POLARIS_DF_SOFT_GATES` | Search Command kill switch. Default on. `0`/`off` no-ops the shim. |
| `POLARIS_DF_LIVE` | Search Command live switch. Default off → dry_run. |

If the key is missing, every command uses mock mode. `--dry-run` forces mock even when a key exists. `--live` refuses to run without a key.

Cloud CI has no key. Tests and `polaris-df eval` run mock-only.

## Commands

```bash
# one row
polaris-df decide --pack G3.purity.v1 --state state.json

# many rows, one pack
polaris-df batch --pack G3.purity.v1 --inputs rows.jsonl

# Search Command wrappers (judgment only)
polaris-df search-command --gate purity --inputs demand-library.jsonl
polaris-df search-command --gate serp_shape --inputs serp-records.jsonl
polaris-df search-command --gate response_unit --inputs rows.jsonl
polaris-df search-command --gate semantic_cannibal --inputs pairs.jsonl

# pipelines
polaris-df audit-triage --inputs crawl-issues.jsonl
polaris-df keyword-triage --inputs keywords.jsonl
polaris-df qa-content --inputs drafts.json

# fixtures
polaris-df eval --dry-run --fail-under 0.7

# catalog
polaris-df packs
```

Add `--dry-run` in CI and on laptops without a key. Add `-o path.json` to save.

Decision log default: `projects/tool-polaris-df/logs/{YYYY-MM-DD}_decisions.jsonl`.

## Pack list

Search Command: `G0.source_of_truth.v1`, `G1.territory.v1`, `G2.audience_job.v1`, `G3.purity.v1`, `G3.serp_shape.v1`, `G4.response_unit.v1`, `G5.public_ia.v1`, `G6.claim_authority.v1`, `G7.priority.v1`, `G8.ship_soft.v1`, `QA.semantic_cannibal.v1`.

Keyword: `KW.keep_drop.v1`, `KW.intent.v1`, `KW.cluster_assign.v1`, `KW.hub_spoke.v1`, `KW.funnel.v1`, `KW.aeo_question.v1`, `KW.geo_entity.v1`.

Audit: `AUDIT.tech_severity.v1`, `AUDIT.onpage_quality.v1`, `AUDIT.content_gap.v1`, `AUDIT.aeo_cite.v1`, `AUDIT.geo_citation.v1`, `AUDIT.finding_priority.v1`.

QA: `QA.brief_compliance.v1`, `QA.intent_match.v1`, `QA.aeo_pack.v1`, `QA.content_publish.v1`, `QA.internal_link.v1`, `QA.eeat_claim.v1`, `QA.voice_fit.v1`.

Also: intake precheck, teardown lens, ClickUp route, AEO panel filter, SERP drift, Respira patch QA.

Each pack has `id`, `version`, `questions`, `default_thresholds`, and a `docs` string. `polaris-df packs` prints them.

Details: `references/pack-catalog.md`.

## How Search Command uses this

Do not rewrite the SOP. Soft gates call the fabric **before** a frontier LLM.

| Current judgment | Fabric call |
|------------------|-------------|
| Purity / shortlist judge | `judge_purity_row` / `G3.purity.v1` |
| Semantic verify agent | `verify_semantic_cannibal` / `QA.semantic_cannibal.v1` |
| SERP-shape token | `classify_serp_shape` / `G3.serp_shape.v1` |
| Response-unit pick | `pick_response_unit` / `G4.response_unit.v1` |

Deterministic validators (C1-C12, measured volumes) do not go through Jev.

Rows come back with:

```json
{
  "query": "heat pump installation charleston",
  "volume": 720,
  "measured": true,
  "judgment_added": true,
  "disposition": "keep",
  "disposition_source": "judgment_added",
  "judgment": {
    "gate": "G3.purity.v1",
    "model": "jev-1.13.0",
    "route": "auto",
    "answers": {},
    "decided_at": "2026-09-21T14:00:00Z",
    "labeling": "judgment_added"
  }
}
```

`volume` / `kd` / other measured fields are locked. Jev cannot change them.

## Confidence policy

Starting points (tune against overrides, never silently):

| Signal | Auto | Escalate | Human |
|--------|------|----------|-------|
| choice.confidence | ≥ 0.85 | 0.55-0.85 | < 0.55 |
| noul | ≥ 0.85 or ≤ 0.15 | mid | near 0.5 on high-stakes |
| score extreme + conf ≥ 0.8 | auto band | mid | low conf |

YMYL / claim / legal gates **never auto-approve**. Jev only triages severity and names the reviewer. Packs: `G6.claim_authority.v1`, `QA.eeat_claim.v1`.

See `references/confidence-policy.md`.

## What Jev must not do

- Write audit narrative or client decks
- Invent keyword lists, titles, H1s, or schema JSON
- Recompute volume, KD, or attainability
- Override C1-C12
- Auto-approve medical / financial / legal claims

If you need prose, escalate to an LLM **after** the route says so.

## Eval / CI

```bash
python3 -m unittest discover -s .claude/skills/tool-polaris-df/tests -p 'test_*.py'
python3 -m polaris_df --dry-run eval --fail-under 0.7
```

Fixtures: `fixtures/purity.jsonl`, `intent.jsonl`, `serp_shape.jsonl`, `semantic_cannibal.jsonl`.

Metrics: auto rate, escalate rate, human rate, agreement vs labels.

Optional live smoke (operator machine only):

```bash
polaris-df --live eval --fail-under 0.5
```

## Tests

```bash
cd /path/to/roi-live-agentic-os
PYTHONPATH=.claude/skills/tool-polaris-df python3 -m unittest discover -s .claude/skills/tool-polaris-df/tests -p 'test_*.py'
```
