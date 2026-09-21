"""Search Command judgment wrappers.

This module is the integration surface for str-search-command. It does not
rewrite the SOP. It only runs soft gates through the fabric and stamps a
judgment provenance block. Measured fields (volume, KD, C1-C12 inputs) pass
through unchanged.
"""

from __future__ import annotations

from copy import deepcopy
from typing import Any, Iterable

from polaris_df.decide import decide
from polaris_df.packers.base import measured_fields
from polaris_df.packers.search_command import (
    pack_gate_row,
    pack_purity_row,
    pack_response_unit,
    pack_semantic_pair,
    pack_serp_shape,
)
from polaris_df.types import DecisionState, RoutedDecision

MEASURED_LOCK = (
    "volume",
    "search_volume",
    "kd",
    "keyword_difficulty",
    "cpc",
    "competition",
    "first_organic_rank_absolute",
    "aio_citation_count",
    "item_type_composition",
    "measured",
)


def attach_judgment(
    artifact: dict[str, Any],
    decision: RoutedDecision,
    *,
    extra_judgment_fields: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """Stamp judgment provenance. Never overwrite locked measured fields."""
    out = deepcopy(artifact)
    locked = {key: artifact[key] for key in MEASURED_LOCK if key in artifact}
    locked.update(measured_fields(artifact))
    out["judgment_added"] = True
    if "measured" not in out and locked:
        out["measured"] = True
    judgment = decision.provenance()
    # Tempo joint schema: accept `route` or `router_outcome`. Prefer `route`.
    if "route" in judgment and "router_outcome" not in judgment:
        judgment["router_outcome"] = judgment["route"]
    if extra_judgment_fields:
        judgment.update(extra_judgment_fields)
    out["judgment"] = judgment
    for key, value in locked.items():
        out[key] = value
    return out


def _disposition_from_purity(decision: RoutedDecision) -> str:
    answers = decision.answers or {}
    choice = answers.get("disposition") or {}
    if choice.get("choice"):
        return str(choice["choice"])
    if float((answers.get("wrong_sense") or {}).get("noul") or 0) >= 0.85:
        return "reject_sense"
    if float((answers.get("excluded_intent") or {}).get("noul") or 0) >= 0.85:
        return "reject_exclusion"
    if float((answers.get("off_territory") or {}).get("noul") or 0) >= 0.85:
        return "reject_territory"
    return "hold_evidence"


def judge_purity_row(
    row: dict[str, Any],
    *,
    context: dict[str, Any] | None = None,
    dry_run: bool = False,
    model: str | None = None,
) -> dict[str, Any]:
    state = pack_purity_row(row, context)
    decision = decide("G3.purity.v1", state, dry_run=dry_run, model=model)
    out = attach_judgment(row, decision)
    out["disposition"] = _disposition_from_purity(decision)
    out["disposition_source"] = "judgment_added"
    return out


def classify_serp_shape(
    row: dict[str, Any],
    *,
    context: dict[str, Any] | None = None,
    dry_run: bool = False,
    model: str | None = None,
) -> dict[str, Any]:
    state = pack_serp_shape(row, context)
    decision = decide("G3.serp_shape.v1", state, dry_run=dry_run, model=model)
    out = attach_judgment(row, decision)
    shape = (decision.answers.get("serp_shape") or {}).get("choice")
    out["serp_shape"] = shape
    out["serp_shape_source"] = "judgment_added"
    return out


def pick_response_unit(
    row: dict[str, Any],
    *,
    context: dict[str, Any] | None = None,
    dry_run: bool = False,
    model: str | None = None,
) -> dict[str, Any]:
    state = pack_response_unit(row, context)
    decision = decide("G4.response_unit.v1", state, dry_run=dry_run, model=model)
    out = attach_judgment(row, decision)
    out["response_unit"] = (decision.answers.get("response_unit") or {}).get("choice")
    out["response_unit_source"] = "judgment_added"
    return out


def verify_semantic_cannibal(
    pair: dict[str, Any],
    *,
    context: dict[str, Any] | None = None,
    dry_run: bool = False,
    model: str | None = None,
) -> dict[str, Any]:
    state = pack_semantic_pair(pair, context)
    decision = decide("QA.semantic_cannibal.v1", state, dry_run=dry_run, model=model)
    out = attach_judgment(pair, decision)
    same = float((decision.answers.get("same_serp") or {}).get("noul") or 0)
    out["same_serp"] = same
    out["recommended_owner"] = (decision.answers.get("recommended_owner") or {}).get("choice")
    out["same_serp_source"] = "judgment_added"
    return out


def judge_gate(
    pack_id: str,
    row: dict[str, Any],
    *,
    context: dict[str, Any] | None = None,
    dry_run: bool = False,
    model: str | None = None,
) -> dict[str, Any]:
    state: DecisionState = pack_gate_row(pack_id, row, context)
    decision = decide(pack_id, state, dry_run=dry_run, model=model)
    return attach_judgment(row, decision)


def apply_purity_to_demand_library(
    rows: Iterable[dict[str, Any]],
    *,
    context: dict[str, Any] | None = None,
    dry_run: bool = False,
    model: str | None = None,
) -> list[dict[str, Any]]:
    """Batch G3 purity over demand-library rows. Operator UX stays a table of dispositions."""
    return [
        judge_purity_row(row, context=context, dry_run=dry_run, model=model)
        for row in rows
    ]


SOFT_GATES = {
    "purity": "G3.purity.v1",
    "serp_shape": "G3.serp_shape.v1",
    "response_unit": "G4.response_unit.v1",
    "semantic_cannibal": "QA.semantic_cannibal.v1",
    "territory": "G1.territory.v1",
    "audience": "G2.audience_job.v1",
    "ia": "G5.public_ia.v1",
    "claim": "G6.claim_authority.v1",
    "priority": "G7.priority.v1",
    "ship": "G8.ship_soft.v1",
    "source": "G0.source_of_truth.v1",
}
