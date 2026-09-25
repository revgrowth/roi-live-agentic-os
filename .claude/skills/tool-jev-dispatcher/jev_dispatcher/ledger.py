"""Append-only TOKEN_LEDGER. One row per Jev decision."""

from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from jev_dispatcher.pricing import (
    INPUT_USD_PER_MILLION,
    OUTPUT_USD_PER_MILLION,
    PRICE_SOURCE,
    PRICE_STATUS,
    usd_for_tokens,
)

LEDGER_NAME = "TOKEN_LEDGER.jsonl"


def ledger_path(root: Path | str) -> Path:
    return Path(root) / "out" / LEDGER_NAME


def append_ledger(
    root: Path | str,
    *,
    decision_id: str,
    seat: str,
    model: str,
    input_tokens: int,
    output_tokens: int,
    phase: str,
    pool: str = "typesafe-jev",
    api: str = "systemone",
) -> dict[str, Any]:
    row = {
        "timestamp": _utc_now(),
        "pool": pool,
        "seat": seat,
        "api": api,
        "model": model,
        "decision_id": decision_id,
        "phase": phase,
        "input_tokens": int(input_tokens),
        "output_tokens": int(output_tokens),
        "input_usd_per_million": INPUT_USD_PER_MILLION,
        "output_usd_per_million": OUTPUT_USD_PER_MILLION,
        "usd": usd_for_tokens(input_tokens, output_tokens),
        "price_status": PRICE_STATUS,
        "price_source": PRICE_SOURCE,
    }
    path = ledger_path(root)
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(row) + "\n")
    return row


def parse_usage(usage: Any) -> tuple[int, int]:
    if not isinstance(usage, dict):
        return 0, 0
    input_tokens = usage.get("input_tokens", usage.get("prompt_tokens", 0)) or 0
    output_tokens = usage.get("output_tokens", usage.get("completion_tokens", 0)) or 0
    return int(input_tokens), int(output_tokens)


def _utc_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")
