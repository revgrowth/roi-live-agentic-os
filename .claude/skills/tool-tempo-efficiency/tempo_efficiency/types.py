"""Shared Tempo types. Router outcomes match Polaris DF literals — imported, not restated as a pack catalog."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Literal

RouterOutcome = Literal["auto", "llm_escalate", "human"]
Phase = Literal["dry-run", "apply"]
GateLabel = Literal["ENABLED.on", "ENABLED.off", "absent", "conflict"]
WorkTier = Literal["T0", "T1", "T2", "T3"]
Lane = Literal["coo_noise_archive", "coo_shadow", "polaris_df"]
Result = Literal["ok", "error", "skipped", "would_succeed", "killed"]

COO_BUCKETS = frozenset(
    {
        "BOT_EXEC",
        "INTERNAL_HUMAN",
        "CLARIFY",
        "CLIENT_HUMAN",
        "CLICKUP_MUTATE",
        "BRIEF_ONLY",
        "DYING",
        "SECURITY_FINANCE",
        "NOISE",
        "MULTI",
    }
)

COO_FLAGS = frozenset({"VAULT_WRITE", "CALENDAR", "HANDOFF_SPECIALIST", "WAITING"})

NEVER_DOWNGRADE_BUCKETS = frozenset({"SECURITY_FINANCE", "CLIENT_HUMAN"})

SHARED_JSONL_FIELDS: tuple[str, ...] = (
    "timestamp",
    "lane",
    "decision_id",
    "item_id",
    "bucket",
    "confidence",
    "bucket_confidence",
    "safety",
    "router_outcome",
    "phase",
    "action",
    "would_action",
    "result",
    "gate",
    "operator_or_bot",
    "jev_model",
    "miss",
    "kill_reason",
    "error",
)

ROUTER_JSONL_FIELDS: tuple[str, ...] = (
    "work_model",
    "work_tier",
    "cost_estimate_usd",
    "escalate_hops",
    "for_human_approve_only",
    "bot_exec",
)


@dataclass(frozen=True)
class GateResolution:
    gate: GateLabel
    apply_allowed: bool
    phase: Phase
    alert: str | None = None


@dataclass(frozen=True)
class ThresholdRow:
    """One importable row from the joint confidence / kill schema."""

    id: str
    min_confidence: float | None
    min_safety: float | None
    router_outcome: RouterOutcome | None
    bucket: str | None
    notes: str


@dataclass(frozen=True)
class CostCaps:
    """Dollar caps. Jason has not set numbers — keep None until he does."""

    per_item_t1_usd: float | None = None
    per_item_t3_usd: float | None = None
    daily_lane_usd: float | None = None

    def as_dict(self) -> dict[str, float | None]:
        return {
            "per_item_t1_usd": self.per_item_t1_usd,
            "per_item_t3_usd": self.per_item_t3_usd,
            "daily_lane_usd": self.daily_lane_usd,
        }

    def any_set(self) -> bool:
        return any(v is not None for v in self.as_dict().values())


@dataclass(frozen=True)
class KillVerdict:
    should_kill: bool
    reasons: tuple[str, ...] = ()
    miss: bool = False


@dataclass
class RouterRecommendation:
    jev_model: str
    router_outcome: RouterOutcome
    effective_outcome: RouterOutcome
    work_tier: WorkTier | None
    work_model: str | None
    work_models: tuple[str, ...]
    escalate_hops: int
    hop_limit: int
    bot_exec: bool
    for_human_approve_only: bool
    cost_caps: dict[str, float | None]
    reasons: list[str] = field(default_factory=list)
    never_downgrade: bool = False
    phase: Phase = "dry-run"

    def to_dict(self) -> dict[str, Any]:
        return {
            "jev_model": self.jev_model,
            "router_outcome": self.router_outcome,
            "effective_outcome": self.effective_outcome,
            "work_tier": self.work_tier,
            "work_model": self.work_model,
            "work_models": list(self.work_models),
            "escalate_hops": self.escalate_hops,
            "hop_limit": self.hop_limit,
            "bot_exec": self.bot_exec,
            "for_human_approve_only": self.for_human_approve_only,
            "cost_caps": self.cost_caps,
            "reasons": list(self.reasons),
            "never_downgrade": self.never_downgrade,
            "phase": self.phase,
        }
