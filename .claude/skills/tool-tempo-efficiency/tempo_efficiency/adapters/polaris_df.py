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


def normalize_router_outcome(
    *,
    route: str | None = None,
    router_outcome: str | None = None,
    record: dict[str, Any] | None = None,
) -> RouterOutcome:
    """Accept DF `route` or Tempo `router_outcome`. Prefer `route` if both present."""
    if record is not None:
        if record.get("route") is not None:
            return validate_router_outcome(str(record["route"]))
        if record.get("router_outcome") is not None:
            return validate_router_outcome(str(record["router_outcome"]))
    if route is not None:
        return validate_router_outcome(str(route))
    if router_outcome is not None:
        return validate_router_outcome(str(router_outcome))
    raise ValueError("Need route or router_outcome (same values: auto | llm_escalate | human)")


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
    if isinstance(decision, dict):
        judgment = decision.get("judgment") or {}
        return normalize_router_outcome(
            route=decision.get("route") or judgment.get("route"),
            router_outcome=decision.get("router_outcome") or judgment.get("router_outcome"),
        )
    raw = getattr(decision, "route", None)
    if raw is None:
        raw = getattr(decision, "router_outcome", None)
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


def df_escalate_band(
    pack_id: str | None,
    *,
    ymyl: bool = False,
    claim_pack: bool = False,
    df_context: str | None = None,
) -> str | None:
    """Map a DF pack id / context to a Tempo escalate band. Not a pack catalog.

    Returns: keyword_purity | audit | qa_aeo_geo | ymyl_claim | None
    """
    if df_context:
        allowed = {"keyword_purity", "audit", "qa_aeo_geo", "ymyl_claim"}
        if df_context not in allowed:
            raise ValueError(f"df_context must be one of {sorted(allowed)}")
        return df_context
    if ymyl or claim_pack or pack_forces_human(pack_id, ymyl=ymyl, claim_pack=claim_pack):
        return "ymyl_claim"
    if not pack_id:
        return None
    pid = pack_id.upper()
    if any(token in pid for token in ("CLAIM", "EEAT", "YMYL")):
        return "ymyl_claim"
    if any(token in pid for token in ("AEO", "GEO", "CITE")) or pid.startswith("QA."):
        return "qa_aeo_geo"
    if pid.startswith("AUDIT."):
        return "audit"
    if pid.startswith(("KW.", "G0.", "G1.", "G2.", "G3.", "G4.", "G5.", "G7.", "G8.")):
        return "keyword_purity"
    return None


def any_flag_ymyl(flags: Iterable[str] | None) -> bool:
    if not flags:
        return False
    return any(str(f).upper() == "YMYL" or "ymyl" in str(f).lower() for f in flags)
