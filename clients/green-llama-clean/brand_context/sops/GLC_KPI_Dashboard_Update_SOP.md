# GLC KPI Dashboard: Monthly Update SOP

**Owner:** Jason Spencer · ROI Live  
**Client:** Green Llama Clean (GLC)  
**Artifact updated:** `green-llama-dashboard.html` (static HTML, committed to client)  
**Cadence:** Monthly (mid-month review pull + month-end final close)  
**Audience for this SOP:** Claude Code agent operating inside the GLC agentic OS, with Jason in the loop for source uploads and approvals.

---

## 0. Purpose

Refresh every metric, date stamp, comparison window, and chart on the GLC KPI dashboard so the artifact reflects the most recent closed period available, with rigorous YoY math and zero stale references. The dashboard is a client-facing trust artifact. Data integrity is the gate. If a number cannot be verified, it does not ship.

---

## 1. Run Metadata (set this at the top of every run)

The agent must capture and confirm these values before touching the dashboard:

| Field | Value (this run) | How to set |
|---|---|---|
| `RUN_DATE` | The date the update is being processed | Today's date |
| `LATEST_DATE` | Most recent date with closed data | Yesterday's date |
| `RUN_TYPE` | `month_end_final` or `mid_month_pull` | See §4 to determine |
| `CURRENT_MONTH` | The month being displayed as the headline "Live" period | See §4 |
| `PRIOR_YEAR_MONTH` | The matching month from the prior year for YoY | `CURRENT_MONTH` minus 12 months |
| `YTD_WINDOW` | `Jan 1, [year]` through `LATEST_DATE` | Computed |
| `YTD_PRIOR_WINDOW` | `Jan 1, [year-1]` through `LATEST_DATE - 1 year` | Computed |
| `OUTPUT_FILE` | Path to the HTML file being updated | Project default |
| `BACKUP_FILE` | Pre-update snapshot path | `green-llama-dashboard_pre-[RUN_DATE].html` |

**Today's run example (April 30, 2026 close):**

```
RUN_DATE          = 2026-05-01
LATEST_DATE       = 2026-04-30
RUN_TYPE          = month_end_final
CURRENT_MONTH     = April 2026
PRIOR_YEAR_MONTH  = April 2025
YTD_WINDOW        = 2026-01-01 → 2026-04-30
YTD_PRIOR_WINDOW  = 2025-01-01 → 2025-04-30
```

The agent must echo this metadata block to the user and pause for confirmation before proceeding.

---

## 2. Pre-flight Checklist

The agent must complete every item before pulling data:

- [ ] Backup the existing HTML to `BACKUP_FILE` (no in-place edits without a snapshot)
- [ ] Confirm the dashboard renders without errors in its current state (no broken charts, no `NaN`, no `undefined`)
- [ ] Read the dashboard file end-to-end and inventory every dated reference, every YoY callout, every projection, and every chart data array
- [ ] Build a working list of every value that will need to change (the "change manifest")
- [ ] Request from the user the source exports listed in §5 for the `LATEST_DATE` close

---

## 3. Date Framing Rules (CRITICAL)

These rules govern how dates appear on the dashboard. They are the most common source of staleness errors.

### 3.1 The "latest date" anchor

`LATEST_DATE` is the most recent date with closed data (yesterday in a same-day run). Every relative reference on the dashboard must resolve against this anchor.

### 3.2 MTD vs YTD framing

- **MTD** windows always end at `LATEST_DATE` and start at the first day of `CURRENT_MONTH`.
- **YTD** windows always end at `LATEST_DATE` and start at January 1 of the current year.
- **Prior-year MTD** = same start and end days, prior year. Same for YTD.
- Every MTD or YTD callout on the dashboard must include the explicit window in fine print: `Apr 1–30, 2026 vs Apr 1–30, 2025`.

### 3.3 "Last updated" stamp

The header timestamp displays as: `Last updated: [LATEST_DATE long form]` (example: `Last updated: April 30, 2026`). This is the latest date of closed data, not the run date.

### 3.4 Forbidden references

The agent must remove or replace these patterns wherever found:

- "Today" / "as of today" / "current" without a date
- Any month name that no longer matches `CURRENT_MONTH`
- Any YoY label like "vs [Month] 2025" where [Month] no longer matches `PRIOR_YEAR_MONTH`
- Any projection labeled "based on X of Y days" if `RUN_TYPE = month_end_final` (the month is closed; projections become actuals)

---

## 4. Month-End Transition Logic

This determines `RUN_TYPE` and `CURRENT_MONTH`.

### 4.1 Determining RUN_TYPE

If `LATEST_DATE` is the last calendar day of its month → `RUN_TYPE = month_end_final`.  
If `LATEST_DATE` is mid-month → `RUN_TYPE = mid_month_pull`.

### 4.2 What changes when RUN_TYPE = month_end_final

When a month closes (today's case: April 30, 2026), the dashboard transitions:

1. **The "Live" tab** rolls forward. The tab that displayed the in-progress month becomes the closed-month tab. Today: the tab labeled "March Live" (or whatever month was live before this run) is renamed and repopulated for **April Live**.
2. **The headline KPI tile bar** swaps the prior `CURRENT_MONTH` references for the new closed month. Example:
   - Before: `March Klaviyo MTD · $2,001 · Proj ~$3,265`
   - After:  `April Klaviyo Final · $[actual] · vs Apr 2025 [YoY%]`
3. **All YoY anchors shift** from `[prior_month] 2025` to `April 2025`.
4. **Projection callouts disappear** for the closed month. The agent removes any "Projected end-of-month" or "based on X of Y days" language for April. April is closed; the actuals are the headline.
5. **The trailing-12-months chart** (`allMonthly` array in the React build, or the equivalent SVG path data in the static HTML) gains April 2026 as a new data point. The oldest month rolls off only if the chart is windowed; otherwise April is appended.
6. **The Overview tab** updates the "most recent closed month" comparison to April 2026 vs April 2025.

### 4.3 What changes when RUN_TYPE = mid_month_pull

Mid-month runs preserve the live-month tab name and refresh the in-progress numbers, MTD windows, projections, and YoY comparisons against the matching partial-month window in the prior year.

---

## 5. Data Extraction by Source

The agent requests the user upload one batch per platform. The request to the user should list these exports by name. For each platform, the agent must verify the date range of the export matches the expected window before processing.

### 5.1 Shopify (the YoY trap)

**Critical warning:** Shopify's analytics dashboard defaults to comparing the selected period against the **preceding period of equal length**, not against the same period in the prior year. The "comparison" column shown next to each metric is period-over-period. Reading those numbers as YoY produces inflated percentages (the original dashboard was off by hundreds of percent on multiple metrics until this was caught and corrected).

**Required exports from Shopify:**

| Export | Window | Purpose |
|---|---|---|
| Total revenue + orders + sessions + CVR + AOV | `CURRENT_MONTH` (full month if `month_end_final`, MTD if `mid_month_pull`) | Headline tile and Live tab |
| Same metrics | `PRIOR_YEAR_MONTH` matching window | True YoY denominator |
| Same metrics | `YTD_WINDOW` | YTD callouts |
| Same metrics | `YTD_PRIOR_WINDOW` | YTD YoY |
| New customers over time | `YTD_WINDOW` and `YTD_PRIOR_WINDOW` | New vs returning split |
| Returning customers over time | Same windows | Returning customer rate (order-level) |
| Returning customer rate by month | Trailing 12 months | Trend chart |

**Verification rules:**

1. Pull current-period figure from the export.
2. Pull prior-year same-period figure on its own. Never trust Shopify's default comparison.
3. Compute YoY by hand: `(current − prior) / prior × 100`.
4. Cross-check at least one figure against another data source (Klaviyo total orders, GA4 ecommerce revenue) before accepting.

**Returning customer rate label:** Shopify computes this at the **order level** (returning customer orders ÷ total orders), not the customer level. The dashboard label must reflect this. Do not mix the two definitions across periods.

### 5.2 Klaviyo

**Required exports:**

| Export | Window | Purpose |
|---|---|---|
| Campaign attributed revenue | `CURRENT_MONTH` | Klaviyo MTD/Final tile |
| Same | `PRIOR_YEAR_MONTH` | YoY |
| Flow attributed revenue | `CURRENT_MONTH` and prior year | Flow-vs-campaign split |
| Total Klaviyo-attributed revenue (campaigns + flows) | `YTD_WINDOW` and `YTD_PRIOR_WINDOW` | Email & SMS tab |
| Subscriber list size | As of `LATEST_DATE` and `LATEST_DATE − 1 year` | List growth metric |
| Open rate, click rate, placed-order rate | `CURRENT_MONTH` rolling | Performance tile |

**Attribution window note:** Confirm the Klaviyo attribution window is set the same on every export (default is 5 days click / 5 days open). A mismatch will produce reconciliation errors against Shopify.

### 5.3 GA4

**Required exports:**

| Export | Window | Purpose |
|---|---|---|
| Sessions by channel group | `CURRENT_MONTH` and prior year | Channel mix |
| Organic search sessions and revenue | Same | Organic % of sessions, organic-attributed revenue |
| Sessions by device | Same | Device mix tile if shown |
| Bot/spam-suspect traffic flag | Cross-check | Bot traffic was identified earlier as distorting CVR; flag any anomalous spikes |

**Bot traffic note:** Singapore-source bot traffic was flagged in earlier runs. If any session spike on the channel mix looks anomalous, flag it in the change manifest for Jason to review before publish.

### 5.4 Google Search Console

**Required exports:**

| Export | Window | Purpose |
|---|---|---|
| Total clicks, impressions, average CTR, average position | `CURRENT_MONTH` and prior year | SEO tab top metrics |
| Same | `YTD_WINDOW` and `YTD_PRIOR_WINDOW` | YTD SEO performance |
| Top 25 queries with clicks and position | Trailing 90 days | Query performance section |

### 5.5 SE Ranking

**Required exports:**

| Export | Window | Purpose |
|---|---|---|
| Keyword position summary (total tracked, # at #1, # in top 3, # in top 10) | As of `LATEST_DATE` | SEO tab keyword tile |
| Position changes vs 30 days ago | Same | Movement summary |
| Topical cluster rank summary for the "non toxic cleaning products" cluster | Same | Cluster recovery tracking |

### 5.6 Seal Subscriptions

**Required exports:**

| Export | Window | Purpose |
|---|---|---|
| Active subscriber count | As of `LATEST_DATE` and `LATEST_DATE − 1 year` | Subscriber growth |
| MRR / subscription revenue | `CURRENT_MONTH` and prior year | Subscription revenue tile |
| Churn rate | Trailing 90 days | Retention metric |

---

## 6. Calculation Conventions

These conventions were established during the March 2026 dashboard build and must persist on every update.

### 6.1 Sourcing notation

| Notation | Use case | Example |
|---|---|---|
| No notation | Numbers pulled from a source platform | `$12,213` (Shopify total revenue) |
| Tilde (`~`) prefix | Derived figures: projections, blended metrics, calculated percentages spanning periods | `~$5,100/mo` (projected campaign revenue) |
| Asterisk (`*`) | MER and any blended-channel metric, with a footnote defining scope | `MER 3.2*` with footnote stating included channels |

### 6.2 YoY math

Always compute by hand from the two independent pulls. Never trust a platform's default comparison column.

```
yoy_pct = ((current_period - prior_year_same_period) / prior_year_same_period) * 100
```

Round to whole percentage points for tile callouts. Round to one decimal for fine-print labels.

### 6.3 Period-over-period vs YoY labeling

If a period-over-period comparison is shown (e.g., April 2026 vs March 2026), label it `MoM`. Never let a `MoM` callout sit next to a `YoY` callout without clear labels. That mixed-label pattern is the failure mode that caused the original error.

### 6.4 Projections (mid-month runs only)

Projection formula for a mid-month MTD pull:

```
projected_full_month = mtd_actual / (days_elapsed / total_days_in_month)
```

Always tilde-prefix projections. Always show the day count (`based on X of Y days = Z%`). Strip every projection when transitioning to `month_end_final`.

---

## 7. Tab-by-Tab Update Procedure

The dashboard is composed of (at minimum) these sections. The agent updates them in this order.

### 7.1 Header & headline KPI tile bar

Updates required:

- [ ] `Last updated:` stamp → `LATEST_DATE` long form
- [ ] Each tile's label → reflects `CURRENT_MONTH`
- [ ] Each tile's headline value → updated from source
- [ ] Each tile's sub-line YoY → recalculated by hand from §6.2
- [ ] If `RUN_TYPE = month_end_final`: remove "MTD" and "Proj" language; replace with "Final" or month name
- [ ] If `RUN_TYPE = mid_month_pull`: include the day-count fine print

### 7.2 Live tab (now: April Live)

This is the most-changed tab on every run.

For `RUN_TYPE = month_end_final`:

- [ ] Tab name and tab id update to the closed month
- [ ] Top callout switches from "Projection" framing to "Final" framing
- [ ] All MTD figures become final-month figures
- [ ] Every YoY comparison rebuilt with `PRIOR_YEAR_MONTH` (April 2025) data
- [ ] New vs returning customer breakdown rebuilt for the full month
- [ ] AOV inversion check: if new-customer AOV remains higher than returning-customer AOV, the strategic-insight callout stays in the tab; if the relationship has flipped, rewrite the callout with the new finding
- [ ] Any "missing data point" flags (e.g., new vs returning AOV) carried forward only if still missing

### 7.3 Overview tab

- [ ] Trailing-12-months chart data array (`allMonthly` or SVG path) gains `CURRENT_MONTH` as a new data point with `rev`, `ly`, `org`, and `orgPct` values
- [ ] Window slides forward: oldest month rolls off if the chart is fixed-width
- [ ] YTD totals refreshed
- [ ] YTD YoY refreshed using true prior-year same-period denominator
- [ ] Channel mix donut/bar chart refreshed for `CURRENT_MONTH`

### 7.4 SEO tab

- [ ] GSC totals refreshed for `CURRENT_MONTH` and YTD
- [ ] Keyword position summary refreshed (#1 / top 3 / top 10 counts)
- [ ] Cluster recovery section: update the "non toxic cleaning products" cluster status with current rank positions for each cluster article
- [ ] Top queries table refreshed
- [ ] Organic-attributed revenue refreshed and the % of total sessions tile updated

### 7.5 Email & SMS tab

- [ ] Klaviyo MTD/Final figures refreshed
- [ ] Campaign vs flow split refreshed
- [ ] List size and YoY growth refreshed
- [ ] Open / click / placed-order rates refreshed
- [ ] Email & SMS as % of total revenue computed and updated (Klaviyo total ÷ Shopify total)

### 7.6 Orders tab

- [ ] Total orders for `CURRENT_MONTH` and YoY
- [ ] AOV refreshed for total, new, and returning (if available)
- [ ] Returning customer rate refreshed with the order-level label
- [ ] New vs returning order breakdown refreshed

### 7.7 Strategy tab

- [ ] Revenue trajectory chart: append `CURRENT_MONTH` actual to the historical line; the five projection scenarios extend forward from `LATEST_DATE`
- [ ] Path-to-$30K progress callout updated with the latest closed month
- [ ] SEO ROI model refreshed with current organic revenue figure
- [ ] Subscription platform analysis: update SKIO recommendation status if any movement has occurred (request from user; if no input, leave unchanged with note in change manifest)

---

## 8. QA Checklist (the gate)

The agent must run this entire checklist before publishing. If any item fails, halt and surface to user.

### 8.1 Date integrity

- [ ] `Last updated` header reads `LATEST_DATE` long form
- [ ] No reference anywhere to a month earlier than `CURRENT_MONTH` as if it were live
- [ ] No "today" or "as of today" without a resolved date
- [ ] Every MTD callout shows its explicit window
- [ ] Every YoY callout shows its explicit window
- [ ] If `month_end_final`: zero "Projected" or "based on X of Y days" language for `CURRENT_MONTH`

### 8.2 YoY math integrity

- [ ] Every YoY percentage on the dashboard has been recomputed by hand from two independent pulls
- [ ] No YoY percentage was lifted from a Shopify "comparison" column
- [ ] At least one Shopify figure has been cross-checked against Klaviyo or GA4 and reconciled (within reasonable attribution variance)
- [ ] Returning customer rate is labeled at the order level
- [ ] All YoY signs are correct (negative numbers shown in a distinct color)

### 8.3 Sourcing notation integrity

- [ ] Every projection has a tilde prefix
- [ ] Every blended/derived figure has a tilde prefix
- [ ] Every MER reference has an asterisk and a footnote defining scope
- [ ] No source-pulled figure has a tilde or asterisk

### 8.4 Chart integrity

- [ ] Every chart's data array includes `CURRENT_MONTH`
- [ ] No chart shows a flat line at the right edge (a sign the new data point was missed)
- [ ] No chart in a hidden tab shows zero height (Chart.js fails silently in hidden tabs; if Chart.js is in use, confirm activate-on-show initialization is intact, or that inline SVG is rendering)
- [ ] Trailing-12-months chart range matches expectation

### 8.5 Reconciliation pass

The agent computes and displays this reconciliation table to Jason for sign-off before publish:

| Metric | Source A | Source B | Variance | Within tolerance? |
|---|---|---|---|---|
| `CURRENT_MONTH` revenue | Shopify | Klaviyo (campaign + flow attributed × inverse share) | computed | ±5% expected |
| `CURRENT_MONTH` orders | Shopify | Klaviyo placed-order events | computed | ±10% expected |
| Organic sessions | GSC | GA4 | computed | ±15% expected (different attribution) |

### 8.6 Visual smoke test

- [ ] Render the dashboard in a browser
- [ ] Load every tab and confirm no `NaN`, `undefined`, `null`, `Infinity`, or empty values
- [ ] Confirm mobile view renders correctly (the mobile responsive overhaul must remain intact)
- [ ] Confirm no broken chart canvases

### 8.7 Change manifest review

The agent presents Jason with the full change manifest before publish:

- Every value that changed (old → new)
- Every YoY recomputation with the math shown
- Every flag raised during reconciliation
- Every item left unchanged that the agent expected to change (and why)

Jason approves or requests revisions. No publish without approval.

---

## 9. Publish & Deliver

After Jason approves the change manifest:

1. **Write the updated HTML** to `OUTPUT_FILE`.
2. **Diff the output** against `BACKUP_FILE` and surface the diff summary (lines changed, sections touched).
3. **Run the visual smoke test one more time** on the written file.
4. **Commit to the client repo** (or the project's static delivery location) with a commit message of the form:
   ```
   Dashboard update: [LATEST_DATE] close, [RUN_TYPE]
   - [Major change 1]
   - [Major change 2]
   - [Reconciliation notes]
   ```
5. **Generate the run log entry** (Appendix A) and append it to the project's run log file.
6. **Notify Jason** with the path to the updated file and the one-paragraph summary of what shipped.

---

## 10. Common Errors & Recovery

| Error | Symptom | Recovery |
|---|---|---|
| YoY pulled from Shopify's PoP column | YoY % much higher than reasonable (e.g., +600%) | Re-pull prior year same-period independently; recompute |
| Chart blank in hidden tab | Chart shows nothing or tiny size after tab activation | Confirm activate-on-show init for Chart.js, or migrate to inline SVG |
| New data point missing from trailing chart | Right edge of chart is flat at last month's value | Check `allMonthly` or SVG path data array; confirm append happened |
| Returning customer rate looks wrong vs another report | Number doesn't match a third-party report Kay has | Confirm both reports use the same definition (order-level vs customer-level); label the dashboard's view as order-level |
| Klaviyo and Shopify don't reconcile | Klaviyo-attributed revenue >> total Shopify revenue or wildly less | Check Klaviyo attribution window setting; confirm both pulls cover the same date range |
| Projection language stuck on a closed month | Closed month still says "Projected" or shows day count | `RUN_TYPE` was set to `mid_month_pull` when it should be `month_end_final`; restart |

---

## Appendix A: Run Log Entry Template

Append this to the GLC run log on every dashboard update.

```markdown
## Dashboard Update: [LATEST_DATE]

**Run type:** [month_end_final | mid_month_pull]  
**Current month displayed:** [CURRENT_MONTH]  
**YoY anchor:** [PRIOR_YEAR_MONTH]  

### Headline numbers

- [CURRENT_MONTH] revenue: $X (YoY: ±Y%)
- [CURRENT_MONTH] orders: X (YoY: ±Y%)
- [CURRENT_MONTH] AOV: $X (YoY: ±Y%)
- YTD revenue: $X (YoY: ±Y%)
- Organic % of sessions: X%
- Klaviyo % of revenue: X%

### Reconciliation

- Shopify vs Klaviyo revenue variance: ±X%
- GSC vs GA4 organic sessions variance: ±X%
- Notes: [any anomalies]

### Changes shipped

- [list of major value changes]
- [any structural changes (new sections, removed projections, etc.)]

### Flags raised

- [anything Jason should track for next run]
```

---

## Appendix B: Source Upload Request (template the agent sends to Jason)

When the agent kicks off a run, it sends Jason this request:

```
Dashboard update for [LATEST_DATE] close.

Need the following exports. Date ranges in each line:

SHOPIFY
- Total revenue / orders / sessions / CVR / AOV: [CURRENT_MONTH window]
- Same: [PRIOR_YEAR_MONTH matching window] ← independent pull, do not use Shopify's comparison column
- Same: [YTD_WINDOW] and [YTD_PRIOR_WINDOW]
- New customers over time: YTD this year and YTD last year
- Returning customers over time: same
- Returning customer rate by month: trailing 12 months

KLAVIYO
- Campaign attributed revenue: [CURRENT_MONTH] and [PRIOR_YEAR_MONTH]
- Flow attributed revenue: same windows
- Total Klaviyo revenue: [YTD_WINDOW] and [YTD_PRIOR_WINDOW]
- Subscriber list size: as of [LATEST_DATE] and [LATEST_DATE − 1 year]
- Open / click / placed-order rates: [CURRENT_MONTH]

GA4
- Sessions by channel group: [CURRENT_MONTH] and [PRIOR_YEAR_MONTH]
- Organic search sessions and revenue: same

GSC
- Clicks / impressions / CTR / avg position: [CURRENT_MONTH] and [PRIOR_YEAR_MONTH]
- Same: [YTD_WINDOW] and [YTD_PRIOR_WINDOW]
- Top 25 queries: trailing 90 days

SE RANKING
- Keyword position summary: as of [LATEST_DATE]
- 30-day movement summary
- Non-toxic cleaning products cluster rank summary

SEAL
- Active subscriber count: as of [LATEST_DATE] and prior year
- Subscription revenue: [CURRENT_MONTH] and [PRIOR_YEAR_MONTH]
- Churn rate: trailing 90 days

Confirm exports and I'll proceed with the update.
```

---

## Appendix C: Today's Run Pre-fill (April 30, 2026 close)

For the run starting May 1, 2026:

```
RUN_DATE          = 2026-05-01
LATEST_DATE       = 2026-04-30
RUN_TYPE          = month_end_final
CURRENT_MONTH     = April 2026
PRIOR_YEAR_MONTH  = April 2025
YTD_WINDOW        = 2026-01-01 → 2026-04-30
YTD_PRIOR_WINDOW  = 2025-01-01 → 2025-04-30

Specific transitions for this run:
- "March Live" tab → "April Live"
- All March 2026 references in headline tiles → April 2026
- All "vs Mar 2025" YoY anchors → "vs Apr 2025"
- Remove every projection / day-count callout (April is closed)
- Append April 2026 to the trailing-12-months chart data
- Update revenue trajectory chart on Strategy tab with April 2026 actual
- Refresh YTD windows to Jan 1 – Apr 30 (this year and prior)
```

---

**End of SOP.**
