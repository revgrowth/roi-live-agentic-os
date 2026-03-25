# Design Reference Analysis

Analysis of four design references for the Agentic OS Command Centre. Each reference contributes specific patterns -- no single reference is the complete target aesthetic.

---

## 1. Vibe Kanban (vibekanban.com)

**Role:** Primary aesthetic reference -- the Command Centre should feel like this.

### Visual Style
- Clean light theme with white/off-white backgrounds
- Minimal chrome -- almost no decorative elements
- Generous whitespace creates breathing room
- Flat design with very subtle shadows (1-2px, low opacity)
- No gradients, no rounded avatar images, no emoji
- Professional but not corporate -- approachable without being playful

### Layout Patterns
- Fixed left sidebar with navigation icons and labels
- Main content area fills remaining width
- Columns arranged horizontally with equal spacing
- Column headers are simple text with a count indicator
- Cards stack vertically within columns with consistent gaps
- Top area may include a project/workspace selector

### Component Patterns
- **Cards:** Rectangular with small border-radius (6-8px), light border (#E5E7EB range), minimal internal padding. Title is the dominant element. Metadata (labels, dates, assignees) is smaller and muted.
- **Columns:** Header is text-only (no background band), count badge is inline. Scrollable content area below.
- **Sidebar:** Narrow (200-240px), white or very light grey background, navigation items are icon + text label, active item indicated by left border accent or background highlight.
- **Buttons:** Small, understated. Primary action uses the accent colour as background. Secondary is outlined or ghost.

### Colour Usage
- Page background: White (#FFFFFF) or near-white (#FAFBFC)
- Card background: White (#FFFFFF) with subtle border
- Sidebar background: Slightly off-white or matching page
- Text: Dark charcoal (#111827) for primary, medium grey (#6B7280) for secondary
- Accent: Single blue tone for interactive elements and active states
- Borders: Very light grey (#E5E7EB to #F3F4F6)
- Status: Colour-coded labels/badges, not background floods -- localised colour pops

### Typography
- Sans-serif system font or Inter/Geist Sans
- Light font weights for body, medium for labels, semibold for headings
- Small text sizes overall -- 13-14px body, 12px metadata
- Tight line heights for density without feeling cramped

### What to Borrow
- The overall "feel" -- clean, light, spacious, professional
- Card design language -- minimal cards with clear hierarchy
- Sidebar navigation pattern
- Colour restraint -- mostly monochrome with targeted colour pops for status
- The sense that every pixel serves a purpose

### What to Avoid
- It's designed for developer/vibe-coding context -- the Command Centre needs business-friendly language and larger tap targets for non-technical users
- Some implementations may be too sparse for data-dense screens (stats, cron history)

---

## 2. OpenClaw Mission Control Dashboards

**Role:** Feature reference -- shows how to display agent status, cron jobs, cost tracking, and live events in a Kanban context.

### Visual Style
- More information-dense than Vibe Kanban
- Often uses dark or mixed themes (we will NOT use dark theme, but the layout patterns transfer)
- Data-forward: numbers, charts, and status indicators are prominent
- Real-time feel with live update indicators and timestamps

### Layout Patterns
- **Multi-section layouts:** Top stats bar, then main content, then bottom activity feed
- **Stats bars:** Horizontal row of metric cards at the top of the page. Each shows: large number (24-32px, bold), small label below (11-12px, muted), optional trend indicator
- **Split views:** Main kanban/list on the left, detail panel on the right or as an overlay
- **Tabbed interfaces:** Board / Agents / Cron / Logs as top-level navigation tabs

### Component Patterns
- **Agent status cards:** Show agent name, current task, status (running/idle/error), runtime, token count. Compact horizontal layout.
- **Cron job table:** Row-based table with columns for job name, schedule (human-readable), last run time, last run status (pass/fail badge), next run, average duration, active/paused toggle.
- **Cost tracking:** Per-task cost displayed on cards. Global cost summary in stats bar. Daily/weekly rollup available.
- **Live event feed:** Chronological list of events with timestamp, event type (badge), and description. Auto-scrolling. New events highlighted briefly.
- **Stats bar:** 4-6 metric blocks in a horizontal row. Each block: icon (optional), large number, label. Background slightly differentiated from page.

### Colour Usage
- Status-heavy: green (active/running), red (error/failed), amber/yellow (warning/review), blue (queued/scheduled), grey (idle/paused)
- Numbers often in the accent colour or status colour
- Background differentiation between sections (slightly darker stats bar area)

### Typography
- Monospace for token counts, costs, and durations (gives a "data" feel)
- Regular sans-serif for labels and descriptions
- Bold/large for key metrics

### What to Borrow
- Stats bar layout and metric card pattern
- Cron job table structure with run history, next execution, and status
- Cost/token display patterns on task cards
- Event feed chronological layout
- Agent status card compact layout
- The concept of progressive detail: summary on card, full detail in panel

### What to Avoid
- Dark themes -- adapt patterns to the light Vibe Kanban aesthetic
- Overly technical language (tokens, API calls) -- use business language (cost, duration)
- Dense developer-oriented UI that assumes familiarity with agent infrastructure
- Complex charts/graphs for v1 -- simple numbers and badges first

---

## 3. Claude Task Viewer (github.com/L1AD/claude-task-viewer)

**Role:** Functional reference -- shows session monitoring, real-time status updates, and lightweight task tracking for Claude sessions.

### Visual Style
- Deliberately lightweight and minimal
- HTML/CSS focused -- not a heavy framework UI
- Clean card-based layout
- Light backgrounds with clear section separation
- Functional over decorative -- every element communicates state

### Layout Patterns
- **Session list view:** Cards or rows showing each session with status, start time, task description
- **Session detail:** Expanded view showing progress, output, current activity
- **Real-time indicators:** Pulsing dots, spinner icons, or animated borders for active sessions
- **Sidebar or top-nav for filtering:** Filter by status (running/complete/failed)

### Component Patterns
- **Session cards:** Show session ID (or task name), status badge, start time, duration, brief task description. Active sessions have a visual indicator (pulsing dot, coloured border).
- **Status badges:** Small coloured pills -- running (blue/green), completed (green), failed (red), pending (grey)
- **Progress indicators:** Simple text-based ("Step 3 of 7") or thin progress bar
- **Output preview:** Truncated text showing the last few lines of agent output, expandable
- **Timestamp formatting:** Relative ("2m ago", "just now") for recent, absolute for older

### Colour Usage
- Minimal palette -- mostly greys with status colours
- Active/running sessions stand out with a coloured left border or background tint
- Completed items are visually de-emphasised (lighter text, no accent colour)

### Typography
- System fonts
- Small sizes for metadata (timestamps, IDs)
- Standard size for task descriptions
- Monospace for output text and session IDs

### What to Borrow
- Real-time status indicator patterns (pulsing dots, animated borders)
- Session card layout -- task title + status + duration + output preview
- Relative timestamp formatting for recent activity
- Lightweight approach -- not over-designed
- The concept of "live" vs "historical" visual distinction

### What to Avoid
- Too minimal for the Command Centre -- need more polish for non-technical users
- Session ID visibility (technical detail users don't need)
- Raw output display (business users want files, not terminal output)

---

## 4. Paperclip (paperclip.ing)

**Role:** Conceptual reference only -- shows goals, budget tracking, and governance patterns.

### Visual Style
- More complex and governance-oriented than the Command Centre needs
- Dashboard-heavy with multiple data visualisations
- Professional/corporate aesthetic

### Layout Patterns
- **Goal tracking:** Progress bars toward defined targets with percentage complete
- **Budget displays:** Spent vs budget with visual indicators (bar fills, colour changes at thresholds)
- **Multi-level hierarchy:** Goals contain sub-goals, each trackable independently

### Component Patterns
- **Budget bar:** Horizontal bar showing spend against limit. Green when under, amber approaching, red exceeded.
- **Goal card:** Title, target metric, current value, progress bar, trend arrow
- **Summary dashboard:** Grid of metric cards with sparklines or mini-charts

### What to Borrow
- Budget/spend display pattern -- applicable to the Command Centre's cost tracking (today's spend vs daily budget if implemented)
- Progress bar visual treatment -- simple, flat, colour-coded
- The concept of thresholds triggering colour changes (useful for cost warnings)

### What to Avoid
- Over-complexity -- the Command Centre is simpler than a governance dashboard
- Multiple chart types -- keep to numbers and simple progress bars for v1
- Goal hierarchy -- not applicable to task-level tracking

---

## Cross-Reference: Pattern Map to Command Centre Views

| Pattern | Source | Applies To |
|---------|--------|-----------|
| Clean light aesthetic, card-based layout | Vibe Kanban | All views |
| Sidebar navigation with icon + label | Vibe Kanban | Global nav |
| Stats bar with metric cards | OpenClaw | Global stats bar |
| Kanban columns with stacking cards | Vibe Kanban + OpenClaw | Board view |
| Task card with title, badge, skill, status | Vibe Kanban card + OpenClaw agent card | Board view cards |
| Cron job table with run history | OpenClaw | Cron Jobs view |
| Cost/token display | OpenClaw | Cards, stats bar, detail panel |
| Real-time status indicators (pulsing, animation) | Claude Task Viewer | Running task cards |
| Session monitoring card layout | Claude Task Viewer | Board view running cards |
| Slide-out detail panel | OpenClaw split view | Task detail panel |
| Budget/spend progress bar | Paperclip | Stats bar cost display |
| Relative timestamps | Claude Task Viewer | Card metadata |
| Status colour coding | All references | All views |
| Progressive detail (summary -> full) | OpenClaw | Card -> detail panel |

## Design Direction Summary

The Command Centre should look like **Vibe Kanban in feel** (clean, light, spacious, professional) but work like **OpenClaw in function** (stats, cron management, cost tracking, live agent monitoring). Borrow **Claude Task Viewer's lightweight real-time patterns** for running task indicators. Use **Paperclip's budget display concept** for spend tracking.

Key aesthetic rules derived from references:
- White/near-white backgrounds, not dark mode
- Colour used sparingly and meaningfully (status, not decoration)
- Cards are the primary content container
- Numbers and metrics are large and scannable
- Metadata is small, muted, and secondary
- No emojis, no avatars, no gradients, no heavy shadows
- Every element serves a purpose -- no decorative chrome
