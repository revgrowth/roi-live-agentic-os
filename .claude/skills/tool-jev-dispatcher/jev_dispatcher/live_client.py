"""Live TypeSafe client. The key stays in the environment and is never printed."""

from __future__ import annotations

import os

from polaris_df.client import HttpJevClient
from polaris_df.env import api_key, hydrate_process_env


def key_is_set() -> bool:
    hydrate_process_env()
    return api_key() is not None


def build_live_client() -> HttpJevClient:
    """Build the Polaris HTTP client. Raises SystemExit(2) when the key is missing."""
    hydrate_process_env()
    if not api_key():
        raise SystemExit(2)
    # Pass nothing extra: HttpJevClient reads TYPESAFE_API_KEY itself.
    return HttpJevClient()


def redact(text: str) -> str:
    """Strip the live key if it ever lands in a string."""
    secret = os.environ.get("TYPESAFE_API_KEY", "").strip()
    cleaned = text
    if secret:
        cleaned = cleaned.replace(secret, "[redacted]")
    return cleaned
