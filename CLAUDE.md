# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Heartbeat

Before doing anything else in any session:
1. Read `context/SOUL.md` — who you are, how you behave
2. Read `context/USER.md` — who you're helping and their preferences
3. Read `context/MEMORY.md` — long-term business knowledge
4. Read `context/memory/{today}.md` + `context/memory/{yesterday}.md` — recent session context
5. Scan `brand_context/` — what exists? Flag anything older than 30 days: "Your [file] is from [date]. Want to refresh, or keep going?"
6. Scan `.claude/skills/` — know what skills are installed and available
7. **Sync check** — run the skill & MCP reconciliation (see below)

### Skill & MCP Reconciliation

Compare what's on disk against what's registered in this file. Fix any drift silently for additions; confirm with the user for removals.

**Skills — compare `.claude/skills/` folders vs the Skill Registry and Context Matrix tables above:**

1. **New skill on disk, not in CLAUDE.md?** → Read its YAML frontmatter, then:
   - Add a row to the **Skill Registry** table (under the correct category heading)
   - Add a row to the **Context Matrix** table (read `## Context Needs` from its SKILL.md)
   - Add a `## {folder-name}` section to `context/learnings.md` under `# Individual Skills`
   - Add the skill to the **README.md** skill tables and file structure diagram
   - Tell the user: "Registered `{skill-name}` — added to CLAUDE.md Skill Registry, Context Matrix, README.md, and context/learnings.md."

2. **Skill in CLAUDE.md but folder missing from disk?** → Ask the user: "`{skill-name}` is in the CLAUDE.md Skill Registry but the folder is gone. Remove it from CLAUDE.md Skill Registry, Context Matrix, README.md, and context/learnings.md?"

**MCPs — compare `.claude/settings.json` MCP server entries vs a tracked list:**

3. **New MCP server in settings.json, not documented?** → Add it to the README.md under a Connected Tools section (create the section if it doesn't exist). Tell the user what was added.

4. **Documented MCP removed from settings.json?** → Ask the user: "`{mcp-name}` is documented but no longer in settings.json. Remove from README.md?"

### Task Routing

When the user asks a question or requests a task:
1. **Search installed skills first.** Check `.claude/skills/` frontmatter for a matching skill.
2. **Skill found** → invoke it. Always prefer the dedicated skill over base knowledge.
3. **No matching skill** → inform the user explicitly and offer the choice:
   - **(a) Find or build a skill** — search for an existing skill to install, or build one with `meta-skill-creator`, so the system handles this task well every time
   - **(b) Handle it now with base knowledge** — complete the task without a skill, understanding output won't benefit from a tested methodology or the learnings loop

Never silently fall back to base knowledge when a skill exists. Never silently handle a task without telling the user a skill gap was found.

### Before Major Deliverables
- Is the relevant brand_context file loaded per the context matrix below?
- Are there learnings in `context/learnings.md` for this skill's section?
- If brand_context is missing, offer to run `/start-here` — never block work because context is missing

### After Major Deliverables
- Ask: "How did this land? Any adjustments?"
- Log feedback to `context/learnings.md` under the skill's section
- If gaps were spotted, mention once with opportunity framing: "I can make this more targeted once we build your ICP profile — want to do that now or after?"

---

## What This Project Is

Agentic OS is a Claude Code project template that turns any client folder into an intelligent business assistant. It is **agent-first**: personality lives in context/SOUL.md, long-term knowledge lives in context/MEMORY.md, brand memory lives in `brand_context/`, and functionality lives in `.claude/skills/`.

**One command to start: `/start-here`**. Everything else is a skill that triggers automatically or gets invoked by the orchestrator.

The full specification lives in `PRD.md`. Read it when building any new component.

---

## Three-Layer Architecture

| Layer | Files | Purpose |
|-------|-------|---------|
| **Agent Identity** | CLAUDE.md, `context/SOUL.md`, `context/USER.md`, `context/MEMORY.md` | Who the agent is and how it behaves |
| **Skills Pack** | `.claude/skills/{category}-{skill-name}/` | Capabilities. Grows over time. |
| **Brand Context** | `brand_context/` | Client brand data. Version controlled. |

`.env` is the **only** gitignored file.

---

## Skill Categories

Every skill and its output folder uses a category prefix. This keeps skills, outputs, and learnings sections consistently named.

| Prefix | Domain | Examples |
|--------|--------|----------|
| `mkt` | Marketing | `mkt-brand-voice`, `mkt-positioning`, `mkt-icp`, `mkt-email-sequence` |
| `str` | Strategy | `str-keyword-plan`, `str-competitor-analysis` |
| `ops` | Operations | `ops-client-onboarding`, `ops-invoice-generator` |
| `vid` | Video / Visual | `vid-thumbnail-creator`, `vid-ugc-generator` |
| `meta` | System / Meta | `meta-skill-creator`, `meta-wrap-up` |

**Rules:**
- Skill folder name = `{category}-{skill-name}` in kebab-case
- YAML frontmatter `name` field must match the folder name exactly
- Output folders use the same category prefix: `projects/{category}-{output-type}/`
- Learnings sections in `context/learnings.md` use `## {folder-name}` (e.g., `## mkt-brand-voice`)
- Add new categories only when the first skill in a new domain is built

---

## Skill Registry

*Auto-populated as skills are installed. Each entry includes: name, trigger conditions, context needs.*

### Meta Skills

| Skill | Triggers on |
|-------|------------|
| `meta-skill-creator` | "create a skill", "build a skill", "new skill", "make a skill", "optimize skill description" |
| `meta-wrap-up` | "wrap up", "close session", "end session", "we're done", "session done" |

### Foundation Skills (build first — these write brand_context/)

| Skill | Triggers on | Writes to |
|-------|------------|-----------|
| `mkt-brand-voice` | "tone", "writing style", "brand voice", "how we sound" | `voice-profile.md`, `samples.md` |
| `mkt-positioning` | "differentiation", "angle", "hooks", "USP" | `positioning.md` |
| `mkt-icp` | "target audience", "buyer persona", "ideal customer" | `icp.md` |

### Execution Skills

*Add new skills to this table when built and registered.*

---

## Context Matrix

Which `brand_context/` files each skill reads. Load only what's listed — no skill gets more context than it needs.

| Skill | voice-profile | positioning | icp | samples | assets | learnings |
|-------|:---:|:---:|:---:|:---:|:---:|:---:|
| `mkt-brand-voice` | **writes** | summary | — | **writes** | links only | `## mkt-brand-voice` |
| `mkt-positioning` | — | **writes** | full | — | — | `## mkt-positioning` |
| `mkt-icp` | — | summary | **writes** | — | — | `## mkt-icp` |
| `meta-wrap-up` | — | — | — | — | — | `## meta-wrap-up` |

*New skills declare their own row when added.*

**Matrix key:** `writes` = creates file | `full` = entire file | `summary` = 1-2 sentences | `angle only` = chosen angle | `tone only` = tone + vocabulary | `language section` = words-they-use section | `## skill-name` = read only that section from context/learnings.md | `—` = don't load

**Learnings rule:** Every skill reads and writes to its own section in `context/learnings.md`. Section headings match the skill's folder name exactly (e.g., `## mkt-brand-voice`). Cross-skill insights go under `# General` (`## What works well` / `## What doesn't work well`). Skill-specific entries go under `# Individual Skills` → `## {folder-name}`.

---

## Output Standards

- Save all generated content to `projects/{category}-{output-type}/`
- The category prefix in the output folder matches the skill's category (e.g., `mkt-brand-voice` skill → `projects/mkt-*/` outputs)
- Folder naming: `{category}-{output-type}` in kebab-case (e.g., `mkt-linkedin-carousel`, `str-keyword-plan`)
- Filename format: `{descriptive-name}_{YYYY-MM-DD}.md` (folder provides context, no skill-name prefix needed)
- Folders are created on first use by the skill. No empty pre-scaffolding.
- Default format: markdown unless user specifies otherwise
- After major deliverables: ask for feedback, log to `context/learnings.md`

### Schemas (Two-Tier System)

Schemas live next to the data they validate. Two tiers:

| Tier | Location | Validates |
|------|----------|-----------|
| Brand context schemas | `brand_context/schemas/` | `brand_context/*.md` structured data blocks |
| Output schemas | `projects/{folder}/00-schemas/` | Output files in that project folder |

**Current brand context schemas:**

| Schema | Used by | Purpose |
|--------|---------|---------|
| `brand_context/schemas/voice-profile.schema.json` | `mkt-brand-voice` | Structured voice data embedded in voice-profile.md |

*Output schemas are added inside each project folder's `00-schemas/` subfolder as execution skills are built. The `00-schemas/` subfolder is only created when a schema is relevant for that output type.*

When a skill produces structured output, it should read the relevant schema before generating data to ensure all required fields are present. Skills consuming structured output from another skill should also reference the schema to understand the data contract.

---

## Building New Skills

**Always ask for reference skills first.** Never guess at methodology — the user provides examples, Claude Code learns the pattern, then scaffolds. Use the `meta-skill-creator` skill to scaffold and iterate.

### Skill structure
```
.claude/skills/{category}-{skill-name}/
├── SKILL.md          ← YAML frontmatter + methodology (~200 lines max)
├── references/       ← Depth material, one topic per file (~200-300 lines each)
└── assets/           ← Example outputs, design references, templates (optional)
```

### YAML frontmatter rules
- ~100 words, under 1024 characters
- Include trigger phrases AND negative triggers
- No XML angle brackets

### Registration checklist
- [ ] Folder name = `{category}-{skill-name}` matching the Skill Categories table
- [ ] `name` field in frontmatter matches the folder name exactly
- [ ] Add to skill registry table above
- [ ] Add row to context matrix above
- [ ] Frontmatter < 1024 chars
- [ ] SKILL.md < 200 lines
- [ ] References are self-contained
- [ ] If the skill produces structured/repeatable output: create a schema in `brand_context/schemas/` (for brand context data) or `projects/{folder}/00-schemas/` (for output data) and reference it from SKILL.md
- [ ] Declare which `projects/` subfolder(s) the skill writes to (must use same category prefix)

### Folder naming
- Format: `{category}-{skill-name}` in kebab-case (e.g., `mkt-brand-voice`, `ops-client-onboarding`)
- Cannot contain "claude" or "anthropic"

---

## Build Order (from PRD)

1. **Phase 1 — Agent Identity:** context/SOUL.md → context/USER.md → context/MEMORY.md ✓
2. **Phase 2 — Command + Foundation Skills:** `start-here.md` ✓ → `mkt-brand-voice/` ✓ → `mkt-positioning/` ✓ → `mkt-icp/` ✓
3. **Phase 3 — Validate:** End-to-end test with a real business
4. **Phase 4 — Execution Skills:** Build incrementally, each with reference skills
5. **Phase 5 — Expand:** First non-marketing skill proves architecture is domain-agnostic

---

## Graceful Degradation

Skills work at all context levels:
- **No brand_context/**: Standalone mode — ask what's needed, produce solid generic output
- **Partial**: Use what exists, default for the rest
- **Full**: Fully personalised

Brand context **enhances**. It never gates functionality.

---

## Permissions

`.claude/settings.json` allows: `cat`, `ls`, `npm run *`, basic git commands, edits to `/src/**`

Denied: package installs, `rm`/`curl`/`wget`/`ssh`, reading `.env` or credential files.
