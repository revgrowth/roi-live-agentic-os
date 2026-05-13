# Page Status Tracker — 21-Page Quick Launch

**Project:** website-build-qa
**Maintained by:** Jason Spencer (ROI.LIVE)
**Created:** 2026-05-12
**Last reconciled:** 2026-05-13 (live ClickUp pull + dev-site crawl)
**Canonical scope:** `projects/briefs/website-quick-launch/brief.md` 21-page list (Jason ruling 2026-05-13)
**Dev site:** https://bluetree.tempurl.host
**ClickUp list:** 901323690100 (2026 New Website)

## Definitions

- **Deployed:** HTTP 200 at the sitemap URL on `bluetree.tempurl.host`.
- **Dev complete:** Deployed AND (ClickUp brief task in `approved`/`completed` OR Raja explicitly announced "done" in chat/DM).
- **Slug delta:** Page is built but at a URL different from sitemap v2.2. Marked `BUILT-AT-ALT`. Per Jason ruling, awaits Raja slug alignment before audit.
- **Not built:** No HTTP 200 at sitemap URL and no Raja "done" signal.

## Summary

| Status | Count | % of 21 |
|---|---|---|
| Deployed at sitemap URL | 15 | 71% |
| Built at alt URL (slug delta) | 2 | 10% |
| Not built | 4 | 19% |

## Master table

| # | Page | Sitemap URL | Deployed? | CU brief status | CU task ID | Raja said done? | Verdict | Initial QA flags |
|---|---|---|:---:|---|---|---|---|---|
| 1 | Homepage | `/` | ✅ | updates needed | 86aex9jkd | ✅ 2026-04-13 | DEV COMPLETE | Missing Philadelphia in 5-county list |
| 2 | Portfolio — Photo Gallery | `/portfolio/` | ✅ | approved | 86afpc6gp (via Review Feedback) | Implied | DEV COMPLETE | H1 reads "Completed Projects" — confirm intent |
| 3 | Portfolio — Completed Projects | `/portfolio/completed-projects/` | ❌ 404 | approved | 86afjw7c8 | Deferred to Phase 1 per Jason's 2026-04-13 post | NOT BUILT | — |
| 4 | Reviews & Testimonials | `/reviews/` | ✅ | approved | 86afk7ur2 | Not explicit | DEPLOYED | Placeholder reviewer names `[First Name] [Last Initial]`, duplicate testimonial blocks, Trustindex vs Figma reviews question still open |
| 5 | Service Hub | `/service-hub/` | ❌ 404 | approved (design only) | 86afk70cb | Deferred to Phase 1 | NOT BUILT | — |
| 6 | Service Hub — Warranties | `/service-hub/warranties/` | ❌ 404 | no brief | n/a | Deferred to Phase 1 | NOT BUILT | No canonical creative brief either |
| 7 | Service Hub — FAQs | `/service-hub/faqs/` | ✅ | in progress | 86afwj01v | Not explicit | DEPLOYED (unexpected — Raja's Phase 0 plan had this deferred) | Swiss-postal placeholder FAQ, repeating FAQ blocks, `[Month Year]` updated-date placeholder |
| 8 | Service Hub — Care Instructions | `/service-hub/instructions/` | ❌ 404 | in progress | 86afx9p1m | Built at `/care/` instead | BUILT-AT-ALT | Slug delta — needs Raja alignment |
| 9 | Blog Hub | `/blog/` | ✅ | approved | 86afk8grb | ✅ 2026-04-13 | DEV COMPLETE | Inground Pool Cost post duplicated in grid |
| 10 | About Us | `/about/` | ✅ | approved | 86afkbt7z | ✅ 2026-04-13 | DEV COMPLETE | **Em-dash in lede ("Pennsylvania — and we've been doing it since 1983")**, Swiss-postal placeholder FAQ |
| 11 | Our Story | `/about/our-story/` | ✅ | approved | 86afjvu2p | ✅ 2026-04-13 | DEV COMPLETE | Swiss-postal placeholder FAQ |
| 12 | Meet the Team | `/about/team/` | ❌ 404 | approved | 86afk9khm | Built at `/about/meet-the-team/` instead | BUILT-AT-ALT | Slug delta — needs Raja alignment |
| 13 | Why Choose Blue Tree? | `/about/why-choose-us/` | ✅ | approved | 86afpj75f | ✅ 2026-04-13 | DEV COMPLETE | Swiss-postal placeholder FAQ |
| 14 | Our Process | `/about/our-process/` | ✅ | approved | 86afpk9wv | ✅ 2026-04-13 | DEV COMPLETE | **Em-dash in H1 ("From Vision to Reality — and Beyond")**, Swiss-postal placeholder in Step 02 / Step 05 / FAQ |
| 15 | Contact Us | `/contact/` | ✅ | approved | 86afjwwm9 | ✅ 2026-04-13 | DEV COMPLETE | **Phone "(610) 222-0590" above the fold**, Swiss-postal placeholder FAQ |
| 16 | Request an Estimate | `/request-estimate/` | ✅ | approved | 86afjwwm9 (shared) | ✅ 2026-05-11 | DEV COMPLETE | **Phone above the fold**, Swiss-postal placeholder FAQ, H1 "Request Your Free Design Consultation" matches form-first CTA |
| 17 | Careers | `/careers/` | ✅ | in progress | 86afpp7jb | ✅ 2026-05-11 | DEPLOYED (ClickUp status lags reality) | **All 4 job listings = repeated Stephen Roehm bio placeholder**, benefits "pending confirmation", Swiss-postal placeholder FAQ |
| 18 | Financing | `/financing/` | ✅ | approved | 86afpmx4x | ✅ 2026-04-13 | DEV COMPLETE | **Unfilled brackets in Step 3 (`[Financing Partner Name]`, `[a quick online application / a streamlined process]`, `[minutes / 24 hours]`)**, Swiss-postal placeholder FAQ |
| 19 | Privacy Policy | `/privacy-policy/` | ✅ | updates needed | 86ah0d9p5 | Not explicit | DEPLOYED (ClickUp status lags reality) | **"Blue Tree Landscaping" in H1** (legal entity in body — v1.1 §1.1 violation), references "Schwenksville, PA" address — confirm intent |
| 20 | Terms of Service | `/terms-of-service/` | ❌ 404 | updates needed | 86ah0d9p5 (shared) | Not explicit | NOT BUILT | — |
| 21 | Editorial Standards | `/about/editorial-standards/` | ✅ | in progress | 86afx9qhw | ✅ 2026-04-13 at `/editorial-standards/` | DEPLOYED (ClickUp status lags reality) | "Last Updated: `[Month Year]`" placeholder. Confirm /about/editorial-standards/ vs /editorial-standards/ canonical |

## Slug deltas — pending Raja alignment

Per Jason ruling 2026-05-13: ask Raja to align Phase 0 page slugs with sitemap v2.2. Audit on these pages defers until slugs match.

| Built at | Sitemap target | Notes |
|---|---|---|
| `/about/meet-the-team/` | `/about/team/` | Brief.md #12 |
| `/care/` | `/service-hub/instructions/` | Brief.md #8 |
| `/editorial-standards/` *(plus alias at `/about/editorial-standards/`)* | `/about/editorial-standards/` | Confirm which is canonical; if alias is intentional redirect, fine. If duplicate page, dedupe. Brief.md #21 |

**Phase 1 slug deltas (not blocking Phase 0 audit):**
- `/montgomery-county/` → `/service-areas/montgomery-county/`
- `/garden-design/` → `/landscapes/garden-design/`
- `/pool-renovation/` → not in sitemap yet (Phase 1 cluster, may need brief)
- `/helping-harleysville/` (single blog post) → `/blog/helping-harleysville-dogs-with-better-turf/` per blog hub display

## ClickUp ↔ deployed-reality mismatches

Three pages are DEPLOYED on `bluetree.tempurl.host` but their ClickUp task status hasn't been advanced. These are process gaps worth flagging to Raja so the audit board reflects reality.

| Page | ClickUp status | Actual state |
|---|---|---|
| `/service-hub/faqs/` (task 86afwj01v) | in progress | Deployed (placeholder content) |
| `/careers/` (task 86afpp7jb) | in progress | Deployed (placeholder content) |
| `/privacy-policy/` (task 86ah0d9p5) | updates needed | Deployed (real privacy content) |
| `/about/editorial-standards/` (task 86afx9qhw) | in progress | Deployed |

## Pages NOT built (4)

The 4 pages with 404 at sitemap URL and no slug-delta equivalent. These need owner-action.

| # | Page | Sitemap URL | ClickUp task | Owner action |
|---|---|---|---|---|
| 3 | Portfolio — Completed Projects | `/portfolio/completed-projects/` | 86afjw7c8 (approved — design only) | Jason: confirm Phase 0 vs Phase 1. Raja's plan defers; brief.md includes in Phase 0. |
| 5 | Service Hub | `/service-hub/` | 86afk70cb (approved — design only) | Jason: confirm. Raja's plan defers; brief.md includes in Phase 0. |
| 6 | Service Hub — Warranties | `/service-hub/warranties/` | n/a | Jason: confirm. No canonical creative brief exists in local mirror. |
| 20 | Terms of Service | `/terms-of-service/` | 86ah0d9p5 (updates needed) | Raja: build. Counsel-supplied text status pending. |

## Initial QA findings inventory (preview for Step 3)

Severity legend: **BLOCK** (must fix pre-launch), **FLAG** (fix before final), **NIT** (cosmetic).

### Global / sitewide

- **BLOCK — Swiss-postal placeholder FAQ on every About-family page and conversion page.** Identical mismatched answers about magazine subscriptions, Swiss postal service, account creation. Confirmed on `/about/`, `/about/our-story/`, `/about/why-choose-us/`, `/about/our-process/`, `/service-hub/faqs/`, `/contact/`, `/request-estimate/`, `/careers/`, `/financing/`. Pattern indicates a shared Breakdance FAQ template default that needs one global override.
- **BLOCK — Phone "(610) 222-0590" appears above the fold** on `/contact/` and `/request-estimate/` (likely in header sitewide). Violates v1.1 §11.5. Phone is footer-only.
- **BLOCK — Em-dashes detected** on `/about/` lede and `/about/our-process/` H1. Likely sitewide given pattern. Need full text scan post-deploy.
- **FLAG — `[Month Year]` updated-date placeholder** on `/about/editorial-standards/` and `/service-hub/faqs/`. Likely a date-block template not bound to a real value.

### Page-specific (BLOCK)

| Page | Issue |
|---|---|
| `/` | Missing Philadelphia in counties list (4 of 5 named) |
| `/reviews/` | Placeholder reviewer names `[First Name] [Last Initial]., [Town], PA`, duplicate testimonial blocks |
| `/careers/` | All 4 job listings use repeated Stephen Roehm bio placeholder; benefits "pending confirmation" |
| `/financing/` | Step 3 contains unfilled brackets `[Financing Partner Name]`, `[a quick online application / a streamlined process]`, `[minutes / 24 hours]` |
| `/privacy-policy/` | H1 reads "Blue Tree Landscaping Privacy Policy" — legal entity in body per v1.1 §1.1 |
| `/portfolio/` | H1 reads "Completed Projects: Our Work Across Southeastern PA" — could be intentional consolidation since Completed Projects is deferred, but H1 mismatches URL |

### Page-specific (FLAG)

| Page | Issue |
|---|---|
| `/blog/` | "How Much Does an Inground Pool Cost in Pennsylvania?" duplicated in grid |
| `/privacy-policy/` | Address listed as "Schwenksville, PA" — confirm vs Skippack HQ (Norristown 1983 / Skippack 2008 per v1.1 §1.1) |
| `/about/editorial-standards/` | Confirm canonical URL — `/about/editorial-standards/` vs `/editorial-standards/`. If both render same content, dedupe or redirect. |

## Sources used for this reconciliation

1. **ClickUp filter on list 901323690100** — `clickup_filter_tasks` 2026-05-13 — 34 tasks pulled with current statuses.
2. **ClickUp Blue Tree Website channel `8cma26h-14873`** — `clickup_get_chat_channel_messages` 2026-05-13 — Jason's Phase 0 declaration post 2026-04-13 retrieved.
3. **ClickUp Jason↔Raja DM `8cma26h-6393`** — `clickup_get_chat_channel_messages` 2026-05-13 — Raja's 2026-04-13 (9+6 pages), 2026-05-04 (+3 pages), 2026-05-11 ("5 left this week") completion announcements retrieved.
4. **WebFetch crawl of all 21 sitemap URLs** — 2026-05-13.
5. **Local creative-brief mirror** — `inputs/source-materials/creative-briefs/` and `clickup-task-mirror/` INDEX.md files.
6. **Engagement context** — `clients/blue-tree/context/engagement-status.md`, `brand_context/voice-profile.md`, `brand_context/assets.md`.

## Next steps

1. **Surface to Raja** (Jason approve and send): ClickUp comment requesting slug alignment for `/about/team/`, `/service-hub/instructions/`, `/about/editorial-standards/` and updating ClickUp task statuses to reflect deployed reality.
2. **Decision needed from Jason**: Service Hub family (#5, #6) and Portfolio Completed Projects (#3) — are these Phase 0 (per brief.md) or Phase 1 (per Raja's plan)? Affects scope of Step 2 audit.
3. **Step 2 — spec compliance audit**: Run against the 15 pages currently deployed at sitemap URL. Defer the 2 slug-delta pages until aligned. Defer the 4 not-built pages.
4. **Step 3 — brand QA report**: Already has a strong preview from the initial crawl — em-dash sitewide pattern, Swiss-postal FAQ template, phone-above-fold, county-list gap. Step 3 will sweep all deployed pages systematically.
