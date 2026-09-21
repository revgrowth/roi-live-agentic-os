"""Discover TYPESAFE / Polaris settings without printing secrets."""

from __future__ import annotations

import os
from pathlib import Path

API_KEY_ENV = "TYPESAFE_API_KEY"
BASE_URL_ENV = "TYPESAFE_BASE_URL"
DEFAULT_MODEL_ENV = "TYPESAFE_DEFAULT_MODEL"
POLARIS_MODEL_ENV = "POLARIS_JEV_MODEL"
POLARIS_LOG_ENV = "POLARIS_DF_LOG"
DEFAULT_BASE_URL = "https://api.typesafe.ai"
DEFAULT_PROD_MODEL = "jev-1.13.0"
DEFAULT_DEV_MODEL = "jev-latest"


def find_env_file(start: Path | None = None) -> Path | None:
    dir_path = (start or Path.cwd()).resolve()
    for _ in range(12):
        candidate = dir_path / ".env"
        if candidate.is_file():
            return candidate
        if dir_path.parent == dir_path:
            break
        dir_path = dir_path.parent
    return None


def load_dotenv_values(path: Path) -> dict[str, str]:
    values: dict[str, str] = {}
    text = path.read_text(encoding="utf-8")
    for raw in text.splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip()
        if (value.startswith('"') and value.endswith('"')) or (
            value.startswith("'") and value.endswith("'")
        ):
            value = value[1:-1]
        values[key] = value
    return values


def hydrate_process_env(start: Path | None = None) -> None:
    """Fill missing process env keys from a nearby .env. Never overwrite."""
    path = find_env_file(start)
    if path is None:
        return
    try:
        values = load_dotenv_values(path)
    except OSError:
        return
    for key, value in values.items():
        if key and value and key not in os.environ:
            os.environ[key] = value


def api_key() -> str | None:
    key = os.environ.get(API_KEY_ENV, "").strip()
    return key or None


def base_url() -> str:
    return os.environ.get(BASE_URL_ENV, DEFAULT_BASE_URL).rstrip("/")


def default_model(*, dry_run: bool = False) -> str:
    pinned = os.environ.get(POLARIS_MODEL_ENV) or os.environ.get(DEFAULT_MODEL_ENV)
    if pinned:
        return pinned.strip()
    if dry_run:
        return DEFAULT_DEV_MODEL
    return DEFAULT_PROD_MODEL


def has_live_credentials() -> bool:
    return api_key() is not None
