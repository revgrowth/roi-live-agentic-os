# Stitch Prompt: Client Switcher

Paste the following prompt into Google Stitch to generate the Client Switcher component design.

---

## Prompt

Design a UI component detail screen (1440x900 viewport) showing the Client Switcher dropdown for the Agentic OS Command Centre -- a local dashboard where non-technical business users manage AI agent workflows across multiple clients. The client switcher lives in the left sidebar navigation and allows users to scope all dashboard views to a specific client's workspace. This is a COMPONENT design, not a full page -- show the sidebar with the dropdown in multiple states. Clean, minimal, professional aesthetic. No dark mode, no gradients, no emojis, no avatars.

### Design Language (inline tokens -- use these exact values)

**Colours:**
- Page background: #FAFBFC
- Sidebar background: #FFFFFF with 1px solid #F3F4F6 right border
- Dropdown background: #FFFFFF
- Dropdown shadow: 0 4px 12px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)
- Text primary: #111827
- Text secondary: #4B5563
- Text muted: #9CA3AF
- Accent: #3B82F6; hover: #2563EB
- Active item tint: #EFF6FF
- Border default: #E5E7EB
- Border light: #F3F4F6
- Success dot: #10B981
- Error: #EF4444

**Typography:**
- Font: Inter, -apple-system, BlinkMacSystemFont, sans-serif
- Switcher label: 12px, medium (500), uppercase, #9CA3AF
- Client name (selected): 14px, medium (500), #111827
- Client name (dropdown option): 14px, regular (400), #4B5563
- Client path: 12px, regular (400), #9CA3AF

**Spacing:**
- Sidebar width: 240px
- Dropdown width: 224px (sidebar width minus 16px padding)
- Dropdown item height: 40px
- Dropdown item padding: 8px 12px
- Dropdown border-radius: 8px
- Dropdown max-height: 280px (scrollable)

**Icons:** Outline-style (Lucide/Heroicons). 16px inline.

### Component Architecture

**Client switcher placement in sidebar:**
- Located at the bottom of the sidebar, above the bottom edge
- Separated from navigation items by a 1px solid #F3F4F6 horizontal divider with 16px vertical margin
- Section label above: "WORKSPACE" in 12px medium uppercase #9CA3AF, 16px left padding

**Switcher trigger button (closed state):**
- Full width of sidebar content area (208px, accounting for 16px padding each side)
- 40px height, 8px 12px padding
- Left: small coloured dot (8px circle, #3B82F6 for Root, unique colours for clients) + client name in 14px medium #111827
- Right: chevron-down icon (16px, #9CA3AF)
- Background: transparent
- Hover: #F9FAFB background, 6px border-radius
- Border: 1px solid transparent; hover: 1px solid #E5E7EB

**Dropdown menu (open state):**
- Appears ABOVE the trigger button (dropdown opens upward since the switcher is at the bottom of the sidebar)
- #FFFFFF background, 1px solid #E5E7EB border, 8px border-radius
- Shadow: 0 4px 12px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)
- Width: 224px
- Max-height: 280px with vertical scroll if more than 6 clients
- 4px padding inside the dropdown

**Dropdown items:**
- Each item: 40px height, 8px 12px padding, 6px border-radius
- Left: coloured dot (8px circle) + name in 14px regular #4B5563
- Below name (same line, right-aligned): client folder path "clients/abc-corp/" in 12px #9CA3AF
- Hover: #F9FAFB background
- Active/selected item: #EFF6FF background, #3B82F6 text, checkmark icon (16px, #3B82F6) on the right

**Dropdown header (first item, sticky):**
- "Root" with a globe icon (16px, #9CA3AF) instead of a coloured dot
- Description: "All clients" in 12px #9CA3AF
- Separated from client list by 1px solid #F3F4F6 divider and 4px margin

**Client scope indicator (in main content area):**
- When a non-Root client is selected, a thin scope bar appears at the very top of the content area (above the stats bar):
  - 32px height, #EFF6FF background, 1px solid #BFDBFE bottom border
  - Left: "Viewing: ABC Corp" in 12px medium #1D4ED8
  - Right: "Switch to Root" link in 12px #3B82F6 underlined, hover: #2563EB
  - This bar is NOT shown when "Root" is selected

### Realistic Content

**Dropdown items (show these clients):**

1. **Root** (globe icon, no coloured dot)
   - "All clients" subtitle
   - Selected by default

2. **ABC Corp** (dot colour: #3B82F6)
   - Path: clients/abc-corp/

3. **Bright Digital** (dot colour: #10B981)
   - Path: clients/bright-digital/

4. **Peak Fitness Co** (dot colour: #F59E0B)
   - Path: clients/peak-fitness-co/

5. **Sunset Retreats** (dot colour: #8B5CF6)
   - Path: clients/sunset-retreats/

### Show These States on the Same Screen

Arrange 4 instances of the sidebar side-by-side (or in a 2x2 grid) to show all states clearly labelled:

**State 1 -- Closed (Root selected):**
- Trigger button shows: blue dot + "Root" + chevron-down
- No scope bar in content area

**State 2 -- Open (dropdown visible):**
- Dropdown menu open above the trigger
- "Root" is the selected item (checkmark visible)
- All 4 clients listed below
- Hover state shown on "ABC Corp" row (#F9FAFB background)

**State 3 -- Client selected (ABC Corp):**
- Trigger button shows: blue dot + "ABC Corp" + chevron-down
- Dropdown closed
- Scope bar visible at top of content area: "Viewing: ABC Corp" with "Switch to Root" link

**State 4 -- Loading clients:**
- Trigger button shows: small spinner (12px, #9CA3AF) replacing the chevron
- "Loading..." in 14px #9CA3AF replacing client name
- Dropdown not visible

### Additional States

**Empty State (no clients configured):**
- Trigger button shows: globe icon + "Root" + no chevron (not clickable since there's nothing to switch to)
- The section label reads "WORKSPACE" but the dropdown is replaced with static text "Root" in 14px regular #9CA3AF
- No dropdown functionality -- the switcher is inert

**Error State (clients directory not accessible):**
- Trigger button shows: alert-circle icon (16px, #EF4444) + "Error loading clients" in 14px #EF4444
- If dropdown is opened: single item showing "Could not read clients directory" in 13px #EF4444 with #FEF2F2 background
- "Root" option still available as fallback

Design constraints: No emojis. No dark mode. No gradients. The dropdown should feel native to the sidebar -- not a floating dialog. It should be as simple as switching a Slack workspace or Notion workspace. The component states should be shown side-by-side for comparison so Stitch generates all variants on one screen.
