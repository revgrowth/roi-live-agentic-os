"""Pack crawl / issue / finding rows into compact Jev state."""

from __future__ import annotations

from typing import Any

from polaris_df.packers.base import measured_fields, state_from_row
from polaris_df.types import DecisionState


def pack_tech_issue(row: dict[str, Any], context: dict[str, Any] | None = None) -> DecisionState:
    url = str(row.get("url") or "")
    evidence = {
        "url": url,
        "issue": row.get("issue") or row.get("message") or "",
        "issue_code": row.get("issue_code") or row.get("code"),
        "template": row.get("template"),
        "status_code": row.get("status_code"),
        "indexable": row.get("indexable"),
        "robots": row.get("robots"),
        "canonical": row.get("canonical"),
        **measured_fields(row),
    }
    return state_from_row(
        unit_id=str(row.get("unit_id") or f"{url}:{evidence['issue']}"[:180]),
        gate="AUDIT.tech_severity.v1",
        evidence=evidence,
        context=context,
        required=("url", "issue"),
    )


def pack_onpage(row: dict[str, Any], context: dict[str, Any] | None = None) -> DecisionState:
    url = str(row.get("url") or "")
    evidence = {
        "url": url,
        "h1": row.get("h1"),
        "title": row.get("title"),
        "extract": row.get("extract") or row.get("text_excerpt") or "",
        "word_count": row.get("word_count"),
        "target_query": row.get("target_query"),
        **measured_fields(row),
    }
    return state_from_row(
        unit_id=str(row.get("unit_id") or url),
        gate="AUDIT.onpage_quality.v1",
        evidence=evidence,
        context=context,
        required=("url",),
    )


def pack_finding(row: dict[str, Any], context: dict[str, Any] | None = None) -> DecisionState:
    finding = str(row.get("finding") or row.get("title") or "")
    evidence = {
        "finding": finding,
        "url": row.get("url"),
        "impact_proxy": row.get("impact_proxy"),
        "business_goals": row.get("business_goals") or (context or {}).get("business_goals"),
        "sibling_findings": row.get("sibling_findings") or [],
        **measured_fields(row),
    }
    return state_from_row(
        unit_id=str(row.get("unit_id") or finding[:120]),
        gate="AUDIT.finding_priority.v1",
        evidence=evidence,
        context=context,
        required=("finding",),
    )


def pack_gap(row: dict[str, Any], context: dict[str, Any] | None = None) -> DecisionState:
    query = str(row.get("query") or row.get("keyword") or "")
    evidence = {
        "query": query,
        "competitor_url": row.get("competitor_url"),
        "brand_territory": row.get("brand_territory") or (context or {}).get("brand_territory"),
        **measured_fields(row),
    }
    return state_from_row(
        unit_id=str(row.get("unit_id") or query),
        gate="AUDIT.content_gap.v1",
        evidence=evidence,
        context=context,
        required=("query",),
    )


def pack_aeo_cite(row: dict[str, Any], context: dict[str, Any] | None = None) -> DecisionState:
    evidence = {
        "query": row.get("query") or "",
        "url": row.get("url"),
        "extract": row.get("extract") or "",
        "has_faq": row.get("has_faq"),
        "has_schema": row.get("has_schema"),
        "aio_citation_domains": row.get("aio_citation_domains") or [],
        **measured_fields(row),
    }
    return state_from_row(
        unit_id=str(row.get("unit_id") or evidence["query"] or evidence.get("url") or "aeo"),
        gate="AUDIT.aeo_cite.v1",
        evidence=evidence,
        context=context,
        required=("query",),
    )


def pack_geo_cite(row: dict[str, Any], context: dict[str, Any] | None = None) -> DecisionState:
    evidence = {
        "query": row.get("query") or "",
        "engine": row.get("engine") or "chatgpt",
        "url": row.get("url"),
        "panel_text": row.get("panel_text") or "",
        "cited_domains": row.get("cited_domains") or [],
        **measured_fields(row),
    }
    return state_from_row(
        unit_id=str(row.get("unit_id") or f"{evidence['engine']}:{evidence['query']}"),
        gate="AUDIT.geo_citation.v1",
        evidence=evidence,
        context=context,
        required=("query",),
    )
