# ROI.LIVE Agency Homepage SOP
**Version:** 1.0 — April 2026
**Applies to:** Every homepage produced or managed on a client website by ROI.LIVE
**Owner:** Jason Spencer, Founder — ROI.LIVE
**Inherits from:** ROI.LIVE Agency Core Standards v1.1

> This SOP specifies the rules unique to homepages on client websites. The homepage is the primary brand entity declaration for the full site, the navigation hub for every other page, and the single highest-stakes conversion surface on any client property. Rules not specified here fall back to the Agency Core Standards base document.

---

## TABLE OF CONTENTS

1. Homepage Intent & Definition
2. Homepage Classes
3. Pre-Build Research
4. URL, Title & Metadata Architecture
5. Homepage Structure (The Brand Conversion Spine)
6. Section Composition
7. Word Count & Keyword Placement
8. Homepage Schema Architecture
9. Trust Signal Requirements (E-E-A-T Multi-Dimensional)
10. Imagery & Brand Visual Requirements
11. Navigation Architecture
12. Conversion Path Design
13. Homepage Design System
14. Internal Linking & llms.txt Integration
15. Content Freshness (Homepage Specific)
16. QA Verification Checklist

---

## Phase 1 — Homepage Intent & Definition

### 1.1 What a Homepage Is
The homepage is the root page of a client website. It serves four jobs at once:

1. **Brand entity declaration.** The homepage is the canonical expression of what the brand is, who it serves, and what makes it distinct. Every downstream page on the site inherits the homepage's entity framing.
2. **Navigation hub.** First-time and returning visitors use the homepage to find the right next-step page (service, product, case study, blog).
3. **Trust anchor.** The homepage establishes whether the brand is credible enough to warrant deeper exploration. Trust signals on the homepage gate engagement with every other page on the site.
4. **Conversion routing surface.** Ready-to-buy visitors arriving via branded search or direct traffic use the homepage to take action (book, buy, contact).

### 1.2 What a Homepage Is Not
- A service page (single-service commercial page — see Doc 3)
- A product page (single-product commercial page — see Doc 4)
- A collection page (grouped products — see Doc 5)
- A blog article (editorial content — see Doc 2)
- A case study (past engagement documentation — see Doc 6)
- A catch-all — homepages that try to be everything serve no one

### 1.3 Primary Homepage Goals
1. Answer "what does this brand do and for whom" within 5 seconds of arrival
2. Establish brand credibility through Trust signals visible above the fold
3. Route visitors to the correct next step based on their intent (browse, evaluate, buy, research)
4. Rank for brand + category keywords and for branded search
5. Support AI answer engines in correctly representing the brand entity in generated answers

### 1.4 E-E-A-T on the Homepage
Per Core Standards Phase 4, the homepage carries E-E-A-T signals across all four dimensions with no single dimension dominating:

- **Trust:** HTTPS, clear contact information, visible policies, professional design, aggregate reviews, press mentions, testimonials, transparent About link
- **Experience:** original photography of real people and real products, case study or results references, customer voice language, maker or founder presence
- **Expertise:** founder and team credentials, certifications, awards, named methodology
- **Authoritativeness:** recognizable customer logos, press mentions, industry affiliations, awards with verification links

The homepage is the only page where all four dimensions carry equal weight. Every other page type emphasizes specific dimensions based on intent.

### 1.5 The 5-Second Test
A first-time visitor arriving from organic search, paid traffic, or referral should be able to answer four questions within 5 seconds without scrolling:
- What does this brand do?
- Who does it serve?
- Why should I trust it?
- What action do I take next?

The hero section and trust bar exist to answer these four questions. If any of the four are unclear at the fold, the homepage fails its primary job.

---

## Phase 2 — Homepage Classes

Every client homepage is one of five classes. Class selection drives structural decisions across the page.

### 2.1 Service Business Homepage
Default for service clients (e.g., CCC, Blue Tree, FBC, Eastside). Primary conversion action is "book a call" or "request quote." Hero emphasizes the specific service outcome the client delivers. Proof section features case studies and testimonials. Navigation surfaces services, case studies, and about.

### 2.2 E-commerce Homepage
Default for e-commerce clients (e.g., Rage Create, Green Llama). Primary conversion action is clicking into a product, collection, or cart-add. Hero emphasizes brand identity and featured products. Proof section features reviews and customer photos. Navigation surfaces collections, featured products, and story.

### 2.3 Local Service Homepage
Subset of service business homepage for location-bound clients. Primary conversion action is "call now" or "request service." NAP appears above the fold. Service areas are documented. Google Business Profile integration is explicit. LocalBusiness schema required.

### 2.4 SaaS / Software Homepage
Product-forward homepage where the primary conversion action is "start free trial" or "book demo." Hero emphasizes the product outcome. Features section replaces services section. Proof includes customer logos, G2/Capterra badges, product screenshots or demo video. Pricing often surfaces on homepage or links prominently.

### 2.5 Personal Brand Homepage
Founder-led or expert-led homepage where the named expert is the primary brand. Hero features the named expert. Credentials and authority are prominent above the fold. Primary conversion typically routes to newsletter signup, consulting inquiry, or content subscription.

---

## Phase 3 — Pre-Build Research

Complete before wireframing or writing homepage copy.

### 3.1 Brand Positioning Confirmation
- Confirm the brand's one-sentence value proposition (what the brand does, for whom, what makes it distinct)
- Confirm the primary customer or buyer persona
- Confirm the brand's 3–5 supporting pillars (the claims that back up the one-sentence value prop)
- Confirm brand voice characteristics from the Client Parameter Sheet Section 4

### 3.2 Audience Mapping
Homepages serve multiple audience types arriving with different intents. Map who visits and what each needs:
- **First-time visitor from organic search:** what information orients them?
- **First-time visitor from paid traffic:** what conversion path matches the ad promise?
- **Returning customer:** what shortcut to action do they need?
- **Press or partner:** what credibility signals do they need?
- **Job candidate:** what hiring or culture info do they need? (when applicable)

Document the primary and secondary audiences in the homepage brief.

### 3.3 Keyword Research
Homepages target different keyword types than other pages:
- **Branded search keywords:** client name, client name + service, client name + location
- **Category keywords:** the broadest category the client competes in (e.g., "HVAC service Asheville" for a local HVAC brand)
- **Outcome keywords where the brand owns them:** broad outcome-led queries the brand has authority to rank for

Primary keyword selection per Core Standards Phase 9. Homepages typically target 1–2 primary keywords plus the client's branded search terms.

### 3.4 SERP Intent Validation
Per Core Standards Phase 9.5:
- Pull the current top 10 organic results for the primary category keyword
- Confirm homepages or brand-led pages appear in the SERP for that keyword
- Check for Knowledge Panel presence for the brand or category
- Check for AI Overview citations
- Document findings in the homepage brief

### 3.5 Competitor Homepage Analysis
- Top 5 competitor homepages in the client's niche
- Above-the-fold value proposition approach
- Navigation structure
- Proof signals deployed
- CTA cadence and primary conversion action
- Visual identity and brand treatment
- Information gain elements each competitor uses

### 3.6 Proof Asset Gathering
Before building the homepage:
- Customer logos (minimum 6 for logo strip, with permission for display)
- Press mentions and logos (with verification links)
- Award logos and certifications
- 3–5 strongest testimonials
- 2–3 flagship case studies with short excerpts ready
- Aggregate rating data across review platforms
- Social proof metrics (customer count, year founded, locations, project count)

### 3.7 Information Gain Planning
Homepages carry information gain per Core Standards Phase 5.2. Weighted toward:
- **Named framework:** the client's signature methodology or approach, presented as the brand's distinct way of solving the buyer's problem
- **Proprietary positioning:** the specific stance or opinion that differentiates the brand from commodity competitors
- **Quantified brand claims:** client count, project count, years in business, aggregate results
- **Original visual identity:** photography, illustration, or design treatment that cannot be mistaken for a template site

### 3.8 E-E-A-T Signal Planning
Document where each E-E-A-T dimension appears on the homepage:

- **Trust:** above-the-fold trust bar, policy links in footer, HTTPS, professional design, contact visible, testimonials, guarantees
- **Experience:** original photography, customer stories, maker or founder content, case study excerpts
- **Expertise:** founder credentials in About snippet, named methodology, certifications in footer or dedicated strip
- **Authoritativeness:** customer logos, press mentions, awards, industry associations

---

## Phase 4 — URL, Title & Metadata Architecture

### 4.1 URL
The homepage lives at the domain root: `https://clientsite.com/`. The canonical URL is the root URL with or without trailing slash per the client's site-wide convention (Core Standards Phase 13.6).

### 4.2 Title Tag
Homepage title tags prioritize branded search visibility and category ranking. Format options:

**Format A — Brand-first (default for established brands):**
`[Brand Name] | [One-sentence value proposition]`
Example: `Rage Create | Affirmation Decks for Creative Maniacs`

**Format B — Category + location + brand (default for local services):**
`[Category] [Location] | [Key Differentiator] | [Brand Name]`
Example: `HVAC Service Asheville | Same-Day Response, 10-Year Warranty | CCC`

**Format C — Outcome-led + brand (default for service brands with category authority):**
`[Outcome Promise] | [Brand Name]`
Example: `Fractional CMO for Revenue Growth | ROI.LIVE`

Target length 50–60 characters. Client Parameter Sheet Section 2.3 (brand positioning statement) guides the format decision.

### 4.3 Meta Description
- 140–160 characters
- Brand name in first 20 words
- Core value proposition stated plainly
- Differentiator (years in business, specific outcome, unique approach)
- Call to action matching the primary homepage CTA
- Functions as an AI micro-answer per Core Standards Phase 7.6

### 4.4 H1
- Bold, brand-voiced, outcome-led
- Often longer and more provocative than the title tag
- Names the buyer and the outcome in one sentence
- Example: `Affirmation Decks Built for Creative Maniacs Who Want Louder Inner Voices`

### 4.5 H2 and H3 Rules
- Minimum 4 H2s across the homepage covering: services or products overview, proof or results, methodology or approach, about or story
- H2s read as natural brand-voiced section headers, not generic labels
- H3s within each H2 section name specific entity terms relevant to that section

---

## Phase 5 — Homepage Structure (The Brand Conversion Spine)

Every homepage follows this layout order. Design tokens vary per client. Structural spine adapts to client class but covers the same content functions.

```
<head>
  ├── Title tag (brand-first, category + location, or outcome + brand per Phase 4.2)
  ├── Meta description (brand + value prop + differentiator + CTA)
  ├── Canonical URL (domain root, absolute)
  ├── OG tags: og:type="website", title, description, URL, image (hero image or brand logo composition), site_name
  ├── Twitter Card tags (summary_large_image)
  ├── Organization JSON-LD (expanded, site-wide canonical declaration)
  ├── WebSite JSON-LD (with potential SearchAction for site search)
  ├── LocalBusiness JSON-LD (local services only)
  ├── BreadcrumbList JSON-LD (often omitted on homepage)
  ├── FAQPage JSON-LD (when FAQ block present)
  └── Client-specified fonts

<body>
  ├── Top Bar (optional) — announcement, promotion, or urgency banner
  ├── Main Navigation
  │    ├── Brand logo (links to homepage — no-op on homepage itself)
  │    ├── Primary nav items (services, products, case studies, about, blog, contact)
  │    ├── Primary CTA button
  │    └── Secondary nav items (search, cart for e-commerce, account for SaaS)
  ├── Hero Section
  │    ├── H1 with brand-voiced outcome statement
  │    ├── Sub-headline (1–2 sentences expanding the value prop)
  │    ├── Primary CTA button
  │    ├── Secondary CTA or trust signal (phone, demo link, or social proof stat)
  │    └── Hero imagery (photography, video, or illustrated composition)
  ├── Above-the-Fold Trust Bar
  │    ├── Aggregate rating (for clients with reviews)
  │    ├── Years in business or client count
  │    ├── Primary certification or authority signal
  │    └── Press or award badge strip (minimum 4 logos where available)
  ├── Services / Products Overview Section
  │    ├── Section H2 naming the offering category
  │    ├── 3–6 service or product cards with icon or image, name, 1-sentence description, link
  │    └── "View all services/products" link to services index or shop
  ├── Proof Section (primary proof content)
  │    ├── Customer logo strip (minimum 6 logos where permitted)
  │    ├── Featured case study excerpt or customer story
  │    └── Link to full case studies index
  ├── Named Methodology / How We Work Section
  │    ├── Named framework or process
  │    ├── 3–5 step overview with short explanations
  │    └── Link to a deeper methodology page or service page
  ├── Secondary Proof Section (testimonials)
  │    ├── 2–4 featured testimonials with headshot, name, title, company
  │    └── Optional video testimonial
  ├── About / Story Snippet Section
  │    ├── 100–200 word brand story
  │    ├── Founder or team photo
  │    ├── Key credentials or differentiators
  │    └── Link to full About page
  ├── Blog / Content Feature (when client runs a blog)
  │    ├── 3 featured recent articles with image, title, excerpt, link
  │    └── Link to blog hub
  ├── FAQ Section (optional, 4–6 Q&As addressing broad brand-level questions)
  ├── Final CTA Section
  │    ├── Stakes-based headline
  │    ├── Primary CTA (large, prominent)
  │    └── Secondary contact method
  └── Footer (client's standard footer with full navigation, policy links, contact, social)
```

### 5.1 CTA Cadence
Every homepage carries minimum 4 CTA placements:
1. Navigation bar CTA (persistent, top of every page)
2. Hero primary CTA (above the fold)
3. Mid-page CTA (typically after Methodology section)
4. Final CTA section (before footer)

Plus distributed secondary CTAs on service cards, product cards, case study cards, and the About snippet.

### 5.2 Class-Specific Variations
- **Service Business:** Services Overview replaces or augments Products Overview. Case studies dominate proof section.
- **E-commerce:** Products and Collections Overview replaces Services Overview. Reviews dominate proof section. Featured products sit above the logo strip.
- **Local Service:** NAP appears in the hero or immediately below. Service Areas section included. Google Business Profile link prominent.
- **SaaS:** Features Overview replaces Services Overview. Product screenshot or demo video in hero. Pricing link prominent in nav.
- **Personal Brand:** Hero features the named expert. About snippet moves higher. Content or newsletter signup replaces services overview for some expert brands.

---

## Phase 6 — Section Composition

### 6.1 Hero Section
The hero is the highest-stakes real estate on the client site. Components:

- **H1:** states the outcome, the offering, or the buyer in brand voice
- **Sub-headline:** expands the value proposition in 1–2 sentences (the "for whom" and "the why")
- **Primary CTA button:** large, brand-colored, links to the primary conversion destination
- **Secondary CTA or trust signal:** phone number for local, demo link for SaaS, aggregate rating stat, or founder credential
- **Hero imagery:** original photography, video, or brand-aligned illustrated composition — NOT stock imagery

The hero must pass the 5-Second Test (Phase 1.5). If the first-time visitor cannot answer "what does this brand do, for whom, why trust it, what do I do next" within 5 seconds, the hero fails.

### 6.2 Above-the-Fold Trust Bar
Below the hero or within the hero frame. 3–5 signals:
- Aggregate rating with platform source ("4.9★ from 400+ Google reviews")
- Years in business ("Serving [region] since [year]")
- Client count or project count
- Primary certification, license, or credential
- Press mention or award badge

Press and award badges link to the source content where possible. Trust signals must be truthful and verifiable.

### 6.3 Services / Products Overview Section
The single most important section on the homepage after the hero. It shows the buyer what the client offers and routes them to the matching detail page.

**Service business format:**
- 3–6 service cards
- Each card: icon or hero image, service name, 1-sentence description, link to service page
- "View all services" link below the grid (to services index page)

**E-commerce format:**
- 3–6 collection cards OR 6–12 featured product cards
- Each card: product or collection image, name, link to the detail page
- "Shop all" link below the grid (to shop or collections index)

**SaaS format:**
- 3–6 feature cards
- Each card: icon, feature name, outcome-led 1-sentence description
- "See all features" or "View the product" link below the grid

### 6.4 Proof Section (Primary)
The first proof section anchors Authoritativeness and Experience. Components:

- **Customer logo strip:** minimum 6 recognizable logos where permission allows. Sized consistently. Grayscale or color per brand design decision.
- **Featured case study excerpt:** one featured case study with customer name, headline outcome, 1–2 sentence excerpt, link to full case study
- **"See all case studies" link** to the case studies index

E-commerce clients substitute aggregate review ratings and featured UGC (customer photos) for the case study excerpt in this section.

### 6.5 Named Methodology / How We Work Section
The Information Gain anchor on the homepage. Components:

- Named framework or methodology (the brand's distinctive approach, documented with a unique name)
- 3–5 numbered or stepped overview
- Each step: named, described in 1–2 sentences, outcome framed
- Link to deeper methodology content (a dedicated methodology page, the About page, or a relevant service page)

Example framing:
- "The [Brand] Method: How we help [customer type] achieve [outcome] in [timeframe]"
- "Our 4-Step Approach to [Category]: The process that produced [specific result statistic]"

### 6.6 Secondary Proof Section (Testimonials)
2–4 featured testimonials. Each testimonial carries:
- Customer name, title, company
- Headshot or company logo
- Specific result or experience detail in the quote (avoid generic praise)
- Optional video testimonial

Testimonials sit in a distinct visual treatment (carousel, card grid, pull quote panel) separated from surrounding body content.

### 6.7 About / Story Snippet Section
100–200 words introducing the brand's founder, team, or origin story. Components:

- Brand story hook (why the brand exists)
- Founder or team photo (real, not stock)
- Key credentials or differentiators
- Link to the full About page

This section carries the Expertise signal for E-E-A-T. The founder or named expert appears here by name with credentials.

### 6.8 Blog / Content Feature Section
Present when the client runs a blog. 3 featured articles:
- Each card: featured image, article title, 1-sentence excerpt, publish date, link
- Priority: most recent pillar article, highest-traffic article, newest cluster article
- Link to blog hub at the section footer

### 6.9 FAQ Section (Optional)
4–6 Q&As addressing broad brand-level questions:
- "What does [Brand] do?"
- "Who does [Brand] serve?"
- "How is [Brand] different from [competitor category]?"
- "Where is [Brand] located?" (for local)
- "How do I get started with [Brand]?"

FAQ inclusion depends on whether the homepage needs additional SEO content or addresses common objections. Not every homepage needs an FAQ — the section is optional but carries FAQPage schema when present.

### 6.10 Final CTA Section
The last conversion opportunity before the footer. Components:

- Stakes-based headline (e.g., "Ready to stop overpaying for leads?")
- Primary CTA button (large, prominent)
- Secondary contact method (phone, email, booking link)
- Optional trust signal reinforcement (response time promise, guarantee, no-contract note)

---

## Phase 7 — Word Count & Keyword Placement

### 7.1 Word Count Targets
- Service business homepage: 700–1,400 words
- E-commerce homepage: 400–900 words (imagery carries more weight)
- Local service homepage: 700–1,200 words
- SaaS homepage: 600–1,100 words
- Personal brand homepage: 500–1,000 words

Homepage word count measures editorial prose, not nav items, card labels, or button text.

### 7.2 Primary Keyword Placement (Required)
- Title tag
- H1 (semantic or direct inclusion)
- Meta description (first 20 words)
- First 100 words of body content
- At least 2 H2 headings
- Natural density throughout body

### 7.3 Brand Name Placement
Calibrated to 1 instance per 120–140 words of prose per Core Standards Phase 3.2. First instance in the first sentence of the hero sub-headline or body copy.

For a 1,000-word homepage, target 7–9 brand mentions across hero, Services/Products Overview, Methodology, About snippet, and Final CTA.

### 7.4 Expert Attribution Placement
The named expert from the Client Parameter Sheet appears on the homepage in:
- About snippet section (primary mention with credentials)
- Methodology section (as the designer of the named framework, where applicable)
- 1 additional mention elsewhere (testimonial response, FAQ answer, or trust bar)

Expert attribution target: 2–4 mentions on a homepage. Credentials on first mention.

### 7.5 Category Entity Placement
Category entity terms (what the brand does, the broader market) appear:
- Title tag
- H1 or H2 in Services/Products Overview
- At least one sentence in the About snippet
- Footer meta navigation labels

### 7.6 Location Modifier Placement (Local Services)
For local service businesses:
- Location in title tag
- Location in H1 or H2
- Location in first 100 words
- NAP visible in hero or above-the-fold trust bar
- Service Areas section includes explicit city/region list

---

## Phase 8 — Homepage Schema Architecture

Inherits Core Standards Phase 12. Homepage schema carries the heaviest structured-data load of any page on the site.

### 8.1 Organization JSON-LD (Required, Expanded)
The homepage carries the canonical expanded Organization schema for the client brand:

- `@context`, `@type` (Organization, LocalBusiness, ProfessionalService, or specific subtype)
- `@id` (canonical identifier used across the site)
- `name`
- `legalName` (when different from brand name)
- `alternateName` (brand aliases)
- `url` (canonical root URL)
- `logo` (logo URL as ImageObject)
- `image` (brand image or hero image)
- `description` (matches or parallels the meta description)
- `sameAs` (array: LinkedIn, X, Instagram, Facebook, YouTube, Wikipedia, Crunchbase, verified social profiles)
- `address` (PostalAddress for local businesses)
- `geo` (GeoCoordinates for local businesses)
- `telephone`
- `email` (public contact email)
- `contactPoint` (ContactPoint with `telephone`, `contactType`, `availableLanguage`, `areaServed`)
- `foundingDate`
- `founder` (references Person `@id` from Parameter Sheet)
- `employee` (array of Person references for featured team members where applicable)
- `award` (array of award names where applicable)
- `hasCredential` (certifications, licenses)
- `knowsAbout` (array of topical expertise entities)
- `brand` (self-reference in some configurations)
- `aggregateRating` (when reviews aggregate across the business)

### 8.2 WebSite JSON-LD (Required)
Declared once on the homepage:

- `@context`, `@type: WebSite`
- `@id` (canonical WebSite identifier)
- `url` (root URL)
- `name` (site name)
- `description`
- `publisher` (references Organization `@id`)
- `potentialAction` (SearchAction when the site has search functionality)
- `inLanguage`

### 8.3 LocalBusiness JSON-LD (Local Services Only)
When the client is a local service business, LocalBusiness schema extends or replaces Organization:

- `@type: LocalBusiness` or specific subtype (HVACBusiness, Plumber, ElectricalContractor, HomeAndConstructionBusiness, etc.)
- `address` (PostalAddress with streetAddress, addressLocality, addressRegion, postalCode, addressCountry)
- `geo` (GeoCoordinates with latitude and longitude)
- `openingHoursSpecification`
- `telephone`
- `priceRange`
- `areaServed` (array of cities or regions)
- `image`
- `aggregateRating` (from review platforms)

Multi-location clients: `Organization` at the brand level with `subOrganization` or `location` arrays referencing individual LocalBusiness entities per location.

### 8.4 FAQPage JSON-LD (When FAQ Block Present)
Matches visible FAQ one-to-one. Same questions, same answers, same order.

### 8.5 Person Schema References
The named expert's Person schema is declared on the expert's author bio page (Core Standards Phase 12.2). The homepage references the expert by `@id` in the About snippet and in Organization `founder` field. The Person schema itself does not duplicate on the homepage.

### 8.6 BreadcrumbList JSON-LD
Typically omitted on homepage (the homepage is the root — no breadcrumb hierarchy above it). Include only when the homepage hosts a section that benefits from breadcrumb context.

### 8.7 Schema Enforcement
Validate all homepage schema in Google's Rich Results Test. The homepage is the highest-priority validation target on the site — errors on the homepage affect entity recognition for every downstream page. Resolve errors before launch. Resolve warnings when they affect rich result eligibility.

### 8.8 Forbidden Patterns
- Declaring Organization schema on the homepage AND every other page inline — Organization should be declared once (on the homepage) and referenced by `@id` from every other page
- Omitting `sameAs` (critical for entity linking across platforms)
- Using `@type: WebPage` alone without Organization context
- Declaring `aggregateRating` on Organization schema when reviews are product-level or service-level (use the appropriate schema type instead)

---

## Phase 9 — Trust Signal Requirements (E-E-A-T Multi-Dimensional)

The homepage is the densest concentration of Trust signals on the site. Signals distribute across multiple sections.

### 9.1 Above-the-Fold Trust Bar
3–5 signals visible without scrolling:
- Aggregate rating with review count and platform source
- Years in business or founding year
- Client count, project count, or customers served
- Primary certification or license
- Geographic authority claim (for local)

### 9.2 Customer Logo Strip
Minimum 6 recognizable customer logos where permission allows. Display:
- Consistent sizing
- Grayscale or color per brand design
- "Trusted by" or "Our customers include" header (optional)

### 9.3 Press and Award Strip
Press mentions and award badges separate from customer logos. Display:
- Logo-based badges for recognizable publications
- Linked to source content where possible
- Award badges with verification links
- Industry association logos where relevant

### 9.4 Testimonials with Attribution
Minimum 2 testimonials visible on homepage with:
- Customer name
- Title and company
- Headshot or logo
- Specific result or experience in quote

### 9.5 Case Study Proof
Minimum 1 featured case study excerpt on homepage with quantified outcome.

### 9.6 Policy Link Footer
Footer links to all Trust policy documents per Core Standards Phase 4.6:
- About page
- Contact page
- Privacy Policy
- Terms of Service
- Editorial Policy
- Corrections Policy
- Cookie Policy (where applicable)
- Accessibility Statement

### 9.7 NAP Consistency (Local)
Name, Address, Phone appear:
- Above the fold (hero or trust bar)
- Footer
- Contact page
- Google Business Profile
- All directory listings

NAP must match across every instance. One inconsistency hurts local ranking and Trust.

### 9.8 HTTPS and Security Signals
- HTTPS across the entire site
- Security badges near conversion surfaces (payment security for e-commerce, SSL-trust signals for service businesses with booking)
- No mixed-content warnings

### 9.9 Visible Contact Path
A visitor must be able to contact the client within two clicks from anywhere on the site. Contact path signals:
- Phone number in header (local or service businesses)
- "Contact" in main navigation
- Contact CTA in footer
- Live chat widget (when the client operates one)

---

## Phase 10 — Imagery & Brand Visual Requirements

The homepage's visual identity sets the aesthetic expectation for every downstream page.

### 10.1 Hero Imagery
Hero imagery is the single most-viewed visual on the site. Options:

**Option A — Original Photography:** Real photos of the client's product, team, workspace, or customers. Highest Trust weight. Required for service businesses and local services. Required for e-commerce brands that make physical products.

**Option B — Video:** Short looping video (5–15 seconds, autoplay muted) showing product in use, service in action, or team at work. High engagement signal.

**Option C — Illustrated or Designed Composition:** Brand-aligned illustration or typographic composition. Appropriate when the brand voice skews editorial, playful, or identity-forward (e.g., Rage Create).

**Option D — Product Grid Composition (E-commerce):** Curated grid of featured products acting as hero. Lets buyers immediately see what the brand sells.

**Forbidden:** generic stock photography (people in suits shaking hands, hands typing on laptops, diverse-teams-smiling-at-whiteboards). Stock kills Trust and Experience signals simultaneously.

### 10.2 Brand Photography Standards
- Minimum resolution 2000×1200 px for hero imagery
- Consistent color treatment across all homepage images (same photographer, same editing style, or same licensed set)
- Real people, real product, real location — not composited
- Alt text describes the image for accessibility (not keyword-stuffed)

### 10.3 Logo Display
- Brand logo in header nav (primary logo variant)
- Logo size consistent across all pages
- Customer logo strip uses consistent sizing and treatment
- Press and award badges sized smaller than customer logos (hierarchy signals importance)

### 10.4 Iconography
- Service or feature cards use consistent icon style (line icons, filled icons, illustrated icons — pick one)
- Icons from the icon system documented in the Client Parameter Sheet Section 5.6
- Icons sized consistently across cards

### 10.5 Image Optimization
All imagery follows Core Standards Phase 13.2:
- WebP or AVIF with JPEG fallback
- Hero imagery under 300 KB
- Descriptive alt text
- Lazy-load below-the-fold images
- Preload hero image for LCP optimization

---

## Phase 11 — Navigation Architecture

The homepage anchors the primary navigation that appears site-wide. Navigation decisions on the homepage ripple across every page.

### 11.1 Main Navigation Items
Primary nav carries 4–7 items. More than 7 dilutes visitor focus. Standard navigation for service businesses:

- Services (or individual service links if the client has 3 or fewer)
- Case Studies (or Work, Results, Clients)
- About (or Team, Story)
- Blog (or Resources, Insights)
- Contact

Standard navigation for e-commerce:

- Shop (or Collections, with dropdown to individual collections)
- About (or Story)
- Blog (or Journal, Resources)
- Account / Login
- Cart icon with item count

### 11.2 Primary CTA in Navigation
A primary CTA button sits in the navigation on desktop and in the mobile menu. Button copy matches the homepage's primary CTA copy.

### 11.3 Mobile Navigation
Mobile navigation collapses to a hamburger or bottom-bar pattern. Requirements:
- Tap target minimum 48×48 px
- Primary CTA remains reachable
- Search accessible (for e-commerce and large sites)
- Account and cart accessible (for e-commerce)

### 11.4 Footer Navigation
Footer carries the full site architecture:
- Full services list (not just featured services)
- Full collection list (e-commerce)
- All policy pages
- Contact information
- Social media links
- Newsletter signup
- Business NAP (for local)

### 11.5 Accessibility
- Skip-to-main-content link at top of page
- Semantic HTML landmarks (`<nav>`, `<main>`, `<footer>`)
- Keyboard-navigable menu interactions
- ARIA labels on icon-only buttons

---

## Phase 12 — Conversion Path Design

The homepage routes different visitor types to different conversion surfaces. Design the routing deliberately.

### 12.1 Primary Conversion Path
The dominant path for the highest-value visitor type. For service businesses, this is usually "book a call" or "request a quote." For e-commerce, "shop" or "view collection." The primary CTA appears in the hero, navigation, mid-page, and final CTA section.

### 12.2 Secondary Conversion Paths
Alternative paths for visitors not ready for primary conversion:
- Service pages (for visitors researching specific services)
- Case studies (for visitors needing proof)
- Blog articles (for visitors in early research)
- About page (for visitors evaluating the brand)
- Newsletter signup (for visitors who want to stay in touch without committing)

Each secondary path has its own CTA entry point on the homepage.

### 12.3 Cold vs Warm Traffic Treatment
First-time cold visitors need more trust-building before conversion. Returning warm visitors need shortcuts to action. The homepage serves both:

- **Cold treatment:** hero + trust bar + services + proof + methodology + about + CTA (longer scroll path with trust-building)
- **Warm treatment:** prominent nav CTA + hero CTA + final CTA section + footer CTA (shortcuts for direct action)

### 12.4 Form Fields on Homepage
Any forms on the homepage (contact form, newsletter signup, quote request) follow minimum-field principles:
- 3–5 fields maximum for first contact
- Required fields marked with asterisk
- Clear form label copy
- Clear submit button copy
- Confirmation message or redirect after submission
- Email capture sets up drip or retention sequence where the client operates one

### 12.5 CTA Copy Standards
CTA buttons use action-verb copy matched to the offer:
- "Book a Call" (not "Contact Us")
- "Get Your Quote" (not "Submit")
- "Shop the Collection" (not "Click Here")
- "Start Your Free Trial" (not "Sign Up")

Button copy matches the Primary CTA URL destination in the Client Parameter Sheet Section 6.5.

---

## Phase 13 — Homepage Design System

Design tokens per client documented in the Parameter Sheet. Agency-standard structural elements:

### 13.1 Required Design Elements
- Header with logo, navigation, and primary CTA
- Hero section with H1, sub-headline, CTAs, imagery
- Above-the-fold trust bar
- Services / Products / Features Overview section with visual consistency across cards
- Proof section with customer logo strip and featured proof (case study or reviews)
- Methodology section with named process
- Testimonials section styled distinctly
- About snippet with founder or team photo
- Blog feature (where applicable) with consistent card design across articles
- Final CTA section
- Comprehensive footer

### 13.2 Above-the-Fold Hierarchy
Desktop above-the-fold renders at approximately 900 px viewport height. Mobile above-the-fold renders at approximately 600–700 px viewport height. Content priority:
1. Brand identity (logo in nav)
2. Primary value proposition (H1)
3. Sub-headline
4. Primary CTA
5. Trust signals

Everything below the fold is supporting content, not primary.

### 13.3 Desktop Layout Grid
- Container max-width 1200–1440 px per client design system
- Generous padding on hero (120–200 px top/bottom)
- Section spacing 80–120 px between sections
- Card grids use 24–32 px gap

### 13.4 Mobile Layout
- Hero content stacks: H1, sub-headline, CTA, image (order varies per design system)
- Card grids collapse to single column below 600 px
- Navigation collapses to hamburger or bottom bar
- Primary CTA remains reachable (sticky or bottom-positioned on scroll)

### 13.5 Visual Rhythm
The homepage alternates between image-heavy and text-heavy sections to maintain scroll engagement:
- Hero (image + text) → Trust bar (icons/logos) → Services (cards) → Proof (logos + card) → Methodology (text + graphic) → Testimonials (quote cards) → About (image + text) → Blog (image cards) → CTA (text)

### 13.6 Performance Priority
The homepage's LCP, CLS, and INP targets are tighter than other pages because it receives the most traffic and sets the first-impression performance bar:
- LCP under 2.0 seconds (tighter than Core Standards 2.5)
- CLS under 0.05 (tighter than Core Standards 0.1)
- INP under 150 ms (tighter than Core Standards 200)

---

## Phase 14 — Internal Linking & llms.txt Integration

Inherits Core Standards Phase 10. Homepage-specific additions:

### 14.1 Outbound Link Density
The homepage links out to every top-level section of the site:
- Every service page (for service businesses with 3–6 services) OR the services index
- Every top-level collection (for e-commerce) OR the shop index
- The case studies index + 1–2 featured case studies
- The About page
- The blog hub + 2–3 featured articles
- The contact page
- Every policy page (via footer)

Total outbound internal link count on a homepage typically 30–60 links across hero, navigation, body sections, and footer.

### 14.2 Inbound Links to the Homepage
Every other page on the site links to the homepage via:
- Main navigation brand logo (header)
- Footer "Home" link (where applicable)
- Breadcrumb root (when breadcrumbs are present on downstream pages)

The homepage receives the strongest internal link signal of any page on the site.

### 14.3 Anchor Text for Homepage Links
Most inbound links to the homepage use brand-name anchor text (via the logo). This is the one place where brand-name-only anchors are acceptable per Core Standards Phase 10.2.

Outbound links from the homepage use descriptive anchor text matching the destination:
- Service card links: "HVAC Maintenance Plans" not "Learn More"
- Case study card links: "60% CPL Reduction Case Study" not "Read More"
- Blog card links: article titles
- About link: "Meet Our Team" or "About [Brand]"

### 14.4 llms.txt Integration (Required)
Per Core Standards Phase 7.2, the homepage is the first entry listed in every client's `llms.txt` file under the Key Pages section:

```
- [Homepage](https://clientsite.com/): [One-sentence brand description]
```

The homepage's one-sentence brand description in llms.txt matches the brand description in the Organization schema (Phase 8.1), the meta description (Phase 4.3), and the one-sentence brand description in the Client Parameter Sheet Section 2.3. Consistency across all four sources strengthens AI model understanding of the brand entity.

### 14.5 Homepage as the Brand Entity Anchor
The homepage is the canonical URL for the Organization entity. Every mention of the brand across the web (linked backlinks, unlinked brand mentions, social profiles) ideally routes to the homepage root URL. This concentrates entity signal on the root URL and strengthens Knowledge Panel eligibility per Core Standards Phase 11.6.

---

## Phase 15 — Content Freshness (Homepage Specific)

Inherits Core Standards Phase 15. The homepage requires more frequent review than any other page type.

### 15.1 Freshness Review Cadence
- **Monthly review** for all homepages
- **Weekly review** during active campaigns, product launches, or significant brand events
- **Immediate refresh** when critical content changes (new services launched, discontinued services, rebrand, leadership change, significant press mention)

### 15.2 Per-Review Refresh Pass
Every homepage review checks:
- Featured case study excerpt: still current, still representative, still strongest proof?
- Customer logo strip: all logos current, no discontinued relationships, permission still valid?
- Press and award badges: current additions added, outdated removals handled?
- Aggregate rating number accurate (pull from current review platform data)
- Featured blog articles: replaced with newer articles per editorial rotation
- Featured products or services: align with current merchandising or campaign priorities
- Testimonials: still current, no customer attribution changes needed
- Founder or team photo: current (if team has changed)
- Year-in-business stat updated at year turnover
- `dateModified` updated in schema

### 15.3 Homepage Refresh Triggers
Events that trigger immediate homepage refresh:
- New service, product, or feature launch
- Service, product, or feature discontinuation
- New customer logo with permission (add to strip)
- Customer logo permission withdrawn (remove from strip)
- Press mention or award to surface
- New featured case study to promote
- Seasonal or campaign content window opening or closing
- Client rebrand or positioning update
- Leadership change affecting About snippet or founder quote
- Google algorithm update confirmed with homepage ranking impact
- AI Overview citation change (gained or lost) for brand keyword

### 15.4 Announcement Bar Maintenance
Where the homepage carries a top announcement bar for promotions or urgent messages, the bar rotates based on the active campaign calendar:
- Weekly review of bar copy accuracy
- Bar removed when the promoted window closes
- Bar does not become "always on" — permanent bars stop drawing attention

---

## Phase 16 — QA Verification Checklist

Run every item before a homepage goes live. Combine with Core Standards Phase 16 pre-publication gates.

### SEO / Technical
- [ ] Title tag follows Format A, B, or C per homepage class (50–60 characters)
- [ ] Meta description 140–160 characters, brand + value prop + differentiator + CTA
- [ ] Canonical URL is the domain root (absolute)
- [ ] One H1, brand-voiced, outcome-led
- [ ] Minimum 4 H2s across Services/Products, Proof, Methodology, About sections
- [ ] Primary keyword in first 100 words
- [ ] OG tags complete (og:type="website", og:image optimized for social sharing 1200×630)
- [ ] Twitter Card tags complete
- [ ] Organization JSON-LD expanded with full fields per Phase 8.1
- [ ] WebSite JSON-LD present with SearchAction (where applicable)
- [ ] LocalBusiness JSON-LD present (local services only) with full NAP, geo, hours, priceRange
- [ ] FAQPage JSON-LD matches visible FAQ block (when present)
- [ ] All schema validates in Google Rich Results Test
- [ ] GA4 tracking script present with client's Measurement ID
- [ ] SERP intent validation completed and documented in homepage brief

### Entity SEO
- [ ] Brand name in first sentence of hero or sub-headline
- [ ] Brand name bolded at calibrated density (1 per 120–140 words)
- [ ] Expert attribution in About snippet with credentials
- [ ] Category entity terms across hero, Services/Products H2, About snippet
- [ ] Location modifier placed (local services: title, H1 or H2, first 100 words, above-the-fold NAP, Service Areas)
- [ ] Zero bare "we" violations (unless client override active)

### E-E-A-T Signals (Multi-Dimensional)
- [ ] **Trust:** above-the-fold trust bar with 3–5 signals
- [ ] **Trust:** HTTPS across entire site
- [ ] **Trust:** clear contact path (phone, email, or contact link in nav and footer)
- [ ] **Trust:** all policy links in footer (About, Contact, Privacy, Terms, Editorial Policy, Corrections Policy)
- [ ] **Trust:** NAP consistency verified across site, GBP, directories (local)
- [ ] **Trust:** testimonials with named customers and specific quotes
- [ ] **Experience:** original hero photography, video, or brand-aligned composition (no generic stock)
- [ ] **Experience:** customer logo strip with minimum 6 logos
- [ ] **Experience:** featured case study excerpt with quantified outcome
- [ ] **Experience:** real team or founder photo in About snippet
- [ ] **Expertise:** founder or expert credentials visible (About snippet or trust bar)
- [ ] **Expertise:** named methodology documented in How We Work section
- [ ] **Authoritativeness:** recognizable customer logos displayed
- [ ] **Authoritativeness:** press mentions, award badges, or industry association logos where available

### 5-Second Test
- [ ] What does this brand do? Clear in hero H1 and sub-headline
- [ ] Who does it serve? Clear in hero, sub-headline, or Services preview
- [ ] Why trust it? Clear from above-the-fold trust bar
- [ ] What action do I take next? Clear from primary CTA button

### Content Quality
- [ ] Information gain elements present (named methodology, proprietary positioning, quantified claims, original visuals)
- [ ] Named methodology documented with 3–5 steps
- [ ] Zero banned phrases (Core Standards Phase 8 + client-specific additions)
- [ ] Zero AI artifact structures (binary contrasts, one-word fragments, em-dash reveals)
- [ ] Human editorial pass completed
- [ ] Word count on target per homepage class
- [ ] People-first content check passed (Core Standards Phase 14.4)

### Section Structure
- [ ] Top announcement bar (where active campaign warrants)
- [ ] Main navigation with 4–7 items and primary CTA button
- [ ] Hero with H1, sub-headline, primary CTA, secondary CTA or trust signal, imagery
- [ ] Above-the-fold trust bar with 3–5 signals
- [ ] Services / Products / Features Overview with 3–6 cards
- [ ] Primary proof section with customer logo strip (6+ logos) and featured proof
- [ ] Named Methodology section with 3–5 step framework
- [ ] Secondary proof section with 2–4 testimonials
- [ ] About / Story snippet with founder or team content
- [ ] Blog feature with 3 featured articles (where client runs a blog)
- [ ] Optional FAQ section with 4–6 Q&As
- [ ] Final CTA section with stakes-based headline and prominent CTA
- [ ] Comprehensive footer with full navigation and policy links

### CTA Cadence
- [ ] Minimum 4 CTA placements (nav, hero, mid-page, final section)
- [ ] Distributed secondary CTAs on service cards, product cards, case study cards
- [ ] All primary CTAs route to the Primary CTA URL from Parameter Sheet
- [ ] CTA copy uses action verbs matched to the offer
- [ ] Mobile sticky or thumb-reachable CTA on long homepages

### Imagery
- [ ] Hero imagery is original (photography, video, or brand-aligned composition) — NOT stock
- [ ] Hero resolution minimum 2000×1200 px
- [ ] Hero image optimized under 300 KB (WebP/AVIF preferred)
- [ ] Hero image preloaded for LCP optimization
- [ ] Customer logos consistent sizing and treatment
- [ ] Press and award badges sized smaller than customer logos
- [ ] Service or product card icons consistent style
- [ ] All images lazy-loaded below the fold
- [ ] Descriptive alt text on every image

### Navigation
- [ ] Main navigation 4–7 items
- [ ] Primary CTA button in navigation
- [ ] Mobile hamburger or bottom-bar pattern functional
- [ ] Tap targets minimum 48×48 px
- [ ] Search accessible (e-commerce and large sites)
- [ ] Cart icon with item count (e-commerce)
- [ ] Footer carries full site architecture

### Conversion Path
- [ ] Primary conversion path clearly dominant
- [ ] Secondary paths available without distracting from primary
- [ ] Form fields 3–5 maximum for first contact
- [ ] Form labels and submit copy clear
- [ ] CTA copy uses action verbs matched to offer

### Design & Performance
- [ ] Container max-width, spacing, typography per client design system
- [ ] Mobile above-the-fold stacks cleanly with value prop and CTA visible
- [ ] Responsive tested at 320px, 768px, 1024px, 1440px
- [ ] Core Web Vitals within tighter homepage targets (LCP under 2.0s, CLS under 0.05, INP under 150ms)
- [ ] Accessibility: skip-link, semantic landmarks, keyboard navigation, ARIA labels

### Site-Wide Integration
- [ ] Homepage URL listed first in `llms.txt` under Key Pages (Phase 14.4)
- [ ] Homepage Organization schema referenced by `@id` from every other page on the site
- [ ] Header logo on every page links to homepage
- [ ] Footer "Home" link (where applicable) on every page
- [ ] Breadcrumb root (on downstream pages with breadcrumbs) links to homepage
- [ ] Homepage OG image set for social sharing (1200×630, brand-aligned)
- [ ] Monthly freshness review cadence documented

### Sitemap & Indexing
- [ ] Homepage URL in sitemap.xml with priority 1.0
- [ ] `<lastmod>` reflects most recent meaningful modification
- [ ] Homepage submitted to Google Search Console on first publish
- [ ] Google Business Profile linked (local businesses)

---

## Quick Reference: The Non-Negotiables

Ten rules that override everything else when time is short:

1. 5-Second Test passes: what, who, why trust, what next — all answerable above the fold
2. Original hero imagery — no generic stock photography
3. Above-the-fold trust bar with 3–5 signals
4. Customer logo strip with minimum 6 recognizable logos (where permission allows)
5. Named methodology documented as the information gain anchor
6. Organization JSON-LD expanded with full fields, declared once on the homepage and referenced by `@id` from every other page
7. Primary CTA present in navigation, hero, mid-page, and final section
8. Footer carries full site architecture and all policy links
9. NAP consistency across site, GBP, and directories (local businesses)
10. Homepage listed first in client's `llms.txt` under Key Pages

Everything else matters. These ten are the floor.

---

*Version 1.0 — April 2026 — ROI.LIVE / Jason Spencer*
*Inherits from ROI.LIVE Agency Core Standards v1.1.*
