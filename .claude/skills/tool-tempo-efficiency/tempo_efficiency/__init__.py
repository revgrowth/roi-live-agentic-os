"""Tempo shared efficiency layer. Does not fork Polaris Decision Fabric."""

from tempo_efficiency.audit import AuditWriter, emit_record
from tempo_efficiency.config import BOT_EXEC_ENABLED, PROD_CLASSIFY_MODEL, THRESHOLDS
from tempo_efficiency.gate import apply_path_permitted, resolve_gate
from tempo_efficiency.kill import apply_kill, evaluate_kill_conditions
from tempo_efficiency.router import resolve_recommendation

__version__ = "0.1.0"

__all__ = [
    "BOT_EXEC_ENABLED",
    "PROD_CLASSIFY_MODEL",
    "THRESHOLDS",
    "AuditWriter",
    "apply_kill",
    "apply_path_permitted",
    "emit_record",
    "evaluate_kill_conditions",
    "resolve_gate",
    "resolve_recommendation",
    "__version__",
]
