# Google Stitch Prompting Best Practices

Research findings on writing effective prompts for Google Stitch (stitch.withgoogle.com) -- the AI-powered UI design tool that generates high-fidelity screens from text descriptions.

## How Stitch Works

Google Stitch uses Gemini models (2.5 Pro for quality, 2.5 Flash for speed) to generate complete UI screens from text prompts. It outputs interactive HTML/CSS that can be exported via MCP. The key insight: Stitch is not a wireframing tool -- it generates production-quality visual designs with real styling, so prompts should describe the final desired result, not an abstract layout.

## Prompt Structure: The Five-Layer Pattern

Effective Stitch prompts follow a consistent structure. Each layer adds specificity.

### Layer 1: Screen Identity
State what the screen IS and its purpose in one sentence.

**Good:** "A local dashboard for managing AI agent tasks, designed for non-technical business users."
**Bad:** "A dashboard." or "Build me a Kanban board."

### Layer 2: Layout Architecture
Describe the spatial arrangement -- what goes where, how sections relate.

**Good:** "Fixed left sidebar (240px) with navigation items. Top bar spans the content area with a stats summary. Main content area below the top bar contains five equal-width columns arranged horizontally."
**Bad:** "Has a sidebar and main area."

Key patterns:
- Use directional language: "left sidebar", "top bar", "main content below"
- Specify widths where they matter (sidebar, panels)
- Describe containment: "within the sidebar", "below the header"
- Reference grid/column counts for repeating elements

### Layer 3: Component Inventory
List every visible UI element with enough detail to render it.

**Good:** "Each column contains a header with the column name in medium-weight text and a count badge showing the number of cards. Below the header, cards stack vertically with 8px gaps. Each card shows: task title (14px, semibold), a coloured level badge (Task/Project/GSD), a skill name in muted text, and a timestamp."
**Bad:** "Columns with cards in them."

Component description checklist:
- What text appears (labels, values, placeholders)
- Relative sizing (large heading, small caption, etc.)
- Interactive indicators (buttons, links, dropdowns)
- Visual weight (bold titles, muted metadata)
- Grouping (what's on the same line, what stacks)

### Layer 4: Visual Direction
Specify colours, typography, and overall aesthetic feel.

**Good:** "Clean, light theme. White (#FFFFFF) page background. Cards use #FAFAFA backgrounds with a subtle 1px #E5E7EB border. Text hierarchy: #111827 for titles, #6B7280 for metadata. Accent colour #3B82F6 for active states. Font: Inter or system sans-serif. No decorative elements, no gradients, no shadows heavier than 0 1px 2px rgba(0,0,0,0.05)."
**Bad:** "Make it look modern and clean."

Specificity matters:
- Hex values over colour names ("not blue, but #3B82F6")
- Exact border styles ("1px solid #E5E7EB" not "thin border")
- Shadow values ("0 1px 3px rgba(0,0,0,0.1)" not "subtle shadow")
- Font family and weights, not just "sans-serif"

### Layer 5: States and Content
Describe what data appears on screen -- use realistic content, not lorem ipsum.

**Good:** "The Running column has 2 cards: one titled 'Write Q2 newsletter draft' with a Task badge and skill label 'mkt-brand-voice', another titled 'Competitor pricing analysis' with a Project badge showing '3/5 subtasks complete'. The Done column has 4 cards with green checkmarks."
**Bad:** "Show some cards in the columns."

## Seven Actionable Prompting Patterns

### Pattern 1: Reference-Grounded Aesthetic
Describe the visual feel by referencing known design aesthetics, then override specifics.

**Template:** "Inspired by [reference] -- specifically its [specific quality]. But with [key difference]."
**Example:** "Inspired by Linear's interface density and Notion's content-first layout. But with a lighter colour palette (white backgrounds, no dark mode) and larger card sizes for scannability."

### Pattern 2: Exhaustive Component Enumeration
List every component type that appears, with its variants.

**Template:** "Components on this screen: [type 1] with [variant a, variant b]; [type 2] showing [detail]; [type 3] in [state]."
**Example:** "Components: navigation items (icon + label, active state has blue left border indicator); stat cards (large number, small label below, one per metric); Kanban columns (header with name + count, scrollable card area); task cards (title, level badge, skill label, timestamp)."

### Pattern 3: Realistic Data Population
Use real-looking content that matches the domain.

**Template:** Provide 3-5 realistic examples for each data-driven element.
**Example:** "Task titles: 'Draft LinkedIn carousel for product launch', 'Weekly competitor price scan', 'Generate Q2 content calendar'. Skill labels: 'mkt-brand-voice', 'str-competitor-analysis', 'mkt-content-calendar'."

### Pattern 4: State-Specific Screens
Generate separate screens for different application states rather than trying to show everything in one prompt.

**Template:** "Show this screen in [state] state: [description of what's visible/hidden in that state]."
**Example:** "Show this screen in the empty state: the Kanban columns exist but contain no cards. A centred message in the main area reads 'No tasks yet -- describe what you need done' with a text input field below it."

### Pattern 5: Constraint-First Design
Start with what the design must NOT do, then describe what it should.

**Template:** "Design constraints: No [X], no [Y], no [Z]. The screen should [positive description]."
**Example:** "Design constraints: No emojis anywhere in the UI. No dark mode. No rounded avatars or user profile images. No gradients. The interface should feel like a clean spreadsheet tool that happens to be beautiful."

### Pattern 6: Hierarchical Spacing Description
Describe spacing relationships rather than absolute pixel values.

**Template:** "Spacing hierarchy: [tightest] between [elements], [medium] between [groups], [largest] between [sections]."
**Example:** "Spacing: 4px between a card's title and its metadata line. 8px between cards in a column. 16px padding inside each card. 24px gap between columns. 32px page margin."

### Pattern 7: Colour-as-Status Mapping
Explicitly map colours to meanings.

**Template:** "Colour meanings: [colour 1] = [meaning], [colour 2] = [meaning]."
**Example:** "Status colours: #E5E7EB (queued/neutral), #3B82F6 (running/active), #F59E0B (review/needs attention), #10B981 (done/success), #EF4444 (error/failed). These appear as left-border accents on cards and as badge background colours."

## Common Pitfalls

### Pitfall 1: Vague aesthetic direction
"Make it look modern" produces inconsistent results. Always provide hex values, specific font choices, and concrete styling parameters.

### Pitfall 2: Omitting empty/edge states
If you only describe the "full" state, Stitch has no guidance for empty columns, loading indicators, or error messages. Prompt for each state separately or include state descriptions inline.

### Pitfall 3: Ignoring responsive behaviour
Stitch generates a single viewport by default. If responsive matters, specify: "Desktop viewport (1440px wide). Sidebar collapses to icon-only below 1024px."

### Pitfall 4: Too many competing elements
Prompting for every feature in a single screen produces cluttered results. Focus on one primary view and its key components. Secondary features (modals, slide-outs, tooltips) should be separate prompts.

### Pitfall 5: Generic content
"Lorem ipsum" or "Item 1, Item 2" produces generic-looking designs. Real content helps Stitch make better typographic and layout decisions because it understands content density.

### Pitfall 6: Forgetting interactive states
Buttons need hover states, inputs need focus states, cards may need selected states. Mention these explicitly: "On hover, cards lift with a 0 4px 6px shadow and the border colour changes to #D1D5DB."

### Pitfall 7: No visual hierarchy guidance
If everything is the same size and weight, the design looks flat. Explicitly state: "The stats bar numbers are 24px semibold. Card titles are 14px medium. Metadata is 12px regular in #9CA3AF."

## Prompt Length Guidelines

- **Minimum effective prompt:** 150-200 words (covers layers 1-3)
- **Optimal prompt:** 300-500 words (all five layers with good specificity)
- **Diminishing returns:** Beyond 600 words, split into multiple screens/prompts
- **Multiple prompts per view:** Better to generate the base layout first, then iterate with refinement prompts, than to try to specify everything upfront

## Iteration Strategy

Stitch supports iterative refinement within a project:

1. **Base prompt** -- establish the overall layout and visual direction
2. **Refinement prompts** -- adjust specific areas: "Make the sidebar narrower", "Change the card border radius to 8px", "Add a stats bar above the columns"
3. **State variants** -- generate additional screens showing empty, loading, and error states
4. **Component isolation** -- if a specific component (like the task detail panel) needs more detail, generate it as a standalone screen

## Key Takeaway for Plan 01-02

When crafting prompts for each Command Centre view, each prompt should:
1. Start with screen identity and purpose
2. Describe the complete layout architecture
3. Enumerate every visible component with detail
4. Include the shared design language tokens (colours, typography, spacing) from `design-language.md`
5. Use realistic Command Centre content (real task titles, skill names, status labels)
6. Specify one primary state per prompt, with separate prompts for alternate states
7. Include interactive state descriptions (hover, focus, active) for key elements
