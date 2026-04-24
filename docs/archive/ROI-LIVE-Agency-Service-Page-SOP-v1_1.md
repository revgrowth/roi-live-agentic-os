# ROI.LIVE Agency Service Page SOP
**Version:** 1.1 — April 2026
**Applies to:** Every service page produced or managed on a client website by ROI.LIVE
**Owner:** Jason Spencer, Founder — ROI.LIVE
**Inherits from:** ROI.LIVE Agency Core Standards v1.1

> This SOP specifies the rules unique to service pages on client websites. A service page is a commercial page targeting transactional or commercial-investigation intent for a service business. Rules not specified here fall back to the Agency Core Standards base document.

---

## TABLE OF CONTENTS

1. Service Page Intent & Definition
2. Service Page Classes
3. Pre-Build Research
4. URL, Title & Metadata Architecture
5. Service Page Structure (The Conversion Spine)
6. Section Composition
7. Word Count & Keyword Placement
8. Service-Specific Schema
9. Trust Signal Requirements (E-E-A-T Trust Emphasis)
10. Pricing Convention Rules
11. Case Study Integration
12. Local SEO Addendum (Conditional)
13. Service Page Design System
14. Internal Linking & llms.txt Integration
15. Content Freshness (Service-Specific)
16. QA Verification Checklist

---

## Phase 1 — Service Page Intent & Definition

### 1.1 What a Service Page Is
A service page is a commercial page that sells a specific service (or tightly grouped set of services) offered by the client. It targets buyers in the commercial investigation or transactional stage of the buying journey. Its primary job is conversion. SEO and AEO signals layer on top without compromising the conversion architecture.

### 1.2 What a Service Page Is Not
- An educational article about a service category (that is a blog article)
- The homepage (the homepage markets the full brand, not a single service)
- A case study (case studies prove outcomes from past engagements; service pages sell future engagements)
- A product page (products ship; services deliver)

### 1.3 Primary Service Page Goals
1. Convert qualified buyers to the primary CTA (book a call, request a quote, start a project, submit a contact form)
2. Rank for commercial-intent keywords in the service's category
3. Get cited by AI answer engines for questions like "who does X service," "how much does X cost," "what's included in X service"
4. Feed trust signals and proof into the buyer's decision process

### 1.4 E-E-A-T Emphasis on Service Pages
Per Core Standards Phase 4, service pages carry E-E-A-T signals with emphasis weighted toward **Trust**. Service pages are commercial by intent — buyers evaluating the client's trustworthiness before spending money. Experience, Expertise, and Authoritativeness signals still appear on every service page, but Trust signals (reviews, guarantees, transparent pricing, NAP consistency, third-party verification) take structural priority.

---

## Phase 2 — Service Page Classes

Every service page is one of two classes:

### 2.1 Evergreen Service Page
The default class. Represents a permanent service offering the client provides. Word count 1,000–1,800. Optimized for organic ranking over 12+ months. Gets maintained and updated over time per Phase 15.

### 2.2 Campaign Service Page
A time-bound or promotion-bound page for a seasonal service, limited offer, or campaign (e.g., "Spring HVAC Tune-Up," "New Customer Gutter Cleaning Offer"). Word count 600–1,000. Optimized for conversion during the campaign window. May deindex after the campaign ends (documented in the client's SEO log).

Campaign pages follow the same structural spine as evergreen pages with shortened sections and a stronger offer emphasis.

---

## Phase 3 — Pre-Build Research

Complete before writing a single word or line of code.

### 3.1 Service Offering Confirmation
- Confirm exact service name and scope with the client
- Confirm what the service includes and excludes
- Confirm pricing structure (flat rate, hourly, project-based, tiered packages, custom quote)
- Confirm service area (local, regional, national) — pulls into the Parameter Sheet service areas field
- Confirm delivery timeline (how long from inquiry to completed service)
- Confirm the buyer's primary objections (from the client's sales team, if accessible)

### 3.2 Keyword Research
- Identify primary commercial-intent keyword
- Identify 3–5 semantic variants with verified volume (Core Standards Phase 9)
- Identify top 5 related question keywords for FAQ targeting ("how much does [service] cost," "how long does [service] take," "what's included in [service]")
- Validate that the target keywords map to actual revenue-producing services (Core Standards Phase 9.2)

### 3.3 SERP Intent Validation
Per Core Standards Phase 9.5, validate SERP intent before production:
- Pull the current top 10 organic results for the primary keyword
- Confirm service pages dominate the SERP for that keyword (if the SERP is dominated by aggregators or blog posts, adjust strategy before building)
- Check for Local Pack presence (local service keywords)
- Check for AI Overview citations and which sources appear
- Check for People Also Ask questions — these map directly to FAQ content
- Document findings in the service page brief

### 3.4 Competitor Analysis
- Pull the top 10 organic results for the primary keyword
- Identify which pages rank (service pages, blog posts, directories, aggregators)
- Document the price ranges competitors display (or do not display)
- Document the trust signal patterns competitors use (logos, testimonials, certifications, guarantees)
- Document the conversion mechanisms competitors use (call, form, chat, booking widget)
- Identify gaps — what do competitors miss that the client's service page will cover?

### 3.5 Information Gain Source Gathering
Service pages carry information gain too. Minimum three elements (Core Standards Phase 5.2), with the expected distribution weighted toward:
- Named methodology (the client's specific process, given a distinctive name)
- Quantified outcome claims (specific results, response times, guarantee terms)
- Case study evidence (at least one specific client result embedded in the page)
- Insider pricing transparency (where competitors hide pricing, the client discloses or frames cost structure clearly)

### 3.6 Case Study Sourcing
Identify at least one case study (or client result) this page embeds as proof. If no case study exists for this service, flag to the client and produce one before launching the service page.

### 3.7 E-E-A-T Signal Planning
Before drafting, plan which E-E-A-T signals will appear where:

- **Trust (weighted heavily):** Rating, review count, years in business, certifications, guarantees, NAP consistency, third-party verification links, transparent pricing treatment
- **Experience:** Specific client outcomes, named engagements, process detail from past work
- **Expertise:** Certifications, licenses, credentials, named subject-matter expert (elevated for YMYL services per Core Standards Phase 4.5)
- **Authoritativeness:** Industry awards, media mentions, press logos, association affiliations

Document the E-E-A-T signal plan in the service page brief.

---

## Phase 4 — URL, Title & Metadata Architecture

### 4.1 URL Slug
- Format: `/[service-category]/[service-keyword-phrase]` or `/services/[service-keyword-phrase]` per client CMS
- Keyword-first within the slug
- Lowercase, hyphens between words
- For local service businesses: include location modifier in the slug where it matches buyer search patterns (e.g., `/hvac-service-asheville-nc`)

### 4.2 Title Tag
- Format: `Primary Service Keyword | Benefit or Location | Brand Name`
- Primary keyword appears first
- Include location for local service businesses
- Target length 50–60 characters
- Example: `HVAC Service Asheville NC | Same-Day Response | [Client Name]`

### 4.3 Meta Description
- 140–160 characters
- Primary keyword in the first 20 words
- Include one trust signal or differentiator (response time, years in business, guarantee, certification)
- Include a call to action (e.g., "Book your estimate today")
- Zero keyword stuffing
- Functions as an AI micro-answer per Core Standards Phase 7.6

### 4.4 H1
- Benefit-first or service-first framing with primary keyword present
- Example: `HVAC Service in Asheville — Same-Day Response, 10-Year Warranty`
- Avoid exact repetition of the title tag. H1 can be more benefit-focused or longer.

### 4.5 H2 and H3 Rules
- Minimum 3 H2s contain commercial-intent entity terms (the service name, pricing, process, timeline, results, service areas)
- Headings map to the conversion spine (Phase 5)
- Questions answered in headings where they map to common buyer questions ("What does [service] cost?", "How long does [service] take?")

---

## Phase 5 — Service Page Structure (The Conversion Spine)

Every service page follows this layout order. Design tokens vary per client. Structural spine does not.

```
<head>
  ├── Title tag (keyword-first with location for local)
  ├── Meta description (keyword + trust signal + CTA)
  ├── Canonical URL (absolute)
  ├── OG tags: type, title, description, URL, image, site_name
  ├── Twitter Card tags (summary_large_image)
  ├── Service JSON-LD
  ├── Offer JSON-LD (embedded in Service or separate)
  ├── FAQPage JSON-LD
  ├── BreadcrumbList JSON-LD
  ├── AggregateRating JSON-LD (when reviews exist)
  └── Client-specified fonts

<body>
  ├── Navigation (client's standard nav)
  ├── Hero Section
  │    ├── Primary value proposition (H1)
  │    ├── Sub-headline (specific outcome, timeline, or guarantee)
  │    ├── Trust bar (3–5 trust signals: ratings, certifications, years in business, client count)
  │    ├── Primary CTA button (from Parameter Sheet CTA URL)
  │    └── Secondary CTA (phone number or alternate action)
  ├── Trust Logo Strip (client logos, certification badges, or press mentions)
  ├── Problem Framing Section
  │    └── Names the specific buyer pain the service solves
  ├── Solution / Service Overview Section
  │    ├── What the service is
  │    ├── What's included (bullet list or tile grid)
  │    └── Who it's for
  ├── Proof Section #1 — Case Study Excerpt
  │    ├── Client name (or anonymous if required)
  │    ├── Before/after results with specific numbers
  │    ├── 1–2 sentence client quote
  │    └── Link to full case study page
  ├── Named Process / Method Section
  │    ├── Named methodology (information gain anchor)
  │    ├── 3–6 numbered steps
  │    └── Timeline expectations per step
  ├── CTA Block #2 (mid-page)
  ├── Proof Section #2 — Testimonials
  │    └── 2–4 client testimonials with name, company, headshot where available
  ├── Pricing / Packages Section
  │    ├── Transparent pricing where possible
  │    ├── Package tiers where applicable
  │    └── "Custom quote" framing where pricing is variable
  ├── Service Areas Section (local businesses only)
  │    └── Cities, neighborhoods, or regions served
  ├── FAQ Section (6–8 Q&As for service pages, more than blog articles)
  ├── Guarantee / Risk Reversal Section
  │    └── Warranty, money-back guarantee, satisfaction promise
  ├── CTA Block #3 (final conversion push)
  │    ├── Stakes-based headline
  │    ├── Primary CTA (large, prominent)
  │    └── Secondary contact method (phone, email)
  └── Footer (client's standard footer)
```

### 5.1 CTA Cadence Rule
Every service page carries minimum 5 CTA placements:
1. Hero primary CTA (above the fold)
2. Hero secondary CTA (phone, alternate action)
3. Mid-page CTA block (after Proof Section #1)
4. Post-pricing CTA (after pricing section)
5. Final CTA block (bottom of page)

Every CTA routes to the client's primary CTA URL from the Parameter Sheet, or to the client's secondary CTA for phone/alternate actions.

---

## Phase 6 — Section Composition

### 6.1 Hero Section
The hero carries:
- H1 with primary keyword and benefit
- Sub-headline stating a specific outcome, timeline, or guarantee (not a generic brand slogan)
- Trust bar with 3–5 signals (star rating, years in business, certification logo, client count, press mention)
- Primary CTA button
- Secondary contact method (phone number for local service, live chat for SaaS)

The hero converts on its own. A reader should be able to understand what the service is, who provides it, and how to buy it without scrolling.

### 6.2 Problem Framing Section
Names the specific pain the buyer feels before hiring this service. Uses specific language the buyer uses (pulled from client sales calls, reviews, or competitor reviews). 2–3 short paragraphs or a bulleted pain list.

### 6.3 Solution / Service Overview Section
Describes what the service is, what it includes, and who it is for. Structured for scanning:
- Bullet list or tile grid of inclusions
- Short paragraphs that read as buyer-language descriptions, not feature specs
- Brand name mentioned at calibrated density

### 6.4 Proof Section #1 — Case Study Excerpt
Every service page embeds at least one case study excerpt:
- Client name (or descriptive anonymous framing if required, e.g., "Regional HVAC Contractor, 12 Locations")
- Before/after results with specific quantified outcomes
- 1–2 sentence client quote
- Link to full case study page (inherits from Core Standards Phase 10.2 anchor text rule)

This section is an E-E-A-T Experience signal anchor. The specific client, the specific numbers, the specific engagement detail — all Experience signals Google and AI systems recognize.

### 6.5 Named Process / Method Section
The named methodology is a core information gain element. Structure:
- Name the methodology (e.g., "The [Client]Method," "The 5-Step Audit," "Our Proven Process")
- 3–6 numbered steps
- Each step: name, 1–2 sentence description, timeline expectation
- Document the outcome of each step (what the buyer receives or experiences)

### 6.6 Proof Section #2 — Testimonials
2–4 client testimonials. Each testimonial carries:
- Client name (full name where permitted)
- Client company or role
- Client headshot or company logo where available
- Specific result or experience detail in the quote (avoid generic praise)
- Ideally links to a case study or review source

Testimonials feed AggregateRating schema when aggregated across multiple platforms. See Phase 8.3.

### 6.7 Pricing / Packages Section
One of three treatments based on client preference documented in the Parameter Sheet:

**Treatment A — Transparent pricing:** Specific prices or price ranges displayed per service or package.

**Treatment B — Tiered packages:** 3 named packages with feature lists, priced or price-framed ("Starting at $X").

**Treatment C — Custom quote:** Framed pricing logic (hourly rate range, project minimum, factors affecting cost) with a clear path to quote.

Whichever treatment applies, the page does not leave the buyer guessing whether the service is in their budget. Pricing opacity kills commercial-intent conversion and reads as a Trust-signal failure.

### 6.8 Service Areas Section (Local Businesses Only)
Cities, neighborhoods, counties, or regions the client serves. Plain list or interactive map. Feeds LocalBusiness schema `areaServed` property.

### 6.9 FAQ Section
6–8 Q&As matching FAQPage JSON-LD. Service page FAQs skew commercial:
- "How much does [service] cost?"
- "How long does [service] take?"
- "What's included in [service]?"
- "Do you offer [related service]?"
- "What happens if [common concern]?"
- "Is [service] guaranteed?"
- "Where do you provide [service]?" (local)
- "How do I get started with [service]?"

Each answer 2–5 sentences, brand mentioned at least once per 2–3 answers, expert mentioned at least once across the block.

### 6.10 Guarantee / Risk Reversal Section
Every service page that can offer a guarantee has a guarantee section: warranty, money-back guarantee, satisfaction promise, free revision policy, or no-contract commitment. Risk reversal lifts conversion by reducing buyer perceived risk. Also functions as a Trust signal for E-E-A-T purposes.

---

## Phase 7 — Word Count & Keyword Placement

### 7.1 Word Count Targets
- Evergreen service page: 1,000–1,800 words
- Campaign service page: 600–1,000 words
- Premium or enterprise service (high-consideration purchase): 1,800–2,500 words

### 7.2 Primary Keyword Placement (Required)
- Title tag (first position)
- H1
- Meta description (first 20 words)
- First 100 words of body content
- At least 3 H2 headings
- Within FAQ section at least twice
- Natural density throughout body

### 7.3 Brand Name Placement
Calibrated to 1 instance per 120–140 words (Core Standards Phase 3.2). For a 1,500-word service page, target 11–13 brand mentions. First instance in first sentence of body content. Bolded on every body-prose instance.

### 7.4 Expert Attribution Placement
Lower density than editorial pages. Target 3–5 expert mentions total on a service page. Mentions appear in:
- Named Process / Method section (expert designed the methodology)
- 1–2 FAQ answers
- Optional "About [Brand]" short section if included

For YMYL services (per Core Standards Phase 4.5), expert attribution must include credentials on every mention, and the named subject-matter expert must appear with full license or certification detail.

### 7.5 Location Modifier Placement (Local Businesses)
For local service businesses:
- Location in title tag
- Location in H1 (or H2 if H1 is service-first)
- Location in first 100 words of body
- Location in at least 2 H2 headings
- Location in meta description
- Service areas listed explicitly in the Service Areas section

---

## Phase 8 — Service-Specific Schema

Inherits Core Standards Phase 12. Service-specific requirements:

### 8.1 Service JSON-LD (Required Fields)
- `@context`, `@type: Service` (or `ProfessionalService` for service businesses)
- `name` (service name)
- `description` (meta description or short service summary)
- `provider` (references Organization `@id`)
- `areaServed` (array of locations for local businesses; omit for global services)
- `serviceType` (service category)
- `hasOfferCatalog` (references Offer entries)
- `aggregateRating` (when reviews exist)

### 8.2 Offer JSON-LD
Embedded in Service schema or separate block:
- `@type: Offer`
- `price` or `priceRange`
- `priceCurrency`
- `availability`
- `url` (service page URL)
- `seller` (references Organization `@id`)
- `validFrom` (for campaign pages)
- `validThrough` (for campaign pages)

### 8.3 AggregateRating (When Reviews Exist)
- `@type: AggregateRating`
- `ratingValue` (average rating)
- `reviewCount` (total review count)
- `bestRating`, `worstRating`
- Data sourced from verified review platforms (Google, Yelp, BBB, Trustpilot) — never fabricated

### 8.4 FAQPage JSON-LD (Required)
Matches the visible FAQ block one-to-one.

### 8.5 BreadcrumbList JSON-LD (Required)
Matches the visible breadcrumb bar. Typical hierarchy: Home → Services → [Service Name].

### 8.6 LocalBusiness Schema (Local Services Only)
When the client is a local service business and the service page represents the primary offering:
- `@type: LocalBusiness` (or specific subtype: `HVACBusiness`, `Plumber`, `ElectricalContractor`, etc.)
- `address` (PostalAddress)
- `geo` (GeoCoordinates)
- `openingHoursSpecification`
- `telephone`
- `priceRange`
- `image` (primary business image)

For multi-location clients: `Organization` at the brand level, `LocalBusiness` per location, linked via `location` property.

### 8.7 Author / Expert Attribution Schema
Where the service page includes expert commentary or cites a named methodology from the expert, the expert's Person schema is referenced via `@id` (Core Standards Phase 12.2). The expert's author bio page (Core Standards Phase 4.7) is linked from the page where the expert is named.

---

## Phase 9 — Trust Signal Requirements (E-E-A-T Trust Emphasis)

Service pages carry Trust signals as the primary E-E-A-T weight. Trust signals appear prominently and redundantly across the page.

### 9.1 Above-the-Fold Trust Bar
3–5 signals in the hero or immediately below:
- Aggregate rating (e.g., "4.9★ from 200+ reviews")
- Years in business
- Client count or project count
- Primary certification or credential
- Geographic authority signal ("Asheville's top-rated HVAC contractor")

### 9.2 Trust Logo Strip
Below hero or after problem framing. Includes:
- Client company logos (minimum 5 recognizable brands, where permitted)
- Certification or association logos (BBB, industry associations, platform partnerships)
- Press mention logos (media outlets that have featured the client)
- Award logos (industry awards, regional business awards)

### 9.3 Testimonial Requirements
- Minimum 2 testimonials per service page
- Real named clients where permitted
- Specific result or experience detail in quote (not generic praise)
- Headshot or company logo where available

### 9.4 Case Study Embed
Minimum 1 case study excerpt embedded on every service page (Phase 6.4).

### 9.5 Third-Party Verification
Where applicable, link to third-party review sources (Google Business Profile, Yelp, BBB, Trustpilot, G2, Capterra). Transparency beats marketing copy on trust.

### 9.6 Guarantee Display
The guarantee or risk reversal section (Phase 6.10) functions as a Trust signal. Display the guarantee visibly — not buried in a footer or FAQ.

### 9.7 NAP Consistency (Local Businesses)
Name, Address, Phone information matches exactly across the service page, homepage, contact page, Google Business Profile, and all directory listings. NAP consistency is a Trust signal (Core Standards Phase 4.4) and a local ranking factor (Phase 12).

### 9.8 Transparent Editorial Accountability (YMYL Services)
For YMYL-classified services (Core Standards Phase 4.5):
- Credentialed subject-matter expert named and linked to author bio page
- External authoritative citations for safety or regulatory claims
- Disclaimer where appropriate
- Link to the site's Editorial Policy (Core Standards Phase 4.6)

---

## Phase 10 — Pricing Convention Rules

### 10.1 Transparency Default
Default to transparent pricing where business model allows. Transparent pricing increases qualified conversion and filters out unqualified buyers. Opacity is not a neutral choice — it signals "expensive" or "untrustworthy" to buyers and functions as a Trust-signal failure.

### 10.2 Acceptable Pricing Treatments
One of three treatments per service page, documented in the Client Parameter Sheet:

**Treatment A — Exact Pricing:** Specific dollar amounts per service or package. Used when pricing is standardized.

**Treatment B — Price Ranges / "Starting At":** Range or minimum price shown. Used when pricing varies by scope. Include what drives the variation (square footage, project complexity, service tier).

**Treatment C — Custom Quote With Framing:** No prices shown, but the page explains:
- What drives pricing (hourly rate range, project minimum, scope variables)
- What a typical engagement costs (range or median)
- How quickly the buyer receives a quote after inquiry
- Whether the quote is free

Never ship a service page that says "Call for pricing" with no further context.

### 10.3 Payment Terms
Where relevant, the pricing section documents:
- Payment schedule (deposit, milestones, completion)
- Payment methods accepted
- Financing or payment plan availability

---

## Phase 11 — Case Study Integration

### 11.1 Minimum Integration
Every service page embeds at least one case study excerpt (Phase 6.4) and links to the full case study page.

### 11.2 Case Study Selection Rules
Select a case study that:
- Matches the service being sold on this page (HVAC service page cites an HVAC case study, not a plumbing case study)
- Includes quantified before/after results
- Represents a buyer similar to the service page's target buyer (local business, enterprise, specific vertical)
- Has client permission for use (verified before embedding)

### 11.3 Case Study Excerpt Format
- Client name and descriptive framing (e.g., "Regional HVAC Contractor, 12 Locations")
- Opening line stating the challenge or starting condition
- Specific before/after numbers (revenue, leads, response time, cost reduction)
- Client quote (1–2 sentences, specific not generic)
- Button/link to full case study: "Read the full case study →"

### 11.4 Multiple Case Study Integration
For premium or enterprise service pages, embed 2–3 case study excerpts from different verticals or buyer types. Each excerpt links to its full case study page.

---

## Phase 12 — Local SEO Addendum (Conditional)

Applies when the client is a local service business or has location-bound service delivery.

### 12.1 NAP Consistency
Name, Address, Phone (NAP) information must match across:
- Service page
- Homepage
- Contact page
- Google Business Profile
- All directory listings
- Schema markup

One inconsistency (suite number vs floor, hyphenated vs spaced phone) hurts local ranking and undermines Trust.

### 12.2 Service Areas Section
Explicit list of cities, neighborhoods, counties, or regions served. Matches `areaServed` property in LocalBusiness and Service schema.

### 12.3 Location-Specific Content
For multi-location service businesses, each location gets its own service page variant with:
- Location-specific H1
- Location-specific testimonials
- Location-specific team information (if applicable)
- Location-specific images (real photos of the local team or location, not stock)
- Duplicate content avoidance: rewrite body copy per location, don't swap city name only

### 12.4 Local Schema Layering
LocalBusiness schema for the business. Service schema for the service. Breadcrumb schema for navigation. AggregateRating pulled from verified review platforms.

### 12.5 Google Business Profile Integration
Service pages link to the client's Google Business Profile where appropriate. GBP categories, services, and attributes match the service page content.

### 12.6 Local Review Program
Per Core Standards Phase 11.5, every local service engagement runs an active Google Business Profile review acquisition program. Review signals feed both Trust (E-E-A-T) and Local Pack ranking.

---

## Phase 13 — Service Page Design System

The design system for each client's service pages is documented in the Client Parameter Sheet. Agency-standard structural requirements:

### 13.1 Required Design Elements
- Hero with H1, sub-headline, trust bar, primary CTA, secondary contact
- Trust logo strip
- Proof sections styled distinctly from body prose (bordered cards, callout boxes)
- Named Process section with numbered steps styled visually (not bare ordered list)
- Pricing section styled for scanning (tile grid for packages, table for comparison)
- FAQ with expandable items that remain visible and schema-extractable
- Multiple CTA blocks styled distinctly from surrounding content
- Sticky or floating CTA on mobile (persistent button or phone link)

### 13.2 Above-the-Fold Requirement
The hero delivers complete conversion information without scrolling: what the service is, who provides it, trust signals, and how to take action.

### 13.3 Visual Proof Over Prose
Service pages use higher ratio of visual elements to prose than editorial pages:
- Logo grids instead of logo lists
- Tile layouts for inclusions
- Icon-led step grids for process
- Comparison tables for packages
- Embedded video where appropriate (hero video, testimonial video, process video)

### 13.4 Mobile Conversion Priority
Service pages convert heavily on mobile for local service businesses. Mobile requirements:
- Phone number is tap-to-call
- Primary CTA button stays thumb-reachable (bottom-positioned on long pages)
- Forms are short (name, contact method, service needed, optional message)
- Pricing readable without horizontal scroll
- Trust signals above-the-fold on mobile, not pushed below

---

## Phase 14 — Internal Linking & llms.txt Integration

Inherits Core Standards Phase 10. Service-specific additions:

### 14.1 Inbound Links to the Service Page
Every new service page triggers an audit of existing site pages for inbound link opportunities. Sources:
- Homepage services section
- Blog articles covering related topics
- Other service pages (cross-linking related services)
- Case study pages (case studies about this service link back to the service page)
- About page (when services are mentioned in company overview)

### 14.2 Outbound Links From the Service Page
Every service page links to:
- At least 1 related service page (where the client offers complementary services)
- At least 1 case study (embedded and linked)
- At least 2 relevant blog articles (educational context, covered in Phase 6)
- Contact page or booking page (primary CTA destination)
- Homepage (through nav, not body — nav link counts)

### 14.3 Related Services Section
End of service page (before final CTA), include a "Related Services" section linking to 2–4 other service pages the client offers. Each linked service includes:
- Service name
- 1-sentence teaser
- Arrow CTA

This mirrors the Related Content section pattern from blog articles (Core Standards Phase 10.5) but targets commercial cross-sell rather than topical reading.

### 14.4 Anchor Text for Service Pages
Descriptive, keyword-rich, service-specific. Examples:
- "our full HVAC maintenance plan"
- "how the 5-step audit works in practice"
- "the case study behind the 60% lead increase"

Never:
- "Learn more"
- "Click here"
- "This page"
- Service name alone as the sole anchor (occasional acceptable; not default)

### 14.5 llms.txt Integration (Required on Every Publish)
Per Core Standards Phase 7.2, every service page gets added to the client's `llms.txt` file under the Primary Services / Products section. Format:

```
- [Service Name](https://clientsite.com/service-slug): [One-sentence description of the service]
```

Every service page qualifies for llms.txt inclusion (unlike blog articles, which are selective per Blog SOP Phase 11.4). Service pages represent what the client sells — AI models need this context to correctly represent the brand in generated answers.

---

## Phase 15 — Content Freshness (Service-Specific)

Inherits Core Standards Phase 15. Service-specific additions:

### 15.1 Freshness Review Cadence
Service pages require more frequent review than blog articles because pricing, service offerings, team composition, proof points, and competitive positioning change faster than editorial content.

- **Evergreen service pages:** quarterly review (every 90 days)
- **Campaign service pages:** reviewed at the start of each campaign window (monthly or seasonal)
- **YMYL service pages:** 6-month accelerated review cycle (Core Standards Phase 15.5)

### 15.2 Per-Review Refresh Pass
Every service page refresh includes:
- Pricing accuracy verified with client (most common source of service page drift)
- Service inclusions list verified with client
- Case study embed refreshed if a stronger case study is available
- Testimonials rotated if newer testimonials outperform current ones
- AggregateRating schema pulled from current review platform data
- Trust signals updated (new certifications, updated client count, recent awards)
- Internal links updated to include newly published supporting blog articles
- Service areas updated (for local businesses that have expanded or contracted)
- `dateModified` updated in schema and visible modified date

### 15.3 Service Page Refresh Triggers
Events that trigger immediate refresh outside the scheduled cycle:
- Client changes pricing, scope, or service inclusions
- Client earns new certification or award that belongs in trust signals
- New case study becomes available that fits this service
- Service page drops 3+ positions in primary keyword ranking
- Service page stops appearing in AI Overview citations where it previously appeared
- Competitor publishes a stronger service page for the same keyword
- Google Business Profile review count or rating changes enough to update AggregateRating

### 15.4 Retirement Protocol
When a service page no longer represents an active service:
- Redirect (301) to the most relevant current service page if overlap exists
- Redirect to the services index page if no direct replacement exists
- Do not leave dead service pages live — they undermine Trust (Core Standards Phase 4.4)

---

## Phase 16 — QA Verification Checklist

Run every item before a service page goes live. Combine with Core Standards Phase 16 pre-publication gates.

### SEO / Technical
- [ ] Title tag keyword-first with location (for local), 50–60 characters
- [ ] Meta description 140–160 characters, keyword in first 20 words, trust signal, CTA
- [ ] Canonical URL correct and absolute
- [ ] One H1, benefit or service framing with primary keyword
- [ ] Minimum 3 H2s with commercial-intent entity terms
- [ ] Primary keyword in first 100 words
- [ ] Location modifier placed (local businesses: title, H1 or H2, first 100 words, meta description)
- [ ] OG tags complete
- [ ] Twitter Card tags complete
- [ ] Service JSON-LD with provider `@id`, areaServed, serviceType, hasOfferCatalog
- [ ] Offer JSON-LD with price/priceRange, priceCurrency, availability
- [ ] FAQPage JSON-LD matches visible FAQ block one-to-one
- [ ] BreadcrumbList JSON-LD matches visible breadcrumb
- [ ] AggregateRating JSON-LD (if reviews exist) with verified source data
- [ ] LocalBusiness schema (local services only) with full NAP, geo, hours
- [ ] GA4 tracking script with client's Measurement ID
- [ ] All schema validates in Google Rich Results Test
- [ ] SERP intent validation completed and documented in service page brief

### Entity SEO
- [ ] Brand name bolded at calibrated density (1 per 120–140 words)
- [ ] Brand name in first sentence of body
- [ ] Expert attribution 3–5 instances total across page
- [ ] Expert byline or mention links to author bio page (where expert is named)
- [ ] Zero bare "we" violations (unless client override active)

### E-E-A-T Signals (Trust Emphasis)
- [ ] **Trust:** above-the-fold trust bar with 3–5 signals
- [ ] **Trust:** trust logo strip with client logos, certifications, press, or awards
- [ ] **Trust:** minimum 2 named testimonials with specific result details
- [ ] **Trust:** guarantee or risk reversal section displayed visibly (not buried)
- [ ] **Trust:** NAP consistency verified across site, GBP, directories (local)
- [ ] **Trust:** pricing treatment implemented per Parameter Sheet (no "call for pricing" alone)
- [ ] **Trust:** link to at least one third-party review source
- [ ] **Experience:** at least 1 case study excerpt with quantified results
- [ ] **Experience:** named process or methodology with specific operational detail
- [ ] **Expertise:** credentials or certifications displayed for named expert
- [ ] **Expertise:** YMYL credential requirements met (if YMYL service per Parameter Sheet)
- [ ] **Authoritativeness:** industry awards, media mentions, or association logos visible

### Content Quality
- [ ] Information gain elements present (minimum 3, at least 1 client-specific; named methodology counts)
- [ ] Named methodology documented with steps, timeline, outcomes
- [ ] Zero banned phrases (Core Standards Phase 8 + client-specific additions)
- [ ] Zero AI artifact structures (binary contrasts, one-word fragments, em-dash reveals)
- [ ] Human editorial pass completed
- [ ] YMYL editorial review by credentialed SME completed (if YMYL service)
- [ ] Word count on target (evergreen 1,000–1,800; campaign 600–1,000; premium 1,800–2,500)
- [ ] People-first content check passed (Core Standards Phase 14.4)

### Conversion Structure
- [ ] Hero delivers complete conversion information above the fold (H1, sub-headline, trust bar, CTA, secondary contact)
- [ ] Trust logo strip present below hero or after problem framing
- [ ] Problem framing section names specific buyer pain
- [ ] Solution / Service Overview section present
- [ ] Proof Section #1 (case study excerpt) embedded with specific results
- [ ] Named Process section with 3–6 numbered steps and timeline per step
- [ ] Mid-page CTA block after Proof Section #1
- [ ] Proof Section #2 (2–4 testimonials) with named clients where permitted
- [ ] Pricing section uses one of Treatments A, B, or C (no "call for pricing" without context)
- [ ] Service Areas section (local businesses only)
- [ ] FAQ section 6–8 Q&As
- [ ] Guarantee / Risk Reversal section present where applicable
- [ ] Final CTA block at page bottom

### CTA Cadence
- [ ] Minimum 5 CTA placements across the page
- [ ] Hero primary CTA, hero secondary CTA, mid-page CTA, post-pricing CTA, final CTA
- [ ] All CTAs route to the primary CTA URL from the Parameter Sheet (or secondary for phone/alternate)
- [ ] Mobile sticky/floating CTA present on long pages

### Internal Linking
- [ ] Outbound links: at least 1 related service, 1 case study, 2 blog articles, contact/booking page
- [ ] Related Services section at page end (2–4 services linked)
- [ ] All anchor text descriptive and keyword-rich
- [ ] Inbound link audit completed across homepage, blog articles, other service pages, case studies, about page
- [ ] Service page added to `llms.txt` Primary Services / Products section

### Local SEO (If Applicable)
- [ ] NAP matches across all site pages, GBP, and directories
- [ ] Service Areas section with explicit city/region list
- [ ] Location-specific content (rewrite per location, not city-swap only)
- [ ] LocalBusiness schema with full address, geo, hours, phone, priceRange
- [ ] Google Business Profile linked where appropriate
- [ ] GBP review acquisition program active for client

### Design
- [ ] Hero matches client design tokens
- [ ] Visual proof density high (logo grids, tile layouts, icon-led process, comparison tables)
- [ ] Mobile sticky CTA present
- [ ] Tap-to-call phone number on mobile
- [ ] Forms short (3–5 fields default)
- [ ] Pricing readable on mobile without horizontal scroll
- [ ] Responsive tested at 320px, 768px, 1024px, 1440px
- [ ] Images optimized (WebP/AVIF, descriptive alt, under 200KB)
- [ ] Core Web Vitals within targets

### Site-Wide Integration
- [ ] Service page added to services index page (if client has one)
- [ ] Homepage services section audited and linked to new service page where relevant
- [ ] Relevant blog articles audited for inbound link opportunities
- [ ] Relevant case study pages audited for inbound link opportunities
- [ ] Other service pages audited for related-service linking
- [ ] Service page added to `llms.txt` Primary Services / Products section
- [ ] Freshness review cadence documented (quarterly for evergreen, per-campaign for campaign, 6-month for YMYL)

### Sitemap & Indexing
- [ ] Service page URL added to sitemap.xml
- [ ] `<lastmod>` set to publish date
- [ ] Priority: primary service 0.8, secondary service 0.7, campaign 0.6
- [ ] Service page URL submitted to Google Search Console for crawl

---

## Quick Reference: The Non-Negotiables

Nine rules that override everything else when time is short:

1. Hero delivers complete conversion information above the fold
2. Minimum 5 CTA placements across the page
3. At least 1 case study excerpt embedded with quantified results
4. Pricing transparency or framed custom-quote logic (never "call for pricing" alone)
5. Trust signals visible above the fold (rating, years, certification, or authority signal)
6. Service + Offer + FAQPage + BreadcrumbList schema on every service page (+ LocalBusiness for local)
7. NAP consistency across site, GBP, and directories (local businesses)
8. Named methodology documented as information gain anchor
9. Service page added to client's `llms.txt` on publish

Everything else matters. These nine are the floor.

---

*Version 1.1 — April 2026 — ROI.LIVE / Jason Spencer*
*Inherits from ROI.LIVE Agency Core Standards v1.1.*

*Changes from v1.0:*
*Updated inheritance to Core Standards v1.1.*
*Added Phase 1.4 E-E-A-T Emphasis on Service Pages, establishing Trust as the primary weighted E-E-A-T dimension for commercial pages.*
*Added Phase 3.3 SERP Intent Validation as a pre-build step.*
*Added Phase 3.7 E-E-A-T Signal Planning to the pre-build research sequence.*
*Renamed Phase 9 to "Trust Signal Requirements (E-E-A-T Trust Emphasis)" and added Phase 9.6 Guarantee Display, Phase 9.7 NAP Consistency explicit E-E-A-T framing, and Phase 9.8 Transparent Editorial Accountability for YMYL services.*
*Added Phase 8.7 Author / Expert Attribution Schema with bio page linking requirement.*
*Added Phase 12.6 Local Review Program as an active component of Local SEO.*
*Added Phase 14.5 llms.txt Integration requiring every service page to be added to the client's llms.txt Primary Services / Products section.*
*Added Phase 15 — Content Freshness (Service-Specific) with quarterly review cadence, refresh pass procedure, trigger events, and retirement protocol.*
*Updated QA Checklist with E-E-A-T Signals section organized by Trust / Experience / Expertise / Authoritativeness, SERP intent validation, llms.txt integration, author bio linking, freshness cadence documentation, and people-first content check.*
*Expanded Non-Negotiables from 8 to 9 with llms.txt addition.*
