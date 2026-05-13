---
to: Raja Sheryar
channel: ClickUp DM (channel 8cma26h-6393) OR Blue Tree Website channel (8cma26h-14873)
status: drafted — awaiting Jason send approval
drafted: 2026-05-13
author: Jason Spencer (drafted by Claude)
context: Phase 0 build QA audit started 2026-05-13. Slug deltas identified between Raja's deployed URLs and the sitemap v2.2. ClickUp task statuses lag deployed reality on 4 pages. This message asks Raja to align both.
---

# Message to Raja — slug alignment + ClickUp status sync

## Send as ONE message in the Blue Tree Website channel (recommended) or as task comments per-page (slower)

Hi Raja, kicking off our Phase 0 QA pass for the 2026-05-25 launch — appreciate everything you've shipped. Two quick alignment asks before we go deep on QA:

**1. Page URL slugs — please align to sitemap v2.2**

Sitemap v2.2 is the canonical URL plan for SEO and internal-linking. A few of the deployed pages are at slightly different paths. Could you change the slugs (and add 301 redirects from the old paths if you can) so we match the sitemap? Specific deltas:

| Currently deployed at | Should be |
|---|---|
| `/about/meet-the-team/` | `/about/team/` |
| `/care/` | `/service-hub/instructions/` |
| `/editorial-standards/` | `/about/editorial-standards/` (this one may already exist as an alias — please dedupe to one canonical URL) |

**Phase 1 pages you've already built ahead of schedule are also at non-sitemap URLs (`/montgomery-county/`, `/garden-design/`, `/pool-renovation/`, etc.). Don't worry about those right now — we'll sort them when we plan Phase 1 properly.**

**2. ClickUp task statuses — please advance to match deployed reality**

A few tasks are still in earlier statuses but the pages are deployed. Could you move each of these to the appropriate status (in QA / approved / whatever fits your column flow) so the board reflects what's live?

| Task | URL | Current status | Should be |
|---|---|---|---|
| Editorial Standards Page Template Design ([86afx9qhw](https://app.clickup.com/t/86afx9qhw)) | `/about/editorial-standards/` | in progress | deployed (in QA) |
| FAQs Library Page Template Design ([86afwj01v](https://app.clickup.com/t/86afwj01v)) | `/service-hub/faqs/` | in progress | deployed (in QA) — note: I thought this was deferred to Phase 1, so let me know if I should not be QA-ing it |
| Careers Page Template ([86afpp7jb](https://app.clickup.com/t/86afpp7jb)) | `/careers/` | in progress | deployed (in QA) |
| Privacy Policy and Terms and Conditions ([86ah0d9p5](https://app.clickup.com/t/86ah0d9p5)) | `/privacy-policy/` is live; `/terms-of-service/` is 404 | updates needed | split: Privacy → deployed; Terms → still in build (or update task description to clarify) |

## Heads-up on QA findings (full report later this week)

I've started the audit on the 21 quick-launch pages and found one recurring pattern that I want to flag early so you don't get the same finding on 9 different pages:

**Placeholder FAQ content** — the FAQ blocks on `/about/`, `/about/our-story/`, `/about/why-choose-us/`, `/about/our-process/`, `/service-hub/faqs/`, `/contact/`, `/request-estimate/`, `/careers/`, and `/financing/` all show the same template defaults — answers about magazine subscriptions, Swiss postal service, "create a new account at the end of the order process," etc. Looks like a shared Breakdance FAQ widget that wasn't overridden. One global fix likely solves it across all pages. We'll send real FAQ copy alongside this — please replace the entire FAQ block on each page once you receive the content.

I'll send the full QA list (em-dash bans, brand-name rule, phone placement, county list, etc.) as a single page-grouped fix list after the spec-compliance and brand-QA passes finish. Aim is to get everything to you by EOD 2026-05-19 so you have 2026-05-20 / 21 to work through, internal QA closes 2026-05-22.

Thanks Raja — let me know on the slug deltas and ClickUp status moves at your earliest.

— Jason
