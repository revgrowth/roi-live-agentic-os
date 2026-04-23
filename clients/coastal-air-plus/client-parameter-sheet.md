# ROI.LIVE Client Parameter Sheet
**Template Version:** 1.0 — April 2026
**Purpose:** Captures every client-specific variable that ROI.LIVE's Agency SOPs reference during content production.
**Completion requirement:** This sheet must be fully populated before any content production begins for the client engagement.
**Owner:** Jason Spencer, Founder — ROI.LIVE

> Duplicate this template for each client engagement. Save in the client's engagement folder as `[client-slug]-parameter-sheet-v1.md`. Update the status section at the top as fields are populated. No SOP-governed content is produced against an incomplete Parameter Sheet.

---

## COMPLETION STATUS

| Section | Status | Completed By | Date |
|---|---|---|---|
| 1. Engagement Metadata | [x] Draft / [x] Reviewed (Jason 2026-04-23 — engagement type) / [ ] Approved | Claude + Jason confirmations | 2026-04-23 |
| 2. Brand Identity | [x] Draft / [ ] Reviewed / [ ] Approved | Claude (auto-fill from brand_context) | 2026-04-23 |
| 3. Expert / Author Entity | [x] Draft / [ ] Reviewed / [ ] Approved | Claude (partial — blocked on Mike) | 2026-04-23 |
| 4. Voice Profile | [x] Draft / [x] Reviewed (Jason 2026-04-23 — pronoun override + reading level) / [ ] Approved | Claude + Jason confirmations | 2026-04-23 |
| 5. Design Tokens | [x] Draft (Firecrawl extraction 2026-04-23) / [ ] Reviewed / [ ] Approved | Claude via tool-firecrawl-scraper | 2026-04-23 |
| 6. Business Context | [x] Draft / [x] Reviewed (Jason 2026-04-23 — pricing treatment + HVAC-only scope) / [ ] Approved | Claude + Jason confirmations | 2026-04-23 |
| 7. Technical Stack | [x] Draft / [ ] Reviewed / [ ] Approved | Claude (partial — blocked on Mike access grants) | 2026-04-23 |
| 8. YMYL Classification | [x] Draft / [ ] Reviewed / [ ] Approved | Claude (auto-fill from strategy Pillar 5) | 2026-04-23 |
| 9. Off-Page SEO Baseline | [x] Draft / [ ] Reviewed / [ ] Approved | Claude (partial — baselines pending Week 1) | 2026-04-23 |
| 10. Content Scope | [x] Draft / [ ] Reviewed / [ ] Approved | Claude (auto-fill from SEO strategy §5, §8) | 2026-04-23 |
| 11. Override Rules | [x] Draft / [x] Reviewed (Jason 2026-04-23 — volume threshold 30+, CCC brand-name density critical rule) / [ ] Approved | Claude + Jason confirmations | 2026-04-23 |

**Overall Status:** [x] Incomplete — blocks content production / [ ] Complete — ready for content production

---

## SECTION 1 — ENGAGEMENT METADATA

| Field | Value |
|---|---|
| Client legal name | [TODO: ask Jason — confirm legal entity. Assets.md lists "Coastal Air Plus" as the parent brand post-acquisition; the SC Mechanical Contractor license #M111694 suggests an SC LLC but the legal name is not documented.] |
| Client brand name | Coastal Air Plus <!-- source: brand_context/assets.md (Primary Brand) --> |
| Engagement start date | [TODO: ask Jason — brand_context files updated 2026-04-22; SEO strategy created 2026-04-23. Acquisition of CCC closed 2026-03-31 per voice-profile.md. Engagement kickoff date not documented.] |
| Engagement type | **Full-stack retainer.** [x] Full fractional CMO / [x] Website build (website management — hosting + tech support) / [x] Content only / [x] SEO retainer (SEO/AEO — GBP + website) / [x] Other: **Paid ads management + Data dashboard / attribution reporting** <!-- source: Jason confirmation 2026-04-23. Five active workstreams: (1) Paid ads management, (2) SEO/AEO covering GBP + website, (3) Fractional CMO, (4) Data dashboard / attribution reporting, (5) Website management (hosting + tech support). --> |
| Agency account manager | [TODO: ask Jason — not documented in source files] |
| Primary client contact | Mike [last name, role, email, phone unknown] <!-- source: projects/str-seo-strategy/... §11 "Decisions needed from Mike" — TODO: ask Jason for Mike's full name, role, email, and phone --> |
| Secondary client contact | [TODO: ask Jason — Derrick Hall is named as the Summerville owner/byline author per strategy §5 Phase 3; unclear if he is also a client contact or just a named expert for content attribution] |
| Engagement folder path | /clients/coastal-air-plus/ <!-- source: filesystem location of this file --> |
| Kickoff call date | [TODO: ask Jason — not documented] |
| First content deliverable target date | [TODO: ask Jason — strategy §8 places "Weeks 1–2: diagnostic + foundation," so first published content lands in Weeks 2–6. Exact target date depends on kickoff.] |
| Engagement SOW link | [TODO: ask Jason — not in source files] |

---

## SECTION 2 — BRAND IDENTITY

### 2.1 Brand Name
| Field | Value |
|---|---|
| Client brand name (exact casing) | Coastal Air Plus <!-- source: brand_context/assets.md --> |
| Alternate brand names / aliases | Coastal Carolina Comfort (CCC — acquired 2026-03-31, Phase 1 brand transition, primary SEO-engagement identity); "carolina heating and air" (branded-rank equity term on SERP) <!-- source: brand_context/voice-profile.md + positioning.md + projects/str-seo-strategy/... §3.3 --> |
| Pronunciation note (for voice search contexts, if relevant) | [TODO: ask Jason — not documented, likely not needed for English-phonetic brand] |

### 2.2 Domain & Asset URLs
| Field | Value |
|---|---|
| Brand website root URL | https://coastalairplus.com (parent brand site, not in SEO scope) <!-- source: brand_context/assets.md --> |
| Alternate URLs (301 sources) | https://coastalcarolinahvac.com (CCC site — the single in-scope SEO property per strategy §3.1; no 301s off this domain through peak season) <!-- source: brand_context/assets.md + strategy §3.1 --> |
| Brand logo URL (primary, on-light background) | [TODO: ask Jason — assets.md notes "not yet captured — pull from site scrape." Logo was swapped on coastalcarolinahvac.com recently; alt text reads "now part of ... a larger Coastal Air Plus" per strategy §2.3.] |
| Brand logo URL (on-dark / reverse) | [TODO: ask Jason — not captured] |
| Brand favicon URL (minimum 32×32) | [TODO: ask Jason — not captured] |
| Brand mark / icon URL (square) | [TODO: ask Jason — not captured] |
| Apple touch icon URL | [TODO: ask Jason — not captured] |

### 2.3 Brand Identity System
| Field | Value |
|---|---|
| Tagline | "Comfort you can count on from neighbors you trust." <!-- source: brand_context/voice-profile.md (CCC anchor line) + samples.md --> |
| One-sentence brand description (feeds llms.txt and meta) | [TODO: ask Jason — draft candidate sourceable from positioning.md: "Coastal Air Plus is a locally-owned Lowcountry HVAC company serving Summerville, Charleston, and the Grand Strand with licensed repair, installation, and maintenance since 1947." — needs approval + 1947 provenance verification before use.] |
| Brand positioning statement (internal only) | "For established Lowcountry homeowners deciding between a national franchise (ARS, One Hour) and a small local shop, Coastal Air Plus is the long-tenured, fully licensed local operator that answers the phone, shows up fast, and has the operational depth to honor a warranty five years from now." <!-- source: brand_context/positioning.md --> |
| Founding year | 1947 — **UNVERIFIED, blocked per strategy §11 decision #1** <!-- source: brand_context/voice-profile.md + positioning.md + strategy §11 — BBB shows current CAP LLC from 2023-09-27; CCC site says "Founded in 2019"; 1947 traces to predecessor Coastal Air + Refrigeration (David Long). TODO: ask Jason/Mike to confirm ownership-continuity narrative before using 1947 in hero copy or ads. Until cleared, "Founded 2019" stays per strategy §5 Pillar 5. --> |
| Founding location | [TODO: ask Jason — not explicitly documented. Likely Myrtle Beach or surrounding Grand Strand given HQ at 156 Rock Moss Road, Myrtle Beach. Predecessor entity (David Long's Coastal Air + Refrigeration) appears Myrtle-Beach-based per assets.md Facebook link.] |

---

## SECTION 3 — EXPERT / AUTHOR ENTITY

### 3.1 Primary Expert (Named Author)
| Field | Value |
|---|---|
| Full name | Derrick Hall <!-- source: projects/str-seo-strategy/... §2.4 (owner story on /summerville-sc/) + §5 Phase 2 (Derrick Hall author byline) — TODO: ask Jason to confirm Derrick is the primary author entity vs. secondary --> |
| Title / role | [TODO: ask Jason — strategy §2.4 describes Derrick as the Summerville "owner" per the page's existing owner story; exact title (Owner / GM / Founder of CCC) needs confirmation] |
| Credentials to display | [TODO: ask Jason — NATE certification status, years of experience, and any other credentials not documented. Strategy §11 decision #3 explicitly flags "NATE-certified tech count" as blocking author-page E-E-A-T build-out.] |
| Schema @id | [TODO: ask Jason — to be assigned once author page URL confirmed. Recommended pattern: https://coastalcarolinahvac.com/#derrick-hall] |
| Author bio page URL on client site | [TODO: ask Jason — per strategy §5 Pillar 5, "Build 2–3 technician author pages"; page does not yet exist. Recommended URL: https://coastalcarolinahvac.com/about/derrick-hall/] |
| Bio page status | [x] Exists / [x] Needs to be built (required per Core Standards Phase 4.7) <!-- source: projects/str-seo-strategy/... §5 Pillar 5 — author pages listed as "build" work, not existing --> |
| Headshot URL (minimum 400×400) | [TODO: ask Jason — not captured] |
| Bio paragraph (150 words, first-person optional) | [TODO: ask Jason — owner story exists on /summerville-sc/ per strategy §2.4 but has not been extracted into brand_context. Needs capture and rewrite to 150-word bio format.] |

### 3.2 Expert sameAs URLs
| Platform | URL |
|---|---|
| LinkedIn | [TODO: ask Jason/Mike — not captured] |
| Twitter / X | [TODO: ask Jason/Mike — not captured] |
| Instagram | [TODO: ask Jason/Mike — not captured] |
| Author site / personal URL | [TODO: ask Jason/Mike — not captured] |
| Wikipedia (if exists) | [TODO: ask Jason — likely does not exist] |
| Crunchbase | [TODO: ask Jason — likely does not exist] |
| Published work / books | [TODO: ask Jason — likely none] |
| Podcast / speaking archive | [TODO: ask Jason — likely none] |

### 3.3 Expertise Areas (feeds knowsAbout schema)
List 5–10 topical areas the expert has demonstrable expertise in:
1. Residential HVAC repair and installation — Lowcountry South Carolina market <!-- source: brand_context/positioning.md + icp.md -->
2. Heat pump systems (repair and replacement) <!-- source: strategy §2.2, §6 keyword priority list -->
3. Salt-air corrosion impact on condenser coil lifespan (east-of-I-26 specialty) <!-- source: brand_context/voice-profile.md + positioning.md hook bank -->
4. Lowcountry humidity and indoor air quality (IAQ) — pollen season, "Summerville Sneeze," coastal mold <!-- source: brand_context/voice-profile.md + icp.md pain points -->
5. Emergency AC repair and same-day service dispatch <!-- source: brand_context/icp.md Segment 1 -->
6. Duct cleaning and crawl-space encapsulation in coastal/humid homes <!-- source: strategy §2.2 tracked keywords + §6 -->
7. HVAC system sizing for pre-2000 Lowcountry housing stock <!-- source: brand_context/voice-profile.md + positioning.md -->
8. [TODO: ask Jason — confirm Derrick's direct SME area: field HVAC work vs. ownership/operations]

### 3.4 Secondary Authors (If Applicable)
For each additional named author on the site, duplicate fields 3.1 and 3.2 below:

**Secondary Author #1: Mike [last name TBD]** <!-- source: strategy §5 Pillar 5: "Mike gets an author page and cites on brand-story content." —TODO: ask Jason for Mike's full name, role at CAP/CCC, credentials, and bio. Mike is the primary decision-maker contact for the engagement per strategy §11. -->

**Secondary Author #2 (planned): 2–3 technician author pages** <!-- source: strategy §5 Pillar 5 — TODO: ask Jason to nominate specific techs for author pages once NATE count is confirmed -->

### 3.5 Brand-Voice Attribution Fallback (E-Commerce Without Named Spokesperson)
If the client is e-commerce without a named expert, document how content attribution works:
- [ ] Brand-only attribution (no individual expert named; brand story serves as authority anchor)
- [x] Founder attribution (founder's name used even without formal expert positioning) <!-- source: positioning.md ("The local HVAC operation a Summerville or Charleston homeowner would have chosen in 1978 — still run by people who answer the phone") + strategy §5 Pillar 5 (Derrick byline on Summerville content, Mike byline on brand-story content) -->
- [ ] Other: _____

---

## SECTION 4 — VOICE PROFILE

### 4.1 Tone Characteristics
3–5 specific descriptors, not generic adjectives like "professional": <!-- source: brand_context/voice-profile.md -->
- **Warm + Authoritative (baseline register)** — the tone of a long-tenured local HVAC company that knows Summerville, Mount Pleasant, and the Grand Strand by heart
- **Reassuring + Fast (emergency register)** — calms panic without dismissing it and moves straight to what happens next
- **Concrete over abstract** — "coil corrosion by year 8" beats "systems wear out"; specific geography ("east of I-26") over generic "coastal areas"
- **Homeowner-first framing** — starts sentences with the homeowner's world, not the company's
- **No hedging** — "We strive to..." → "We do."; "We believe that..." → state the thing

### 4.2 Target Reader (as a persona)
Established homeowner, age 35–65, in the Summerville/Charleston metro or Myrtle Beach corridor, owning their home outright or deep into a mortgage, with an HVAC system 10–20 years old that's starting to show it. Speed-to-onsite and trust beat lowest price almost every time. Two dominant lead segments: (1) Emergency Repair — system dies mid-July, phone converter, panicked; (2) Planned Replacement — research-heavy, reads reviews, collects 2–3 quotes, worried "will this company still exist in 5 years to honor the warranty?" <!-- source: brand_context/icp.md -->

### 4.3 Pronoun Rule
- [ ] **Default:** no bare "we" in body copy — use brand name or named expert (Core Standards Phase 3.4)
- [x] **Override CONFIRMED:** "we" permitted in body copy — direct voice per Stop Slop standards <!-- source: Jason confirmation 2026-04-23 + brand_context/samples.md gold-standard sentences ("We keep families...", "We'll listen to your needs. We'll respect your time. We'll fix your problem.") + voice-profile.md reframe "We strive to..." → "We do." -->

If override active, explain reasoning:
CCC voice is founder/neighbor-led local service — direct voice per Stop Slop standards requires "we" + action verb, not brand-name hedges wrapped around corporate third-person phrasing. "We" reads natural in short, direct sentences (samples.md #2, #8) especially when paired with geographic specificity ("from Summerville to Charleston"). Override is bounded: (1) no hedging "we's" ("we strive," "we believe," "we think") — those are Stop Slop violations regardless of override; (2) brand name or named expert still anchors headlines, proof sections, and E-E-A-T attribution; (3) schema `author` and bylines use named-expert attribution, never "Coastal Carolina Comfort Staff" or "we."

### 4.4 Client-Specific Banned Phrases
Additions to the Phase 8 universal ban list. List industry-specific or brand-specific phrases to avoid on this client's content: <!-- source: brand_context/voice-profile.md "Words and phrases to avoid" + samples.md "Sentences to rewrite, not reuse" -->
- "Your trusted partner in comfort"
- "South Carolina's preferred choice [for heating, cooling, and plumbing]"
- "We're not happy until you're happy"
- "Dedicated to excellence"
- Any variant of "world-class service"
- "Your Trusted HVAC Contractor for Heating, Cooling & Plumbing in South Carolina" (generic SEO headline register)
- "Beating the heat" and other AC wordplay/puns
- "Since 1947" used in H1 or hero unless page is specifically about company history — and not at all until provenance is verified
- Dispatcher-script corporate phrasing (anything that sounds like a national call-center routing)
- "We strive to...", "We believe that...", "One of the best..." (hedges that weaken authority)
- "Over 75 years" (undersells the 1947-to-2026 timeline; also blocked by 1947 verification gate)
- Generic "coastal areas" when "east of I-26" carries more weight
- Generic "hot summers" / generic climate adjectives when specific humidity numbers (90% in July/Aug) are available

### 4.5 Client-Specific Preferred Phrases / Brand Language
Brand-specific vocabulary and phrasing that should appear: <!-- source: brand_context/voice-profile.md + samples.md -->
- "Comfort you can count on from neighbors you trust" (CCC anchor line)
- "The Lowcountry" (always with the article, capital L)
- "Rooted in Carolina soil"
- "No high-pressure sales"
- "Free in-home estimates"
- "Rest Easy Guarantee"
- "NATE Certified technicians"
- "Same local team, deeper resources" (for CCC→CAP integration messaging only)
- "East of I-26" as a salt-air shorthand
- "Lowcountry summers" (never "hot summers")
- "Summerville Sneeze" / "Flowertown" (for pollen, filtration, IAQ content)
- "Creating lasting relationships since 1947" (footer / email-signoff register only — gated on provenance verification)

### 4.6 Industry-Specific Language Notes
Technical terms, jargon, or phrasing specific to the client's industry: <!-- source: brand_context/voice-profile.md + icp.md "Language they use" + strategy §5 Pillar 4 entity-density list -->
- Named parts should appear by name: capacitor, compressor, condenser, evaporator, coil, air handler, refrigerant, heat pump
- Named brand: Trane (Trane Certified Dealer — use verbatim)
- License framing: "SC Mechanical Contractor #M111694" (verbatim)
- Homeowner's language to echo (not correct): "AC not working," "AC blowing warm air," "System froze up," "Heat pump not heating," "Need someone today"
- Concern language worth echoing directly: "I don't want to get ripped off again," "Will you actually show up?," "Is the warranty worth anything?," "How long will this system last down here?"
- Neighborhoods by name (highest trust signal for local intent): Nexton, Cane Bay, Carnes Crossroads, Historic Summerville, Knightsville, Sangaree, Mount Pleasant, West Ashley, James Island, Daniel Island, Goose Creek, North Charleston, Murrells Inlet, Pawleys Island, Conway

### 4.7 Reading Level Target
- [x] **Grade 6–8 (general consumer) — CONFIRMED** <!-- source: Jason confirmation 2026-04-23. Aligns with brand_context/icp.md (homeowners age 35–65, panic-state emergency converters, mixed HVAC savviness) and voice-profile.md ("Mix short and mid-length. Avoid long compound sentences — homeowners scan."). -->
- [ ] Grade 9–11 (informed consumer)
- [ ] Grade 12+ (specialist / professional)

### 4.8 Sample "Sounds Like / Doesn't Sound Like"
**Sounds like:** <!-- source: brand_context/samples.md (gold-standard sentences) + voice-profile.md (in-practice examples) -->
- "Most condenser coils east of I-26 show corrosion damage by year 8 because of salt air. If yours is approaching that age, a seasonal check catches the small stuff before it becomes a full replacement."
- "Dead system and 95 degrees outside is the worst day of the summer. A tech is on the way. Here's what to do with your breaker and thermostat while we head over."
- "We keep families across Lowcountry South Carolina from Summerville to Charleston cool with 24/7 emergency repair."
- "No high-pressure sales. Just friendly, expert advice from local pros."
- "Rooted in Carolina soil, we bring generations of hometown service."
- "HVAC or plumbing emergencies shouldn't make you late to the beach."
- "We'll listen to your needs. We'll respect your time. We'll fix your problem."

**Doesn't sound like:** <!-- source: brand_context/samples.md "Sentences to rewrite, not reuse" + voice-profile.md "Words and phrases to avoid" -->
- "Coastal Air Plus is South Carolina's preferred choice for heating, cooling, and plumbing service. We offer 24/7 emergency service and top-quality installations." (generic franchise register)
- "Your Trusted HVAC Contractor for Heating, Cooling & Plumbing in South Carolina." (SEO-optimized but voiceless)
- "We've built relationships with homeowners like you for over 75 years." (undersells the heritage timeline, leans on generic "relationships")
- "Your trusted partner in comfort" / "Dedicated to excellence" / "World-class service" (corporate-franchise filler)

---

## SECTION 5 — DESIGN TOKENS

_Captured via Firecrawl branding extraction on 2026-04-23 against live coastalcarolinahvac.com (confidence: 0.925). Values below are as-detected; confirm with Mike on any where the brand team has a preferred spec. Full capture and the CAP parent-brand reference set live in `brand_context/assets.md`._

### 5.1 Color Palette (hex codes) <!-- source: brand_context/assets.md § Coastal Carolina Comfort (Firecrawl extraction 2026-04-23) -->
| Token | Hex |
|---|---|
| Primary brand color | `#F68029` (orange — accent/attention role on live site) |
| Secondary brand color | `#56B9F5` (light blue) |
| Accent color 1 (primary button) | `#097BAA` (teal — CTA button background) |
| Accent color 2 | `#092A49` (dark navy — secondary button + text/link) |
| Background (light mode) | `#FFFFFF` |
| Background (dark mode) | N/A — no dark mode detected |
| Body text on light | `#092A49` (dark navy) |
| Body text on dark | N/A |
| Heading on light | `#092A49` (dark navy — inferred from text primary) |
| Heading on dark | N/A |
| Link color | `#092A49` (dark navy) |
| Link hover color | [TODO: ask Jason — not captured in static branding extraction; verify on live site] |

<!-- Primary/Accent color nomenclature on CCC is non-standard: the "primary" color detected (#F68029 orange) is an attention accent, while the teal #097BAA is functionally the primary CTA color. Content briefs should specify "use #097BAA for primary CTAs" rather than "use primary brand color" to avoid ambiguity. -->

### 5.2 Typography <!-- source: brand_context/assets.md § Coastal Carolina Comfort Typography -->
| Token | Font | Source |
|---|---|---|
| Primary heading | `Teko, sans-serif` | Google Fonts (Teko): https://fonts.google.com/specimen/Teko |
| Secondary heading | `Teko, sans-serif` (same stack — no separate secondary heading font detected) | Google Fonts |
| Body (paragraph copy) | `Rubik, sans-serif` | Google Fonts (Rubik): https://fonts.google.com/specimen/Rubik |
| Body (UI chrome / system) | system-native stack: `-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif` | system |
| Primary font family (LLM-classified role) | `Roboto` (body) | system stack fallback |
| Monospace (code blocks) | [TODO: ask Jason — not applicable/not detected; unlikely used on client site] | — |

**Font sizes detected:** H1 `24px`, H2 `20px`, body `18px`.

### 5.3 Button / CTA Style <!-- source: brand_context/assets.md § Coastal Carolina Comfort Button system -->
| Spec | Value |
|---|---|
| Button radius (primary) | `2px` |
| Button radius (secondary) | `5px` |
| Button padding | [TODO: ask Jason — not captured in branding extraction; inspect live site during Week 1 CMS access walkthrough] |
| Primary button background | `#097BAA` (teal) |
| Primary button text color | `#FFFFFF` |
| Primary button hover state | [TODO: ask Jason — not captured in static extraction; verify live] |
| Secondary button background | `#092A49` (dark navy) |
| Secondary button text color | `#FFFFFF` |
| Secondary button radius | `5px` |
| Button font-weight | [TODO: ask Jason — not captured; typical: 600–700 for CTA] |
| Primary CTA default label | "SCHEDULE A FREE QUOTE" (detected as primary button text on site) |
| Secondary CTA default label | "Learn More About Us" |

### 5.4 Theme Preference
- [x] **Light theme default** <!-- source: Firecrawl extraction "colorScheme": "light"; no dark-mode assets or media queries detected -->
- [ ] Dark theme default
- [ ] System preference (auto)
- [ ] Both available with user toggle

### 5.5 Imagery Style
Describe the client's photography or illustration style with reference URLs to existing good examples:

**Current state (from site scrape):**
- OG image uses service-grid layout: https://coastalcarolinahvac.com/wp-content/uploads/2024/02/Coastal-Carolina-Comfort-HVAC-Air-Conditioning-Heating-and-Indoor-Air-Quality-Services.png
- Current imagery skews toward stock homeowner photography and HVAC product shots rather than field work.

**Target imagery style (per strategy §5 Pillar 1):**
- Real geotagged photography of techs on job sites in named Summerville neighborhoods (Nexton, Cane Bay, Carnes Crossroads, Historic Summerville) — strategy explicitly specifies "not stock imagery" for GBP.
- Customer photos where permission-cleared (before/afters, named-neighborhood job completion shots).
- Avoid: generic smiling-technician-giving-thumbs-up stock, generic air-conditioner-on-white-wall stock.

[TODO: ask Mike to supply 20+ geotagged field photos for GBP + content use, per intake doc.]

### 5.6 Iconography
[TODO: ask Jason — iconography system not captured in branding extraction. Recommend Lucide or Heroicons if content team needs to add new icons to match the flat-design / 0px-border-radius aesthetic of the current CCC site.]

### 5.7 CRITICAL FINDING from visual-asset capture (feeds §11.7 and Week 1 fix list)

**CCC logo alt text is an entity-graph leak.** The live site's logo `alt` attribute reads:
> `"Logo showing Coastal Carolina Comfort LLC above now part of and a larger Coastal Air Plus in teal and purple with a wave design above the text."`

Per strategy §2.3, this alt text is one of the compounding causes of the March–April ranking decline — it embeds "Coastal Air Plus" into crawlable page content during a ranking-recovery window, mixing two brand entities in Google's entity graph at the worst possible time.

**Recommended Week 1 fix:** replace alt with CCC-only description — e.g., `"Coastal Carolina Comfort — HVAC services in Summerville and Charleston, SC"`. This respects the brand-identity lock (Section 11.4) and removes the entity-graph ambiguity. Should be actioned during CMS access walkthrough in Week 1.

### 5.8 Parent-brand reference (OUT OF SCOPE — do not apply to CCC content)

The Coastal Air Plus parent-brand site (coastalairplus.com) uses a completely different design system — Poppins + Source Sans Pro typography, golden-yellow (`#E8B904`) primary color, teal-navy secondary — and shares zero tokens with the CCC system above. Full capture is in `brand_context/assets.md`. **Do not mix CAP tokens into CCC content briefs.** Per Section 11.4 brand-identity lock, all content on coastalcarolinahvac.com uses the CCC design system exclusively through the brand-hold window.

---

## SECTION 6 — BUSINESS CONTEXT

### 6.1 Business Model
- [ ] Service business (sells time and expertise)
- [ ] E-commerce (ships physical or digital products)
- [x] Local service (service delivered at customer's location) <!-- source: brand_context/icp.md + positioning.md — residential HVAC repair, installation, maintenance; plumbing also mentioned in samples.md and voice-profile.md -->
- [ ] SaaS (subscription software)
- [ ] Hybrid (describe: _____)

### 6.2 Geographic Market
- [ ] Global
- [ ] National (country: _____)
- [x] Regional (list regions: Lowcountry South Carolina — Dorchester, Berkeley, Charleston, Colleton counties + Grand Strand — Horry, Georgetown counties) <!-- source: brand_context/icp.md -->
- [x] Local (list service areas below in 6.3)

### 6.3 Service Areas (Local Businesses Only) <!-- source: brand_context/icp.md + voice-profile.md -->
| City / Region | Primary or Secondary |
|---|---|
| Summerville, SC (incl. Nexton, Cane Bay, Carnes Crossroads, Historic Summerville, Knightsville, Sangaree) | Primary (ICP #1 geo + single in-scope GBP location) |
| Charleston, SC (incl. Mount Pleasant, West Ashley, James Island, Daniel Island) | Secondary |
| Goose Creek, SC | Secondary |
| North Charleston, SC | Secondary |
| Myrtle Beach corridor (incl. Conway, Murrells Inlet, Pawleys Island) | Tertiary (original CAP footprint; snowbird/second-home segment) |

### 6.4 Primary Conversion Action <!-- source: brand_context/icp.md "Channels that convert" — phone for emergency segment, form/quote for planned segment -->
- [x] Book a call (primary — emergency segment converts on phone, planned segment also heavy phone)
- [x] Request a quote (secondary — planned replacement segment)
- [ ] Submit contact form
- [ ] Purchase (e-commerce)
- [ ] Email signup (list builder)
- [ ] Other: _____

### 6.5 CTA URLs <!-- source: brand_context/assets.md for phone numbers — TODO: ask Jason for form URLs and preferred primary CTA button labels -->
| CTA | URL | Button Label |
|---|---|---|
| Primary CTA (Summerville/Charleston line) | tel:8433055728 | [TODO: ask Jason — recommended: "Call (843) 305-5728"] |
| Primary CTA (Myrtle Beach HQ line) | tel:8432383838 | [TODO: ask Jason — recommended: "Call (843) 238-3838"] |
| Secondary CTA (CCC line for Summerville GBP inbound) | tel:8437088735 | [TODO: ask Jason — recommended: "Call Summerville: (843) 708-8735"] |
| Tertiary CTA (quote/form) | [TODO: ask Jason — form URL not captured. Voice sample #6 uses "Schedule a free no-pressure HVAC quote today."] | "Schedule Free Quote" (from samples.md) |

### 6.6 Pricing Treatment (Service Businesses Only)
Per Service Page SOP Phase 10:
- [ ] Treatment A — Transparent / exact pricing displayed
- [x] **Treatment B — Tiered packages with "Starting at" prices — CONFIRMED** (tune-ups, maintenance plans, diagnostic service fees) <!-- source: Jason confirmation 2026-04-23 + brand_context/samples.md: "$79 Spring Tuneup" (starting-price frame), "0% interest for 24 months" (tiered financing) -->
- [x] **Treatment C — Custom quote with framed pricing logic — CONFIRMED** (full system replacement, major repair, installation) <!-- source: Jason confirmation 2026-04-23 + brand_context/voice-profile.md "Free in-home estimates" + samples.md "Schedule a free no-pressure HVAC quote today" + icp.md planned-replacement segment expects "transparent financing options" -->
- [ ] Not applicable (e-commerce — pricing lives on product pages)

**Mixed treatment logic (HVAC reality):** tune-ups, maintenance memberships, and diagnostic fees use Treatment B ("starting at" prices). Full system repair, heat-pump/AC replacement, and installation use Treatment C (free in-home estimate → custom quote with framed logic explaining why scope drives price). Service page content should match the treatment type per offering — e.g., `/services/hvac-maintenance/` leads with Treatment B, `/charleston-sc/ac-repair/` leads with Treatment C with a B fallback for diagnostic-fee transparency.

### 6.7 Primary Business Offerings <!-- source: brand_context/icp.md + projects/str-seo-strategy/... §2, §5 Pillar 3, §6 keyword priority list + Jason confirmation 2026-04-23 (HVAC-only scope) -->
List the client's primary services or product categories that will receive dedicated pages:
1. AC repair (emergency + scheduled)
2. AC installation / replacement
3. Heat pump repair
4. Heat pump replacement
5. Furnace repair
6. Heating / HVAC system installation
7. HVAC maintenance + membership plan
8. Duct cleaning
9. Indoor Air Quality (IAQ) / humidity / filtration / crawl space encapsulation

**Plumbing — OUT OF SCOPE for this engagement.** <!-- source: Jason confirmation 2026-04-23: "NO plumbing in scope - HVAC only. Defer plumbing entirely until the CAP-branded site is built. Maintain Strategy §3 discipline on coastalcarolinahvac.com being HVAC-focused." --> Plumbing is a parent-brand CAP offering per brand_context/voice-profile.md and samples.md but is explicitly deferred until the CAP-branded site is built. Content on coastalcarolinahvac.com (the in-scope SEO property) remains 100% HVAC-focused. If customer reviews or samples contain incidental plumbing references, they may be preserved in quoted review blocks but no plumbing service pages, plumbing FAQ blocks, plumbing schema entries, or plumbing-keyword targeting is produced for this site under this engagement. Same-local-plumber referral language is the only plumbing-adjacent copy permitted.

### 6.8 Sales Cycle
| Field | Value |
|---|---|
| Typical time from inquiry to close | Emergency segment: same-day to 48 hours (phone convert). Planned replacement: 2–6 weeks with 2–3 competing quotes. <!-- source: brand_context/icp.md Segments 1 & 2 --> |
| Average order value / project value | [TODO: ask Jason — not documented. Strategy §6 keyword priority list implies install/replacement AOV significantly higher than repair AOV. Needs specific ranges.] |
| Repeat purchase rate | [TODO: ask Jason — not documented. Membership program exists per voice-profile.md "Membership Program" line and positioning.md operational-depth list — LTV from recurring tune-ups could anchor this.] |

---

## SECTION 7 — TECHNICAL STACK

### 7.1 Platform / CMS
| Field | Value |
|---|---|
| CMS | [TODO: ask Jason — not explicitly named. Strategy §2 identifies a "vendor-CMS template" based on URL pattern (-617782, -617779, -617778 suffix pattern common to HVAC industry vendor platforms e.g. Marketing 360 / Madwire, Scorpion, Dex Media, or Blue Corona). Week 1 diagnostic (strategy §7.1 item 6) is supposed to confirm CMS capabilities.] |
| Theme or framework | [TODO: ask Jason — not captured; likely vendor-provided template] |
| Page builder (if applicable) | [TODO: ask Jason — not captured] |
| Hosting provider | [TODO: ask Jason — not captured, likely bundled with CMS vendor] |
| CDN | [TODO: ask Jason — not captured] |
| **CLOUDFLARE AI BOT MANAGEMENT CHECK** | [ ] Verified AI bots NOT blocked / [ ] Action required (Core Standards Phase 7.1) <!-- TODO: ask Jason — not yet verified; add to Week 1 diagnostic list --> |

### 7.2 Analytics & Tracking
| Field | Value |
|---|---|
| GA4 Measurement ID | [TODO: ask Jason — strategy §11 decision #5 flags GA4 access as blocking item; ID not captured] |
| Google Search Console property | sc-domain:coastalcarolinahvac.com (recommended — TODO: confirm access; strategy §7.1 item 5 references GSC usage) |
| Google Tag Manager container ID | [TODO: ask Jason — not captured] |
| Meta Pixel ID | [TODO: ask Jason — not captured] |
| Other tracking pixels | [TODO: ask Jason — not captured] |
| Call tracking (if used) | WhatConverts (dynamic number insertion on GBP/site) <!-- source: projects/str-seo-strategy/... §2.3 cause #4 ("WhatConverts tracking-number churn") — TODO: ask Jason to confirm WhatConverts account ownership and access --> |

### 7.3 Schema Identifiers
| Field | Value |
|---|---|
| Organization @id | [TODO: ask Jason — not yet implemented. Strategy §5 Pillar 4 specifies Organization schema site-wide with sameAs pointing to every CCC profile in assets.md. Recommended pattern: https://coastalcarolinahvac.com/#organization] |
| Primary Person @id | [TODO: ask Jason — see §3.1; recommended pattern: https://coastalcarolinahvac.com/#derrick-hall once author page is built] |
| WebSite @id | [TODO: ask Jason — not captured. Recommended pattern: https://coastalcarolinahvac.com/#website] |

### 7.4 Sitemap, Robots, and AI Files
| Field | Value |
|---|---|
| Sitemap URL | [TODO: ask Jason — not captured; likely https://coastalcarolinahvac.com/sitemap.xml but needs confirmation] |
| Robots.txt URL | [TODO: ask Jason — not captured; likely https://coastalcarolinahvac.com/robots.txt but needs confirmation] |
| Sitemap managed by | [TODO: ask Jason — depends on CMS; likely auto-generated by vendor template] |
| llms.txt URL | [TODO: ask Jason — not yet created] |
| llms.txt status | [ ] Created / [x] Not yet created (required per Core Standards Phase 7.2) <!-- source: strategy §4 Pillar 4 implies AEO-readiness work; llms.txt not explicitly scheduled but required per Core Standards --> |
| llms-full.txt status | [ ] Created / [x] Not applicable (only for sites with 50+ articles) <!-- source: strategy §8 indicates current article count is low; re-evaluate after 90-day content build --> |

### 7.5 Third-Party Tools In Use <!-- source: projects/str-seo-strategy/... §11 decision #4 + §7.1 diagnostic items -->
- WhatConverts — call tracking (confirmed in use on GBP)
- [TODO: ask Jason — strategy §11 decision #4 asks whether ServiceTitan, Podium, or Birdeye is already set up for post-service review request automation. Not yet confirmed.]
- Semrush / Ahrefs / Sitechecker (agency-side SEO tools — strategy §11 decision #5 flags access as pending)
- Trane dealer platform integration (status unclear — strategy §5 Pillar 5 says "already held per assets.md — verify it's live and pointing to coastalcarolinahvac.com")

### 7.6 Access Credentials (Documented Separately — NOT In This Sheet)
Credentials, API keys, and admin passwords are stored in the agency password manager (1Password vault: `[Client Name] — ROI.LIVE`). This sheet notes access status only:

| System | Access Granted | Access Level |
|---|---|---|
| CMS admin | [ ] Yes <!-- TODO: ask Jason — strategy §11 item 5 flags as pending --> | [TODO: editor / admin TBD] |
| GA4 | [ ] Yes <!-- TODO: ask Jason — pending --> | [TODO: editor / admin TBD] |
| Google Search Console | [ ] Yes <!-- TODO: ask Jason — pending --> | [TODO: delegated user TBD] |
| Google Business Profile | [ ] Yes <!-- TODO: ask Jason — strategy §11 item 5 flags Summerville GBP manager access as pending; strategy §12 lists this as a core assumption --> | [TODO: manager / owner TBD] |
| Hosting dashboard | [ ] Yes <!-- TODO: pending --> | [TODO: TBD] |
| Social accounts | [ ] Yes <!-- TODO: pending --> | [platforms: Facebook (CCC), YouTube (CAP), Facebook (CAP), Instagram (CCC), Tumblr (CCC) — per assets.md] |

---

## SECTION 8 — YMYL CLASSIFICATION

### 8.1 YMYL Status
Does the client's content touch topics affecting readers' money, life, health, or safety?

- [ ] NOT YMYL (default quality rules apply)
- [x] YMYL (elevated E-E-A-T bar applies per Core Standards Phase 4.5) <!-- source: projects/str-seo-strategy/... §5 Pillar 5 — "HVAC is YMYL-adjacent — Google weights trust signals heavily because a bad install is a safety issue." Also IAQ content (asthma/allergy/mold) is a health topic. Treat as YMYL per Core Standards default "when in doubt, classify as YMYL." -->

### 8.2 If YMYL, Specify Applicable Topics
- [x] Health / medical / mental health <!-- IAQ content — indoor air quality, mold, pollen, asthma triggers; source: brand_context/icp.md pain point #7 + voice-profile.md pollen/Summerville-Sneeze references -->
- [ ] Finance / investing / lending
- [ ] Legal / tax / insurance
- [x] Safety-critical (gas, electrical, structural, chemical) <!-- source: HVAC inherently involves electrical work, gas furnaces, and refrigerant handling — strategy §5 Pillar 5 cites safety as reason for YMYL treatment -->
- [x] Home improvement involving permits or code <!-- source: HVAC replacement and installation typically require SC mechanical permits and code compliance — license #M111694 confirms regulated trade -->
- [ ] Other: _____

### 8.3 Subject-Matter Expert Credentials (YMYL Only)
YMYL content requires editorial review by a credentialed subject-matter expert.

| Field | Value |
|---|---|
| SME name | [TODO: ask Jason — Derrick Hall (primary) + NATE-certified tech TBD; strategy §11 decisions #3 and #5 block the tech authority build-out] |
| SME credentials | SC Mechanical Contractor #M111694 (company license); NATE-certified technicians (count TBD) <!-- source: brand_context/assets.md + samples.md + strategy §5 Pillar 5 — TODO: ask Jason for specific SME's license/NATE holdings + years of field experience --> |
| SME editorial review process | [TODO: ask Jason — not yet established] |
| Review cadence | 6-month cycle (YMYL default per Phase 15.5) |

### 8.4 Required Disclaimers (YMYL Only)
Specific disclaimers that must appear on YMYL content:
- [TODO: ask Jason — not yet drafted. Recommended starting point (sourced tone from voice-profile.md "no high-pressure sales"): "This content is for informational purposes only. For system-specific guidance, a licensed HVAC professional should inspect your equipment — in the Lowcountry, that means someone who knows the salt-air corrosion and humidity realities of your home."]

### 8.5 Elevated Citation Requirements (YMYL Only)
YMYL content requires external authoritative citations. Approved citation sources for this client:
- ACCA (Air Conditioning Contractors of America) — Manual J load calculations, industry best practices <!-- source: strategy §5 Pillar 5 lists "Industry: ACCA, AHRI" for backlinks/citations -->
- AHRI (Air-Conditioning, Heating & Refrigeration Institute) — equipment certification standards <!-- source: strategy §5 Pillar 5 -->
- EPA.gov — refrigerant handling, indoor air quality guidance <!-- industry-standard YMYL citation -->
- ENERGY STAR — efficiency ratings, HVAC sizing <!-- industry-standard YMYL citation -->
- SC LLR (SC Labor, Licensing & Regulation) — license verification, trade regulations <!-- source: strategy §5 Pillar 5 "License #M111694 in footer with link to SC LLR verification" -->
- Trane (manufacturer documentation for installed equipment) <!-- source: brand_context/samples.md + strategy §5 Pillar 5 "Trane Certified Dealer" -->
- [TODO: ask Jason — confirm whether NOAA / local climate data sources should be on the approved list for humidity / salt-air content]

---

## SECTION 9 — OFF-PAGE SEO BASELINE

Captures the starting state of off-page authority signals for reporting benchmarks and strategy planning (Core Standards Phase 11).

### 9.1 Current Backlink Profile <!-- source: projects/str-seo-strategy/... §7.1 item 4 flags full backlink audit as a Week 1 diagnostic; baseline numbers not yet pulled -->
| Metric | Value | Source |
|---|---|---|
| Total referring domains | [TODO: baseline pending Week 1 Ahrefs/Semrush audit per strategy §7.1 item 4] | Ahrefs / Semrush |
| Domain Rating or equivalent | [TODO: baseline pending Week 1] | Ahrefs / Semrush |
| Toxic / spammy links requiring disavow | [TODO: baseline pending Week 1] | Ahrefs / Semrush |
| Most authoritative current backlinks (top 5) | [TODO: baseline pending Week 1] | |
| Editorial backlinks earned in past 12 months | [TODO: baseline pending Week 1] | |

### 9.2 Current Brand Mention Status
| Channel | Presence / Count |
|---|---|
| Google Alerts set up | [ ] Yes / [x] No <!-- TODO: ask Jason to confirm; not documented; recommend setting up --> |
| Brand mentions tracking tool | [TODO: ask Jason — not captured] |
| Recent press mentions (past 12 months) | [TODO: baseline pending — none documented in source files] |
| Wikipedia article | [ ] Exists (URL) / [x] Does not exist <!-- inferred — no Wikipedia reference in assets.md or strategy --> |
| Wikidata entry | [ ] Exists (ID) / [x] Does not exist <!-- inferred — not referenced --> |

### 9.3 Review Presence <!-- source: brand_context/assets.md for URLs; review counts and ratings require Week 1 baseline pull per strategy §5 Pillar 1 -->
| Platform | URL | Review Count | Average Rating |
|---|---|---|---|
| Google Business Profile (CCC Summerville) | [TODO: ask Jason — GBP URL not captured in assets.md; strategy §3.2 confirms the listing exists and is in scope] | [TODO: Week 1 baseline] | [TODO: Week 1 baseline] |
| Yelp (CAP Myrtle Beach) | https://www.yelp.com/biz/coastal-air-plus-myrtle-beach <!-- source: brand_context/assets.md --> | [TODO: Week 1 baseline] | [TODO: Week 1 baseline] |
| BBB (CAP) | https://www.bbb.org/us/sc/myrtle-beach/profile/air-conditioning-contractor/coastal-air-plus-0593-90359823 <!-- source: brand_context/assets.md --> | [TODO: Week 1 baseline] | [TODO: Week 1 baseline] |
| Trustpilot | [TODO: ask Jason — not referenced in source files] | — | — |
| Trane Dealer Profile | https://www.trane.com/residential/en/dealers/coastal-air-plus-myrtle-beach-south-carolina-1009750/ <!-- source: brand_context/assets.md --> | [TODO: Week 1 baseline] | [TODO: Week 1 baseline] |

**Yelp NAP flag:** strategy §2.3 notes Yelp has "Lipton St" typo (should be "Lipman St") plus two duplicate listings — fix during Week 1 citation audit.

### 9.4 Google Business Profile (Local Businesses) <!-- source: projects/str-seo-strategy/... §3.2 + §5 Pillar 1 + brand_context/assets.md -->
| Field | Value |
|---|---|
| GBP exists | [x] Yes / [ ] No — single in-scope listing: Coastal Carolina Comfort, Summerville |
| GBP URL | [TODO: ask Jason — direct GBP map URL / g.page short link not captured in source files] |
| GBP primary category | HVAC contractor (target per strategy §5 Pillar 1 item 1; may need confirmation of current state in Week 1 audit) |
| GBP secondary categories | Air conditioning contractor, Heating contractor, Furnace repair service, Air conditioning repair service, Air duct cleaning service, Heat pump supplier (target list per strategy §5 Pillar 1 item 1) |
| GBP verification status | [TODO: ask Jason — assumed verified since listing has reviews, but confirm Week 1 during GBP audit (§7.1 item 1)] |
| Number of GBP photos | [TODO: Week 1 baseline — strategy §5 Pillar 1 target is 20+ geotagged photos] |
| Last GBP post date | [TODO: Week 1 baseline] |
| GBP posting cadence plan | Weekly (target per strategy §5 Pillar 1 item 3) |

### 9.5 Social Footprint <!-- source: brand_context/assets.md + brand_context/icp.md ("Channels that under-perform") -->
| Platform | URL | Followers | Posting Cadence |
|---|---|---|---|
| LinkedIn (company) | [TODO: ask Jason — not captured in assets.md] | — | — |
| LinkedIn (personal — expert) | [TODO: ask Jason — not captured] | — | — |
| Instagram (CCC) | https://www.instagram.com/coastalcarolinacomfort/ | [TODO: baseline] | [TODO: current cadence + recommended cadence] |
| X / Twitter | [TODO: ask Jason — not captured; icp.md flags X as essentially zero signal for this audience] | — | — |
| TikTok | [TODO: ask Jason — not captured; icp.md flags TikTok as wrong demographic] | — | — |
| YouTube (CAP) | https://www.youtube.com/channel/UCE0-IuW2iy7PYKZYwzCY06Q | [TODO: baseline] | [TODO: cadence] |
| Facebook (CAP current) | https://www.facebook.com/p/Coastal-Air-Plus-61551854258851/ | [TODO: baseline] | [TODO: cadence] |
| Facebook (CCC) | https://www.facebook.com/CoastalCarolinaComfort/ | [TODO: baseline] | [TODO: cadence] |
| Facebook (Coastal Air + Refrigeration — predecessor entity) | https://www.facebook.com/CoastalAirMB/ | [TODO: baseline — relevant for 1947 provenance] | — |
| Tumblr (CCC) | https://coastalcarolinahvac.tumblr.com/ | [TODO: baseline] | — |
| Pinterest (CCC) | [TODO: ask Jason — referenced on site per assets.md, handle not publicly indexed] | — | — |

### 9.6 Knowledge Panel Status
- [TODO: ask Jason — not documented; Week 1 audit should screenshot current state for CCC, CAP, and Derrick Hall separately]
- [ ] Knowledge Panel exists for brand (screenshot: _____)
- [ ] Knowledge Panel exists for named expert (screenshot: _____)
- [ ] Neither exists — Knowledge Panel seeding strategy required (Core Standards Phase 11.6)

### 9.7 Digital PR Assets <!-- source: projects/str-seo-strategy/... §5 Pillar 4 (novel first-party data) + Pillar 5 (earned case studies) -->
| Field | Value |
|---|---|
| Proprietary data available for press releases | (a) Year-8 salt-air corrosion threshold east of I-26 (based on CAP/CCC field observations); (b) Charleston peninsula vs. inland HVAC lifespan differential; (c) April call-volume spike tied to Lowcountry pollen + humidity onset; (d) specific patterns by neighborhood (Cane Bay builder-grade air handler issues, Historic Summerville retrofit ductwork realities, Nexton short-cycling frequencies) — all per strategy §5 Pillar 4 — TODO: ask Jason to confirm which are publishable as quantified claims vs. directional color |
| Expert available for journalist queries (HARO, Qwoted, etc.) | [TODO: ask Jason — not yet established; strategy §5 Pillar 5 recommends quarterly case study pitches to local news and regional home/garden publications] |
| Past podcast appearances by expert | [TODO: ask Jason — not documented, likely none] |
| Past press mentions | [TODO: ask Jason — not documented] |

---

## SECTION 10 — CONTENT SCOPE

### 10.1 Page Types In Scope For This Engagement <!-- source: projects/str-seo-strategy/... §5 build order + §8 90-day execution plan -->
- [x] Blog articles (cornerstone: salt-air corrosion piece; humidity/AC-sizing piece; local case studies — see 10.2)
- [x] Service pages (AC repair, AC installation, heat pump repair, furnace repair, duct cleaning, HVAC maintenance, IAQ — city-scoped under `/charleston-sc/*` and `/summerville-sc/*`)
- [ ] Product pages (e-commerce — not applicable)
- [x] Collection / category pages (city hubs: `/charleston-sc/`, `/summerville-sc/`)
- [x] Case study pages (first Summerville case study piece in Weeks 4–10 per §8)
- [ ] Homepage (out of scope as a dedicated rebuild — CCC branding holds per §3.3; home page minor updates allowed)
- [ ] About page (not listed as a scoped deliverable)
- [ ] Contact page (not listed as a scoped deliverable)
- [x] Author bio page(s) — Derrick Hall (primary), Mike [last name TBD], 2–3 technician pages per strategy §5 Pillar 5
- [ ] Policy pages (Privacy, Terms, Editorial Policy, Corrections Policy) — [TODO: ask Jason if in scope; Core Standards typically require Editorial & Corrections policies for YMYL]
- [x] llms.txt file (required per Core Standards Phase 7.2)
- [x] Other: AC repair spoke cluster (symptom pages — `/summerville-sc/ac-repair/ac-not-cooling/`, `/ac-blowing-warm-air/`, `/ac-frozen-coil/`, `/ac-capacitor-replacement/`, `/ac-refrigerant-leak/`, `/emergency-ac-repair/`, `/ac-repair-cost/`) per strategy §5 Pillar 3; GBP optimization work per Pillar 1

### 10.2 Content Production Volume Commitment <!-- partial: strategy §8 provides phase schedule but does not lock in monthly content volume commitments. TODO: ask Jason to lock a monthly volume cap per page type. -->
| Page Type | Per-Month Volume | Total Engagement Volume |
|---|---|---|
| Blog articles | [TODO: ask Jason — strategy implies ~1 cornerstone piece per 6-week window + ongoing supporting] | [TODO: total for 90-day + 180-day plan TBD] |
| Service pages (city-scoped) | Phase 2 rewrites: 3 Charleston pages in Weeks 2–6 <br>Phase 3 new builds: 1 Summerville hub optimization + 3 Tier 1 spokes in Weeks 4–10 <br>Phase 4: remaining `/charleston-sc/*` and `/summerville-sc/*` spokes in Weeks 6–14 | ~14 service pages over 90 days (rewrites + new builds combined) |
| Product pages | N/A (service business) | N/A |
| Case studies | 1 per quarter (Summerville-specific first, Weeks 4–10) | [TODO: ask Jason — 4 per year implied but not locked] |
| Author bio pages | [TODO: 2–4 total over Phase 5 (Weeks 12–24)] | 2–4 total |
| AC repair spoke cluster (symptom pages) | [TODO: cadence TBD — 7 Summerville spokes in Weeks 8–16 per strategy §5 Phase 4] | 14 symptom pages (7 Summerville + 7 Charleston mirror) |
| Long-form E-E-A-T pieces | 2 total over 180 days (salt-air corrosion + humidity/AC sizing) | 2 |

### 10.3 Cluster Plan References <!-- source: projects/str-seo-strategy/... -->
| Field | Value |
|---|---|
| Active cluster plan document URL | /clients/coastal-air-plus/projects/str-seo-strategy/2026-04-23_ac-repair-seo-aeo-master-strategy.md |
| Clusters in production | Charleston Information Gain recovery cluster (Phase 2, Weeks 2–6); Summerville hub + Tier 1 spoke cluster (Phase 3, Weeks 4–10) |
| Clusters planned but not started | AC repair symptom-spoke cluster under `/summerville-sc/ac-repair/*` (Phase 4, Weeks 8–16); Charleston spoke cluster mirror (Phase 4 continued); neighborhood pages (Phase 5, Weeks 12–24, gated on proof assets per strategy Pillar 2) |
| Cluster plan reviewed by client | [ ] Yes / [x] No <!-- TODO: ask Jason — strategy doc is labeled "v2 — scope-locked strategy" and identifies decisions needed from Mike in §11, suggesting client review still pending --> |

---

## SECTION 11 — OVERRIDE RULES

Document client-specific rules that override Agency SOP defaults. Each override requires documented reasoning to maintain QA traceability.

### 11.1 Pronoun Override
- [x] Active / [ ] Not active <!-- source: see §4.3 rationale -->
Reasoning (if active): CCC voice is founder-led neighbor/local-service voice. Gold-standard samples (samples.md #2, #8) and voice-profile.md in-practice emergency example both use "we" naturally when paired with a direct action verb. Override is bounded: no hedging "we's" ("we strive," "we believe") and brand name/named expert must still anchor headlines + proof sections.

### 11.2 Word Count Overrides <!-- no overrides sourced; agency defaults apply. TODO: ask Jason to confirm after reviewing strategy build order. -->
| Page Type | Agency Default | Client Override | Reasoning |
|---|---|---|---|
| Blog pillar | 3,500–5,000 | N/A — agency default applies | Cornerstone salt-air piece sized for authority build |
| Blog supporting | 2,000–2,800 | N/A — agency default applies | Standard supporting content volume |
| Service evergreen | 1,000–1,800 | N/A — agency default applies | City hubs and main service pages land here |
| Service campaign | 600–1,000 | N/A — agency default applies | AC repair symptom spokes likely land here — TODO: confirm with Jason that spokes intended to land in the 600–1,000 band given the emergency-conversion function |

### 11.3 Volume Threshold Overrides
| Threshold | Agency Default | Client Override | Reasoning |
|---|---|---|---|
| Pillar keyword minimum volume | 200+ | N/A — agency default applies | Tier 1 keywords are 210–590/mo (comfortable above the 200 threshold) <!-- source: strategy §2.2 --> |
| Supporting keyword minimum volume | 50+ | **Override: 30+ — CONFIRMED** | Summerville sub-metro reality: Tier 2/3 keywords include "hvac maintenance summerville" (30/mo), "furnace repair summerville sc" (30/mo), and neighborhood keywords (<20/mo). Lowcountry sub-metro volume is genuinely lower than urban averages, but the commercial intent is still strong. Building these as supporting pages captures high-intent traffic below the agency default threshold. <!-- source: Jason confirmation 2026-04-23 + projects/str-seo-strategy/... §2.4 Tier 3 table --> |

### 11.4 Brand Name Density Overrides
Per-client brand name density deviation from the 1-per-120-to-140-words default:

| Page Type | Default | Client Override | Reasoning |
|---|---|---|---|
| Blog article | 1 per 120–140 words | No override — agency default applies | Natural founder-led voice meets default density |
| Service page | 1 per 120–140 words | No override — agency default applies | Natural founder-led voice meets default density |
| Product page | 1 per 120–140 words | N/A (service business) | — |

### **CRITICAL — Brand-name identity rule for coastalcarolinahvac.com (CONFIRMED by Jason 2026-04-23)**

**All body copy on coastalcarolinahvac.com MUST use "Coastal Carolina Comfort" (or "CCC" as informal short form, used sparingly). DO NOT replace CCC references with "Coastal Air Plus" in body copy on this site.**

This rule propagates to **all downstream SOPs and content briefs**. Every service page, blog article, case study, FAQ block, schema `Organization.name`, and author byline attribution on coastalcarolinahvac.com reads Coastal Carolina Comfort. This is non-negotiable through the brand-hold window.

**Reasoning (per strategy §3.3 and Jason confirmation):**
- The CCC brand carries the "carolina heating and air" branded-rank equity — every mention reinforces the entity Google already associates with the Summerville/Charleston SERP footprint.
- Mixing "Coastal Air Plus" into CCC-site body copy triggers Google entity-graph ambiguity during a ranking-recovery window (the exact issue flagged in strategy §2.3 as a compounding cause of the March–April decline, where the logo's alt text "now part of ... a larger Coastal Air Plus" mixed into the CCC entity graph).
- Homeowners in Summerville and Charleston recognize CCC as their local company; substituting CAP confuses the trust relationship described in positioning.md ("their guy is still their guy").

**What body copy SHOULD say on coastalcarolinahvac.com:**
- "Coastal Carolina Comfort" (full) — primary usage
- "CCC" (informal) — limit to 2× per page, never in H1/H2/hero
- "your local Summerville HVAC team" / "our Lowcountry team" — neighbor-voice variants that avoid entity-name repetition fatigue
- Named-author bylines (Derrick Hall, Mike, named techs) — per §4.3 pronoun rule and §3.1 expert entity

**What body copy MUST NOT say on coastalcarolinahvac.com:**
- "Coastal Air Plus" (body copy) — reserve for the parent-brand CAP-branded site once built
- "Now part of Coastal Air Plus" / "formerly Coastal Carolina Comfort" / "as Coastal Air Plus" — no brand-transition language on CCC site
- Any phrasing that positions CCC as the acquired party or implies CCC is being retired

**Exceptions (narrow):**
- Footer legal / copyright may reference parent entity if required by counsel — flag per case and confirm with Jason before publishing.
- The "Same local team, deeper resources" message from positioning.md is for acquisition-customer concern response only, and does not introduce the CAP brand name by default.

**Propagation checklist (add to every content brief):**
- [ ] Body copy uses "Coastal Carolina Comfort" / "CCC" only (no CAP mentions)
- [ ] Schema `Organization.name` reads "Coastal Carolina Comfort"
- [ ] Author bylines use named experts, not brand-wrapped "we" variants
- [ ] No brand-transition or acquisition phrasing

### 11.5 Design System Overrides
Any client design rules that deviate from Agency defaults:
[TODO: ask Jason — design tokens are not captured (Section 5); revisit this field once brand visual system is pulled from site scrape.]

### 11.6 Information Gain Elements Preferred <!-- source: projects/str-seo-strategy/... §5 Pillar 4 -->
Some clients have stronger access to specific information gain element types. Rank the top 3 most available for this client:
1. **Proprietary field data** — 78+ years of Lowcountry HVAC field observations, specifically: year-8 salt-air corrosion threshold east of I-26, Charleston peninsula vs. inland lifespan differential, April call-volume spike tied to pollen/humidity onset, neighborhood-specific HVAC patterns (Cane Bay builder-grade air handlers, Historic Summerville retrofit ductwork, Nexton short-cycling frequencies).
2. **Named first-party experience** — specific techs with named credentials (pending NATE count confirmation) doing work in named neighborhoods, with named symptoms and named parts. Entity-dense content defaults to strong here given the license, Trane dealer status, and long tenure.
3. **Unique synthesis** — connecting "Summerville Sneeze" pollen timing to HVAC IAQ load in April; connecting salt air east of I-26 to specific equipment degradation patterns; Lowcountry humidity as an HVAC sizing design constraint (not just a weather condition).

### 11.7 Other Overrides
- **"Since 1947" heritage claim — BLOCKED until provenance verified.** Strategy §11 decision #1 and voice-profile.md both flag BBB-registered LLC dates conflicting with the 1947 heritage narrative. Until Mike confirms ownership-continuity from Coastal Air + Refrigeration (David Long) to current CAP entity, "Since 1947" is banned from H1s, hero copy, ads, and press. "Founded 2019" language currently on the site stays in place. Footer / email-signoff register ("Creating lasting relationships since 1947") and internal About page use remain gated on the same verification.
- **Brand transition messaging — BOUNDED to acquisition-customer context only.** "Same local team, deeper resources" language is for planned-replacement research customers evaluating whether their long-time local company still stands behind its warranty. Everyday service pages and the CCC Summerville GBP do not carry brand-transition language per positioning.md ("Don't over-play the acquisition") and strategy §3.3 brand-hold lock. No "as Coastal Air Plus we now…" phrasing on the CCC site or GBP through peak season.
- **CCC-brand identity lock on SEO site.** Per strategy §3.3: website copy, GBP business name, schema `Organization.name`, social profile names, and directory citations continue to read Coastal Carolina Comfort. Only on-site brand change is the logo asset (already swapped). No NAP or brand-name edits through peak season.

---

## SIGN-OFF

Sheet complete and ready for content production against Agency SOPs:

| Role | Name | Date | Initials |
|---|---|---|---|
| ROI.LIVE Account Manager | [TODO: ask Jason] | | |
| Client Primary Contact | Mike [last name TBD] | | |
| Jason Spencer (final approval) | | | |

---

## APPENDIX A — SOP REFERENCE MAP

Which Parameter Sheet sections each Agency SOP references:

| SOP | Parameter Sheet Sections Referenced |
|---|---|
| Agency Core Standards v1.1 | All sections |
| Blog Article SOP v1.0 | 1, 2, 3, 4, 5, 7, 8, 10, 11 |
| Service Page SOP v1.0 | 1, 2, 3, 4, 5, 6 (esp. 6.6 pricing), 7, 8, 9 (esp. 9.4 GBP), 10, 11 |
| Product Page SOP (forthcoming) | 1, 2, 4, 5, 6 (esp. 6.7), 7, 10, 11 |
| Case Study Page SOP (forthcoming) | 1, 2, 3, 4, 5, 7, 10, 11 |

---

## APPENDIX B — FIELD COMPLETION GUIDANCE

### Brand name exact casing
Exact casing matters for entity consistency. "Rage Create," "RageCreate," and "rage create" read as different entity strings in some parsing contexts. Lock one casing convention and use it everywhere.

### One-sentence brand description
This description feeds both the `og:description` default on the homepage and the first sentence of `llms.txt`. Write it as a standalone declarative sentence under 150 characters that states what the brand is, who it serves, and a distinctive claim.

Good example: "Rage Create makes affirmation card decks and oracle decks for creative people who find traditional self-help too soft."

Weak example: "Rage Create provides creative solutions for your inner journey." (vague, generic, no entity specificity)

### Voice profile "sounds like / doesn't sound like"
Pull the "sounds like" examples from the client's existing content that feels most on-brand. Pull "doesn't sound like" examples from competitors or generic industry content. Specific examples beat abstract descriptors for directing content production.

### YMYL classification
When in doubt, classify as YMYL. The penalty for missing a YMYL flag (under-investing in E-E-A-T for safety-critical content) outweighs the overhead of treating non-YMYL content to YMYL standards.

### Override reasoning
Every override documents why. Future content producers (human or AI) reference the Parameter Sheet without access to the original engagement context. Reasoning prevents drift and enables QA verification.

---

*Template Version 1.0 — April 2026 — ROI.LIVE / Jason Spencer*
*Every field complete = ready to begin content production against the full Agency SOP suite.*
