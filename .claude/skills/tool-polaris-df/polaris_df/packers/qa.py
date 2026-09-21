"""Pack draft / QA rows into compact Jev state."""

from __future__ import annotations

from typing import Any

from polaris_df.packers.base import measured_fields, state_from_row
from polaris_df.types import DecisionState


def pack_publish(row: dict[str, Any], context: dict[str, Any] | None = None) -> DecisionState:
    evidence = {
        "url": row.get("url") or "",
        "target_query": row.get("target_query") or row.get("query") or "",
        "h1": row.get("h1"),
        "extract": row.get("extract") or row.get("draft") or "",
        "brief_checks": row.get("brief_checks") or [],
        "inventory_neighbors": row.get("inventory_neighbors") or [],
        **measured_fields(row),
    }
    return state_from_row(
        unit_id=str(row.get("unit_id") or evidence["url"] or evidence["target_query"]),
        gate="QA.content_publish.v1",
        evidence=evidence,
        context=context,
        required=("url", "target_query"),
    )


def pack_internal_link(row: dict[str, Any], context: dict[str, Any] | None = None) -> DecisionState:
    evidence = {
        "url": row.get("url") or "",
        "extract": row.get("extract") or "",
        "candidate_urls": row.get("candidate_urls") or row.get("candidates") or [],
        "anchor": row.get("anchor"),
    }
    return state_from_row(
        unit_id=str(row.get("unit_id") or evidence["url"]),
        gate="QA.internal_link.v1",
        evidence=evidence,
        context=context,
        required=("url", "candidate_urls"),
    )


def pack_brief(row: dict[str, Any], context: dict[str, Any] | None = None) -> DecisionState:
    evidence = {
        "url": row.get("url") or "",
        "target_query": row.get("target_query") or row.get("query") or "",
        "h1": row.get("h1"),
        "extract": row.get("extract") or "",
        "brief_checks": row.get("brief_checks") or [],
        "cta": row.get("cta"),
    }
    return state_from_row(
        unit_id=str(row.get("unit_id") or evidence["url"] or evidence["target_query"]),
        gate="QA.brief_compliance.v1",
        evidence=evidence,
        context=context,
        required=("url", "target_query"),
    )
