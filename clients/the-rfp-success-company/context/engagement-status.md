# Engagement Status — The RFP Success® Company

**Engagement type:** Full fractional CMO — website build + 12-month content retainer + SEO + conversion optimization
**Engagement start:** Q1 2026
**Migration to Agentic OS:** May 12, 2026
**Current state:** Active, mature engagement. Homepage design approved. Multiple creative briefs complete. Next deliverable queued.

This is NOT a fresh onboarding. The brand context and project knowledge were built over 9 working sessions Jan–May 2026 in Claude.ai project storage. This migration imports that mature work into the Agentic OS folder structure so Claude Code sessions can execute against it.

---

## What's complete

- **Homepage Creative Brief v1.1** (Advisory Pivot integration)
- **Win Strategist Services Creative Brief v1.0** (`/advisement/` page — 811 lines, 7,000+ words; the model for all service landing pages)
- **T4 Case Study Template Creative Brief v1.0** (reference build: RTA Fleet)
- **Master Brand Voice & DNA Guide v2.2** (Advisory Pivot, multi-voice integration with Susan and Anna)
- **Sitemap v10** (Advisory Pivot — cleaned of all pre-pivot residue)
- **Page Template Map v1.0** (17 templates governing 69 launch + 96 roadmap pages)
- **Client Parameter Sheet v1.0** (8 of 11 sections READY, 3 PARTIAL pending Lisa/Raja inputs)
- **ROI.LIVE Agency Core Standards v1.1**
- **ROI.LIVE Agency Service Page SOP v1.1**
- **RFP Success Website & Content SOP v1.2** (client-specific overlay)
- **Homepage design (Sample 2 by Raja) approved by Lisa, April 2026**
- **19-item homepage revision list delivered to Raja**

## What's next in sequence

| # | Deliverable | Template | Status | Unblocks |
|---|---|---|---|---|
| 1 | **Evaluator's Eye Audit Creative Brief** | T3 Individual Service | 🔴 Next priority | Reference build for 4 more service pages |
| 2 | Win Strategy Review Creative Brief | T3 (inherits from #1) | ⏸ Queued | — |
| 3 | Embedded Content Refinement Creative Brief | T3 (inherits, premium modifier) | ⏸ Queued | — |
| 4 | Play to Win Consults Creative Brief | T3 (inherits) | ⏸ Queued | — |
| 5 | Library Content Development Creative Brief | T3 (inherits) | ⏸ Queued | — |
| 6 | T9 Author Bio (Lisa Rehurek) | T9 Author Bio | 🟡 Required E-E-A-T anchor | All site pages reference it |
| 7 | T5 Industry Vertical template (Technology & IT first) | T5 Industry Vertical | ⏸ Queued | 11 industry pages |
| 8 | Case studies: RTA Fleet (reference) + 9 inheriting variants | T4 Case Study | 🟡 Pending permissions | Service page proof sections |

## What's blocked

| Item | Blocker | Decision Owner |
|---|---|---|
| T11 Quiz (RFP Assessment) | Wine/Champagne revenue range + question wording | Lisa (MFT Open Items #1, #2) |
| T5 Industry Verticals for Cybersecurity, Staffing, Telecom | No case study evidence yet | Pending engagements that produce evidence |
| Backlink audit, brand mention tooling, Knowledge Panel seeding | 30-day post-engagement-start hold | Time-based, not blocking |
| `/dare/` page launch | D.A.R.E. eBook PDF update | Lisa (MFT Open Item #12) |
| Case study pages beyond Optumas | Logo + quote + metric permissions per case | Lisa per case (MFT Open Item #4) |

---

## Quick state snapshot (Agentic OS folder)

| Workstream | Status |
|---|---|
| Brand context — positioning.md | ✅ Migrated, patched with MFT corrections |
| Brand context — voice-profile.md | ✅ Migrated, patched with MFT corrections + AI signal framework |
| Brand context — icp.md | ✅ Migrated, patched with 5 customer archetypes |
| Brand context — samples.md | ✅ Migrated, patched with stat corrections |
| Brand context — assets.md | 🟡 Skeletal — Drive folder still needs mirroring |
| Brand context — sops/RFP_Success_Website_Content_SOP_v1.2.md | 🔴 Not yet imported from project knowledge dump |
| Brand context — sops/RFP_Editorial_Overlay_v1.md (Citation Discipline) | 🔴 Not yet built |
| Context — learnings.md | ✅ Mirrors Master Feedback Tracker |
| Context — session-summaries.md | 🔴 Not yet imported (file exists in dump) |
| Context — engagement-status.md (this file) | ✅ Current |
| Inputs — project-knowledge/ (21 files from Claude.ai dump) | 🔴 Not yet imported |
| Inputs — Drive folder mirror (Google Drive assets) | 🔴 Not yet pulled |
| Inputs — audio-transcriptions/ | 🔴 Not yet imported (in dump) |
| Inputs — team-contributions/ (Susan, Anna) | 🔴 Not yet imported (in dump) |
| Projects — website/briefs/homepage-v1.1.md | 🔴 Not yet imported (in dump) |
| Projects — website/briefs/T4-case-study-v1.0.md | 🔴 Not yet imported (in dump) |
| Projects — website/briefs/advisement-v1.0.md | 🔴 Not yet imported (in dump) |
| Projects — website/sitemap-v10.md | 🔴 Not yet imported (in dump) |
| Projects — website/page-template-map.md | 🔴 Not yet imported (in dump) |
| Projects — website/figma-revision-list.md (19 items for Raja) | 🔴 Not yet imported (in dump) |

---

## Stakeholders

| Person | Role |
|---|---|
| **Lisa Rehurek** | Founder & CEO of The RFP Success® Company. Primary voice. Final decision-maker on copy, positioning, brand voice. |
| **Jason Spencer** | Founder of ROI.LIVE. Strategic lead, account manager, brief author. Directive working style. |
| **Raja** | Web designer/developer building the site. Receives finished creative briefs. Has 19-item homepage revision list. |
| **Susan Mershon** | Tech integrations (GoHighLevel). Contributor to Brand Voice v2.2 (evaluator perspective). Not public-facing. |
| **Anna** | Compliance/evaluator expertise. Contributor to Brand Voice v2.2. Not public-facing. |
| **Manzoor (media@roi.live)** | Has Canva access for the official RFP Success brand kit (hex codes, fonts, usage). Pull design tokens from here, NOT from Figma. |
| **Jordan Spencer** | Not currently involved in this engagement (Coastal Air Plus is his primary client). |

## ⚠️ Stakeholder communication constraints

**Lisa cannot open .md files.** Lisa, Feb 2026: *"I cannot open these documents, not sure what the format is but it's a .md extension."*

**Hard rule:** Every deliverable sent to Lisa for review must be converted to Word (.docx), PDF, or Google Docs before sharing. Markdown working files stay internal to ROI.LIVE. The per-client SOP overlay (`RFP_Editorial_Overlay_v1.md` once built) must include a Lisa-facing-export step before any handoff.

---

## Migration sequence

Migration steps in order. Each step is a discrete commit on `feature/migrate-the-rfp-success-company-to-agentic-os`.

1. **Scaffold the client folder.** `bash scripts/add-client.sh the-rfp-success-company` → creates the standard folder structure.
2. **Drop the v1 brand_context** I delivered in the previous turn into `clients/the-rfp-success-company/brand_context/` — overwriting the scaffold defaults.
3. **Drop the v2 patched brand_context** (this delivery) over the v1 — fixes 26+ → 30+, adds RFP-expert prefix, adds 5 archetypes, adds AI signal framework.
4. **Import the project knowledge dump** per `MIGRATION-MAP.md`. The 21 files from `claudeprojectmdfiles.zip` get distributed across `inputs/project-knowledge/`, `brand_context/sops/`, `projects/website/`, and `context/`.
5. **Diff the agency-level docs.** `AGENCY_CORE_STANDARDS_v1.1.md` and `AGENCY_SERVICE_PAGE_SOP_v1.1.md` from the dump vs. what's in `agency/sops/` in the repo. Reconcile.
6. **Mirror the Google Drive folder** into `inputs/drive-assets/`. Pull at minimum: logos, headshots, brand kit, video assets.
7. **Run inheritance verification.** Open a Claude Code session in `clients/the-rfp-success-company/`. Confirm Core Standards loads, brand_context loads, the per-client SOP overlays, and the Stop Slop rules apply.
8. **Open the PR.** Single PR for the whole migration, structured commits.
9. **Begin the next creative brief:** Evaluator's Eye Audit T3 service page. This is the actual work the migration enables.

---

## Critical path: next deliverable

**Evaluator's Eye Audit individual service page creative brief.**

Per the next-session prompt logged in `SESSION_SUMMARIES.md`:

- Service URL: `/services/proposal-audit/`
- Pricing: $2,500–$5,000 (entry level Win Strategist offering)
- Most common starting point for clients (both Wine and Champagne tiers)
- Most-linked-to service from `/advisement/` and homepage
- Direct search intent: "RFP audit services," "proposal audit"
- Case study backing: RTA Fleet 50% → 80% finalist rate

Once this brief is built, it becomes the inheritance template for the other four Win Strategist service pages (Win Strategy Review, Embedded Content Refinement, Play to Win Consults, Library Content Development).

**Companion docs to load when building this brief** (per `AGENT_LOADING_INSTRUCTIONS.md`):

1. ROI.LIVE Agency Core Standards v1.1
2. ROI.LIVE Agency Service Page SOP v1.1
3. Client Parameter Sheet v1.0
4. Master Client Feedback Tracker v1.0
5. Master Brand Voice & DNA Guide v2.2
6. Sitemap v10
7. Page Template Map v1.0
8. Homepage Creative Brief v1.1 (design inheritance baseline)
9. Win Strategist Services Creative Brief v1.0 (T2 → T3 inheritance template)

---

## The Figma factor (approved designs)

Lisa approved Sample 2 of Raja's homepage design in April 2026. The approved Figma is at:

`https://www.figma.com/design/7pnbfLIGvsBybTNz9Cn3Kp/RFP?node-id=182-5&m=dev&t=5B2wQwOqk3VolXeN-1`

Implications for content work going forward:

- Homepage layout is locked. Content must fit the approved design, not the reverse.
- 19-item Raja revision list represents the gap between Sample 2 and the production-ready homepage. Resolving those 19 items closes the loop.
- T2 (`/advisement/`) and T3 (service pages) designs need to inherit visual conventions from the approved homepage.
- T9 (Lisa Bio) needs E-E-A-T treatment matching the homepage authority bar.

When building the Evaluator's Eye Audit brief, reference the homepage layout for component reuse: hero pattern, trust bar, service card structure, CTA placement, footer.
