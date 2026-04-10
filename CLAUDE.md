# CLAUDE.md

This file keeps Claude Code compatible with the shared `AGENTS.md` guidance and adds Claude-only runtime behavior.

@AGENTS.md

---

## Claude Runtime

Before doing anything else in any Claude Code session:
1. **Brand context gate** — scan `brand_context/` for populated `.md` files. If none exist, treat this as a first-time user. Skip the normal context-loading steps and jump straight to the `/start-here` flow.
2. Read `context/SOUL.md`. If it is not in the current folder, fall back to `../../context/SOUL.md`.
3. Read `context/USER.md`. If it is not in the current folder, fall back to `../../context/USER.md`.
4. Read `context/memory/{today}.md` and `context/memory/{yesterday}.md`. Pay attention to `### Open threads`.
5. Create or open today's memory file using the format below.
6. Flag stale `brand_context/` files older than 30 days.
7. Scan `projects/briefs/*/brief.md` for active projects and report them if any exist.
8. Scan `.claude/skills/` so you know what is installed.
9. Run the reconciliation rules defined in `AGENTS.md`.
10. Check whether the cron dispatcher is installed. On macOS, derive the project slug and look for `~/Library/LaunchAgents/com.agentic-os.{slug}.plist`. If installed, read `cron/status/` files and report the latest status when relevant. If it is not installed, only mention it if the user asks about scheduling.
11. Automatically run `/start-here` after the checks above. Do not ask the user to type it manually.

### Daily Memory

Every Claude session writes to `context/memory/{YYYY-MM-DD}.md`.

Use one file per day with numbered session blocks:

```markdown
## Session N

### Project
[Project folder name if working on a Level 2 or 3 project. Omit for single tasks.]

### Goal
[One line — filled once the user states their goal]

### Deliverables
- `path/to/file` — what it is

### Decisions
- [Decision and rationale]

### Open threads
- [Anything unfinished for the next session]
```

When Claude reads yesterday's memory and sees a `### Project` reference, load `projects/briefs/{project-name}/brief.md` for full context.

During the session:
- Update the current session block incrementally
- Log deliverables and decisions as they happen

At session end:
- Detect common sign-off messages and run the full `meta-wrap-up` skill automatically
- Finalise the existing session block rather than creating a new one
- Keep entries concise and skimmable
