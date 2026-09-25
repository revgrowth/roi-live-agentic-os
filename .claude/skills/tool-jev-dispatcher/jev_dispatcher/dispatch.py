"""Decide a seat with pinned Jev and write one JSON handoff. Never executes the job."""

from __future__ import annotations

import hashlib
import json
import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Protocol

from tempo_efficiency.audit import AuditWriter
from tempo_efficiency.config import BOT_EXEC_ENABLED, MAX_ESCALATE_HOPS, PROD_CLASSIFY_MODEL
from tempo_efficiency.gate import resolve_gate
from tempo_efficiency.kill import apply_kill

from jev_dispatcher.completion import confirm_handoff
from jev_dispatcher.dedup import already_queued, remember_queued
from jev_dispatcher.ledger import append_ledger, parse_usage
from jev_dispatcher.questions import build_questions
from jev_dispatcher.safety import refuse_mutation
from jev_dispatcher.seats import (
    HUMAN_REVIEW_ID,
    DispatcherConfig,
    Seat,
    apply_capacity,
    build_menu,
    is_grok,
    load_capacity_overlay,
    load_config,
    load_rotation_cursor,
    menu_criteria,
    save_rotation_cursor,
    tempo_context,
)

_SAFE_ID = re.compile(r"[^A-Za-z0-9._-]+")


class JevClient(Protocol):
    def system_one(
        self,
        *,
        state: Any,
        questions: dict[str, dict[str, Any]],
        model: str,
    ) -> dict[str, Any]:
        ...


@dataclass
class Job:
    goal: str
    state: str
    quality_bar: str
    blast_radius: str
    job_id: str | None = None
    hops: int = 0

    def resolved_id(self) -> str:
        if self.job_id and self.job_id.strip():
            return _safe_id(self.job_id.strip())
        blob = json.dumps(
            {
                "goal": self.goal,
                "state": self.state,
                "quality_bar": self.quality_bar,
                "blast_radius": self.blast_radius,
            },
            sort_keys=True,
        )
        return hashlib.sha256(blob.encode("utf-8")).hexdigest()[:20]


@dataclass
class DispatchResult:
    job_id: str
    action: str
    seat: str | None
    confidence: float | None
    reason: str
    phase: str
    handoff_complete: bool
    handoff_path: str | None = None
    killed: bool = False
    jev_model: str | None = None
    answers: dict[str, Any] = field(default_factory=dict)
    menu: list[str] = field(default_factory=list)

    @property
    def executed(self) -> bool:
        return False


def dispatch_job(
    job: Job,
    *,
    root: Path | str,
    client: JevClient | None = None,
    config: DispatcherConfig | None = None,
    capacity: dict[str, str] | None = None,
) -> DispatchResult:
    """Label one job. Write a queue file only when ENABLED.on is present and the write checks out."""
    base = Path(root)
    base.mkdir(parents=True, exist_ok=True)
    gate = resolve_gate(base)
    phase = gate.phase
    active = config or load_config()
    if capacity is None:
        capacity = load_capacity_overlay(base)
    active = apply_capacity(active, capacity)
    job_id = job.resolved_id()
    cursor = load_rotation_cursor(base, "chatgpt-20x-max")
    menu = build_menu(active, rotation_cursor=cursor)
    menu_ids = [seat.id for seat in menu]

    if phase == "apply":
        prior = already_queued(base, job_id)
        if prior is not None:
            prior_seat = str(prior.get("seat") or "")
            prior_path = str(prior.get("path") or "") or None
            already = bool(prior_path) and confirm_handoff(prior_path, job_id, prior_seat)
            return _finish(
                base,
                job_id=job_id,
                action="dedup_skip",
                seat=prior_seat,
                confidence=None,
                reason="already_queued",
                phase=phase,
                handoff_complete=already,
                handoff_path=prior_path,
                gate=gate.gate,
                menu=menu_ids,
                jev_model=None,
                answers={},
            )

    if not menu_ids:
        return _queue_or_label(
            base,
            job=job,
            job_id=job_id,
            seat_id=HUMAN_REVIEW_ID,
            seat=active.seat_by_id(HUMAN_REVIEW_ID),
            confidence=None,
            reason="empty_menu",
            phase=phase,
            answers={},
            model=None,
            menu_ids=menu_ids,
            hops=job.hops,
            gate=gate.gate,
            active=active,
        )

    if client is None:
        return _finish(
            base,
            job_id=job_id,
            action="skipped_no_client",
            seat=None,
            confidence=None,
            reason="no_jev_client",
            phase=phase,
            handoff_complete=False,
            gate=gate.gate,
            menu=menu_ids,
            jev_model=None,
            answers={},
        )

    questions = build_questions(menu_criteria(menu))
    state = _jev_state(job)
    try:
        response = client.system_one(state=state, questions=questions, model=PROD_CLASSIFY_MODEL)
    except Exception as exc:  # noqa: BLE001 — fail closed, never echo a key
        return _finish(
            base,
            job_id=job_id,
            action="jev_error",
            seat=None,
            confidence=None,
            reason=f"jev_error:{type(exc).__name__}",
            phase=phase,
            handoff_complete=False,
            gate=gate.gate,
            menu=menu_ids,
            jev_model=None,
            answers={},
            error=type(exc).__name__,
        )

    if not isinstance(response, dict):
        response = {}
    resolved_model = str(response.get("model") or "")
    answers = response.get("answers") if isinstance(response.get("answers"), dict) else {}
    input_tokens, output_tokens = parse_usage(response.get("usage"))

    if resolved_model != PROD_CLASSIFY_MODEL:
        reason = f"K8:classify_model_drift:{resolved_model or 'missing'}"
        kill = apply_kill(base, reason=reason, decision_id=job_id)
        append_ledger(
            base,
            decision_id=job_id,
            seat="killed",
            model=resolved_model or "missing",
            input_tokens=input_tokens,
            output_tokens=output_tokens,
            phase=phase,
        )
        return _finish(
            base,
            job_id=job_id,
            action="kill",
            seat=None,
            confidence=None,
            reason=reason,
            phase=phase,
            handoff_complete=False,
            killed=True,
            gate=gate.gate,
            menu=menu_ids,
            jev_model=resolved_model or None,
            answers=answers,
            kill_reason=reason,
            kill_path=kill.get("kill_md"),
            input_tokens=input_tokens,
            output_tokens=output_tokens,
        )

    seat_id, confidence, reason = _choose_seat(
        answers,
        menu_ids=menu_ids,
        threshold=active.confidence_threshold,
        risk_threshold=active.risk_noul_threshold,
        blast_radius=job.blast_radius,
        hops=job.hops,
    )
    if is_grok(seat_id):
        seat_id = HUMAN_REVIEW_ID
        reason = "grok_blocked"

    append_ledger(
        base,
        decision_id=job_id,
        seat=seat_id,
        model=resolved_model,
        input_tokens=input_tokens,
        output_tokens=output_tokens,
        phase=phase,
    )

    return _queue_or_label(
        base,
        job=job,
        job_id=job_id,
        seat_id=seat_id,
        seat=active.seat_by_id(seat_id),
        confidence=confidence,
        reason=reason,
        phase=phase,
        answers=answers,
        model=resolved_model,
        menu_ids=menu_ids,
        hops=job.hops,
        gate=gate.gate,
        active=active,
        input_tokens=input_tokens,
        output_tokens=output_tokens,
    )


def _queue_or_label(
    base: Path,
    *,
    job: Job,
    job_id: str,
    seat_id: str,
    seat: Seat | None,
    confidence: float | None,
    reason: str,
    phase: str,
    answers: dict[str, Any],
    model: str | None,
    menu_ids: list[str],
    hops: int,
    gate: str,
    active: DispatcherConfig,
    input_tokens: int | None = None,
    output_tokens: int | None = None,
) -> DispatchResult:
    if is_grok(seat_id):
        seat_id = HUMAN_REVIEW_ID
        seat = active.seat_by_id(HUMAN_REVIEW_ID)
        reason = "grok_blocked"
    handoff = _handoff_payload(
        job=job,
        job_id=job_id,
        seat_id=seat_id,
        seat=seat,
        confidence=confidence,
        reason=reason,
        phase=phase,
        answers=answers,
        model=model or "",
        menu_ids=menu_ids,
        hops=hops,
    )
    handoff_path: str | None = None
    complete = False
    action = "dry_run_label"
    if phase == "apply":
        path, complete = _write_handoff(base, handoff)
        handoff_path = str(path)
        action = "queue_handoff"
        if complete:
            remember_queued(base, job_id, seat=seat_id, path=str(path))
            chosen = active.seat_by_id(seat_id)
            if chosen and chosen.rotate_group:
                save_rotation_cursor(base, chosen.rotate_group, chosen.id)
    return _finish(
        base,
        job_id=job_id,
        action=action,
        seat=seat_id,
        confidence=confidence,
        reason=reason,
        phase=phase,
        handoff_complete=complete,
        handoff_path=handoff_path,
        gate=gate,
        menu=menu_ids,
        jev_model=model,
        answers=answers,
        input_tokens=input_tokens,
        output_tokens=output_tokens,
    )


def _choose_seat(
    answers: dict[str, Any],
    *,
    menu_ids: list[str],
    threshold: float,
    risk_threshold: float,
    blast_radius: str,
    hops: int,
) -> tuple[str, float, str]:
    destination = answers.get("destination") if isinstance(answers.get("destination"), dict) else {}
    choice = str(destination.get("choice") or "")
    try:
        confidence = float(destination.get("confidence"))
    except (TypeError, ValueError):
        confidence = 0.0
    risk_answer = answers.get("needs_human_or_publish_risk")
    risk_answer = risk_answer if isinstance(risk_answer, dict) else {}
    try:
        risk = float(risk_answer.get("noul"))
    except (TypeError, ValueError):
        risk = 1.0

    if hops >= MAX_ESCALATE_HOPS:
        return HUMAN_REVIEW_ID, confidence, f"hop_limit:{MAX_ESCALATE_HOPS}"
    if str(blast_radius).strip().lower() == "ymyl-adjacent":
        return HUMAN_REVIEW_ID, confidence, "blast_radius:ymyl-adjacent"
    if risk >= risk_threshold:
        return HUMAN_REVIEW_ID, confidence, "needs_human_or_publish_risk"
    if confidence < threshold:
        return HUMAN_REVIEW_ID, confidence, f"low_confidence:{confidence:.3f}<{threshold:.3f}"
    if not choice or choice not in menu_ids or is_grok(choice):
        return HUMAN_REVIEW_ID, confidence, "choice_not_in_menu"
    return choice, confidence, "jev_choice"


def _jev_state(job: Job) -> dict[str, Any]:
    return {
        "goal": job.goal,
        "evidence": job.state,
        "quality_bar": job.quality_bar,
        "blast_radius": job.blast_radius,
        "tempo": tempo_context(),
        "routing_notes": (
            "Strategy goes to ChatGPT 20X or Claude. "
            "Hard or high-stakes execution goes to Claude Opus-class or ChatGPT Sol-class. "
            "Standard execution goes to GLM or Kimi. Code goes to Cursor. "
            "Grok Heavy is coordinator only and is not a destination."
        ),
    }


def _handoff_payload(
    *,
    job: Job,
    job_id: str,
    seat_id: str,
    seat: Seat | None,
    confidence: float | None,
    reason: str,
    phase: str,
    answers: dict[str, Any],
    model: str,
    menu_ids: list[str],
    hops: int,
) -> dict[str, Any]:
    tempo = tempo_context()
    return {
        "job_id": job_id,
        "request": {
            "goal": job.goal,
            "state": job.state,
            "quality_bar": job.quality_bar,
            "blast_radius": job.blast_radius,
            "hops": hops,
        },
        "jev": {
            "model": model,
            "answers": answers,
        },
        "confidence": confidence,
        "seat": seat_id,
        "seat_label": seat.display_name if seat else seat_id,
        "tempo_tier": seat.tempo_tier if seat else None,
        "reason": reason,
        "menu": menu_ids,
        "phase": phase,
        "handoff_complete": False,
        "label_only": True,
        "executed": False,
        "bot_exec": BOT_EXEC_ENABLED,
        "hop_limit": tempo["hop_limit"],
        "escalate_hops": hops,
        "cost_caps": tempo["cost_caps_usd"],
    }


def _write_handoff(root: Path, payload: dict[str, Any]) -> tuple[Path, bool]:
    seat = str(payload["seat"])
    job_id = str(payload["job_id"])
    path = root / "queues" / seat / f"{job_id}.json"
    path.parent.mkdir(parents=True, exist_ok=True)
    _atomic_write(path, payload)
    complete = confirm_handoff(path, job_id, seat)
    if complete:
        payload["handoff_complete"] = True
        _atomic_write(path, payload)
        complete = confirm_handoff(path, job_id, seat)
    return path, complete


def _atomic_write(path: Path, payload: dict[str, Any]) -> None:
    temporary = path.with_suffix(".json.tmp")
    temporary.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    temporary.replace(path)


def _finish(
    root: Path,
    *,
    job_id: str,
    action: str,
    seat: str | None,
    confidence: float | None,
    reason: str,
    phase: str,
    handoff_complete: bool,
    gate: str,
    menu: list[str],
    jev_model: str | None,
    answers: dict[str, Any],
    handoff_path: str | None = None,
    killed: bool = False,
    kill_reason: str | None = None,
    kill_path: str | None = None,
    error: str | None = None,
    input_tokens: int | None = None,
    output_tokens: int | None = None,
) -> DispatchResult:
    action = refuse_mutation(action)
    # Completion is the boolean from the file check. Never copy it from confidence.
    outcome = _route_for(action, seat)
    record = {
        "lane": "jev_dispatcher",
        "decision_id": job_id,
        "item_id": job_id,
        "phase": phase,
        "action": action,
        "would_action": "queue_handoff" if phase != "apply" else action,
        "result": "killed" if killed else ("ok" if action != "jev_error" else "error"),
        "gate": gate,
        "operator_or_bot": "jev-dispatcher",
        "jev_model": jev_model,
        "confidence": confidence,
        "bucket_confidence": confidence,
        "route": outcome,
        "router_outcome": outcome,
        "work_model": seat,
        "work_tier": None,
        "miss": bool(killed),
        "kill_reason": kill_reason,
        "error": error,
        "bot_exec": BOT_EXEC_ENABLED,
        "handoff_complete": handoff_complete,
        "handoff_path": handoff_path,
        "kill_path": kill_path,
        "menu": menu,
        "reason": reason,
        "input_tokens": input_tokens,
        "output_tokens": output_tokens,
        "classify_used": jev_model is not None,
    }
    with AuditWriter(root / "out" / "audit.jsonl") as writer:
        writer.write(record)
    return DispatchResult(
        job_id=job_id,
        action=action,
        seat=seat,
        confidence=confidence,
        reason=reason,
        phase=phase,
        handoff_complete=handoff_complete,
        handoff_path=handoff_path,
        killed=killed,
        jev_model=jev_model,
        answers=answers,
        menu=menu,
    )


def _route_for(action: str, seat: str | None) -> str:
    if action in {"kill", "jev_error", "skipped_no_client", "dedup_skip"}:
        return "human" if seat in {None, "", HUMAN_REVIEW_ID} else "llm_escalate"
    if seat == HUMAN_REVIEW_ID or not seat:
        return "human"
    return "llm_escalate"


def _safe_id(value: str) -> str:
    cleaned = _SAFE_ID.sub("-", value).strip("-")
    return cleaned[:120] or "job"
