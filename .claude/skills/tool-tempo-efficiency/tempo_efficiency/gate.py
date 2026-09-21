"""ENABLED.on / ENABLED.off helpers shared by COO and Polaris DF callers."""

from __future__ import annotations

from pathlib import Path

from tempo_efficiency.config import BOT_EXEC_ENABLED, GATE_OFF_NAME, GATE_ON_NAME
from tempo_efficiency.types import GateResolution


def resolve_gate(root: Path | str) -> GateResolution:
    """Sibling gate files next to the automation root.

    Semantics (joint schema):
    - ENABLED.on present → apply allowed (after dry-run + kill armed)
    - ENABLED.on absent → dry-run / disabled
    - ENABLED.off present → forced dry-run / disabled
    - both on + off → disabled + alert
    """
    base = Path(root)
    on = (base / GATE_ON_NAME).is_file()
    off = (base / GATE_OFF_NAME).is_file()
    if on and off:
        return GateResolution(
            gate="conflict",
            apply_allowed=False,
            phase="dry-run",
            alert="ENABLED.on and ENABLED.off both present; treat as disabled",
        )
    if off:
        return GateResolution(gate="ENABLED.off", apply_allowed=False, phase="dry-run")
    if on:
        return GateResolution(gate="ENABLED.on", apply_allowed=True, phase="apply")
    return GateResolution(gate="absent", apply_allowed=False, phase="dry-run")


def apply_path_permitted(root: Path | str) -> bool:
    """Live apply is allowed only when the on-gate is clean.

    BOT_EXEC being OFF does not block COO NOISE archive. It only forbids
    auto-exec of work. Callers must still check joint thresholds.
    """
    return resolve_gate(root).apply_allowed


def write_enabled_on(root: Path | str) -> Path:
    path = Path(root) / GATE_ON_NAME
    path.parent.mkdir(parents=True, exist_ok=True)
    if not path.exists():
        path.write_text("enabled\n", encoding="utf-8")
    return path


def write_enabled_off(root: Path | str, *, reason: str = "") -> Path:
    path = Path(root) / GATE_OFF_NAME
    path.parent.mkdir(parents=True, exist_ok=True)
    body = "disabled\n"
    if reason:
        body += f"reason={reason}\n"
    path.write_text(body, encoding="utf-8")
    return path


def bot_exec_is_off() -> bool:
    return BOT_EXEC_ENABLED is False
