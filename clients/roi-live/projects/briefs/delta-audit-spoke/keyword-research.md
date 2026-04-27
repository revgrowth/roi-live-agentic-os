---
project: signal-spoke-delta-audit-upgrade
created: 2026-04-26
source: DataForSEO API (US, English)
cost: $0.1719 USD
---

# Keyword Research — Delta Audit Spoke

**Endpoints used:**
- `/v3/keywords_data/google_ads/search_volume/live` (Google Ads search volume)
- `/v3/keywords_data/clickstream_data/dataforseo_search_volume/live` (Clickstream-supplemented volume)
- `/v3/dataforseo_labs/google/keyword_overview/live` (Combined volume + KD + SERP signals)
- `/v3/dataforseo_labs/google/bulk_keyword_difficulty/live` (KD scores)
- `/v3/serp/google/organic/live/advanced` (Top 5 organic SERP per keyword)

**Location:** US (location_code 2840), English

---

## Primary candidates from brief — all returned null

The four candidates the original brief asked Claude to validate all returned null on Google Ads volume, Clickstream volume, AND keyword difficulty. They are sub-threshold long-tail keywords with no measurable demand.

| Keyword | Vol (Google Ads) | Vol (Clickstream) | KD | CPC | Verdict |
|---|---:|---:|---:|---:|---|
| `information gain audit` | null | null | null | null | Zero-volume |
| `content audit for information gain` | null | null | null | null | Zero-volume |
| `how to measure information gain` | null | null | null | null | Zero-volume |
| `content originality audit` | null | null | null | null | Zero-volume |

**Hard stop triggered** per the brief: "If keyword research returns zero meaningful volume on all candidates, pause and ask."

---

## Adjacent keywords with real data

Pulled to surface viable alternatives.

| Keyword | Vol (Google Ads) | KD | CPC | Strategic fit |
|---|---:|---:|---:|---|
| `information gain` | 480 | 6 | — | Pillar territory — owned by `/information-gain-seo` |
| `information gain seo` | 20 | 4 | — | Pillar's primary keyword — do not compete |
| `content audit` | 590 | 37 | $15.44 | Mainstream, mid-difficulty, crowded SERP |
| **`content audit seo`** | **390** | **17** | — | Strong fit |
| **`seo content audit`** | **390** | **14** | — | **Strongest fit — selected as primary** |
| `delta audit` | 20 | 0 | — | Branded methodology — selected as secondary entity-build target |
| `originality audit` | null | null | — | Sub-threshold |
| `ai content audit` | 10 | — | $19.47 | Sub-threshold |

---

## SERP composition for primary candidates (Top 5 organic)

### `information gain audit`

| # | Domain | URL |
|---|---|---|
| 1 | en.wikipedia.org | /wiki/Information_gain_(decision_tree) |
| 2 | cluster-sequoia.univ-rennes.fr | /ai-audits-offensive-information-gain-held-erwan-le-merrer |
| 3 | victorzhou.com | /blog/information-gain/ |
| 4 | reddit.com | r/content_marketing — "Information Gain become the only..." |
| 5 | sciencedirect.com | /topics/mathematics/information-gain |

**SERP intent:** decision-tree machine learning theory + one Reddit thread about content marketing. Wrong intent for our article.

### `content audit for information gain`

| # | Domain |
|---|---|
| 1 | contensis.com |
| 2 | bigcommerce.com |
| 3 | medium.com |
| 4 | stamats.com |
| 5 | kontent.ai |

**SERP intent:** generic content audit guides. None mention information gain in titles. Searcher intent for this exact phrase is essentially "content audit guides for SEO" — better matched by `seo content audit` or `content audit seo`.

### `how to measure information gain`

Same as `information gain audit` — decision-tree ML theory dominates.

### `content originality audit`

| # | Domain |
|---|---|
| 1 | originality.ai |
| 2 | sanity.io |
| 3 | ryantronier.com |
| 4 | acquia.com |
| 5 | linkedin.com |

**SERP intent:** content audit + AI-detection tooling (originality.ai is a content provenance product, not a methodology brand). Mismatched intent.

---

## Strategy decision (Gate 3 — A+C hybrid approved)

**Selected primary:** `seo content audit` (390/mo, KD 14)
**Selected secondary entity-build:** `delta audit` (20/mo, KD 0)

**Why:**
- `seo content audit` has real volume + lowest KD in viable set + descriptive natural fit for the article
- `delta audit` is the branded methodology — owned by ROI.LIVE, KD 0 because nobody competes, plays the long entity-SEO compounding game (Casey Keith approach)
- No cannibalization with the pillar — pillar = "information gain seo" concept query (20/mo, KD 4); spoke = "seo content audit" process query (390/mo, KD 14). Different intent.
- Slug unchanged at `/content-audit-information-gain` — keyword optimization happens in title/H1/H2/body, not URL. Avoids 301 redirect, sitemap edit, and pillar anchor update.

**Final on-page targets:**
- Title: `SEO Content Audit: The Delta Audit Method | ROI.LIVE` (52 chars)
- H1: `The Delta Audit: An SEO Content Audit That Surfaces Information Gain Gaps`
- H2/H3 keyword distribution:
  - "SEO content audit" appears in 3 H2s (#1, #5, #7)
  - "Delta Audit" appears in 4 H2s (#3, #4, #6, #7)
- Body density: `seo content audit` 25 occurrences, `delta audit` 45 occurrences, `information gain` 29 occurrences
- Article schema `about`: `SEO Content Audit`

---

## Cost log

| Endpoint | Cost (USD) |
|---|---:|
| Google Ads Search Volume | ~$0.04 |
| Clickstream Search Volume | ~$0.10 |
| Labs Keyword Overview + Bulk KD + SERP advanced | ~$0.03 |
| **Total** | **$0.1719** |

DataForSEO charges are per-call. Cost for full keyword validation per spoke article is ~$0.20. Negligible.

---

## Lesson for future Signal articles

Every Signal article's primary keyword needs DataForSEO validation before title/H1/slug get locked. The Delta Audit prompt's four candidates ALL returned null — meaning the article would have optimized for zero-volume queries if the brief's hard-stop rule wasn't in place. Adjacent-keyword search through Labs Keyword Overview surfaced viable real-volume alternatives within a single API round-trip.

Captured under `clients/roi-live/context/learnings.md` → `## str-ai-seo`.
