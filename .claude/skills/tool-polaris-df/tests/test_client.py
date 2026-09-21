import unittest

from polaris_df.client import questions_for_api
from polaris_df.mock import MockJevClient


class ClientTests(unittest.TestCase):
    def test_strips_fabric_keys(self):
        clean = questions_for_api(
            {
                "cluster": {
                    "type": "choice",
                    "instructions": "pick",
                    "criteria": {"a": "A"},
                    "criteria_from": "candidate_clusters",
                }
            }
        )
        self.assertEqual(set(clean["cluster"]), {"type", "instructions", "criteria"})

    def test_mock_scripted_answers(self):
        client = MockJevClient(
            scripted={"ok": {"type": "noul", "noul": 0.99}},
        )
        out = client.system_one(
            state={"query": "x"},
            questions={"ok": {"type": "noul", "instructions": "ok"}},
            model="jev-1.13.0",
        )
        self.assertEqual(out["answers"]["ok"]["noul"], 0.99)
        self.assertIn("mock", out["model"])


if __name__ == "__main__":
    unittest.main()
