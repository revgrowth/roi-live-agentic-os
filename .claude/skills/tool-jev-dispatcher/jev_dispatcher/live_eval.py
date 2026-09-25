"""Run the dispatcher over the labeled eval set against a live Jev client.

Reads TYPESAFE_API_KEY from the environment. Never prints the key.
Works with Python on Windows and macOS. The PowerShell wrapper is
`scripts/live-eval.ps1`.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any, Iterable

from jev_dispatcher.dispatch import Job, dispatch_job
from jev_dispatcher.live_client import build_live_client, key_is_set, redact
from jev_dispatcher.seats import HUMAN_REVIEW_ID, load_config

TEMPO_REVIEWED = "2026-09-24"
CHATGPT_20X = frozenset(
    {
        "chatgpt-20x-max",
        "chatgpt-20x-max-a",
        "chatgpt-20x-max-b",
        "chatgpt-20x-max-c",
    }
)
CHATGPT_FAMILY = CHATGPT_20X | {"chatgpt-team"}
STANDARD_EXEC = frozenset({"glm-5-3-max", "kimi-k3-max"})
_CANON = {
    "20x": "chatgpt-20x-max",
    "chatgpt-20x": "chatgpt-20x-max",
    "chatgpt-20x-max": "chatgpt-20x-max",
    "chatgpt-team": "chatgpt-team",
    "glm": "glm-5-3-max",
    "glm-5.3": "glm-5-3-max",
    "glm-5-3-max": "glm-5-3-max",
    "kimi": "kimi-k3-max",
    "kimi-k3": "kimi-k3-max",
    "kimi-k3-max": "kimi-k3-max",
    "claude": "claude-team",
    "claude-team": "claude-team",
    "cursor": "cursor-cloud",
    "cursor-cloud": "cursor-cloud",
    "human": "human-review",
    "human-review": "human-review",
}


def canon_seat(value: str) -> str:
    key = str(value).strip().lower()
    if key in _CANON:
        return _CANON[key]
    return key


def expand_label(label: str, *, quality_bar: str) -> set[str]:
    """Map one label to the seats that satisfy it.

    ChatGPT 20X A/B/C and ChatGPT Team are one family.
    GLM 5.3 Max and Kimi K3 Max swap on standard execution.
    """
    token = canon_seat(label)
    if token in CHATGPT_FAMILY:
        return set(CHATGPT_FAMILY)
    if token in STANDARD_EXEC and quality_bar == "execution":
        return set(STANDARD_EXEC)
    if token.startswith("chatgpt-20x-max-"):
        return set(CHATGPT_FAMILY)
    return {token}


def seats_agree(predicted: str | None, ideal: str, *, quality_bar: str = "") -> bool:
    """Strict hit: the primary seat only, after family expansion."""
    return prediction_hits(predicted, [ideal], quality_bar=quality_bar)


def seats_lenient(
    predicted: str | None,
    acceptable: Iterable[str],
    *,
    quality_bar: str = "",
) -> bool:
    """Lenient hit: any seat in the acceptable list, after family expansion."""
    return prediction_hits(predicted, acceptable, quality_bar=quality_bar)


def prediction_hits(
    predicted: str | None,
    labels: Iterable[str],
    *,
    quality_bar: str,
) -> bool:
    if not predicted:
        return False
    pred = canon_seat(predicted)
    pool: set[str] = set()
    for label in labels:
        pool |= expand_label(label, quality_bar=quality_bar)
    return pred in pool


def requires_human_review(row: dict[str, Any]) -> bool:
    """True when human review is the only acceptable seat."""
    acceptable = row.get("acceptable") or [row.get("ideal_seat")]
    pool: set[str] = set()
    quality = str(row.get("quality_bar") or "")
    for label in acceptable:
        pool |= expand_label(str(label), quality_bar=quality)
    return pool == {"human-review"}


def load_jobs(path: Path) -> list[dict[str, Any]]:
    jobs: list[dict[str, Any]] = []
    for line in path.read_text(encoding="utf-8").splitlines():
        text = line.strip()
        if not text:
            continue
        row = json.loads(text)
        job_id = row.get("job_id")
        if row.get("tempo_reviewed") != TEMPO_REVIEWED:
            raise ValueError(f"{job_id}: tempo_reviewed must be {TEMPO_REVIEWED}")
        acceptable = row.get("acceptable")
        if not isinstance(acceptable, list) or not acceptable:
            raise ValueError(f"{job_id}: acceptable must be a non-empty list")
        if "Title: ---" in str(row.get("state") or ""):
            raise ValueError(f"{job_id}: state is missing a real title")
        ideal = canon_seat(str(row["ideal_seat"]))
        if ideal not in {canon_seat(str(item)) for item in acceptable}:
            raise ValueError(f"{job_id}: ideal_seat must be inside acceptable")
        jobs.append(row)
    if not 45 <= len(jobs) <= 50:
        raise ValueError(f"eval set must contain 45 to 50 jobs, found {len(jobs)}")
    return jobs


def run_eval(
    jobs: Iterable[dict[str, Any]],
    *,
    root: Path,
    client: Any,
) -> dict[str, Any]:
    """Dry-run the dispatcher. Does not create ENABLED.on and does not queue."""
    config = load_config()
    rows: list[dict[str, Any]] = []
    for raw in jobs:
        job = Job(
            job_id=str(raw["job_id"]),
            goal=str(raw["goal"]),
            state=str(raw.get("state") or raw.get("evidence") or ""),
            quality_bar=str(raw["quality_bar"]),
            blast_radius=str(raw["blast_radius"]),
            hops=int(raw.get("hops") or 0),
        )
        result = dispatch_job(job, root=root, client=client, config=config)
        ideal = str(raw["ideal_seat"])
        acceptable = [str(item) for item in (raw.get("acceptable") or [ideal])]
        quality = job.quality_bar
        strict = seats_agree(result.seat, ideal, quality_bar=quality)
        lenient = seats_lenient(result.seat, acceptable, quality_bar=quality)
        review_required = requires_human_review(raw)
        rows.append(
            {
                "job_id": job.job_id,
                "ideal_seat": ideal,
                "acceptable": acceptable,
                "predicted_seat": result.seat,
                "strict_agreed": strict,
                "lenient_agreed": lenient,
                "agreed": lenient,
                "requires_human_review": review_required,
                "human_review_hit": review_required and result.seat == HUMAN_REVIEW_ID,
                "confidence": result.confidence,
                "reason": result.reason,
                "ideal_reason": raw.get("ideal_reason"),
                "label_status": raw.get("label_status"),
                "tempo_reviewed": raw.get("tempo_reviewed"),
                "killed": result.killed,
                "handoff_complete": result.handoff_complete,
                "action": result.action,
            }
        )
    compared = len(rows)
    strict_hits = [row for row in rows if row["strict_agreed"]]
    lenient_hits = [row for row in rows if row["lenient_agreed"]]
    strict_misses = [row for row in rows if not row["strict_agreed"]]
    lenient_misses = [row for row in rows if not row["lenient_agreed"]]
    review_rows = [row for row in rows if row["requires_human_review"]]
    review_caught = [row for row in review_rows if row["human_review_hit"]]
    review_n = len(review_rows)
    return {
        "compared": compared,
        "strict_agreed": len(strict_hits),
        "strict_misses": len(strict_misses),
        "strict_agreement_rate": (len(strict_hits) / compared) if compared else 0.0,
        "lenient_agreed": len(lenient_hits),
        "lenient_misses": len(lenient_misses),
        "lenient_agreement_rate": (len(lenient_hits) / compared) if compared else 0.0,
        "agreed": len(lenient_hits),
        "misses": len(lenient_misses),
        "agreement_rate": (len(lenient_hits) / compared) if compared else 0.0,
        "human_review_required": review_n,
        "human_review_caught": len(review_caught),
        "human_review_recall": (len(review_caught) / review_n) if review_n else None,
        "rows": rows,
        "miss_rows": lenient_misses,
        "strict_miss_rows": strict_misses,
        "note": (
            "Tempo reviewed these labels on 2026-09-24. "
            "Strict scores the primary seat. Lenient scores the acceptable list. "
            "This report is not a clearance to create ENABLED.on."
        ),
        "human_review_id": HUMAN_REVIEW_ID,
    }


def render_report(report: dict[str, Any]) -> str:
    recall = report.get("human_review_recall")
    recall_text = "n/a" if recall is None else f"{float(recall):.3f}"
    lines = [
        f"compared: {report['compared']}",
        f"strict_agreed: {report.get('strict_agreed', report.get('agreed'))}",
        f"strict_misses: {report.get('strict_misses', report.get('misses'))}",
        f"strict_agreement_rate: {float(report.get('strict_agreement_rate', report.get('agreement_rate', 0))):.3f}",
        f"lenient_agreed: {report.get('lenient_agreed', report.get('agreed'))}",
        f"lenient_misses: {report.get('lenient_misses', report.get('misses'))}",
        f"lenient_agreement_rate: {float(report.get('lenient_agreement_rate', report.get('agreement_rate', 0))):.3f}",
        f"human_review_required: {report.get('human_review_required', 0)}",
        f"human_review_caught: {report.get('human_review_caught', 0)}",
        f"human_review_recall: {recall_text}",
        "lenient_misses:",
    ]
    for row in report.get("miss_rows") or []:
        lines.append(
            f"- {row['job_id']}: ideal={row['ideal_seat']} predicted={row['predicted_seat']} "
            f"reason={row['reason']} label={row.get('ideal_reason')}"
        )
    if not report.get("miss_rows"):
        lines.append("- none")
    lines.append(str(report.get("note") or ""))
    return redact("\n".join(lines) + "\n")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Live Jev eval for the dispatcher. Dry-run only.")
    parser.add_argument("--jobs", required=True, help="Path to the labeled jobs JSONL")
    parser.add_argument("--root", required=True, help="Runtime root for audit and ledger. Not the repo queues.")
    parser.add_argument("--report", help="Optional path for the JSON report")
    args = parser.parse_args(argv)
    if not key_is_set():
        print("TYPESAFE_API_KEY is not set. Refusing to call TypeSafe.", file=sys.stderr)
        return 2
    client = build_live_client()
    jobs = load_jobs(Path(args.jobs))
    root = Path(args.root)
    report = run_eval(jobs, root=root, client=client)
    text = render_report(report)
    sys.stdout.write(text)
    if args.report:
        report_path = Path(args.report)
        report_path.parent.mkdir(parents=True, exist_ok=True)
        report_path.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
