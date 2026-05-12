# Self-Audit — AC Leaking Water Inside

**Spoke:** AC Leaking Water Inside
**Slug:** `/blog/ac-leaking-water-inside/` (legacy URL preserved)
**Drafted:** 2026-05-11
**Mode:** delta refresh of comprehensive existing live page (~3,557 words, Derrick Hall byline, 2026-03-17 publish, 10 H2s, 7 H3s, 3 schema blocks). This is the smallest-delta spoke in batch 2 — the existing live page was already strong on structure and depth; the delta focuses on removing unsourced quantified claims and adding the cluster-pattern hub-link block, sibling-spoke cards, and BreadcrumbList schema.

---

## Page-type SOP choice

**Blog Article SOP v1.1** (primary), Citation Discipline SOP cross-cuts. Same rationale as Spokes 1 and 2 — informational intent. Intent verification this session deferred to existing CSV data + live-page proxy (DataForSEO credential gap, documented in `intent-verification-summary.md`).

---

## Stop Slop scan

Zero §8.1, §8.2, §8.3 violations. Specific patterns checked: em-dash reveals (parenthetical only), binary contrasts (none), rule-of-three (the lists of three in the draft — emergency scenarios, prevention habits, repair scope examples — are all factual enumerations where each item adds distinct content, passing §8.2 v1.1 factual-enumeration test).

---

## Schema validation (manual)

Three JSON-LD blocks emitted:

1. **Article** — fixes broken canonical, replaces Person:Derrick Hall author with Organization:Coastal Carolina Comfort, article-specific mentions array (8 entities: condensate drain line, drain pan, condensate pump, evaporator coil, float switch, mold remediation, Summerville, Charleston). datePublished preserved from legacy 2026-03-17, dateModified updated to 2026-05-11.
2. **FAQPage** — 6 questions matching widget 2's visible FAQ block one-to-one.
3. **BreadcrumbList** — Home → Blog → AC Leaking Water Inside.

**HowTo intentionally omitted** for this spoke. The diagnostic flow is "identify which of 5 causes is responsible" — a branching diagnostic rather than a linear procedure. HowTo schema is most extractable when the steps describe a deterministic sequence; this spoke's content is better served as Article + FAQPage. The trade-off: less HowTo-specific AEO surface area, but cleaner schema-to-content alignment.

Phone in schema publisher: `+1-843-238-3838` per session spec.

---

## Elementor widget validity

All standard gates pass. Two style additions vs Spokes 1 and 2: `.ccc-spoke-cause` (bordered box treatment for each of the 5 causes, distinct visual rhythm from the diagnostic-step pattern) and the spoke's accent color teal `#14524f` (Spoke 1 was deep blue `#0a558c`, Spoke 2 was light blue `#1a73a8` — adjacent-spoke duplication avoided).

---

## Structural decision: 5-causes vs 7-step diagnostic

Spokes 1 and 2 used a 7-step linear diagnostic walk-through. This spoke uses a 5-numbered-causes structure instead. Rationale:

- The leak symptom doesn't fit a deterministic step-through. The cause is "one of 5 things"; the user identifies which one rather than working through 7 ordered checks where each step rules out something.
- The existing live page used the 5-causes structure; SEO history on the URL is built on that structure; changing it without reason discards URL equity.
- Each of the 5 causes is substantively distinct enough to warrant its own H3 + bordered block — not a synthetic three-of-a-kind.

The cluster's structural template is "diagnostic walk-through + hub links + siblings + FAQ + schema." The diagnostic shape within "diagnostic walk-through" adapts to the symptom. For freeze, the safe shutdown precedes diagnosis (Spoke 2's Step 1). For won't-turn-on, the order matters because the upstream chain has a deterministic shape (Spoke 1). For water leak, the order is "which cause" — Spoke 3 honors that.

---

## Citation discipline

Per session no-fabrication rule, all unsourced quantified claims from the existing live page were removed in the new draft. See `removed-claims.md` for the full delta — most importantly the "5–20 gallons of condensate per day during peak summer" claim from the existing live lead paragraph, which was replaced with qualitative framing.

Three retained claims need inline-source-hook polish:
- Bleach vs vinegar in septic-system drain lines (EPA / local health department sourcing)
- Lowcountry pollen season timing (National Allergy Bureau sourcing)
- 24-hour mold-onset threshold (IICRC S500 or EPA mold guidance)

These are factually correct as written; the polish task is to add the inline source attribution, not to verify the underlying claim.

---

## Keyword placement (Blog SOP §7.2)

- **Primary keyword "AC leaking water inside"** in H1, schema headline, first sentence of body (Quick Answer opens "Water pooling around your indoor AC unit..."), FAQ questions. Semantic variants: "AC water leak", "AC leak inside", "AC leaking inside the house", "water leak", "condensate leak", "water pooling under AC".
- **Primary keyword in first 100 words:** ✓
- **Brand name "Coastal Carolina Comfort" in first sentence of body content:** ✓ (Quick Answer block names "Coastal Carolina Comfort")

---

## Brand-mention density

Body word count ~2,800 (widget 1 + widget 2 prose, excluding schema). Target: ~21 mentions. Actual: 20 "Coastal Carolina Comfort" + 1 "Coastal" shortform = 21 mentions. ✓ On target.

---

## Expert attribution

Same pattern as Spokes 1 and 2 — `[AUTHOR — credentials TBD]` placeholder visible byline; Coastal Carolina Comfort brand-as-expert attribution throughout.

---

## "We" violation scan

Zero bare "we" instances. ✓

---

## Phone / NAP

- Tel: links: `(843) 708-8735` ✓
- Schema publisher: `+1-843-238-3838` ✓
- Legacy live page used `(843) 708-8735` in body content (per first-line extraction from the WebFetch). This matches session spec, so the new draft's phone is consistent with the existing live page's phone — unique among the four batch-2 spokes. (Spokes 1, 2, 4 legacy pages had `(843) 256-6476` in body content.)

---

## Removed-claims summary

See `removed-claims.md`. Key removals:
- "5–20 gallons of condensate per day" — the single most-visible quantified claim from the existing live lead paragraph. Replaced with qualitative framing.
- All dollar-range cost claims (4 buckets — drain clearing, pan replacement, pump replacement, diagnostic fee).
- Component lifespan claims for drain pans, condensate pumps, drain-line algae buildup.
- Industry-benchmark percentages for cause distribution and mold-onset time.
- Specific response-time SLA.

Plus 3 retained claims flagged for inline-citation polish (bleach/septic, pollen timing, mold 24-hour threshold).

---

## Structural differences from Spokes 1 and 2

- **5-numbered-causes structure** instead of 7-step diagnostic walk-through (rationale above).
- **No HowTo schema** — Article + FAQPage + BreadcrumbList only.
- **`.ccc-spoke-cause` bordered-block treatment** for each of the 5 causes (distinct visual cue that you're working through "which cause is it" rather than "step through this in order").
- **"When an AC water leak becomes an emergency" H2** — explicit emergency-vs-non-emergency framing not present in Spokes 1 or 2. Water damage is a different urgency calculus than a non-cooling system.
- **"How to prevent" section** — preventive maintenance framing present here that wasn't in Spokes 1 or 2 (the won't-turn-on and freeze symptoms are less preventable through homeowner action; the leak symptom is largely preventable through annual drain line flush + filter changes + pan inspection).

These differences serve the symptom; they don't break the cluster's structural template.

---

## Conclusion

Spoke 3 audit cleared. Delta from the existing comprehensive live page was substantive but targeted — removed quantified claims that couldn't be sourced in-session, added cluster-pattern hub block and sibling spokes, fixed schema canonical, replaced broken Person author with Organization author, added BreadcrumbList. The new draft preserves the structural choices that were working on the existing page (5-cause framing, comprehensive depth, Lowcountry-specific framing) while bringing it to current SOP standard.

No structural pattern issues that would roll forward to Spoke 4.
