import unittest

from tempo_efficiency.adapters.polaris_df import (
    pack_forces_human,
    router_outcome_from_df,
    validate_router_outcome,
)
from tempo_efficiency.config import BOT_EXEC_ENABLED, COST_CAPS, MAX_ESCALATE_HOPS, PROD_CLASSIFY_MODEL
from tempo_efficiency.router import HopLedger, resolve_recommendation


class RouterTests(unittest.TestCase):
    def test_layer_a_always_pins_jev(self):
        rec = resolve_recommendation(bucket="CLARIFY", router_outcome="llm_escalate")
        self.assertEqual(rec.jev_model, PROD_CLASSIFY_MODEL)
        self.assertFalse(rec.bot_exec)
        self.assertFalse(BOT_EXEC_ENABLED)

    def test_auto_has_no_work_model(self):
        rec = resolve_recommendation(bucket="NOISE", router_outcome="auto")
        self.assertEqual(rec.effective_outcome, "auto")
        self.assertIsNone(rec.work_tier)
        self.assertIsNone(rec.work_model)
        self.assertTrue(any("no_work_llm" in r for r in rec.reasons))

    def test_human_stops(self):
        rec = resolve_recommendation(bucket="CLIENT_HUMAN", router_outcome="human")
        self.assertEqual(rec.effective_outcome, "human")
        self.assertIsNone(rec.work_tier)

    def test_clarify_escalates_to_t1(self):
        rec = resolve_recommendation(bucket="CLARIFY", router_outcome="llm_escalate")
        self.assertEqual(rec.effective_outcome, "llm_escalate")
        self.assertEqual(rec.work_tier, "T1")
        self.assertEqual(rec.work_model, "kimi-k3")
        self.assertEqual(rec.escalate_hops, 1)

    def test_brief_only_t1(self):
        rec = resolve_recommendation(bucket="BRIEF_ONLY", router_outcome="llm_escalate")
        self.assertEqual(rec.work_tier, "T1")

    def test_client_human_t3(self):
        rec = resolve_recommendation(bucket="CLIENT_HUMAN", router_outcome="llm_escalate")
        self.assertEqual(rec.work_tier, "T3")
        self.assertTrue(rec.never_downgrade)

    def test_security_finance_t3(self):
        rec = resolve_recommendation(bucket="SECURITY_FINANCE", router_outcome="llm_escalate")
        self.assertEqual(rec.work_tier, "T3")
        self.assertTrue(rec.never_downgrade)

    def test_never_downgrade_under_cost_pressure(self):
        rec = resolve_recommendation(
            bucket="CLIENT_HUMAN",
            router_outcome="llm_escalate",
            prefer_cheaper=True,
        )
        self.assertEqual(rec.work_tier, "T3")
        self.assertTrue(any("never_downgrade" in r for r in rec.reasons))

    def test_internal_human_code_shaped_t2(self):
        rec = resolve_recommendation(
            bucket="INTERNAL_HUMAN",
            router_outcome="llm_escalate",
            code_shaped=True,
        )
        self.assertEqual(rec.work_tier, "T2")

    def test_clickup_mutate_is_human(self):
        rec = resolve_recommendation(bucket="CLICKUP_MUTATE", router_outcome="llm_escalate")
        self.assertEqual(rec.effective_outcome, "human")
        self.assertIsNone(rec.work_tier)

    def test_bot_exec_bucket_has_no_work_model(self):
        rec = resolve_recommendation(bucket="BOT_EXEC", router_outcome="llm_escalate")
        self.assertIsNone(rec.work_tier)
        self.assertFalse(rec.bot_exec)
        self.assertTrue(any("bot_exec_off" in r for r in rec.reasons))

    def test_ymyl_never_auto_even_if_df_says_auto(self):
        rec = resolve_recommendation(bucket="QA", router_outcome="auto", ymyl=True)
        self.assertEqual(rec.effective_outcome, "human")
        self.assertTrue(rec.for_human_approve_only)
        self.assertIsNone(rec.work_tier)

    def test_ymyl_assist_draft_only_when_jason_allows(self):
        rec = resolve_recommendation(
            bucket="QA",
            router_outcome="llm_escalate",
            ymyl=True,
            allow_ymyl_assist=True,
        )
        self.assertEqual(rec.effective_outcome, "human")
        self.assertEqual(rec.work_tier, "T3")
        self.assertTrue(rec.for_human_approve_only)

    def test_claim_pack_flag(self):
        rec = resolve_recommendation(bucket="claim", router_outcome="llm_escalate", claim_pack=True)
        self.assertEqual(rec.effective_outcome, "human")
        self.assertTrue(rec.for_human_approve_only)
        self.assertIsNone(rec.work_tier)

    def test_prefer_route_over_router_outcome(self):
        rec = resolve_recommendation(
            bucket="CLARIFY",
            route="human",
            router_outcome="llm_escalate",
        )
        self.assertEqual(rec.router_outcome, "human")
        self.assertEqual(rec.effective_outcome, "human")

    def test_df_keyword_purity_midband_t1(self):
        rec = resolve_recommendation(
            route="llm_escalate",
            pack_id="G3.purity.v1",
        )
        self.assertEqual(rec.work_tier, "T1")

    def test_df_keyword_pack_t1(self):
        rec = resolve_recommendation(route="llm_escalate", pack_id="KW.intent.v1")
        self.assertEqual(rec.work_tier, "T1")

    def test_df_audit_t1_unless_client_facing(self):
        rec = resolve_recommendation(route="llm_escalate", pack_id="AUDIT.finding_priority.v1")
        self.assertEqual(rec.work_tier, "T1")
        rec = resolve_recommendation(
            route="llm_escalate",
            pack_id="AUDIT.finding_priority.v1",
            client_facing=True,
        )
        self.assertEqual(rec.work_tier, "T3")

    def test_df_qa_aeo_geo_t3(self):
        rec = resolve_recommendation(route="llm_escalate", pack_id="QA.brief_compliance.v1")
        self.assertEqual(rec.work_tier, "T3")
        rec = resolve_recommendation(route="llm_escalate", pack_id="KW.aeo_question.v1")
        self.assertEqual(rec.work_tier, "T3")
        rec = resolve_recommendation(route="llm_escalate", pack_id="AUDIT.geo_citation.v1")
        self.assertEqual(rec.work_tier, "T3")

    def test_hop_limit_forces_human(self):
        rec = resolve_recommendation(
            bucket="CLARIFY",
            router_outcome="llm_escalate",
            hops=MAX_ESCALATE_HOPS,
        )
        self.assertEqual(rec.effective_outcome, "human")
        self.assertIsNone(rec.work_tier)
        self.assertTrue(any("hop_limit" in r for r in rec.reasons))

    def test_second_hop_still_allowed(self):
        rec = resolve_recommendation(
            bucket="CLARIFY",
            router_outcome="llm_escalate",
            hops=MAX_ESCALATE_HOPS - 1,
        )
        self.assertEqual(rec.effective_outcome, "llm_escalate")
        self.assertEqual(rec.work_tier, "T1")
        self.assertEqual(rec.escalate_hops, MAX_ESCALATE_HOPS)

    def test_ledger_counts_hops_then_human(self):
        ledger = HopLedger()
        first = resolve_recommendation(
            bucket="CLARIFY",
            router_outcome="llm_escalate",
            decision_id="d9",
            ledger=ledger,
        )
        second = resolve_recommendation(
            bucket="CLARIFY",
            router_outcome="llm_escalate",
            decision_id="d9",
            ledger=ledger,
        )
        third = resolve_recommendation(
            bucket="CLARIFY",
            router_outcome="llm_escalate",
            decision_id="d9",
            ledger=ledger,
        )
        self.assertEqual(first.escalate_hops, 1)
        self.assertEqual(second.escalate_hops, 2)
        self.assertEqual(third.effective_outcome, "human")

    def test_cost_caps_are_placeholders(self):
        rec = resolve_recommendation(bucket="BRIEF_ONLY", router_outcome="llm_escalate")
        self.assertIsNone(rec.cost_caps["per_item_t1_usd"])
        self.assertIsNone(rec.cost_caps["per_item_t3_usd"])
        self.assertIsNone(rec.cost_caps["daily_lane_usd"])
        self.assertFalse(COST_CAPS.any_set())

    def test_invalid_outcome_rejected(self):
        with self.assertRaises(ValueError):
            validate_router_outcome("maybe")

    def test_adapter_reads_df_route_without_rerouting(self):
        class _Decision:
            route = "llm_escalate"

        self.assertEqual(router_outcome_from_df(_Decision()), "llm_escalate")
        self.assertEqual(
            router_outcome_from_df({"judgment": {"route": "human"}}),
            "human",
        )

    def test_imported_claim_pack_forces_human_when_df_present(self):
        forced = pack_forces_human("G6.claim_authority.v1")
        try:
            import polaris_df  # noqa: F401
        except ImportError:
            self.assertFalse(forced)
            return
        self.assertTrue(forced)
        self.assertTrue(pack_forces_human("QA.eeat_claim.v1"))
        self.assertFalse(pack_forces_human("G3.purity.v1"))


if __name__ == "__main__":
    unittest.main()
