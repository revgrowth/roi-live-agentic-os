"""Append-only JSONL writer. Emits the joint-schema minimum fields.

Polaris may keep DF-native keys. COO may keep shadow-only keys.
Union is fine — extra keys are preserved, shared keys are always present.
"""

from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, TextIO

from tempo_efficiency.adapters.polaris_df import normalize_router_outcome
from tempo_efficiency.config import BOT_EXEC_ENABLED, PROD_CLASSIFY_MODEL
from tempo_efficiency.types import (
    COO_APPLY_REQUIRED_FIELDS,
    POLARIS_OPTIONAL_FIELDS,
    ROUTER_JSONL_FIELDS,
    SHARED_JSONL_FIELDS,
)


def utc_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def emit_record(**fields: Any) -> dict[str, Any]:
    """Build one audit line with shared keys (null when N/A) plus extras."""
    record: dict[str, Any] = {key: None for key in SHARED_JSONL_FIELDS}
    for key in ROUTER_JSONL_FIELDS:
        record[key] = None

    incoming = dict(fields)
    if incoming.get("confidence") is not None and incoming.get("bucket_confidence") is None:
        incoming["bucket_confidence"] = incoming["confidence"]
    if incoming.get("bucket_confidence") is not None and incoming.get("confidence") is None:
        incoming["confidence"] = incoming["bucket_confidence"]
    if incoming.get("decision_id") and not incoming.get("item_id"):
        incoming["item_id"] = incoming["decision_id"]
    if incoming.get("item_id") and not incoming.get("decision_id"):
        incoming["decision_id"] = incoming["item_id"]
    if incoming.get("route") is not None or incoming.get("router_outcome") is not None:
        try:
            outcome = normalize_router_outcome(
                route=incoming.get("route"),
                router_outcome=incoming.get("router_outcome"),
                record=incoming,
            )
            incoming["route"] = outcome
            incoming["router_outcome"] = outcome
        except ValueError:
            pass
    if incoming.get("timestamp") is None:
        incoming["timestamp"] = utc_now()
    if incoming.get("jev_model") is None and incoming.get("classify_used", True):
        incoming["jev_model"] = PROD_CLASSIFY_MODEL
    incoming.pop("classify_used", None)
    if incoming.get("bot_exec") is None:
        incoming["bot_exec"] = BOT_EXEC_ENABLED
    # Never invent a DF safety score.
    if incoming.get("lane") == "polaris_df" and "safety" not in fields:
        incoming["safety"] = None

    record.update(incoming)
    return record


def missing_required_fields(record: dict[str, Any]) -> tuple[str, ...]:
    """COO noise-archive apply requires safety/phase/gate. polaris_df may omit them."""
    lane = record.get("lane")
    if lane == "polaris_df":
        return ()
    if lane == "coo_noise_archive" and record.get("phase") == "apply":
        missing = [key for key in COO_APPLY_REQUIRED_FIELDS if record.get(key) in (None, "")]
        return tuple(missing)
    return ()


def polaris_optional_fields() -> tuple[str, ...]:
    return POLARIS_OPTIONAL_FIELDS


class AuditWriter:
    def __init__(self, path: Path | str | None) -> None:
        self.path = Path(path) if path else None
        self._handle: TextIO | None = None

    def open(self) -> None:
        if self.path is None:
            return
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self._handle = self.path.open("a", encoding="utf-8")

    def close(self) -> None:
        if self._handle is not None:
            self._handle.close()
            self._handle = None

    def __enter__(self) -> AuditWriter:
        self.open()
        return self

    def __exit__(self, *exc: object) -> None:
        self.close()

    def write(self, record: dict[str, Any]) -> dict[str, Any]:
        line = emit_record(**record)
        if self._handle is not None:
            self._handle.write(json.dumps(line, default=str) + "\n")
            self._handle.flush()
        return line


def default_log_path(root: Path | None = None) -> Path:
    base = root or Path.cwd()
    day = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    return base / "projects" / "tool-tempo-efficiency" / "logs" / f"{day}_audit.jsonl"
