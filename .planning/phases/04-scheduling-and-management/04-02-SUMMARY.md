---
phase: 04-scheduling-and-management
plan: 02
subsystem: ui, api
tags: [react-markdown, remark-gfm, gray-matter, next-link, file-service, skill-parsing]

requires:
  - phase: 02-core-loop
    provides: "Next.js app shell, sidebar layout, config.ts, API route patterns"
  - phase: 04-scheduling-and-management plan 01
    provides: "Cron system, gray-matter dependency already installed"
provides:
  - FileNode, FileContent, SkillDependency, InstalledSkill type definitions
  - File service with directory listing, file read/write, skill listing with dependency parsing
  - File listing API (GET /api/files?dir=context)
  - File read/write API (GET/PUT /api/files/[...path])
  - Skills API (GET /api/skills) with dependency arrays
  - Shared markdown preview component (react-markdown + remark-gfm)
  - Shared markdown editor component with save/cancel
  - Shared 480px slide-out panel component
  - Sidebar with next/link client-side routing
  - App-shell with optional title prop
affects: [04-03-management-tab-views]

tech-stack:
  added: [remark-gfm]
  patterns: [file-service path validation, atomic write with rename, optimistic concurrency, dependency markdown table parsing]

key-files:
  created:
    - projects/briefs/command-centre/src/types/file.ts
    - projects/briefs/command-centre/src/lib/file-service.ts
    - projects/briefs/command-centre/src/app/api/files/route.ts
    - projects/briefs/command-centre/src/app/api/files/[...path]/route.ts
    - projects/briefs/command-centre/src/app/api/skills/route.ts
    - projects/briefs/command-centre/src/components/shared/markdown-preview.tsx
    - projects/briefs/command-centre/src/components/shared/markdown-editor.tsx
    - projects/briefs/command-centre/src/components/shared/slide-out-panel.tsx
  modified:
    - projects/briefs/command-centre/src/components/layout/sidebar.tsx
    - projects/briefs/command-centre/src/components/layout/app-shell.tsx
    - projects/briefs/command-centre/package.json

key-decisions:
  - "Double path validation (raw string + resolved path) for file service security"
  - "Atomic write via tmp + rename pattern consistent with cron-service from 04-01"
  - "parseDependencies regex extracts ## Dependencies markdown table from SKILL.md body"

patterns-established:
  - "File service path traversal protection: validate resolved path starts with agenticOsDir"
  - "Optimistic concurrency: compare lastModified timestamp before write, 409 on conflict"
  - "Allowed-roots pattern: API routes restrict access to context/ and brand_context/ only"

requirements-completed: [CTX-01, BRAND-01, SKILL-01]

duration: 4min
completed: 2026-03-26
---

# Phase 04 Plan 02: Shared Infrastructure Summary

**File service with path-safe directory listing and skill dependency parsing, shared markdown/panel components, and sidebar converted to next/link client-side routing**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-26T12:18:31Z
- **Completed:** 2026-03-26T12:22:15Z
- **Tasks:** 2
- **Files modified:** 11

## Accomplishments
- File service with path traversal protection, atomic writes, optimistic concurrency, and skill dependency parsing from SKILL.md ## Dependencies section
- Three shared UI components: markdown preview (react-markdown + remark-gfm), markdown editor with local state isolation, 480px slide-out panel with overlay/escape/scroll-lock
- Sidebar converted from hardcoded active booleans to next/link routing with usePathname active state detection
- REST APIs for file listing, file read/write, and skills listing with dependency arrays

## Task Commits

Each task was committed atomically:

1. **Task 1: File/skill types, file service with dependency parsing, and REST APIs** - `e77940e` (feat)
2. **Task 2: Shared UI components and sidebar routing** - `532cf90` (feat)

## Files Created/Modified
- `src/types/file.ts` - FileNode, FileContent, SkillDependency, InstalledSkill type definitions
- `src/lib/file-service.ts` - listDirectory, readFile, writeFile, listSkills with path traversal protection
- `src/app/api/files/route.ts` - GET endpoint for directory listing with allowed-root validation
- `src/app/api/files/[...path]/route.ts` - GET/PUT for individual file read/write with concurrency checks
- `src/app/api/skills/route.ts` - GET endpoint returning installed skills with dependencies
- `src/components/shared/markdown-preview.tsx` - Reusable markdown renderer with design system styling
- `src/components/shared/markdown-editor.tsx` - Textarea editor with save/cancel and local state
- `src/components/shared/slide-out-panel.tsx` - 480px slide-out panel with overlay, escape key, scroll lock
- `src/components/layout/sidebar.tsx` - Converted to next/link with usePathname active detection
- `src/components/layout/app-shell.tsx` - Added optional title prop for page-specific headers
- `package.json` - Added remark-gfm dependency

## Decisions Made
- Double path validation (raw string check + resolved path check) for file service security, consistent with Phase 03 approach
- Atomic write via tmp + rename pattern, consistent with cron-service from 04-01
- parseDependencies uses regex to extract ## Dependencies markdown table rows from SKILL.md body content (after gray-matter frontmatter extraction)
- Memory directory gets special treatment: sorted newest-first with 30-entry default limit

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Installed missing remark-gfm dependency**
- **Found during:** Task 2 (shared UI components)
- **Issue:** remark-gfm was not in package.json, TypeScript could not find module
- **Fix:** Ran `npm install remark-gfm`
- **Files modified:** package.json, package-lock.json
- **Verification:** TypeScript compiles with zero errors
- **Committed in:** 532cf90 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Missing dependency that was expected to be installed as part of the plan. No scope creep.

## Issues Encountered
None beyond the remark-gfm dependency installation.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All shared infrastructure ready for 04-03 (Context, Brand, Skills tab views)
- File service provides listDirectory/readFile/writeFile for Context and Brand tabs
- listSkills provides full skill data including dependencies for Skills tab
- Shared markdown preview/editor and slide-out panel ready for consumption
- Sidebar routing active -- navigating to /context, /brand, /skills will work once page.tsx files exist

---
*Phase: 04-scheduling-and-management*
*Completed: 2026-03-26*
