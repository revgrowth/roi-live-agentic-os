---
clickup_doc_id: 8cma26h-13913
clickup_page_id: 8cma26h-5413
clickup_url: https://app.clickup.com/9013889233/docs/8cma26h-13913/8cma26h-5413
original_filename: Blue Tree Landscaping_ Complete Website Sitemap Phased Implementation Plan v2.1.md
normalized_title: blue tree landscaping complete website sitemap phased implementation plan
classification: REFERENCE_DOC
version: v2-1
status_in_archive: canonical
date_updated: 2026-02-25
hierarchy_category: (workspace-level)
hierarchy_subcategory: (none)
md5: 7b95c4936b0ecca2b3c53f15a0e9d233
archived_to_repo: 2026-05-12
---

# Blue Tree Landscaping: Complete Website Sitemap & Phased Implementation Plan — v2.1

## Revision Notes

### v2.1 Changes (February 19, 2026)

**What changed from v2:** This revision incorporates Jérôme Besnard's follow-up feedback delivered February 19, 2026. Key changes:

1. **"Outdoor Concierge" pillar renamed to "Premier Outdoor Services"** — All URLs, operation tags, navigation references, and cluster page slugs updated accordingly (`/outdoor-concierge/` → `/premier-outdoor-services/`)
2. **Portfolio pages marked as social-media shareable** — Portfolio Photo Gallery and Completed Projects pages now include explicit social sharing functionality requirements
3. **Service cluster page count revised to 29** — Architecture streamlined from 55 to 29 service cluster pages at launch, reflecting tighter scope and higher content quality standards per page
4. **Town URL structure updated** — All town/city pages now nested under their county: `/service-areas/{county}/{town}/` (e.g., `/service-areas/montgomery-county/skippack/`) per Jérôme's architectural direction. This mirrors how Google's Knowledge Graph understands geographic hierarchy and improves county-level topical authority cascading to town pages.
5. **Tier 2 towns at launch reduced to 9** — Math correction per Jérôme: 54 core + pillar + service pages + 5 county pages + 12 Tier 1 towns + 9 Tier 2 towns = 80 launch pages
6. **Launch page count confirmed at 80** — Breakdown: 20 core + 5 pillars + 29 service clusters + 5 counties + 12 Tier 1 towns + 9 Tier 2 towns = 80 pages
* * *

### v2 Changes (February 18, 2026 — for reference)

**What changed from v1:** This version incorporated Jérôme Besnard's handwritten sitemap and service architecture feedback dated Feb 5, 2026:

1. **Service pillars consolidated from 9 → 5** (Pools, Landscapes, Hardscapes, Healthy Yard, Premier Outdoor Services)
2. **"Operation Tags"** introduced for cross-pillar filtering at the navigation level
3. **"Service Hub"** section added (Warranties, FAQs, Care Instructions)
4. **Meet the Team** restructured with department tags
5. **New service cluster pages** added: Fencing, Paver Restoration, Sport Field Care, Backyard Oasis Design
6. **Landscape Lighting, Irrigation, Maintenance, Pest Control** absorbed into the 5-pillar structure
7. **Location pages reduced at launch** to allow deeper service coverage
8. **80-page launch cap maintained**
9. **Individual author bio pages** added as children of Meet the Team for E-E-A-T compliance
10. **Editorial Standards page** added to Trust & Conversion section
11. **`speakable`** **and** **`sameAs`** **schema** requirements added
12. **Article schema** updated with `Person` author and `reviewedBy` fields
* * *

## SEO + AEO + GEO Architecture Principles

This sitemap follows best practices for ranking in traditional search engines AND getting cited by AI/LLM answer engines:

*   **5 Service Pillar Pages** as topical authority hubs with deep internal linking to cluster pages
*   **Operation Tag taxonomy** enabling faceted navigation (portfolio, reviews, blogs, FAQs, team filtered by pillar)
*   **Service cluster pages** targeting long-tail "\[specific service\] + \[location\]" queries
*   **FAQ schema** on all service pages for featured snippet and AI citation eligibility
*   **LocalBusiness + Service schema** on all service and location pages
*   **HowTo schema** on blog/guide content for instructional queries
*   **Entity-rich "About" section** establishing E-E-A-T signals (experience, expertise, authority, trust)
*   **Individual author bio pages** (`/about/team/[name]/`) with Person schema — named authors on all blog content, linked to dedicated bio pages with credentials, experience signals, and "Articles by \[Name\]" sections, creating bidirectional authority between content and author entities
*   **Editorial review process** visible on-page — every blog post carries a "Written by" and "Reviewed by" credit, signaling editorial rigor to both Google Quality Raters and AI answer engines
*   **Internal linking architecture** designed for topical clustering — every cluster page links up to its pillar, laterally to siblings, and down to relevant blog content
*   **Structured data vocabulary** aligned with how LLMs parse and cite service providers
*   **`sameAs`** **entity disambiguation** — Organization schema on all pages includes `sameAs` links to Google Business Profile, social profiles, and BBB listing, enabling AI engines to resolve Blue Tree as a verified entity across the web
*   **Geographic hierarchy** — Town pages nested under county pages (`/service-areas/{county}/{town}/`) mirrors Google Knowledge Graph geographic entity relationships, building county-level authority that cascades to town pages
* * *

## OPERATION TAGS SYSTEM

The client's key architectural innovation: **Operation Tags** allow the 5 service pillars to function as filters across the entire site. This means a visitor browsing the "Pools" tag can see pool-related portfolio items, pool-specific reviews, pool team members, pool FAQs, pool warranties, pool blog posts, and pool career openings — all from a single filtered view.

| Tag | Applied To |
| ---| --- |
| Pools | Portfolio, Reviews, Team, Blogs, FAQs, Warranties, Instructions, Careers |
| Landscapes | Portfolio, Reviews, Team, Blogs, FAQs, Warranties, Instructions, Careers |
| Hardscapes | Portfolio, Reviews, Team, Blogs, FAQs, Warranties, Instructions, Careers |
| Healthy Yard | Portfolio, Reviews, Team, Blogs, FAQs, Warranties, Instructions, Careers |
| Premier Outdoor Services | Portfolio, Reviews, Team, Blogs, FAQs, Warranties, Instructions, Careers |

> **Implementation note:** This is a CMS taxonomy/tagging system, not individual pages. Each tag generates filtered views, not unique URLs (avoids thin content / duplicate content issues). The exception is the 5 pillar pages themselves, which serve as the landing pages for each tag.
* * *

## COMPLETE SITEMAP STRUCTURE
* * *

### 📁 CORE PAGES (20 pages)

| # | Page | URL Slug | Purpose |
| ---| ---| ---| --- |
| 1 | Homepage | `/` | Primary conversion + brand positioning |
| 2 | Portfolio — Photo Gallery | `/portfolio/` | Visual proof, filterable by operation tag — social media shareable |
| 3 | Portfolio — Completed Projects | `/portfolio/completed-projects/` | Case studies with before/after + scope details — social media shareable |
| 4 | Reviews & Testimonials | `/reviews/` | Social proof, filterable by operation tag |
| 5 | Service Hub | `/service-hub/` | Central resource hub (warranties, FAQs, instructions) |
| 6 | Service Hub — Warranties | `/service-hub/warranties/` | Warranty details by service type |
| 7 | Service Hub — FAQs | `/service-hub/faqs/` | General + pillar-specific FAQs (filterable by tag) |
| 8 | Service Hub — Care Instructions | `/service-hub/instructions/` | Post-project care guides by service type |
| 9 | Blog Hub | `/blog/` | Content marketing hub |
| 10 | About Us | `/about/` | Company overview + trust signals |
| 11 | Our Story | `/about/our-story/` | Jeff Mattiola's 40-year journey, founding in 1983 |
| 12 | Meet the Team | `/about/team/` | Staff directory with department tags |
| 13 | Why Choose Blue Tree? | `/about/why-choose-us/` | Competitive advantages + differentiators |
| 14 | Our Process | `/about/our-process/` | Design → Build → Maintain workflow |
| 15 | Contact Us | `/contact/` | Form, phone, address, map |
| 16 | Request an Estimate | `/request-estimate/` | Lead capture form |
| 17 | Careers | `/careers/` | Job listings, filterable by department + operation tag |
| 18 | Financing | `/financing/` | Payment options + financing partners |
| 19 | Privacy Policy | `/privacy-policy/` | Legal |
| 20 | Terms of Service | `/terms-of-service/` | Legal |

> **Social Sharing Implementation Note (Portfolio Pages):** Both portfolio pages (#2 and #3) require native social sharing functionality. Each project/photo should include one-click share buttons for Facebook, Instagram, Pinterest, and Houzz at minimum. Individual completed project case studies should generate Open Graph-optimized share previews (compelling featured image + project name + location). This supports organic social discovery and brand reach beyond organic search.

**Team Department Tags** (for Meet the Team filtering):

*   Design
*   Project Managers
*   Support
*   Leadership
*   Marketing

**Individual Author Bio Pages** (children of Meet the Team — `/about/team/`):

These pages serve as E-E-A-T authority anchors for all blog content. Only team members who author or review blog/resource content require individual bio pages. Each page includes Person schema, professional headshot, credentials, years of experience, areas of expertise, and an "Articles by \[Name\]" section linking to all authored posts.

| # | Page | URL Slug | Content Role |
| ---| ---| ---| --- |
| 12a | Jeff Mattiola Bio | `/about/team/jeff-downie/` | Author: pool, leadership, pricing, budgeting content |
| 12b | Jérôme Besnard Bio | `/about/team/jerome-besnard/` | Author: sales process, buyer guides; Reviewer: pool content |
| 12c | \[Lead Designer\] Bio | `/about/team/[name]/` | Author: landscape design, garden design, planting content |
| 12d | Mark Paisley Bio | `/about/team/mark-paisley/` | Author: turf care, lawn, pest control, healthy yard content |
| 12e | \[Additional Staff\] | `/about/team/[name]/` | Added as needed when new team members author blog content |

**Editorial Standards Page** (E-E-A-T trust page — child of About):

| # | Page | URL Slug | Purpose |
| ---| ---| ---| --- |
| 14a | Editorial Standards | `/about/editorial-standards/` | Documents Blue Tree's content creation process, fact-checking methodology, author qualification standards, and update cadence. Every blog post links to this page from its editorial standards statement. Lightweight trust page (300-500 words). |

**Breadcrumb:** Home > About > Editorial Standards
**Schema:** `WebPage` with `about` referencing Blue Tree's editorial process
> **Internal Linking:** Every blog post links TO this page. This page links BACK to the blog hub and Meet the Team page.

> **Page Count Note:** Author bio pages and Editorial Standards are counted separately from the 20 core pages. These launch alongside the first 5 blog posts and do not count against the 80-page launch cap.

**Core Pages Total: 20 (+ 1 editorial standards page + 4-5 author bio pages at launch)**
* * *

### 📁 SERVICE PILLAR PAGES (5 pages)

These are the primary navigation-level service pages. Each functions as a topical authority hub with links to all cluster pages beneath it.

| # | Pillar | URL Slug | Description |
| ---| ---| ---| --- |
| 1 | Pools | `/pools/` | Custom inground pool design, construction, features, renovation, and pool-specific services |
| 2 | Landscapes | `/landscapes/` | Landscape design, planting, garden design, lighting, irrigation, and landscape features |
| 3 | Hardscapes | `/hardscapes/` | Patio design, outdoor kitchens, fireplaces, walkways, retaining walls, and structural outdoor features |
| 4 | Healthy Yard | `/healthy-yard/` | Turf care programs, pest control, drainage solutions, weed management, and sport field care |
| 5 | Premier Outdoor Services | `/premier-outdoor-services/` | Ongoing maintenance, pool service, paver restoration, clean-ups, bed maintenance, and pruning |

**Service Pillar Pages Total: 5**
* * *

### 📁 SERVICE CLUSTER PAGES (29 pages)
* * *

#### **Pools Cluster** (`/pools/...`) — 8 pages

| # | Page | URL Slug | New/Existing |
| ---| ---| ---| --- |
| 1 | Inground Pool Construction | `/pools/inground-pools/` | Existing |
| 2 | Pool Design Process | `/pools/pool-design/` | Existing |
| 3 | Pool Renovation & Remodeling | `/pools/pool-renovation/` | Existing |
| 4 | Pool Water Features | `/pools/water-features/` | Existing |
| 5 | Pool Lighting | `/pools/pool-lighting/` | Existing |
| 6 | Concrete Pool Installation | `/pools/concrete-pools/` | Existing |
| 7 | Spa & Hot Tub Integration | `/pools/spa-hot-tub/` | Existing |
| 8 | Pool Equipment (Jandy) | `/pools/pool-equipment/` | Existing |

* * *

#### **Landscapes Cluster** (`/landscapes/...`) — 8 pages

| # | Page | URL Slug | New/Existing |
| ---| ---| ---| --- |
| 1 | Landscape Design Process | `/landscapes/design/` | Existing (repositioned) |
| 2 | Garden Design & Planting | `/landscapes/garden-design/` | Existing |
| 3 | Native Plant Landscaping | `/landscapes/native-plants/` | Existing |
| 4 | Fencing | `/landscapes/fencing/` | NEW |
| 5 | LED Landscape Lighting | `/landscapes/led-lighting/` | Restructured |
| 6 | Pathway & Accent Lighting | `/landscapes/pathway-accent-lighting/` | Restructured |
| 7 | Drip Irrigation | `/landscapes/drip-irrigation/` | Restructured |
| 8 | Sprinkler System Installation | `/landscapes/sprinkler-systems/` | Restructured |

> **Architecture Note —** **`/landscapes/design/`** **Repositioning:** This page was repositioned to **"Landscape Design Process"** to eliminate entity overlap with the `/landscapes/` pillar page. The cluster page now targets the distinct informational/consideration queries about the design process itself (e.g., "what is the landscape design process," "steps in a landscape design project"), mirroring the Pools architecture.
* * *

#### **Hardscapes Cluster** (`/hardscapes/...`) — 7 pages

| # | Page | URL Slug | New/Existing |
| ---| ---| ---| --- |
| 1 | Hardscape Design | `/hardscapes/design/` | NEW |
| 2 | Paver Patio Design & Installation | `/hardscapes/paver-patios/` | Existing |
| 3 | Outdoor Kitchens | `/hardscapes/outdoor-kitchens/` | Existing |
| 4 | Fire Pits & Fireplaces | `/hardscapes/fire-pits/` | Existing |
| 5 | Walkways & Pathways | `/hardscapes/walkways/` | Existing |
| 6 | Retaining Walls | `/hardscapes/retaining-walls/` | Existing |
| 7 | Backyard Oasis Design | `/hardscapes/backyard-oasis/` | NEW |

* * *

#### **Healthy Yard Cluster** (`/healthy-yard/...`) — 4 pages

| # | Page | URL Slug | New/Existing |
| ---| ---| ---| --- |
| 1 | Lawn Fertilization Programs | `/healthy-yard/fertilization/` | Existing |
| 2 | Aeration & Overseeding | `/healthy-yard/aeration-overseeding/` | Existing |
| 3 | Weed Control Services | `/healthy-yard/weed-control/` | Existing |
| 4 | Mosquito & Tick Control | `/healthy-yard/mosquito-tick-control/` | Existing |

* * *

#### **Premier Outdoor Services Cluster** (`/premier-outdoor-services/...`) — 2 pages

_(Renamed from Outdoor Concierge)_

| # | Page | URL Slug | New/Existing |
| ---| ---| ---| --- |
| 1 | Pool Service & Maintenance | `/premier-outdoor-services/pool-service/` | Existing (moved + renamed) |
| 2 | Year-Round Maintenance Packages | `/premier-outdoor-services/maintenance-packages/` | Existing (moved + renamed) |

* * *

**Service Cluster Pages Total: 29**

> **Post-Launch Cluster Pages (scheduled Months 1–9):** The following cluster pages exist in the full architecture but are scheduled for post-launch publication as part of the 10 pages/month cadence: Grottos & Caves, Waterfalls & Cascades, Sheer Descent Water Features, Pool Slides, Pool Decking & Coping, Pool Surrounds & Decks, Foundation Planting, Privacy Screening & Hedges, Shade Tree Installation, Seasonal Color & Annuals, Mulching Services, Smart Irrigation Controllers, Pergolas, Gazebos, Stone & Masonry Work, Seat Walls & Built-In Seating, Driveways, Drainage & Grading Solutions, Sport Field Care, Organic Lawn Care, Soil Testing & Amendment, Turf Renovation & Restoration, Paver Restoration, Yard Clean-Up Services, Bed Maintenance, Pruning Services.
* * *

### 📁 LOCATION PAGES

#### Geographic URL Structure

> **v2.1 Architecture Change:** All town/city pages are now nested under their parent county in the URL structure: `/service-areas/{county-slug}/{town-slug}/`. This creates explicit geographic hierarchy that mirrors Google Knowledge Graph entity relationships, enables county-level topical authority to cascade downward to town pages, and improves both crawl architecture and AEO entity disambiguation. County pages function as geographic hub pages and must include internal links to all town pages within that county.

#### County Pages (5 pages)

| # | Page | URL Slug |
| ---| ---| --- |
| 1 | Montgomery County | `/service-areas/montgomery-county/` |
| 2 | Bucks County | `/service-areas/bucks-county/` |
| 3 | Chester County | `/service-areas/chester-county/` |
| 4 | Delaware County | `/service-areas/delaware-county/` |
| 5 | Philadelphia County | `/service-areas/philadelphia-county/` |

#### City/Town Pages by Tier

**TIER 1: Golden Circle (12 towns) — Launch**

All Tier 1 towns are in Montgomery County.

| # | Town | URL Slug |
| ---| ---| --- |
| 1 | Skippack | `/service-areas/montgomery-county/skippack/` |
| 2 | Worcester | `/service-areas/montgomery-county/worcester/` |
| 3 | Blue Bell | `/service-areas/montgomery-county/blue-bell/` |
| 4 | Gwynedd Valley | `/service-areas/montgomery-county/gwynedd-valley/` |
| 5 | Cedars | `/service-areas/montgomery-county/cedars/` |
| 6 | Collegeville | `/service-areas/montgomery-county/collegeville/` |
| 7 | Lederach | `/service-areas/montgomery-county/lederach/` |
| 8 | Creamery | `/service-areas/montgomery-county/creamery/` |
| 9 | Harleysville | `/service-areas/montgomery-county/harleysville/` |
| 10 | Schwenksville | `/service-areas/montgomery-county/schwenksville/` |
| 11 | Phoenixville | `/service-areas/chester-county/phoenixville/` |
| 12 | Limerick | `/service-areas/montgomery-county/limerick/` |

> **Note:** Phoenixville is in Chester County — URL corrected from v2 accordingly.

**TIER 2: Main Line & Affluent Outliers (9 towns at launch, 3 deferred to Month 1)**

| # | Town | URL Slug | Launch Status |
| ---| ---| ---| --- |
| 1 | Wayne | `/service-areas/delaware-county/wayne/` | ✅ Launch |
| 2 | Radnor | `/service-areas/delaware-county/radnor/` | ✅ Launch |
| 3 | Devon | `/service-areas/chester-county/devon/` | ✅ Launch |
| 4 | Malvern | `/service-areas/chester-county/malvern/` | ✅ Launch |
| 5 | Paoli | `/service-areas/chester-county/paoli/` | ✅ Launch |
| 6 | West Chester | `/service-areas/chester-county/west-chester/` | ✅ Launch |
| 7 | Gwynedd | `/service-areas/montgomery-county/gwynedd/` | ✅ Launch |
| 8 | Lower Gwynedd | `/service-areas/montgomery-county/lower-gwynedd/` | ✅ Launch |
| 9 | Lafayette Hill | `/service-areas/montgomery-county/lafayette-hill/` | ✅ Launch |
| 10 | Plymouth Meeting | `/service-areas/montgomery-county/plymouth-meeting/` | ⏳ Month 1 |
| 11 | Ambler | `/service-areas/montgomery-county/ambler/` | ⏳ Month 1 |
| 12 | Fort Washington | `/service-areas/montgomery-county/fort-washington/` | ⏳ Month 1 |

**TIER 3: Growth Corridors (12 towns) — Post-Launch**

| # | Town | URL Slug |
| ---| ---| --- |
| 1 | Royersford | `/service-areas/montgomery-county/royersford/` |
| 2 | North Wales | `/service-areas/montgomery-county/north-wales/` |
| 3 | Lansdale | `/service-areas/montgomery-county/lansdale/` |
| 4 | Audubon | `/service-areas/montgomery-county/audubon/` |
| 5 | Eagleville | `/service-areas/montgomery-county/eagleville/` |
| 6 | Trooper | `/service-areas/montgomery-county/trooper/` |
| 7 | Fairview Village | `/service-areas/montgomery-county/fairview-village/` |
| 8 | Kulpsville | `/service-areas/montgomery-county/kulpsville/` |
| 9 | Trappe | `/service-areas/montgomery-county/trappe/` |
| 10 | Gilbertsville | `/service-areas/montgomery-county/gilbertsville/` |
| 11 | Spring House | `/service-areas/montgomery-county/spring-house/` |
| 12 | Hatboro | `/service-areas/montgomery-county/hatboro/` |

**TIER 4: Lower Priority (20 towns) — Post-Launch**

| # | Town | URL Slug |
| ---| ---| --- |
| 1 | King of Prussia | `/service-areas/montgomery-county/king-of-prussia/` |
| 2 | Conshohocken | `/service-areas/montgomery-county/conshohocken/` |
| 3 | Ardmore | `/service-areas/montgomery-county/ardmore/` |
| 4 | Willow Grove | `/service-areas/montgomery-county/willow-grove/` |
| 5 | East Norriton | `/service-areas/montgomery-county/east-norriton/` |
| 6 | West Norriton | `/service-areas/montgomery-county/west-norriton/` |
| 7 | West Point | `/service-areas/montgomery-county/west-point/` |
| 8 | Green Lane | `/service-areas/montgomery-county/green-lane/` |
| 9 | Perkiomenville | `/service-areas/montgomery-county/perkiomenville/` |
| 10 | Telford | `/service-areas/montgomery-county/telford/` |
| 11 | Souderton | `/service-areas/montgomery-county/souderton/` |
| 12 | Hatfield | `/service-areas/montgomery-county/hatfield/` |
| 13 | Sanatoga | `/service-areas/montgomery-county/sanatoga/` |
| 14 | Pottstown | `/service-areas/montgomery-county/pottstown/` |
| 15 | Spring City | `/service-areas/chester-county/spring-city/` |
| 16 | Mont Clare | `/service-areas/montgomery-county/mont-clare/` |
| 17 | Oaks | `/service-areas/montgomery-county/oaks/` |
| 18 | Norristown | `/service-areas/montgomery-county/norristown/` |
| 19 | Bryn Mawr | `/service-areas/montgomery-county/bryn-mawr/` |
| 20 | Villanova | `/service-areas/delaware-county/villanova/` |

**Location Pages Total: 5 counties + 56 towns = 61 pages**
**At Launch: 5 counties + 12 Tier 1 + 9 Tier 2 = 26 location pages**
* * *

### 📁 SERVICE + LOCATION HYBRID PAGES (12 pages total / 5 at launch)

These target high-intent "\[Service\] in \[Location\]" searches for top-revenue combinations. URLs nest under the service pillar, not the service-areas directory, to concentrate service-level authority.

| # | Page | URL Slug | Launch Status |
| ---| ---| ---| --- |
| 1 | Pool Builders Blue Bell | `/pools/blue-bell/` | ✅ Launch |
| 2 | Pool Builders Gwynedd Valley | `/pools/gwynedd-valley/` | ✅ Launch |
| 3 | Pool Builders Wayne | `/pools/wayne/` | ✅ Launch |
| 4 | Landscaping Blue Bell | `/landscapes/blue-bell/` | ✅ Launch |
| 5 | Hardscaping Blue Bell | `/hardscapes/blue-bell/` | ✅ Launch |
| 6 | Pool Builders Radnor | `/pools/radnor/` | ⏳ Month 1 |
| 7 | Pool Builders West Chester | `/pools/west-chester/` | ⏳ Month 1 |
| 8 | Landscaping Collegeville | `/landscapes/collegeville/` | ⏳ Month 2 |
| 9 | Landscaping Phoenixville | `/landscapes/phoenixville/` | ⏳ Month 2 |
| 10 | Hardscaping Wayne | `/hardscapes/wayne/` | ⏳ Month 3 |
| 11 | Outdoor Living Blue Bell | `/hardscapes/backyard-oasis/blue-bell/` | ⏳ Month 4 |
| 12 | Outdoor Living Gwynedd Valley | `/hardscapes/backyard-oasis/gwynedd-valley/` | ⏳ Month 5 |

* * *

### 📁 BLOG / RESOURCE CONTENT (15 pages total / 5 at launch)

| # | Page | URL Slug | Pillar Tag | Launch Status |
| ---| ---| ---| ---| --- |
| 1 | How Much Does an Inground Pool Cost in PA? | `/blog/inground-pool-cost-pa/` | Pools | ✅ Launch |
| 2 | How to Choose a Pool Builder | `/blog/how-to-choose-pool-builder/` | Pools | ✅ Launch |
| 3 | Best Plants for Southeastern PA Landscapes | `/blog/best-plants-southeastern-pa/` | Landscapes | ✅ Launch |
| 4 | What to Expect During a Landscape Design Consultation | `/blog/landscape-design-consultation/` | Landscapes | ✅ Launch |
| 5 | Hardscape vs. Softscape: What's the Difference? | `/blog/hardscape-vs-softscape/` | Hardscapes, Landscapes | ✅ Launch |
| 6 | How Long Does Pool Construction Take? | `/blog/pool-construction-timeline/` | Pools | ⏳ Month 1 |
| 7 | Pool Maintenance 101: A Homeowner's Guide | `/blog/pool-maintenance-guide/` | Pools, Premier Outdoor Services | ⏳ Month 2 |
| 8 | Native Plants vs. Non-Native: Pros & Cons | `/blog/native-vs-non-native-plants/` | Landscapes | ⏳ Month 4 |
| 9 | Landscape Lighting Ideas for Your Backyard | `/blog/landscape-lighting-ideas/` | Landscapes | ⏳ Month 5 |
| 10 | Hardscape vs. Softscape: What's the Difference? | `/blog/hardscape-vs-softscape/` | Hardscapes, Landscapes | ✅ Launch |
| 11 | Paver Patio Maintenance Tips | `/blog/paver-patio-maintenance/` | Hardscapes, Premier Outdoor Services | ⏳ Month 3 |
| 12 | When to Aerate Your Lawn in PA | `/blog/when-to-aerate-lawn-pa/` | Healthy Yard | ⏳ Month 6 |
| 13 | Mosquito Control Tips for PA Homeowners | `/blog/mosquito-control-tips-pa/` | Healthy Yard | ⏳ Month 7 |
| 14 | How to Winterize Your Irrigation System | `/blog/winterize-irrigation-system/` | Landscapes | ⏳ Month 8 |
| 15 | How to Prepare Your Yard for a Pool Installation | `/blog/prepare-yard-pool-installation/` | Pools, Landscapes | ⏳ Month 7 |

* * *

### 📁 TRUST & CONVERSION PAGES (4 pages)

| # | Page | URL Slug | Purpose |
| ---| ---| ---| --- |
| 1 | Our Design Technology (3D Renderings) | `/design-technology/` | Differentiator |
| 2 | Awards & Recognition | `/awards/` | Trust signal |
| 3 | Insurance & Licensing | `/licensing/` | Trust signal |
| 4 | Editorial Standards | `/about/editorial-standards/` | E-E-A-T trust signal |

* * *

## COMPLETE SITEMAP SUMMARY

| Category | Total Pages | At Launch |
| ---| ---| --- |
| Core Pages | 20 | 20 |
| Author Bio Pages | 4-5 at launch, expanding | 4 |
| Editorial Standards | 1 | 1 |
| Service Pillar Pages | 5 | 5 |
| Service Cluster Pages | 29 (launch) + 26 (post-launch) = 55 | 29 |
| Location — County Pages | 5 | 5 |
| Location — Tier 1 Towns | 12 | 12 |
| Location — Tier 2 Towns | 12 | 9 |
| Location — Tier 3 Towns | 12 | — |
| Location — Tier 4 Towns | 20 | — |
| Service + Location Hybrid Pages | 12 | 5 |
| Blog / Resource Content | 15 | 5 |
| Trust & Conversion Pages | 4 | — |
| LAUNCH TOTAL (counted pages) |  | 80 |
| LAUNCH TOTAL (with E-E-A-T support) |  | 85 |
| FULL ARCHITECTURE TOTAL | ~172 + author bio pages |  |

### Launch Page Count Verification

| Category | Count |
| ---| --- |
| Core Pages | 20 |
| Service Pillar Pages | 5 |
| Service Cluster Pages | 29 |
| County Pages | 5 |
| Tier 1 Town Pages | 12 |
| Tier 2 Town Pages (9 at launch) | 9 |
| Subtotal | 80 ✅ |

* * *

* * *

# PHASED IMPLEMENTATION PLAN
* * *

## PHASE 1: LAUNCH (80 Pages)

**Strategy:** Maximize service depth at launch. All 5 pillar pages and the highest-impact cluster pages (29 total) ship immediately. Location pages include all 5 county pages + all 12 Tier 1 Golden Circle towns + 9 Tier 2 Main Line towns. Remaining 3 Tier 2 towns roll into Month 1.
* * *

### Launch Pages Breakdown

#### Core Pages (20 pages)

| # | Page |
| ---| --- |
| 1 | Homepage |
| 2 | Portfolio — Photo Gallery (social media shareable) |
| 3 | Portfolio — Completed Projects (social media shareable) |
| 4 | Reviews & Testimonials |
| 5 | Service Hub |
| 6 | Service Hub — Warranties |
| 7 | Service Hub — FAQs |
| 8 | Service Hub — Care Instructions |
| 9 | Blog Hub |
| 10 | About Us |
| 11 | Our Story |
| 12 | Meet the Team |
| 13 | Why Choose Blue Tree? |
| 14 | Our Process |
| 15 | Contact Us |
| 16 | Request an Estimate |
| 17 | Careers |
| 18 | Financing |
| 19 | Privacy Policy |
| 20 | Terms of Service |

* * *

#### Service Pillar Pages (5 pages — pages 21–25)

| # | Page |
| ---| --- |
| 21 | Pools |
| 22 | Landscapes |
| 23 | Hardscapes |
| 24 | Healthy Yard |
| 25 | Premier Outdoor Services |

* * *

#### Service Cluster Pages (29 pages — pages 26–54)

**Pools Cluster — 8 pages:**

| # | Page |
| ---| --- |
| 26 | Inground Pool Construction |
| 27 | Pool Design Process |
| 28 | Pool Renovation & Remodeling |
| 29 | Pool Water Features |
| 30 | Pool Lighting |
| 31 | Concrete Pool Installation |
| 32 | Spa & Hot Tub Integration |
| 33 | Pool Equipment (Jandy) |

**Landscapes Cluster — 8 pages:**

| # | Page |
| ---| --- |
| 34 | Landscape Design Process |
| 35 | Garden Design & Planting |
| 36 | Native Plant Landscaping |
| 37 | Fencing |
| 38 | LED Landscape Lighting |
| 39 | Pathway & Accent Lighting |
| 40 | Drip Irrigation |
| 41 | Sprinkler System Installation |

**Hardscapes Cluster — 7 pages:**

| # | Page |
| ---| --- |
| 42 | Hardscape Design |
| 43 | Paver Patio Design & Installation |
| 44 | Outdoor Kitchens |
| 45 | Fire Pits & Fireplaces |
| 46 | Walkways & Pathways |
| 47 | Retaining Walls |
| 48 | Backyard Oasis Design |

**Healthy Yard Cluster — 4 pages:**

| # | Page |
| ---| --- |
| 49 | Lawn Fertilization Programs |
| 50 | Aeration & Overseeding |
| 51 | Weed Control Services |
| 52 | Mosquito & Tick Control |

**Premier Outdoor Services Cluster — 2 pages:**

| # | Page |
| ---| --- |
| 53 | Pool Service & Maintenance |
| 54 | Year-Round Maintenance Packages |

* * *

#### County Pages (5 pages — pages 55–59)

| # | Page |
| ---| --- |
| 55 | Montgomery County |
| 56 | Bucks County |
| 57 | Chester County |
| 58 | Delaware County |
| 59 | Philadelphia County |

* * *

#### Tier 1 Location Pages — Golden Circle (12 pages — pages 60–71)

| # | Page |
| ---| --- |
| 60 | Skippack |
| 61 | Worcester |
| 62 | Blue Bell |
| 63 | Gwynedd Valley |
| 64 | Cedars |
| 65 | Collegeville |
| 66 | Lederach |
| 67 | Creamery |
| 68 | Harleysville |
| 69 | Schwenksville |
| 70 | Phoenixville |
| 71 | Limerick |

* * *

#### Tier 2 Location Pages — Main Line (9 pages at launch — pages 72–80)

| # | Page |
| ---| --- |
| 72 | Wayne |
| 73 | Radnor |
| 74 | Devon |
| 75 | Malvern |
| 76 | Paoli |
| 77 | West Chester |
| 78 | Gwynedd |
| 79 | Lower Gwynedd |
| 80 | Lafayette Hill |

* * *

**LAUNCH TOTAL: 80 PAGES** ✅
* * *

#### E-E-A-T Support Pages (launch alongside blog content — not counted against 80-page cap)

| Page | URL |
| ---| --- |
| Jeff Mattiola Bio | `/about/team/jeff-downie/-incorrect` |
| Jérôme Besnard Bio | `/about/team/jerome-besnard/` |
| \[Lead Designer\] Bio | `/about/team/[name]/` |
| Mark Paisley Bio | `/about/team/mark-paisley/` |
| Editorial Standards | `/about/editorial-standards/` |

* * *

* * *

## PHASE 2: POST-LAUNCH — 12-Month Rollout

**Cadence:** 10 pages/month
**Goal:** Complete remaining service clusters, build out location pages by tier, expand blog content, and deploy additional service+location hybrid pages.
* * *

### Month 1 — Post-Launch (Pages 81–90)

| # | Page | Category |
| ---| ---| --- |
| 81 | Plymouth Meeting | Tier 2 Location |
| 82 | Ambler | Tier 2 Location |
| 83 | Fort Washington | Tier 2 Location |
| 84 | Pool Builders Radnor | Service + Location |
| 85 | Pool Builders West Chester | Service + Location |
| 86 | Grottos & Caves | Pools Cluster |
| 87 | Waterfalls & Cascades | Pools Cluster |
| 88 | Sheer Descent Water Features | Pools Cluster |
| 89 | Pool Slides | Pools Cluster |
| 90 | How Long Does Pool Construction Take? | Blog |

* * *

### Month 2 — Post-Launch (Pages 91–100)

| # | Page | Category |
| ---| ---| --- |
| 91 | Royersford | Tier 3 Location |
| 92 | North Wales | Tier 3 Location |
| 93 | Lansdale | Tier 3 Location |
| 94 | Pool Decking & Coping | Pools Cluster |
| 95 | Pool Surrounds & Decks | Pools Cluster |
| 96 | Landscaping Collegeville | Service + Location |
| 97 | Landscaping Phoenixville | Service + Location |
| 98 | Pergolas - ask jeff | Hardscapes Cluster |
| 99 | Driveways | Hardscapes Cluster |
| 100 | Pool Maintenance 101: A Homeowner's Guide | Blog |

* * *

### Month 3 — Post-Launch (Pages 101–110)

| # | Page | Category |
| ---| ---| --- |
| 101 | Audubon | Tier 3 Location |
| 102 | Eagleville | Tier 3 Location |
| 103 | Trooper | Tier 3 Location |
| 104 | Gazebos | Hardscapes Cluster |
| 105 | Stone & Masonry Work | Hardscapes Cluster |
| 106 | Seat Walls & Built-In Seating | Hardscapes Cluster |
| 107 | Pool Surrounds & Decks | Hardscapes Cluster |
| 108 | Hardscaping Wayne | Service + Location |
| 109 | Paver Restoration | Premier Outdoor Services Cluster |
| 110 | Paver Patio Maintenance Tips | Blog |

* * *

### Month 4 — Post-Launch (Pages 111–120)

| # | Page | Category |
| ---| ---| --- |
| 111 | Fairview Village | Tier 3 Location |
| 112 | Kulpsville | Tier 3 Location |
| 113 | Trappe | Tier 3 Location |
| 114 | Foundation Planting | Landscapes Cluster |
| 115 | Privacy Screening & Hedges | Landscapes Cluster |
| 116 | Shade Tree Installation | Landscapes Cluster |
| 117 | Smart Irrigation Controllers | Landscapes Cluster |
| 118 | Outdoor Living Blue Bell | Service + Location |
| 119 | Drainage & Grading Solutions | Healthy Yard Cluster |
| 120 | Native Plants vs. Non-Native: Pros & Cons | Blog |

* * *

### Month 5 — Post-Launch (Pages 121–130)

| # | Page | Category |
| ---| ---| --- |
| 121 | Gilbertsville | Tier 3 Location |
| 122 | Spring House | Tier 3 Location |
| 123 | Hatboro | Tier 3 Location |
| 124 | Seasonal Color & Annuals | Landscapes Cluster |
| 125 | Mulching Services | Landscapes Cluster |
| 126 | Turf Renovation & Restoration | Healthy Yard Cluster |
| 127 | Sport Field Care | Healthy Yard Cluster |
| 128 | Outdoor Living Gwynedd Valley | Service + Location |
| 129 | Yard Clean-Up Services | Premier Outdoor Services Cluster |
| 130 | Landscape Lighting Ideas for Your Backyard | Blog |

* * *

### Month 6 — Post-Launch (Pages 131–140)

| # | Page | Category |
| ---| ---| --- |
| 131 | King of Prussia | Tier 4 Location |
| 132 | Conshohocken | Tier 4 Location |
| 133 | Ardmore | Tier 4 Location |
| 134 | Bryn Mawr | Tier 4 Location |
| 135 | Villanova | Tier 4 Location |
| 136 | Organic Lawn Care | Healthy Yard Cluster |
| 137 | Soil Testing & Amendment | Healthy Yard Cluster |
| 138 | Bed Maintenance | Premier Outdoor Services Cluster |
| 139 | Pruning Services | Premier Outdoor Services Cluster |
| 140 | When to Aerate Your Lawn in PA | Blog |

* * *

### Month 7 — Post-Launch (Pages 141–150)

| # | Page | Category |
| ---| ---| --- |
| 141 | Willow Grove | Tier 4 Location |
| 142 | East Norriton | Tier 4 Location |
| 143 | West Norriton | Tier 4 Location |
| 144 | West Point | Tier 4 Location |
| 145 | Green Lane | Tier 4 Location |
| 146 | Perkiomenville | Tier 4 Location |
| 147 | Our Design Technology (3D Renderings) | Trust Page |
| 148 | Awards & Recognition | Trust Page |
| 149 | Mosquito Control Tips for PA Homeowners | Blog |
| 150 | How to Prepare Your Yard for a Pool Installation | Blog |

* * *

### Month 8 — Post-Launch (Pages 151–160)

| # | Page | Category |
| ---| ---| --- |
| 151 | Telford | Tier 4 Location |
| 152 | Souderton | Tier 4 Location |
| 153 | Hatfield | Tier 4 Location |
| 154 | Sanatoga | Tier 4 Location |
| 155 | Pottstown | Tier 4 Location |
| 156 | Spring City | Tier 4 Location |
| 157 | Mont Clare | Tier 4 Location |
| 158 | Insurance & Licensing | Trust Page |
| 159 | How to Winterize Your Irrigation System - Replace | Blog |
| 160 | The Benefits of Smart Irrigation Controllers - replace | Blog |

* * *

### Month 9 — Post-Launch (Pages 161–170)

| # | Page | Category |
| ---| ---| --- |
| 161 | Oaks | Tier 4 Location |
| 162 | Norristown | Tier 4 Location |
| 163 | Careers (expanded with operation-tagged listings) | Core Page |
| 164–170 | Flex blog content based on GSC data | Blog |

* * *

### Months 10–12: FLEX CONTENT ALLOCATION (~30 page slots)

Use performance data from Google Search Console and analytics to allocate remaining capacity:

| Content Type | Estimated Pages | Rationale |
| ---| ---| --- |
| New blog posts targeting gaps found in Search Console | 12 | Fill keyword gaps revealed by 9 months of data |
| Additional service + location hybrids for winning combos | 8 | Double down on high-demand pairings |
| Seasonal/timely content (winter pool care, spring lawn prep) | 5 | Capture seasonal search spikes |
| Customer story / case study pages | 3 | Deep-form social proof for high-ticket services |
| Community involvement page | 1 | Trust + local relevance signal |
| Updated FAQs / Instructions | 1 | Refresh Service Hub from real customer inquiries |
| TOTAL FLEX | ~30 |  |

**Grand Total at end of 12 months: ~200 pages**
* * *

## IMPLEMENTATION TIMELINE SUMMARY

| Phase | Timeframe | Pages Published | Cumulative Total |
| ---| ---| ---| --- |
| Launch | Day 1 | 80 | 80 |
| Month 1 | +30 days | 10 | 90 |
| Month 2 | +60 days | 10 | 100 |
| Month 3 | +90 days | 10 | 110 |
| Month 4 | +120 days | 10 | 120 |
| Month 5 | +150 days | 10 | 130 |
| Month 6 | +180 days | 10 | 140 |
| Month 7 | +210 days | 10 | 150 |
| Month 8 | +240 days | 10 | 160 |
| Month 9 | +270 days | 10 | 170 |
| Month 10 | +300 days | 10 (flex) | 180 |
| Month 11 | +330 days | 10 (flex) | 190 |
| Month 12 | +365 days | 10 (flex) | 200 |

* * *

## KEY STRATEGIC NOTES

### What Changed from v1 and Why

**1\. Five pillars instead of nine reduces navigation friction.** The original 9-pillar structure spread topical authority too thin at the nav level. Five pillars create cleaner user journeys and concentrate link equity into stronger hub pages.

**2\. "Premier Outdoor Services" elevates the maintenance pillar.** By branding maintenance services as "Premier Outdoor Services," Blue Tree positions what competitors treat as commoditized recurring work into a premium, white-glove service tier. This supports higher pricing and positions the company for recurring revenue relationships.

**3\. Operation Tags solve the "one page, many services" discovery problem.** Instead of building separate portfolio pages for each service line, the tag system lets a single rich portfolio page serve every audience. Filtered by tag — not by separate page — this avoids thin content while enabling hyper-relevant user experiences.

**4\. Service depth at launch beats geographic breadth.** 29 service cluster pages live on Day 1. A customer searching "outdoor kitchens southeastern PA" needs to land on a rich, authoritative page — not a thin location page. The Tier 1 Golden Circle (12 pages) + 9 Tier 2 Main Line towns + 5 county pages provide sufficient geographic signal at launch.

**5\. County → Town URL hierarchy (v2.1 addition).** Nesting towns under their county (`/service-areas/montgomery-county/skippack/`) creates explicit geographic entity relationships for both Google and AI engines, builds county-level authority that cascades downward, and creates cleaner internal linking architecture.

**6\. Portfolio pages designed for social sharing (v2.1 addition).** Both portfolio pages include native social sharing functionality, optimized Open Graph previews per project, and one-click sharing to Facebook, Instagram, Pinterest, and Houzz. Portfolio content is a natural viral asset — make it frictionless to share.

### AEO / GEO Schema Requirements

| Schema Type | Applied To |
| ---| --- |
| LocalBusiness | Homepage, About, Contact, all location pages |
| Service | All service pillar and cluster pages |
| FAQPage | Service Hub FAQs + all service pages with embedded FAQs |
| HowTo | Blog guides, Care Instructions |
| Review / AggregateRating | Reviews page |
| Organization | About Us, Our Story, all pages (as `publisher`) — includes `sameAs` to GBP, social profiles, BBB |
| Person | Meet the Team profiles, author bio pages, all blog posts (as `author`) — includes `knowsAbout`, `hasCredential`, `worksFor`, `sameAs` (LinkedIn) |
| Article | All blog/resource content — with `author` (Person), `publisher` (Organization), `reviewedBy` (Person), `datePublished`, `dateModified`, `speakable` |
| speakable | Blog answer capsules (first 150 words) — marks content eligible for voice search and voice assistant citation |
| BreadcrumbList | All pages (site-wide) |
| ImageGallery | Portfolio pages |

### Internal Linking Architecture

```scss
Homepage
├── Pools (pillar) → Inground, Design, Renovation, Features, Lighting, Concrete, Spa, Equipment
├── Landscapes (pillar) → Design, Planting, Native Plants, Fencing, Lighting, Irrigation
├── Hardscapes (pillar) → Design, Patios, Kitchens, Fire Pits, Walkways, Walls, Oasis
├── Healthy Yard (pillar) → Fertilization, Aeration, Weed Control, Pest Control
├── Premier Outdoor Services (pillar) → Pool Service, Maintenance Packages
├── Service Areas → Counties → Towns (nested hierarchy)
├── Portfolio (filtered by operation tag) — social shareable
├── Reviews (filtered by operation tag)
├── Blog → Individual posts (tagged to pillars)
└── Service Hub → Warranties, FAQs, Instructions (filtered by operation tag)
```

**Cross-linking rules:**

*   Every cluster page links UP to its pillar page
*   Every cluster page links LATERALLY to 2–3 sibling cluster pages
*   Every cluster page links DOWN to relevant blog posts
*   Every cluster page links to the nearest relevant location page
*   Every county page links DOWN to all town pages within that county
*   Every town page links UP to its parent county page
*   Every location page links to all 5 pillar pages
*   Every blog post links to the most relevant cluster page AND pillar page
*   Portfolio and Reviews embed contextual links to related service pages
* * *

## PAGES REMOVED / DEFERRED FROM v1 (For Reference)

| v1 Page | Disposition in v2/v2.1 |
| ---| --- |
| Landscape Lighting (pillar) | Absorbed into Landscapes pillar + LED cluster pages |
| Irrigation Systems (pillar) | Absorbed into Landscapes pillar + irrigation cluster pages |
| Maintenance Services (pillar) | Absorbed into Premier Outdoor Services pillar |
| Mosquito & Tick Control (pillar) | Absorbed into Healthy Yard cluster |
| Outdoor Living Spaces (pillar) | Absorbed into Hardscapes + Backyard Oasis cluster |
| Smart Lighting Controls (cluster) | Merged into LED Landscape Lighting |
| Irrigation System Repair (cluster) | Merged into Sprinkler System Installation |
| Winterization Services (cluster) | Moved to blog content |
| Landscape/Hardscape Maintenance (cluster) | Merged into Premier Outdoor Services |
| Spring/Fall Cleanup Services (cluster) | Merged into Yard Clean-Up Services |
| Storm Water Management / Erosion Control (cluster) | Merged into Drainage & Grading Solutions |
| Commercial Landscaping (all variants) | Deferred — revisit Year 2 strategy |
| Community Involvement | Deferred to flex content Months 10–12 |
| Client Portal | Removed — external tool |

* * *

## NEXT STEPS

1. **Client sign-off on v2.1 sitemap** — Jérôme to confirm updated page counts, Premier Outdoor Services rename, and county/town URL structure
2. **CMS operation tag configuration** — Developer to implement tag taxonomy before content entry
3. **Content briefs for all 29 launch cluster pages** — Begin with 5 pillar pages, then cluster pages by revenue priority
4. **Portfolio social sharing implementation** — Developer to build Open Graph templates + platform share buttons for each project
5. **County assignment audit** — Confirm correct county for each town across all tiers (Phoenixville → Chester County noted in v2.1)
6. **Schema markup templates** — Technical SEO to prepare structured data for each page type
7. **Blog editorial calendar** — Finalize 5 launch blog posts and outline post-launch cadence
* * *

_Document version: v2.1_
_Created: February 19, 2026_
_Author:_ [_ROI.LIVE_](http://ROI.LIVE)
_Client: Blue Tree Landscaping | Contact: Jérôme Besnard (Sales Manager)_
_Previous version: v2.0 (February 18, 2026)_

**v2.1 Change Summary:**

*   "Outdoor Concierge" → "Premier Outdoor Services" (all references updated)
*   Portfolio pages designated as social media shareable with implementation notes
*   Service cluster pages revised to 29 at launch (architecture streamlined)
*   All town URLs updated to county-nested structure `/service-areas/{county}/{town}/`
*   Tier 2 launch towns corrected to 9 (math: 20 core + 5 pillars + 29 clusters + 5 counties + 12 Tier 1 + 9 Tier 2 = 80)
*   Phoenixville county corrected to Chester County
*   Launch page count verified and confirmed at exactly 80
