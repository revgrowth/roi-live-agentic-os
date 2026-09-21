"""Shared confidence mapping. Do not invent a DF safety score.

COO keeps bucket_confidence. DF choice/score uses min(confidence);
noul uses |p-0.5|*2 (import polaris_df.router.noul_extremity when present).
Numeric auto bands stay lane-local: COO 0.95 vs DF ~0.85 is intentional.
"""

from __future__ import annotations

from typing import Any

from tempo_efficiency.config import NOISE_ARCHIVE_MIN_CONFIDENCE, NOISE_ARCHIVE_MIN_SAFETY


# Documented DF defaults from polaris_df.types.Thresholds — informational only.
# Tempo must not lift DF auto to COO 0.95 or restated pack bands.
DF_CHOICE_AUTO = 0.85
DF_CHOICE_HUMAN = 0.55


def noul_extremity(value: float) -> float:
    """Import DF extremity when available; local fallback matches polaris_df.router."""
    try:
        from polaris_df.router import noul_extremity as df_noul_extremity  # type: ignore

        return float(df_noul_extremity(value))
    except ImportError:
        return abs(float(value) - 0.5) * 2.0


def shared_confidence_from_df_answers(answers: dict[str, Any] | None) -> float | None:
    """Map DF answers to the joint-schema `confidence` field.

    choice / score → min of relevant confidences
    noul → |p-0.5|*2
    Mixed → min of the mapped values (weakest signal).
    """
    if not answers:
        return None
    mapped: list[float] = []
    for answer in answers.values():
        if not isinstance(answer, dict):
            continue
        qtype = answer.get("type")
        if qtype in {"choice", "score"} and answer.get("confidence") is not None:
            mapped.append(float(answer["confidence"]))
        elif qtype == "noul":
            mapped.append(noul_extremity(float(answer.get("noul") or 0.5)))
    if not mapped:
        return None
    return min(mapped)


def shared_confidence(*, lane: str | None = None, record: dict[str, Any] | None = None, answers: dict[str, Any] | None = None) -> float | None:
    """Resolve shared confidence. COO aliases bucket_confidence; DF uses answers."""
    rec = record or {}
    if rec.get("bucket_confidence") is not None:
        return float(rec["bucket_confidence"])
    if rec.get("confidence") is not None:
        return float(rec["confidence"])
    if answers or rec.get("answers"):
        return shared_confidence_from_df_answers(answers or rec.get("answers"))
    return None


def invent_df_safety(_record: dict[str, Any] | None = None) -> None:
    """DF has no safety score. Always None — do not synthesize one."""
    return None


def bands_are_lane_local() -> dict[str, object]:
    return {
        "coo_noise_archive_min_confidence": NOISE_ARCHIVE_MIN_CONFIDENCE,
        "coo_noise_archive_min_safety": NOISE_ARCHIVE_MIN_SAFETY,
        "df_choice_auto": DF_CHOICE_AUTO,
        "df_choice_human": DF_CHOICE_HUMAN,
        "unify_numeric_auto_bands": False,
        "notes": "COO 0.95 vs DF ~0.85 coexistence is intentional — different blast radius.",
    }
