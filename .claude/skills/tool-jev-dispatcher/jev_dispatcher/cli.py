"""CLI for one job. Dry-run unless ENABLED.on exists. No send flag exists."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from jev_dispatcher.dispatch import Job, dispatch_job
from jev_dispatcher.live_client import build_live_client, key_is_set
from tempo_efficiency.gate import resolve_gate


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Label a job and, only if ENABLED.on exists, queue a handoff.")
    parser.add_argument("--root", required=True, help="Automation root. Gate, audit, ledger, and queues live here.")
    parser.add_argument("--job", help="JSON file with goal, state, quality_bar, blast_radius, optional job_id")
    parser.add_argument("--goal")
    parser.add_argument("--state", default="")
    parser.add_argument("--quality-bar", dest="quality_bar")
    parser.add_argument("--blast-radius", dest="blast_radius")
    parser.add_argument("--job-id", dest="job_id")
    parser.add_argument("--hops", type=int, default=0)
    args = parser.parse_args(argv)

    if args.job:
        raw = json.loads(Path(args.job).read_text(encoding="utf-8"))
        job = Job(
            goal=str(raw["goal"]),
            state=str(raw.get("state") or raw.get("evidence") or ""),
            quality_bar=str(raw["quality_bar"]),
            blast_radius=str(raw["blast_radius"]),
            job_id=raw.get("job_id") or args.job_id,
            hops=int(raw.get("hops") or args.hops),
        )
    else:
        if not args.goal or not args.quality_bar or not args.blast_radius:
            print("Provide --job or --goal, --quality-bar, and --blast-radius.", file=sys.stderr)
            return 2
        job = Job(
            goal=args.goal,
            state=args.state,
            quality_bar=args.quality_bar,
            blast_radius=args.blast_radius,
            job_id=args.job_id,
            hops=args.hops,
        )

    root = Path(args.root)
    gate = resolve_gate(root)
    client = None
    if key_is_set():
        client = build_live_client()
    elif gate.apply_allowed:
        print("ENABLED.on is present but TYPESAFE_API_KEY is not set. Nothing was queued.", file=sys.stderr)
        return 2
    result = dispatch_job(job, root=root, client=client)
    summary = {
        "job_id": result.job_id,
        "action": result.action,
        "seat": result.seat,
        "confidence": result.confidence,
        "reason": result.reason,
        "phase": result.phase,
        "handoff_complete": result.handoff_complete,
        "handoff_path": result.handoff_path,
        "killed": result.killed,
        "executed": result.executed,
        "jev_model": result.jev_model,
    }
    sys.stdout.write(json.dumps(summary, indent=2) + "\n")
    return 1 if result.killed else 0
