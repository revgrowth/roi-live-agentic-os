---
name: meta-goal-breakdown
description: >
  Route and break down every goal submitted through the command centre.
  Triggers on: any goal submitted through the command centre goal bar,
  "break this down", "plan this out", "what are the subtasks",
  "scope this work", "task breakdown", "decompose this goal".
  First classifies the goal into one of four levels, then either
  handles it directly (Level 1 pass-through, subtask breakdown) or
  hands off to the right system (Level 2 brief scoping, Level 3 GSD).
  This is the single entry point for all goal bar submissions.
  Every goal passes through this skill's routing before anything executes.
---

# Goal Breakdown

The entry point for every goal submitted through the command centre. Classifies complexity, routes to the right system, and — for goals that need subtask breakdown — decomposes into structured, ordered subtasks with dependencies and acceptance criteria.

## Outcome

- **Level 1 (single task):** Goal passes through with a sharpened title and acceptance criteria
- **Subtask breakdown:** Structured subtask list with waves, dependencies, and per-task acceptance criteria — created as child tasks via `parentId`
- **Level 2 (project):** Handed off to project brief scoping flow — creates `projects/briefs/{slug}/brief.md`
- **Level 3 (GSD):** Handed off to `/gsd:new-project` — creates `.planning/` with full phase architecture

## Context Needs

| File | Load level | How it shapes this skill |
|------|-----------|--------------------------|
| `brand_context/voice-profile.md` | — | Not needed for planning |
| `brand_context/positioning.md` | Summary | Ensures subtasks align with strategic positioning |
| `brand_context/icp.md` | Summary | Audience context shapes deliverable priorities |
| `context/learnings.md` | `## meta-goal-breakdown` section | Apply previous breakdown feedback |

## Dependencies

| Skill | Required? | What it provides | Without it |
|-------|-----------|-----------------|------------|
| None | — | This skill is self-contained | — |

## Step 1: Route — Classify the Goal

Every goal bar submission hits this step first. Assess across three dimensions, then route.

### Dimension 1: Deliverable count
- **One** clear output → leans Level 1
- **2-8** related outputs → leans subtask breakdown
- **Many** outputs across different domains → leans Level 2 or 3

### Dimension 2: Ambiguity
- **Low** — "done" is obvious from the goal text → leans Level 1 or subtask breakdown
- **Medium** — scope is clear but details need nailing down → leans subtask breakdown (quiz first)
- **High** — goal is broad, strategic, or open-ended → leans Level 2 or 3

### Dimension 3: Duration and structure
- **Single session**, no phases → Level 1 or subtask breakdown
- **Multi-session**, but one coherent campaign/initiative → Level 2
- **Multi-phase**, with architecture decisions, milestones, or build stages → Level 3

### The Decision Tree

```
Is there exactly ONE clear deliverable with no ambiguity?
├─ YES → Level 1: Single task (skip to Step 5)
└─ NO ↓

Can the work be expressed as 2-8 concrete subtasks
that all serve one goal?
├─ YES → Subtask breakdown (continue to Step 2)
└─ NO ↓

Is this a campaign, launch, or multi-deliverable initiative
where the deliverables are known but need scoping?
├─ YES → Level 2: Project brief
│         Hand off: create projects/briefs/{slug}/brief.md
│         Run interactive scoping conversation (goal, deliverables,
│         acceptance criteria, constraints) per AGENTS.md Level 2 rules.
│         STOP here — the brief scoping flow takes over.
└─ NO ↓

Does this need phased execution, architecture decisions,
milestones, or will it produce a system/app/complex workflow?
├─ YES → Level 3: GSD project
│         Hand off: run /gsd:new-project
│         STOP here — GSD takes over.
└─ NO ↓

Still unclear → ask ONE question:
"Is this closer to a set of related tasks I can knock out,
or a bigger build that needs proper planning first?"
Route based on the answer.
```

### Signal words that suggest each level

| Level | Signal words / patterns |
|-------|------------------------|
| **Level 1** | "write a...", "fix the...", "send a...", "check if...", "update the...", single-verb requests |
| **Subtask breakdown** | "launch...", "set up...", "create a [thing] with [multiple parts]", "I need X, Y, and Z" |
| **Level 2 project** | "campaign", "launch plan", "client deliverables", "series of...", "everything for...", named initiatives |
| **Level 3 GSD** | "build an app", "redesign the system", "create a platform", "automate the whole...", anything needing architecture |

### Tell the user what you decided

After routing, state the classification clearly:

- Level 1: *"This is a single task — I'll sharpen it and get started."*
- Subtask breakdown: *"This breaks into [N] subtasks — let me ask a couple of questions to scope it right."*
- Level 2: *"This is a multi-deliverable project — let me scope it with a brief first."*
- Level 3: *"This needs phased planning — handing off to GSD."*

If the user disagrees with the classification, reclassify without arguing. They know their work better.

## Step 2: Requirements Quiz

Ask the user focused questions to nail down scope. Do NOT ask everything at once — batch into rounds of 2-3 questions max, starting with the most important unknowns.

**Round 1 — Scope boundaries:**
- "What does done look like? What's the one thing that proves this is finished?"
- "What's explicitly out of scope?" (prevents scope creep during execution)

**Round 2 — Constraints and priorities** (only if still ambiguous):
- "Any hard constraints? (deadline, tech stack, budget, platform)"
- "If you had to ship only half of this, which half matters most?"

**Round 3 — Dependencies and context** (only if needed):
- "Does this depend on anything that isn't done yet?"
- "Is there existing work I should build on rather than start fresh?"

**Rules for quizzing:**
- Stop asking as soon as you have enough to break down confidently
- Never ask more than 3 rounds
- If the user says "just figure it out" — make reasonable assumptions and state them explicitly
- Capture all answers as decision context (logged with the parent task)

## Step 3: Subtask Decomposition (subtask breakdown path only)

Break the goal into subtasks using these principles:

### 3a. Identify deliverables
List every concrete output the goal requires. Each deliverable becomes at least one subtask.

### 3b. Find the dependency chain
For each subtask, ask: "Can this start before anything else finishes?" Map dependencies explicitly.

### 3c. Assign waves
Group subtasks into execution waves (borrowed from GSD):
- **Wave 1:** Foundation work — must complete before anything else can start
- **Wave 2+:** Can run in parallel once their dependencies are met
- Same-wave subtasks have no dependencies on each other

### 3d. Structure each subtask

```
Title: [Action verb] + [specific deliverable]
Description: What this subtask produces and why it matters to the goal
Depends on: [list of subtask titles, or "none"]
Wave: [1, 2, 3...]
Acceptance criteria:
  - [Observable truth that proves this subtask is done]
  - [Another observable truth if needed]
Suggested level: task | project
```

### 3e. Verify completeness
Check: "If every subtask's acceptance criteria are met, is the original goal achieved?" If not, a subtask is missing.

## Step 4: Output

**For Level 1 single tasks (routed here from Step 1):** Sharpen the title (action verb + specific deliverable) and add 1-2 acceptance criteria. Return the enhanced task — no subtask creation needed. Execute immediately or queue.

**For subtask breakdowns:** Present the full breakdown to the user:

```
## Goal: [original goal]

### Decisions captured
- [Any answers from the requirements quiz]
- [Any assumptions made]

### Subtasks (N total, M waves)

**Wave 1** (sequential foundation)
1. [Subtask title]
   - [Description]
   - Acceptance: [criteria]

**Wave 2** (parallel after wave 1)
2. [Subtask title] — depends on: #1
   - [Description]
   - Acceptance: [criteria]
3. [Subtask title] — depends on: #1
   - [Description]
   - Acceptance: [criteria]

...
```

Ask: "Does this breakdown match what you had in mind? Anything to add, remove, or reorder?"

Once confirmed, create the subtasks as child tasks linked to the parent goal via `parentId`. Set all to `backlog` status. Wave 1 tasks get queued first.

## Rules

- Never create subtasks without user confirmation of the breakdown
- Maximum 8 subtasks per goal — if you need more, the goal should be a Level 2 project with a brief
- Every subtask must have at least one acceptance criterion — no vague tasks
- Subtask titles always start with an action verb (Build, Write, Design, Configure, Test, etc.)
- If a goal mentions a skill by name ("write copy", "build brand voice"), note which skill handles that subtask
- Log the full breakdown (goal → subtasks mapping) with the parent task's description for traceability

## Self-Update

When a user flags an issue with a breakdown (wrong scope, missing subtask, bad ordering), add a dated rule to the Rules section above. Format: `- YYYY-MM-DD: [lesson learned]`. This prevents the same mistake in future breakdowns.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| User says "just do it" without answering questions | Make assumptions, state them explicitly, proceed with breakdown |
| Goal is too vague to decompose | Ask ONE clarifying question: "What's the single most important outcome?" |
| Subtask count exceeds 8 | Suggest upgrading to Level 2 project with a brief |
| Circular dependencies detected | Flag to user — something in the goal structure needs rethinking |
