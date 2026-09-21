"""Shared packing helpers. Evidence only; no generated prose."""

from __future__ import annotations

from typing import Any

from polaris_df.types import DecisionState, ThinStateError

MEASURED_PASSTHROUGH = (
    "volume",
    "kd",
    "keyword_difficulty",
    "cpc",
    "competition",
    "search_volume",
    "first_organic_rank_absolute",
    "aio_citation_count",
    "item_type_composition",
    "url",
    "status_code",
    "indexable",
    "canonical",
)


def compact(values: dict[str, Any], *, limit: int = 40) -> dict[str, Any]:
    out: dict[str, Any] = {}
    for key, value in values.items():
        if value is None or value == "" or value == [] or value == {}:
            continue
        if isinstance(value, list) and len(value) > limit:
            out[key] = value[:limit]
        elif isinstance(value, str) and len(value) > 4000:
            out[key] = value[:4000]
        else:
            out[key] = value
    return out


def measured_fields(row: dict[str, Any]) -> dict[str, Any]:
    return {key: row[key] for key in MEASURED_PASSTHROUGH if key in row}


def state_from_row(
    *,
    unit_id: str,
    gate: str,
    evidence: dict[str, Any],
    context: dict[str, Any] | None = None,
    required: tuple[str, ...] = (),
) -> DecisionState:
    packed = compact(evidence)
    missing = [key for key in required if key not in packed]
    if missing:
        raise ThinStateError(f"Missing measured fields for {gate} / {unit_id}: {missing}")
    return DecisionState(unit_id=unit_id, gate=gate, evidence=packed, context=context)
