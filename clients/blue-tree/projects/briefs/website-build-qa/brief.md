---
project: website-build-qa
status: active
level: 2
created: 2026-05-12
owner: Jason Spencer (ROI.LIVE)
client: Blue Tree Outdoor Living
scope: 21 quick-launch pages
parallel_to: website-quick-launch (copy production)
target_launch: 2026-05-25 (week of)
internal_qa_target: 2026-05-22
---

# Website Build QA — Dev-Team Management for 21 Quick-Launch Pages

## Goal

Manage Raja Sheryar's Breakdance dev team to a clean cutover for the 21 quick-launch pages by **week of 2026-05-25**. Specifically:

1. Maintain a single source of truth on which pages are dev-complete vs outstanding.
2. Verify completed pages match the approved Figma designs and the ClickUp creative briefs they were built against.
3. Run a brand + copy QA pass before each page is signed off for production.

This brief governs **build QA and dev-team coordination**. It is parallel to (not a replacement for) `projects/briefs/website-quick-launch/`, which governs **copy production** for the same 21 pages. Jason's role on this project is dev-team management, not copy authoring.

## Scope — 21 pages (same set as website-quick-launch)

| # | Page | URL | Figma family | Creative brief |
|---|---|---|---|---|
| 1 | Homepage | `/` | Home | `creative-briefs/home-page-creative.md` |
| 2 | Portfolio — Photo Gallery | `/portfolio/` | Inner | `creative-briefs/portfolio.md` |
| 3 | Portfolio — Completed Projects | `/portfolio/completed-projects/` | Inner | `clickup-task-mirror/approved-portfolio-case-study-completed-projects-page-template.md` |
| 4 | Reviews & Testimonials | `/reviews/` | Inner | `creative-briefs/reviews.md` |
| 5 | Service Hub | `/service-hub/` | Inner | `creative-briefs/service.md` |
| 6 | Service Hub — Warranties | `/service-hub/warranties/` | Inner | (no canonical — flag) |
| 7 | Service Hub — FAQs | `/service-hub/faqs/` | Inner | `creative-briefs/faqs.md` |
| 8 | Service Hub — Care Instructions | `/service-hub/instructions/` | Inner | `creative-briefs/care-instructions.md` |
| 9 | Blog Hub | `/blog/` | Inner | `creative-briefs/blog-hub-content.md` |
| 10 | About Us | `/about/` | About | `creative-briefs/about.md` |
| 11 | Our Story | `/about/our-story/` | About | `creative-briefs/our-story-brand.md` |
| 12 | Meet the Team | `/about/team/` | About | `creative-briefs/meet-the-team-author-bio-pages-e-e-a-t.md` |
| 13 | Why Choose Blue Tree? | `/about/why-choose-us/` | About | `creative-briefs/why-choose-blue-tree.md` |
| 14 | Our Process | `/about/our-process/` | About | `creative-briefs/our-process.md` |
| 15 | Contact Us | `/contact/` | Inner | `creative-briefs/contact-request-estimate-bottom-of-funnel.md` |
| 16 | Request an Estimate | `/request-estimate/` | Inner | `creative-briefs/contact-request-estimate-bottom-of-funnel.md` |
| 17 | Careers | `/careers/` | Inner | `creative-briefs/careers.md` |
| 18 | Financing | `/financing/` | Inner | `creative-briefs/financing.md` |
| 19 | Privacy Policy | `/privacy-policy/` | Inner | `creative-briefs/privacy-policy.md` |
| 20 | Terms of Service | `/terms-of-service/` | Inner | `creative-briefs/terms-of-service.md` |
| 21 | Editorial Standards | `/about/editorial-standards/` | About | `creative-briefs/editorial-standards.md` |

## Deliverables

### 1. `deliverables/page-status-tracker.md` — Step 1

Single table reconciling **four sources** per page:

| Source | Field |
|---|---|
| Sitemap v2.2 | Page name, URL, page-type SOP, Figma family |
| ClickUp live (via MCP) | Task ID, current status, last-updated, latest comment from Raja |
| ClickUp chat / DMs (via MCP) | Most recent Raja "I finished X" message with date + verbatim quote |
| Live crawl of `bluetree.tempurl.host` | HTTP status, page exists?, last-modified header if exposed |

Output columns: `# · Page · URL · CU status · CU updated · Raja-said-done · Deployed (Y/N) · Figma node · Brief link · Gap notes`

Definition of "dev complete" for this tracker: deployed at the target URL AND ClickUp status is approved/completed OR Raja has explicitly DMed "done."

### 2. `deliverables/spec-compliance-audit.md` — Step 2

Per-page audit comparing **deployed page vs Figma node vs creative brief**. For each dev-complete page:

- Screenshot the deployed page at desktop + mobile widths.
- Fetch the matching Figma node screenshot for the same page-type template.
- Read the matching creative brief from `inputs/source-materials/creative-briefs/` or `clickup-task-mirror/`.
- Tabulate findings: section-by-section presence, component fidelity, copy slot fidelity, CTA placement, image slot fills, internal links.

Output format per page:

```
## {NN} — {Page name}
Section | Spec (brief) | Figma | Deployed | Verdict | Severity
```

Severities: **BLOCK** (must fix pre-launch), **FLAG** (fix before final), **NIT** (cosmetic), **PASS** (matches spec).

### 3. `deliverables/brand-qa-report.md` — Step 3

Computed scans + visual review across all dev-complete pages. Three buckets:

**A. Copy compliance (automated text scan):**
- Em-dash count must be `0` (Blue Tree absolute ban — v1.1 §11.3).
- No "Blue Tree Landscaping" in customer-facing body copy (legal entity only in footer/origin/JSON-LD).
- "Healthy Yards" plural — zero occurrences of "Healthy Yard" singular.
- Geographic rule — "Montgomery County" never standalone; always paired with Southeastern PA or the 5-county list.
- Tenure stats — only `43 years`, `13 to 14 year`, `15 years pool construction`. Never `40 years` or `15 years` employee tenure.
- No banned services (sprinkler installation, smart irrigation, pool emergency repair, standalone hot tub install).
- Form-first CTA wording ("Request a Free Consultation"), no high-pressure closers ("Get Started Now," "Call Today").
- Phone number above the fold = violation (v1.1 §11.5).

**B. Brand kit fidelity (CSS + visual):**
- Hex tokens (compare deployed CSS custom properties or rendered colors against `brand_context/assets.md`):
  - `#285140` Primary Green · `#0F2537` Primary Blue · `#005CB9` Light Blue · `#FB8C00` Accent Orange · `#FFFFFF` White · `#DBDBDB` Off-White
- Font families — Archivo (H1, H2 default) and SF Pro (H2 variant, H3–H4, body).
- Type scale and weight pairings per `assets.md` typography table.
- Logo lockups — correct variant used per context (color, white-out, footer-blue, with-tagline).

**C. Aesthetic + accessibility:**
- Spacing rhythm, image quality, mobile responsiveness at 375/768/1280px.
- Alt text present on every image.
- Color contrast for body text and CTAs (WCAG AA at minimum).
- Form-first CTA prominent above the fold on conversion pages.

Output: severity-classified findings list + a single Raja-ready fix list ordered by page and severity.

## Acceptance criteria

- All three deliverables exist at `projects/briefs/website-build-qa/deliverables/`.
- Page status tracker covers all 21 pages with no `?` values; every page has a definitive Y/N on deployed + dev-complete.
- Spec compliance audit covers every page marked dev-complete in the tracker. Pages still in progress are marked "deferred — not yet built."
- Brand QA report has zero BLOCK-severity findings unresolved at 2026-05-22 internal-QA deadline.
- Every finding tags the page, severity, owner (Raja/Jason/Client), and proposed fix.
- Fix list grouped by page so Raja can work through it ticket-style.

## Inputs (read-only)

- `clients/blue-tree/inputs/sitemap-and-implementation-plan-v2.2.md`
- `clients/blue-tree/inputs/source-materials/creative-briefs/INDEX.md` + all 30 canonical briefs
- `clients/blue-tree/inputs/source-materials/clickup-task-mirror/INDEX.md` + all 31 mirrored task descriptions
- `clients/blue-tree/inputs/source-materials/clickup-meeting-notes/` (12 monthly notes, especially 2026-05-07)
- `clients/blue-tree/brand_context/assets.md` (color, typography, logo lockups)
- `clients/blue-tree/brand_context/voice-profile.md` (and v1.1 full)
- `clients/blue-tree/standards/editorial-overlay.md`
- `agency/sops/ROI-LIVE-Agency-Core-Standards-v1.1.md`

## Live sources (read-only via MCP / HTTP)

| Source | Access |
|---|---|
| ClickUp list 901323690100 (2026 New Website) | ClickUp MCP — `clickup_get_list`, `clickup_search`, `clickup_get_task`, `clickup_get_task_comments` |
| ClickUp chat with Raja | ClickUp MCP — `clickup_get_chat_channels`, `clickup_get_chat_channel_messages` |
| Figma file `leXDzLrKd1zucGnwQbTWOB` | Figma MCP — `get_metadata`, `get_screenshot`, `get_design_context`, `get_variable_defs` |
| Live deployed site | WebFetch — `https://bluetree.tempurl.host` (robots.txt disallow is correct for staging — does not block fetch) |

## Constraints

1. **Read-only audit.** This project does not edit the brief, voice profile, or sitemap. Findings flow to Raja as fix requests; copy changes flow to the `website-quick-launch` project.
2. **Robots.txt disallow on staging is correct.** Do not flag as an issue. Only the live site at `bluetreelandscaping.com` is meant to be crawlable, post-cutover.
3. **Voice profile v1.2 sign-offs are pending.** Copy QA uses v1.2 Current. If sign-offs land mid-audit, log a cascade entry and rerun the affected pages.
4. **Brief errata B1 (15 years → 13–14) and B2 (seven → eight+ designers) are still Open low-priority.** Treat the corrected forms as canonical for QA; flag any deployed page using the pre-corrected form.
5. **Em-dash ban is absolute.** Any deployed em dash is an automatic BLOCK-severity finding.
6. **Form-first CTA discipline.** Phone-above-the-fold = BLOCK. "Get Started Now"-style closers = BLOCK. "Request a Free Consultation" form-first = PASS.

## Dependencies

- ClickUp MCP connection (live — verified 2026-05-12).
- Figma MCP connection (live — verified 2026-05-12).
- WebFetch access to `bluetree.tempurl.host` (verify on first fetch).
- `brand_context/assets.md` source of truth for hex tokens and type stack (current).

## Risks

| Risk | Mitigation |
|---|---|
| Raja's dev work outpaces our reconciliation cadence | Page status tracker is the working state file; update it as new deploys land |
| ClickUp status lags reality (Raja shipped but didn't move task) | Trust Raja's DMs / chat messages over task status; flag the lag as a process gap |
| Figma node coverage incomplete for Phase 1 (Inner + About families still in active design per `engagement-status.md`) | For pages without a finalized Figma node, audit against creative brief + Inner/About template family only; mark Figma column "no spec" |
| Phone-number-above-fold or other CTA violations baked into the global template | Surface to Raja as a sitewide BLOCK rather than per-page; one fix unblocks the set |
| Tempurl staging gets reset or content shifts mid-audit | Snapshot HTML/screenshots into `deliverables/snapshots/{YYYY-MM-DD}/` per audit pass |

## Timeline

| Day | Milestone |
|---|---|
| 2026-05-12 (today) | Brief drafted. Page status tracker baseline drafted from local mirror. ClickUp live pull + dev-site crawl scheduled next |
| 2026-05-13 | Page status tracker reconciled with live ClickUp + dev-site crawl. Step 1 complete |
| 2026-05-14 | Spec compliance audit for all dev-complete pages. Step 2 complete |
| 2026-05-15 | Brand QA report — automated copy scan + brand kit fidelity pass. Step 3 first pass |
| 2026-05-18 | Aesthetic + accessibility visual review. Step 3 final |
| 2026-05-19 | Consolidated fix list to Raja. Raja sprint to 2026-05-21 |
| 2026-05-22 | Internal QA pass complete (Jason). Zero BLOCK-severity outstanding |
| 2026-05-25 | Production launch (week of) |

## Project artifacts

- `brief.md` — this file
- `deliverables/page-status-tracker.md` — Step 1 output, living document until launch
- `deliverables/spec-compliance-audit.md` — Step 2 output
- `deliverables/brand-qa-report.md` — Step 3 output
- `deliverables/snapshots/{YYYY-MM-DD}/` — per-audit-pass HTML + screenshot snapshots
- `deliverables/fix-list-for-raja.md` — final consolidated, page-grouped fix list

## Open items at brief-write time

- Confirm whether `/about/editorial-standards/` is in Raja's build queue at all (currently `in-progress` in mirror but copy is still in production by website-quick-launch project — may not be a dev priority for 2026-05-25).
- Confirm whether `/service-hub/warranties/` has a creative brief (none found in local mirror under that name; need to check ClickUp live for a recent brief).
- Confirm whether legal pages (`/privacy-policy/`, `/terms-of-service/`) are blocked on counsel-supplied text or have placeholder text Raja can build against.
- Confirm whether Raja's "DMs" include the ClickUp chat (1:1 / DM channel) or are limited to task comments. Per Jason's answer they're in ClickUp — first fetch will reveal which channel.
