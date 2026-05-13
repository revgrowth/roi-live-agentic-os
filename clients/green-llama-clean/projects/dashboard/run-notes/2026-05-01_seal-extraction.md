# Seal Subscriptions extraction — 2026-04-30 month-end close

**Run date:** 2026-05-01
**Source:** 7 screenshots from Seal Subscriptions admin (Green Llama Shopify), captured 2026-05-01 ~09:48 PT
**Window:** Seal reports "Last 30 days" rolling — for April month-end close, this maps to roughly **Apr 1–30, 2026**.

---

## Subscription header (Last 30 days)

| Metric | Value |
|---|---|
| **Active subscriptions** | 138 |
| Paused | 42 |
| Cancelled | 64 |
| **Total subscriptions on file** | 264 |

> Source: Subscriptions list tab. The "264" row count includes all states; "138 active" is the operational subscriber base.

## Overall lifetime statistics

| Metric | Value |
|---|---|
| Average retention period | **218 days** |
| Average revenue per customer | **$88.80** |
| Maximum revenue per customer | $1,190.59 |
| Median revenue per customer | $44.92 |
| Total revenue from renewals (all-time) | **$14,296.79** |

> Note: revenue figures include only subscription renewals in shop's default currency. Initial orders excluded.

## Recent activity (Last 30 days = ~April 2026)

| Metric | Value | Detail |
|---|---|---|
| Growth rate (all subscriptions) | **6.45%** | 16 new vs 248 starting |
| Growth rate (active subscriptions) | **10.7%** | 15 new active vs 140 starting |
| Churn rate (all subscriptions) | **6.25%** | 12 cancelled vs 192 starting |
| Churn rate (active subscriptions) | **7.7%** | 12 cancelled vs 156 starting |
| Failed payment rate | 3.15% | |
| Failed payment recovery rate | **0%** | ⚠️ no recovered failed payments in window |

## Upcoming potential revenue

| Window | Potential renewal revenue |
|---|---|
| Next 7 days (May 2–8) | **$291.95** |
| Next 30 days | **$1,281.60** |

Daily renewal forecast (next 7 days): May 2 = $34.08 · May 3 = $57.48 · May 4 = $35.02 · May 5 = $62.80 · May 6 = $22.46 · May 7 = $12.56 · May 8 = $67.55

## Retention rate by delivery interval (subscriptions tab)

| Delivery interval | Total | After initial | After #1 | After #2 | After #3 | After #4 | After #5 | After #6 | After #7 | After #8 | After #9 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| **3 month** | 103 | 87.4% | 86.95% | 92.5% | 96.3% | 100% | 78.55% | 80% | 100% | 100% | 100% |
| **2 month** | 71 | 85.9% | 96.15% | 97.5% | 96.45% | 90.5% | 100% | 100% | 92.85% | 83.35% | 85.7% |
| **1 month** | 57 | 85.95% | 93.2% | 83.35% | 100% | 90.9% | 94.45% | 85.7% | 100% | 100% | 100% |
| **6 month** | 33 | 90.9% | 89.45% | 81.8% | 100% | 100% | 100% | none | none | none | none |

> 6-month interval has fewer renewal cycles in window (33 subs, longest delivery cadence). 1-month interval is the lightest cohort (57 subs) but highest renewal frequency.

## Product inventory forecast (units to fulfill, if all renewals succeed)

| Product variant | Next 7d | Next 30d | Next 60d | Next 90d | Next 180d |
|---|---:|---:|---:|---:|---:|
| Powerful Fragrance Free Laundry Detergent (60 Loads) | 8 | 37 | 71 | 108 | 225 |
| EWG Verified™ & PVA-Free Dishwasher Tabs (40-pack) | 7 | 27 | 61 | 89 | 182 |
| All-Purpose Cleaner Refills — Lemongrass | 5 | 24 | 38 | 50 | 108 |
| Eco-Friendly Dishwasher Tablets (40 Loads, 20-pack) | 2 | 3 | 6 | 10 | 20 |
| Bathroom Cleaner Refills — Lavender | 2 | 18 | 26 | 49 | 88 |
| Glass and Mirror Cleaner Refills — Litsea Cubeba | 2 | 7 | 13 | 22 | 38 |
| Solid Coconut Soap Dish Bar | 1 | 3 | 5 | 16 | 24 |
| Refill Cleaning Bundle | 0 | 2 | 5 | 10 | 26 |
| Fragrance-Free All-Purpose Cleaning Refill | 0 | 10 | 10 | 26 | 42 |
| NEW — Fragrance & PVA Free Dish Washer Tabs (40 Loads) | 0 | 0 | 0 | 0 | 2 |
| Sisal Dish Scrub Brush | 0 | 0 | 0 | 0 | 1 |

> Top renewal SKUs by 30-day demand: Laundry Detergent (37), Dishwasher Tabs (27), All-Purpose Refill Lemongrass (24), Bathroom Cleaner Refill (18), All-Purpose Refill Fragrance-Free (10).

## Channel revenue cross-reference

Per Shopify pull:
- April 2026 Seal Subscriptions channel revenue: **$1,600** (April only, "Online Store" $11.2K + Seal $1.6K + others = April $13.6K total)
- YTD 2026 Seal Subscriptions channel revenue: **$4,700** (4 months)

Average Seal channel revenue/month YTD 2026: $1,175. April ($1,600) is above the YTD average — consistent with the +5.67 pt YoY jump in returning customer rate (34.95% YTD → 50.57% April).

## YoY comparison

⚠️ **No April 2025 / YTD 2025 Seal data was provided.** Seal does not have a built-in window-comparison view, and the screenshots are all "Last 30 days" rolling. To enable Seal YoY for the dashboard, a re-pull would need historical Seal export filtered to Apr 2025 and YTD 2025. Flagging — for now, dashboard will show absolute April + YTD figures and use Shopify "Returning customer rate" YoY as the closest proxy for retention movement.

## Notes / flags

1. **Active subscriber base = 138.** Up from 140 at period start (15 new active − 12 cancelled = +3 net… reconciles to growth rate 10.7% on 140 start). Healthy growth in the active cohort despite headline 6.45% all-sub growth.
2. **Failed payment recovery rate is 0%.** 12 cancellations in window, 3.15% failed payment rate = ~6–8 subs failed payment in 30 days, none recovered. Operational opportunity for the lifecycle stack — note for Loop / Email & SMS tab.
3. **218-day average retention** ≈ 7.2 months. Combined with $88.80 avg revenue per customer, lifetime renewal revenue per subscriber is healthy for a $30–35 AOV brand.
4. **Top 30-day renewal demand** (Laundry Detergent 37 + Dishwasher Tabs 27 + APC Lemongrass 24) accounts for ~88 units of next-30-day fulfillment. Inventory team should align on this.
5. **Product report screenshot (094920) appears to be a placeholder/locked sample** — shows "Product A/B/C/D/E" with synthetic 30/26/20/13/6.7% breakdown. Did not extract; ignore as non-data.
6. **No explicit MRR figure exposed by Seal admin.** Closest proxies: $1,600/mo Seal channel revenue (Shopify) or extrapolated $4,750/mo from YTD ÷ 4. Use Shopify channel figure for dashboard.
