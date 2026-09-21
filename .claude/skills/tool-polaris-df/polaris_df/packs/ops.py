"""Intake, routing, teardown, AEO panel, and SERP-drift packs."""

from __future__ import annotations

from polaris_df.types import DecisionPack


def packs() -> list[DecisionPack]:
    return [
        DecisionPack(
            id="INTAKE.precheck.v1",
            version="1.0.0",
            docs="Flag incomplete or conflicting intake fields before spend.",
            required_evidence=("intake_excerpt",),
            questions={
                "incomplete": {
                    "type": "noul",
                    "instructions": "The intake is missing fields that would waste research spend if we continue.",
                },
                "conflicting": {
                    "type": "noul",
                    "instructions": "The intake fields conflict with each other or with the brand charter.",
                },
            },
        ),
        DecisionPack(
            id="COMP.teardown_lens.v1",
            version="1.0.0",
            docs="Which competitor teardown lens to run.",
            required_evidence=("url",),
            questions={
                "lens": {
                    "type": "choice",
                    "instructions": "Which teardown lens should run first on this competitor URL?",
                    "criteria": {
                        "content": "Copy, IA, and intent",
                        "links": "Referring domains and anchors",
                        "ux": "Page experience and conversion",
                        "aeo": "Extractability and citations",
                        "mixed": "More than one lens is required",
                    },
                }
            },
        ),
        DecisionPack(
            id="OPS.clickup_route.v1",
            version="1.0.0",
            docs="Auto-tag a finding into SEO vs content vs dev vs legal.",
            required_evidence=("finding",),
            questions={
                "owner": {
                    "type": "choice",
                    "instructions": "Which operator queue should own this finding?",
                    "criteria": {
                        "seo": "SEO strategy / Search Command",
                        "content": "Writing or IA",
                        "dev": "Engineering or CMS",
                        "legal": "Legal or compliance",
                        "local": "GBP / citations",
                        "other": "Unclear",
                    },
                }
            },
        ),
        DecisionPack(
            id="AEO.panel_filter.v1",
            version="1.0.0",
            docs="Post-filter raw answer-engine panel text for brand-safe / on-message before it enters a map.",
            required_evidence=("panel_text",),
            questions={
                "brand_safe": {
                    "type": "noul",
                    "instructions": "This panel text is brand-safe to store in the working map.",
                },
                "on_message": {
                    "type": "noul",
                    "instructions": "This panel text is on-message for the brand charter.",
                },
            },
        ),
        DecisionPack(
            id="G3.serp_drift.v1",
            version="1.0.0",
            docs="Nightly SERP-shape drift. Alert only on high-confidence change.",
            required_evidence=("query", "previous_shape", "current_features"),
            questions={
                "shape_changed": {
                    "type": "noul",
                    "instructions": "The live SERP shape has materially changed from the previous token.",
                }
            },
        ),
        DecisionPack(
            id="RESPIRA.patch_qa.v1",
            version="1.0.0",
            docs="Before/after patch: did we fix the intended issue without regressing?",
            required_evidence=("issue", "before_excerpt", "after_excerpt"),
            questions={
                "fixed_intended": {
                    "type": "noul",
                    "instructions": "The after state fixes the intended issue.",
                },
                "regressed": {
                    "type": "noul",
                    "instructions": "The after state introduces a visible regression.",
                },
            },
        ),
    ]
