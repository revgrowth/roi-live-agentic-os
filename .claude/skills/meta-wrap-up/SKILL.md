---
name: meta-wrap-up
description: >
  End-of-session checklist that reviews deliverables, collects feedback,
  fixes skills, updates learnings, and commits work. Use when the user
  says "wrap up", "close session", "end session", "wrap things up",
  "we're done", "that's it for today", "session done", or invokes
  /wrap-up. Run at the end of any working session or after completing
  a major deliverable. Does NOT trigger for content writing, voice
  extraction, positioning, or audience research.
---

# Wrap-Up

End-of-session checklist. Four steps: review what was done, collect feedback, apply fixes, commit everything.

## Outcome

- Updated `context/learnings.md` with session feedback
- Updated `context/memory/{today}.md` with session log
- Promoted important insights to `context/MEMORY.md` if business-level
- Updated `context/USER.md` if new preferences were observed
- Direct fixes applied to any skills that need them
- CLAUDE.md Skill Registry, Context Matrix, and README.md synced with any new or removed skills/MCPs
- Clean git commit of all session work
- Session summary presented in consistent format

## Context Needs

| File | Load level | How it shapes this skill |
|------|-----------|--------------------------|
| `context/learnings.md` | `## meta-wrap-up` section | Check for previous wrap-up insights |
| `context/MEMORY.md` | Full | Know what's already in long-term memory to avoid duplicates |
| `context/USER.md` | Full | Check if preferences need updating |
| All `brand_context/` files | Scan only | Identify which files were created or modified this session |

Load if they exist. Proceed without them if not.

---

## Step 1: Review Deliverables

Scan what happened this session:

1. Run `git status` and `git diff --stat` to see all changes
2. List every file created or modified, grouped by location:
   - `brand_context/` — foundation files written or updated
   - `projects/` — deliverables produced
   - `.claude/skills/` — skills created or modified
   - Other locations — flag for file placement check
3. **File placement check:** Verify outputs follow naming conventions:
   - Projects in `projects/{category}-{output-type}/` with correct prefix
   - Filenames use `{descriptive-name}_{YYYY-MM-DD}.md` format
   - If anything is misplaced or misnamed, fix it now

---

## Step 2: Collect Feedback

Ask the user three questions (skip any that don't apply to the session):

1. **What worked well?** — Anything the skills produced that hit the mark
2. **What didn't work?** — Anything that missed, needed heavy editing, or frustrated you
3. **Any specific skill issues?** — Did a skill take the wrong approach, miss context, or produce the wrong format?

If the session was short or routine, one question is enough: "Anything to note before I wrap up?"

---

## Step 3: Apply Changes

Two types of updates based on the feedback:

### 3a: Update Learnings

Log feedback to `context/learnings.md`:
- Skill-specific feedback → `# Individual Skills` → `## {skill-folder-name}` section
- Cross-skill patterns → `# General` → `## What works well` or `## What doesn't work well`

Each entry format:
```
- {YYYY-MM-DD}: {What happened and what was learned}
```

### 3b: Fix Skills Directly

If feedback points to a specific skill issue — wrong approach, missing step, bad default, missing context — **edit the SKILL.md or reference file directly**. Don't just log it; fix it.

Examples of direct fixes:
- Skill missed a step → add the step to SKILL.md
- Wrong output format → update the format instructions
- Skill should have loaded context it didn't → update Context Needs table
- A reference file has outdated guidance → edit the reference

After applying fixes, log what was changed in the skill's learnings section so there's a record.

### 3c: Write Daily Memory

One file per day: `context/memory/{YYYY-MM-DD}.md`. Multiple sessions in one day append new session blocks to the same file.

**If the file already exists**, append a new `## Session N` block (increment the session number). **If it doesn't exist**, create it.

Each session block must include:
- `### Goal` — what the user set out to do
- `### What happened` — bullet points covering tasks completed, deliverables produced, decisions made, feedback received, and anything the next session should know

**Never leave placeholder text** like `[Waiting for user goal]`. Replace placeholders with actual content from the session. If the heartbeat created the file with placeholders, overwrite them now.

### 3d: Promote to Long-Term Memory

Review the session for anything that matters beyond today. If you learned something significant — a business fact, a strategic decision, a user preference, an important date — add it to `context/MEMORY.md` under the appropriate section.

Not every session produces long-term memories. Most won't. Only promote what would be useful weeks from now.

### 3e: Update User Preferences

If you noticed new patterns about how the user works — communication style, preferred formats, feedback cadence, working hours — update `context/USER.md`. Don't ask permission for small additions to the Notes section; do ask before changing core preferences.

### 3f: Skill & MCP Sync

Run the reconciliation described in CLAUDE.md's **Skill & MCP Reconciliation** section. This catches anything that changed during the session:

1. **Skills** — compare `.claude/skills/` folders against CLAUDE.md's Skill Registry and Context Matrix:
   - New skill folder not yet registered → add to CLAUDE.md Skill Registry, Context Matrix, README.md skill tables, and `context/learnings.md`
   - Registered skill whose folder was deleted → ask user: "Remove `{skill-name}` from CLAUDE.md Skill Registry, Context Matrix, README.md, and context/learnings.md?"

2. **MCPs** — compare `.claude/settings.json` MCP entries against README.md:
   - New MCP not documented → add to README.md Connected Tools section
   - Documented MCP removed from settings → ask user: "Remove `{mcp-name}` from README.md?"

Log any sync actions in the session summary under a **Registry sync** line.

---

## Step 4: Commit & Push

1. Stage all changes from the session (deliverables, brand context updates, skill fixes)
2. Commit with a descriptive message summarising the session's work
3. Push to remote

---

## Session Summary

After all steps, present a summary in this exact format:

```
--- Session Summary ---

Deliverables:
- {file path} — {what it is}
- {file path} — {what it is}

Learnings logged:
- {skill-name}: {one-line summary of what was logged}
- General: {one-line summary if cross-skill insight was added}

Skills modified:
- {skill-name}: {what was changed and why}
  (or "None" if no skills were modified)

Registry sync:
- {what was added/removed from CLAUDE.md, README.md, context/learnings.md}
  (or "No drift detected")

Memory:
- Daily log: context/memory/{YYYY-MM-DD}.md
- Long-term: {what was added to context/MEMORY.md, or "Nothing promoted"}
- User prefs: {what was updated in context/USER.md, or "No changes"}

Committed: {commit hash} — {commit message}
---
```

If no deliverables were produced (e.g., session was planning or discussion only), note that instead.

---

## Step 5: Show Usage

After the session summary, tell the user to run `/usage` to check their plan usage, limits, and remaining capacity. This is a built-in CLI command that must be typed by the user — it cannot be invoked programmatically by the agent.

---

## Rules

*Updated automatically when the user flags issues. Read before every run.*

- 2026-03-10: Daily memory file must contain real content, never placeholders. One file per day with `## Session N` blocks. Always fill in the goal and what happened — don't leave heartbeat scaffolding as-is.

---

## Self-Update

If the user flags an issue with the wrap-up process — wrong commit scope, missed files, bad summary format — update the `## Rules` section in this SKILL.md immediately with the correction and today's date. Don't just log it to learnings; fix the skill so it doesn't repeat the mistake.

---

## Troubleshooting

**User has no feedback:** Log "No feedback — routine session" with date to the relevant skill section. Still do the file placement check and commit.
**Multiple skills used in one session:** Collect feedback per skill. Log to each skill's section separately.
**User wants to skip steps:** That's fine — the minimum useful wrap-up is Step 3a (update learnings) + Step 4 (commit). Always do at least those two.
