"""tempo-router CLI. Dry-run resolve only. No Typesafe. No ClickUp. BOT_EXEC stays OFF."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any

from tempo_efficiency.audit import default_log_path
from tempo_efficiency.config import (
    BOT_EXEC_ENABLED,
    COST_CAPS,
    MAX_ESCALATE_HOPS,
    PROD_CLASSIFY_MODEL,
    thresholds_as_dict,
)
from tempo_efficiency.gate import resolve_gate
from tempo_efficiency.router import resolve_recommendation


def cmd_resolve(ns: argparse.Namespace) -> int:
    rec = resolve_recommendation(
        bucket=ns.bucket,
        router_outcome=ns.router_outcome,
        decision_id=ns.decision_id,
        hops=ns.hops,
        flags=ns.flag or [],
        pack_id=ns.pack_id,
        ymyl=ns.ymyl,
        claim_pack=ns.claim_pack,
        code_shaped=ns.code_shaped,
        prefer_cheaper=ns.prefer_cheaper,
        phase="dry-run",
    )
    payload = rec.to_dict()
    payload["decision_id"] = ns.decision_id
    payload["bucket"] = ns.bucket
    _emit(payload, Path(ns.output) if ns.output else None)
    return 0


def cmd_gate(ns: argparse.Namespace) -> int:
    resolution = resolve_gate(Path(ns.root))
    payload = {
        "root": str(Path(ns.root).resolve()),
        "gate": resolution.gate,
        "apply_allowed": resolution.apply_allowed,
        "phase": resolution.phase,
        "alert": resolution.alert,
        "bot_exec": BOT_EXEC_ENABLED,
    }
    _emit(payload, Path(ns.output) if ns.output else None)
    return 0


def cmd_thresholds(_ns: argparse.Namespace) -> int:
    payload: dict[str, Any] = {
        "jev_model": PROD_CLASSIFY_MODEL,
        "bot_exec": BOT_EXEC_ENABLED,
        "max_escalate_hops": MAX_ESCALATE_HOPS,
        "cost_caps": COST_CAPS.as_dict(),
        "thresholds": thresholds_as_dict(),
        "default_log": str(default_log_path()),
    }
    print(json.dumps(payload, indent=2))
    return 0


def _emit(payload: dict[str, Any], path: Path | None) -> None:
    text = json.dumps(payload, indent=2)
    if path is not None:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text + "\n", encoding="utf-8")
    print(text)


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="tempo-router",
        description=(
            "Tempo efficiency router. Dry-run resolve of bucket/router_outcome "
            "to a work tier. No Typesafe calls. No ClickUp. BOT_EXEC stays OFF."
        ),
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        default=True,
        help="Always dry-run. There is no live Typesafe path in this CLI.",
    )
    parser.add_argument("--output", "-o", help="Write JSON to this path (also prints)")

    sub = parser.add_subparsers(dest="command", required=True)

    resolve_p = sub.add_parser("resolve", help="Recommend work tier after Layer B")
    resolve_p.add_argument("--output", "-o", help="Write JSON to this path (also prints)")
    resolve_p.add_argument("--bucket", help="COO bucket or DF claim class")
    resolve_p.add_argument(
        "--router-outcome",
        required=True,
        choices=["auto", "llm_escalate", "human"],
        help="Polaris DF outcome. Tempo does not recompute packs.",
    )
    resolve_p.add_argument("--decision-id", help="Stable id for hop accounting")
    resolve_p.add_argument("--hops", type=int, default=None, help="Escalate hops already consumed")
    resolve_p.add_argument("--flag", action="append", help="VAULT_WRITE, YMYL, HANDOFF_SPECIALIST, …")
    resolve_p.add_argument("--pack-id", help="Optional DF pack id (import-only never_auto check)")
    resolve_p.add_argument("--ymyl", action="store_true", help="Force YMYL / claim never-auto")
    resolve_p.add_argument("--claim-pack", action="store_true", help="DF claim pack — never auto")
    resolve_p.add_argument("--code-shaped", action="store_true", help="Prefer T2 Codex/Claude Code")
    resolve_p.add_argument("--prefer-cheaper", action="store_true", help="Ask for T1 unless never-downgrade")
    resolve_p.set_defaults(func=cmd_resolve)

    gate_p = sub.add_parser("gate", help="Read ENABLED.on / ENABLED.off at a root")
    gate_p.add_argument("--output", "-o", help="Write JSON to this path (also prints)")
    gate_p.add_argument("--root", required=True)
    gate_p.set_defaults(func=cmd_gate)

    th = sub.add_parser("thresholds", help="Print joint schema table + $ cap placeholders")
    th.set_defaults(func=cmd_thresholds)
    return parser


def main(argv: list[str] | None = None) -> int:
    if BOT_EXEC_ENABLED:
        print("BOT_EXEC must stay OFF in tool-tempo-efficiency.", file=sys.stderr)
        return 2
    parser = build_parser()
    ns = parser.parse_args(argv)
    return int(ns.func(ns))


if __name__ == "__main__":
    raise SystemExit(main())
