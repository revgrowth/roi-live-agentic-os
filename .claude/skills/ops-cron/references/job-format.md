# Job File Format

Every cron job is a markdown file in `cron/jobs/` with YAML frontmatter and a prompt body.

---

## YAML Frontmatter

```yaml
---
name: job-name                    # Kebab-case, unique, matches filename
schedule: "3 8 * * 1-5"          # 5-field cron expression (local timezone)
description: What this job does   # One-liner for the jobs table
model: sonnet                     # sonnet (cheap, fast) | opus (powerful) | haiku (cheapest)
permission_mode: auto             # auto | bypassPermissions (use auto unless you're sure)
max_budget_usd: 0.50              # Hard cap per run. Prevents runaway costs.
allowed_tools: "Read,Write,Edit,Bash(git:*),WebSearch,WebFetch,Grep,Glob"
                                  # Restrict tools to only what the job needs
enabled: true                     # Set to false to skip without deleting
---
```

### Required fields
- `name` — must match the filename (without .md)
- `schedule` — valid 5-field cron expression
- `description` — what humans see in the jobs list

### Optional fields (with defaults)
- `model` — defaults to `sonnet` (cheapest model that's still capable)
- `permission_mode` — defaults to `auto`
- `max_budget_usd` — defaults to `0.50`
- `allowed_tools` — defaults to all tools. Restrict for safety.
- `enabled` — defaults to `true`

---

## Prompt Body

Everything after the frontmatter `---` is the prompt sent to `claude -p`.

### Rules for good job prompts

1. **Self-contained.** No conversation history. State everything needed.
2. **Specific file paths.** "Read brand_context/voice-profile.md" not "check voice context".
3. **Explicit output location.** "Save results to projects/str-trending-research/daily_{date}.md"
4. **Date-aware.** Use "today's date" — Claude resolves it at runtime.
5. **Bounded scope.** One clear task. Don't chain 5 skills in one job.
6. **Error handling.** Say what to do if something fails: "If WebSearch fails, log the error to cron/logs/ and exit."

### Example prompt body

```markdown
You are running as an automated cron job for Agentic OS.

Read CLAUDE.md for system context. Read context/SOUL.md for voice.

Task: Research what's trending in AI automation on Reddit and X over the
last 7 days. Focus on Claude Code, n8n, and agentic workflows.

Save the brief to: projects/str-trending-research/weekly-ai-automation_{today's date}.md

Format: Use the str-trending-research skill methodology. Include:
- Top 5 Reddit threads with engagement counts
- Top 5 X posts with engagement counts
- Key themes and patterns
- Actionable content angles

If web search fails, log "Web search unavailable" to cron/logs/weekly-ai-research.log
and exit without creating the output file.
```

---

## How install.sh Processes Jobs

The install script:

1. Reads every `.md` file in `cron/jobs/`
2. Skips files where `enabled: false`
3. Extracts frontmatter fields
4. Builds a crontab entry for each job:

```bash
# [agentic-os] job-name: description
SCHEDULE cd /path/to/agentic-os && /path/to/claude -p "$(cat cron/jobs/job-name.md | sed '1,/^---$/d; 1,/^---$/d')" --model MODEL --permission-mode MODE --max-budget-usd BUDGET --allowed-tools "TOOLS" --no-session-persistence >> cron/logs/job-name.log 2>&1
```

Key flags:
- `-p` — headless mode, no interactive prompts
- `--model` — from frontmatter, defaults to sonnet
- `--permission-mode auto` — approves tool use without asking
- `--max-budget-usd` — hard spending cap per invocation
- `--allowed-tools` — restricts available tools
- `--no-session-persistence` — don't save cron sessions to history
- Output piped to `cron/logs/{job-name}.log`

### Marker comments

All entries are wrapped between marker comments so install/uninstall is clean:

```
# BEGIN agentic-os-cron
...entries...
# END agentic-os-cron
```

This means `install.sh --uninstall` only removes our entries, leaving the user's other crontab entries untouched.

---

## Claude CLI Flags Reference

| Flag | Purpose | Cron default |
|------|---------|-------------|
| `-p "prompt"` | Headless mode — run and exit | Always used |
| `--model sonnet` | Which model to use | sonnet (cheapest capable) |
| `--permission-mode auto` | Auto-approve tool use | auto |
| `--max-budget-usd 0.50` | Spending cap per run | 0.50 |
| `--allowed-tools "..."` | Restrict available tools | All tools |
| `--no-session-persistence` | Don't save session to disk | Always used |
| `--append-system-prompt "..."` | Add context to system prompt | Optional |

---

## Cost Estimation

| Model | Input (1M tokens) | Output (1M tokens) | Typical job cost |
|-------|-------------------|--------------------|--------------------|
| haiku | $0.80 | $4.00 | $0.01-0.05 |
| sonnet | $3.00 | $15.00 | $0.05-0.25 |
| opus | $15.00 | $75.00 | $0.25-2.00 |

A daily sonnet job reading context + running one skill typically costs $0.05-0.15 per run. At $0.10/run, that's ~$3/month for a daily job.

**Budget guard:** Always set `max_budget_usd`. A runaway job without a cap could burn through tokens. Start low ($0.50) and increase only if the job needs it.
