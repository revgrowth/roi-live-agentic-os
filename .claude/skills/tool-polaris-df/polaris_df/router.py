"""Confidence router. YMYL / claim gates never auto-approve."""

from __future__ import annotations

from typing import Any

from polaris_df.types import (
    YMYL_CLAIM_CLASSES,
    DecisionPack,
    Route,
    RoutedDecision,
    Thresholds,
)


def noul_extremity(value: float) -> float:
    """Map a noul probability to a 0-1 certainty. 0.0 and 1.0 are both certain."""
    return abs(float(value) - 0.5) * 2.0


def _route_noul(value: float, thresholds: Thresholds, *, high_stakes: bool) -> Route:
    if value >= thresholds.noul_auto_yes or value <= thresholds.noul_auto_no:
        return "auto"
    if high_stakes and thresholds.noul_human_low <= value <= thresholds.noul_human_high:
        return "human"
    return "llm_escalate"


def _route_choice(confidence: float, thresholds: Thresholds) -> Route:
    if confidence >= thresholds.choice_auto:
        return "auto"
    if confidence < thresholds.choice_human:
        return "human"
    return "llm_escalate"


def _route_score(answer: dict[str, Any], thresholds: Thresholds) -> Route:
    confidence = float(answer.get("confidence") or 0.0)
    score = float(answer.get("score") or 0.0)
    legend = answer.get("legend") or {}
    max_level = max((int(k) for k in legend.keys()), default=1) or 1
    normalized = score / max_level if max_level else 0.0
    extreme = normalized <= thresholds.score_extreme_low or normalized >= thresholds.score_extreme_high
    if extreme and confidence >= thresholds.score_auto_confidence:
        return "auto"
    if confidence < thresholds.score_human_confidence:
        return "human"
    return "llm_escalate"


def _is_ymyl_answer(qid: str, answer: dict[str, Any]) -> bool:
    if answer.get("type") != "choice":
        return False
    picked = str(answer.get("choice") or "").lower()
    if picked in YMYL_CLAIM_CLASSES:
        return True
    if qid in {"claim_class", "reviewer"} and "ymyl" in picked:
        return True
    return False


def route_answers(
    *,
    pack: DecisionPack,
    answers: dict[str, Any],
    thresholds: Thresholds | None = None,
) -> tuple[Route, dict[str, Route], list[str]]:
    thresholds = thresholds or pack.default_thresholds
    question_routes: dict[str, Route] = {}
    reasons: list[str] = []
    force_human = pack.never_auto or pack.ymyl_gate
    if pack.never_auto:
        reasons.append("pack.never_auto")
    if pack.ymyl_gate:
        reasons.append("pack.ymyl_gate")

    for qid, answer in answers.items():
        qtype = answer.get("type")
        high_stakes = pack.ymyl_gate or qid in pack.never_auto_questions
        if qtype == "noul":
            local = _route_noul(float(answer.get("noul") or 0.5), thresholds, high_stakes=high_stakes)
        elif qtype == "choice":
            local = _route_choice(float(answer.get("confidence") or 0.0), thresholds)
        elif qtype == "score":
            local = _route_score(answer, thresholds)
        else:
            local = "human"
            reasons.append(f"{qid}:unknown_type")

        if qid in pack.never_auto_questions and local == "auto":
            local = "human"
            reasons.append(f"{qid}:never_auto_question")
        if _is_ymyl_answer(qid, answer):
            force_human = True
            reasons.append(f"{qid}:ymyl_claim_class")
        question_routes[qid] = local

    if force_human:
        overall: Route = "human"
        return overall, question_routes, reasons

    if any(r == "human" for r in question_routes.values()):
        return "human", question_routes, reasons
    if any(r == "llm_escalate" for r in question_routes.values()):
        return "llm_escalate", question_routes, reasons
    return "auto", question_routes, reasons


def build_routed(
    *,
    pack: DecisionPack,
    answers: dict[str, Any],
    model: str,
    source: str,
    decided_at: str,
    unit_id: str = "",
    usage: dict[str, int] | None = None,
    thresholds: Thresholds | None = None,
) -> RoutedDecision:
    thresholds = thresholds or pack.default_thresholds
    overall, question_routes, reasons = route_answers(
        pack=pack, answers=answers, thresholds=thresholds
    )
    return RoutedDecision(
        answers=answers,
        route=overall,
        question_routes=question_routes,
        thresholds=thresholds.as_dict(),
        model=model,
        pack_id=pack.id,
        pack_version=pack.version,
        decided_at=decided_at,
        source=source,  # type: ignore[arg-type]
        usage=usage,
        route_reasons=reasons,
        unit_id=unit_id,
    )
