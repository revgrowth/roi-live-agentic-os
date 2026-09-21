import unittest

from polaris_df.adapters.search_command import (
    apply_purity_to_demand_library,
    classify_serp_shape,
    judge_purity_row,
    pick_response_unit,
    verify_semantic_cannibal,
)
from polaris_df.types import ThinStateError


class SearchCommandAdapterTests(unittest.TestCase):
    def test_purity_adds_judgment_and_keeps_volume(self):
        row = {
            "query": "heat pump installation charleston",
            "volume": 720,
            "kd": 28,
            "measured": True,
            "brand_territory": "residential HVAC",
            "exclusions": ["jobs"],
        }
        out = judge_purity_row(row, dry_run=True)
        self.assertTrue(out["judgment_added"])
        self.assertEqual(out["volume"], 720)
        self.assertEqual(out["kd"], 28)
        self.assertEqual(out["measured"], True)
        self.assertEqual(out["judgment"]["gate"], "G3.purity.v1")
        self.assertEqual(out["judgment"]["labeling"], "judgment_added")
        self.assertIn(out["disposition"], {
            "keep",
            "merge",
            "reject_sense",
            "reject_exclusion",
            "reject_territory",
            "hold_evidence",
            "other",
        })
        self.assertEqual(out["disposition_source"], "judgment_added")
        self.assertIn(out["judgment"]["route"], {"auto", "llm_escalate", "human"})

    def test_purity_rejects_excluded_jobs_query(self):
        row = {
            "query": "hvac technician jobs charleston",
            "volume": 480,
            "exclusions": ["jobs"],
            "brand_territory": "residential HVAC",
        }
        out = judge_purity_row(row, dry_run=True)
        self.assertEqual(out["disposition"], "reject_exclusion")
        self.assertEqual(out["volume"], 480)

    def test_demand_library_batch_preserves_order_and_measured(self):
        rows = [
            {"query": "ac repair charleston", "volume": 1000, "exclusions": []},
            {"query": "hvac jobs", "volume": 200, "exclusions": ["jobs"]},
        ]
        out = apply_purity_to_demand_library(rows, dry_run=True)
        self.assertEqual(len(out), 2)
        self.assertEqual(out[0]["volume"], 1000)
        self.assertEqual(out[1]["volume"], 200)
        self.assertEqual(out[1]["disposition"], "reject_exclusion")

    def test_serp_shape_local_pack(self):
        row = {
            "query": "hvac repair charleston sc",
            "item_type_composition": ["local_pack", "organic"],
            "first_organic_rank_absolute": 4,
            "aio_citation_count": 0,
        }
        out = classify_serp_shape(row, dry_run=True)
        self.assertEqual(out["serp_shape"], "feature_heavy_local")
        self.assertEqual(out["serp_shape_source"], "judgment_added")
        self.assertEqual(out["first_organic_rank_absolute"], 4)

    def test_response_unit_and_semantic_pair(self):
        unit = pick_response_unit({"query": "what is a heat pump"}, dry_run=True)
        self.assertIn("response_unit", unit)
        self.assertTrue(unit["judgment_added"])

        pair = verify_semantic_cannibal(
            {
                "query_a": "heat pump installation charleston",
                "query_b": "install a heat pump in charleston sc",
                "same_serp_signal": True,
                "recommended_owner": "a",
            },
            dry_run=True,
        )
        self.assertGreaterEqual(pair["same_serp"], 0.85)
        self.assertEqual(pair["recommended_owner"], "a")

    def test_thin_state_refused(self):
        with self.assertRaises(ThinStateError):
            judge_purity_row({"volume": 10}, dry_run=True)


if __name__ == "__main__":
    unittest.main()
