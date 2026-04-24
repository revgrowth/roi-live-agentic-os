---
client: coastal-air-plus
project: ac-repair-seo-aeo-master-strategy
deliverable: Jordan content task briefs
assigned: Jordan
status: ready — start today
created: 2026-04-23
updated: 2026-04-24
revision_note: "Task 1 retargeted to new pillar URL /charleston-sc/ac-repair/ after 301 redirects from -617782 and -617782bc were set live. Added Redirect + Internal Linking Audit section and Pillar Support layer."
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

# TASK 1 — Build pillar at `/charleston-sc/ac-repair/` *(highest priority)*

**Why this is #1:** Single highest-leverage content move on the site. Both vendor-CMS legacy URLs (`-617782` and `-617782bc`) — which collectively ranked for 4 keywords totaling ~1,760 monthly searches before dropping 10–30 positions in the March Information Gain update — have now been 301 redirected into one clean, keyword-hierarchical pillar URL. The redirects consolidate link equity and past ranking signals into a single destination, but that equity only pays off if the new page earns its place on its own merits. Our job: publish a novel, Charleston-specific AC repair pillar that passes the Information Gain test from day one.

**Canonical URL:** `https://coastalcarolinahvac.com/charleston-sc/ac-repair/`

**Redirects already live (as of 2026-04-24):**
- `https://coastalcarolinahvac.com/charleston-ac-repair-617782/` → `/charleston-sc/ac-repair/` (301)
- `https://coastalcarolinahvac.com/charleston-ac-repair-617782bc/` → `/charleston-sc/ac-repair/` (301)

Both legacy URLs will drop out of the index as Google recrawls; the new URL inherits equity. **Do NOT reference the legacy URLs anywhere in content, internal links, schema, or sitemap.** See the Redirect + Internal Linking Audit section below for Jordan's checklist.

**Keywords this page must target:**
| Keyword | Vol/mo | Current (pre-redirect) | Target 90d |
|---|---:|---:|---:|
| ac repair charleston sc | 590 | 32 | 8 |
| ac repair charleston | 260 | 30 | 8 |
| air conditioner repair charleston sc | 590 | 45 | 10 |
| air conditioning repair charleston | 320 | 48 | 10 |

*"Current" reflects the legacy URLs' positions before the 301s went live. Expect a 1–3 week transition window where rankings shuffle as Google processes the redirects and reassigns signals to the new URL. Monitor with GSC's URL inspection tool; don't read early volatility as a failure signal.*

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

# TASK 1a — Redirect + Internal Linking Audit *(blocker for Task 1 go-live; ~1–2 hours)*

The 301s from `-617782` and `-617782bc` are live, but the site almost certainly still has internal links, navigation items, schema references, sitemap entries, and GBP/directory listings pointing to the legacy URLs. Those legacy links waste crawl budget, create redirect-chain overhead, and dilute the pillar's internal link equity. Jordan should produce a punch list for dev/Mike before Task 1 publishes.

**Audit scope (deliverable: a spreadsheet or checklist):**

1. **Sitewide internal link scan** — crawl coastalcarolinahvac.com (Screaming Frog free-tier is fine up to 500 URLs, or ahrefs/Sitebulb if available). Export every internal link whose target URL contains `charleston-ac-repair-617782` or `617782bc`. For each, note the source page, anchor text, and recommended replacement anchor (default: "AC repair in Charleston" pointing to `/charleston-sc/ac-repair/`).
2. **Navigation menu** — check the main nav, footer nav, and any service mega-menu. Any menu item pointing to a legacy URL is the highest-priority fix (every page on the site inherits it).
3. **XML sitemap** — confirm `/charleston-sc/ac-repair/` is present and the legacy URLs are removed. `[DEV: regenerate sitemap + submit via GSC]`
4. **Schema markup** — check the homepage, Summerville hub, and any service pages for `WebPage.url`, `BreadcrumbList`, or `Service.url` references that still point to legacy URLs.
5. **GBP primary URL** — confirm the Google Business Profile website field points to either the homepage or the new pillar, not a legacy URL. `[Blocked on Mike's GBP access grant — flag for intake]`
6. **Directory/citation listings** — Yelp, BBB, Trane dealer locator, NATE, Angi, Facebook page. Any listing linking to a legacy URL should be updated to the new pillar or the homepage. `[Blocked on Mike's citation access + the Yelp "Lipton St" typo fix already in the Week 1 list]`
7. **GSC action** — once the pillar is live, request indexing on `/charleston-sc/ac-repair/` via URL Inspection. Do NOT submit a URL removal for the legacy URLs — let the 301s do their work naturally so equity transfers cleanly.

**Deliverable format:** single-page checklist or Google Sheet titled `[CCC] Redirect Cleanup Audit — 2026-04-24`. Flag items Jordan can't verify without access (schema, GBP, citations) as `[BLOCKED on intake]` so Mike can batch them.

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

6. **Contextual cross-link to the Charleston pillar.**
   Add one natural, in-body sentence that links up to `/charleston-sc/ac-repair/` with contextual anchor text (not a footer dump). This elevates the new pillar from its closest sibling hub and establishes the hub-sibling relationship Google needs to see. Example placement — drop it into the neighborhoods section or the FAQ:
   > *"Our service area extends east into Charleston proper — if you're in Mount Pleasant, West Ashley, or on the peninsula, see [AC repair in Charleston](/charleston-sc/ac-repair/) for neighborhood-specific coverage."*
   Anchor text variations to rotate if the page gets multiple links over time: "AC repair in Charleston," "Charleston AC repair coverage," "our Charleston AC repair page." Avoid exact-match stuffing (don't use "ac repair charleston sc" as anchor — it reads spammy and Google flags it).

7. **Dev notes** (add as comments in the doc):
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

# PILLAR SUPPORT — elevating `/charleston-sc/ac-repair/` through the content cluster

Task 1 builds the pillar. Tasks 2 and 3 already support it by design. But the 301s alone won't rebuild the topical authority — Google reads a pillar's strength partly through the quality and relevance of the pages linking up to it. The list below tracks every content surface that should point toward the pillar with context-rich anchor text, and every page that should get optimizations specifically to elevate it.

**Already linking to the pillar (confirmed via this doc):**
- Task 2 (`/summerville-sc/`) — adds one contextual cross-link per the Task 2 brief
- Task 3 (salt-air blog) — internal link with anchor "AC repair across Charleston"

**Additional pages to add/update links on (punch list for dev once pages exist):**

| Page | Action | Anchor text recommendation |
|---|---|---|
| `/` (homepage) | Add a Charleston service card or trust-row link if one doesn't exist | "AC repair in Charleston" |
| `/services/ac-repair/` (if a top-level service page exists) | Add "serving Charleston →" link pointing to the pillar | "AC repair across Charleston" |
| `/charleston-sc/` (city hub — Task 4 deliverable) | Feature the AC repair spoke prominently in hub structure | "Charleston AC repair" |
| `/charleston-sc/heating-repair/` (Task 5 deliverable) | Sibling cross-link in related services section | "See also: AC repair in Charleston" |
| `/charleston-sc/duct-cleaning-maintenance/` (Task 7 deliverable) | Sibling cross-link | "AC repair in Charleston" |
| `/heat-pump-services/` | Add Charleston-specific sub-section with link to pillar | "Charleston AC + heat pump repair" |
| `/services/hvac-replacement/` (Task 10 deliverable) | Link from "considering repair instead?" section | "AC repair in Charleston" |
| Blog archive / category pages | If Charleston-tagged blog posts exist, add a sidebar module linking to the pillar | "Need AC repair now?" |

**Pages that should get their own optimization pass to strengthen the pillar's topical cluster** *(queue after Tasks 1–3 ship)*:

1. **`/heat-pump-services/`** — heat pumps are mentioned in the pillar and the salt-air blog. Currently unclear if it has Charleston-specific content; a light AEO pass with named neighborhoods and the salt-air failure pattern would turn it into a legitimate topical neighbor. Adds a second strong signal to the pillar.
2. **`/charleston-sc/duct-cleaning-maintenance/`** — already ranks flat at #26 (noted in Task 7). A small AEO boost plus a reciprocal link with the pillar turns this into mutual support rather than two isolated pages.
3. **Future neighborhood pages** (Mount Pleasant, West Ashley, James Island, Daniel Island — currently blocked on Mike's job-data export) — each neighborhood page MUST link up to the pillar as its primary "schedule AC repair" CTA. Treat this as a hard requirement in the neighborhood-page brief when those tasks unblock.
4. **Future symptom pages** (frozen coil, failed capacitor, refrigerant leak, compressor failure, AC blowing warm air, AC not turning on — the 6 symptoms teased in Task 1's H2) — each symptom spoke's primary CTA should be the pillar. Use anchor text variety: "schedule AC repair in Charleston," "get a Charleston technician out today," "book Charleston AC repair."

**What NOT to do:**
- Don't sitewide-footer-link the pillar with exact-match anchor. That's a 2015 SEO move and Google discounts it.
- Don't link every blog post to the pillar out of context. Only link where topically relevant (HVAC-in-Charleston content). Forced links pollute the signal.
- Don't let the pillar become a link-dump itself — outbound internal links from the pillar to spokes are already listed in Task 1 and are sufficient. Every additional link added there dilutes equity passed to each spoke.

**Measurement:**
Once Task 1 + Task 1a are live, log a baseline in the strategy doc: pillar URL's indexed date (GSC URL Inspection), initial position for the 4 target keywords, internal link count pointing in (Screaming Frog). Re-measure at day 14 and day 30. Pillar position movement + internal link count growth are the two leading indicators that the cluster strategy is working.

---

# NEXT UP (queue for tomorrow / this week)

Drop these into Jordan's pipeline after Tasks 1–3 are in review:

- **Task 4:** Rewrite `/hvac-company-charleston-sc-617778/` as Charleston city hub — biggest recovery need after AC repair (dropped 21→46 on "charleston hvac repair," 590/mo). **Open question for Jason:** should this follow the same redirect pattern as Task 1 — 301 the `-617778` URL to a new clean URL like `/charleston-sc/` and build the city hub there? Recommended yes, for consistency; confirm before Jordan starts.
- **Task 5:** Rewrite `/heating-repair-charleston-sc-617779/` — heating shoulder season is coming, low-risk window to rewrite; consolidate `-617779bc` duplicate via 301. **Same open question:** redirect to `/charleston-sc/heating-repair/` and build clean? Recommended yes.
- **Task 6:** `/summerville-sc/ac-repair/` — new spoke under the Summerville hub once Task 2 is live
- **Task 7:** AEO upgrade on `/charleston-sc/duct-cleaning-maintenance/` — already ranks flat at #26, small content boost should push it; add reciprocal link with Task 1 pillar
- **Task 8:** `/summerville-sc/heat-pump-repair/` — Summerville heat pump spoke
- **Task 9:** Blog article — "The Summerville Sneeze: Pollen, Humidity, and Your HVAC in April"
- **Task 10:** `/services/hvac-replacement/` AEO rewrite with decision-tree content (big AI Overview opportunity); add "considering repair instead?" link to Task 1 pillar

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
