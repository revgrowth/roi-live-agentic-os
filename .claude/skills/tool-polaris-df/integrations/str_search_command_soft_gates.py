"""Portable Search Command soft-gate shim.

Copy this file next to a local `str-search-command` checkout, or import it
from `tool-polaris-df`. It wraps `polaris_df.adapters.search_command`.
It does not fork packs and does not change DF auto thresholds.

Behaviour:
- dry_run by default (override with POLARIS_DF_LIVE=1 and a live key)
- no-op if POLARIS_DF_SOFT_GATES is 0/off/false, or if polaris_df is missing
- measured fields stay locked (adapter + local re-lock)
- YMYL / claim gates never auto
- judgment stamps `route` and Tempo alias `router_outcome`
"""

from __future__ import annotations

import os
import sys
from copy import deepcopy
from pathlib import Path
from typing import Any, Callable, Iterable

SOFT_GATES_ENV = "POLARIS_DF_SOFT_GATES"
LIVE_ENV = "POLARIS_DF_LIVE"
_FALSEY = {"0", "off", "false", "no", "disabled"}
_TRUEY = {"1", "on", "true", "yes", "enabled"}

MEASURED_LOCK = (
    "volume",
    "search_volume",
    "kd",
    "keyword_difficulty",
    "cpc",
    "competition",
    "first_organic_rank_absolute",
    "aio_citation_count",
    "item_type_composition",
    "measured",
)

NEVER_AUTO_PACKS = frozenset(
    {
        "G6.claim_authority.v1",
        "QA.eeat_claim.v1",
    }
)
NEVER_AUTO_TOKENS = ("claim", "eeat", "ymyl")

GATE_ALIASES = {
    "purity": "purity",
    "g3.purity.v1": "purity",
    "serp_shape": "serp_shape",
    "serp-shape": "serp_shape",
    "g3.serp_shape.v1": "serp_shape",
    "response_unit": "response_unit",
    "select": "response_unit",
    "g4.response_unit.v1": "response_unit",
    "semantic_cannibal": "semantic_cannibal",
    "qa.semantic_cannibal.v1": "semantic_cannibal",
    "claim": "G6.claim_authority.v1",
    "g6.claim_authority.v1": "G6.claim_authority.v1",
    "territory": "G1.territory.v1",
    "audience": "G2.audience_job.v1",
    "ia": "G5.public_ia.v1",
    "priority": "G7.priority.v1",
    "ship": "G8.ship_soft.v1",
    "source": "G0.source_of_truth.v1",
    "run": "purity",
}

_ADAPTER: Any | None = None
_ADAPTER_TRIED = False


def _env_flag(name: str, *, default: bool) -> bool:
    raw = os.environ.get(name)
    if raw is None or not str(raw).strip():
        return default
    value = str(raw).strip().lower()
    if value in _FALSEY:
        return False
    if value in _TRUEY:
        return True
    return default


def soft_gates_enabled() -> bool:
    """Kill switch. Default on. POLARIS_DF_SOFT_GATES=0/off/false disables."""
    try:
        from polaris_df.env import soft_gates_enabled as _core

        return bool(_core())
    except Exception:
        return _env_flag(SOFT_GATES_ENV, default=True)


def live_requested() -> bool:
    try:
        from polaris_df.env import live_requested as _core

        return bool(_core())
    except Exception:
        return _env_flag(LIVE_ENV, default=False)


def is_dry_run(*, dry_run: bool | None = None) -> bool:
    """Default dry_run. Live only when POLARIS_DF_LIVE is on and a key exists."""
    if dry_run is not None:
        return bool(dry_run)
    if not live_requested():
        return True
    try:
        from polaris_df.env import has_live_credentials

        return not has_live_credentials()
    except Exception:
        return True


def _candidate_skill_roots() -> list[Path]:
    here = Path(__file__).resolve()
    cwd = Path.cwd().resolve()
    roots = [
        here.parents[1] if len(here.parents) > 1 else here.parent,
        here.parent,
        cwd / ".claude" / "skills" / "tool-polaris-df",
        cwd,
    ]
    cursor = cwd
    for _ in range(8):
        roots.append(cursor / ".claude" / "skills" / "tool-polaris-df")
        if cursor.parent == cursor:
            break
        cursor = cursor.parent
    seen: set[Path] = set()
    out: list[Path] = []
    for root in roots:
        resolved = root.resolve()
        if resolved in seen:
            continue
        seen.add(resolved)
        out.append(resolved)
    return out


def _load_adapter() -> Any | None:
    global _ADAPTER, _ADAPTER_TRIED
    if _ADAPTER is not None:
        return _ADAPTER
    if _ADAPTER_TRIED:
        return None
    _ADAPTER_TRIED = True
    try:
        from polaris_df.adapters import search_command as adapter

        _ADAPTER = adapter
        return adapter
    except Exception:
        pass
    for root in _candidate_skill_roots():
        if not (root / "polaris_df" / "adapters" / "search_command.py").is_file():
            continue
        root_s = str(root)
        if root_s not in sys.path:
            sys.path.insert(0, root_s)
        try:
            from polaris_df.adapters import search_command as adapter

            _ADAPTER = adapter
            return adapter
        except Exception:
            continue
    return None


def reset_adapter_cache() -> None:
    """Test helper. Not part of the Search Command contract."""
    global _ADAPTER, _ADAPTER_TRIED
    _ADAPTER = None
    _ADAPTER_TRIED = False


def _skip(row: dict[str, Any], reason: str) -> dict[str, Any]:
    out = deepcopy(row)
    for key in MEASURED_LOCK:
        if key in row:
            out[key] = row[key]
    out["judgment_added"] = False
    out["judgment_skipped"] = True
    out["judgment_skip_reason"] = reason
    return out


def _relock_measured(original: dict[str, Any], out: dict[str, Any]) -> dict[str, Any]:
    for key in MEASURED_LOCK:
        if key in original:
            out[key] = original[key]
    return out


def _shared_confidence(answers: dict[str, Any] | None) -> float | None:
    """Tempo joint-schema mapping. Do not invent a DF safety score.

    choice/score → min(confidence); noul → |p-0.5|*2; mixed → min of those.
    """
    if not answers:
        return None
    try:
        from polaris_df.router import noul_extremity
    except Exception:

        def noul_extremity(value: float) -> float:
            return abs(float(value) - 0.5) * 2.0

    mapped: list[float] = []
    for answer in answers.values():
        if not isinstance(answer, dict):
            continue
        qtype = answer.get("type")
        if qtype in {"choice", "score"} and answer.get("confidence") is not None:
            mapped.append(float(answer["confidence"]))
        elif qtype == "noul":
            mapped.append(float(noul_extremity(float(answer.get("noul") or 0.5))))
    if not mapped:
        return None
    return min(mapped)


def _stamp_joint_fields(out: dict[str, Any]) -> dict[str, Any]:
    judgment = out.get("judgment")
    if not isinstance(judgment, dict):
        return out
    route = judgment.get("route") or judgment.get("router_outcome")
    if route is not None:
        judgment["route"] = route
        judgment["router_outcome"] = route
    answers = judgment.get("answers")
    if isinstance(answers, dict) and "confidence" not in judgment:
        confidence = _shared_confidence(answers)
        if confidence is not None:
            judgment["confidence"] = confidence
    out["judgment"] = judgment
    return out


def _clamp_never_auto(out: dict[str, Any], gate: str | None = None) -> dict[str, Any]:
    judgment = out.get("judgment")
    if not isinstance(judgment, dict):
        return out
    pack = str(judgment.get("gate") or gate or "")
    lowered = pack.lower()
    force = pack in NEVER_AUTO_PACKS or any(token in lowered for token in NEVER_AUTO_TOKENS)
    if force and judgment.get("route") == "auto":
        judgment["route"] = "human"
        judgment["router_outcome"] = "human"
        reasons = list(judgment.get("route_reasons") or [])
        reasons.append("shim:ymyl_claim_never_auto")
        judgment["route_reasons"] = reasons
        out["judgment"] = judgment
    return out


def _call(
    name: str,
    row: dict[str, Any],
    *,
    context: dict[str, Any] | None = None,
    dry_run: bool | None = None,
    model: str | None = None,
    pack_id: str | None = None,
) -> dict[str, Any]:
    if not soft_gates_enabled():
        return _skip(row, "soft_gates_disabled")
    adapter = _load_adapter()
    if adapter is None:
        return _skip(row, "adapter_unavailable")
    use_dry = is_dry_run(dry_run=dry_run)
    try:
        if name == "judge_gate":
            out = adapter.judge_gate(
                pack_id or name,
                row,
                context=context,
                dry_run=use_dry,
                model=model,
            )
        else:
            fn: Callable[..., dict[str, Any]] = getattr(adapter, name)
            out = fn(row, context=context, dry_run=use_dry, model=model)
    except Exception as exc:
        return _skip(row, f"{type(exc).__name__}: {exc}")
    _relock_measured(row, out)
    _stamp_joint_fields(out)
    _clamp_never_auto(out, pack_id or name)
    return out


def judge_purity_row(
    row: dict[str, Any],
    *,
    context: dict[str, Any] | None = None,
    dry_run: bool | None = None,
    model: str | None = None,
) -> dict[str, Any]:
    return _call("judge_purity_row", row, context=context, dry_run=dry_run, model=model)


def classify_serp_shape(
    row: dict[str, Any],
    *,
    context: dict[str, Any] | None = None,
    dry_run: bool | None = None,
    model: str | None = None,
) -> dict[str, Any]:
    return _call("classify_serp_shape", row, context=context, dry_run=dry_run, model=model)


def pick_response_unit(
    row: dict[str, Any],
    *,
    context: dict[str, Any] | None = None,
    dry_run: bool | None = None,
    model: str | None = None,
) -> dict[str, Any]:
    return _call("pick_response_unit", row, context=context, dry_run=dry_run, model=model)


def verify_semantic_cannibal(
    pair: dict[str, Any],
    *,
    context: dict[str, Any] | None = None,
    dry_run: bool | None = None,
    model: str | None = None,
) -> dict[str, Any]:
    return _call("verify_semantic_cannibal", pair, context=context, dry_run=dry_run, model=model)


def judge_gate(
    pack_id: str,
    row: dict[str, Any],
    *,
    context: dict[str, Any] | None = None,
    dry_run: bool | None = None,
    model: str | None = None,
) -> dict[str, Any]:
    return _call(
        "judge_gate",
        row,
        context=context,
        dry_run=dry_run,
        model=model,
        pack_id=pack_id,
    )


def apply_purity_to_demand_library(
    rows: Iterable[dict[str, Any]],
    *,
    context: dict[str, Any] | None = None,
    dry_run: bool | None = None,
    model: str | None = None,
) -> list[dict[str, Any]]:
    return [
        judge_purity_row(row, context=context, dry_run=dry_run, model=model)
        for row in rows
    ]


def run_gate(
    gate: str,
    row: dict[str, Any],
    *,
    context: dict[str, Any] | None = None,
    dry_run: bool | None = None,
    model: str | None = None,
) -> dict[str, Any]:
    """Generic SC `run` hook. Accepts SOFT_GATES names or pack ids."""
    key = GATE_ALIASES.get(str(gate).strip().lower(), str(gate).strip())
    if key == "purity":
        return judge_purity_row(row, context=context, dry_run=dry_run, model=model)
    if key == "serp_shape":
        return classify_serp_shape(row, context=context, dry_run=dry_run, model=model)
    if key == "response_unit":
        return pick_response_unit(row, context=context, dry_run=dry_run, model=model)
    if key == "semantic_cannibal":
        return verify_semantic_cannibal(row, context=context, dry_run=dry_run, model=model)
    return judge_gate(key, row, context=context, dry_run=dry_run, model=model)


def judgment_jsonl_record(row: dict[str, Any], *, dry_run: bool | None = None) -> dict[str, Any]:
    """Minimum Tempo-compatible JSONL fields. `safety` is omitted on purpose."""
    judgment = row.get("judgment") if isinstance(row.get("judgment"), dict) else {}
    route = judgment.get("route") or judgment.get("router_outcome") or row.get("route")
    return {
        "timestamp": judgment.get("decided_at"),
        "lane": "polaris_df",
        "decision_id": row.get("unit_id") or row.get("query"),
        "item_id": row.get("unit_id") or row.get("query"),
        "confidence": judgment.get("confidence") or _shared_confidence(judgment.get("answers")),
        "route": route,
        "router_outcome": judgment.get("router_outcome") or route,
        "phase": "dry-run" if is_dry_run(dry_run=dry_run) else "apply",
        "action": "label",
        "result": "ok" if row.get("judgment_added") else "skipped",
        "gate": judgment.get("gate"),
        "jev_model": judgment.get("model"),
    }
