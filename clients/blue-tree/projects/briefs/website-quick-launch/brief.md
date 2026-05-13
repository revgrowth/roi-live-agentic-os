---
project: website-quick-launch
status: active
level: 2
created: 2026-05-12
owner: Jason Spencer (ROI.LIVE)
client: Blue Tree Outdoor Living
target_launch: 2026-05-25 (week of)
internal_qa_target: 2026-05-22
---

# Website Quick Launch — 21 Core Pages

## Goal

Ship 21 production-ready core pages for Blue Tree's new website by **week of 2026-05-25**, with internal QA complete by **2026-05-22**. Pages must pass the agency Core Standards, the page-type SOPs, the Blue Tree editorial overlay (citation discipline, named review chain, hallucination catalog, YMYL protocol where applicable), and the v1.1 §18 compliance checklist before publish.

This is the "core skeleton" launch — the foundational pages every visitor lands on or navigates to before the pillar/cluster/location tree fills in. The remaining 58 pages of the 79-page Phase 1 launch (5 pillars + 28 clusters + 5 counties + 12 Tier 1 + 9 Tier 2) ship after the 21-page skeleton is live and stable.

## Scope — 21 pages

Mapped to sitemap-and-implementation-plan-v2.2.md.

| # | Page | URL | SOP | Schema (primary) |
|---|---|---|---|---|
| 1 | Homepage | `/` | Homepage SOP | LocalBusiness + Organization + WebSite |
| 2 | Portfolio — Photo Gallery | `/portfolio/` | Collection Page SOP | ImageGallery + CollectionPage |
| 3 | Portfolio — Completed Projects | `/portfolio/completed-projects/` | Collection Page SOP | CollectionPage + ItemList |
| 4 | Reviews & Testimonials | `/reviews/` | Collection Page SOP | Review + AggregateRating |
| 5 | Service Hub | `/service-hub/` | Collection Page SOP | CollectionPage |
| 6 | Service Hub — Warranties | `/service-hub/warranties/` | Service Page SOP (lite) | WebPage + FAQPage (warranties) |
| 7 | Service Hub — FAQs | `/service-hub/faqs/` | Core Standards | FAQPage |
| 8 | Service Hub — Care Instructions | `/service-hub/instructions/` | Core Standards | HowTo (per instruction) |
| 9 | Blog Hub | `/blog/` | Collection Page SOP | Blog + CollectionPage |
| 10 | About Us | `/about/` | Core Standards + about-page TBD | AboutPage + Organization |
| 11 | Our Story | `/about/our-story/` | Core Standards | AboutPage + Person (Jeff) |
| 12 | Meet the Team | `/about/team/` | Core Standards | AboutPage + ItemList (Person) |
| 13 | Why Choose Blue Tree? | `/about/why-choose-us/` | Core Standards | WebPage |
| 14 | Our Process | `/about/our-process/` | Core Standards | WebPage + HowTo (Complete Backyard Process) |
| 15 | Contact Us | `/contact/` | Core Standards | ContactPage + LocalBusiness |
| 16 | Request an Estimate | `/request-estimate/` | Core Standards | ContactPage |
| 17 | Careers | `/careers/` | Core Standards | WebPage + JobPosting (per role) |
| 18 | Financing | `/financing/` | Core Standards | WebPage |
| 19 | Privacy Policy | `/privacy-policy/` | Core Standards (legal) | WebPage |
| 20 | Terms of Service | `/terms-of-service/` | Core Standards (legal) | WebPage |
| 21 | Editorial Standards | `/about/editorial-standards/` | Core Standards | WebPage (about editorial process) |

## Deliverables (per page)

Each of the 21 pages produces a single markdown file at `deliverables/{NN-slug}.md` containing:

1. **Metadata block** — URL, breadcrumb, parent, primary intent, target audience, schema types, author, reviewer, review status.
2. **Brief** — page purpose, primary CTA, secondary CTA, internal links (up/lateral/down), Operation Tag exposure, social-share requirements (Portfolio only), YMYL flag.
3. **Section-by-section copy** — voice-locked, humanizer-cleared (deep mode where v1.2 voice profile applies), passes v1.1 §18 checklist and the 13-item editorial overlay checklist.
4. **JSON-LD schema** — full, page-specific structured data block, ready to paste into the CMS head.
5. **Image / asset checklist** — every image slot with intent, suggested subject, alt-text requirement, Open Graph and Twitter Card metadata for the page.
6. **Compliance footer** — auto-generated checklist confirming all 13 overlay items + v1.1 §18 items have been verified for this page.

## Acceptance criteria

A page is "done" when all of the following are true:

- Markdown deliverable exists at `deliverables/{NN-slug}.md` and renders cleanly
- v1.1 §18 compliance checklist: every item PASS
- Editorial overlay pre-publication checklist (13 items): every item PASS
- Hallucination catalog scan: zero rows triggered
- Voice attribution matches schema (named author writes in their own voice; reviewer named)
- YMYL pages (Pools content, chemical application, drainage/grading) carry the required disclaimer and reviewer
- All `[TBD]` markers are intentional (named Open Item in engagement-status, not a hallucination cover-up)
- All internal links resolve to other pages on the 21-page list or are flagged as deferred to a later phase
- Humanizer pass logged (mode = deep where voice-profile-full-v1.1.md loaded)
- File saved, full absolute path shown, brief copied to `~/Downloads/` if binary output produced

## Constraints

1. **Voice profile v1.2 sign-offs are pending.** Drafts proceed against v1.2 Current and get rewrapped if any sign-off triggers a substantive change.
2. **Brief errata B1 (15 years → 13–14) and B2 (seven → eight+ designers) are still Open low-priority.** Apply the corrected forms in everything we touch this cycle and log resolution in `errata-consolidated.md`.
3. **Skippack volume claim is unverified.** Mark `[TBD pending Maureen verification]`; do not approximate.
4. **PLNA and Suburban Home and Garden award specifics are pending.** Use generic "award-winning" only if paired with named award + year; otherwise omit.
5. **Author bio pages are out of scope here.** They launch alongside the first blog posts; this project gates only the 21 core pages.
6. **Single-author cooling period (24h) applies to any YMYL page where author = reviewer.** Schedule reviews accordingly.
7. **Em-dash ban is absolute.** Anywhere. No exceptions.
8. **Multi-author E-E-A-T model.** No bare "we" in body copy — voice attributed to named SMEs per the review chain.

## Dependencies

- `agency/sops/ROI-LIVE-Agency-Core-Standards-v1.1.md`
- `agency/sops/ROI-LIVE-Agency-Homepage-SOP-v1.md`
- `agency/sops/ROI-LIVE-Agency-Collection-Page-SOP-v1.md`
- `agency/sops/ROI-LIVE-Agency-Service-Page-SOP-v1.1.md` (Warranties only — page-type stretch)
- `agency/sops/ROI-LIVE-Agency-Citation-Discipline-SOP-v1.md`
- `clients/blue-tree/standards/editorial-overlay.md`
- `clients/blue-tree/brand_context/voice-profile-full-v1.1.md` (v1.2 Current) + `voice-profile.md` index
- `clients/blue-tree/brand_context/positioning.md`
- `clients/blue-tree/brand_context/icp.md`
- `clients/blue-tree/brand_context/samples.md`
- `clients/blue-tree/inputs/sitemap-and-implementation-plan-v2.2.md`
- `clients/blue-tree/standards/client-parameter-sheet.md`
- `clients/blue-tree/context/errata-consolidated.md`

## Production phases

Phase ordering optimizes for dependency cascade: foundation pages (About family, Editorial Standards, Process) before pages that link to them (Homepage, Service Hub, Contact).

**Phase A — Foundation & trust (5 pages)**
- Editorial Standards (#21) — gates blog content + cited by every other page's "Reviewed by" footer
- Our Story (#11) — anchors origin facts referenced everywhere
- Meet the Team (#12) — anchors author entity references
- Why Choose Blue Tree? (#13) — consolidates positioning
- Our Process (#14) — Complete Backyard Process is referenced from Homepage, Service Hub, Portfolio

**Phase B — Hub & navigation (5 pages)**
- Homepage (#1)
- About Us (#10)
- Service Hub (#5)
- Service Hub — Warranties (#6)
- Service Hub — FAQs (#7)

**Phase C — Proof & content (4 pages)**
- Portfolio — Photo Gallery (#2)
- Portfolio — Completed Projects (#3)
- Reviews & Testimonials (#4)
- Service Hub — Care Instructions (#8)

**Phase D — Conversion & support (4 pages)**
- Contact Us (#15)
- Request an Estimate (#16)
- Blog Hub (#9)
- Careers (#17)

**Phase E — Legal & financing (3 pages)**
- Financing (#18)
- Privacy Policy (#19)
- Terms of Service (#20)

## Timeline

| Day | Milestone |
|---|---|
| 2026-05-12 (today) | Brief + Page Manifest + Homepage prototype (deliverable #1) for direction-check |
| 2026-05-13 | Phase A complete (5 pages) |
| 2026-05-14 | Phase B complete (5 pages, cumulative 10) |
| 2026-05-15 | Phase C complete (4 pages, cumulative 14) |
| 2026-05-18 | Phase D complete (4 pages, cumulative 18) |
| 2026-05-19 | Phase E complete (3 pages, cumulative 21 — drafts done) |
| 2026-05-20 | Reviewer pass (Jérôme, Maureen, Jeff) on Pools-touching + About-touching pages |
| 2026-05-21 | Revisions + humanizer second pass on revised content |
| 2026-05-22 | Internal QA complete (Jason) |
| 2026-05-25 | Production launch (week of) |

## Risks

| Risk | Mitigation |
|---|---|
| Voice profile v1.2 sign-offs slip past 2026-05-20 | Drafts can ship with `[Pending voice review]` tag on `voice-profile-full-v1.1.md`-derived passages; substantive voice-change risk is low because v1.2 cleanup is mechanical |
| Skippack volume / PLNA / Suburban awards remain unverified by 2026-05-22 | Pages reference these only with `[TBD]` and a date-stamped open-item note; no approximations |
| Author bio pages not ready by launch | Editorial Standards page cites authors by name without linking; bio pages land in next sprint |
| Spa & Hot Tub Integration S5 ruling still open | Service Hub — Warranties references hot tub only in deferred-services list until ruling lands |
| Form-first CTA conflicts with current bluetree.tempurl.host template | Flag for Raja; phone-number presence above the fold is a violation under v1.1 §11.5 |

## Open items at brief-write time

- Confirm 21-page set (defaulting to 20 core + Editorial Standards)
- Confirm deliverable format (defaulting to per-page markdown package with brief + copy + schema)
- Confirm target platform (defaulting to CMS-agnostic hand-off package)
- Confirm whether project escalates to Level 3 GSD (`.planning/`) once Phase A locks
- Lead Designer author bio assignment for landscape content [pending]

## Project artifacts

- `brief.md` — this file
- `page-manifest.md` — per-page row: author, reviewer, schema, deps, status (next deliverable)
- `deliverables/{NN-slug}.md` — 21 page packages (Phases A–E)
- `qa-checklist.md` — consolidated 13-item overlay + v1.1 §18 checklist applied to each page at QA
- `cascade-log.md` — every errata resolution that propagates across pages
