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

CHATGPT_20X_FAMILY = "chatgpt-20x-max"


def seats_agree(predicted: str | None, ideal: str) -> bool:
    """Family match for the rotating ChatGPT 20X seats. Exact match otherwise."""
    if not predicted:
        return False
    if ideal == CHATGPT_20X_FAMILY and predicted.startswith(f"{CHATGPT_20X_FAMILY}-"):
        return True
    if ideal == predicted:
        return True
    return False


def load_jobs(path: Path) -> list[dict[str, Any]]:
    jobs: list[dict[str, Any]] = []
    for line in path.read_text(encoding="utf-8").splitlines():
        text = line.strip()
        if not text:
            continue
        row = json.loads(text)
        if row.get("tempo_review_required") is not True:
            raise ValueError(f"{row.get('job_id')}: eval labels must set tempo_review_required true")
        jobs.append(row)
    if not 30 <= len(jobs) <= 50:
        raise ValueError(f"eval set must contain 30 to 50 jobs, found {len(jobs)}")
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
        agreed = seats_agree(result.seat, ideal)
        rows.append(
            {
                "job_id": job.job_id,
                "ideal_seat": ideal,
                "predicted_seat": result.seat,
                "agreed": agreed,
                "confidence": result.confidence,
                "reason": result.reason,
                "ideal_reason": raw.get("ideal_reason"),
                "label_status": raw.get("label_status"),
                "killed": result.killed,
                "handoff_complete": result.handoff_complete,
                "action": result.action,
            }
        )
    misses = [row for row in rows if not row["agreed"]]
    compared = len(rows)
    agreed_n = compared - len(misses)
    return {
        "compared": compared,
        "agreed": agreed_n,
        "misses": len(misses),
        "agreement_rate": (agreed_n / compared) if compared else 0.0,
        "rows": rows,
        "miss_rows": misses,
        "note": "Labels need Tempo review. This report is not a clearance to create ENABLED.on.",
        "human_review_id": HUMAN_REVIEW_ID,
    }


def render_report(report: dict[str, Any]) -> str:
    lines = [
        f"compared: {report['compared']}",
        f"agreed: {report['agreed']}",
        f"misses: {report['misses']}",
        f"agreement_rate: {report['agreement_rate']:.3f}",
        "misses:",
    ]
    for row in report["miss_rows"]:
        lines.append(
            f"- {row['job_id']}: ideal={row['ideal_seat']} predicted={row['predicted_seat']} "
            f"reason={row['reason']} label={row.get('ideal_reason')}"
        )
    if not report["miss_rows"]:
        lines.append("- none")
    lines.append(report["note"])
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
