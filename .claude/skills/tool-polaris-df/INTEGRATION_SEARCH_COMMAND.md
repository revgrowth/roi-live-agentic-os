# Search Command × Polaris DF soft gates

`str-search-command` is **not in this repo**. Do not invent a second SOP. This kit is what an A6 (or any local SC) checkout drops in.

Use the shim. Do not copy `polaris_df/packs/`. Do not change DF auto thresholds.

## How SC calls the gates

```python
from integrations.str_search_command_soft_gates import (
    apply_purity_to_demand_library,
    classify_serp_shape,
    pick_response_unit,
    run_gate,
    verify_semantic_cannibal,
)

row = classify_serp_shape(serp_record)          # G3 serp_shape
row = pick_response_unit(row)                   # G4 select
rows = apply_purity_to_demand_library(demand)   # G3 purity / run
row = run_gate("claim", row)                    # G6 — never auto
```

Direct adapter (`polaris_df.adapters.search_command`) is fine if PYTHONPATH already includes this skill. The shim is the safe drop-in: dry_run default, no-op if misconfigured.

| SC hook (or equivalent) | Shim | Pack |
|-------------------------|------|------|
| `serp_shape` | `classify_serp_shape` / `run_gate("serp_shape")` | `G3.serp_shape.v1` |
| `select` | `pick_response_unit` / `apply_purity_to_demand_library` | `G4.response_unit.v1` / `G3.purity.v1` |
| `run` | `run_gate("purity")` / `run_gate(<gate>)` | see `SOFT_GATES` |

## Kill switches

| Env | Default | Effect |
|-----|---------|--------|
| `POLARIS_DF_SOFT_GATES` | on | `0` / `off` / `false` → pass rows through (`judgment_skipped`) |
| `POLARIS_DF_LIVE` | off | unset → **dry_run**. `1` / `on` only if `TYPESAFE_API_KEY` is set; otherwise still mock |

Missing `polaris_df` import also no-ops. Never raises on misconfig.

## Measured-field lock

`volume`, `search_volume`, `kd`, `keyword_difficulty`, `cpc`, `competition`, `first_organic_rank_absolute`, `aio_citation_count`, `item_type_composition`, `measured` are copied back after judgment. C1–C12 stay in SC Python.

## YMYL / claim

`G6.claim_authority.v1` and `QA.eeat_claim.v1` never auto. The shim clamps `route` to `human` if a claim/YMYL pack ever returns `auto`. Do not publish from these gates.

## JSONL + Tempo joint schema

DF emits `route` (`auto` | `llm_escalate` | `human`). Tempo/COO docs say `router_outcome`. Consumers accept **either**; prefer `route` if both exist.

`judgment_jsonl_record(row)` writes the shared keys. `safety` is omitted — do not invent a DF safety score.

Shared `confidence`: choice/score → `min(confidence)`; noul → `|p-0.5|*2`; mixed → min of those. Numeric auto bands stay lane-local (DF ~0.85 vs COO 0.95). One-line pointer: Tempo `references/joint-confidence-kill-schema.md` (PR #21) — do not fork it here.

## A6 hook points (skill absent here)

Wire these three call sites in the local skill. Names vary; match by job.

1. **serp_shape** — after measured SERP features exist, before attainability math.
2. **select** — shortlist / response-unit pick, before swarm or frontier classify.
3. **run** — pipeline driver / remaining G0–G8 soft judges via `run_gate`.

Leave deterministic validators alone.

### Apply notes

```text
1. PYTHONPATH includes .claude/skills/tool-polaris-df
   OR copy integrations/str_search_command_soft_gates.py next to the SC script
   (copied file still walks up to find polaris_df).
2. Leave POLARIS_DF_LIVE unset until a live key is intentional.
3. Import the shim. Do not copy packs/.
4. After a hook, read row["judgment"]["route"] (alias router_outcome).
5. If judgment_skipped, keep the existing SC path.
```

### Patch snippet

```python
# serp_shape.py / classify_serp / g3_serp  (after item_type_composition is measured)
from integrations.str_search_command_soft_gates import classify_serp_shape
record = classify_serp_shape(record)  # dry_run default
if record.get("judgment_skipped"):
    pass  # existing SC classifier
else:
    serp_shape = record.get("serp_shape")

# select.py / shortlist / response_unit
from integrations.str_search_command_soft_gates import (
    apply_purity_to_demand_library,
    pick_response_unit,
)
demand_rows = apply_purity_to_demand_library(demand_rows)
selected = pick_response_unit(selected)

# run.py / pipeline
from integrations.str_search_command_soft_gates import run_gate
row = run_gate("purity", row)
row = run_gate("claim", row)  # never auto
```

Full pack map: `references/search-command-integration.md`.
