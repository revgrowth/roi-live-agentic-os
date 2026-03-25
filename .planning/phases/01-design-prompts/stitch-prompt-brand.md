# Stitch Prompt: Brand Tab

Paste the following prompt into Google Stitch to generate the Brand tab design.

---

## Prompt

Design a desktop dashboard screen (1440x900 viewport) for the "Brand" tab of the Agentic OS Command Centre -- a local dashboard where non-technical business users browse and edit the brand context files that define their AI agents' voice, positioning, and audience understanding. The layout shows brand files as a card grid with a content viewer/editor for the selected file. Clean, minimal, professional aesthetic. No dark mode, no gradients, no emojis, no avatars.

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
- Success: #10B981
- Error: #EF4444

**Typography:**
- Font: Inter, -apple-system, BlinkMacSystemFont, sans-serif
- Monospace: JetBrains Mono for file paths
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
- Card grid gap: 16px
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
  - Brand (palette icon) -- ACTIVE: #EFF6FF background, #3B82F6 text, 2px left border #3B82F6
  - Skills (zap icon)
- Section divider and client switcher dropdown at bottom showing "Root"

**Page header:**
- Title: "Brand" in 20px semibold #111827
- Subtitle: "Voice, positioning, audience, and style guides for your agents" in 14px regular #9CA3AF
- 24px bottom margin

**Brand file card grid (2x2 grid layout):**
- Four cards arranged in a 2-column grid with 16px gap
- Each card represents one brand context file

**Brand file card design:**
- #FFFFFF background, 1px solid #E5E7EB border, 8px border-radius, 16px padding
- Shadow: 0 1px 2px rgba(0,0,0,0.05)
- Hover: border #D1D5DB, shadow 0 4px 6px rgba(0,0,0,0.07), cursor pointer
- Top row: file icon (16px, category-specific colour) + file name in 14px medium #111827
- Second row: last modified date "Updated 2 hours ago" in 12px #9CA3AF
- Content preview: 3-4 lines of the file content in 13px regular #9CA3AF, with overflow hidden and a fade-to-white gradient at the bottom (mask-image linear-gradient)
- Card min-height: 140px
- Selected card: 2px solid #3B82F6 border (replacing the #E5E7EB border), #EFF6FF very subtle background tint

**Four brand file cards:**

1. **Voice Profile** (megaphone icon, #3B82F6)
   - File: voice-profile.md
   - Updated: "2 hours ago"
   - Preview: "Tone: Direct, confident, no-nonsense. We speak like a trusted advisor who's been in the trenches -- not an AI assistant reading a script..."

2. **Positioning** (target icon, #F59E0B)
   - File: positioning.md
   - Updated: "3 days ago"
   - Preview: "Core angle: The only AI business system that actually replaces the team you can't afford to hire. Not a chatbot. Not a copilot..."

3. **Ideal Customer Profile** (users icon, #10B981)
   - File: icp.md
   - Updated: "1 week ago"
   - Preview: "Primary: Solo business owners, 1-5 person teams, revenue $50K-$500K. They know AI is important but feel overwhelmed by the options..."

4. **Writing Samples** (file-text icon, #8B5CF6)
   - File: samples.md
   - Updated: "2 hours ago"
   - Preview: "Reference: LinkedIn post from Feb 2026 -- 'The problem with most AI tools is they make you work harder, not smarter. Here's what changed...'"

**Content viewer/editor (below the card grid or as a slide-out panel):**

When a card is clicked, a slide-out panel opens from the right (480px wide):
- #FFFFFF background, -4px 0 16px rgba(0,0,0,0.08) shadow
- rgba(0,0,0,0.4) overlay on the rest of the page
- Panel header (56px): file name "Voice Profile" in 16px semibold, file path "brand_context/voice-profile.md" in 12px JetBrains Mono #9CA3AF below. Close X button (ghost style) top-right.
- Mode toggle: "Preview" / "Edit" button group (same as Context tab)
- Content area with same rendering rules as Context tab:
  - Preview: rendered markdown, max-width respects panel width
  - Edit: raw markdown textarea in JetBrains Mono, Save/Cancel buttons
- 1px #E5E7EB border top below header

---

## State Variants

### Empty State
The card grid area is replaced with a centred empty state:
- Outline palette icon, 48px, #9CA3AF
- Heading: "No brand context yet" in 16px semibold #111827
- Description: "Build your brand voice, positioning, and audience profiles to give your agents the context they need. Run the brand voice skill to get started." in 14px regular #9CA3AF, max-width 360px, centred
- Primary button: "Build Brand Voice" -- #3B82F6 background, #FFFFFF text

### Loading State
- Four skeleton cards in a 2x2 grid: each card is a white rectangle (matching card dimensions) with 3 shimmer-animated blocks inside (title line 180x16px, date line 120x12px, preview area 100% x 48px). Skeleton colour #E5E7EB, left-to-right shimmer, 1.5s infinite.

### Completed State (Normal)
- All four cards populated with content previews as described
- Selected card has blue border highlight
- Slide-out panel showing full content of the selected file
- "Last saved: 5 minutes ago" in 12px #9CA3AF below the file path in the panel

### Error State
- Card shows error state if file can't be read:
  - Card border becomes 1px solid #FCA5A5
  - Card background: #FEF2F2
  - Alert-circle icon (16px, #EF4444) replaces the file icon
  - Preview text replaced with: "Unable to read this file" in 13px #EF4444
  - Retry link below: "Retry" in 13px #3B82F6 underlined

Design constraints: No emojis. No dark mode. No gradients. No heavy shadows. The card grid should feel like a clean dashboard overview -- each card gives just enough preview to understand the file's content, with full access via the slide-out panel.
