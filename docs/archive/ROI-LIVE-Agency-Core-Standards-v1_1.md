# ROI.LIVE Agency Core Standards — SEO, AEO, Entity & Brand Framework
**Version:** 1.1 — April 2026
**Applies to:** Every page of every client website ROI.LIVE produces or manages
**Owner:** Jason Spencer, Founder — ROI.LIVE
**Status:** Base-layer document. All page-type SOPs inherit from this.

> This is the foundational standards document for all content produced by ROI.LIVE on client websites. Every page-type SOP (Blog Article, Service Page, Product Page, Collection Page, Case Study, Homepage, About) inherits the rules in this document. When a page-type SOP does not override a rule, the rule in this document applies by default.

---

## TABLE OF CONTENTS

1. Core SEO Philosophy
2. Client Parameter Intake
3. Entity SEO Framework (Casey Keith Method)
4. E-E-A-T Framework (Experience, Expertise, Authoritativeness, Trust)
5. Information Gain Framework
6. AEO / GEO Patterns
7. AI Search Optimization & llms.txt
8. AI Writing Artifact Bans (Universal)
9. Keyword Research Methodology
10. Internal Linking Philosophy
11. Off-Page SEO & Brand Authority Building
12. Schema Architecture Baseline
13. Technical SEO Baseline
14. Helpful Content System Alignment
15. Content Freshness & Maintenance
16. Content Quality Gates
17. Site-Wide Integration Rules
18. Sitemap & Indexing Standards
19. Reporting & Measurement Baseline
20. Document Relationships

---

## Phase 1 — Core SEO Philosophy

### 1.1 Entity Salience Over Keyword Density
ROI.LIVE optimizes for entity salience and information gain. Keyword density targets do not apply. Stuffing a primary keyword 30 times into 2,000 words signals low quality to modern search systems and degrades AI answer engine extraction. What signals authority: the client brand entity, the person entity behind the brand, related topical entities, schema-based entity declaration, and consistent entity mention patterns across the full site.

### 1.2 Information Gain As The Ranking Signal
Google's helpful content system and AI answer engines reward pages that contribute something new to the web. Every piece of content produced for a client must clear the information gain bar. If the page reformats commodity content already ranking on page one, it does not get published.

### 1.3 Topical Authority Over One-Off Ranking
Client SEO work operates at the cluster level. A single page cannot sustain rankings for competitive commercial intent keywords without a surrounding cluster of content that demonstrates topical depth. Every client engagement builds cluster architecture before publishing individual pieces.

### 1.4 E-E-A-T As The Credibility Layer
E-E-A-T (Experience, Expertise, Authoritativeness, Trust) is Google's primary quality evaluation framework. It is not a direct ranking factor, but every underlying ranking signal passes through this framework. Every page on every client site must demonstrate E-E-A-T signals. See Phase 4 for full requirements.

### 1.5 Answer Engine Optimization (AEO)
Structure content to be extractable by AI answer engines: Google AI Overviews, ChatGPT, Perplexity, Claude, Gemini. This means entity-declared schema, speakable-marked passages, question-and-answer structure in FAQ blocks, and explicit answer snippets in the first 100 words of each section. See Phases 6 and 7.

### 1.6 Conversion-First Commercial Pages
Commercial pages (service, product, homepage) balance SEO/AEO signals with conversion mechanics. A service page that ranks but does not convert is not a win. Conversion structure comes first. SEO signals layer on top without compromising the conversion architecture.

### 1.7 Site-Wide Quality Hygiene
Google's Helpful Content System evaluates the overall site, not individual pages alone. A site with a substantial portion of unhelpful content sees rankings drop across the entire domain. Site-wide quality is every engagement's baseline concern, not a finishing touch. See Phase 14.

---

## Phase 2 — Client Parameter Intake

Every client engagement begins with a completed Client Parameter Sheet. This document defines the variable values that all downstream SOPs reference. Finish the Parameter Sheet before any content work begins.

### 2.1 Required Parameters

**Brand Identity:**
- Client brand name (exact casing, e.g., "Rage Create" or "ROI.LIVE")
- Alternate brand names / aliases
- Brand website root URL
- Brand logo URL(s)
- Brand favicon URL

**Expert / Author Entity:**
- Primary attributed expert name
- Title / credentials
- `@id` identifier for schema (e.g., `https://clientsite.com/#founder-name`)
- `sameAs` URLs (LinkedIn, Twitter/X, author bio page)
- Bio/boilerplate paragraph for author cards
- Headshot URL (minimum 400×400 px)
- Dedicated author bio page URL on the client site (see Phase 4.7)

**Voice Profile:**
- Tone characteristics (3–5 traits written as specific descriptors, not adjectives like "professional")
- Target reader (who the content speaks to, stated as a persona)
- First-person pronoun rule (brand uses "we" or always names the brand)
- Client-specific banned phrases (in addition to the universal bans in Phase 8)
- Industry-specific language preferences and prohibitions

**Design Tokens:**
- Primary brand color (hex)
- Secondary brand color (hex)
- Accent color(s) (hex)
- Heading font (name + Google Fonts or self-hosted URL)
- Body font (name + Google Fonts or self-hosted URL)
- Button style conventions (radius, padding, hover state)
- Dark/light theme preferences

**Business Context:**
- Primary business model (service, e-commerce, SaaS, local service, hybrid)
- Primary geographic market (global, national, regional, local)
- Service areas (for local service businesses)
- Primary conversion action (book a call, request quote, purchase, email signup)
- Primary CTA URL
- Secondary CTA URL (where applicable)
- YMYL classification (does the client's content touch finance, health, legal, or safety topics? See Phase 4.5)

**Technical:**
- GA4 Measurement ID
- Google Search Console property
- Schema Organization `@id` (e.g., `https://clientsite.com/#organization`)
- Sitemap URL
- Robots.txt location
- CMS / platform (WordPress, Shopify, Webflow, custom HTML, etc.)
- CDN / hosting (note if Cloudflare — AI bot management check required per Phase 7.1)

### 2.2 Parameter Sheet Template
Every client engagement uses the standardized Client Parameter Sheet template stored in the agency operations folder. Verbal briefings and ad-hoc parameter definitions do not substitute for a completed sheet.

---

## Phase 3 — Entity SEO Framework (Casey Keith Method)

### 3.1 Entity Salience Definition
Entity salience is the degree to which a page makes clear what it is about, to both search engines and AI systems. Entity salience is achieved through schema declaration, consistent brand and expert naming, topical entity density in prose, structured headings that name entities, and cross-page entity consistency.

### 3.2 Brand Name Mention Calibration
Every page must demonstrate brand entity presence. Instance count scales with page length and page type. Default rule of thumb calibrated to editorial content:

- **One brand name mention per 120–140 words of prose**
- Brand name appears in the first sentence of body content (not in hero or nav counting toward the body target)
- Brand name appears bolded (or in the brand's designated emphasis style) on every body-prose instance

Page-type SOPs specify exact targets. A Blog Article SOP might require 25+ brand mentions across a 3,500-word pillar. A Service Page SOP might require 12–15 across 1,200 words. A Product Page SOP might require 6–10 across 600–800 words.

### 3.3 Expert Attribution Calibration
Every editorial page must carry the named expert entity (from the Client Parameter Sheet) at a density calibrated to page length:

- **One expert attribution per 180–220 words of prose** on editorial content
- Expert name appears with full credentials at least twice per page
- Expert attribution appears at key data claims, strategic recommendations, expert-commentary sections, and FAQ answers

Commercial pages (product, collection) use expert attribution sparingly (1–3 mentions total, typically in FAQ and a short "approach" or "method" section). E-commerce clients without a named spokesperson substitute founder or brand story attribution where appropriate.

### 3.4 Pronoun Discipline ("We" Rules)
Default rule: no bare "we" in body copy. The brand name or the named expert replaces "we" in almost every instance. Acceptable uses of "we":

1. Inside a visible FAQ answer, grammatically required, with the brand name stated in the same answer
2. Inside a testimonial or direct quote from the client's customer

Per-client overrides: some voice profiles (casual DTC e-commerce brands) permit "we" as a friendlier first-person voice. When the override is active, the Client Parameter Sheet must specify: "Pronoun rule: 'we' permitted in body copy." Without that explicit override, default rules apply.

### 3.5 Entity Consistency Across The Site
Brand entity and expert entity must use the same name on every page. No pages use "John" when others use "John Smith, Founder." No pages use "Rage Create" when others use "RageCreate." Schema `@id` values remain consistent across every page that references the same entity.

### 3.6 Entity Declaration Through Schema
Every page carries schema that declares the entities it mentions. Organization and Person schema are declared once site-wide. Every page references them by `@id` and adds `about` and `mentions` arrays specific to that page's content. See Phase 12 for full schema architecture.

---

## Phase 4 — E-E-A-T Framework (Experience, Expertise, Authoritativeness, Trust)

E-E-A-T is Google's quality evaluation framework. Google does not assign an E-E-A-T score to a page or site. Ranking systems interpret content accuracy, author credibility, links, and reputation through the E-E-A-T lens. Every page on every client site must demonstrate E-E-A-T signals at the page and site level.

### 4.1 Experience Signals
Signals that the content creator has first-hand experience with the topic. Experience matters more in 2026 than in any prior year because AI-generated content lacks experience by definition, and Google's quality systems are trained to detect the difference.

Required on editorial and commercial pages:
- First-person experience language in the expert's voice (e.g., "After running this process for 40+ HVAC contractors, the pattern became clear...")
- Specific operational detail that shows the writer has done the work (named clients where permitted, quantified outcomes, process steps)
- Original photography of the team, location, product, or process — not stock photos
- Case study embeds with specific results
- Lived-experience anecdotes that public data cannot synthesize

### 4.2 Expertise Signals
Signals of subject-matter knowledge in the topic domain.

Required on every editorial page:
- Named author with full credentials on the byline
- Link to dedicated author bio page (Phase 4.7)
- Author's Person schema with `knowsAbout` array listing topical expertise
- Educational or certification credentials where relevant (LEED, ACCA, PMP, industry certifications, degrees)
- Published track record: links to prior work, speaking engagements, podcasts, published articles

### 4.3 Authoritativeness Signals
Signals that the brand and author are recognized sources in the topic domain. Authoritativeness compounds over time through consistency, accuracy, and external recognition.

Built over time through:
- Brand mentions from authoritative sites in the topical niche (linked and unlinked both count — see Phase 11)
- Citations from academic, government, or industry-leader sources
- Wikipedia presence for the brand entity (where warranted)
- Knowledge Panel eligibility (see Phase 11.6)
- Industry awards, certifications, recognitions displayed with verification links
- Co-citations: the brand mentioned alongside recognized authorities in the same content

### 4.4 Trust Signals
Trust is the most important E-E-A-T dimension. Without trust, the other three do not rank. Trust extends beyond content to site-wide signals.

Required on every client site:
- HTTPS across all pages (Phase 13.6)
- Transparent About page with real people, photos, location, founding year, and contact information
- Transparent Contact page with multiple contact methods (phone, email, physical address where applicable, form)
- Visible editorial policy (how content is produced, who reviews it, how corrections are handled) linked from footer
- Corrections policy with a method for readers to flag errors
- Fact-check attribution on content pages where claims are cited (e.g., "Fact-checked by [Name], [Date]")
- Privacy policy, terms of service, cookie policy linked from every page
- Clear byline and publication date on every editorial page
- `dateModified` field updated and visible when content is refreshed

### 4.5 YMYL Content Handling
YMYL (Your Money or Your Life) content faces a higher E-E-A-T bar. Google applies stricter quality evaluation to topics that can impact a reader's health, finances, safety, legal rights, or major life decisions.

Client topics that trigger YMYL handling:
- HVAC safety (gas leaks, carbon monoxide, electrical)
- Plumbing safety (water damage, sewer, gas lines)
- Home improvement work requiring permits or involving structural changes
- Any medical, therapeutic, or mental-health claim in content or product copy
- Legal, tax, financial, or insurance content
- Safety products or services

YMYL content requires:
- Elevated expert attribution (industry-certified expert, not brand spokesperson alone)
- External authoritative citations (NIH, CDC, OSHA, EPA, government agencies, peer-reviewed sources)
- Editorial review by a subject-matter expert with credentials documented
- Disclaimer where appropriate ("This is not medical advice. Consult a licensed professional.")
- Review cycle every 6 months instead of annual (Phase 15)
- YMYL flag documented in the Client Parameter Sheet so downstream SOPs apply elevated rules

### 4.6 Trust Policy Documents (Site-Wide)
Every client site carries the following policy pages linked from the site footer:

- About page (Phase 4.4 requirements)
- Contact page (Phase 4.4 requirements)
- Privacy Policy
- Terms of Service
- Editorial Policy (how content is produced, sourced, and reviewed)
- Corrections Policy (how errors are identified and fixed)
- Cookie Policy (where applicable)
- Accessibility Statement

Missing or thin policy pages are Trust-signal failures. A site without an editorial policy or corrections policy signals to both Google and readers that content accountability is absent.

### 4.7 Author Bio Page Requirements
Every named expert or author on a client site has a dedicated bio page at a stable URL (e.g., `/team/jason-spencer` or `/about/jason-spencer`).

Each author bio page contains:
- Full name and title
- Professional headshot (real photo, not illustrated or stock)
- 200–400 word bio with specific career history, credentials, and expertise areas
- Published work links (articles on the site, external articles, books, podcasts)
- Social proof links (LinkedIn, X, professional associations)
- Speaking engagements or media mentions where applicable
- Person JSON-LD schema (Phase 12.2) with this URL as the `@id` entity page
- Contact method (email or form)

Link the author bio page from every byline across the site. Knowledge Panel eligibility and E-E-A-T both depend on a crawlable, linkable author entity on the site.

---

## Phase 5 — Information Gain Framework

### 5.1 Definition
Information gain is the measurable new value a page contributes to a topic. A page without information gain is derivative content. Derivative content does not rank in modern search and does not get cited by AI answer engines.

### 5.2 Information Gain Elements (Minimum Three Per Page)
Every piece of content must contain at least three of the following information gain elements. At least one of the three must be specific to the client (not generic industry information):

1. **Proprietary data** — survey data, client data (anonymized or with permission), internal benchmarks, original research
2. **Named frameworks** — a methodology the client or expert developed, given a distinctive name, documented with steps
3. **Original analysis** — synthesis of multiple public data sources into a new argument, with the interpretation attributed to the expert
4. **Case study evidence** — specific client results with before/after numbers, attributed to a named engagement
5. **Insider perspective** — operational detail, cost structure, process insight, or industry behavior that few competitors publish
6. **Contrarian position** — a defensible argument against the dominant industry consensus, backed by evidence
7. **Quantified claims** — specific numbers, percentages, and benchmarks in place of vague qualitative assertions
8. **Original visual asset** — a diagram, flowchart, model, or chart created for the piece, not stock or reformatted

### 5.3 Information Gain Audit
Before any page publishes, the information gain audit runs:
1. Count the information gain elements present. Minimum three.
2. Verify at least one element is client-specific.
3. If fewer than three elements are present, the piece returns to the content team.

### 5.4 Commodity Content Prohibition
The following page types are not permitted on client sites:
- Generic "top 10 tips" articles with no original analysis
- Definition-only pages that restate what Google Knowledge Panel already shows
- Restatements of industry-standard advice with no client-specific angle
- AI-generated content without a human editorial pass and an information gain audit

The commodity content prohibition applies site-wide. When legacy content predating the engagement fails the commodity test, it receives Phase 14.2 deprecated-content handling.

---

## Phase 6 — AEO / GEO Patterns

### 6.1 Extractability Principles
Structure content so AI answer engines can extract specific answers:

- Every H2 section opens with a 1–3 sentence direct answer to the implied question of the heading
- Bullet-point lists of 3–7 items for enumerable content
- Data tables for comparative information
- Numbered steps for procedural content
- Definitions as "[Term] is [definition]" constructions, not buried in paragraphs

### 6.2 Speakable Markup
Every editorial page includes speakable JSON-LD pointing to two CSS selectors:
- Opening paragraph (class `.page-intro`)
- Expert commentary section body (class `.expert-take-body`)

These are the segments voice assistants and AI answer engines extract most often. The CSS classes are present on every editorial page for consistent extraction.

### 6.3 FAQ Schema Requirements
Every commercial page and every content article carries FAQPage JSON-LD that mirrors visible FAQ content on the page. Requirements:

- FAQ schema marks up only content visible to the user on page load (not hidden behind accordions that never open programmatically)
- Minimum 4, maximum 8 Q&As per page
- Questions phrased as the real questions a buyer or reader would ask (not keyword-stuffed)
- Answers 2–4 sentences, include the brand or expert mention where natural, contain a specific fact or data point

### 6.4 Entity-Rich Headings
Every H2 and H3 heading names a specific entity: a concept, a tool, a technique, a product, a methodology. Headings like "Why It Matters" or "What You Need To Know" are not permitted. Headings must be extractable as table-of-contents signposts and carry enough entity signal to be useful outside the page context.

### 6.5 Direct Answer Blocks
For high-intent informational queries, include a styled "direct answer" callout at the top of the article or in the opening section. The callout is a 1–2 sentence direct answer to the article's primary query, styled visibly (bordered box, accent color, or equivalent). AI answer engines extract this block into featured answers and knowledge panels.

---

## Phase 7 — AI Search Optimization & llms.txt

AI answer engines now generate answers directly without users clicking through. Around 60% of Google searches end without a click in 2026 because AI Overviews deliver answers in the SERP itself. Optimizing for visibility in AI-generated responses is a distinct discipline next to traditional SEO.

### 7.1 AI Crawler Access
Verify that AI crawlers can access every client site. The following user agents should not be blocked in `robots.txt` unless the client has a documented strategic reason:

- `GPTBot` (OpenAI)
- `ClaudeBot` (Anthropic)
- `Google-Extended` (Google AI / Gemini)
- `PerplexityBot` (Perplexity)
- `CCBot` (Common Crawl)
- `anthropic-ai`
- `Omgilibot`

Cloudflare's default configuration has blocked several of these in the past without site owners knowing. Check Cloudflare's AI bot management settings on every client site hosted behind Cloudflare.

### 7.2 llms.txt File
Every client site carries an `llms.txt` file at the root directory (`https://clientsite.com/llms.txt`). The file acts as a brand identity file for AI models and helps AI crawlers understand the site's purpose, structure, and key content in clean Markdown.

Required structure:

```
# [Client Brand Name]

> [One-sentence brand description]

## About

[2–4 sentences describing what the client does, who they serve, and what makes them distinctive]

## Key Pages

- [Homepage](https://clientsite.com/): [One-sentence page description]
- [About](https://clientsite.com/about): [One-sentence page description]
- [Services or Products](https://clientsite.com/services): [One-sentence page description]

## Primary Services / Products

- [Service or Product Name](https://clientsite.com/service-slug): [One-sentence description]
- ...

## Key Content

- [Article Title](https://clientsite.com/blog/slug): [One-sentence summary]
- ...

## Expertise & Authority

[2–4 sentences describing the expert's or brand's credentials, track record, and authority sources]

## Contact

[How to reach the client]
```

### 7.3 llms-full.txt (Optional)
Sites with substantial editorial content (50+ articles) can also serve `llms-full.txt` at the root. This file contains complete Markdown exports of the client's highest-value content formatted for AI parsing.

Update `llms-full.txt` when substantial new content publishes (quarterly maintenance cycle).

### 7.4 Server-Side Rendered Content
AI crawlers do not execute JavaScript the way modern browsers do. Render content server-side or statically so AI crawlers can read it without running scripts. Dynamic content inserted via client-side JavaScript may be invisible to AI crawlers.

### 7.5 Semantic HTML
AI models parse semantic HTML better than div-soup. Use:
- Proper heading hierarchy (H1 → H2 → H3)
- `<article>`, `<section>`, `<nav>`, `<footer>` landmark elements
- `<main>` wrapping primary content
- Descriptive `<title>` and `<meta description>` (reusable as AI answer context)
- Lists (`<ul>`, `<ol>`) for enumerable content
- Tables (`<table>`) with proper header cells for tabular data

### 7.6 Meta Descriptions As AI Micro-Answers
Meta descriptions now double as machine-readable summaries AI models use to decide when to cite the page. Write meta descriptions as micro-answers: specific, factual, 140–160 characters, direct.

### 7.7 AI Citation Tracking
Reporting tracks AI citation presence, not ranking position alone (Phase 19). Monitor:
- Google AI Overview citation share for target keywords
- Perplexity source citations
- ChatGPT web search citations
- Claude search citations (where applicable)

---

## Phase 8 — AI Writing Artifact Bans (Universal)

These bans apply to every piece of content produced by ROI.LIVE for any client. Client voice profiles may add to this list. They may not subtract from it.

### 8.1 Banned Phrases (Universal)
- "Here's the thing"
- "Let that sink in"
- "The uncomfortable truth is"
- "It's worth noting"
- "Let me be clear"
- "At the end of the day"
- "And that's okay"
- "Navigate the complex landscape"
- "Lean into"
- "Unpack"
- "Double down"
- "Deep dive"
- "Game-changer"
- "Move the needle"
- "At its core"
- "In today's world"
- "In today's digital age"
- "When it comes to"
- "It turns out that"
- "The reality is"
- "What makes X unique"
- "This is where it gets interesting"
- "Delve into"
- "Straightforward"
- "Revolutionize"
- "Leverage" (as a verb)
- "Robust solution"
- "Seamless experience"
- "Cutting-edge"
- "State-of-the-art"
- "World-class"
- "Holistic approach"
- "Empower your business"
- "Digital ecosystem"
- "Online presence"
- "Digital footprint"

### 8.2 Banned Structures
- Binary contrasts ("It's not X. It's Y.")
- Dramatic one-word fragment sentences ("Purpose. Clarity. Impact.")
- Negative listings ("Not because X. Because Y.")
- Rhetorical questions answered in the next sentence
- Three-item rhetorical lists (use two, or expand to five or more factual items)
- Em-dash reveal structures (em-dash followed by a punchy payoff)
- Pull-quote-ready sentences written to be screenshot

### 8.3 Banned Voice Patterns
- Adverbs ending in -ly (rewrite the verb or delete)
- Softeners: "just," "simply," "actually," "really," "very," "quite," "perhaps," "certainly"
- Throat-clearing openers: "Let me explain," "Here's why that matters"
- Meta-commentary about the writing itself
- Passive voice
- Narrator-from-a-distance voice ("One might argue")

### 8.4 Enforcement
Every piece of content runs through a banned-phrase find-and-replace scan before publication. The scan appears in the per-page QA checklist. One flagged phrase in published content is a quality failure.

---

## Phase 9 — Keyword Research Methodology

### 9.1 Source Requirements
All keyword research uses verified search volume data from:
- DataForSEO (primary, via the Echo agent)
- SE Ranking (secondary)
- Google Keyword Planner (tertiary)

Never estimate or fabricate volume numbers. Every keyword entering a cluster plan or content brief carries a source-documented volume number.

### 9.2 Relevance Over Volume
Keyword targets must map to actual revenue products, services, or buyer behaviors for the client. A keyword with 10,000 monthly volume that does not map to a revenue-producing offering ranks below a keyword with 500 monthly volume that maps to the client's top-converting service.

### 9.3 Competitor Gap Analysis
Keyword gap analysis runs against true niche competitors, not adjacent platforms. An e-commerce oracle deck brand's competitor set is other oracle deck brands, not Amazon, YouTube, or Instagram. An HVAC contractor's competitor set is other local HVAC contractors, not national aggregator sites like Angi or HomeAdvisor.

### 9.4 Intent Classification
Every target keyword is classified by intent:
- **Informational:** buyer learning about a topic (blog content)
- **Commercial investigation:** buyer comparing solutions (comparison pages, case studies, service pages)
- **Transactional:** buyer ready to purchase or book (product pages, service pages, contact pages)
- **Navigational:** buyer looking for a specific brand (homepage and core brand entity pages)

Intent classification determines content type. Keyword volume alone does not.

### 9.5 SERP Intent Validation
Before committing a keyword to a content brief, check the current SERP for that keyword and confirm:
- What content types currently rank (blog articles, service pages, videos, tools, aggregators)
- Whether AI Overviews appear for the query
- What featured snippets, People Also Ask, and knowledge panels display
- What citation sources AI Overviews pull from

If the SERP shows an intent mismatch with the planned content type (e.g., planning a blog article when Google ranks only product pages), adjust the content type or the keyword target before production.

### 9.6 Cluster Mapping
Organize keywords into topical clusters before writing any page. Each cluster has:
- A pillar-level keyword (highest volume, broadest intent within the cluster)
- 8–25 supporting keywords (narrower intent, modifiers, questions, long-tail)
- A cluster map document linking pillar to supporting keywords and supporting keywords to each other

### 9.7 Volume Thresholds
Minimum volume thresholds for inclusion in a keyword plan:
- Pillar keywords: 200+ monthly searches (US), or the top-volume keyword in the niche, whichever is lower
- Supporting keywords: 50+ monthly searches, or confirmed long-tail with demonstrable SERP presence
- Below-threshold keywords enter the plan only with documented strategic reason (high commercial intent, known client conversion pattern)

Niche verticals (oracle decks, affirmation products, specialty services) often show lower absolute volumes. Document per-client threshold overrides in the cluster plan.

---

## Phase 10 — Internal Linking Philosophy

### 10.1 Cross-Page Link Density
Every content page on a client site links to every other content page at least once across the site's lifetime. As new pages publish, update older pages to add contextual links to the new page.

### 10.2 Anchor Text Formula
Every internal link uses descriptive, keyword-rich anchor text:

`[what the linked page explains, proves, or offers]`

Never acceptable:
- "Click here"
- "Learn more"
- "This article"
- Bare URLs
- Brand-name-only anchors (acceptable for navigation contexts; not acceptable as the default for in-body links)

### 10.3 Cross-Type Linking
Content pages link to commercial pages. Commercial pages link to supporting content pages. Case study pages link to both. Isolated pages are invisible pages. Every page earns its place in the link graph.

### 10.4 Forward-Link Treatment
Cluster maps function as existing link targets from a planning perspective. When a new article is written and a planned-but-unwritten article in the same cluster would logically receive a reference, include the forward link using the planned URL slug. This signals topical completeness to crawlers even before the cluster is fully published.

### 10.5 Related Content Sections
Every article-style page ends with a Related Content section (minimum 3 cards). Every commercial page ends with a "Related Services" or "Related Products" section. Page-type SOPs specify exact mechanics.

### 10.6 Anchor Text Diversity
Within a single page, no two internal links use the same anchor text for different destinations. Across a site, anchor text pointing to a given destination varies (e.g., a service page is not always linked as the same phrase across the site). This prevents over-optimized link patterns that trigger spam signals.

---

## Phase 11 — Off-Page SEO & Brand Authority Building

On-site work alone does not rank a client site for competitive terms. Off-page authority — backlinks, brand mentions, reviews, digital PR, entity signals — carries the same weight or more. Every client engagement includes an off-page strategy.

### 11.1 Off-Page Weight Distribution
In 2026, backlinks carry around 45% of off-page ranking weight. Brand mentions and entity signals carry the remaining 55%. Unlinked brand mentions from authoritative sources now influence rankings through Google's entity recognition systems. Off-page strategy allocates effort across both tracks.

### 11.2 Backlink Strategy Principles
Quality over quantity. A small number of editorially earned, topic-aligned, authoritative backlinks outperforms hundreds of low-quality links.

Required practices:
- Backlinks come from sites with topical alignment to the client's niche
- Manipulative link acquisition (PBNs, paid links without `rel="sponsored"`, link schemes) breaks this rule — the agency does not use them
- Anchor text diversity maintained across the external link profile — not over-optimized on exact-match keywords
- Editorial links weighted above directory links
- Competitor backlink gap analysis runs quarterly using DataForSEO or equivalent
- Link-earning tactics documented in the client's SEO log (guest articles, resource page placements, broken link building, data-driven outreach)

### 11.3 Brand Mention Cultivation
Track linked and unlinked brand mentions across the web. Both feed Google's entity understanding.

Required practices:
- Brand mention monitoring via Google Alerts, Mention.com, Brand24, or equivalent
- Monthly review of new brand mentions, categorized as positive / neutral / negative
- Outreach to unlinked mentions offering relevant pages as potential link additions
- Co-citation tracking: when the client brand appears alongside authoritative industry sources, document the instance as an authority signal

### 11.4 Digital PR Program
Every engagement includes a digital PR approach — earning mentions on authoritative sites through newsworthy content, data releases, commentary on industry developments, and expert quotes in journalist queries.

Channels and tactics:
- Journalist query platforms (HARO, Qwoted, Featured, SOS) for expert sourcing
- Proprietary data releases (annual industry benchmarks, survey data) positioned as press-worthy
- Expert commentary on industry news distributed to trade publications
- Podcast guest appearances for the client's named expert
- Guest articles on topic-aligned authoritative sites (with editorial relevance, not link-focused)

### 11.5 Review Management
Reviews feed authority (Trust signal of E-E-A-T), local ranking (Local Pack), and conversion (trust signal on-site).

Required for every client:
- Google Business Profile review acquisition program (for local businesses)
- Industry-relevant platform reviews (Yelp, BBB, Trustpilot, G2, Capterra, platform-specific for SaaS and e-commerce)
- Response protocol: respond to every review within 48 hours (positive and negative)
- Review acquisition cadence: request reviews after every completed service or purchase
- Review display on-site with AggregateRating schema (where platforms permit display)

### 11.6 Knowledge Panel Strategy
Knowledge Panels are Google's explicit acknowledgment of brand entities. Triggering a Knowledge Panel requires a consistent cluster of entity signals.

Signals that trigger Knowledge Panel eligibility:
- Consistent NAP across the web
- Wikipedia article (hard to earn but authoritative)
- Wikidata entry (easier to seed)
- Authoritative source mentions (news outlets, industry publications, academic references)
- Social profile verification (verified accounts on major platforms)
- Organization schema with complete, accurate data
- Consistent brand name treatment across all mentions

Per-client strategy: document current Knowledge Panel status on engagement start. Where the panel does not yet exist and the client's authority supports one, build a plan to seed the signals required.

### 11.7 Brand Signal Cultivation
Google measures broader brand signals beyond backlinks and mentions:
- Branded search volume (how often users search "[client brand name]") — tracked in Google Search Console and DataForSEO
- Social footprint consistency (profile completeness, active posting, follower count proportional to brand stage)
- Direct traffic volume (tracked in GA4 as a brand awareness indicator)
- Navigational search behavior (users typing brand name + service or product)

Grow branded search volume through:
- Memorable brand name treatment across campaigns
- Founder or expert name-building via podcasts, articles, speaking
- Category ownership language ("the [specific claim] for [specific audience]")
- Consistent voice profile across every touchpoint

---

## Phase 12 — Schema Architecture Baseline

### 12.1 Organization Schema (Site-Wide)
Declare Organization schema once as a site-wide JSON-LD block (often in a shared include or site header). Every page references it by `@id`. Required fields:

- `@type` (Organization, LocalBusiness, ProfessionalService, or combination as appropriate)
- `@id` (canonical identifier used across the site)
- `name`
- `url`
- `logo`
- `sameAs` array (social profiles, Wikipedia, Crunchbase, LinkedIn company page)
- `address` (for local businesses)
- `contactPoint`
- `foundingDate`
- `founder` (references Person schema for the client's founder)

### 12.2 Person Schema (Site-Wide)
Declare Person schema once site-wide for the client's primary expert. Required fields:

- `@type` (Person)
- `@id`
- `name`
- `jobTitle`
- `worksFor` (references Organization `@id`)
- `sameAs` (LinkedIn, Twitter/X, author bio page on the client site)
- `url` (the author bio page URL on the client site — Phase 4.7)
- `image`
- `knowsAbout` (array of topical expertise entities)

### 12.3 Page-Type Schema (Per Page)
Every page carries schema appropriate to its type. Page-type SOPs specify exact fields and mentions arrays.

| Page Type | Required Schema Blocks |
|---|---|
| Blog article | Article + FAQPage + BreadcrumbList |
| Service page | Service + Offer + BreadcrumbList + FAQPage + AggregateRating (when reviews exist) |
| Product page | Product + Offer + AggregateRating + Review + BreadcrumbList |
| Collection/Category page | CollectionPage + BreadcrumbList + ItemList |
| Case study | CreativeWork or Article + BreadcrumbList + FAQPage |
| Homepage | Organization (expanded) + WebSite + BreadcrumbList (if applicable) |
| About page | AboutPage + Organization reference |
| Contact page | ContactPage + Organization reference |
| Author bio page | ProfilePage + Person (the author's primary entity declaration) |

### 12.4 Required `about` and `mentions` Arrays
Every page carrying Article, Service, Product, or CreativeWork schema must include:

- `about`: the primary topic entity of the page (single, page-specific)
- `mentions`: 4–8 specific entities the page substantively discusses

Never copy the `mentions` array from another page's schema. Each page lists entities actual to that page's content.

### 12.5 Schema Enforcement
Validate every schema block in Google's Rich Results Test before publication. Resolve structured data errors before a page goes live. Resolve warnings when they affect rich result eligibility.

---

## Phase 13 — Technical SEO Baseline

### 13.1 Required Head Tags (Every Page)
- Title tag (keyword-first for editorial pages; brand-first for homepage; service/benefit-first for service pages)
- Meta description (140–160 characters, primary keyword in first 20 words)
- Canonical URL (absolute path)
- Open Graph tags: `og:type`, `og:title`, `og:description`, `og:url`, `og:image`, `og:site_name`
- Twitter Card tags: `twitter:card` (summary_large_image), `twitter:title`, `twitter:description`, `twitter:image`
- Viewport meta tag
- Language declaration
- Favicon
- GA4 tracking script (Measurement ID from Client Parameter Sheet)

### 13.2 Image Optimization
- Every image carries a descriptive `alt` attribute (not empty, not keyword-stuffed)
- Serve hero images in WebP or AVIF with a JPEG fallback
- Lazy-load images below the fold
- Image file names descriptive: `hvac-service-truck-asheville.jpg`, not `IMG_0342.jpg`
- Hero images optimized to under 200 KB where possible

### 13.3 Core Web Vitals Targets
- LCP (Largest Contentful Paint): under 2.5 seconds
- CLS (Cumulative Layout Shift): under 0.1
- INP (Interaction to Next Paint): under 200 ms
- Test on mobile before publication using PageSpeed Insights or equivalent

### 13.4 Mobile Responsiveness
- Every page breakpoint-tested at 320px, 768px, 1024px, 1440px
- No horizontal scroll on any viewport
- Tap targets minimum 48×48 px
- Single-column layout below 900px (two-column layouts collapse)

### 13.5 Robots & Crawl Control
- `robots.txt` exists at domain root and references the sitemap URL
- `robots.txt` does not block AI crawlers listed in Phase 7.1 (unless client directive)
- Content pages do not use `noindex` without a documented strategic reason in the site's SEO log
- Reserve `rel="nofollow"` for paid links and untrusted user-generated content

### 13.6 HTTPS & Redirects
- Every page served over HTTPS
- HTTP redirects permanently (301) to HTTPS
- Trailing slash convention consistent across the site
- No redirect chains longer than two hops
- Legacy URLs 301 to current URLs when content migrates

### 13.7 Server-Side Rendering Requirement
Primary content renders server-side or as static HTML. Content inserted via client-side JavaScript (especially by single-page app frameworks without server-side rendering) may be invisible to AI crawlers and degrade rankings. Verify rendering at engagement start using "View Source" (not "Inspect Element") for every template type.

### 13.8 llms.txt Presence (Phase 7 Reference)
Every client site serves a valid `llms.txt` file at the root per Phase 7.2.

---

## Phase 14 — Helpful Content System Alignment

Google's Helpful Content System evaluates overall site quality, not just individual pages. A site with a substantial portion of unhelpful content sees rankings drop across the entire domain. Site-wide quality hygiene is not optional.

### 14.1 Site-Wide Thin Content Audit
Every 6 months, audit the client site for thin content:
- Pages under 500 words that are not intentional utility pages (contact, privacy, etc.)
- Pages with zero internal inbound links
- Pages with fewer than 5 sessions per month for 3 consecutive months
- Pages that have not ranked for any keyword in 6+ months
- Pages built to target a keyword rather than serve a reader

Handling:
- Consolidate and redirect where content overlaps
- Expand and improve where intent is still valid but execution is weak
- Remove (410 or noindex) where content serves no purpose
- Document decisions in the client's SEO log

### 14.2 Deprecated Content Handling
Content ages. Outdated content harms E-E-A-T (Trust) and wastes crawl budget. Handling protocol:

- **Redirect:** when replacement content exists, 301 the outdated page to the current version
- **Update:** when the topic is still valid but facts are dated, refresh the content and update `dateModified` (Phase 15.4)
- **Remove:** when the topic is no longer relevant to the client's business, return 410 Gone or apply noindex

### 14.3 Commodity Content Ban (Elevated to Site-Wide Quality Gate)
The commodity content ban in Phase 5.4 applies site-wide. Audit existing client content for:
- AI-generated pages without editorial pass
- Mass-produced thin pages from prior agencies or automation tools
- Keyword-doorway pages (pages created only to rank for a variant of an existing page's keyword)

Treat discovered commodity content the same as deprecated content (redirect, update, or remove).

### 14.4 People-First Content Standard
Every piece of client content passes a people-first check before publication:
- Would a reader without SEO intent find this useful?
- Does the page teach or deliver something the reader could not get from a featured snippet alone?
- Does the page show a human perspective or brand voice, or does it read as synthesized boilerplate?
- Does the reader leave the page with more clarity than they arrived with?

One failure on these questions sends the page back for revision before publication.

### 14.5 Site Quality Scorecard (Quarterly)
Every 90 days, score the client's site across five quality dimensions:

| Dimension | Score (1–5) |
|---|---|
| Information gain (pages hitting 3+ elements) | |
| E-E-A-T signals (trust pages, author bios, editorial policy) | |
| Technical health (Core Web Vitals, schema validation, crawl errors) | |
| Internal linking (cross-link symmetry, anchor quality) | |
| Content freshness (percentage of pages updated in past 12 months) | |

Dimension scores below 3 trigger corrective action documented in the client's SEO log.

---

## Phase 15 — Content Freshness & Maintenance

Evergreen content does not stay evergreen without maintenance. Search results change, data updates, products evolve, and reader expectations shift. Every client engagement includes a content maintenance schedule.

### 15.1 Quarterly Performance Review
Every 90 days, review the client's top 20 pages by traffic and top 20 by conversion. For each page, check:
- Ranking movement since last review
- Traffic trend (up, flat, down)
- Conversion trend
- SERP competitor shifts (new pages ranking, old pages dropped)
- AI Overview citation presence

Pages showing ranking or traffic decline trigger a refresh.

### 15.2 Annual Full-Content Refresh
Every 12 months, every editorial page receives a full refresh pass:
- Update statistics and data points with current figures
- Refresh screenshots, visuals, and tool references
- Update internal links to include newly published cluster articles
- Add or expand FAQ section based on current reader questions
- Re-check keyword targeting against current SERP
- Update `dateModified` in schema and visible byline

### 15.3 Refresh-Trigger Events
Events that trigger immediate content refresh outside the scheduled cycle:
- Confirmed Google algorithm update with ranking impact detected
- Industry regulation change affecting the topic
- Client service or product change affecting the page
- Competitor publishes a stronger version of the same content
- New proprietary data becomes available that strengthens the page

### 15.4 dateModified Discipline
The `dateModified` field in Article schema and the visible modified date on the page update whenever content receives meaningful changes. Cosmetic changes (typo fixes, small edits) do not trigger a `dateModified` update. Substantive changes (statistics refreshed, sections added, data updated, structure changed) do.

Visible modified dates build reader trust. Hidden modifications without attribution erode it.

### 15.5 YMYL Accelerated Review Cycle
YMYL content (Phase 4.5) reviews every 6 months instead of annually. Regulatory changes, safety data updates, and medical consensus shifts often make 12 months too long for YMYL topics.

---

## Phase 16 — Content Quality Gates

### 16.1 Pre-Publication Gates
Every page passes all gates before publication. A single gate failure blocks publication.

1. Client Parameter Sheet values inserted without error (brand name, expert attribution, URLs, design tokens)
2. Primary keyword verification in title, H1, first 100 words, 2+ headings
3. Entity salience count verification (brand mentions and expert attributions per page-type target)
4. E-E-A-T signal audit (experience, expertise, authoritativeness, trust — minimum signals present per page type)
5. Information gain audit (3+ elements present, 1+ client-specific)
6. Banned phrase scan (zero flagged phrases)
7. Schema validation (Google Rich Results Test)
8. Core Web Vitals check
9. Mobile responsiveness check
10. Internal linking audit (cross-page link count, anchor text quality, forward links where applicable)
11. Sitemap update (new URL added with correct priority and lastmod)
12. GA4 tracking verification (event fires on page load)
13. Author bio page linked from byline (editorial pages)
14. AI crawler access verified (no accidental block in robots.txt or CDN rules)
15. Policy page coverage verified (About, Contact, Privacy, Terms, Editorial Policy, Corrections Policy present site-wide)

### 16.2 Post-Publication Audits
- 24 hours after publish: Google Search Console submission and crawl request
- 7 days after publish: index verification (`site:clientsite.com/new-page-slug` query)
- 30 days after publish: ranking check for primary and top 3 semantic variant keywords
- 90 days after publish: performance review against target metric (traffic, ranking, or conversion, per page-type)
- 90 days after publish: AI Overview citation check for target query

### 16.3 Human Editorial Pass
Every page gets a human editorial read before publication. AI drafts do not ship without a human pass covering:
- Voice profile fit (reads like the client brand wrote it)
- Factual accuracy (data points cited with source)
- Information gain confirmation
- Experience signals present (first-hand detail, specific operational insight)
- Flow and readability

YMYL content requires a second editorial pass by a subject-matter expert with documented credentials (Phase 4.5).

---

## Phase 17 — Site-Wide Integration Rules

### 17.1 New Page Integration Checklist
Every new page triggers:
1. Add to main navigation (where applicable to page type)
2. Add to footer sitemap (where applicable)
3. Add to XML sitemap
4. Add to `llms.txt` if the page is a Key Page, Primary Service/Product, or Key Content entry
5. Add contextual links from homepage (where relevant)
6. Add contextual links from other existing pages (cross-link symmetry)
7. Update breadcrumb trails across parent and sibling pages

### 17.2 Content Hub Maintenance
Every client site with a blog has a hub page (`/blog` or branded equivalent). Update the hub every time a new article publishes by adding an article card. The hub is the index of all editorial content. A blog article live but not on the hub does not exist for readers navigating the site.

### 17.3 Case Study Index Maintenance
Every client site with multiple case studies has a case studies index. Update the index on every new case study publish with a new card.

### 17.4 Service Page Index (Where Applicable)
Multi-service client sites have a services index page. Update the index when new service pages launch.

### 17.5 Product Catalog Hierarchy (E-Commerce)
E-commerce sites maintain collection pages for every product category. Individual product pages link to their parent collection. Collections link to relevant blog content and relevant case studies or testimonials.

---

## Phase 18 — Sitemap & Indexing Standards

### 18.1 XML Sitemap Requirements
- Located at `/sitemap.xml`
- Referenced in `/robots.txt`
- Updated on every page publish
- Includes all canonical URLs
- `<lastmod>` set to publish or latest meaningful modification date
- `<priority>` assigned:
  - Homepage: 1.0
  - Pillar pages / top-level services / top products: 0.8
  - Hub pages: 0.7
  - Supporting articles / secondary product pages / case studies: 0.6
  - Utility pages (about, contact): 0.5

### 18.2 Google Search Console
Every client site connects to Google Search Console under the client's own account with agency access granted (`jason@roi.live` as delegated user). Submit the sitemap. Submit new pages for crawl via URL Inspection on publish day.

### 18.3 Indexing Verification
Verify page indexing within 7 days of publish via the GSC coverage report. Investigate pages not indexed within 14 days (possible crawl issue, duplicate content, quality flag, or canonical problem).

### 18.4 Sitemap Segmentation (Large Sites)
Sites with 500+ URLs split the sitemap into segmented sitemaps (e.g., `sitemap-blog.xml`, `sitemap-products.xml`, `sitemap-services.xml`) referenced from a sitemap index at `/sitemap.xml`.

---

## Phase 19 — Reporting & Measurement Baseline

### 19.1 Required Measurement Stack
- GA4 with page view, scroll, click, and conversion event tracking
- Google Search Console with sitemap submitted and performance data accessible
- SE Ranking project with target keywords tracked
- DataForSEO API access for programmatic SERP data and keyword gap analysis (via Echo)
- AI Overview citation monitoring (manual SERP checks or tools like Otterly, Peec AI, Profound where budget supports)
- Brand mention monitoring (Google Alerts, Mention, Brand24, or equivalent)

### 19.2 Reporting Cadence
- Monthly report: organic traffic, ranking movement, conversion attribution, top-performing pages, pages in decline, AI citation presence, new brand mentions
- Quarterly report: cluster-level performance, information gain ROI, content production volume, strategic adjustments, Site Quality Scorecard (Phase 14.5)
- Annual review: year-over-year performance, strategic priority reset

### 19.3 Revenue Attribution
Track organic traffic revenue where the client's stack supports it (GA4 ecommerce events, GA4 conversion events, GA4 source/medium reports). Report revenue-per-session alongside traffic volume because traffic without revenue signals the wrong keyword targeting.

### 19.4 User Engagement Signal Tracking
User engagement feeds Google's quality evaluation. Track and report:
- Average session duration on top content pages
- Pages per session from organic entry
- Scroll depth (configured as GA4 event)
- Bounce rate on commercial pages (vs. blog pages — different benchmarks apply)
- Pogo-stick behavior (high bounce + short session on key pages indicates intent mismatch)

When engagement metrics decline, audit the affected page for intent match, content freshness, and page experience issues before assuming a ranking algorithm factor.

### 19.5 AI Citation Tracking
Track the client's presence in AI Overviews and AI answer engines:
- Google AI Overview citation share across a target keyword list (tracked at least monthly)
- Perplexity citation presence for high-intent queries
- ChatGPT web search citations
- Claude search citations (where applicable)

Report AI citation presence alongside traditional ranking metrics. A #1 ranking without AI Overview citation produces less traffic than the same ranking did two years ago.

### 19.6 Brand Signal Tracking
Track brand health indicators monthly:
- Branded search volume (Google Search Console impressions and DataForSEO volume for brand terms)
- Direct traffic volume (GA4)
- New brand mentions (linked and unlinked)
- Social footprint growth (primary platforms per client)
- Knowledge Panel status

### 19.7 Reporting Deliverable Format
Every client report uses the standardized agency report template. Reports lead with outcome metrics (revenue, leads, conversions) and close with activity metrics (content published, links built, keywords tracked). Activity without outcome is not a report headline.

---

## Phase 20 — Document Relationships

This is the base-layer document. Page-type SOPs inherit from it:

- ROI.LIVE Agency Blog Article SOP
- ROI.LIVE Agency Service Page SOP
- ROI.LIVE Agency Product Page SOP (e-commerce)
- ROI.LIVE Agency Collection / Category Page SOP (e-commerce)
- ROI.LIVE Agency Case Study Page SOP
- ROI.LIVE Agency Homepage SOP
- ROI.LIVE Agency About Page SOP

Each downstream SOP references this document and specifies only the rules unique to its page type. When a downstream SOP is silent on a rule, the rule in this document applies.

Supporting documents:
- ROI.LIVE Client Parameter Sheet Template (standardized intake form completed before every engagement's content production begins)

---

*Version 1.1 — April 2026 — ROI.LIVE / Jason Spencer*

*Changes from v1.0:*
*Added Phase 4 — E-E-A-T Framework with Experience, Expertise, Authoritativeness, and Trust signal requirements, YMYL content handling, trust policy documents, and author bio page requirements.*
*Added Phase 7 — AI Search Optimization & llms.txt covering AI crawler access, llms.txt file structure, llms-full.txt, server-side rendering, semantic HTML, and AI citation tracking.*
*Added Phase 11 — Off-Page SEO & Brand Authority Building covering backlinks, brand mentions, digital PR, review management, Knowledge Panel strategy, and brand signal cultivation.*
*Added Phase 14 — Helpful Content System Alignment covering thin content audit, deprecated content handling, commodity content as site-wide gate, people-first content standard, and quarterly Site Quality Scorecard.*
*Added Phase 15 — Content Freshness & Maintenance covering quarterly performance review, annual full-content refresh, refresh-trigger events, dateModified discipline, and YMYL accelerated review cycle.*
*Added Phase 9.5 SERP Intent Validation as a pre-build step.*
*Added Phase 13.7 Server-Side Rendering Requirement and Phase 13.8 llms.txt Presence to Technical SEO Baseline.*
*Updated Phase 2 Client Parameter Intake to add author bio page URL, YMYL classification, and CDN hosting note.*
*Updated Phase 12 Schema Architecture to add Author bio page schema requirement and ProfilePage as recognized page type.*
*Updated Phase 16 Content Quality Gates to add E-E-A-T signal audit, author bio link verification, AI crawler access verification, and policy page coverage verification.*
*Updated Phase 19 Reporting & Measurement Baseline to add User Engagement Signal Tracking, AI Citation Tracking, and Brand Signal Tracking as distinct reporting streams.*
