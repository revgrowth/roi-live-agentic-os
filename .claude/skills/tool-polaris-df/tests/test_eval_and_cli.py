import json
import tempfile
import unittest
from pathlib import Path

from polaris_df.cli import main
from polaris_df.eval.harness import evaluate_all
from polaris_df.packers.base import state_from_row
from polaris_df.types import ThinStateError


class EvalTests(unittest.TestCase):
    def test_mock_eval_agreement(self):
        report = evaluate_all(dry_run=True)
        self.assertGreaterEqual(report["n"], 20)
        self.assertIsNotNone(report["agreement"])
        self.assertGreaterEqual(report["agreement"], 0.75)
        self.assertEqual(report["source"], "mock")
        packs = {item["pack_id"] for item in report["fixtures"]}
        self.assertIn("G3.purity.v1", packs)
        self.assertIn("KW.intent.v1", packs)
        self.assertIn("G3.serp_shape.v1", packs)
        self.assertIn("QA.semantic_cannibal.v1", packs)


class PackerTests(unittest.TestCase):
    def test_refuses_empty_required(self):
        with self.assertRaises(ThinStateError):
            state_from_row(
                unit_id="x",
                gate="G3.purity.v1",
                evidence={"query": ""},
                required=("query",),
            )


class CliTests(unittest.TestCase):
    def test_packs_and_decide_dry_run(self):
        self.assertEqual(main(["--dry-run", "packs"]), 0)
        with tempfile.TemporaryDirectory() as tmp:
            state = Path(tmp) / "state.json"
            out = Path(tmp) / "out.json"
            state.write_text(
                json.dumps(
                    {
                        "query": "heat pump installation charleston",
                        "volume": 720,
                        "exclusions": [],
                    }
                ),
                encoding="utf-8",
            )
            code = main(
                [
                    "--dry-run",
                    "--no-log",
                    "--output",
                    str(out),
                    "decide",
                    "--pack",
                    "G3.purity.v1",
                    "--state",
                    str(state),
                ]
            )
            self.assertEqual(code, 0)
            payload = json.loads(out.read_text(encoding="utf-8"))
            self.assertEqual(payload["judgment"]["gate"], "G3.purity.v1")
            self.assertEqual(payload["judgment"]["source"], "mock")

    def test_eval_cli(self):
        code = main(["--dry-run", "--no-log", "eval", "--fail-under", "0.7"])
        self.assertEqual(code, 0)

    def test_keyword_and_audit_and_qa(self):
        with tempfile.TemporaryDirectory() as tmp:
            kw = Path(tmp) / "kw.jsonl"
            kw.write_text(
                json.dumps({"query": "how to bleed a radiator", "volume": 200}) + "\n",
                encoding="utf-8",
            )
            self.assertEqual(
                main(["--dry-run", "--no-log", "keyword-triage", "--inputs", str(kw)]),
                0,
            )
            audit = Path(tmp) / "audit.jsonl"
            audit.write_text(
                json.dumps({"url": "https://example.com/a", "issue": "noindex on template"})
                + "\n",
                encoding="utf-8",
            )
            self.assertEqual(
                main(["--dry-run", "--no-log", "audit-triage", "--inputs", str(audit)]),
                0,
            )
            qa = Path(tmp) / "qa.json"
            qa.write_text(
                json.dumps(
                    [
                        {
                            "url": "https://example.com/a",
                            "target_query": "heat pump installation",
                            "h1": "Heat pump installation",
                            "extract": "In short, a heat pump moves heat.",
                        }
                    ]
                ),
                encoding="utf-8",
            )
            self.assertEqual(
                main(["--dry-run", "--no-log", "qa-content", "--inputs", str(qa)]),
                0,
            )

    def test_live_without_key_fails(self):
        import os

        if os.environ.get("TYPESAFE_API_KEY"):
            self.skipTest("live key present")
        code = main(["--live", "packs"])
        self.assertEqual(code, 1)


if __name__ == "__main__":
    unittest.main()
