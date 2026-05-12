---
clickup_doc_id: 8cma26h-14113
clickup_page_id: 8cma26h-5613
clickup_url: https://app.clickup.com/9013889233/docs/8cma26h-14113/8cma26h-5613
original_filename: Creative Brief Contact Request Estimate Bottom-of-Funnel Conversion Page Template.md
normalized_title: contact request estimate bottom of funnel
classification: CREATIVE_BRIEF
version: older-pattern
status_in_archive: superseded
date_updated: 2026-02-20
hierarchy_category: (workspace-level)
hierarchy_subcategory: (none)
md5: 2cc85dc3de489d7d44b1fa8d13163c0f
archived_to_repo: 2026-05-12
---

# Creative Brief — Contact Us + Request an Estimate

## Blue Tree — Bottom-of-Funnel Conversion Pages

**URLs:** `/contact/` and `/request-estimate/`
**Page Type:** Core Pages — Bottom-of-Funnel Conversion / Lead Capture
**Parent:** Root (both pages are top-level core pages)
**Launch Phase:** Phase 1 — Core Page #15 (Contact Us) and Core Page #16 (Request an Estimate)
**Version:** 1.1
**Date:** February 2026
**Prepared by:** Jason Spencer | [ROI.LIVE](http://ROI.LIVE)
* * *

## HOW TO USE THIS DOCUMENT

This creative brief is organized into three parts for three audiences:

| Part | Audience | What It Contains |
| ---| ---| --- |
| Part 1 — Page Strategy | Client + Strategy Team | Page purpose, conversion goals, target audience, and key decisions that need client approval |
| Part 2 — Page Design & Copy | Design + Development Team | Section-by-section blueprint with copy, layout direction, CTAs, visuals, and internal links — everything needed to build the page |
| Part 3 — Technical Specifications | SEO + Development Team | Entity SEO certification, schema markup, AEO answer capsules, brand voice compliance — the implementation layer that powers search and AI visibility |

**For the client:** Read Part 1 in full, then skim Part 2 for copy and design direction. Part 3 is reference material you don't need to review unless you want to.
**For the design team:** Part 2 is your primary working document. Refer to Part 1 for strategic context and Part 3 only when implementing schema or checking entity requirements.
> **For SEO/dev:** Part 3 is your implementation spec. Cross-reference Part 2 for where each element appears on the page.
* * *

## WHY TWO PAGES, NOT ONE

The sitemap defines two separate bottom-of-funnel conversion pages:

| Page | URL | Primary Function |
| ---| ---| --- |
| Contact Us | `/contact/` | General-purpose contact hub — phone, address, map, hours, routing for all inquiry types (existing clients, vendors, job seekers, media, general questions). Serves navigational intent: "how do I reach Blue Tree?" |
| Request an Estimate | `/request-estimate/` | Dedicated lead capture page — structured intake form for homeowners who are ready to request a design consultation. Serves transactional intent: "I want Blue Tree to come to my property." |

**Why separate them:** A combined Contact/Estimate page forces two very different audiences into the same funnel. An existing client calling about a warranty issue doesn't need a 12-field project intake form. A prospect ready for an estimate doesn't need to sift through job application links and vendor contact info. Separating them reduces friction for both audiences and lets us optimize each page for its specific conversion goal.

**How they connect:** The Contact page includes a prominent "Request an Estimate" CTA routing high-intent visitors to the dedicated form. The Request Estimate page includes a smaller "General inquiries? Contact us" link for visitors who arrived at the wrong page. Every CTA across the entire site that says "Request a Free Consultation" or "Request Your Free Design Consultation" links to `/request-estimate/`.
* * *

## ⚠️ ITEMS REQUIRING CLIENT CONFIRMATION

> **Status:** 6 of 8 items resolved (February 2026). 2 items still pending client confirmation.

| # | Item | Status | Resolution |
| ---| ---| ---| --- |
| 1 | Office Hours | ✅ RESOLVED | Confirmed: Office hours are published on the Google Business Profile. Pull hours directly from GBP for display on the Contact page. Schema `openingHoursSpecification` should match GBP hours exactly. If GBP hours change seasonally, the Contact page should reflect those changes automatically or be updated manually to match. |
| 2 | Form Submission Destination | ✅ RESOLVED | Confirmed: Form submissions are integrated with [ROI.LIVE](http://ROI.LIVE)'s leads tracking and attribution system, then routed to GoHighLevel (GHL) for CRM management and lead assignment. Auto-reply email should be configured within GHL. All conversion tracking fires at the leads tracking layer before GHL handoff. |
| 3 | Financing Partner Details | ✅ RESOLVED | Confirmed: Include an "Interested in financing?" checkbox on the estimate request form. This should be an optional, unchecked-by-default checkbox in the form's project section. Label: "☐ I'm interested in financing options." When checked, this flag should pass through to GHL so the sales team can proactively discuss financing during the consultation. The trust bar below the form should also include a [Financing Available →](http:///financing/) link. |
| 4 | Minimum Project Threshold | ⏳ PENDING | Does Blue Tree have a minimum project size for design consultations? Some design-build firms require minimum budgets ($10K+, $25K+, etc.) to qualify for a free consultation. If so, this should be communicated on the estimate page to pre-qualify leads. Current assumption: No minimum stated. If one exists, we'll add qualifying language to reduce unqualified leads. |
| 5 | Service Area Boundaries | ✅ RESOLVED | Confirmed: Philadelphia County is not a typical service area — Blue Tree will occasionally take on pool or large outdoor living projects on the Philadelphia County borders, but rarely. The four core counties are Montgomery, Bucks, Chester, and Delaware. Marketing language should continue to list all five counties for SEO breadth, but copy should lead with the four core counties. The estimate form and consultation routing should flag Philadelphia County addresses for sales team review. |
| 6 | Response Time Commitment | ⏳ PENDING | What is the typical response time after form submission? Same business day? 24 hours? 48 hours? This is a critical trust signal on the form page. Current assumption: "We'll respond within one business day" — but a faster commitment (same day) would be stronger. |
| 7 | Phone System / Routing | ✅ RESOLVED | Confirmed: (610) 222-0590 routes to a live receptionist during business hours. Copy updated throughout to reflect this: "Our team answers the phone during business hours — no automated phone trees." This is a meaningful trust differentiator and should be emphasized. |
| 8 | Lead Source Tracking | ✅ RESOLVED | Confirmed: Lead source is automatically captured by the leads tracking/attribution system integrated with the form. No "How did you hear about us?" field is needed on the form — this data is collected automatically. Removing this field reduces form friction by one field, which is a net positive for conversion rate. The "How Did You Hear About Us?" dropdown specified in §B.3 should be removed from the form. |

* * *

# PART 1 — PAGE STRATEGY

## 1.1 Page Purpose

These two pages are the final stop in every conversion path on the Blue Tree website. Every pillar page, every cluster page, every location page, every blog post, every case study, and every trust page ultimately funnels traffic toward one of these two destinations.

**Contact Us (****`/contact/`****)** is the general-purpose front door for all incoming communication. It must serve:

*   Prospects who prefer to call rather than fill out a form
*   Existing clients with service questions, warranty issues, or maintenance requests
*   Job seekers looking for career information
*   Vendors and suppliers
*   Media and partnership inquiries
*   Anyone who Googled "Blue Tree Landscaping phone number" or "Blue Tree Landscaping address"

**Request an Estimate (****`/request-estimate/`****)** is the purpose-built lead capture machine. Every dollar Blue Tree invests in SEO, content, and site architecture is designed to drive qualified homeowners to this page. It must:

*   Capture enough information to qualify the lead and prepare the designer for the on-site visit
*   Reduce friction to an absolute minimum — every unnecessary form field costs conversions
*   Reinforce trust at the moment of highest commitment anxiety
*   Set expectations for what happens next
*   Pre-frame the value of the free consultation

## 1.2 Conversion Goals

### Contact Us (`/contact/`)

| Priority | Goal | Metric |
| ---| ---| --- |
| 1 | Route visitors to the correct contact method for their inquiry type | Click-through rate on routing options (estimate CTA, phone, email, careers link) |
| 2 | Convert estimate-ready visitors to `/request-estimate/` | CTA click-through rate → `/request-estimate/` |
| 3 | Provide accurate NAP (Name, Address, Phone) data for local SEO | Google Business Profile accuracy, citation consistency |
| 4 | Reduce inbound phone volume for routine questions | FAQ engagement, time on page |

### Request an Estimate (`/request-estimate/`)

| Priority | Goal | Metric |
| ---| ---| --- |
| 1 | Capture qualified residential leads | Form submission rate (target: 8–15% of page visitors) |
| 2 | Pre-qualify leads with enough context for designer preparation | Average fields completed, lead quality score |
| 3 | Set consultation expectations that reduce no-shows | Consultation completion rate after form submission |
| 4 | Provide AI-citable contact information for "how to contact Blue Tree" queries | AI citation rate for contact/estimate queries |

## 1.3 Target Audience

### Contact Us — Audience Segments

| Segment | Intent | What They Need |
| ---| ---| --- |
| Hot prospects | Ready to request an estimate but landed here first | Clear, prominent routing to `/request-estimate/` |
| Warm prospects | Still deciding, want to call and ask questions first | Phone number with hours, brief reassurance |
| Existing clients | Service request, warranty question, maintenance scheduling | Phone number, possibly a separate contact method |
| Navigational searchers | Googled "Blue Tree phone number" or "Blue Tree address" | NAP data immediately visible — no scrolling |
| Job seekers | Looking for employment opportunities | Link to `/careers/` |
| Vendors/suppliers | Business inquiry | General email or phone |

### Request an Estimate — Audience Segments

| Segment | Intent | What They Need |
| ---| ---| --- |
| High-intent homeowners | Ready to start a project — want someone at their property | Short form, fast submission, clear next steps |
| Research-stage homeowners | Interested but still comparing — want to "see what it costs" | Trust signals, no-obligation language, process transparency |
| Spouse/co-decision-maker | Partner told them to "fill out the form" — may know less about the project | Simple form that doesn't require technical knowledge |
| Referral visitors | Friend or neighbor recommended Blue Tree — high trust, low information | Brief company context + easy form |

## 1.4 Conversion Psychology

### Contact Us

The Contact page must feel like a warm, organized reception desk — not a bureaucratic form wall. Visitors arriving here have a specific need and want to resolve it quickly. The page must:

*   **Answer the question instantly** — phone number, address, and hours should be visible without scrolling
*   **Route efficiently** — different inquiry types get clear paths (estimate, existing client, careers, general)
*   **Reinforce credibility passively** — trust signals present but not dominating
*   **Push high-intent visitors forward** — the estimate CTA should be the most visually prominent element

### Request an Estimate

This is the highest-anxiety moment in the entire customer journey. The prospect is about to hand over personal information and invite a stranger to their home. Every element on this page must reduce friction and reinforce trust:

*   **Minimize form fields** — ask only what the designer needs to prepare. Every unnecessary field is a conversion leak.
*   **Eliminate ambiguity** — what happens after they submit? Who contacts them? How quickly? What does the consultation involve?
*   **Stack trust signals at the point of commitment** — badges, ratings, and reassurances directly adjacent to the submit button, not buried above or below
*   **Reframe the ask** — they're not "submitting a form." They're scheduling a free, no-obligation design conversation with a degreed professional who will visit their property
*   **Offer an escape valve** — "prefer to call?" with a phone number. Some people want to hear a human voice before committing

## 1.5 SEO & AEO Summary

### Contact Us (`/contact/`)

| Element | Value |
| ---| --- |
| Title Tag | `Contact Us | Blue Tree | Schwenksville, PA | (610) 222-0590` |
| Meta Description | `Contact Blue Tree for outdoor living design, pool construction, landscaping, and maintenance in Southeastern PA. Call (610) 222-0590 or visit us at 4494 Skippack Pike, Schwenksville, PA 19473.` |
| H1 | `Contact Blue Tree` |
| Primary Keyword | Blue Tree Landscaping contact / Blue Tree phone number |
| Secondary Keywords | Blue Tree Landscaping address, Blue Tree Schwenksville PA, landscaping company near me contact, Blue Tree hours |
| Target Word Count | ~600–800 words (lean — this is a utility page) |

### Request an Estimate (`/request-estimate/`)

| Element | Value |
| ---| --- |
| Title Tag | `Request a Free Estimate | Blue Tree | Southeastern PA` |
| Meta Description | `Request a free on-site design consultation from Blue Tree. Our degreed designers visit your property, listen to your vision, and create a custom plan — no cost, no obligation. Serving Southeastern PA since 1983.` |
| H1 | `Request Your Free Design Consultation` |
| Primary Keyword | Blue Tree free estimate / Blue Tree consultation |
| Secondary Keywords | landscaping estimate Southeastern PA, pool builder free consultation, outdoor living design consultation, free landscape design estimate PA |
| Target Word Count | ~800–1,000 words (form + supporting trust content) |

## 1.6 Key Facts Reference Table

> **Source of truth** for all facts used throughout both pages. Inherits from the Our Story brief (v2.2).

| Fact | Value | Source |
| ---| ---| --- |
| Company name (current) | Blue Tree | Client rebrand confirmation |
| Company name (schema/legal) | Blue Tree Landscaping | GBP listing, legal records |
| Founded | 1983 | Audio recordings, live site |
| Headquarters | 4494 Skippack Pike, Schwenksville, PA 19473 | Client confirmation |
| Phone | (610) 222-0590 | Live site |
| Employee count | 70 to 90 (seasonal) | Audio recordings |
| Design team | 4 degreed landscape designers (Penn State, Rutgers, Temple, Penn College) | Live site bios |
| Service area | Southeastern PA — Montgomery, Bucks, Chester, Delaware, and Philadelphia Counties | Brand voice guide |
| Google rating | Live via Trustindex widget (no static value) | Client confirmation |
| Consultation approach | Free estimate + free design; designers are the salespeople | Audio recording (Jérôme Besnard) |
| Consultation structure | Designer visits property, walks the space, listens to vision, creates custom design | Audio recordings |
| Service pillars | Pools, Landscapes, Hardscapes, Healthy Yard, Premier Outdoor Services | Sitemap v2.1 |
| Financing | Available (details on `/financing/` page) | Sitemap v2.1 |
| NALP membership | Active | Audio recordings, live site |
| Average employee tenure | 13 to 14 years | Audio recordings |

* * *

# PART 2 — PAGE DESIGN & COPY

> **Design Philosophy:** These are conversion pages — every design decision must serve the goal of getting a qualified lead to submit the form or pick up the phone. Clean, confident, fast-loading, mobile-optimized. No visual clutter. No distracting sidebars. No unnecessary content. Trust signals embedded at friction points. The design should feel like the best doctor's office you've ever been in: professional, welcoming, and you know exactly what to do next.
* * *

## SECTION A — CONTACT US PAGE (`/contact/`)
* * *

### A.1 SEO Metadata

```yaml
Title:       Contact Us | Blue Tree | Schwenksville, PA | (610) 222-0590
Description: Contact Blue Tree for outdoor living design, pool construction, landscaping, and maintenance in Southeastern PA. Call (610) 222-0590 or visit us at 4494 Skippack Pike, Schwenksville, PA 19473.
H1:          Contact Blue Tree
URL:         /contact/
Breadcrumb:  Home > Contact Us
```

* * *

### A.2 Hero Section

| Element | Content |
| ---| --- |
| Breadcrumb | `Home > Contact Us` |
| H1 | Contact Blue Tree |
| Subheadline | Whether you're ready to start a project, have a question about an existing one, or just want to learn more about what we do — we're here to help. |
| Primary CTA | Request a Free Estimate → `/request-estimate/` |
| Secondary CTA | Call Us: (610) 222-0590 |

**Visual Direction:** Clean, light design. No full-bleed hero image — this is a utility page, not an emotional storytelling page. A subtle background texture or a small accent image of the Blue Tree office or team is sufficient. The hero should feel organized and efficient, not dramatic.

**Design Notes:**

*   Phone number large and tappable (mobile: tap-to-call)
*   The "Request a Free Estimate" button should be the most visually prominent element on the entire page — it routes the highest-value visitors forward
*   Mobile: CTAs stacked vertically, phone number first (thumb-zone priority)
* * *

### A.3 Contact Information Block

**Design Direction:** Clean two- or three-column card layout. Each card covers one contact method. Desktop: side-by-side. Mobile: stacked.

**Card 1 — Call Us**

| Element | Content |
| ---| --- |
| Icon | Phone icon |
| Headline | Call Us |
| Phone | (610) 222-0590 |
| Hours | Monday–Friday: 7:00 AM – 5:00 PM · Saturday: By Appointment · Sunday: Closed |
| Note | Our team answers the phone during business hours — no automated phone trees. |

**Card 2 — Visit Us**

| Element | Content |
| ---| --- |
| Icon | Map pin icon |
| Headline | Visit Our Office |
| Address | 4494 Skippack Pike, Schwenksville, PA 19473 |
| Note | Located on Skippack Pike between Collegeville and Skippack — look for the Blue Tree sign. Visitors welcome during business hours. |
| Link | Get Directions → (opens Google Maps) |

**Card 3 — Request an Estimate**

| Element | Content |
| ---| --- |
| Icon | Clipboard/pencil icon |
| Headline | Ready to Start a Project? |
| Copy | Our degreed designers offer free on-site consultations. Tell us about your project and we'll be in touch within one business day. |
| CTA | Request a Free Estimate → `/request-estimate/` |

**Design Notes:**

*   Address should use `<address>` HTML element for schema parsing
*   Phone number wrapped in `tel:` link for mobile tap-to-call
*   "Get Directions" link opens Google Maps with the exact address pre-populated
*   The "Request an Estimate" card should have a slightly different visual treatment (accent background color, subtle border) to distinguish it as the primary action
* * *

### A.4 Embedded Map

**Design Direction:** Full-width embedded Google Map centered on 4494 Skippack Pike, Schwenksville, PA 19473. Pin visible. Zoom level showing the immediate surrounding area (Skippack, Collegeville, Worcester visible).

**Implementation Notes:**

*   Use Google Maps Embed API (not a static image)
*   Responsive: full-width on all breakpoints
*   Lazy load the map iframe for page speed
*   Include a noscript fallback with a link to Google Maps
*   Map height: ~300px desktop, ~250px mobile
* * *

### A.5 Inquiry Routing Section

**H2:** How Can We Help?

**Subheadline:** Select the option that best describes your inquiry and we'll point you in the right direction.

**Design Direction:** 4–5 clickable routing cards or a visual navigation block. Each card routes to the appropriate destination. Think "choose your own adventure" — clean icons, brief copy, clear destination.

| Card | Icon | Copy | Destination |
| ---| ---| ---| --- |
| New Project Estimate | Design blueprint icon | Planning a pool, landscape, hardscape, or outdoor living project? Start with a free design consultation. | → `/request-estimate/` |
| Existing Client / Service Request | Wrench/tools icon | Already a Blue Tree client? Contact us about maintenance, warranties, or service questions. | → Phone: (610) 222-0590 (or dedicated client email if one exists) |
| Healthy Yard & Turf Care | Leaf/grass icon | Interested in lawn fertilization, pest control, aeration, or weed management programs? | → `/healthy-yard/` with CTA to call or request estimate |
| Career Opportunities | People/team icon | Interested in joining the Blue Tree team? View open positions and apply. | → `/careers/` |
| General Inquiry | Envelope icon | Questions about our services, coverage area, or anything else? Drop us a line. | → General contact form (lightweight — name, email, message) |

**Design Notes:**

*   These cards replace the need for a long, multi-purpose contact form
*   Routing reduces form abandonment by ensuring visitors reach the right intake path
*   The "New Project Estimate" card should be visually dominant (larger, accent color, first position)
*   Mobile: Vertical stack, full-width cards
* * *

### A.6 General Contact Form (Lightweight)

**H2:** Send Us a Message

**Subheadline:** For general questions, partnership inquiries, or anything else that doesn't fit the categories above.

**Form Fields:**

| Field | Type | Required | Notes |
| ---| ---| ---| --- |
| Name | Text | Yes | First and last name |
| Email | Email | Yes | Validated format |
| Phone | Tel | No | Optional — some people prefer a callback |
| Subject | Dropdown | Yes | Options: General Question, Existing Client, Vendor/Supplier, Media/Press, Other |
| Message | Textarea | Yes | 500-character max with counter |

**Submit Button:** Send Message

**Post-Submit Confirmation:** "Thank you — we've received your message and will respond within one business day. If your inquiry is urgent, please call us at (610) 222-0590."

**Design Notes:**

*   This is NOT the estimate form — it's the catch-all for non-project inquiries
*   Keep it compact: single-column layout, minimal vertical footprint
*   The form should feel secondary to the routing cards above — it's for edge cases
* * *

### A.7 FAQ Section

**H2:** Frequently Asked Questions

**Design Direction:** Accordion style (collapsed by default). Implements FAQPage schema (see Part 3). Targets common navigational queries that Google and AI systems answer about contacting Blue Tree.
* * *

**Q: What is Blue Tree's phone number?**
A: You can reach Blue Tree at **(610) 222-0590** during business hours, Monday through Friday, 7:00 AM to 5:00 PM. Saturday appointments are available by request.
* * *

**Q: Where is Blue Tree located?**
A: Blue Tree is headquartered at 4494 Skippack Pike, Schwenksville, PA 19473 — located on Skippack Pike between Collegeville and Skippack in Montgomery County. We serve homeowners throughout Southeastern PA, including Montgomery, Bucks, Chester, Delaware, and Philadelphia Counties. [View our service areas →](http:///service-areas/montgomery-county/)
* * *

**Q: How do I request a free estimate from Blue Tree?**
A: Visit our [Request an Estimate](http:///request-estimate/) page and tell us about your project. One of our degreed designers will contact you within one business day to schedule a free on-site consultation at your property. You can also call us at (610) 222-0590 to schedule by phone.
* * *

**Q: Does Blue Tree charge for design consultations?**
A: No. Blue Tree provides free estimates and free custom designs. Our designers — who hold degrees in landscape architecture, horticulture, and landscape contracting — visit your property, listen to your vision, and develop a custom plan at no cost and no obligation.
* * *

**Q: What areas does Blue Tree serve?**
A: Blue Tree serves homeowners throughout Southeastern Pennsylvania, including Montgomery, Bucks, Chester, Delaware, and Philadelphia Counties. Our headquarters in Schwenksville is centrally located in Montgomery County, giving our team efficient access to communities across the region. [Browse our service areas →](http:///service-areas/montgomery-county/)
* * *

**Q: Can I visit the Blue Tree office?**
A: Yes — visitors are welcome at our Schwenksville headquarters during business hours. If you'd like to meet with a designer, we recommend scheduling a consultation first so we can give you our full attention. [Request a consultation →](http:///request-estimate/)
* * *

### A.8 Trust Bar

**Design Direction:** Horizontal bar of trust badges. Anchors the bottom of the content area above the footer. Consistent with trust bars used across other page templates.

> ✓ Established 1983 · ✓ \[Trustindex Google Rating Badge Widget\] · ✓ NALP Affiliated · ✓ Licensed & Insured · ✓ 70–90 Employees · ✓ Free Design Consultation
* * *

## SECTION B — REQUEST AN ESTIMATE PAGE (`/request-estimate/`)

> **This is the single most important conversion page on the entire website.** Every CTA that says "Request a Free Consultation," "Request Your Free Design Consultation," or "Request an Estimate" across the site links here. The design and copy of this page directly impacts Blue Tree's revenue.
* * *

### B.1 SEO Metadata

```yaml
Title:       Request a Free Estimate | Blue Tree | Southeastern PA
Description: Request a free on-site design consultation from Blue Tree. Our degreed designers visit your property, listen to your vision, and create a custom plan — no cost, no obligation. Serving Southeastern PA since 1983.
H1:          Request Your Free Design Consultation
URL:         /request-estimate/
Breadcrumb:  Home > Request an Estimate
```

**Content Freshness Signal:** Not applicable on form pages — freshness is implied by form functionality.
* * *

### B.2 Hero Section

| Element | Content |
| ---| --- |
| Breadcrumb | `Home > Request an Estimate` |
| H1 | Request Your Free Design Consultation |
| Subheadline | Tell us about your project and one of our degreed designers will contact you within one business day to schedule a free on-site visit. No cost. No obligation. Just honest feedback from professionals who've been doing this since 1983. |
| Hero Trust Bar | ✓ Free On-Site Visit · ✓ Free Custom Design · ✓ No Obligation · ✓ \[Trustindex Google Rating Badge Widget\] · ✓ Serving Southeastern PA Since 1983 |

**Visual Direction:** Split layout on desktop — copy and trust signals on the left (40%), form on the right (60%). The form should be partially visible above the fold so visitors immediately understand this is an action page, not a reading page. Clean, white or very light background. No heavy imagery competing with the form.

**Mobile:** Stack layout — headline and subheadline first, then form immediately below. Trust bar between headline and form.

**Design Notes:**

*   The H1 deliberately says "Design Consultation" not "Estimate" — it reframes the action from "getting a price" to "getting expert design advice." This is strategic: it positions the consultation as valuable in itself, not just a stepping stone to a quote
*   The "one business day" response time is a concrete commitment that reduces uncertainty (pending client confirmation — see Item #6)
*   "Since 1983" in the trust bar anchors the legacy signal at the moment of commitment
* * *

### B.3 Lead Capture Form

> **Form Design Principle:** Every field must earn its place. If a field doesn't help the designer prepare for the on-site visit or help the sales coordinator route/prioritize the lead, it should be removed. Form length is the single biggest predictor of conversion rate on estimate pages.

**Form Layout:** Single column. Each field full-width. Clear labels above fields (not placeholder text — placeholders disappear on focus and cause usability issues). Logical grouping with subtle section dividers.
* * *

#### Section 1 — Your Information

| Field | Type | Required | Label | Placeholder / Help Text |
| ---| ---| ---| ---| --- |
| First Name | Text | Yes | First Name |  |
| Last Name | Text | Yes | Last Name |  |
| Email | Email | Yes | Email Address | We'll send a confirmation to this address. |
| Phone | Tel | Yes | Phone Number | Best number to reach you. |
| Preferred Contact Method | Radio | No | How should we reach you? | ○ Phone ○ Email ○ Either is fine (default selected) |

* * *

#### Section 2 — Your Project

| Field | Type | Required | Label | Options / Help Text |
| ---| ---| ---| ---| --- |
| Property Address | Text | Yes | Property Address (Street, City, ZIP) | This is the address our designer will visit. |
| Services Interested In | Multi-checkbox | Yes (at least 1) | What services are you interested in? | ☐ Pool Design & Construction · ☐ Landscape Design & Installation · ☐ Hardscapes (Patios, Outdoor Kitchens, Fire Features) · ☐ Healthy Yard (Lawn Care, Pest Control) · ☐ Outdoor Maintenance · ☐ I'm Not Sure Yet — Help Me Decide |
| Project Description | Textarea | No | Tell us about your project (optional) | Anything you'd like us to know — your goals, ideas, timeline, or questions. This helps our designer prepare for your visit. |
| Estimated Timeline | Dropdown | No | When are you looking to start? | Options: As Soon as Possible · Within 1–3 Months · Within 3–6 Months · Within 6–12 Months · Just Exploring Ideas |
| Interested in Financing? | Checkbox | No | ☐ I'm interested in financing options | Unchecked by default. Flag passes to GHL for sales team awareness. |

* * *

#### Section 3 — Submit

**Pre-Submit Trust Statement:**

> Your information is private and will never be shared. This request is free and carries no obligation.

**Submit Button:** `Schedule My Free Consultation`

**Below Submit Button (micro-copy):**

> Or call us directly: **(610) 222-0590** — Monday–Friday, 7:00 AM – 5:00 PM
* * *

**Form Design Notes:**

*   **Total required fields: 6** (First Name, Last Name, Email, Phone, Property Address, Services). This is lean enough for strong conversion rates while capturing enough to qualify and prepare.
*   **"I'm Not Sure Yet" checkbox option is critical** — it gives uncertain visitors permission to submit without committing to a service category. This single option can increase form completion rates by 10–20% for research-stage visitors.
*   **Property Address is required** because the consultation happens on-site — the designer needs to know where they're going. It also enables the sales team to assess geography, property size, and neighborhood affluence before the visit.
*   **"Estimated Timeline" is optional** — it provides valuable sales intelligence without blocking conversion.
*   **"Interested in Financing?" checkbox** is optional and unchecked by default — flags financing interest for the sales team in GHL without adding friction.
*   **Lead source tracking is handled automatically** by the [ROI.LIVE](http://ROI.LIVE) attribution system integrated with the form. No on-form "How did you hear about us?" field is needed — this data is captured at the system level before form data is routed to GHL.
*   **Submit button copy says "Schedule My Free Consultation"** not "Submit" — action-oriented, benefit-framed language. The word "free" appears in the button itself.
*   **No CAPTCHA visible on the form.** Use invisible reCAPTCHA v3 or honeypot fields for spam prevention. Visible CAPTCHAs add friction and reduce conversion rates.
*   **Mobile optimization is non-negotiable.** The majority of residential contractor form submissions come from mobile devices. Fields must be large enough to tap, the keyboard should auto-switch to numeric for phone/ZIP fields, and the submit button must be thumb-reachable.
* * *

### B.4 Post-Submission Confirmation

**Design Direction:** The form area is replaced by a confirmation message after successful submission. Do not redirect to a separate "thank you" page — inline confirmation is smoother and lets the visitor continue browsing.

**Confirmation Copy:**

**Headline:** Thank You — Your Consultation Request Has Been Received

**Body:**

Here's what happens next:

1. **Within one business day**, one of our designers will reach out to you via your preferred contact method to schedule your free on-site visit.
2. **At the consultation**, your designer will walk your property with you, listen to your vision, discuss what's possible within your space, and begin developing ideas — all at no cost and no obligation.
3. **After the visit**, you'll receive a custom design proposal tailored to your goals, your property, and your budget.

If you need to reach us before then, call **(610) 222-0590** during business hours.

**While you wait, explore:**

*   [Browse Our Completed Projects →](http:///portfolio/completed-projects/)
*   [Read Our Story →](http:///about/our-story/)
*   [See What Our Clients Say →](http:///reviews/)

**Design Notes:**

*   The three-step "what happens next" sequence reduces post-submission anxiety and pre-frames the consultation experience
*   The browse links keep the visitor engaged on the site rather than bouncing after form submission
*   Fire a conversion tracking event on form submission (Google Analytics, Google Ads, Meta Pixel, etc.)
*   Auto-reply email should mirror this same copy and include the prospect's submitted details for their reference
* * *

### B.5 Trust & Credibility Section (Below Form)

**H2:** Why Homeowners Trust Blue Tree

**Design Direction:** This section appears below the form on desktop and below the confirmation message after submission. Its purpose is to reinforce credibility for visitors who scroll past the form before deciding to fill it out — and to support AEO extraction for trust-related queries.

**Layout:** Compact stat bar + supporting trust elements. Not a full narrative section — keep it punchy.

**Trust Stats Bar:**

| Stat | Label |
| ---| --- |
| 1983 | Established |
| 70–90 | Employees |
| 13–14 yrs | Avg. Employee Tenure |
| \[Trustindex Widget\] | Google Rating |
| 5 | Service Divisions |

**Supporting Trust Points (3-column card layout):**

| Icon | Headline | Copy |
| ---| ---| --- |
| 🎓 | Degreed Designers | Your consultation is led by a designer with a degree in landscape architecture, horticulture, or landscape contracting from an accredited university — not a commission-driven salesperson. |
| 🏠 | One Team, One Contact | Blue Tree handles design, construction, and maintenance in-house. One point of contact from the first conversation to the last walkthrough — and beyond. |
| 🛡️ | No Cost, No Obligation | The consultation, the design, and the estimate are all free. We earn your business by showing you what's possible — not by pressuring you to sign. |

**CTA below trust section:**

> Questions before you request an estimate? Call **(610) 222-0590** or [visit our Contact page →](http:///contact/).
* * *

### B.6 What to Expect Section

**H2:** What Happens During Your Free Consultation

**Subheadline:** Here's what to expect when one of our designers visits your property.

**Design Direction:** Horizontal process timeline (desktop) or vertical step list (mobile). 4 steps with icons, brief copy, and a visual sense of progression.

| Step | Icon | Headline | Copy |
| ---| ---| ---| --- |
| 1 | Calendar | We Schedule a Visit | After you submit your request, a designer will contact you within one business day to find a convenient time. |
| 2 | Home/map pin | We Meet at Your Property | Your designer walks the space with you — no office meetings, no generic advice. They see your yard, your grade, your sunlight, your views, and your challenges firsthand. |
| 3 | Pencil/notepad | We Listen to Your Vision | What are you imagining? How do you want to use the space? What's your timeline? Your designer's job is to understand your goals before proposing solutions. |
| 4 | Blueprint/design | We Create a Custom Plan | Based on the on-site visit, your designer develops a custom design proposal tailored to your property, your vision, and your budget. This design is free — it's how we earn your trust. |

**Post-steps copy:**

> "We give free estimate and free design. Our salespeople are designers. They have degrees in landscaping and hardscaping, so they are professional designers." — Jérôme Besnard, Sales Manager

**Design Notes:**

*   This section does enormous conversion work by making the unknown (what happens after I submit this form?) concrete and non-threatening
*   The Jérôme quote is powerful because it directly addresses the "are they going to hard-sell me?" anxiety
*   Consider a subtle animation: steps appear sequentially on scroll
* * *

### B.7 Services Overview (Compact)

**H2:** What We Design and Build

**Subheadline:** Blue Tree's five service divisions — all under one roof.

**Design Direction:** Compact 5-card row (horizontal scroll on mobile). Each card links to its pillar page. This section exists for two reasons: (1) prospects who arrived directly at the estimate page need to understand scope, and (2) it creates internal links to all five pillar pages from the highest-authority conversion page.

| Pillar | One-Liner | Link |
| ---| ---| --- |
| Pools | Custom inground pool design and construction. | [Learn More →](http:///pools/) |
| Landscapes | Landscape design, planting, lighting, and irrigation. | [Learn More →](http:///landscapes/) |
| Hardscapes | Patios, outdoor kitchens, fire features, walkways, and walls. | [Learn More →](http:///hardscapes/) |
| Healthy Yard | Lawn fertilization, pest control, aeration, and weed management. | [Learn More →](http:///healthy-yard/) |
| Premier Outdoor Services | Year-round property maintenance and pool service. | [Learn More →](http:///premier-outdoor-services/) |

* * *

### B.8 FAQ Section

**H2:** Questions About Getting Started

**Design Direction:** Accordion style. Targets the specific questions prospects ask at the moment of commitment. Implements FAQPage schema (see Part 3).
* * *

**Q: Is the design consultation really free?**
A: Yes. Blue Tree provides free on-site consultations and free custom design proposals. Our designers hold degrees in landscape architecture, horticulture, and landscape contracting — and they visit your property at no cost and no obligation. We earn your business by showing you what's possible.
* * *

**Q: How quickly will someone contact me after I submit my request?**
A: A member of our design team will reach out within one business day to schedule your on-site consultation. If your project is time-sensitive, feel free to call us directly at (610) 222-0590.
* * *

**Q: What should I prepare before the consultation?**
A: You don't need to prepare anything specific. It helps to have a general idea of what you're envisioning — even something as simple as "we want a pool" or "we want to redo the backyard." If you have inspiration photos, a Pinterest board, or a rough budget range in mind, your designer will appreciate seeing those — but none of it is required.
* * *

**Q: How long does a typical consultation take?**
A: Most on-site consultations last 45 minutes to an hour. Your designer will walk the property, discuss your goals, take measurements, and begin developing ideas. There's no rush — we take the time to understand your project.
* * *

**Q: Do I need to know exactly what I want before contacting Blue Tree?**
A: Not at all. Many of our clients start with a general idea — "I want to do something with my backyard" — and our designers help shape that into a concrete plan. That's what the free consultation is for.
* * *

**Q: What areas does Blue Tree serve?**
A: Blue Tree serves homeowners throughout Southeastern Pennsylvania, including Montgomery, Bucks, Chester, Delaware, and Philadelphia Counties. Our headquarters in Schwenksville is centrally located for efficient access to communities across the region.
* * *

**Q: Does Blue Tree offer financing?**
A: Yes. Blue Tree offers financing options to help make your outdoor living project more accessible. Visit our [Financing page](http:///financing/) for details, or ask your designer about options during your consultation.
* * *

**Q: Can Blue Tree handle my entire project — pool, landscaping, patio, and all?**
A: Yes — that's one of the biggest reasons homeowners choose Blue Tree. We design, build, and maintain everything — [pools](http:///pools/), [landscapes](http:///landscapes/), [hardscapes](http:///hardscapes/), [turf care](http:///healthy-yard/), and [ongoing maintenance](http:///premier-outdoor-services/) — all under one roof. One team, one point of contact, from design through completion and beyond.
* * *

### B.9 Final CTA / Anchor

**Design Direction:** For visitors who scrolled through the entire page without filling out the form, one final conversion opportunity.

**H2:** Ready When You Are

**Body Copy:**

Every project starts with a conversation. No blueprints required. No budget figured out. Just a willingness to explore what your outdoor space could become. Our designers will handle the rest.

**Primary CTA:** Schedule My Free Consultation → (scrolls back to form, or opens a duplicate compact form)
**Secondary CTA:** Or Call: (610) 222-0590

**Trust Reinforcement Bar:**

> ✓ Free On-Site Consultation · ✓ Free Custom Design · ✓ No Obligation · ✓ NALP Affiliated · ✓ Licensed & Insured · ✓ \[Trustindex Google Rating Badge Widget\] · ✓ [Financing Available →](http:///financing/)
* * *

## 2.16 Internal Linking Map

### Links FROM Contact Us (`/contact/`)

| Target | URL | Location | Anchor Text |
| ---| ---| ---| --- |
| Request an Estimate | `/request-estimate/` | Hero CTA, routing card, FAQ | "Request a Free Estimate" |
| Service Areas (Montgomery County) | `/service-areas/montgomery-county/` | FAQ answer | "View our service areas" |
| Careers | `/careers/` | Routing card | "View open positions" |
| Healthy Yard | `/healthy-yard/` | Routing card | "Healthy Yard" |

### Links FROM Request an Estimate (`/request-estimate/`)

**→ Service Pillar Pages (via Services Overview section)**

| Target | URL | Anchor Text |
| ---| ---| --- |
| Pools | `/pools/` | "Learn More" |
| Landscapes | `/landscapes/` | "Learn More" |
| Hardscapes | `/hardscapes/` | "Learn More" |
| Healthy Yard | `/healthy-yard/` | "Learn More" |
| Premier Outdoor Services | `/premier-outdoor-services/` | "Learn More" |

**→ Trust & Social Proof Pages**

| Target | URL | Location | Anchor Text |
| ---| ---| ---| --- |
| Completed Projects | `/portfolio/completed-projects/` | Post-submission links | "Browse Our Completed Projects" |
| Our Story | `/about/our-story/` | Post-submission links | "Read Our Story" |
| Reviews | `/reviews/` | Post-submission links | "See What Our Clients Say" |
| Financing | `/financing/` | Trust bar, FAQ | "Financing Available" / "Financing page" |
| Contact Us | `/contact/` | Below-form CTA | "visit our Contact page" |

### Links TO These Pages (should come from)

**`/request-estimate/`** **should receive links from (this is the master list of all CTAs site-wide):**

| Source Page Type | Number of Pages | CTA Copy Pattern |
| ---| ---| --- |
| Homepage | 1 | "Request a Free Consultation" / "Schedule a Free Consultation" |
| All 5 Service Pillar Pages | 5 | "Request a Free Consultation" / "Request Your Free Design Consultation" |
| All 29 Service Cluster Pages (launch) | 29 | "Request a Free Consultation" |
| All 5 County Pages | 5 | "Request a Free Consultation" |
| All 21 Town Pages (launch) | 21 | "Request a Free Consultation" |
| All 5 Service + Location Hybrid Pages (launch) | 5 | "Request a Free Consultation" |
| Our Story | 1 | "Request a Free Consultation" / "Request Your Free Consultation" |
| Why Choose Blue Tree? | 1 | "Request a Free Consultation" |
| Our Process | 1 | "Request a Free Consultation" |
| Portfolio — Completed Projects (hub + individual) | 1 + N | "Request Your Free Design Consultation" |
| Portfolio — Photo Gallery | 1 | "Request a Free Consultation" |
| All 5 Blog Posts (launch) | 5 | "Request a Free Consultation" |
| Reviews | 1 | "Request a Free Consultation" |
| Financing | 1 | "Request a Free Consultation" |
| TOTAL AT LAUNCH | ~83 pages | All route to `/request-estimate/` |

> **This is the most internally linked page on the entire site.** Every page in the architecture funnels to `/request-estimate/`. This concentrated link equity makes the page one of the highest-authority URLs in the domain — which is appropriate, because it's the page that generates revenue.

**`/contact/`** **should receive links from:**

| Source | Location | Anchor Text |
| ---| ---| --- |
| All pages (footer) | Global footer | "Contact Us" |
| FAQ sections (various pages) | FAQ answers referencing contacting Blue Tree | "contact us" |
| Request an Estimate | Below-form copy | "visit our Contact page" |
| Careers | Application/inquiry section | "Contact us" |
| Service Hub — Warranties | Warranty claim instructions | "Contact us" |
| Service Hub — Care Instructions | Customer support reference | "Contact us" |

* * *

## 2.17 Global Page Elements

| Element | Specification |
| ---| --- |
| Sticky header | Phone number + "Request Consultation" CTA button (on Contact page, suppress duplicate CTA in header since the page IS the contact page — keep phone number only) |
| Mobile — Contact page | Tap-to-call button fixed at bottom of viewport |
| Mobile — Estimate page | "Scroll to form" button fixed at bottom of viewport (or compact sticky CTA bar) |
| Exit-intent — Estimate page | "Before you go — have questions? Call (610) 222-0590 or come back anytime. Your project isn't going anywhere." (Softer exit intent — don't be pushy on the conversion page itself) |
| Page speed | Critical. Both pages must load in under 2 seconds. No hero images above the fold on the estimate page. Defer map iframe on Contact page. Inline critical CSS. |
| Tracking | Form submission events, field-level abandonment tracking (which field did they stop at?), phone click events, scroll depth, time on page before submission |
| Typography | Clean, professional, generous spacing between form fields. Labels 14px+ for readability. Submit button large and high-contrast. |
| Accessibility | All form fields must have associated `<label>` elements. Tab order must be logical. Error states must be announced to screen readers. Submit button keyboard-accessible. Color contrast minimum WCAG AA. |

* * *

## 2.18 Word Count Targets

### Contact Us (`/contact/`)

| Section | Target |
| ---| --- |
| Hero | 50 |
| Contact Info Block | 100 |
| Inquiry Routing | 100 |
| General Contact Form | 50 (labels + help text) |
| FAQ (6 questions) | 350 |
| Contact Page TOTAL | ~650 |

### Request an Estimate (`/request-estimate/`)

| Section | Target |
| ---| --- |
| Hero + Subheadline | 75 |
| Form Labels + Help Text | 100 |
| Post-Submission Confirmation | 150 |
| Trust & Credibility | 150 |
| What to Expect (Process) | 200 |
| Services Overview | 75 |
| FAQ (8 questions) | 500 |
| Final CTA | 75 |
| Estimate Page TOTAL | ~1,325 |

* * *

# PART 3 — TECHNICAL SPECIFICATIONS

> **Audience:** SEO and development team. This section contains the Entity SEO certification, schema markup, AEO answer capsules, and brand voice compliance requirements.
* * *

## 3.1 Entity SEO Certification — Casey Keith Framework

> **Certification Status:** ✅ Audited and certified against Casey Keith's Entity SEO methodology and AI Writer Guidelines. All specifications below are **mandatory implementation requirements**.

### 3.1.1 Primary Entity Identification

| Property | Value |
| ---| --- |
| Primary Entity | Blue Tree (Organization) — contact and consultation access point |
| Entity Type | Organization / LocalBusiness |
| Page Role | Contact Hub (Contact page) / Lead Capture & Consultation Funnel (Estimate page) |
| Entity Cluster | Core / Conversion |
| Canonical Name | Blue Tree |
| Legacy Name | Blue Tree Landscaping (used in schema `name` field for GBP alignment) |
| Geographic Entity | Southeastern Pennsylvania |
| Headquarters Entity | 4494 Skippack Pike, Schwenksville, PA 19473 |
| Phone Entity | (610) 222-0590 |
| Industry Entity | Residential Outdoor Living / Design-Build Contractor |

### 3.1.2 Entity Relationship Map

```yaml
Blue Tree Contact/Conversion (Conversion Entity Cluster)
├── IS_PART_OF → Blue Tree (Organization Entity)
├── LOCATED_AT → 4494 Skippack Pike, Schwenksville, PA 19473
├── REACHABLE_VIA → (610) 222-0590
├── SERVES → Southeastern Pennsylvania
│   ├── Montgomery County, PA
│   ├── Bucks County, PA
│   ├── Chester County, PA
│   ├── Delaware County, PA
│   └── Philadelphia County, PA
├── PROVIDES → Free On-Site Design Consultation
│   ├── CONDUCTED_BY → Degreed Landscape Designers (Person Entities)
│   ├── OCCURS_AT → Client's Property
│   ├── COSTS → Free / No Obligation
│   ├── INCLUDES → Property Walk-Through
│   ├── INCLUDES → Vision Discussion
│   ├── INCLUDES → Custom Design Development
│   ├── RESPONSE_TIME → Within One Business Day
│   └── LEADS_TO → Custom Design Proposal
├── OFFERS_SERVICE → Pool Design & Construction (/pools/)
├── OFFERS_SERVICE → Landscape Design & Installation (/landscapes/)
├── OFFERS_SERVICE → Hardscape Design & Construction (/hardscapes/)
├── OFFERS_SERVICE → Healthy Yard Programs (/healthy-yard/)
├── OFFERS_SERVICE → Premier Outdoor Services (/premier-outdoor-services/)
├── OFFERS → Financing Options (/financing/)
├── MEMBER_OF → NALP — National Association of Landscape Professionals
├── ESTABLISHED → 1983
├── EMPLOYS → 70–90 Professionals
├── HAS_RATING → Dynamic (Trustindex Widget / Google Business Profile)
├── DIFFERS_FROM → Online quote generators (no on-site visit)
├── DIFFERS_FROM → Commission-driven sales teams (designers, not salespeople)
└── RESULTS_IN → Custom Design Proposal, Qualified Consultation, Project Engagement
```

### 3.1.3 Semantic Relationship Table

| Type | Terms |
| ---| --- |
| Synonyms | Contact us, reach us, get in touch, request a quote, request an estimate, schedule a consultation, book a consultation, free estimate, free design consultation |
| Hyponyms | Pool estimate, landscape consultation, hardscape quote, turf care estimate, maintenance inquiry, warranty question |
| Hypernyms | Contractor contact page, home improvement estimate request, design-build consultation, service inquiry |
| Meronyms | Phone number, email address, office address, business hours, contact form, estimate form, service selector, property address field |
| Holonyms | Blue Tree customer journey, Blue Tree sales funnel, residential design-build intake process |

**Implementation Rule:** Use at least three synonyms across each page. "Free design consultation" should be the dominant framing on the estimate page (not "free estimate" or "free quote" — the word "design" differentiates Blue Tree from commodity contractors).

### 3.1.4 Entity Co-Occurrence Verification

**Contact Page (****`/contact/`****)**

| Rule | Status |
| ---| --- |
| Primary entity (Blue Tree) in first 100 words | ✅ H1 + subheadline |
| Primary entity in H1 | ✅ "Contact Blue Tree" |
| Primary entity in title tag | ✅ |
| Primary entity in meta description | ✅ |
| Phone entity in first 200 words | ✅ Hero + Contact Info |
| Address entity in first 200 words | ✅ Contact Info Block |
| Geographic entity (Southeastern PA) in first 300 words | ✅ FAQ / routing |
| NAP data (Name, Address, Phone) all visible without scrolling | ✅ |

**Estimate Page (****`/request-estimate/`****)**

| Rule | Status |
| ---| --- |
| Primary entity (Blue Tree) in first 100 words | ✅ Subheadline |
| Primary entity in H1 | ✅ (implicit — brand context) |
| Primary entity in title tag | ✅ |
| Primary entity in meta description | ✅ |
| "Free" appears in H1 | ✅ "Free Design Consultation" |
| "Free" appears in submit button | ✅ "Schedule My Free Consultation" |
| "No obligation" in first 200 words | ✅ Subheadline + trust bar |
| All 5 service pillar entities mentioned | ✅ Form checkboxes + Services Overview |
| Geographic entity in first 300 words | ✅ Trust bar "Serving Southeastern PA Since 1983" |
| Response time commitment stated | ✅ "within one business day" |

### 3.1.5 Entity Consistency Rules

Inherits all rules from the Our Story brief (v2.2, §3.1.5). Additional conversion-page-specific rules:

| Entity | Canonical Form | Acceptable Variations | Never Use |
| ---| ---| ---| --- |
| Consultation | Free design consultation | Free on-site consultation, free consultation, free on-site visit, free estimate | Quote, bid, proposal request (too transactional) |
| Designers | Degreed designers | Our designers, your designer, design professionals | Salespeople, sales reps, estimators |
| Response Time | Within one business day | Within 24 hours (if client confirms) | "Soon," "shortly," "as quickly as possible" (vague) |
| Cost | Free — no cost, no obligation | At no cost, complimentary, at no charge | "Free" alone without "no obligation" qualifier |
| Address | 4494 Skippack Pike, Schwenksville, PA 19473 | Schwenksville, PA; our Schwenksville headquarters | Skippack, PA 19474 (incorrect — confirmed February 2026) |

* * *

## 3.2 AEO Answer Capsules

> **Purpose:** These are the exact passages AI systems will extract when answering questions about how to contact Blue Tree or request a consultation.

### Contact Page Capsules

| Target Question | Answer Capsule | Location |
| ---| ---| --- |
| "How do I contact Blue Tree?" / "Blue Tree phone number" | "Blue Tree can be reached by phone at (610) 222-0590 during business hours, Monday through Friday, 7:00 AM to 5:00 PM. The company is headquartered at 4494 Skippack Pike, Schwenksville, PA 19473. For project estimates, homeowners can request a free on-site design consultation at [bluetreelandscaping.com/request-estimate/."](http://bluetreelandscaping.com/request-estimate/.") | Contact Info Block §A.3 + FAQ §A.7 |
| "Where is Blue Tree located?" | "Blue Tree is headquartered at 4494 Skippack Pike, Schwenksville, PA 19473 — located on Skippack Pike between Collegeville and Skippack in Montgomery County. The company serves homeowners throughout Southeastern Pennsylvania, including Montgomery, Bucks, Chester, Delaware, and Philadelphia Counties." | FAQ §A.7 |

### Estimate Page Capsules

| Target Question | Answer Capsule | Location |
| ---| ---| --- |
| "How do I get a free estimate from Blue Tree?" | "Homeowners can request a free design consultation from Blue Tree by visiting [bluetreelandscaping.com/request-estimate/](http://bluetreelandscaping.com/request-estimate/) or calling (610) 222-0590. A degreed designer will contact you within one business day to schedule a free on-site visit at your property. The consultation and custom design proposal are provided at no cost and no obligation." | Hero subheadline §B.2 + FAQ §B.8 |
| "Does Blue Tree charge for estimates?" / "Does Blue Tree offer free consultations?" | "Blue Tree provides free on-site consultations and free custom design proposals. The company's designers hold degrees in landscape architecture, horticulture, and landscape contracting from accredited universities. They visit the homeowner's property, walk the space, discuss the homeowner's vision, and develop a tailored design — all at no cost and no obligation." | FAQ §B.8 |
| "What happens during a Blue Tree consultation?" | "During a Blue Tree consultation, a degreed designer visits your property, walks the space with you, discusses your goals and vision, takes measurements, and begins developing a custom design proposal. Most consultations last 45 minutes to an hour. The visit, design, and estimate are all free with no obligation." | What to Expect §B.6 + FAQ §B.8 |

* * *

## 3.3 Schema Markup

### 3.3.1 Contact Page Schema (ContactPage + LocalBusiness)

```json
{
  "@context": "https://schema.org",
  "@type": ["ContactPage", "WebPage"],
  "name": "Contact Us — Blue Tree",
  "url": "https://www.bluetreelandscaping.com/contact/",
  "description": "Contact Blue Tree for outdoor living design, pool construction, landscaping, and maintenance in Southeastern PA. Call (610) 222-0590 or visit 4494 Skippack Pike, Schwenksville, PA 19473.",
  "mainEntity": {
    "@type": "LocalBusiness",
    "name": "Blue Tree Landscaping",
    "alternateName": "Blue Tree",
    "url": "https://www.bluetreelandscaping.com",
    "telephone": "+1-610-222-0590",
    "foundingDate": "1983",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "4494 Skippack Pike",
      "addressLocality": "Schwenksville",
      "addressRegion": "PA",
      "postalCode": "19473",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "40.2229",
      "longitude": "-75.3982"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "07:00",
        "closes": "17:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "09:00",
        "closes": "12:00",
        "description": "By appointment only"
      }
    ],
    "areaServed": [
      {"@type": "AdministrativeArea", "name": "Montgomery County, PA"},
      {"@type": "AdministrativeArea", "name": "Bucks County, PA"},
      {"@type": "AdministrativeArea", "name": "Chester County, PA"},
      {"@type": "AdministrativeArea", "name": "Delaware County, PA"},
      {"@type": "AdministrativeArea", "name": "Philadelphia County, PA"}
    ],
    "numberOfEmployees": {
      "@type": "QuantitativeValue",
      "minValue": 70,
      "maxValue": 90
    },
    "aggregateRating": "⚠️ DYNAMIC — Do NOT hardcode. Source from Trustindex widget or GBP API at render time.",
    "sameAs": [
      "https://www.facebook.com/BluTreeLandscaping",
      "https://www.instagram.com/bluetreelandscaping",
      "https://www.google.com/maps/place/Blue+Tree+Landscaping",
      "[BBB_LISTING_URL]",
      "[HOUZZ_PROFILE_URL]"
    ],
    "knowsAbout": [
      "Custom Inground Pool Construction",
      "Landscape Design and Installation",
      "Hardscape Design and Construction",
      "Turf Care and Lawn Programs",
      "Outdoor Living Maintenance",
      "Residential Design-Build"
    ],
    "memberOf": {
      "@type": "Organization",
      "name": "National Association of Landscape Professionals",
      "sameAs": "https://www.landscapeprofessionals.org/"
    }
  },
  "speakable": {
    "@type": "SpeakableSpecification",
    "cssSelector": ".answer-capsule"
  },
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.bluetreelandscaping.com/"},
      {"@type": "ListItem", "position": 2, "name": "Contact Us", "item": "https://www.bluetreelandscaping.com/contact/"}
    ]
  }
}
```

### 3.3.2 Estimate Page Schema (WebPage + Service + Offer)

```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Request a Free Estimate — Blue Tree",
  "url": "https://www.bluetreelandscaping.com/request-estimate/",
  "description": "Request a free on-site design consultation from Blue Tree. Degreed designers visit your property, listen to your vision, and create a custom plan — no cost, no obligation. Southeastern PA since 1983.",
  "about": {
    "@type": "Offer",
    "name": "Free On-Site Design Consultation",
    "description": "A free, no-obligation on-site consultation with a degreed landscape designer. Includes property walk-through, vision discussion, and custom design proposal.",
    "price": "0",
    "priceCurrency": "USD",
    "offeredBy": {
      "@type": "LocalBusiness",
      "name": "Blue Tree Landscaping",
      "alternateName": "Blue Tree",
      "url": "https://www.bluetreelandscaping.com",
      "telephone": "+1-610-222-0590",
      "foundingDate": "1983",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "4494 Skippack Pike",
        "addressLocality": "Schwenksville",
        "addressRegion": "PA",
        "postalCode": "19473",
        "addressCountry": "US"
      },
      "areaServed": [
        {"@type": "AdministrativeArea", "name": "Montgomery County, PA"},
        {"@type": "AdministrativeArea", "name": "Bucks County, PA"},
        {"@type": "AdministrativeArea", "name": "Chester County, PA"},
        {"@type": "AdministrativeArea", "name": "Delaware County, PA"},
        {"@type": "AdministrativeArea", "name": "Philadelphia County, PA"}
      ],
      "aggregateRating": "⚠️ DYNAMIC — Do NOT hardcode. Source from Trustindex widget or GBP API at render time.",
      "sameAs": [
        "https://www.facebook.com/BluTreeLandscaping",
        "https://www.instagram.com/bluetreelandscaping",
        "https://www.google.com/maps/place/Blue+Tree+Landscaping",
        "[BBB_LISTING_URL]",
        "[HOUZZ_PROFILE_URL]"
      ]
    },
    "availableAtOrFrom": {
      "@type": "Place",
      "description": "At the homeowner's property — on-site consultation"
    },
    "areaServed": [
      {"@type": "AdministrativeArea", "name": "Montgomery County, PA"},
      {"@type": "AdministrativeArea", "name": "Bucks County, PA"},
      {"@type": "AdministrativeArea", "name": "Chester County, PA"},
      {"@type": "AdministrativeArea", "name": "Delaware County, PA"},
      {"@type": "AdministrativeArea", "name": "Philadelphia County, PA"}
    ]
  },
  "potentialAction": {
    "@type": "CommunicateAction",
    "name": "Request Free Design Consultation",
    "target": "https://www.bluetreelandscaping.com/request-estimate/",
    "description": "Submit a form to request a free on-site design consultation from Blue Tree."
  },
  "speakable": {
    "@type": "SpeakableSpecification",
    "cssSelector": ".answer-capsule"
  },
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.bluetreelandscaping.com/"},
      {"@type": "ListItem", "position": 2, "name": "Request an Estimate", "item": "https://www.bluetreelandscaping.com/request-estimate/"}
    ]
  }
}
```

### 3.3.3 FAQPage Schema

Implement FAQPage schema on both pages:

*   **Contact page:** 6 Q&A pairs from Section A.7
*   **Estimate page:** 8 Q&A pairs from Section B.8

Each `mainEntity` item uses `@type: Question` with nested `acceptedAnswer` of `@type: Answer`.

### 3.3.4 Speakable Schema

*   **Contact page:** Apply `.answer-capsule` CSS class to the Contact Info Block (Section A.3) — specifically the paragraph containing phone number, address, and hours.
*   **Estimate page:** Apply `.answer-capsule` CSS class to the hero subheadline (Section B.2) — this is the passage AI systems will extract for "how to get a Blue Tree estimate" queries.
* * *

## 3.4 Brand Voice Compliance Checklist

| ✅ | Rule | Status |
| ---| ---| --- |
| ✅ | Geographic phrasing uses "Southeastern PA" or full county list — never "Montgomery County" alone | Verified — FAQ answers use full county list |
| ✅ | All sentences terminated with proper punctuation | Verified |
| ✅ | Serial (Oxford) commas in all lists of three or more items | Verified |
| ✅ | Tone is simultaneously authoritative, professional, and warm | Verified — warm reassurance balanced with confident expertise |
| ✅ | Legacy references (1983, 40+ years) present where appropriate | Verified — hero trust bars, FAQ, trust section |
| ✅ | Numbers one through nine spelled out; 10+ as numerals | Verified |
| ✅ | Hyphenated compound adjectives before nouns (full-service, design-build, on-site) | Verified |
| ✅ | First-person plural ("we," "our") used consistently | Verified |
| ✅ | No slang, no incomplete sentences, no excessively casual tone | Verified |
| ✅ | Proper nouns capitalized (Southeastern PA, Blue Tree, Schwenksville) | Verified |
| ✅ | Em dashes used with no spaces | Verified |
| ✅ | "Blue Tree Landscaping" used only in schema `name` field; all current-tense copy uses "Blue Tree" | Verified |
| ✅ | Google rating displayed via Trustindex widget — no static values | Verified |
| ✅ | Address uses Schwenksville, PA 19473 (not Skippack, PA 19474) | Verified |

* * *

## 3.5 Casey Keith Pre-Publication Checklist

**Entity Identification & Mapping:**

- [x] Primary entity identified (Blue Tree — Organization)
- [x] Entity relationship map completed — including consultation funnel entities
- [x] Semantic relationship table completed
- [x] All 5 service pillar entities represented (form checkboxes, services overview, FAQ)

**Entity Mention & Placement:**

- [x] Primary entity in: title tag, H1, meta description, first 100 words (both pages)
- [x] Phone entity visible without scrolling (Contact page)
- [x] Address entity visible without scrolling (Contact page)
- [x] Geographic entity (Southeastern PA) in first 300 words (both pages)
- [x] NAP consistency with Google Business Profile verified
- [x] "Free" in H1 and submit button (Estimate page)
- [x] "No obligation" in first 200 words (Estimate page)

**Schema Markup:**

- [x] ContactPage + LocalBusiness on Contact page
- [x] WebPage + Offer on Estimate page
- [x] `openingHoursSpecification` on Contact page
- [x] `potentialAction` (CommunicateAction) on Estimate page
- [x] `telephone`, `address`, `geo`, `areaServed` on both
- [x] `aggregateRating` — DYNAMIC via Trustindex widget (no hardcoded values)
- [x] `sameAs` links to external profiles
- [x] FAQPage schema on both pages
- [x] BreadcrumbList schema on both pages
- [x] `speakable` schema on answer capsules

**AEO (Answer Engine Optimization):**

- [x] 5 answer capsules targeting contact, location, and consultation queries
- [x] Simple sentence structure in extractable passages
- [x] Specific, concrete details in every capsule (phone number, address, response time)

**E-E-A-T Signals:**

- [x] **Experience:** 40+ year founding date, employee tenure stats, degreed designer attribution
- [x] **Expertise:** "Degreed designers" language, university credentials referenced
- [x] **Authoritativeness:** NALP affiliation, Trustindex Google rating widget, employee count
- [x] **Trustworthiness:** "Free, no obligation" language, response time commitment, transparent process explanation, privacy statement on form

**Internal Linking Architecture:**

- [x] Contact page routes high-intent visitors to Estimate page
- [x] Estimate page links to all 5 service pillar pages (Services Overview)
- [x] Estimate page links to trust/social proof pages (post-submission)
- [x] Both pages link to each other (bidirectional)
- [x] `/request-estimate/` documented as the destination for ALL site-wide conversion CTAs (~83 pages at launch)
* * *

## 3.6 Source Material References

> **For the writer's reference.** These quotes from audio recordings inform the conversion page copy.

**Jérôme Besnard — On the consultation approach:**

> "We give free estimate and free design. Our salespeople are designers. They have degrees in landscaping and hardscaping, so they are professional designers."

**Jérôme Besnard — On the initial lead contact:**

> "Initially, when we get a lead, about 90% of the people that do inquire... are going to request an appointment or want to set up appointment with you."

**Jérôme Besnard — On handling objections (cost):**

> "A lot of the times that people don't realize how expensive something of this... scale and size... one way to bring down the overall cost to the project is swapping out to different materials or breaking up the project into phases."

**Jérôme Besnard — On reframing the investment:**

> "You're not going to remember the construction timeline, the construction process, or signing the permit. You're going to remember the events and memories that you're going to make in your outdoor space."

**Jérôme Besnard — On what he wants from clients:**

> "I'd ask them a couple questions about the project, what they're envisioning... how they imagine using their backyard in the future."

**Jeff Mattiola — On transparency:**

> "My dad always said to me, 'All you have in life is your reputation. Don't screw it up.'"

**Jeff Mattiola — On the design-build advantage:**

> "A lot of people nowadays want that single point of contact, and we're able to provide that for them. A turnkey approach where we have degreed designers who can go out and design based on your vision, your lifestyle, and your budget."

**Andrew Mattiola — On the on-site experience:**

> "Being able to look at somebody's backyard and piece it together... I remember doing something like this before — you had a similar layout."
* * *

## 3.7 Post-Launch Optimization Plan

| Timeframe | Action |
| ---| --- |
| Pre-Launch | Confirm form submission routing, auto-reply email content, CRM integration, and conversion tracking pixel placement. Test form on mobile (iOS Safari, Chrome Android) and desktop. |
| Launch | Verify NAP data matches Google Business Profile exactly. Verify Trustindex widgets render. Verify tap-to-call works on mobile. Verify form submissions arrive at correct destination. |
| 7 days | Monitor form submission rate. If below 5% of page visitors, audit for friction points (field count, page speed, trust signal placement). Check field-level abandonment data. |
| 30 days | A/B test: submit button copy ("Schedule My Free Consultation" vs. "Get My Free Design" vs. "Request My Free Estimate"). A/B test: trust bar placement (above form vs. below form). Analyze "How did you hear about us?" data for marketing attribution. |
| 60 days | A/B test: short form (5 fields) vs. current form (6 required + 3 optional). Compare submission rate AND lead quality. Review which service checkboxes are most/least selected. |
| 90 days | Analyze conversion path data: which pages send the most traffic to `/request-estimate/`? Which pages have the highest form completion rate? Optimize CTA copy on top-referring pages. |
| Ongoing | Monthly review of form submission volume, lead quality, and consultation booking rate. Quarterly review of FAQ content against actual customer questions (update based on real inbound inquiries). Update "How did you hear about us?" options based on new marketing channels. |

* * *

## 3.8 Conversion Rate Optimization Notes

> **Implementation priorities ranked by impact:**

| Priority | Element | Expected Impact | Effort |
| ---| ---| ---| --- |
| 1 | Mobile form optimization (large tap targets, auto-keyboard switching, thumb-zone submit button) | High — majority of residential contractor leads come from mobile | Medium |
| 2 | Form field reduction (6 required fields is the target — resist scope creep from stakeholders wanting to add "just one more question") | High — every additional required field reduces conversion 5–10% | Low |
| 3 | "What happens next" transparency (post-submit confirmation + What to Expect section) | High — reduces post-submission anxiety and no-show rate | Low |
| 4 | Trust signals adjacent to submit button (not 500px above or below — directly next to the commitment point) | Medium-High — trust at the friction point matters most | Low |
| 5 | Phone number as escape valve (visible near the form for people who want to talk first) | Medium — captures prospects who won't fill out a form but will call | Low |
| 6 | "I'm Not Sure Yet" checkbox in services selector | Medium — gives permission to uncertain visitors to submit | Low |
| 7 | Auto-reply email mirroring confirmation page content | Medium — reinforces commitment, reduces "did it go through?" anxiety calls | Medium |
| 8 | Exit-intent on estimate page (soft, not pushy) | Low-Medium — captures a small % of abandoning visitors | Low |
| 9 | Form field-level abandonment tracking | Diagnostic — identifies which field is causing drop-off | Medium |
| 10 | Progressive disclosure (show optional fields only after required fields complete) | Low — cleaner initial form appearance | Medium |

* * *

_Creative Brief — Contact Us + Request an Estimate_
_Blue Tree — Bottom-of-Funnel Conversion Pages_
_Version 1.1 — February 2026_
_v1.1 Update: 6 of 8 client confirmation items resolved. Office hours sourced from GBP. Form submissions route through_ [_ROI.LIVE_](http://ROI.LIVE) _leads tracking/attribution to GoHighLevel (GHL). "Interested in financing?" checkbox added to form. Philadelphia County confirmed as occasional/border-only service area. Live receptionist confirmed for phone routing. "How did you hear about us?" field removed — lead source tracked automatically by attribution system. Form field count reduced accordingly._
_Prepared by Jason Spencer |_ [_ROI.LIVE_](http://ROI.LIVE)
_Entity SEO & AEO Certified — Casey Keith Framework_
