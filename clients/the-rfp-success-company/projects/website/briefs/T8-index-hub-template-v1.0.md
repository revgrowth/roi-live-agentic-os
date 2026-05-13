# T8 Index Hub Template v1.0 (mirrored from ClickUp doc)

**Source:** ClickUp doc 8cma26h-17033, page 8cma26h-8633
**Mirrored:** 2026-05-13 (Step 7B)
**Status:** Active brief - ClickUp doc remains canonical source. This mirror exists for repo-local reference during content production.

---

**THE RFP SUCCESS® COMPANY**
**CREATIVE BRIEF**
**Index / Hub Page Template (T8)**
_The master template governing every index / hub page on the site. Reference build: Case Studies Hub. Serves 6 launch hubs: /case-studies/, /services/, /industries/, /testimonials/, /blog/, /resources/. Shared template structure with distinct filter dimensions and card patterns per hub._

| **Template ID** | **T8** |
| ---| --- |
| **Template Name** | Index / Hub Page |
| **Reference Build** | Case Studies Hub (/case-studies/) |
| **Serves** | 6 launch hubs: /case-studies/, /services/, /industries/, /testimonials/, /blog/, /resources/ |
| **Version** | v1.0 |
| **Date** | April 22, 2026 |
| **Prepared By** | Jason Spencer | [ROI.LIVE](http://ROI.LIVE) |
| **Governing SOPs** | [ROI.LIVE](http://ROI.LIVE) Agency Core Standards v1.1 — especially Phase 6 (AEO/GEO), Phase 10 (Internal Linking), Phase 12.3 (CollectionPage schema) |
| **Companion Docs** | Master Client Feedback Tracker v1.0, Brand Voice v2.2, Sitemap v10, Page Template Map v1.0, Parameter Sheet v1.0, T3/T4/T5/T9/T10 Creative Briefs |

# **Creative Brief — Index / Hub Page Template (T8)**
## **The RFP Success® Company — Index / Hub Pages**
**Template ID:** T8
**Template Name:** Index / Hub Page
**Reference Build:** Case Studies Hub (\`/case-studies/\`)
**Serves:** 6 launch hub pages — \`/case-studies/\`, \`/services/\`, \`/industries/\`, \`/testimonials/\`, \`/blog/\`, \`/resources/\`
**Version:** 1.0
**Date:** April 22, 2026
**Prepared by:** Jason Spencer | [ROI.LIVE](http://ROI.LIVE)
**Governing SOPs:**
*   [ROI.LIVE](http://ROI.LIVE) Agency Core Standards v1.1 — especially Phase 6 (AEO/GEO), Phase 10 (Internal Linking), Phase 12.3 (CollectionPage schema)
**Companion Documents:**
*   Master Client Feedback Tracker v1.0
*   Brand Voice & DNA Guide v2.2
*   Sitemap v10 (Advisory Pivot — Cleaned)
*   Page Template Map v1.0
*   Client Parameter Sheet v1.0
*   T3, T4, T5, T9, T10 Creative Briefs
## **HOW TO USE THIS DOCUMENT**

| **Part** | **Audience** | **What It Contains** |
| ---| ---| --- |
| Part 1 — Template Strategy | Jason + Lisa + Strategy Team | Why hub pages exist, why they're not the same job, how they scale site-wide internal linking |
| Part 2 — Template Design & Copy | Raja + Design Team + Copywriters | Section-by-section blueprint for the Case Studies Hub (reference build), including filter logic, card patterns, empty states |
| Part 3 — Technical Specifications | SEO + Development Team | CollectionPage schema, filterable-grid behavior requirements, Entity SEO, QA checklist |
| Part 4 — 6-Hub Variation Guide | Strategy + Copywriting + Design | Per-hub customization for the remaining 5 hubs. Each hub has its own filter schema, card pattern, and routing logic. Not interchangeable. |

**For Raja:** Part 2 is your primary working document. Build the Case Studies Hub first — it has the most structural complexity (3-dimension filtering, variable card counts, empty-state handling). Once approved, Part 4 gives you the variation per hub. The 6 hubs share the template structure but each has different filter dimensions and card content.
**For Lisa:** Read Part 1 to understand why each hub does a different job. Part 4 is your sign-off opportunity — confirm the hub-by-hub routing logic matches how you want visitors to navigate the site.
**For Jason:** All four parts. Part 4 is the scope call — 6 hub variants with distinct filter dimensions means 6 approvals, not 1.
## **TEMPLATE OVERVIEW**
T8 is the site's navigation infrastructure. Every other template points to T8 hubs as cross-link destinations. Service pages link to \`/services/\`. Case studies link to \`/case-studies/\`. Industry pages link to \`/industries/\`. Until T8 ships, those internal links break or route to undefined destinations.
Six hubs at launch, each with a different job:

| **URL** | **Hub Name** | **Primary Job** | **Content Type** | **Filter Dimensions** |
| ---| ---| ---| ---| --- |
| \`/case-studies/\` | Case Studies Hub (REFERENCE BUILD) | Route readers to specific client success stories | 10+ case study cards | Industry, Service, Result Type |
| \`/services/\` | Services Overview | Route visitors across all 3 paths (Win Strategist, Express, DIY) | 5 Win Strategist + 1 Express + 1 DIY cards | Revenue tier, Engagement type |
| \`/industries/\` | Industries We Serve | Route readers to industry-specific vertical pages | 12 industry cards | Tier A/B/C readiness |
| \`/testimonials/\` | Client Testimonials | Display 75 testimonials organized by service tier | 75 testimonial cards | Service tier, Industry |
| \`/blog/\` | Blog / Insights Hub | Route readers to blog content | 5 launch articles + 64+ roadmap | Cluster, Date, Topic |
| \`/resources/\` | Resources Hub | Route readers to gated downloads | 5 launch lead magnets | Asset type, Topic |

These are **not interchangeable**. A testimonials hub is structurally different from a blog hub. The template establishes the shared pattern (hero + filter bar + card grid + pagination + CTA) but Part 4 documents the variations.
Three jobs T8 must do:
**First, it routes.** The primary job of a hub is getting visitors to the right child page fast. Good hubs are scan-friendly (cards with clear category signals), filterable (visitors can narrow by their interest), and paginated efficiently (no infinite scrolls, no buried gems).
**Second, it establishes topical category authority.** Per Core Standards Phase 12.3, CollectionPage schema + ItemList schema signals to search engines and AI systems that this is a category authority page — a canonical index of content in a specific topical area. Google treats well-structured category pages differently from content pages; they show up in different SERP features.
**Third, it concentrates internal link equity.** Every case study, every service page, every industry page links UP to its hub. The hub aggregates link equity from all child pages. A well-designed hub with strong child-page links becomes a topical-authority anchor even though the hub itself has less content than its children.
**Strategic context:** T8 hubs are the most-linked pages on the site after the homepage. Every T3/T4/T5 template brief references T8 hubs as link destinations. Shipping T8 unblocks the internal linking architecture that every other template already depends on.
## **ITEMS REQUIRING CLIENT CONFIRMATION**
**Status:** 5 items pending.

| **#** | **Item** | **Status** | **Current Assumption** |
| ---| ---| ---| --- |
| 1 | Case study permissions per Sitemap v10 Open Item #4 | PARTIAL | Hub displays cards for all 10 launch case studies. Permissions pending on 9 of 10. Reference build assumes permissions land before launch. |
| 2 | Testimonial permissions per Sitemap v10 Open Item #5 | PARTIAL | Testimonials hub displays 75 testimonials. Bulk permission confirmation needed before launch. |
| 3 | Filter UX behavior — client-side vs. URL-parameterized | PENDING DESIGN DECISION | Recommendation per §2.5: URL-parameterized filters (e.g., \`/case-studies/?industry=healthcare\`) for shareability and SEO crawlability. Alternative: client-side JavaScript filtering only. Awaiting decision. |
| 4 | Resources Hub content scope | PARTIAL | Current scope: 5 launch gated downloads (D.A.R.E. eBook, True Cost of Losing White Paper, State RFP Checklist, Tech RFP Starter Kit, plus existing assets to migrate from SharePoint — 101 Ways to Win More Proposals eBook, Checks and Balances, Testimonial Template, RFP Success Playbook). Lisa to confirm final asset list. |
| 5 | Testimonial organization by tier | PENDING | Parameter Sheet §4.7 and Sitemap v10 PART 4 indicate 75 testimonials organized by service tier. Confirm tier-count breakdown and display priority. |

# **PART 1 — TEMPLATE STRATEGY**
## **1.1 Template Purpose**
Hub pages aren't content pages. They're routing pages. The goal isn't to keep visitors on the hub — it's to send them to the right child page as fast as possible.
That reframes how the template works:
*   **The hero is short.** No long value-prop unrolling like T3 service pages. A sentence or two answering "what is this collection?" and then straight to the cards.
*   **The card grid is prominent.** Cards take up most of the page real estate because cards are the navigation mechanism.
*   **The filter bar is functional, not decorative.** Visitors who know what they want filter to narrow. Visitors who are browsing scroll the grid.
*   **The page still needs SEO content.** Some copy above the grid gives search engines a category description. 200–300 words, not 2,000. Enough to rank for category queries; not so much that visitors have to scroll past prose to reach the cards.
Three specific jobs per hub:
**First, \`/case-studies/\` concentrates proof.** Every T4 case study lives here. Prospects deep in a buying journey use this page to scan the full portfolio. The filter dimensions (industry, service, result type) match the three questions prospects ask: "have you worked in my industry," "have you delivered this service," "have you produced this kind of outcome."
**Second, \`/services/\` routes across paths.** This is the only site page that shows all 3 paths (Win Strategist, Express, DIY) side-by-side as equal peers. Homepage shows the paths as tiles but commits to Win Strategist as the primary. Services Overview is the neutral hub that routes visitors to the path matching their revenue tier.
**Third, each hub builds its own category authority.** \`/industries/\` ranks for "industries RFP consulting" style queries. \`/blog/\` is the canonical entry for the site's thought-leadership content. \`/resources/\` serves lead-capture SEO. Each hub's SEO strategy differs.
## **1.2 Information Gain Brief**
Per Core Standards Phase 5.2. Hub pages have a different information gain structure than content pages — the value is in the collection's completeness and organization, not in original analysis.
**Primary keyword (Case Studies Hub reference):** RFP case studies, government contract case studies
**Secondary keywords:** RFP consulting case studies, SLED government contract success stories, RFP win rate case studies
**SERP delta:**
*   Most competitor "case study" pages show 1–3 cases with little filtering or categorization
*   Zero competitors publish 10+ quantified named case studies across multiple industries with filter-based navigation
*   Zero competitors cross-link case studies bidirectionally with industry and service pages
**Information gain elements on T8 hubs (generally):**
1. **Comprehensive collection** — the hub contains every entity in its category (every case study, every service, every industry)
2. **Filterable organization** — filter dimensions matching how visitors would naturally narrow (industry, service, revenue tier, etc.)
3. **Category description with insider context** — 200–300 words that don't just list what's in the hub but explain the category's organizational logic
4. **CollectionPage + ItemList schema** — declares the hub as a canonical category index
5. **Bidirectional link aggregation** — the hub links to every child page; every child page links back to the hub
**Information Gain Assessment:** MODERATE to HIGH per hub, depending on collection size and specificity. Case Studies Hub with 10+ named quantified cases is HIGH. Blog Hub at launch with 5 articles is MODERATE until more content publishes.
## **1.3 Conversion Goals**

| **Priority** | **Goal** | **How We Measure It** |
| ---| ---| --- |
| 1 | Route visitors to the right child page fast | Click-through rate from hub to child pages; time-on-hub (should be SHORT — 20–40 seconds for efficient routing) |
| 2 | Rank for category-level keywords | SERP rankings for "RFP case studies," "RFP consulting services," etc. |
| 3 | Concentrate internal link equity on category authority | Pages ranking for category queries; AI answer engine citations for "what kinds of \[category\] does The RFP Success Company offer" |
| 4 | Support SEO/AEO for child pages via bidirectional linking | Child page ranking improvements attributable to hub cross-links |
| 5 | Provide sales team with shareable category links | Direct links shared in discovery calls and emails |

**Note:** Hubs are NOT primary conversion pages. A prospect who lands on \`/case-studies/\` and then books a discovery call without clicking through to a specific case study is unusual. The standard journey is Hub → Child Page → CTA. The hub is a means, not a destination.
## **1.4 Target Audience**
Hub visitors split into two dominant reader types:
### **Audience A: The Filter User**
Knows what they're looking for. Filters immediately. Examples:
*   Healthcare company visitor filtering \`/case-studies/?industry=healthcare\`
*   Wine-tier prospect filtering \`/services/?tier=wine\`
*   Transportation industry prospect filtering \`/industries/?readiness=proof-rich\`
Spends 30–60 seconds. Filters once. Clicks through to the matching card.
### **Audience B: The Browser**
Doesn't have a specific target. Scrolling to see what's available. Examples:
*   Prospect reading about RFP Success for the first time, browsing \`/case-studies/\` to see the range of client outcomes
*   Visitor evaluating the firm's breadth by scanning \`/industries/\` to see how many verticals are served
*   Content consumer browsing \`/blog/\` for interesting topics
Spends 2–3 minutes. Scans multiple cards. May click multiple cards or may leave without clicking.
Both audiences are served by the same template. The filter bar supports Audience A. The card grid with clear labeling supports Audience B.
## **1.5 Conversion Psychology**
Hub pages convert through efficient routing. The psychology isn't "persuade the visitor to take an action on this page" — it's "give the visitor a clear path to the right child page with minimal friction."
Three principles:
1. **Cards are the navigation.** Every card should signal category clearly (industry tag pill, service tag pill, date stamp) so a visitor can match their interest to the card in under a second of scanning.
2. **Filters are for narrowing, not mandatory.** Default state shows everything. Filters are opt-in. A visitor who wants to browse should see the full collection without being forced to choose a filter first.
3. **Don't hide things behind pagination.** If pagination is needed (for 75 testimonials, for example), show 12–24 items per page with clear pagination controls. Don't infinite-scroll, which breaks SEO crawlability and makes content hard to find.
## **1.6 Distinction from Other Site Pages**

| **Dimension** | **T8 Hub** | **T3 Service** | **T4 Case Study** | **T5 Industry** | **T9 Author Bio** | **T10 About** |
| ---| ---| ---| ---| ---| ---| --- |
| Purpose | Route to child pages | Convert to discovery call | Prove service outcome | Route to service (industry-qualified) | Establish expert entity | Establish organization entity |
| Primary content | Card grid | Conversion copy | Narrative | Industry copy | Bio + credentials | Company story + values |
| Schema primary | CollectionPage + ItemList | Service + Offer + FAQPage | Article + BreadcrumbList | CollectionPage + Service + FAQPage | ProfilePage + Person | AboutPage + Organization |
| Visitor time on page | 30 sec – 3 min | 3–6 min | 4–6 min | 3–5 min | 2–4 min | 2–4 min |
| Page length | 500–800 words (excluding cards) | 1,200–1,800 words | 800–1,200 words | 1,500–3,000 words | 800–1,200 words | 800–1,200 words |

## **1.7 SEO & GEO Architecture (Case Studies Hub reference build)**
Title: RFP Case Studies | Win Strategist Results | The RFP Success® Company
Description: See how The RFP Success® Company's Win Strategist engagements produce quantified outcomes for service-based businesses pursuing government contracts. Filter case studies by industry, service, or result type. Named clients across 10+ industries.
H1: Client Results — Named Case Studies Across 10+ Industries
URL: /case-studies/
Breadcrumb: Home > Case Studies
Canonical: [https://therfpsuccesscompany.com/case-studies/](https://therfpsuccesscompany.com/case-studies/)
**Primary Keyword:** RFP case studies, government contract case studies
**Secondary Keywords:** RFP consulting case studies, SLED success stories, proposal audit case studies
**Target Word Count:** 500–800 words (excluding card text)
**Content Freshness Signal:** "Last Updated" dateModified, refreshed when new case studies are added.
# **PART 2 — TEMPLATE DESIGN & COPY**
**Design Inheritance:** Full design system from T1 Homepage, T3, T4, T5. Same color palette, typography, section badges, CTA treatments.
**Design Character of T8:** Grid-forward and scan-friendly. Less prose than any other template. Cards dominate visually. Filter bar visible and functional. Pagination efficient. No long-scroll walls of text.
## **2.1 SEO Metadata (see §1.7)**
## **2.2 Breadcrumb Bar**
**Content:** Home > Case Studies (reference build)
**Design Notes:**
*   "Home" links to \`/\`
*   Current hub page not linked (it's the current page)
*   BreadcrumbList JSON-LD required (Part 3)
Per-hub variations in Part 4.
## **2.3 Hero Section**
_DESIGN TEAM: T8 hero is the shortest hero on the site. Visitors arriving on a hub want to get to the cards fast. The hero answers "what is this collection?" in one sentence and then steps aside._

| **Element** | **Content (Case Studies Hub reference)** |
| ---| --- |
| Section Badge | Client Results |
| H1 | Client Results — Named Case Studies Across 10+ Industries |
| Answer Capsule (subheadline) | Every Win Strategist engagement at The RFP Success® Company produces quantified outcomes — proposal win rate shifts, contract wins, revenue growth. Filter the collection below by industry, service, or result type. Named clients, quantified outcomes, real engagements. |
| Above-Fold Trust Bar | 76%+ Win Rate · $500M+ Client Wins · 10+ Named Case Studies |
| Primary CTA | (Optional on hubs) — omitted for reference build |

**Visual Direction:**
*   Compressed hero — 40–50vh height (not 70–80vh like T3/T5)
*   Dark charcoal background, consistent with site hero treatment
*   H1 large, bold, centered or left-aligned
*   Answer capsule below H1
*   Trust bar compressed
*   No primary CTA in hero — the cards ARE the CTAs on a hub page
*   Right side optional: hero visual (for Case Studies Hub, stylized grid graphic or case study composite). Keep it subtle — visitors need to scroll past the hero quickly.
**Layout (Desktop):** Full-width, 40–50vh.
**Layout (Mobile):** Compressed further — 30–40vh. H1 centered. Answer capsule below.
Per-hub variations in Part 4.
## **2.4 Category Description (SEO Layer)**
_DESIGN TEAM: 200–300 words of category-specific copy between the hero and the filter bar. This is SEO content — helps the hub rank for category queries. NOT marketing prose — category description with insider context._
**Section Badge:** (None — flows directly from hero)
**Body Copy (Case Studies Hub reference):**
The RFP Success® Company's case study library documents client outcomes across 10+ industries and every Win Strategist service. Every case features a named client, specific before/after metrics, and documentation of which engagement produced the result.
Three filter dimensions organize the library:
*   **Industry** — the vertical the client operates in, from Transportation to Healthcare to GovTech. Useful when comparing your company's situation to case studies in the same industry.
*   **Service** — which Win Strategist engagement produced the result. Useful when evaluating a specific service (Evaluator's Eye Audit, Embedded Content Refinement, etc.).
*   **Result Type** — the primary outcome pattern (win rate improvement, specific contract win, revenue growth, incumbent defense). Useful when you're targeting a specific kind of outcome.
Each case links to the full story plus the Win Strategist service that produced it. Every case earns a place in this library by meeting three criteria: the client has confirmed permission for public use, the outcome is quantified with verifiable before/after data, and the engagement maps to one of The RFP Success® Company's five Win Strategist services.
Case studies marked "Roadmap" are documented engagements with case study pages in production. Those pages publish as client permissions complete and content finalization cycles conclude.
**Visual Direction:**
*   Single-column prose, max width 700px
*   Background: light gray to separate from hero
*   Pull quote in margin optional: "Every case earns a place by meeting three criteria: confirmed permission, quantified outcome, and Win Strategist service mapping."
*   Closes naturally into the filter bar below
Per-hub variations in Part 4 — each hub has its own category description.
## **2.5 Filter Bar**
_DESIGN TEAM: The filter mechanism. Visible, functional, scannable. Supports URL parameterization for shareable filtered views. Not a heavy UI — simple tag-style or dropdown toggles._
**Design Pattern:**
Three filter dimensions on Case Studies Hub, displayed as a horizontal filter row:
\[All\] \[Industry ▾\] \[Service ▾\] \[Result Type ▾\] \[Clear Filters\]
**Filter Options (Case Studies Hub reference):**
**Industry Filter:**
*   Healthcare
*   Education
*   Technology / IT
*   GovTech
*   Transportation
*   Security Services
*   Professional Services
*   Travel Management
*   Healthcare Products
*   Government Consulting
**Service Filter:**
*   Evaluator's Eye Audit
*   Win Strategy Review
*   Embedded Content Refinement
*   Play to Win Consults
*   Library Content Development
*   Historical — Full Response (legacy cases)
**Result Type Filter:**
*   Win Rate Improvement
*   Contract Won
*   Revenue Growth
*   Incumbent Defended
*   Team Capability Built
**Filter Logic:**
*   Default state: All cards visible
*   Single filter: Shows cards matching that filter
*   Multiple filters (e.g., Industry=Healthcare + Service=Embedded Content Refinement): Shows cards matching ALL selected filters (AND logic, not OR)
*   Empty result state: "No case studies match this combination. \[Clear Filters\] to browse all."
**URL Parameterization (per Open Item #3):**
*   Recommended: URL-parameterized filters (e.g., \`/case-studies/?industry=healthcare&service=embedded-content-refinement\`)
*   Enables shareable filtered views
*   Crawlable by search engines (separate URLs for each filter combination)
*   Canonical tags point to the unfiltered hub URL to prevent duplicate content
**Visual Direction:**
*   Horizontal filter bar below the category description
*   Sticky on scroll (fixed to top of viewport) so visitors can re-filter without scrolling back
*   Active filters shown as pills with X to remove
*   Dropdown menus for each dimension
*   "Clear Filters" link at right
*   On mobile: filters collapse into a single "Filter" button that expands a modal
Per-hub variations in Part 4 — each hub has different filter dimensions.
## **2.6 Card Grid**
_DESIGN TEAM: The card grid is the primary navigation mechanism. Cards should be scan-friendly with clear category signals. Consistent card treatment across the entire grid._
**Layout:** 3-column grid on desktop, 2-column on tablet, single-column on mobile.
**Card Structure (Case Studies Hub reference):**
Each card contains:
*   **Industry tag pill** — top of card, small, colored per industry
*   **Client name** — prominent, bold, card headline
*   **Top-line outcome** — one-sentence quantified result (e.g., "50% → 80% finalist rate")
*   **Service applied** — which Win Strategist service produced the result
*   **Link** — "Read the Full Story →" or card is fully clickable
*   **Status badge (conditional)** — if the case is "Roadmap" (case study page not yet published), display a muted "Coming Soon" indicator
**Sample Card Content:**
\[FLEET MANAGEMENT\]
RTA Fleet
50% → 80% Finalist Rate
Evaluator's Eye Audit
Read the Full Story →
**Grid Behavior:**

| **State** | **Behavior** |
| ---| --- |
| Default | 12 cards per page (4 rows × 3 columns on desktop) |
| Loading state | Skeleton placeholders while content loads |
| Filtered state | Grid updates to show matching cards only; count visible ("Showing 3 of 10 case studies") |
| Empty state | Message: "No case studies match this combination. Clear filters to browse all." |
| More than 12 cards | Pagination controls below the grid |

**Visual Direction:**
*   Consistent card height (use CSS to normalize even if content varies)
*   Card background: white with subtle border or shadow
*   Hover state: slight elevation, border color shift
*   Industry tag pill color-coded per industry (optional visual consistency enhancement)
*   Mobile: single column, full-width cards
Per-hub variations in Part 4 — card content varies significantly per hub type.
## **2.7 Pagination**
_DESIGN TEAM: Simple, crawlable pagination. No infinite scroll._
**Pattern:**
\[1\] \[2\] \[3\] \[>\] Showing 12 of 36
*   Page number buttons, current page highlighted
*   Next/previous arrows
*   Total count visible
*   URL parameterized (e.g., \`/case-studies/?page=2\`) for SEO crawlability
*   Canonical tags per page to prevent duplicate content
**Alternative for Small Collections:**
If a hub has fewer than 20 items (e.g., \`/services/\` with 7 cards), pagination can be omitted and the full grid displayed on one page.
**Per-Hub Pagination Thresholds:**

| **Hub** | **Launch Item Count** | **Pagination Needed?** |
| ---| ---| --- |
| \`/case-studies/\` | 10 launch + 6-8 roadmap = 16-18 | No at launch; yes at scale (roadmap publish) |
| \`/services/\` | 7 (5 Win Strategist + Express + DIY) | No |
| \`/industries/\` | 12 | No |
| \`/testimonials/\` | 75 | Yes (12 or 24 per page) |
| \`/blog/\` | 5 at launch, 64+ at Year 1 | No at launch; yes at scale |
| \`/resources/\` | 5 at launch | No at launch |

## **2.8 Cross-Link to Parent Context (CTA Section)**
_DESIGN TEAM: Every hub includes one strategic CTA at the bottom — not a primary conversion CTA, but a routing option for visitors who scrolled the full grid without clicking a card._
**Pattern (Case Studies Hub reference):**
**Section Badge:** Don't See What You're Looking For?
**H2:** Talk to The RFP Success® Company About Your Situation
**Body Copy:**
The case study library documents client outcomes we have permission to publish. Many Win Strategist engagements stay private at the client's request. If you're evaluating whether The RFP Success® Company is the right fit for your situation, a discovery call with RFP-expert Lisa Rehurek is the fastest path to an honest answer.
**Primary CTA:** Book a Discovery Call → \`/book-a-call/\`
**Secondary CTA:** Explore Win Strategist Services → \`/advisement/\`
**Visual Direction:**
*   Full-width section, dark charcoal background
*   H2 centered
*   Body copy centered, max width 600px
*   CTAs centered below
*   Same treatment as T3/T5 final CTA, compressed height
Per-hub variations in Part 4.
## **2.9 CTA Cadence Audit**
Hubs are navigation-first, so CTA cadence is lower than conversion pages. Minimum 2 CTAs.

| **#** | **Location** | **Primary/Secondary** | **Target** |
| ---| ---| ---| --- |
| 1-N | Card grid | N × cross-links | Child pages (case studies / services / industries / etc.) |
| N+1 | Bottom CTA section | Primary | \`/book-a-call/\` |
| N+2 | Bottom CTA section | Secondary | \`/advisement/\` or context-appropriate |

For Case Studies Hub: 10+ card cross-links + 2 bottom CTAs = 12+ placements. Routing-heavy, conversion-light.
## **2.10 Internal Linking Map**
### **Links FROM This Page**

| **Target** | **Pattern** | **Location** |
| ---| ---| --- |
| Every child page in the collection | Card link | Card grid |
| \`/book-a-call/\` | CTA | Bottom CTA section |
| \`/advisement/\` (or parent category) | Secondary CTA | Bottom CTA section |
| Filtered view URLs | Filter bar | URL parameterized |

### **Links TO This Page (should come from)**
*   **Every child page in the collection** — bidirectional linking. Every T4 case study links to \`/case-studies/\`. Every T5 industry page links to \`/industries/\`.
*   **Navigation bar** — hub pages are primary nav items (Services, Case Studies, Industries, Blog, Resources, About under which Testimonials might nest)
*   **Homepage sections** — Homepage typically shows a few featured items with a "See All" link pointing to the hub
*   **Related hubs** — hubs may cross-link to each other when relevant (e.g., \`/case-studies/\` may link to \`/industries/\` at the bottom)
*   **Footer** — primary hubs in footer navigation
# **PART 3 — TECHNICAL SPECIFICATIONS**
## **3.1 Schema Markup**
Per Core Standards Phase 12.3 — Hub pages use CollectionPage + ItemList + BreadcrumbList.
### **CollectionPage + ItemList + BreadcrumbList (Case Studies Hub reference)**
{
"@context": "[https://schema.org](https://schema.org)",
"@graph": \[
{
"@type": "CollectionPage",
"@id": "[https://therfpsuccesscompany.com/case-studies/#webpage](https://therfpsuccesscompany.com/case-studies/#webpage)",
"url": "[https://therfpsuccesscompany.com/case-studies/](https://therfpsuccesscompany.com/case-studies/)",
"name": "RFP Case Studies | The RFP Success® Company",
"description": "The RFP Success® Company's client case study library. Named clients, quantified outcomes, Win Strategist service attribution.",
"isPartOf": { "@id": "[https://therfpsuccesscompany.com/#website](https://therfpsuccesscompany.com/#website)" },
"about": { "@id": "[https://therfpsuccesscompany.com/#organization](https://therfpsuccesscompany.com/#organization)" },
"mainEntity": { "@id": "[https://therfpsuccesscompany.com/case-studies/#itemlist](https://therfpsuccesscompany.com/case-studies/#itemlist)" },
"dateModified": "2026-04-22"
},
{
"@type": "ItemList",
"@id": "[https://therfpsuccesscompany.com/case-studies/#itemlist](https://therfpsuccesscompany.com/case-studies/#itemlist)",
"name": "RFP Success Case Studies",
"description": "Named client case studies across 10+ industries",
"numberOfItems": 10,
"itemListElement": \[
{
"@type": "ListItem",
"position": 1,
"url": "[https://therfpsuccesscompany.com/case-studies/rta-fleet/](https://therfpsuccesscompany.com/case-studies/rta-fleet/)",
"name": "RTA Fleet — 50% to 80% Finalist Rate"
},
{
"@type": "ListItem",
"position": 2,
"url": "[https://therfpsuccesscompany.com/case-studies/optumas/](https://therfpsuccesscompany.com/case-studies/optumas/)",
"name": "Optumas — 86% Win Rate in Healthcare IT"
},
{
"@type": "ListItem",
"position": 3,
"url": "[https://therfpsuccesscompany.com/case-studies/highstreet-it/](https://therfpsuccesscompany.com/case-studies/highstreet-it/)",
"name": "Highstreet IT — $8.5M Contract Won"
}
// ... additional items through position 10
\]
},
{
"@type": "BreadcrumbList",
"itemListElement": \[
{"@type": "ListItem", "position": 1, "name": "Home", "item": "[https://therfpsuccesscompany.com](https://therfpsuccesscompany.com)"},
{"@type": "ListItem", "position": 2, "name": "Case Studies", "item": "[https://therfpsuccesscompany.com/case-studies/](https://therfpsuccesscompany.com/case-studies/)"}
\]
}
\]
}
**Schema Field Notes:**
*   \`@type: CollectionPage\` — tells Google this is a category index, not a content page
*   \`mainEntity\` references the ItemList — the list of children is the page's primary content
*   \`ItemList\` with \`numberOfItems\` and \`itemListElement\` — declares the complete collection
*   Each \`ListItem\` has \`position\`, \`url\`, and \`name\` — minimum fields for crawlable list items
*   Filtered views (via URL parameters) get their own CollectionPage schema with filtered ItemList reflecting the filter
### **Organization + Person (Site-Wide — Referenced via @id)**
Not redeclared on T8 pages. Referenced via \`@id\` to the site-wide declarations.
## **3.2 Entity SEO Verification Checklist**

| **Rule** | **Target** | **Status Check** |
| ---| ---| --- |
| "The RFP Success® Company" in first sentence of category description | Required | §2.4 |
| ® symbol renders correctly throughout | Required | Visual review |
| Brand name density: 1 per 120–140 words (within the prose sections) | Required | Density count |
| Every card's child page URL matches canonical pattern | Required | Card-by-card audit |
| Every child page URL in ItemList schema matches visible card link | Required | Schema cross-check |

## **3.3 E-E-A-T Signal Audit**
Per Core Standards Phase 4. Hub pages are Authoritativeness-weighted primary (category authority).
### **Authoritativeness (Weighted Primary)**
*   \[ \] CollectionPage + ItemList schema declares canonical category
*   \[ \] Comprehensive collection (every case study, every service, every industry present)
*   \[ \] Consistent card treatment signals organizational curation
*   \[ \] Category description with insider context, not generic category blurb
*   \[ \] Filter dimensions match how the organization actually segments the collection
### **Trust**
*   \[ \] Permissions confirmed for every listed item (especially relevant for testimonials hub)
*   \[ \] \`dateModified\` visible when content is refreshed
*   \[ \] Card content accurate (no fabricated outcomes, no overstated claims)
*   \[ \] Roadmap/Coming Soon items clearly distinguished from live cards
### **Experience**
*   \[ \] Named clients, quantified outcomes visible on case study cards
*   \[ \] Industry-specific context in category description
### **Expertise**
*   \[ \] Methodology references (4x4 Framework™, D.A.R.E. Method) where relevant in category description
**YMYL Classification:** Not YMYL. Commercial B2B category pages. Standard E-E-A-T rigor applies.
## **3.4 Brand Voice Compliance**

| **Check** | **Status** |
| ---| --- |
| Category description sounds like Lisa Rehurek / The RFP Success® Company explaining the collection | Read-aloud test |
| Specific over generic throughout | Full doc scan |
| Filter labels use exact brand terminology (Evaluator's Eye Audit, Win Strategist services, etc.) | Terminology check |
| No corporate jargon in category description | Against banned phrases |
| Zero banned phrases per user's "Stop Slop" preferences | Full doc scan |

## **3.5 Information Gain Verification**

| **Element** | **Present on Case Studies Hub** |
| ---| --- |
| Comprehensive collection (10 launch + roadmap) | ✅ |
| Filterable organization (industry, service, result type) | ✅ §2.5 |
| Category description with insider context | ✅ §2.4 |
| CollectionPage + ItemList schema | ✅ §3.1 |
| Bidirectional link aggregation | ✅ §2.10 |

**Assessment:** MODERATE to HIGH depending on collection scale.
## **3.6 AEO/GEO Optimization**
Per Core Standards Phase 6.

| **Requirement** | **Implementation** |
| ---| --- |
| Hero H1 answers "what is this collection?" | Verify |
| Answer capsule self-contained in first 200 words | §2.3 |
| \`.answer-capsule\` CSS class on hero capsule | Applied for speakable schema |
| ItemList schema for AI system extraction of collection contents | §3.1 |
| Filter dimensions exposed via URL parameters for crawlability | Per Open Item #3 |
| Card content scannable in 1-second visual sweep | Card design |

## **3.7 Technical SEO Baseline**
Per Core Standards Phase 13.
*   \[ \] Title tag, meta description, canonical per §1.7
*   \[ \] Filtered URL variants have canonical tags pointing to unfiltered hub
*   \[ \] Paginated URL variants have rel="next"/"prev" or self-canonical tags
*   \[ \] Image alt text on every card visual (client logo, industry icon, etc.)
*   \[ \] Card images optimized (WebP with JPG fallback, small thumbnails)
*   \[ \] LCP < 2.5s, CLS < 0.1, INP < 200ms
*   \[ \] Grid layout doesn't cause CLS as cards load
*   \[ \] Mobile responsive tested at 320/768/1024/1440
*   \[ \] HTTPS enforced
*   \[ \] Server-side rendering of cards required (filter JS is progressive enhancement)
*   \[ \] \`llms.txt\` includes every hub URL
*   \[ \] Schema validates in Google Rich Results Test
*   \[ \] Filtered views crawlable (not blocked by robots.txt)
## **3.8 Filter Implementation Notes**
Per Open Item #3. URL parameterization is the recommendation:
**Recommended Pattern:**
*   URL structure: \`/case-studies/?industry=healthcare&service=embedded-content-refinement\`
*   Server-side renders filtered card grid matching URL parameters
*   Client-side JavaScript updates URL and re-renders grid on filter change (progressive enhancement)
*   Canonical tag on filtered views points to unfiltered \`/case-studies/\`
*   Sitemap.xml includes the unfiltered hub URL; filtered views are not sitemap entries
**Alternative (Client-Only):**
*   JavaScript filters the visible card set without URL change
*   Not shareable (no shareable filtered view URLs)
*   Not crawlable (search engines see only the unfiltered default)
*   Simpler implementation, worse SEO
Recommendation: URL-parameterized with server-side rendering for default view. If budget or timeline constrains the build, client-only filtering is acceptable at launch with a migration path to URL-parameterized later.
## **3.9 Post-Launch Optimization**

| **Timeframe** | **Action** |
| ---| ---| 
| Launch | Verify CollectionPage + ItemList schema renders. Cross-check every card's link matches the schema ItemList URL. Test filter behavior at mobile breakpoints. |
| Week 1 | Submit to Search Console. Monitor Core Web Vitals. |
| 30 Days | Measure click-through rate to child pages. Identify which cards get clicked most (may influence card ordering or featured-card selection). Monitor filter usage rate. |
| 60 Days | A/B test card ordering (chronological vs. outcome-magnitude vs. manual curation). Review which filter dimensions get used most. |
| 90 Days | Refresh hub when new child pages publish. Update category description with new collection context if the collection has expanded meaningfully. |
| Quarterly | Verify every card still routes to a live child page (no broken internal links). Check for orphaned child pages that should be added to the hub. |

## **3.10 QA Verification Checklist**
### **On-Page SEO**
*   \[ \] Title tag 50–60 chars
*   \[ \] Meta description 140–160 chars
*   \[ \] H1 category-forward
*   \[ \] URL clean (no trailing query params on canonical)
*   \[ \] OG and Twitter Card tags
*   \[ \] Schema: CollectionPage + ItemList + BreadcrumbList, validated
*   \[ \] GA4 tracking script active
*   \[ \] \`llms.txt\` includes hub URL
### **Entity SEO**
*   \[ \] Brand name density within prose sections
*   \[ \] ® symbol rendered correctly
*   \[ \] Filter labels use exact brand terminology
### **Content Quality**
*   \[ \] Category description 200–300 words
*   \[ \] Zero banned phrases per "Stop Slop" rules
*   \[ \] No AI artifact structures
*   \[ \] Every card verified (no broken references)
### **Schema**
*   \[ \] CollectionPage declared
*   \[ \] ItemList with all child URLs
*   \[ \] \`numberOfItems\` matches actual child count
*   \[ \] Each ListItem has position, url, name minimum
*   \[ \] BreadcrumbList accurate
*   \[ \] Schema validates in Google Rich Results Test
### **Filter & Pagination**
*   \[ \] Filter UI accessible via keyboard
*   \[ \] URL parameterization works (if implemented)
*   \[ \] Filtered state shows count ("Showing X of Y")
*   \[ \] Empty state message appears when no matches
*   \[ \] Pagination crawlable (if present)
*   \[ \] Clear filters functional
### **Card Grid**
*   \[ \] Every card links to a live child page
*   \[ \] No broken links
*   \[ \] Industry/service/date tags accurate per card
*   \[ \] Card height normalized (no jagged grid)
*   \[ \] Hover states consistent
*   \[ \] "Coming Soon" indicator for roadmap items distinguishable
### **Design**
*   \[ \] 3-column desktop, 2-column tablet, 1-column mobile
*   \[ \] Responsive tested at 320/768/1024/1440
*   \[ \] Core Web Vitals within targets
*   \[ \] No CLS as images load
### **Site-Wide Integration**
*   \[ \] Linked from every child page (bidirectional)
*   \[ \] Linked from navigation bar
*   \[ \] Linked from homepage (if featured)
*   \[ \] Linked from footer
# **PART 4 — 6-HUB VARIATION GUIDE**
The template above uses \`/case-studies/\` as the reference build. The remaining 5 hubs share the template structure but have distinct content, filter dimensions, and cross-linking logic.
## **4.1 Services Overview — \`/services/\`**
**H1:** The RFP Success® Company Services
**Answer Capsule:**
The RFP Success® Company serves service-based businesses at three revenue tiers with three distinct engagement models: Win Strategist advisory for $10M–$25M+ companies, Express DIY Response Platform for $1M–$5M companies, and DIY Resources for $500K–$1M companies. Browse the services below or take the RFP Assessment to find your fit.
**Category Description (200–300 words):**
Describes the three-path architecture. Explains that Win Strategist advisory is the primary revenue driver (founded on 30+ years of evaluator experience). Positions Express and DIY as appropriate for smaller-revenue companies.
**Filter Dimensions:**
*   Revenue Tier (Win Strategist / Express / DIY)
*   Engagement Type (Audit / Refinement / Strategy / Library)
**Cards:** 7 cards
1. Win Strategist Overview (routes to \`/advisement/\`)
2. Evaluator's Eye Audit (Win Strategist)
3. Win Strategy Review (Win Strategist — Champagne only)
4. Embedded Content Refinement (Win Strategist — flagship)
5. Play to Win Consults (Win Strategist)
6. Library Content Development (Win Strategist)
7. Express DIY Response Platform (external link)
8. DIY Resources / Success Collective (external link)
**CTA:** Book a Discovery Call + Take the RFP Assessment
**Pagination:** None (7 cards fit on one page)
## **4.2 Industries We Serve — \`/industries/\`**
**H1:** Industries We Serve
**Answer Capsule:**
The RFP Success® Company serves service-based businesses in 12 SLED industry verticals — from Transportation and Technology to Healthcare and Education. Each industry page documents the vertical's RFP patterns, named case studies, and the Win Strategist services that produce results.
**Category Description:**
Explains the 3-tier readiness classification (Proof-Rich, Proof-Modest, Awaiting Proof) and how case study evidence drives page depth per industry.
**Filter Dimensions:**
*   Readiness Tier (Proof-Rich / Proof-Modest / Awaiting Proof)
*   Government Level (State / Local / Education)
**Cards:** 12 cards
*   Each card: industry name, count of case studies in vertical, primary Win Strategist services, link to \`/industries/\[slug\]/\`
**CTA:** Book a Discovery Call
**Pagination:** None (12 cards fit on one page)
## **4.3 Client Testimonials — \`/testimonials/\`**
**H1:** What Our Clients Say
**Answer Capsule:**
75 testimonials from The RFP Success® Company's clients across 30+ industries and every Win Strategist service. Organized by service tier. Every testimonial represents a client engagement with verifiable outcomes.
**Category Description:**
Explains that testimonials are organized by service tier (Win Strategist engagements make up the majority). Notes that full case studies for many of these clients exist in the \`/case-studies/\` library.
**Filter Dimensions:**
*   Service Tier (Evaluator's Eye Audit / Win Strategy Review / Embedded Content Refinement / Play to Win / Library Content / Historical Full Response)
*   Industry (same 12 verticals as \`/industries/\`)
**Cards:** 75 testimonials
*   Each card: quote, client name, client company, industry tag, service attribution
*   Cards smaller than case study cards (testimonials are scannable snippets, not narratives)
**CTA:** See Full Case Studies → \`/case-studies/\` + Book a Discovery Call
**Pagination:** Yes — 24 per page (4 pages at 75 total)
⚠️ Per Open Item #2, testimonial bulk permissions needed before launch.
## **4.4 Blog / Insights Hub — \`/blog/\`**
**H1:** RFP Success Insights
**Answer Capsule:**
The RFP Success® Company's thought leadership library. Articles on RFP strategy, evaluator psychology, Win Strategist methodology, and government procurement patterns. Organized by topical cluster.
**Category Description:**
Explains the 8-cluster content strategy (RFP Process Mastery, Government Contracting Strategy, etc.). Notes that articles publish on a roadmap (8 per month) and the library grows from 5 launch articles to 64+ over Year 1.
**Filter Dimensions:**
*   Topical Cluster (8 clusters per Sitemap v10 PART 2)
*   Article Type (Pillar / Supporting)
*   Date
**Cards:** 5 at launch, 64+ over Year 1
*   Each card: title, excerpt, cluster tag, date, reading time, link
**CTA:** Book a Discovery Call
**Pagination:** Required once >12 articles exist. 12 per page.
## **4.5 Resources Hub — \`/resources/\`**
**H1:** Free Resources for RFP Teams
**Answer Capsule:**
The RFP Success® Company's library of free downloadable resources. eBooks, checklists, playbooks, and templates developed from 30+ years of proposal expertise. Every resource is free — no credit card, no hidden gate.
**Category Description:**
Explains that resources are free but gated (email capture required). Notes which resources are launch-ready vs. which are migrating from SharePoint.
**Filter Dimensions:**
*   Asset Type (eBook / Checklist / Playbook / Template / White Paper)
*   Topic (RFP Strategy / State Government / Evaluator Psychology / D.A.R.E. / etc.)
**Cards:** 5 launch + migration assets
*   D.A.R.E. eBook (⚠️ PDF needs Readability update per Open Item #3 from Sitemap v10)
*   True Cost of Losing White Paper
*   State Government RFP Checklist
*   Tech Company RFP Starter Kit
*   101 Ways to Win More Proposals eBook (migration)
*   Checks and Balances Download (migration)
*   Testimonial Template (migration)
*   RFP Success Playbook (migration)
**CTA:** Book a Discovery Call for personalized advice
**Pagination:** None at launch.
## **4.6 Hub Variation Summary Table**

| **Hub** | **URL** | **Reference Build?** | **Launch Cards** | **Filter Dimensions** | **Pagination** |
| ---| ---| ---| ---| ---| --- |
| Case Studies | \`/case-studies/\` | ✅ REFERENCE | 10 (+ 6-8 roadmap) | Industry, Service, Result Type | No at launch |
| Services | \`/services/\` | — | 7 | Revenue Tier, Engagement Type | No |
| Industries | \`/industries/\` | — | 12 | Readiness Tier, Government Level | No |
| Testimonials | \`/testimonials/\` | — | 75 | Service Tier, Industry | Yes (24/page) |
| Blog | \`/blog/\` | — | 5 (launch), 64+ (Year 1) | Cluster, Article Type, Date | Yes once >12 |
| Resources | \`/resources/\` | — | 5 + migration | Asset Type, Topic | No at launch |

\*Creative Brief — Index / Hub Page Template (T8)\*
\*The RFP Success® Company — \`/case-studies/\` (reference build) + 5 inheriting hubs\*
\*Version 1.0 — April 22, 2026\*
\*Prepared by Jason Spencer | [ROI.LIVE](http://ROI.LIVE)\*
\*Governing SOPs: [ROI.LIVE](http://ROI.LIVE) Agency Core Standards v1.1 — especially Phase 6, Phase 10, Phase 12.3\*
\*Companion: Master Client Feedback Tracker v1.0, Sitemap v10, Page Template Map v1.0, Parameter Sheet v1.0, T3/T4/T5/T9/T10 Creative Briefs\*