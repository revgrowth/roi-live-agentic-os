"""Load JSON / JSONL input files for CLI pipelines."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any


def load_records(path: Path) -> list[dict[str, Any]]:
    text = path.read_text(encoding="utf-8").strip()
    if not text:
        return []
    if path.suffix == ".jsonl" or "\n{" in text:
        rows: list[dict[str, Any]] = []
        for line in text.splitlines():
            line = line.strip()
            if not line:
                continue
            item = json.loads(line)
            if not isinstance(item, dict):
                raise ValueError(f"{path} JSONL line is not an object")
            rows.append(item)
        return rows
    data = json.loads(text)
    if isinstance(data, list):
        return data
    if isinstance(data, dict):
        for key in ("rows", "items", "keywords", "findings", "issues"):
            if isinstance(data.get(key), list):
                return data[key]
        return [data]
    raise ValueError(f"Unsupported input shape in {path}")


def dump_json(path: Path | None, payload: Any) -> str:
    text = json.dumps(payload, indent=2, default=str)
    if path is not None:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text + "\n", encoding="utf-8")
    return text
