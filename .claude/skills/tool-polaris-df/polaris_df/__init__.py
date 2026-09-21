"""Polaris Decision Fabric: typed Jev judgments for Search Command, audit, keyword, QA."""

from polaris_df.decide import decide, decide_batch, make_client
from polaris_df.registry import get_pack, list_packs, load_builtin_packs
from polaris_df.types import DecisionPack, DecisionState, RoutedDecision

__version__ = "0.1.0"

__all__ = [
    "DecisionPack",
    "DecisionState",
    "RoutedDecision",
    "decide",
    "decide_batch",
    "get_pack",
    "list_packs",
    "load_builtin_packs",
    "make_client",
    "__version__",
]
