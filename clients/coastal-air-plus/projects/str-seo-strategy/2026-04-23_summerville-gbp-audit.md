---
client: coastal-air-plus
project: ac-repair-seo-aeo-master-strategy
deliverable: Summerville GBP + citation audit (week 1)
status: v1 — public-facing audit complete; dashboard-only items flagged for Mike
created: 2026-04-23
scope: Coastal Carolina Comfort entity. coastalcarolinahvac.com + the single CCC Summerville GBP only.
---

# Coastal Carolina Comfort — Summerville GBP & Citation Audit

## 1. Top findings (read this first)

Three issues surfaced in the public-facing audit that are highly likely contributors to the March–April ranking decline. All three are fixable without a site rebuild.

### Finding 1 — Phone number setup needs verification against WhatConverts config *(revised)*
The three different phone numbers surfaced in the cross-directory audit — (843) 708-8735, (843) 474-4562, (843) 594-2836 — are almost certainly WhatConverts call-tracking numbers, not NAP drift. WhatConverts uses dynamic number insertion (DNI) to serve a different tracking number per traffic source so leads can be attributed to the directory/campaign that generated them. The different numbers on Yelp, EZLocal, AirConditioningProfessionals, NearbyPros, etc. are the expected behavior of that setup.

| Phone | Where it appears | Likely role |
|---|---|---|
| **(843) 708-8735** | coastalcarolinahvac.com (every page), Yelp, GoLocal247 | WhatConverts default / organic-traffic tracking number served to Googlebot |
| **(843) 474-4562** | EZLocal, AirConditioningProfessionals.com | WhatConverts per-directory tracking number |
| **(843) 594-2836** | NearbyPros.org | WhatConverts per-directory tracking number |

This **doesn't make phone setup a non-issue** — it shifts the question. The real risks with a WhatConverts setup on a local-SEO property are:

1. **GBP phone mismatch.** The GBP should publish the **canonical destination line** (the real office number that WhatConverts forwards to) or a dedicated WhatConverts number *consistently set as the GBP phone in the dashboard*. If the GBP phone is a tracking number that rotates or was swapped at any point in the decline window, that's a real signal break.
2. **Googlebot-served number ≠ GBP phone.** Googlebot typically receives the hardcoded HTML default (which appears to be 843-708-8735 site-wide). If that doesn't match what's on the GBP, Google sees inconsistency between the site and the listing.
3. **Citation phone ≠ GBP phone.** Yelp and major aggregators should carry the same number as the GBP — not the per-directory tracking number — so the citation graph reinforces the GBP identity rather than fragmenting it.
4. **Number churn.** WhatConverts occasionally rotates or expires tracking numbers. If any number that was published on the GBP or Yelp got recycled between 2026-03-15 and 2026-04-10, that would explain the decline timing exactly.

**What I need from Mike to finalize this finding:**
- What is the canonical destination/office phone that WhatConverts forwards calls to?
- What phone number is currently published on the Summerville GBP?
- What phone was published on the Summerville GBP in February? Has it changed since?
- Is WhatConverts configured to serve a consistent number to Googlebot (and is that number the same as the GBP phone)?
- Were any WhatConverts numbers provisioned, retired, or reassigned between 2026-02-01 and 2026-04-10?

**Impact estimate:** depends on answers above. If all numbers align to a canonical GBP phone and WhatConverts serves a stable Googlebot number, this is a non-issue. If there's drift between site-default, GBP, and canonical destination, it's a Tier-1 contributor to the decline.

### Finding 2 — Yelp has the street address misspelled as "Lipton" instead of "Lipman"
Yelp listing title reads: **"110 Lipton St, Summerville, South Carolina"** — a typo of the correct "110 Lipman St." Yelp is a high-authority citation source that Apple Maps, Bing Places, and Google all sample. A one-character typo here corrupts the A in NAP across every consumer that reads Yelp.

Additionally, Yelp has **two listings** for Coastal Carolina Comfort in Summerville:
- `yelp.com/biz/coastal-carolina-comfort-summerville` (original)
- `yelp.com/biz/coastal-carolina-comfort-summerville-3` (the "-3" suffix indicates Yelp's duplicate-disambiguation convention)

Both listings split review and citation equity.

**Impact estimate:** moderate. Typo alone is significant; paired with the duplicate listing it's a citation-graph problem.

### Finding 3 — Brand transition is already visible on the site through the logo image alt text
The user's stated scope is that only the logo was swapped. Public-facing audit confirms the logo has been swapped — **and the alt text on the new logo file reads:** *"Logo showing Coastal Carolina Comfort LLC above now part of and a larger Coastal Air Plus in teal and purple with a wave design above the text."*

Google reads image alt text as textual content. That alt description introduces "Coastal Air Plus" into the entity graph for coastalcarolinahvac.com, which is explicitly *not* what the scope strategy wants during peak season. The logo file may also visually contain both brand names (the alt text describes it that way).

Two subtle side effects:
1. Google's entity-resolution may begin treating the site as associated with — or a sub-entity of — Coastal Air Plus, diluting the "Coastal Carolina Comfort" entity signal that the branded rank #8 on "carolina heating and air" currently depends on.
2. AI assistants (ChatGPT, Perplexity, Gemini) crawling the site will increasingly describe CCC as "now part of Coastal Air Plus" in answers — which is exactly the positioning the scope strategy said to avoid through peak.

**Impact estimate:** low-to-moderate right now, but compounds over time. Fix window is short.

### Why these matter for the March–April decline

The decline started between 2026-03-15 and 2026-04-10. Two candidate causes map tightly to that window: Google's **Information Gain algorithm update (late March 2026)** and site-level changes (logo swap, potential GBP edits). Information Gain is now the primary suspect.

**Hypothesis ranking after audit (revised with Information Gain context):**
1. **Google Information Gain update, late March 2026** — Information Gain ranks pages by how much *new* information they add relative to what the top SERP results already contain. Templated vendor-CMS pages that restate generic HVAC content with a city swapped in are the exact target. The `-617782` and `-617779` URL patterns look like auto-generated template output, and every page that declined shares that pattern. Uniform 10–40 position drops across 8 keywords in a 25-day window is algorithmic signal, not listing-level noise. **This is the probable root cause.**
2. **GBP phone / WhatConverts churn in the decline window** — if a WhatConverts number published on the GBP was rotated, expired, or reassigned between mid-March and early April, that's a timing-perfect explanation for the Local Pack portion of the decline. Still worth diagnosing (see §8) even if Information Gain explains the organic portion.
3. **Logo asset change with dual-brand alt text** — Google re-crawls + re-evaluates entity signals after a prominent image change. Compounds the Information Gain effect by making the page look less authoritative on the CCC entity at the moment Google was re-weighting content quality.
4. **GBP-side edit in the same window** (categories, hours, attributes, services, photos) — can trigger a local-quality review. Dashboard audit log will confirm or rule out.
5. **Yelp typo + duplicate listing (Finding 2)** — baseline drag on local-trust; not the decline trigger.

**Read of the compound effect:** Information Gain pulled the templated Charleston service pages down the organic SERP. GBP + logo + NAP issues then prevented the Local Pack from compensating. That's why the decline looks uniform across keywords — two independent signal systems both weakened in the same window.

---

## 2. Scope of this audit

### What I could see (public-facing, completed here)
- The live coastalcarolinahvac.com website — homepage, Summerville hub, About Us
- Public Yelp, BBB, and directory listings that don't block crawlers
- Cross-directory NAP comparisons
- Search-surface snippets of the Google listing

### What I could not see (requires GBP Manager access)
- The Summerville GBP audit log (every edit since 2026-02-01)
- Current category + attribute + service item fill-state in the dashboard
- Current photo count, upload timeline, and geotag metadata
- Review velocity timeline (reconstructable from public review list, but dashboard is canonical)
- Ownership history / any recent owner-manager changes
- Whether the listing has ever been suspended or flagged
- Yelp, Facebook, BBB, HomeAdvisor, Angi, and GuildQuality listing details (all returned 403 to automated fetch — need browser access)

Items flagged with **⚠ Dashboard** below require Mike (or whoever owns the GBP) to pull the data.

---

## 3. NAP consistency matrix

NAP is one of the most-cited inputs to Local Pack rankings. Because CCC uses WhatConverts call tracking with per-source DNI, the **phone column below is expected to vary by directory** — those differences are tracking numbers, not citation drift. Name and Address drift are the real signals to audit.

| Source | Name | Address | Phone (WhatConverts DNI — varies by design) | Hours | Verdict |
|---|---|---|---|---|---|
| coastalcarolinahvac.com (Googlebot-served default) | Coastal Carolina Comfort LLC | 110 Lipman St, Summerville, SC 29483 | (843) 708-8735 | Not specified on-site | ✅ baseline |
| coastalcarolinahvac.com `/summerville-sc/` | Coastal Carolina Comfort | 110 Lipman St, Summerville, SC 29483 | (843) 708-8735 | — | ✅ matches |
| Yelp (primary listing) | Coastal Carolina Comfort | **110 Lipton St**, Summerville, SC | (843) 708-8735 | — | ❌ address typo |
| Yelp (duplicate listing `-3`) | Coastal Carolina Comfort | **110 Lipton St**, Summerville, SC | (843) 708-8735 | — | ❌ dupe + typo |
| BBB | Coastal Carolina Comfort LLC | 110 Lipman St, Summerville, SC 29483-3608 | (843) 708-8735 (search snippet) | — | ✅ matches (BBB file opened 2026-01-26) |
| EZLocal | Coastal Carolina Comfort | 110 Lipman St, Summerville, SC 29483 | (843) 594-2836 *(WhatConverts)* | M-F 7:00-5:00, Sat-Sun 9:00-5:00 | ⚠ hours need verification; phone OK if intentional |
| AirConditioningProfessionals | Coastal Carolina Comfort | 110 Lipman St, Summerville, SC 29483 | (843) 474-4562 *(WhatConverts)* | M-F 7:00-5:00, Sat-Sun 9:00-5:00 | ⚠ hours need verification; phone OK if intentional |
| GoLocal247 (Yext-syndicated) | Coastal Carolina Comfort LLC | Summerville, SC (full address not visible) | (843) 708-8735 | — | ⚠ alternate website listed: "coastalcarolinacomfortductcleaners.com" — needs verification |
| NearbyPros | Coastal Carolina Comfort | 110 Lipman St, Summerville, SC 29483 | (843) 594-2836 *(WhatConverts, unconfirmed)* | — | ⚠ listing unreachable; manual check |
| HomeAdvisor | Coastal Carolina Comfort LLC | Summerville, SC | — | — | ⚠ 403 blocked — needs manual check |
| Angi | Coastal Carolina Comfort LLC | Summerville, SC | — | — | ⚠ 403 blocked — needs manual check |
| GuildQuality | Coastal Carolina Comfort | Summerville, SC 29483 | — | — | ⚠ 403 blocked — needs manual check |
| Facebook | Coastal Carolina Comfort | Summerville, SC | — | — | ⚠ 403 blocked — needs manual check |
| Apple Maps | — | — | — | — | ⚠ not crawlable — needs manual check |
| Bing Places | — | — | — | — | ⚠ not surfaced in search — needs manual check |
| Google Business Profile | — | — | — | — | ⚠ Dashboard — Mike to capture current-state |

### NA(P) fix priority

The address (A) is where the real drift is. Phone (P) is managed by WhatConverts intentionally.

1. **Correct the Yelp address typo** — "Lipton" → "Lipman." Do this today. Claim the listing if not claimed; submit an edit if it is. Merge or mark as closed the duplicate `-3` listing.
2. **Verify "coastalcarolinacomfortductcleaners.com"** referenced on GoLocal247 — is that a live CCC-owned domain, a typo, or an old redirect? If it's not owned, it's a citation poisoning vector.
3. **Confirm WhatConverts GBP phone policy** (see Finding 1 questions) before any GBP phone change.
4. **Run a citation sweep** (BrightLocal or Whitespark) against the canonical name + address — ignore phone mismatches unless they are *between* site-default and GBP.
5. **Verify hours consistency** across all directories once the canonical hours are confirmed (see §5).

---

## 4. On-site entity-signal issues

### Logo alt text contains "now part of ... a larger Coastal Air Plus"
This is the most urgent on-site fix. Change the logo image's `alt` attribute to a clean: `alt="Coastal Carolina Comfort"`. Keep the visual logo as-is if the visual is staying — but the alt text is what Google reads, and that's where the dual-brand entity confusion is coming from.

### No GBP map embed on the Summerville hub page
`/summerville-sc/` does not embed the GBP map. Adding it provides:
- A strong entity-match signal between the page and the GBP
- A cross-click path from organic → GBP interactions, which feeds GBP engagement back to rankings
- Visible proof-of-location for the Summerville search intent

### Summerville hub already exists — it doesn't need to be built, it needs to be optimized
`/summerville-sc/` is live with an H1 reading "Coastal Carolina Comfort: Summerville's Hometown HVAC Team." and body copy referencing Lipman St, Dorchester County, Nexton, Cane Bay, The Ponds, Knightsville, Sangaree, Wescott, Legend Oaks, and Flowertown. This is good raw material. It doesn't rank because:
- It isn't tracked in the current position-tracking setup (confirmed — §2.4 of the strategy doc shows zero Summerville tracked keywords)
- It likely lacks schema markup (LocalBusiness, FAQPage)
- It has no embedded GBP map
- It may not be in the primary internal navigation (need to verify)
- Inbound internal linking from the homepage and service pages may be thin

**This changes Phase 3 of the strategy from "build Summerville from scratch" to "optimize the existing Summerville hub."** Much faster path to rank. Update the strategy doc's Phase 3 language on next revision.

### `/summerville/` is not a duplicate hub
The second URL (`/summerville/`) is a blog article titled "The Summerville HVAC Maintenance Checklist That Prevents 90% of Repairs" — different URL path, different intent, not a cannibalization risk.

---

## 5. Summerville GBP target-state specification

This is the target configuration for the listing. Hand to Mike (or whoever has Manager access) to apply in the GBP dashboard.

### Identity
- **Business name:** `Coastal Carolina Comfort` (no LLC, no trailing "& Air", no "HVAC" appended — exact match to BBB, exact match to how customers say it)
- **Primary address:** `110 Lipman St, Summerville, SC 29483` (physical storefront, not service-area-only)
- **Primary phone:** `(843) 708-8735`
- **Website:** `https://coastalcarolinahvac.com`

### Categories
- **Primary:** `HVAC contractor`
- **Secondary (set all that are selectable):**
  - Air conditioning contractor
  - Heating contractor
  - Furnace repair service
  - Air conditioning repair service
  - Air duct cleaning service
  - Heat pump supplier

### Service items (each one is a ranking signal)
Each item should have a short description. Suggested set:
- AC repair — Same-day diagnosis and repair for AC units that won't cool, blow warm air, or freeze up. Serving Summerville, Nexton, Cane Bay, and Dorchester County.
- AC installation — Trane-certified AC installation for Summerville homes, including humidity-control systems designed for Lowcountry moisture loads.
- Heat pump repair — Diagnosis and repair for heat pump units across Dorchester, Berkeley, and Charleston counties.
- Heat pump installation — Full-system heat pump installs with financing available.
- Furnace repair — Gas and electric furnace repair across Summerville and the Lowcountry.
- Furnace installation — New furnace installs, including replacements for end-of-life systems.
- Duct cleaning — Full-system air duct cleaning for Summerville and Charleston homes, including dryer vent cleaning.
- HVAC maintenance — Seasonal tune-ups and annual maintenance plans that prevent the majority of mid-summer breakdowns.
- Indoor air quality — IAQ solutions for Lowcountry pollen season and high-humidity homes — air purification, humidity control, whole-home filtration.
- Crawl space encapsulation — Crawl space encapsulation and humidity control for coastal Summerville and Charleston homes.

### Attributes (check every applicable one)
- [ ] Wheelchair accessible entrance — ⚠ Dashboard, confirm physically true before checking
- [ ] Wheelchair accessible parking — ⚠ Dashboard, confirm
- [ ] Appointment required
- [ ] Online appointments
- [ ] Onsite services
- [ ] Language assistance (if any techs speak a second language)
- [ ] Accepts credit cards / debit cards / checks / cash / mobile payments (select all that apply)
- [ ] Small business
- [ ] Family-owned
- [ ] Veteran-led / veteran-owned — ⚠ Confirm with Mike; if applicable, this is a high-value attribute
- [ ] Women-owned — ⚠ Confirm (Erica Horne is Registered Agent per BBB)
- [ ] 24/7 emergency service — ⚠ Confirm; if true, this unlocks emergency-segment Local Pack visibility

### Products section
- Trane residential HVAC systems
- Maintenance plans (membership program)
- Financing — ⚠ Confirm available financing partners/terms; add them as linked products

### Hours
- ⚠ Dashboard — current state unknown
- Recommended hours to publish (pending Mike confirmation):
  - M–F: 7:00 AM – 6:00 PM
  - Sat: 8:00 AM – 4:00 PM
  - Sun: Closed (or 24/7 emergency if true)
- **Fix the hours inconsistency across directories** — EZLocal and AirConditioningProfessionals both show M-F 7-5, Sat-Sun 9-5, which may be outdated.

### Service area
- List Dorchester and Berkeley counties
- Name the following cities as served: Summerville, Nexton, Cane Bay, Knightsville, Sangaree, Ladson, Ridgeville, St. George, Goose Creek, Moncks Corner
- Keep Charleston-metro cities (Mount Pleasant, West Ashley, etc.) in the service area list even though the storefront is in Summerville — this earns relevance signal on Charleston-localized searches

---

## 6. "From the business" description (draft)

1000-character limit on GBP. Draft below stays at ~730 characters to leave room for minor edits. Written in CCC voice per voice-profile.md and positioning.md. No mention of Coastal Air Plus, no brand-transition language, no parent-entity reference.

> Coastal Carolina Comfort is the family-owned HVAC team Summerville homeowners have trusted since our founding. Headquartered on Lipman St, we serve Nexton, Cane Bay, Knightsville, Historic Summerville, and the surrounding Dorchester and Berkeley County neighborhoods every day.
>
> Our NATE-certified technicians handle AC repair, heating repair, heat pump service, duct cleaning, and full system replacement — built for Lowcountry summers and the humidity that comes with them. We answer the phone when you call, show up when we say we will, and explain the work before we do it. Free in-home estimates. No high-pressure sales.
>
> For emergency AC repair in Summerville, call (843) 708-8735.

Alternate opener if Mike confirms "Since 1947" provenance:
> Coastal Carolina Comfort has served Summerville families through nearly eight decades of Lowcountry summers...

Do not ship the alternate until provenance is verified (open thread from 2026-04-22).

---

## 7. Photo brief — 20+ shots for the listing

**Guidelines for every shot:**
- Geotagged at 110 Lipman St or at the actual job site within Dorchester/Berkeley/Charleston county
- Real techs, real jobs — no stock imagery, no generic brand shots
- File names descriptive: `ccc-summerville-ac-repair-nexton-2026-04.jpg` (not `IMG_1234.jpg`)
- Shot in landscape 4:3 or 16:9 at minimum 1080p
- Natural lighting preferred; avoid heavy filters

### Shot list (20 minimum, 30 preferred)

**Storefront / identity (3 shots)**
1. Exterior of 110 Lipman St showing CCC signage from the street
2. Branded truck parked at the storefront with Lipman St context visible
3. Team photo (2–5 techs) in front of the building

**Techs on Summerville neighborhood jobs (8 shots — name a different neighborhood per photo if possible)**
4. Tech installing outdoor condenser unit — Nexton home
5. Tech on a Cane Bay rooftop gas-furnace job
6. Tech servicing an AC unit at a Historic Summerville home (older architecture visible)
7. Tech performing a duct cleaning job — Knightsville or Sangaree
8. Tech running diagnostics on an indoor air handler — Carnes Crossroads or The Ponds
9. Tech replacing a capacitor in a driveway setting (shows the "we just did that" quick repair)
10. Tech loading equipment onto a truck with a Summerville street-sign or landmark visible
11. Two techs on a new-install job — full outdoor unit visible

**Charleston-metro jobs (3 shots — earns cross-service-area relevance)**
12. Tech on a Mount Pleasant crawl-space encapsulation job
13. Tech servicing a West Ashley ductless mini-split
14. Tech on a Goose Creek heat pump install

**Before/after proof (3 shots)**
15. Before: corroded condenser coil (salt-air damage) | close-up
16. After: fresh install at the same home, visible side-by-side if possible
17. Before/after of a duct-cleaning job — the dust collection is the proof

**Team + brand (3 shots)**
18. NATE certification pin / tech ID visible on a uniform
19. Trane branded materials or boxes on a job site
20. Owner Derrick Hall in a working context (not posed portrait)

**Seasonal (optional — add throughout the year)**
21. Pre-season AC tune-up work in April/May
22. Storm-recovery HVAC work after a summer thunderstorm
23. Pollen season IAQ work (Flowertown context)

### Photo upload cadence
- Initial batch: 20+ on audit-complete day
- Ongoing: 2–4 new photos per week, geotagged at the day's job site
- This signals an active business to Google; stale photo libraries read as dormant

---

## 8. Dashboard checklist (for Mike / GBP Manager)

Everything below requires GBP Manager access. Please complete and report back — this fills the gaps in this audit.

**Audit log pull (most urgent — anchors the §7.1 diagnostic):**
- [ ] Every edit made to the listing since 2026-02-01 (category, NAP, hours, photos, services, attributes, description). Copy the audit log entries into a plain text list with dates.
- [ ] Any owner/manager changes in the same window
- [ ] Any Google-initiated edits ("update suggested by Google")
- [ ] Any suspension flags, even if later reinstated

**WhatConverts + phone verification:**
- [ ] What is the canonical destination (office) phone — the line WhatConverts forwards calls to?
- [ ] What phone number is currently published on the Summerville GBP?
- [ ] What phone number was published on the Summerville GBP on 2026-02-01? Any changes since?
- [ ] Is the WhatConverts setup configured to serve a stable number to Googlebot (most setups do by default)? Confirm the bot-served number matches what's on the GBP.
- [ ] Were any WhatConverts tracking numbers provisioned, retired, or reassigned between 2026-02-01 and 2026-04-10? (Pull the WhatConverts admin activity log for the Summerville campaign.)
- [ ] Is the directory-level phone (Yelp, BBB, EZLocal, AirConditioningProfessionals, etc.) managed through WhatConverts, or set manually per directory?

**Current-state capture:**
- [ ] Primary category currently set (is it "HVAC contractor"?)
- [ ] Full list of secondary categories currently set
- [ ] List of service items currently filled
- [ ] List of attributes currently checked
- [ ] Hours currently published
- [ ] Photo count + date of most recent upload
- [ ] Current "from the business" description (copy/paste)
- [ ] Number of Google reviews total, and number in each of the last 12 months (for review velocity timeline)

**Fix-apply in order:**
- [ ] Apply Section 5 target-state categories
- [ ] Apply Section 5 service items with descriptions
- [ ] Apply Section 5 attributes (confirming each is true)
- [ ] Replace "from the business" description with Section 6 draft
- [ ] Upload the 20+ Section 7 photos
- [ ] Add products section (Trane, maintenance plans, financing)
- [ ] Seed Q&A with 8–10 questions per strategy §4 Pillar 1

---

## 9. Citation fix checklist (external directories)

Priority order — fix top-down. Phone fixes are **hold-until-WhatConverts-confirmed** (see Finding 1 and §8).

1. [ ] **Yelp** — correct "Lipton" → "Lipman" on both listings. Request merge of `-summerville-3` into `-summerville` (or vice versa — keep the one with more reviews as canonical).
2. [ ] **GoLocal247 (Yext-syndicated)** — verify "coastalcarolinacomfortductcleaners.com" reference is legitimate or get it removed; this is a Yext data record, so the fix may need to flow through a Yext dashboard if CCC subscribes.
3. [ ] **Confirm WhatConverts policy** per §8 before changing phone on any directory. If directories are using dedicated WhatConverts tracking numbers by design, leave them. If they're using stale/recycled numbers, reassign through the WhatConverts dashboard rather than editing each directory manually.
4. [ ] **NearbyPros, Manta, Akama, RecommendedCompany, ContractorSup, TopSEOBrands, EZLocal, AirConditioningProfessionals** — verify address says "Lipman" (not "Lipton") on each; verify each phone is an intentional WhatConverts tracking number, not a stale/recycled one.
5. [ ] **Run BrightLocal or Whitespark citation audit** against the canonical name + address: **Coastal Carolina Comfort LLC / 110 Lipman St, Summerville, SC 29483**. Leave phone out of the audit's exact-match criteria — use it as a non-blocking flag only.
6. [ ] **HomeAdvisor, Angi, GuildQuality, Facebook** — manual NAP check (tools blocked by CDN anti-bot). Focus on name + address; phone per §8.
7. [ ] **Apple Maps, Bing Places** — manual NAP check; claim and verify both if not already. Both should carry the same phone as the Google Business Profile for consistency.

---

## 10. On-site technical fix list

Immediate (do this week):
- [ ] Change the logo image `alt` attribute to `"Coastal Carolina Comfort"` — drop the "now part of ... Coastal Air Plus" wording
- [ ] Audit every other image alt, title, and caption on the site for similar dual-brand or CAP-reference language; replace with CCC-only text
- [ ] Audit `<title>`, `<meta description>`, and structured data (Organization, LocalBusiness) for any CAP references; remove during peak
- [ ] Add LocalBusiness schema to `/summerville-sc/` and the homepage, with NAP exactly matching GBP
- [ ] Embed the GBP map on `/summerville-sc/`
- [ ] Add 5–8 FAQ block with FAQPage schema to `/summerville-sc/` (strategy §4 Pillar 4)

Near-term (weeks 2–4):
- [ ] Track all 14 Summerville keywords in whatever ranking tool is in use
- [ ] Internal-link audit: every key page should link into `/summerville-sc/` from at least 4 other pages on the site
- [ ] Add the `sameAs` property to Organization schema listing the CCC social profiles (Facebook, Instagram, Tumblr) per assets.md — *not* CAP profiles

---

## 11. Information Gain defense — content rewrite priority

The late-March 2026 Information Gain update is now the probable root cause of the organic decline. This section names the pages that need content rewrites in priority order and specifies what "information gain" means for an HVAC service page in the Lowcountry.

### What Information Gain rewards (and our content must deliver)
- **Novel first-party data.** Numbers, patterns, or observations the top 10 don't have. *"Condenser coils east of I-26 show corrosion damage by year 8; inland Dorchester County systems routinely hit year 12."* That's a number competitors can't copy because they didn't measure it.
- **Named first-party experience.** Specific named neighborhoods with specific named issues. *"Cane Bay homes built between 2014–2018 have oversized builder-grade air handlers that short-cycle in shoulder months — diagnosis takes 20 minutes if you know what to look for."*
- **Unique synthesis.** Connecting two things the reader wouldn't connect. *"Flowertown pollen overlap with April humidity makes April the worst month for IAQ complaints — more than peak summer."*
- **Named authors with verifiable expertise.** Derrick Hall, owner, NATE-certified, [X] years in the field, license #M111694. By-lined on the pages that reference his expertise.
- **Cited sources.** Specific Trane technical docs, SC LLR license records, BBB profile, local weather data — hyperlinked where appropriate.

### What Information Gain penalizes (and current CCC pages likely contain)
- Generic "What is AC repair?" opener paragraphs
- "Why choose us?" sections that restate industry boilerplate ("licensed, insured, experienced")
- City name swapped into an otherwise identical template
- Unsourced claims ("we're the best," "most trusted")
- Missing author, missing date, missing specifics
- FAQs that match the top 3 ranking competitor FAQs verbatim

### Rewrite priority (pages most exposed to Information Gain)
Ordered by potential traffic recovery + severity of templating.

| Priority | URL | Current state | Rewrite target |
|---|---|---|---|
| 1 | `/charleston-ac-repair-617782/` (canonical) | Vendor-CMS template, Charleston name swap | Rewrite with: 120-word direct answer block + named symptoms block + Charleston-neighborhood job examples + Derrick Hall byline + 6–8 FAQ block with schema + first-party salt-air corrosion data |
| 1 | `/hvac-company-charleston-sc-617778/` | Vendor template | Rewrite as city hub with entity-dense services grid + real review snippets + named neighborhoods + license/BBB/Trane proof row |
| 1 | `/summerville-sc/` | Already has first-party elements (Derrick story, neighborhood names) | Add: novel Lowcountry data point + 6–8 FAQ block with schema + LocalBusiness schema + embedded GBP map + 8+ internal links in |
| 2 | `/heating-repair-charleston-sc-617779/` (canonical) | Vendor template | Same rewrite approach as `-617782`; consolidate `-617779bc` |
| 2 | `/charleston-sc/duct-cleaning-maintenance/` | Existing clean URL, flat ranking | AEO upgrade — direct answer block + IAQ/salt-air-specific data + FAQ block |
| 2 | `/charleston-sc/heating-repair/` | Existing clean URL | AEO upgrade |
| 3 | Homepage `/` | Currently ranking #36 for "ac charleston sc" | Add entity-dense above-fold; shift the generic hero copy |
| 3 | `/heat-pump-services/` | Tier-2 decline (heat pump replacement −48 positions) | Rewrite with heat-pump-specific Lowcountry data (salt air on heat pumps is harsher than on ACs — that's a real novel angle) |
| 3 | `/services/hvac-replacement/`, `/services/hvac-maintenance/` | Generic service pages | AEO rewrite with decision-tree content and price-range specifics |

### Information Gain is also the Summerville opportunity
Every Summerville competitor has the same problem. If CCC ships `/summerville-sc/ac-repair/`, `/summerville-sc/heat-pump-repair/`, etc. with first-party neighborhood-specific content, named authors, and unique synthesis from the start, Information Gain *rewards* the novelty — and the competitors stuck on templated pages will stay stuck. This is the rare update where being behind on page count is an advantage, because every new page gets to be built correctly.

### What this means for the strategy doc

The master strategy doc (`2026-04-23_ac-repair-seo-aeo-master-strategy.md`) was written before the Information Gain context was known. It needs matching updates:
- §2.3 "pattern and causes" — replace with Information Gain as #1 suspect
- §4 Pillar 4 AEO — merge "Information Gain defense" into the pillar, since AEO and Information Gain optimize for the same signals (entity density, novel answers, first-party content)
- §5 / §8 build order — shift "rewrite Charleston templated pages" to weeks 2–4 (before Summerville build) since that's where the bleeding is
- §12 assumptions — remove the assumption that the decline is a local-signal issue; replace with Information Gain as the algorithmic context

I can make those updates in a single pass — flag when ready.

---

## 12. Next steps

1. **Today:** Mike (or whoever has GBP Manager access) pulls the §8 audit log and current-state capture. That fills the missing half of this audit and tells us whether a dashboard-side edit compounded the Information Gain impact.
2. **This week:** Apply the fixes in §5, §6, §7, §10. Fix Yelp typo + duplicate. Kick off BrightLocal citation sweep against the canonical name + address.
3. **Weeks 1–4:** Execute the §11 rewrite priority list on the Charleston templated pages. This is the highest-impact lever for recovering the 8 declining Tier-2 keywords.
4. **Week 2 checkpoint:** Re-audit NAP consistency after corrections propagate. Monitor all declining keywords for recovery signal post-rewrite (Information Gain recoveries typically show within 2–4 weeks of content republish).

---

*End of Summerville GBP + citation audit, v1. Next revision after §8 dashboard data comes in and after first-batch Charleston page rewrites ship.*
