"""Website audit judgment packs. Crawl numbers stay measured."""

from __future__ import annotations

from polaris_df.types import DecisionPack

TECH_CATEGORIES = {
    "indexation": "robots, noindex, canonical, sitemap",
    "status": "HTTP status, redirects, soft 404",
    "cwv": "Core Web Vitals or heavy assets",
    "mobile": "Mobile usability or viewport",
    "https": "TLS, mixed content, security headers",
    "js": "Client-rendered content risk",
    "ia": "URL structure or parameter issues",
    "other": "Does not fit the listed categories",
}

WORKSTREAMS = {
    "tech": "Engineering / CMS",
    "content": "Writing or IA",
    "links": "Digital PR or internal links",
    "aeo": "Answer-engine packaging",
    "geo": "Generative engine citations",
    "local": "GBP / NAP / location pages",
    "other": "Unclear owner",
}


def packs() -> list[DecisionPack]:
    return [
        DecisionPack(
            id="AUDIT.tech_severity.v1",
            version="1.0.0",
            docs="Tech issue triage: severity, category, and whether it blocks indexing.",
            required_evidence=("url", "issue"),
            questions={
                "severity": {
                    "type": "score",
                    "instructions": "How severe is this technical issue for search visibility?",
                    "criteria": [
                        "Cosmetic only",
                        "Minor; watch",
                        "Should fix this quarter",
                        "Blocks a template or section",
                        "Blocks indexing or conversion now",
                    ],
                },
                "category": {
                    "type": "choice",
                    "instructions": "Which technical bucket does this issue belong to?",
                    "criteria": TECH_CATEGORIES,
                },
                "blocks_indexing": {
                    "type": "noul",
                    "instructions": "This issue prevents Google from indexing the URL or template.",
                },
            },
        ),
        DecisionPack(
            id="AUDIT.onpage_quality.v1",
            version="1.0.0",
            docs="On-page quality: intent match, thin/duplicate/outdated, primary intent.",
            required_evidence=("url",),
            questions={
                "intent_match": {
                    "type": "score",
                    "instructions": "How well does the page match the apparent primary query intent?",
                    "criteria": [
                        "Wrong intent",
                        "Partial match",
                        "Mostly matches",
                        "Clear primary-intent match",
                    ],
                },
                "thin": {
                    "type": "noul",
                    "instructions": "The page is thin relative to what the SERP rewards.",
                },
                "duplicate": {
                    "type": "noul",
                    "instructions": "The page is duplicate or near-duplicate of another URL on the site.",
                },
                "outdated": {
                    "type": "noul",
                    "instructions": "The page is outdated in a way that would lose trust or citations.",
                },
                "primary_intent": {
                    "type": "choice",
                    "instructions": "Primary intent the page should serve.",
                    "criteria": {
                        "informational": "Explain or teach",
                        "commercial": "Compare or evaluate",
                        "transactional": "Convert",
                        "navigational": "Brand destination",
                        "local": "Nearby service",
                    },
                },
            },
        ),
        DecisionPack(
            id="AUDIT.content_gap.v1",
            version="1.0.0",
            docs="Competitor keyword or topic gap triage.",
            required_evidence=("query",),
            questions={
                "opportunity": {
                    "type": "score",
                    "instructions": "How strong is this as a content gap for the brand?",
                    "criteria": [
                        "Ignore",
                        "Weak adjacency",
                        "Worth a brief",
                        "Priority gap",
                    ],
                },
                "response_unit": {
                    "type": "choice",
                    "instructions": "What unit should capture this gap?",
                    "criteria": {
                        "page": "New URL",
                        "section": "Add to an existing URL",
                        "hub": "New hub",
                        "spoke": "Spoke under an existing hub",
                        "hold": "Not yet",
                        "other": "Other",
                    },
                },
                "brand_fit": {
                    "type": "noul",
                    "instructions": "This gap sits inside brand territory and ICP language.",
                },
            },
        ),
        DecisionPack(
            id="AUDIT.aeo_cite.v1",
            version="1.0.0",
            docs="AEO cite-worthiness and missing extractability pieces.",
            required_evidence=("query",),
            questions={
                "cite_worthiness": {
                    "type": "score",
                    "instructions": "How cite-worthy is the current page or draft for this query?",
                    "criteria": [
                        "Not citable",
                        "Citable after a rewrite",
                        "Mostly extractable",
                        "Ready to cite as-is",
                    ],
                },
                "missing_entity": {
                    "type": "noul",
                    "instructions": "A clear entity definition is missing.",
                },
                "missing_faq": {
                    "type": "noul",
                    "instructions": "A question-and-answer block the engine could lift is missing.",
                },
                "missing_schema": {
                    "type": "noul",
                    "instructions": "Relevant schema for this answer format is missing.",
                },
                "answer_format": {
                    "type": "choice",
                    "instructions": "Best answer format to add.",
                    "criteria": {
                        "definition": "Short definition block",
                        "steps": "Numbered steps",
                        "table": "Comparison table",
                        "faq": "FAQ pairs",
                        "stats": "Sourced statistics",
                        "other": "Other",
                    },
                },
            },
        ),
        DecisionPack(
            id="AUDIT.geo_citation.v1",
            version="1.0.0",
            docs="GEO citation likelihood across ChatGPT / Perplexity / Gemini style engines.",
            required_evidence=("query",),
            questions={
                "citation_likelihood": {
                    "type": "score",
                    "instructions": "How likely is this brand URL to be cited for this query in the named engine?",
                    "criteria": [
                        "Near zero",
                        "Unlikely without third-party mentions",
                        "Possible with on-page work",
                        "Likely if we ship the pack",
                    ],
                },
                "claim_support": {
                    "type": "noul",
                    "instructions": "The page currently supports the claims an engine would need to quote.",
                },
                "competitor_owns": {
                    "type": "noul",
                    "instructions": "A competitor currently owns the citation slot for this query and engine.",
                },
            },
        ),
        DecisionPack(
            id="AUDIT.finding_priority.v1",
            version="1.0.0",
            docs="Finding dedupe and priority. Narrative is written later, only for top-N.",
            required_evidence=("finding",),
            questions={
                "merge": {
                    "type": "noul",
                    "instructions": "This finding should merge into another finding already listed.",
                },
                "priority": {
                    "type": "score",
                    "instructions": "Priority of this finding given business goals and impact proxies in state.",
                    "criteria": [
                        "Internal note only",
                        "Backlog",
                        "This month",
                        "This week / client-visible",
                    ],
                },
                "visibility": {
                    "type": "choice",
                    "instructions": "Should this finding be client-facing or internal?",
                    "criteria": {
                        "client_facing": "Show in the client audit",
                        "internal": "Keep on the working list",
                        "drop": "Do not keep",
                    },
                },
                "workstream": {
                    "type": "choice",
                    "instructions": "Which workstream owns the fix?",
                    "criteria": WORKSTREAMS,
                },
            },
        ),
    ]
