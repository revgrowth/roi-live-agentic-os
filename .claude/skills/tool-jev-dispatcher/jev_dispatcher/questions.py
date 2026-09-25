"""The three questions asked together on one System One call."""

from __future__ import annotations

from typing import Any

DESTINATION_INSTRUCTIONS = (
    "Pick the one seat that should do this job. "
    "Strategy goes to ChatGPT 20X or Claude. "
    "Hard or high-stakes execution goes to Claude Opus-class or ChatGPT Sol-class. "
    "Standard execution goes to GLM or Kimi. "
    "Code and repo work goes to Cursor. "
    "If a person should decide, pick human review. "
    "Grok is not a worker and is not in this list. Do not invent a seat."
)

COMPLEXITY_INSTRUCTIONS = (
    "Score how hard this job is to do well. "
    "routine means a checklist or extraction. "
    "standard means ordinary execution. "
    "hard means judgment, client quality, or a tricky repo change. "
    "exceptional means rare stakes or deep strategy."
)

RISK_INSTRUCTIONS = (
    "Answer yes if a human should review this before any worker starts, "
    "or if publishing, sending, or a YMYL-adjacent claim would be risky. "
    "Answer no if an AI seat can safely take the job as labeled work only."
)


def build_questions(criteria: dict[str, str]) -> dict[str, dict[str, Any]]:
    """Choice, Score, and Noul in one payload so Jev answers them in parallel."""
    if not criteria:
        raise ValueError("destination menu is empty")
    if any("grok" in key.lower() for key in criteria):
        raise ValueError("Grok cannot be a destination option")
    return {
        "destination": {
            "type": "choice",
            "instructions": DESTINATION_INSTRUCTIONS,
            "criteria": dict(criteria),
        },
        "complexity": {
            "type": "score",
            "instructions": COMPLEXITY_INSTRUCTIONS,
            "criteria": ["routine", "standard", "hard", "exceptional"],
        },
        "needs_human_or_publish_risk": {
            "type": "noul",
            "instructions": RISK_INSTRUCTIONS,
        },
    }
