# Agentic OS — Build State

Tracks progress against PRD.md §14 build phases. Updated as work completes.

---

## Phase 1: Agent Identity ✅

| Deliverable | Status | Notes |
|------------|--------|-------|
| CLAUDE.md | ✅ Done | Session start, skill registry, context matrix, two-tier schemas, projects structure |
| SOUL.md | ✅ Done | Agent personality, behaviour rules, continuity model |
| USER.md | ✅ Done | Template with placeholders, populated by /start-here |
| MEMORY.md | ✅ Done | Long-term business knowledge template |
| .claude/settings.json | ✅ Done | Permissions per PRD §16 |

## Phase 2: Command + Foundation Skills ✅

| Deliverable | Status | Notes |
|------------|--------|-------|
| /start-here command | ✅ Done | First-run + returning mode, dynamic skill showcase |
| brand-voice skill | ✅ Done | 3 modes (Extract/Build/Auto-Scrape), 3 reference files, schema reference |
| positioning skill | ✅ Done | 8 angle frameworks, competitive search, market sophistication |
| icp skill | ✅ Done | Interview + Research modes, 3 reference files |
| skill-creator (meta) | ✅ Done | Installed from Anthropic GitHub |
| brand_context/schemas/voice-profile | ✅ Done | JSON schema for structured voice output |
| brand_context/learnings.md | ✅ Done | Skill-specific feedback, section per skill |
| brand_context/memory/ | ✅ Done | Daily session logs directory |
| wrap-up skill | ✅ Done | End-of-session checklist, memory writer |
| CCNotify | ✅ Done | Desktop notifications installed |
| README.md | ✅ Done | Project overview for Agentic OS |

## Phase 3: Validate ⬜ ← CURRENT

| Deliverable | Status | Notes |
|------------|--------|-------|
| Run /start-here end-to-end | ⬜ Pending | Test with a real business |
| Verify brand_context/ creation | ⬜ Pending | All 3 foundation skills produce output |
| Test returning mode | ⬜ Pending | Session checks, status, routing |
| Test standalone skill operation | ⬜ Pending | Skills work without brand_context/ |
| Test dynamic skill showcase | ⬜ Pending | Recommendations match context |

## Phase 4: Execution Skills ⬜

| Skill | Status | Notes |
|-------|--------|-------|
| mkt-copywriting | ✅ Done | Rebuilt from direct-response-copy reference. 156-line SKILL.md + 3 references (persuasion-toolkit, variants-and-scoring, classic-frameworks) |
| seo-content | ⬜ Pending | Needs reference skill from user |
| email-sequences | ⬜ Pending | Needs reference skill from user |
| lead-magnet | ⬜ Pending | Needs reference skill from user |
| keyword-research | ⬜ Pending | Needs reference skill from user |
| mkt-content-atomizer | ✅ Done | Renamed from content-atomizer, registered in CLAUDE.md + README |

## Phase 5: Expand ⬜

| Deliverable | Status | Notes |
|------------|--------|-------|
| First non-marketing skill | ⬜ Pending | Proves architecture is domain-agnostic |

---

## Decisions & Deviations

- Removed 5 example schemas (ad-matrix, campaign-brief, content-brief, email-sequence-summary, keyword-plan) — kept only voice-profile.schema.json.
- Restructured outputs: `output/` → `projects/` with categorised subfolders (`{category}-{output-type}`). Schemas moved to two-tier system: `brand_context/schemas/` for brand context data, `projects/{folder}/00-schemas/` for output data.
- ICP skill built from first principles (no reference skill provided).
- Positioning and brand-voice reworded from references, not copied.
- HEARTBEAT.md merged into CLAUDE.md Session Start section and deleted. Pre-action checks now live inline.
- Added two-tier memory system: MEMORY.md (long-term business knowledge) + context/memory/ (daily session logs). learnings.md remains for skill-specific feedback only.
- Renamed project from Growth OS to Agentic OS.
- Restructured into context/ folder: moved SOUL.md, USER.md, MEMORY.md from root to context/. Moved learnings.md and memory/ from brand_context/ to context/. Renamed CLAUDE.md "Session Start" → "Heartbeat". brand_context/ now holds only brand data (voice, positioning, ICP, schemas, samples).
- Added category prefixes to all skills: brand-voice → mkt-brand-voice, positioning → mkt-positioning, icp → mkt-icp, wrap-up → meta-wrap-up, skill-creator → meta-skill-creator. Added Skill Categories section to CLAUDE.md. Output folders use matching category prefix. Learnings sections match folder names.
