# §6 Calculations — 2026-04-30 month-end close

**Run:** 2026-05-01 · `month_end_final` · April 2026 vs April 2025 · YTD Jan 1 – Apr 30
**Method:** All YoY computed by hand from independent pulls per SOP §6.2. **Zero figures lifted from Shopify "comparison" column.**

---

## Headline KPI tile bar (top of dashboard)

| Tile | Old (mid-April) | New (April Final) | YoY math |
|---|---|---|---|
| Tile 1 — Revenue | "April MTD Revenue · $6,886 · 16 of 30 days · +107% YoY" | **"April Revenue (Final) · $13,654 · vs $5,965 Apr 2025 · +128.9% YoY"** | (13654.09 − 5964.73) / 5964.73 × 100 = **+128.92%** |
| Tile 2 — was "Projected" | "April Projected · ~$12,911 · Pace $430/day × 30 days" | **"April Orders (Final) · 364 · vs 167 Apr 2025 · +118.0% YoY"** | (364 − 167) / 167 × 100 = **+117.96%** |
| Tile 3 — YTD | "YTD Revenue (Jan–Apr 16) · $43,061 · +117% YoY" | **"YTD Revenue (Jan 1–Apr 30) · $49,829 · vs $22,521 · +121.3% YoY"** | (49829.30 − 22520.92) / 22520.92 × 100 = **+121.26%** |
| Tile 4 — Klaviyo | "April Klaviyo MTD · $2,606 · 37.8% of rev · Proj ~$4,886" | **"April Klaviyo (Final) · $6,150 · 45.0% of revenue · 71% campaigns / 29% flows"** | 6149.68 / 13654.09 × 100 = **45.04%** |
| Tile 5 — Organic | "Organic Search (Apr) · 29.6% · $978 rev MTD · 16 days · 1,975 sessions" | **"Organic Search (Apr) · 63.4% · 12,239 GA4 sessions · +309% YoY"** | 12239 / 19295 × 100 = **63.43%**; (12239 − 2989) / 2989 × 100 = +309.47% |
| Tile 6 — Keywords #1 | "Keywords at #1 · 35 · 101 in top 10 of 265 · recovering from Apr 2 dip" | **"Keywords at #1 · 32 · 87 in top 10 of 265 · -16 MoM at #1, declined April"** | SE Ranking Apr 30 close (matches `seranking-extraction.md`) |
| Tile 7 — Active subs | "Active Subscriptions · 141 · +8.7%/mo growth · 1.35% churn · 39 paused" | **"Active Subscriptions · 138 · +10.7% active growth · 7.7% active churn · 42 paused"** | Seal admin "Last 30 days" |

## Header right-side totals

| Element | Old | New |
|---|---|---|
| Live badge | "April 16, 2026 · Mid-Month Edition" | **"April 30, 2026 · Month-End Final"** |
| Last updated stamp | (currently "April 16, 2026 · Mid-Month Edition") | **"Last updated: April 30, 2026"** |
| 2025 Shopify Revenue | "$82,107 · +151.9% YoY" | leave (2025 is closed; not in scope) |
| 2026 Projected Full Year | "~$146,400 · +78% vs 2025 · $12,200/mo avg × 12" | **"~$149,488 · +82% vs 2025 · $12,457/mo avg × 12 (extrapolated from YTD pace)"** — derived (~tilde): 49829.30 / 4 × 12 = 149,487.90 |

---

## Tab transitions

| Element | Old | New |
|---|---|---|
| Tab id | `id="tab-march"` | `id="tab-april"` |
| Tab button onclick | `showTab('march','march')` | `showTab('april','april')` |
| Tab label | "🟢 April Live" (already labeled April but pointing to march id — legacy from prior month) | **"🟢 April Final"** |
| Tab section comment | `<!-- ══ MARCH LIVE ══ -->` | `<!-- ══ APRIL FINAL ══ -->` |

---

## Live tab (now April Final) — surgical updates

### Projection callout (lines 234–250)
Mid-month read: "$12,911 Projected · $6,886 MTD Actual · 349 Proj Orders · 186 MTD · $2,606 Klaviyo MTD"

After §4.2 transition (strip every projection on closed month):

| Stat | Old MTD | New Final |
|---|---|---|
| Headline big number | $12,911 (projected) | **$13,654 (actual)** |
| Headline label | "Projected total revenue · vs $5,965 Apr 2025 = +116.5% YoY" | **"April 2026 total sales (final) · vs $5,965 Apr 2025 = +128.9% YoY"** |
| Stat: MTD Actual | $6,886 | **$13,654** (rename to "Total Sales") |
| Stat: Proj. Orders | 349 (projected) | **364 actual orders** |
| Stat: Klaviyo MTD | $2,606 | **$6,150 Klaviyo** |

### "April MTD vs Projection vs Prior Year" chart (lines 255–...)
- Strip "MTD vs Projection" framing
- Replace with **"April 2026 daily revenue vs April 2025"** — full-month line comparison
- Caption: "30-day actual (solid) vs April 2025 (dashed) · April closed at $13,654 vs $5,965 prior year"

### Top Products (April MTD) — line 344
Re-label "April Top Products" with full month
- Channel split for $6,886 MTD → **$13,654 Total Sales**

---

## Overview tab — trailing-12 chart

### Trailing-12 chart data — append April 2026
April 2026 entry:
- `rev`: $13,654
- `ly` (Apr 2025): $5,965
- `org` (organic share): 63.4%
- `orgPct`: 63.43

### YTD totals refresh
- YTD revenue: $43,061 → **$49,829**
- YTD YoY: +117% → **+121.3%**
- YTD orders: refresh to **1,301**
- YTD AOV: refresh to **$36.62**

---

## SEO tab

### GSC totals (April 2026 vs April 2025)
| Metric | Apr 2026 | Apr 2025 | YoY |
|---|---:|---:|---|
| Clicks | 3,049 | 2,530 | **+20.5%** |
| Impressions | 1,255,113 | 391,338 | **+220.7%** |
| CTR | 0.24% | 0.65% | **-63.1%** (lower bc impression base ballooned) |
| Avg position | 5.62 | 19.68 | **-14.06 pts (better)** |

### GSC totals (YTD 2026 vs YTD 2025)
| Metric | YTD 2026 | YTD 2025 | YoY |
|---|---:|---:|---|
| Clicks | 15,374 | 10,636 | **+44.5%** |
| Impressions | 8,414,769 | 1,407,109 | **+498.0%** |
| CTR | 0.18% | 0.76% | **-76.3%** |
| Avg position | 4.54 | 20.35 | **-15.81 pts (better)** |

### SE Ranking position summary (as of Apr 30)
| Bucket | Mar 30 | Apr 30 | Δ MoM |
|---|---:|---:|---|
| At #1 | 48 | **32** | -16 |
| Top 3 | 68 | **57** | -11 |
| Top 10 | 116 | **87** | -29 |
| Top 20 | 137 | **123** | -14 |
| Top 100 | 198 | **195** | -3 |
| Total tracked | 265 | 265 | — |

### Cluster recovery — Non-Toxic
- "non-toxic laundry detergent" (18,100/mo): pos 18 (page 2)
- "non toxic cleaning products" (10,800/mo): pos 64 (page 7)
- "non toxic dishwasher detergent" (5,400/mo): not ranking
- Status: **Weak. Pillar/spoke cluster published April — measure 30–60 days for lift.**

### Eco-Friendly cluster — defending
- 15 keywords at #1, including 1,900/mo top terms
- Status: **Strong dominance. Continue to defend.**

### Top queries refresh
Replace mid-month list with the top 25 from `gsc-extraction.md`. Top 5:
1. green llama (6,866 clicks, pos 1.21)
2. green llama dishwasher powder (2,621, 1.33)
3. green llama dishwasher (910, 1.49)
4. green llama dishwasher tablets (783, 1.71)
5. eco friendly cleaning products (528, pos 2.6, 5.68M impressions)

---

## Email & SMS tab

### Klaviyo April Final
- Total attributed: **$6,150** (vs $2,606 mid-month MTD)
- Campaigns: $4,372 (71%)
- Flows: $1,777 (29%)
- Email open: **32.89%** (Poor)
- Email click: **0.80%** (Fair)
- Email Placed Order: 0.31% (Excellent)
- SMS recipients: 624; Click 2.42% (Fair)

### Klaviyo YTD
- Total attributed: **$14,544**
- Campaigns: $7,050 (48%)
- Flows: $7,494 (52%)
- 67,447 email recipients YTD; 1,231 SMS recipients YTD
- Klaviyo % of revenue YTD: 14544 / 49829 = **29.19%**

### List/segment size (current)
- Subscribers list: 3,076
- SMS list: 373
- VIP Customers segment: 438
- Active engagement segments (Cold + Lap + Risk + Warm + HOT + ACT): 10,413
- Email Marketing Exclusions: 2,945

### Top April email by attributed
1. Last Chance Reminder (Apr 24) — $640.64
2. Earth Day Announcement (Apr 22) — $560.58
3. Tennessee Story (Apr 20) — $351.07
4. Mother's Day Hype (Apr 30) — $342.40
5. VIP Sale Announcement (Apr 21) — $276.14

---

## Orders tab

| Metric | Apr 2026 | Apr 2025 | YoY |
|---|---:|---:|---|
| Total orders | 364 | 167 | +117.96% |
| AOV (Shopify-reported) | $35.90 | $33.32 | +7.74% |
| Returning customer rate (order level) | **50.57%** | 42.94% | **+7.63 pts** |
| Net sales | $12,891.88 | $5,565.57 | +131.6% |
| Gross sales | $15,360.19 | $5,985.10 | +156.6% |

---

## Strategy tab — revenue trajectory

### Trajectory chart — append April 2026 actual
- April 2026: $13,654 (actual, replace any projection point)
- YTD pace: $49,829 / 4 months = $12,457/mo
- Path-to-$30K: at $12,457/mo run rate, projecting May–Dec gets to $49,829 + (8 × $12,457) = $149,485 full year. **$30K monthly target requires +141% lift from current pace.**
- Closest single-month high: April $13,654 — still 55% below $30K target.

### Subscription platform analysis (Skio recommendation)
No movement noted from Jason. Leave unchanged. Add note: subscriber base 138 (was 141 mid-month).

---

## MER (Marketing Efficiency Ratio)

⚠️ **Cannot compute without ad spend data.** No paid ad spend was uploaded. Shopify channel-revenue data shows Adwords revenue ($391) and Bing revenue ($935) but those are revenue, not spend. **Skip MER tile or asterisk-flag with "spend data not available this run."** Recommend: flag for next run cycle.

---

## Reconciliation pass (§8.5)

| Metric | Source A | Source B | Variance | Within tolerance? |
|---|---|---|---:|---|
| April 2026 sessions | Shopify 15,227 | GA4 (corrected) 19,295 | +26.7% | ⚠️ Above ±15% but explainable — GA4 captures non-storefront views |
| April 2026 revenue | Shopify Total Sales $13,654.09 | GA4 attributed $19,771.79 | +44.8% | ❌ Outside ±5%; GA4 over-attributing. **Flag for Jason — likely GA4 attribution window or refund handling. Use Shopify as canonical.** |
| April 2026 orders | Shopify 364 | Klaviyo Placed Order events ≈ 31,631 × 0.31% = 98 (campaigns only, not all orders) | n/a (different scope) | n/a — Klaviyo only counts attributed-to-Klaviyo orders |
| April 2026 organic sessions | GA4 12,239 (organic) | GSC 3,049 clicks | GSC < GA4 expected (different metrics — clicks vs sessions) | n/a — different metrics |
| April 2026 Klaviyo attribution share | Klaviyo $6,150 | Implied % of Shopify $13,654 = 45.0% | within typical range | ✅ |

**Material flag:** GA4 attributed revenue $19,772 > Shopify Total Sales $13,654. This is unusual — GA4 should not exceed Shopify storefront revenue. Possible causes: (1) GA4 attribution window double-counting renewals, (2) GA4 includes test/sample transactions, (3) ecommerce events fire on stages Shopify treats as cancelled. **Recommend Jason: spot-check GA4 transactions in raw view next run.** For this dashboard, **Shopify $13,654 is canonical for revenue.**

---

## Notes on values pulled

All Shopify, GA4, GSC, SE Ranking, Klaviyo, and Seal numbers above trace back to:
- `2026-05-01_shopify-extraction.md`
- `2026-05-01_ga4-extraction.md` (corrected version)
- `2026-05-01_gsc-extraction.md`
- `2026-05-01_seranking-extraction.md`
- `2026-05-01_klaviyo-extraction.md`
- `2026-05-01_seal-extraction.md`

Per SOP §6.2, every YoY % was computed by hand from two independent pulls. **Zero values were lifted from Shopify's "comparison" column.**
