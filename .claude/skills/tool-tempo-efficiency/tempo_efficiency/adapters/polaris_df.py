"""Import Polaris DF types. Do not fork packs or reimplement the DF router.

When `tool-polaris-df` is on PYTHONPATH this module reads `Route`,
`YMYL_CLAIM_CLASSES`, and optional pack `never_auto` / `ymyl_gate` flags.
When it is not, callers pass `router_outcome` and YMYL/claim flags themselves.
"""

from __future__ import annotations

from typing import Any, Iterable

from tempo_efficiency.types import RouterOutcome

_FALLBACK_YMYL_CLAIM_CLASSES = frozenset(
    {
        "medical_ymyl",
        "financial_ymyl",
        "legal_ymyl",
        "ymyl",
    }
)

VALID_OUTCOMES: frozenset[str] = frozenset({"auto", "llm_escalate", "human"})


def _import_polaris_types() -> tuple[Any, frozenset[str]] | None:
    try:
        from polaris_df.types import YMYL_CLAIM_CLASSES, Route  # type: ignore

        return Route, frozenset(str(x) for x in YMYL_CLAIM_CLASSES)
    except ImportError:
        return None


def imported_ymyl_claim_classes() -> frozenset[str]:
    imported = _import_polaris_types()
    if imported is None:
        return _FALLBACK_YMYL_CLAIM_CLASSES
    return imported[1]


def validate_router_outcome(value: str) -> RouterOutcome:
    if value not in VALID_OUTCOMES:
        raise ValueError(
            f"router_outcome must be one of {sorted(VALID_OUTCOMES)}; got {value!r}. "
            "Pass Polaris DF's existing outcome — Tempo does not re-route packs."
        )
    return value  # type: ignore[return-value]


def router_outcome_from_df(decision: Any) -> RouterOutcome:
    """Map a DF RoutedDecision (or dict) to the joint-schema field. No re-routing."""
    if decision is None:
        raise ValueError("Polaris DF decision is required")
    raw = getattr(decision, "route", None)
    if raw is None and isinstance(decision, dict):
        raw = decision.get("route") or (decision.get("judgment") or {}).get("route")
    if raw is None:
        raise ValueError("Polaris DF decision is missing route / router_outcome")
    return validate_router_outcome(str(raw))


def pack_forces_human(pack_id: str | None, *, ymyl: bool = False, claim_pack: bool = False) -> bool:
    """Honor DF never-auto / YMYL gates via import. Does not copy the pack catalog."""
    if ymyl or claim_pack:
        return True
    if not pack_id:
        return False
    try:
        from polaris_df.registry import get_pack, load_builtin_packs  # type: ignore
    except ImportError:
        return False
    try:
        load_builtin_packs()
        pack = get_pack(pack_id)
    except Exception:
        return False
    return bool(getattr(pack, "never_auto", False) or getattr(pack, "ymyl_gate", False))


def claim_class_is_ymyl(value: str | None) -> bool:
    if not value:
        return False
    return str(value).lower() in imported_ymyl_claim_classes() or "ymyl" in str(value).lower()


def any_flag_ymyl(flags: Iterable[str] | None) -> bool:
    if not flags:
        return False
    return any(str(f).upper() == "YMYL" or "ymyl" in str(f).lower() for f in flags)
