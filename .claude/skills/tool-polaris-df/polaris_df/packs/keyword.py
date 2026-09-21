"""Keyword research judgment packs. Volume, KD, and SERP stay measured."""

from __future__ import annotations

from polaris_df.types import DecisionPack

INTENTS = {
    "informational": "Learn or understand; no immediate transaction",
    "commercial": "Compare options before a decision",
    "transactional": "Ready to buy, book, or request",
    "navigational": "Looking for a specific brand or URL",
    "local": "Nearby provider, hours, or service area",
}

FUNNEL = {
    "aware": "Problem awareness",
    "consider": "Evaluating approaches",
    "decide": "Choosing a provider or product",
    "act": "Transaction or booking",
    "retain": "After the sale",
}


def packs() -> list[DecisionPack]:
    return [
        DecisionPack(
            id="KW.keep_drop.v1",
            version="1.0.0",
            docs="Seed-expansion filter: keep or drop, plus sense disambiguation.",
            required_evidence=("query",),
            questions={
                "keep": {
                    "type": "noul",
                    "instructions": "Keep this keyword in the working library for this brand and territory.",
                },
                "sense": {
                    "type": "choice",
                    "instructions": "Which sense of the terms is this query using?",
                    "criteria": {
                        "brand_sense": "Matches the brand category sense",
                        "adjacent_sense": "Related but not core",
                        "wrong_sense": "Homonym or other industry",
                        "unknown": "Cannot tell from the state",
                    },
                },
            },
        ),
        DecisionPack(
            id="KW.intent.v1",
            version="1.0.0",
            docs="Classic search intent label. Does not change measured volume.",
            required_evidence=("query",),
            questions={
                "intent": {
                    "type": "choice",
                    "instructions": "Primary search intent for this query.",
                    "criteria": INTENTS,
                }
            },
        ),
        DecisionPack(
            id="KW.cluster_assign.v1",
            version="1.0.0",
            docs="Assign a query to one of the candidate cluster IDs (max 255) or other.",
            required_evidence=("query", "candidate_clusters"),
            questions={
                "cluster": {
                    "type": "choice",
                    "instructions": "Which candidate cluster should own this query?",
                    "criteria_from": "candidate_clusters",
                }
            },
        ),
        DecisionPack(
            id="KW.hub_spoke.v1",
            version="1.0.0",
            docs="Parent versus child role inside a cluster.",
            required_evidence=("query",),
            questions={
                "role": {
                    "type": "choice",
                    "instructions": "Is this query a hub, a spoke, or an orphan?",
                    "criteria": {
                        "hub": "Parent topic that should own the cluster URL",
                        "spoke": "Child supporting a hub",
                        "orphan": "No clear parent in the current set",
                    },
                }
            },
        ),
        DecisionPack(
            id="KW.funnel.v1",
            version="1.0.0",
            docs="Funnel stage label for content planning.",
            required_evidence=("query",),
            questions={
                "funnel_stage": {
                    "type": "choice",
                    "instructions": "Which funnel stage does this query serve?",
                    "criteria": FUNNEL,
                }
            },
        ),
        DecisionPack(
            id="KW.aeo_question.v1",
            version="1.0.0",
            docs="AEO question fitness: question-shaped plus answerability.",
            required_evidence=("query",),
            questions={
                "is_question_shaped": {
                    "type": "noul",
                    "instructions": "This query is question-shaped or maps cleanly to a question an answer engine would ask.",
                },
                "answerability": {
                    "type": "score",
                    "instructions": "How answerable is this with a short, citable passage the brand can own?",
                    "criteria": [
                        "Not answerable in a passage",
                        "Needs a long guide",
                        "Answerable with caveats",
                        "Clean short-answer target",
                    ],
                },
            },
        ),
        DecisionPack(
            id="KW.geo_entity.v1",
            version="1.0.0",
            docs="GEO entity fitness: clear entity and brand association.",
            required_evidence=("query",),
            questions={
                "has_clear_entity": {
                    "type": "noul",
                    "instructions": "This query names or implies a clear entity an answer engine can ground.",
                },
                "brand_association": {
                    "type": "score",
                    "instructions": "How strongly should the brand be associated with this entity in GEO answers?",
                    "criteria": [
                        "No brand association",
                        "Weak / generic category",
                        "Reasonable category owner",
                        "Brand should be the cited entity",
                    ],
                },
            },
        ),
    ]
