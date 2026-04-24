# ROI.LIVE Agency Blog Article SOP
**Version:** 1.1 — April 2026
**Applies to:** Every blog article published on a client website ROI.LIVE produces or manages
**Owner:** Jason Spencer, Founder — ROI.LIVE
**Inherits from:** ROI.LIVE Agency Core Standards v1.1

> This SOP specifies the rules unique to blog articles on client websites. Rules not specified here fall back to the Agency Core Standards base document. Rules specified here override the base for blog article production.

---

## TABLE OF CONTENTS

1. Article Intent & Definition
2. Cluster Architecture (Pillar vs Supporting)
3. Pre-Build Research
4. URL, Title & Metadata Architecture
5. Article Page Structure
6. Section Composition
7. Word Count & Keyword Placement
8. Blog-Specific Schema
9. Blog Design System (Variable by Client)
10. Accent Color System
11. Hub Page & llms.txt Integration
12. Internal Linking (Blog-Specific)
13. Content Freshness (Blog-Specific)
14. QA Verification Checklist

---

## Phase 1 — Article Intent & Definition

### 1.1 What a Blog Article Is
A blog article is editorial content targeting informational or commercial investigation intent. Blog articles educate the reader, build topical authority for the client brand, and feed internal links to commercial pages (service pages, product pages, case studies, homepage).

### 1.2 What a Blog Article Is Not
- A product description (belongs on a product page)
- A service landing page (belongs on a service page)
- A testimonial collection (belongs on a case study or dedicated social proof page)
- A company announcement (belongs on an about or news page)

If the primary intent is transactional or navigational, the piece is not a blog article. Route it to the correct page-type SOP.

### 1.3 Two Article Classes
Every blog article falls into one of two classes:
- **Pillar article:** broad-topic cluster anchor, higher word count, links out to every supporting article in the cluster
- **Supporting article:** narrow-topic cluster member, shorter word count, links up to the pillar and laterally to cluster peers

Each cluster has one pillar and 8–24 supporting articles.

---

## Phase 2 — Cluster Architecture

### 2.1 Cluster Composition
Before producing any article, the client's cluster plan exists as a published document. The cluster plan specifies:
- Cluster theme (the topical authority domain)
- Pillar article slug, primary keyword, target word count (3,500–5,000)
- Supporting article slugs, primary keywords, target word counts (2,000–2,800)
- Internal linking map (pillar to supporting, supporting to each other)
- Target commercial page(s) the cluster feeds links to (service pages, product pages, case studies, homepage)
- Accent color assignment per article
- Information gain element assignment per article (so the same proprietary data does not recycle across articles)

### 2.2 Cluster Integrity Rules
- Zero repetition of industry examples across cluster articles. No two supporting articles use the same case study, the same hero statistic, or the same opening hook.
- Each article in a cluster covers a distinct subtopic. Topical overlap across articles breaks cluster integrity.
- Each article has a unique accent color (see Phase 10).
- Information gain elements do not repeat across cluster articles. The proprietary data used in article A does not appear as the proprietary data in article B.

### 2.3 Cluster Launch Order
Publish in this order to build topical authority fastest:
1. Pillar
2. Highest-volume supporting article
3. Supporting articles with strongest commercial intent
4. Remaining supporting articles

---

## Phase 3 — Pre-Build Research

Complete before writing a single word or line of code.

### 3.1 Keyword Research
- Confirm primary keyword from the cluster plan
- Verify monthly search volume via SE Ranking, DataForSEO, or Google Keyword Planner (Core Standards Phase 9)
- Identify 3–5 semantic variant keywords with verified volume
- Confirm cluster position (pillar or supporting)

### 3.2 SERP Intent Validation
Per Core Standards Phase 9.5, validate SERP intent match before production:
- Pull the current top 10 organic results for the primary keyword
- Confirm content type match (if the SERP shows product pages and tools for a keyword, a blog article will struggle)
- Check for AI Overview presence and which sources get cited
- Check for People Also Ask questions — these often surface FAQ opportunities
- Check for featured snippets and note the format (paragraph, list, table)
- Document findings in the cluster plan's per-article brief

If the SERP signals a content type mismatch, revise the article angle or move the keyword to a different page type before production starts.

### 3.3 Read Existing Client Content
- Read every article already published on the client site across all clusters, not the current cluster alone
- Note which articles are live so internal linking stays precise and non-duplicative
- Map 3 articles for the Related Content section — each different, no duplicates with other articles' Related Content cards where avoidable

### 3.4 Forward-Link Map
- Reference the full cluster map to identify future articles worth forward-linking
- Forward-link unwritten cluster articles using their planned URL slug (Core Standards Phase 10.4)

### 3.5 Information Gain Source Gathering
- Identify which of the 8 information gain elements (Core Standards Phase 5.2) this article carries
- Minimum three elements, at least one client-specific
- Gather the data, frameworks, case study numbers, or original visual assets before outlining

### 3.6 E-E-A-T Signal Planning
Per Core Standards Phase 4, every article demonstrates E-E-A-T signals. Before outlining, plan which signals appear where:

- **Experience:** What first-hand experience will the expert bring to this piece? Which clients, projects, or results will be cited by name? What original photography or visual assets will be created?
- **Expertise:** Which credentials of the author/expert are relevant to this topic? Which authoritative external sources will be cited?
- **Authoritativeness:** Which industry entities, authorities, or co-citation opportunities will appear in the piece?
- **Trust:** Are all cited claims source-documented? Will the article need a disclaimer (YMYL topics)?

Document the E-E-A-T signal plan in the article brief.

---

## Phase 4 — URL, Title & Metadata Architecture

### 4.1 URL Slug
- Format: `/blog/[primary-keyword-phrase]` or the client's CMS convention documented in the Parameter Sheet
- Keyword-first, lowercase, hyphens between words
- No stop words unless essential for readability
- Match the URL slug from the cluster plan

### 4.2 Title Tag
- Primary keyword appears first
- Follow with a colon and benefit or context framing
- Format: `Primary Keyword: Compelling Benefit or Context`
- Target length 50–60 characters

### 4.3 Meta Description
- 140–160 characters
- Primary keyword in the first 20 words
- Benefit-driven, plain-language framing for the client's target reader
- Zero keyword stuffing. The copy reads like a human wrote it.
- Functions as an AI micro-answer per Core Standards Phase 7.6 — specific, factual, direct

### 4.4 H1
- Semantic variation of the primary keyword, not an exact repeat of the title tag
- More editorial or provocative than the title tag where the voice profile supports it
- Keyword concepts present but phrased differently

### 4.5 H2 and H3 Rules
- Minimum 2 H2s or H3s contain related entity terms relevant to the article's cluster
- Entity terms drawn from the cluster's topical entity map (maintained in the cluster plan)
- Headings read as natural prose. No keyword-stuffed strings.

---

## Phase 5 — Article Page Structure

Every article on every client site follows this layout order. Design tokens (colors, typography) vary per client. Structure does not.

```
<head>
  ├── Title tag (keyword-first)
  ├── Meta description
  ├── Canonical URL (absolute)
  ├── OG tags: type, title, description, URL, image, site_name
  ├── Twitter Card tags (summary_large_image)
  ├── Article JSON-LD (with speakable)
  ├── FAQPage JSON-LD
  ├── BreadcrumbList JSON-LD
  └── Client-specified fonts

<body>
  ├── Navigation (client's standard nav)
  ├── Reading Progress Bar (optional per client design system)
  ├── Hero Section
  │    ├── Hero Badge (category label)
  │    ├── Publish date + read time
  │    ├── H1 headline
  │    ├── Deck / subheadline
  │    └── Author block (expert from Client Parameter Sheet)
  │         ├── Author name + title
  │         ├── Headshot
  │         └── Link to author bio page (Core Standards Phase 4.7)
  ├── Breadcrumb Bar
  ├── Stats Strip (4 key statistics)
  ├── Article Body (single-column or two-column with sidebar per client design)
  │    ├── Intro paragraph (class="page-intro"; primary keyword + brand name in first sentence)
  │    ├── Section H2s with entity terms in headings
  │    ├── Direct Answer Callout (optional, for high-intent informational queries)
  │    ├── Mid-article Pillar Callout Block (supporting articles only)
  │    ├── Mid-article CTA Banner
  │    ├── Data tables / stat grids / visual assets
  │    ├── Expert Take section (class="expert-take-body")
  │    ├── FAQ Block (4–5 visible Q&As)
  │    └── Related Content Section (3 cards)
  ├── Sidebar (desktop, if two-column layout)
  │    ├── Table of Contents (smooth scroll)
  │    ├── Key Stat Callout
  │    ├── Quick-Win Checklist
  │    ├── Primary CTA (from Parameter Sheet)
  │    └── Cluster Index (links to related cluster articles)
  └── Footer (client's standard footer)
```

Two-column versus single-column is a per-client design system decision documented in the Client Parameter Sheet. Both layouts carry all content blocks above.

---

## Phase 6 — Section Composition

Every article contains the following, in order:

### 6.1 Opening Hook
Lead with the business problem or a specific number. Avoid definitions and history-lesson openings. The reader feels their situation described in the first two sentences. Primary keyword appears in the first 100 words. Brand name appears in the first sentence of body content.

### 6.2 What It Means for the Reader
Connect the topic to revenue, leads, or competitive position for the client's target reader. Make the stakes personal to the reader's business.

### 6.3 Data / Research Layer
Specific statistics, benchmarks, studies. Real numbers with sources. Search the web for current data before writing. Never fabricate statistics. This section anchors one of the article's information gain elements.

### 6.4 The Mechanism
How it works, explained plainly. Use the simplest accurate language. When a concept needs a technical term, define it in the same sentence.

### 6.5 What to Do About It
Numbered action framework. Practical. Specific enough that a reader could act on step 1 today. Named frameworks (Core Standards Phase 5.2 element #2) often live in this section.

### 6.6 Expert Take Section
First-person commentary from the named expert (Client Parameter Sheet). Attributed with credentials. Speaks directly to the reader. Class `.expert-take-body` on the wrapping element for speakable extraction. 3–6 paragraphs.

**E-E-A-T Experience signal requirements for this section:**
- First-person language the expert would use ("After running this process with 40+ HVAC contractors, the pattern became clear...")
- Specific client names or descriptive client framing ("a 3-location HVAC business in the Southeast")
- Quantified outcomes from real engagements
- Operational detail that shows the work happened, not just research summaries

### 6.7 FAQ Block
4–5 natural questions the target reader would ask. Each answer 2–4 sentences. Each answer mentions the brand or expert at least once. The block matches FAQPage JSON-LD one-to-one. Visible on page load, not hidden behind accordions that do not open programmatically.

### 6.8 Related Content Section
3 cards linking to other cluster articles. Each card: article title, 1-sentence teaser, accent-colored arrow. No duplicates with other articles' Related Content cards where avoidable.

---

## Phase 7 — Word Count & Keyword Placement

### 7.1 Word Count Targets
- Pillar article: 3,500–5,000 words
- Supporting article: 2,000–2,800 words
- E-commerce niche clients may run tighter (pillar 2,500–3,500, supporting 1,500–2,200). Document the override in the Client Parameter Sheet Section 11.

### 7.2 Primary Keyword Placement (Required)
- Title tag (first position)
- H1 (semantic variation)
- Meta description (first 20 words)
- First 100 words of body content
- At least 2 H2 or H3 headings
- Throughout body: natural density, no forced repetition (Core Standards Phase 1.1)

### 7.3 Brand Name Placement
Calibrated to 1 instance per 120–140 words (Core Standards Phase 3.2). First instance in the first sentence of body content. Bolded (or client's designated emphasis style) on every body-prose instance.

### 7.4 Expert Attribution Placement
Calibrated to 1 instance per 180–220 words (Core Standards Phase 3.3). Full credentials on at least two instances per article. Present in Expert Take section and in at least 2 FAQ answers. Byline links to the expert's dedicated author bio page (Core Standards Phase 4.7).

### 7.5 Stats Strip (Top of Article)
4-stat strip below the hero. Stats must be:
- Real, sourced, current (search for data before building)
- Framed as reader stakes, not technical trivia
- Example format: "73% of AI Overview citations come from outside the top 10 organic results"

### 7.6 Mid-Article Pillar Callout (Supporting Articles Only)
Supporting articles contain a styled callout block mid-article driving readers back to the pillar:

> **Related:** [Pillar article title] → `/blog/[pillar-slug]`
> One sentence explaining why the pillar completes the picture.

### 7.7 Mid-Article CTA Banner
Every article contains one inline CTA banner positioned at the two-thirds mark:
- Headline: provocative, stakes-based
- Subtext: 1–2 sentences connecting article topic to client's offering
- Button: client's primary CTA copy linking to primary CTA URL (from Parameter Sheet)

---

## Phase 8 — Blog-Specific Schema

Inherits Core Standards Phase 12. Blog-specific requirements:

### 8.1 Article JSON-LD (Required Fields)

Every article carries Article schema with all fields populated. Update the `mentions` array per article. Never copy from another article's template.

Required fields:
- `@context`, `@type: Article`
- `headline` (exact match to H1)
- `description` (exact match to meta description)
- `url` (canonical URL)
- `datePublished`, `dateModified`
- `mainEntityOfPage` (references the page URL as `@id`)
- `image` (OG image URL)
- `author` (references Person `@id` from Parameter Sheet, which resolves to the expert's author bio page per Core Standards Phase 12.2)
- `publisher` (references Organization `@id` from Parameter Sheet)
- `about` (primary topic entity for this article)
- `mentions` (4–8 specific entities this article discusses — article-specific)
- `speakable` (cssSelector array: `.page-intro`, `.expert-take-body`)

### 8.2 FAQPage JSON-LD (Required)
Matches the visible FAQ block one-to-one. Same questions, same answers, same order.

### 8.3 BreadcrumbList JSON-LD (Required)
Matches the visible breadcrumb bar one-to-one.

### 8.4 Forbidden Patterns
- Copying `mentions` arrays from one article's schema to another
- Declaring `author` inline (Person data) instead of referencing the site-wide Person schema by `@id`
- Including FAQ schema for questions not visible on the page

---

## Phase 9 — Blog Design System (Variable by Client)

The design system for each client's blog is documented in the Client Parameter Sheet. Agency-standard structural elements every client's blog design must accommodate:

### 9.1 Required Design Elements
- Hero section with category badge and author block (author block links to author bio page)
- Breadcrumb bar
- Stats strip (4 stats, treatment distinct from surrounding body)
- Article body typography with clear H1/H2/H3 hierarchy
- Mid-article CTA banner
- Expert Take section with distinct visual treatment
- FAQ block with expandable items that remain visible and extractable
- Related Content cards (3 cards, hoverable)

### 9.2 Optional Design Elements (Per Client)
- Reading progress bar
- Two-column layout with sticky sidebar
- Scroll-reveal animations
- Accent-color-driven hero treatments

### 9.3 Typography Baseline (Overridable by Client)
- Clear distinction between headings and body
- Body line-height 1.6–1.8
- Body font-size 16px or larger on desktop, 15–16px on mobile
- Contrast ratio 7:1 minimum for body text against background

### 9.4 Responsive Baseline
- Two-column layouts collapse to single-column below 900px
- Sidebar elements (TOC, CTA, cluster index) stack inline on mobile or move to a fixed-bottom CTA bar
- Stats strip wraps 4-across to 2-across to 1-column

---

## Phase 10 — Accent Color System

Each article in a cluster has a unique accent color flowing through hero badge, stats strip numbers, mid-article CTA hover state, Related Content card arrows, and sidebar CTA hover.

### 10.1 Rules
- No two adjacent articles in a cluster share the same accent color
- Accent colors pulled from the client's design token palette (Parameter Sheet) or calculated as tonal variants of the client's primary/secondary/accent colors
- Document the accent color assignment in the cluster plan at planning stage
- Pillar article uses the cluster's anchor accent. Supporting articles rotate through palette variants.

### 10.2 Assignment Documentation
The cluster plan contains an accent color assignment table:

| Article Slug | Accent Color (Hex) |
|---|---|
| cluster-pillar-slug | `#XXXXXX` |
| supporting-article-1 | `#XXXXXX` |
| ... | ... |

---

## Phase 11 — Hub Page & llms.txt Integration

### 11.1 Hub Page Update (Required on Every Publish)
The client's blog hub page updates every time a new article publishes:
- **New article in existing cluster:** Add article card (title, 1-sentence teaser, accent-colored arrow) to the correct cluster section
- **New cluster launch (pillar article):** Create a new cluster section on the hub with its own header, accent identity, 1–2 sentence description, and the pillar article card. Add supporting article cards as they publish.

### 11.2 Hub Page Content Requirements
Every client blog hub contains:
- Client brand nav (site-wide)
- Page H1 ("Blog" or the client's branded hub name)
- Introductory paragraph with brand name and primary topical focus
- Cluster sections, each with its own H2 and description
- Article cards within each cluster section
- Footer (site-wide)

### 11.3 Hub Page Schema
Hub pages carry:
- CollectionPage JSON-LD with `mainEntity` as an ItemList of article URLs
- BreadcrumbList JSON-LD
- Organization reference by `@id`

### 11.4 llms.txt Integration (Required on Every Publish)
Per Core Standards Phase 7.2, every new article gets added to the client's `llms.txt` file in the Key Content section. Format:

```
- [Article Title](https://clientsite.com/blog/slug): [One-sentence summary]
```

**Which articles go in llms.txt:**
- Every pillar article (always)
- Supporting articles that represent the highest information gain elements, the strongest data, or the strongest expert commentary
- Target: top 15–25 articles per client blog, not every article

Review the llms.txt Key Content section quarterly. Remove underperforming entries. Swap in newer high-signal articles.

### 11.5 llms-full.txt Update (When Applicable)
For clients with 50+ editorial articles, update `llms-full.txt` to include the new article's full text per Core Standards Phase 7.3.

---

## Phase 12 — Internal Linking (Blog-Specific)

Inherits Core Standards Phase 10. Blog-specific additions:

### 12.1 In-Body Link Density
- Pillar article: 13–32 contextual internal links
- Supporting article: 8–20 contextual internal links

### 12.2 Cluster Link Symmetry
- Every supporting article links to the cluster pillar at least once in body (beyond the mid-article pillar callout)
- Every supporting article links to at least 3 other supporting articles in the same cluster
- Pillar article links to every supporting article in the cluster

### 12.3 Cross-Type Links Per Article
- At least 2 links from each article to the client's commercial pages (service, product, case study, or homepage) where contextually relevant
- Anchor text descriptive and keyword-rich per Core Standards Phase 10.2

### 12.4 Cross-Cluster Links
- Every article links to at least 2 articles from each other live cluster on the client's blog (builds topical bridges, prevents silos)
- As new clusters launch, expand this rule to cover them

### 12.5 Cross-Link Symmetry
Every live article links to every other live article at least once. As new articles publish, add contextual links in all prior articles. This is ongoing maintenance, not a one-time setup.

### 12.6 Author Bio Page Linking
Every article byline links to the expert's dedicated author bio page (Core Standards Phase 4.7). The bio page also receives link equity from every article — audit quarterly to ensure the bio page is indexed and accumulating signals.

---

## Phase 13 — Content Freshness (Blog-Specific)

Inherits Core Standards Phase 15. Blog-specific additions:

### 13.1 Freshness Review Cadence
- **Pillar articles:** quarterly review (every 90 days)
- **Supporting articles:** semi-annual review (every 180 days)
- **YMYL articles:** 6-month review regardless of pillar/supporting status (Core Standards Phase 15.5)

### 13.2 Per-Article Refresh Pass
Every refresh pass for a blog article includes:
- Statistics and data points updated to current figures
- Screenshots, visuals, and tool references refreshed
- Internal links expanded to include newly published cluster articles
- FAQ section reviewed and expanded based on current reader questions (pulled from Google Search Console query data, People Also Ask, and customer service logs where available)
- Keyword targeting re-verified against current SERP
- `dateModified` updated in schema and visible byline
- Refresh documented in the client's SEO log

### 13.3 Refresh-Trigger Events (Blog-Specific)
Events that trigger immediate refresh outside the scheduled cycle:
- Article drops 3+ positions in primary keyword ranking
- Article stops appearing in AI Overview citations where it previously appeared
- A cluster-peer article is published that would strengthen internal links if added
- A new client case study becomes available that fits this article's topic
- Client service or product change affects a referenced example in the article

### 13.4 Retirement Protocol
When a blog article no longer serves the cluster or the reader:
- Redirect to the most relevant surviving article if content overlap exists
- Merge content into another article and redirect if partial overlap exists
- Update and re-position within the cluster if the topic still matters
- 410 Gone if the topic is no longer relevant to the client's business

Document retirement decisions in the client's SEO log.

---

## Phase 14 — QA Verification Checklist

Run every item before an article goes live. Combine with Core Standards Phase 16 pre-publication gates.

### SEO / Technical
- [ ] Title tag keyword-first, 50–60 characters
- [ ] Meta description 140–160 characters, keyword in first 20 words, written as AI micro-answer
- [ ] Canonical URL correct and absolute
- [ ] One H1, semantic keyword variation (not exact title repeat)
- [ ] H2/H3s contain at least 2 cluster entity terms
- [ ] Primary keyword in first 100 words
- [ ] OG tags complete: type, title, description, URL, image, site_name
- [ ] Twitter Card tags complete
- [ ] Article JSON-LD with author `@id`, publisher `@id`, `about`, article-specific `mentions`, `speakable`, `mainEntityOfPage`, `image`
- [ ] FAQPage JSON-LD matches visible FAQ block one-to-one
- [ ] BreadcrumbList JSON-LD matches visible breadcrumb
- [ ] GA4 tracking script with client's Measurement ID
- [ ] All schema validates in Google Rich Results Test
- [ ] SERP intent validation completed and documented in article brief

### Entity SEO
- [ ] Brand name bolded at calibrated density (1 per 120–140 words)
- [ ] Brand name in first sentence of body
- [ ] Expert attribution at calibrated density (1 per 180–220 words)
- [ ] Expert attribution with full credentials at least twice
- [ ] Expert byline links to dedicated author bio page (Core Standards Phase 4.7)
- [ ] Zero bare "we" violations (unless client override active per Parameter Sheet)
- [ ] `.page-intro` class on opening paragraph
- [ ] `.expert-take-body` class on Expert Take body text

### E-E-A-T Signals
- [ ] **Experience:** first-person experience language present in Expert Take section
- [ ] **Experience:** at least one specific client example or quantified outcome cited
- [ ] **Experience:** original photography or visual asset included (not stock)
- [ ] **Expertise:** author bio page linked from byline
- [ ] **Expertise:** at least 2 citations to authoritative external sources where claims require them
- [ ] **Authoritativeness:** at least one co-citation (brand mentioned alongside recognized industry authority)
- [ ] **Trust:** every data claim cited with verifiable source
- [ ] **Trust:** YMYL disclaimer present if topic triggers YMYL handling (Core Standards Phase 4.5)

### Content Quality
- [ ] Information gain elements present (minimum 3, at least 1 client-specific)
- [ ] Zero banned phrases (Core Standards Phase 8 + client-specific additions)
- [ ] Zero AI artifact structures (binary contrasts, one-word fragments, em-dash reveals)
- [ ] Human editorial pass completed
- [ ] All data points cited with source
- [ ] Word count on target (pillar 3,500–5,000 or client override; supporting 2,000–2,800 or client override)
- [ ] People-first content check passed (Core Standards Phase 14.4)

### Structure
- [ ] Hero with category badge, date, read time, author block (bio page linked)
- [ ] Stats strip with 4 real sourced stats
- [ ] Opening hook present
- [ ] Data/Research layer present
- [ ] Mechanism section present
- [ ] Action framework present (numbered or stepped)
- [ ] Expert Take section present with class `.expert-take-body`
- [ ] FAQ block (4–5 Q&As) visible on page load
- [ ] Related Content section (3 cards, all different destinations)
- [ ] Mid-article Pillar Callout (supporting articles only)
- [ ] Mid-article CTA Banner with client's primary CTA URL

### Internal Linking
- [ ] Pillar: 13–32 contextual links; Supporting: 8–20
- [ ] Every other live article in same cluster linked at least once
- [ ] At least 2 articles from each other live cluster linked
- [ ] At least 2 commercial page links (service, product, case study, or homepage)
- [ ] All anchor text descriptive and keyword-rich
- [ ] Forward links to planned cluster articles included
- [ ] 3 Related Content cards, each a different destination
- [ ] Byline links to author bio page

### Design
- [ ] Hero matches client design tokens from Parameter Sheet
- [ ] Accent color assigned and used throughout (hero badge, stats, CTA hover, Related Content arrows)
- [ ] Accent color unique versus adjacent cluster articles
- [ ] Typography follows client design system
- [ ] Responsive tested at 320px, 768px, 1024px, 1440px
- [ ] Images optimized (WebP/AVIF, descriptive alt, under 200KB where possible)
- [ ] Core Web Vitals within targets (LCP under 2.5s, CLS under 0.1, INP under 200ms)

### Site-Wide Integration
- [ ] Blog hub page updated with new article card in correct cluster section
- [ ] New cluster section created on hub if this is a new cluster's pillar
- [ ] All existing blog articles audited for inbound link opportunities to the new article
- [ ] All existing case study, service, and product pages audited for inbound link opportunities
- [ ] Homepage audited for inbound link opportunities
- [ ] Article added to `llms.txt` Key Content section (if selected as high-signal article per Phase 11.4)
- [ ] `llms-full.txt` updated with article full text (where applicable per Phase 11.5)
- [ ] Freshness review cadence documented for this article (quarterly for pillar, semi-annual for supporting, 6-month for YMYL)

### Sitemap & Indexing
- [ ] Article URL added to sitemap.xml
- [ ] `<lastmod>` set to publish date
- [ ] Priority: pillar 0.8, supporting 0.6
- [ ] Sitemap URL referenced in robots.txt
- [ ] Article URL submitted to Google Search Console for crawl

---

## Quick Reference: The Non-Negotiables

Eight rules that override everything else when time is short:

1. Brand name bolded at calibrated density, in the first sentence of body content
2. Expert attribution with credentials at calibrated density, byline linked to author bio page
3. Zero bare "we" (unless client override active)
4. Primary keyword in title (first position), H1 (variation), and first 100 words
5. Article JSON-LD + FAQPage + BreadcrumbList on every article
6. `mentions` array article-specific, never copied from another article
7. Hub page updated + sitemap updated + GSC submitted on every publish
8. Article added to client's `llms.txt` on publish (where article qualifies per Phase 11.4)

Everything else matters. These eight are the floor.

---

*Version 1.1 — April 2026 — ROI.LIVE / Jason Spencer*
*Inherits from ROI.LIVE Agency Core Standards v1.1.*

*Changes from v1.0:*
*Updated inheritance to Core Standards v1.1.*
*Added Phase 3.2 SERP Intent Validation as a pre-build research step.*
*Added Phase 3.6 E-E-A-T Signal Planning before outlining.*
*Added E-E-A-T Experience signal requirements to Expert Take Section composition (Phase 6.6).*
*Added author bio page linking requirements throughout: hero author block (Phase 5), byline and expert attribution (Phase 7.4), schema author reference (Phase 8.1), internal linking (Phase 12.6).*
*Added Phase 11.4 llms.txt Integration and Phase 11.5 llms-full.txt Update requirements on every publish.*
*Added Phase 13 — Content Freshness (Blog-Specific) with review cadence, refresh pass procedure, trigger events, and retirement protocol.*
*Updated QA Checklist with new E-E-A-T Signals section, author bio linking verification, SERP intent validation, llms.txt integration, freshness cadence documentation, and people-first content check.*
*Expanded Non-Negotiables from 7 to 8 with llms.txt addition.*
