# Self-Audit — AC Short Cycling

**Spoke:** AC Short Cycling
**Slug:** `/blog/ac-short-cycling/` (legacy URL preserved)
**Drafted:** 2026-05-11
**Intent:** transactional ($7.20 CPC, KD 10 — highest competitive density in batch 2)
**Mode:** audit-and-fix replacement of legacy stub (1,455 words, 1 H2, image-alt-text H1)

---

## Page-type SOP choice

**Blog Article SOP v1.1** (primary). Citation Discipline SOP cross-cuts.

Worth flagging: this spoke targets transactional intent per the cluster strategy doc. The Service Page SOP would otherwise be relevant for transactional pages, but this is a blog article that *carries* commercial weight, not a service page. The decision: Blog Article SOP with heavier CTA emphasis from the Service Page SOP's §5.1 CTA cadence rule (minimum 5 CTA placements). Actual CTAs in this spoke: phone in lead's Quick Answer (1), inline phone in the stakes block (1), full CTA band mid-page (1), phone in the "Past the filter?" callout (1), phone in hub-link block intro (referenced through hub CTAs counting as 2), final CTA band with prominent button (1). Total: 6+ CTA touchpoints across the two widgets — above the Service Page SOP's minimum 5 even though this is a blog post.

---

## Stop Slop scan

Zero §8.1, §8.2, §8.3 violations. Specific patterns grep-checked:
- Banned phrases (§8.1 full list): zero.
- Binary contrasts ("It's not X. It's Y."): zero. The "design cause vs failure-mode cause" framing is presented as two complementary categories with substantive content for each — not a rhetorical contrast.
- One-word fragments: zero.
- Rule of three: the lists of three in the draft (emergency scenarios, prevention habits, etc. — same patterns as Spokes 1-3) are factual enumerations passing §8.2 v1.1 test.
- Em-dash reveals: parenthetical use only; no punchy payoffs.
- Adverb-ly softeners: zero "really", "very", "actually", "just", "simply" in body prose.

---

## Schema validation

Four JSON-LD blocks emitted:

1. **Article** — fixes broken canonical (legacy was likely the doubled-slug pattern), Organization-as-author per session pattern, article-specific mentions array (9 entities including Manual J load calculation as a distinctive entity for this spoke).
2. **HowTo** — 7 steps mapping to the diagnostic flow. The 7 HowTo steps are not identical to the 7 numbered causes in the visible body — instead, they describe the homeowner's action sequence: check filter, check thermostat location, inspect condenser, check for frozen coil, time the cycles, call, schedule. This is the correct HowTo mapping because HowTo schema describes a procedure (what to do), and the visible 7 causes describe a taxonomy (what could be wrong). Both are valid information; HowTo serves the procedure shape.
3. **FAQPage** — 6 Qs matching widget 2 visible FAQ one-to-one.
4. **BreadcrumbList** — Home → Blog → AC Short Cycling.

Schema publisher phone: `+1-843-238-3838` per session spec.

---

## Elementor widget validity

All standard gates pass. New style elements vs prior spokes:
- `.ccc-spoke-stakes` — red-bordered block for the "Why this matters more than other AC symptoms" callout. Red is chosen deliberately to underscore the compressor-wear urgency.
- `.ccc-spoke-cta-band` — full-width gradient CTA band with button, mid-page. New treatment specific to the transactional spoke. Includes both inline copy and a prominent button.
- `.ccc-final-callout` — enlarged version of the prior spokes' final CTA block, with the stakes-based headline ("Stop the cycling. Save the compressor.") more prominent than the prior spokes' versions.
- Accent color plum/burgundy `#7c2d5a` — distinct from Spoke 1 (`#0a558c`), Spoke 2 (`#1a73a8`), Spoke 3 (`#14524f`). No adjacent-spoke duplication.

---

## Transactional intent emphasis

Distinct from Spokes 1-3 in three ways:

1. **Stakes block above the fold.** A red-bordered "Why this matters more than other AC symptoms" block appears between the Quick Answer and the diagnostic. It names compressor wear and electric bill cost as the consequences of waiting. Spokes 1-3 don't carry this block — those symptoms have implicit urgency (frozen coil, water damage, no cooling) and don't need a stakes framing.

2. **CTA band mid-page.** A full-width gradient CTA band ("Short cycling is wearing your compressor with every cycle. Don't wait this one out") appears between the "Should you try to fix it yourself, or call?" section and the "Past the filter?" callout. This is the Service Page SOP's mid-page CTA pattern applied to a blog-article structure.

3. **Final CTA band, not just a callout.** Widget 2 closes with a prominent CTA band (stakes-headline, body, prominent button) rather than the simpler colored callout used in Spokes 1-3.

The overall structure still follows the cluster's blog-article template; the CTA weight is layered on top, not in place of it.

---

## Citation discipline

Per session no-fabrication rule, all unsourceable quantified claims dropped. See `removed-claims.md` — 21 claims across 6 categories (cost, lifespan, statistic, climate, response time, credential). The transactional intent made this spoke the hardest to write under no-fab — the natural sales pitch wants quantified savings/loss numbers that aren't sourceable in-session. Stakes framing converted to qualitative ("meaningfully less efficient," "trades a routine repair today for a compressor replacement sooner") rather than quantified loss claims.

5 retained claims need inline-citation polish (15-20 min healthy cycle, 5-10 min short-cycle threshold, R-22 phaseout, R-410A/R-454B refrigerants, Manual J as ACCA-standard sizing method).

---

## Keyword placement

- **Primary keyword "AC short cycling"** in H1 (rephrased as "AC Keeps Turning On and Off" + Lowcountry positioning, with "short-cycling" in the descriptor), schema headline, first sentence of body (Quick Answer opens "Short cycling is when..."), every section heading throughout body, FAQ questions, schema mentions array (`Compressor wear`, `Run capacitor`, etc.). Semantic variants in body: "AC keeps turning on and off", "AC cycles", "cycling on and off", "short-cycling", "cycle frequency".
- **Primary keyword in first 100 words:** ✓
- **Brand name in first sentence of body:** ✓ (Quick Answer references "Coastal Carolina Comfort resolves most short-cycling diagnoses...").

---

## Brand-mention density

Body word count ~2,900 (widget 1 + widget 2 prose, excluding schema). Target: ~22 mentions. Actual: 22 "Coastal Carolina Comfort" + 1 "Coastal" shortform = 23 mentions. ✓ On target.

---

## Expert attribution

Same pattern as Spokes 1-3 — placeholder visible byline, brand-as-expert throughout. Polish task: convert to named-Person when credentialed bio exists.

---

## "We" violation scan

Zero bare "we". ✓

---

## Phone / NAP

- Tel: links: `(843) 708-8735` ✓ (used 6 times across the two widgets — heaviest of all four spokes per transactional intent)
- Schema publisher: `+1-843-238-3838` ✓

---

## Removed-claims summary

See `removed-claims.md`. 21 claims dropped across 6 buckets:
- Cost-related (7)
- Component lifespan (4)
- Industry-benchmark stats (4)
- Climate / regional quantified (3)
- Repair / response time (2)
- Credential / authority (3)

Plus 5 retained claims flagged for inline-citation polish.

---

## Structural differences from Spokes 1, 2, 3

- **Stakes block above-the-fold** — exclusive to this spoke.
- **CTA band mid-page** with prominent button — exclusive to this spoke.
- **Enlarged final CTA** with stakes-based headline — exclusive to this spoke.
- **7 causes structured as numbered cause-blocks** (similar to Spoke 3's 5-cause structure, not the linear-step pattern of Spokes 1 and 2). The cause-block treatment is right when the diagnostic is "identify which of N causes" rather than "walk through N steps in order."
- **HowTo schema's 7 steps describe the homeowner's action sequence** (check filter, check thermostat, etc.), not the 7 numbered causes from the visible body. This is the correct mapping per HowTo schema semantics — procedure shape, not taxonomy shape. Spoke 1 and 2 used identical 7-step content for visible body and HowTo schema because those diagnostics WERE procedural. This spoke separates them because the visible content is taxonomic.

---

## Conclusion

Spoke 4 audit cleared. Heaviest CTA weight in the batch, most challenging citation discipline given transactional intent, but the structure and audit gates all pass. Legacy stub replaced with comprehensive ~2,900-word diagnostic spanning all 7 cause categories with proper HowTo + FAQPage + BreadcrumbList schema and Lowcountry-specific framing throughout.

No structural pattern issues. Ready for NOTES.md consolidation and Downloads bundle.
