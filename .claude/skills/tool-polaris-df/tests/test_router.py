import unittest

from polaris_df.router import route_answers
from polaris_df.types import DecisionPack, Thresholds


def _pack(**kwargs) -> DecisionPack:
    defaults = dict(
        id="TEST.pack.v1",
        version="1.0.0",
        docs="test",
        questions={
            "ok": {"type": "noul", "instructions": "ok"},
        },
    )
    defaults.update(kwargs)
    return DecisionPack(**defaults)


class RouterTests(unittest.TestCase):
    def test_choice_auto_and_human(self):
        pack = _pack()
        overall, qroutes, _ = route_answers(
            pack=pack,
            answers={
                "intent": {
                    "type": "choice",
                    "choice": "informational",
                    "confidence": 0.92,
                }
            },
        )
        self.assertEqual(overall, "auto")
        self.assertEqual(qroutes["intent"], "auto")

        overall, qroutes, _ = route_answers(
            pack=pack,
            answers={
                "intent": {
                    "type": "choice",
                    "choice": "informational",
                    "confidence": 0.40,
                }
            },
        )
        self.assertEqual(overall, "human")

    def test_noul_extremes_auto(self):
        pack = _pack()
        overall, _, _ = route_answers(
            pack=pack,
            answers={"wrong_sense": {"type": "noul", "noul": 0.04}},
        )
        self.assertEqual(overall, "auto")

    def test_noul_mid_escalates(self):
        pack = _pack()
        overall, _, _ = route_answers(
            pack=pack,
            answers={"wrong_sense": {"type": "noul", "noul": 0.51}},
        )
        self.assertEqual(overall, "llm_escalate")

    def test_ymyl_pack_never_auto(self):
        pack = _pack(never_auto=True, ymyl_gate=True)
        overall, _, reasons = route_answers(
            pack=pack,
            answers={
                "claim_class": {
                    "type": "choice",
                    "choice": "commodity_fact",
                    "confidence": 0.99,
                }
            },
        )
        self.assertEqual(overall, "human")
        self.assertTrue(any("never_auto" in r or "ymyl" in r for r in reasons))

    def test_ymyl_choice_forces_human(self):
        pack = _pack()
        overall, _, reasons = route_answers(
            pack=pack,
            answers={
                "claim_class": {
                    "type": "choice",
                    "choice": "medical_ymyl",
                    "confidence": 0.99,
                }
            },
        )
        self.assertEqual(overall, "human")
        self.assertTrue(any("ymyl" in r for r in reasons))

    def test_score_extreme_auto(self):
        pack = _pack()
        overall, _, _ = route_answers(
            pack=pack,
            answers={
                "priority_band": {
                    "type": "score",
                    "score": 4.0,
                    "confidence": 0.9,
                    "legend": {"0": "drop", "4": "ship"},
                }
            },
            thresholds=Thresholds(),
        )
        self.assertEqual(overall, "auto")


if __name__ == "__main__":
    unittest.main()
