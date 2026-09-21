"""Thin Jev System One client. Stdlib only. No prose generation path."""

from __future__ import annotations

import json
import time
import urllib.error
import urllib.request
from typing import Any, Protocol

from polaris_df.env import api_key, base_url
from polaris_df.types import JevAPIError


SYSTEMONE_PATH = "/v1/systemone"
DEFAULT_TIMEOUT = 10.0
RETRYABLE_STATUS = {429, 529}
MAX_RETRIES = 4


class JevClient(Protocol):
    def system_one(
        self,
        *,
        state: Any,
        questions: dict[str, dict[str, Any]],
        model: str,
    ) -> dict[str, Any]:
        ...


class HttpJevClient:
    def __init__(
        self,
        *,
        key: str | None = None,
        endpoint_base: str | None = None,
        timeout: float = DEFAULT_TIMEOUT,
    ) -> None:
        self._key = key if key is not None else api_key()
        self._base = (endpoint_base or base_url()).rstrip("/")
        self._timeout = timeout

    def system_one(
        self,
        *,
        state: Any,
        questions: dict[str, dict[str, Any]],
        model: str,
    ) -> dict[str, Any]:
        if not self._key:
            raise JevAPIError(
                "TYPESAFE_API_KEY is missing. Use --dry-run / mock mode, or set the key.",
                status=401,
            )
        payload = {"model": model, "state": state, "questions": questions}
        body = json.dumps(payload).encode("utf-8")
        url = f"{self._base}{SYSTEMONE_PATH}"
        last_error: JevAPIError | None = None
        for attempt in range(MAX_RETRIES):
            req = urllib.request.Request(
                url,
                data=body,
                method="POST",
                headers={
                    "Authorization": f"Bearer {self._key}",
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
            )
            try:
                with urllib.request.urlopen(req, timeout=self._timeout) as resp:
                    raw = resp.read().decode("utf-8")
                    return json.loads(raw)
            except urllib.error.HTTPError as exc:
                err_body = ""
                try:
                    err_body = exc.read().decode("utf-8")[:500]
                except OSError:
                    err_body = ""
                retryable = exc.code in RETRYABLE_STATUS
                last_error = JevAPIError(
                    f"Jev HTTP {exc.code}: {err_body or exc.reason}",
                    status=exc.code,
                    retryable=retryable,
                )
                if not retryable or attempt == MAX_RETRIES - 1:
                    raise last_error from exc
                retry_after = exc.headers.get("Retry-After") if exc.headers else None
                delay = float(retry_after) if retry_after else (2**attempt)
                time.sleep(min(delay, 32.0))
            except urllib.error.URLError as exc:
                last_error = JevAPIError(f"Jev network error: {exc.reason}", retryable=True)
                if attempt == MAX_RETRIES - 1:
                    raise last_error from exc
                time.sleep(2**attempt)
        raise last_error or JevAPIError("Jev call failed")


def questions_for_api(questions: dict[str, dict[str, Any]]) -> dict[str, dict[str, Any]]:
    """Strip fabric-only keys before the HTTP body is sent."""
    clean: dict[str, dict[str, Any]] = {}
    for qid, spec in questions.items():
        item: dict[str, Any] = {"type": spec["type"], "instructions": spec["instructions"]}
        if "criteria" in spec and spec["criteria"] is not None:
            item["criteria"] = spec["criteria"]
        clean[qid] = item
    return clean
