"""Layer A (Jev pin) → Layer B (Polaris DF outcome) → Layer C (work tier).

Does not reimplement DF packs. Does not enable BOT_EXEC. Does not call Typesafe.
"""

from __future__ import annotations

from typing import Iterable

from tempo_efficiency.adapters.polaris_df import (
    any_flag_ymyl,
    df_escalate_band,
    normalize_router_outcome,
    pack_forces_human,
)
from tempo_efficiency.config import (
    ALLOW_YMYL_ASSIST_DRAFT,
    BOT_EXEC_ENABLED,
    COST_CAPS,
    DEFAULT_TIER_MODEL,
    MAX_ESCALATE_HOPS,
    NOISE_ARCHIVE_BUCKET,
    NOISE_ARCHIVE_MIN_CONFIDENCE,
    NOISE_ARCHIVE_MIN_SAFETY,
    NOISE_ARCHIVE_OUTCOME,
    PROD_CLASSIFY_MODEL,
    TIER_MODELS,
)
from tempo_efficiency.types import (
    NEVER_DOWNGRADE_BUCKETS,
    RouterOutcome,
    RouterRecommendation,
    WorkTier,
)

NO_WORK_BUCKETS = frozenset({"DYING", "BOT_EXEC"})
HUMAN_ONLY_BUCKETS = frozenset({"CLICKUP_MUTATE"})
T1_BUCKETS = frozenset({"CLARIFY", "BRIEF_ONLY", "NOISE"})
T3_BUCKETS = frozenset({"CLIENT_HUMAN", "SECURITY_FINANCE", "MULTI"})


class HopLedger:
    """In-process hop counts keyed by decision_id. Max 2 escalate hops then human."""

    def __init__(self) -> None:
        self._hops: dict[str, int] = {}

    def get(self, decision_id: str) -> int:
        return self._hops.get(decision_id, 0)

    def record_escalate(self, decision_id: str) -> int:
        nxt = self.get(decision_id) + 1
        self._hops[decision_id] = nxt
        return nxt


def noise_archive_eligible(
    *,
    bucket: str | None,
    confidence: float | None,
    safety: float | None,
    router_outcome: str | None,
) -> bool:
    """COO NOISE archive apply row from the joint schema."""
    if bucket != NOISE_ARCHIVE_BUCKET:
        return False
    if confidence is None or confidence < NOISE_ARCHIVE_MIN_CONFIDENCE:
        return False
    if safety is None or safety < NOISE_ARCHIVE_MIN_SAFETY:
        return False
    return router_outcome == NOISE_ARCHIVE_OUTCOME


def resolve_recommendation(
    *,
    bucket: str | None = None,
    router_outcome: str | None = None,
    route: str | None = None,
    decision_id: str | None = None,
    hops: int | None = None,
    ledger: HopLedger | None = None,
    flags: Iterable[str] | None = None,
    pack_id: str | None = None,
    ymyl: bool = False,
    claim_pack: bool = False,
    code_shaped: bool = False,
    prefer_cheaper: bool = False,
    daily_budget_used_ratio: float | None = None,
    phase: str = "dry-run",
    df_context: str | None = None,
    client_facing: bool = False,
    allow_ymyl_assist: bool | None = None,
) -> RouterRecommendation:
    """Dry-run resolve of (bucket, route/router_outcome) → tier / model recommendation."""
    outcome = normalize_router_outcome(route=route, router_outcome=router_outcome)
    reasons: list[str] = [f"layer_a:{PROD_CLASSIFY_MODEL}", f"layer_b:{outcome}"]
    flag_list = tuple(flags or ())
    ymyl_hit = ymyl or claim_pack or any_flag_ymyl(flag_list) or pack_forces_human(
        pack_id, ymyl=ymyl, claim_pack=claim_pack
    )
    never_downgrade = _never_downgrade(bucket, ymyl_hit, flag_list)

    if BOT_EXEC_ENABLED:
        # Unreachable pin — kept as a hard stop if someone edits the constant.
        reasons.append("bot_exec_must_stay_off")

    effective: RouterOutcome = outcome
    work_tier: WorkTier | None = None
    hops_used = _current_hops(decision_id, hops, ledger)

    if bucket == "BOT_EXEC":
        reasons.append("bot_exec_off")
        effective = "human" if outcome == "llm_escalate" else outcome
        if outcome == "auto":
            effective = "human"
            reasons.append("bot_exec_auto_blocked")
        return _rec(
            outcome,
            effective,
            None,
            hops_used,
            reasons,
            never_downgrade=never_downgrade,
            phase=phase,
        )

    if ymyl_hit:
        reasons.append("ymyl_or_claim_never_auto")
        assist = ALLOW_YMYL_ASSIST_DRAFT if allow_ymyl_assist is None else allow_ymyl_assist
        # Human only. T3 draft only if Jason later allows assist — never auto-send.
        work: WorkTier | None = "T3" if assist else None
        if assist:
            reasons.append("ymyl_assist_draft_for_human_only")
        return _rec(
            outcome,
            "human",
            work,
            hops_used,
            reasons,
            for_human=True,
            never_downgrade=True,
            phase=phase,
        )

    if effective == "human":
        reasons.append("layer_b_human_stop")
        return _rec(outcome, "human", None, hops_used, reasons, never_downgrade=never_downgrade, phase=phase)

    if effective == "auto":
        reasons.append("layer_b_auto_no_work_llm")
        return _rec(outcome, "auto", None, hops_used, reasons, never_downgrade=never_downgrade, phase=phase)

    # Layer C — llm_escalate only.
    if hops_used >= MAX_ESCALATE_HOPS:
        reasons.append(f"hop_limit:{MAX_ESCALATE_HOPS}")
        return _rec(outcome, "human", None, hops_used, reasons, never_downgrade=never_downgrade, phase=phase)

    if bucket in HUMAN_ONLY_BUCKETS:
        reasons.append("clickup_mutate_human_until_sop")
        return _rec(outcome, "human", None, hops_used, reasons, never_downgrade=never_downgrade, phase=phase)

    if bucket in NO_WORK_BUCKETS or _has_flag(flag_list, "WAITING"):
        reasons.append("status_hygiene_no_work_model")
        return _rec(outcome, "human", None, hops_used, reasons, never_downgrade=never_downgrade, phase=phase)

    work_tier = _tier_for_signal(
        bucket,
        pack_id=pack_id,
        df_context=df_context,
        ymyl=ymyl_hit,
        claim_pack=claim_pack,
        code_shaped=code_shaped,
        flags=flag_list,
        client_facing=client_facing,
        reasons=reasons,
    )
    if work_tier is None:
        reasons.append("no_tier_for_signal")
        return _rec(outcome, "human", None, hops_used, reasons, never_downgrade=never_downgrade, phase=phase)

    if prefer_cheaper or _budget_prefers_t1(daily_budget_used_ratio):
        if never_downgrade:
            reasons.append("never_downgrade_quality_over_cost")
        elif work_tier in {"T2", "T3"} and bucket in T1_BUCKETS | {"INTERNAL_HUMAN"}:
            reasons.append("cost_pressure_downgrade_blocked_until_caps_set" if not COST_CAPS.any_set() else "cost_pressure_t1")
            if COST_CAPS.any_set() and work_tier != "T3":
                work_tier = "T1"

    hops_after = hops_used + 1
    if ledger is not None and decision_id:
        hops_after = ledger.record_escalate(decision_id)
    reasons.append(f"layer_c:{work_tier}")
    return _rec(
        outcome,
        "llm_escalate",
        work_tier,
        hops_after,
        reasons,
        never_downgrade=never_downgrade,
        phase=phase,
    )


def _current_hops(decision_id: str | None, hops: int | None, ledger: HopLedger | None) -> int:
    if hops is not None:
        return hops
    if ledger is not None and decision_id:
        return ledger.get(decision_id)
    return 0


def _never_downgrade(bucket: str | None, ymyl_hit: bool, flags: tuple[str, ...]) -> bool:
    if ymyl_hit:
        return True
    if bucket in NEVER_DOWNGRADE_BUCKETS:
        return True
    if _has_flag(flags, "YMYL"):
        return True
    return False


def _has_flag(flags: Iterable[str], name: str) -> bool:
    target = name.upper()
    return any(str(f).upper() == target for f in flags)


def _budget_prefers_t1(daily_budget_used_ratio: float | None) -> bool:
    if daily_budget_used_ratio is None or not COST_CAPS.any_set():
        return False
    return daily_budget_used_ratio >= 0.80


def _tier_for_signal(
    bucket: str | None,
    *,
    pack_id: str | None,
    df_context: str | None,
    ymyl: bool,
    claim_pack: bool,
    code_shaped: bool,
    flags: tuple[str, ...],
    client_facing: bool,
    reasons: list[str],
) -> WorkTier | None:
    band = df_escalate_band(pack_id, ymyl=ymyl, claim_pack=claim_pack, df_context=df_context)
    if band == "ymyl_claim":
        reasons.append("df_band:ymyl_claim")
        return None
    if band == "keyword_purity":
        reasons.append("df_band:keyword_purity_t1")
        return "T1"
    if band == "audit":
        if client_facing:
            reasons.append("df_band:audit_t3_client_facing")
            return "T3"
        reasons.append("df_band:audit_t1")
        return "T1"
    if band == "qa_aeo_geo":
        reasons.append("df_band:qa_aeo_geo_t3")
        return "T3"
    return _tier_for_bucket(bucket, code_shaped=code_shaped, flags=flags)


def _tier_for_bucket(bucket: str | None, *, code_shaped: bool, flags: tuple[str, ...]) -> WorkTier | None:
    if _has_flag(flags, "HANDOFF_SPECIALIST") or bucket == "MULTI":
        return "T2" if code_shaped else "T3"
    if bucket in T3_BUCKETS:
        return "T3"
    if bucket == "INTERNAL_HUMAN":
        return "T2" if code_shaped else "T3"
    if bucket in T1_BUCKETS:
        return "T1"
    if code_shaped:
        return "T2"
    if bucket is None:
        return "T1"
    return "T1"


def _rec(
    router_outcome: RouterOutcome,
    effective: RouterOutcome,
    work_tier: WorkTier | None,
    hops: int,
    reasons: list[str],
    *,
    for_human: bool = False,
    never_downgrade: bool = False,
    phase: str = "dry-run",
) -> RouterRecommendation:
    models = TIER_MODELS.get(work_tier or "", ())
    model = DEFAULT_TIER_MODEL.get(work_tier) if work_tier else None
    return RouterRecommendation(
        jev_model=PROD_CLASSIFY_MODEL,
        router_outcome=router_outcome,
        effective_outcome=effective,
        work_tier=work_tier,
        work_model=model,
        work_models=models,
        escalate_hops=hops,
        hop_limit=MAX_ESCALATE_HOPS,
        bot_exec=BOT_EXEC_ENABLED,
        for_human_approve_only=for_human,
        cost_caps=COST_CAPS.as_dict(),
        reasons=reasons,
        never_downgrade=never_downgrade,
        phase="apply" if phase == "apply" else "dry-run",
    )
