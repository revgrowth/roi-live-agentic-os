# Learnings Journal — ROI.LIVE

> Auto-maintained by Agentic OS skills. Newest entries at the bottom of each section.
> Skills append here after deliverable feedback. Never delete entries.
> Section headings match skill folder names exactly. New skills add their own section when created.
> Skills read only their own section before running. Cross-skill insights go in `general`.

# General
## What works well

- 2026-04-22: Voice discipline is enforced, not preferred. Every publishable text output runs through `tool-humanizer` and must pass Core Standards Phase 8 banned-phrase scan before saving. See `agency/sops/ROI-LIVE-Agency-Core-Standards-v1.1.md`.
- 2026-04-22: Receipts, not generalities. Any claim about outcomes, benchmarks, or results should carry a client name (if cleared), a date, and a number. If the data isn't available, name the gap rather than invent directional confidence.
- 2026-04-22: Peer-to-peer register. Jason is an operator, not an end user. No coaching tone, no hedging, no explaining-the-basics unless he asked. Tradeoffs named in dollars, timeline, or opportunity cost.
- 2026-04-22: Cross-industry is the house move. A cross-vertical analog (e-commerce principle applied to HVAC, pool-builder math applied to DTC) usually lands harder than an abstract principle stated alone.

## What doesn't work well


# Individual Skills
## mkt-brand-voice

- 2026-04-22: Source-of-truth hierarchy for ROI.LIVE voice work. When running brand-voice, import from existing docs in priority order: (1) deployed homepage HTML, (2) Signal SOP v2 Phase 5.2, (3) Core Standards v1.1 Phase 8 (banned phrases), (4) Client Parameter Sheet voice-profile section. Don't re-extract from scratch — the existing docs are more complete than any interview would produce.
- 2026-04-22: Experience numbers unsettled. Signal SOP says "30+ years," Jason said "18 years / 55+ industries" in /start-here. Voice profile defaults to 18 / 55+ as the more recent / specific. Confirm before external use.

## mkt-positioning

- 2026-04-22: Primary angle = "The Unified Strategy + Execution Operator" — Jason holds the CMO seat AND owns the agency executing against it. Secondary hooks: Receipt Keeper, Operator-Not-Pundit, Quiet Part Out Loud, Cross-Industry Pattern-Finder. See `brand_context/positioning.md` for the full angle map.
- 2026-04-22: Full competitive search not yet run. Current positioning is built from Jason's own category description, not scraped competitor headlines. Re-run with a proper competitor list when a campaign needs sharper white-space claims.

## mkt-icp

- 2026-04-22: Three-segment ICP structure. Primary is a composite founder profile; three distinct segments under it — e-commerce ($0-3M scaling to 7-figures+), local service (HVAC / landscaping / pool / home contractor, $1-5M scaling to $5-15M+), B2B (service or product-led, $10K-$250K deal sizes). Per-segment voice variants worth building when a campaign or landing page needs to hit one.

## str-ai-seo

- 2026-04-22: For any ROI.LIVE-branded AEO/AI-SEO work, use Signal SOP Phase 7 + Core Standards Phase 7 as the ruleset, not generic AEO best practices. Casey Keith entity rules (ROI.LIVE bolded 25+ times per pillar, Jason Spencer named 12-18×, zero bare "we," banned-phrase scan) are non-negotiable.

### 2026-04-26 — Phase 0 must check for existing article before any production work

**Source:** Delta Audit spoke article task

**What happened:** Brief asked for "first supporting spoke" on a methodology that already had a published 407-line article using identical branding (The Delta Audit), HowTo schema, and named scoring criteria. Claude Code's Phase 0 reconnaissance caught the duplicate before any writing started.

**Lesson:** Every Signal article task starts with three greps:
1. `grep -rn "[methodology name]" /path/to/website-repo`
2. `grep -rn "[primary keyword candidate]" /path/to/website-repo`
3. Read the Signal hub HTML and confirm cluster article count vs brief assumption

**SOP candidate:** Add explicit "Phase -1: Existing-content audit" step to Signal Article SOP v2 before Phase 0 keyword research. Block all production work until existing-content sweep passes.

### 2026-04-26 — Keyword research must validate brief assumptions before article work

**Source:** Delta Audit spoke article — Phase 1 keyword research

**What happened:** Brief proposed 4 candidate primary keywords ("information gain audit", "content audit for information gain", "how to measure information gain", "content originality audit"). All 4 returned null volume in DataForSEO (both Google Ads and Clickstream sources). Adjacent keyword research surfaced "seo content audit" (390/mo, KD 14) as the strongest fit, plus "delta audit" (20/mo, KD 0) for branded entity play. Without keyword validation, article would have optimized for a zero-volume target.

**Lesson:** DataForSEO check on ALL brief-proposed candidates is mandatory before any title/H1/H2 decisions. Long-tail brief assumptions often have no measurable volume. Adjacent keyword expansion (broader head terms, semantic variants, branded variants) is part of Phase 1, not optional.

**SOP candidate:** Update Signal Article SOP Phase 4.1 (keyword research) to require:
1. DataForSEO check on every brief-proposed candidate
2. If all candidates return null/sub-threshold, expand to adjacent keywords using head terms and semantic variants before defaulting to brief's original candidates
3. Hybrid keyword strategy (process keyword + branded entity) as default for ROI.LIVE methodology articles where a named methodology exists

**Cost note:** 4 keyword research API calls cost $0.17. Negligible. No reason to skip this step ever.

### 2026-04-26 — Banned-phrase scan must run after every patch pass, not just final QA

**Source:** Delta Audit spoke article — Improvement 2

**What happened:** Cross-industry callout block introduction included "what makes" phrasing — banned per SOP §8. Caught during in-patch banned-phrase scan, not at final QA. If only end-of-pass QA had run, this would have shipped or required a second patch round.

**Lesson:** Banned-phrase scan is part of every patch operation, not just final QA. Each new content block gets a scan immediately after writing, not at the end of the batch.

**SOP candidate:** Update SOP Phase 11 checklist to require: "After each patch operation that adds or modifies prose, run banned-phrase scan on the modified content before moving to the next operation."

## tool-humanizer

- 2026-04-22: Mandatory gate for ROI.LIVE publishable output. Every skill producing text for publication under the ROI.LIVE brand runs output through tool-humanizer before saving. Use `deep` mode (voice-profile loaded). Skip only for research briefs, ICP docs, positioning docs, and internal-only artifacts.
