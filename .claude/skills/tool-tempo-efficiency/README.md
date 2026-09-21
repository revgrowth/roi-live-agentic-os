# Tempo Efficiency Layer

Shared gate, kill, JSONL, and post-`llm_escalate` model-tier packaging.

Tempo owns this skill. Polaris owns `.claude/skills/tool-polaris-df/` — import
adapters only. COO owns intake ops judgment. `BOT_EXEC` stays OFF.

Full ownership index: [`references/README.md`](references/README.md).

## Install / import

No extra runtime packages. Python 3.10+.

```bash
# from repo root
export PYTHONPATH=".claude/skills/tool-tempo-efficiency${PYTHONPATH:+:$PYTHONPATH}"
python3 -m tempo_efficiency --help

# or
bash scripts/tempo-router --help
```

Optional: add Polaris to `PYTHONPATH` so the import adapter can read DF
`Route` / YMYL claim classes. Tempo still works without it.

```python
from tempo_efficiency.gate import resolve_gate
from tempo_efficiency.router import resolve_recommendation
from tempo_efficiency.adapters.polaris_df import router_outcome_from_df
```

Do **not** import `polaris_df.packs` from Tempo callers. There is no Tempo
pack catalog.

## Commands

```bash
# Layer A/B/C dry-run (no Typesafe, no ClickUp)
tempo-router resolve --bucket NOISE --router-outcome auto
tempo-router resolve --bucket CLIENT_HUMAN --router-outcome llm_escalate --decision-id d1
tempo-router resolve --bucket CLARIFY --router-outcome llm_escalate --hops 2
tempo-router resolve --bucket BRIEF_ONLY --router-outcome llm_escalate --ymyl

# Gate + thresholds
tempo-router gate --root path/to/automation
tempo-router thresholds
```

## Hard pins

| Pin | Value |
|-----|--------|
| Classify | `jev-1.13.0` |
| `BOT_EXEC` | OFF (not configurable here) |
| YMYL / claim packs | never auto; T3 assist draft only if Jason later allows |
| Escalate hops | max 2 per `decision_id`, then `human` |
| Auto bands | COO 0.95/0.70 vs DF ~0.85 — not unified |
| JSONL | accept `route` or `router_outcome` (prefer `route`) |
| Cost caps | `null` placeholders until Jason sets `$` |

## Tests

```bash
PYTHONPATH=".claude/skills/tool-tempo-efficiency:.claude/skills/tool-polaris-df" \
  python3 -m unittest discover -s .claude/skills/tool-tempo-efficiency/tests -p 'test_*.py'
```
