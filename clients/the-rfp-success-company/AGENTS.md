# The RFP Success Company — Agent Instructions

**Client:** The RFP Success® Company
**Owner:** Lisa Rehurek (Founder/CEO, final approver)
**Operator:** Jason Spencer (ROI.LIVE, fractional CMO, primary reviewer)
**Engagement:** Full fractional CMO since Q1 2026 — website build + 12-month content retainer + SEO + CRO
**Repo path:** `clients/the-rfp-success-company/`

This file is the session-start contract for any Claude Code session working in this client folder. It tells the session which files to load for which task types and surfaces the rules a session MUST know on turn 1. Heavy rules live in the SOP and overlay — this file routes you to them.

---

## 1. Inheritance order

Load in this order; later overrides earlier when rules conflict.

1. ROI.LIVE Agency Core Standards v1.1
2. Applicable page-type SOP (Service Page, Blog Article, Case Study Page, Homepage, About)
3. ROI.LIVE Agency Citation Discipline SOP v1.0
4. **RFP Success Website & Content SOP v1.2** — `brand_context/sops/RFP_SUCCESS_WEBSITE_CONTENT_SOP_v1.2.md` (page-by-page production rules)
5. **RFP Success Editorial Overlay v1** — `brand_context/sops/RFP_Editorial_Overlay_v1.md` (citation tier mapping, review chain, hallucination catalog, deliverable export protocol, design constraint enforcement)
6. This file (`AGENTS.md`) for client overrides
7. Current session instructions

---

## 2. The non-negotiables (must know on turn 1)

Five rules that have caused real problems and have explicit Lisa-anchored sources. Full catalog in `RFP_Editorial_Overlay_v1.md` §4.

1. **Lisa cannot open .md files** (C5). Lisa-facing deliverables convert to ClickUp doc → linked in ClickUp task assigned to Lisa for review. NEVER email a .md attachment. NEVER send a deliverable without a ClickUp task link. Full export protocol: `RFP_Editorial_Overlay_v1.md` §5.

2. **No federal positioning anywhere** (§1.7, C8). RFP Success is SLED-only (State, Local, Education). Banned: "Federal-grade rigor," any FAR/DFARS/GSA references, federal-market expertise framing. Even when factually accurate, federal sources are not citable.

3. **® on every public-facing brand mention** (§2.1, C14 verbatim). "The RFP Success® Company" — body copy, H1/H2/H3, nav text, footer. First Lisa mention on a page: "RFP-expert Lisa Rehurek" prefix (§2.2). Subsequent mentions can drop the prefix.

4. **Locked numbers** (§1.x). Years: **30+** attributed to Lisa (not 26, not company). Win rate: **76%+** (not 78%). Down-select: **92%**. Wins: **$500M+**. Industries: **30+**. Books: **11 total** (5 RFP-specific).

5. **Tier ranges locked April 2026** (C15). DIY $500K–$1M → Express $1M–$5M → Wine $5M–$10M → Champagne $10M–$25M+. Champagne contract value: $100K–$250K+ per engagement.

---

## 3. Context Matrix (which files to load for which task)

| Task type | Load these files (in order) |
|---|---|
| Website content production (any page type) | AGENTS.md → page-type SOP → `RFP_SUCCESS_WEBSITE_CONTENT_SOP_v1.2.md` → `RFP_Editorial_Overlay_v1.md` → `brand_context/voice-profile.md` → `brand_context/positioning.md` → `brand_context/icp.md` → `brand_context/samples.md` (verbatim closer + voice samples) → `context/learnings.md` (C-rows) → relevant brief in `projects/website/briefs/` |
| Brand voice work (new copy in Lisa's voice) | AGENTS.md → `brand_context/voice-profile.md` → `brand_context/samples.md` → `context/learnings.md` (C7 banned phrases, C12 key Susan V1.3 phrases) → `inputs/team-contributions/susan-rfp-questions-2026-02-17.md` |
| Strategic positioning / messaging | AGENTS.md → `brand_context/positioning.md` → `brand_context/icp.md` → `context/learnings.md` §3.x positioning rules → `inputs/project-knowledge/MASTER_FEEDBACK_TRACKER.md` |
| Design system / Breakdance build prep | AGENTS.md → `brand_context/assets.md` (design tokens, logo inventory, design audit content flags) → `RFP_Editorial_Overlay_v1.md` §6 design constraint enforcement → check C14 logo-glyph open status |
| Case study production (T4) | AGENTS.md → `projects/website/briefs/T4-case-study-template-v1.0.md` → `RFP_Editorial_Overlay_v1.md` §4.6 (C18 team-work framing for any Lisa references) |
| Author bio (T9 — HIGH PRIORITY E-E-A-T anchor) | AGENTS.md → `projects/website/briefs/T9-author-bio-template-v1.0.md` → `RFP_Editorial_Overlay_v1.md` §4.6 (C18 three Lisa facts: team-work framing, all-three-sides-of-aisle, APMP Phoenix past president) |
| Citation / sourcing decisions | AGENTS.md → `RFP_Editorial_Overlay_v1.md` §2 source tier mapping → agency Citation Discipline SOP |
| Anything Lisa-facing | AGENTS.md → `RFP_Editorial_Overlay_v1.md` §5 Lisa-facing deliverable export protocol |

---

## 4. Voice in one paragraph

Lisa is a 30+ year RFP veteran writing for service-based businesses ($500K–$25M+ revenue) chasing SLED contracts. Voice is direct, confident, evaluator-aware — never hype, never corporate-consulting-speak. Susan V1.3 brand voice work (Feb 2026) plus Lisa's verbatim corrections (April 2026) are canonical. Full voice system: `brand_context/voice-profile.md`. Banned phrases full list: `RFP_Editorial_Overlay_v1.md` §4.4.

---

## 5. Customer archetypes

Use one named archetype per problem framing. Never "businesses that struggle with X."

Five archetypes defined in `brand_context/icp.md`:

- Scrambler
- Almost-Winner (70%+ shortlist rate, ~25% close rate)
- Capability Dumper
- First-Timer
- Internal Champion

Specifics, pain triggers, and language patterns per archetype: `brand_context/icp.md`.

---

## 6. Review chain

Must follow for any Lisa-facing deliverable.

- **Author:** content production session (Claude Code; possibly Jason)
- **Reviewer:** Jason Spencer (operational gate — checks C1–C18 + design constraints + tier structure)
- **Approver:** Lisa Rehurek (final gate — voice, positioning, business decisions)

24-hour solo-reviewer cooling period when Jason holds both Author and Reviewer roles. Full chain detail + ClickUp workflow: `RFP_Editorial_Overlay_v1.md` §3 + §5.

---

## 7. Currently OPEN items (state-check before content production)

These can affect deliverables. Check `context/learnings.md` for current status before producing content that intersects:

- **C4** — Homepage $8,500 pricing reconciliation against current $2,500–$5,000 Evaluator's Eye Audit pricing. Pending Jason reconciliation.
- **C14** — ™ vs ® on logo glyph. Lisa directive applies plainly to text; logo glyph treatment unresolved. **Blocks Breakdance build of any page that places the logo until path resolves.**
- **C3 design variant** — "AI writes words. We build wins." in Figma Why Us section. Close-cousin to C3-rejected variant. Needs Lisa confirmation before Breakdance Why Us build.

---

## 8. Tools and skills relevant to this client

Default agency skill stack applies. Particularly load-bearing for RFP Success:

- `mkt-copywriting` (every content production session)
- `str-ai-seo` (technical SEO, AEO, citation discipline integration)
- `mkt-brand-voice` (when extracting or refining voice rules)
- `tool-dataforseo` (keyword validation, SERP analysis, AIO citation tracking)
- `tool-humanizer` (banned-phrase scan against C7 list + agency Core Standards §8 universal bans)

---

## 9. Open architecture items

- Per-client incident catalog in `RFP_Editorial_Overlay_v1.md` §8 — empty at v1.0, grows as production surfaces new issues
- Lisa Voice Charter conversation (no equivalent of GLC's Voice Charter exists yet for RFP Success — may surface during content production)
- Marketing automation copy (email sequences, ad copy) not yet covered by an overlay — future v2 of the editorial overlay will add

---

## Version history

| Version | Date | Notes |
|---|---|---|
| 1.0 | 2026-05-13 | Initial AGENTS.md. Built during Step 8B of migration from Claude.ai project storage. Companions: `RFP_SUCCESS_WEBSITE_CONTENT_SOP_v1.2.md`, `RFP_Editorial_Overlay_v1.md`. |

---

*Version 1.0 — May 2026 — ROI.LIVE / Jason Spencer*
*Read this file at session start. Heavy rules in the SOP and overlay; this file routes you there.*
