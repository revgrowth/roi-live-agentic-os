# Self-Audit — AC Frozen Evaporator Coil

**Spoke:** AC Frozen Evaporator Coil
**Slug:** `/blog/ac-frozen-evaporator-coil/` (legacy URL preserved)
**Drafted:** 2026-05-11
**Mode:** audit-and-fix replacement of live legacy stub (1,419 words, 1 H2, broken schema canonical, no FAQPage/HowTo)
**Audit gates:** mirror Spoke 1's `self-audit.md` structure; deltas noted where this spoke differs from Spoke 1.

---

## Page-type SOP choice

**Blog Article SOP v1.1** (primary), Citation Discipline SOP cross-cuts. Same rationale as Spoke 1 — informational intent, AIO-dominant SERP with brand-authoritative + community citation pattern verified Phase 1 (`ac frozen` returned AIO with Trane, Petro, Carrier, AireServ, Reddit, YouTube citations).

---

## Stop Slop scan

Zero §8.1 banned-phrase violations. Zero §8.2 banned-structure violations (no binary contrasts, no one-word fragments, no em-dash reveals, no rhetorical three-lists — the three-item lists in the draft are factual enumerations: airflow causes (5 items, not 3), repair scopes (4 items), Lowcountry reasons (3 items, each substantively distinct and removable from the list would break the argument — passes §8.2 v1.1 factual-enumeration test). Zero §8.3 voice violations.

Specific banned phrases grep-checked: "lean into", "delve into", "navigate the complex landscape", "robust solution", "seamless experience", "cutting-edge", "world-class", "holistic approach", "at its core", "the reality is", "when it comes to", "it turns out that" — none present.

---

## Schema validation (manual)

Four JSON-LD blocks emitted:

1. **Article** — fixes legacy broken canonical (`/ac-frozen-evaporator-coil/ac-frozen-evaporator-coil/`) to the rendered URL `/blog/ac-frozen-evaporator-coil/`. Article-specific `mentions` (8 entities including EPA Section 608, R-22, blower motor, compressor slugging — not copied from Spoke 1's mentions array). `author: Organization` (Coastal Carolina Comfort), same rationale as Spoke 1 — broken Person `Derrick Hall → /author/revgrowth/` removed.
2. **HowTo** — 7 steps matching widget 1's 7-step diagnostic walk-through. `totalTime: PT3H` reflects the lead "one to three hours" thaw window in the FAQ.
3. **FAQPage** — 6 Q&As, schema text verbatim from visible FAQ block.
4. **BreadcrumbList** — Home → Blog → AC Frozen Evaporator Coil.

Phone in schema publisher: `+1-843-238-3838` per session spec.

---

## Elementor Custom HTML widget validity

All same gates as Spoke 1 pass: no html/head/body wrappers, scoped CSS (`.ccc-spoke-frozen` and `.ccc-spoke-frozen-b`), inline styles, semantic HTML, tap-to-call format `tel:8437088735`, absolute on-domain URLs.

Two new style elements vs Spoke 1: `.ccc-spoke-warning` (red-bordered safety block for the "do not chip the ice" callout) and the otherwise-shared callout/quick-answer/hub-grid/sibling-list/faq-item patterns are reused with the spoke's accent color (blue `#1a73a8` for this spoke; Spoke 1 used `#0a558c` — accent color rotation per Blog SOP §10.1, no adjacent-spoke duplication).

---

## Structural match against /blog/ac-not-cooling/ reference

Same section flow as Spoke 1, adapted for the freeze symptom:

| AC Not Cooling section | This spoke's equivalent |
|---|---|
| Lead + Quick Answer | ✓ (Quick Answer emphasizes the immediate shut-off action) |
| "Why a residential AC stops cooling" | ✓ "Why an AC evaporator coil freezes" |
| 7-step diagnostic | ✓ (Step 1 here is the safety shut-off; AC Not Cooling Step 1 is the thermostat — distinct content) |
| "Should you keep going, or stop and call?" | ✓ |
| "A safety note" | ✓ (red-bordered warning block, do-not-chip directive) |
| Contact callout | ✓ |
| Cost section (qualitative, no dollar ranges) | ✓ "What a frozen-coil repair involves" |
| Lowcountry-specific failure context | ✓ "Why Lowcountry coils freeze more often than inland systems" |
| Hub link block + Related spokes + FAQ + Schema | ✓ Widget 2 |

---

## Citation discipline

Per the no-fabrication rule, all quantified specifics that couldn't be sourced in-session were removed. 19 specific claims considered and dropped — see `removed-claims.md`. Three regulatory references retained (EPA Section 608, R-22 phaseout, R-410A/R-454B refrigerant identifiers) — these are factual statements verifiable at epa.gov but lack inline source hooks in this draft. Polish-session task to add the inline hooks per Citation Discipline SOP §7.4.

One qualitative-only claim that would benefit from a source in polish: "Coastal Carolina Comfort sees this failure pattern across Summerville and Charleston every summer" — this is brand-experience attribution rather than a stat, but Coastal internal data would convert it to a stronger evidence claim.

---

## Keyword placement (Blog SOP §7.2)

- **Primary keyword "AC frozen evaporator coil"** in H1, schema headline, first paragraph (Quick Answer), and FAQ answers. Semantic variants: "frozen AC", "frozen coil", "AC freezes", "frozen evaporator", "ice on the coil", "coil freezes up", "frozen AC unit", "AC keeps freezing" (FAQ).
- **Primary keyword in first 100 words:** ✓ ("A frozen AC evaporator coil..." in Quick Answer opening sentence).
- **Brand name in first sentence of body:** ✓ ("Coastal Carolina Comfort sees this failure pattern..." in Quick Answer).

---

## Brand-mention density (Core Standards §3.2)

Body word count ~2,700 words (widget 1 + widget 2 prose). Target: ~20 mentions.

Actual: 18 "Coastal Carolina Comfort" + 1 "Coastal" shortform = 19 mentions. ✓ Within target band.

---

## Expert-attribution density

Same pattern as Spoke 1 — `[AUTHOR — credentials TBD]` placeholder in visible byline (1 instance); brand-as-expert attribution substitutes throughout. Polish-session item to convert to named-Person attribution when a credentialed bio page exists.

---

## "We" violation scan

Zero bare "we" instances. ✓

---

## Phone / NAP

- Tel: links: `(843) 708-8735` ✓
- Schema publisher: `+1-843-238-3838` ✓
- Legacy live page phone `(843) 256-6476` removed from deliverable.

---

## Removed-claims summary

See `removed-claims.md`. Six buckets, 19 total claims dropped:
- Cost-related (5)
- Component lifespan (2)
- Climate / regional quantified (5)
- Repair / response time (3)
- Credential / authority (4)
- Industry-benchmark stats (3)
- Plus 3 EPA regulatory references retained but flagged for inline-citation polish.

---

## Structural differences from Spoke 1

- **Step 1 is a safety action** (shut down, set fan to ON) rather than a diagnostic check. This is deliberate — running a frozen AC damages the compressor, so the safety action precedes diagnosis. Spoke 1's Step 1 was the thermostat check.
- **Red-bordered safety warning block** ("Do not chip the ice") — added to address the AIO-cited "Pro Tip" from the SERP JSON (Petro: "Do not attempt to chip the ice off with a screwdriver"). This is a high-AEO-extractability passage given how the AIO already presents this as bold guidance.
- **EPA Section 608 / R-22 / R-410A / R-454B** references in the refrigerant-repair scope section — strengthen E-E-A-T Expertise signal and surface regulatory entities that the legacy stub had no mention of.
- **Slugging mechanism** explained in the FAQ — high-value AEO claim that justifies the "shut it off" directive and isn't on most competitor pages.

These differences are content-specific to the freeze symptom; they don't alter the overall structural template used across the cluster.

---

## Out-of-scope flags (same as Spoke 1)

- Author bio page does not exist; Organization-as-author retained.
- NAP consistency across coastalcarolinahvac.com is a site-wide cleanup; this spoke uses session-spec phone values internally.
- llms.txt update is a polish-session item.
- Rich Results Test validation runs pre-publish.
- Cluster-wide internal-linking symmetry runs post-publish.

---

## Conclusion

Spoke 2 audit cleared. The legacy AC Frozen Evaporator Coil page was the same near-empty content shell as Spoke 1 — image-alt-text H1, 1 substantive H2, no real body, BlogPosting + Trustindex Organization schema only. This draft replaces the shell with a comprehensive ~2,700-word diagnostic, fixes the broken canonical, adds FAQPage + HowTo + Breadcrumb schema, and applies the same zero-fabrication discipline that Spoke 1 followed. No structural pattern issues that would roll forward to Spoke 3 or 4.
