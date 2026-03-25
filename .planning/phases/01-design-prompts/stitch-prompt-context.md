# Stitch Prompt: Context Tab

Paste the following prompt into Google Stitch to generate the Context tab design.

---

## Prompt

Design a desktop dashboard screen (1440x900 viewport) for the "Context" tab of the Agentic OS Command Centre -- a local dashboard where non-technical business users browse and edit the memory and context files that power their AI agents. The layout is a file browser on the left and a content viewer/editor on the right. Clean, minimal, professional aesthetic. No dark mode, no gradients, no emojis, no avatars, no decorative elements.

### Design Language (inline tokens -- use these exact values)

**Colours:**
- Page background: #FAFBFC
- Card/panel background: #FFFFFF
- Sidebar background: #FFFFFF with 1px solid #F3F4F6 right border
- File tree panel background: #FFFFFF with 1px solid #E5E7EB right border
- Text primary: #111827 (headings, file names)
- Text secondary: #4B5563 (body, content)
- Text muted: #9CA3AF (metadata, dates, paths)
- Accent: #3B82F6 (active file, selected state, links); hover: #2563EB
- Active nav tint: #EFF6FF
- Border default: #E5E7EB
- Border light: #F3F4F6
- Success: #10B981 (save confirmation)
- Error: #EF4444 (file errors)

**Typography:**
- Font: Inter, -apple-system, BlinkMacSystemFont, sans-serif
- Monospace: JetBrains Mono for file paths, raw markdown editor
- Page title: 20px, semibold (600), #111827
- Section heading: 16px, semibold (600), #111827
- File name: 14px, medium (500), #111827
- Body text: 14px, regular (400), #4B5563
- Caption: 12px, regular (400), #9CA3AF
- Badge text: 11px, medium (500)

**Spacing:**
- Sidebar width: 240px
- File tree panel width: 260px
- Page margins: 40px left/right, 32px top
- Card padding: 16px
- Section gap: 24px

**Icons:** Outline-style (Lucide/Heroicons). 18px nav, 16px inline, 48px empty states.

### Layout Architecture

**Fixed left sidebar (240px):**
- Same sidebar as other views for consistency
- "Command Centre" title at top (16px semibold, outline icon)
- Navigation items:
  - Board (layout-kanban icon)
  - Cron Jobs (clock icon)
  - Context (file-text icon) -- ACTIVE: #EFF6FF background, #3B82F6 text, 2px left border #3B82F6
  - Brand (palette icon)
  - Skills (zap icon)
- Each nav item: 36px height, 8px 16px padding, 14px regular, #4B5563, 6px border-radius
- Section divider and client switcher dropdown at bottom showing "Root"

**Page header (top of content area):**
- Title: "Context" in 20px semibold #111827
- Subtitle below: "Memory, personality, and preferences that power your agents" in 14px regular #9CA3AF
- 24px bottom margin

**Two-panel layout below the header:**

**Left panel -- File Tree (260px wide):**
- #FFFFFF background with 1px solid #E5E7EB right border
- 16px padding
- Tree structure with folder expand/collapse (chevron-right icons that rotate 90 degrees when open):

```
context/
  memory/
    2026-03-25.md
    2026-03-24.md
    2026-03-23.md
    2026-03-22.md
  SOUL.md
  USER.md
  learnings.md
```

- Folder items: folder icon (16px, #9CA3AF) + folder name in 14px medium #111827, 8px left indent per nesting level
- File items: file-text icon (16px, #9CA3AF) + file name in 14px regular #4B5563, 8px additional indent from parent
- Selected file: #EFF6FF background on the row, #3B82F6 text, 2px left border #3B82F6
- Hover state on rows: #F9FAFB background
- Row height: 32px
- Last modified date shown to the right of each file name: "2m ago" in 12px #9CA3AF, right-aligned

**Right panel -- Content Viewer/Editor (fills remaining width):**
- #FFFFFF background, 24px padding
- Top bar within the content panel:
  - File name: "SOUL.md" in 16px semibold #111827
  - File path below: "context/SOUL.md" in 12px JetBrains Mono #9CA3AF
  - Right side: Toggle between "Preview" and "Edit" modes -- two buttons in a button group:
    - Active mode button: #EFF6FF background, #3B82F6 text
    - Inactive mode button: #FFFFFF background, #4B5563 text, 1px #E5E7EB border
    - Button group: 1px #E5E7EB border, 6px border-radius, shared border between buttons
  - 16px bottom padding, 1px solid #E5E7EB bottom border

**Preview mode (default):**
- Rendered markdown content area with proper heading hierarchy, paragraph spacing, bullet lists
- Headings: 16px semibold #111827
- Body: 14px regular #4B5563, line-height 24px
- Lists: proper indent, bullet points
- Code blocks: #F3F4F6 background, 8px padding, 6px border-radius, JetBrains Mono 13px
- Max content width: 720px for readability

**Edit mode:**
- Raw markdown in a textarea/code editor area
- JetBrains Mono font, 13px, #4B5563 text, line-height 20px
- #FFFFFF background with 1px #E5E7EB border, 8px padding
- Full height of the content area (min-height 400px)
- Save button appears: primary button "Save" (#3B82F6) at the top-right of the content panel, next to the mode toggle
- Cancel button: secondary button "Cancel" (#FFFFFF bg, #4B5563 text, #E5E7EB border)

### Realistic Content

**File tree -- selected file: SOUL.md**

Preview mode showing rendered markdown:

```
# Agent Personality

## Who I Am
I'm your strategic business partner -- not just an AI assistant. I think in terms of outcomes,
revenue impact, and competitive advantage.

## How I Communicate
- Direct and concise -- no fluff, no filler
- Business language, not tech jargon
- I ask clarifying questions before diving in
- I push back when something won't work

## What I Value
- Speed over perfection (ship it, then refine)
- Data-informed decisions
- Clear ownership of deliverables
```

**Memory files in tree:**
- 2026-03-25.md -- "2m ago"
- 2026-03-24.md -- "1d ago"
- 2026-03-23.md -- "2d ago"
- 2026-03-22.md -- "3d ago"

---

## State Variants

### Empty State
The file tree panel is empty. Centred in the content area:
- Outline file-text icon, 48px, #9CA3AF
- Heading: "No context files found" in 16px semibold #111827
- Description: "Connect your Agentic OS project directory to browse context, memory, and personality files." in 14px regular #9CA3AF, max-width 320px, centred
- Primary button: "Set Project Path" -- #3B82F6 background, #FFFFFF text

### Loading State
- File tree panel: 6 skeleton rows (shimmer-animated rectangles, 180x16px, staggered widths to simulate tree indent). Skeleton colour #E5E7EB, left-to-right shimmer, 1.5s infinite.
- Content area: 4 skeleton text blocks of varying widths (720px max, 200px, 500px, 350px heights of 16px) with shimmer animation

### Completed State (Normal)
- File tree populated with all files as described above
- Selected file content rendered in preview mode
- "Last saved: 2 minutes ago" caption below the file path in 12px #9CA3AF
- Green checkmark appears briefly next to "Saved" text after a save operation (#10B981)

### Error State
- File read error:
  - Content area shows error block: #FEF2F2 background, 1px solid #FCA5A5 border, 8px border-radius, 16px padding
  - Alert-circle icon (20px, #EF4444) + "Unable to read file" in 14px medium #EF4444
  - Description: "The file context/SOUL.md could not be read. Check that the project path is correct and the file exists." in 14px regular #4B5563
  - "Retry" secondary button below
- Path not found error:
  - Same error block pattern but in the file tree area
  - "Project directory not found" heading
  - "Set Project Path" primary button

Design constraints: No emojis. No dark mode. No gradients. No heavy shadows. The file browser should feel like VS Code's explorer panel but simpler and lighter -- optimised for reading and light editing of markdown files, not full code editing.
