# Coastal Air Plus / Coastal Carolina HVAC — Rank Strategy Review

**Prepared:** April 30, 2026
**Tracking source:** SE Ranking detailed positions export, 2025-11-28 → 2026-04-30
**Domain analyzed:** coastalcarolinahvac.com (acquired CCC domain)
**Locales:** Google Charleston SC + Google Summerville SC
**Observations:** 25,564 daily rank measurements across 164 keyword/locale pairs

---

## Executive summary

Summerville is in striking distance of page-one across the priority "ac repair" / "hvac repair" cohort. Charleston is not. The single largest blocker for both cities is local-pack absence on high-intent head terms — Coastal Carolina HVAC ranks organically in positions 11-15 for terms where Google shows a Local Pack, but appears in that pack on 0-21% of measured days. Behind that sits a systemic URL cannibalization problem: 123 of 164 tracked keywords have two or more pages competing for the same query, and a cluster of auto-generated template stubs (`/charleston-ac-repair-617782/`, `/hvac-company-summerville-sc-617780bc/`, etc.) is splitting authority that should consolidate to one canonical URL per intent.

The replacement category is winning. Heating-related terms are winning in Summerville. Charleston geo-modified queries are weak across the board and may have lost rank visibility in mid-April (data gap requires verification).

---

## State of the rankings

### Priority repair cohort — current snapshot

**Summerville — head terms (all in striking distance):**

| Keyword | Vol* | 30d avg | Current | Map pack |
|---|---|---|---|---|
| ac repair | 450K | 13.9 | 13 | pos 3, 16% of days |
| air conditioning repair | 201K | 14.1 | 12 | pos 3, 21% of days |
| air conditioner repair | 96K | 12.3 | 12 | pos 3, 14% of days |
| hvac repair | 74K | 13.1 | 15 | pos 3, 21% of days |
| hvac contractor | 135K | 18.0 | — | pos 3, 5% of days |

**Summerville — geo-modified (declining in April):**

| Keyword | Vol | 30d avg | Current | Trend |
|---|---|---|---|---|
| ac repair summerville sc | 320 | 17.6 | 24 | slipped from 11 (3/30) |
| hvac repair summerville sc | 70 | 17.5 | 26 | slipped from 12 (3/30) |
| summerville sc hvac repair | 480 | 20.0 | 25 | mostly flat |

**Charleston — head terms (weaker, no local pack):**

| Keyword | Vol* | 30d avg | Current | Map pack |
|---|---|---|---|---|
| ac repair | 450K | 12.8 | 11 | 0% of days |
| air conditioning repair | 201K | 13.9 | 14 | 0% of days |
| air conditioner repair | 96K | 11.9 | 15 | 0% of days |
| hvac repair | 74K | — | — | not ranking |

**Charleston — geo-modified (largely off page 3):**

| Keyword | Vol | 30d avg | Current |
|---|---|---|---|
| ac repair charleston sc | 590 | 31.3 | 28 |
| air conditioning repair charleston sc | 590 | 42.8 | 30 |
| hvac repair charleston sc | 590 | 43.0 | 52 |
| ac repair charleston | 260 | 32.8 | 72 |
| heating and air repair charleston sc | 590 | n/a | 70 |

\* Search volume is global Google (SE Ranking default), not local. Real Charleston-area monthly demand for "ac repair" is closer to 1-3K. Use the geo-modified rows for honest local-volume framing.

### Movement leaders (last 30 days vs first 30 days of the tracking window)

**Wins:**
- `air conditioning replacement` Charleston: 81.7 → 32.2 (+49.5 positions)
- `heating repair` Summerville: 21.7 → 3.2 (+18.5)
- `ac repair` Summerville: 23.7 → 13.9 (+9.8)
- `air conditioner repair` Summerville: 18.6 → 12.3 (+6.3)
- `hvac contractor` Summerville: 22.8 → 18.0 (+4.8)
- Replacement category broadly up across both cities

**Losses:**
- `heat pump replacement` Charleston: 44 → 65.8 (-21.8)
- `heat pump replacement` Summerville: 41 → 50.2 (-9.2)

The replacement-category gain pattern is strong enough that whatever was done for those URLs should be replicated for the repair URLs.

---

## Three structural findings driving the rank picture

### 1. URL cannibalization is systemic, not local

123 of 164 tracked keywords (75%) have two or more coastalcarolinahvac.com pages ranking on different days for the same query. Examples:

- **`ac repair` Charleston** rotates between `/charleston-ac-repair-617782/` (46 days), `/charleston-sc/ac-repair/` (10 days), and `/charleston-ac-repair-617782bc/` (4 days)
- **`air conditioning repair` Charleston** alternates between `/charleston-ac-repair-617782/` (94 days) and `/charleston-sc/ac-repair/` (20 days)
- **`hvac repair` Summerville** floats among `/summerville-sc/` (67d), `/` (50d), `/summerville-sc/hvac-repair/` (9d), `/summerville-sc/heating-repair/` (5d)
- **`ac repair` Summerville** rotates the homepage `/`, the city hub `/summerville-sc/`, the service page `/air-conditioning-services/ac-repair/`, and the city-service variant `/summerville-sc/hvac-repair/`

When Google can't tell which page is the canonical answer for a query, it picks one ad hoc and the rank floats by 5-15 positions week to week. That instability is most of what shows up as the daily rank chop in this dataset.

### 2. A cluster of auto-generated template stubs is competing with proper URLs

These URLs all carry numeric IDs and `bc` suffix variants, characteristic of an auto-generated landing-page service:

| Suspect URL | Days ranked |
|---|---|
| /charleston-ac-repair-617782/ | 884 |
| /hvac-company-charleston-sc-617778/ | 129 |
| /heating-repair-charleston-sc-617779bc/ | 109 |
| /heating-repair-charleston-sc-617779/ | 75 |
| /hvac-company-summerville-sc-617780/ | 51 |
| /hvac-company-summerville-sc-617780bc/ | 26 |
| /charleston-ac-repair-617782bc/ | 24 |
| /hvac-company-charleston-sc-617778bc/ | 10 |
| /heating-repair-summerville-sc-617781/ | 4 |
| /heating-repair-summerville-sc-617781bc/ | 2 |

The `/charleston-ac-repair-617782/` page is the longest-tenured ranking URL for Charleston repair queries. Whatever it is — service-area template, BoostingCommerce-style auto landing page, legacy PPC landing page — it's outranking the proper `/charleston-sc/ac-repair/` city-service page and has been doing so consistently. Need to inspect that page's content, structure, and intended role before any consolidation work.

### 3. Local-pack presence is the single largest cheap win

Across both cities, the head-term SERPs all show a Local Pack feature. Coastal Carolina HVAC's organic rank is 11-18 for these queries, but its appearance inside the local pack is rare to nonexistent:

| Keyword | Locale | Organic 30d avg | Map pack presence |
|---|---|---|---|
| ac repair | Charleston | 12.8 | 0% of days |
| air conditioning repair | Charleston | 13.9 | 0% |
| air conditioner repair | Charleston | 11.9 | 0% |
| hvac contractor | Summerville | 18.0 | 5% |
| hvac company | Summerville | 16.0 | 5% |
| heating and cooling | Summerville | 15.0 | 0% |
| heating repair | Summerville | 3.2 | 0% |
| ac repair | Summerville | 13.9 | 16% |
| hvac repair | Summerville | 13.1 | 21% |

For local-intent HVAC queries, the local pack typically captures 60-70% of clicks above the organic 10-blue-links. Sitting at organic position 13 with no map presence means the page-one impressions are mostly invisible to local searchers. This is a Google Business Profile, NAP citation consistency, and review-volume problem — not a content problem.

The pattern is much worse in Charleston than Summerville, which is consistent with Coastal Air Plus being newer to Charleston market than Summerville and having a thinner GBP profile there.

---

## Risks to confirm before acting

1. **Charleston tracking gap, mid-April.** Several Charleston keywords show "—" for the weeks of 4/13 and 4/20 (`ac repair`, `air conditioning repair`, `air conditioner repair`, `hvac repair charleston sc`). Either (a) SE Ranking lost data those weeks, or (b) the domain dropped out of top 100 entirely on those queries. The recent 04-27 numbers are healthy again, suggesting (a), but worth confirming with Mike or by re-pulling DataForSEO for those dates.

2. **`ac repair charleston` jumped from 32.8 to current 72.** That's a 40-position drop on a 260-volume term. Could be one-day noise, could be the start of a problem. Worth one targeted DataForSEO SERP pull on that exact query to see what's currently displacing the page.

3. **Volume reality.** Don't size the opportunity off the global volumes. The geo-modified 320-590 monthly volumes are the honest local floor; the head-term local volumes for Charleston metro are roughly 1-3K each. That's still meaningful, but it's not 450K.

4. **coastalairplus.com tracking.** This export is for coastalcarolinahvac.com. The project file notes Coastal Air Plus also operates coastalairplus.com. If both domains rank for any of these terms, the cannibalization is worse than what's measured here. Worth a parallel SE Ranking pull on coastalairplus.com.

---

## Recommended next moves, in priority order

### Move 1 — URL consolidation audit (highest leverage)

Before doing any new content work, get a definitive map of which URL should own which intent. The minimum viable scan:

- Pull a list of the 10 service+location intent buckets (Charleston AC repair, Summerville AC repair, Charleston HVAC company, etc.)
- For each bucket, identify the canonical target URL Mike wants ranking
- Build the redirect/canonical plan for the duplicates
- Pay specific attention to the `-617782` / `-617778` / `-617779` / `-617780` / `-617781` template stubs — confirm whether they're legacy auto-generated pages safe to retire, or assets that need to be the canonical and the cleaner URLs need to redirect *to* them

This is one Claude Code session, scoped to a few hours, that produces a redirect map. It blocks every other on-page move.

### Move 2 — Google Business Profile audit, Charleston first then Summerville

The local pack absence is the cheapest-to-fix, fastest-to-show-up-in-cash-register intervention available right now. The audit needs to cover:

- Primary category and secondary categories on the GBP listing(s)
- Service area definition (cities + zip codes)
- NAP consistency across BBB, Yelp, Angi, HomeAdvisor, Nextdoor, Apple Maps, Bing Places, Yellow Pages, citation aggregators
- Review volume and recency vs the top 3 actual local-pack winners in each city
- GBP posts cadence and Q&A activity
- Photo asset count and freshness

If Coastal Air Plus has separate GBP listings for the two service areas (likely), each needs its own audit. The output should rank the gaps by estimated local-pack lift and prioritize fixes Mike's team can execute themselves vs ones ROI.LIVE handles.

### Move 3 — Charleston city-content depth investment

Summerville has 1,600 ranking-days from `/summerville-sc/`. Charleston's `/charleston-sc/` has only 202 ranking-days, and most Charleston organic visibility is propped up by the legacy `/charleston-ac-repair-617782/` template stub. That's not stable footing.

Once the URL consolidation plan is locked, the Charleston city hub and its service children (`/charleston-sc/ac-repair/`, `/charleston-sc/heating-repair/`, etc.) need the same content depth and internal linking treatment that Summerville has. The geo-modified Charleston rankings (28-72 range) won't move without that.

### What can wait

- New content production on top-of-funnel HVAC topics. The site has structural problems on bottom-of-funnel money pages. Fixing those returns cash faster than blog content.
- AI Overview / AEO targeting on these head terms. The AIO is present on `hvac maintenance` Summerville per the SE Ranking export, but the local-pack and cannibalization problems will eat any AEO gains until they're solved.
- Replacement-category expansion. That category is already winning; let it run.

---

## Suggested first Claude Code session

Working folder: `clients/coastal-air-plus/`
Branch: `feature/coastal-rank-review-2026-04` (or `jordan/coastal-air-plus/rank-review-2026-04` if Jordan runs it)

Session scope:
- Ingest both SE Ranking CSVs into `clients/coastal-air-plus/inputs/seranking/`
- Save the analysis dataset (`positions_long.csv`, `keyword_summary.csv`, `cannibalization.csv`) to `clients/coastal-air-plus/projects/rank-review-2026-04/`
- Produce the URL consolidation matrix as a working doc in that project folder
- Pause for Jason's review before the GBP audit kicks off

Do not auto-commit. Open as a PR.

---

## Open items for follow-up

- Confirm with Mike whether the `-617782` style URLs are legacy template stubs or still served pages with intentional content
- Pull a parallel SE Ranking export for coastalairplus.com to measure cross-domain cannibalization
- Re-pull DataForSEO SERP advanced for the four Charleston keywords with mid-April data gaps
- Verify whether Coastal Air Plus runs one or two GBP listings (Charleston + Summerville)
- Open question for the parameter sheet: which URL does Mike *want* ranking for `ac repair charleston sc`?

---

*Source files: `repair_cohort.csv`, `striking_distance.csv`, `cannibalization.csv`, `movers.csv`, `localpack_gap.csv`, `keyword_summary.csv`, `positions_long.csv`*
