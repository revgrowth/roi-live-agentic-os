# Updates from ClickUp Comment Extraction

**Date:** May 12, 2026
**Source:** ClickUp task comments pulled for 4 of 13 active website project tasks
**Status:** Critical corrections discovered through comment mining. These supersede or amend my v1 and v2 brand_context delivery where they conflict.

---

## What was extracted vs. what's still ungathered

**Extracted (full comment threads):**
- Home Page Design task (86afvwrk1) — 20 comments
- Brand Voice & DNA Guide task (86aez7ent) — 13 comments
- Primary Service Landing Page task (86agxfjdk) — 1 comment + 9 replies (replies inaccessible — see below)
- New Website Sitemap + 12 Month Content Roadmap (86aez8535) — 12 comments
- T3 Individual Service Page Template task (86ah2p777) — 1 comment + 8 replies (replies inaccessible)

**Not extracted:**
- Threaded replies on every comment with `reply_count > 0`. The `clickup_get_threaded_comments` tool returns "No approval received" in this session. Total threaded replies untouched: 49+ across the 5 tasks above
- 8 other task comment streams: T6 State Guide (86ah2pyum), T10 About/Team (86ah2p9qm), T3 Service Page variant (86ah2p1c1), T5 Industry Vertical (86ah2p8f4), T7 Authority Pillar (86ah2p8u2), T4 Case Study Template (86ah2p7x9), T9 Author Bio (86ah2p9d4), T8 Index/Hub (86ah2p93n)
- Comments on ClickUp Docs themselves (the Brand Voice doc, Homepage Brief, Sitemap doc all have inline page-level comments separate from task comments — none extracted)

**Recommendation:** Once migrated to Agentic OS, set up a session where Jason runs the `clickup_get_threaded_comments` calls directly (auth may resolve there), and have someone export ClickUp doc comments to markdown before the docs migrate.

---

## Critical corrections discovered

### Design and aesthetic

**Light and airy — no pure black.** Lisa, Feb 2026: *"We don't like the black and wanted maybe more of a dark-ish gray. Something to lighten it up. We are always wanting to keep it light and airy because we want them to get a feel of relief, not more heaviness. I love the color blocking on the one, I think it was the 2nd one."*

Applies to: every page template. Black backgrounds are out. Charcoal/dark gray substitutes where weight is needed. Color blocking from Sample 2 is approved.

**Hero image rules.** Lisa, Feb 2026, after seeing Raja use a Facebook selfie: *"after sending you a pretty big file of approved photos, are you using a selfie from my Facebook account??"*

Rules going forward:
- Use only photos from Lisa's approved photo folder (delivered to Jason, lives in Drive)
- No social media scrapes
- Existing video footage from "Way I See It" series is out — *"too old"* per Jason's confirmation with Lisa
- All future template designs source Lisa imagery from the approved folder only

**Color tokens and fonts.** The canonical brand kit lives in Canva. Access is held by Manzoor (media@roi.live) per Jason's V1.1 brief revision response: *"The full brand kit (colors, fonts, usage guidelines) has been shared with the team (@Manzoor see canva rfp success access). Do not deviate from the approved palette."*

Action: pull hex codes and fonts from Manzoor's Canva access, NOT from Figma (the Figma uses the brand kit values but isn't the source of truth). Update `brand_context/assets.md` once retrieved.

### AI positioning language

**"AI writes words. We write wins." is OUT.** Reason: Lisa, Feb 2026: *"don't care for this as we have an AI tool"* (referring to the Express platform which uses AI). The anti-AI positioning could undermine the Express tier.

Replacement language (per Jason's V1.1 response, applied across the homepage brief):
- *"AI-only proposal tools produce generic, surface-level language."* (preferred)
- Three-column strip: *"Strategy-Led Writing, Not Auto-Generated Drafts"* (NOT *"Win Strategists, Not AI Drafts"*)

The distinction is now between auto-generated content with no strategic oversight versus the team's strategy-first process that may use AI tools as part of a larger methodology.

**This contradicts my v2 voice-profile.md.** The voice-profile.md needs patching to remove any reference to "AI writes words" or anti-AI framing.

### Pricing on the homepage

Homepage leads with **$8,500** (Proposal Audit / now Evaluator's Eye Audit ranged $2,500–$5,000 — needs reconciliation). The $2,500 entry point appears on the dedicated `/advisement/` services page and individual service pages, not the homepage FAQ.

Per Jason's V1.1 revision response: *"The $2,500 entry point will still have its place on the dedicated Advisement services page, but it won't be the first number a prospect sees."*

⚠️ **Internal inconsistency to resolve:** The V1.1 homepage brief response (Jan 31, 2026) said "Our services start at $8,500 for a Proposal Audit." The current Master Feedback Tracker and Sitemap v10 list Evaluator's Eye Audit (renamed from Proposal Audit) at $2,500–$5,000. Either the homepage FAQ pricing line needs updating to match the new $2,500–$5,000 range, OR the audit service has a higher-tier homepage-only version. Jason to confirm.

### Workflow constraint — Lisa can't open .md

Lisa, Feb 2026: *"I cannot open these documents, not sure what the format is but it's a .md extension."*

**Hard rule:** All deliverables sent to Lisa for review must be Word (.docx), PDF, or Google Docs. Markdown working files are fine for internal ROI.LIVE use, but every Lisa-facing handoff converts to .docx first.

Action: add a Lisa-facing-deliverable export step to the per-client SOP overlay.

### Susan's edits — V1.3 corrections (Brand Voice doc)

**Removed entirely** (do not reintroduce):
- *"Empathetic to the struggle — She's a small business owner"*
- *"There's a method to our madness"* / *"There's a method to the RFP madness"*
- *"Winning RFP clients make raving fans"*
- *"We're going Mercedes"* (internal speak only — Mercedes stays as Champagne tier descriptor, never external)
- *"Love Dogs"* (personality trait)
- *"Healthy egos are welcome"* (internal culture)
- *"Collaborative, not dictatorial"*
- *"Seamless team integration"*
- *"Strategic acceleration, not a full handoff"*
- *"She's a small business owner"* in Lisa section
- All Federal mentions
- *"AI writes words. We write wins."* (covered above)
- *"50%+ target win rates"* — changed to 70–80%

**Reframed**:
- *"Premium, sophisticated tone"* → *"Knowledgeable and expert based"*
- *"The Lisa Rehurek Article Formula"* → *"The RFP Success Company Article Formula"*
- *"Lisa's Communication DNA"* → reframed as brand DNA Lisa embodies
- *"From Reactive Bidding to Intentional Winning"* → *"From reactive to intentional"* (Susan: "too wordy")
- *"Rinse and repeat"* → *"Proven process, customized execution"*
- *"Not dependency"* → *"Build client capabilities while demonstrating ongoing partnership value"*
- Results category: added "+WIN" to approved language
- "Evaluator psychology" (Lisa: "be careful with use of psychology") → *"Understanding what evaluators look for"*

### Lisa's specific rejections

- *"State velocity"* — Lisa: *"I'm not sure what that even means"* — rejected
- AI-driven SLED positioning options (e.g., "Enterprise rigor, State-level agility," "Fortune 500 rigor, State-level speed") — Lisa: *"None of the above. They're too AI-driven. Let me think on this."* — pending Lisa's own framing based on her stated "scrappy small boutique firm, quick decisions, we make progress, we don't wallow"
- *"Topics Lisa Speaks On"* list — Lisa: *"Where will we use this? This list isn't really right, and I don't promote my speaking."* — removed
- *"Federal-grade rigor"* and any Federal positioning — removed everywhere
- The D.A.R.E. eBook PDF still uses "Requirements" for R (old version); 2026 canonical is "Readability" — eBook update needed before `/dare/` page launch

### Voice tier adjustments

**Advisement tier voice (Susan's correction, V1.3):**

Old framing: "Consultative and strategic," "Acknowledge their existing capabilities," "'Elevate and optimize' language," "Expert peer positioning."

New framing (Susan): "Knowledgeable and expert-based," "Results-focused — they need wins, not validation," "Direct about gaps without condescension," *"We see what you're missing"* positioning.

**Win Strategist (former Premier) key phrases (Susan's correction, V1.3):**

Old: "Gaining an entire proposal department" / "From reactive to intentional winning" / "We become your outsourced proposal team"

New approved:
- *"Your wins become our wins"*
- *"A proven team, not just advice"*
- *"We don't teach — we do"*
- *"From hoping to knowing"*

**Win Strategist tier reality (Susan's addition):**
- "Losing more bids than they're winning"
- "Don't want to build internal capacity — want results now"
- "RFPs are a core revenue strategy, not a side activity"

### Lisa's "Punch in the Face" phrases (V2.0 addition)

10 scroll-stopping lines Lisa personally approved as authentic to her voice. Example surfaced in extraction: *"You're not losing because you're unqualified. You're losing because you're undisciplined."* Full list lives in the canonical Brand Voice DNA v2.2 document — not extracted into brand_context yet. Recommend pulling these into `voice-profile.md` during migration.

### Other discoveries

- **Cheri, Kevin, Anna** documented as key team members; Lisa is the sole public voice (per V2.0 update note)
- **75 testimonials** organized by service tier in a spreadsheet; permissions for public site use still open (MFT Open Item #14)
- **16 case studies** identified with named clients: eWorld Enterprise, Highland Crossings, Inside Out Learning, El Sol Travel, Lodestar Consulting, Medecision, Modern Learners, Mobile DMV, RTA Fleet, PC Links, Streamline, Unified Transit, A.C.T. Security, BRiNET, DW Dukes, Edlaw Pharmaceuticals — only Optumas has confirmed logo permission per the tracker

---

## What to patch in brand_context

| File | Change |
|---|---|
| `voice-profile.md` | Remove any "AI writes words. We write wins." references. Add the "AI-only proposal tools produce generic, surface-level language" replacement. Add Susan's removed/reframed phrases as explicit banned/preferred lists. |
| `voice-profile.md` | Add the Lisa rejected language: "State velocity," AI-driven SLED options, "Topics Lisa Speaks On" |
| `assets.md` | Add the Canva brand kit pointer (Manzoor / media@roi.live has access). Add light-and-airy / no-black design rule. Add hero image rule (Lisa's approved photo folder only, no social media). |
| `engagement-status.md` | Add Lisa-can't-open-.md rule as a stakeholder communication constraint. |
| `learnings.md` | Add new locked corrections: light-and-airy aesthetic, AI language softening, hero image rules, Lisa-can't-read-.md, $8,500 lead pricing on homepage. |
| `MIGRATION-MAP.md` | Add the Manzoor / Canva access as a dependency for `inputs/drive-assets/canva-brand-kit/` retrieval. |

These patches will land in a v3 of the brand_context delivery — pending Jason's go-ahead so I'm not patching files he's about to overwrite during migration.

---

## What the Figma file still needs to give us

When the Figma MCP is enabled (or Jason exports the design tokens):

| Token category | What to extract |
|---|---|
| Color palette | Primary, secondary, accent, neutral/gray scale (replacing black), background variants — hex codes |
| Typography | Display font, body font, weights used, sizes for h1/h2/h3/body/caption |
| Spacing | Section padding, container max-width, button heights, card padding |
| Component styles | Button states (primary, secondary, ghost), card shadows/borders, badge styles |
| Trust bar pattern | Approved layout of the pre-headline stat strip |
| Three-tile path layout | Confirmed visual hierarchy with Win Strategist as the featured tile |

These values populate `assets.md` and the per-page creative briefs. They also feed Raja's downstream T2/T3/T4 designs so the templates stay visually consistent with the approved homepage.

---

## Honest status

**Big improvement over last turn.** The brand_context v2 I delivered had several stale or wrong assertions that the ClickUp comments now correct. Most consequential: the "AI writes words. We write wins" framing in voice-profile.md is wrong — Lisa rejected it and the canonical position is the softer version above.

**Still incomplete.** 8 task comment streams plus 49+ threaded replies plus all ClickUp doc-level comments remain ungathered. The Figma design tokens are entirely outstanding.

**Next steps to close the gap:**
1. Jason runs threaded comment extraction in a session where the tool authenticates correctly, OR copies the threaded reply text manually into a single markdown file
2. Jason enables the Figma MCP for the next session OR exports the right-side design panel from the approved Sample 2 frame as JSON / screenshot
3. Jason pulls comments from the Brand Voice DNA, Sitemap, and Homepage Brief ClickUp docs (inline page-level comments, separate from task comments) — these can be exported as markdown from ClickUp's doc export
