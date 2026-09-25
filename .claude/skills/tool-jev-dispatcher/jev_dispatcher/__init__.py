"""Jev dispatcher: label a job and queue a handoff. Never executes work."""

from jev_dispatcher.dispatch import dispatch_job
from jev_dispatcher.safety import ALLOWED_ACTIONS, LabelOnlyError

__version__ = "0.1.0"

__all__ = [
    "ALLOWED_ACTIONS",
    "LabelOnlyError",
    "dispatch_job",
    "__version__",
]
