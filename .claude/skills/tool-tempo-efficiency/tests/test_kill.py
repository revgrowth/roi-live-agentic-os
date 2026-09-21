import json
import tempfile
import unittest
from pathlib import Path

from tempo_efficiency.audit import AuditWriter, emit_record
from tempo_efficiency.config import (
    GATE_OFF_NAME,
    GATE_ON_KILLED_NAME,
    GATE_ON_NAME,
    NOISE_ARCHIVE_MIN_CONFIDENCE,
    NOISE_ARCHIVE_MIN_SAFETY,
    PROD_CLASSIFY_MODEL,
)
from tempo_efficiency.gate import resolve_gate, write_enabled_on
from tempo_efficiency.kill import apply_kill, evaluate_kill_conditions
from tempo_efficiency.router import noise_archive_eligible
from tempo_efficiency.types import SHARED_JSONL_FIELDS


class KillTests(unittest.TestCase):
    def test_first_miss_kills(self):
        verdict = evaluate_kill_conditions({"miss": True, "lane": "coo_noise_archive"})
        self.assertTrue(verdict.should_kill)
        self.assertTrue(verdict.miss)
        self.assertIn("K1:first_miss", verdict.reasons)

    def test_threshold_breach_kills_archive(self):
        verdict = evaluate_kill_conditions(
            {
                "lane": "coo_noise_archive",
                "bucket": "NOISE",
                "action": "archive",
                "router_outcome": "auto",
                "bucket_confidence": 0.80,
                "safety": 0.90,
            }
        )
        self.assertTrue(verdict.should_kill)
        self.assertTrue(any(r.startswith("K2:") for r in verdict.reasons))

    def test_wrong_bucket_archive_kills(self):
        verdict = evaluate_kill_conditions(
            {
                "lane": "coo_noise_archive",
                "bucket": "CLIENT_HUMAN",
                "action": "archive",
                "router_outcome": "auto",
                "bucket_confidence": 0.99,
                "safety": 0.90,
            }
        )
        self.assertTrue(verdict.should_kill)
        self.assertIn("K3:wrong_bucket_archived", verdict.reasons)

    def test_ymyl_auto_kills(self):
        verdict = evaluate_kill_conditions(
            {
                "lane": "polaris_df",
                "router_outcome": "auto",
                "action": "approve",
                "ymyl": True,
            }
        )
        self.assertTrue(verdict.should_kill)
        self.assertIn("K4:ymyl_or_claim_auto_approved", verdict.reasons)

    def test_delete_kills(self):
        verdict = evaluate_kill_conditions({"action": "delete"})
        self.assertIn("K6:delete_attempted", verdict.reasons)

    def test_classify_drift_on_apply_kills(self):
        verdict = evaluate_kill_conditions(
            {"phase": "apply", "jev_model": "jev-latest"}
        )
        self.assertTrue(any("K8:" in r for r in verdict.reasons))

    def test_consecutive_api_errors_kills(self):
        verdict = evaluate_kill_conditions({}, recent_results=["ok", "error", "error", "error"])
        self.assertIn("K5:api_error_consecutive", verdict.reasons)

    def test_apply_kill_disables_gate(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            write_enabled_on(root)
            result = apply_kill(root, reason="K1:first_miss", decision_id="item-1")
            self.assertTrue(result["killed"])
            self.assertFalse((root / GATE_ON_NAME).exists())
            self.assertTrue((root / GATE_OFF_NAME).is_file())
            self.assertTrue((root / GATE_ON_KILLED_NAME).is_file())
            self.assertTrue(Path(result["kill_md"]).is_file())
            state = resolve_gate(root)
            self.assertEqual(state.gate, "ENABLED.off")
            self.assertFalse(state.apply_allowed)

    def test_jsonl_emits_shared_fields(self):
        record = emit_record(
            lane="coo_noise_archive",
            decision_id="d1",
            bucket="NOISE",
            confidence=0.97,
            safety=0.82,
            router_outcome="auto",
            phase="dry-run",
            would_action="archive",
            result="would_succeed",
            gate="absent",
            operator_or_bot="tempo-test",
        )
        for key in SHARED_JSONL_FIELDS:
            self.assertIn(key, record)
        self.assertEqual(record["bucket_confidence"], 0.97)
        self.assertEqual(record["confidence"], 0.97)
        self.assertEqual(record["item_id"], "d1")
        self.assertEqual(record["jev_model"], PROD_CLASSIFY_MODEL)
        self.assertFalse(record["bot_exec"])

        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "audit.jsonl"
            with AuditWriter(path) as writer:
                writer.write(record)
            lines = path.read_text(encoding="utf-8").strip().splitlines()
            self.assertEqual(len(lines), 1)
            loaded = json.loads(lines[0])
            self.assertEqual(loaded["decision_id"], "d1")

    def test_noise_archive_eligible_matches_joint_schema(self):
        self.assertTrue(
            noise_archive_eligible(
                bucket="NOISE",
                confidence=NOISE_ARCHIVE_MIN_CONFIDENCE,
                safety=NOISE_ARCHIVE_MIN_SAFETY,
                router_outcome="auto",
            )
        )
        self.assertFalse(
            noise_archive_eligible(
                bucket="NOISE",
                confidence=0.94,
                safety=0.90,
                router_outcome="auto",
            )
        )
        self.assertFalse(
            noise_archive_eligible(
                bucket="CLARIFY",
                confidence=0.99,
                safety=0.90,
                router_outcome="auto",
            )
        )


if __name__ == "__main__":
    unittest.main()
