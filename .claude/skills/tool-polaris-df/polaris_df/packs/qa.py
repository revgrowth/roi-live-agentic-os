"""Content and site QA judgment packs. CWV and indexation stay measured."""

from __future__ import annotations

from polaris_df.types import DecisionPack


def packs() -> list[DecisionPack]:
    return [
        DecisionPack(
            id="QA.brief_compliance.v1",
            version="1.0.0",
            docs="Parallel noul checks against the brief checklist.",
            required_evidence=("url", "target_query"),
            questions={
                "matches_brief": {
                    "type": "noul",
                    "instructions": "The draft satisfies the written brief checklist in state.",
                },
                "has_required_sections": {
                    "type": "noul",
                    "instructions": "Required sections from the brief are present.",
                },
                "primary_query_in_h1": {
                    "type": "noul",
                    "instructions": "The H1 matches the target query or an approved variant.",
                },
                "cta_present": {
                    "type": "noul",
                    "instructions": "The requested CTA is present and specific.",
                },
            },
        ),
        DecisionPack(
            id="QA.intent_match.v1",
            version="1.0.0",
            docs="Intent alignment versus the target query.",
            required_evidence=("target_query", "extract"),
            questions={
                "matches_primary": {
                    "type": "noul",
                    "instructions": "The draft matches the primary intent of the target query.",
                },
                "intent_alignment": {
                    "type": "score",
                    "instructions": "How tightly the draft aligns to the target query intent.",
                    "criteria": [
                        "Wrong intent",
                        "Partial",
                        "Mostly aligned",
                        "Tight match",
                    ],
                },
            },
        ),
        DecisionPack(
            id="QA.aeo_pack.v1",
            version="1.0.0",
            docs="AEO pack readiness: FAQ, direct answer, entities, schema.",
            required_evidence=("url",),
            questions={
                "has_direct_answer": {
                    "type": "noul",
                    "instructions": "A self-contained direct answer appears near the top.",
                },
                "entities_clear": {
                    "type": "noul",
                    "instructions": "Named entities are explicit and consistent.",
                },
                "faq_ready": {
                    "type": "noul",
                    "instructions": "FAQ pairs are present and extractable.",
                },
                "schema_ready": {
                    "type": "noul",
                    "instructions": "Needed schema types are ready or already on the page.",
                },
            },
        ),
        DecisionPack(
            id="QA.content_publish.v1",
            version="1.0.0",
            docs="Publish soft-gate. Measured CWV and indexation stay in code.",
            required_evidence=("url", "target_query"),
            questions={
                "matches_brief": {
                    "type": "noul",
                    "instructions": "Draft matches the brief.",
                },
                "matches_intent": {
                    "type": "noul",
                    "instructions": "Draft matches the target query intent.",
                },
                "has_direct_answer": {
                    "type": "noul",
                    "instructions": "A direct answer is present.",
                },
                "entities_clear": {
                    "type": "noul",
                    "instructions": "Entities are clear.",
                },
                "cannibal_risk": {
                    "type": "noul",
                    "instructions": "Publishing this URL would cannibalize an inventory neighbor.",
                },
                "claim_risk_ymyl": {
                    "type": "noul",
                    "instructions": "The draft makes YMYL or high-risk claims that need a reviewer.",
                },
                "overall_ship_readiness": {
                    "type": "score",
                    "instructions": "Overall soft ship-readiness. Do not treat a high score as an indexation pass.",
                    "criteria": [
                        "Do not publish",
                        "Needs a rewrite",
                        "Needs a light edit",
                        "Soft-ready to publish",
                    ],
                },
            },
            never_auto_questions=("claim_risk_ymyl",),
        ),
        DecisionPack(
            id="QA.internal_link.v1",
            version="1.0.0",
            docs="Pick one internal-link target among candidates (Screpy-style chooser).",
            required_evidence=("url", "candidate_urls"),
            questions={
                "target": {
                    "type": "choice",
                    "instructions": "Which candidate URL is the best internal-link target from this page?",
                    "criteria_from": "candidate_urls",
                }
            },
        ),
        DecisionPack(
            id="QA.eeat_claim.v1",
            version="1.0.0",
            docs="E-E-A-T / claim risk. Never auto-approve.",
            required_evidence=("extract",),
            never_auto=True,
            ymyl_gate=True,
            questions={
                "claim_risk": {
                    "type": "score",
                    "instructions": "How much claim or E-E-A-T risk does this draft carry?",
                    "criteria": [
                        "No material claims",
                        "Ordinary brand claims",
                        "Needs a cited source",
                        "YMYL or legal review required",
                    ],
                },
                "reviewer": {
                    "type": "choice",
                    "instructions": "Who should review before publish?",
                    "criteria": {
                        "editor": "Content editor",
                        "sme": "Subject-matter expert",
                        "legal": "Legal / compliance",
                        "medical": "Medical reviewer",
                        "none": "No extra reviewer",
                    },
                },
            },
        ),
        DecisionPack(
            id="QA.voice_fit.v1",
            version="1.0.0",
            docs="Brand voice fit score. Does not rewrite the draft.",
            required_evidence=("extract",),
            questions={
                "voice_fit": {
                    "type": "score",
                    "instructions": "How well does the draft match the supplied voice notes?",
                    "criteria": [
                        "Off voice",
                        "Generic",
                        "Mostly on voice",
                        "On voice",
                    ],
                }
            },
        ),
    ]
