"""Joint schema thresholds, Jev pin, hop limit, and $ cap placeholders.

Source of truth for the numbers: references/joint-confidence-kill-schema.md
Polaris DF pack thresholds stay in tool-polaris-df — do not restate packs here.
"""

from __future__ import annotations

from tempo_efficiency.types import CostCaps, ThresholdRow

PROD_CLASSIFY_MODEL = "jev-1.13.0"
FLOATING_CLASSIFY_MODEL = "jev-latest"

# COO / Tempo hard pin. This package cannot turn BOT_EXEC on.
BOT_EXEC_ENABLED = False

# YMYL / claim: human only. T3 draft only if Jason later sets this True.
ALLOW_YMYL_ASSIST_DRAFT = False

MAX_ESCALATE_HOPS = 2

GATE_ON_NAME = "ENABLED.on"
GATE_OFF_NAME = "ENABLED.off"
GATE_ON_KILLED_NAME = "ENABLED.on.killed"
KILL_MARKDOWN_REL = "out/KILL.md"

# Joint schema — COO NOISE archive apply row.
NOISE_ARCHIVE_MIN_CONFIDENCE = 0.95
NOISE_ARCHIVE_MIN_SAFETY = 0.70
NOISE_ARCHIVE_BUCKET = "NOISE"
NOISE_ARCHIVE_OUTCOME = "auto"

# Kill K5 is a PROPOSAL in the SOP. Implemented as an optional checker.
API_ERROR_RATE_WINDOW = 20
API_ERROR_RATE_MAX = 0.10
API_ERROR_CONSECUTIVE_MAX = 3

# Jason has not set dollar amounts. Structure exists; enforcement is hop-only
# until these are non-None.
COST_CAPS = CostCaps(
    per_item_t1_usd=None,
    per_item_t3_usd=None,
    daily_lane_usd=None,
)

THRESHOLDS: dict[str, ThresholdRow] = {
    "coo_shadow_label": ThresholdRow(
        id="coo_shadow_label",
        min_confidence=None,
        min_safety=None,
        router_outcome=None,
        bucket=None,
        notes="COO classify → label only. Log all. No mutate.",
    ),
    "coo_noise_archive": ThresholdRow(
        id="coo_noise_archive",
        min_confidence=NOISE_ARCHIVE_MIN_CONFIDENCE,
        min_safety=NOISE_ARCHIVE_MIN_SAFETY,
        router_outcome="auto",
        bucket=NOISE_ARCHIVE_BUCKET,
        notes="Archive not delete. BOT_EXEC OFF. Other buckets forbidden.",
    ),
    "polaris_df_auto": ThresholdRow(
        id="polaris_df_auto",
        min_confidence=None,
        min_safety=None,
        router_outcome="auto",
        bucket=None,
        notes=(
            "Per DF skill (~0.85 choice default; pack overrides). "
            "Do NOT lift DF bands to COO 0.95. YMYL/claim never auto."
        ),
    ),
    "polaris_df_escalate": ThresholdRow(
        id="polaris_df_escalate",
        min_confidence=None,
        min_safety=None,
        router_outcome="llm_escalate",
        bucket=None,
        notes="Work model via Tempo Layer C only.",
    ),
    "polaris_df_human": ThresholdRow(
        id="polaris_df_human",
        min_confidence=None,
        min_safety=None,
        router_outcome="human",
        bucket=None,
        notes="Always for YMYL/claim packs.",
    ),
}

# Draft SKUs — exact vendor ids TBD. Names match the approved ladder.
TIER_MODELS: dict[str, tuple[str, ...]] = {
    "T0": (PROD_CLASSIFY_MODEL,),
    "T1": ("kimi-k3", "glm-5.3"),
    "T2": ("codex", "claude-code"),
    "T3": ("claude-strong", "chatgpt-strong"),
}

DEFAULT_TIER_MODEL: dict[str, str] = {
    "T0": PROD_CLASSIFY_MODEL,
    "T1": "kimi-k3",
    "T2": "codex",
    "T3": "claude-strong",
}


def thresholds_as_dict() -> dict[str, dict[str, object]]:
    rows: dict[str, dict[str, object]] = {}
    for key, row in THRESHOLDS.items():
        rows[key] = {
            "id": row.id,
            "min_confidence": row.min_confidence,
            "min_safety": row.min_safety,
            "router_outcome": row.router_outcome,
            "bucket": row.bucket,
            "notes": row.notes,
        }
    return rows
