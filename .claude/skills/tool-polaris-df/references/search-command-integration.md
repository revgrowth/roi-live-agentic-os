# Search Command integration

`str-search-command` is not present in this repo snapshot. This file is the contract that skill (or any operator script) should call. Do not invent a second SOP. Soft judgments only.

Operator drop-in (kill switches, A6 hook points, patch snippet): [`INTEGRATION_SEARCH_COMMAND.md`](../INTEGRATION_SEARCH_COMMAND.md).

## Call sites

Replace LLM-only judges with fabric calls. Keep measured validators in Python.

| SOP gate | Pack | Function |
|----------|------|----------|
| G0 source of truth | `G0.source_of_truth.v1` | `judge_gate` |
| G1 territory | `G1.territory.v1` | `judge_gate` |
| G2 audience / job | `G2.audience_job.v1` | `judge_gate` |
| G3 purity / shortlist | `G3.purity.v1` | `judge_purity_row` |
| G3 SERP-shape (v5.1) | `G3.serp_shape.v1` | `classify_serp_shape` |
| G4 response unit | `G4.response_unit.v1` | `pick_response_unit` |
| G5 public IA | `G5.public_ia.v1` | `judge_gate` |
| G6 claim | `G6.claim_authority.v1` | `judge_gate` (never auto) |
| G7 priority | `G7.priority.v1` | `judge_gate` |
| G8 ship soft-checks | `G8.ship_soft.v1` | `judge_gate` |
| Semantic cannibal verify | `QA.semantic_cannibal.v1` | `verify_semantic_cannibal` |

```python
from polaris_df.adapters.search_command import (
    apply_purity_to_demand_library,
    classify_serp_shape,
    judge_purity_row,
    pick_response_unit,
    verify_semantic_cannibal,
)

rows = apply_purity_to_demand_library(demand_library_rows, dry_run=False)
```

CLI equivalent:

```bash
polaris-df search-command --gate purity --inputs demand-library.jsonl -o out.json
```

## Labeling

- Measured fields (`volume`, `kd`, `item_type_composition`, `aio_citation_count`, ...) stay on the row and are copied back after judgment.
- Jev outputs are always `judgment_added` with a `judgment` provenance block.
- Do not set `measured: true` on a Jev answer.
- C1-C12 and attainability math stay in deterministic code. The fabric will not recompute them.

## Provenance block

```json
"judgment": {
  "gate": "G3.purity.v1",
  "pack_version": "1.0.0",
  "model": "jev-1.13.0",
  "answers": {},
  "route": "auto",
  "decided_at": "2026-09-21T14:00:00Z",
  "source": "jev",
  "labeling": "judgment_added"
}
```

## Purity shortlist (highest ROI)

Batch the shortlist **before** any swarm or frontier classify. That is the cost win.

State the packer expects: `query`, optional `volume`, `seed_context`, `brand_territory`, `exclusions[]`, `sample_serp_titles[]`.

## When Search Command lands in-repo

1. Import this adapter. Do not copy packs into that skill.
2. Keep SOP markdown as the process. This skill stays the judgment runtime.
3. If a gate is already deterministic, leave it alone.
