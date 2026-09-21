"""JSONL decision / override log. Model, pack, route, answers, timestamps."""

from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, TextIO

from polaris_df.types import RoutedDecision


def utc_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


class DecisionLog:
    def __init__(self, path: Path | None) -> None:
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

    def __enter__(self) -> DecisionLog:
        self.open()
        return self

    def __exit__(self, *exc: object) -> None:
        self.close()

    def write(self, record: dict[str, Any]) -> None:
        if self._handle is None:
            return
        self._handle.write(json.dumps(record, default=str) + "\n")
        self._handle.flush()

    def write_decision(
        self,
        decision: RoutedDecision,
        *,
        state: dict[str, Any] | None = None,
        extra: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        record = {
            "event": "decision",
            "ts": decision.decided_at,
            "unit_id": decision.unit_id,
            "pack_id": decision.pack_id,
            "pack_version": decision.pack_version,
            "model": decision.model,
            "route": decision.route,
            "answers": decision.answers,
            "question_routes": decision.question_routes,
            "thresholds": decision.thresholds,
            "source": decision.source,
            "usage": decision.usage,
            "route_reasons": decision.route_reasons,
            "state": state,
        }
        if extra:
            record.update(extra)
        self.write(record)
        return record

    def write_override(
        self,
        *,
        unit_id: str,
        pack_id: str,
        original: RoutedDecision,
        override_answers: dict[str, Any],
        actor: str,
        note: str = "",
    ) -> dict[str, Any]:
        record = {
            "event": "override",
            "ts": utc_now(),
            "unit_id": unit_id,
            "pack_id": pack_id,
            "model": original.model,
            "original_route": original.route,
            "original_answers": original.answers,
            "override_answers": override_answers,
            "actor": actor,
            "note": note,
        }
        self.write(record)
        return record


def default_log_path(root: Path | None = None) -> Path:
    base = root or Path.cwd()
    day = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    return base / "projects" / "tool-polaris-df" / "logs" / f"{day}_decisions.jsonl"
