---
clickup_doc_id: 8cma26h-16153
clickup_page_id: 8cma26h-7673
clickup_url: https://app.clickup.com/9013889233/docs/8cma26h-16153/8cma26h-7673
original_filename: BluTree_Navigation_MegaMenu_CreativeBrief_v1-1.docx
normalized_title: navigation megamenu creativebrief
classification: REFERENCE_DOC
version: v1-1
status_in_archive: superseded
date_updated: 2026-04-16
hierarchy_category: (workspace-level)
hierarchy_subcategory: (none)
md5: bb5d39de3e2d4a38e88e055ebda2dd7f
archived_to_repo: 2026-05-12
---

**CREATIVE BRIEF**
Navigation & Mega Menu System
Desktop + Mobile Specifications
**Blue Tree Outdoor Living**
Pools · Landscapes · Hardscapes
Prepared by [ROI.LIVE](http://ROI.LIVE) — April 14, 2026 — v1.1
_Companion document to: Three-Phase Launch & Content Rollout Plan v1.1_
_Design reference: Google Store (_[_store.google.com_](http://store.google.com)_) mega menu pattern_
# **Table of Contents**
1\. Design Mandate & Reference
2\. Navigation State by Phase
3\. Desktop Navigation — Layout & Behavior
4\. Desktop Mega Menu Panels — Per-Pillar Detail
5\. Desktop Dropdowns — Portfolio, About, Service Areas
6\. Mobile Navigation — Full Specification
7\. Interaction, Animation & Performance
8\. Accessibility & Technical Requirements
# **1\. Design Mandate & Reference**
Jérôme has requested a mega menu system modeled after the Google Store navigation ([store.google.com](http://store.google.com)). The Google Store uses individual product categories as top-level nav items. Hovering a category opens a full-width mega menu panel organized into three columns: primary products, explore-more links, and editorial/discovery content.
This pattern maps to Blue Tree’s five service pillars. Each pillar occupies a top-level nav position. Hovering (desktop) or tapping (mobile) opens a mega menu panel showing cluster pages, cross-links to filtered content, and a featured project or blog post.
The nav system must evolve across three launch phases. Phase timing and page lists are defined in the companion document (Three-Phase Launch & Content Rollout Plan v1.0). This document specifies the nav component at each phase.
**DEV NOTE:** Build the nav component to support the mega menu pattern from Day 1. Phase 0 launches with direct links, but the markup should anticipate the Phase 1 upgrade. Switching from direct links to mega menu panels should be a configuration change, not a rebuild.
# **2\. Navigation State by Phase**
## **2.1 Phase 0: Quick Launch (21 pages)**
Standard horizontal nav bar. No mega menu panels. The 5 pillar names function as direct links because no cluster pages exist yet. Portfolio and About use compact dropdowns.
### **Desktop Nav Bar**

| **Position** | **Label** | **Destination** | **Behavior** |
| ---| ---| ---| --- |
| Left | Blue Tree logo + wordmark | Link → / | — |
| Nav 1 | Pools | Direct link → /pools/ | No dropdown |
| Nav 2 | Landscapes | Direct link → /landscapes/ | No dropdown |
| Nav 3 | Hardscapes | Direct link → /hardscapes/ | No dropdown |
| Nav 4 | Healthy Yards | Direct link → /healthy-yards/ | No dropdown |
| Nav 5 | Premier Outdoor Services | Direct link → /premier-outdoor-services/ | No dropdown |
| Nav 6 | Portfolio | Dropdown: Photo Gallery, Completed Projects | 2-item dropdown |
| Nav 7 | About | Dropdown: Our Story, Team, Why Choose Us, Our Process, Careers | 5-item dropdown |
| Right | Request a Free Estimate | Button → /request-estimate/ | CTA button |

### **Utility Bar**
Slim bar above primary nav. Links: Service Areas → /service-areas/, Blog → /blog/, Financing → /financing/. CTA button: Request a Free Estimate → /request-estimate/. No Service Hub link (page does not exist until Phase 1).
### **Mobile Menu**
Pillar items are direct links (no accordion). Portfolio and About use accordions for their children. Fixed bottom CTA bar on all pages.
## **2.2 Phase 1: Foundation Build (80+ pages)**
When Phase 1 Sprint 1 completes (28 cluster pages live), the nav upgrades from standard links to mega menu panels. This is the most visible change in the entire launch sequence.
### **What Changes**
**Pillar links → mega menu triggers:** Hovering a pillar name opens a full-width three-column panel.
**Utility bar adds Service Hub:** After Sprint 2. Links to /service-hub/ or opens a mini-dropdown (Warranties, FAQs, Care Instructions).
**Service Areas dropdown populates:** After Sprint 2 (counties) and Sprint 3 (towns).
**Mobile pillar items gain accordions:** Each pillar tap expands to show cluster pages.
**DEV NOTE:** Deploy the mega menu upgrade as a single coordinated change once all 28 cluster pages are live. Do not launch mega menu panels with partial content.
## **2.3 Phase 2: Monthly Rollout**
Menu items added incrementally as pages publish. Each new cluster page gets a CMS toggle that controls its visibility in the mega menu panel. Developer flips the toggle on publication day.
### **Phase 2 Menu Additions Summary**

| **Months** | **Menu Additions** | **Other Pages (no nav impact)** |
| ---| ---| --- |
| M1–3 | Pools panel: +6 items (Grottos, Waterfalls, Sheer Descents, Slides, Decking, Surrounds). Hardscapes panel: +5 items (Pergolas, Driveways, Gazebos, Stone & Masonry, Seat Walls). Premier panel: +1 (Paver Restoration). | Tier 2 remaining (3 towns), Tier 3 start (9 towns), 3 blog posts. |
| M4–6 | Landscapes panel: +5 items (Foundation Planting, Privacy Screening, Shade Trees, Seasonal Color, Mulching). Healthy Yards panel: +5 items (Drainage, Sport Field, Turf Renovation, Organic, Soil Testing). Premier panel: +3 (Yard Clean-Up, Bed Maintenance, Pruning). | Tier 3 remaining (6 towns), Tier 4 start (5 towns), 3 blog posts. |
| M7–9 | About dropdown: +3 items (Design Technology, Awards, Insurance & Licensing). No new mega menu panel items — all clusters complete by Month 6. | Tier 4 remaining (14 towns), trust pages, flex blogs. |
| M10–12 | No structural nav changes. Flex content (blogs, case studies, hybrids) does not add nav items. | ~30 flex pages driven by GSC performance data. |

# **3\. Desktop Navigation — Layout & Behavior**
## **3.1 Two-Bar Layout**
**Bar 1 — Utility Bar:** ~36px height. Dark background (#1B4332 or brand dark green). Logo left-aligned. Secondary links center-right: Service Areas, Blog, Financing, Service Hub (Phase 1+). CTA button right: “Request a Free Estimate” in contrasting button style. Font: 13px.
**Bar 2 — Primary Nav Bar:** ~56px height. White or off-white background. 5 pillar links + Portfolio + About. Each pillar triggers a mega menu panel on hover (Phase 1+) or navigates directly (Phase 0). Font: 15px, weight 500. Active state: 2px accent-green underline bar beneath the active pillar label.
## **3.2 Sticky Behavior**
Both bars are sticky (fixed to top on scroll). On scroll beyond the hero section, the utility bar collapses and only the primary nav bar remains sticky. The CTA button from the utility bar migrates into the right side of the primary nav bar when collapsed. This ensures the conversion action remains visible at all scroll positions.
**Animation:** 200ms ease transition. No layout shift. Test at all viewport widths 1024px–1920px+.
## **3.3 Mega Menu Panel Pattern (Phase 1+)**
When a user hovers over a pillar name, a full-width mega menu panel drops down. The panel extends edge-to-edge with content constrained to the site’s max-width container (1280px).
### **Three-Column Layout**
**Column 1 — Services:** Lists all cluster pages under that pillar. Each item is a text link with a 6–10 word descriptor beneath it in smaller, lighter font. If 5+ clusters, display in a two-sub-column grid within Column 1.
**Column 2 — Explore More:** 3–5 cross-links to content outside the service cluster. Items: View \[Pillar\] Portfolio, \[Pillar\] Reviews, \[Pillar\] FAQs, nearest Service + Location hybrid page. Text-only links, simpler list format.
**Column 3 — Discover:** Editorial card. Featured project photo (from portfolio, filtered by pillar’s operation tag) with headline and caption. Below: featured blog post link. Content is CMS-editable for rotation.
### **Panel Footer**
Full-width strip at bottom of each panel: “Explore All \[Pillar Name\] Services →” linking to the pillar page itself. Matches Google Store’s “Browse all phones” pattern.
### **Overlay & Dismissal**
Semi-transparent dark overlay (rgba(0,0,0,0.3)) covers page content behind the panel. Dismissal triggers: click overlay, move cursor outside panel, press Escape, hover a different pillar. Panel animates in with slide-down + fade (150ms ease).
**DEV NOTE:** Phone number (610) 222-0590 appears in the footer and at the bottom of the request estimate form — NOT in the nav bar or utility bar. Form-first approach per client directive.
# **4\. Desktop Mega Menu Panels — Per-Pillar Detail**
Each table shows every item that appears in that pillar’s mega menu panel. Items marked “Phase 1” are available when the mega menu first activates. Items with month numbers are added during Phase 2.
## **4.1 Pools**
### **Column 1 — Services**

| **Link Label** | **URL** | **Descriptor** | **Available** |
| ---| ---| ---| --- |
| Inground Pool Construction | /pools/inground-pools/ | Custom concrete pool design & build | Phase 1 |
| Pool Design Process | /pools/pool-design/ | From concept to 3D rendering | Phase 1 |
| Pool Renovation & Remodeling | /pools/pool-renovation/ | Transform your existing pool | Phase 1 |
| Pool Water Features | /pools/water-features/ | Fountains, jets, and bubblers | Phase 1 |
| Pool Lighting | /pools/pool-lighting/ | LED underwater and perimeter lighting | Phase 1 |
| Concrete Pool Installation | /pools/concrete-pools/ | Gunite and shotcrete construction | Phase 1 |
| Spa & Hot Tub Integration | /pools/spa-hot-tub/ | Built-in spa and spillover designs | Phase 1 |
| Pool Equipment (Jandy) | /pools/pool-equipment/ | Pumps, heaters, and automation | Phase 1 |
| Grottos & Caves | /pools/grottos/ | Natural rock grotto features | Month 1 |
| Waterfalls & Cascades | /pools/waterfalls/ | Rock waterfall features | Month 1 |
| Sheer Descent Features | /pools/sheer-descents/ | Sleek sheet waterfall effects | Month 1 |
| Pool Slides | /pools/pool-slides/ | Custom slides for every pool | Month 1 |
| Pool Decking & Coping | /pools/pool-decking/ | Surround materials and finishes | Month 2 |
| Pool Surrounds & Decks | /pools/pool-surrounds/ | Complete poolside hardscaping | Month 2 |

### **Column 2 — Explore More**
**Pool Builders Blue Bell** → /pools/blue-bell/
**Pool Builders Gwynedd Valley** → /pools/gwynedd-valley/
**Pool Builders Wayne** → /pools/wayne/
**Pool Portfolio** → /portfolio/ (filtered by Pools tag)
**Pool Reviews** → /reviews/ (filtered by Pools tag)
**Pool FAQs** → /service-hub/faqs/ (filtered by Pools tag)
### **Column 3 — Discover**
**Featured Project:** CMS-editable pool project card with hero image, title, town. Featured Blog: “How Much Does an Inground Pool Cost in PA?” → /blog/inground-pool-cost-pa/.
### **Panel Footer**
**Explore All Pool Services →** /pools/
## **4.2 Landscapes**
### **Column 1 — Services**

| **Link Label** | **URL** | **Descriptor** | **Available** |
| ---| ---| ---| --- |
| Landscape Design Process | /landscapes/design/ | Your vision, our plan | Phase 1 |
| Garden Design & Planting | /landscapes/garden-design/ | Beds, borders, and seasonal color | Phase 1 |
| Native Plant Landscaping | /landscapes/native-plants/ | PA-native low-maintenance species | Phase 1 |
| Fencing | /landscapes/fencing/ | Privacy, safety, and curb appeal | Phase 1 |
| LED Landscape Lighting | /landscapes/led-lighting/ | Architectural illumination | Phase 1 |
| Pathway & Accent Lighting | /landscapes/pathway-accent-lighting/ | Walkway and feature lighting | Phase 1 |
| Drip Irrigation | /landscapes/drip-irrigation/ | Efficient plant-level watering | Phase 1 |
| Foundation Planting | /landscapes/foundation-planting/ | Soften your home’s foundation line | Month 4 |
| Privacy Screening & Hedges | /landscapes/privacy-screening/ | Natural screening solutions | Month 4 |
| Shade Tree Installation | /landscapes/shade-trees/ | Mature tree placement | Month 5 |
| Seasonal Color & Annuals | /landscapes/seasonal-color/ | Rotating annual displays | Month 5 |
| Mulching Services | /landscapes/mulching/ | Weed suppression and moisture | Month 5 |

### **Column 2 — Explore More**
**Landscaping Blue Bell** → /landscapes/blue-bell/
**Landscape Portfolio** → /portfolio/ (filtered by Landscapes tag)
**Landscape Reviews** → /reviews/ (filtered by Landscapes tag)
**Landscape FAQs** → /service-hub/faqs/ (filtered by Landscapes tag)
**Care Instructions** → /service-hub/instructions/ (filtered by Landscapes tag)
### **Column 3 — Discover**
**Featured Project:** CMS-editable landscape project card. Featured Blog: “Best Plants for Southeastern PA Landscapes” → /blog/best-plants-southeastern-pa/.
### **Panel Footer**
**Explore All Landscape Services →** /landscapes/
## **4.3 Hardscapes**
### **Column 1 — Services**

| **Link Label** | **URL** | **Descriptor** | **Available** |
| ---| ---| ---| --- |
| Hardscape Design | /hardscapes/design/ | Custom structural outdoor plans | Phase 1 |
| Paver Patio Design | /hardscapes/paver-patios/ | Stone and paver patios | Phase 1 |
| Outdoor Kitchens | /hardscapes/outdoor-kitchens/ | Cooking and entertaining spaces | Phase 1 |
| Fire Pits & Fireplaces | /hardscapes/fire-pits/ | Wood-burning and gas features | Phase 1 |
| Walkways & Pathways | /hardscapes/walkways/ | Stone and paver walkways | Phase 1 |
| Retaining Walls | /hardscapes/retaining-walls/ | Structural and decorative walls | Phase 1 |
| Backyard Oasis Design | /hardscapes/backyard-oasis/ | Complete outdoor living spaces | Phase 1 |
| Pergolas | /hardscapes/pergolas/ | Shade structures and arbors | Month 2 |
| Driveways | /hardscapes/driveways/ | Paver and stone driveways | Month 2 |
| Gazebos | /hardscapes/gazebos/ | Freestanding covered structures | Month 3 |
| Stone & Masonry Work | /hardscapes/stone-masonry/ | Natural stone construction | Month 3 |
| Seat Walls & Built-In Seating | /hardscapes/seat-walls/ | Integrated seating elements | Month 3 |

### **Column 2 — Explore More**
**Hardscaping Blue Bell** → /hardscapes/blue-bell/
**Hardscape Portfolio** → /portfolio/ (filtered by Hardscapes tag)
**Hardscape Reviews** → /reviews/ (filtered by Hardscapes tag)
**Hardscape FAQs** → /service-hub/faqs/ (filtered by Hardscapes tag)
**Warranties** → /service-hub/warranties/ (filtered by Hardscapes tag)
### **Column 3 — Discover**
**Featured Project:** CMS-editable hardscape project card. Featured Blog: “Hardscape vs. Softscape” → /blog/hardscape-vs-softscape/.
### **Panel Footer**
**Explore All Hardscape Services →** /hardscapes/
## **4.4 Healthy Yards**
### **Column 1 — Services**

| **Link Label** | **URL** | **Descriptor** | **Available** |
| ---| ---| ---| --- |
| Lawn Fertilization Programs | /healthy-yards/fertilization/ | Multi-step feeding programs | Phase 1 |
| Aeration & Overseeding | /healthy-yards/aeration-overseeding/ | Core aeration and seed renovation | Phase 1 |
| Weed Control Services | /healthy-yards/weed-control/ | Pre- and post-emergent treatments | Phase 1 |
| Mosquito & Tick Control | /healthy-yards/mosquito-tick-control/ | Barrier spray programs | Phase 1 |
| Drainage & Grading | /healthy-yards/drainage/ | French drains and grading | Month 4 |
| Turf Renovation | /healthy-yards/turf-renovation/ | Full lawn rebuild and repair | Month 5 |
| Sport Field Care | /healthy-yards/sport-field-care/ | Athletic turf programs | Month 5 |
| Organic Lawn Care | /healthy-yards/organic-lawn-care/ | Chemical-free turf programs | Month 6 |
| Soil Testing & Amendment | /healthy-yards/soil-testing/ | pH and nutrient analysis | Month 6 |

### **Column 2 — Explore More**
**Healthy Yards Portfolio** → /portfolio/ (filtered by Healthy Yards tag)
**Healthy Yards Reviews** → /reviews/ (filtered by Healthy Yards tag)
**Healthy Yards FAQs** → /service-hub/faqs/ (filtered by Healthy Yards tag)
**Care Instructions** → /service-hub/instructions/ (filtered by Healthy Yards tag)
### **Column 3 — Discover**
**Featured:** Mark Peasley author card (“Meet Our Turfcare Manager” → /about/team/mark-peasley/). Featured Blog: cross-pillar stand-in until Month 6 blog publishes.
### **Panel Footer**
**Explore All Healthy Yards Programs →** /healthy-yards/
## **4.5 Premier Outdoor Services**
### **Column 1 — Services**

| **Link Label** | **URL** | **Descriptor** | **Available** |
| ---| ---| ---| --- |
| Pool Service & Maintenance | /premier-outdoor-services/pool-service/ | Ongoing pool care and servicing | Phase 1 |
| Year-Round Maintenance | /premier-outdoor-services/maintenance-packages/ | Seasonal property care plans | Phase 1 |
| Paver Restoration | /premier-outdoor-services/paver-restoration/ | Clean, re-sand, and seal pavers | Month 3 |
| Yard Clean-Up Services | /premier-outdoor-services/yard-cleanup/ | Spring and fall clean-ups | Month 5 |
| Bed Maintenance | /premier-outdoor-services/bed-maintenance/ | Weeding, mulching, and edging | Month 6 |
| Pruning Services | /premier-outdoor-services/pruning/ | Shrub and tree shaping | Month 6 |

### **Column 2 — Explore More**
**Premier Portfolio** → /portfolio/ (filtered by Premier tag)
**Premier Reviews** → /reviews/ (filtered by Premier tag)
**Warranties** → /service-hub/warranties/ (filtered by Premier tag)
### **Column 3 — Discover**
**Featured:** “The Blue Tree Difference” card → /about/why-choose-us/. Testimonial snippet from long-term maintenance client (CMS-editable).
### **Panel Footer**
**Explore All Premier Services →** /premier-outdoor-services/
# **5\. Desktop Dropdowns — Portfolio, About, Service Areas**
These items use compact dropdowns, not full mega menu panels.
## **5.1 Portfolio Dropdown**
Two links with small icons. Available from Phase 0 launch.
**Photo Gallery** (camera icon) → /portfolio/
**Completed Projects** (checkmark icon) → /portfolio/completed-projects/
## **5.2 About Dropdown**
**Phase 0 (5 items):** Our Story → /about/our-story/, Meet the Team → /about/team/, Why Choose Blue Tree? → /about/why-choose-us/, Our Process → /about/our-process/, Careers → /careers/.
**Added Month 7:** Our Design Technology (3D Renderings) → /design-technology/, Awards & Recognition → /awards/.
**Added Month 8:** Insurance & Licensing → /licensing/.
## **5.3 Service Areas (Phase 1+)**
Not present in Phase 0 nav bar (exists only in utility bar as a simple link). In Phase 1+, the utility bar link becomes a dropdown showing 5 county links. Tapping a county navigates to the county page; town pages are discoverable from there.
**Counties:** Montgomery County, Bucks County, Chester County, Delaware County, Philadelphia County.
**DEV NOTE:** Service Areas does not warrant a mega menu panel. The geographic hierarchy is county → town, and the county pages handle town discovery. Avoid three-level nesting in the nav.
## **5.4 Service Hub (Phase 1+)**
Added to the utility bar after Phase 1 Sprint 2. Links to /service-hub/ or opens a mini-dropdown with three links:
**Warranties** → /service-hub/warranties/
**FAQs** → /service-hub/faqs/
**Care Instructions** → /service-hub/instructions/
# **6\. Mobile Navigation — Full Specification**
## **6.1 Mobile Header Bar**
Fixed to top. 56px height. Blue Tree logo (compact icon) left. Hamburger icon right (three lines, animates to X on open). Center: empty or page title on interior pages.
## **6.2 Fixed Bottom CTA Bar**
Persistent 56px bar on all pages except /request-estimate/ and /contact/. Brand green background. Full-width button: “Request a Free Estimate” → /request-estimate/. Sits above iOS safe area and Android nav bar.
**DEV NOTE:** On /request-estimate/, replace with “Scroll to Form” button or suppress entirely.
## **6.3 Slide-Out Menu**
Full-screen overlay from right side. 250ms ease-out. White background. Scrollable. Only one accordion open at a time.
### **Phase 0 Mobile Menu**
Pillar items are direct links (no accordion). Portfolio and About use accordions. Service Hub does not appear.
### **Phase 1+ Mobile Menu**
Pillar items become accordions revealing cluster pages. Single-column list, page names only (no descriptors). 1px dividers between items. Green footer link at bottom of each accordion.

| **Item** | **Behavior** | **Icon** |
| ---| ---| --- |
| Pools | Accordion: 8 cluster pages + “All Pool Services” | Chevron |
| Landscapes | Accordion: 7 cluster pages + “All Landscape Services” | Chevron |
| Hardscapes | Accordion: 7 cluster pages + “All Hardscape Services” | Chevron |
| Healthy Yards | Accordion: 4 cluster pages + “All Healthy Yards Programs” | Chevron |
| Premier Outdoor Services | Accordion: 2 cluster pages + “All Premier Services” | Chevron |
| Portfolio | Accordion: Photo Gallery, Completed Projects | Chevron |
| About | Accordion: Our Story, Team, Why Choose Us, Our Process, Careers | Chevron |
| Service Areas | Accordion: 5 county links | Chevron |
| Blog | Direct link → /blog/ | Arrow |
| Financing | Direct link → /financing/ | Arrow |
| Service Hub | Accordion: Warranties, FAQs, Care Instructions (Phase 1+) | Chevron |
| Contact Us | Direct link → /contact/ | Arrow |

## **6.4 Mobile Menu Footer**
**Phone:** (610) 222-0590 (tap-to-call)
**Email:** [info@bluetreelandscaping.com](mailto:info@bluetreelandscaping.com)
**Address:** 4494 Skippack Pike, PO Box 1112, Skippack, PA 19474
**Social:** Facebook, Instagram, Houzz (icon links)
# **7\. Interaction, Animation & Performance**
## **7.1 Desktop Mega Menu Timing**
**Hover intent delay:** 150ms. Prevents accidental triggers when dragging across the nav bar.
**Open animation:** Slide down from 0 height + opacity 0 to full height + opacity 1. Duration: 200ms. Easing: ease-out.
**Close animation:** Reverse of open. 150ms. Triggered by cursor leaving panel area, clicking overlay, pressing Escape, or hovering another pillar.
**Panel-to-panel transition:** Current panel fades out (100ms), new panel fades in (100ms). No close-then-reopen gap. Seamless cross-fade.
## **7.2 Mobile Timing**
**Accordion expand:** 200ms ease. Max-height animation or CSS grid row transition.
**Accordion collapse:** 150ms ease. Auto-collapse when a sibling accordion opens.
**Menu open:** Slide from right, 250ms ease-out.
**Menu close:** Slide right, 200ms ease-in. Triggers: tap X, tap overlay, swipe right, Android Back button.
## **7.3 Performance Budget**
Navigation must not block page rendering. Mega menu panel content should render on first hover/tap, then cache for subsequent interactions. Do not place all 5 panels’ HTML in the initial DOM if it causes layout thrash.
**Nav CSS:** Under 15KB.
**Nav JS:** Under 10KB.
**Discover column images:** Lazy-loaded, WebP with JPEG fallback, 400px max width.
# **8\. Accessibility & Technical Requirements**
## **8.1 Keyboard Navigation**
Tab moves between top-level nav items. Enter or Space opens/closes mega menu panels. Arrow keys navigate within an open panel. Escape closes panels. Focus visually indicated with 2px outline (brand green, offset 2px).
## **8.2 ARIA Attributes**
**Nav bar:** role="menubar". Each item: role="menuitem", aria-haspopup="true", aria-expanded toggled on open/close.
**Mega menu panels:** role="menu". Each link: role="menuitem".
**Mobile hamburger:** aria-label="Open menu" / "Close menu". aria-expanded toggled.
**Accordions:** Each trigger: aria-expanded, aria-controls pointing to panel ID. Panel: role="region", aria-labelledby pointing to trigger ID.
## **8.3 SiteNavigationElement Schema**
The primary navigation should include SiteNavigationElement structured data in the page’s JSON-LD. Represent the top-level items and their direct children (pillar pages, core pages). Cluster pages within mega menu panels do not require schema representation in the nav.
## **8.4 SEO Considerations**
Mega menu links pass PageRank from every page sitewide. This makes every item in the mega menu a sitewide internal link, distributing link equity to cluster pages across the entire domain. The phased approach prevents links to non-existent pages (404 errors and wasted crawl budget).
**Three-step publication SOP:** (1) Publish the page in WordPress. (2) Enable the CMS menu toggle for that page. (3) Submit the new URL to Google Search Console. This process should be documented and followed for every Phase 2 page.
## **8.5 Breakpoints**
**Desktop mega menu:** 1024px and above.
**Mobile slide-out menu:** Below 1024px.
**Tablet:** Uses mobile menu pattern with wider slide-out panel (70% viewport width vs. 85% on phone).
_End of document. v1.0 — April 14, 2026 —_ [_ROI.LIVE_](http://ROI.LIVE)
_Companion document: Three-Phase Launch & Content Rollout Plan v1.0_
_Aligned with: Sitemap & Phased Implementation Plan v2.1_
