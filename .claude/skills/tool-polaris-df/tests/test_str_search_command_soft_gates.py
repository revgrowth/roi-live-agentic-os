import os
import unittest
from unittest.mock import patch

from integrations.str_search_command_soft_gates import (
    apply_purity_to_demand_library,
    classify_serp_shape,
    is_dry_run,
    judge_gate,
    judge_purity_row,
    judgment_jsonl_record,
    pick_response_unit,
    reset_adapter_cache,
    run_gate,
    soft_gates_enabled,
    verify_semantic_cannibal,
)


class SoftGateShimTests(unittest.TestCase):
    def setUp(self):
        reset_adapter_cache()

    def tearDown(self):
        reset_adapter_cache()

    def test_dry_run_default_stamps_judgment_and_locks_measured(self):
        self.assertTrue(is_dry_run())
        row = {
            "query": "heat pump installation charleston",
            "volume": 720,
            "kd": 28,
            "measured": True,
            "brand_territory": "residential HVAC",
            "exclusions": [],
        }
        out = judge_purity_row(row)
        self.assertTrue(out["judgment_added"])
        self.assertFalse(out.get("judgment_skipped", False))
        self.assertEqual(out["volume"], 720)
        self.assertEqual(out["kd"], 28)
        self.assertIs(out["measured"], True)
        self.assertEqual(out["judgment"]["gate"], "G3.purity.v1")
        self.assertEqual(out["judgment"]["labeling"], "judgment_added")
        self.assertIn(out["judgment"]["route"], {"auto", "llm_escalate", "human"})
        self.assertEqual(out["judgment"]["router_outcome"], out["judgment"]["route"])
        self.assertIsInstance(out["judgment"].get("confidence"), float)

    def test_serp_shape_and_select_hooks_preserve_measured(self):
        serp = classify_serp_shape(
            {
                "query": "hvac repair charleston sc",
                "item_type_composition": ["local_pack", "organic"],
                "first_organic_rank_absolute": 4,
                "aio_citation_count": 0,
            }
        )
        self.assertTrue(serp["judgment_added"])
        self.assertEqual(serp["first_organic_rank_absolute"], 4)
        self.assertEqual(serp["item_type_composition"], ["local_pack", "organic"])
        self.assertEqual(serp["aio_citation_count"], 0)
        self.assertEqual(serp["judgment"]["router_outcome"], serp["judgment"]["route"])

        selected = pick_response_unit({"query": "what is a heat pump", "volume": 110})
        self.assertTrue(selected["judgment_added"])
        self.assertEqual(selected["volume"], 110)

        via_run = run_gate("select", {"query": "what is a heat pump", "kd": 12})
        self.assertEqual(via_run["kd"], 12)
        self.assertTrue(via_run["judgment_added"])

    def test_kill_switch_noops_and_keeps_measured(self):
        row = {"query": "ac repair charleston", "volume": 1000, "kd": 19, "measured": True}
        with patch.dict(os.environ, {"POLARIS_DF_SOFT_GATES": "0"}, clear=False):
            self.assertFalse(soft_gates_enabled())
            out = classify_serp_shape(row)
        self.assertTrue(out["judgment_skipped"])
        self.assertFalse(out["judgment_added"])
        self.assertEqual(out["judgment_skip_reason"], "soft_gates_disabled")
        self.assertEqual(out["volume"], 1000)
        self.assertEqual(out["kd"], 19)
        self.assertIs(out["measured"], True)
        self.assertNotIn("judgment", out)

    def test_misconfigured_adapter_noops(self):
        row = {"query": "ac repair charleston", "volume": 880}
        with patch(
            "integrations.str_search_command_soft_gates._load_adapter",
            return_value=None,
        ):
            out = run_gate("purity", row)
        self.assertTrue(out["judgment_skipped"])
        self.assertEqual(out["judgment_skip_reason"], "adapter_unavailable")
        self.assertEqual(out["volume"], 880)

    def test_thin_state_noops_instead_of_raising(self):
        out = judge_purity_row({"volume": 10})
        self.assertTrue(out["judgment_skipped"])
        self.assertIn("ThinStateError", out["judgment_skip_reason"])
        self.assertEqual(out["volume"], 10)

    def test_claim_gate_never_auto(self):
        out = judge_gate(
            "G6.claim_authority.v1",
            {"query": "best heat pump for asthma charleston", "volume": 40},
        )
        self.assertTrue(out["judgment_added"])
        self.assertEqual(out["volume"], 40)
        self.assertEqual(out["judgment"]["route"], "human")
        self.assertEqual(out["judgment"]["router_outcome"], "human")

        via_run = run_gate("claim", {"query": "best heat pump for asthma charleston"})
        self.assertEqual(via_run["judgment"]["route"], "human")

    def test_demand_library_and_jsonl_alias(self):
        rows = apply_purity_to_demand_library(
            [
                {"query": "ac repair charleston", "volume": 1000, "exclusions": []},
                {"query": "hvac jobs", "volume": 200, "exclusions": ["jobs"]},
            ]
        )
        self.assertEqual([row["volume"] for row in rows], [1000, 200])
        self.assertTrue(all(row["judgment_added"] for row in rows))
        record = judgment_jsonl_record(rows[0])
        self.assertEqual(record["route"], rows[0]["judgment"]["route"])
        self.assertEqual(record["router_outcome"], record["route"])
        self.assertEqual(record["lane"], "polaris_df")
        self.assertEqual(record["phase"], "dry-run")
        self.assertNotIn("safety", record)

    def test_semantic_pair_and_live_flag_without_key_stays_dry(self):
        pair = verify_semantic_cannibal(
            {
                "query_a": "heat pump installation charleston",
                "query_b": "install a heat pump in charleston sc",
                "same_serp_signal": True,
                "recommended_owner": "a",
            }
        )
        self.assertTrue(pair["judgment_added"])
        env = {"POLARIS_DF_LIVE": "1"}
        env.pop("TYPESAFE_API_KEY", None)
        with patch.dict(os.environ, env, clear=False):
            os.environ.pop("TYPESAFE_API_KEY", None)
            self.assertTrue(is_dry_run())


if __name__ == "__main__":
    unittest.main()
