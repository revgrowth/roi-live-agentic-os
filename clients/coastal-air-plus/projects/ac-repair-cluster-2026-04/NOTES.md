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
