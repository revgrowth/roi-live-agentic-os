---
status: testing
phase: 03-outputs-and-monitoring
source: [03-01-SUMMARY.md, 03-02-SUMMARY.md]
started: 2026-03-26T12:00:00Z
updated: 2026-03-26T12:00:00Z
---

## Current Test

number: 1
name: Cold Start Smoke Test
expected: |
  Kill any running dev server. Start fresh with `npm run dev` from the project folder. Server boots without errors, database initializes, and http://localhost:3000 loads the Kanban board.
awaiting: user response

## Tests

### 1. Cold Start Smoke Test
expected: Kill any running dev server. Start fresh with `npm run dev`. Server boots without errors, database initializes, and http://localhost:3000 loads the Kanban board.
result: [pending]

### 2. Task Card Shows Output Chips
expected: A completed or review-status task card displays small terracotta file badges (output chips) showing filenames. If no outputs exist, no chips are shown (no empty state clutter).
result: [pending]

### 3. File Preview Modal
expected: Clicking an output chip opens a glassmorphism modal overlay. Markdown files render formatted. CSV files render as a table. Text/JSON files show in monospace. A download button is visible in the modal.
result: [pending]

### 4. File Download
expected: Clicking the download button in the preview modal (or on the output chip) triggers a browser file download of the original file.
result: [pending]

### 5. Click Card Opens Detail Panel
expected: Clicking anywhere on a task card opens a 480px slide-out panel from the right side. An overlay dims the background. The panel shows the task title, level badge, and a skill label.
result: [pending]

### 6. Detail Panel Stats Grid
expected: The detail panel shows a 2x2 stats grid with: status (with colored dot), duration, cost, and tokens. Timestamps for created/updated are shown below.
result: [pending]

### 7. Detail Panel Output Files
expected: The detail panel lists all output files for the task with file icons, extension badges, a preview (eye) button, and a download button. If no outputs, shows an empty state message.
result: [pending]

### 8. Panel Dismiss
expected: The detail panel closes when clicking the X button, clicking the overlay, or pressing Escape.
result: [pending]

### 9. Stats Bar Shows Today's Spend
expected: The global stats bar at the top shows: tasks running count, tasks completed count, active crons (shows 0), and today's total spend in dollars (including running/review tasks).
result: [pending]

## Summary

total: 9
passed: 0
issues: 0
pending: 9
skipped: 0
blocked: 0

## Gaps
