"""Eval agreement math and the no-key guard. Does not call TypeSafe."""

from __future__ import annotations

import io
import os
import tempfile
import unittest
from contextlib import redirect_stderr, redirect_stdout
from pathlib import Path
from unittest.mock import patch

from jev_dispatcher.live_eval import load_jobs, main, render_report, run_eval, seats_agree


class LiveEvalTests(unittest.TestCase):
    def test_family_agreement(self) -> None:
        self.assertTrue(seats_agree("chatgpt-20x-max-b", "chatgpt-20x-max"))
        self.assertFalse(seats_agree("chatgpt-team", "chatgpt-20x-max"))
        self.assertTrue(seats_agree("claude-team", "claude-team"))
        self.assertFalse(seats_agree("human-review", "claude-team"))
        self.assertFalse(seats_agree(None, "human-review"))

    def test_labeled_set_is_real_and_marked_for_tempo(self) -> None:
        repo = Path(__file__).resolve().parents[4]
        path = repo / "clients" / "roi-live" / "projects" / "jev-dispatcher-2026-09" / "eval" / "jobs.jsonl"
        jobs = load_jobs(path)
        self.assertGreaterEqual(len(jobs), 30)
        self.assertLessEqual(len(jobs), 50)
        for job in jobs:
            self.assertTrue(job["tempo_review_required"])
            self.assertEqual(job["label_status"], "needs_tempo_review")
            self.assertTrue(job["ideal_reason"])
            source = repo / job["source_path"]
            self.assertTrue(source.is_file(), job["source_path"])

    def test_dry_eval_does_not_queue_or_create_the_gate(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            jobs = [
                {
                    "job_id": "one",
                    "goal": "Write the homepage brief",
                    "state": "Client-facing homepage.",
                    "quality_bar": "execution",
                    "blast_radius": "client-facing",
                    "ideal_seat": "claude-team",
                    "ideal_reason": "test",
                    "tempo_review_required": True,
                    "label_status": "needs_tempo_review",
                }
            ]
            report = run_eval(jobs, root=root, client=ScriptedEvalClient())
            self.assertFalse((root / "ENABLED.on").exists())
            self.assertFalse((root / "queues").exists())
            self.assertFalse(report["rows"][0]["handoff_complete"])
            self.assertIn("Tempo review", report["note"])

    def test_missing_key_exits_and_does_not_print_a_secret(self) -> None:
        secret = "sk-live-eval-secret-value"
        previous = os.environ.get("TYPESAFE_API_KEY")
        os.environ["TYPESAFE_API_KEY"] = secret
        try:
            with patch("jev_dispatcher.live_eval.key_is_set", return_value=False):
                stdout = io.StringIO()
                stderr = io.StringIO()
                with redirect_stdout(stdout), redirect_stderr(stderr):
                    code = main(["--jobs", "missing.jsonl", "--root", "unused"])
            self.assertEqual(code, 2)
            combined = stdout.getvalue() + stderr.getvalue()
            self.assertNotIn(secret, combined)
            self.assertIn("TYPESAFE_API_KEY", combined)
        finally:
            if previous is None:
                os.environ.pop("TYPESAFE_API_KEY", None)
            else:
                os.environ["TYPESAFE_API_KEY"] = previous

    def test_report_redacts_a_key_that_leaks_into_a_reason(self) -> None:
        secret = "sk-should-never-print"
        previous = os.environ.get("TYPESAFE_API_KEY")
        os.environ["TYPESAFE_API_KEY"] = secret
        try:
            text = render_report(
                {
                    "compared": 1,
                    "agreed": 0,
                    "misses": 1,
                    "agreement_rate": 0.0,
                    "miss_rows": [
                        {
                            "job_id": "x",
                            "ideal_seat": "claude-team",
                            "predicted_seat": "human-review",
                            "reason": f"leaked {secret}",
                            "ideal_reason": "because",
                        }
                    ],
                    "note": "Labels need Tempo review.",
                }
            )
            self.assertNotIn(secret, text)
            self.assertIn("[redacted]", text)
        finally:
            if previous is None:
                os.environ.pop("TYPESAFE_API_KEY", None)
            else:
                os.environ["TYPESAFE_API_KEY"] = previous


class ScriptedEvalClient:
    """Local stand-in so this module's import in the test file stays obvious."""

    def system_one(self, *, state, questions, model):
        return {
            "model": "jev-1.13.0",
            "answers": {
                "destination": {
                    "type": "choice",
                    "choice": "claude-team",
                    "probabilities": {"claude-team": 0.9},
                    "confidence": 0.9,
                },
                "complexity": {
                    "type": "score",
                    "score": 2,
                    "legend": {"0": "routine", "1": "standard", "2": "hard", "3": "exceptional"},
                    "probabilities": {"2": 0.9},
                    "confidence": 0.9,
                },
                "needs_human_or_publish_risk": {"type": "noul", "noul": 0.05},
            },
            "usage": {"input_tokens": 10, "output_tokens": 1},
        }


if __name__ == "__main__":
    unittest.main()
