"""Keyword keep/drop + intent + AEO/GEO fitness. Measured volume is untouched."""

from __future__ import annotations

from typing import Any

from polaris_df.decide import decide
from polaris_df.packers.base import measured_fields
from polaris_df.packers.keyword import pack_keyword_row


DEFAULT_GATES = (
    "KW.keep_drop.v1",
    "KW.intent.v1",
    "KW.aeo_question.v1",
    "KW.geo_entity.v1",
)


def triage_rows(
    rows: list[dict[str, Any]],
    *,
    dry_run: bool = False,
    model: str | None = None,
    context: dict[str, Any] | None = None,
    gates: tuple[str, ...] = DEFAULT_GATES,
) -> list[dict[str, Any]]:
    out: list[dict[str, Any]] = []
    for row in rows:
        item = {**row, "judgment_added": True, "judgments": {}}
        for key, value in measured_fields(row).items():
            item[key] = value
        for gate in gates:
            state = pack_keyword_row(row, gate=gate, context=context)
            decision = decide(gate, state, dry_run=dry_run, model=model)
            item["judgments"][gate] = decision.provenance()
            answers = decision.answers
            if gate == "KW.keep_drop.v1":
                item["keep"] = (answers.get("keep") or {}).get("noul")
                item["sense"] = (answers.get("sense") or {}).get("choice")
            if gate == "KW.intent.v1":
                item["intent"] = (answers.get("intent") or {}).get("choice")
                item["intent_source"] = "judgment_added"
            if gate == "KW.hub_spoke.v1":
                item["role"] = (answers.get("role") or {}).get("choice")
            if gate == "KW.cluster_assign.v1":
                item["cluster"] = (answers.get("cluster") or {}).get("choice")
        out.append(item)
    return out
