# tool-jev-dispatcher

Labels one job with TypeSafe Jev `jev-1.13.0` and writes a JSON handoff into `queues/<seat>/`.

It does not execute the job, send email, or change ClickUp. It does not create `ENABLED.on`. Without that file, a run is a dry-run: audit and token ledger only.

## Seats

ChatGPT 20X Max A, B, and C (one of them per run, rotating), ChatGPT Team, Claude Team, GLM 5.3 Max, Kimi K3 Max, Cursor cloud agent, and human review.

Grok Heavy is listed in config as coordinator only. It is not a destination.

Mark a seat at cap by writing `seat-capacity.json` in the automation root:

```json
{"claude-team": "at_cap"}
```

## Run

```bash
PYTHONPATH=".claude/skills/tool-jev-dispatcher:.claude/skills/tool-tempo-efficiency:.claude/skills/tool-polaris-df" \
  python3 -m jev_dispatcher --root clients/roi-live/projects/jev-dispatcher-2026-09 \
  --goal "Extract the keyword table" --quality-bar execution --blast-radius internal
```

Live eval on Windows (key must already be in the environment; the script does not print it):

```powershell
.\.claude\skills\tool-jev-dispatcher\scripts\live-eval.ps1
```

## Tests

```bash
PYTHONPATH=".claude/skills/tool-jev-dispatcher:.claude/skills/tool-tempo-efficiency:.claude/skills/tool-polaris-df" \
  python3 -m unittest discover -s .claude/skills/tool-jev-dispatcher/tests -p 'test_*.py'
```

## Price

Jev 1.13 input is $0.042 per million tokens. Output is $0. Source: https://docs.typesafe.ai/models (confirmed 2026-09-25). The ledger `usd` column uses that rate. Tempo's work-model dollar caps are still null.

## Layout

Tempo owns the gate, kill file, audit JSONL, hop limit, and tier ladder. This skill imports them. Polaris owns the HTTP client. This skill does not fork either one.
