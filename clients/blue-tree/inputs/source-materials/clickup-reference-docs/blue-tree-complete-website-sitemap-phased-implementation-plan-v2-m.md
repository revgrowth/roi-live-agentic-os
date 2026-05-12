---
clickup_doc_id: 8cma26h-13733
clickup_page_id: 8cma26h-5233
clickup_url: https://app.clickup.com/9013889233/docs/8cma26h-13733/8cma26h-5233
original_filename: Blue Tree _ Complete Website Sitemap Phased Implementation Plan v2.m
normalized_title: blue tree complete website sitemap phased implementation plan v2.m
classification: REFERENCE_DOC
version: v2
status_in_archive: canonical
date_updated: 2026-05-08
hierarchy_category: (workspace-level)
hierarchy_subcategory: (none)
md5: 581c4b71b55886696bf87e3cd8999936
archived_to_repo: 2026-05-12
---

# Blue Tree: Complete Website Sitemap & Phased Implementation Plan — v2

## Revision Notes (February 2026)

**What changed from v1:** This revision incorporates the client's (Jérôme Besnard, Sales Manager) handwritten sitemap and service architecture feedback dated Feb 5, 2026. Key structural changes include:

1. **Service pillars consolidated from 9 → 5** (Pools, Landscapes, Hardscapes, Healthy Yard, Premier Outdoor Services)
2. **"Operation Tags"** introduced for cross-pillar filtering at the navigation level — visitors can filter portfolio (photos and completed projects, reviews, team, jobs, blogs, FAQs, warranties, and instructions by service pillar. More than one tag can be picked.
3. **"Service Hub"** section added (Warranties, FAQs, Care Instructions) — replaces scattered trust pages
4. **Meet the Team** restructured with department tags (Design, Project Management, Support, Leadership, Marketing). More than 1 tag can be picked.
5. **New service cluster pages** added: Fencing, Paver Restoration, Sport Field Care, Backyard Oasis Design and more.
6. **Landscape Lighting, Irrigation, Maintenance, Pest Control** absorbed into the 5-pillar structure (no longer standalone pillars)
7. **Location pages reduced at launch** to make room for deeper service coverage — geo pages backloaded into post-launch schedule
8. **80-page launch cap maintained** — remaining pages scheduled across 12 months post-launch at 10 pages/month
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
*   **Internal linking architecture** designed for topical clustering — every cluster page links up to its pillar, laterally to siblings, and down to relevant blog content
*   **Structured data vocabulary** aligned with how LLMs parse and cite service providers
* * *

## OPERATION TAGS SYSTEM

The client's key architectural innovation: **Operation Tags** allow the 5 service pillars to function as filters across the entire site. This means a visitor browsing the "Pools" tag can see pool-related portfolio items, pool-specific reviews, pool team members, pool FAQs, pool warranties, pool blog posts, and pool career openings — all from a single filtered view.

| Tag | Applied To |
| ---| --- |
| Pools | Portfolio (photos + completed projects), Reviews, Team, Blogs, FAQs, Warranties, Instructions, Careers |
| Landscapes | Portfolio (photos + completed projects), Reviews, Team, Blogs, FAQs, Warranties, Instructions, Careers |
| Hardscapes | Portfolio (photos + completed projects), Reviews, Team, Blogs, FAQs, Warranties, Instructions, Careers |
| Healthy Yard | Portfolio (photos + completed projects), Reviews, Team, Blogs, FAQs, Warranties, Instructions, Careers |
| Premier Outdoor Services | Portfolio (photos + completed projects), Reviews, Team, Blogs, FAQs, Warranties, Instructions, Careers |

> **Implementation note:** This is a CMS taxonomy/tagging system, not individual pages. Each tag generates filtered views, not unique URLs (avoids thin content / duplicate content issues). The exception is the 5 pillar pages themselves, which serve as the landing pages for each tag.
* * *

## COMPLETE SITEMAP STRUCTURE
* * *

### 📁 CORE PAGES (20 pages)

| # | Page | URL Slug | Purpose |
| ---| ---| ---| --- |
| 1 | Homepage | `/` | Primary conversion + brand positioning |
| 2 | Portfolio — Photo Gallery | `/portfolio/` | Visual proof, filterable by operation tag. Can be shared on social media (Facebook, Instagram, Pinterest and Houzz). |
| 3 | Portfolio — Completed Projects | `/portfolio/completed-projects/` | Case studies with before/after + scope details. Filterable by operation tag. Can be shared on social media (Facebook, Instagram, Pinterest and Houzz). |
| 4 | Reviews & Testimonials | `/reviews/` | Social proof, filterable by operation tag |
| 5 | Service Hub | `/service-hub/` | Central resource hub (warranties, FAQs, instructions) |
| 6 | Service Hub — Warranties | `/service-hub/warranties/` | Warranty details by service type (filterable by tag) |
| 7 | Service Hub — FAQs | `/service-hub/faqs/` | General + pillar-specific FAQs (filterable by tag) |
| 8 | Service Hub — Care Instructions | `/service-hub/instructions/` | Post-project care guides by service type (filterable by tag) |
| 9 | Blog Hub | `/blog/` | Content marketing hub (filterable by tag) |
| 10 | About Us | `/about/` | Company overview + trust signals |
| 11 | Our Story | `/about/our-story/` | Jeff Mattiola's 40-year journey, founding in 1983 |
| 12 | Meet the Team | `/about/team/` | Staff directory with department tags. Filterable by operation tags too. |
| 13 | Why Choose Blue Tree? | `/about/why-choose-us/` | Competitive advantages + differentiators |
| 14 | Our Process | `/about/our-process/` | Design → Build → Maintain workflow |
| 15 | Contact Us | `/contact/` | Form, phone, address, map |
| 16 | Request an Estimate | `/request-estimate/` | Lead capture form |
| 17 | Careers | `/careers/` | Job listings, filterable by department + operation tag. Designed CMS for templates that can be easily picked. |
| 18 | Financing | `/financing/` | Payment options + financing partners |
| 19 | Privacy Policy | `/privacy-policy/` | Legal |
| 20 | Terms of Service | `/terms-of-service/` | Legal |

**Team Department Tags** (for Meet the Team filtering):

*   Design
*   Project Management
*   Support
*   Leadership
*   Marketing

**Core Pages Total: 20**
* * *

### 📁 SERVICE PILLAR PAGES (5 pages)

These are the primary navigation-level service pages. Each functions as a topical authority hub with links to all cluster pages beneath it.

| # | Pillar | URL Slug | Description |
| ---| ---| ---| --- |
| 1 | Pools | `/pools/` | Custom inground pool design, construction, features, renovation, and pool-specific services |
| 2 | Landscapes | `/landscapes/` | Landscape design, planting, garden design, lighting, drip irrigation, and landscape features |
| 3 | Hardscapes | `/hardscapes/` | Patio design, outdoor kitchens, fireplaces, walkways, retaining walls, and structural outdoor features |
| 4 | Healthy Yard | `/healthy-yard/` | Turf care programs, pest control, drainage solutions, weed management, and sport field care |
| 5 | Premier Outdoor Services | `/premier-outdoor-services/` | Ongoing maintenance, pool service, paver restoration, clean-ups, bed maintenance, and pruning |

**Service Pillar Pages Total: 5**
* * *

### 📁 SERVICE CLUSTER PAGES (29 pages at launch)
* * *

#### **Pools Cluster** (`/pools/...`) — 5 pages at launch (pool services is same page than in pillar page 'Premier Outdoor Services')

| # | Page | URL Slug | Client Request | New/Existing |
| ---| ---| ---| ---| --- |
| 1 | Inground Pool Construction | `/pools/inground-pools/` | ✅ Inground pools | Existing |
| 2 | Pool Design Process | `/pools/pool-design/` | ✅ Pool design | Existing |
| 3 | Pool Renovation & Remodeling | `/pools/pool-renovation/` | ✅ Pool renovation | Existing |
| 4 | Pool Features | `/pools/pool-features/` | ✅ Pool features | Existing |
| 12 | Spa & Hot Tub Integration | `/pools/spa-hot-tub/` | ✅ Spa & Hot tubs | Existing |
| 6 | Pool Services | `/premier-outdoor-services/pool-services/` | ✅ Pool Services | Existing |
| 13 | Pool Equipment (Jandy) | `/pools/pool-equipment/` | — | LATER |
| 11 | Pool Decking & Coping | `/pools/pool-decking/` | — | LATER |
| 5 | Pool Lighting | `/pools/pool-features/lighting/` | \--- | LATER |
| 7 | Grottos & Caves | `/pools/pool-features/grottos/` | — | LATER |
| 8 | Waterfalls & Cascades | `/pools/pool-features/waterfalls/` | — | LATER |
| 9 | Swim up bar | `/pools/pool-features/swim-up-bar` | — | LATER |
| 10 | Pool Slides | `/pools/pool-features/slides/` | — | LATER |

* * *
**Other pool features sub-page ideas**: bubblers, deck jets, laminars, sheer descents, tanning ledges, diving, cozy cove, pool finishes (check [https://blog.royalswimmingpools.com/durable-pool-finishes-options-comparison-guide](https://blog.royalswimmingpools.com/durable-pool-finishes-options-comparison-guide))
**For pool equipment, ideas for sub-pages**: smart controls, filters, pumps, cleaners, heaters, sanitizing systems.

#### **Landscapes Cluster** (`/landscapes/...`) — 5 pages at launch (landscape services is same page than in pillar page 'Premier Outdoor Services')

_Now includes lighting and irrigation sub-services that were previously standalone pillars._

| # | Page | URL Slug | Client Request | New/Existing |
| ---| ---| ---| ---| --- |
| 1 | Landscape Design Process | `/landscapes/design/` | ✅ Landscape design | Existing (repositioned — see note below) |
| 2 | Planting | `/landscapes/planting` | ✅ Planting | Existing |
| 9 | Fencing | `/landscapes/fencing` | ✅ Fencing | NEW |
| 10 | LED Landscape Lighting | `/landscapes/led-lighting` | ✅ LED lighting | Restructured (was `/landscape-lighting/`) |
| 12 | Drip Irrigation | `/landscapes/drip-irrigation/` | ✅ Drip irrigation | Restructured (was `/irrigation/`) |
| 13 | Landscape services | `/premier-outdoor-services/landscape-services` | ✅ Landscape services |  |
| 3 | Native Plant Landscaping | `/landscapes/planting/native-plants/` | — | LATER |
| 4 | Foundation Planting | `/landscapes/planting/foundation-planting/` | — | LATER |
| 5 | Privacy Screening & Hedges | `/landscapes/planting/privacy-screening/` | — | LATER |
| 6 | Shade Tree Installation | `/landscapes/planting/shade-trees/` | — | LATER |
| 7 | Seasonal Color & Annuals | `/landscapes/planting/seasonal-color/` | — | LATER |
|  |  |  |  |  |
| 11 | Pathway & Accent Lighting | `/landscapes/led-lighting/pathway-accent-lighting/` | \_\_ | LATER |
| 14 | Tree trunk lighting | `/landscapes/led-lighting/tree-trunks` | — | LATER |

**Other ideas for LED lighting**: House lighting.

> **Architecture Note —** **`/landscapes/design/`** **Repositioning (February 2026):** This page was originally titled "Landscape Design Services" but has been repositioned to **"Landscape Design Process"** to eliminate entity overlap with the `/landscapes/` pillar page. The pillar page ("Landscape Design & Installation") already comprehensively covers landscape design as a service — owning the commercial-intent queries ("landscape design Southeastern PA," "landscape designer near me"). The `/landscapes/design/` cluster page now targets the distinct informational/consideration entity of the _design process itself_ — queries like "what is the landscape design process," "how does landscape design work," and "steps in a landscape design project." This mirrors the Pools architecture: `/pools/` = comprehensive pool pillar, `/pools/pool-design/` = pool design process. URL slug remains `/landscapes/design/` (unchanged).
* * *

#### **Hardscapes Cluster** (`/hardscapes/...`) — 7 pages at launch (hardscape services is same page than in pillar page 'Premier Outdoor Services')
####   

_Now includes outdoor living / backyard oasis concepts that were previously a standalone pillar._

| # | Page | URL Slug | Client Request | New/Existing |
| ---| ---| ---| ---| --- |
| 1 | Hardscape Design | `/hardscapes/design/` | ✅ Hardscape design | NEW |
| 2 | Paver Patio Installation | `/hardscapes/paver-patios/` | ✅ Patio | Existing |
| 3 | Outdoor Kitchens | `/hardscapes/outdoor-kitchens/` | ✅ Outdoor kitchens | Existing |
| 4 | Fire Pits & Fireplaces | `/hardscapes/fire-pits/` | ✅ Firepit and fireplaces | Existing |
| 5 | Walkways & Pathways | `/hardscapes/walkways/` | ✅ Walkway | Existing |
| 6 | Retaining Walls | `/hardscapes/retaining-walls/` | ✅ Retaining walls | Existing |
| 7 | Backyard Oasis Design | `/hardscapes/backyard-oasis/` | ✅ Backyard oasis addition | NEW |
| 13 | Hardscape services | `/premier-outdoor-services/hardscape-services` | ✅ Paver restauration | Existing |
| 8 | Paver driveways | `/hardscapes/paver-driveways/` | — | LATER |
| 9 | Pergolas | `/hardscapes/backyard-oasis/pergolas/` | — | LATER |
| 10 | Gazebos | `/hardscapes/backyard-oasis/gazebos/` | — | LATER |
| 11 | Stone & Masonry Work | `/hardscapes/stone-masonry/` | — | LATER |
| 12 | Seat Walls & Built-In Seating | `/hardscapes/seat-walls/` | — | LATER |

* * *

#### **Healthy Yard Cluster** (`/healthy-yard/...`) — 6 pages at launch

_Consolidates former Turf Care and Pest Control pillars plus drainage._

| # | Page | URL Slug | Client Request | New/Existing |
| ---| ---| ---| ---| --- |
| 1 | Lawn Fertilization Programs | `/healthy-yard/fertilization/` | ✅ Turf care all year round | Existing |
| 3 | Turf Renovation & Restoration | `/healthy-yard/turf-renovation/` | ✅ Aeration and overseeding | Existing |
| 5 | Mosquito & Tick Control | `/healthy-yard/mosquito-tick-control/` | ✅ Mosquitos & ticks | Existing (consolidated) |
| 4 | Weed Control Services | `/healthy-yard/weed-control/` | ✅ Weed control | Existing |
| 6 | Drainage & Grading Solutions | `/healthy-yard/drainage-grading/` | ✅ Drainage & grading solutions | Existing (expanded) |
| 7 | Sport Field Care | `/healthy-yard/sport-field-care/` | ✅ Sport field care | NEW |
| 8 | Organic Lawn Care | `/healthy-yard/organic-lawn-care/` | — | LATER |
| 9 | Soil Testing & Amendment | `/healthy-yard/soil-testing/` | — | LATER |
|  |  |  |  |  |

* * *

#### **Premier Outdoor Services Cluster** (`/outdoor-concierge/...`) — 6 pages at launch

_Client's new "5th pillar" — consolidates all ongoing maintenance and care services into a premium concierge-style offering._

| # | Page | URL Slug | Client Request | New/Existing |
| ---| ---| ---| ---| --- |
| 1 | Pool Service & Maintenance | `/premier-outdoor-services/pool-services/` | ✅ Pool services | Existing (moved) |
| 3 | Landscape Services | `/premier-outdoor-services/landscape-services` | ✅ Landscaping services | Existing (consolidated spring + fall+summer pruning + bad maintenance) |
| 2 | Paver Restoration | `/premier-outdoor-services/hardscape-services` | ✅ Paver restoration | NEW |
| 6 | Yard clean-ups | `/premier-outdoor-services/landscape-services/clean-up` | ✅ Yard clean-up (trim/weed/mulch) | Existing (moved) |
| 4 | Bed Maintenance | `/premier-outdoor-services/landscape-services/bed-maintenance/` | ✅ Bed maintenance | NEW |
| 5 | Pruning Services | `/premier-outdoor-services/landscape-services/pruning/` | ✅ Pruning | NEW |

* * *
**Ideas for future pool services sub-pages:** Pool opening, pool closing, open-season pool maintenance, winter pool maintenance

**Service Cluster Pages Total: 29 at launch**
* * *

### 📁 LOCATION PAGES

#### County Pages (5 pages at launch)

| # | Page | URL Slug |
| ---| ---| --- |
| 1 | Montgomery County | `/service-areas/montgomery-county/` |
| 2 | Bucks County | `/service-areas/bucks-county/` |
| 3 | Chester County | `/service-areas/chester-county/` |
| 4 | Delaware County | `/service-areas/delaware-county/` |
| 5 | Philadelphia County | `/service-areas/philadelphia-county/` |

#### City/Town Pages by Tier

**TIER 1: Golden Circle (12 towns at launch)**

## **CHANGE URLS TO: /serrvice-areas/montgomery-county/skippack/ ?** [@Jason Spencer](#user_mention#132116866)

| # | Town | URL Slug |
| ---| ---| --- |
| 1 | Skippack | `/service-areas/skippack/` |
| 2 | Worcester | `/service-areas/worcester/` |
| 3 | Blue Bell | `/service-areas/blue-bell/` |
| 4 | Gwynedd Valley | `/service-areas/gwynedd-valley/` |
| 5 | Cedars | `/service-areas/cedars/` |
| 6 | Collegeville | `/service-areas/collegeville/` |
| 7 | Lederach | `/service-areas/lederach/` |
| 8 | Creamery | `/service-areas/creamery/` |
| 9 | Harleysville | `/service-areas/harleysville/` |
| 10 | Schwenksville | `/service-areas/schwenksville/` |
| 11 | Phoenixville | `/service-areas/phoenixville/` |
| 12 | Limerick | `/service-areas/limerick/` |

**TIER 2: Main Line & Affluent Outliers (12 towns - 9 at launch)**

| # | Town | URL Slug |
| ---| ---| --- |
| 1 | Wayne | `/service-areas/wayne/` |
| 2 | Radnor | `/service-areas/radnor/` |
| 3 | Devon | `/service-areas/devon/` |
| 4 | Malvern | `/service-areas/malvern/` |
| 5 | Paoli | `/service-areas/paoli/` |
| 6 | West Chester | `/service-areas/west-chester/` |
| 7 | Gwynedd | `/service-areas/gwynedd/` |
| 8 | Lower Gwynedd | `/service-areas/lower-gwynedd/` |
| 9 | Lafayette Hill | `/service-areas/lafayette-hill/` |
| 10 | Plymouth Meeting | `/service-areas/plymouth-meeting/` |
| 11 | Ambler | `/service-areas/ambler/` |
| 12 | Fort Washington | `/service-areas/fort-washington/` |

**TIER 3: Growth Corridors (12 towns)**

| # | Town | URL Slug |
| ---| ---| --- |
| 1 | Royersford | `/service-areas/royersford/` |
| 2 | North Wales | `/service-areas/north-wales/` |
| 3 | Lansdale | `/service-areas/lansdale/` |
| 4 | Audubon | `/service-areas/audubon/` |
| 5 | Eagleville | `/service-areas/eagleville/` |
| 6 | Trooper | `/service-areas/trooper/` |
| 7 | Fairview Village | `/service-areas/fairview-village/` |
| 8 | Kulpsville | `/service-areas/kulpsville/` |
| 9 | Trappe | `/service-areas/trappe/` |
| 10 | Gilbertsville | `/service-areas/gilbertsville/` |
| 11 | Spring House | `/service-areas/spring-house/` |
| 12 | Hatboro | `/service-areas/hatboro/` |

**TIER 4: Lower Priority (20 towns)**

| # | Town | URL Slug |
| ---| ---| --- |
| 1 | King of Prussia | `/service-areas/king-of-prussia/` |
| 2 | Conshohocken | `/service-areas/conshohocken/` |
| 3 | Ardmore | `/service-areas/ardmore/` |
| 4 | Willow Grove | `/service-areas/willow-grove/` |
| 5 | East Norriton | `/service-areas/east-norriton/` |
| 6 | West Norriton | `/service-areas/west-norriton/` |
| 7 | West Point | `/service-areas/west-point/` |
| 8 | Green Lane | `/service-areas/green-lane/` |
| 9 | Perkiomenville | `/service-areas/perkiomenville/` |
| 10 | Telford | `/service-areas/telford/` |
| 11 | Souderton | `/service-areas/souderton/` |
| 12 | Hatfield | `/service-areas/hatfield/` |
| 13 | Sanatoga | `/service-areas/sanatoga/` |
| 14 | Pottstown | `/service-areas/pottstown/` |
| 15 | Spring City | `/service-areas/spring-city/` |
| 16 | Mont Clare | `/service-areas/mont-clare/` |
| 17 | Oaks | `/service-areas/oaks/` |
| 18 | Norristown | `/service-areas/norristown/` |
| 19 | Bryn Mawr | `/service-areas/bryn-mawr/` |
| 20 | Villanova | `/service-areas/villanova/` |

**Location Pages Total: 5 counties + 56 towns = 61 pages**
* * *

### 📁 SERVICE + LOCATION HYBRID PAGES (12 pages)

These target high-intent "\[Service\] in \[Location\]" searches for top-revenue combinations.

| # | Page | URL Slug |
| ---| ---| --- |
| 1 | Pool Builders Blue Bell | `/pools/blue-bell/` |
| 2 | Pool Builders Gwynedd Valley | `/pools/gwynedd-valley/` |
| 3 | Pool Builders Wayne | `/pools/wayne/` |
| 4 | Pool Builders Radnor | `/pools/radnor/` |
| 5 | Pool Builders West Chester | `/pools/west-chester/` |
| 6 | Landscaping Blue Bell | `/landscapes/blue-bell/` |
| 7 | Landscaping Collegeville | `/landscapes/collegeville/` |
| 8 | Landscaping Phoenixville | `/landscapes/phoenixville/` |
| 9 | Hardscaping Blue Bell | `/hardscapes/blue-bell/` |
| 10 | Hardscaping Wayne | `/hardscapes/wayne/` |
| 11 | Outdoor Living Blue Bell | `/hardscapes/backyard-oasis/blue-bell/` |
| 12 | Outdoor Living Gwynedd Valley | `/hardscapes/backyard-oasis/gwynedd-valley/` |

* * *

### 📁 BLOG / RESOURCE CONTENT (15 pages)

| # | Page | URL Slug | Pillar Tag |
| ---| ---| ---| --- |
| 1 | How Much Does an Inground Pool Cost in PA? | `/blog/inground-pool-cost-pa/` | Pools |
| 2 | How Long Does Pool Construction Take? | `/blog/pool-construction-timeline/` | Pools |
| 3 | How to Choose a Pool Builder | `/blog/how-to-choose-pool-builder/` | Pools |
| 4 | Pool Maintenance 101: A Homeowner's Guide | `/blog/pool-maintenance-guide/` | Pools, Outdoor Concierge |
| 5 | How to Prepare Your Yard for a Pool Installation | `/blog/prepare-yard-pool-installation/` | Pools, Landscapes |
| 6 | Best Plants for Southeastern PA Landscapes | `/blog/best-plants-southeastern-pa/` | Landscapes |
| 7 | Native Plants vs. Non-Native: Pros & Cons | `/blog/native-vs-non-native-plants/` | Landscapes |
| 8 | Landscape Lighting Ideas for Your Backyard | `/blog/landscape-lighting-ideas/` | Landscapes |
| 9 | What to Expect During a Landscape Design Consultation | `/blog/landscape-design-consultation/` | Landscapes |
| 10 | Hardscape vs. Softscape: What's the Difference? | `/blog/hardscape-vs-softscape/` | Hardscapes, Landscapes |
| 11 | Paver Patio Maintenance Tips | `/blog/paver-patio-maintenance/` | Hardscapes, Outdoor Concierge |
| 12 | When to Aerate Your Lawn in PA | `/blog/when-to-aerate-lawn-pa/` | Healthy Yard |
| 13 | Mosquito Control Tips for PA Homeowners | `/blog/mosquito-control-tips-pa/` | Healthy Yard |
| 14 | How to Winterize Your Irrigation System | `/blog/winterize-irrigation-system/` | Landscapes |
| 15 | The Benefits of Smart Irrigation Controllers | `/blog/smart-irrigation-benefits/` | Landscapes |

* * *

### 📁 TRUST & CONVERSION PAGES (3 pages)

_Note: Warranties moved to Service Hub. Financing moved to Core Pages._

| # | Page | URL Slug | Purpose |
| ---| ---| ---| --- |
| 1 | Our Design Technology (3D Renderings) | `/design-technology/` | Differentiator |
| 2 | Awards & Recognition | `/awards/` | Trust signal |
| 3 | Insurance & Licensing | `/licensing/` | Trust signal |

* * *

## COMPLETE SITEMAP SUMMARY

| Category | Page Count |
| ---| --- |
| Core Pages | 20 |
| Service Pillar Pages | 5 |
| Pools Cluster | 13 |
| Landscapes Cluster | 14 |
| Hardscapes Cluster | 13 |
| Healthy Yard Cluster | 9 |
| Outdoor Concierge Cluster | 6 |
| Location Pages (5 counties + 56 towns) | 61 |
| Service + Location Hybrid Pages | 12 |
| Blog / Resource Content | 15 |
| Trust & Conversion Pages | 3 |
| TOTAL | 171 pages |

> **v1 was 201 pages.** The reduction comes from consolidating 9 pillars into 5 (eliminating redundant pillar-level pages for Lighting, Irrigation, Maintenance, Pest Control, and Outdoor Living) and absorbing their cluster pages into the new structure. The Operation Tag system replaces what would have been dozens of additional filtered landing pages with dynamic CMS-driven views.
* * *

* * *

# PHASED IMPLEMENTATION PLAN
* * *

## PHASE 1: LAUNCH (80 Pages)

**Strategy:** Maximize service depth at launch per client direction. All 5 pillar pages and the highest-impact cluster pages ship immediately. Location pages are limited to counties + Tier 1 Golden Circle to stay within the 80-page cap while building comprehensive service topical authority from day one.
* * *

### Launch Pages Breakdown

#### Core Pages (18 pages)

| # | Page | Priority Rationale |
| ---| ---| --- |
| 1 | Homepage | Primary entry point + conversion hub |
| 2 | Portfolio — Photo Gallery | Visual proof of work quality |
| 3 | Portfolio — Completed Projects | Case studies drive high-intent conversions |
| 4 | Reviews & Testimonials | Social proof — #1 trust signal |
| 5 | Service Hub | Central resource navigation |
| 6 | Service Hub — Warranties | Reduces buyer anxiety |
| 7 | Service Hub — FAQs | AEO goldmine + reduces support load |
| 8 | Service Hub — Care Instructions | Post-sale value + retention |
| 9 | Blog Hub | Content marketing infrastructure |
| 10 | About Us | Trust signal |
| 11 | Our Story | Brand differentiation (Jeff's 40-year legacy) |
| 12 | Meet the Team | Trust signal with department tags |
| 13 | Why Choose Blue Tree? | Competitive positioning |
| 14 | Our Process | Reduces friction, sets expectations |
| 15 | Contact Us | Lead capture |
| 16 | Request an Estimate | Lead capture |
| 17 | Privacy Policy | Legal requirement |
| 18 | Terms of Service | Legal requirement |

* * *

#### Service Pillar Pages (5 pages)

| # | Page | Priority Rationale |
| ---| ---| --- |
| 19 | Pools | Highest revenue service line |
| 20 | Landscapes | Core service, highest volume |
| 21 | Hardscapes | High-ticket projects |
| 22 | Healthy Yard | Recurring revenue engine |
| 23 | Outdoor Concierge | Retention + recurring revenue |

* * *

#### High-Priority Service Cluster Pages (30 pages)

**Pools Cluster — 7 pages at launch:**

| # | Page | Priority Rationale |
| ---| ---| --- |
| 24 | Inground Pool Construction | Primary pool search term, highest revenue |
| 25 | Pool Design Process | Differentiator, decision-stage |
| 26 | Pool Renovation & Remodeling | Large existing pool owner market |
| 27 | Pool Water Features | Premium upsell |
| 28 | Pool Lighting | Upsell + "pool features" from client brief |
| 29 | Concrete Pool Installation | Specific construction method search |
| 30 | Spa & Hot Tub Integration | High-margin add-on |

**Landscapes Cluster — 7 pages at launch:**

| # | Page | Priority Rationale |
| ---| ---| --- |
| 31 | Landscape Design Process | Design-process deep dive (informational/consideration intent) |
| 32 | Garden Design & Planting | Core planting service from client brief |
| 33 | LED Landscape Lighting | Client specified — high-margin service |
| 34 | Pathway & Accent Lighting | Client specified — complements LED page |
| 35 | Drip Irrigation | Client specified — common landscape add-on |
| 36 | Sprinkler System Installation | High-volume irrigation search |
| 37 | Fencing | NEW — Client specified, common landscaping need |

**Hardscapes Cluster — 7 pages at launch:**

| # | Page | Priority Rationale |
| ---| ---| --- |
| 38 | Hardscape Design | NEW — Client specified pillar entry point |
| 39 | Paver Patio Design & Installation | Top hardscape search term |
| 40 | Outdoor Kitchens | High-ticket item |
| 41 | Fire Pits & Fireplaces | Popular feature, client specified |
| 42 | Walkways & Pathways | Common hardscape need, client specified |
| 43 | Retaining Walls | High volume, client specified |
| 44 | Backyard Oasis Design | NEW — Client specified, premium positioning |

**Healthy Yard Cluster — 5 pages at launch:**

| # | Page | Priority Rationale |
| ---| ---| --- |
| 45 | Lawn Fertilization Programs | Core turf care service |
| 46 | Aeration & Overseeding | Client specified, seasonal driver |
| 47 | Weed Control Services | Common pain point, client specified |
| 48 | Mosquito & Tick Control | Client specified, seasonal urgency |
| 49 | Drainage & Grading Solutions | Client specified, problem-solution search |

**Outdoor Concierge Cluster — 4 pages at launch:**

| # | Page | Priority Rationale |
| ---| ---| --- |
| 50 | Pool Service & Maintenance | Client specified, recurring revenue |
| 51 | Paver Restoration | NEW — Client specified, unique differentiator |
| 52 | Yard Clean-Up Services | Client specified, seasonal volume |
| 53 | Year-Round Maintenance Packages | Recurring revenue anchor |

* * *

#### County Pages (5 pages)

| # | Page | Priority Rationale |
| ---| ---| --- |
| 54 | Montgomery County | Primary service area — HQ county |
| 55 | Bucks County | Primary service area |
| 56 | Chester County | Primary service area |
| 57 | Delaware County | Secondary, high-value projects |
| 58 | Philadelphia County | Secondary, high-value projects |

* * *

#### Tier 1 Location Pages — Golden Circle (12 pages)

| # | Page | Priority Rationale |
| ---| ---| --- |
| 59 | Skippack | Home turf |
| 60 | Worcester | Home turf, high-end estates |
| 61 | Blue Bell | Premier target market |
| 62 | Gwynedd Valley | Extremely high net worth |
| 63 | Cedars | Immediate proximity |
| 64 | Collegeville | High volume, very close |
| 65 | Lederach | Immediate proximity |
| 66 | Creamery | Immediate proximity |
| 67 | Harleysville | High volume, very close |
| 68 | Schwenksville | Very close |
| 69 | Phoenixville | Booming market |
| 70 | Limerick | High growth |

* * *

#### Service + Location Hybrid Pages (5 pages)

| # | Page | Priority Rationale |
| ---| ---| --- |
| 71 | Pool Builders Blue Bell | Top search combo — highest intent |
| 72 | Pool Builders Gwynedd Valley | High-value target market |
| 73 | Pool Builders Wayne | Main Line pool market |
| 74 | Landscaping Blue Bell | Top search combo |
| 75 | Hardscaping Blue Bell | Top search combo |

* * *

#### Launch Blog Content (5 pages)

| # | Page | Priority Rationale |
| ---| ---| --- |
| 76 | How Much Does an Inground Pool Cost in PA? | Highest search volume, high intent |
| 77 | How to Choose a Pool Builder | Decision-stage content, AEO target |
| 78 | Best Plants for Southeastern PA Landscapes | Local relevance, AEO target |
| 79 | What to Expect During a Landscape Design Consultation | Reduces friction, builds trust |
| 80 | Hardscape vs. Softscape: What's the Difference? | Educational, AEO + GEO target |

* * *

### LAUNCH PHASE SUMMARY: 80 PAGES

| Category | Count |
| ---| --- |
| Core Pages | 18 |
| Service Pillars | 5 |
| Service Clusters (across all 5 pillars) | 30 |
| County Pages | 5 |
| Tier 1 Towns (Golden Circle) | 12 |
| Service + Location Hybrids | 5 |
| Blog Content | 5 |
| TOTAL | 80 |

* * *

* * *

## PHASE 2: POST-LAUNCH — 12-Month Rollout (91 pages)

**Goal:** Complete remaining service clusters, build out location pages by tier priority, add blog content for topical authority, and deploy service+location hybrid pages for high-revenue search terms.

**Cadence:** 10 pages/month (Month 12 gets 1 extra page to reach 171 total)

**Prioritization logic:**

*   **Months 1–3:** Complete remaining high-revenue service clusters (Pools, Hardscapes) + Tier 2 Main Line locations (affluent markets)
*   **Months 4–6:** Build out Landscapes and Healthy Yard depth + Tier 3 growth corridor locations
*   **Months 7–9:** Remaining service clusters + Tier 4 locations (lower priority markets)
*   **Months 10–12:** Trust pages, remaining locations, final blog content, and cleanup
* * *

### Month 1 — Post-Launch (Pages 81–90)

_Focus: Pool cluster completion + Tier 2 Main Line launch_

| # | Page | Category |
| ---| ---| --- |
| 81 | Wayne | Tier 2 Location |
| 82 | Radnor | Tier 2 Location |
| 83 | West Chester | Tier 2 Location |
| 84 | Grottos & Caves | Pools Cluster |
| 85 | Waterfalls & Cascades | Pools Cluster |
| 86 | Sheer Descent Water Features | Pools Cluster |
| 87 | Pool Slides | Pools Cluster |
| 88 | Pool Builders Radnor | Service + Location |
| 89 | Pool Builders West Chester | Service + Location |
| 90 | How Long Does Pool Construction Take? | Blog |

* * *

### Month 2 — Post-Launch (Pages 91–100)

_Focus: Pool cluster finish + Hardscapes expansion + Tier 2 continued_

| # | Page | Category |
| ---| ---| --- |
| 91 | Devon | Tier 2 Location |
| 92 | Malvern | Tier 2 Location |
| 93 | Paoli | Tier 2 Location |
| 94 | Pool Decking & Coping | Pools Cluster |
| 95 | Pool Equipment (Jandy) | Pools Cluster |
| 96 | Pergolas | Hardscapes Cluster |
| 97 | Driveways | Hardscapes Cluster |
| 98 | Landscaping Collegeville | Service + Location |
| 99 | Landscaping Phoenixville | Service + Location |
| 100 | Pool Maintenance 101: A Homeowner's Guide | Blog |

* * *

### Month 3 — Post-Launch (Pages 101–110)

_Focus: Hardscapes completion + Tier 2 finish + Outdoor Concierge depth_

| # | Page | Category |
| ---| ---| --- |
| 101 | Gwynedd | Tier 2 Location |
| 102 | Lower Gwynedd | Tier 2 Location |
| 103 | Lafayette Hill | Tier 2 Location |
| 104 | Plymouth Meeting | Tier 2 Location |
| 105 | Gazebos | Hardscapes Cluster |
| 106 | Stone & Masonry Work | Hardscapes Cluster |
| 107 | Seat Walls & Built-In Seating | Hardscapes Cluster |
| 108 | Pool Surrounds & Decks | Hardscapes Cluster |
| 109 | Hardscaping Wayne | Service + Location |
| 110 | Paver Patio Maintenance Tips | Blog |

* * *

### Month 4 — Post-Launch (Pages 111–120)

_Focus: Landscapes depth + Tier 2 remaining + Tier 3 start_

| # | Page | Category |
| ---| ---| --- |
| 111 | Ambler | Tier 2 Location |
| 112 | Fort Washington | Tier 2 Location |
| 113 | Royersford | Tier 3 Location |
| 114 | North Wales | Tier 3 Location |
| 115 | Native Plant Landscaping | Landscapes Cluster |
| 116 | Foundation Planting | Landscapes Cluster |
| 117 | Privacy Screening & Hedges | Landscapes Cluster |
| 118 | Smart Irrigation Controllers | Landscapes Cluster |
| 119 | Outdoor Living Blue Bell | Service + Location |
| 120 | Native Plants vs. Non-Native: Pros & Cons | Blog |

* * *

### Month 5 — Post-Launch (Pages 121–130)

_Focus: Landscapes finish + Healthy Yard depth + Tier 3 continued_

| # | Page | Category |
| ---| ---| --- |
| 121 | Lansdale | Tier 3 Location |
| 122 | Audubon | Tier 3 Location |
| 123 | Eagleville | Tier 3 Location |
| 124 | Trooper | Tier 3 Location |
| 125 | Shade Tree Installation | Landscapes Cluster |
| 126 | Seasonal Color & Annuals | Landscapes Cluster |
| 127 | Mulching Services | Landscapes Cluster |
| 128 | Turf Renovation & Restoration | Healthy Yard Cluster |
| 129 | Outdoor Living Gwynedd Valley | Service + Location |
| 130 | Landscape Lighting Ideas for Your Backyard | Blog |

* * *

### Month 6 — Post-Launch (Pages 131–140)

_Focus: Healthy Yard completion + Outdoor Concierge depth + Tier 3 finish_

| # | Page | Category |
| ---| ---| --- |
| 131 | Fairview Village | Tier 3 Location |
| 132 | Kulpsville | Tier 3 Location |
| 133 | Trappe | Tier 3 Location |
| 134 | Gilbertsville | Tier 3 Location |
| 135 | Sport Field Care | Healthy Yard Cluster |
| 136 | Organic Lawn Care | Healthy Yard Cluster |
| 137 | Soil Testing & Amendment | Healthy Yard Cluster |
| 138 | Bed Maintenance | Outdoor Concierge Cluster |
| 139 | Pruning Services | Outdoor Concierge Cluster |
| 140 | When to Aerate Your Lawn in PA | Blog |

* * *

### Month 7 — Post-Launch (Pages 141–150)

_Focus: Tier 3 finish + Tier 4 start + Blog cadence_

| # | Page | Category |
| ---| ---| --- |
| 141 | Spring House | Tier 3 Location |
| 142 | Hatboro | Tier 3 Location |
| 143 | King of Prussia | Tier 4 Location |
| 144 | Conshohocken | Tier 4 Location |
| 145 | Ardmore | Tier 4 Location |
| 146 | Bryn Mawr | Tier 4 Location |
| 147 | Villanova | Tier 4 Location |
| 148 | Mosquito Control Tips for PA Homeowners | Blog |
| 149 | How to Prepare Your Yard for a Pool Installation | Blog |
| 150 | Financing | Core Page |

* * *

### Month 8 — Post-Launch (Pages 151–160)

_Focus: Tier 4 locations + Trust pages + Blog_

| # | Page | Category |
| ---| ---| --- |
| 151 | Willow Grove | Tier 4 Location |
| 152 | East Norriton | Tier 4 Location |
| 153 | West Norriton | Tier 4 Location |
| 154 | West Point | Tier 4 Location |
| 155 | Green Lane | Tier 4 Location |
| 156 | Perkiomenville | Tier 4 Location |
| 157 | Our Design Technology (3D Renderings) | Trust Page |
| 158 | Awards & Recognition | Trust Page |
| 159 | How to Winterize Your Irrigation System | Blog |
| 160 | The Benefits of Smart Irrigation Controllers | Blog |

* * *

### Month 9 — Post-Launch (Pages 161–170)

_Focus: Remaining Tier 4 locations + Careers + Blog_

| # | Page | Category |
| ---| ---| --- |
| 161 | Telford | Tier 4 Location |
| 162 | Souderton | Tier 4 Location |
| 163 | Hatfield | Tier 4 Location |
| 164 | Sanatoga | Tier 4 Location |
| 165 | Pottstown | Tier 4 Location |
| 166 | Spring City | Tier 4 Location |
| 167 | Mont Clare | Tier 4 Location |
| 168 | Oaks | Tier 4 Location |
| 169 | Insurance & Licensing | Trust Page |
| 170 | Careers (expanded with operation-tagged listings) | Core Page |

* * *

### Month 10 — Post-Launch (Page 171)

_Focus: Final location page_

| # | Page | Category |
| ---| ---| --- |
| 171 | Norristown | Tier 4 Location |

> **Note:** Month 10 has only 1 remaining page in the current plan. The remaining capacity (9 pages) should be allocated to **new blog content** based on keyword performance data from the first 9 months post-launch. By this point, Google Search Console and analytics will reveal which service clusters and location pages are gaining traction — use those insights to create supporting blog content that strengthens the highest-performing topical clusters.
* * *

### Months 10–12: FLEX CONTENT ALLOCATION (29 remaining page slots)

After the 171 planned pages are deployed, Months 10–12 should be used for **performance-driven content** based on data collected since launch. Recommended allocation:

| Content Type | Estimated Pages | Rationale |
| ---| ---| --- |
| New blog posts targeting gaps found in Search Console | 12 | Fill keyword gaps revealed by 9 months of ranking data |
| Additional service + location hybrids for winning combos | 7 | Double down on service+location pairs showing search demand |
| Seasonal/timely content (e.g., winter pool care, spring lawn prep) | 5 | Capture seasonal search spikes |
| Customer story / case study pages | 3 | Deep-form social proof for high-ticket services |
| Community involvement page | 1 | Trust + local relevance signal |
| Updated FAQs / Instructions based on customer questions | 1 | Refresh Service Hub based on real customer inquiries |
| TOTAL FLEX | 29 |  |

**Grand Total at end of 12 months: up to 200 pages**
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

**1\. Five pillars instead of nine reduces navigation friction.** The original 9-pillar structure spread the topical authority too thin at the nav level. Five pillars create cleaner user journeys and concentrate link equity into stronger hub pages. Lighting, irrigation, and maintenance services still have dedicated cluster pages — they just ladder up to a parent pillar instead of standing alone.

**2\. The "Outdoor Concierge" pillar is a positioning masterstroke from the client.** By branding maintenance services as "concierge," Blue Tree elevates what competitors treat as commoditized work into a premium service tier. This supports higher pricing and positions the company for recurring revenue relationships rather than one-off transactions.

**3\. Operation Tags solve the "one page, many services" discovery problem.** Instead of building separate portfolio pages for each service line (which would create thin content), the tag system lets a single rich portfolio page serve every audience. A homeowner interested in pools sees pool projects; someone interested in hardscapes sees patio work — same page, filtered view. This is a CMS architecture decision, not a page-count decision.

**4\. Service depth at launch beats geographic breadth.** Jérôme correctly identified that getting comprehensive service coverage live at launch matters more than having 56 location pages on day one. A potential customer searching "outdoor kitchens southeastern PA" needs to land on a rich, authoritative page — not a thin location page. The Tier 1 Golden Circle locations (12 pages) plus all 5 county pages provide enough geographic signal at launch, and Tier 2–4 locations roll out over the following months.

**5\. The Service Hub centralizes trust content.** Moving warranties, FAQs, and care instructions into a dedicated hub — filterable by operation tag — creates a single destination for post-sale customers AND pre-sale researchers. This is better for AEO (AI engines can pull structured FAQ answers) and better for UX (one place for all support content instead of scattered pages).

### Launch Priorities (Ranked)

1. **All 5 pillar pages must be exceptional.** These are the topical authority hubs that every cluster page links to. They need comprehensive content, proper schema markup, and strong internal linking from day one.
2. **Pool cluster gets the most cluster pages at launch (7)** because pools represent the highest revenue per project. Complete the remaining 6 pool cluster pages in Months 1–3.
3. **Every launch page must have FAQ schema** embedded — this is non-negotiable for AEO. Each service cluster page should include 3–5 FAQs specific to that service.
4. **Portfolio and Reviews pages must be populated before launch.** Even with the tag-filtering system, these pages need real content to function as trust signals.
5. **Blog content at launch is minimal (5 pages) but high-impact.** These 5 posts target the highest search volume, highest intent informational queries in the pool and landscaping verticals.

### AEO / GEO Schema Requirements

| Schema Type | Applied To |
| ---| --- |
| LocalBusiness | Homepage, About, Contact, all location pages |
| Service | All service pillar and cluster pages |
| FAQPage | Service Hub FAQs + all service pages with embedded FAQs |
| HowTo | Blog guides, Care Instructions |
| Review / AggregateRating | Reviews page |
| Organization | About Us, Our Story |
| Person | Meet the Team individual profiles |
| BreadcrumbList | All pages (site-wide) |
| ImageGallery | Portfolio pages |

### Internal Linking Architecture

```scss
Homepage
├── Pools (pillar) → Inground, Design, Renovation, Features, Lighting, Concrete, Grottos, etc.
├── Landscapes (pillar) → Design, Planting, Native Plants, Lighting, Irrigation, Fencing, etc.
├── Hardscapes (pillar) → Design, Patios, Kitchens, Fire Pits, Walkways, Walls, Oasis, etc.
├── Healthy Yard (pillar) → Fertilization, Aeration, Weed Control, Pest Control, Drainage, etc.
├── Outdoor Concierge (pillar) → Pool Service, Paver Restoration, Clean-ups, Maintenance, etc.
├── Service Areas → Counties → Towns
├── Portfolio (filtered by operation tag)
├── Reviews (filtered by operation tag)
├── Blog → Individual posts (tagged to pillars)
└── Service Hub → Warranties, FAQs, Instructions (filtered by operation tag)
```

**Cross-linking rules:**

*   Every cluster page links UP to its pillar page
*   Every cluster page links LATERALLY to 2–3 sibling cluster pages
*   Every cluster page links DOWN to relevant blog posts
*   Every cluster page links to the nearest relevant location page
*   Every location page links to all 5 pillar pages
*   Every blog post links to the most relevant cluster page AND pillar page
*   Portfolio and Reviews embed contextual links to the service pages they relate to
* * *

## PAGES REMOVED FROM v1 (Accounted For)

The following pages from v1 have been **absorbed into the new structure** (not deleted — their content lives within the 5-pillar architecture):

| v1 Page | Where It Went in v2 |
| ---| --- |
| Landscape Lighting (pillar) | Content absorbed into Landscapes pillar page |
| Irrigation Systems (pillar) | Content absorbed into Landscapes pillar page |
| Maintenance Services (pillar) | Content absorbed into Outdoor Concierge pillar page |
| Mosquito & Tick Control (pillar) | Content absorbed into Healthy Yard pillar page |
| Outdoor Living Spaces (pillar) | Content absorbed into Hardscapes pillar page + Backyard Oasis cluster |
| Tree & Accent Lighting (cluster) | Merged into LED Landscape Lighting cluster page |
| Deck & Patio Lighting (cluster) | Merged into Pathway & Accent Lighting cluster page |
| Security & Safety Lighting (cluster) | Merged into LED Landscape Lighting cluster page |
| Smart Lighting Controls (cluster) | Merged into LED Landscape Lighting cluster page |
| Lighting Maintenance (cluster) | Merged into Outdoor Concierge maintenance content |
| Irrigation System Repair (cluster) | Merged into Sprinkler System Installation cluster page |
| Winterization Services (cluster) | Merged into blog content (How to Winterize) |
| Spring Start-Up Services (cluster) | Merged into Sprinkler System Installation cluster page |
| Water Audits & Efficiency (cluster) | Merged into Smart Irrigation Controllers cluster page |
| Rain Sensor Integration (cluster) | Merged into Smart Irrigation Controllers cluster page |
| Landscape Maintenance (cluster) | Merged into Year-Round Maintenance Packages |
| Hardscape Maintenance (cluster) | Merged into Paver Restoration |
| Seasonal Maintenance Calendar (cluster) | Merged into Year-Round Maintenance Packages |
| Seasonal Pest Management (cluster) | Merged into Mosquito & Tick Control |
| Spring Cleanup Services (cluster) | Merged into Yard Clean-Up Services |
| Fall Cleanup & Leaf Removal (cluster) | Merged into Yard Clean-Up Services |
| Storm Water Management (cluster) | Merged into Drainage & Grading Solutions |
| Erosion Control (cluster) | Merged into Drainage & Grading Solutions |
| Commercial Landscaping (cluster) | Deferred — revisit in Year 2 strategy |
| HOA Landscape Management (cluster) | Deferred — revisit in Year 2 strategy |
| Office Park Landscaping (cluster) | Deferred — revisit in Year 2 strategy |
| Commercial Property Maintenance (cluster) | Deferred — revisit in Year 2 strategy |
| Backyard Resort Design (cluster) | Replaced by Backyard Oasis Design |
| Outdoor Entertainment Spaces (cluster) | Merged into Backyard Oasis Design |
| Outdoor Dining Areas (cluster) | Merged into Outdoor Kitchens |
| Poolside Living Spaces (cluster) | Merged into Backyard Oasis Design |
| Four-Season Outdoor Rooms (cluster) | Merged into Backyard Oasis Design |
| Outdoor Structures (cluster) | Merged into Pergolas + Gazebos |
| Grub & Pest Control (cluster) | Merged into Mosquito & Tick Control |
| Drought-Resistant Lawn Solutions (cluster) | Merged into Organic Lawn Care |
| Weekly Lawn Mowing (cluster) | Merged into Year-Round Maintenance Packages |
| Mulching Services (cluster) | Kept — launches Month 5 |
| Community Involvement | Deferred to flex content in Months 10–12 |
| Client Portal | Removed — external tool, not a content page |

* * *

## NEXT STEPS

1. **Client review of v2 sitemap** — Jérôme and team to confirm the 5-pillar structure and cluster page assignments align with their service delivery model
2. **CMS operation tag configuration** — Developer to implement the tag taxonomy before content entry begins
3. **Content briefs for launch pages** — Begin with the 5 pillar pages and 30 cluster pages (35 briefs total for service content)
4. **Portfolio and Reviews population** — Collect and organize existing project photos and client testimonials by operation tag
5. **Schema markup implementation plan** — Technical SEO to prepare structured data templates for each page type
6. **Blog editorial calendar** — Finalize the 5 launch blog topics and outline the 10 additional posts for Months 1–9
* * *

_Document version: 2.0_
_Last updated: February 17, 2026_
_Author:_ [_ROI.LIVE_](http://ROI.LIVE)
_Previous version: v1 (201 pages, 9 pillars)_
_This version: v2 (171 planned + 29 flex = 200 pages, 5 pillars)_
