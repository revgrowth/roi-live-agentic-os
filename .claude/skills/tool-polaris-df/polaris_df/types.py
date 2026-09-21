"""Core runtime objects for the Polaris Decision Fabric."""

from __future__ import annotations

from dataclasses import asdict, dataclass, field
from typing import Any, Literal

Route = Literal["auto", "llm_escalate", "human"]
QuestionType = Literal["noul", "choice", "score"]
DecisionSource = Literal["jev", "mock"]
Labeling = Literal["measured", "judgment_added"]

YMYL_CLAIM_CLASSES = frozenset(
    {
        "medical_ymyl",
        "financial_ymyl",
        "legal_ymyl",
        "ymyl",
    }
)


@dataclass(frozen=True)
class Thresholds:
    """Starting confidence policy. Tune per pack against labeled overrides."""

    choice_auto: float = 0.85
    choice_human: float = 0.55
    noul_auto_yes: float = 0.85
    noul_auto_no: float = 0.15
    noul_human_low: float = 0.40
    noul_human_high: float = 0.60
    score_auto_confidence: float = 0.80
    score_human_confidence: float = 0.55
    score_extreme_low: float = 0.25
    score_extreme_high: float = 0.75

    def as_dict(self) -> dict[str, float]:
        return asdict(self)


@dataclass
class DecisionPack:
    id: str
    version: str
    docs: str
    questions: dict[str, dict[str, Any]]
    default_thresholds: Thresholds = field(default_factory=Thresholds)
    never_auto: bool = False
    never_auto_questions: tuple[str, ...] = ()
    ymyl_gate: bool = False
    required_evidence: tuple[str, ...] = ()

    def pin(self) -> str:
        return f"{self.id}@{self.version}"


@dataclass
class DecisionState:
    unit_id: str
    gate: str
    evidence: dict[str, Any]
    context: dict[str, Any] | None = None

    def to_jev_state(self) -> dict[str, Any]:
        payload: dict[str, Any] = {
            "unit_id": self.unit_id,
            "gate": self.gate,
            **self.evidence,
        }
        if self.context:
            payload["context"] = self.context
        return payload


@dataclass
class RoutedDecision:
    answers: dict[str, Any]
    route: Route
    question_routes: dict[str, Route]
    thresholds: dict[str, float]
    model: str
    pack_id: str
    pack_version: str
    decided_at: str
    source: DecisionSource
    usage: dict[str, int] | None = None
    route_reasons: list[str] = field(default_factory=list)
    unit_id: str = ""
    labeling: Labeling = "judgment_added"

    def provenance(self) -> dict[str, Any]:
        return {
            "gate": self.pack_id,
            "pack_version": self.pack_version,
            "model": self.model,
            "answers": self.answers,
            "route": self.route,
            "question_routes": self.question_routes,
            "thresholds": self.thresholds,
            "decided_at": self.decided_at,
            "source": self.source,
            "usage": self.usage,
            "route_reasons": self.route_reasons,
            "labeling": self.labeling,
        }

    def to_dict(self) -> dict[str, Any]:
        return {
            "unit_id": self.unit_id,
            "judgment": self.provenance(),
        }


class ThinStateError(ValueError):
    """State is missing required measured fields. Refuse rather than guess."""


class PackError(ValueError):
    """Pack definition or lookup failed."""


class JevAPIError(RuntimeError):
    """Live Jev HTTP call failed."""

    def __init__(self, message: str, status: int | None = None, retryable: bool = False):
        super().__init__(message)
        self.status = status
        self.retryable = retryable
