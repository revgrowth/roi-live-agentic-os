# Project Memory — Green Llama Clean

This file is the running record of context Claude has accumulated about Jason, ROI Live, Green Llama Clean, and the work. It replaces the per-conversation memory system from claude.ai. Treat it as authoritative for "what does Claude know about this account."

## Who's involved

### Jason Spencer (the user)

- Founder of **ROI Live**, a marketing agency
- Acts as fractional CMO for clients
- Prefers honest, direct communication over softened or hedged language
- Takes accountability when things go wrong; addresses client mistakes head-on rather than deflecting
- Has caught significant data integrity issues himself; expects the same vigilance from Claude
- Manages content production through a family member (a 23-year-old son who handles content for multiple clients)

### Green Llama Clean stakeholders

- **Kay Baker, MS, OTR/L** — CEO and founder. Occupational therapist by training. Bylined author on blog content. Cares deeply about scientific accuracy and brand integrity. Raised candid concerns about hallucinated AI citations during the March 20, 2026 strategy meeting.
- **Matthew Keasey, Ph.D.** — Scientific reviewer for blog content. Listed on bylines as reviewer.
- **Mike Peterknecht** — Technical stakeholder on Green Llama side. Raised the returning-customer-rate question during the March 20 dashboard walkthrough.
- **Beth Peterknecht** — Stakeholder.
- **K** — Senior Green Llama person who participates in strategy meetings. Suggested putting Jason's son on a call with the team to align on content quality.

### Jason's family member contributing to content

- Manages content for multiple clients
- No background in eco-friendly cleaning specifically
- Locked into a 4-articles-per-week cadence per the current agreement, which compresses quality control
- A potential alignment call with the Green Llama team has been offered to address content quality concerns

## What we're working on

The work spans three interconnected workstreams.

### Performance reporting and dashboards

A multi-tab HTML marketing performance dashboard for Green Llama. Pulls data from Shopify, Klaviyo, GA4, Google Search Console, SE Ranking, and Seal Subscriptions. Features include:

- Revenue projections and a five-scenario trajectory chart toward a $30K monthly revenue target
- SEO ROI modeling
- Subscription platform analysis (recommendation: SKIO over Seal)
- New vs. returning customer breakdowns
- Mobile-responsive layout (full overhaul completed)

The dashboard was taken offline mid-meeting on March 20, 2026 due to a security incident. A static HTML file was committed to the client.

**Reference template model:** French Broad Chocolates dashboard.

### SEO content and topical clusters

A topical authority strategy centered on the **"non toxic cleaning products"** cluster. Site has reached #3 historically; March 2026 Google core update exposed cluster gaps and dropped the ranking. Recovery strategy involves filling six specific intent gaps:

1. Definitional intent ("what does non-toxic actually mean")
2. Skeptic intent ("do non-toxic products actually work")
3. Audience-specific intent (allergies/asthma)
4. Transition intent (how to switch)
5. Room-by-room buyer intent
6. Freshness signal (2026 buyer's guide replacing the 2025 version)

Six articles have been fully drafted following the blog SOP. Recommended publish order: 1 → 6 → 2 → 3 → 4 → 5, spaced 5–7 days apart.

**Pillar article:** "Non-Toxic Cleaning Products: The Ultimate Guide for a Healthy Home" at `/blogs/news/non-toxic-cleaning-products-the-ultimate-guide-for-a-healthy-home`

**Target outcome:** Back into top 5 within 60–90 days of publishing and interlinking the six articles.

### Email/SMS marketing strategy (Klaviyo)

The campaign strategy is performance-adjusted based on March/April 2026 data.

**Key finding:** Click rate is the bottleneck. Open rates run 30–37%, click rates run 0.5–0.7%, but placed order rate is "Excellent" per Klaviyo benchmarks. The fix is structural — every email leads with above-the-fold CTA, triple-CTA structure, clickable product imagery, dynamic content blocks, image-blocking-resistant CTA, and 44px minimum tap targets.

**May/June 2026 plan:** 33 emails, 11 SMS. Mother's Day launches April 27 (not May 4) for proper gift-purchase runway. Memorial Day weekend bundle sale May 23–25. Father's Day June 21. Subscription conversion is the strategic priority for June.

**Revenue projections:** Conservative floor (CTA fix only) ~$3,500/mo. Full implementation target ~$5,100/mo. That's a 132% increase in campaign-attributed revenue over March's $2,247 baseline.

**New components:** Gift recipient acquisition flow (4-email sequence converting gift recipients into self-purchasers), campaign-to-flow coordination during holiday windows, predictive analytics overlay using Klaviyo's CLV/next-order-date/churn-risk fields.

## Established conventions

### Dashboard

- **Tilde (`~`) prefix** on derived figures
- **Asterisk (`*`)** on MER figures with a footnote noting their scope
- Shopify YoY comparisons must be confirmed as true year-over-year (Shopify defaults to period-over-period, which inflated metrics significantly until caught and corrected)
- Chart.js is unreliable in hidden tab contexts — initialize charts only when the tab activates, or use inline SVG

### Blog content

- Byline: **Kay Baker, MS, OTR/L** as author, **Matthew Keasey, Ph.D.** as reviewer
- BLUF (Bottom Line Up Front) opening structured as a featured snippet candidate
- E-E-A-T compliance throughout
- No fabricated statistics — flag with `[STAT NEEDED]`
- Tier 1 sourcing with real, verifiable URLs
- Fragrance-free positioning on product mentions
- No liquid product mentions for hard-surface formulations
- Voice: direct, varied sentence length, no adverbs, no em-dashes
- Internal links threading the topical cluster (typical article carries ~10–14 internal links)

### Communication conventions

- Direct, candid emails — no fluff, no hedging
- Action items assigned by name with dates
- Data points always anchored to source
- When mistakes happen (data errors, hallucinated citations), own them in writing without excessive self-flagellation
- Internal tactics (CTR gap work in particular) are not surfaced in client-facing strategy

## Tools and platforms in use

| Category | Tools |
|---|---|
| Analytics & reporting | Shopify, Google Analytics 4, Google Search Console, Klaviyo, SE Ranking, Seal Subscriptions |
| SEO | SEranking.com for keyword position tracking and topical map development |
| Dashboard | Custom HTML/inline SVG dashboards |
| Security/fraud | Cloudflare, Turnstile, Signifyd (recommended stack for bot/fraud mitigation) |
| Subscription platform | Currently Seal; evaluating SKIO migration |

## Active concerns and lessons

### Data integrity is non-negotiable

Jason caught a significant dashboard error where YoY percentages were pulled from period-over-period comparison columns rather than true same-period comparisons, inflating metrics substantially (some by hundreds of percent). All figures were corrected and the sourcing convention (tilde on derived figures, asterisk on MER) was established.

### Hallucinated citations are a client trust issue

The Green Llama content quality incident on March 20, 2026 — Kay raised the issue directly during the strategy meeting — shaped the strict `[STAT NEEDED]` flagging protocol and Tier 1 sourcing requirements now embedded in the blog SOP. This is the most consequential lesson on the account so far.

### Topical cluster vulnerability

SEO ranking drops during core updates often signal gaps in **definitional**, **skeptic-intent**, and **transition-intent** content within a cluster — not just pillar article quality. The six-article fill is built around this insight.

### Direct communication under pressure works

Jason's preference for addressing difficult client feedback head-on — including the candid response email after the March 20 meeting — is the working pattern for handling future issues.

### Internal CTR strategy stays internal

Click-through-rate gap work is handled internally, not surfaced in client-facing strategy sections. Keep the line clear when producing client deliverables.

## Reference materials in this package

- All people files: `03-knowledge-base/about-*.md`
- Brand voice: `03-knowledge-base/Green_Llama_Brand_Voice.md` and `green-llama-voice-system.md`
- Topical clusters: `03-knowledge-base/Green_Llama_Clean__Topical_Keyword_Map___Clusters.md`, `Green_Llama_Clean_Blog__Topical_Map_Cluster_Analysis__2_3_26_.md`, `Green_Llama_Blog_Articles__Topical_Map__Clusters.pdf`
- SEO methodology: `03-knowledge-base/Master_SEO___AEO_AI_Agent_Training_Manual.md`, `ROI_LIVE_MASTER_SEO___AEO_AI_AGENT_TRAINING_MANUAL.md`, `ROI_LIVE__High-Level_SEO_SOP__2025__.md`
- Entity/AEO methodology: `03-knowledge-base/Entity_SEO___Casey_Keith_s_Complete_Methodology___AI_Writer_Guidelines.md`, `Entity_SEO_Strategy__Dominating__Eco-Friendly_Laundry_Detergent_.md`, `AEO_LLM_SEO__Matt_Diggity_.md`, `Matt_Diggity_-_BERT.md`
- Pillar article reference: `03-knowledge-base/Pillar_Article__The_Performance_Lab__The_Science_of_Sustainable_Cleaning.md`
- Interlinking: `03-knowledge-base/INTERLINKING_GUIDE_-_How_to_Add_Cross-Links_to_Conclusions.md`
- Scientific source bank: `03-knowledge-base/Green_Llama_Clean_-_Scientific_Sources.md`
- Past campaign strategy: `03-knowledge-base/February___March_2026_Campaign_Strategy.md`
- Client review/customer voice corpus: `03-knowledge-base/Green_Llama_Clean_-_Client_Hub.md`
- Reference framework: `03-knowledge-base/The_SEO_Framework_I_Used_to_Scale_70__Franchise_Locations.md`
