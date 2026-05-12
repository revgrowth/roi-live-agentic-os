# AC Repair Cluster — Phase 1 Research and Hub Audit

**Session date:** 2026-04-30
**Operator:** Jordan
**Branch:** `jordan/coastal-air-plus/ac-repair-cluster-2026-04`

## Session goal

Scaffold the AC repair topical cluster project, validate the priority spoke keywords with DataForSEO, verify search intent on the top symptom spokes, and audit the two new hub pages against the Agency Service Page SOP v1.1.

This session prepares the inputs and gap report. No content drafting in this session — outputs go to Jason for review before drafting begins.

## Files created this session

### inputs/
- `coastal-rank-strategy-2026-04-30.md` (imported from Downloads — Jason's rank review memo)
- `coastal-ac-repair-cluster-strategy-2026-04-30.md` (imported from Downloads — cluster spec)

### research/
- `keyword-validation-2026-04-30.csv` — 27 keywords × DataForSEO Labs at US 2840
- `keyword-overview-us.json` + `keyword-overview-us.md` — raw response + formatted table
- `intent-verification-summary.md` — per-keyword AIO + intent verdict
- `serp/ac-not-cooling.json`, `serp/ac-blowing-warm-air.json`, `serp/ac-won-t-turn-on.json`, `serp/ac-frozen.json` — full SERP responses
- `serp/summary.md` — auto-generated SERP feature + AIO summary
- Helper scripts (one-shot, kept as audit trail): `_keywords-all.txt`, `_lookup-locations.mjs`, `_lookup-labs-locations.mjs`, `_build-csv.mjs`, `_analyze-serp.mjs`
- Stale files from rejected city-code attempt (kept as audit trail since `rm` is denied): `_keywords-charleston.txt`, `_keywords-summerville.txt`, `keyword-overview-charleston.json`, `keyword-overview-charleston.md`

### audits/
- `summerville-hub-fetched-2026-04-30.md` — live Firecrawl fetch with metadata + schema + heading outline + markdown body
- `charleston-hub-fetched-2026-04-30.md` — same for Charleston hub
- `hub-gap-report-2026-04-30.md` — SOP v1.1 + Citation Discipline gap analysis with top-5 fixes per hub
- Helper script (kept as audit trail): `_fetch-hubs.mjs`

### deliverables/
- Empty. Drafting deliverables (spokes, revised hubs) come in subsequent sessions.

## API spend this session

| Call | Endpoint | Geo | Volume | Cost |
|---|---|---|---|---|
| Step 3 attempt 1 (rejected) | DataForSEO Labs `keyword_overview/live` | Charleston city `1025521` | 20 keywords | $0.0000 (rejected — Labs only accepts country codes) |
| Step 3 (final) | DataForSEO Labs `keyword_overview/live` | US `2840` | 27 keywords | **$0.0113** |
| Step 4 | DataForSEO `serp/google/organic/live/advanced` | Summerville `1025666` | 4 keywords | **$0.0140** |
| Step 5 | Firecrawl `/v2/scrape` | n/a | 4 page calls (2 retries: auth + body format) | ~4 credits, free tier |

Total paid spend: **$0.0253**.

## Headline findings — Step 3 keyword validation

- 13 of 27 keywords returned measurable volume at US national. 14 silently omitted by Labs as "insufficient measured volume."
- Symptom spokes: 6 of 8 registered. `ac blowing warm air` (9.9k) and `ac leaking water` (8.1k) are the volume leaders. Two zero-volume phrasings (`ac making strange noises`, `ac running but no air from vents`) need canonical-phrasing validation before drafting.
- Brand spokes: all 6 registered. `lennox ac repair` KD=50 is the outlier — SERP dominated by Lennox brand-authorized-dealer content. Trane (KD=26) and Rheem (KD=29) also non-trivial. Other three (Carrier, Goodman, York) easy.
- Neighborhood spokes: only Mount Pleasant SC (50/mo) registered. All seven Summerville sub-areas and five of six Charleston sub-areas returned no measurable volume at US tier — expected given hyperlocal phrasing, not a phrasing problem. SE Ranking historical data confirms Summerville sub-area pages convert; Charleston sub-area demand needs Mike's GBP / service-call data to validate.
- Real per-call cost is $0.0113 for a 27-keyword batch. Calibrates against the project file's "$0.04/keyword" claim — that figure was per-call cost (correct for unbatched), the skill api-guide's "$0.0001/keyword" is amortized cost (correct for batched 200+). Both right, depending on framing. The actual measured per-keyword amortized cost in this run was $0.000419.

## Headline findings — Step 4 SERP intent verification

- All 4 locked symptom spokes (`ac not cooling`, `ac blowing warm air`, `ac won't turn on`, `ac frozen`) verified at Summerville geo. Every one returned an AI Overview. All four cleared HVAC-home intent dominance with mild automotive leakage on `ac not cooling` (meineke at rank 4) and `ac blowing warm air` (autozone at rank 5). Recommendation: proceed to drafting on all four.
- AIO citation pattern is consistent: Reddit (3 of 4), YouTube (3 of 4), Carrier (3 of 4) plus Bryant, Lennox, Trane, and one regional HVAC service company (Petro on `ac frozen`). The Petro presence is the proof point that institutional HVAC trust signaling can break a brand-dominated AIO citation set at the local level — that's the strategy this cluster needs to execute.
- Free PAA + Related Searches mining did not surface canonical phrasings for either zero-volume symptom spoke. The four SERPs are adjacent to but do not cover the noise / no-airflow topics. Targeted DataForSEO Labs `keyword_suggestions` call (~$0.04) recommended before locking those two spoke titles.
- Real SERP advanced cost: $0.0035 per call, $0.0140 across 4 keywords. Slightly above the $0.012 projection.

## Headline findings — Step 5 hub audit

### Summerville hub (top 3 gaps)

1. **NAP phone inconsistency.** HVACBusiness schema declares `(843) 708-8735`. Visible content (header + body CTA) shows `(843) 252-0880`. If this is a call-tracking variant approved by Mike, the override needs documentation in the Parameter Sheet. If not, it's a critical local SEO failure (Phase 9.7 / 12.1). Either way, fix before any spoke ships.
2. **No case study embed.** Phase 6.4 / 9.4 / 11.1 all mandate at least one case study excerpt with quantified results on every service page. Currently absent. Both hubs ship today without it.
3. **Author Derrick Hall named in schema, no credentialed bio page.** Schema URL points to `/author/revgrowth/` (CMS admin tag), not a real bio. Phase 7.4 / 8.7 / 9.8 (YMYL editorial accountability) all flagged. Major E-E-A-T Trust gap given the AIO citation set Coastal needs to compete with.

### Charleston hub (top 3 gaps)

1. **Same NAP issue.** Visible phone is `(843) 256-6257` — third number across the two pages.
2. **Brand transition inconsistency.** Summerville hub names parent brand inline ("Coastal Carolina Comfort, now part of Coastal Air Plus"), Charleston hub does not. Either both name it or neither does.
3. **Higher density of unsourced quantified climate claims.** "30-50% more condensate than inland systems" and "45 days per year with heat index above 100°F — among the highest of any metro area on the East Coast" both lack inline citation hooks (Citation Discipline Phase 7.4) and may not survive Phase 1.2 source verification as worded.

### Cross-cutting hub observations

- Both hubs are structurally serious work. Comprehensive schema (HVACBusiness + Service + HowTo + FAQ + AggregateRating + BreadcrumbList). Pricing transparency strong (Treatment B price ranges throughout). Heading-rich (1 H1, 13–14 H2, 32–33 H3 per page). The gaps are concentrated and fixable.
- `100% issue-free services` Trustindex widget label is a Phase 1.4 violation — same widget on the same page displays 1-star reviews. Replace with the verified `less than 1% problem rate` framing already on the widget.
- llms.txt inclusion not verified — pull `https://coastalcarolinahvac.com/llms.txt` before publish to confirm both hubs are listed under Primary Services / Products.

## Architectural / skill-improvement findings (park as PR follow-ups)

- **DataForSEO Labs only accepts country-level location codes.** 94 supported codes total. Sub-country volume (city / DMA / state) requires `keywords_data/google_ads/search_volume/live` — different endpoint, different pricing, not in the current `tool-dataforseo` skill. The skill's `references/api-guide.md` should add a geo-granularity-by-endpoint table so the next session does not walk the same debugging path.
- **`tool-dataforseo` scripts should print the actual `cost` field from each response.** Currently we extract via a one-off node command after each call. Auto-printing it in the script logs would make calibration straightforward.
- **`AGENTIC-OS-CONTEXT.md` DataForSEO cost line is misleading.** Says "~$0.04/keyword query" — that's per-call cost (correct only when each keyword is its own call). Skill `api-guide.md` says "~$0.0001/keyword" — that's amortized cost (correct for batched 200+). Actual measured for a 27-keyword batch this session: $0.0113 per call, $0.000419 per keyword amortized. Project file phrasing should disambiguate.
- **`tool-firecrawl-scraper` `references/api-guide.md` uses Python SDK snake_case in code examples but the v2 REST API uses camelCase.** Caused first call to fail with `Unrecognized keys: only_main_content, remove_base64_images` after auth was working. Recommend api-guide.md add a "REST vs SDK field-naming" callout.
- **Firecrawl `html` field strips `<script>` tags.** Schema-LD detection requires `rawHtml` format. Caused first audit pass to report 0 schema blocks before re-fetching with `rawHtml`. Skill should note this for any audit / schema-extraction use case.

## Open questions for Jason / Mike

1. **Canonical NAP for Coastal Air Plus.** Are `(843) 252-0880` (Summerville) and `(843) 256-6257` (Charleston) call-tracking variants approved by Mike, or independent NAP failures? Document in the Coastal Air Plus Client Parameter Sheet either way. This question gates every spoke and freshness audit downstream.
2. **Brand transition strategy.** Should hub + spoke pages name "Coastal Carolina Comfort, now part of Coastal Air Plus" inline at first body mention? Currently only the Summerville hub does. Need a written decision.
3. **Domain strategy for spokes.** Spokes on legacy `coastalcarolinahvac.com` (preserves link equity from existing rank) or new Coastal Air Plus domain? Affects internal linking, schema `isPartOf`, llms.txt path, and the cluster's link-equity propagation model.
4. **Charleston neighborhood demand validation.** US-national volume showed zero for 5 of 6 Charleston neighborhoods. For Summerville we have SE Ranking historical confirming the queries exist and convert. For Charleston we lack that confirmation. Mike likely has GBP Insights or service-call data that can validate which Charleston neighborhoods generate actual demand.
5. **Lennox brand spoke approach.** KD=50 means Lennox SERP is dominated by brand-authorized-dealer content. Recommendation: ship Lennox spoke last in the brand cohort. Sharpen the angle (e.g., "Lennox AC common failure modes by series" or "Lennox AC repair vs warranty replacement decision" — content the dealer network typically does not produce). Drop after 60 days if no movement past page 3. Brand spokes are the lowest-leverage tier of the cluster.
6. **Two zero-volume symptom phrasings.** `ac making strange noises` and `ac running but no air from vents` returned no measurable volume. PAA / Related Searches mining did not surface canonical alternatives. Spend ~$0.04 on a DataForSEO Labs `keyword_suggestions` call before Jason locks these two spoke titles?
7. **Credentialed author bio.** Who is the credentialed SME for Coastal Air Plus content? Derrick Hall is named in schema but no bio page exists at a credentialed URL. Need NATE certification details, SC LLR license number, years of experience, and a real `/author/[name]/` page before YMYL Trust signaling is credible against the AIO citation set Coastal needs to compete with.
8. **Case study source.** Both hubs need at least 1 embedded case study excerpt with quantified results (Phase 6.4 non-negotiable). Mike to identify a Summerville case and a Charleston case from existing service records — response time, repair cost, before/after temperature differential, system age, customer outcome.
9. **Citation Discipline pass on R-410A and Charleston climate claims.** Both hubs reference EPA AIM Act / R-410A phaseout / Charleston climate stats without inline citation hooks. The "30-50% more condensate" and "45 days >100°F — among the highest on the East Coast" claims need Phase 1.2 verification or rewriting. Same claims will appear on every spoke; fix at the hub layer first.
10. **AGENTIC-OS-CONTEXT.md DataForSEO cost line.** Update with the per-call vs amortized framing now that we have measured data.

## Cross-references

- Cluster strategy memo: [inputs/coastal-ac-repair-cluster-strategy-2026-04-30.md](inputs/coastal-ac-repair-cluster-strategy-2026-04-30.md)
- Rank review memo: [inputs/coastal-rank-strategy-2026-04-30.md](inputs/coastal-rank-strategy-2026-04-30.md)
- Service Page SOP v1.1: `agency/sops/ROI-LIVE-Agency-Service-Page-SOP-v1.1.md`
- Citation Discipline SOP v1.0: `agency/sops/ROI-LIVE-Agency-Citation-Discipline-SOP-v1.md`
- Core Standards v1.1: `agency/sops/ROI-LIVE-Agency-Core-Standards-v1.1.md`

---

# Symptom spokes batch 2 (4 spokes) — 2026-05-11

**Session date:** 2026-05-11
**Operator:** Jordan
**Branch:** `jordan/coastal-air-plus/spokes-batch-2-symptom-2026-04`
**Mode:** audit-and-fix in-place (legacy spoke URLs preserved, no 301s)

## Session goal

Draft batch-2 symptom spokes (AC won't turn on, AC frozen evaporator coil, AC leaking water inside, AC short cycling) as paste-ready Elementor widget deliverables. Apply zero-fabrication / zero-flags rule: remove unsourceable specifics rather than insert STAT NEEDED placeholders.

## Scope-discovery finding

All four target spokes already exist as live blog posts on coastalcarolinahvac.com under their cluster-strategy slugs (with the exception of `/blog/ac-frozen-evaporator-coil/`, which differs slightly from the strategy doc's `ac-frozen` slug). The cluster strategy doc dated 2026-04-30 treats these as net-new builds, but they've been live since at least 2026-03-17 (Derrick Hall byline, ROI.LIVE-era timestamps). This planning gap was surfaced as CHECKPOINT 1.5 in-session; Jordan directed Path 1 — audit-and-fix the live posts in place rather than draft over them at new slugs.

## Files created this session

### `spokes/` (16 files — 4 spokes × 4 files each)

- `ac-wont-turn-on/`
  - `elementor-html-widget-1.html` — H1, Quick Answer, 7-step diagnostic, when-to-call rules, safety note, qualitative repair scope, Lowcountry framing
  - `elementor-html-widget-2.html` — hub-link block, 3 sibling cards, 6-FAQ, JSON-LD (Article + HowTo + FAQPage + BreadcrumbList)
  - `removed-claims.md` — 27 unsourceable specifics dropped
  - `self-audit.md` — full SOP audit
- `ac-frozen-evaporator-coil/` — same 4-file structure
- `ac-leaking-water-inside/` — same 4-file structure (only spoke with prior comprehensive live content; smallest delta)
- `ac-short-cycling/` — same 4-file structure (transactional intent, heaviest CTA emphasis)

### `audits/` (1 script + 6 snapshots)

- `_fetch-live-spokes.mjs` — Firecrawl scraper, patterned on Phase 1's `_fetch-hubs.mjs`
- `live-spoke-snapshots/ac-not-cooling-fetched-2026-05-11.md` (4,222 words — reference pattern)
- `live-spoke-snapshots/ac-blowing-warm-air-fetched-2026-05-11.md` (1,449 words — flagged as also-thin, vs the original assumption it was a comprehensive published reference)
- `live-spoke-snapshots/ac-wont-turn-on-fetched-2026-05-11.md` (1,443 words — legacy stub)
- `live-spoke-snapshots/ac-frozen-evaporator-coil-fetched-2026-05-11.md` (1,419 words — legacy stub)
- `live-spoke-snapshots/ac-leaking-water-inside-fetched-2026-05-11.md` (3,557 words — comprehensive legacy)
- `live-spoke-snapshots/ac-short-cycling-fetched-2026-05-11.md` (1,455 words — legacy stub)

### `research/`

- `intent-verification-summary.md` — appended a batch-2 addendum documenting the DataForSEO credential gap and the intent-by-proxy reasoning used to proceed without paid verification.

## Page-type SOP choice (all four spokes)

**Blog Article SOP v1.1** as primary, **Citation Discipline SOP v1.0** cross-cutting. Rationale: informational intent per cluster strategy + Phase 1 SERP intent verification + the live posts already classify as blog articles. Spoke 4 layered the Service Page SOP §5.1 CTA cadence rule on top (transactional intent demands ≥5 CTA placements).

Service Page SOP was rejected as primary — the spokes are not commercial pages.
Signal Article SOP v2.0 was rejected — ROI.LIVE-specific (Bebas Neue typography, Jason Spencer expert entity, ROI.LIVE brand density rules); none of it inherits to a Coastal Carolina Comfort blog post.

## API spend this session

| Call | Endpoint | Volume | Cost |
|---|---|---|---|
| Firecrawl `/v2/scrape` | n/a | 6 page calls | ~6 credits, free tier |
| DataForSEO SERP advanced (spokes 3+4) | n/a | not executed — credential gap | **$0.00** |

**Total paid spend: $0.00.**

The Phase 1 NOTES.md projected ~$0.012 for the batch-2 SERP verification. That spend didn't happen because `DATAFORSEO_LOGIN` and `DATAFORSEO_PASSWORD` are no longer present in `.env`. Documented in the intent-verification addendum.

## Consolidated removed-claims list — the polish-session roadmap

Total quantified claims dropped across the four spokes: **75 unique claims** + **11 retained claims flagged for inline-citation polish** = 86 polish-session targets.

### By category, across all four spokes

| Category | Claims dropped | Polish source path |
|---|---|---|
| Cost / pricing (dollar ranges, diagnostic fees, parts cost) | 23 | Coastal flat-rate sheet + brand-matched parts catalogs |
| Component lifespan (capacitor, contactor, pump, motor, pan service life) | 12 | Manufacturer reliability data + Coastal internal MTBF |
| Climate / regional quantified (gallons/day, humidity, pollen days, cooling degree-days) | 18 | NOAA NCEI station data + National Allergy Bureau + psychrometric calc |
| Industry-benchmark stats (% of calls resolving at step N, capacitor failure rates, mold onset time) | 12 | ACCA member surveys + IICRC S500 + EPA mold guidance |
| Response time / SLA (same-day window, parts lead time, single-visit completion rate) | 7 | Coastal published SLA + Coastal CRM data |
| Credential / authority (NATE count, years, license numbers, dealer status, EPA Section 608 count) | 17 | Coastal HR / corporate records + dealer agreements |

(The 75/86 count above tracks unique claims after deduplicating overlap between spokes — e.g., "Coastal years in business" was considered in 3 spokes but is one underlying claim.)

### Retained claims that need inline-citation polish (sourceable, not yet sourced)

| Claim | Spoke | Polish source |
|---|---|---|
| Manufacturer brand-matched parts shipping lead time "24 to 48 hours" | 1 | Carrier / Trane / Lennox distributor SLAs |
| EPA Section 608 refrigerant handling reference | 2, 4 | epa.gov |
| R-22 phaseout for new equipment reference | 2, 4 | EPA Office of Air and Radiation publications |
| R-410A / R-454B current-refrigerant identifiers | 2, 4 | Manufacturer documentation |
| Outdoor temperature lockout threshold "below 60°F" for AC operation | 2 | Manufacturer service manual citation |
| Bleach vs vinegar in septic-system drain lines | 1, 3 | EPA / local health department septic guidance |
| Lowcountry pollen season timing (late Feb–May + fall) | 2, 3 | National Allergy Bureau / SCDNR |
| Mold onset 24-hour threshold | 3 | IICRC S500 or EPA mold guidance |
| Healthy cycle length "15 to 20 minutes" | 4 | ACCA Manual S / RSES technical guidance |
| Short-cycle threshold "5 to 10 minutes" | 4 | Same source path |
| Manual J as ACCA-standard load calculation method | 4 | ACCA Manual J reference |

## Process gaps surfaced this session

1. **DataForSEO credentials missing from `.env`.** Phase 1 ran with them; they were removed between Phase 1 (2026-04-30) and this session (2026-05-11). Restore credentials before the polish session or before any future cluster work. Cost to restore: trivial. Cost of not having them: forced intent-by-proxy reasoning that's defensible but less rigorous than verified SERP data.

2. **Cluster strategy doc dated 2026-04-30 treats all four batch-2 spokes as net-new builds.** They've been live on coastalcarolinahvac.com since at least 2026-03-17 (per the AC Leaking Water Inside legacy publish date). Provenance unclear — pre-ROI.LIVE legacy content vs. an unrecorded earlier ROI.LIVE session that shipped them. **Action item: Jordan to clarify with Mike whether these are legacy content (replace freely) or earlier-ROI.LIVE-era work (preserve where appropriate).** This session proceeded on the assumption that the 3 stub spokes are legacy and that AC Leaking Water Inside is recent comprehensive work worth preserving as much as possible.

3. **NAP inconsistency across coastalcarolinahvac.com is unresolved.** Five different phone numbers in the wild (Summerville hub visible 252-0880, Charleston hub visible 256-6257, legacy spokes visible 256-6476, session-spec tel: 708-8735, session-spec schema 238-3838). This session's spokes use the session-spec values consistently within the deliverables, but the site-wide NAP cleanup remains a pre-publish blocker. Phase 1 hub gap report called this out. **Action item: resolve before any spoke ships.**

4. **Author E-E-A-T gap.** Existing pages credit `Person: Derrick Hall → /author/revgrowth/` (CMS admin tag, not a real bio page). Phase 1 hub audit flagged this. No real credentialed-bio page exists for any Coastal technician. This session's spokes use Organization-as-author in schema and `[AUTHOR — Coastal Carolina Comfort technician, credentials TBD]` placeholder in visible byline. **Action item: polish session builds named-technician bio page(s), upgrades author schema to Person with @id referencing the new bio page URL.**

5. **`llms.txt` status for coastalcarolinahvac.com is unverified.** Blog Article SOP §11.4 requires every published article to be added to the client's `llms.txt`. Phase 1 NOTES.md flagged this; not verified this session. **Action item: pull `https://coastalcarolinahvac.com/llms.txt` pre-publish and confirm the four batch-2 spokes get added.**

## Open questions

1. **Phone number canonicalization.** Which of the 5 in-wild phone numbers is canonical for tel: links? For schema? Should they match site-wide, or is call-tracking variance intentional and documented somewhere?
2. **Bundle delivery decision.** Paste-over in place (overwrite the existing posts at the live URLs) vs. unpublish-then-publish? The deliverable HTML is structured for paste-over; Mike's WordPress workflow determines the actual sequence.
3. **AC Blowing Warm Air status.** Found also-thin (1,449 words, 1 H2) — same shell-stub profile as the four target spokes. Was Phase 1's identification of it as one of the "two published comprehensive reference spokes" based on a different version, or has it been thinned since? Worth a follow-up audit.
4. **AC Not Cooling as reference.** Confirmed comprehensive (4,222 words, 13 H2s, 10 H3s, 6 schema blocks). Served as the structural template for the four batch-2 deliverables.
