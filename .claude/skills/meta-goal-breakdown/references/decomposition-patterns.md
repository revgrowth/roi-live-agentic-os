# Decomposition Patterns

Reference material for breaking goals into subtasks. Drawn from GSD framework planning methodology, adapted for goal-level breakdown.

## The Wave Model

Waves determine execution order. Every subtask belongs to exactly one wave.

**Wave 1 — Foundation:**
- Infrastructure, setup, scaffolding
- Research or discovery that other tasks depend on
- Schema/data model decisions that downstream tasks build on
- Always sequential within the wave

**Wave 2+ — Parallel execution:**
- Each task only depends on completed waves, not sibling tasks
- Same-wave tasks can run simultaneously without conflicts
- If two tasks touch the same files, they cannot be in the same wave

**Example:**
```
Goal: "Launch a product email campaign"

Wave 1: Research competitors' email sequences (foundation)
Wave 2: Write the 3-email sequence (depends on research)
Wave 2: Design email templates (parallel — no dependency on copy)
Wave 3: Set up automation in email tool (depends on both copy + templates)
```

## Acceptance Criteria Patterns

Good acceptance criteria are **observable truths** — statements that can be verified by looking at the output.

**Strong criteria:**
- "Landing page loads at /launch with headline, CTA, and pricing section"
- "Email sequence has 3 emails, each under 200 words, with clear CTA"
- "API endpoint returns 200 with correct JSON schema"

**Weak criteria (avoid):**
- "Landing page looks good" (subjective)
- "Emails are well-written" (unmeasurable)
- "API works" (too vague)

**Pattern:** [Subject] + [observable state] + [specific detail]

## Dependency Types

Not all dependencies are the same. Classify to determine wave placement:

1. **Hard dependency:** Cannot start until blocker completes (research → writing)
2. **Soft dependency:** Could start early but benefits from waiting (design → implementation — could prototype first)
3. **Resource dependency:** Same person/tool needed (two tasks needing the same API key setup)

Only hard dependencies affect wave placement. Soft dependencies are noted but don't block.

## Decomposition Heuristics

### The Deliverable Test
"Can I hand this subtask to someone and they'd know exactly what to produce?"
If no → too vague, break it down further or add acceptance criteria.

### The Independence Test
"If I removed this subtask, would the others still make sense?"
If no → it might be part of another subtask, not its own.

### The Scope Test
"Can this subtask be completed in a single focused session?"
If no → it's probably two subtasks bundled together.

### The 8-Task Ceiling
More than 8 subtasks signals the goal is really a project. Suggest Level 2 scoping with a brief instead of a flat subtask list.

## Common Goal Patterns

### Campaign Launch
Typical wave structure:
1. Research/strategy (Wave 1)
2. Content creation — copy, visuals, assets (Wave 2, parallel)
3. Assembly — putting pieces together (Wave 3)
4. Review/QA (Wave 4)

### Technical Build
Typical wave structure:
1. Schema/data model + API design (Wave 1)
2. Backend implementation + Frontend scaffolding (Wave 2, parallel)
3. Integration + wiring (Wave 3)
4. Testing + polish (Wave 4)

### Content Series
Typical wave structure:
1. Topic research + outline (Wave 1)
2. Individual pieces (Wave 2, all parallel)
3. Cross-linking + consistency pass (Wave 3)

## Requirements Quiz Strategy

The goal is minimum viable clarity — enough to decompose confidently, no more.

**Always ask:**
- Definition of done (what proves the goal is achieved)
- Out of scope (what NOT to do)

**Ask if ambiguous:**
- Priority ordering (which half ships first)
- Hard constraints (deadlines, tools, budget)

**Ask if complex:**
- Existing work to build on
- External dependencies or blockers

**Never ask:**
- Implementation details (that's the subtask's job)
- Preferences that can be decided during execution
- Questions the user already answered in the goal description
