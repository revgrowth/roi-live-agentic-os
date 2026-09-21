"""Pack keyword-research rows into compact Jev state."""

from __future__ import annotations

from typing import Any

from polaris_df.packers.base import measured_fields, state_from_row
from polaris_df.types import DecisionState


def pack_keyword_row(
    row: dict[str, Any],
    *,
    gate: str = "KW.keep_drop.v1",
    context: dict[str, Any] | None = None,
) -> DecisionState:
    query = str(row.get("query") or row.get("keyword") or "")
    evidence = {
        "query": query,
        "seed_context": row.get("seed_context"),
        "brand_territory": row.get("brand_territory") or (context or {}).get("brand_territory"),
        "exclusions": row.get("exclusions") or (context or {}).get("exclusions") or [],
        "candidate_clusters": row.get("candidate_clusters") or [],
        "keep_signal": row.get("keep_signal"),
        "intent_hint": row.get("intent"),
        "role_hint": row.get("role"),
        **measured_fields(row),
    }
    required = ("query",)
    if gate == "KW.cluster_assign.v1":
        required = ("query", "candidate_clusters")
    return state_from_row(
        unit_id=str(row.get("unit_id") or query),
        gate=gate,
        evidence=evidence,
        context=context,
        required=required,
    )
