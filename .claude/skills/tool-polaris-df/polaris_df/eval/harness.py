"""Golden-fixture eval: auto rate, escalate rate, agreement vs labels."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from polaris_df.decide import decide, make_client
from polaris_df.env import has_live_credentials
from polaris_df.packers.search_command import pack_gate_row
from polaris_df.types import DecisionState

FIXTURE_PACKS = {
    "purity": "G3.purity.v1",
    "intent": "KW.intent.v1",
    "serp_shape": "G3.serp_shape.v1",
    "semantic_cannibal": "QA.semantic_cannibal.v1",
}


def default_fixture_dir() -> Path:
    return Path(__file__).resolve().parents[2] / "fixtures"


def load_jsonl(path: Path) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        rows.append(json.loads(line))
    return rows


def _answer_value(answer: dict[str, Any] | None) -> Any:
    if not answer:
        return None
    qtype = answer.get("type")
    if qtype == "choice":
        return answer.get("choice")
    if qtype == "noul":
        return float(answer.get("noul") or 0)
    if qtype == "score":
        return float(answer.get("score") or 0)
    return None


def _noul_agrees(predicted: float, expected: Any) -> bool:
    if isinstance(expected, bool):
        return (predicted >= 0.5) == expected
    if isinstance(expected, str):
        if expected in {"yes", "true", "same"}:
            return predicted >= 0.5
        if expected in {"no", "false", "different"}:
            return predicted < 0.5
    if isinstance(expected, (int, float)):
        return abs(predicted - float(expected)) <= 0.25
    return False


def _agrees(qid: str, answer: dict[str, Any] | None, expected: Any) -> bool:
    if answer is None or expected is None:
        return False
    qtype = answer.get("type")
    if qtype == "choice":
        return str(answer.get("choice")) == str(expected)
    if qtype == "noul":
        return _noul_agrees(float(answer.get("noul") or 0), expected)
    if qtype == "score":
        return abs(float(answer.get("score") or 0) - float(expected)) <= 1.0
    return False


def evaluate_fixture(
    path: Path,
    *,
    pack_id: str,
    dry_run: bool = True,
    model: str | None = None,
) -> dict[str, Any]:
    rows = load_jsonl(path)
    client = make_client(dry_run=dry_run)
    source = "mock" if dry_run or not has_live_credentials() else "jev"
    total = 0
    labeled = 0
    agreed = 0
    routes = {"auto": 0, "llm_escalate": 0, "human": 0}
    details: list[dict[str, Any]] = []

    for row in rows:
        labels = row.get("labels") or {}
        evidence = {k: v for k, v in row.items() if k not in {"labels", "id", "gate"}}
        unit_id = str(row.get("id") or row.get("query") or row.get("query_a") or path.stem)
        state = DecisionState(
            unit_id=unit_id,
            gate=pack_id,
            evidence=evidence,
            context=row.get("context"),
        )
        # Prefer generic packer so required fields from the fixture stay intact.
        try:
            state = pack_gate_row(pack_id, {**evidence, "unit_id": unit_id}, row.get("context"))
        except Exception:
            pass
        decision = decide(pack_id, state, dry_run=dry_run, model=model, client=client)
        total += 1
        routes[decision.route] = routes.get(decision.route, 0) + 1
        row_agree = True
        compared = 0
        for qid, expected in labels.items():
            compared += 1
            ok = _agrees(qid, decision.answers.get(qid), expected)
            row_agree = row_agree and ok
        if compared:
            labeled += 1
            if row_agree:
                agreed += 1
        details.append(
            {
                "id": unit_id,
                "route": decision.route,
                "answers": {k: _answer_value(v) for k, v in decision.answers.items()},
                "labels": labels,
                "agree": row_agree if compared else None,
            }
        )

    agreement = (agreed / labeled) if labeled else None
    return {
        "fixture": str(path),
        "pack_id": pack_id,
        "source": source,
        "n": total,
        "labeled": labeled,
        "agreed": agreed,
        "agreement": agreement,
        "auto_rate": routes["auto"] / total if total else 0.0,
        "escalate_rate": routes["llm_escalate"] / total if total else 0.0,
        "human_rate": routes["human"] / total if total else 0.0,
        "routes": routes,
        "details": details,
    }


def evaluate_all(
    fixture_dir: Path | None = None,
    *,
    dry_run: bool = True,
    model: str | None = None,
) -> dict[str, Any]:
    root = fixture_dir or default_fixture_dir()
    reports = []
    for name, pack_id in FIXTURE_PACKS.items():
        path = root / f"{name}.jsonl"
        if not path.is_file():
            continue
        reports.append(evaluate_fixture(path, pack_id=pack_id, dry_run=dry_run, model=model))
    labeled = sum(r["labeled"] for r in reports)
    agreed = sum(r["agreed"] for r in reports)
    n = sum(r["n"] for r in reports)
    auto = sum(r["routes"]["auto"] for r in reports)
    escalate = sum(r["routes"]["llm_escalate"] for r in reports)
    human = sum(r["routes"]["human"] for r in reports)
    return {
        "source": "mock" if dry_run or not has_live_credentials() else "jev",
        "n": n,
        "labeled": labeled,
        "agreement": (agreed / labeled) if labeled else None,
        "auto_rate": auto / n if n else 0.0,
        "escalate_rate": escalate / n if n else 0.0,
        "human_rate": human / n if n else 0.0,
        "fixtures": [
            {
                "pack_id": r["pack_id"],
                "n": r["n"],
                "agreement": r["agreement"],
                "auto_rate": r["auto_rate"],
                "escalate_rate": r["escalate_rate"],
                "human_rate": r["human_rate"],
            }
            for r in reports
        ],
        "reports": reports,
    }
