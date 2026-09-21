"""Kill-on-first-miss and disable-gate behavior.

On any kill: stop apply → write ENABLED.off / retire ENABLED.on → out/KILL.md.
Re-enable is human/COO/Polaris judgment — this module never auto-re-enables.
"""

from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterable

from tempo_efficiency.config import (
    API_ERROR_CONSECUTIVE_MAX,
    API_ERROR_RATE_MAX,
    API_ERROR_RATE_WINDOW,
    BOT_EXEC_ENABLED,
    GATE_OFF_NAME,
    GATE_ON_KILLED_NAME,
    GATE_ON_NAME,
    KILL_MARKDOWN_REL,
    NOISE_ARCHIVE_BUCKET,
    NOISE_ARCHIVE_MIN_CONFIDENCE,
    NOISE_ARCHIVE_MIN_SAFETY,
    PROD_CLASSIFY_MODEL,
)
from tempo_efficiency.adapters.polaris_df import normalize_router_outcome
from tempo_efficiency.gate import write_enabled_off
from tempo_efficiency.types import KillVerdict


def evaluate_kill_conditions(
    record: dict[str, Any],
    *,
    recent_results: Iterable[str] | None = None,
) -> KillVerdict:
    """Score one decision (plus optional rolling results) against K1–K8."""
    reasons: list[str] = []
    miss = bool(record.get("miss"))
    if miss:
        reasons.append("K1:first_miss")

    lane = record.get("lane")
    action = record.get("action") or record.get("would_action")
    bucket = record.get("bucket")
    phase = record.get("phase")
    confidence = _as_float(record.get("bucket_confidence", record.get("confidence")))
    safety = _as_float(record.get("safety"))
    try:
        router_outcome = normalize_router_outcome(record=record)
    except ValueError:
        router_outcome = record.get("router_outcome") or record.get("route")
    ymyl = bool(record.get("ymyl") or record.get("claim_pack"))
    flags = {str(f).upper() for f in (record.get("flags") or [])}

    archived_or_auto = action == "archive" or (
        router_outcome == "auto" and action not in {None, "skip", "none", "label"}
    )
    if lane == "coo_noise_archive" and archived_or_auto:
        if bucket != NOISE_ARCHIVE_BUCKET:
            reasons.append("K3:wrong_bucket_archived")
        if confidence is None or confidence < NOISE_ARCHIVE_MIN_CONFIDENCE:
            reasons.append("K2:confidence_breach")
        if safety is None or safety < NOISE_ARCHIVE_MIN_SAFETY:
            reasons.append("K2:safety_breach")

    if ymyl or "YMYL" in flags:
        if router_outcome == "auto" and action not in {None, "skip", "none", "label", "escalate_human"}:
            reasons.append("K4:ymyl_or_claim_auto_approved")

    if action == "delete":
        reasons.append("K6:delete_attempted")

    if record.get("bot_exec") is True or (
        bucket == "BOT_EXEC" and action not in {None, "skip", "none", "label"} and BOT_EXEC_ENABLED
    ):
        reasons.append("K7:bot_exec_or_clickup_mutate")
    if record.get("clickup_mutate") is True:
        reasons.append("K7:bot_exec_or_clickup_mutate")

    jev_model = record.get("jev_model")
    if phase == "apply" and jev_model and jev_model != PROD_CLASSIFY_MODEL:
        reasons.append(f"K8:classify_model_drift:{jev_model}")

    if recent_results is not None:
        window = list(recent_results)[-API_ERROR_RATE_WINDOW:]
        if window:
            error_rate = sum(1 for r in window if r == "error") / len(window)
            if len(window) >= 3 and error_rate >= API_ERROR_RATE_MAX and len(window) >= min(
                API_ERROR_RATE_WINDOW, 10
            ):
                reasons.append("K5:api_error_rate")
            consec = 0
            for r in reversed(window):
                if r != "error":
                    break
                consec += 1
            if consec >= API_ERROR_CONSECUTIVE_MAX:
                reasons.append("K5:api_error_consecutive")

    return KillVerdict(should_kill=bool(reasons), reasons=tuple(reasons), miss=miss)


def apply_kill(
    root: Path | str,
    *,
    reason: str,
    decision_id: str | None = None,
    extra: str = "",
) -> dict[str, Any]:
    """Disable the gate and write out/KILL.md. Never auto-re-enables."""
    base = Path(root)
    base.mkdir(parents=True, exist_ok=True)
    on_path = base / GATE_ON_NAME
    killed_on: Path | None = None
    if on_path.is_file():
        killed_on = base / GATE_ON_KILLED_NAME
        on_path.replace(killed_on)
    off_path = write_enabled_off(base, reason=reason)

    stamp = datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")
    kill_md = base / KILL_MARKDOWN_REL
    kill_md.parent.mkdir(parents=True, exist_ok=True)
    body = (
        f"# KILL\n\n"
        f"- timestamp: {stamp}\n"
        f"- decision_id: {decision_id or 'n/a'}\n"
        f"- reason: {reason}\n"
        f"- gate: {GATE_OFF_NAME} written; {GATE_ON_NAME} retired\n"
        f"- re-enable: human / COO / Polaris only — see kill-switch SOP §5\n"
    )
    if extra:
        body += f"\n{extra.rstrip()}\n"
    kill_md.write_text(body, encoding="utf-8")
    return {
        "killed": True,
        "reason": reason,
        "decision_id": decision_id,
        "gate": "ENABLED.off",
        "enabled_off": str(off_path),
        "enabled_on_retired": str(killed_on) if killed_on else None,
        "kill_md": str(kill_md),
        "bot_exec": BOT_EXEC_ENABLED,
    }


def _as_float(value: Any) -> float | None:
    if value is None or value == "":
        return None
    return float(value)
