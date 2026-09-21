"""High-level decide() API used by CLI, pipelines, and Search Command adapters."""

from __future__ import annotations

from typing import Any, Iterable

from polaris_df.client import HttpJevClient, JevClient, questions_for_api
from polaris_df.env import default_model, has_live_credentials, hydrate_process_env
from polaris_df.log import DecisionLog, utc_now
from polaris_df.mock import MockJevClient
from polaris_df.registry import get_pack, load_builtin_packs, resolve_questions
from polaris_df.router import build_routed
from polaris_df.types import DecisionPack, DecisionState, RoutedDecision, ThinStateError, Thresholds


_LOADED = False


def ensure_registry() -> None:
    global _LOADED
    if not _LOADED:
        load_builtin_packs()
        _LOADED = True


def require_evidence(pack: DecisionPack, state: DecisionState) -> None:
    missing = [key for key in pack.required_evidence if _is_missing(state.evidence.get(key))]
    if missing:
        raise ThinStateError(
            f"Pack {pack.id} refused thin state for {state.unit_id}. Missing measured fields: {missing}"
        )


def _is_missing(value: Any) -> bool:
    if value is None:
        return True
    if isinstance(value, str) and not value.strip():
        return True
    if isinstance(value, (list, dict)) and not value:
        return True
    return False


def make_client(*, dry_run: bool, scripted: dict[str, dict[str, Any]] | None = None) -> JevClient:
    hydrate_process_env()
    if dry_run or not has_live_credentials():
        return MockJevClient(scripted=scripted)
    return HttpJevClient()


def decide(
    pack_id: str,
    state: DecisionState,
    *,
    dry_run: bool = False,
    model: str | None = None,
    client: JevClient | None = None,
    log: DecisionLog | None = None,
    thresholds: Thresholds | None = None,
) -> RoutedDecision:
    ensure_registry()
    pack = get_pack(pack_id)
    require_evidence(pack, state)
    resolved = resolve_questions(pack, state.evidence)
    use_mock = dry_run or client.__class__.__name__ == "MockJevClient"
    model_name = model or default_model(dry_run=use_mock or dry_run)
    active_client = client or make_client(dry_run=dry_run)
    payload = questions_for_api(resolved)
    response = active_client.system_one(
        state=state.to_jev_state(),
        questions=payload,
        model=model_name,
    )
    answers = response.get("answers") or {}
    resolved_model = str(response.get("model") or model_name)
    source = "mock" if "mock" in resolved_model or isinstance(active_client, MockJevClient) else "jev"
    decision = build_routed(
        pack=pack,
        answers=answers,
        model=resolved_model,
        source=source,
        decided_at=utc_now(),
        unit_id=state.unit_id,
        usage=response.get("usage"),
        thresholds=thresholds or pack.default_thresholds,
    )
    if log is not None:
        log.write_decision(decision, state=state.to_jev_state())
    return decision


def decide_batch(
    pack_id: str,
    states: Iterable[DecisionState],
    *,
    dry_run: bool = False,
    model: str | None = None,
    client: JevClient | None = None,
    log: DecisionLog | None = None,
) -> list[RoutedDecision]:
    active_client = client or make_client(dry_run=dry_run)
    results: list[RoutedDecision] = []
    for state in states:
        results.append(
            decide(
                pack_id,
                state,
                dry_run=dry_run,
                model=model,
                client=active_client,
                log=log,
            )
        )
    return results
