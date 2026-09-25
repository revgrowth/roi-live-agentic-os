"""Remember queued job ids so the same job is not written twice."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any


def dedup_path(root: Path | str) -> Path:
    return Path(root) / "out" / "dedup.json"


def load_dedup(root: Path | str) -> dict[str, Any]:
    path = dedup_path(root)
    if not path.is_file():
        return {}
    try:
        raw = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return {}
    return raw if isinstance(raw, dict) else {}


def already_queued(root: Path | str, job_id: str) -> dict[str, Any] | None:
    row = load_dedup(root).get(job_id)
    return row if isinstance(row, dict) else None


def remember_queued(root: Path | str, job_id: str, *, seat: str, path: str) -> None:
    store = load_dedup(root)
    store[job_id] = {"seat": seat, "path": path}
    file_path = dedup_path(root)
    file_path.parent.mkdir(parents=True, exist_ok=True)
    file_path.write_text(json.dumps(store, indent=2) + "\n", encoding="utf-8")
