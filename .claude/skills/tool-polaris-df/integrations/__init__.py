"""Drop-in Search Command shims. Import or copy; do not fork packs."""

from integrations.str_search_command_soft_gates import (
    apply_purity_to_demand_library,
    classify_serp_shape,
    is_dry_run,
    judge_gate,
    judge_purity_row,
    judgment_jsonl_record,
    pick_response_unit,
    run_gate,
    soft_gates_enabled,
    verify_semantic_cannibal,
)

__all__ = [
    "apply_purity_to_demand_library",
    "classify_serp_shape",
    "is_dry_run",
    "judge_gate",
    "judge_purity_row",
    "judgment_jsonl_record",
    "pick_response_unit",
    "run_gate",
    "soft_gates_enabled",
    "verify_semantic_cannibal",
]
