# Project History — Green Llama Clean

A chronological record of major work done on the Green Llama Clean account through this project. Use this as a reference for "what's been built, what's been delivered, what's been decided."

## Timeline at a glance

| Date | Milestone |
|---|---|
| Feb 3, 2026 | Topical map and cluster analysis completed |
| Feb–Mar 2026 | February/March campaign strategy executed |
| Mar 20, 2026 | Strategy meeting with Kay, K, and Mike. Dashboard taken offline mid-meeting due to security incident. Kay raised content quality concerns. |
| Mar 20, 2026 | Follow-up email sent addressing meeting recap, dashboard security, and content quality feedback |
| Mar 24, 2026 | Dashboard rebuilt with corrected YoY math, mobile-responsive overhaul, revenue trajectory chart added, static HTML committed to client |
| Apr 2, 2026 | SEO topical cluster strategy delivered: six articles to fill intent gaps in the "non toxic cleaning products" cluster |
| Apr 2, 2026 | All six articles fully drafted following the blog SOP |
| Apr 14, 2026 | May/June 2026 Klaviyo campaign strategy v1 delivered |
| Apr 15, 2026 | May/June strategy v2 delivered with structural additions and rebuilt to Jason's voice |

## Detailed history by workstream

### Performance reporting and dashboard

**Initial build.** A multi-tab HTML marketing performance dashboard was built for Green Llama. Tabs included Overview, March Live, Email, Orders, SEO, Strategy. Data sources: Shopify, Klaviyo, GA4, Google Search Console, SE Ranking, Seal Subscriptions. Reference template: French Broad Chocolates dashboard.

**The data integrity correction.** During the March 20, 2026 meeting, Mike raised a question about the returning customer rate figures. Inspection revealed that Shopify's analytics dashboard had been read incorrectly — the "comparison" column shown by default is period-over-period, not year-over-year. Several metrics (revenue, orders, sessions, returning customer rate) were showing inflated YoY percentages that were actually period-over-period.

The corrected figures (YTD Jan 1–Mar 19, 2026 vs. same period 2025):

| Metric | 2025 | 2026 | Corrected YoY |
|---|---|---|---|
| Total Revenue | $14,643 | $29,969 | +105% |
| Gross Sales | $14,508 | $31,228 | +115% |
| Orders | 373 | 782 | +110% |
| Sessions | 12,798 | 27,945 | +118% |
| CVR | 2.09% | 1.78% | −15% (was showing +3%) |
| AOV | $37.32 | $36.68 | −2% (was showing +7%) |
| Returning Customer Rate | 35.75% | 42.32% | +18% |

**The new vs. returning customer breakdown.** A new section was added to the March Live tab showing real data (not estimates):

- New customer acquisition: 209 → 467 customers, +123% YoY YTD
- New customer revenue: $8,518 → $19,631, +130%
- New customer AOV: $44.74
- Returning customer AOV: $38.91 (lower than new — atypical pattern indicating untapped returning-customer upsell opportunity)

**The security incident.** During the March 20 meeting, an unspecified security concern caused Jason to take the dashboard offline mid-call. He committed on the call to sending a static HTML version. The static HTML file was committed and provided. Future iterations include password protection before sharing live links.

**Mobile responsive overhaul.** Three breakpoints implemented:
- 900px: KPI strip 7→4 columns; pill grids 4→2; reduced padding
- 680px: Header stacks vertically; KPI strip 2 columns; tab nav horizontally scrollable with touch momentum; all grids collapse to single column; tables wrap with horizontal scroll; SVG charts scale via max-width:100%
- 400px: Further font scaling via `clamp()`; tab buttons shrink to minimum readable size

**Revenue trajectory chart.** Five-scenario chart added to the strategy tab showing the path to $30K monthly revenue: organic only, +email/AOV, +paid ads, +subscriptions, +SKIO/retention. With all levers stacked, $30K is reachable in roughly 12–14 months. Without intervention, the target is reached in mid-to-late 2027.

### SEO content and topical clusters

**Topical map.** The full topical map and keyword cluster analysis was delivered Feb 3, 2026, identifying 21 articles in the Natural Cleaning Products cluster anchored by the pillar `/blogs/news/non-toxic-cleaning-products-the-ultimate-guide-for-a-healthy-home`.

**The Google March 2026 core update drop.** The site had reached #3 for "non toxic cleaning products" before the core update. Post-update, ranking dropped to #13, then began recovery. Analysis attributed the drop to four unaddressed search intents: definitional, skeptic, audience-specific (allergies/asthma), and transition.

**The six-article fill.** A six-article cluster expansion was scoped to fill the gaps:

| # | Title | Target Keywords | Word Count |
|---|-------|----------------|------------|
| 1 | What "Non-Toxic" Actually Means on a Cleaning Product Label (And What It Doesn't) | what does non toxic mean, non toxic cleaning products definition | ~2,120 |
| 2 | Do Non-Toxic Cleaning Products Actually Work? | do non toxic cleaning products work | ~2,082 |
| 3 | Non-Toxic Cleaning Products for Every Room | non toxic cleaning products by room | ~2,425 |
| 4 | How to Switch to Non-Toxic Cleaning Products Without Wasting What You Have | how to switch to non toxic cleaning products | ~2,073 |
| 5 | Non-Toxic Cleaning Products for Allergy and Asthma Sufferers | cleaning products safe for asthma | ~2,297 |
| 6 | The 2026 Guide to Non-Toxic Cleaning Products: What's Changed and What to Buy Now | best non toxic cleaning products 2026 | ~2,330 |

Total: ~13,300 words of original cluster content. Approximately 65 internal links across the six pieces. All articles bylined "Kay Baker MS, OTR/L | Reviewed by Matthew Keasey, Ph.D." and follow the blog SOP.

**Recommended publish order:** 1 → 6 → 2 → 3 → 4 → 5, spaced 5–7 days apart.

**Each article carries flagged review items** for Kay or Matt — citation gaps, EPA report verifications, surface-specific guidance to confirm, pricing to verify before publish.

**Cross-cluster link funneling.** The "Complete Guide to Non-Toxic Surface Cleaners" cluster (published 3/3/26 with three supporting articles) was identified as a separate but topically related cluster. Each of those four articles was scoped to receive a link back to the "Non-Toxic Cleaning Products: Ultimate Guide" pillar to funnel authority.

**Internal anchor text refresh.** At least 8 existing internal links to the pillar using generic anchors ("click here," "our guide") were scoped for replacement with exact-match or close-variant anchors.

### Email/SMS marketing strategy (Klaviyo)

**February/March 2026 strategy** was the prior reference. See `03-knowledge-base/February___March_2026_Campaign_Strategy.md`.

**March/April 2026 performance.** 30-day rolling metrics as of April 14, 2026:

| Metric | March | April |
|---|---|---|
| Open Rate | ~30.5% | ~36.8% |
| Click Rate | 0.60% | 0.69% |
| Placed Order Rate | — | 0.19% (Excellent) |
| Revenue/Recipient | — | $0.07 |
| Campaign Revenue | $2,247.79 | $1,198.16 (partial month, pacing above) |

**Diagnostic finding:** Click rate is the bottleneck. Opens and conversions are strong; clicks are weak.

**May/June 2026 v1 strategy.** Initial draft. 28 emails, 9 SMS. Click rate architecture (above-the-fold CTA, triple CTA, clickable product imagery) baked into every send. Performance-adjusted KPI targets.

**May/June 2026 v2 strategy.** Rebuilt with structural additions:
- Mother's Day launch moved from May 4 to April 27 for proper gift-purchase runway
- Memorial Day weekend bundle sale added (May 23–25)
- Dedicated last-minute gift card emails for Mother's Day (May 9) and Father's Day (June 20)
- Gift recipient acquisition flow (4-email sequence)
- Campaign-to-flow coordination during holiday windows
- Predictive analytics overlay (CLV, next order date, churn risk)
- Annotated email design template embedded as full-page image with 12 numbered callouts
- Total volume: 33 emails, 11 SMS
- Revenue projections: $2,200/mo → $5,100/mo (+132%)

**Win-back insights.** April's Lap Re-engage email hit $34.49 RPR vs. campaign average $0.07 (492x productivity per recipient). Win-back gets disproportionate share of segment-targeted sends in May/June.

### Client communication artifacts

**March 20, 2026 follow-up email.** Comprehensive recap of the strategy meeting addressing:
- Dashboard walkthrough and metrics
- Bot/international traffic and CVR distortion
- Path to $30K with all five levers
- Bundling UI updates
- Skio vs. Seal evaluation
- Dashboard security and offline status
- Kay's content quality feedback (addressed directly, transparently, with concrete commitments)

Action items assigned by name and tracked.

**Dashboard correction email (March 24, 2026).** Sent after the dashboard rebuild. Explained the YoY/PoP error transparently, presented corrected figures, and added the new vs. returning customer breakdown with the strategic insight on AOV.

### People and account context files

A set of reference files about Kay, Matthew, Mike, and Beth was authored to keep stakeholder context available in any conversation. These are in `03-knowledge-base/about-*.md`.

## Cross-cutting decisions

**The blog SOP became a living document.** The `[STAT NEEDED]` flagging protocol, Tier 1 sourcing requirements, and fragrance-free / no-liquid-product constraints were added in response to specific incidents and feedback.

**Dashboard sourcing convention was formalized.** Tilde for derived figures, asterisk for MER with footnote.

**Internal vs. client-facing strategy was separated.** CTR gap work stays internal.

**Chart.js was deemed unreliable in hidden tab contexts.** Inline SVG or activate-on-show initialization is the working pattern.
