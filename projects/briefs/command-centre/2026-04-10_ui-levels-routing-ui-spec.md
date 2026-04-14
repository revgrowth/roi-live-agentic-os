---

## title: Command Centre — Levels & Routing UI Spec
project: command-centre
created: 2026-04-10
status: draft

## Purpose

Define how the Command Centre UI handles three work levels:

- **Level 1 — Task**: single deliverable, minimal structure
- **Level 2 — Planned project**: multi-deliverable, brief + subtasks
- **Level 3 — GSD**: phased build, `.planning/` lifecycle + phase UI

This spec is written to be implementable directly in the existing Next.js app under `projects/briefs/command-centre/`.

## Non-negotiables (system constraints)

- **Only one active GSD** per workspace because `.planning/` is shared.
- **Artifacts live where the OS expects**:
  - Level 1 outputs: `projects/{category}-{output-type}/...`
  - Level 2/3: `projects/briefs/{projectSlug}/brief.md`
  - Level 3: `.planning/` (active) plus archived planning under the brief on archive.

## UX principle

Make the UI always answer:

- **What happens next**
- **Why this level**
- **How to change it**
- **Where outputs/brief/phases live**

Default experience should be fast for novices and controllable for power users.

## Terminology (UI copy)

- **Task** (Level 1): “One-off deliverable”
- **Planned project** (Level 2): “Brief + subtasks”
- **GSD project** (Level 3): “Phases + verification”
- **Auto**: “Let Claude choose the right structure”

Use “structured” language rather than “complexity” to avoid implying user error.

## Entry points in current code (anchor points)

- Goal input: `src/components/board/task-create-input.tsx`
- Task panel: `src/components/modal/task-modal.tsx`
- Summary view: `src/components/modal/modal-summary-tab.tsx`
- GSD workspace: `src/app/gsd/page.tsx`
- Existing “decision” UI block: `src/components/autonomous/agent-decision-card.tsx`

## Information architecture

The Feed remains the home for all work. Levels affect:

- creation flow (routing/scoping)
- what “drill-down” shows (brief, subtasks, phases)
- guardrails (GSD single-slot constraint)

## Screen map

### Screen A — Goal Entry (Feed top bar)

**Component**: `TaskCreateInput`

**Additions**

- **Mode toggle** (compact segmented):
  - `Auto` (default)
  - `Pick` (forces the existing 3-option level picker modal)
- **Level override dropdown** stays, but is framed as:
  - “Override (optional)” rather than the primary path

**Keyboard**

- Submit: `Cmd/Ctrl + Enter` (already)
- In picker modal: `1/2/3` choose (already)

**Acceptance**

- In Auto mode, submitting does **not** show the picker modal.
- In Pick mode, behavior stays as-is today.
- Level override always bypasses Auto and Pick (explicit user intent).

---

### Screen B — Auto Routing Result (new)

**When**

- After submit in Auto mode, before queuing the task, or as an immediate follow-up step.

**Goal**

- Teach levels by showing a confident recommendation + a safe “change” path.

**UI**

- A lightweight card inserted above the board (or pinned under the input while active).
- Reuse the look/feel of `AgentDecisionCard` for consistency.

**Content**

- Header: “Suggested structure”
- Recommendation pill: Task / Planned project / GSD project (use the existing `LEVEL_COLORS`)
- “Because” bullets (1–2 lines):
  - derived from the routing dimensions: deliverables, ambiguity, duration/structure
- Optional confidence badge (Low/Med/High). If omitted, keep copy crisp.

**CTAs**

- Primary: **Proceed**
- Secondary: **Change level…** (opens existing level picker modal)
- Tertiary (link): “What’s the difference?”

**What “Proceed” does**

- Task → queue immediately as Level 1
- Planned project → open the Level 2 scoping wizard (Screen C)
- GSD → run GSD guardrail check; if allowed, start GSD onboarding (Screen D)

**Acceptance**

- User can always override before anything irreversible happens.
- On Proceed, the chosen level becomes the task’s `level`.

---

### Screen C — Planned Project Scoping Wizard (new, Level 2)

**When**

- Auto recommends “Planned project” and user clicks Proceed
- Or user manually chooses “Planned project”

**Goal**

- Produce a usable `projects/briefs/{slug}/brief.md` and an initial breakdown before execution begins.

**Format**

- A modal wizard OR a right-side panel (prefer panel for continuity with `TaskModal`).
- Must feel “light”: 2–3 steps max, no long questionnaires.

**Step 1 — Done + Out of scope**

- Prompt: “What does ‘done’ look like?”
- Secondary prompt: “What’s explicitly out of scope?”

**Step 2 — Constraints**

- Prompts:
  - “Any deadline?”
  - “Any hard constraints? (stack, budget, platform)”
  - “If you ship only half, what matters most?”
- Show only what’s needed; allow skipping.

**Step 3 — Proposed breakdown**

- Claude proposes 2–8 subtasks with:
  - Title (verb + deliverable)
  - Acceptance criteria (1–2 bullets)
  - Optional dependency note / wave tag
- UI supports:
  - reorder
  - edit title
  - delete
  - add row

**Outputs**

- Create/update project via `POST /api/projects` (already exists)
- Write `brief.md` (via existing project creation path + update path if needed)
- Create child tasks with `parentId`, status `backlog`

**Queue semantics**

- Parent project task is created at Level 2 and can be queued once scoping is accepted.
- Child tasks remain backlog until queued explicitly or via “Queue Wave 1”.

**Acceptance**

- No subtasks are created without explicit user confirmation (matches `meta-goal-breakdown` rule).
- The brief is always discoverable via the task’s Project section (already linked in `ModalSummaryTab`).

---

### Screen D — GSD Onboarding + Guardrails (Level 3)

**When**

- User selects GSD (manual) OR Auto recommends GSD and user proceeds.

**Guardrail check (must)**

- Call `GET /api/gsd/status`.
- If `exists: true`, block new GSD creation.

**Blocked state UI**

Reuse existing conflict panel styling in `TaskCreateInput`, but add clear actions:

- Primary CTA: **Open active GSD** → `/gsd`
- Secondary CTA: **Archive active GSD…** → `/gsd` (archive modal is already implemented there)
- Helper text: “Only one deep build can run at a time because `.planning/` is shared.”

**Allowed state UI**

Show a “GSD setup” panel (can be part of the routing result card flow):

- Copy:
  - “This will create `.planning/` and a phased plan.”
  - “You’ll execute one phase at a time and verify at the end.”
- CTA:
  - Primary: **Start GSD planning**
  - Secondary: **Not now** (creates the task but leaves it in backlog)

**Start GSD planning does**

- Ensures a brief exists (`/api/projects` already creates `brief.md`)
- Triggers the `/gsd:new-project` flow via the task execution mechanism (command/task)
- Navigates user to `/gsd` once planning is detected (poll or SSE)

**Acceptance**

- If there is an active GSD, UI never offers “Start” as the primary action.
- `/gsd` remains the canonical phase workspace (Screen E).

---

### Screen E — Task Drill-down (TaskModal) by level

**Component**: `TaskModal` and `ModalSummaryTab`

**Level 1 — Task**

- Activity (chat)
- Files (outputs)
- Reply input when needed

**Level 2 — Planned project**

- Prominent “Project” card linking `brief.md` (already exists)
- Subtasks section (already exists)
- Add CTA: **Generate breakdown** (invokes routing/decompose and presents a confirmable list)
- Add CTA: **Queue Wave 1** (optional) to queue the minimal set

**Level 3 — GSD**

- Existing CTAs:
  - View Phases (already)
  - Sync Phases (already)
- Add small badge: “Uses `.planning/` slot”
- If `.planning/` is active but task isn’t the active one, show “Open active GSD” link.

**Acceptance**

- Users can understand “where to work”:
  - planned projects: in this modal + brief
  - GSD: `/gsd`

---

## Visual distinctions (tokens and badges)

Use the existing `LEVEL_COLORS` from `TaskCreateInput` for consistent mapping:

- Task: neutral gray
- Planned project: warm peach
- GSD: blue

Apply consistently to:

- task cards on the feed
- routing result card pill
- modal header badge
- filters (if added later)

## Status and state machines (UI-level)

### Creation states

- `draft` (typing)
- `routing` (Auto only; short-lived)
- `scoping` (Planned/GSD onboarding)
- `queued` (task created and queued)
- `blocked` (GSD conflict)

### Project-level states

- `brief_missing` (should be rare; show “Create brief” button)
- `brief_ready`
- `subtasks_missing` (show “Generate breakdown”)
- `subtasks_ready`

### GSD-level states

- `no_planning` (show “Start GSD planning”)
- `planning_active` (show `/gsd`)
- `planning_archived` (show archived location under brief)

## Copy deck (first pass)

### Picker modal title (existing)

- “How structured do you want this?”

### Auto routing card

- Title: “Suggested structure”
- Buttons: “Proceed”, “Change level…”
- Link: “What’s the difference?”

### Planned project scoping

- Step 1: “What does done look like?”
- Step 2: “Any constraints I should respect?”
- Step 3: “Here’s a proposed breakdown — want to adjust anything?”

### GSD blocked

- “Active deep build detected”
- “Only one deep build can run at a time.”
- CTAs: “Open active GSD”, “Archive…”

## Implementation notes (pragmatic)

- Prefer building Screen B by extending `AgentDecisionCard` or creating a sibling `RoutingDecisionCard` that can render:
  - recommended `TaskLevel`
  - reasoning bullets
  - CTAs
- The “Auto” routing can initially be heuristic (client-side) but should converge to a server-backed classifier so the UI matches actual behavior (`meta-goal-breakdown` decision tree).
- Keep everything reversible until the user hits “Proceed” in Auto mode.

