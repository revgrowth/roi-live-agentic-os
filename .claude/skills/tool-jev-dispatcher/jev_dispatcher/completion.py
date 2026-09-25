"""Handoff completion is a filesystem check. Confidence is not proof of a write."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any


def confirm_handoff(path: Path | str, job_id: str, seat: str) -> bool:
    """True only when the queue file exists and matches this job and seat.

    The confidence value inside the file is ignored on purpose.
    """
    file_path = Path(path)
    if not file_path.is_file():
        return False
    try:
        data: Any = json.loads(file_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError, UnicodeError):
        return False
    if not isinstance(data, dict):
        return False
    if data.get("job_id") != job_id or data.get("seat") != seat:
        return False
    if data.get("label_only") is not True or data.get("executed") is not False:
        return False
    return True
