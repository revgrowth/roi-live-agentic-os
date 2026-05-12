---
clickup_doc_id: 8cma26h-16513
clickup_page_id: 8cma26h-8033
clickup_url: https://app.clickup.com/9013889233/docs/8cma26h-16513/8cma26h-8033
original_filename: Blue_Tree_Shared_Component_Library_v1.md
normalized_title: shared component library
classification: REFERENCE_DOC
version: v1
status_in_archive: duplicate
date_updated: 2026-04-21
hierarchy_category: (workspace-level)
hierarchy_subcategory: (none)
md5: 3562b2551fa567c9c1bf8fc6a21cd7cf
archived_to_repo: 2026-05-12
---

# Blue Tree Outdoor Living — Shared Component Library

## Reusable UI Components Across All Page Templates

**Version:** 1.0 — April 2026
**Prepared by:** Jason Spencer | [ROI.LIVE](http://ROI.LIVE)
**Purpose:** Defines the reusable UI components that appear across multiple page templates on the Blue Tree site. Build each component once in Breakdance as a reusable block or global template part. Individual page templates assemble these components with page-specific content.
* * *

## COMPONENT 1 — Hero Block

**Used on:** Every page across the site (pillar pages, utility pages, location pages, blog posts)

**Structure:**

```
┌─────────────────────────────────────────────────┐
│ Breadcrumb (Home > Parent > Page)               │
│ Content Freshness Signal (Last Updated: Month Year) │
│                                                 │
│ H1 Headline                                     │
│ Subheadline (1–2 sentences)                     │
│                                                 │
│ Trust Bar (3–5 inline badges)                   │
│ ✓ Signal 1 | ✓ Signal 2 | ✓ Signal 3 | ✓ ...  │
│                                                 │
│ [Primary CTA Button]   [Secondary CTA Link]     │
└─────────────────────────────────────────────────┘
```

**Configurable fields per page:**

*   Breadcrumb trail (auto-generated from page hierarchy)
*   Last Updated date (manual field, visible as muted text)
*   H1 text
*   Subheadline text
*   Trust bar signals (text strings, 3–5 items)
*   Primary CTA label + URL
*   Secondary CTA label + URL (optional)
*   Background: image, color, or gradient (per page)

**Design tokens:** Hero background overlay for text legibility on image backgrounds. Mobile: stack CTAs vertically, reduce background image height. Trust bar wraps to 2 lines on narrow viewports.
* * *

## COMPONENT 2 — Trust Logo Strip

**Used on:** Pillar pages, Portfolio Photo Gallery, Service Areas Hub (optional), location pages

**Structure:**

```
┌─────────────────────────────────────────────────┐
│ [Logo] [Logo] [Logo] [Logo] [Logo] [Logo]       │
└─────────────────────────────────────────────────┘
```

**Behavior:**

*   Horizontal row of grayscale logos/badges on white or warm-white background
*   Hover: grayscale → full color (desktop)
*   Mobile: horizontally scrollable strip or 2×3 grid
*   Placement: below Hero or after Problem Framing section (varies by page)

**Configurable fields:**

*   Array of logo images (SVG preferred for crispness)
*   Alt text per logo
*   Optional link per logo (e.g., NALP badge links to NALP site)

**Blue Tree standard logos:** NALP, ICPI (hardscape pages), Jandy/Fluidra (pool pages), PLNA, Suburban Home and Garden, Trustindex badge, "43 Years" badge, "Licensed & Insured" badge. Each page selects the subset relevant to its service pillar.
* * *

## COMPONENT 3 — CTA Block

**Used on:** Every page — minimum 2 per page, up to 6 on pillar pages

**Structure:**

```
┌─────────────────────────────────────────────────┐
│ H2 Headline                                     │
│ Body copy (1–3 sentences)                       │
│                                                 │
│ [Primary CTA Button]                            │
│                                                 │
│ Trust Reinforcement Bar (optional)              │
│ ✓ Signal · ✓ Signal · ✓ Signal · ✓ [Badge]     │
└─────────────────────────────────────────────────┘
```

**Variants:**

*   **Mid-page CTA:** H2 + 1–2 sentences + button. No trust bar. Light background.
*   **Final CTA:** H2 + 2–3 sentences + button + trust reinforcement bar. Dark background (charcoal or brand green).
*   **Inline CTA:** No H2. Single sentence + button. Used between content sections.

**Configurable fields:**

*   H2 text
*   Body text
*   CTA button label + URL
*   Trust bar signals (optional, text strings)
*   Background variant (light / dark / accent)

**Default CTA URL:** `/request-estimate/` per Parameter Sheet §6.3. All primary CTAs route here unless the page brief specifies otherwise.
* * *

## COMPONENT 4 — FAQ Accordion

**Used on:** Pillar pages (10 Q&As), utility pages (4–6 Q&As), location pages (6–8 Q&As), blog posts (5 Q&As)

**Structure:**

```
┌─────────────────────────────────────────────────┐
│ H2: Section Headline                            │
│                                                 │
│ ┌─ Q: Question text                     [+/−] ─┐
│ │  A: Answer text (collapsed by default)        │
│ └───────────────────────────────────────────────┘
│ ┌─ Q: Question text                     [+/−] ─┐
│ │  A: Answer text                               │
│ └───────────────────────────────────────────────┘
│ ... (repeating)                                 │
└─────────────────────────────────────────────────┘
```

**Behavior:**

*   Collapsed by default — all questions visible, answers hidden
*   Click/tap to expand one at a time (or allow multiple open — client preference)
*   Smooth expand/collapse animation
*   Chevron or plus/minus toggle indicator
*   Keyboard navigable (ARIA `role="region"`, `aria-expanded`, `aria-controls`)

**Schema:** Each FAQ accordion instance generates matching FAQPage JSON-LD. The schema must match the visible content one-to-one — no hidden Q&As, no schema-only questions.

**Configurable fields:**

*   Section H2 headline
*   Array of Q&A pairs (question string + answer rich text with inline links)
*   Number of Q&As (varies by page type)
* * *

## COMPONENT 5 — Service Tile Grid

**Used on:** Pillar pages (service cluster cards), Our Process (5-division grid), Service Areas Hub (county cards), About Us (pillar overview cards)

**Structure:**

```
┌──────────┐ ┌──────────┐ ┌──────────┐
│ [Icon]   │ │ [Icon]   │ │ [Icon]   │
│ Headline │ │ Headline │ │ Headline │
│ 2–3 line │ │ 2–3 line │ │ 2–3 line │
│ copy     │ │ copy     │ │ copy     │
│ [Link →] │ │ [Link →] │ │ [Link →] │
└──────────┘ └──────────┘ └──────────┘
```

**Behavior:**

*   Responsive grid: 3 columns desktop, 2 columns tablet, 1 column mobile
*   Hover: subtle lift/shadow on linked cards
*   Non-linking cards (Phase 2 services not yet published): render without link styling, muted appearance. Link activates on publication day.
*   Consistent icon style across all cards within a grid instance

**Configurable fields per card:**

*   Icon (SVG or icon font)
*   Headline text
*   Description (2–3 sentences)
*   Link URL (optional — blank for non-linking cards)
*   Link label text
*   Card status: active / inactive (controls link styling)
* * *

## COMPONENT 6 — Testimonial Block

**Used on:** Pillar pages (Proof Section #2), location pages, Completed Projects case studies, Reviews page

**Structure:**

```
┌─────────────────────────────────────────────────┐
│ " [Quote text — 2–4 sentences]                  │
│                                                 │
│   — Client Name, Town                           │
│   [Client photo or icon] [Star rating optional] │
└─────────────────────────────────────────────────┘
```

**Variants:**

*   **Standard:** Large quotation mark visual + quote + attribution
*   **With photo:** Client headshot or project thumbnail alongside quote
*   **Carousel:** Multiple testimonials in a rotating slider (mobile: swipeable)
*   **Single feature:** One large testimonial as a section break

**Configurable fields:**

*   Quote text (rich text — can include bold emphasis)
*   Client name (first name + last initial, or full name where permitted)
*   Town/location
*   Client photo URL (optional)
*   Star rating (optional — sourced from verified review platform)
*   Link to external review source (optional — e.g., Google review)
* * *

## COMPONENT 7 — Warranty / Comparison Table

**Used on:** Pillar pages (Guarantee section), Service Hub — Warranties page

**Structure:**

```
┌────────────────┬──────────────┬─────────────────┐
│ Component      │ Coverage     │ Notes           │
├────────────────┼──────────────┼─────────────────┤
│ Pool shell     │ Lifetime     │                 │
│ Equipment      │ 3 years      │ Fluidra/Jandy   │
│ Plumbing       │ 2 years      │                 │
│ ...            │ ...          │ ...             │
└────────────────┴──────────────┴─────────────────┘
```

**Behavior:**

*   Responsive table: full width desktop, horizontally scrollable or stacked cards on mobile
*   Alternating row background for readability
*   Bold first column (component name)

**Configurable fields:**

*   Column headers
*   Row data (component, coverage, notes)
*   Number of rows (varies by page — 13 for full warranty matrix, 3–4 for pillar summary)
* * *

## COMPONENT 8 — Operation Tag Filter Bar

**Used on:** Portfolio Photo Gallery, Portfolio Completed Projects hub, Reviews page, Service Hub FAQs, Blog hub (future)

**Structure:**

```
┌─────────────────────────────────────────────────┐
│ [All] [Pools] [Landscapes] [Hardscapes]         │
│ [Healthy Yards] [Premier Services]              │
└─────────────────────────────────────────────────┘
```

**Behavior:**

*   Horizontal pill/tab buttons (desktop), horizontally scrollable pills (mobile)
*   Active state: filled button. Inactive: outlined button.
*   Filters page content via CMS taxonomy (WordPress categories or custom taxonomy)
*   URL reflects filter state via hash or query parameter (e.g., `?tag=pools`) for shareability
*   Does NOT generate unique indexable URLs — avoids thin content / duplicate content

**Configurable fields:**

*   Array of filter labels (mapped to CMS taxonomy terms)
*   Default state (All selected)
*   Content target (which content block on the page gets filtered)
* * *

## COMPONENT 9 — Stat Bar

**Used on:** About Us, Careers, Our Story, Our Process, Service Areas Hub

**Structure:**

```
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│  1983    │ │  70-90   │ │  13+ yrs │ │  5       │
│ Founded  │ │ Employees│ │ Avg Tenure│ │ Divisions│
└──────────┘ └──────────┘ └──────────┘ └──────────┘
```

**Behavior:**

*   Horizontal row of 3–6 stat blocks
*   Large number/value + smaller label below
*   Optional: animated count-up on scroll into view
*   Mobile: 2×2 grid or horizontally scrollable

**Configurable fields per stat:**

*   Value (text — can be number, year, or short string)
*   Label (text)
*   Count (3–6 stats per instance)
* * *

## COMPONENT 10 — Cross-Pillar Integration Grid

**Used on:** All 5 pillar pages (Integration section)

**Structure:**

```
┌──────────────────────────────────────────────────┐
│ H2: Section Headline                             │
│ Body intro (2–3 sentences)                       │
│                                                  │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────┐ │
│ │ Pillar   │ │ Pillar   │ │ Pillar   │ │Pillar│ │
│ │ icon     │ │ icon     │ │ icon     │ │ icon │ │
│ │ 2–3 line │ │ 2–3 line │ │ 2–3 line │ │2–3   │ │
│ │ context  │ │ context  │ │ context  │ │line  │ │
│ │ [Link →] │ │ [Link →] │ │ [Link →] │ │[→]  │ │
│ └──────────┘ └──────────┘ └──────────┘ └──────┘ │
└──────────────────────────────────────────────────┘
```

Shows the 4 sibling pillars (excludes the current page's own pillar). Uses the same card anatomy as Component 5 (Service Tile Grid) but with integration-specific copy explaining how each sibling pillar connects to the current page's service.
* * *

## COMPONENT 11 — Mobile Sticky CTA Bar

**Used on:** All pages with long scroll depth (pillar pages, location pages, blog posts, Our Process, Financing)

**Structure:**

```
┌─────────────────────────────────────────────────┐
│ [Primary CTA Button — full width]               │
└─────────────────────────────────────────────────┘
```

**Behavior:**

*   Fixed to bottom of viewport on mobile (<768px)
*   Appears after user scrolls past the hero CTA (first CTA no longer visible)
*   Disappears when user scrolls back to top or reaches footer
*   Button routes to `/request-estimate/` by default
*   Does not obscure content — sits below the viewport content edge with subtle shadow
* * *

## COMPONENT 12 — Photo Gallery Grid + Lightbox

**Used on:** Portfolio Photo Gallery page (primary), Portfolio Completed Projects case study pages (before/after galleries)

**Structure:**

```
┌────────┐ ┌────────┐ ┌────────┐
│ Photo  │ │ Photo  │ │ Photo  │
│        │ │        │ │        │
│ [hover │ │ [hover │ │ [hover │
│  overlay]│ │  overlay]│ │  overlay]│
└────────┘ └────────┘ └────────┘
┌────────┐ ┌────────┐ ┌────────┐
│ Photo  │ │ Photo  │ │ Photo  │
└────────┘ └────────┘ └────────┘
         [Load More]
```

**Grid behavior:**

*   Responsive masonry: 3 columns desktop, 2 tablet, 1 mobile
*   Lazy load below-fold images
*   Initial load: 12–16 images. "Load More" button for subsequent batches.
*   Hover overlay: service type badge(s) + town name

**Lightbox behavior:**

*   Click/tap opens full-resolution image in modal overlay
*   Navigation arrows (left/right) + close button
*   Image caption below image (project type, town, year)
*   Social share icons within lightbox (Facebook, Pinterest, Instagram, Houzz)
*   Keyboard navigation (arrow keys, Escape to close)
*   Mobile: full-screen overlay, swipe to navigate
*   Preload adjacent images for smooth navigation

**Social sharing per image:**

*   Share icon on hover (grid) or within lightbox
*   Generates Open Graph preview using: image, project type, town, Blue Tree brand
*   Pinterest: `<meta name="pinterest:description">` per image
* * *

## COMPONENT 13 — Map Block

**Used on:** Service Areas Hub, Contact page, county location pages

**Variants:**

*   **Branded SVG map** (Service Areas Hub): Custom-designed map of 5-county service area. Skippack HQ marked with branded pin. Counties labeled and color-coded. Interactive hover/tap to highlight county.
*   **Google Maps embed** (Contact page): Standard embedded map centered on 4494 Skippack Pike, Skippack, PA 19474.
*   **County detail map** (county pages): County-specific map showing towns served.

The branded SVG map is preferred for the Service Areas Hub because it matches the site's visual identity and loads faster than a Google Maps embed.
* * *

## ASSEMBLY REFERENCE

How each of the 5 utility page templates assembles from these components:

| Page | Components Used |
| ---| --- |
| Portfolio Photo Gallery | Hero (#1), Trust Logo Strip (#2), Operation Tag Filter Bar (#8), Photo Gallery Grid + Lightbox (#12), CTA Block ×2 (#3), Mobile Sticky CTA (#11) |
| Our Process | Hero (#1), Service Tile Grid (#5 — 5-division and 8-step variants), FAQ Accordion (#4), CTA Block ×2 (#3), Stat Bar (#9 — optional), Mobile Sticky CTA (#11) |
| Service Areas Hub | Hero (#1), Map Block (#13 — branded SVG), Service Tile Grid (#5 — county cards), Service Tile Grid (#5 — pillar overview), CTA Block (#3) |
| Careers | Hero (#1), Stat Bar (#9), Service Tile Grid (#5 — job listing cards), CTA Block (#3) |
| Financing | Hero (#1), FAQ Accordion (#4), Warranty/Comparison Table (#7 — financing options table), CTA Block ×2 (#3), Mobile Sticky CTA (#11) |

* * *

_Blue Tree Outdoor Living — Shared Component Library v1.0_
_April 2026 —_ [_ROI.LIVE_](http://ROI.LIVE) _/ Jason Spencer_
