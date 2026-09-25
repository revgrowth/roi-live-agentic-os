"""Label-and-queue boundary. No send, execute, or mutate action is allowed."""

from __future__ import annotations

ALLOWED_ACTIONS = frozenset(
    {
        "dry_run_label",
        "queue_handoff",
        "dedup_skip",
        "kill",
        "skipped_no_client",
        "jev_error",
    }
)

# Names that must never become a dispatcher action.
FORBIDDEN_ACTIONS = frozenset(
    {
        "send",
        "execute",
        "bot_exec",
        "clickup_mutate",
        "email",
        "publish",
        "post",
    }
)


class LabelOnlyError(RuntimeError):
    """Raised when a caller tries to leave the label-and-queue boundary."""


def refuse_mutation(action: str) -> str:
    """Return the action if it is a label/queue step. Otherwise refuse."""
    if action in FORBIDDEN_ACTIONS or action not in ALLOWED_ACTIONS:
        raise LabelOnlyError(f"dispatcher refused non-label action: {action}")
    return action
