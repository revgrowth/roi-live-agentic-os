"""Seat menu. Built fresh each run from config plus current capacity."""

from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from tempo_efficiency.config import (
    COST_CAPS,
    DEFAULT_TIER_MODEL,
    MAX_ESCALATE_HOPS,
    PROD_CLASSIFY_MODEL,
    TIER_MODELS,
)

HUMAN_REVIEW_ID = "human-review"
CAPACITY_OVERLAY_NAME = "seat-capacity.json"
ROTATION_NAME = "rotation.json"

_PACKAGE_CONFIG = Path(__file__).resolve().parent.parent / "config" / "dispatcher.json"


@dataclass(frozen=True)
class Seat:
    id: str
    display_name: str
    capacity: str
    destination: bool
    coordinator_only: bool
    rotate_group: str | None
    rotate_order: int | None
    tempo_tier: str | None
    description: str

    def plain_description(self, *, on_rotation: bool) -> str:
        text = self.description.strip()
        if self.rotate_group and on_rotation:
            text += (
                f" This is the {self.display_name} seat on rotation right now"
                " among the available ChatGPT 20X Max seats."
            )
        return text


@dataclass(frozen=True)
class DispatcherConfig:
    confidence_threshold: float
    risk_noul_threshold: float
    seats: tuple[Seat, ...]
    source_path: str

    def seat_by_id(self, seat_id: str) -> Seat | None:
        for seat in self.seats:
            if seat.id == seat_id:
                return seat
        return None


def package_config_path() -> Path:
    return _PACKAGE_CONFIG


def load_config(path: Path | str | None = None) -> DispatcherConfig:
    config_path = Path(path) if path else _PACKAGE_CONFIG
    raw = json.loads(config_path.read_text(encoding="utf-8"))
    pinned = str(raw.get("model") or "")
    if pinned != PROD_CLASSIFY_MODEL:
        raise ValueError(
            f"dispatcher config model must be {PROD_CLASSIFY_MODEL}, found {pinned or 'empty'}"
        )
    threshold = float(raw["confidence_threshold"])
    risk = float(raw["risk_noul_threshold"])
    if not 0.0 <= threshold <= 1.0 or not 0.0 <= risk <= 1.0:
        raise ValueError("thresholds must be between 0 and 1")
    seats = tuple(_seat_from_dict(item) for item in raw["seats"])
    if not any(seat.id == HUMAN_REVIEW_ID for seat in seats):
        raise ValueError("config is missing human-review")
    return DispatcherConfig(
        confidence_threshold=threshold,
        risk_noul_threshold=risk,
        seats=seats,
        source_path=str(config_path),
    )


def apply_capacity(config: DispatcherConfig, overlay: dict[str, str]) -> DispatcherConfig:
    """Replace capacity for the ids present in the overlay. Other fields stay."""
    updated: list[Seat] = []
    for seat in config.seats:
        if seat.id not in overlay:
            updated.append(seat)
            continue
        updated.append(
            Seat(
                id=seat.id,
                display_name=seat.display_name,
                capacity=str(overlay[seat.id]),
                destination=seat.destination,
                coordinator_only=seat.coordinator_only,
                rotate_group=seat.rotate_group,
                rotate_order=seat.rotate_order,
                tempo_tier=seat.tempo_tier,
                description=seat.description,
            )
        )
    return DispatcherConfig(
        confidence_threshold=config.confidence_threshold,
        risk_noul_threshold=config.risk_noul_threshold,
        seats=tuple(updated),
        source_path=config.source_path,
    )


def load_capacity_overlay(root: Path | str) -> dict[str, str]:
    path = Path(root) / CAPACITY_OVERLAY_NAME
    if not path.is_file():
        return {}
    raw = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(raw, dict):
        raise ValueError("seat-capacity.json must be an object of seat id to capacity")
    return {str(key): str(value) for key, value in raw.items()}


def is_grok(seat_id: str, display_name: str = "") -> bool:
    blob = f"{seat_id} {display_name}".lower()
    return "grok" in blob


def selectable(seat: Seat) -> bool:
    """True when this seat may appear on Jev's menu."""
    if seat.coordinator_only or is_grok(seat.id, seat.display_name):
        return False
    if not seat.destination:
        return False
    if seat.capacity == "at_cap":
        return False
    return True


def load_rotation_cursor(root: Path | str, group: str) -> str | None:
    path = Path(root) / "out" / ROTATION_NAME
    if not path.is_file():
        return None
    try:
        raw = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return None
    value = raw.get(group)
    return str(value) if value else None


def save_rotation_cursor(root: Path | str, group: str, seat_id: str) -> None:
    path = Path(root) / "out" / ROTATION_NAME
    path.parent.mkdir(parents=True, exist_ok=True)
    raw: dict[str, Any] = {}
    if path.is_file():
        try:
            loaded = json.loads(path.read_text(encoding="utf-8"))
            if isinstance(loaded, dict):
                raw = loaded
        except (OSError, json.JSONDecodeError):
            raw = {}
    raw[group] = seat_id
    path.write_text(json.dumps(raw, indent=2) + "\n", encoding="utf-8")


def build_menu(config: DispatcherConfig, *, rotation_cursor: str | None) -> list[Seat]:
    """Destination options for this run. At-cap seats and Grok are left out."""
    menu: list[Seat] = []
    groups: dict[str, list[Seat]] = {}
    for seat in config.seats:
        if seat.rotate_group:
            groups.setdefault(seat.rotate_group, []).append(seat)
            continue
        if selectable(seat):
            menu.append(seat)
    for members in groups.values():
        ordered = sorted(members, key=lambda seat: seat.rotate_order if seat.rotate_order is not None else 0)
        picked = _rotated_member(ordered, rotation_cursor)
        if picked is not None:
            menu.append(picked)
    return menu


def menu_criteria(menu: list[Seat]) -> dict[str, str]:
    return {seat.id: seat.plain_description(on_rotation=bool(seat.rotate_group)) for seat in menu}


def tempo_context() -> dict[str, Any]:
    """Ladder, hop limit, and cost-cap placeholders owned by Tempo. Not a second copy."""
    return {
        "classify_model": PROD_CLASSIFY_MODEL,
        "hop_limit": MAX_ESCALATE_HOPS,
        "tiers": {tier: list(models) for tier, models in TIER_MODELS.items()},
        "default_tier_model": dict(DEFAULT_TIER_MODEL),
        "cost_caps_usd": COST_CAPS.as_dict(),
        "cost_caps_note": "Dollar caps are null until Jason sets them. Hop limit still applies.",
    }


def _rotated_member(members: list[Seat], cursor: str | None) -> Seat | None:
    available = [seat for seat in members if selectable(seat)]
    if not available:
        return None
    if not cursor:
        return available[0]
    ids = [seat.id for seat in members]
    start = ids.index(cursor) if cursor in ids else -1
    for step in range(1, len(members) + 1):
        candidate = members[(start + step) % len(members)]
        if selectable(candidate):
            return candidate
    return None


def _seat_from_dict(item: dict[str, Any]) -> Seat:
    order = item.get("rotate_order")
    return Seat(
        id=str(item["id"]),
        display_name=str(item["display_name"]),
        capacity=str(item.get("capacity") or "available"),
        destination=bool(item.get("destination")),
        coordinator_only=bool(item.get("coordinator_only")),
        rotate_group=item.get("rotate_group") or None,
        rotate_order=int(order) if order is not None else None,
        tempo_tier=item.get("tempo_tier"),
        description=str(item.get("description") or ""),
    )
