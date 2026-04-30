# Green Llama Clean — Editorial Overlay
**Version:** 1.0 — April 2026
**Applies to:** All GLC editorial content (blog articles, web copy, marketing content)
**Owner:** Jason Spencer, Founder — ROI.LIVE
**Inherits from:**
- ROI.LIVE Agency Core Standards v1.1 (with §8.2 clarification, 2026-04-29)
- ROI.LIVE Agency Blog Article SOP v1.1
- ROI.LIVE Agency Citation Discipline SOP v1.0
- GL Blog Content SOP v1.1 (canonical client SOP)

> This document captures the conflict-map rulings made during GLC onboarding (2026-04-29). It is the per-client overlay referenced by the agency Citation Discipline SOP §10 (Per-Client Implementation). Where this overlay specifies a rule, it overrides the agency baseline for GLC content.

---

## Inheritance order (read top to bottom)

1. ROI.LIVE Agency Core Standards v1.1
2. ROI.LIVE Agency Blog Article SOP v1.1
3. ROI.LIVE Agency Citation Discipline SOP v1.0
4. GL Blog Content SOP v1.1 ([`GL_Blog_Content_SOP_v1_1.md`](./GL_Blog_Content_SOP_v1_1.md))
5. **This overlay** (`GL_Editorial_Overlay_v1.md`)
6. Current session instructions

When rules conflict, later items override earlier items.

---

## Rulings (from 2026-04-29 onboarding conflict map)

### C1 — "We" pronoun (DTC override active)

The Core Standards §3.4 default rule (no bare "we") is **overridden** for GLC. Reasoning: GLC is a DTC women-owned brand; Core §3.4 explicitly contemplates this case.

- "We" is permitted in body copy
- Kay Baker and Matthew Keasey are named explicitly at attribution moments: every key data claim, every strategic recommendation, every Expert Take section, every FAQ answer
- Bare "we" cannot replace expert attribution at points where attribution is required

### C2 — Em-dashes (full ban)

GLC content uses **no em-dashes anywhere**. This is stricter than the Core §8.2 rule, which bans em-dash *reveals* specifically.

- Use spaced en-dash, sentence break, or comma instead
- Em-dash usage is also an AI-detection countermeasure: LLMs over-produce em-dashes, so banning them cleans up AI artifacts in one rule
- The published Performance Lab pillar uses em-dashes; this is part of why it's flagged for remediation (see `context/open-items.md`)

### C3 — Citation discipline (agency Citation Discipline SOP applies)

Per ruling, GL's citation framework is now the agency baseline. This client uses the agency SOP plus the GLC-specific items below.

### C4 — Word count (e-comm override band)

| Article type | Range | Notes |
|---|---|---|
| Pillar | 2,500–3,500 words | E-comm override band per Core Standards §7.1. The current Performance Lab pillar at ~1,400 words is undersized — flagged for remediation. |
| Supporting (cluster) | 1,500–2,200 words | E-comm override band |
| YMYL (any topic touching health, children, chemicals) | At the upper end of each band | Allows full source citation and evidence-strength language |

### C5 — Brand name density (agency rule applies)

- 1 mention of "Green Llama" per 120–140 words of prose
- First mention appears in the first sentence of body content (not just hero)
- First mention bolded; subsequent mentions in body prose styled per the design system (likely also bolded — confirm with design lead)

### C6 — Expert attribution density (agency rule, distributed across two authors)

- 1 attribution per 180–220 words of prose, **combined** across Kay and Matt
- Distribution by claim type:
  - **Kay Baker, MS, OTR/L** voice: family safety, child/pet exposure, OT lens, product design philosophy, usability
  - **Matthew Keasey, Ph.D.** voice: ingredient chemistry, toxicology, formulation claims, peer-reviewed evidence
  - **Dr. Beth Peterknecht, MBChB(Hons), MRCP(UK), FHEA** voice: dermatology, skin health, clinical research topics, when topic warrants
- Byline format: `By Kay Baker, MS, OTR/L | Reviewed by Matthew Keasey, Ph.D.` (default for blog)
- For dermatology-specific articles, add: `Reviewed by Dr. Beth Peterknecht, MBChB(Hons), MRCP(UK)`
- Full credentials appear at least twice per article

### C7 — Citation format (APA + working hyperlinks + end-of-content Sources section)

Inherited from agency Citation Discipline SOP §7. Format is APA with working hyperlinks. Sources section appears after FAQ, before Related Reading. Inline citation hooks ("According to EPA data...", "[Author year] found...") are mandatory per agency SOP §7.4.

### C8 — Three-item lists (factual permitted, rhetorical banned)

- **Permitted:** factual enumerations of three where three is the natural complete count (acidic/alkaline/neutral pH; solid/liquid/gas; proteases/amylases/lipases)
- **Banned:** rhetorical pattern-of-three constructions ("Purpose. Clarity. Impact."; "Smarter, faster, stronger.")
- Test: if removing or replacing the third item would harm factual completeness, the list is factual and permitted
- Core Standards §8.2 was clarified on 2026-04-29 to make this distinction explicit

### D1 — Voice tone (Blog SOP wins for editorial)

GLC blog editorial voice follows GL_Blog_Content_SOP_v1.1: *informed, accessible, empowering not fear-based, precise, direct.*

The AI Voice Charter v5.0 ([`reference/voice-charter-v5.md`](../reference/voice-charter-v5.md)) is **not active** for blog editorial content. It applies to social and brand-campaign channels only. Specifically:

- The "1 emotional hook per 150 words" rule does NOT apply to blog content
- The "fear · guilt · belonging · pride · joy" emotional triggers do NOT apply to blog content
- Charter elements that DO carry over to blog editorial: Grade 8 reading level, ≤1 llama pun per article (often zero), no em-dashes (already enforced via C2)

Open item: Voice Charter v5.0 itself needs revision in a future session with Kay's team. See `context/open-items.md`. The Charter does NOT propagate to other ROI.LIVE clients.

### D2 — Three-item factual enumerations (permitted)

See C8 above. The agency Core Standards §8.2 was clarified on 2026-04-29 to make this distinction explicit.

### D3 — Llaina mascot (out of scope for blog editorial)

The Llaina mascot referenced in the AI Voice Charter v5.0 stays in social, packaging, and brand-campaign territory. It does not appear in blog editorial content. Reasoning: mascot voice undercuts E-E-A-T and YMYL credibility in long-form editorial.

---

## GLC-specific Citation Discipline overlay (per agency SOP §10)

### Tier mapping

GLC's vetted Tier 1 sources, beyond the universal list in agency Citation Discipline SOP §2:

- EWG (https://www.ewg.org/) — Healthy Cleaning database, ingredient ratings
- EPA Safer Choice (https://www.epa.gov/saferchoice/) — Safer Choice product list, approved ingredients
- ChemExpo Knowledgebase (https://comptox.epa.gov/chemexpo) — chemical exposure data
- PubChem (https://pubchem.ncbi.nlm.nih.gov/) — chemical structure, biological activity, toxicity

Full source list with use cases lives at [`scientific-sources.md`](../scientific-sources.md).

### Review chain

| Level | Role | Person |
|---|---|---|
| 1 — Author (pre-submission) | Article writer | Per assignment (currently Jason's family member; Jason as backup) |
| 2 — Subject Matter Reviewer | Scientific accuracy review | Matthew Keasey, Ph.D. (chemistry, toxicology, formulation claims) |
| 3 — Editorial Lead | Brand voice, product accuracy, strategic alignment | Kay Baker, MS, OTR/L |

For dermatology-specific articles, add Dr. Beth Peterknecht as Level 2 reviewer alongside Matt.

**Solo-reviewer note (per agency SOP §6.4).** The current chain does not have Kay holding both Levels 2 and 3, so the 24-hour cooling period rule does not currently apply to GLC. If the chain consolidates in the future (e.g., during a period when Matt is unavailable), the cooling period kicks in.

### Verification window

Standard 5–10 minute window per claim is appropriate for GLC. Some specific claim types may require longer:

- Legislative citations (bill numbers, statute sections, .gov URLs): verify against the legislative database, may take 10–15 minutes
- EPA IRIS chemical pages: navigate manually through EPA site nav, may take 10 minutes

### Per-client banned attribution patterns

- **No liquid product references.** GLC does not make liquid products. Never describe, imply, or depict GLC as making, selling, or recommending liquid detergent, liquid soap, or liquid refills. The only spray products use refill tablets dissolved in glass bottles. Format vocabulary: "powder," "concentrated powder," "tablet," "dissolvable tablet," "solid bar." Never: "pods," "sheets," "liquid," "liquid refill."
- **AAP citations on cleaning products.** AAP guidance on food additives is not AAP guidance on cleaning products. Do not cross-attribute.
- **EPA classification language is exact.** "Likely human carcinogen" does not become "probable" or "known." Wrong language is a failure, not a stylistic choice.

### Per-client incident catalog (growing)

| Date | Incident | Correction | Source |
|---|---|---|---|
| 2026-03-20 | "Lifecycle analysis published in the Journal of Industrial Ecology found 10–15% transportation impact for liquid cleaning products" — study does not exist | Removed; no replacement claim. Lifecycle/transportation footprint claims now only made if a specific verified study exists. | Kay flagged on March 20 call |
| 2026-03-20 | "2.5 billion plastic cleaning bottles thrown away annually per EPA municipal solid waste reports" — statistic cannot be verified in EPA reports | Removed; no replacement claim. | Kay flagged on March 20 call |
| 2026-04-15 | Cited California AB-1743 §108945 for the Cleaning Product Right to Know Act | Correct citation: California SB-258, §108950. Verify against leginfo.legislature.ca.gov | Article QA, April 2026 |
| 2026-04-15 | Generated FTC Green Guides URL returned 404 | Correct URL required manual lookup on FTC site. .gov URLs always tested before submission. | Article QA, April 2026 |
| 2026-04-15 | Generated EPA IRIS 1,4-dioxane URL with wrong path format | Correct URL required manual navigation through EPA IRIS. | Article QA, April 2026 |
| 2026-04-15 | Two `[STAT NEEDED]` placeholders left in submitted draft | Submission rule: zero placeholders allowed. Source verification hard gate now enforced before submission. Client had to fill PMIDs 35642859 and 22991565. | Article QA, April 2026 |

(New incidents append below this row as they arise.)

---

## Voice tonal anchor

Read this overlay together with:

- [`voice-profile.md`](../voice-profile.md) — short index
- [`voice-profile-full.md`](../voice-profile-full.md) — 66KB full voice system
- [`samples.md`](../samples.md) — short voice exemplars
- [`GL_Blog_Content_SOP_v1_1.md`](./GL_Blog_Content_SOP_v1_1.md) — canonical client SOP

The full voice system is the long-form reference. This overlay is the rule layer that sits on top.

---

*Version 1.0 — April 2026 — ROI.LIVE / Jason Spencer*
*Captured from the GLC onboarding conflict map (2026-04-29). Updates to this overlay are appended with date stamps. Per-client incident catalog grows over time as part of the overlay.*
