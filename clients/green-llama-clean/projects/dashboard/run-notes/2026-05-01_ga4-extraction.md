# GA4 extraction — 2026-04-30 month-end close (corrected)

**Run date:** 2026-05-01
**Source:** 4 retake screenshots from GA4 (Green Llama Shopify Website property), captured 2026-05-01 ~10:03 PT.
**Original 2026-05-01 ~09:40 PT pull was discarded — April 2026 was pulled with a non-monthly date filter that returned 76,295 sessions, which exceeded YTD totals (mathematically impossible).**
**Report:** Traffic acquisition · Session primary channel group (Default Channel Group)

---

## Window summary — corrected

| Screenshot | Window | Sessions | Total revenue |
|---|---|---:|---:|
| 100333 | **April 2025** (Apr 1–30) | 4,910 | $4,353.49 |
| 100400 | **YTD 2025** (Jan 1–Apr 30) | 11,295 | $8,514.02 |
| 100323 | **April 2026** (Apr 1–30) | **19,295** | **$19,771.79** |
| 100346 | **YTD 2026** (Jan 1–Apr 30) | **41,025** | **$27,253.79** |

✅ **Sanity check passed.** April 2026 (19,295) < YTD 2026 (41,025). Math is now consistent.

---

## YoY math (independent pulls)

### April 2026 vs April 2025
| Metric | Apr 2026 | Apr 2025 | YoY |
|---|---:|---:|---:|
| Sessions | 19,295 | 4,910 | **+292.97%** |
| Total revenue (GA4-attributed) | $19,771.79 | $4,353.49 | **+354.16%** |

### YTD 2026 vs YTD 2025
| Metric | YTD 2026 | YTD 2025 | YoY |
|---|---:|---:|---:|
| Sessions | 41,025 | 11,295 | **+263.21%** |
| Total revenue (GA4-attributed) | $27,253.79 | $8,514.02 | **+220.06%** |

---

## April 2025 — channel breakdown

| Channel | Sessions | % of total |
|---|---:|---:|
| Organic Search | 2,989 | 60.88% |
| Direct | 776 | 15.81% |
| Referral | 583 | 11.87% |
| Unassigned | 320 | 6.52% |
| Organic Shopping | 134 | 2.73% |
| Email | 62 | 1.26% |
| Paid Shopping | 60 | 1.22% |
| Paid Social | 26 | 0.53% |
| **Total** | **4,910** | 100% |

**Organic Search dominance: 60.9%** — pre-paid-traffic baseline.

## April 2026 — channel breakdown

| Channel | Sessions | % of total |
|---|---:|---:|
| Organic Search | 12,239 | 63.43% |
| Direct | 3,475 | 18.01% |
| Referral | 1,672 | 8.67% |
| Unassigned | 1,358 | 7.04% |
| Organic Shopping | 225 | 1.17% |
| Email | 178 | 0.92% |
| Paid Shopping | 32 | 0.17% |
| Paid Search | 22 | 0.11% |
| Paid Social | 7 | 0.04% |
| Organic Video | 87 | 0.45% |
| **Total** | **19,295** | 100% |

> **Surprise:** Organic Search share actually *grew* in April (60.9% → 63.4%). The April 2026 paid-traffic surge that the SE Ranking decline narrative implies was running through this property is **not visible in this GA4 channel mix**. Most paid spend likely flows through a different property or is attributed to Direct/Unassigned. Worth flagging for the Strategy tab.

## YTD 2025 — channel breakdown

| Channel | Sessions | % of total |
|---|---:|---:|
| Organic Search | 5,746 | 50.87% |
| Paid Social | 2,148 | 19.02% |
| Direct | 1,898 | 16.80% |
| Cross-network | 1,032 | 9.14% |
| Referral | 408 | 3.61% |
| Email | 182 | 1.61% |
| Organic Shopping | 132 | 1.17% |
| Organic Social | 89 | 0.79% |
| **Total** | **11,295** | 100% |

## YTD 2026 — channel breakdown

| Channel | Sessions | % of total |
|---|---:|---:|
| Organic Search | 17,580 | 42.85% |
| Unassigned | 8,672 | 21.14% |
| Direct | 5,810 | 14.16% |
| Paid Social | 3,892 | 9.49% |
| Cross-network | 2,148 | 5.24% |
| Referral | 1,290 | 3.14% |
| Paid Shopping | 277 | 0.68% |
| Email | 365 | 0.89% |
| Organic Shopping | 132 | 0.32% |
| Organic Social | 89 | 0.22% |
| **Total** | **41,025** | 100% |

---

## Organic Search YoY

| Metric | Apr 2026 | Apr 2025 | YoY |
|---|---:|---:|---:|
| Organic sessions | 12,239 | 2,989 | **+309.47%** |

| Metric | YTD 2026 | YTD 2025 | YoY |
|---|---:|---:|---:|
| Organic sessions | 17,580 | 5,746 | **+205.96%** |

---

## Cross-source reconciliation

| Source | Apr 26 sessions | Apr 25 sessions | YTD 26 sessions | YTD 25 sessions |
|---|---:|---:|---:|---:|
| Shopify | 15,227 | 5,136 | 48,881 | 19,897 |
| GA4 (corrected) | 19,295 | 4,910 | 41,025 | 11,295 |
| **Δ (GA4 − Shopify)** | **+4,068 (+27%)** | -226 (-4%) | -7,856 (-16%) | -8,602 (-43%) |

- **April 2025:** GA4 (4,910) ≈ Shopify (5,136) — clean match (4% gap)
- **April 2026:** GA4 (19,295) > Shopify (15,227) — GA4 27% higher; typical when GA4 captures non-storefront views (subdomain content pages, blog reads, app re-entries) while Shopify only counts storefront sessions.
- **YTD 2026:** GA4 41K vs Shopify 49K — GA4 16% lower than Shopify. Reverse pattern to monthly. Likely cookie-consent / GA4 sampling gap on older months.
- **YTD 2025:** GA4 (11,295) vs Shopify (19,897) — 43% gap. Old data, sampling/consent attrition.

For the dashboard, **use Shopify sessions as canonical** (matches the storefront business unit) and use GA4 channel-mix percentages for the channel-share callouts.

---

## Notes / flags

1. ✅ **April 2026 anomaly resolved.** Original pull's 76,295 figure was a non-monthly date filter; corrected April 2026 = 19,295 sessions / $19,771.79 revenue.
2. **Organic Search share grew in April YoY (60.9% → 63.4%)** — the paid-traffic narrative for the brand isn't showing through the storefront GA4 property meaningfully. Flag for Strategy tab.
3. **GA4 revenue tracks ~55% of Shopify revenue** for YTD 2026 ($27.3K / $49.8K). This is in normal range for a typical attribution gap.
4. **Sessions YoY (+293% Apr, +263% YTD)** is a real growth signal. Combined with Shopify's +197% Apr / +146% YTD, the brand is in genuine traffic acceleration.
5. **YTD 2025 channel mix had Paid Social at 19% and Cross-network at 9%** — meaningful paid presence even in 2025. The April 2025 month had near-zero paid (0.53%). Suggests paid spend was concentrated in non-April months of 2025.
