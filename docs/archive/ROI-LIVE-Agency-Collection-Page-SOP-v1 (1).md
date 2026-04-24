# ROI.LIVE Agency Collection / Category Page SOP
**Version:** 1.0 — April 2026
**Applies to:** Every collection or category page produced or managed on an e-commerce client website by ROI.LIVE
**Owner:** Jason Spencer, Founder — ROI.LIVE
**Inherits from:** ROI.LIVE Agency Core Standards v1.1

> This SOP specifies the rules unique to collection pages (called category pages on some platforms) on e-commerce client websites. A collection page groups related products into a browsable set, targets category-level browse intent, and functions as a hub for the products it contains. Rules not specified here fall back to the Agency Core Standards base document.

---

## TABLE OF CONTENTS

1. Collection Page Intent & Definition
2. Collection Page Classes
3. Pre-Build Research
4. URL, Title & Metadata Architecture
5. Collection Page Structure
6. Section Composition
7. Product Grid Requirements
8. Filtering & Sorting UX
9. Pagination Strategy
10. Faceted Navigation SEO
11. Word Count & Keyword Placement
12. Collection-Specific Schema
13. Collection Imagery Requirements
14. Trust Signals on Collection Pages
15. Internal Linking & llms.txt Integration
16. Content Freshness (Collection-Specific)
17. QA Verification Checklist

---

## Phase 1 — Collection Page Intent & Definition

### 1.1 What a Collection Page Is
A collection page groups related products into a browsable set. It targets buyers in the discovery or commercial investigation stage of the buying journey — shoppers narrowing from category-level interest toward a specific product decision. The collection page's primary job is moving the visitor from browse to a specific product page, where purchase happens.

### 1.2 What a Collection Page Is Not
- A single product page (see Doc 4 Product Page SOP)
- The homepage (homepages market the full brand across multiple categories)
- A blog article (educates rather than facilitating product discovery)
- A shopping cart or checkout page (transactional flow pages)

### 1.3 Primary Collection Page Goals
1. Help buyers narrow from category interest to a specific product
2. Rank for category-level keywords with higher volume than individual product keywords (e.g., "affirmation card decks" vs a specific deck name)
3. Get cited by AI answer engines for category-level queries ("best affirmation card decks," "types of oracle decks")
4. Drive internal link equity from category-level searches to specific product pages
5. Surface cross-sell opportunities across the category

### 1.4 E-E-A-T Signal Emphasis
Collection pages carry E-E-A-T signals with distribution favoring **Experience** and **Authoritativeness**:
- **Experience:** curated category story, maker perspective, buyer's guide content
- **Authoritativeness:** best-seller indicators, press mentions at the category level, editorial awards
- **Trust:** aggregate review signals across the collection, transparent category scope, clear filter and sort UX
- **Expertise:** category buying guide, comparison content, use-case framing

### 1.5 Collection vs Product Page Division of Labor
Collection pages handle the **browse** and **discover** moments. Product pages handle the **evaluate** and **buy** moments. Collection page content supports the narrowing decision. Product page content supports the purchase decision. Do not duplicate product-page-level detail on collection pages — it slows browsing and cannibalizes the product page's conversion job.

---

## Phase 2 — Collection Page Classes

Every collection page is one of five classes:

### 2.1 Top-Level Category Collection
Default class. The broadest category the client sells within. Example: "Affirmation Decks," "Oracle Decks," "Coloring Books." Ranks for the broadest category keyword. Editorial content: 300–600 words above the grid, 400–800 below.

### 2.2 Sub-Category Collection
A narrower subset within a top-level category. Example: "Daily Affirmation Decks" under the parent "Affirmation Decks" collection. Ranks for more specific modifiers. Editorial content: 200–400 words above the grid, 300–600 below.

### 2.3 Attribute / Tag Collection
A collection organized by a product attribute: color, size, material, use case, price range. Example: "Under $25 Affirmation Decks," "Gift-Ready Decks." Targets buyer-modifier keywords. Editorial content: 150–300 words above the grid, 200–400 below.

### 2.4 Curated Collection
An editorial grouping that does not map to a natural category hierarchy — "Best Sellers," "New Arrivals," "Staff Picks," "Gifts for Creative People." Targets discovery intent and homepage featured placement. Editorial content: 100–200 words above the grid, 150–300 below.

### 2.5 Seasonal / Campaign Collection
Time-bound collection for a holiday, event, or campaign. Example: "Valentine's Day Picks," "Back-to-School Deck Bundles." Editorial content: 100–250 words above the grid, 150–300 below. May deindex after the campaign ends (documented in the client's SEO log).

---

## Phase 3 — Pre-Build Research

Complete before configuring the collection or writing editorial content.

### 3.1 Collection Scope Confirmation
- Confirm which products belong in the collection (exact SKUs)
- Confirm collection parent (for sub-categories)
- Confirm sort order preferences (best-selling, newest, manual curation, price)
- Confirm which filters the collection supports (if any)
- Confirm seasonal or campaign timing (for campaign collections)

### 3.2 Keyword Research
- Identify primary category keyword (typically the collection name or category-level modifier)
- 3–5 semantic variant keywords with verified volume (Core Standards Phase 9)
- Buyer-modifier keywords ("best [category]," "[category] for [use case]," "[category] under $X")
- Question-intent keywords for FAQ and buyer's guide targeting ("how to choose [category]," "what is [category]")

### 3.3 SERP Intent Validation
Per Core Standards Phase 9.5:
- Pull the current top 10 organic results for the primary category keyword
- Confirm category pages or roundup content dominates the SERP (if single product pages dominate, the keyword may not fit a collection page)
- Check for Shopping carousel presence
- Check for AI Overview citations
- Check for buyer's guide or comparison content ranking (signals buyers expect editorial support on the category page)
- Document findings in the collection brief

### 3.4 Competitor Analysis
- Top 10 organic results for the category keyword
- Number of products competitors display per category page
- Filter and sort options competitors provide
- Editorial content length above and below the grid
- Buyer's guide or "how to choose" sections competitors include
- Pagination strategy (numbered pages, infinite scroll, "View More" button)

### 3.5 Information Gain Planning
Collection pages carry information gain through category-level editorial content. Minimum three elements (Core Standards Phase 5.2). Distribution weighted toward:
- **Original analysis:** how the client thinks about the category, how they decide what belongs, what differentiates their curation
- **Named frameworks:** the client's category taxonomy, buying framework, or use-case groupings
- **Insider perspective:** what most buyers get wrong about this category, what matters that competitors overlook
- **Original visual asset:** category comparison chart, use-case illustration, buyer's guide diagram

### 3.6 Product Grid Planning
Before launching the collection page, confirm:
- Minimum 4 products for a collection to launch (fewer products is a near-empty collection and should be rolled into a parent)
- Target 8–24 products visible by default (before pagination or load-more)
- Sort default (best-selling is typical; confirm per client)
- Grid density (2-column, 3-column, 4-column based on client design system)

---

## Phase 4 — URL, Title & Metadata Architecture

### 4.1 URL Slug
- Format: `/collections/[slug]` (Shopify default), `/category/[slug]` (WooCommerce), or client CMS convention from Parameter Sheet
- Category name as slug, lowercase, hyphens between words
- No stop words unless essential for readability
- Parent-child structure for sub-categories: `/collections/parent-category/sub-category-slug` where platform supports it, or flat slugs per platform convention
- Match URL to the collection catalog in the CMS

### 4.2 Title Tag
- Format: `[Category Name] | [Differentiator or Benefit] | [Brand Name]`
- Category keyword first
- Target length 50–60 characters
- Example: `Affirmation Card Decks | Hand-Illustrated by Creative Maniacs | Rage Create`

### 4.3 Meta Description
- 140–160 characters
- Category keyword in first 20 words
- One differentiator (made in USA, hand-illustrated, small-batch, curated by [expert], etc.)
- Call-to-browse phrase ("Browse the full collection," "Shop decks starting at $X")
- Functions as an AI micro-answer per Core Standards Phase 7.6

### 4.4 H1
- Category name, potentially extended with a buyer-focused benefit
- Example: `Affirmation Card Decks Built for Creative Maniacs`
- More editorial or brand-voiced than the title tag where the voice profile supports it

### 4.5 H2 and H3 Rules
- Minimum 3 H2s across editorial content sections: one for the category overview above the grid, one for the buyer's guide or deeper content below the grid, one for the FAQ section
- H2s contain category-relevant entity terms (category name, use-case modifiers, buyer-type terms)
- Headings read as buyer-helpful signposts

---

## Phase 5 — Collection Page Structure

Every collection page follows this layout order. Design tokens vary per client. Structural spine does not.

```
<head>
  ├── Title tag (category-first)
  ├── Meta description (category + differentiator + browse action)
  ├── Canonical URL (absolute; self-referential on paginated pages)
  ├── OG tags: og:type="website" or og:type="product.group", title, description, URL, image, site_name
  ├── Twitter Card tags (summary_large_image)
  ├── CollectionPage JSON-LD with ItemList
  ├── BreadcrumbList JSON-LD
  ├── FAQPage JSON-LD (when FAQ block present)
  └── Client-specified fonts

<body>
  ├── Navigation (client's standard nav with cart icon + item count)
  ├── Breadcrumb Bar (Home → Parent Collection → Current Collection)
  ├── Collection Hero Section
  │    ├── H1 category name
  │    ├── Intro paragraph (100–300 words depending on collection class)
  │    ├── Optional hero imagery (category-level lifestyle shot or curated grid)
  │    └── Optional category-specific CTA (e.g., "Take the 30-Day Challenge" for daily affirmation decks)
  ├── Sub-Collection Navigation (for top-level categories with sub-categories)
  │    └── Links to sub-collections as pills, buttons, or image cards
  ├── Filter & Sort Bar (sticky on desktop, top-positioned on mobile)
  │    ├── Filter dropdowns or sidebar
  │    └── Sort dropdown (best-selling, newest, price low-to-high, price high-to-low, top-rated)
  ├── Product Grid
  │    ├── Product cards in a responsive grid
  │    └── Pagination or "View More" button below the grid
  ├── Editorial Content Section (below the grid)
  │    ├── Buyer's guide or "how to choose" content
  │    ├── Use-case framing
  │    ├── Named framework (information gain anchor)
  │    └── Related blog content links
  ├── FAQ Section (4–6 Q&As)
  ├── Related Collections Section
  │    └── 3–4 cards linking to sibling or related collections
  └── Footer (client's standard footer)
```

---

## Phase 6 — Section Composition

### 6.1 Collection Hero Section
The hero delivers the collection's purpose, positioning, and brand voice in one glance. Components:

- **H1:** category name with optional buyer-framing extension
- **Intro paragraph:** 100–300 words introducing what the collection contains, who it is for, what differentiates the client's take on this category. Brand name appears in the first sentence. Primary category keyword in the first 100 words.
- **Hero imagery:** single lifestyle shot, collage of products from the collection, or curated image that signals the category's aesthetic
- **Optional CTA:** collection-specific CTA where it adds value (quiz, challenge, subscription, bundle discount)

Avoid placing a single product's imagery as the hero — the hero represents the category, not an individual product.

### 6.2 Sub-Collection Navigation (Top-Level Categories)
Top-level categories with sub-categories display sub-collection links near the top of the page as pills, buttons, or image cards. Each sub-collection link is crawlable (standard HTML link), not JavaScript-only.

Example for a "Cards" top-level collection:
- Affirmation Decks
- Oracle Decks
- Conversation Decks
- Gift Card Sets

### 6.3 Filter & Sort Bar
See Phase 8 for full filter/sort UX requirements. The bar sits above the product grid and remains accessible during scroll (sticky on desktop, easily reachable on mobile).

### 6.4 Product Grid
See Phase 7 for full product grid requirements. The grid is the central UX element — editorial content wraps around it rather than replacing it.

### 6.5 Editorial Content Section (Below Grid)
This section is where the collection page earns its organic ranking beyond the grid itself. Components:

- **Buyer's guide** — 300–600 words helping the reader choose within the category. Structure as 3–5 subsections with H3 headings covering the dimensions buyers evaluate (use case, size, material, price tier, style, skill level).
- **Use-case framing** — connect the category to specific buyer situations ("for daily morning practice," "for gifting to a friend starting a creative project," "for writing workshops").
- **Named framework** — the client's category-specific framework or taxonomy presented as information gain.
- **Related blog content** — 2–3 links to relevant blog articles that deepen the category understanding.

### 6.6 FAQ Section
4–6 Q&As specific to the category. Collection page FAQs skew pre-purchase research:
- "How do I choose [product type]?"
- "What's the difference between [Product A type] and [Product B type]?"
- "Which [product type] is best for [specific use case]?"
- "What should I look for when buying [product type]?"
- "Are [category] a good gift?"
- "How long does [product type] typically last?"

Each answer 2–4 sentences, specific and useful. Matches FAQPage JSON-LD one-to-one.

### 6.7 Related Collections Section
3–4 cards linking to sibling collections, related categories, or parent/child collections:
- Each card: collection image, collection name, product count, link
- Drives category-to-category browse behavior and distributes link equity across the catalog

---

## Phase 7 — Product Grid Requirements

### 7.1 Grid Density
Grid density per client design system, documented in the Parameter Sheet:
- 2-column mobile, 3–4 column tablet, 4 column desktop (default)
- 3-column desktop for premium or image-heavy products
- Product card aspect ratio consistent within a collection

### 7.2 Minimum Products to Launch
A collection page launches with minimum 4 products. Fewer products indicates the collection should merge into a parent or wait for more inventory before launching.

### 7.3 Default Product Display
Per page default: 12–24 products before pagination or "View More" trigger. Pagination strategy per Phase 9.

### 7.4 Product Card Requirements
Each product card displays:
- Product image (primary product shot; hover to show secondary if platform supports)
- Product name
- Price (with compare-at price strikethrough if on sale)
- Star rating (when reviews exist)
- Review count (when meaningful — 5+ reviews typically)
- Quick-view or shop button (optional per client UX)
- Variant swatches (for products with color or material variants where visual variant selection adds value)
- Availability indicator when out of stock or low stock

### 7.5 Product Card Interaction
- Primary click target: product card links to product page
- Optional hover state: swap to secondary product image, show "Quick View" or "Add to Cart" button
- Loading state for new products added via "View More" button
- Accessible focus states for keyboard navigation

### 7.6 Out-of-Stock Handling
Out-of-stock products still appear in the grid but with:
- Clear "Sold Out" or "Out of Stock" label overlaying the card
- Disabled quick-add action
- Card still clicks through to the product page (where the back-in-stock waitlist form lives per Doc 4 Phase 13.3)

### 7.7 Sort Order Default
Default sort per Client Parameter Sheet. Common defaults:
- Best-selling (high-conversion default for established catalogs)
- Newest (for brands emphasizing freshness)
- Manual curation (for brands with opinion-led merchandising)
- Featured (a client-controlled featured order that overrides algorithmic sort)

---

## Phase 8 — Filtering & Sorting UX

### 8.1 When to Include Filters
Filters make sense when the collection contains 20+ products with meaningful attribute variance. Collections with fewer products may rely on sort alone.

### 8.2 Common Filter Types
- **Price range** (slider or bucketed ranges)
- **Material** (for product categories with material variance)
- **Color** (swatch-based)
- **Size** (for apparel, prints, decks with multiple editions)
- **Use case** (category-specific: "for beginners," "for daily practice," "gift-ready")
- **Rating** (4-star and up, 3-star and up)
- **In stock only** (toggle)

### 8.3 Filter UX Requirements
- Filter state reflected in URL parameters (allows sharing and bookmarking filtered views)
- Filter state preserved on page refresh and back-navigation
- Active filter count visible (e.g., "3 filters active")
- Clear-all-filters button present when filters are active
- Mobile: filters in a drawer or modal, not inline (inline filters consume too much mobile viewport)

### 8.4 Sort Options
Standard sort options per collection:
- Featured (client curation)
- Best-selling
- Newest
- Price: low to high
- Price: high to low
- Top rated

Sort state does not need to reflect in URL parameters unless the client requests shareable sort states.

### 8.5 Filter & Sort Combination
Filters and sort operate together. Filters narrow the set; sort orders the set. Both update the grid without a full page reload (AJAX or similar) for smooth UX.

---

## Phase 9 — Pagination Strategy

### 9.1 Acceptable Pagination Patterns
Three patterns, selected per client design and platform capability:

**Pattern A — Numbered Pagination:** Page 1, 2, 3, ..., Last. URL pattern: `/collections/slug?page=2` or `/collections/slug/page/2`.

**Pattern B — "View More" Button:** Button loads next batch of products into the existing grid. URL updates to reflect the loaded-state (e.g., `?page=2` appended).

**Pattern C — Infinite Scroll:** Products load as the user scrolls. URL updates to reflect the scroll position. Use only when the client prioritizes browse engagement over SEO-friendly pagination UX.

### 9.2 Paginated Page Indexing (Modern 2026 Approach)
Google deprecated the `rel="prev" / rel="next"` indexing signal in 2019. Current best practices:

- Each paginated page (page 2, page 3, etc.) has a **self-referential canonical** pointing to its own URL (not page 1)
- Paginated pages are NOT `noindex` — they contain unique product listings and deserve indexing
- Paginated pages are reachable via standard crawlable HTML links (not JavaScript-only navigation)
- The first page of paginated results uses the collection's canonical URL without page parameters

### 9.3 Title Tag on Paginated Pages
Append page number to title tags for pages 2+:
- Page 1: `Affirmation Card Decks | Hand-Illustrated by Creative Maniacs | Rage Create`
- Page 2: `Affirmation Card Decks — Page 2 | Rage Create`
- Page 3: `Affirmation Card Decks — Page 3 | Rage Create`

### 9.4 Meta Description on Paginated Pages
Page 1 uses the unique meta description. Pages 2+ can use the same meta description or a simplified version. Do not leave meta descriptions empty on paginated pages.

### 9.5 Infinite Scroll SEO Mitigation
When using infinite scroll (Pattern C), include a crawlable "View All" link or expose traditional pagination as a progressive-enhancement fallback. Googlebot does not always execute JavaScript far enough to trigger scroll-loaded content.

---

## Phase 10 — Faceted Navigation SEO

Faceted navigation (filters that create unique URLs via parameters) creates indexing challenges. Mismanaged facets generate millions of low-value URLs that waste crawl budget and dilute link equity.

### 10.1 Default Faceted Navigation Treatment
Filter URLs (e.g., `?color=red&price=0-25`) follow these rules:

- **Canonical points to the unfiltered collection URL**, not the filtered URL
- Faceted URLs do NOT get their own meta description variations
- Faceted URLs do NOT appear in sitemap.xml
- Default filter combinations are `noindex,follow` to pass link equity while avoiding index bloat

### 10.2 Strategic Faceted URL Indexing
Some filter combinations have enough search volume to justify dedicated landing pages with their own title, meta description, and indexability. Examples:
- `/collections/affirmation-decks/daily-practice` (not a query parameter, a proper URL)
- `/collections/affirmation-decks/gift-ready`

These are built as dedicated sub-collection or attribute collection pages (Phase 2.2 or 2.3), not as filtered URLs. The test: does this filter combination have enough search volume to warrant its own title tag, meta description, and editorial content? If yes, it deserves a proper URL. If no, it remains a filter parameter with canonical to the parent collection.

### 10.3 Robots.txt Controls
Client robots.txt disallows crawling of meaningless filter parameter combinations. Example patterns to block:
- `Disallow: /collections/*?sort=*`
- `Disallow: /collections/*?page=*` (if pagination should be reached via primary navigation instead)
- `Disallow: /collections/*?*&*` (blocks multi-parameter combinations)

Per-client robots.txt rules documented in the client's SEO log. Do not apply blanket rules that could block important paginated content.

### 10.4 Google Search Console URL Parameter Tool
The URL Parameter Tool in Google Search Console was deprecated in April 2022. Facet management now lives entirely in robots.txt, canonical tags, and meta robots directives.

---

## Phase 11 — Word Count & Keyword Placement

### 11.1 Word Count Targets (Editorial Content Only, Not Including Product Grid)
- Top-level category collection: 700–1,400 words total (above + below grid)
- Sub-category collection: 500–1,000 words total
- Attribute / tag collection: 350–700 words total
- Curated collection: 250–500 words total
- Seasonal / campaign collection: 250–550 words total

Word counts measure editorial prose in the hero intro, below-grid content, and FAQ. They do not include product card text, filter labels, or navigation text.

### 11.2 Primary Keyword Placement (Required)
- Title tag (first)
- H1
- Meta description (first 20 words)
- First 100 words of body content
- At least 2 H2 headings across editorial sections
- At least 2 times in below-grid buyer's guide content

### 11.3 Brand Name Placement
Calibrated to 1 instance per 120–140 words of prose (Core Standards Phase 3.2). For a top-level collection with 1,000 words of editorial content, that is 7–8 brand mentions across hero intro, below-grid content, and FAQ. First instance in the first sentence of the hero intro. Bolded on every body-prose instance.

### 11.4 Category Entity Reinforcement
Collection pages benefit from repeated category entity terms across prose:
- Primary category term in hero intro, at least one H2, below-grid content, and 2+ FAQ answers
- Secondary category terms (subcategory names, related categories) in below-grid content
- Use-case entity terms (buyer situations) distributed across editorial content

---

## Phase 12 — Collection-Specific Schema

Inherits Core Standards Phase 12. Collection-specific requirements:

### 12.1 CollectionPage JSON-LD (Required)
- `@context`, `@type: CollectionPage`
- `name` (collection name, matches H1)
- `description` (collection description, distinct from meta description but related)
- `url` (collection URL, absolute)
- `mainEntity` (references the ItemList — see Phase 12.2)
- `breadcrumb` (references BreadcrumbList)
- `publisher` (references Organization `@id` from Parameter Sheet)

### 12.2 ItemList JSON-LD (Nested in CollectionPage.mainEntity)
- `@type: ItemList`
- `numberOfItems` (total count across all pages of the collection, not only the current page)
- `itemListElement` (array of ListItem entries)

Each ListItem:
- `@type: ListItem`
- `position` (1-based index)
- `url` (product page URL)
- `name` (product name)
- `image` (product image URL)

ListItem entries represent the products shown on the current page of the collection. Paginated pages carry their own ItemList reflecting that page's products.

### 12.3 BreadcrumbList JSON-LD (Required)
Matches the visible breadcrumb. Typical hierarchy: Home → Parent Collection → Current Collection.

### 12.4 FAQPage JSON-LD
When the FAQ section is present, carry FAQPage schema matching the visible FAQ one-to-one.

### 12.5 Product Schema on Cards
Individual product cards in the grid carry lightweight Product schema markup handled by the platform's default output (Shopify, WooCommerce). Do not duplicate full Product schema on the collection page — the product page carries the authoritative Product schema per Doc 4.

### 12.6 Forbidden Patterns
- ItemList entries pointing to products that are out of stock or discontinued (remove or filter these from the grid before serving)
- ItemList position values that do not match the visible grid order
- CollectionPage schema on pages that are not true collections (e.g., a single product variant page should not use CollectionPage)

---

## Phase 13 — Collection Imagery Requirements

Collection pages use less imagery than product pages but still depend on strong visual design.

### 13.1 Hero Imagery
One of four hero imagery treatments per Client Parameter Sheet design direction:

**Treatment A — Single Lifestyle Image:** One high-quality photo of the category in a buyer-situation context (e.g., someone doing a daily affirmation practice with one of the decks). Minimum 1920×800 px, optimized under 300 KB.

**Treatment B — Curated Product Collage:** 3–6 products from the collection arranged as an editorial collage. Used when the category's visual variety is a selling point.

**Treatment C — Brand Graphic:** Typographic or illustrated hero aligned with the brand voice. Used when the brand's aesthetic carries the hero better than product photography.

**Treatment D — No Hero Image:** Minimal hero with strong typography and color treatment, no imagery above the fold. Used when product grid density is the star and additional imagery would slow first paint.

### 13.2 Sub-Collection Navigation Imagery
Sub-collection links can be imaged (pills, image cards) or text-only depending on design system. Imaged sub-collection navigation uses a consistent image size and treatment across all sub-collections.

### 13.3 Below-Grid Editorial Imagery
Buyer's guide sections benefit from supporting imagery:
- Illustration or chart showing category comparison (information gain anchor per Phase 3.5)
- Lifestyle photo showing a specific use case
- Infographic summarizing the buyer's guide framework

### 13.4 Image Optimization
All imagery follows Core Standards Phase 13.2 image optimization rules:
- WebP or AVIF with JPEG fallback
- Descriptive alt text (not keyword-stuffed)
- Lazy-load below the fold
- Hero imagery under 300 KB

---

## Phase 14 — Trust Signals on Collection Pages

Collection pages carry Trust signals distinct from product pages. Collection-level Trust signals reassure buyers before they click into individual products.

### 14.1 Category-Level Trust Indicators
Visible above or near the product grid:
- Aggregate review count across the category ("4.8★ average across 1,200+ reviews")
- Category-specific press mentions or awards
- Category guarantee or satisfaction promise if it applies at the category level
- Free shipping threshold notice (if it applies)

### 14.2 Product Card Trust Signals
Every product card displays:
- Star rating (visible, not buried behind hover)
- Review count where meaningful (5+ reviews)
- Availability indicator (out-of-stock, low-stock badge where client wants to expose scarcity)
- Sale badges and compare-at pricing for discounted products

### 14.3 Below-Grid Trust Content
The buyer's guide section serves as category-level Authoritativeness signal. A well-written buyer's guide positions the client as a category expert, not a generic catalog. Name the expert who informs the guide where a client has a named category expert.

### 14.4 Policy Link Consistency
Shipping policy, return policy, and guarantee links are accessible from the footer (site-wide) and referenced in the FAQ section where relevant.

---

## Phase 15 — Internal Linking & llms.txt Integration

Inherits Core Standards Phase 10. Collection-specific additions:

### 15.1 Inbound Links to the Collection Page
Every new collection page triggers an audit of site-wide linking opportunities:
- Homepage (main nav, featured collections section)
- Other top-level collections (cross-navigation pills, footer collection list)
- Parent collection (for sub-categories)
- Blog articles that cover related topics (link from relevant articles to this collection)
- Product pages within the collection (breadcrumb navigation)
- Related collections cross-link

### 15.2 Outbound Links From the Collection Page
Every collection page links to:
- Every product in the collection (via product cards)
- Parent collection (via breadcrumb)
- Sub-collections (for top-level categories with children)
- 2–3 relevant blog articles (in below-grid editorial content)
- 3–4 related collections (in the Related Collections section)
- Policy pages (shipping, returns) in FAQ answers where relevant

### 15.3 Anchor Text for Collection Links
Descriptive and category-specific. Examples:
- "our full affirmation deck collection"
- "the oracle deck buyer's guide explains how to choose"
- "daily affirmation decks designed for morning practice"

### 15.4 llms.txt Integration (Required on Every Launch)
Per Core Standards Phase 7.2, every top-level category collection page gets added to the client's `llms.txt` file under the Primary Services / Products section. Format:

```
- [Collection Name](https://clientsite.com/collections/slug): [One-sentence collection description]
```

Collections take priority over individual products in the llms.txt Primary Services / Products section because AI models use category-level context to answer broader buyer queries. For a client with 5 top-level categories and 50 products, the llms.txt lists the 5 collections with rich descriptions, then selectively lists individual standout products (best sellers, signature products, recent launches).

Sub-collections and attribute collections do NOT need individual llms.txt entries unless they have meaningful standalone search volume and editorial content. Curated and seasonal collections follow the same standard — include in llms.txt only when the collection represents a meaningful buyer entry point.

---

## Phase 16 — Content Freshness (Collection-Specific)

Inherits Core Standards Phase 15. Collection-specific additions:

### 16.1 Freshness Review Cadence
Collection pages need regular review because product membership, pricing ranges, inventory availability, and category positioning shift with the catalog.

- **Top-level category collections:** monthly review (every 30 days)
- **Sub-category collections:** monthly review
- **Attribute / tag collections:** quarterly review (every 90 days)
- **Curated collections:** quarterly review, with re-curation if collection membership has stagnated
- **Seasonal / campaign collections:** weekly review during the live window, then deindex or archive after the window closes

### 16.2 Per-Review Refresh Pass
Every collection page review includes:
- Product membership verified (new products added, discontinued products removed)
- Out-of-stock products reviewed (leave visible with "Sold Out" if brief, remove from collection if extended)
- Editorial content above and below the grid refreshed (new seasonal angles, updated statistics, new related blog links)
- Buyer's guide content refreshed with current category thinking
- Aggregate rating signal refreshed (category-level review count and rating)
- FAQ section expanded based on current buyer questions (from Google Search Console query data, customer service logs, reviews)
- Related Collections cards refreshed
- `dateModified` updated in schema

### 16.3 Collection Refresh Triggers
Events that trigger immediate refresh:
- New products added to the category
- Products discontinued or removed from the category
- Collection drops 3+ positions in primary keyword ranking
- Category-level press mention, award, or feature to display
- Seasonal opportunity (Mother's Day approaching for gift-ready collections, etc.)
- Client pivots category positioning or renames the category

### 16.4 Collection Merge, Split, and Sunset Protocol

**Merge:** When two collections have overlapping product membership or audience, merge into a single collection and 301 redirect the retired URL to the combined collection.

**Split:** When a collection grows too broad (40+ products spanning distinct buyer intents), split into sub-collections. The parent collection remains and links to the new sub-collections. Products are tagged into the appropriate sub-collection.

**Sunset:** When a collection no longer serves the catalog or the brand, 301 redirect the collection URL to the most relevant surviving collection or to the parent category. Do not leave dead collection pages live.

---

## Phase 17 — QA Verification Checklist

Run every item before a collection page goes live. Combine with Core Standards Phase 16 pre-publication gates.

### SEO / Technical
- [ ] Title tag category-first, 50–60 characters
- [ ] Meta description 140–160 characters, category keyword in first 20 words, differentiator + browse action
- [ ] Canonical URL correct and absolute (self-referential on paginated pages)
- [ ] One H1 with category name
- [ ] Minimum 3 H2s across editorial content sections
- [ ] Primary category keyword in first 100 words
- [ ] OG tags complete (og:type, title, description, URL, image, site_name)
- [ ] Twitter Card tags complete
- [ ] CollectionPage JSON-LD with name, description, url, mainEntity, breadcrumb, publisher
- [ ] ItemList nested in mainEntity with numberOfItems and itemListElement array
- [ ] BreadcrumbList JSON-LD matches visible breadcrumb
- [ ] FAQPage JSON-LD matches visible FAQ block one-to-one
- [ ] All schema validates in Google Rich Results Test
- [ ] SERP intent validation completed and documented

### Entity SEO
- [ ] Brand name bolded at calibrated density (1 per 120–140 words of prose)
- [ ] Brand name in first sentence of hero intro
- [ ] Category entity repeated across hero, at least one H2, below-grid content, and 2+ FAQ answers
- [ ] Zero bare "we" violations (unless client override active)

### E-E-A-T Signals
- [ ] **Experience:** curated category story in hero intro
- [ ] **Experience:** named framework or buyer's guide in below-grid content
- [ ] **Experience:** category imagery (not stock, reflects real use)
- [ ] **Authoritativeness:** category-level aggregate rating displayed
- [ ] **Authoritativeness:** press or awards displayed where available
- [ ] **Expertise:** buyer's guide with specific evaluation dimensions
- [ ] **Trust:** policy links accessible (shipping, returns)
- [ ] **Trust:** out-of-stock products clearly labeled in the grid

### Content Quality
- [ ] Information gain elements present (minimum 3, at least 1 client-specific)
- [ ] Named framework or category taxonomy documented in below-grid content
- [ ] Zero banned phrases (Core Standards Phase 8 + client-specific additions)
- [ ] Zero AI artifact structures
- [ ] Human editorial pass completed
- [ ] Word count on target per collection class (Phase 11.1)
- [ ] People-first content check passed (Core Standards Phase 14.4)

### Collection Hero
- [ ] H1 category name present
- [ ] Intro paragraph 100–300 words with brand name in first sentence
- [ ] Hero imagery treatment applied per client design system
- [ ] Optional CTA present where it adds value

### Product Grid
- [ ] Minimum 4 products in the collection (otherwise merge to parent)
- [ ] Grid density matches client design system (2/3/4 column responsive)
- [ ] Product cards include: image, name, price, rating, availability indicator
- [ ] Out-of-stock products labeled clearly in grid
- [ ] Default sort order applied per Parameter Sheet
- [ ] Product card click target functional (links to product page)

### Filter & Sort
- [ ] Filters present when collection contains 20+ products with meaningful attribute variance
- [ ] Filter state reflects in URL parameters
- [ ] Active filter count visible
- [ ] Clear-all-filters button present when filters are active
- [ ] Mobile filter UX in drawer or modal (not inline)
- [ ] Sort options: Featured, Best-selling, Newest, Price low-to-high, Price high-to-low, Top rated

### Pagination
- [ ] Pagination pattern selected and implemented per Phase 9.1
- [ ] Paginated page canonicals self-referential (not pointing to page 1)
- [ ] Paginated pages crawlable via HTML links (not JavaScript-only)
- [ ] Paginated page title tags append page number for pages 2+
- [ ] Infinite scroll has View All or pagination fallback (when used)

### Faceted Navigation
- [ ] Filter URLs have canonical pointing to unfiltered collection URL
- [ ] Filter URLs excluded from sitemap.xml
- [ ] Meaningful filter combinations built as dedicated sub-collections (not filter URLs)
- [ ] Robots.txt rules documented for facet parameter handling

### Editorial Content (Below Grid)
- [ ] Buyer's guide section with 3–5 H3 subsections
- [ ] Use-case framing content present
- [ ] Named framework or taxonomy presented as information gain anchor
- [ ] 2–3 internal links to relevant blog articles
- [ ] FAQ section with 4–6 Q&As matching FAQPage schema

### Related Collections
- [ ] Related Collections section with 3–4 cards
- [ ] Each card: collection image, name, product count, link

### Internal Linking
- [ ] Every product in collection linked via product cards
- [ ] Breadcrumb links to parent collection (or Home)
- [ ] Sub-collection navigation present for top-level categories with children
- [ ] 2–3 blog article links in below-grid editorial
- [ ] 3–4 related collection links in Related Collections section
- [ ] Collection added to `llms.txt` per Phase 15.4 (top-level category collections)

### Site-Wide Integration
- [ ] Collection added to main navigation (top-level categories)
- [ ] Collection added to footer catalog where applicable
- [ ] Homepage featured-collections section updated
- [ ] Parent collection updated to include this sub-collection in sub-collection navigation
- [ ] Relevant blog articles audited for inbound link opportunities to this collection
- [ ] Product pages within collection verified to breadcrumb back to this collection

### Design
- [ ] Hero matches client design tokens
- [ ] Product grid density responsive (2/3/4 column)
- [ ] Filter & Sort bar sticky on desktop, accessible on mobile
- [ ] Mobile filter UX in drawer or modal
- [ ] Related Collections section styled consistently across collections
- [ ] Responsive tested at 320px, 768px, 1024px, 1440px
- [ ] Images optimized (WebP/AVIF, descriptive alt, under 300KB)
- [ ] Core Web Vitals within targets

### Freshness Cadence
- [ ] Collection-specific review cadence documented (monthly for top-level and sub-category, quarterly for attribute and curated, weekly during campaign for seasonal)

### Sitemap & Indexing
- [ ] Collection URL added to sitemap.xml
- [ ] `<lastmod>` set to publish date
- [ ] Priority: top-level category 0.8, sub-category 0.7, attribute 0.6, curated 0.5, seasonal 0.5
- [ ] Collection URL submitted to Google Search Console for crawl

---

## Quick Reference: The Non-Negotiables

Nine rules that override everything else when time is short:

1. Minimum 4 products in the collection (fewer = merge to parent)
2. Hero intro with H1, brand name in first sentence, primary category keyword in first 100 words
3. Product grid with cards showing image, name, price, rating, availability
4. Below-grid buyer's guide with named framework or category taxonomy (information gain anchor)
5. FAQ section with 4–6 category-level Q&As matching FAQPage schema
6. CollectionPage + ItemList + BreadcrumbList + FAQPage schema on every collection
7. Canonical strategy: paginated pages self-referential, filter URLs canonical to unfiltered collection
8. Top-level category collections added to `llms.txt` on launch
9. Related Collections section with 3–4 cross-category links

Everything else matters. These nine are the floor.

---

*Version 1.0 — April 2026 — ROI.LIVE / Jason Spencer*
*Inherits from ROI.LIVE Agency Core Standards v1.1.*
