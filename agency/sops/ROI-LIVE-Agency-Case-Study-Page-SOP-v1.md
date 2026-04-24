# ROI.LIVE Agency Case Study Page SOP
**Version:** 1.0 — April 2026
**Applies to:** Every case study page produced or managed on a client website by ROI.LIVE
**Owner:** Jason Spencer, Founder — ROI.LIVE
**Inherits from:** ROI.LIVE Agency Core Standards v1.1

> This SOP specifies the rules unique to case study pages on client websites. A case study page documents a past engagement with the client's customer, showing the challenge, approach, and quantified results. It is the highest-concentration Experience signal on any client site. Rules not specified here fall back to the Agency Core Standards base document.

---

## TABLE OF CONTENTS

1. Case Study Intent & Definition
2. Case Study Classes
3. Pre-Build Research & Permissions
4. URL, Title & Metadata Architecture
5. Case Study Structure (The Narrative Arc)
6. Section Composition
7. Word Count & Attribution Placement
8. Case Study Schema
9. Results Documentation Standards
10. Client Identification & Permission Protocol
11. Data Visualization Requirements
12. Trust Signals on Case Study Pages
13. Case Study Design System
14. Internal Linking & llms.txt Integration
15. Content Freshness (Case Study Specific)
16. QA Verification Checklist

---

## Phase 1 — Case Study Intent & Definition

### 1.1 What a Case Study Is
A case study page documents a specific past engagement between the client and one of their customers. It tells the story of a challenge, the approach the client took, and the quantified results produced. It serves buyers in the commercial investigation stage who need proof that the client can deliver similar outcomes for them.

### 1.2 What a Case Study Is Not
- A testimonial collection (testimonials are quotes; case studies are narratives)
- A service page (service pages sell future engagements; case studies prove past outcomes)
- A product page (products ship; case studies document results of using or implementing something)
- A blog article (blog articles educate; case studies prove)
- A sales deck (sales decks are for a specific reader in a specific sales motion; case studies are public-facing evergreen content)

### 1.3 Primary Case Study Goals
1. Prove the client can deliver specific quantified outcomes for specific customer types
2. Build Experience and Trust signals that rank for commercial investigation keywords
3. Get cited by AI answer engines for queries like "who gets results for [customer type]" and "examples of [service or product] outcomes"
4. Feed the highest-trust social proof into the buyer's decision on service pages, homepage, and sales conversations
5. Support referral and word-of-mouth by giving past customers a proud asset to share

### 1.4 E-E-A-T Emphasis on Case Studies
Per Core Standards Phase 4, case study pages carry E-E-A-T with distribution heavy on **Experience** and **Trust**:
- **Experience:** the dominant signal — case studies are Experience content. First-hand account of real work with real customers and real outcomes.
- **Trust:** quantified verifiable results, named customers with permission, dated engagements, transparent methodology, third-party verification where possible
- **Authoritativeness:** notable customer brands, industry recognition of the work, press mentions of the outcomes
- **Expertise:** methodology transparency, named frameworks, credentialed experts involved

### 1.5 Case Study as Information Gain Anchor
Case studies are pure information gain by definition. The specific customer, specific engagement details, specific results, and specific methodology are all proprietary content competitors cannot replicate. Every case study page automatically satisfies the Core Standards Phase 5 information gain requirement because the content itself is information gain.

---

## Phase 2 — Case Study Classes

Every case study is one of three classes:

### 2.1 Full Case Study
Default class. Complete narrative arc with challenge, approach, results, timeline, client quote, and visual assets. Word count 1,500–2,500 words. Gets a dedicated page with full schema and editorial treatment.

### 2.2 Mini Case Study
A condensed version for clients with shorter engagements or limited data. Covers the same narrative arc but each section is shorter. Word count 600–1,200 words. Used when the engagement was brief, the data is limited, or the client is stacking many case studies quickly.

### 2.3 Results Card / Featured Outcome
A single-outcome proof card, not a standalone page. Lives embedded in service pages, the homepage, or a results roundup page. Word count: minimal body (50–150 words). Includes one statistic, one customer reference, and one quote. Not a substitute for a full case study — a complement to it.

This SOP covers Full Case Study and Mini Case Study as standalone pages. Results Cards follow the embedded proof conventions in the Service Page SOP (Doc 3 Phase 6.4).

---

## Phase 3 — Pre-Build Research & Permissions

Complete before writing a single word. Client permission is a blocker — no case study builds without written permission from the customer.

### 3.1 Customer Engagement Confirmation
- Confirm the customer's full company name (or descriptive anonymous framing if permission is limited)
- Confirm the customer's industry and size (employees, revenue tier, locations)
- Confirm the engagement start date and end date (or "ongoing")
- Confirm the services or products involved in the engagement
- Confirm the scope of work delivered

### 3.2 Written Permission from the Customer
No case study publishes without written permission. Required elements:

- Permission to use the customer's name, logo, and representatives' names
- Approval of all direct quotes before publication
- Approval of all results data before publication
- Approval of the final case study draft before publication
- Clarification on long-term use (evergreen vs time-bounded, right to pull from distribution)

A case study release form template lives in the agency operations folder. Every case study engagement starts by sending this form to the customer contact.

If the customer cannot provide full permission, consider anonymized case study treatment per Phase 10.2.

### 3.3 Data Collection from the Client
Before drafting, collect from the client (or directly from the customer's analytics with permission):

- Baseline metrics (starting state before the engagement)
- Outcome metrics (current or end-of-engagement state)
- Timeframe over which the change occurred
- Attribution methodology (how the results were measured, what tools tracked them)
- Any third-party verification available (Google Analytics screenshots, review platform ratings, sales reports, etc.)

### 3.4 Interview the Customer (Where Permitted)
The strongest case studies include first-hand quotes from the customer. Conduct a 20–30 minute interview covering:

- The situation before the engagement began (the pain, the trigger event, the deciding moment)
- Why they chose the client over alternatives
- What surprised them during the engagement
- What results matter to their business (in their words, not marketing words)
- Who they would recommend the client's service or product to

Record the interview with permission. Transcribe. Pull 3–5 quote-worthy passages.

### 3.5 Keyword Research
Case studies can rank for:
- Client name + service + "case study" or "results"
- Customer industry + "case study" (e.g., "HVAC SEO case study," "Shopify conversion case study")
- Outcome-specific queries ("how to increase leads for HVAC contractors")

Primary keyword selection per Core Standards Phase 9 methodology. Target 3–5 semantic variant keywords with verified volume.

### 3.6 SERP Intent Validation
Per Core Standards Phase 9.5:
- Pull the current top 10 organic results for the primary keyword
- Confirm case study content ranks for the query (if roundup blog articles dominate, the keyword may fit a blog article better)
- Check for AI Overview citations on case-study-related queries
- Check for People Also Ask questions that map to FAQ content
- Document findings in the case study brief

### 3.7 Visual Asset Gathering
Before the case study builds:
- Customer logo (high-res, with permission to display)
- Representative headshot (for the quote attribution)
- Before/after screenshots or images (where relevant)
- Data visualization source data (for chart creation)
- Process imagery (team at work, deliverables, workspace shots) where available

---

## Phase 4 — URL, Title & Metadata Architecture

### 4.1 URL Slug
- Format: `/case-studies/[customer-slug]` or `/work/[customer-slug]` per client CMS
- Customer name as slug when named, or descriptive slug when anonymized ("regional-hvac-12-locations")
- Lowercase, hyphens between words
- Avoid SKU-style codes in the slug

### 4.2 Title Tag
- Format: `[Customer Name] Case Study: [Headline Result] | [Client Brand]`
- Or: `[Industry] Case Study: [Headline Result] | [Client Brand]` (for anonymized cases)
- Target length 50–60 characters
- Lead with the identity or industry, followed by the headline result
- Example: `CCC Case Study: 60% CPL Reduction in 90 Days | ROI.LIVE`

### 4.3 Meta Description
- 140–160 characters
- Customer name or industry in first 20 words
- Headline quantified result in the description
- Implied promise of similar outcome for the reader ("See how [client] helped [customer] achieve [result]")
- Functions as an AI micro-answer per Core Standards Phase 7.6

### 4.4 H1
- Descriptive, outcome-led
- Example: `How CCC Reduced Cost-Per-Lead by 60% in 90 Days`
- Or: `How a Regional HVAC Contractor Cut Cost-Per-Lead 60% Across 12 Locations`
- H1 makes the value of reading the case study obvious

### 4.5 H2 and H3 Rules
- Minimum 4 H2s matching the narrative arc: Challenge, Approach, Results, What's Next
- H3s within Results subsections name specific metrics (e.g., "Cost Per Lead," "Revenue Per Session," "Response Time")
- Headings read as narrative signposts, not generic labels ("Results" is acceptable; "The Outcome" is better; "60% CPL Reduction Across 12 Locations" is best)

---

## Phase 5 — Case Study Structure (The Narrative Arc)

Every case study follows this narrative spine. Design tokens vary per client. Structure does not.

```
<head>
  ├── Title tag (customer + headline result + brand)
  ├── Meta description (customer + result + implied promise)
  ├── Canonical URL (absolute)
  ├── OG tags: og:type="article", title, description, URL, image (hero image or customer logo composition), site_name
  ├── Twitter Card tags (summary_large_image)
  ├── CreativeWork or Article JSON-LD (with speakable)
  ├── BreadcrumbList JSON-LD
  ├── FAQPage JSON-LD (when FAQ block present)
  └── Client-specified fonts

<body>
  ├── Navigation (client's standard nav)
  ├── Breadcrumb Bar (Home → Case Studies → Customer Name)
  ├── Hero Section
  │    ├── Customer logo (or industry descriptor for anonymized)
  │    ├── H1 with headline outcome
  │    ├── Sub-headline with engagement scope and duration
  │    ├── Customer industry, size, location summary
  │    └── Primary CTA ("Get Similar Results" linking to contact or service page)
  ├── Results Stats Strip (4 key quantified outcomes)
  ├── Challenge Section
  │    ├── Before state — the customer's pain, trigger event, deciding moment
  │    ├── Specific baseline metrics where available
  │    └── Quote from the customer describing the pain in their words
  ├── Approach Section
  │    ├── What the client did, step by step
  │    ├── Named methodology or framework where applicable
  │    ├── Timeline of the engagement
  │    └── Team and resources involved
  ├── Results Section
  │    ├── Quantified outcomes with baseline, end state, and timeframe for each metric
  │    ├── Data visualizations (charts, before/after, growth curves)
  │    ├── Third-party verification where available (screenshots, platform data)
  │    └── Secondary outcomes and qualitative wins
  ├── Customer Quote Section
  │    ├── Featured quote (2–4 sentences, specific not generic)
  │    ├── Customer representative name, title, and headshot
  │    └── Video quote where available (optional)
  ├── What's Next Section
  │    ├── Ongoing engagement status
  │    ├── Future plans or expansions
  │    └── Customer's forward-looking statement
  ├── Mid-Page CTA Block
  │    └── "Get similar results for your [customer industry]" with primary CTA
  ├── Key Takeaways / Lessons Section
  │    └── 3–5 bullet-point lessons other buyers can learn from this engagement
  ├── FAQ Section (4–6 Q&As specific to this engagement or industry)
  ├── Related Case Studies Section
  │    └── 3 cards linking to case studies from similar industries or with similar outcomes
  ├── Final CTA Block
  │    ├── Stakes-based headline
  │    ├── Primary CTA
  │    └── Secondary contact method
  └── Footer (client's standard footer)
```

### 5.1 CTA Cadence
Every case study carries minimum 3 CTA placements:
1. Hero primary CTA (above the fold)
2. Mid-page CTA block (after Results or Customer Quote section)
3. Final CTA block (after Key Takeaways or FAQ)

All CTAs route to the client's primary CTA URL from the Parameter Sheet, or to a specific service page when the case study fits a single service cleanly.

---

## Phase 6 — Section Composition

### 6.1 Hero Section
The hero delivers five things above the fold:
- Who the customer is (named or industry-descriptive)
- What engagement this covers (scope and duration)
- The headline quantified outcome
- The customer's industry, size, and location context
- A primary CTA for buyers who want similar outcomes

### 6.2 Results Stats Strip
4-stat strip below the hero showing the most compelling quantified outcomes:
- Each stat has a specific number with units
- Each stat includes a short label describing what is measured
- Each stat includes a timeframe or condition ("in 90 days," "across 12 locations")
- Example: "60% ↓ Cost Per Lead in 90 days"

Avoid vague stats. "Significant revenue growth" fails. "+ $847,000 revenue over 18 months" passes.

### 6.3 Challenge Section
Tells the before-state story. Components:
- The customer's situation and pain before the engagement
- The trigger event that brought them to the client
- Specific baseline metrics where available (current cost per lead, current conversion rate, current revenue)
- What they tried before and why it did not work
- A 1–2 sentence customer quote describing the pain in their voice (where available)

The Challenge section is an E-E-A-T Trust signal. Specificity about the starting state makes the results claims credible.

### 6.4 Approach Section
Tells the during-state story. Components:
- What the client did, organized as a numbered or stepped narrative
- Named methodology or framework where applicable (ties into the client's service page content)
- Timeline showing when each phase happened
- Team members or resources involved
- Deliverables produced during the engagement

This section doubles as service-page-adjacent content. Readers who find this case study may click into the service page to learn more about the methodology.

### 6.5 Results Section
The core of the case study. Requirements:
- Quantified outcomes with baseline, end state, and timeframe for each
- Data visualizations (charts, graphs, before/after comparisons)
- Secondary metrics that complement the headline outcome
- Qualitative outcomes where they matter (team morale, customer confidence, strategic positioning)
- Third-party verification where possible (Google Analytics screenshots with client permission, platform ratings, sales dashboards)

See Phase 9 for results documentation standards and Phase 11 for data visualization requirements.

### 6.6 Customer Quote Section
The featured quote sits in a distinct visual treatment (pull quote, quote card, large typography). Requirements:
- 2–4 sentences
- Specific to the engagement, not generic praise
- Names a tangible outcome, moment, or feeling the customer experienced
- Attribution: customer representative's name, title, and company
- Headshot where permission allows
- Video version where available (optional)

Example of specific quote: "We went into this expecting a refreshed website. What we got was a completely different way of thinking about lead generation. The cost per lead drop was fast. The way the sales team started talking about qualified leads changed everything."

Example of generic quote (avoid): "Great to work with. Highly recommend."

### 6.7 What's Next Section
Shows the forward-looking state. Components:
- Whether the engagement is ongoing or completed
- What the customer is planning next
- New capabilities, growth plans, or expansions
- The customer's forward-looking confidence statement

This section signals that the results were not a one-time spike but the start of sustained improvement.

### 6.8 Key Takeaways / Lessons Section
3–5 bullet-point lessons other buyers can learn from this engagement. Each lesson:
- Named and stated as a principle (e.g., "Lesson: Cost-per-lead improvements compound when the landing page and the ad align")
- 1–2 sentences of explanation
- Transfers to other buyers in similar situations

This section increases case study shareability and search ranking for broader lesson-based queries.

### 6.9 FAQ Section
4–6 Q&As specific to this engagement or to similar buyer situations. Examples:
- "How long did it take to see results?"
- "What's different about this approach compared to what [industry] typically does?"
- "Is this approach right for a smaller or larger business?"
- "What budget range did this engagement require?"
- "What did the customer have to commit to internally for this to work?"

Each answer 2–5 sentences, specific to this engagement or to the client's general methodology. Matches FAQPage JSON-LD one-to-one.

### 6.10 Related Case Studies Section
3 cards linking to other case studies with similar industries, similar outcomes, or similar scope. Each card:
- Customer name or descriptive framing
- Headline result
- Industry tag
- Arrow CTA linking to the full case study

---

## Phase 7 — Word Count & Attribution Placement

### 7.1 Word Count Targets
- Full case study: 1,500–2,500 words
- Mini case study: 600–1,200 words

### 7.2 Primary Keyword Placement (Required)
- Title tag (first position)
- H1
- Meta description (first 20 words)
- First 100 words of body content
- At least 2 H2 headings
- Within the FAQ section where relevant

### 7.3 Brand Name (Client) Placement
Calibrated to 1 instance per 120–140 words per Core Standards Phase 3.2. For a 2,000-word case study, target 14–17 client brand mentions. First instance in the first sentence of body content. Bolded on every body-prose instance.

### 7.4 Customer Name Placement
The customer's name carries its own entity weight throughout the case study. Customer name appears:
- H1 or sub-headline (per naming convention)
- Results Stats Strip
- Challenge section (establishing the baseline)
- Customer Quote attribution
- What's Next section
- Naturally throughout body copy (not at a fixed density, but present enough to reinforce the entity)

### 7.5 Named Expert Attribution
Where the engagement was led by a specific named expert on the client's team (e.g., Jason Spencer leading an SEO engagement), attribute the expert throughout:
- Approach section (who led the work)
- Methodology section (who designed the framework)
- Byline or "Led by" attribution on the page

Expert attribution target: 3–6 mentions on a full case study. Each mention with credentials per Core Standards Phase 3.3.

### 7.6 Quote Density
Case studies benefit from multiple customer voice moments:
- Featured quote in Customer Quote section (2–4 sentences)
- 1–2 shorter pull quotes distributed through Challenge, Approach, or Results sections
- Optional: team member quotes from the customer's side beyond the primary contact

Total customer quote count: 3–5 distinct quoted moments per full case study. Every quote attributed to a named person with permission.

---

## Phase 8 — Case Study Schema

Inherits Core Standards Phase 12. Case study schema options:

### 8.1 Primary Schema Type: CreativeWork or Article
Two acceptable patterns. Select per client and per case study substance:

**Pattern A — CreativeWork (preferred for documented engagements):**
- `@type: CreativeWork` or more specific subtypes like `Report`
- Positions the case study as an original work documenting an engagement
- Includes fields for author (the client), about (the customer and topic), and mentions (entities discussed)

**Pattern B — Article (acceptable for narrative-style case studies):**
- `@type: Article` (or `ReportageNewsArticle` for heavy data-driven case studies)
- Treats the case study as editorial content with an author and publisher
- Includes speakable, mainEntityOfPage, image, author, publisher

### 8.2 Required CreativeWork / Article Fields
- `@context`
- `@type` (CreativeWork or Article)
- `headline` (matches H1)
- `description` (matches meta description)
- `url` (canonical URL)
- `datePublished`, `dateModified`
- `mainEntityOfPage` (references the page URL)
- `image` (hero image URL)
- `author` (references Person `@id` from Parameter Sheet — the named expert who led the engagement, or the Organization `@id` when no individual expert is named)
- `publisher` (references Organization `@id`)
- `about` (the primary entity — the customer, the industry, or the methodology covered)
- `mentions` (4–8 specific entities: customer name, industry terms, methodology names, specific tools or platforms)
- `speakable` (cssSelector array: `.page-intro`, `.customer-quote-body`, or the case study's analog CSS classes)

### 8.3 BreadcrumbList JSON-LD (Required)
Matches visible breadcrumb. Typical hierarchy: Home → Case Studies → Customer Name.

### 8.4 FAQPage JSON-LD
When the FAQ section is present, matches visible FAQ one-to-one.

### 8.5 Customer Organization Reference
When the customer is named and permission covers it, reference the customer's Organization in the `about` or `mentions` field:

```json
"about": {
  "@type": "Organization",
  "name": "Customer Company Name",
  "url": "https://customercompany.com"
}
```

This creates an entity link between the case study and the customer's brand entity, which strengthens authority signal interpretation.

### 8.6 Forbidden Patterns
- Omitting `author` or `publisher` (case studies need clear attribution)
- Using `@type: Review` for case studies (Review schema is for product or service reviews, not case studies)
- Fabricating `datePublished` to make the case study appear fresher than it is
- Copying `mentions` arrays from other case studies

---

## Phase 9 — Results Documentation Standards

Case studies live or die on the credibility of the results. Sloppy results documentation undermines every other element of the page.

### 9.1 Required Elements for Every Quantified Claim
Every stat, percentage, or outcome claim must include:
- **Baseline:** the starting state before the engagement (not just "we increased revenue 40%" — "we increased revenue from $X to $Y, a 40% increase")
- **End state:** the ending state or current state
- **Timeframe:** the period over which the change occurred
- **Attribution methodology:** how the result was measured, what tool or system tracked it

Missing any of these elements makes the claim unverifiable and undermines Trust.

### 9.2 Units and Precision
- Use specific numbers, not rounded approximations ("41%" beats "around 40%")
- Use consistent units across comparable stats (all monthly or all annualized, not mixed)
- Use the customer's preferred metrics where they differ from industry-standard naming (CPL vs CPA vs CAC)
- Label every number with what it measures (not "$150,000" alone — "$150,000 in new monthly revenue")

### 9.3 Third-Party Verification
Include third-party verification where the customer permits:
- Google Analytics screenshots with timestamped date ranges
- Google Search Console rankings data
- Third-party review platform ratings and counts
- Sales CRM dashboards (anonymized if needed)
- Press mentions or awards that cite the outcomes
- Customer's own public reporting where applicable

Third-party verification shifts the case study from "client's claim" to "documented reality."

### 9.4 Honesty About Mixed or Partial Outcomes
When the engagement produced strong outcomes in some areas and weaker outcomes in others, the case study documents both. A case study that reports "42% increase in leads, no change in conversion rate" is more credible than one that only highlights the win.

Mixed outcomes also provide useful signal to prospective buyers with similar challenges and help the case study avoid appearing manufactured.

### 9.5 Attribution Honesty
When outcomes resulted from multiple factors beyond the client's engagement, acknowledge them:
- "Seasonal demand contributed to Q4 growth, but baseline conversion rate improvements persisted into Q1"
- "The customer also invested in paid media during this window; the organic lift is isolated as the specific figure below"

Attribution honesty builds Trust and makes the quantified claims more defensible.

### 9.6 Dated Results
Every case study's results are dated. The hero or Stats Strip includes an engagement date range. Stale case studies (results older than 3 years) carry a "Results from [Year]" notation or get refreshed per Phase 15.

---

## Phase 10 — Client Identification & Permission Protocol

### 10.1 Named Customer Case Studies (Preferred)
Named case studies carry the strongest Trust signal. Requirements:
- Customer's full company name
- Customer representative's full name and title
- Customer logo (displayed in hero, Related Case Studies cards, and footer proof sections where applicable)
- Written permission covering name, logo, and quotes
- Approval of the final case study before publication

### 10.2 Anonymized Case Studies (When Full Permission Is Limited)
When the customer cannot grant full naming permission, anonymized treatment:

**Descriptive framing replaces customer name:**
- "Regional HVAC Contractor, 12 Locations, Southeast US"
- "SaaS Platform, 40-Person Team, Series B Stage"
- "DTC Affirmation Brand, $2M Annual Revenue"

**Visual treatment:**
- Logo replaced with industry icon or abstract brand mark
- Representative's name replaced with role ("VP of Marketing," "Founder")
- Headshot optional — silhouette or initial avatar acceptable

**Quote attribution:**
- "— VP of Marketing, Regional HVAC Contractor"
- Or "— Founder, DTC Affirmation Brand"

Anonymized case studies still carry quantified results with full methodology. The anonymization only affects identifying details, not the substantive documentation.

### 10.3 Permission Scope Documentation
For every case study, document in the client's engagement log:
- Signed permission form with date
- Permitted use scope (website only, website + sales enablement, website + press, etc.)
- Time-bound or evergreen
- Right-to-withdraw terms
- Approval path for future edits

### 10.4 Withdrawn Permission Protocol
If a customer withdraws permission or the relationship ends in a way that makes continued publication inappropriate:
- 301 redirect the case study URL to the case studies index
- Remove references to the customer from Related Case Studies sections on other case studies
- Remove from llms.txt
- Remove from sitemap.xml
- Remove from homepage and service page proof sections
- Document the withdrawal in the client's engagement log

---

## Phase 11 — Data Visualization Requirements

Case studies with strong data visualization convert better and rank better than text-only case studies. Visualizations are Experience signals and information gain anchors.

### 11.1 Required Visualizations for Every Full Case Study
Minimum 2 custom visualizations per full case study. Options:

- **Line chart showing growth over time** (ranking, traffic, revenue, leads)
- **Before/after comparison** (side-by-side screenshots, split-screen before/after)
- **Bar chart for category comparison** (channels, campaigns, product lines)
- **Funnel diagram** (stage-by-stage conversion progression)
- **Timeline graphic** (engagement phases with duration and milestones)
- **Attribution waterfall** (how different factors contributed to the outcome)

Mini case studies carry 1 custom visualization at minimum.

### 11.2 Visualization Quality Standards
- Native SVG or high-resolution raster (PNG at 2x pixel density minimum)
- Brand-aligned colors from the client's design tokens (Parameter Sheet Section 5)
- Readable at mobile viewport widths
- Data sources labeled
- Axis labels and legends clear
- Date ranges explicit
- Alt text describes the visualization for accessibility (e.g., "Line chart showing organic traffic growth from 2,400 monthly sessions in January to 14,800 monthly sessions by October")

### 11.3 Before/After Screenshots
Screenshots of the customer's interface, analytics, or SERP position use:
- Matching date ranges clearly labeled
- Matching viewport sizes (not cropped or zoomed inconsistently)
- Consistent treatment (annotations, callouts, redactions) across the pair
- Timestamp or date annotation in the image where relevant

### 11.4 Third-Party Platform Screenshots
Screenshots from Google Analytics, Google Search Console, SE Ranking, DataForSEO, or other platforms include:
- Platform brand recognizable (the source is identifiable)
- Date ranges visible
- Redaction of sensitive data where needed (customer contact info, URLs of sensitive assets)
- Alt text describing what the screenshot shows

### 11.5 Interactive Visualizations (Optional)
Premium case studies may include interactive charts (Chart.js, D3, Recharts) where budget and platform support exists. Interactive visualizations must also degrade to static images for AI crawler accessibility per Core Standards Phase 7.4.

---

## Phase 12 — Trust Signals on Case Study Pages

Case studies are dense Trust content. Several signal categories apply.

### 12.1 Customer Identification
Named customers with logos displayed carry strongest Trust. Anonymized case studies with descriptive framing carry secondary Trust.

### 12.2 Quantified Results
Specific numbers beat vague claims. "$847,000 in new monthly revenue" outperforms "significant revenue growth."

### 12.3 Third-Party Verification
Screenshots, platform data, and independent sources move case studies from claims to documented reality.

### 12.4 Methodology Transparency
The Approach section describes what the client did. A case study that documents the work is more credible than one that only shows the outcome.

### 12.5 Customer Quote with Attribution
A named customer representative's quote with headshot and title is a high-weight Trust signal. Anonymous quotes ("a customer said") carry almost no weight.

### 12.6 Date Range and Timeline
Showing when the engagement happened and how long it took adds credibility. Timeless case studies ("we increased revenue by 40%" with no date) read as unverifiable.

### 12.7 Honest Mixed Outcomes
Acknowledging what did not work, where outcomes were partial, or where other factors contributed builds more Trust than presenting only unqualified wins.

### 12.8 Link to Customer's Public Site
Named case studies link to the customer's public website (with their permission). This links the client's brand entity to the customer's brand entity in Google's understanding.

### 12.9 Industry Recognition Badges
Awards, press mentions, or industry recognition related to the engagement display as badges with verification links where possible.

---

## Phase 13 — Case Study Design System

Design tokens per client documented in the Parameter Sheet. Agency-standard structural elements:

### 13.1 Required Design Elements
- Hero with customer logo, H1 with outcome, sub-headline, industry context, primary CTA
- Results Stats Strip (4 stats, treatment distinct from surrounding body)
- Clear visual separation between narrative sections (Challenge, Approach, Results, What's Next)
- Featured quote treatment (pull quote styling, large typography, accent color)
- Data visualizations with brand-aligned colors
- Before/after imagery with consistent treatment
- Related Case Studies grid (3 cards)
- Mid-page and final CTA blocks styled distinctly from surrounding content

### 13.2 Narrative Readability
Case studies are read, not skimmed. Typography supports sustained reading:
- Body font-size 17–19 px on desktop, 16–17 px on mobile
- Body line-height 1.7–1.9
- Comfortable column width (65–75 characters per line on desktop)
- Generous white space between sections

### 13.3 Visual Rhythm
Case studies benefit from a visual rhythm that breaks dense text:
- Every 200–300 words introduces a new visual element (pull quote, image, chart, callout box)
- Stats Strip appears above the fold
- Featured quote anchors the middle of the page
- Data visualizations punctuate the Results section

### 13.4 Mobile Considerations
Case studies convert on mobile through share traffic and sales enablement. Mobile requirements:
- Hero stacks cleanly with logo, H1, and CTA all visible without scrolling
- Stats Strip wraps 4-across to 2-across to 1-column
- Data visualizations render legibly at narrow viewport widths
- Featured quote treatment adapts to narrow viewport
- Sticky CTA bar at the bottom of the viewport for long case studies

---

## Phase 14 — Internal Linking & llms.txt Integration

Inherits Core Standards Phase 10. Case study-specific additions:

### 14.1 Inbound Links to the Case Study
Every new case study triggers an audit of site-wide link opportunities:
- Case Studies index page (required addition)
- Service page(s) matching the engagement type (each service page gets a Proof Section embed per Doc 3 Phase 6.4)
- Homepage featured case studies or proof section
- Blog articles covering topics the case study illustrates
- About page (for context on past work)
- Other case studies linking via Related Case Studies sections

### 14.2 Outbound Links From the Case Study
Every case study links to:
- At least 1 related service page (the service that produced these outcomes)
- At least 1 related blog article (educational context for the methodology)
- The customer's public website (named case studies, with permission)
- Contact page or booking page (primary CTA destination)
- Case Studies index (via breadcrumb)
- 3 related case studies (in the Related Case Studies section)

### 14.3 Anchor Text for Case Study Links
Descriptive and outcome-specific. Examples:
- "the 60% cost-per-lead reduction we helped CCC achieve"
- "the case study behind the 40% revenue lift"
- "how we approached the 12-location rollout"

### 14.4 llms.txt Integration (Required on Every Launch)
Per Core Standards Phase 7.2, every case study gets added to the client's `llms.txt` file under the Key Content section. Format:

```
- [Customer Name Case Study: Headline Result](https://clientsite.com/case-studies/slug): [One-sentence summary of engagement and outcome]
```

Case studies receive high priority in llms.txt because they are the highest-Trust content a brand publishes. AI answer engines asked "who delivers results for [customer type]" route to case studies before blog articles or service pages. Ensuring AI models can surface the client's case studies is a direct investment in AI search visibility.

Target: every named case study in llms.txt. Anonymized case studies included when they represent meaningful industry categories the client wants to be known for.

### 14.5 Case Studies Index Page
Every client site with 2+ case studies maintains a case studies index page at `/case-studies` (or client CMS equivalent). The index page:
- Lists all case studies as cards (customer logo, headline outcome, industry tag, CTA)
- Supports filtering by industry, service, or outcome type (where volume justifies)
- Is linked from main navigation
- Carries CollectionPage + ItemList schema similar to Doc 5 Phase 12

---

## Phase 15 — Content Freshness (Case Study Specific)

Inherits Core Standards Phase 15. Case study-specific additions:

### 15.1 Freshness Review Cadence
Case studies age differently than other content. Results are historical by definition. Still, several elements need maintenance.

- **Active-relationship case studies (ongoing engagements):** quarterly review to extend with new outcomes and updated data
- **Closed-relationship case studies (engagement ended but customer permission continues):** annual review
- **Legacy case studies (3+ years old):** annual review with a decision point — refresh, archive, or retire

### 15.2 Per-Review Refresh Pass
Every case study review includes:
- Customer permission status verified (still active, no withdrawal)
- Results data verified (still accurate, not overstated by reference drift)
- Outcomes extended where the engagement is ongoing (new metrics, expanded scope, continued growth)
- Screenshots and data visualizations refreshed where newer data exists
- Customer quote verified (still representative, customer still in the same role)
- Internal links updated to include new supporting content
- Related Case Studies cards refreshed
- `dateModified` updated in schema and visible byline

### 15.3 Case Study Refresh Triggers
Events that trigger immediate refresh:
- Customer renews or extends the engagement (new outcomes to add)
- Customer achieves a new milestone the case study should capture
- Customer's representative changes role (update attribution, maybe a new quote)
- Press mention or award related to the engagement
- Customer adds a new logo variant or brand change
- Results become stale enough to warrant "Results from [Year]" notation

### 15.4 Archive and Retirement Protocol

**Archive:** Case studies that no longer represent the client's current positioning can move to an archive section of the case studies index with a "Past Work" header. Archived case studies remain indexed but stop appearing in homepage and service page proof sections.

**Retire:** Case studies for customers who withdrew permission, ended the relationship badly, or are no longer alive as companies get retired. Retirement protocol:
- 301 redirect the case study URL to the case studies index or the most relevant related case study
- Remove from llms.txt
- Remove from sitemap.xml
- Remove from all internal link sources
- Document the retirement decision in the client's engagement log

---

## Phase 16 — QA Verification Checklist

Run every item before a case study goes live. Combine with Core Standards Phase 16 pre-publication gates.

### Permissions & Legal
- [ ] Written permission on file from customer (signed release form)
- [ ] Customer approval of final draft before publication
- [ ] Customer approval of all quotes, stats, and visuals
- [ ] Customer permission covers logo, name, representative, quotes, and intended use scope
- [ ] Permission scope and terms documented in the client's engagement log

### SEO / Technical
- [ ] Title tag customer/industry-first + headline result + brand, 50–60 characters
- [ ] Meta description 140–160 characters, customer in first 20 words, headline result, implied promise
- [ ] Canonical URL correct and absolute
- [ ] One H1 with outcome-led framing
- [ ] Minimum 4 H2s matching narrative arc (Challenge, Approach, Results, What's Next)
- [ ] H3s within Results name specific metrics
- [ ] Primary keyword in first 100 words
- [ ] OG tags complete (with og:type="article")
- [ ] Twitter Card tags complete
- [ ] CreativeWork or Article JSON-LD with author `@id`, publisher `@id`, about, article-specific mentions, speakable, image, dates
- [ ] BreadcrumbList JSON-LD matches visible breadcrumb
- [ ] FAQPage JSON-LD matches visible FAQ one-to-one
- [ ] All schema validates in Google Rich Results Test
- [ ] SERP intent validation completed and documented

### Entity SEO
- [ ] Client brand name bolded at calibrated density (1 per 120–140 words)
- [ ] Client brand name in first sentence of body
- [ ] Customer name present across H1/hero, Stats Strip, Challenge section, Customer Quote, What's Next
- [ ] Named expert attribution 3–6 instances with credentials (where expert is named)
- [ ] Expert byline links to author bio page (Core Standards Phase 4.7)
- [ ] Zero bare "we" violations (unless client override active)

### E-E-A-T Signals (Experience + Trust Emphasis)
- [ ] **Experience:** customer logo in hero (or industry-descriptor for anonymized)
- [ ] **Experience:** 4-stat Results Stats Strip with specific numbers, units, timeframes
- [ ] **Experience:** named customer representative with title, headshot where permitted
- [ ] **Experience:** minimum 2 custom data visualizations (full case study)
- [ ] **Experience:** before/after screenshots or platform data where available
- [ ] **Experience:** process or workspace imagery where available
- [ ] **Trust:** every quantified claim has baseline, end state, timeframe, attribution
- [ ] **Trust:** third-party verification (screenshots, platform data) where customer permits
- [ ] **Trust:** engagement date range clearly shown
- [ ] **Trust:** methodology transparency in Approach section
- [ ] **Trust:** honest acknowledgment of mixed or partial outcomes where applicable
- [ ] **Trust:** link to customer's public website (named case studies)
- [ ] **Authoritativeness:** notable customer logo or industry position highlighted
- [ ] **Authoritativeness:** industry recognition badges where applicable
- [ ] **Expertise:** named methodology or framework documented in Approach section

### Content Quality
- [ ] Narrative arc present: Challenge → Approach → Results → What's Next
- [ ] 3–5 distinct customer quote moments throughout the case study
- [ ] Featured Customer Quote section with 2–4 sentence specific quote
- [ ] Key Takeaways / Lessons section with 3–5 transferable principles
- [ ] Zero banned phrases (Core Standards Phase 8 + client-specific additions)
- [ ] Zero AI artifact structures
- [ ] Human editorial pass completed
- [ ] Customer approval pass completed
- [ ] Word count on target (full 1,500–2,500; mini 600–1,200)
- [ ] People-first content check passed (Core Standards Phase 14.4)

### Results Documentation
- [ ] Every quantified claim includes baseline, end state, timeframe, attribution methodology
- [ ] Specific numbers, not rounded approximations
- [ ] Consistent units across comparable stats
- [ ] Third-party verification where customer permits
- [ ] Attribution honesty where multiple factors contributed
- [ ] Results dated clearly (engagement date range or "Results from [Year]")

### Data Visualizations
- [ ] Minimum 2 custom visualizations (full case study) or 1 (mini case study)
- [ ] Brand-aligned colors from Parameter Sheet design tokens
- [ ] Readable at mobile viewport widths
- [ ] Axis labels, legends, data sources clear
- [ ] Alt text describing the visualization for accessibility
- [ ] Before/after screenshots with matching date ranges and consistent treatment
- [ ] Third-party platform screenshots with source recognizable and dates visible

### Structure
- [ ] Hero with customer logo, H1, sub-headline, industry context, primary CTA
- [ ] Results Stats Strip (4 stats) below hero
- [ ] Challenge section with baseline context and customer pain
- [ ] Approach section with methodology, timeline, team
- [ ] Results section with quantified outcomes and visualizations
- [ ] Customer Quote section with featured quote, attribution, headshot
- [ ] What's Next section with forward-looking state
- [ ] Mid-page CTA block after Results or Customer Quote
- [ ] Key Takeaways / Lessons section with 3–5 principles
- [ ] FAQ section with 4–6 Q&As
- [ ] Related Case Studies section with 3 cards
- [ ] Final CTA block at page bottom

### CTA Cadence
- [ ] Minimum 3 CTA placements across the case study
- [ ] Hero primary CTA, mid-page CTA, final CTA
- [ ] All CTAs route to primary CTA URL from Parameter Sheet or to specific service page

### Internal Linking
- [ ] Links to at least 1 related service page
- [ ] Links to at least 1 related blog article
- [ ] Links to customer's public website (named case studies, with permission)
- [ ] Links to contact or booking page (primary CTA destination)
- [ ] Related Case Studies section with 3 cards linking to other case studies
- [ ] Breadcrumb links to Case Studies index
- [ ] All anchor text descriptive and specific

### Site-Wide Integration
- [ ] Case study added to Case Studies index page
- [ ] Service pages audited and proof section updated to reference this case study
- [ ] Homepage featured case studies or proof section audited for inclusion
- [ ] Blog articles audited for inbound link opportunities
- [ ] Other case studies audited for Related Case Studies inclusion
- [ ] Case study added to `llms.txt` per Phase 14.4
- [ ] Freshness review cadence documented (quarterly for active relationships, annual for closed)

### Design
- [ ] Hero matches client design tokens
- [ ] Typography supports sustained reading (17–19 px body, 1.7–1.9 line-height)
- [ ] Visual rhythm maintained (visual element every 200–300 words)
- [ ] Featured quote treatment visually distinct
- [ ] Data visualizations brand-aligned
- [ ] Mobile tested (hero stacks cleanly, Stats Strip responsive, visualizations legible)
- [ ] Responsive tested at 320px, 768px, 1024px, 1440px
- [ ] Core Web Vitals within targets

### Sitemap & Indexing
- [ ] Case study URL added to sitemap.xml
- [ ] `<lastmod>` set to publish date
- [ ] Priority: flagship case study 0.8, standard case study 0.6
- [ ] Case study URL submitted to Google Search Console for crawl

---

## Quick Reference: The Non-Negotiables

Ten rules that override everything else when time is short:

1. Written customer permission on file before publication
2. Narrative arc complete: Challenge → Approach → Results → What's Next
3. Every quantified claim includes baseline, end state, timeframe, attribution methodology
4. Minimum 4-stat Results Stats Strip with specific numbers and timeframes
5. Featured customer quote with named representative, title, and headshot where permitted
6. Minimum 2 custom data visualizations (full case study) or 1 (mini case study)
7. CreativeWork or Article JSON-LD + BreadcrumbList + FAQPage schema on every case study
8. Link to customer's public website (named case studies, with permission)
9. Case study added to Case Studies index + service pages + `llms.txt` on launch
10. Third-party verification included where customer permits (screenshots, platform data, public reporting)

Everything else matters. These ten are the floor.

---

*Version 1.0 — April 2026 — ROI.LIVE / Jason Spencer*
*Inherits from ROI.LIVE Agency Core Standards v1.1.*
