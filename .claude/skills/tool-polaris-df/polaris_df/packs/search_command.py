"""Search Command G0-G8 soft-judgment packs. Measured validators stay in code."""

from __future__ import annotations

from polaris_df.types import DecisionPack, Thresholds

SERP_SHAPE_CRITERIA = {
    "feature_heavy_local": "local_pack or maps present; location/entity discovery first",
    "local_pack_first": "local pack dominates above organic; play is local_pack_first",
    "feature_heavy_commercial": "shopping or product modules; no local token",
    "aio_dominated": "stable AI Overview with at least 8 citations and weak or absent organic",
    "aio_citation": "AIO present and the job is winning a citation, not rank 1 organic",
    "informational_clean": "organic ranks 1-3; ordinary informational features",
    "video_first": "video or Shorts modules occupy the primary answer slot",
    "news_first": "top stories or news pack is the primary SERP module",
    "paa_heavy": "People Also Ask and related-questions dominate the above-the-fold answer",
    "comparison_commercial": "best/vs/review layout with commercial modules",
    "feed_first": "Discover/feed or visual grid is the primary surface",
    "marketplace_heavy": "marketplace or aggregator results crowd brand sites",
    "other": "None of the listed shapes",
}

RESPONSE_UNITS = {
    "page": "Standalone URL is the correct public response",
    "section": "A section on an existing URL is enough",
    "tool": "Calculator, quiz, or interactive tool",
    "hub": "Parent hub that owns a cluster",
    "spoke": "Child page supporting a hub",
    "faq": "FAQ block or FAQPage is the unit",
    "comparison": "Comparison or alternatives page",
    "local_landing": "Location or service-area landing page",
    "hold": "Do not build yet; evidence or IA is incomplete",
    "other": "None of the listed units",
}

CLAIM_CLASSES = {
    "commodity_fact": "Uncontested public fact; low claim risk",
    "brand_claim": "Brand-owned differentiator that needs a source",
    "performance_claim": "Numeric outcome, savings, or speed claim",
    "experience_claim": "First-hand experience or process claim",
    "medical_ymyl": "Health or medical advice; force human review",
    "financial_ymyl": "Money, credit, or investment advice; force human review",
    "legal_ymyl": "Legal rights or compliance advice; force human review",
    "other": "Does not fit the listed classes",
}

OWNER_ROOMS = {
    "homepage": "Site-wide brand home",
    "service": "Core service or offer page",
    "collection": "Category / collection hub",
    "location": "Geo or service-area page",
    "blog": "Editorial / journal article",
    "case_study": "Proof / case study",
    "tool": "Interactive tool",
    "docs": "Reference or documentation",
    "other": "No existing room fits",
}

READER_JOBS = {
    "diagnose": "Understand what is wrong or what the thing is",
    "compare": "Choose between options",
    "hire": "Select a provider and start work",
    "buy": "Complete a purchase",
    "maintain": "Keep something working after the sale",
    "learn": "Build knowledge with no immediate transaction",
    "local_find": "Find a nearby provider or location",
    "other": "Job is not in the ICP enum",
}


def packs() -> list[DecisionPack]:
    return [
        DecisionPack(
            id="G0.source_of_truth.v1",
            version="1.0.0",
            docs="Is this artifact governing, a proposal, superseded, or unknown?",
            required_evidence=("artifact_role", "artifact_excerpt"),
            questions={
                "status": {
                    "type": "choice",
                    "instructions": "Classify the artifact's authority for this Search Command run.",
                    "criteria": {
                        "governing": "Current source of truth operators must follow",
                        "proposal": "Suggested change; not yet governing",
                        "superseded": "Replaced by a later artifact",
                        "unknown": "Cannot tell from the provided evidence",
                    },
                }
            },
        ),
        DecisionPack(
            id="G1.territory.v1",
            version="1.0.0",
            docs="On-brand territory check and canonical owner room.",
            required_evidence=("query", "brand_territory"),
            questions={
                "on_territory": {
                    "type": "noul",
                    "instructions": "This query sits inside the approved market-entry or adjacent investigation territory.",
                    "criteria": {
                        "true": "On-territory or approved adjacent",
                        "false": "Outside approved territory",
                    },
                },
                "owner_room": {
                    "type": "choice",
                    "instructions": "Which public IA room should own this demand if it is kept?",
                    "criteria": OWNER_ROOMS,
                },
            },
        ),
        DecisionPack(
            id="G2.audience_job.v1",
            version="1.0.0",
            docs="Which reader job this query serves, and how well it fits the ICP.",
            required_evidence=("query",),
            questions={
                "reader_job": {
                    "type": "choice",
                    "instructions": "Pick the primary reader job for this query.",
                    "criteria": READER_JOBS,
                },
                "icp_fit": {
                    "type": "score",
                    "instructions": "How well this query matches the stated ICP and language they use.",
                    "criteria": [
                        "Wrong audience",
                        "Peripheral audience",
                        "Plausible ICP adjacency",
                        "Core ICP job",
                    ],
                },
            },
        ),
        DecisionPack(
            id="G3.purity.v1",
            version="1.0.0",
            docs="Demand-library purity: wrong sense, excluded intent, off-territory, merge, or keep.",
            required_evidence=("query",),
            questions={
                "wrong_sense": {
                    "type": "noul",
                    "instructions": "This query uses a different sense of the brand or category terms than our territory.",
                    "criteria": {
                        "true": "Homonym or wrong industry sense",
                        "false": "Same sense as the brand territory",
                    },
                },
                "excluded_intent": {
                    "type": "noul",
                    "instructions": "This query matches an excluded intent listed in the intake exclusions.",
                    "criteria": {
                        "true": "Hits an exclusion",
                        "false": "Not an excluded intent",
                    },
                },
                "off_territory": {
                    "type": "noul",
                    "instructions": "This query sits outside approved market-entry and adjacent investigation territories.",
                },
                "disposition": {
                    "type": "choice",
                    "instructions": "Best demand-library disposition for this row.",
                    "criteria": {
                        "keep": "Eligible for portfolio consideration",
                        "merge": "Same SERP or intent as another row; merge",
                        "reject_sense": "Wrong sense",
                        "reject_exclusion": "Excluded intent",
                        "reject_territory": "Off territory",
                        "hold_evidence": "Need more evidence",
                        "other": "None of the above",
                    },
                },
            },
        ),
        DecisionPack(
            id="G3.serp_shape.v1",
            version="1.0.0",
            docs="v5.1 SERP-shape taxonomy from measured item types, organic rank, and AIO observations.",
            required_evidence=("query",),
            questions={
                "serp_shape": {
                    "type": "choice",
                    "instructions": "Classify the live SERP shape from measured features only. Do not invent modules that are not in the state.",
                    "criteria": SERP_SHAPE_CRITERIA,
                },
                "aio_domain_class": {
                    "type": "choice",
                    "instructions": "If AI Overview citations are present, classify the dominant citation domain class.",
                    "criteria": {
                        "publisher": "Editorial publishers and news",
                        "brand": "Target brand or close aliases",
                        "competitor": "Direct competitors",
                        "ugc": "Forums, Reddit, Q&A, social",
                        "gov_edu": "Government or education",
                        "marketplace": "Retail or directory aggregators",
                        "none": "No AIO citations in the measured state",
                        "mixed": "No single class dominates",
                    },
                },
            },
        ),
        DecisionPack(
            id="G4.response_unit.v1",
            version="1.0.0",
            docs="Page vs section vs tool vs hold, plus whether the unit matches the SERP shape.",
            required_evidence=("query",),
            questions={
                "response_unit": {
                    "type": "choice",
                    "instructions": "Which response unit should own this demand?",
                    "criteria": RESPONSE_UNITS,
                },
                "unit_fit": {
                    "type": "noul",
                    "instructions": "The chosen response unit matches what the live SERP is already rewarding.",
                },
            },
        ),
        DecisionPack(
            id="G5.public_ia.v1",
            version="1.0.0",
            docs="Room assignment and cannibal risk versus the existing URL inventory.",
            required_evidence=("query",),
            questions={
                "room": {
                    "type": "choice",
                    "instructions": "Assign this demand to a public IA room.",
                    "criteria": OWNER_ROOMS,
                },
                "cannibal_risk": {
                    "type": "noul",
                    "instructions": "Publishing a new URL for this demand would cannibalize an existing inventory URL.",
                },
            },
        ),
        DecisionPack(
            id="G6.claim_authority.v1",
            version="1.0.0",
            docs="Claim class and evidence strength. YMYL never auto-approves.",
            required_evidence=("query",),
            never_auto=True,
            ymyl_gate=True,
            never_auto_questions=("claim_class",),
            questions={
                "claim_class": {
                    "type": "choice",
                    "instructions": "Classify the primary claim risk if we publish for this demand.",
                    "criteria": CLAIM_CLASSES,
                },
                "evidence_strength": {
                    "type": "score",
                    "instructions": "How strong is the available evidence for the claims this page would need to make?",
                    "criteria": [
                        "No evidence on hand",
                        "Anecdote only",
                        "Internal proof, not public",
                        "Public first-party proof",
                        "Independent third-party proof",
                    ],
                },
            },
        ),
        DecisionPack(
            id="G7.priority.v1",
            version="1.0.0",
            docs="Priority band from attainability (measured) plus business value (judgment).",
            required_evidence=("query",),
            questions={
                "priority_band": {
                    "type": "score",
                    "instructions": "Priority band given measured attainability and stated business value. Use the computed attainability in state; do not recompute volume.",
                    "criteria": [
                        "Drop or archive",
                        "Backlog",
                        "This quarter",
                        "This sprint",
                        "Ship next",
                    ],
                }
            },
        ),
        DecisionPack(
            id="G8.ship_soft.v1",
            version="1.0.0",
            docs="Soft ship-checklist judgments. Hard measured checks (CWV, indexation) stay in code.",
            required_evidence=("query",),
            questions={
                "brief_complete": {
                    "type": "noul",
                    "instructions": "The brief covers query, response unit, IA room, and claim class.",
                },
                "ia_conflict_clear": {
                    "type": "noul",
                    "instructions": "No unresolved public IA or cannibal conflict remains.",
                },
                "claim_path_clear": {
                    "type": "noul",
                    "instructions": "Claim review path is clear or the page is not YMYL.",
                },
                "internal_links_planned": {
                    "type": "noul",
                    "instructions": "Internal link targets from hub and siblings are identified.",
                },
            },
        ),
        DecisionPack(
            id="QA.semantic_cannibal.v1",
            version="1.0.0",
            docs="Pair check: same SERP/intent plus who should own the URL.",
            required_evidence=("query_a", "query_b"),
            default_thresholds=Thresholds(choice_auto=0.88),
            questions={
                "same_serp": {
                    "type": "noul",
                    "instructions": "These two queries would be satisfied by the same live SERP and should not both own a URL.",
                    "criteria": {
                        "true": "Same SERP / same intent; merge or pick one owner",
                        "false": "Different SERPs or different jobs; both can exist",
                    },
                },
                "recommended_owner": {
                    "type": "choice",
                    "instructions": "If they conflict, which query or URL should own the page?",
                    "criteria": {
                        "a": "Query or URL A should own the page",
                        "b": "Query or URL B should own the page",
                        "neither": "Neither should publish yet",
                        "both_ok": "No conflict; both can keep a URL",
                    },
                },
            },
        ),
    ]
