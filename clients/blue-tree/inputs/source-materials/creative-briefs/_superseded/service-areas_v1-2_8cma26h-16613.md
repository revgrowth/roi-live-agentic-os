---
clickup_doc_id: 8cma26h-16613
clickup_page_id: 8cma26h-8153
clickup_url: https://app.clickup.com/9013889233/docs/8cma26h-16613/8cma26h-8153
original_filename: Creative_Brief___Service_Areas_Hub_v1 2.md
normalized_title: service areas
classification: CREATIVE_BRIEF
version: v1-2
status_in_archive: superseded
date_updated: 2026-04-21
hierarchy_category: (workspace-level)
hierarchy_subcategory: (none)
md5: e9e0be3e55828ec9f65fbccf7eeb0c9e
archived_to_repo: 2026-05-12
---

# Creative Brief — Service Areas Hub

## Blue Tree Outdoor Living — Geographic Authority Hub Page

**URL:** `/service-areas/`
**Page Type:** Core Page — Geographic Hub / Local SEO Index
**Parent:** Root (top-level core page)
**Children:** 5 county pages + 56+ town pages (briefed separately)
**Launch Phase:** Phase 0 — Quick Launch (hub page only; county + town pages Phase 1)
**Version:** 1.0
**Date:** April 2026
**Prepared by:** Jason Spencer | [ROI.LIVE](http://ROI.LIVE)
**Inherits from:** [ROI.LIVE](http://ROI.LIVE) Agency Core Standards v1.1
**References:** Blue Tree Client Parameter Sheet v1.0
* * *

## 🔧 TEMPLATE REQUIREMENT

> **This page requires its own unique page template.** It does not share a template with county or town location pages (those have their own templates). This is a hub/routing page. The page assembles from shared components documented in the **Blue Tree Shared Component Library v1.0** — specifically: Hero Block (#1), Map Block (#13 — branded SVG variant), Service Tile Grid (#5 — used twice: county cards and pillar overview), and CTA Block (#3).
* * *

## PAGE PURPOSE

This page is the geographic authority hub — the parent page from which all county and town location pages radiate. It establishes Blue Tree's five-county service footprint, provides a visual map of the service area, and routes visitors to their specific county or town page.

At Phase 0 launch, this is a standalone hub with county names and town lists but no active child page links (county and town pages publish in Phase 1 Sprint 2). The page must stand on its own as a valid geographic authority signal until children go live.
* * *

## SEO METADATA

```
Title:       Service Areas | Southeastern PA | Blue Tree Outdoor Living
Description: Blue Tree serves homeowners across Montgomery, Bucks, Chester, Delaware, and Philadelphia Counties in Southeastern PA. Pools, landscapes, hardscapes, and maintenance. Find your area.
H1:          Serving Homeowners Across Southeastern Pennsylvania
Breadcrumb:  Home > Service Areas
Canonical:   /service-areas/
```

* * *

## PAGE SECTIONS

### Hero

**H1:** Serving Homeowners Across Southeastern Pennsylvania

**Subheadline:** Blue Tree Outdoor Living designs, builds, and maintains outdoor living spaces for homeowners in Montgomery, Bucks, Chester, Delaware, and Philadelphia Counties. Headquartered in Skippack, PA — within 30 minutes of most project sites in the region.
* * *

### Service Area Map

**Design Direction:** Custom-designed map of the five-county Southeastern PA service area. Skippack headquarters marked with a branded pin or star. Each county labeled and color-coded. Interactive hover (desktop) or tap (mobile) to highlight a county and reveal a brief summary.

Map is NOT a Google Maps embed — it is a branded SVG or static graphic designed to match Blue Tree's visual identity.

**Below map:** Headquarters callout: "Blue Tree Outdoor Living · 4494 Skippack Pike · Skippack, PA 19474 · (610) 222-0590"
* * *

### County Cards (5 counties)

**Design Direction:** Five cards in a responsive grid (3+2 desktop, 2+2+1 tablet, 1-column mobile). Each card links to the county's dedicated page (Phase 1 — links inactive at Phase 0 launch until county pages publish).

| County | Copy | Link |
| ---| ---| --- |
| Montgomery County | Our home county. Skippack, Blue Bell, Collegeville, Gwynedd Valley — Blue Tree has built hundreds of outdoor living projects across Montgomery County over 43 years. | /service-areas/montgomery-county/ |
| Bucks County | From Doylestown to New Hope, Blue Tree serves Bucks County homeowners with custom pools, landscape design, hardscapes, and ongoing property care. | /service-areas/bucks-county/ |
| Chester County | West Chester, Phoenixville, Malvern, and the estates of Chester County — our design team knows the terrain, soil, and township requirements. | /service-areas/chester-county/ |
| Delaware County | Wayne, Radnor, Swarthmore, and communities across Delaware County. Custom outdoor living designed for the Main Line and beyond. | /service-areas/delaware-county/ |
| Philadelphia County | Select projects in Philadelphia County's suburban-adjacent neighborhoods. Contact us to discuss your project. | /service-areas/philadelphia-county/ |

> **Phase 0 note:** Cards render with county names, descriptions, and county-specific imagery but WITHOUT active links. Links activate when county pages publish (Phase 1 Sprint 2).
* * *

### Featured Communities

**H2:** Communities We Serve

**Design Direction:** Text block or expandable accordion listing featured towns grouped by county. Tier 1 Golden Circle towns receive named links (Phase 1). Lower-tier towns appear as text-only listings.

**Montgomery County:** Skippack, Blue Bell, Collegeville, Gwynedd Valley, Harleysville, Schwenksville, Limerick, Worcester, North Wales, King of Prussia, Lafayette Hill, Plymouth Meeting, Conshohocken, Ambler, Fort Washington, Lansdale, Norristown

**Bucks County:** Doylestown, New Hope, Newtown, Warrington, Chalfont, Yardley, Solebury, Warminster

**Chester County:** West Chester, Phoenixville, Malvern, Wayne, Downingtown, Exton, Paoli

**Delaware County:** Wayne, Radnor, Swarthmore, Media, Havertown, Broomall, Springfield

**Philadelphia County:** Chestnut Hill, Manayunk, East Falls, Roxborough (border-adjacent areas)

> "Don't see your town listed? If you are in Montgomery, Bucks, Chester, Delaware, or Philadelphia County, we serve you. [Contact us →](http:///contact/)"
* * *

### Services Available in Every County

**H2:** What We Do Across the Region

**Body:** Blue Tree's five service divisions operate throughout the entire five-county service area. Every community has access to the same team, the same design quality, and the same warranty coverage.

| Division | Link |
| ---| --- |
| Custom Pool Design & Construction | /pools/ |
| Landscape Design & Installation | /landscapes/ |
| Hardscape Design & Installation | /hardscapes/ |
| Healthy Yards Programs | /healthy-yards/ |
| Premier Outdoor Services | /premier-outdoor-services/ |

* * *

### Final CTA

**H2:** Find Your Area and Start the Conversation

**Body:** Select your county above to see local projects, testimonials, and team members in your area — or request a free consultation and we will come to you.

**CTA:** Request Your Free Consultation → `/request-estimate/`
* * *

## INTERNAL LINKING

**Outbound:** 5 county pages (Phase 1), all 5 pillar pages, Request Estimate, Contact, Our Story.

**Inbound:** Homepage (Service Areas nav link), all 5 pillar pages (Service Areas sections link to hub or directly to counties), mega menu, footer sitemap.
* * *

## SCHEMA

*   **WebPage** with `about` referencing Blue Tree's geographic service area
*   **LocalBusiness** with `areaServed` array (5 counties)
*   **BreadcrumbList:** Home > Service Areas
* * *

## WORD COUNT TARGET

~600–800 words. Hub routing page — minimal copy, maximum navigability. The county pages carry the geographic content depth.
* * *

_Creative Brief — Service Areas Hub · v1.0 · April 2026 ·_ [_ROI.LIVE_](http://ROI.LIVE)
