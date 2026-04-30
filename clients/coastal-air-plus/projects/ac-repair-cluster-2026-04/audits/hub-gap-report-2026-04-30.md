# Hub Page Gap Report — AC Repair Hubs

**Audit date:** 2026-04-30
**Reviewer:** Claude Code (session with Jordan Spencer)
**Reference SOPs:** ROI.LIVE Agency Service Page SOP v1.1, ROI.LIVE Agency Citation Discipline SOP v1.0, ROI.LIVE Agency Core Standards v1.1
**Pages audited:**
- Summerville hub: https://coastalcarolinahvac.com/summerville-sc/ac-repair
- Charleston hub: https://coastalcarolinahvac.com/charleston-sc/ac-repair

**Method:** Live content fetched via Firecrawl /v2/scrape with `markdown + html + rawHtml + links` formats. Heading outline, schema markup, and metadata extracted from rawHtml. Body content reviewed for SOP compliance and Citation Discipline application.

**Important context for the reviewer:** Both pages are on the legacy `coastalcarolinahvac.com` domain (Coastal Carolina Comfort brand) with inline transition language ("now part of Coastal Air Plus") on the Summerville page only. The new parent brand (Coastal Air Plus) does not yet have its own hub URLs. This audit treats the legacy URLs as canonical for the purposes of the SOP review, since they are the live, indexable, ranking pages today.

---

## Section 1 — Summerville Hub

### Live page surface

| Field | Value |
|---|---|
| URL | https://coastalcarolinahvac.com/summerville-sc/ac-repair |
| Meta title | `AC Repair in Summerville, SC \| Coastal Carolina Comfort` (45 chars — short of SOP 50–60) |
| Meta description | `Same-day AC repair in Summerville, SC. NATE-certified techs dispatched from Lipman St. Refrigerant leaks, compressor repair, thermostat issues & more. Call (843) 708-8735.` (172 chars — over SOP 140–160) |
| OG title | `AC Repair in Summerville, SC — Local Techs, Same-Day Service` |
| OG description | `AC repair from Summerville's own team — dispatched from Lipman St., not Charleston. NATE-certified, upfront pricing, serving Nexton, Cane Bay, Historic District & all of Dorchester County.` |
| Canonical | declared inside @graph WebPage |
| Language | en-US |
| Author (schema) | Derrick Hall — URL `/author/revgrowth/` (system author, not credentialed bio) |
| Date published | 2026-03-11 |
| Date modified | 2026-04-28 |
| H1 | `AC Repair in Summerville, SC` (1 occurrence — correct count) |
| H2 count | 13 |
| H3 count | 32 |
| Visible phone | (843) 252-0880 |
| Schema phone | +18437088735 → (843) 708-8735 |

### Schema markup detected

Three JSON-LD blocks:

**Block 1 — Master @graph:**
- WebPage with @id, breadcrumb, isPartOf, datePublished, dateModified
- BreadcrumbList: Home → Summerville SC → AC Repair
- HVACBusiness with full NAP (110 Lipman St, Summerville, SC 29483), geo (33.0185, -80.1756), opening hours, priceRange `$$`, hasCredential (NATE Certified, SC LLR Mechanical Contractor License), areaServed (Summerville + Dorchester / Charleston / Berkeley counties), sameAs (FB, IG)
- Service with name, alternateName, description, provider, 9 Summerville sub-area Place entries, serviceType, category, Offer ($49 diagnostic), hasOfferCatalog with 9 itemized services
- HowTo with 4 steps named ("Same-Day Dispatch From Lipman St.", "Complete System Diagnostic", "Honest Diagnosis and Upfront Pricing", "Repair and Verification")
- FAQPage with 11 Q&A pairs

**Block 2 — Standalone WebPage:** redundant with Block 1's WebPage entry, includes `author: Derrick Hall` and `publisher: HVACBusiness Coastal Carolina Comfort`

**Block 3 — Trustindex Organization:** AggregateRating 4.9 / 171 reviews + 12 review entries

### SOP requirement matrix

| SOP requirement | Present? | Quality | Notes |
|---|---|---|---|
| **Phase 4 — Title 50–60 chars, keyword-first** | Partial | weak | 45 chars; under target. Keyword-first ✓. |
| **Phase 4 — Meta description 140–160 chars, keyword in first 20 words, trust signal, CTA** | Partial | weak | 172 chars (12 over cap). Keyword early ✓. Trust signal ("NATE-certified", "same-day") ✓. CTA ("Call (843) 708-8735") ✓ but phone breaks NAP — see Phase 12.1 below. |
| **Phase 4.4 — H1 with primary keyword + benefit framing** | Yes | adequate | `AC Repair in Summerville, SC`. Keyword present, benefit framing absent. SOP example shows benefit-first preferred (`HVAC Service in Asheville — Same-Day Response, 10-Year Warranty`). |
| **Phase 4.5 — Min 3 H2s with commercial-intent entity terms** | Yes | strong | 13 H2s, ~9 commercial-intent (Process, Systems We Repair, Why Charleston Trusts, Repair vs Replacement, Same-Day, FAQs, etc.) |
| **Phase 4.5 — H2/H3 hygiene** | Partial | weak | First H2 is a sentence-length string: `From Nexton to the Historic District, our NATE-certified technicians diagnose and repair AC problems the same day you call. $49 Service Call for Summerville homeowners.` That's a sub-headline marked as H2 — heading semantic abuse. Should be a paragraph or sub-headline div. |
| **Phase 5 — Conversion spine: Hero → Trust bar → Trust logos → Problem → Solution → Proof#1 → Process → CTA → Proof#2 → Pricing → Service Areas → FAQ → Guarantee → Final CTA** | Partial | adequate | Hero ✓, Trust bar (4.9 stars, NATE certs) ✓, Problem framing ✓, Solution ✓, Process ✓, FAQ ✓, Service Areas in schema ✓. **Missing visibly: Proof Section #1 (case study excerpt), Proof Section #2 (named testimonials with specific results), Trust logo strip (client logos / press / association badges separate from review widget), Guarantee/Risk Reversal section.** |
| **Phase 5.1 — Min 5 CTA placements** | Yes | adequate | Header phone, "Get a Quick Quote" header, mid-page "Call Now", final phone, plus form CTA. Counts ≥ 5. |
| **Phase 6.4 — Embedded case study excerpt with named client + before/after numbers + quote** | **No** | missing | No case study embed found anywhere on either hub page. SOP Phase 6.4 + 9.4 + 11.1 all mandate this. **Critical gap.** |
| **Phase 6.5 — Named methodology with distinctive proper name** | Partial | weak | HowTo schema is present with 4 named steps, but the methodology itself is described as `How AC Repair Works in Summerville, SC` — generic title, not a distinctive proprietary name (e.g., "The Coastal Method" or "The Lipman St. Diagnostic"). Information gain anchor weak. |
| **Phase 6.6 — 2–4 named testimonials with specific result detail** | Partial | weak | Trustindex review widget embeds 12+ reviews with names + ratings, BUT the visible page-prose content has no curated testimonial section pulling 2–4 specific results forward. Reviewers will scroll past the widget; pulled-out testimonials with case-detail integrate visually with the conversion spine. |
| **Phase 6.7 — Pricing treatment (A/B/C, no "call for pricing" alone)** | Yes | strong | Treatment B (price ranges) consistently used: `$49 diagnostic`, `$150–$650 typical repair`, `$1,200–$2,500 compressor`, `$250–$600 refrigerant recharge`. Drives variation explained. |
| **Phase 6.8 — Service Areas section** | Partial | adequate | 9 Summerville sub-areas listed in Service schema. Visible content references Nexton, Cane Bay, Historic District, Knightsville. **No visible bullet/map list of all sub-areas** — schema is more complete than the visible page. |
| **Phase 6.9 — FAQ 6–8 Q&As (visible + schema match)** | Yes | strong | 11 Q&As in FAQPage schema. Visible FAQ block matches. Above SOP minimum. |
| **Phase 6.10 — Guarantee / Risk Reversal section** | **No** | missing | No visible guarantee, warranty, satisfaction promise, or risk reversal language as a structured section. SOP non-negotiable when the client can offer one. Coastal does offer warranties per the HowTo schema ("warranty on parts and labor") — needs to surface as a dedicated visible section. |
| **Phase 7.1 — Word count 1,000–1,800 (evergreen)** | Yes | strong | ~3,200 words visible content. Above the upper SOP target — fine for a hub but flag for spoke pages. |
| **Phase 7.2 — Primary keyword in first 100 words** | Yes | strong | `AC Repair in Summerville, SC` appears in the first sentence and Quick Answer block. |
| **Phase 7.3 — Brand name density 1 per 120–140 words** | Partial | adequate | "Coastal Carolina Comfort" appears multiple times but uses two brand names interchangeably (Coastal Carolina Comfort + Coastal Air Plus transition language). Requires Parameter Sheet decision on canonical brand name. |
| **Phase 7.4 — Expert attribution 3–5 mentions, link to author bio** | **No** | missing | Author = Derrick Hall in schema, but the visible page never names him, never displays credentials, and the schema URL `/author/revgrowth/` resolves to a system author tag — not a credentialed bio. **Major gap for E-E-A-T Trust + Phase 9.8 YMYL accountability.** |
| **Phase 7.5 — Location modifier in title, H1, first 100 words, ≥2 H2s, meta description** | Yes | strong | "Summerville, SC" appears across all required slots. |
| **Phase 8.1 — Service JSON-LD with provider, areaServed, serviceType, hasOfferCatalog** | Yes | strong | Complete. |
| **Phase 8.2 — Offer JSON-LD with price, currency, availability** | Yes | strong | Embedded inside Service schema. $49 USD InStock. |
| **Phase 8.3 — AggregateRating with ratingValue, reviewCount, source** | Yes | strong | 4.9 / 171 reviews from Trustindex. |
| **Phase 8.4 — FAQPage JSON-LD matches visible block** | Yes | strong | Schema mirrors visible Q&As. |
| **Phase 8.5 — BreadcrumbList JSON-LD matches visible** | Yes | strong | Visible breadcrumb: Home → Summerville SC → AC Repair. |
| **Phase 8.6 — LocalBusiness / HVACBusiness with full NAP, geo, hours** | Yes | strong | All fields present and detailed. |
| **Phase 8.7 — Author / Expert attribution schema linked to bio page** | **No** | missing | Schema names Derrick Hall but bio page does not exist as a credentialed Person profile — links to system author archive. |
| **Phase 9.1 — Above-fold trust bar with 3–5 signals** | Yes | adequate | 4.9 stars + Trustindex Top Rated + "Home of $79 Spring Tuneup / 0% Interest 24 mo" promo bar. SOP wants stable trust signals (years in business, certification, client count, geographic authority). Promo bar substitutes for stable signal — weak by SOP weighting. |
| **Phase 9.2 — Trust logo strip (clients / certifications / press / awards)** | **No** | missing | No client logos, no certification badges visible (though credentials appear in schema), no press mention strip. |
| **Phase 9.3 — ≥2 named testimonials with specific result details** | Partial | weak | See 6.6 — widget present, no curated visible testimonial section with named clients + specific results pulled forward. |
| **Phase 9.4 — Case study embed (≥1)** | **No** | missing | See 6.4. |
| **Phase 9.5 — Third-party verification link** | Yes | adequate | Trustindex link present. Could add Google Business Profile direct link. |
| **Phase 9.6 — Guarantee displayed visibly, not buried** | **No** | missing | See 6.10. |
| **Phase 9.7 — NAP consistency** | **No** | **critical** | See Section 3 below. |
| **Phase 9.8 — YMYL editorial accountability (credentialed SME named + linked, citations for safety/regulatory claims)** | **No** | missing | HVAC repair is YMYL-adjacent (financial decisions on $1,200–$2,500 spend, electrical safety, refrigerant handling). No credentialed expert visible, no editorial policy linked, no inline citation hooks for the climate or regulatory claims. |
| **Phase 12.1 — NAP across page, GBP, directories** | **No** | **critical** | See Section 3. |
| **Phase 12.2 — Service Areas explicit list matching schema areaServed** | Partial | weak | Schema lists 9 Summerville sub-areas; visible content references 4–5. Add a visible service-areas section to match. |
| **Phase 12.3 — Location-specific content rewritten per location, not city-swap** | Yes | adequate | Charleston version has Charleston-specific content (salt air, harbor proximity, peninsula coverage) — not a literal city-swap of Summerville copy. Confirmed in Section 2. |
| **Phase 14.5 — Page added to llms.txt Primary Services / Products** | Unknown | — | Not verifiable from this fetch. Pull `https://coastalcarolinahvac.com/llms.txt` separately to confirm. |

### Citation Discipline check (per Citation Discipline SOP v1.0)

[STAT NEEDED] flags found in visible content: **0 (good — none leaked into production)**.

Quantified claims that lack inline citation hooks (Phase 7.4 of Citation Discipline):

1. **"R-410A costs have risen since the January 2025 EPA production ban."** No inline citation hook. Source: EPA AIM Act final rule (40 CFR Part 84). Should read something like *"Per the EPA's AIM Act phasedown rule (40 CFR Part 84), R-410A production and import in the US ended January 1, 2025."*
2. **"A refrigerant leak repair that cost $350 in 2022 may now run $500–$700"** — internal/industry pricing claim, no methodology hook. Acceptable as own-data, but Phase 1.3 (Attribution Precision) would prefer *"Based on our 2022 vs 2025 service-call records..."* or similar.
3. **"About 30% of 'AC won't start' calls we respond to across South Carolina are resolved by basic homeowner checks."** — internal proprietary stat. Phase 1.3 would prefer methodology hook (sample size, time window, what counts as "basic homeowner checks").
4. **"Most Summerville homeowners see a technician within 2 hours of their call."** — performance claim with no data hook. Acceptable for marketing prose but weak under Phase 1.4 (Strength of Evidence Honesty) without "based on Q1 2026 dispatch records" or similar.
5. **"100% issue-free services"** (Trustindex widget label, line 1777). This is **a Phase 1.4 violation** — the same widget on the same page displays a 1-star review describing a hot/cold reversal failure. Claim is exaggeration; replace with the verified Trustindex metric (`Less than 1% of customers surveyed indicated a problem`) which is also already displayed and is the accurate framing.

**Recommendation:** Cluster's drafting brief should include a citation-hook pass for the climate (humidity, heat days), regulatory (EPA AIM Act, R-410A phaseout), and refrigerant economics claims. The same claims will appear on every spoke and need consistent attribution. Internal performance claims need methodology footnotes per Phase 1.3.

---

## Section 2 — Charleston Hub

### Live page surface

| Field | Value |
|---|---|
| URL | https://coastalcarolinahvac.com/charleston-sc/ac-repair |
| Meta title | `AC Repair in Charleston, SC \| Coastal Carolina Comfort` (44 chars — short of SOP 50–60) |
| Meta description | `Same-day AC repair in Charleston, SC. NATE-certified technicians. Historic homes, West Ashley, Mount Pleasant, James Island. $49 diagnostic. (843) 708-8735.` (155 chars — within SOP) |
| OG title | `AC Repair in Charleston, SC \| Same-Day Service \| Coastal Carolina Comfort` |
| OG description | `Same-day AC repair across Charleston from NATE-certified local technicians. Historic homes, salt air systems, all major brands. $49 diagnostic. Upfront flat-rate pricing. (843) 708-8735.` |
| Canonical | declared inside @graph WebPage |
| H1 | `AC Repair in Charleston, SC` |
| H2 count | 14 |
| H3 count | 33 |
| Visible phone | (843) 256-6257 |
| Schema phone | +18437088735 → (843) 708-8735 |

### Schema markup detected

Same three-block pattern as Summerville:
- Block 1 master @graph with WebPage, BreadcrumbList, HVACBusiness, Service (Charleston-area Place entries: Mount Pleasant, James Island, Daniel Island, West Ashley, Johns Island, North Charleston), HowTo, FAQPage
- Block 2 standalone WebPage with author Derrick Hall
- Block 3 Trustindex Organization (same shared 4.9 / 171 review aggregate)

Charleston Service offerings catalog includes Charleston-specific copy ("salt air"), and the HowTo step 1 is named differently ("Same-Day Dispatch From Summerville HQ" vs Summerville's "Same-Day Dispatch From Lipman St.").

### Charleston-specific findings (delta from Summerville)

| Item | Charleston state | Summerville parallel |
|---|---|---|
| Visible phone | (843) 256-6257 | (843) 252-0880 |
| Heading: "Why Charleston AC Systems Fail Faster Than Inland Systems" | Present (extra H2) | Absent — Charleston-only differentiation point |
| Climate context block (95°F summers, 74% RH, salt air) | Present, location-specific | Less detailed |
| Service-time SLA | "2–4 hours" (longer dispatch from Summerville HQ) | "2 hours" |
| Sub-areas referenced visibly | West Ashley, Mount Pleasant, James Island, Daniel Island, North Charleston, peninsula | Nexton, Cane Bay, Historic District, Knightsville |
| Brand transition language ("now part of Coastal Air Plus") | **Absent** | Present |

### SOP gaps unique to Charleston

The Charleston hub inherits all the Summerville SOP gaps (no case study, no guarantee section, no expert bio, no client logo strip, weak named-methodology branding, NAP inconsistency). It also adds:

1. **Brand transition inconsistency:** the Summerville hub names the new parent brand inline ("Coastal Carolina Comfort, now part of Coastal Air Plus"), the Charleston hub does not. If brand transition is the strategy, both pages must name the parent brand at first body mention. If it is not the strategy yet, remove from Summerville.
2. **Climate-stat density is higher:** Charleston body has more quantified climate claims (95°F summer averages, 74% RH, 45+ days >100°F heat index, 30–50% more condensate). Each needs an inline citation hook to NOAA / EPA / NWS Charleston records or similar — see Section 4 below.
3. **Sub-area visibility:** schema lists 6 Charleston sub-areas (Mount Pleasant, James Island, Daniel Island, West Ashley, Johns Island, North Charleston). Visible content covers all six in the climate paragraph and FAQ but does not have a dedicated visible Service Areas section.

### Citation Discipline check — Charleston-specific

Quantified claims that lack inline citation hooks (additive to the Summerville list):

1. **"Charleston averages more than 45 days per year with a heat index above 100°F — among the highest of any metro area on the East Coast."** Specific climate claim, requires NOAA / NWS Charleston source. Per Phase 1.2 (Verify Before Citing): the East Coast superlative is a strong claim that may not survive verification — likely needs to be softened to "among the highest in the Southeast" or similar with a verified source.
2. **"Average summer temperatures regularly exceed 95°F, and relative humidity holds at 74% or higher from June through September."** Climate stat, needs NWS source.
3. **"Charleston's coastal humidity causes AC systems to produce 30–50% more condensate than inland systems."** Quantified industry/HVAC claim, needs ACCA, ASHRAE, or peer-reviewed HVAC source. Per Phase 1.2 this would not survive verification as stated; the underlying physics is correct (latent load scales with absolute humidity) but the 30–50% figure needs sourcing or rewording to "significantly more" with a methodology footnote.
4. **"Salt air infiltration accelerates corrosion on copper refrigerant lines — particularly on properties east of the Ashley River, on James Island, and within two miles of the harbor."** Geographic specificity is admirable but the 2-mile claim needs a source (corrosion-zone studies typically use NACE or industry standards).

The "30–50% more condensate" and "45 days >100°F" claims are the Phase 4.1 Hallucination Pattern Catalog risk — *plausible-sounding statistics that cannot be traced*. They may have been generated during drafting and not verified. Top priority for the Citation Discipline pass.

---

## Section 3 — NAP Consistency Finding (Critical, Both Pages)

This is the highest-leverage gap and warrants its own section.

| Source | Phone displayed |
|---|---|
| HVACBusiness schema (both pages) | +1 (843) 708-8735 |
| Trustindex Organization schema | n/a (no phone field) |
| Summerville hub visible header + body CTA | (843) 252-0880 |
| Summerville hub meta description | (843) 708-8735 |
| Charleston hub visible header + body CTA | (843) 256-6257 |
| Charleston hub meta description | (843) 708-8735 |

**Three different phone numbers across two pages.** Two interpretations possible:

**A) Call tracking pattern (likely).** The 252-0880 and 256-6257 numbers are city-specific call-tracking variants forwarding to the canonical 708-8735 line. This is a common local-marketing pattern and gives attribution data. **However**, per Service Page SOP Phase 9.7 + 12.1 + Core Standards Phase 4.4, NAP consistency is a Trust signal and a local ranking factor. Even if the call-tracking pattern is intentional, the displayed phone needs to match the canonical NAP across the site, GBP, and directory listings — or the call-tracking variants need to be documented in the Client Parameter Sheet as approved overrides with the rationale.

**B) Genuine NAP failure.** The numbers were set independently per page, no central NAP discipline, and the schema phone is a different actual line than the displayed lines. This would be a critical local SEO failure.

**Either way:** the Client Parameter Sheet for Coastal Air Plus should document the canonical NAP and the call-tracking exception. Without that documentation, neither agency review nor freshness audits can verify NAP discipline.

This question is the first one to ask Mike at the kickoff — *what is the canonical NAP, and are the visible phone numbers call-tracking variants approved by you?*

---

## Section 4 — Top 5 Recommended Fixes Ranked by Leverage

Ranking criteria: SOP weight × correction effort × ranking/conversion impact. Highest leverage first.

### Fix 1 — Resolve NAP consistency before any spoke ships

- **Severity:** Critical (Phase 9.7, 12.1, Core 4.4)
- **Action:** confirm with Mike whether `(843) 252-0880` and `(843) 256-6257` are call-tracking variants. If yes, document in Parameter Sheet, retain as displayed numbers, and ensure HVACBusiness schema phone matches GBP listed phone. If no, set a single canonical NAP across all hub + spoke + GBP + directory listings.
- **Why first:** every spoke that ships before this is resolved propagates the inconsistency.

### Fix 2 — Add credentialed expert author bio + Citation Discipline pass on regulatory + climate claims

- **Severity:** High (Phase 7.4, 8.7, 9.8, Citation Discipline 1.2 / 4.1 / 7.4)
- **Action:** create a credentialed author bio page for Derrick Hall (or whoever the named SME is) with NATE certification details, license number (SC LLR), years experience, and link from `/author/[name]/` not `/author/revgrowth/`. Add inline citation hooks to every climate claim (NOAA / NWS Charleston) and every regulatory claim (EPA AIM Act). Verify the "30–50% more condensate" and "45 days >100°F" stats survive verification or rewrite them.
- **Why second:** YMYL accountability + Citation Discipline are the largest E-E-A-T Trust gap. AIO citation set in Step 4 was dominated by Carrier / Bryant / Lennox / Trane plus Reddit / YouTube — competing requires institutional-grade trust signaling.

### Fix 3 — Embed at least one case study excerpt with quantified results on each hub

- **Severity:** High (Phase 6.4, 9.4, 11.1 — all mandate this; Phase 11.1 calls it "minimum integration")
- **Action:** identify a Summerville and a Charleston AC repair case from existing service records. Quantify: response time, repair cost, before/after temperature differential, system age, customer outcome. Embed the excerpt with a link to the full case study page (which will need to be built per Case Study Page SOP).
- **Why third:** Phase 6.4 is in the SOP's Quick Reference Non-Negotiables. Both hubs publish today without it.

### Fix 4 — Add visible Trust Logo Strip + Guarantee/Risk Reversal section + curated testimonial block

- **Severity:** High (Phase 5 spine, 6.6, 6.10, 9.2, 9.3, 9.6)
- **Action:** below hero, add a strip of badges (NATE, BBB if applicable, SC LLR license, manufacturer partnerships like Daikin Comfort Pro, association logos). Add a dedicated guarantee section visible above the fold of the lower-page conversion zone — the "warranty on parts and labor" language already in the HowTo schema needs to surface as a visible structured section. Pull 2–4 named testimonials with specific result details out of the Trustindex review widget into a curated section in the conversion spine.
- **Why fourth:** these are three SOP spine gaps that bundle into one design pass.

### Fix 5 — Heading hygiene + visible Service Areas list + name the methodology

- **Severity:** Medium (Phase 4.5 H2 hygiene, Phase 6.8 service areas, Phase 6.5 named methodology)
- **Action:** convert the sentence-length first H2 into a paragraph or sub-headline. Add a visible Service Areas bullet list matching the schema `areaServed`. Name the methodology with a distinctive proprietary name (not "How AC Repair Works in Summerville, SC") — e.g., "The Coastal Carolina Diagnostic" or "The Lipman St. 4-Step Process".
- **Why fifth:** lowest-cost fixes that close visible structural SOP gaps.

### Also-flagged (below top 5)

- Replace the "100% issue-free services" Trustindex widget label with the accurate "less than 1% problem rate" framing (Phase 1.4)
- Reconcile brand transition language between Summerville and Charleston (one names parent brand, one does not)
- Verify llms.txt includes both hub URLs under Primary Services / Products
- Trim Summerville meta description to 140–160 chars (currently 172)
- Lengthen meta titles to 50–60 chars (both currently 44–45)
- Add benefit framing to H1 per Phase 4.4 SOP example
- Add LocalBusiness telephone field to HVACBusiness schema if call-tracking variants are documented (currently only canonical phone is in schema)

---

## Section 5 — Cross-Cutting Observations

1. **Both hubs are structurally serious work.** Schema is comprehensive (HVACBusiness + Service + HowTo + FAQ + AggregateRating + BreadcrumbList), pricing is transparent (Treatment B), keywords are placed correctly. The gaps are concentrated in (a) NAP discipline, (b) E-E-A-T Trust signaling beyond review widgets, and (c) Citation Discipline on the climate / regulatory claims. None of those are heavy lifts; all of them are needed before the spokes ship to avoid propagating the gaps.

2. **The hub strategy maps cleanly to the cluster.** The HowTo + FAQ + Service schema patterns established here will scale to the spokes. Heading hygiene and the unsourced-stat patterns will also propagate — fixing them in the hubs first means the spokes inherit clean templates.

3. **The legacy domain question is a strategy decision, not a SOP gap.** Both hubs sit on `coastalcarolinahvac.com`. The cluster strategy memo from Jason should specify whether the spokes also live on the legacy domain (preserving link equity from existing rank) or move to a new Coastal Air Plus domain. This is a Mike-level question, not an audit finding.

4. **The Step 4 AIO citation pattern (Reddit / YouTube / Carrier / Bryant / Lennox / Trane / Petro) is a strong fit for the strategy these hubs imply.** Petro on `ac frozen` is the proof point: a regional HVAC service company breaking into a brand-dominated AIO citation set. Coastal can be the Lowcountry equivalent — but only with E-E-A-T Trust signaling that matches the institutional citations Google currently trusts.
