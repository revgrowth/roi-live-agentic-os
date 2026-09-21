import unittest

from polaris_df.decide import ensure_registry
from polaris_df.registry import get_pack, list_packs, resolve_questions
from polaris_df.types import PackError


REQUIRED_PACKS = {
    "G0.source_of_truth.v1",
    "G1.territory.v1",
    "G2.audience_job.v1",
    "G3.purity.v1",
    "G3.serp_shape.v1",
    "G4.response_unit.v1",
    "G5.public_ia.v1",
    "G6.claim_authority.v1",
    "G7.priority.v1",
    "G8.ship_soft.v1",
    "QA.semantic_cannibal.v1",
    "KW.keep_drop.v1",
    "KW.intent.v1",
    "KW.cluster_assign.v1",
    "KW.hub_spoke.v1",
    "KW.aeo_question.v1",
    "KW.geo_entity.v1",
    "AUDIT.tech_severity.v1",
    "AUDIT.onpage_quality.v1",
    "AUDIT.content_gap.v1",
    "AUDIT.aeo_cite.v1",
    "AUDIT.geo_citation.v1",
    "AUDIT.finding_priority.v1",
    "QA.brief_compliance.v1",
    "QA.intent_match.v1",
    "QA.aeo_pack.v1",
    "QA.content_publish.v1",
    "QA.internal_link.v1",
}


class PackRegistryTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        ensure_registry()

    def test_required_packs_registered(self):
        ids = {p.id for p in list_packs()}
        missing = REQUIRED_PACKS - ids
        self.assertFalse(missing, f"Missing packs: {sorted(missing)}")

    def test_each_pack_has_docs_and_questions(self):
        for pack in list_packs():
            self.assertTrue(pack.docs)
            self.assertTrue(pack.version)
            self.assertTrue(pack.questions)

    def test_g6_never_auto(self):
        pack = get_pack("G6.claim_authority.v1")
        self.assertTrue(pack.never_auto)
        self.assertTrue(pack.ymyl_gate)

    def test_unknown_pack(self):
        with self.assertRaises(PackError):
            get_pack("NOPE.missing.v1")

    def test_dynamic_cluster_criteria(self):
        pack = get_pack("KW.cluster_assign.v1")
        resolved = resolve_questions(
            pack,
            {"candidate_clusters": [{"id": "hvac-install", "label": "Install"}, "other-cluster"]},
        )
        keys = set(resolved["cluster"]["criteria"])
        self.assertIn("hvac-install", keys)
        self.assertIn("other", keys)


if __name__ == "__main__":
    unittest.main()
