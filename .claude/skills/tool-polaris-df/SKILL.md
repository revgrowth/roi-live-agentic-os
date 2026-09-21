---
name: tool-polaris-df
description: >
  Polaris Decision Fabric. Sends compact state to TypeSafe Jev for typed
  noul/choice/score judgments, then routes auto, llm_escalate, or human.
  Use for Search Command G0-G8 soft gates, keyword triage, audit triage,
  content QA, AEO/GEO fitness, and semantic cannibal checks.
  Triggers: polaris, decision fabric, jev, purity gate, serp shape,
  audit-triage, keyword-triage, qa-content, confidence router.
  Does not write prose, titles, schema, or replace measured validators.
  Does not trigger for copywriting or brand voice.
---

# Polaris Decision Fabric

Typed judgment layer for Search Command, audits, keyword research, and QA.
Jev decides. Code measures. LLMs write only after a gate opens a generation lane.

**Principle:** Measure what you can. Decide what you must. Generate only what you ship.

## Outcome

Routed decisions saved under `projects/tool-polaris-df/` (JSON + JSONL log):

- `answers` for every question in the pack
- `route`: `auto` | `llm_escalate` | `human`
- `judgment` provenance on Search Command rows (`judgment_added: true`)
- Eval report with auto rate, escalate rate, agreement vs labels

Always save output to disk. After saving, show the full absolute path.

## Context Needs

| File | Load level | Purpose |
|------|-----------|---------|
| `context/learnings.md` | `## tool-polaris-df` | Threshold drift, pack gotchas |
| `brand_context/positioning.md` | summary | Territory language for packers |
| `brand_context/icp.md` | language section | Reader-job / exclusion language |

Proceed without brand context. Thin measured state is refused, not guessed.

## Dependencies

| Service | Key | Required For | Without It |
|---------|-----|-------------|------------|
| TypeSafe Jev | `TYPESAFE_API_KEY` | Live `systemone` calls | `--dry-run` / mock mode. CI always uses mock. |

Sign up at https://typesafe.ai. Put `TYPESAFE_API_KEY=` in `.env`. Never commit the key.

Pin `jev-1.13.0` in production (`POLARIS_JEV_MODEL` or `--model`). `jev-latest` is for local dry-runs only.

## Skill Relationships

- **Upstream:** `tool-dataforseo` (measured volume / SERP / AIO), crawl exports, Search Command artifacts
- **Downstream:** Search Command soft gates, audit write-ups, keyword libraries, content QA
- **Does not replace:** deterministic C1-C12 validators, volume math, or client-facing prose

`str-search-command` is not in this repo snapshot. Import
`polaris_df.adapters.search_command` from that skill when it lands.
Do not invent a second SOP here.

## When to use

1. Confirm the unit (query, URL, draft, pair, finding) and the pack id.
2. Pack **measured** fields only. See `references/pack-catalog.md`.
3. Run `decide` / the matching pipeline. Read `route` before any LLM write.

## Commands

```bash
python3 -m polaris_df --dry-run packs
python3 -m polaris_df --dry-run decide --pack G3.purity.v1 --state state.json
python3 -m polaris_df --dry-run search-command --gate purity --inputs rows.jsonl
python3 -m polaris_df --dry-run audit-triage --inputs issues.jsonl
python3 -m polaris_df --dry-run keyword-triage --inputs keywords.jsonl
python3 -m polaris_df --dry-run qa-content --inputs drafts.json
python3 -m polaris_df --dry-run eval --fail-under 0.7
```

Set `PYTHONPATH` to this skill folder, or use `scripts/polaris-df`.

## Confidence policy

Defaults: choice auto ≥ 0.85, human < 0.55; noul auto ≥ 0.85 or ≤ 0.15.
YMYL / claim packs (`G6.claim_authority.v1`, `QA.eeat_claim.v1`) never auto-approve.

Full table: `references/confidence-policy.md`.

## Jev must not

Write audit narrative, keyword lists, titles, schema JSON, or strategy prose.
There is no path from Jev answers to client-facing copy.

## Search Command wiring

Soft gates only:

| Gate | Pack | Adapter |
|------|------|---------|
| Purity / shortlist | `G3.purity.v1` | `judge_purity_row` |
| SERP-shape | `G3.serp_shape.v1` | `classify_serp_shape` |
| Response unit | `G4.response_unit.v1` | `pick_response_unit` |
| Semantic cannibal | `QA.semantic_cannibal.v1` | `verify_semantic_cannibal` |

Dispositions get a `judgment` block. Measured volume / KD stay locked.
See `references/search-command-integration.md`.

## Eval

Golden fixtures live in `fixtures/`. CI runs mock eval. Live smoke only if
`TYPESAFE_API_KEY` is set and the operator passes `--live`.
