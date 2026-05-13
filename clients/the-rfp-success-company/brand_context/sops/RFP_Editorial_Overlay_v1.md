# RFP Success — Editorial Overlay
**Version:** 1.0 — May 2026
**Applies to:** All RFP Success website and content deliverables (homepage, service pages, case studies, industry verticals, authority pillars, hubs, author bio, about/team)
**Owner:** Jason Spencer, Founder — ROI.LIVE
**Inherits from:**
- ROI.LIVE Agency Core Standards v1.1
- ROI.LIVE Agency Citation Discipline SOP v1.0
- Applicable page-type SOPs (Service Page SOP v1.1, Blog Article SOP v1.1, Case Study Page SOP v1.0, etc.)
- RFP Success Website & Content SOP v1.2 (companion client SOP — voice, information gain, AI signal elimination)

> This overlay codifies the per-client rules for RFP Success content production. It is the per-client overlay referenced by the agency Citation Discipline SOP §10 (Per-Client Implementation). Where this overlay specifies a rule, it overrides the agency baseline for RFP Success content. Companion file: `brand_context/sops/RFP_SUCCESS_WEBSITE_CONTENT_SOP_v1.2.md` carries the page-by-page production rules. This overlay carries the citation tier mapping, review chain, hallucination catalog, deliverable export protocol, and design constraint enforcement.

---

## 1. Inheritance declaration

When rules conflict, later items override earlier items:

1. ROI.LIVE Agency Core Standards v1.1
2. Applicable page-type SOP (Service Page SOP v1.1, Blog Article SOP v1.1, Case Study Page SOP v1.0, etc.)
3. ROI.LIVE Agency Citation Discipline SOP v1.0
4. RFP Success Website & Content SOP v1.2 (canonical per-client SOP — voice, information gain, AI signal elimination)
5. **This overlay** (`RFP_Editorial_Overlay_v1.md`)
6. Current session instructions

The Website Content SOP v1.2 and this overlay are companion files. The SOP carries the page-by-page production rules (hierarchy of priorities, information gain framework, archetype map, AI signal elimination, anti-pattern rules, schema specs). This overlay carries the citation tier mapping, review chain, hallucination catalog, Lisa-facing deliverable export protocol, design constraint enforcement, and pre-submission checklist. Read both.

---

## 2. Source tier mapping (RFP Success-specific)

Per agency Citation Discipline SOP §10. Three-tier source hierarchy adapted to the SLED-only RFP Success domain.

### Tier 1 — Canonical (no challenge needed)

- Lisa's 11 published books (5 RFP-specific: 2 physical, 2 ebooks, 1 playbook per §1.6)
- The RFP Success® Show podcast transcripts (currently on hiatus)
- `context/learnings.md` — locked corrections (§1.x, §2.x, §3.x, C1–C18)
- `inputs/project-knowledge/MASTER_FEEDBACK_TRACKER.md` (Lisa-maintained canonical reference)
- `brand_context/` files: `positioning.md`, `voice-profile.md`, `icp.md`, `samples.md`, `assets.md`
- Approved Figma file: https://www.figma.com/design/7pnbfLIGvsBybTNz9Cn3Kp/RFP?node-id=182-5 (Sample 2 homepage + design system)

### Tier 2 — Recent, sourced (requires inline citation per agency SOP §7.4)

- Lisa's verbatim ClickUp comments — cite comment ID per agency Citation Discipline SOP. Example: *"Lisa, April 2026 (ClickUp 90130254701034)"*
- Susan V1.3 brand voice corrections — cite as *"Susan V1.3, Feb 2026"*
- Industry sources: NIGP, NASPO, APMP publications (note Lisa is past president of APMP Phoenix chapter per C18 — APMP sources are particularly load-bearing for E-E-A-T)
- State procurement portals (procurement.az.gov, eMaryland Marketplace, CalProcure, Tex-An, ohio.gov procurement, etc.)
- Government procurement research (SLED-focused only per §1.7)

### Tier 3 — External general-knowledge (use sparingly)

- Mainstream business publications: Inc, Forbes, HBR — only when validating industry context, not when making RFP-specific claims
- Academic sources on procurement and proposal management
- Trade press: ContractManagement, NCMA Journal

### Explicitly out of scope as sources

- **Federal procurement sources** — FAR, DFARS, GSA contracts, GovWin, SAM.gov, beta.SAM, USASpending. Per §1.7 and C8, no federal positioning anywhere on the site. Federal sources are not citable in RFP Success content even when factually accurate, because citing them implies federal-market expertise the engagement does not claim.
- Generalist business consulting content (McKinsey, Bain, BCG insights on procurement)
- AI-generated marketing copy — per C3, RFP Success rejects "AI writes words. We write wins." variants in favor of "Strategy-Led Writing, Not Auto-Generated Drafts." AI-tool output (ChatGPT, Claude, Gemini, Perplexity) is not a citable source under any tier.

---

## 3. Three-level review chain

Per agency Citation Discipline SOP §6.

| Level | Role | Person | Responsibility |
|---|---|---|---|
| 1 | Author | Content production session (Claude Code; possibly Jason in the loop) | Runs pre-submission checklist (§7). Self-review is non-optional. First line of defense against hallucinations. |
| 2 | Reviewer | Jason Spencer | Operational gate. Checks deliverable against C1–C18 catalog (§4), Citation Discipline SOP requirements, design constraints (§6), and Tier 1/2/3 source structure (§2). |
| 3 | Approver | Lisa Rehurek | Final gate. Checks voice, positioning, business decisions. Lisa's sign-off in the ClickUp task thread is the canonical approval signal. |

**Solo-reviewer cooling period (per agency SOP §6.4):** When Jason holds both Author and Reviewer roles on a deliverable (e.g., when Jason has drafted content himself rather than reviewing Claude Code output), a minimum 24-hour cooling period applies between authoring and reviewing. Required for any deliverable that ships to Lisa. The cooling period is the highest-leverage hallucination-catching mechanism when the same person does both roles.

When Claude Code is Author and Jason is Reviewer, the cooling period does not apply — the roles are held by different agents and Jason's review is genuinely fresh. When Jason is both Author and Reviewer, it does.

---

## 4. Per-client hallucination catalog

Compiled from `context/learnings.md` (§1.x, §2.x, §3.x, and C1–C18). Fast-reference table during content production.

**Status legend:** ✅ LOCKED (rule is final) · 🟡 OPEN (resolution pending) · ⛔ SUPERSEDED (replaced by a later rule; retained for traceability)

### 4.1 Brand identity (names, marks, attributions)

| Rule | Source | Status |
|---|---|---|
| ® symbol required on every public-facing mention of "The RFP Success® Company" | learnings.md §2.1 (Lisa, April 2026) + C14 verbatim (Lisa, Mar 19, 2026 — ClickUp 90130254701034) | ✅ LOCKED |
| First Lisa mention on any page: "RFP-expert Lisa Rehurek" — subsequent mentions can drop the prefix | learnings.md §2.2 (Lisa, April 2026) + C14 supporting | ✅ LOCKED |
| 4x4 Framework™ — TM mark required, formatted exactly as `4x4 Framework™` | learnings.md §2.3 | ✅ LOCKED |
| D.A.R.E. Method — formatted with periods exactly as `D.A.R.E.` (capitalized, period after each letter) | learnings.md §2.4 | ✅ LOCKED |
| D.A.R.E. expansion = Distinction, Answer the Questions, **Readability**, Evidence & Authority — never "Requirements" | learnings.md §2.5 (Lisa, Feb 2026) — replaces pre-2026 "Requirements" version of the eBook (Open Item #12) | ✅ LOCKED |
| Lisa's sign-off in personal voice: "Cheers to your success" | learnings.md §2.7 (Lisa, Feb 2026) | ✅ LOCKED |
| "Business is NOT a 'Lisa-business'" — avoid Lisa-centric framing; the company is a team operation | learnings.md §3.10 (Lisa, Feb 2026) | ✅ LOCKED |
| "Service-based businesses" — never just "businesses" when describing the ICP | learnings.md §1.8 (Lisa, Feb 2026) | ✅ LOCKED |
| Logo glyph (PNG/AI source files) carries ™ on "SUCCESS" — whether ® is needed on the rendered logo glyph itself is unresolved | C14 | 🟡 OPEN |

### 4.2 Locked numbers

| Rule | Source | Status |
|---|---|---|
| **30+ years** RFP experience — attributed to Lisa, not the company. Never "26+ years" or "30+ years of company history." | learnings.md §1.1 (Lisa, April 2026) | ✅ LOCKED |
| **76%+** win rate — never 78% (the live site is stale and pre-correction) | learnings.md §1.2 (Lisa, Feb 2026) | ✅ LOCKED |
| **92%** down-select rate | learnings.md §1.3 | ✅ LOCKED |
| **$500M+** in client wins (cumulative) | learnings.md §1.4 | ✅ LOCKED |
| **30+** industries served | learnings.md §1.5 | ✅ LOCKED |
| **11 books** total (5 RFP-specific: 2 physical, 2 ebooks, 1 playbook) | learnings.md §1.6 (Lisa, Feb 2026) | ✅ LOCKED |

### 4.3 Tier definitions (LOCKED April 2026 per C15)

Clean tier ladder:

| Tier | Revenue range | Source |
|---|---|---|
| DIY (Success Collective) | $500K–$1M | learnings.md §1.11 |
| Express (Guided System) | $1M–$5M | learnings.md §1.10 |
| Wine (Wine Strategist) | $5M–$10M | C15 (Lisa, April 2026 — ClickUp 90130250896407) |
| Champagne (Win Strategist — Champagne) | $10M–$25M+ | C15 (Lisa, April 2026 — ClickUp 90130250896407) |

Status: ✅ LOCKED. Supersedes Jason's tentative $10M–$15M / $15M–$25M+ ranges in the v9 sitemap and the Feb 2026 Champagne deck's "$1M–$10M" Wine range. Open Item #1 in learnings.md is RESOLVED via C15.

Champagne contract value pairing: $100K–$250K+ per engagement (per Sitemap v10 and Feb 2026 Champagne deck — values match across both sources).

### 4.4 Voice & phrasing rules

| Rule | Source | Status |
|---|---|---|
| Core positioning verbatim: "Your team writes it. We make it win." | learnings.md §3.1 (Lisa, April 2026) | ✅ LOCKED |
| Win Strategist as proprietary positioning term — never paraphrased as "win consultant," "win advisor," etc. | learnings.md §3.2 (Lisa, April 2026) | ✅ LOCKED |
| Banned phrases (Susan V1.3): "Method to our madness," "Method to the RFP madness," "Healthy egos welcome" (external), "Love Dogs," "Empathetic to the struggle — small business owner," "Winning RFP clients make raving fans," "Collaborative not dictatorial," "Seamless team integration," "Strategic acceleration not a full handoff" | C7 (Susan, Feb 2026) | ✅ LOCKED |
| Lisa specific rejections: "State velocity," "Federal-grade rigor," any Federal positioning, "Topics Lisa Speaks On" list, "Evaluator psychology" — use "Understanding what evaluators look for" instead | C8 (Lisa, Feb 2026) | ✅ LOCKED |
| "Mercedes" — internal-only. Stays in internal Champagne tier descriptor docs; never appears in customer copy. | C9 (Susan V1.3) | ✅ LOCKED |
| "Rinse and repeat" → use "Proven process, customized execution" | C10 (Susan V1.3) | ✅ LOCKED |
| "From Reactive Bidding to Intentional Winning" → use "From reactive to intentional" | C11 (Susan V1.3) | ✅ LOCKED |
| Susan's Win Strategist key phrases (use verbatim where they fit): "Your wins become our wins" / "A proven team, not just advice" / "We don't teach — we do" / "From hoping to knowing" | C12 (Susan V1.3) | ✅ LOCKED |
| Advisement tier voice: "Knowledgeable and expert-based," "Results-focused — they need wins, not validation," "Direct about gaps without condescension," "We see what you're missing" — REPLACES older framing ("Consultative and strategic," "Elevate and optimize," "Expert peer positioning") | C13 (Susan V1.3) | ✅ LOCKED |
| "AI writes words. We write wins." rejected. Use "AI-only proposal tools produce generic, surface-level language." Three-column strip: "Strategy-Led Writing, Not Auto-Generated Drafts" (NOT "Win Strategists, Not AI Drafts"). | C3 (Lisa, Feb 2026) | ✅ LOCKED |
| Champagne tier tagline: "Serious operators who invest in a Win Strategist and value the partnership." | C17 (Jason confirmation, April 2026 — ClickUp 90130250614889) | ✅ LOCKED |
| Reusable closer verbatim: "Anyone can help you submit a proposal. Very few can help you win one. We don't measure success by submission. We measure it by win rate." | brand_context/samples.md "Locked Lisa verbatim" section (Jan 2026 — ClickUp 90130242946436) | ✅ LOCKED |

### 4.5 Design system rules (cross-references to assets.md)

| Rule | Source | Status |
|---|---|---|
| Light-and-airy aesthetic — no pure black on any design surface. Use dark charcoal gray (#454545 + #5C5D5E per Figma 2026-05-13) instead. Pure black #000000 only appears as outermost Figma canvas, NOT on any design surface. | C1 (Lisa, Feb 2026) — verified in assets.md Color palette section | ✅ LOCKED |
| Hero images sourced from Lisa's approved photo folder only. No social media scrapes. "Way I See It" video footage too old to use. | C2 (Lisa, Feb 2026) — referenced in assets.md Photography section | ✅ LOCKED |
| Trust bar badge order — every page that carries the trust bar must match homepage order: Inc. 5000 (2023, 2024) → WBENC → Goldman Sachs 10KSB → Featured in 11 publications → Longest-Running RFP Podcast. Inc. 5000 badge specifically renders "2023, 2024" — not just "Inc. 5000." | C16 (Jason design directive, April 2026 — ClickUp 90130255063964) | ✅ LOCKED |
| ™ vs ® on rendered logo glyph — logo PNGs carry ™ on "SUCCESS" while body copy uses ®. Lisa's directive applies plainly to company name as text; whether the rendered glyph itself needs ® is unresolved. Blocks Breakdance build of any page that places the logo. | C14 (Step 5B logo inventory, 2026-05-13 + Lisa Mar 19, 2026) | 🟡 OPEN |
| "AI writes words. We build wins." variant currently in Figma Why Us section. Close-cousin of the C3-rejected "AI writes words. We write wins." variant — needs Lisa confirmation before Breakdance build of the Why Us section. | C3 + Step 5C design audit (assets.md "Content flags from design audit") | 🟡 OPEN per Figma variant |
| Canva brand kit was canonical source of truth for hex codes/fonts. | C6 (Jason V1.1 brief response, Feb 2026) | ⛔ SUPERSEDED — Canva account is no longer accessible (closed). Figma file at node 182:5 is now canonical per assets.md "Brand source provenance" section (Step 5C, 2026-05-13). |

### 4.6 Content production rules

| Rule | Source | Status |
|---|---|---|
| Lisa cannot open .md files. All Lisa-facing deliverables convert to Word/PDF/Google Docs or ClickUp docs before sharing. See §5 below for the full export protocol. | C5 (Lisa, Feb 2026) | ✅ LOCKED |
| T9 Author Bio facts confirmed by Lisa: **(1)** case studies represent team work, not solely Lisa's individual delivery — frame as "what my team has done" not "what I did"; **(2)** Lisa has experience on all sides of the aisle — responding to RFPs, developing RFPs, AND evaluating RFPs (three-perspective framing); **(3)** Lisa is past president of the Phoenix chapter of APMP (Association of Proposal Management Professionals) — add to credentials. | C18 (Lisa, April 2026 — ClickUp 90130262748785) | ✅ LOCKED for T9 Author Bio page |
| Homepage pricing leads with $8,500 (Proposal Audit reference); $2,500 entry point belongs on `/advisement/` page only. Needs reconciliation with current $2,500–$5,000 Evaluator's Eye Audit pricing. | C4 (Jason V1.1 brief response, Feb 2026) | 🟡 OPEN — pending Jason reconciliation |

---

## 5. Lisa-facing deliverable export protocol

Per C5: Lisa cannot open .md files. Every deliverable that needs Lisa review follows this workflow.

### Workflow

1. **Author** finishes first draft as .md in the repo at the appropriate path (`brand_context/`, `projects/website/briefs/`, etc.).

2. **Reviewer (Jason)** reviews on main branch in repo. Approved version proceeds.

3. **Upload to ClickUp.** The .md content is uploaded as a ClickUp doc in the RFP Success client space, or pasted into a new ClickUp doc — whichever is faster for the deliverable type. Long-form (briefs, SOPs): upload as doc. Short-form (single page of feedback): paste into doc.

4. **Create review task.** ClickUp task assigned to Lisa with:
   - Clear descriptive title
   - Body summarizing what changed and what specific feedback is requested
   - Linked: the uploaded ClickUp doc

5. **Wait for Lisa's review and approval in ClickUp.** Comments and corrections accumulate in the ClickUp doc + task thread. Both the task comments and the inline doc comments are valid feedback channels.

6. **Corrections flow back.** Any new rules Lisa surfaces during review get captured as new C-rows in `context/learnings.md` before the deliverable proceeds. Per the §3 review chain, the Author session ingests the new C-rows and revises.

### Never

- Send Lisa a .md file as an email attachment
- Email Lisa a deliverable without a ClickUp task link
- Skip the Jason review step before uploading to ClickUp
- Mark a deliverable "complete" before Lisa's explicit approval in the ClickUp task

---

## 6. Design constraint enforcement

Reference: `brand_context/assets.md` (canonical as of Step 5C, 2026-05-13). Constraints content production must honor:

- **Figma tokens are canonical.** Hex codes, font sizes, and spacing live in assets.md "Color palette" and "Typography" tables. Content deliverables that reference colors by name (e.g., "brand teal," "accent orange," "dark charcoal") rely on these tokens — do NOT specify inline hex codes in copy unless the deliverable is a developer-facing handoff.
- **Light-and-airy preserved everywhere** per C1. If a content deliverable's design accompaniment suggests adding "heavy" or "dark" elements beyond charcoal surfaces, flag it for Lisa review before proceeding.
- **Hero images only from Lisa's approved photo folder** per C2. No stock photography, no Lisa social-media scrapes, no third-party imagery without Lisa approval.
- **Logo placement BLOCKED on any page that requires the logo glyph until C14 resolves.** Headers, navigation, hero compositions all wait. Once Lisa confirms scope (path a / b / c per C14), follow logo inventory in assets.md.
- **Trust bar badge order MUST match C16 locked sequence** on every page that carries the trust bar. The order is not negotiable per page.

### Design constraint check (run before submitting any deliverable that touches design)

- [ ] No banned colors (pure black on a design surface)
- [ ] No hero image from a non-approved source
- [ ] No trust bar with badges out of order or missing the "2023, 2024" treatment on Inc. 5000
- [ ] If the deliverable touches the logo: C14 resolution status checked and noted
- [ ] If the deliverable mentions Canva as a source of truth: cross-referenced — Canva access is gone; Figma is canonical per Step 5C

---

## 7. Pre-submission checklist

### Author checklist (run before Author → Reviewer handoff)

**Sources & citations**
- [ ] Every claim with a number is sourced — Tier 1 internal, or Tier 2/3 with inline citation per agency Citation Discipline SOP §7.4
- [ ] Zero `[STAT NEEDED]` placeholders remain in the draft (per Citation Discipline SOP §3.2)
- [ ] Lisa verbatim quotes carry ClickUp comment ID in the citation when sourced from ClickUp threads

**Voice & phrasing**
- [ ] No banned phrases per C7 (Susan V1.3 list — full list in §4.4)
- [ ] No Lisa rejections per C8 — no "State velocity," "Federal-grade rigor," any federal positioning, "Topics Lisa Speaks On," "Evaluator psychology"
- [ ] No "AI writes words" variants without explicit Lisa pre-approval per C3
- [ ] Mercedes appears only in internal docs, never in customer copy (per C9)
- [ ] Where Susan V1.3 phrases fit, preferred verbatim used (per C12)
- [ ] Advisement tier voice matches C13 (knowledgeable, expert-based, results-focused, direct about gaps)
- [ ] Voice matches archetype per ICP segment: Scrambler / Almost-Winner / Capability Dumper / First-Timer / Internal Champion
- [ ] Closer language: prefer Lisa-verbatim from `brand_context/samples.md` "Locked Lisa verbatim — reusable across content" section

**Brand mechanics**
- [ ] Every public-facing brand mention uses ® per §2.1
- [ ] First Lisa mention on the page uses "RFP-expert Lisa Rehurek" prefix per §2.2
- [ ] 4x4 Framework™ uses the TM mark; D.A.R.E. formatted with periods (D.A.R.E.) per §2.3 / §2.4
- [ ] D.A.R.E. expansion uses "Readability" (not "Requirements") per §2.5
- [ ] "Service-based businesses" used in ICP framing — never just "businesses" per §1.8

**Locked numbers**
- [ ] Years: **30+** (not 26 or 28), attributed to **Lisa** (not company) per §1.1
- [ ] Win rate: **76%+** (not 78%) per §1.2
- [ ] Down-select: **92%** per §1.3
- [ ] Wins: **$500M+** per §1.4
- [ ] Industries: **30+** per §1.5
- [ ] Books: **11 total** (5 RFP-specific) per §1.6

**Tier ranges**
- [ ] All tier-revenue mentions match LOCKED April 2026 per C15: DIY $500K–$1M → Express $1M–$5M → Wine $5M–$10M → Champagne $10M–$25M+
- [ ] Champagne tier tagline used verbatim per C17 when relevant

### Reviewer checklist (run before Reviewer → Approver handoff)

- [ ] All Author checklist items confirmed
- [ ] Every external claim cited inline per agency Citation Discipline SOP §7.4 with attribution hook
- [ ] Three-item-list rule per Core Standards §8.2 — factual enumerations permitted, rhetorical pattern-of-three constructions banned
- [ ] If deliverable touches the logo: C14 resolution status confirmed before submitting to Lisa
- [ ] If deliverable touches a Lisa-bio statement: C18 facts incorporated (team-work framing, three-sides-of-aisle, APMP Phoenix past president)
- [ ] If deliverable has a trust bar: order matches C16 sequence exactly
- [ ] Solo-reviewer cooling period applied if Jason held both Author and Reviewer roles (per §3)
- [ ] Deliverable uploaded to ClickUp doc + task assigned to Lisa with link per §5

---

## 8. Out of scope

This overlay does NOT cover:

- **Actual RFP response content compliance** — anti-collusion clauses, set-aside disclosures, government-procurement-specific legal language. That's Lisa's domain during her clients' proposal work, not website content production for The RFP Success® Company.
- **Federal procurement domain** — explicitly out per §1.7 and C8. No federal sources cited, no federal-market positioning, no federal-grade rigor framing.
- **Marketing automation copy** — email sequences, ad copy, paid-acquisition creative. Covered by `mkt-copywriting` skill once an editorial overlay for those page types is added in a future version of this file.
- **Per-client incident catalog** — incidents caught during RFP Success content production accumulate here in future versions.

### Per-client incident catalog (will grow)

New entries follow the per-incident format used by the agency Citation Discipline SOP §8 incident catalog: date, incident description, correction applied, source citation.

### Incident 1 — Fabricated archetype set in AGENTS.md and overlay (2026-05-13, caught by Step 9 inheritance verification)

**What happened:** During Step 8B AGENTS.md drafting, the template included a five-archetype set (Almost-Winner / Underdog Outsider / Reluctant Returner / Operations-Strained Operator / Champagne Operator) that had no source in the repo. Almost-Winner is real and appears in the canonical SOP v1.2 + icp.md set; the other four names were not anchored to any document. The same set propagated into RFP_Editorial_Overlay_v1.md §7 during Step 8A.

**How it was caught:** Step 9 inheritance chain verification (2026-05-13) ran a smoke test simulating context-load for a Win Strategist Services hero. The smoke test surfaced the mismatch between AGENTS.md/overlay and the canonical SOP v1.2/icp.md set.

**Correction:** Patched AGENTS.md §5 and overlay §7 checklist to match the canonical set (Scrambler / Almost-Winner / Capability Dumper / First-Timer / Internal Champion) sourced from SOP v1.2 §3 per Jason's April 2026 v1.1 SOP update.

**Process lesson:** When AGENTS.md or overlay references another file's content by name (archetypes from icp.md, archetype names in SOP v1.2, voice rules from voice-profile.md), verify the reference against the actual file rather than pattern-matching from session summary context. The inheritance chain verification step exists to catch this class of error.

**Source:** Step 9 inheritance verification report at `/tmp/step9-inheritance-verification.md`

---

## Version history

| Version | Date | Author | Notes |
|---|---|---|---|
| 1.0 | 2026-05-13 | Step 8A migration (Jason + Claude Code) | Initial overlay. Compiled from learnings.md §1.x / §2.x / §3.x + C1–C18, modeled on `GL_Editorial_Overlay_v1.md` structure, adapted for RFP Success SLED-only domain. Companion to `RFP_SUCCESS_WEBSITE_CONTENT_SOP_v1.2.md`. |

---

*Version 1.0 — May 2026 — ROI.LIVE / Jason Spencer*
*Read together with `brand_context/sops/RFP_SUCCESS_WEBSITE_CONTENT_SOP_v1.2.md` (canonical client SOP) and the agency Citation Discipline SOP. SOP carries page-by-page production rules; this overlay carries the citation tier mapping, review chain, hallucination catalog, deliverable export protocol, and design constraint enforcement.*
