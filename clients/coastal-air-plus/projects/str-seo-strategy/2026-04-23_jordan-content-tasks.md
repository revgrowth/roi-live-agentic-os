---
client: coastal-air-plus
project: ac-repair-seo-aeo-master-strategy
deliverable: Jordan content task briefs
assigned: Jordan
status: ready — start today
created: 2026-04-23
scope: coastalcarolinahvac.com only. Do not reference Coastal Air Plus, parent entity, or brand transition anywhere in content. Brand identity is Coastal Carolina Comfort throughout.
---

# Jordan — Content Tasks Starting 2026-04-23

## Context (read first — 2 min)

Google rolled out an **Information Gain algorithm update in late March 2026**. Templated vendor-CMS pages that restate generic HVAC content got penalized. Our Charleston service pages (the `-617782` URL pattern) dropped 10–40 positions uniformly in mid-March to early April. The fix is content that adds information the top 10 doesn't have — first-party data, named neighborhoods, named jobs, novel synthesis, bylined expertise.

**Every page you write today must pass this test:**
> "Does this page contain at least 3 facts, numbers, or observations that you could not find on the top 5 competing results?"

If no, rewrite until yes. Generic HVAC boilerplate is exactly what the update penalized.

## Hard rules (all tasks)

- **Brand name:** Coastal Carolina Comfort (no "Coastal Air Plus," no "now part of," no acquisition language, no parent-company reference)
- **Phone:** use the tel-link placeholder `tel:CCC_PRIMARY` so dev can swap in the WhatConverts number; display as (843) 708-8735 in visible copy
- **Address:** 110 Lipman St, Summerville, SC 29483
- **License:** SC Mechanical Contractor #M111694
- **Heritage claim:** do not use "Since 1947" yet — provenance unverified. If you need a founding year, use "Founded 2019" or leave it out.
- **Voice:** Warm + Authoritative baseline (see `brand_context/voice-profile.md`). Emergency register for panic-call moments. No franchise language — reference `voice-profile.md` §"Words and phrases to avoid"
- **Run output through humanizer** — `tool-humanizer` skill, deep mode (brand_context/voice-profile.md exists). Share both versions if the score delta is significant.
- **Byline:** Derrick Hall (owner, NATE-certified) is the default author for service and heritage content. Flag any piece where that byline feels forced — we'll add other tech authors as we build out bio pages.

## Deliverable format

For each task below:
- Google Doc titled `[CCC] [Task Name] — 2026-04-23 draft`
- Target word count noted in the brief
- Meta title + meta description at top of doc
- Inline notes for dev handoff: `[DEV: embed GBP map here]`, `[DEV: FAQ schema markup]`, etc.
- Internal link suggestions as markdown links with anchor text notes

---

# TASK 1 — Rewrite `/charleston-ac-repair-617782/` *(highest priority)*

**Why this is #1:** This page has the biggest combined traffic opportunity on the site. It ranks for 4 keywords totaling ~1,760 monthly searches that collectively dropped 10–30 positions since March. It is a vendor-CMS template — exactly what Information Gain targets. Rewriting it with novel Charleston-specific content is the single highest-leverage content move we can make this week.

**URL:** `https://coastalcarolinahvac.com/charleston-ac-repair-617782/`

**Keywords this page must target:**
| Keyword | Vol/mo | Current | Target |
|---|---:|---:|---:|
| ac repair charleston sc | 590 | 32 | 8 |
| ac repair charleston | 260 | 30 | 8 |
| air conditioner repair charleston sc | 590 | 45 | 10 (after `-bc` 301) |
| air conditioning repair charleston | 320 | 48 | 10 (after `-bc` 301) |

**Meta:**
- Title (55–60 chars): `AC Repair in Charleston, SC | Coastal Carolina Comfort`
- Meta description (150–160 chars): `Same-day AC repair across Charleston, Mt. Pleasant, and West Ashley. NATE-certified techs. Honest quotes. Call (843) 708-8735 — a real person answers.`

**Target word count:** 1,500–2,000 words

**Required structure (in order):**

1. **H1:** `AC Repair in Charleston, SC`

2. **Direct-answer block (first 80–120 words, no lead-in):**
   Open with a complete answer to "AC repair Charleston SC" that ChatGPT, Perplexity, or Google AI Overviews can lift verbatim. Name specifics — what's covered, how fast, what it costs, what's included. Example:
   > "Coastal Carolina Comfort provides same-day AC repair across Charleston, including Mount Pleasant, West Ashley, James Island, Daniel Island, and Goose Creek. Our NATE-certified technicians diagnose and repair failed capacitors, refrigerant leaks, compressor issues, frozen evaporator coils, and blower failures — typically within two hours of your call during peak season. Diagnostic fee is waived with repair. Licensed under SC Mechanical Contractor #M111694. Call (843) 708-8735."
   
   Adjust numbers (diagnostic fee, response time) with what's true — do not invent.

3. **Emergency CTA block:** Phone number, "real person answers," typical response time. One line, two buttons (Call Now, Request Service).

4. **H2: The six most common AC repairs we see in Charleston.**
   Named symptoms block — for each, 2–3 sentences covering what the homeowner notices, what's happening technically, what the fix typically looks like. Use `<h3>` for each. Required six:
   - AC blowing warm air
   - AC not turning on
   - Frozen evaporator coil
   - Failed capacitor
   - Refrigerant leak
   - Compressor failure
   
   Each one is a future symptom-spoke page — treat these as teaser copy linking out when those pages ship.

5. **H2: Why Charleston AC systems fail faster than inland systems.**
   This is where Information Gain gets earned. Include ALL of these novel first-party facts (paraphrased from our positioning and voice docs, but make them sharper):
   - Condenser coils east of I-26 show corrosion damage by year 8 — 3–4 years ahead of inland systems
   - Charleston peninsula homes (James Island, downtown, Daniel Island) have the worst salt-air exposure; Mount Pleasant and West Ashley are intermediate; Goose Creek and North Charleston are inland-equivalent
   - April is the highest repair-call month in the Lowcountry — pollen clogs condensers right as humidity spikes to 80%+
   - 90% relative humidity changes AC sizing math — a system rated for Raleigh will undersize in Charleston
   
   Each fact above is a sentence or paragraph. Cite where possible (manufacturer specs, local climate data).

6. **H2: Neighborhoods we serve in Charleston.**
   Name and briefly characterize — 1–2 sentences per neighborhood on the HVAC consideration that's specific to it:
   - Mount Pleasant
   - West Ashley
   - James Island
   - Daniel Island
   - Downtown Charleston (peninsula)
   - Goose Creek
   - North Charleston
   - Hanahan
   - Summerville (one line — links to `/summerville-sc/`)
   
   Example: *"James Island — salt-air exposure is among the worst in the metro. Plan on replacing outdoor condenser coils 3–4 years sooner than inland homes. Annual coil rinses and coatings extend the lifespan."*

7. **H2: What to do before you call us.**
   Three or four homeowner self-diagnostics that show expertise without giving away everything: check the breaker, check the thermostat setting, check if the condensate drain is clogged, check the outdoor unit for debris. Positions us as straight-shooters, not upsellers.

8. **H2: Why Charleston homeowners call Coastal Carolina Comfort.**
   Trust row — not boilerplate. Include:
   - SC Mechanical Contractor License #M111694 (link to SC LLR verification if possible)
   - BBB A+ rated (link to BBB profile from assets.md)
   - Trane Certified Dealer (link to Trane dealer page from assets.md)
   - Family-owned, headquartered on Lipman St in Summerville
   - NATE-certified technicians
   - Free in-home estimates on replacements, no-pressure sales

9. **H2: What Charleston customers say.**
   Three real review snippets — pull from Google reviews. **Each must name a Charleston-area neighborhood** (Mount Pleasant, West Ashley, James Island, etc.). If the current reviews don't name neighborhoods, pick the three that have the most specific detail. No fabricated reviews.

10. **H2: AC repair FAQ.**
    6–8 FAQs, each 40–80 word answer. Questions to cover:
    - How fast can you get a tech to my Charleston home?
    - How much does AC repair cost in Charleston?
    - Is my AC worth repairing or should I replace it?
    - Do you offer emergency AC repair?
    - What AC brands do you work on?
    - Do you warranty your repairs?
    - Why does my AC fail more often than my friends' in Columbia?
    - Can I run my AC if it's blowing warm air?
    
    `[DEV: FAQPage schema markup on this section]`

11. **Author byline at bottom:** *"Written by Derrick Hall, owner of Coastal Carolina Comfort and NATE-certified HVAC technician. Licensed under SC Mechanical Contractor #M111694."*

**Internal links to include:**
- `/summerville-sc/` (anchor: "Summerville AC repair")
- `/charleston-sc/heating-repair/` (anchor: "heating repair in Charleston")
- `/charleston-sc/duct-cleaning-maintenance/` (anchor: "duct cleaning")
- `/heat-pump-services/` (anchor: "Charleston heat pump repair")

**Voice guardrails:**
- Open sentences with the homeowner's situation, not the company's credentials
- "When your AC quits in July..." beats "Coastal Carolina Comfort offers..."
- Specifics over adjectives — "year 8 corrosion" beats "wear and tear"
- Short-to-mid sentences; no compound sentences longer than 25 words
- Zero exclamation marks, zero "trusted partner," zero "world-class"

**Avoid:**
- "Your trusted partner in comfort"
- "South Carolina's preferred choice"
- "We're not happy until you're happy"
- "Dedicated to excellence"
- Any "beat the heat" wordplay

---

# TASK 2 — AEO upgrade on `/summerville-sc/` *(high priority — runs in parallel with Task 1)*

**Why this is #2:** Summerville is our primary geo with zero tracked keywords ranking. The page already exists with good bones (Derrick's owner story, Lipman St anchor, named neighborhoods). It's faster to upgrade than to build from scratch. Once optimized and tracked, it's the fastest net-new visibility win in the 90-day plan.

**URL:** `https://coastalcarolinahvac.com/summerville-sc/`

**Current state:** Page has H1 "Coastal Carolina Comfort: Summerville's Hometown HVAC Team." Body copy references Lipman St, Dorchester County, Nexton, Cane Bay, The Ponds, Knightsville, Sangaree. $0 travel fees for Dorchester County mention. Owner-founder story (Derrick Hall). **Do not rewrite this — augment it.**

**Keywords this page must target:**
| Keyword | Est. vol/mo | Current | Target 90d |
|---|---:|---:|---:|
| hvac summerville sc | 210 | — | 15 |
| summerville hvac | 170 | — | 15 |
| hvac summerville | — | — | — |
| summerville heating and air | 90 | — | 20 |
| hvac companies summerville sc | 90 | — | 20 |

**Meta (update):**
- Title: `HVAC Summerville SC — AC Repair, Heating & Installation | Coastal Carolina Comfort`
- Meta description: `Summerville's local HVAC team since 2019. NATE-certified AC repair, heating, heat pump service across Nexton, Cane Bay, and Historic Summerville. (843) 708-8735.`

**Target word count:** add 800–1,000 words to existing page. Don't delete current content — insert new sections.

**Required additions (in order of where they go):**

1. **New direct-answer block above the fold** (80–120 words, before Derrick's story):
   > "Coastal Carolina Comfort is the family-owned HVAC team serving Summerville, SC from our Lipman Street headquarters. Our NATE-certified technicians handle same-day AC repair, heating and furnace service, heat pump installation, duct cleaning, and indoor air quality solutions across Nexton, Cane Bay, Knightsville, Sangaree, and Historic Summerville — with $0 travel fees for Dorchester County. Licensed under SC Mechanical Contractor #M111694. Call (843) 708-8735."

2. **New H2 after Derrick's story: "HVAC service across Summerville's neighborhoods."**
   For each named neighborhood below, write 2–3 sentences on the HVAC consideration specific to it. This is where Information Gain gets earned — nobody else has this level of local specificity:
   - **Nexton** — primarily new-build homes (post-2014). Builder-grade air handlers oversized for the floor plan; short-cycling is the #1 service call we get here
   - **Cane Bay / Lindera Preserve** — fast-growing master-planned community; heat pumps predominate; warranty still active on most systems means we often warranty-coordinate before repairs
   - **Knightsville / Sangaree** — older homes with original ductwork; duct cleaning and sealing delivers more comfort gain here than most neighborhoods
   - **Historic Summerville / Flowertown** — pre-2000 housing stock, often with retrofit systems; crawl space humidity control is usually as important as the AC itself
   - **The Ponds** — master-planned with a mix of ages; same patterns as Cane Bay for newer builds
   - **Carnes Crossroads** — newest construction in the area; usually first major HVAC issue hits around year 8
   - **Ridgeville / St. George** — rural Dorchester County; longer drive times for competitors means our $0 travel fee is a real advantage

3. **New H2: "Why HVAC systems in Summerville fail the way they do."**
   Same Information Gain play as Task 1, but Summerville-specific:
   - Summerville sits inland enough that salt-air corrosion is milder than Charleston peninsula, but pollen season hits harder — "Summerville Sneeze" is a real nickname and a real IAQ problem
   - April is the #1 call volume month because of pollen + rising humidity
   - New-build (2014+) systems in Nexton and Cane Bay hit a reliability wall at year 8–10 — builder-grade manufacturer warranties end and the first real repairs start
   - Humidity can exceed 90% for weeks at a time — dehumidification load can exceed cooling load in shoulder seasons

4. **New H2: "Summerville HVAC FAQ."** — 6 FAQs, 40–80 word answers each:
   - How fast can you get to my Summerville home?
   - Do you charge travel fees in Dorchester County?
   - Is my builder-grade system in Nexton worth repairing?
   - How often should I get HVAC maintenance in Summerville?
   - Do you offer financing on new systems?
   - What do you do about the Summerville Sneeze?
   
   `[DEV: FAQPage schema markup]`

5. **New section near the bottom — trust row** (same as Task 1 but adapted): license, BBB, Trane, NATE, family-owned, Lipman St HQ.

6. **Dev notes** (add as comments in the doc):
   - `[DEV: embed the Summerville GBP map on this page — pending Mike's GBP access confirmation]`
   - `[DEV: add LocalBusiness schema with areaServed = Dorchester + Berkeley counties, geo coords for 110 Lipman St, priceRange, openingHours]`

**Don't touch:** the existing Derrick Hall owner story paragraph. That's gold — it's exactly the kind of first-party content Information Gain rewards. Leave it alone.

---

# TASK 3 — Blog article: "Why Lowcountry Salt Air Kills HVAC Coils 3 Years Early" *(can start in parallel; no page-recovery urgency but Information Gain catnip)*

**Why this is on the today list:** This is a perfect Information Gain piece. No one in the Summerville/Charleston HVAC market is writing this authoritatively. It earns inbound links from local press and regional home/garden sites. It supports every Charleston service page by being the authority piece they link into. It's 100% novel content — nothing to recover, pure net-new.

**URL (proposed):** `/blog/why-lowcountry-salt-air-kills-hvac-coils/`

**Target keywords:**
- "lowcountry hvac" (low volume, very high intent)
- "salt air HVAC" (long-tail)
- Supporting signal for: "crawl space insulation charleston sc" (AI Overview present), "charleston hvac repair," "ac repair charleston sc"

**Meta:**
- Title: `Why Lowcountry Salt Air Kills HVAC Coils 3 Years Early`
- Meta description: `Condenser coils east of I-26 fail 3–4 years sooner than inland systems. The science, the neighborhoods worst affected, and what you can do about it.`

**Target word count:** 1,400–1,800 words

**Structure:**

1. **H1:** `Why Lowcountry Salt Air Kills HVAC Coils 3 Years Early`

2. **Lede (80–120 words, answer-block ready):**
   Open with the punchline answer — an HVAC system that lasts 15 years in Columbia typically lasts 10–12 in Charleston, and the failure point is the outdoor condenser coil. Name the mechanism (salt + humidity + aluminum/copper = accelerated corrosion). Close the paragraph with a link to our coil-specific service page or AC repair page.

3. **H2: The chemistry — what's actually happening to your coil.**
   - Salt particles settle on coil fins
   - Humidity keeps them in solution
   - Over time, pitting corrosion on aluminum fins and copper tubing
   - First failure mode: refrigerant leak at a pitted tube
   - Second failure mode: aluminum fin disintegration reducing heat exchange
   Keep it technical enough to be credible (name chloride-induced corrosion, mention the galvanic couple between aluminum and copper) but accessible.

4. **H2: Where in the Lowcountry it's worst.**
   Map it by corridor — each zone with specifics:
   - **Peninsula Charleston (downtown, James Island, Daniel Island)** — worst; coil failures by year 6–8 are common
   - **Mount Pleasant, West Ashley** — intermediate; year 8–10
   - **Summerville east side, Knightsville** — moderate; year 10–12
   - **Goose Creek, North Charleston, inland Dorchester (Ridgeville, St. George)** — mild; approaching inland norms (year 12–15)
   This is Information Gain gold. Nobody else has written this.

5. **H2: Which HVAC components get hit hardest.**
   - Outdoor condenser coils (primary)
   - Compressor (secondary — contaminated refrigerant)
   - Heat pumps (worst affected — they run year-round)
   - Mini-splits outdoor units (similar to condensers)
   - Indoor equipment — largely unaffected

6. **H2: What coastal homeowners can do.**
   - Annual coil rinse (when and why)
   - Coil coatings (aftermarket options, effectiveness, cost)
   - Manufacturer-rated coastal models — specifically Trane coastal-rated options (mention without over-pitching)
   - Covers/screens (pros and cons — ventilation matters)
   - Elevation + wind exposure tradeoffs (south-facing ocean-exposure units fail faster)

7. **H2: When to repair vs. replace a corroded coil.**
   - Decision-tree content: age of system, refrigerant type (R-22 vs R-410A matters — R-22 systems aren't worth repairing at this point), corrosion extent, cost vs. full-replacement
   - Link to /services/hvac-replacement/ and /charleston-sc/ac-repair/

8. **H2: Quick answers.** 4–5 FAQ items:
   - How often should I rinse my outdoor coil if I live in Mount Pleasant?
   - Are stainless steel coils worth the upcharge?
   - Does a coil coating void my manufacturer warranty?
   - How do I know if my coil is corroded?
   - Is a heat pump a bad idea near the coast?
   `[DEV: FAQPage schema markup]`

9. **Closing + CTA.** Short — two sentences plus phone number and link to AC repair Charleston page.

10. **Byline:** Derrick Hall, owner, NATE-certified. Published 2026-04-23.

**Internal links:**
- `/charleston-sc/ac-repair/` (anchor: "AC repair across Charleston")
- `/summerville-sc/` (anchor: "HVAC service in Summerville")
- `/heat-pump-services/` (anchor: "heat pump repair and replacement")
- `/services/hvac-replacement/` (anchor: "full system replacement")

**Voice guardrails:**
- Write for a homeowner, not an engineer — but don't dumb it down
- "Your condenser coil is a big radiator that pulls heat out of your house" is the right level
- Use analogies when naming mechanisms (galvanic couple, chloride pitting) — readers get credibility from technical terms but need analogies to retain them
- No exclamation marks, no "surprising truth," no clickbait framing

---

# NEXT UP (queue for tomorrow / this week)

Drop these into Jordan's pipeline after Tasks 1–3 are in review:

- **Task 4:** Rewrite `/hvac-company-charleston-sc-617778/` as Charleston city hub — biggest recovery need after AC repair (dropped 21→46 on "charleston hvac repair," 590/mo)
- **Task 5:** Rewrite `/heating-repair-charleston-sc-617779/` — heating shoulder season is coming, low-risk window to rewrite; consolidate `-617779bc` duplicate via 301
- **Task 6:** `/summerville-sc/ac-repair/` — new spoke under the Summerville hub once Task 2 is live
- **Task 7:** AEO upgrade on `/charleston-sc/duct-cleaning-maintenance/` — already ranks flat at #26, small content boost should push it
- **Task 8:** `/summerville-sc/heat-pump-repair/` — Summerville heat pump spoke
- **Task 9:** Blog article — "The Summerville Sneeze: Pollen, Humidity, and Your HVAC in April"
- **Task 10:** `/services/hvac-replacement/` AEO rewrite with decision-tree content (big AI Overview opportunity)

---

# BLOCKED (waiting on proof assets from Mike)

Do not start these yet — each requires first-party assets that Jordan doesn't have:

- **Hyperlocal pages for Nexton, Cane Bay, Historic Summerville** — each needs 1 named completed job + 2 reviews from that neighborhood + a specific local landmark detail. Ask Mike for a ServiceTitan export or job-history list filtered by zip.
- **Technician author bios** — need NATE certification count, tech names, headshots, years-in-field per tech
- **Warranty proof page** — need specific warranty structure (parts/labor/compressor terms) per Mike's open thread
- **Case study: salt-air coil replacement** — need a specific customer to feature (permission + photos)

---

# Post-publish checklist (per task)

When each draft is ready for review:
1. Run the draft through `tool-humanizer` in deep mode (brand_context/voice-profile.md exists). Share before + after if score delta is significant.
2. Confirm no "Coastal Air Plus" references, no "since 1947" claim, no "trusted partner" language
3. Tag Jason for review before publishing
4. After publish: request reindex via GSC, monitor rankings at day 7 and day 14
5. Log the publish date in the strategy doc's tracking table

---

*Questions? Ping Jason. Voice/tone questions — reference `brand_context/voice-profile.md`. Positioning/hook questions — `brand_context/positioning.md`. ICP language — `brand_context/icp.md`.*
