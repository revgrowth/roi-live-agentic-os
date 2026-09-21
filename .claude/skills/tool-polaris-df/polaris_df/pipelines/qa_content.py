"""Content QA pipeline: brief, intent, AEO pack, publish soft-gate."""

from __future__ import annotations

from typing import Any

from polaris_df.decide import decide
from polaris_df.packers.qa import pack_brief, pack_internal_link, pack_publish


def triage_rows(
    rows: list[dict[str, Any]],
    *,
    dry_run: bool = False,
    model: str | None = None,
    context: dict[str, Any] | None = None,
) -> list[dict[str, Any]]:
    out: list[dict[str, Any]] = []
    for row in rows:
        mode = str(row.get("mode") or "publish")
        if mode == "brief":
            state = pack_brief(row, context)
            pack_id = "QA.brief_compliance.v1"
        elif mode == "internal_link":
            state = pack_internal_link(row, context)
            pack_id = "QA.internal_link.v1"
        else:
            state = pack_publish(row, context)
            pack_id = "QA.content_publish.v1"
        decision = decide(pack_id, state, dry_run=dry_run, model=model)
        item = {
            **row,
            "judgment_added": True,
            "judgment": decision.provenance(),
            "route": decision.route,
        }
        if pack_id == "QA.content_publish.v1":
            item["ship_readiness"] = (decision.answers.get("overall_ship_readiness") or {}).get("score")
            item["claim_risk_ymyl"] = (decision.answers.get("claim_risk_ymyl") or {}).get("noul")
        if pack_id == "QA.internal_link.v1":
            item["internal_link_target"] = (decision.answers.get("target") or {}).get("choice")
        out.append(item)
    return out
