"""Versioned decision pack registry."""

from __future__ import annotations

from copy import deepcopy
from typing import Any, Iterable

from polaris_df.types import DecisionPack, PackError


_PACKS: dict[str, DecisionPack] = {}


def register(pack: DecisionPack) -> DecisionPack:
    if not pack.id or not pack.version:
        raise PackError("Pack requires id and version")
    _validate_questions(pack)
    _PACKS[pack.id] = pack
    return pack


def get_pack(pack_id: str) -> DecisionPack:
    if pack_id not in _PACKS:
        known = ", ".join(sorted(_PACKS)) or "(none loaded)"
        raise PackError(f"Unknown pack '{pack_id}'. Known: {known}")
    return _PACKS[pack_id]


def list_packs() -> list[DecisionPack]:
    return [ _PACKS[k] for k in sorted(_PACKS) ]


def load_builtin_packs() -> list[DecisionPack]:
    # Imported here to avoid circular imports at module load of individual packs.
    from polaris_df.packs import all_packs

    for pack in all_packs():
        register(pack)
    return list_packs()


def _validate_questions(pack: DecisionPack) -> None:
    if not pack.questions:
        raise PackError(f"{pack.id} has no questions")
    for qid, spec in pack.questions.items():
        qtype = spec.get("type")
        if qtype not in {"noul", "choice", "score"}:
            raise PackError(f"{pack.id}.{qid} has invalid type {qtype!r}")
        if not spec.get("instructions"):
            raise PackError(f"{pack.id}.{qid} missing instructions")
        if qtype == "choice" and not spec.get("criteria") and not spec.get("criteria_from"):
            raise PackError(f"{pack.id}.{qid} choice needs criteria or criteria_from")
        if qtype == "score":
            criteria = spec.get("criteria")
            if not isinstance(criteria, list) or not (2 <= len(criteria) <= 10):
                raise PackError(f"{pack.id}.{qid} score criteria must be 2-10 levels")


def resolve_questions(pack: DecisionPack, evidence: dict[str, Any]) -> dict[str, dict[str, Any]]:
    """Clone pack questions and fill dynamic choice lists from evidence."""
    resolved: dict[str, dict[str, Any]] = {}
    for qid, spec in pack.questions.items():
        item = deepcopy(spec)
        source_key = item.pop("criteria_from", None)
        if source_key:
            raw = evidence.get(source_key) or []
            criteria: dict[str, str] = {}
            if isinstance(raw, dict):
                criteria = {str(k): (v if isinstance(v, str) else str(k)) for k, v in raw.items()}
            elif isinstance(raw, list):
                for entry in raw:
                    if isinstance(entry, dict):
                        key = str(entry.get("id") or entry.get("url") or entry.get("name") or "")
                        label = str(entry.get("label") or entry.get("title") or key)
                        if key:
                            criteria[key] = label
                    else:
                        criteria[str(entry)] = str(entry)
            if "other" not in criteria:
                criteria["other"] = "None of the listed candidates"
            if len(criteria) > 255:
                extra = list(criteria.items())[:254]
                criteria = dict(extra)
                criteria["other"] = "None of the listed candidates"
            item["criteria"] = criteria
        resolved[qid] = item
    return resolved


def iter_pack_summaries() -> Iterable[dict[str, Any]]:
    for pack in list_packs():
        yield {
            "id": pack.id,
            "version": pack.version,
            "docs": pack.docs,
            "questions": list(pack.questions),
            "never_auto": pack.never_auto,
            "ymyl_gate": pack.ymyl_gate,
            "required_evidence": list(pack.required_evidence),
        }
