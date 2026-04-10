---
name: ops-cron
description: >
  Schedule recurring tasks that run automatically via OS crontab (Mac/Linux)
  or Task Scheduler (Windows). Job files in cron/jobs/ define what runs, when,
  and with which model. Headless claude -p executes each job. Triggers on:
  "schedule a job", "cron job", "run this every morning", "automate daily",
  "recurring task", "scheduled job", "check scheduled jobs", "list jobs",
  "install cron", "run job manually".
  Does NOT trigger for one-off tasks or in-session reminders.
---

# Scheduled Jobs

Drop a markdown file into `cron/jobs/`, install the dispatcher once, and your prompts run automatically at the times you set. Each job fires headless `claude -p` — no open session required.

## How It Works

A lightweight dispatcher script runs every minute via your OS scheduler: `scripts/run-crons.sh` on macOS/Linux and `scripts/run-crons.ps1` on Windows Task Scheduler. It scans `cron/jobs/*.md`, checks each file's `time` and `days` against the current time, and fires any matching jobs via `claude -p`. Each execution is stateless and self-contained.

## Outcome

Job file in `cron/jobs/`. Automatic execution in the background. Per-job logs in `cron/logs/`.

## Context Needs

| File | Load level | How it shapes this skill |
|------|-----------|--------------------------|
| `context/learnings.md` | `## ops-cron` section | Known issues with specific jobs |

No brand context needed — this is infrastructure.

---

## Step 1: Determine the Action

| Action | User says | What to do |
|--------|----------|------------|
| **Create** | "schedule a job", "run X every morning" | Build a job file (Step 2–4), offer to install dispatcher (Step 5) |
| **List** | "list jobs", "what's scheduled" | Read all files in `cron/jobs/` and status files from `cron/status/`, show a table with name, schedule, active, last run time, result, duration, and run/fail counts |
| **Install** | "install cron", "start scheduled jobs" | Run `bash scripts/install-crons.sh` on macOS/Linux or `powershell -NoProfile -ExecutionPolicy Bypass -File scripts\install-crons.ps1` on Windows |
| **Uninstall** | "uninstall cron", "stop all jobs" | Run `bash scripts/uninstall-crons.sh` on macOS/Linux or `powershell -NoProfile -ExecutionPolicy Bypass -File scripts\uninstall-crons.ps1` on Windows |
| **Pause job** | "stop the X job", "disable X" | Set `active: "false"` in the job file |
| **Resume job** | "re-enable X", "turn X back on" | Set `active: "true"` in the job file |
| **Remove** | "remove the morning job" | Delete the job file |
| **Run now** | "run X now", "trigger X manually" | Run `bash scripts/run-job.sh {name}` on macOS/Linux or `powershell -NoProfile -ExecutionPolicy Bypass -File scripts\run-job.ps1 {name}` on Windows |
| **Logs** | "check job logs", "did the job run" | Read from `cron/logs/{job-name}.log` |
| **Status** | "is the dispatcher running" | Check LaunchAgents on macOS, `crontab -l` on Linux, or Task Scheduler on Windows |

## Step 2: Understand What the User Wants

Ask up to 4 focused questions:

1. **What should it do?** — Get the task in plain language. Probe for specifics:
   - "Which topics or keywords should it focus on?"
   - "Where should the output go?"
   - "What format do you want the output in?"

2. **Which skills should it use?** — Check `.claude/skills/` for installed skills that match the task. Ask the user:
   - "I can see you have `str-trending-research` installed — should this job use that methodology?"
   - "You also have `mkt-content-repurposing` — want it to repurpose findings into posts?"
   - List relevant installed skills and let them pick which to chain together.

3. **When and how often?** — Map to the time format:
   - "Every morning at 9" → `time: "09:00"`, `days: "daily"`
   - "Every 2 hours on weekdays" → `time: "every_2h"`, `days: "weekdays"`
   - "Three times a day" → ask which times, then `time: "09:00,13:00,17:00"`
   - "Mondays and Wednesdays" → `days: "mon,wed"`

5. **Notifications and timeout?** — Ask if they want to be notified when the job finishes:
   - `on_finish` (default) — notifies on success and failure
   - `on_failure` — only notifies on errors or timeouts
   - `silent` — no notifications
   - If the job is long-running, suggest adjusting `timeout` (default 30m)

4. **Which model?** — Explain the trade-off:
   - `haiku` — fast and cheap ($0.01–0.05/run), good for simple lookups
   - `sonnet` — balanced (default, $0.05–0.25/run), good for research and writing
   - `opus` — most capable ($0.25–2.00/run), good for complex multi-step tasks

## Step 3: Build the Prompt

Write a self-contained prompt body that:

- Starts with "You are running as a scheduled job for Agentic OS."
- Tells Claude to read CLAUDE.md for system context
- **References specific skill files** if using skills: "Read .claude/skills/{skill-name}/SKILL.md for the methodology"
- **References specific brand context files** if the task needs voice/positioning/ICP
- Gives clear, numbered steps for multi-step tasks
- Specifies exact output path with date placeholder
- Includes error handling ("If X fails, do Y")

## Step 4: Create the File and Confirm

1. Create the job file at `cron/jobs/{job-name}.md`
2. **Show the user what was created.** Display:
   - The full file path so they can click to review it
   - A summary table of the schedule
   - Estimated cost per run and per month
3. Ask: "Want to review or adjust anything before we activate it?"

Example confirmation:

```
Created: cron/jobs/daily-trending-research.md

Schedule:
  Time:    every 2 hours
  Days:    weekdays
  Model:   sonnet
  Active:  true
  Notify:  on_finish
  Timeout: 30m
  Retry:   0

Estimated cost: ~$0.15/run × 12 runs/day × 22 weekdays = ~$40/month

The job uses the str-trending-research methodology and saves output to
projects/str-trending-research/. Review the file to check the prompt:
/path/to/cron/jobs/daily-trending-research.md
```

## Step 5: Install the Dispatcher

If the dispatcher isn't already installed, offer to install it:

**Mac/Linux:**
```bash
bash scripts/install-crons.sh
```

**Windows (PowerShell as admin):**
```powershell
powershell scripts/install-crons.ps1
```

---

## Time Reference

| User says | `time` value | Runs |
|-----------|-------------|------|
| "at 9am" | `"09:00"` | Once daily at 9:00 |
| "at 9am and 5pm" | `"09:00,17:00"` | Twice daily |
| "every 5 minutes" | `"every_5m"` | 288x/day |
| "every 10 minutes" | `"every_10m"` | 144x/day |
| "every 30 minutes" | `"every_30m"` | 48x/day |
| "every hour" | `"every_1h"` | 24x/day on the hour |
| "every 2 hours" | `"every_2h"` | 12x/day (00:00, 02:00, ...) |
| "every 4 hours" | `"every_4h"` | 6x/day (00:00, 04:00, ...) |
| "three times a day" | `"09:00,13:00,17:00"` | Ask which times |

Full reference with all options: see `cron/templates/schedule-reference.md`

---

## Manual Trigger

Run any job immediately, ignoring its schedule:

```bash
bash scripts/run-job.sh morning-kickoff
```

Windows equivalent:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\run-job.ps1 morning-kickoff
```

This is the same entrypoint a future Telegram bot would use.

---

## Status & Notifications

**Per-job status files** are written to `cron/status/{job-name}.json` after each execution. Each file tracks: result (`success`/`failure`/`timeout`), duration, last run timestamp, total run count, and fail count. These are read by the **List** action to show a status table.

**OS notifications** are sent when a job completes, controlled by the `notify` field:
- `on_finish` (default) — notifies on both success and failure
- `on_failure` — only notifies on errors or timeouts
- `silent` — never notifies

**Smart silence (`[SILENT]`):** Jobs can suppress their notification on a per-run basis. If a job's prompt instructs Claude to end its response with `[SILENT]` when there's nothing to report, the dispatcher skips the notification but still logs the output normally. Use this for monitoring-style jobs (health checks, update scanners) where "all clear" doesn't need a ping. Action-oriented jobs (digests, research) should always notify.

When building a job prompt that uses this, add a line like: *"If there are no issues to report, end your response with `[SILENT]`."*

**No duplicate runs:** If a job is still running when the next scheduled trigger fires, the dispatcher skips the duplicate. This prevents slow jobs from piling up when the runtime exceeds the schedule interval. If a previous run crashed without cleaning up, the dispatcher detects the stale state and starts the job normally.

**Catch-up behavior:** If the laptop was closed (sleep/lid shut) during a scheduled fixed-time job, the dispatcher detects the missed window on wake and runs the job automatically. Interval-based jobs (`every_Nh`) do not catch up — they simply resume on the next matching interval.

**Timeout** prevents runaway jobs. Default is 30 minutes. If a job exceeds its timeout, the process is killed and the result is recorded as `timeout`. If `retry` > 0, the job is re-attempted up to N times, each with the full timeout.

---

## Heartbeat Integration

At session start (CLAUDE.md heartbeat step 10):

1. Check if dispatcher is installed:
   - macOS: `~/Library/LaunchAgents/com.agentic-os.{slug}.plist`
   - Linux: `crontab -l | grep run-crons`
   - Windows: `Get-ScheduledTask -TaskName AgenticOS-{slug}`
2. If installed: read `cron/status/` files and report: "Cron dispatcher is active — N enabled jobs. Last run: {job} at {time} ({result})."
3. If any jobs failed on last run, flag them: "{job} failed on last run — check logs?"
4. If not installed but jobs exist: suggest the platform-appropriate install command

---

## Rules

*Updated automatically when the user flags issues. Read before every run.*

---

## Self-Update

If the user reports a job failing or a scheduling issue — update the `## Rules` section immediately with the fix and today's date. Also log to `context/learnings.md` under `## ops-cron`.
