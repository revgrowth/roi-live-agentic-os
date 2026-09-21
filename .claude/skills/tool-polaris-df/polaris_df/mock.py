"""Deterministic mock Jev for CI and --dry-run. Never calls the network."""

from __future__ import annotations

import hashlib
import json
from typing import Any


def _stable_unit(value: Any) -> float:
    blob = json.dumps(value, sort_keys=True, default=str).encode("utf-8")
    digest = hashlib.sha256(blob).hexdigest()
    return int(digest[:8], 16) / 0xFFFFFFFF


def _noul_from_signals(qid: str, state: Any, instructions: str) -> float:
    evidence = state if isinstance(state, dict) else {}
    direct = evidence.get(qid)
    if isinstance(direct, bool):
        return 0.96 if direct else 0.04
    if isinstance(direct, (int, float)) and 0 <= float(direct) <= 1:
        return float(direct)

    signal = evidence.get(f"{qid}_signal")
    if isinstance(signal, bool):
        return 0.94 if signal else 0.06
    if isinstance(signal, (int, float)):
        return max(0.0, min(1.0, float(signal)))

    text_blob = " ".join(
        str(evidence.get(key, ""))
        for key in (
            "query",
            "title",
            "h1",
            "extract",
            "finding",
            "notes",
            "seed_context",
        )
    ).lower()

    yes_hints = {
        "wrong_sense": ("wrong sense", "homonym", "disambiguat"),
        "excluded_intent": ("exclu", "jobs", "salary", "reddit", "diy"),
        "off_territory": ("off territory", "out of market", "wrong geo"),
        "same_serp": ("same serp", "cannibal", "duplicate intent"),
        "is_question_shaped": ("?", "how ", "what ", "why ", "when "),
        "has_clear_entity": ("brand", "entity", "named"),
        "blocks_indexing": ("noindex", "blocked", "robots"),
        "thin": ("thin", "under 200"),
        "duplicate": ("duplicate", "near-duplicate"),
        "outdated": ("outdated", "2020", "stale"),
        "brand_fit": ("on brand", "in territory"),
        "matches_brief": ("brief met", "matches brief"),
        "matches_intent": ("intent match", "primary intent"),
        "has_direct_answer": ("direct answer", "tl;dr", "in short"),
        "entities_clear": ("entity", "about"),
        "cannibal_risk": ("cannibal", "overlap"),
        "claim_risk_ymyl": ("ymyl", "medical", "legal", "financial"),
        "on_territory": ("in territory", "on-territory"),
        "unit_fit": ("unit fit", "matches format"),
        "keep": ("keep", "eligible"),
        "missing_faq": ("no faq", "missing faq"),
        "missing_schema": ("no schema", "missing schema"),
        "missing_entity": ("missing entity",),
        "claim_support": ("unsupported", "no source"),
        "competitor_owns": ("competitor cited", "competitor owns"),
        "client_visible": ("client-facing", "client visible"),
        "merge": ("merge", "duplicate finding"),
        "brand_safe": ("brand safe",),
        "on_message": ("on message",),
        "shape_changed": ("drift", "shape changed"),
        "incomplete": ("missing", "incomplete"),
        "conflicting": ("conflict", "contradict"),
    }
    no_hints = {
        "wrong_sense": ("correct sense", "right sense"),
        "excluded_intent": ("allowed intent",),
        "off_territory": ("in territory", "on-territory", "approved"),
        "keep": ("drop", "reject"),
    }
    for hint in yes_hints.get(qid, ()):
        if hint in text_blob:
            return 0.91
    for hint in no_hints.get(qid, ()):
        if hint in text_blob:
            return 0.08

    query = str(evidence.get("query", "")).lower()
    exclusions = [str(x).lower() for x in evidence.get("exclusions", []) or []]
    if qid == "excluded_intent" and any(x and x in query for x in exclusions):
        return 0.93
    if qid == "is_question_shaped" and (
        "?" in query or query.startswith(("how ", "what ", "why ", "when ", "who "))
    ):
        return 0.92
    if qid == "keep" and evidence.get("keep_signal") is False:
        return 0.07

    default_no = {
        "wrong_sense",
        "excluded_intent",
        "off_territory",
        "same_serp",
        "blocks_indexing",
        "thin",
        "duplicate",
        "outdated",
        "cannibal_risk",
        "claim_risk_ymyl",
        "merge",
        "regressed",
        "incomplete",
        "conflicting",
        "shape_changed",
        "competitor_owns",
        "missing_faq",
        "missing_schema",
        "missing_entity",
    }
    default_yes = {
        "on_territory",
        "keep",
        "brand_fit",
        "matches_brief",
        "matches_intent",
        "matches_primary",
        "brand_safe",
        "on_message",
        "unit_fit",
        "fixed_intended",
        "has_direct_answer",
        "entities_clear",
        "brief_complete",
    }
    if qid in default_no:
        return 0.08
    if qid in default_yes:
        return 0.92
    mix = _stable_unit({"qid": qid, "instructions": instructions, "state": evidence})
    return round(0.12 + mix * 0.76, 4)


def _pick_choice(spec: dict[str, Any], state: Any, qid: str) -> tuple[str, dict[str, float], float]:
    evidence = state if isinstance(state, dict) else {}
    criteria = spec.get("criteria") or {}
    keys = list(criteria.keys())
    if not keys:
        return "other", {"other": 1.0}, 0.99

    hinted = evidence.get(qid) or evidence.get(f"{qid}_hint")
    if isinstance(hinted, str) and hinted in keys:
        probs = {k: (0.91 if k == hinted else round(0.09 / max(len(keys) - 1, 1), 4)) for k in keys}
        return hinted, _normalize(probs), 0.91

    if qid == "serp_shape":
        picked = _serp_shape_from_features(evidence, keys)
        if picked:
            probs = {k: (0.88 if k == picked else round(0.12 / max(len(keys) - 1, 1), 4)) for k in keys}
            return picked, _normalize(probs), 0.88

    if qid == "intent":
        picked = _intent_from_query(str(evidence.get("query", "")), keys)
        if picked:
            probs = {k: (0.9 if k == picked else round(0.1 / max(len(keys) - 1, 1), 4)) for k in keys}
            return picked, _normalize(probs), 0.9

    if qid == "disposition":
        picked = _purity_disposition(evidence, keys)
        probs = {k: (0.9 if k == picked else round(0.1 / max(len(keys) - 1, 1), 4)) for k in keys}
        return picked, _normalize(probs), 0.9

    mix = _stable_unit({"qid": qid, "keys": keys, "state": evidence})
    index = min(int(mix * len(keys)), len(keys) - 1)
    picked = keys[index]
    confidence = 0.62 + (mix * 0.3)
    probs = {k: (confidence if k == picked else (1 - confidence) / max(len(keys) - 1, 1)) for k in keys}
    return picked, _normalize(probs), round(confidence, 4)


def _serp_shape_from_features(evidence: dict[str, Any], keys: list[str]) -> str | None:
    types = [str(t).lower() for t in (evidence.get("item_type_composition") or [])]
    type_blob = " ".join(types) + " " + str(evidence.get("serp_features", "")).lower()
    aio_count = int(evidence.get("aio_citation_count") or 0)
    first_organic = evidence.get("first_organic_rank_absolute")
    local = any(token in type_blob for token in ("local_pack", "maps", "local_finder"))
    shopping = any(token in type_blob for token in ("shopping", "popular_products", "product"))
    video = any(token in type_blob for token in ("video", "short_videos"))
    news = any(token in type_blob for token in ("news", "top_stories"))
    weak_organic = first_organic is None or (isinstance(first_organic, (int, float)) and first_organic > 3)

    candidates = [
        ("feature_heavy_local", local),
        ("local_pack_first", local and "feature_heavy_local" not in keys),
        ("aio_dominated", aio_count >= 8 and weak_organic),
        ("feature_heavy_commercial", shopping and not local),
        ("video_first", video),
        ("news_first", news),
        ("informational_clean", True),
    ]
    for name, ok in candidates:
        if ok and name in keys:
            return name
    return keys[0] if keys else None


def _intent_from_query(query: str, keys: list[str]) -> str | None:
    q = query.lower()
    mapping = [
        ("local", ("near me", " in ", "open now", "hours")),
        ("transactional", ("buy", "price", "cost", "coupon", "order", "book")),
        ("commercial", ("best", "vs", "versus", "review", "compare", "top ")),
        ("navigational", ("login", "official", "website")),
        ("informational", ("how", "what", "why", "guide", "?")),
    ]
    for name, tokens in mapping:
        if name in keys and any(token in q for token in tokens):
            return name
    return "informational" if "informational" in keys else None


def _purity_disposition(evidence: dict[str, Any], keys: list[str]) -> str:
    if evidence.get("wrong_sense_signal") or _noul_from_signals("wrong_sense", evidence, "") >= 0.85:
        return "reject_sense" if "reject_sense" in keys else keys[0]
    if evidence.get("excluded_intent_signal") or _noul_from_signals("excluded_intent", evidence, "") >= 0.85:
        return "reject_exclusion" if "reject_exclusion" in keys else keys[0]
    if evidence.get("off_territory_signal") or _noul_from_signals("off_territory", evidence, "") >= 0.85:
        return "reject_territory" if "reject_territory" in keys else keys[0]
    if evidence.get("merge_target"):
        return "merge" if "merge" in keys else keys[0]
    return "keep" if "keep" in keys else keys[0]


def _normalize(probs: dict[str, float]) -> dict[str, float]:
    total = sum(probs.values()) or 1.0
    return {k: round(v / total, 4) for k, v in probs.items()}


def _score(spec: dict[str, Any], state: Any, qid: str) -> tuple[float, dict[str, str], dict[str, float], float]:
    evidence = state if isinstance(state, dict) else {}
    criteria = spec.get("criteria") or ["low", "high"]
    n = max(len(criteria), 2)
    legend = {str(i): str(level) for i, level in enumerate(criteria)}
    hinted = evidence.get(qid) if isinstance(evidence.get(qid), (int, float)) else evidence.get(f"{qid}_hint")
    if isinstance(hinted, (int, float)):
        score = float(hinted)
        score = max(0.0, min(float(n - 1), score))
        confidence = 0.86
    else:
        mix = _stable_unit({"qid": qid, "state": evidence, "n": n})
        score = mix * (n - 1)
        confidence = 0.6 + mix * 0.3
    index = min(int(round(score)), n - 1)
    probs = {str(i): (0.8 if i == index else 0.2 / max(n - 1, 1)) for i in range(n)}
    return round(score, 4), legend, _normalize(probs), round(confidence, 4)


class MockJevClient:
    """CI / dry-run client. Answers are heuristic plus stable hash, never live."""

    def __init__(self, *, scripted: dict[str, dict[str, Any]] | None = None) -> None:
        self.scripted = scripted or {}

    def system_one(
        self,
        *,
        state: Any,
        questions: dict[str, dict[str, Any]],
        model: str,
    ) -> dict[str, Any]:
        answers: dict[str, Any] = {}
        for qid, spec in questions.items():
            if qid in self.scripted:
                answers[qid] = self.scripted[qid]
                continue
            qtype = spec["type"]
            if qtype == "noul":
                answers[qid] = {
                    "type": "noul",
                    "noul": _noul_from_signals(qid, state, spec.get("instructions", "")),
                }
            elif qtype == "choice":
                choice, probs, confidence = _pick_choice(spec, state, qid)
                answers[qid] = {
                    "type": "choice",
                    "choice": choice,
                    "probabilities": probs,
                    "confidence": confidence,
                }
            elif qtype == "score":
                score, legend, probs, confidence = _score(spec, state, qid)
                answers[qid] = {
                    "type": "score",
                    "score": score,
                    "legend": legend,
                    "probabilities": probs,
                    "confidence": confidence,
                }
            else:
                raise ValueError(f"Unknown question type: {qtype}")
        return {
            "model": f"{model}-mock",
            "answers": answers,
            "usage": {"input_tokens": 0, "output_tokens": 0},
        }
