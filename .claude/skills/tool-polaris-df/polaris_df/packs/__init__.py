"""All versioned decision packs."""

from __future__ import annotations

from polaris_df.packs import audit, keyword, ops, qa, search_command
from polaris_df.types import DecisionPack


def all_packs() -> list[DecisionPack]:
    packs: list[DecisionPack] = []
    packs.extend(search_command.packs())
    packs.extend(keyword.packs())
    packs.extend(audit.packs())
    packs.extend(qa.packs())
    packs.extend(ops.packs())
    return packs
