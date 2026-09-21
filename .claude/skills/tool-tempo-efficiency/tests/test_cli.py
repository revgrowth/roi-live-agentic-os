import json
import tempfile
import unittest
from pathlib import Path

from tempo_efficiency.cli import main
from tempo_efficiency.config import BOT_EXEC_ENABLED, PROD_CLASSIFY_MODEL
from tempo_efficiency.gate import write_enabled_on


class CliTests(unittest.TestCase):
    def test_resolve_clarify_dry_run(self):
        with tempfile.TemporaryDirectory() as tmp:
            out = Path(tmp) / "rec.json"
            code = main(
                [
                    "resolve",
                    "--bucket",
                    "CLARIFY",
                    "--router-outcome",
                    "llm_escalate",
                    "--decision-id",
                    "d1",
                    "-o",
                    str(out),
                ]
            )
            self.assertEqual(code, 0)
            payload = json.loads(out.read_text(encoding="utf-8"))
            self.assertEqual(payload["jev_model"], PROD_CLASSIFY_MODEL)
            self.assertEqual(payload["work_tier"], "T1")
            self.assertFalse(payload["bot_exec"])
            self.assertEqual(payload["phase"], "dry-run")

    def test_resolve_hop_limit(self):
        with tempfile.TemporaryDirectory() as tmp:
            out = Path(tmp) / "rec.json"
            code = main(
                [
                    "resolve",
                    "--bucket",
                    "BRIEF_ONLY",
                    "--router-outcome",
                    "llm_escalate",
                    "--hops",
                    "2",
                    "-o",
                    str(out),
                ]
            )
            self.assertEqual(code, 0)
            payload = json.loads(out.read_text(encoding="utf-8"))
            self.assertEqual(payload["effective_outcome"], "human")
            self.assertIsNone(payload["work_tier"])

    def test_gate_and_thresholds(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            write_enabled_on(root)
            out = Path(tmp) / "gate.json"
            self.assertEqual(main(["gate", "--root", str(root), "-o", str(out)]), 0)
            payload = json.loads(out.read_text(encoding="utf-8"))
            self.assertEqual(payload["gate"], "ENABLED.on")
            self.assertFalse(payload["bot_exec"])
        self.assertEqual(main(["thresholds"]), 0)

    def test_route_alias(self):
        with tempfile.TemporaryDirectory() as tmp:
            out = Path(tmp) / "rec.json"
            code = main(
                [
                    "resolve",
                    "--pack-id",
                    "G3.purity.v1",
                    "--route",
                    "llm_escalate",
                    "-o",
                    str(out),
                ]
            )
            self.assertEqual(code, 0)
            payload = json.loads(out.read_text(encoding="utf-8"))
            self.assertEqual(payload["route"], "llm_escalate")
            self.assertEqual(payload["work_tier"], "T1")

    def test_bot_exec_pin(self):
        self.assertFalse(BOT_EXEC_ENABLED)


if __name__ == "__main__":
    unittest.main()
