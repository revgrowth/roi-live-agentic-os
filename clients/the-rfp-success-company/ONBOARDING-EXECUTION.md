# Onboarding Execution — The RFP Success® Company

**Migration of:** mature Claude.ai project into Agentic OS folder structure
**Working directory (this guide assumes):** `~/agentic/agentic-os/` (Git Bash on Windows)
**Sync model (May 2026):** Obsidian Sync handles day-to-day file movement across machines. GitHub runs as automated daily backup only. Feature branches and PRs become snapshot/milestone discipline, not daily flow.

---

## What you're doing and why

This isn't a fresh onboarding. The RFP Success Company has nine sessions of mature work (Jan–May 2026) in Claude.ai project storage. The homepage design is approved by Lisa, the `/advisement/` creative brief is in revisions, and the next deliverable (Evaluator's Eye Audit T3 service page brief) is queued.

The migration lifts all that work into Agentic OS so Claude Code sessions can execute against it with the agency inheritance chain (Core Standards → Service Page SOP → RFP Success Website & Content SOP v1.2 → brand_context). Once migrated, the next creative brief gets built inside Agentic OS, not in Claude.ai project storage.

---

## Pre-flight checklist (do these before starting)

- [ ] Obsidian vault is syncing the `~/agentic/agentic-os/` folder to your other machines (verify a test edit propagates)
- [ ] v3.1 brand_context zip downloaded: `the-rfp-success-company-brand-context-v3.1.zip`
- [ ] Original project knowledge zip available: `claudeprojectmdfiles.zip`
- [ ] Original ICP worksheets available: the four `*_FINAL.docx` files
- [ ] Manzoor (media@roi.live) is aware you may ask for Canva brand kit hex codes/fonts this week
- [ ] Claude Code session opens cleanly in `~/agentic/agentic-os/`
- [ ] ClickUp MCP and Google Drive MCP show as connected in Claude Code

---

## Step 1 — Scaffold the client folder

**What you're doing:** Create the standard Agentic OS folder structure for The RFP Success Company, before any content drops in.

**Manual action:**

```bash
cd ~/agentic/agentic-os
bash scripts/add-client.sh the-rfp-success-company
```

**Verify:**

```bash
ls clients/the-rfp-success-company/
# Should show: AGENTS.md  CLAUDE.md  brand_context/  context/  inputs/  projects/  scripts/  .claude/
```

**Then run this Claude Code prompt** to capture the scaffolded baseline and check for contamination (the GLC onboarding surfaced scaffold templates carrying ROI.LIVE-flavored content into client folders):

```
You're working in ~/agentic/agentic-os/clients/the-rfp-success-company/.

Read every file in this scaffolded folder (AGENTS.md, CLAUDE.md, brand_context/, context/, inputs/, scripts/). 

For each file, report:
1. What's in it (one-line summary)
2. Whether it contains any client-specific content that shouldn't be there (look for "ROI.LIVE", "Green Llama", "ALVARA", "Coastal Air", "Yellow Jacket", "Bergey", "FBC", "French Broad", "Heath Armstrong" — these are signs of scaffold contamination from other clients)

Report findings only. Do not modify anything yet. Wait for my approval before any edits.
```

**Why this matters:** Per learnings.md A6, scaffold contamination is a known risk. Catching it before brand_context drops in prevents stale content from polluting the new client.

---

## Step 2 — Drop in v3.1 brand_context

**What you're doing:** Replace the scaffold's empty brand_context with the v3.1 files I delivered.

**Manual action:**

```bash
# From wherever you downloaded the zip
cd ~/Downloads
unzip the-rfp-success-company-brand-context-v3.1.zip -d /tmp/rfp-v3.1/

# Overwrite the scaffold's brand_context/ and context/ files
cp /tmp/rfp-v3.1/the-rfp-success-company-v3.1/brand_context/*.md \
   ~/agentic/agentic-os/clients/the-rfp-success-company/brand_context/

cp /tmp/rfp-v3.1/the-rfp-success-company-v3.1/context/*.md \
   ~/agentic/agentic-os/clients/the-rfp-success-company/context/

# Drop the meta-files at client root for reference during migration
cp /tmp/rfp-v3.1/the-rfp-success-company-v3.1/MIGRATION-MAP.md \
   ~/agentic/agentic-os/clients/the-rfp-success-company/

cp /tmp/rfp-v3.1/the-rfp-success-company-v3.1/UPDATES-FROM-CLICKUP.md \
   ~/agentic/agentic-os/clients/the-rfp-success-company/
```

**Verify:**

```bash
ls clients/the-rfp-success-company/brand_context/
# Should show: assets.md  icp.md  positioning.md  samples.md  voice-profile.md

grep -c "30+ years" clients/the-rfp-success-company/brand_context/*.md
# Should return non-zero counts in positioning.md and voice-profile.md (corrections held)

grep "13fudkdd" clients/the-rfp-success-company/brand_context/*.md
# Should return nothing (wrong RK Studios Drive folder reference removed)
```

---

## Step 3 — Import the 21 project knowledge files

**What you're doing:** Move every file from the Claude.ai project knowledge zip into its destination in the Agentic OS structure per the migration map.

**Run this Claude Code prompt:**

```
You're working in ~/agentic/agentic-os/clients/the-rfp-success-company/.

Read ~/agentic/agentic-os/clients/the-rfp-success-company/MIGRATION-MAP.md carefully. This document maps every file from the project knowledge zip to a destination folder.

The source zip is at ~/Downloads/claudeprojectmdfiles.zip. Unzip it to /tmp/rfp-dump/.

Then execute the file moves exactly as documented in MIGRATION-MAP.md's "Migration commands" section. Renames matter: CREATIVE_BRIEF_HOMEPAGE_v1.0.md becomes briefs/homepage-v1.1.md (it contains the v1.1 Advisory Pivot content per SESSION_SUMMARIES.md). ADVISEMENT_SERVICES_COMPLETE_GUIDE.md becomes briefs/advisement-services-creative-brief-v1.0.md (it's the T2 brief for /advisement/, not a generic guide).

Do NOT touch AGENCY_CORE_STANDARDS_v1.1.md or AGENCY_SERVICE_PAGE_SOP_v1.1.md — those need manual reconciliation against the repo's agency/sops/ versions in the next step.

After all moves complete, run:
1. tree -L 3 clients/the-rfp-success-company/ to show me the final structure
2. ls /tmp/rfp-dump/ to confirm only the two agency-level files remain (uncopied)

Wait for me to confirm before continuing.
```

**Verify by hand:**

- `projects/website/SITEMAP_v10.md` exists
- `projects/website/briefs/homepage-v1.1.md` exists (not "homepage-v1.0")
- `context/MASTER_FEEDBACK_TRACKER.md` exists (the living doc)
- `inputs/project-knowledge/BRAND_VOICE_DNA_v2.2.md` exists (the 60K canonical reference)
- `brand_context/CLIENT_PARAMETER_SHEET_v1.0.md` exists at brand_context level (not inside `inputs/`)

---

## Step 4 — Reconcile the two agency-level documents

**What you're doing:** Two files from the dump are agency-level, not client-level. They might match the repo's existing versions, or they might be newer/older. Decide which.

**Run this Claude Code prompt:**

```
You're working in ~/agentic/agentic-os/.

Two files need reconciliation:
- /tmp/rfp-dump/AGENCY_CORE_STANDARDS_v1.1.md vs. agency/sops/ROI-LIVE-Agency-Core-Standards-v1.1.md
- /tmp/rfp-dump/AGENCY_SERVICE_PAGE_SOP_v1.1.md vs. agency/sops/ROI-LIVE-Agency-Service-Page-SOP-v1.1.md

For each pair:
1. Run diff and show me the output
2. Tell me whether the files are identical, the dump version is newer, the repo version is newer, or they're divergent (different additions on each side)
3. If divergent, identify what content lives only in the dump version — is it RFP-Success-specific? If yes, it belongs in clients/the-rfp-success-company/brand_context/sops/RFP_Success_Website_Content_SOP_v1.2.md, NOT in agency/sops/. If it's genuinely agency-level (applies to all clients), recommend updating the repo file.

Make no changes yet. Report findings and wait for my call on each.
```

**Why this matters:** Agency-level docs propagate to every client. A wrong merge contaminates Coastal Air Plus, ALVARA, GLC, G&H, and FBC. Manual review wins here.

---

## Step 5 — Pull the Canva brand kit values

**What you're doing:** Get the canonical hex codes, fonts, and design tokens from the Canva brand kit. This is the source of truth, NOT Figma.

**Manual action options (pick the path that fits):**

**Option A — Direct access:** If your account can open `https://www.canva.com/brand/kADcMcP3Ico`, do that and screenshot the brand kit page. Save the screenshot to `clients/the-rfp-success-company/inputs/drive-assets/canva-brand-kit-screenshot.png`.

**Option B — Manzoor:** Slack/email Manzoor (media@roi.live) with this request:

> Hey Manzoor — onboarding RFP Success into Agentic OS. Need the brand kit values from Canva (link below). Specifically:
> - All hex codes (primary, secondary, accent, neutral/gray scale)
> - Font families and weights used
> - Any documented spacing/layout rules
>
> Easiest if you can export the brand kit page as PDF or paste the values into a doc. Link: https://www.canva.com/brand/kADcMcP3Ico

Save whatever he returns to `inputs/drive-assets/canva-brand-kit/`.

**Then run this Claude Code prompt to populate assets.md:**

```
You're working in ~/agentic/agentic-os/clients/the-rfp-success-company/.

The Canva brand kit values are now in inputs/drive-assets/canva-brand-kit/. Read them.

Then update brand_context/assets.md by replacing the "Brand colors and design tokens" placeholder section with the actual values. Format as a table with: Token name | Hex code | Use case (per Sample 2 approved homepage).

Cross-reference against Lisa's "light and airy, no pure black" rule (Drive folder D1 finding in learnings.md). Flag any black hex codes (#000000 or near-black like #111, #1a1a1a) as needing replacement with charcoal gray.

Don't add hex codes that aren't in the source files. If something is missing (e.g. no documented spacing rules), note it as a gap and move on.

Show me the diff before saving.
```

---

## Step 6 — Pull the remaining ClickUp comments

**What you're doing:** Eight task comment streams and 49+ threaded replies are still ungathered. Plus the inline doc-level comments. The Claude Code session may have working auth that this session didn't.

**Run this Claude Code prompt:**

```
You're working in ~/agentic/agentic-os/clients/the-rfp-success-company/.

I need you to extract ClickUp content that wasn't captured in the v3.1 brand_context delivery. Use the ClickUp MCP. Workspace ID: 9013889233. List ID: 901324977136.

Pull comments from these tasks:
- 86ah2pyum (T6 State Guide template)
- 86ah2p9qm (T10 About/Team template)
- 86ah2p1c1 (T3 Service Page Template variant)
- 86ah2p8f4 (T5 Industry Vertical template)
- 86ah2p8u2 (T7 Authority Pillar template)
- 86ah2p7x9 (T4 Case Study template)
- 86ah2p9d4 (T9 Author Bio template) — HIGH PRIORITY, this is the E-E-A-T anchor
- 86ah2p93n (T8 Index/Hub template)

For each comment with reply_count > 0, call clickup_get_threaded_comments to pull the threaded replies. If you get "No approval received," try the call once more — auth may have refreshed. Skip and note the gap if it stays blocked.

Also try to pull doc-level comments on these ClickUp docs (these are inline page comments separate from task comments):
- Brand Voice DNA doc: pageId 8cma26h-5273 (v2.0 era) and 8cma26h-7493 (current)
- Sitemap doc: pageId 8cma26h-13933 (v8 era), pageId TBD for v10
- Homepage Brief doc: pageId 8cma26h-7493 (current)

For each extracted item, mine for:
- Lisa corrections not yet in MASTER_FEEDBACK_TRACKER.md
- Susan corrections not yet in voice-profile.md
- Anna contributions not yet captured
- New banned phrases or required phrasings

Output a single CLICKUP-COMMENTS-EXTRACT-v2.md file at clients/the-rfp-success-company/ root with all findings, organized by source task/doc. Do NOT modify brand_context or learnings.md yet — I want to review the findings first.
```

**After review, run:**

```
You're working in ~/agentic/agentic-os/clients/the-rfp-success-company/.

I've reviewed CLICKUP-COMMENTS-EXTRACT-v2.md. Now apply the findings:

1. Add any new Lisa corrections to context/MASTER_FEEDBACK_TRACKER.md (the canonical doc — section structure matches: §1 data, §2 brand/naming, §3 messaging, §6 open items, §7 resolved)
2. Mirror new locked corrections into context/learnings.md
3. Patch brand_context files for any new banned/required phrasings

Show me a diff summary before saving each file. No automatic commits.
```

---

## Step 7 — Mirror essential Drive assets

**What you're doing:** Pull the high-value files from the Drive folder into `inputs/drive-assets/`. Don't mirror the whole folder — it's too large and contains tier-archive folders (`OUTSOURCED (Premier)`) that are no longer relevant post-Advisory-Pivot.

**Run this Claude Code prompt:**

```
You're working in ~/agentic/agentic-os/clients/the-rfp-success-company/.

Use the Google Drive MCP to download these specific files into inputs/drive-assets/ with the subfolder structure shown:

inputs/drive-assets/brand-voice-source/
├── DARE_Presentation_2026.pptx          (Drive file ID: 1KOp_9qR5nsHYnju8lusYndP-l-wAWjYg)
├── Masterclass_4x4_Framework.pptx       (Drive file ID: 1qXInjC4E4bs_IaswPLFYSogY20IBXcR_)
├── Proposal_Writing_Best_Practices_2025.pptx  (Drive file ID: 1Mtp9cBOLknrNZVmeFV4fyntxxakrrAQm)
├── 2026_Champagne_Client_Info.pptx      (Drive file ID: 1ethP8C1QIZarKSOFQC3uSEw6IKU3UTQa)
└── DARE_Method_download_OUTDATED.pdf    (Drive file ID: 1nuUmxcgA3SD4JmrV4OVn3Kml7Qhq02ns)
                                          # Renamed to OUTDATED to flag the "Requirements" vs "Readability" issue

inputs/drive-assets/asset-links/
└── The_RFP_Success_Company_Asset_Links.docx   (Drive file ID: 1GLkvl4H0Dt34NBOSUd_MRcg5yvk7eOkh)

Skip the OPIN speaking workshop (151MB, 2020 vintage) and any folder I haven't listed.

For each downloaded file, run a quick content check: read_file_content and report the first 200 chars to confirm correct file. Stop and ask before overwriting any existing file.

Don't pull the Brand Voice + DNA folder's other contents beyond what's listed. Don't pull Case Studies + Client Testimonials folder — that's a future content production task, not migration-critical.
```

---

## Step 8 — Build the per-client editorial overlay

**What you're doing:** The agency Citation Discipline SOP needs a per-client overlay for RFP Success. This is the bridge that adds RFP-Success-specific rules (Lisa-can't-open-.md, light-and-airy, banned phrases) on top of the generic Citation Discipline framework.

**Run this Claude Code prompt:**

```
You're working in ~/agentic/agentic-os/clients/the-rfp-success-company/.

Build a new file at brand_context/sops/RFP_Editorial_Overlay_v1.md.

Reference implementation: clients/green-llama-clean/brand_context/sops/GL_Editorial_Overlay_v1.md (study its structure first).

The RFP Success overlay must cover:

1. Inheritance declaration: "This overlay applies on top of agency/sops/ROI-LIVE-Agency-Citation-Discipline-SOP-v1.md and agency/sops/ROI-LIVE-Agency-Core-Standards-v1.1.md. In conflict, this overlay wins for RFP Success client work."

2. Source tier mapping specific to RFP Success: Tier 1 (case studies, named-client outcomes, Lisa's own audio transcriptions, 4x4 Framework, D.A.R.E. Method); Tier 2 (Susan, Anna evaluator perspectives); Tier 3 (public web sources with attribution).

3. Three-level review chain naming: Author (ROI.LIVE writer) → Reviewer (Jason) → Approver (Lisa). Solo-reviewer cooling period: 24 hours minimum before Jason self-reviews his own draft.

4. Per-client hallucination catalog: 78% win rate (always 76%+), 26+ years (always 30+), "Full Response Management" (discontinued April 2026), federal positioning (never), "Healthcare IT is our specialty" (NOT a strength — Brand Voice DNA explicit).

5. Per-client regulatory mapping: SLED procurement language must be accurate; no claims about specific state procurement processes without source citation; no implied federal compliance.

6. Lisa-facing deliverable export step: every deliverable bound for Lisa converts to .docx, PDF, or Google Doc before sharing. Markdown working files stay internal.

7. Design constraint enforcement: every deliverable involving design specs must check assets.md for the "light and airy / no pure black" rule and the hero image rule (approved-folder-only).

8. Pre-submission checklist: brand_context/voice-profile.md banned phrases scan, MFT §2 brand rules scan (® symbol, RFP-expert prefix), source verification per Citation Discipline SOP, Stop Slop scan, Lisa-export step if applicable.

Write the file. Show it to me before saving.
```

---

## Step 9 — Verify the inheritance chain

**What you're doing:** Open a Claude Code session in the newly migrated client folder and confirm everything loads correctly. This is the smoke test before declaring the migration complete.

**Run this Claude Code prompt:**

```
You're starting a fresh session in ~/agentic/agentic-os/clients/the-rfp-success-company/.

This is an inheritance verification test. Do not produce any deliverables. Just confirm context loads correctly.

1. Read AGENTS.md and CLAUDE.md at this client level. Confirm CLAUDE.md imports the agency-level CLAUDE.md.

2. Walk the inheritance chain:
   a. agency/sops/ROI-LIVE-Agency-Core-Standards-v1.1.md (base)
   b. agency/sops/ROI-LIVE-Agency-Service-Page-SOP-v1.1.md (page type)
   c. agency/sops/ROI-LIVE-Agency-Citation-Discipline-SOP-v1.md (cross-cutting)
   d. brand_context/sops/RFP_Success_Website_Content_SOP_v1.2.md (client-level SOP)
   e. brand_context/sops/RFP_Editorial_Overlay_v1.md (client-level citation overlay)
   f. brand_context/positioning.md, voice-profile.md, icp.md, samples.md, assets.md
   g. context/MASTER_FEEDBACK_TRACKER.md, learnings.md, engagement-status.md
   h. brand_context/CLIENT_PARAMETER_SHEET_v1.0.md

3. Confirm every file exists and reads cleanly (no syntax errors, no merge conflict markers).

4. Run this consistency check: grep for "30+ years" across brand_context/ and context/ — should return multiple matches. Grep for "26+ years" — should return zero matches in active use (only in change-log/learnings entries documenting the correction). Grep for "78%" similarly.

5. Confirm projects/website/ contains: SITEMAP_v10.md, PAGE_TEMPLATE_MAP_v1.0.md, briefs/homepage-v1.1.md, briefs/advisement-services-creative-brief-v1.0.md, briefs/T4-case-study-template-v1.0.md.

6. Report: PASS or FAIL on each of the 5 checks above. If FAIL, list the specific gaps. Do NOT attempt to fix anything — report only.
```

If anything fails, fix the specific gap and re-run the verification.

---

## Step 10 — Snapshot the migration

**What you're doing:** With Obsidian Sync as the daily mechanism, you don't need feature branches for ongoing work. But this migration is a substantial structural change, and a git checkpoint here gives you a rollback option if something goes wrong downstream.

**Manual action:**

```bash
cd ~/agentic/agentic-os
git status
# Review what's about to land in the snapshot

# Optional but recommended for big changes: stage in logical chunks
git add clients/the-rfp-success-company/brand_context/
git commit -m "feat(client/rfp-success): migrate brand_context (v3.1 with 13 ClickUp corrections, Drive folder verified, Canva brand kit URL)"

git add clients/the-rfp-success-company/context/
git commit -m "feat(client/rfp-success): migrate context (Master Feedback Tracker, session summaries, learnings)"

git add clients/the-rfp-success-company/projects/
git commit -m "feat(client/rfp-success): migrate website project artifacts (sitemap v10, page template map, 3 creative briefs)"

git add clients/the-rfp-success-company/inputs/
git commit -m "feat(client/rfp-success): import sources (brand voice DNA, audio, team contributions, drive assets, ICP worksheets)"

git add clients/the-rfp-success-company/
git commit -m "feat(client/rfp-success): SOPs and root files (RFP_Success_Website_Content_SOP_v1.2, Editorial Overlay v1, AGENTS.md updates)"
```

**No PR needed** under the Obsidian-sync-first model. The GitHub backup runs nightly and captures the snapshot automatically. The manual commit above gives you named restore points.

**If you want a full snapshot before risky downstream work** (e.g. building the Evaluator's Eye Audit brief on top of the new structure):

```bash
git tag -a rfp-success-migration-v1 -m "RFP Success migrated into Agentic OS"
git push origin rfp-success-migration-v1
# Even if daily push is automated, manually pushing the tag ensures the named restore point lives on the remote
```

---

## What's next (post-migration)

These items need work but don't block the migration completing:

### Lisa-input items (you queue these)

- **MFT Open Item #1 expanded:** Wine revenue band conflict. The Feb 2026 Champagne deck says $1M–$10M; sitemap v10 says $10M–$15M. Lisa to confirm which is canonical. Same conversation should also resolve the original quiz wording question.
- **C4 pricing reconciliation:** V1.1 homepage says "services start at $8,500"; current Evaluator's Eye Audit is $2,500–$5,000. Either update the homepage FAQ pricing language or confirm there's a higher-tier audit variant.
- **The 12 other MFT open items** as they come up in normal workflow.

### Asset items (manual or someone)

- **Manzoor — Canva brand kit values** (Step 5 above)
- **Lisa's approved photo folder** — confirm location and pull a subset for the hero image candidates
- **Logo asset URLs** (on-light, on-dark, favicon, square mark) — design team

### The actual next deliverable

Once Steps 1–10 complete, you're ready to build the **Evaluator's Eye Audit T3 creative brief**. Run this Claude Code prompt:

```
You're working in ~/agentic/agentic-os/clients/the-rfp-success-company/.

Build the creative brief for the Evaluator's Eye Audit individual service page (T3). Destination: projects/website/briefs/evaluator-eye-audit-v1.0.md.

Context to load in order (per inputs/project-knowledge/AGENT_LOADING_INSTRUCTIONS.md):
1. agency/sops/ROI-LIVE-Agency-Core-Standards-v1.1.md
2. agency/sops/ROI-LIVE-Agency-Service-Page-SOP-v1.1.md
3. brand_context/sops/RFP_Success_Website_Content_SOP_v1.2.md
4. brand_context/sops/RFP_Editorial_Overlay_v1.md
5. context/MASTER_FEEDBACK_TRACKER.md (every locked rule in §1–3 applies)
6. brand_context/CLIENT_PARAMETER_SHEET_v1.0.md
7. brand_context/voice-profile.md, positioning.md, icp.md, samples.md, assets.md
8. projects/website/SITEMAP_v10.md (entry #4 — /services/proposal-audit/)
9. projects/website/PAGE_TEMPLATE_MAP_v1.0.md (T3 specification)
10. projects/website/briefs/homepage-v1.1.md (visual conventions inheritance)
11. projects/website/briefs/advisement-services-creative-brief-v1.0.md (T2 → T3 inheritance template)
12. inputs/project-knowledge/BRAND_VOICE_DNA_v2.2.md (canonical voice reference)

Pricing: $2,500–$5,000 entry-level Win Strategist offering. Audiences: both Wine and Champagne tiers.

Lead with the Almost-Winner customer archetype (from icp.md) — this audit is the entry point for clients who keep shortlisting but not winning. Secondary archetype: the Internal Champion who needs ammunition to defend the spend.

Case study evidence: RTA Fleet 50%→80% finalist rate (the reference build per session summaries).

Structure the brief in the same sections as the /advisement/ creative brief, adapted for T3 specifics. Confirm with me which section of the existing /advisement/ brief structure to start drafting from before writing copy.

When the brief produces deliverable copy: apply every rule in voice-profile.md including the Stop Slop overlay, AI signal elimination framework, banned phrases (especially the C7, C8 lists from learnings.md), and the "AI-only proposal tools" replacement language (NOT "AI writes words").

Don't write the full brief in one pass. Outline first, get my approval on structure, then draft section by section. Pause for review between sections.
```

---

## Pattern notes for future Client Onboarding SOP

These five gates will become mandatory steps in the agency-level `ROI-LIVE-Agency-Client-Onboarding-SOP-v1.md` when you build it:

1. **Folder ownership/title verification gate** (Step 5 of this guide). Before any external URL enters brand_context, verify the destination via the relevant MCP. The RK Studios Drive folder mistake would have contaminated v2 if not caught manually. Future SOP makes this a tool-enforced check.

2. **Scaffold contamination scan** (Step 1 of this guide). The first thing a fresh scaffold gets is a contamination scan. Greps for the names of every other active client. Surfaced as a learning during GLC onboarding (April 29).

3. **Source materials inventory before brand_context drafting.** This migration was different because mature brand_context already existed. For fresh onboardings, the sequence is: source intake → conflict map → human-in-the-loop on ambiguous items → promotion check (does this go to agency level or stay client-level) → brand_context populate → editorial overlay → inheritance verification. The G&H, ALVARA, and GLC onboardings all followed variations of this. Codify the canonical sequence.

4. **Editorial overlay as the last step before live work.** Don't start producing content until the per-client overlay is in place. The Citation Discipline SOP became agency-level after GLC's post-incident learning trajectory; every client now needs an overlay that maps the generic framework to client-specific tier mappings, review chains, and hallucination catalogs.

5. **Inheritance verification smoke test** (Step 9 of this guide). Open a fresh Claude Code session in the client folder and walk the full inheritance chain before declaring the onboarding complete. Catches missing imports, broken paths, and stale references.

When you're ready to build the agency Onboarding SOP, prompt me with: *"Build agency/sops/ROI-LIVE-Agency-Client-Onboarding-SOP-v1.md using the pattern documented in clients/the-rfp-success-company/ONBOARDING-EXECUTION.md and informed by the G&H, ALVARA, GLC, and RFP Success onboardings."*

---

## A note on the Obsidian shift

Day-to-day file editing happens in the Obsidian vault. Edits sync across machines automatically. Claude Code sessions run on the same local files. The migration commands above use bash because that's the right tool for one-time structural moves, but ongoing work is just Obsidian edits.

GitHub becomes the automated nightly backup target, not the daily collaboration surface. Feature branches and PRs reserve themselves for major snapshots (like this migration) or for moments where you want the code review pattern (less common now).

This changes a few things in the agency-level Agentic OS context:

- The `update.sh` upstream sync script still runs weekly, but it's now invoked locally and the changes flow through Obsidian Sync to other machines rather than through `git pull`
- Jordan's daily workflow doc needs updating to reflect Obsidian-Sync-first
- The Git Bash + VS Code toolchain still works for big structural moves, but VS Code is no longer the primary editor (Obsidian is)
- AGENTIC-OS-CONTEXT.md needs a sync-model section update reflecting all this

Worth a separate session to update Jordan's daily workflow doc and AGENTIC-OS-CONTEXT.md once the Obsidian setup is fully stable in your other thread.
