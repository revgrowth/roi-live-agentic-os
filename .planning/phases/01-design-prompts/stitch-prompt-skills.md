# Stitch Prompt: Skills Tab

Paste the following prompt into Google Stitch to generate the Skills tab design.

---

## Prompt

Design a desktop dashboard screen (1440x900 viewport) for the "Skills" tab of the Agentic OS Command Centre -- a local dashboard where non-technical business users browse all installed AI agent skills, understand what each one does, and see which skills are available. The layout is a searchable list/grid of skill cards with expandable detail views. Clean, minimal, professional aesthetic. No dark mode, no gradients, no emojis, no avatars.

### Design Language (inline tokens -- use these exact values)

**Colours:**
- Page background: #FAFBFC
- Card background: #FFFFFF with 1px solid #E5E7EB border, 8px border-radius, 0 1px 2px rgba(0,0,0,0.05) shadow
- Card hover: border #D1D5DB, shadow 0 4px 6px rgba(0,0,0,0.07)
- Sidebar background: #FFFFFF with 1px solid #F3F4F6 right border
- Text primary: #111827
- Text secondary: #4B5563
- Text muted: #9CA3AF
- Accent: #3B82F6; hover: #2563EB
- Active nav tint: #EFF6FF
- Border default: #E5E7EB
- Border light: #F3F4F6

**Category badge colours (tinted backgrounds with matching text):**
- mkt (Marketing): bg #EFF6FF, text #1D4ED8, border #BFDBFE
- str (Strategy): bg #FFFBEB, text #92400E, border #FDE68A
- ops (Operations): bg #F3F4F6, text #4B5563, border #E5E7EB
- viz (Visual): bg #F5F3FF, text #6D28D9, border #DDD6FE
- meta (System): bg #ECFDF5, text #065F46, border #A7F3D0
- tool (Utility): bg #FEF2F2, text #991B1B, border #FECACA

**Typography:**
- Font: Inter, -apple-system, BlinkMacSystemFont, sans-serif
- Page title: 20px, semibold (600), #111827
- Section heading: 16px, semibold (600), #111827
- Card title: 14px, medium (500), #111827
- Body text: 14px, regular (400), #4B5563
- Caption: 12px, regular (400), #9CA3AF
- Badge text: 11px, medium (500)

**Spacing:**
- Sidebar width: 240px
- Page margins: 40px left/right, 32px top
- Card padding: 16px
- Card grid gap: 12px
- Section gap: 24px

**Icons:** Outline-style (Lucide/Heroicons). 18px nav, 16px inline, 48px empty states.

### Layout Architecture

**Fixed left sidebar (240px):**
- Same sidebar as other views
- "Command Centre" title at top
- Navigation items:
  - Board (layout-kanban icon)
  - Cron Jobs (clock icon)
  - Context (file-text icon)
  - Brand (palette icon)
  - Skills (zap icon) -- ACTIVE: #EFF6FF background, #3B82F6 text, 2px left border #3B82F6
- Section divider and client switcher dropdown at bottom showing "Root"

**Page header:**
- Title: "Skills" in 20px semibold #111827
- Subtitle: "Installed capabilities that power your agents" in 14px regular #9CA3AF
- Right side of header: skill count "8 skills installed" in 14px regular #9CA3AF
- 24px bottom margin

**Search and filter bar:**
- Search input: full width, #FFFFFF background, 1px solid #E5E7EB border, 6px border-radius, 8px 12px padding, 14px regular text
  - Placeholder: "Search skills..." in #9CA3AF
  - Search icon (16px, #9CA3AF) inside the input on the left
  - On focus: border #3B82F6, ring 0 0 0 3px rgba(59,130,246,0.1)
- Filter row below search (8px gap): horizontal row of category filter pills
  - "All" pill (active by default): #EFF6FF background, #3B82F6 text, 1px solid #BFDBFE border
  - Category pills: "Marketing", "Strategy", "Visual", "System", "Utility" -- #FFFFFF background, #4B5563 text, 1px solid #E5E7EB border
  - Each pill: 11px medium text, 4px 12px padding, 16px border-radius (fully rounded)
  - Hover: #F9FAFB background
  - Active: matching category tint colour as background
- 16px gap below filter row before the grid

**Skills card grid (2-column layout):**
- Cards arranged in 2 columns with 12px gap
- Each card represents one installed skill

**Skill card design (collapsed state):**
- #FFFFFF background, 1px solid #E5E7EB border, 8px border-radius, 16px padding
- Shadow: 0 1px 2px rgba(0,0,0,0.05)
- Hover: border #D1D5DB, shadow 0 4px 6px rgba(0,0,0,0.07), cursor pointer
- **Top row:** Category badge (pill with category colour) + skill name in 14px medium #111827
  - Example: [mkt] badge then "Brand Voice" as the name
- **Second row (4px gap):** Trigger description in 13px regular #9CA3AF, truncated to 2 lines
  - Example: "Triggers on: tone, writing style, brand voice, how we sound"
- **Third row (8px gap):** metadata in 12px #9CA3AF:
  - Dependency count: link icon (12px) + "2 dependencies" or "No dependencies"
  - Writes to: folder icon (12px) + "brand_context/"
- Expand chevron (chevron-down, 16px, #9CA3AF) at the right side of the card, vertically centred

**Skill card design (expanded state -- one card shown expanded):**
- Card border becomes 1px solid #D1D5DB (slightly darker)
- Chevron rotates to point up
- Expanded content below the collapsed content, separated by 1px solid #F3F4F6 and 12px padding top:

**Expanded detail sections:**

1. **Triggers** -- heading in 12px medium uppercase #9CA3AF
   - List of trigger phrases as small tags: each phrase in 12px regular #4B5563, #F3F4F6 background, 4px 8px padding, 4px border-radius
   - Example tags: "tone", "writing style", "brand voice", "how we sound"

2. **Dependencies** -- heading in 12px medium uppercase #9CA3AF
   - Table or list of dependencies:
     - Dependency name as a small badge + Required/Optional status
     - "What it provides" text in 12px #9CA3AF
   - If no dependencies: "None -- this skill works independently" in 12px #9CA3AF

3. **Context needs** -- heading in 12px medium uppercase #9CA3AF
   - Which brand_context files this skill reads: listed as small file badges
   - Example: "Reads: positioning (summary), icp (--)" in 12px #9CA3AF

4. **Output** -- heading in 12px medium uppercase #9CA3AF
   - "Writes to: brand_context/voice-profile.md, brand_context/samples.md" in 12px #9CA3AF

### Realistic Content (populate with these skills)

| Skill | Category | Triggers | Dependencies | Writes To |
|-------|----------|----------|--------------|-----------|
| Brand Voice | mkt | tone, writing style, brand voice | None | brand_context/voice-profile.md |
| Positioning | mkt | differentiation, angle, hooks, USP | None | brand_context/positioning.md |
| ICP | mkt | target audience, buyer persona, ideal customer | None | brand_context/icp.md |
| AI SEO | str | AI SEO, AEO, answer engine optimization | None | projects/str-ai-seo/ |
| Stitch Design | viz | design a UI, create a screen, UI mockup | tool-stitch (Required) | projects/viz-stitch-design/ |
| Skill Creator | meta | create a skill, build a skill, new skill | None | .claude/skills/ |
| Wrap Up | meta | wrap up, close session, end session | None | context/memory/ |
| Stitch Tool | tool | fetch stitch design, get stitch screens | None | projects/tool-stitch/ |

Show 6 cards visible in the grid (2x3), with the "Brand Voice" card expanded to show full detail. The remaining 2 cards are below the fold.

---

## State Variants

### Empty State
The card grid is replaced with a centred empty state:
- Outline zap icon, 48px, #9CA3AF
- Heading: "No skills installed" in 16px semibold #111827
- Description: "Skills give your agents specialised capabilities. Install your first skill to get started." in 14px regular #9CA3AF, max-width 320px, centred
- Primary button: "Browse Skills" -- #3B82F6 background, #FFFFFF text

### Loading State
- Search bar visible but disabled
- Six skeleton cards in a 2x3 grid: each card is a white rectangle with 3 shimmer blocks (badge+title line 200x16px, description area 100%x32px, metadata line 160x12px). Skeleton colour #E5E7EB, left-to-right shimmer, 1.5s infinite.

### Completed State (Normal)
- All skills displayed as described above
- Search functional, category filters active
- One card expanded showing full detail
- Skill count accurate in header

### Error State
- Skills directory not found:
  - Error block centred in content area: #FEF2F2 background, 1px solid #FCA5A5 border, 8px border-radius, 16px padding
  - Alert-circle icon (20px, #EF4444) + "Skills directory not found" in 14px medium #EF4444
  - Description: "Could not read the skills directory. Check that your Agentic OS project path is configured correctly." in 14px regular #4B5563
  - "Retry" secondary button

Design constraints: No emojis. No dark mode. No gradients. No heavy shadows. The skills grid should feel like an app store or plugin directory -- clean cards with enough information to understand each skill at a glance, with expandable detail for the full picture.
