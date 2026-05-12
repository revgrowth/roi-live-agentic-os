---
clickup_doc_id: 8cma26h-16593
clickup_page_id: 8cma26h-8133
clickup_url: https://app.clickup.com/9013889233/docs/8cma26h-16593/8cma26h-8133
original_filename: Creative_Brief___Portfolio_Photo_Gallery_v1 2.md
normalized_title: portfolio
classification: CREATIVE_BRIEF
version: v1-2
status_in_archive: superseded
date_updated: 2026-04-21
hierarchy_category: (workspace-level)
hierarchy_subcategory: (none)
md5: f8d3633f12d7632d2247ffe0d4d8d2ad
archived_to_repo: 2026-05-12
---

# Creative Brief — Portfolio Photo Gallery

## Blue Tree Outdoor Living — Visual Proof Hub Page

**URL:** `/portfolio/`
**Page Type:** Core Page — Visual Proof / Discovery / Social Sharing Asset
**Parent:** Root (top-level core page)
**Children:** `/portfolio/completed-projects/` (Completed Projects hub — briefed separately)
**Launch Phase:** Phase 0 — Quick Launch
**Version:** 1.0
**Date:** April 2026
**Prepared by:** Jason Spencer | [ROI.LIVE](http://ROI.LIVE)
**Inherits from:** [ROI.LIVE](http://ROI.LIVE) Agency Core Standards v1.1
**References:** Blue Tree Client Parameter Sheet v1.0
* * *

## 🔧 TEMPLATE REQUIREMENT

> **This page requires its own unique page template.** It does not share a template with any other page on the site. The page assembles from shared components documented in the **Blue Tree Shared Component Library v1.0** — specifically: Hero Block (#1), Trust Logo Strip (#2), Operation Tag Filter Bar (#8), Photo Gallery Grid + Lightbox (#12), CTA Block (#3), and Mobile Sticky CTA (#11). The Photo Gallery Grid + Lightbox component (#12) is unique to this page and the Completed Projects case study pages.
* * *

## PAGE PURPOSE

This page replaces the current site's six separate gallery pages (Design Gallery, Custom Features, Custom Pools, Landscaping, Hardscaping, Before/After) with one filterable photo gallery. Operation Tag filtering replaces separate gallery pages — visitors toggle between Pools, Landscapes, Hardscapes, Healthy Yards, and Premier Outdoor Services views on a single page.

The Photo Gallery is a discovery and aspiration page. Visitors browse project photos, build desire, and either request a consultation or click through to the Completed Projects page for detailed case studies.
* * *

## ⚠️ ITEMS REQUIRING CLIENT CONFIRMATION

| # | Item | Status |
| ---| ---| --- |
| 1 | Photo Inventory | ⏳ PENDING — Need complete inventory of project photos organized by service pillar. Current site has hundreds of photos across 6 galleries. Which migrate? |
| 2 | Photo Metadata | ⏳ PENDING — Each photo needs: project type (operation tag), town, year completed. This data powers filtering and alt text. |
| 3 | Social Sharing Approval | ⏳ PENDING — Confirm all gallery photos are approved for social sharing (Facebook, Instagram, Pinterest, Houzz). Per sitemap v2.1 requirement. |

* * *

## SEO METADATA

```
Title:       Portfolio | Pools, Landscapes & Hardscapes | Blue Tree | Southeastern PA
Description: Browse Blue Tree's outdoor living portfolio — custom pools, landscape design, hardscapes, and backyard transformations across Southeastern PA. Filter by service type.
H1:          Our Work Across Southeastern PA
Breadcrumb:  Home > Portfolio
Canonical:   /portfolio/
```

* * *

## PAGE SECTIONS

### Hero

**H1:** Our Work Across Southeastern PA

**Subheadline:** Browse completed projects from Blue Tree's five service divisions. Filter by service type. Every photo represents a real project designed and built by our team.

**Trust Bar:**

> ✓ 43 Years of Work | ✓ Five Service Divisions | ✓ Real Projects, Real Clients | ✓ \[Trustindex Rating Badge\]
* * *

### Operation Tag Filter Bar

**Design Direction:** Horizontal filter bar (desktop) or horizontal scroll pills (mobile). Five filter options corresponding to the five pillars:

| Filter | Operation Tag | Effect |
| ---| ---| --- |
| All | (no filter) | Shows all project photos |
| Pools | Pools | Shows pool construction, renovation, water features, lighting |
| Landscapes | Landscapes | Shows landscape design, planting, lighting, fencing |
| Hardscapes | Hardscapes | Shows patios, outdoor kitchens, fire features, walls, walkways |
| Healthy Yards | Healthy Yards | Shows turf transformations, drainage, field care |
| Premier Services | Premier Outdoor Services | Shows paver restoration, maintenance before/after |

**Implementation:** CMS taxonomy filter (Breakdance + WordPress categories or custom taxonomy). Filter state reflected in URL hash or parameter for shareability (e.g., `/portfolio/?tag=pools`). Does NOT generate unique indexable URLs — avoids thin content / duplicate content issues.
* * *

### Photo Grid

**Layout:** Responsive masonry grid. 3 columns desktop, 2 columns tablet, 1 column mobile.

**Card anatomy:**

*   Project photo (landscape orientation, 16:9 or 4:3)
*   Hover overlay: Project type badge(s) + town name
*   Click: Opens lightbox with full-resolution image, caption, and navigation arrows
*   Social share icon (expandable to Facebook, Pinterest, Instagram, Houzz) — per sitemap v2.1 social sharing requirement

**Loading:** Lazy load below-fold images. Initial load: 12–16 images. "Load More" button for additional batches. Infinite scroll acceptable as alternative.

**Image optimization:** WebP with JPEG fallback, srcset for responsive sizes, descriptive alt text: "\[service type\] \[feature\] in \[town\], PA by Blue Tree" (e.g., "Custom inground pool with natural stone waterfall in Blue Bell, PA by Blue Tree").
* * *

### Mid-Page CTA

**Placement:** After first 12 images.

**H2:** Inspired by What You See?

**Body:** Every project starts with a conversation. Our designers meet you at your property, listen to your vision, and create a custom plan.

**Primary CTA:** Request a Free Consultation → `/request-estimate/`
**Secondary CTA:** View Completed Project Case Studies → `/portfolio/completed-projects/`
* * *

### Bottom CTA

**H2:** Ready to Start Your Project?

**Primary CTA:** Request Your Free Consultation → `/request-estimate/`
**Secondary CTA:** Read What Our Clients Say → `/reviews/`

**Trust Bar:**

> ✓ Free On-Site Consultation · ✓ NALP Affiliated · ✓ Licensed & Insured · ✓ \[Trustindex Rating Badge\]
* * *

## INTERNAL LINKING

**Outbound:** Completed Projects /portfolio/completed-projects/, Request Estimate /request-estimate/, Reviews /reviews/, all 5 pillar pages (via filter context), Meet the Team /about/team/.

**Inbound:** Homepage, all 5 pillar pages ("View Portfolio" CTAs), Our Story, Why Choose Blue Tree, all county/town pages, blog posts, mega menu Portfolio dropdown.
* * *

## SCHEMA

*   **ImageGallery** schema on the photo grid
*   **BreadcrumbList:** Home > Portfolio
*   **WebPage** with `about` referencing Blue Tree's project portfolio
*   Social sharing: OG tags per image (dynamic based on lightbox selection)
* * *

## WORD COUNT TARGET

~400 words visible copy (hero + intro + 2 CTA blocks). This is a visual page — the photos are the content. Copy exists to frame the experience and provide conversion paths.
* * *

## DESIGN NOTES

*   Visual-first. Photos dominate. Copy is minimal.
*   Filter bar sticky on scroll (desktop) for persistent access to pillar filters
*   Lightbox: full-screen on mobile, modal on desktop. Navigation arrows + close button. Social share icons within lightbox.
*   Performance: LCP < 2.5s. First 4 images loaded eagerly, rest lazy. Target < 200KB per image.
*   No stock photos. All Blue Tree project photography.
* * *

## URL MIGRATION

```
/galleries/ → /portfolio/
/galleries/design-gallery/ → /portfolio/
/galleries/custom-features-gallery/ → /portfolio/
/galleries/custom-pools-gallery/ → /portfolio/
/galleries/landscaping-gallery/ → /portfolio/
/galleries/hardscaping-gallery/ → /portfolio/
/galleries/before-after-gallery/ → /portfolio/completed-projects/
```

* * *

_Creative Brief — Portfolio Photo Gallery · v1.0 · April 2026 ·_ [_ROI.LIVE_](http://ROI.LIVE)
