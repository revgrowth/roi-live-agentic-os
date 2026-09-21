import unittest

from tempo_efficiency.adapters.polaris_df import normalize_router_outcome, router_outcome_from_df
from tempo_efficiency.audit import emit_record, missing_required_fields
from tempo_efficiency.confidence import (
    DF_CHOICE_AUTO,
    bands_are_lane_local,
    invent_df_safety,
    noul_extremity,
    shared_confidence_from_df_answers,
)
from tempo_efficiency.config import NOISE_ARCHIVE_MIN_CONFIDENCE, NOISE_ARCHIVE_MIN_SAFETY


class ConfidenceMappingTests(unittest.TestCase):
    def test_choice_score_uses_min_confidence(self):
        value = shared_confidence_from_df_answers(
            {
                "intent": {"type": "choice", "choice": "informational", "confidence": 0.91},
                "priority": {"type": "score", "score": 3, "confidence": 0.72},
            }
        )
        self.assertAlmostEqual(value, 0.72)

    def test_noul_uses_extremity(self):
        self.assertAlmostEqual(noul_extremity(0.08), abs(0.08 - 0.5) * 2)
        value = shared_confidence_from_df_answers({"wrong_sense": {"type": "noul", "noul": 0.08}})
        self.assertAlmostEqual(value, abs(0.08 - 0.5) * 2)

    def test_do_not_invent_df_safety(self):
        self.assertIsNone(invent_df_safety({"lane": "polaris_df", "route": "auto"}))

    def test_bands_stay_lane_local(self):
        bands = bands_are_lane_local()
        self.assertFalse(bands["unify_numeric_auto_bands"])
        self.assertEqual(bands["coo_noise_archive_min_confidence"], NOISE_ARCHIVE_MIN_CONFIDENCE)
        self.assertEqual(bands["coo_noise_archive_min_safety"], NOISE_ARCHIVE_MIN_SAFETY)
        self.assertEqual(bands["df_choice_auto"], DF_CHOICE_AUTO)
        self.assertGreater(NOISE_ARCHIVE_MIN_CONFIDENCE, DF_CHOICE_AUTO)

    def test_prefer_route_if_both_present(self):
        self.assertEqual(
            normalize_router_outcome(record={"route": "human", "router_outcome": "auto"}),
            "human",
        )
        self.assertEqual(normalize_router_outcome(route="llm_escalate", router_outcome="auto"), "llm_escalate")
        self.assertEqual(
            router_outcome_from_df({"router_outcome": "human"}),
            "human",
        )

    def test_polaris_jsonl_omits_optional_fields(self):
        record = emit_record(
            lane="polaris_df",
            decision_id="u1",
            route="auto",
            confidence=0.88,
            result="ok",
        )
        self.assertEqual(record["route"], "auto")
        self.assertEqual(record["router_outcome"], "auto")
        self.assertIsNone(record["safety"])
        self.assertIsNone(record["phase"])
        self.assertIsNone(record["gate"])
        self.assertIsNone(record["kill_reason"])
        self.assertEqual(missing_required_fields(record), ())

    def test_coo_apply_requires_safety_phase_gate(self):
        record = emit_record(
            lane="coo_noise_archive",
            phase="apply",
            decision_id="n1",
            router_outcome="auto",
        )
        missing = missing_required_fields(record)
        self.assertIn("safety", missing)
        self.assertIn("gate", missing)


if __name__ == "__main__":
    unittest.main()
