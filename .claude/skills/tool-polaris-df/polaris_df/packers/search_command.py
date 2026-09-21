"""Pack Search Command rows, SERP records, and cluster pairs into Jev state."""

from __future__ import annotations

from typing import Any

from polaris_df.packers.base import measured_fields, state_from_row
from polaris_df.types import DecisionState


def pack_purity_row(row: dict[str, Any], context: dict[str, Any] | None = None) -> DecisionState:
    query = str(row.get("query") or row.get("keyword") or "")
    evidence = {
        "query": query,
        "seed_context": row.get("seed_context") or "",
        "brand_territory": row.get("brand_territory") or (context or {}).get("brand_territory"),
        "exclusions": row.get("exclusions") or (context or {}).get("exclusions") or [],
        "sample_serp_titles": row.get("sample_serp_titles") or [],
        "wrong_sense_signal": row.get("wrong_sense_signal"),
        "excluded_intent_signal": row.get("excluded_intent_signal"),
        "off_territory_signal": row.get("off_territory_signal"),
        "merge_target": row.get("merge_target"),
        **measured_fields(row),
    }
    return state_from_row(
        unit_id=str(row.get("unit_id") or query),
        gate="G3.purity.v1",
        evidence=evidence,
        context=context,
        required=("query",),
    )


def pack_serp_shape(row: dict[str, Any], context: dict[str, Any] | None = None) -> DecisionState:
    query = str(row.get("query") or row.get("keyword") or "")
    evidence = {
        "query": query,
        "item_type_composition": row.get("item_type_composition") or row.get("item_types") or [],
        "serp_features": row.get("serp_features") or [],
        "first_organic_rank_absolute": row.get("first_organic_rank_absolute"),
        "aio_citation_count": row.get("aio_citation_count") or row.get("aio_citations") or 0,
        "aio_citation_domains": row.get("aio_citation_domains") or [],
        "previous_shape": row.get("previous_shape"),
        **measured_fields(row),
    }
    return state_from_row(
        unit_id=str(row.get("unit_id") or query),
        gate="G3.serp_shape.v1",
        evidence=evidence,
        context=context,
        required=("query",),
    )


def pack_response_unit(row: dict[str, Any], context: dict[str, Any] | None = None) -> DecisionState:
    query = str(row.get("query") or "")
    evidence = {
        "query": query,
        "serp_shape": row.get("serp_shape"),
        "existing_urls": row.get("existing_urls") or [],
        "reader_job": row.get("reader_job"),
        **measured_fields(row),
    }
    return state_from_row(
        unit_id=str(row.get("unit_id") or query),
        gate="G4.response_unit.v1",
        evidence=evidence,
        context=context,
        required=("query",),
    )


def pack_semantic_pair(row: dict[str, Any], context: dict[str, Any] | None = None) -> DecisionState:
    evidence = {
        "query_a": row.get("query_a") or row.get("a") or "",
        "query_b": row.get("query_b") or row.get("b") or "",
        "url_a": row.get("url_a"),
        "url_b": row.get("url_b"),
        "titles_a": row.get("titles_a") or [],
        "titles_b": row.get("titles_b") or [],
        "shared_serp_hosts": row.get("shared_serp_hosts") or [],
        "same_serp_signal": row.get("same_serp_signal"),
        "recommended_owner_hint": row.get("recommended_owner"),
    }
    unit = f"{evidence['query_a']}||{evidence['query_b']}"
    return state_from_row(
        unit_id=str(row.get("unit_id") or unit),
        gate="QA.semantic_cannibal.v1",
        evidence=evidence,
        context=context,
        required=("query_a", "query_b"),
    )


def pack_gate_row(gate: str, row: dict[str, Any], context: dict[str, Any] | None = None) -> DecisionState:
    query = str(row.get("query") or row.get("keyword") or row.get("unit_id") or "unit")
    evidence = {k: v for k, v in row.items() if k not in {"context"}}
    if "query" not in evidence and query != "unit":
        evidence["query"] = query
    return state_from_row(
        unit_id=str(row.get("unit_id") or query),
        gate=gate,
        evidence=evidence,
        context=context or row.get("context"),
    )
