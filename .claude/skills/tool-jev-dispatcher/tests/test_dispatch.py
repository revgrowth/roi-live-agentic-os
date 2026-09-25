"""Dispatcher safety pins. The TypeSafe client is mocked. No live key required."""

from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from tempo_efficiency.config import MAX_ESCALATE_HOPS, PROD_CLASSIFY_MODEL, TIER_MODELS

from jev_dispatcher.completion import confirm_handoff
from jev_dispatcher.dispatch import Job, dispatch_job
from jev_dispatcher.pricing import usd_for_tokens
from jev_dispatcher.seats import (
    DispatcherConfig,
    Seat,
    build_menu,
    load_config,
    selectable,
    tempo_context,
)


def _answers(
    choice: str = "glm-5-3-max",
    confidence: float = 0.93,
    noul: float = 0.1,
    model: str = "jev-1.13.0",
    input_tokens: int = 1_000_000,
) -> dict:
    return {
        "model": model,
        "answers": {
            "destination": {
                "type": "choice",
                "choice": choice,
                "probabilities": {choice: confidence},
                "confidence": confidence,
            },
            "complexity": {
                "type": "score",
                "score": 1.2,
                "legend": {"0": "routine", "1": "standard", "2": "hard", "3": "exceptional"},
                "probabilities": {"1": 0.7, "2": 0.3},
                "confidence": 0.8,
            },
            "needs_human_or_publish_risk": {"type": "noul", "noul": noul},
        },
        "usage": {"input_tokens": input_tokens, "output_tokens": 12},
    }


class ScriptedClient:
    def __init__(self, response: dict | None = None, adaptive: bool = False) -> None:
        self.response = response or _answers()
        self.adaptive = adaptive
        self.calls: list[dict] = []

    def system_one(self, *, state, questions, model):
        self.calls.append({"state": state, "questions": questions, "model": model})
        if not self.adaptive:
            return self.response
        keys = list(questions["destination"]["criteria"])
        twenty = [key for key in keys if key.startswith("chatgpt-20x-max-")]
        choice = twenty[0] if twenty else "glm-5-3-max"
        return _answers(choice=choice, confidence=0.96, noul=0.05)


def _job(**overrides) -> Job:
    payload = {
        "job_id": "job-1",
        "goal": "Extract the keyword table",
        "state": "Source notes are already in the project folder.",
        "quality_bar": "execution",
        "blast_radius": "internal",
        "hops": 0,
    }
    payload.update(overrides)
    return Job(**payload)


class DispatchTests(unittest.TestCase):
    def setUp(self) -> None:
        self._tmp = tempfile.TemporaryDirectory()
        self.root = Path(self._tmp.name)

    def tearDown(self) -> None:
        self._tmp.cleanup()

    def _enable(self) -> None:
        (self.root / "ENABLED.on").write_text("enabled\n", encoding="utf-8")

    def test_reuses_tempo_ladder_and_hop_limit(self) -> None:
        context = tempo_context()
        self.assertEqual(context["classify_model"], PROD_CLASSIFY_MODEL)
        self.assertEqual(context["hop_limit"], MAX_ESCALATE_HOPS)
        self.assertEqual(context["tiers"]["T1"], list(TIER_MODELS["T1"]))
        self.assertEqual(context["tiers"]["T2"], list(TIER_MODELS["T2"]))
        self.assertEqual(context["tiers"]["T3"], list(TIER_MODELS["T3"]))
        self.assertIsNone(context["cost_caps_usd"]["daily_lane_usd"])

    def test_parallel_questions_and_plain_seat_copy(self) -> None:
        self._enable()
        client = ScriptedClient()
        result = dispatch_job(_job(), root=self.root, client=client)
        self.assertEqual(len(client.calls), 1)
        questions = client.calls[0]["questions"]
        self.assertEqual(
            set(questions),
            {"destination", "complexity", "needs_human_or_publish_risk"},
        )
        self.assertEqual(questions["destination"]["type"], "choice")
        self.assertEqual(questions["complexity"]["type"], "score")
        self.assertEqual(questions["needs_human_or_publish_risk"]["type"], "noul")
        self.assertEqual(client.calls[0]["model"], "jev-1.13.0")
        criteria = questions["destination"]["criteria"]
        self.assertNotIn("grok-heavy", criteria)
        blob = " ".join(criteria.values()).lower()
        self.assertIn("strategy", blob)
        self.assertIn("glm", blob)
        self.assertIn("cursor", blob)
        self.assertIn("sol-class", blob)
        self.assertEqual(client.calls[0]["state"]["tempo"]["hop_limit"], MAX_ESCALATE_HOPS)
        self.assertEqual(result.seat, "glm-5-3-max")
        self.assertTrue(result.handoff_complete)
        self.assertFalse(result.executed)
        body = json.loads(Path(result.handoff_path or "").read_text(encoding="utf-8"))
        self.assertTrue(body["label_only"])
        self.assertFalse(body["executed"])
        self.assertFalse(body["bot_exec"])
        self.assertIn("complexity", body["jev"]["answers"])

    def test_dry_run_does_not_queue_even_when_confident(self) -> None:
        client = ScriptedClient(_answers(confidence=0.99))
        result = dispatch_job(_job(), root=self.root, client=client)
        self.assertEqual(result.phase, "dry-run")
        self.assertEqual(result.action, "dry_run_label")
        self.assertFalse(result.handoff_complete)
        self.assertEqual(result.confidence, 0.99)
        self.assertFalse((self.root / "queues").exists())
        self.assertFalse((self.root / "ENABLED.on").exists())

    def test_grok_is_never_selectable(self) -> None:
        config = load_config()
        menu = build_menu(config, rotation_cursor=None)
        self.assertTrue(all("grok" not in seat.id for seat in menu))
        hostile = Seat(
            id="grok-heavy",
            display_name="Grok Heavy",
            capacity="available",
            destination=True,
            coordinator_only=False,
            rotate_group=None,
            rotate_order=None,
            tempo_tier=None,
            description="should still be blocked",
        )
        self.assertFalse(selectable(hostile))
        custom = DispatcherConfig(
            confidence_threshold=0.85,
            risk_noul_threshold=0.5,
            seats=config.seats + (hostile,),
            source_path="test",
        )
        custom_menu = build_menu(custom, rotation_cursor=None)
        self.assertTrue(all(not seat.id.startswith("grok") for seat in custom_menu))

        self._enable()
        client = ScriptedClient(_answers(choice="grok-heavy", confidence=0.99, noul=0.01))
        result = dispatch_job(_job(job_id="grok-case"), root=self.root, client=client)
        self.assertEqual(result.seat, "human-review")
        self.assertFalse((self.root / "queues" / "grok-heavy").exists())
        self.assertTrue((self.root / "queues" / "human-review" / "grok-case.json").is_file())

    def test_at_cap_seat_is_left_out_of_the_menu(self) -> None:
        self._enable()
        client = ScriptedClient(_answers(choice="claude-team", confidence=0.97, noul=0.05))
        result = dispatch_job(
            _job(job_id="cap-case"),
            root=self.root,
            client=client,
            capacity={"claude-team": "at_cap"},
        )
        self.assertNotIn("claude-team", result.menu)
        self.assertNotIn("grok-heavy", result.menu)
        self.assertEqual(result.seat, "human-review")
        self.assertFalse((self.root / "queues" / "claude-team").exists())

    def test_low_confidence_goes_to_review(self) -> None:
        self._enable()
        client = ScriptedClient(_answers(choice="claude-team", confidence=0.5, noul=0.05))
        result = dispatch_job(_job(job_id="low-conf"), root=self.root, client=client)
        self.assertEqual(result.seat, "human-review")
        self.assertTrue(result.reason.startswith("low_confidence:"))
        self.assertTrue(result.handoff_complete)
        queued = self.root / "queues" / "human-review" / "low-conf.json"
        body = json.loads(queued.read_text(encoding="utf-8"))
        self.assertEqual(body["confidence"], 0.5)
        self.assertTrue(body["handoff_complete"])

    def test_threshold_is_tunable(self) -> None:
        self._enable()
        config = load_config()
        tuned = DispatcherConfig(
            confidence_threshold=0.99,
            risk_noul_threshold=config.risk_noul_threshold,
            seats=config.seats,
            source_path=config.source_path,
        )
        self.assertEqual(load_config().confidence_threshold, 0.85)
        client = ScriptedClient(_answers(choice="kimi-k3-max", confidence=0.90, noul=0.05))
        result = dispatch_job(_job(job_id="tuned"), root=self.root, client=client, config=tuned)
        self.assertEqual(result.seat, "human-review")

    def test_risk_noul_and_ymyl_go_to_review(self) -> None:
        self._enable()
        risk = ScriptedClient(_answers(choice="glm-5-3-max", confidence=0.96, noul=0.8))
        risk_result = dispatch_job(_job(job_id="risk"), root=self.root, client=risk)
        self.assertEqual(risk_result.seat, "human-review")
        self.assertEqual(risk_result.reason, "needs_human_or_publish_risk")

        ymyl = ScriptedClient(_answers(choice="glm-5-3-max", confidence=0.96, noul=0.05))
        ymyl_result = dispatch_job(
            _job(job_id="ymyl", blast_radius="ymyl-adjacent"),
            root=self.root,
            client=ymyl,
        )
        self.assertEqual(ymyl_result.seat, "human-review")
        self.assertEqual(ymyl_result.reason, "blast_radius:ymyl-adjacent")

    def test_model_drift_kills_the_run(self) -> None:
        self._enable()
        client = ScriptedClient(_answers(model="jev-1.12.0", confidence=0.99))
        result = dispatch_job(_job(job_id="drift"), root=self.root, client=client)
        self.assertTrue(result.killed)
        self.assertEqual(result.action, "kill")
        self.assertFalse(result.handoff_complete)
        self.assertFalse((self.root / "queues").exists())
        kill = (self.root / "out" / "KILL.md").read_text(encoding="utf-8")
        self.assertIn("jev-1.12.0", kill)
        audit = (self.root / "out" / "audit.jsonl").read_text(encoding="utf-8")
        self.assertIn("classify_model_drift", audit)
        self.assertIn("jev-1.12.0", audit)
        self.assertTrue((self.root / "ENABLED.off").is_file())
        self.assertFalse((self.root / "ENABLED.on").is_file())

    def test_mock_suffix_is_drift(self) -> None:
        client = ScriptedClient(_answers(model="jev-1.13.0-mock"))
        result = dispatch_job(_job(job_id="mock-suffix"), root=self.root, client=client)
        self.assertTrue(result.killed)

    def test_dedup_skips_a_second_queue_write(self) -> None:
        self._enable()
        client = ScriptedClient()
        first = dispatch_job(_job(job_id="same"), root=self.root, client=client)
        second = dispatch_job(_job(job_id="same"), root=self.root, client=client)
        self.assertTrue(first.handoff_complete)
        self.assertEqual(second.action, "dedup_skip")
        self.assertEqual(len(client.calls), 1)
        self.assertEqual(len(list((self.root / "queues" / "glm-5-3-max").glob("*.json"))), 1)

    def test_rotation_advances_only_after_a_real_queue(self) -> None:
        self._enable()
        client = ScriptedClient(adaptive=True)
        first = dispatch_job(_job(job_id="rot-a", quality_bar="strategy"), root=self.root, client=client)
        second = dispatch_job(_job(job_id="rot-b", quality_bar="strategy"), root=self.root, client=client)
        self.assertEqual(first.seat, "chatgpt-20x-max-a")
        self.assertEqual(second.seat, "chatgpt-20x-max-b")
        self.assertIn("chatgpt-20x-max-a", first.menu)
        self.assertNotIn("chatgpt-20x-max-b", first.menu)
        self.assertIn("chatgpt-20x-max-b", second.menu)
        self.assertNotIn("chatgpt-20x-max-a", second.menu)

    def test_hop_limit_comes_from_tempo(self) -> None:
        self._enable()
        self.assertEqual(MAX_ESCALATE_HOPS, 2)
        client = ScriptedClient(_answers(choice="cursor-cloud", confidence=0.99, noul=0.01))
        result = dispatch_job(_job(job_id="hops", hops=2), root=self.root, client=client)
        self.assertEqual(result.seat, "human-review")
        self.assertEqual(result.reason, "hop_limit:2")

    def test_ledger_has_pool_seat_api_and_confirmed_dollars(self) -> None:
        self._enable()
        dispatch_job(_job(job_id="ledger"), root=self.root, client=ScriptedClient())
        row = json.loads((self.root / "out" / "TOKEN_LEDGER.jsonl").read_text(encoding="utf-8").strip())
        self.assertEqual(row["pool"], "typesafe-jev")
        self.assertEqual(row["seat"], "glm-5-3-max")
        self.assertEqual(row["api"], "systemone")
        self.assertEqual(row["model"], "jev-1.13.0")
        self.assertEqual(row["input_tokens"], 1_000_000)
        self.assertEqual(row["price_status"], "confirmed")
        self.assertAlmostEqual(row["usd"], 0.042)
        self.assertAlmostEqual(usd_for_tokens(2_000_000, 9_000), 0.084)

    def test_completion_ignores_confidence(self) -> None:
        present = self.root / "ok.json"
        present.write_text(
            json.dumps(
                {
                    "job_id": "j",
                    "seat": "glm-5-3-max",
                    "confidence": 0.11,
                    "label_only": True,
                    "executed": False,
                }
            ),
            encoding="utf-8",
        )
        self.assertTrue(confirm_handoff(present, "j", "glm-5-3-max"))
        self.assertFalse(confirm_handoff(self.root / "missing.json", "j", "glm-5-3-max"))
        confident = self.root / "confident.json"
        confident.write_text(
            json.dumps({"job_id": "j", "seat": "glm-5-3-max", "confidence": 0.99, "executed": False}),
            encoding="utf-8",
        )
        self.assertFalse(confirm_handoff(confident, "j", "glm-5-3-max"))

    def test_no_network_from_a_mocked_dispatch(self) -> None:
        def boom(*_args, **_kwargs):
            raise AssertionError("network used")

        with patch("urllib.request.urlopen", side_effect=boom):
            result = dispatch_job(_job(), root=self.root, client=ScriptedClient())
        self.assertEqual(result.seat, "glm-5-3-max")
        self.assertFalse(result.executed)


if __name__ == "__main__":
    unittest.main()
