# Page Manifest — 21-Page Quick Launch

**Project:** website-quick-launch
**Owner:** Jason Spencer (ROI.LIVE)
**Maintained:** 2026-05-12 → ongoing
**Source sitemap:** `clients/blue-tree/inputs/sitemap-and-implementation-plan-v2.2.md`
**Editorial standard:** `clients/blue-tree/standards/editorial-overlay.md`

Status legend: `pending` → `drafted` → `humanized` → `reviewed` → `qa-pass` → `ready-to-ship`

YMYL flag triggers the YMYL boundary protocol in the editorial overlay (Pool safety, Chemical application, Drainage/grading).

## Phase A — Foundation & trust

| # | Page | URL | Author | Reviewer | Backup | Schema | YMYL | Status |
|---|---|---|---|---|---|---|---|---|
| 21 | Editorial Standards | `/about/editorial-standards/` | Jason Spencer (Editor) | Jeff Mattiola | Jérôme Besnard | WebPage + about(editorial process) | No | pending |
| 11 | Our Story | `/about/our-story/` | Jeff Mattiola | Jérôme Besnard | Chad Ochnich | AboutPage + Person(Jeff) | No | pending |
| 12 | Meet the Team | `/about/team/` | Jérôme Besnard | Jeff Mattiola | — | AboutPage + ItemList(Person) | No | pending |
| 13 | Why Choose Blue Tree? | `/about/why-choose-us/` | Jérôme Besnard | Jeff Mattiola | — | WebPage | No | pending |
| 14 | Our Process | `/about/our-process/` | Jeff Mattiola | Jérôme Besnard | Chad Ochnich | WebPage + HowTo(Complete Backyard Process) | No | pending |

## Phase B — Hub & navigation

| # | Page | URL | Author | Reviewer | Backup | Schema | YMYL | Status |
|---|---|---|---|---|---|---|---|---|
| 1 | Homepage | `/` | Jeff Mattiola | Jérôme Besnard | Chad Ochnich | LocalBusiness + Organization + WebSite | No | pending |
| 10 | About Us | `/about/` | Jeff Mattiola | Jérôme Besnard | — | AboutPage + Organization | No | pending |
| 5 | Service Hub | `/service-hub/` | Jérôme Besnard | Jeff Mattiola | — | CollectionPage | No | pending |
| 6 | Service Hub — Warranties | `/service-hub/warranties/` | Jeff Mattiola | Chad Ochnich | Jérôme Besnard | WebPage + FAQPage | No | pending |
| 7 | Service Hub — FAQs | `/service-hub/faqs/` | Jérôme Besnard | Jeff Mattiola | Mark Peasley | FAQPage | No | pending |

## Phase C — Proof & content

| # | Page | URL | Author | Reviewer | Backup | Schema | YMYL | Status |
|---|---|---|---|---|---|---|---|---|
| 2 | Portfolio — Photo Gallery | `/portfolio/` | Jérôme Besnard | Jeff Mattiola | — | ImageGallery + CollectionPage | No | pending |
| 3 | Portfolio — Completed Projects | `/portfolio/completed-projects/` | Jérôme Besnard | Jeff Mattiola | — | CollectionPage + ItemList | No | pending |
| 4 | Reviews & Testimonials | `/reviews/` | Jérôme Besnard | Maureen Mattiola | — | Review + AggregateRating | No | pending |
| 8 | Service Hub — Care Instructions | `/service-hub/instructions/` | Jeff Mattiola (Pools/Hardscape) + Mark Peasley (Healthy Yards) | Chad Ochnich (Hardscape) + Jeff Mattiola (Turf) | Jérôme Besnard | HowTo (per instruction set) | Yes (chemical app subset) | pending |

## Phase D — Conversion & support

| # | Page | URL | Author | Reviewer | Backup | Schema | YMYL | Status |
|---|---|---|---|---|---|---|---|---|
| 15 | Contact Us | `/contact/` | Jérôme Besnard | Maureen Mattiola | — | ContactPage + LocalBusiness | No | pending |
| 16 | Request an Estimate | `/request-estimate/` | Jérôme Besnard | Jeff Mattiola | — | ContactPage | No | pending |
| 9 | Blog Hub | `/blog/` | Jason Spencer (Editor) | Jeff Mattiola | — | Blog + CollectionPage | No | pending |
| 17 | Careers | `/careers/` | Maureen Mattiola | Jeff Mattiola | — | WebPage + JobPosting | No | pending |

## Phase E — Legal & financing

| # | Page | URL | Author | Reviewer | Backup | Schema | YMYL | Status |
|---|---|---|---|---|---|---|---|---|
| 18 | Financing | `/financing/` | Jérôme Besnard | Jeff Mattiola | — | WebPage | No | pending |
| 19 | Privacy Policy | `/privacy-policy/` | Legal (counsel-supplied) | Jeff Mattiola | — | WebPage | No | pending |
| 20 | Terms of Service | `/terms-of-service/` | Legal (counsel-supplied) | Jeff Mattiola | — | WebPage | No | pending |

## Reviewer assignment notes

- **Jeff Mattiola** authors anything touching pool construction, 43-year origin facts, pricing, warranty matrix, or owner positioning. Founder-voice signature lines live in v1.1 §2.
- **Jérôme Besnard** authors anything touching sales process, designer-led discovery, buyer-decision content. Reviewer-of-record for Jeff's pool content per editorial overlay.
- **Chad Ochnich** authors hardscape and reviews pool-adjacent structural content. ICPI certification holder; the only on-staff author allowed to make ICPI claims in first person.
- **Mark Peasley** authors turf care, lawn programs, pest control, and Healthy Yards content. Reviews Jeff's chemical-application content. Penn State, ~two decades.
- **Maureen Mattiola** authors operational pages (Careers, contact path content); on staff since 2016; not an SME author on construction topics.
- **Jason Spencer** (ROI.LIVE) authors editorial-process and blog-hub structural content as the Editor. Not an author of customer-facing voice content.
- **[Lead Designer TBD]** placeholder for landscape design / garden / planting content. None of the 21 pages requires this author; Lead Designer activates at the cluster-page stage.

## Cross-page dependencies

- Every page footer references "Reviewed by" → Editorial Standards page (#21) must exist before any other page is QA-passed.
- Homepage (#1) and About Us (#10) cite "43 years," "Norristown 1983," "Skippack since 2008," "13–14 year average tenure," "8+ designers" — all anchored to Our Story (#11) and Power Stats (v1.1 §1.6).
- Service Hub — Warranties (#6) references the warranty matrix in v1.1 §7.3 — pricing transparency principle must match Our Process (#14) and Why Choose Blue Tree? (#13).
- Reviews & Testimonials (#4) and Portfolio — Completed Projects (#3) require curated content from Drive folder (asset retrieval gated by Maureen).
- Contact (#15) and Request an Estimate (#16) form-first CTA spec is referenced from every other page's footer/header.
- Editorial Standards (#21) references the named review chain in the editorial overlay — the canonical reviewer list for every blog post.

## Errata cascade tracking

When B1 (15 years → 13–14) and B2 (seven → eight+ designers) resolve in this project, log the cascade across every page that referenced the pre-corrected forms in `cascade-log.md` and update `errata-consolidated.md`.

## Open author/reviewer questions

- Lead Designer author bio (landscape content) — not needed for the 21 core pages, but needs naming before cluster-page Phase 1.
- Mark Peasley signature phrases — v1.1 §3.8 [verify section number]; pull in before Phase C Care Instructions draft.
- Counsel-supplied legal text — confirm whether Blue Tree has current Privacy Policy and Terms or needs ROI.LIVE to draft templates for counsel sign-off.
