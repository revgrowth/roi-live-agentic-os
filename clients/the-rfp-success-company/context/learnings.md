# Learnings & Open Items — The RFP Success® Company

**Last updated:** May 12, 2026 — migration from Claude.ai project storage to Agentic OS
**Canonical source:** `inputs/project-knowledge/MASTER_FEEDBACK_TRACKER.md` (Master Feedback Tracker v1.0)

This file mirrors the Master Feedback Tracker for Claude Code session-level reference. The Master Feedback Tracker in `inputs/project-knowledge/` is the canonical living document maintained by Jason — every Lisa correction is added there before being applied to deliverables. Sync this file when the tracker updates.

---

## Resolved corrections (locked — apply to every deliverable)

These are not open items. They are confirmed rules that govern all current work. Listed here so Claude Code sessions don't re-litigate them.

| ID | Rule | Source | Locked |
|---|---|---|---|
| §1.1 | 30+ years RFP experience (Lisa, not company) | Lisa, April 2026 | ✅ |
| §1.2 | 76%+ win rate (not 78%) | Lisa, Feb 2026 | ✅ |
| §1.3 | 92% down-select rate | Lisa-confirmed | ✅ |
| §1.4 | $500M+ in client wins | Lisa-confirmed | ✅ |
| §1.5 | 30+ industries served | Lisa-confirmed | ✅ |
| §1.6 | 11 books total, 5 RFP-specific (2 physical, 2 ebooks, 1 playbook) | Lisa, Feb 2026 | ✅ |
| §1.7 | No federal market positioning anywhere | Lisa, April 2026 | ✅ |
| §1.8 | "Service-based" businesses — never just "businesses" | Lisa, Feb 2026 | ✅ |
| §1.10 | Express tier $1M–$5M | Lisa-confirmed | ✅ |
| §1.11 | DIY tier $500K–$1M | Lisa-confirmed | ✅ |
| §2.1 | ® symbol on every public-facing brand mention | Lisa, April 2026 | ✅ |
| §2.2 | First Lisa mention: "RFP-expert Lisa Rehurek" | Lisa, April 2026 | ✅ |
| §2.3 | 4x4 Framework™ with TM mark | Lisa-confirmed | ✅ |
| §2.4 | D.A.R.E. capitalized as "D.A.R.E." with periods | Lisa-confirmed | ✅ |
| §2.5 | D.A.R.E. = Distinction, Answer the Questions, **Readability**, Evidence & Authority | Lisa, Feb 2026 | ✅ |
| §2.7 | Lisa's sign-off: "Cheers to your success" | Lisa, Feb 2026 | ✅ |
| §3.1 | Core positioning: "Your team writes it. We make it win." | Lisa, April 2026 | ✅ |
| §3.2 | Win Strategist as proprietary positioning term | Lisa, April 2026 | ✅ |
| §3.10 | Business is NOT a "Lisa-business" — avoid Lisa-centric framing | Lisa, Feb 2026 | ✅ |

For the full list including resolved historical items (R1–R11), see the Master Feedback Tracker.

---

## Open items pending resolution

| # | Item | Notes | Status |
|---|---|---|---|
| 1 | **Wine/Champagne revenue ranges** — Lisa final confirmation | ~~Working assumption: Wine $10M–$15M, Champagne $15M–$25M+.~~ **RESOLVED via C15** — Lisa confirmed in April 2026 (ClickUp Home Page Design thread, comment 90130250896407): Wine $5M–$10M, Champagne $10M–$25M+. Creates clean tier ladder with DIY/Express below. Unblocks T11 Quiz and homepage routing logic. | ✅ Resolved 2026-05-13 |
| 2 | **RFP Assessment Quiz question wording** | Six segmentation criteria documented; exact question wording needs Lisa approval. Blocks: T11 Quiz build. | 🟡 Open |
| 3 | **Discovery call pre-qualification** | ROI.LIVE recommendation: 2–3 qualifying questions in GoHighLevel booking form. Awaiting Lisa approval. | 🟡 Open |
| 4 | **Case study permissions** | Per case: name, logo, quotes, metrics, service attribution. Optumas confirmed. Others outstanding. Blocks: T4 case study pages. | 🟡 Open per case |
| 5 | **Express Platform pricing** | Generic reference currently. Needs final or "starting at" figure. | 🟡 Open |
| 6 | **Success Collective Hub URL** | DIY path redirect destination. | 🟡 Open |
| 7 | **GoHighLevel booking link/embed code** | Final confirmation from Susan Mershon. | 🟡 Open |
| 8 | **Homepage video/motion asset** | Does Lisa want footage from "Way I See It" series used? | 🟡 Open |
| 9 | **Final logo asset URLs** | On-light, on-dark, favicon, square mark — from design team. | 🟡 Open |
| 10 | **GA4 Measurement ID + Search Console property** | From Lisa, delegated to jason@roi.live. | 🟡 Open |
| 11 | **Alternate domain consolidation** | getrfphelp.com, ac-page.com → primary domain decision. | 🟡 Open |
| 12 | **D.A.R.E. eBook PDF update** | Old version uses "Requirements" for R; 2026 uses "Readability." Needs revision before `/dare/` page launch. | 🟡 Open |
| 13 | **Audit logos beyond Optumas** | Per case study permission required. | 🟡 Open |
| 14 | **Testimonial permissions for all 75** | Cleared for public website use? | 🟡 Open |

---

## Agentic OS migration notes

The following items relate specifically to this engagement migrating from Claude.ai project storage into the Agentic OS folder structure. Not Lisa-facing — internal ROI.LIVE tracking.

### A1 — Agency Core Standards reconciliation

The project knowledge dump includes `AGENCY_CORE_STANDARDS_v1.1.md`. The Agentic OS repo has `agency/sops/ROI-LIVE-Agency-Core-Standards-v1.1.md`. Need to diff to confirm they're the same content, or merge if divergent. Same applies to `AGENCY_SERVICE_PAGE_SOP_v1.1.md`.

### A2 — RFP Success Website & Content SOP v1.2 placement

This is a client-specific SOP that overrides agency-level defaults for this engagement. Goes in `clients/the-rfp-success-company/brand_context/sops/`. This is the model for per-client SOP overlays (parallel to GLC's Editorial Overlay).

### A3 — Citation Discipline back-fill still pending

The agency Citation Discipline SOP at `agency/sops/ROI-LIVE-Agency-Citation-Discipline-SOP-v1.md` requires a per-client overlay. The existing RFP Success Website & Content SOP v1.2 contains information gain rules and AI signal elimination but may not fully cover citation discipline. Build `RFP_Editorial_Overlay_v1.md` to bridge the gap. Reference: `clients/green-llama-clean/brand_context/sops/GL_Editorial_Overlay_v1.md`.

### A4 — Session history preservation

`SESSION_SUMMARIES.md` documents 9 working sessions Jan–May 2026. Lands in `clients/the-rfp-success-company/context/session-summaries.md`. Critical for future Claude Code sessions to know what's been decided.

### A5 — Project knowledge file mapping

Every file in the project knowledge dump has a destination in the Agentic OS structure. See `MIGRATION-MAP.md` in this delivery for the full mapping. Audit during scaffolding.

### A6 — Scaffold contamination check

Per Agentic OS context, GLC's pre-onboarding `learnings.md` carried scaffold-template content from `add-client.sh`. Verify this client's scaffold doesn't introduce contradictory baseline content before importing the knowledge dump.

---

## Resolved this migration session

| Item | Resolution |
|---|---|
| 78% win rate flag (P0 in v1) | RESOLVED — per MFT §1.2 and v10 sitemap, canonical is 76%+ everywhere. brand_context patched. |
| 26+ years flag (not in v1 — missed) | RESOLVED via patch — 30+ years applied across brand_context. |
| RFP-expert Lisa Rehurek prefix (not in v1 — missed) | RESOLVED via patch — added to positioning.md and voice-profile.md. |
| 5 customer archetypes (not in v1 — missed) | RESOLVED via patch — added to icp.md. |
| AI signal elimination framework (not in v1 — missed) | RESOLVED via patch — added to voice-profile.md. |
| Information gain framework (not in v1 — missed) | DEFERRED to per-client SOP overlay (RFP_Editorial_Overlay_v1.md). Available in `inputs/project-knowledge/RFP_SUCCESS_WEBSITE_CONTENT_SOP_v1.2.md` for now. |
| Lisa's preferred phrasings from MFT §3 (not in v1 — missed) | RESOLVED via patch — added to positioning.md. |
| Sitemap inconsistencies (v9 internal contradictions) | RESOLVED — v10 supersedes. Use v10 going forward. |
| Healthcare positioning ambiguity (P0 in v1) | DEFERRED — v10 keeps healthcare as a vertical but Technology & IT remains primary. "Healthcare IT is NOT a strength" note stands. Resolution path: pick a sub-segment (Healthcare Data, Healthcare Operations) with case study evidence. |
| Site platform decision (P0 in v1) | DEFERRED — pending Jason + Lisa decision. Not in MFT. Add when discussed. |

---

## Discovered via ClickUp comment extraction (May 12, 2026)

These were missing from v1 and v2 of the brand_context delivery. ClickUp comment mining surfaced them. All are now locked corrections.

| # | Rule | Source | Locked |
|---|---|---|---|
| C1 | **Light and airy aesthetic — no pure black.** Use dark charcoal gray instead. Color blocking from Sample 2 approved. | Lisa, Feb 2026 (ClickUp comment on Home Page Design task) | ✅ |
| C2 | **Hero images sourced from Lisa's approved photo folder only.** No social media scrapes. Existing "Way I See It" video footage too old to use. | Lisa, Feb 2026 (ClickUp comment) | ✅ |
| C3 | **"AI writes words. We write wins." is OUT.** Replaced with "AI-only proposal tools produce generic, surface-level language." Three-column strip: "Strategy-Led Writing, Not Auto-Generated Drafts" (NOT "Win Strategists, Not AI Drafts"). | Lisa Feb 2026 (Express uses AI) | ✅ |
| C4 | **Homepage pricing leads with $8,500** (Proposal Audit reference); $2,500 entry point belongs on `/advisement/` page only. ⚠️ Needs reconciliation with current $2,500–$5,000 Evaluator's Eye Audit pricing. | Jason V1.1 brief response, Feb 2026 | 🟡 Needs reconciliation |
| C5 | **Lisa cannot open .md files.** All Lisa-facing deliverables convert to Word/PDF/Google Docs before sharing. | Lisa, Feb 2026 (ClickUp comment) | ✅ |
| C6 | **Canva brand kit is the source of truth for hex codes/fonts.** Manzoor (media@roi.live) holds access. Pull from Canva, NOT from Figma. | Jason V1.1 brief response | ✅ |
| C7 | **Banned phrases (Susan V1.3 corrections):** "Method to our madness," "Method to the RFP madness," "Healthy egos welcome" (external), "Love Dogs," "Empathetic to the struggle — small business owner," "Winning RFP clients make raving fans," "Collaborative not dictatorial," "Seamless team integration," "Strategic acceleration not a full handoff" | Susan, Feb 2026 (V1.3 doc revision) | ✅ |
| C8 | **Banned phrases (Lisa specific rejections):** "State velocity," "Federal-grade rigor," any Federal positioning, "Topics Lisa Speaks On" list, "Evaluator psychology" (use "Understanding what evaluators look for" instead) | Lisa, Feb 2026 | ✅ |
| C9 | **"Mercedes" is internal-only.** Stays as Champagne tier descriptor in internal docs; never appears in external customer copy. | Susan V1.3 correction | ✅ |
| C10 | **"Rinse and repeat" → "Proven process, customized execution"** | Susan V1.3: every RFP is custom | ✅ |
| C11 | **"From Reactive Bidding to Intentional Winning" → "From reactive to intentional"** | Susan V1.3: too wordy | ✅ |
| C12 | **Susan's Win Strategist (former Premier) key phrases (V1.3 approved):** "Your wins become our wins" / "A proven team, not just advice" / "We don't teach — we do" / "From hoping to knowing" | Susan V1.3 | ✅ |
| C13 | **Advisement tier voice (Susan V1.3):** "Knowledgeable and expert-based," "Results-focused — they need wins, not validation," "Direct about gaps without condescension," "We see what you're missing" — REPLACES old framing ("Consultative and strategic," "Elevate and optimize," "Expert peer positioning") | Susan V1.3 | ✅ |
| C14 | **Trademark symbol mismatch — logo glyph uses ™ on "SUCCESS" while company-name text mentions require ®.** Lisa's directive on this rule (verbatim, Mar 19, 2026): *"Please always use the registered trademark behind 'Success' in the title of our company."* Jason's implementation extended ® to "Logo area / nav text references, H1s and H2s, all body copy mentions, footer." Both wordmark PNGs in `inputs/drive-assets/logos/` (`RFP SUCCESS  COMPANY_Orange.png`, `RFP SUCCESS COMPANY- 3 (4).png`) carry ™ on the glyph itself; the `.ai` source presumably matches. **The unresolved question is narrower than the rule:** Lisa's directive plainly applies to the company name as text. Whether the rendered logo glyph also needs ® has not been explicitly addressed. Resolution paths Lisa decides between: **(a)** registration covers company name as text only — logo lockup stays ™ as designed, no logo file change needed; **(b)** registration covers the logo lockup — request updated logo files with ® from Lisa's design source, current files cannot ship to production; **(c)** registration is in process (filed but not granted) — current ™ on logo is correct per USPTO pendency rules, updated files needed once registration grants. **Blocks Breakdance build of any page that places the logo until path is confirmed.** | Step 5B logo inventory, 2026-05-13 + Lisa Mar 19, 2026 (ClickUp 90130254701034) + Jason Apr 2026 (90130255063964) | 🟡 Open — pending Lisa |
| C15 | **Wine vs Champagne revenue tiers locked.** Wine: $5M–$10M. Champagne: $10M–$25M+. Supersedes Jason's tentative $10M–$15M / $15M–$25M+ ranges and the v9 sitemap's inconsistent figures. Creates clean tier ladder: DIY $500K–$1M → Express $1M–$5M → Wine $5M–$10M → Champagne $10M–$25M+. **RESOLVES Open Item #1** in learnings.md (the Wine/Champagne ranges question). Note: a Feb 2026 internal Champagne deck used "$1M–$10M" for Wine; the April 2026 directive supersedes. | Lisa, April 2026 (ClickUp comment on Home Page Design task — comment 90130250896407) | ✅ |
| C16 | **Trust bar badge order locked.** Inc. 5000 (2023, 2024) → WBENC → Goldman Sachs 10KSB → Featured in 11 publications → Longest-Running RFP Podcast. This order must match homepage exactly across every page that carries the trust bar (Win Strategist Services, T3 variants, T5 industry, T9 bio, etc.). The Inc. 5000 badge specifically renders "2023, 2024" — not just "Inc. 5000." | Jason design directive to Raja, April 2026 (ClickUp comment on Primary Service Landing — comment 90130255063964) | ✅ |
| C17 | **Champagne tier tagline locked.** "Serious operators who invest in a Win Strategist and value the partnership." Replaces any prior Champagne tagline drafts. Use verbatim on the Win Strategist Services page and any Champagne-tier-specific copy. | Jason confirmation, April 2026 (ClickUp comment on Home Page Design — comment 90130250614889) | ✅ |
| C18 | **Lisa bio facts confirmed for T9 Author Bio page.** Three corrections from Lisa's T9 review: **(1)** Case studies represent team work, not solely Lisa's individual delivery. Frame case studies as "what my team has done" not "what I did." **(2)** Lisa has experience on all sides of the aisle — responding to RFPs, developing RFPs, AND evaluating RFPs. This three-perspective framing must appear in the bio (extends §2 of the SOP's "evaluator-side expertise" beyond evaluation-only to all three roles). **(3)** Lisa is past president of the Phoenix chapter of APMP (Association of Proposal Management Professionals). Add to credentials. | Lisa, April 2026 (ClickUp comment on T9 Author Bio — comment 90130262748785) | ✅ |

**Status of patches:** voice-profile.md (C3, C7, C8, C9, C10, C11, C12) ✅, assets.md (C1, C2, C6) ✅, engagement-status.md (C5, C6) ✅. C4 pending Jason reconciliation. C13 needs voice-profile.md update for advisement tier voice section. C14 refined 2026-05-13 with Lisa verbatim source — narrows to logo-glyph question; still blocks Breakdance logo placement until Lisa confirms scope. C15 ✅ RESOLVES Open Item #1 (Wine/Champagne ranges locked). C16, C17, C18 LOCKED — no patches required yet; apply during content production for tier-specific pages (C15, C17), every-page trust bar (C16), and T9 Author Bio brief (C18).

---

## Drive folder verification (May 12, 2026)

| # | Finding | Note |
|---|---|---|
| D1 | **Wrong Drive folder URL caught in v2/v3 brand_context** | Original delivery referenced `13fudkdd6F3A5MkmotlU61dkKZAYzTFS7` — this is the **RK Studios** folder, not RFP Success. Jason caught the error and provided the correct ID `1uOnmI3SF2tYfh8x9ealwVGMqX1NqyQBY`. Patched in assets.md. No RK Studios content leaked (the URL was a "Jason to mirror" placeholder, never fetched). **Process learning:** future Client Onboarding SOP must include a folder ownership/title verification step before any external URL enters brand_context. |
| D2 | **Canva brand kit URL discovered** | `https://www.canva.com/brand/kADcMcP3Ico` — sourced from the `Asset Links.docx` file at the Drive folder root. This is the canonical hex codes/fonts location (resolves the open question on Manzoor's Canva access path). Added to assets.md. |
| D3 | **DARE eBook confirmed outdated in Drive** | The `DARE Method download.pdf` file in the Brand Voice + DNA folder uses "Requirements" for R (the obsolete version). Canonical 2026 is "Readability." Resolves: this PDF is the file referenced in MFT Open Item #12 — eBook update needed before `/dare/` page launch. |
| D4 | **Wine tier revenue range conflict surfaced** | The Feb 2026 `2026 Champagne Client Info.pptx` deck says Wine clients are "$1M–$10M" revenue. Sitemap v10 says Wine is "$10M–$15M" revenue. Contract values ($100K–$250K) match in both. Expands MFT Open Item #1 — Lisa's final confirmation needs to address which revenue band is canonical. The deck is the older source (Feb 2026, pre-Advisory-Pivot framing). |
| D5 | **Drive folder structure mapped** | 12 top-level folders including pre-Advisory-Pivot legacy folders (`OUTSOURCED (Premier)`) and current tier folders (`ADVISEMENT`, `GUIDED SYSTEM (Express)`, `DIY (Success Collective)`). The Brand Voice + DNA subfolder contains 6 files (1 PDF + 5 .pptx). Full inventory in `brand_context/assets.md`. |

---

## Still ungathered (recommend follow-up extraction)

- Threaded replies on every ClickUp task comment with `reply_count > 0` (49+ replies untouched — `clickup_get_threaded_comments` returned "No approval received" this session)
- Comments on 8 other website project tasks: T6 State Guide, T10 About/Team, T3 Service Page variant, T5 Industry Vertical, T7 Authority Pillar, T4 Case Study, T9 Author Bio, T8 Index/Hub
- ClickUp Docs comments (inline page-level feedback on Brand Voice DNA doc, Sitemap doc, Homepage Brief doc — separate from task comments)
- Figma design tokens (hex codes, fonts, spacing) — Figma MCP not surfacing in this session

---

## How to use this file

This file is the Claude Code session-level mirror of the Master Feedback Tracker. When a session starts:

1. Read this file
2. Read the canonical `inputs/project-knowledge/MASTER_FEEDBACK_TRACKER.md`
3. Apply all locked rules in Sections 1–3 of the MFT to any new deliverable
4. Check Open Items before assuming anything about Wine/Champagne ranges, quiz wording, asset URLs

When new feedback arrives from Lisa:

1. Jason adds it to the canonical Master Feedback Tracker first
2. This file gets synced after
3. Update brand_context files where the correction affects voice/positioning/ICP

When a new ROI.LIVE-level migration item surfaces:

1. Add to the Agentic OS Migration Notes section above
2. Do NOT add to the canonical MFT (that's Lisa-facing)
