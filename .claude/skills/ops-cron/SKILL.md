---
name: ops-cron
description: >
  Schedule persistent cron jobs that run Claude Code headlessly on a recurring
  schedule. Create, list, install, uninstall, and check logs for scheduled
  jobs. Each job is a prompt file in cron/jobs/ with YAML frontmatter
  defining schedule, model, budget, and allowed tools. An install script
  registers them with the system crontab. Jobs survive reboots and run
  indefinitely — no 3-day limit. Triggers on: "schedule a job",
  "cron job", "run this every morning", "automate daily", "recurring task",
  "set up a scheduled job", "check cron logs", "list scheduled jobs",
  "install cron jobs", "uninstall cron jobs".
  Does NOT trigger for one-off tasks, in-session loops, or reminders.
---

# Cron Jobs

Persistent scheduled tasks that run Claude Code headlessly via system crontab. No 3-day limit — jobs run until you uninstall them.

## Outcome

Job definition files in `cron/jobs/`, registered with the system crontab via `cron/install.sh`. Logs written to `cron/logs/`. Jobs run whether or not Claude Code is open.

## Context Needs

| File | Load level | How it shapes this skill |
|------|-----------|--------------------------|
| `context/learnings.md` | `## ops-cron` section | Known issues with specific jobs, scheduling lessons |

No brand context needed — this is infrastructure.

---

## Instructions

### Step 1: Determine the Action

| Action | User says | What to do |
|--------|----------|------------|
| **Create** | "schedule a job", "run X every morning" | Build a job file (Step 2) |
| **List** | "list cron jobs", "what's scheduled" | Read all files in `cron/jobs/`, show table |
| **Install** | "install cron", "activate jobs" | Run `cron/install.sh` |
| **Uninstall** | "remove cron", "stop all jobs" | Run `cron/install.sh --uninstall` |
| **Logs** | "check cron logs", "did the job run" | Read latest from `cron/logs/` |
| **Remove one** | "remove the morning briefing job" | Delete the job file, re-run install |

### Step 2: Create a Job File

Ask the user (max 3 questions):
1. **What should it do?** — The task in plain language
2. **When should it run?** — "every morning at 8", "weekdays at 9", "every 6 hours"
3. **Any constraints?** — Budget cap, specific model, tool restrictions

Create the job file at `cron/jobs/{job-name}.md` using the format in `references/job-format.md`.

**Job file structure:**
```yaml
---
name: job-name
schedule: "3 8 * * 1-5"
description: What this job does
model: sonnet
permission_mode: auto
max_budget_usd: 0.50
allowed_tools: "Read,Write,Edit,Bash(git:*),WebSearch,WebFetch,Grep,Glob"
---

[The prompt that Claude executes]
```

**Rules for writing job prompts:**
- Self-contained — no conversation history exists. State everything the job needs to know.
- Reference specific file paths (e.g., "Read context/memory/ for today's date")
- Say where to save output (e.g., "Save to projects/str-trending-research/")
- Include the project directory: the install script handles `cd` automatically
- Keep prompts focused — one clear task per job

### Step 3: Verify Infrastructure

Check that `cron/` directory structure exists:

```
cron/
├── jobs/           <- Job definition files (.md)
├── logs/           <- Output logs (gitignored)
└── install.sh      <- Registers jobs with system crontab
```

If missing, create it. The `install.sh` script and `.gitignore` entry for `cron/logs/` should already exist — if not, create them from `references/job-format.md`.

### Step 4: Install

After creating or modifying job files, ask: "Want me to install this to your crontab now?"

If yes, run `bash cron/install.sh`. Show the user what was installed.

### Step 5: Verify

After installation, show:
```
Installed jobs:
  morning-briefing    8:03 AM weekdays    sonnet    $0.50 cap
  weekly-audit        9:17 AM Mondays     sonnet    $1.00 cap

Next run: morning-briefing at 8:03 AM tomorrow

Check logs: cron/logs/morning-briefing.log
```

---

## Schedule Syntax Quick Reference

| Human | Cron expression | Notes |
|-------|----------------|-------|
| Every morning at 8 | `3 8 * * *` | Offset from :00 to avoid load spikes |
| Weekdays at 9 | `17 9 * * 1-5` | Mon-Fri |
| Every 6 hours | `7 */6 * * *` | At :07 past |
| Monday mornings | `23 8 * * 1` | |
| Twice daily (8am + 5pm) | `3 8,17 * * *` | |
| First of month | `0 9 1 * *` | |

Always offset minutes from :00 and :30 to spread load.

---

## Rules

*Updated automatically when the user flags issues. Read before every run.*

---

## Self-Update

If the user reports a job failing, a prompt not working headlessly, or a scheduling issue — update the `## Rules` section immediately with the fix and today's date. Also log to `context/learnings.md` under `## ops-cron`.
