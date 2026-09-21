"""polaris-df CLI. Mock / --dry-run is the default when TYPESAFE_API_KEY is absent."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from polaris_df.adapters.search_command import (
    apply_purity_to_demand_library,
    classify_serp_shape,
    pick_response_unit,
    verify_semantic_cannibal,
)
from polaris_df.decide import decide, decide_batch, ensure_registry
from polaris_df.env import has_live_credentials, hydrate_process_env
from polaris_df.eval.harness import evaluate_all, evaluate_fixture
from polaris_df.io import dump_json, load_records
from polaris_df.log import DecisionLog, default_log_path
from polaris_df.packers.search_command import pack_gate_row
from polaris_df.pipelines import audit_triage, keyword_triage, qa_content
from polaris_df.registry import iter_pack_summaries
from polaris_df.types import ThinStateError


def _dry_run_flag(ns: argparse.Namespace) -> bool:
    if getattr(ns, "live", False):
        return False
    if getattr(ns, "dry_run", False):
        return True
    return not has_live_credentials()


def _log_for(ns: argparse.Namespace) -> DecisionLog:
    if getattr(ns, "no_log", False):
        return DecisionLog(None)
    path = Path(ns.log) if getattr(ns, "log", None) else default_log_path()
    return DecisionLog(path)


def cmd_packs(_ns: argparse.Namespace) -> int:
    ensure_registry()
    print(json.dumps(list(iter_pack_summaries()), indent=2))
    return 0


def cmd_decide(ns: argparse.Namespace) -> int:
    hydrate_process_env()
    dry_run = _dry_run_flag(ns)
    payload = json.loads(Path(ns.state).read_text(encoding="utf-8"))
    if not isinstance(payload, dict):
        raise SystemExit("--state must be a JSON object")
    state = pack_gate_row(ns.pack, payload)
    with _log_for(ns) as log:
        decision = decide(ns.pack, state, dry_run=dry_run, model=ns.model, log=log)
    print(dump_json(Path(ns.output) if ns.output else None, decision.to_dict()))
    return 0


def cmd_batch(ns: argparse.Namespace) -> int:
    hydrate_process_env()
    dry_run = _dry_run_flag(ns)
    rows = load_records(Path(ns.inputs))
    states = [pack_gate_row(ns.pack, row) for row in rows]
    with _log_for(ns) as log:
        decisions = decide_batch(ns.pack, states, dry_run=dry_run, model=ns.model, log=log)
    payload = [d.to_dict() for d in decisions]
    print(dump_json(Path(ns.output) if ns.output else None, payload))
    return 0


def cmd_audit_triage(ns: argparse.Namespace) -> int:
    hydrate_process_env()
    rows = load_records(Path(ns.inputs))
    result = audit_triage.triage_rows(rows, dry_run=_dry_run_flag(ns), model=ns.model)
    print(dump_json(Path(ns.output) if ns.output else None, result))
    return 0


def cmd_keyword_triage(ns: argparse.Namespace) -> int:
    hydrate_process_env()
    rows = load_records(Path(ns.inputs))
    result = keyword_triage.triage_rows(rows, dry_run=_dry_run_flag(ns), model=ns.model)
    print(dump_json(Path(ns.output) if ns.output else None, result))
    return 0


def cmd_qa_content(ns: argparse.Namespace) -> int:
    hydrate_process_env()
    rows = load_records(Path(ns.inputs))
    result = qa_content.triage_rows(rows, dry_run=_dry_run_flag(ns), model=ns.model)
    print(dump_json(Path(ns.output) if ns.output else None, result))
    return 0


def cmd_search_command(ns: argparse.Namespace) -> int:
    hydrate_process_env()
    dry_run = _dry_run_flag(ns)
    rows = load_records(Path(ns.inputs))
    gate = ns.gate
    if gate == "purity":
        result = apply_purity_to_demand_library(rows, dry_run=dry_run, model=ns.model)
    elif gate == "serp_shape":
        result = [classify_serp_shape(row, dry_run=dry_run, model=ns.model) for row in rows]
    elif gate == "response_unit":
        result = [pick_response_unit(row, dry_run=dry_run, model=ns.model) for row in rows]
    elif gate == "semantic_cannibal":
        result = [verify_semantic_cannibal(row, dry_run=dry_run, model=ns.model) for row in rows]
    else:
        raise SystemExit(f"Unknown Search Command gate: {gate}")
    print(dump_json(Path(ns.output) if ns.output else None, result))
    return 0


def cmd_eval(ns: argparse.Namespace) -> int:
    hydrate_process_env()
    dry_run = _dry_run_flag(ns)
    if ns.fixture:
        pack_id = ns.pack
        if not pack_id:
            raise SystemExit("--pack is required with --fixture")
        report = evaluate_fixture(Path(ns.fixture), pack_id=pack_id, dry_run=dry_run, model=ns.model)
    else:
        report = evaluate_all(Path(ns.fixtures) if ns.fixtures else None, dry_run=dry_run, model=ns.model)
    print(dump_json(Path(ns.output) if ns.output else None, report))
    if ns.fail_under is not None and report.get("agreement") is not None:
        if float(report["agreement"]) < float(ns.fail_under):
            return 2
    return 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="polaris-df",
        description="Polaris Decision Fabric. Typed Jev judgments. No prose generation.",
    )
    parser.add_argument("--dry-run", action="store_true", help="Force mock Jev (CI default).")
    parser.add_argument("--live", action="store_true", help="Require live Jev (fails without key).")
    parser.add_argument("--model", help="Jev model pin, e.g. jev-1.13.0")
    parser.add_argument("--log", help="JSONL decision log path")
    parser.add_argument("--no-log", action="store_true", help="Do not write a decision log")
    parser.add_argument("--output", "-o", help="Write JSON to this path (also prints)")

    sub = parser.add_subparsers(dest="command", required=True)

    packs = sub.add_parser("packs", help="List registered decision packs")
    packs.set_defaults(func=cmd_packs)

    decide_p = sub.add_parser("decide", help="Run one pack against one state file")
    decide_p.add_argument("--pack", required=True)
    decide_p.add_argument("--state", required=True)
    decide_p.set_defaults(func=cmd_decide)

    batch = sub.add_parser("batch", help="Run one pack against a JSON/JSONL of states")
    batch.add_argument("--pack", required=True)
    batch.add_argument("--inputs", required=True)
    batch.set_defaults(func=cmd_batch)

    audit = sub.add_parser("audit-triage", help="Prioritize crawl/issue/finding rows")
    audit.add_argument("--inputs", required=True)
    audit.set_defaults(func=cmd_audit_triage)

    kw = sub.add_parser("keyword-triage", help="Keep/drop, intent, AEO/GEO fitness")
    kw.add_argument("--inputs", required=True)
    kw.set_defaults(func=cmd_keyword_triage)

    qa = sub.add_parser("qa-content", help="Brief / publish / internal-link soft QA")
    qa.add_argument("--inputs", required=True)
    qa.set_defaults(func=cmd_qa_content)

    sc = sub.add_parser("search-command", help="Search Command soft-gate wrappers")
    sc.add_argument("--gate", required=True, choices=["purity", "serp_shape", "response_unit", "semantic_cannibal"])
    sc.add_argument("--inputs", required=True)
    sc.set_defaults(func=cmd_search_command)

    ev = sub.add_parser("eval", help="Run golden fixtures")
    ev.add_argument("--fixtures", help="Directory of named JSONL fixtures")
    ev.add_argument("--fixture", help="Single JSONL fixture")
    ev.add_argument("--pack", help="Pack id when using --fixture")
    ev.add_argument("--fail-under", type=float, default=None, help="Exit 2 if agreement is below this")
    ev.set_defaults(func=cmd_eval)
    return parser


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    ns = parser.parse_args(argv)
    if getattr(ns, "live", False) and not has_live_credentials():
        print("TYPESAFE_API_KEY is not set; refusing --live. Use --dry-run.", file=sys.stderr)
        return 1
    try:
        return int(ns.func(ns))
    except ThinStateError as exc:
        print(str(exc), file=sys.stderr)
        return 3


if __name__ == "__main__":
    raise SystemExit(main())
