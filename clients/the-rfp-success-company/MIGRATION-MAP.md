# Migration Map — Claude.ai Project → Agentic OS

**Purpose:** Map every file from the Claude.ai project knowledge dump (`claudeprojectmdfiles.zip`) to its destination in the Agentic OS folder structure for `clients/the-rfp-success-company/`.

**Source:** Claude.ai project for The RFP Success® Company website engagement
**Target:** `clients/the-rfp-success-company/` in the agentic-os repo
**Migration date:** May 12, 2026
**Files in scope:** 21 markdown files (~458 KB total)

---

## Destination strategy

Files distribute across four roles in the Agentic OS structure:

1. **`brand_context/`** — Distilled, Claude-Code-readable summaries for session inheritance
2. **`brand_context/sops/`** — Client-specific SOPs that overlay agency-level SOPs
3. **`projects/website/`** — Active deliverables, creative briefs, project artifacts
4. **`context/`** — Living state docs (learnings, session history, engagement status)
5. **`inputs/project-knowledge/`** — Canonical source documents preserved verbatim

Two principles govern the distribution:

- **Canonical files stay canonical.** Brand Voice DNA v2.2, Sitemap v10, Page Template Map, and Client Parameter Sheet are large reference docs (some 60K+). They live in `inputs/project-knowledge/` as immutable references. The `brand_context/` files are distilled session-load companions, not replacements.
- **Living docs become living docs.** Master Feedback Tracker is the canonical source for ongoing corrections; `context/learnings.md` mirrors it for session-level reference. Session Summaries become `context/session-summaries.md` and continue to accrue.

---

## File-by-file mapping

| # | Source File | Size | Destination | Role |
|---|---|---|---|---|
| 1 | `README.md` | 6 KB | `inputs/project-knowledge/README.md` + reference from `context/engagement-status.md` | Reference — overall project orientation |
| 2 | `AGENT_LOADING_INSTRUCTIONS.md` | 4 KB | Merge into `AGENTS.md` at client root (or `inputs/project-knowledge/` if scaffold AGENTS.md already covers loading) | Reference / Agent runtime |
| 3 | `PROJECT_INSTRUCTIONS.md` | 5 KB | `inputs/project-knowledge/PROJECT_INSTRUCTIONS.md` + key facts mirrored in `context/engagement-status.md` | Reference — engagement context |
| 4 | `WRITING_RULES.md` | 6 KB | **Already merged into** `brand_context/voice-profile.md` (Stop Slop overlay + RFP brand layer + AI signal framework) | Distilled into brand_context |
| 5 | `USER_MEMORY.md` | 9 KB | **Already mirrored into** `context/learnings.md` (Resolved corrections section) | Distilled into context |
| 6 | `AGENCY_CORE_STANDARDS_v1.1.md` | 15 KB | **DIFF against** `agency/sops/ROI-LIVE-Agency-Core-Standards-v1.1.md` in repo root. Inherited via standard inheritance chain, not duplicated here. | Inherited, do not duplicate |
| 7 | `AGENCY_SERVICE_PAGE_SOP_v1.1.md` | 8 KB | **DIFF against** `agency/sops/ROI-LIVE-Agency-Service-Page-SOP-v1.1.md`. Inherited, not duplicated. | Inherited, do not duplicate |
| 8 | `RFP_SUCCESS_WEBSITE_CONTENT_SOP_v1.2.md` | 19 KB | `brand_context/sops/RFP_Success_Website_Content_SOP_v1.2.md` | Client SOP overlay |
| 9 | `BRAND_VOICE_DNA_v2.2.md` | 60 KB | `inputs/project-knowledge/BRAND_VOICE_DNA_v2.2.md` (canonical reference). `brand_context/voice-profile.md` is the distilled session-load companion. | Canonical reference |
| 10 | `SITEMAP_v10.md` | 50 KB | `projects/website/SITEMAP_v10.md` (working artifact for the website project) | Project deliverable |
| 11 | `PAGE_TEMPLATE_MAP_v1.0.md` | 42 KB | `projects/website/PAGE_TEMPLATE_MAP_v1.0.md` | Project deliverable |
| 12 | `CLIENT_PARAMETER_SHEET_v1.0.md` | 32 KB | `brand_context/CLIENT_PARAMETER_SHEET_v1.0.md` (referenced by every page brief; lives at brand_context level) | Brand context — variable sheet |
| 13 | `CREATIVE_BRIEF_HOMEPAGE_v1.0.md` | 85 KB | `projects/website/briefs/homepage-v1.1.md` (note v1.1 is the Advisory Pivot revision; the file is named v1.0 in the dump but contains the v1.1 content per session summaries) | Project deliverable |
| 14 | `CREATIVE_BRIEF_T4_CASE_STUDY_v1.0.md` | 64 KB | `projects/website/briefs/T4-case-study-template-v1.0.md` | Project deliverable |
| 15 | `ADVISEMENT_SERVICES_COMPLETE_GUIDE.md` | 11 KB | `projects/website/briefs/advisement-services-creative-brief-v1.0.md` (this is the `/advisement/` T2 brief) | Project deliverable |
| 16 | `MASTER_FEEDBACK_TRACKER.md` | 9 KB | `context/MASTER_FEEDBACK_TRACKER.md` (LIVING DOC — primary source). `context/learnings.md` mirrors it for session-level reference. | Living context — primary |
| 17 | `QUICK_REFERENCE_CARD.md` | 4 KB | `brand_context/quick-reference-card.md` | Brand context — quick reference |
| 18 | `AUDIO_TRANSCRIPTIONS_COMPLETE.md` | 10 KB | `inputs/audio-transcriptions/lisa-audio-transcriptions-complete.md` | Raw source material |
| 19 | `SUSAN_RFP_QUESTIONS_2_17_26.md` | 5 KB | `inputs/team-contributions/susan-rfp-questions-2026-02-17.md` | Raw source material |
| 20 | `ANNA_ABOUT_RESPONDING_TO_RFPS.md` | 4 KB | `inputs/team-contributions/anna-responding-to-rfps.md` | Raw source material |
| 21 | `SESSION_SUMMARIES.md` | 11 KB | `context/session-summaries.md` (LIVING DOC — append new sessions) | Living context — engagement history |

---

## Target folder structure (after migration)

```
clients/the-rfp-success-company/
├── AGENTS.md                                          # Standard from scaffold + agent loading additions
├── CLAUDE.md                                          # Standard from scaffold (imports agency CLAUDE.md)
├── brand_context/
│   ├── positioning.md                                 # ✅ Migrated, patched (v2)
│   ├── voice-profile.md                               # ✅ Migrated, patched (v2)
│   ├── icp.md                                         # ✅ Migrated, patched (v2)
│   ├── samples.md                                     # ✅ Migrated, patched (v2)
│   ├── assets.md                                      # ✅ Migrated (skeletal — Drive pending)
│   ├── CLIENT_PARAMETER_SHEET_v1.0.md                 # ← from #12 in dump
│   ├── quick-reference-card.md                        # ← from #17 in dump
│   └── sops/
│       ├── RFP_Success_Website_Content_SOP_v1.2.md    # ← from #8 in dump
│       └── RFP_Editorial_Overlay_v1.md                # 🔴 NOT YET BUILT — Citation Discipline overlay
├── context/
│   ├── learnings.md                                   # ✅ Mirrors MFT
│   ├── engagement-status.md                           # ✅ Migration-aware
│   ├── MASTER_FEEDBACK_TRACKER.md                     # ← from #16 in dump (LIVING)
│   └── session-summaries.md                           # ← from #21 in dump (LIVING)
├── projects/
│   └── website/
│       ├── SITEMAP_v10.md                             # ← from #10 in dump
│       ├── PAGE_TEMPLATE_MAP_v1.0.md                  # ← from #11 in dump
│       ├── briefs/
│       │   ├── homepage-v1.1.md                       # ← from #13 in dump
│       │   ├── advisement-services-creative-brief-v1.0.md  # ← from #15 in dump
│       │   ├── T4-case-study-template-v1.0.md         # ← from #14 in dump
│       │   └── evaluator-eye-audit-v1.0.md            # 🔴 NEXT DELIVERABLE (not yet built)
│       └── figma-revision-list-19-items.md            # 🔴 Extract from sessions / dump if needed
├── inputs/
│   ├── project-knowledge/
│   │   ├── README.md                                  # ← from #1 in dump
│   │   ├── PROJECT_INSTRUCTIONS.md                    # ← from #3 in dump
│   │   ├── BRAND_VOICE_DNA_v2.2.md                    # ← from #9 in dump (canonical reference)
│   │   ├── AGENT_LOADING_INSTRUCTIONS.md              # ← from #2 in dump (if not merged into AGENTS.md)
│   │   └── USER_MEMORY.md                             # ← from #5 in dump (already mirrored in learnings)
│   ├── audio-transcriptions/
│   │   └── lisa-audio-transcriptions-complete.md      # ← from #18 in dump
│   ├── team-contributions/
│   │   ├── susan-rfp-questions-2026-02-17.md          # ← from #19 in dump
│   │   └── anna-responding-to-rfps.md                 # ← from #20 in dump
│   ├── ideal-client-clarity-worksheets/
│   │   ├── 4_Library_Content_FINAL.docx               # From original upload
│   │   ├── 5_Strategic_Review_FINAL.docx              # From original upload
│   │   ├── 6_Content_Refinement_FINAL.docx            # From original upload
│   │   └── 7_Play_to_Win_FINAL.docx                   # From original upload
│   └── drive-assets/                                  # 🔴 Pull from Google Drive folder
│       ├── logos/
│       ├── lisa-headshots/
│       ├── way-i-see-it-videos/
│       └── canva-brand-kit/
```

---

## Migration commands (Bash, Windows-aware)

```bash
# 1. Branch and scaffold
cd ~/agentic/agentic-os
git checkout -b feature/migrate-the-rfp-success-company-to-agentic-os
bash scripts/add-client.sh the-rfp-success-company

# 2. Drop in the patched brand_context (v2)
unzip -o ~/Downloads/the-rfp-success-company-brand-context-v2.zip -d clients/

# 3. Create the target subdirectories
mkdir -p clients/the-rfp-success-company/brand_context/sops
mkdir -p clients/the-rfp-success-company/projects/website/briefs
mkdir -p clients/the-rfp-success-company/inputs/project-knowledge
mkdir -p clients/the-rfp-success-company/inputs/audio-transcriptions
mkdir -p clients/the-rfp-success-company/inputs/team-contributions
mkdir -p clients/the-rfp-success-company/inputs/ideal-client-clarity-worksheets
mkdir -p clients/the-rfp-success-company/inputs/drive-assets

# 4. Unzip the project knowledge dump to a staging area
unzip -o ~/Downloads/claudeprojectmdfiles.zip -d /tmp/rfp-dump/

# 5. Move files per the mapping table
CLIENT_DIR="clients/the-rfp-success-company"

# Brand context / SOPs
mv /tmp/rfp-dump/CLIENT_PARAMETER_SHEET_v1.0.md $CLIENT_DIR/brand_context/
mv /tmp/rfp-dump/QUICK_REFERENCE_CARD.md $CLIENT_DIR/brand_context/quick-reference-card.md
mv /tmp/rfp-dump/RFP_SUCCESS_WEBSITE_CONTENT_SOP_v1.2.md $CLIENT_DIR/brand_context/sops/

# Project / website artifacts
mv /tmp/rfp-dump/SITEMAP_v10.md $CLIENT_DIR/projects/website/
mv /tmp/rfp-dump/PAGE_TEMPLATE_MAP_v1.0.md $CLIENT_DIR/projects/website/
mv /tmp/rfp-dump/CREATIVE_BRIEF_HOMEPAGE_v1.0.md $CLIENT_DIR/projects/website/briefs/homepage-v1.1.md
mv /tmp/rfp-dump/CREATIVE_BRIEF_T4_CASE_STUDY_v1.0.md $CLIENT_DIR/projects/website/briefs/T4-case-study-template-v1.0.md
mv /tmp/rfp-dump/ADVISEMENT_SERVICES_COMPLETE_GUIDE.md $CLIENT_DIR/projects/website/briefs/advisement-services-creative-brief-v1.0.md

# Living context
mv /tmp/rfp-dump/MASTER_FEEDBACK_TRACKER.md $CLIENT_DIR/context/
mv /tmp/rfp-dump/SESSION_SUMMARIES.md $CLIENT_DIR/context/session-summaries.md

# Inputs — project knowledge (canonical references)
mv /tmp/rfp-dump/README.md $CLIENT_DIR/inputs/project-knowledge/
mv /tmp/rfp-dump/PROJECT_INSTRUCTIONS.md $CLIENT_DIR/inputs/project-knowledge/
mv /tmp/rfp-dump/BRAND_VOICE_DNA_v2.2.md $CLIENT_DIR/inputs/project-knowledge/
mv /tmp/rfp-dump/AGENT_LOADING_INSTRUCTIONS.md $CLIENT_DIR/inputs/project-knowledge/
mv /tmp/rfp-dump/USER_MEMORY.md $CLIENT_DIR/inputs/project-knowledge/
mv /tmp/rfp-dump/WRITING_RULES.md $CLIENT_DIR/inputs/project-knowledge/

# Source materials
mv /tmp/rfp-dump/AUDIO_TRANSCRIPTIONS_COMPLETE.md $CLIENT_DIR/inputs/audio-transcriptions/lisa-audio-transcriptions-complete.md
mv /tmp/rfp-dump/SUSAN_RFP_QUESTIONS_2_17_26.md $CLIENT_DIR/inputs/team-contributions/susan-rfp-questions-2026-02-17.md
mv /tmp/rfp-dump/ANNA_ABOUT_RESPONDING_TO_RFPS.md $CLIENT_DIR/inputs/team-contributions/anna-responding-to-rfps.md

# 6. Reconcile agency-level files
diff /tmp/rfp-dump/AGENCY_CORE_STANDARDS_v1.1.md agency/sops/ROI-LIVE-Agency-Core-Standards-v1.1.md > /tmp/core-standards-diff.txt
diff /tmp/rfp-dump/AGENCY_SERVICE_PAGE_SOP_v1.1.md agency/sops/ROI-LIVE-Agency-Service-Page-SOP-v1.1.md > /tmp/service-page-sop-diff.txt
# Review diffs. If repo versions are older, update agency-level files. If identical or repo is newer, discard dump versions.

# 7. Drop the existing dump versions of agency files (after reconciliation)
rm /tmp/rfp-dump/AGENCY_CORE_STANDARDS_v1.1.md
rm /tmp/rfp-dump/AGENCY_SERVICE_PAGE_SOP_v1.1.md

# 8. Move the four ICP worksheets into inputs
mv /mnt/c/Users/jason/Downloads/4_Ideal-Client-Clarity-Worksheet_Library_Content_FINAL.docx $CLIENT_DIR/inputs/ideal-client-clarity-worksheets/
# (and 5, 6, 7)

# 9. Commit in stages
git add $CLIENT_DIR/brand_context/
git commit -m "feat(client/rfp-success): migrate brand_context (v2 patches: 30+ years, RFP-expert prefix, archetypes, AI signal framework)"

git add $CLIENT_DIR/context/
git commit -m "feat(client/rfp-success): migrate context (Master Feedback Tracker, session summaries, learnings)"

git add $CLIENT_DIR/projects/
git commit -m "feat(client/rfp-success): migrate website project artifacts (sitemap v10, page template map, 3 creative briefs)"

git add $CLIENT_DIR/inputs/
git commit -m "feat(client/rfp-success): import project knowledge sources (brand voice DNA, audio, team contributions, ICP worksheets)"

# 10. Push and open PR
git push -u origin feature/migrate-the-rfp-success-company-to-agentic-os
```

---

## Reconciliation tasks during migration

### R1. Agency Core Standards diff

The dump contains `AGENCY_CORE_STANDARDS_v1.1.md` (15 KB). The repo has `agency/sops/ROI-LIVE-Agency-Core-Standards-v1.1.md`. Three possible states:

- **Identical** → no action; discard dump version
- **Repo is older** → update repo's agency-level file (chore branch, separate PR)
- **Dump has client-specific additions** → those additions belong in `brand_context/sops/RFP_Success_Website_Content_SOP_v1.2.md`, not in agency-level

### R2. Agency Service Page SOP diff

Same procedure for `AGENCY_SERVICE_PAGE_SOP_v1.1.md`.

### R3. Creative brief filename normalization

`CREATIVE_BRIEF_HOMEPAGE_v1.0.md` per the dump is actually v1.1 content per `SESSION_SUMMARIES.md` (the Advisory Pivot revision). Rename on import: `briefs/homepage-v1.1.md`.

### R4. ADVISEMENT_SERVICES_COMPLETE_GUIDE.md classification

This file is the Win Strategist Services Creative Brief v1.0 (the T2 brief for `/advisement/`). The filename is ambiguous about what it is. Rename on import: `briefs/advisement-services-creative-brief-v1.0.md`.

### R5. Agency CLAUDE.md inheritance

The Agentic OS scaffold creates a `CLAUDE.md` at the client level that imports the agency CLAUDE.md. Confirm the agency CLAUDE.md correctly references the inheritance order in `AGENT_LOADING_INSTRUCTIONS.md` from the dump. If not, supplement.

### R6. Page Template Map cross-references

`PAGE_TEMPLATE_MAP_v1.0.md` references 17 templates. After import, verify the template IDs (T1, T2, T3, etc.) match the references in `SITEMAP_v10.md` and the creative briefs. The Template column was added in v10 — confirm consistency.

---

## Post-migration verification checklist

Before merging the migration PR:

- [ ] Run a Claude Code session in `clients/the-rfp-success-company/`. Confirm:
  - Agency Core Standards loads
  - `brand_context/voice-profile.md` loads
  - `brand_context/sops/RFP_Success_Website_Content_SOP_v1.2.md` loads
  - `context/MASTER_FEEDBACK_TRACKER.md` is reachable
  - `inputs/project-knowledge/` is accessible
- [ ] Confirm the inheritance chain: Core Standards → Service Page SOP → RFP Success Website & Content SOP v1.2 → brand_context
- [ ] Grep across `inputs/project-knowledge/` for stale stats: `grep -r "26+ years\|78%" clients/the-rfp-success-company/inputs/project-knowledge/` should show only in change-log entries documenting the correction
- [ ] Confirm Stop Slop scan passes on the migrated brand_context files (they don't include banned phrases in their meta-content)
- [ ] Verify the four ICP worksheet docx files are present in `inputs/ideal-client-clarity-worksheets/`
- [ ] Confirm the Google Drive folder mirror task is captured as an open item

---

## What this migration enables

Once complete, Jason can start a Claude Code session in `clients/the-rfp-success-company/` and immediately build the next deliverable:

**Evaluator's Eye Audit individual service page creative brief (T3).**

The session inherits Core Standards → Service Page SOP → RFP Success Website & Content SOP v1.2 → brand_context (voice, positioning, ICP, archetypes). Loads Sitemap v10 for URL architecture, Page Template Map for template inheritance, Homepage Brief v1.1 for visual conventions, Advisement Brief v1.0 as the T2 → T3 inheritance template. References Master Feedback Tracker for non-negotiable rules and audio transcriptions for evaluator-perspective content.

That's the work the migration unlocks. The migration itself is the bridge from Claude.ai project storage to Agentic OS execution.
