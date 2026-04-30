# Dashboard Conventions

Operational rules for any Green Llama dashboard or reporting deliverable. These conventions emerged from real incidents on the account and are non-negotiable.

## Sourcing notation

**Tilde (`~`) prefix on derived figures.** Any number that has been calculated from source data — projections, percentages computed across periods, blended metrics — gets a leading tilde to signal "derived." Examples: `~$5,100/mo` (projected campaign revenue), `~36.8%` (rolling open rate average).

**Asterisk (`*`) on MER figures.** Marketing Efficiency Ratio numbers get an asterisk with a footnote noting the scope of the calculation (which channels are included, what's net vs. gross, which time window). Example: `MER 3.2*` with a footnote stating `*MER calculated as gross sales / total marketing spend across paid social, paid search, and influencer.`

**No notation on directly-pulled figures.** Numbers pulled cleanly from a source platform (Shopify total revenue, Klaviyo open rate for a specific send, GA4 sessions) get no special notation. They are reported as-is.

## YoY math — the critical rule

**Shopify analytics defaults to period-over-period, not year-over-year.** When Shopify shows a comparison percentage in its dashboard, that comparison is by default against the immediately preceding period of the same length — not the same period last year.

This caused a major data integrity issue on March 24, 2026. Several metrics were reported with inflated YoY percentages (some by 600%+) because the comparison column was misread.

**The verification protocol:**

1. Pull the current period figure cleanly
2. Pull the prior-year same-period figure independently — never trust Shopify's default comparison
3. Calculate the YoY percentage manually: `(current − prior) / prior × 100`
4. Cross-check at least one figure against another data source (Klaviyo total orders, GA4 e-commerce, Shopify Reports)

This applies to all metrics: revenue, gross sales, orders, sessions, CVR, AOV, returning customer rate.

## Returning customer rate — measurement clarity

**Shopify calculates returning customer rate at the order level**, not the customer level. The formula is `returning customer orders / total orders`. A unique-customer view (`unique returning customers / total customers`) produces a different number from the same data.

When reporting returning customer rate, label which view is being used. If the client compares the dashboard number to a different report, the discrepancy is usually because the two reports are measuring different things.

## Chart.js inside hidden tab contexts

**Chart.js fails silently when the canvas has zero height.** A canvas inside an inactive tab has no rendered dimensions, which causes Chart.js to either render to a tiny size or appear blank when the tab is later activated.

**Fix patterns:**

1. **Activate-on-show initialization.** Move the chart's `mkChart()` call into a function that runs when the tab activates. Pattern:
   ```js
   window.showTab = function(name) {
     // ... activate the tab UI
     setTimeout(() => {
       if (name === 'strategy') initTrajectoryChart();
       if (name === 'orders')   initOrderCharts();
       // etc.
     }, 50);
   };
   ```
   The `setTimeout` allows the DOM to apply the active class and render dimensions before Chart.js measures.

2. **Inline SVG.** For static charts where interactivity is not required, use hand-built inline SVG. Always set `viewBox` and `max-width: 100%` so the chart scales responsively. Avoid fixed pixel widths.

3. **Default tab consideration.** If a critical chart is on a non-default tab, consider making that tab the default — or pre-render the chart in a hidden state and only animate it on show.

## Data sources used

| Source | What it covers |
|---|---|
| Shopify | Revenue, orders, sessions, CVR, AOV, returning customer rate, product-level performance |
| Klaviyo | Email/SMS sends, opens, clicks, placed orders, segment performance, flow performance |
| GA4 | Traffic sources, landing page performance, e-commerce overlay |
| Google Search Console | Impressions, clicks, average position, queries, page-level SEO performance |
| SE Ranking | Keyword position tracking, topical map development, competitor monitoring |
| Seal Subscriptions | Subscriber count, MRR, churn, subscription product mix |

When a metric appears in multiple sources, label which source is authoritative. Klaviyo's revenue attribution will not match Shopify's total revenue — they measure different things. Be explicit.

## Mobile responsiveness

All Green Llama dashboards are reviewed on mobile. The standard breakpoints:

- **900px (tablet).** KPI strips reduce column count. Pill grids reduce to 2-up.
- **680px (mobile).** Header stacks vertically. Tab nav becomes horizontally scrollable with `-webkit-overflow-scrolling: touch`. All grids collapse to single column. Tables wrap in horizontally scrollable containers. SVG charts scale via `max-width: 100%`.
- **400px (small mobile).** Further font scaling using `clamp()`. Tab buttons shrink to minimum readable size.

Test patterns:
- iPhone SE (375px width)
- iPhone 14 Pro (393px)
- iPad Mini (768px)
- iPad Air (820px)

## Security

**No live URLs without password protection.** The March 20, 2026 security incident underscored this. Live dashboards require authentication. Static HTML files committed to the client are acceptable for one-off sharing.

**No client data in shared filenames.** Filenames like `green-llama-dashboard.html` are fine. Avoid embedding revenue figures, internal IDs, or PII in filenames.

## Color palette

Green Llama dashboard colors follow the brand palette:

- Forest: `#163825`
- Deep green: `#1F4D34`
- Sage: `#3A7454`
- Moss: `#5A9B6E`
- Lime: `#8DC63F`
- Light lime: `#C5E1A5`
- Cream (background): `#F4EFE4`
- Warm white: `#FAFAF5`
- Gold (accent): `#C9A34A`
- Violet (accent): `#6B4ECC`
- Muted text: `#6B7280`
- Border: `#E5E0D8`
- Body text: `#1A1A1A`

Headings use Fraunces serif. Body uses Plus Jakarta Sans.

## Reference template

The French Broad Chocolates dashboard is the structural model. Multi-tab layout, KPI strip in the header, branded color treatment, mobile-responsive at all breakpoints.
