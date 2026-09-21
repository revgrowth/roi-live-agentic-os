"""Crawl / issue rows to prioritized findings. Narrative is optional and out of band."""

from __future__ import annotations

from typing import Any

from polaris_df.decide import decide
from polaris_df.packers.audit import pack_finding, pack_onpage, pack_tech_issue


def triage_rows(
    rows: list[dict[str, Any]],
    *,
    dry_run: bool = False,
    model: str | None = None,
    context: dict[str, Any] | None = None,
) -> list[dict[str, Any]]:
    findings: list[dict[str, Any]] = []
    for row in rows:
        kind = str(row.get("kind") or _guess_kind(row))
        if kind == "onpage":
            state = pack_onpage(row, context)
            pack_id = "AUDIT.onpage_quality.v1"
        elif kind == "finding":
            state = pack_finding(row, context)
            pack_id = "AUDIT.finding_priority.v1"
        else:
            state = pack_tech_issue(row, context)
            pack_id = "AUDIT.tech_severity.v1"
        decision = decide(pack_id, state, dry_run=dry_run, model=model)
        item = {
            **row,
            "kind": kind,
            "judgment_added": True,
            "judgment": decision.provenance(),
            "route": decision.route,
        }
        answers = decision.answers
        if pack_id == "AUDIT.finding_priority.v1":
            item["priority_score"] = (answers.get("priority") or {}).get("score")
            item["visibility"] = (answers.get("visibility") or {}).get("choice")
            item["workstream"] = (answers.get("workstream") or {}).get("choice")
        elif pack_id == "AUDIT.tech_severity.v1":
            item["severity_score"] = (answers.get("severity") or {}).get("score")
            item["category"] = (answers.get("category") or {}).get("choice")
            item["blocks_indexing"] = (answers.get("blocks_indexing") or {}).get("noul")
        findings.append(item)
    findings.sort(key=_sort_key, reverse=True)
    return findings


def _guess_kind(row: dict[str, Any]) -> str:
    if row.get("finding") and not row.get("issue"):
        return "finding"
    if row.get("extract") or row.get("h1"):
        return "onpage"
    return "tech"


def _sort_key(item: dict[str, Any]) -> float:
    for key in ("priority_score", "severity_score"):
        value = item.get(key)
        if isinstance(value, (int, float)):
            return float(value)
    return 0.0
