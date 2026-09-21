# Confidence policy

Tune per pack against labeled overrides. These are starting points, not law.

## Defaults

| Signal | Auto | Escalate | Human |
|--------|------|----------|-------|
| `choice.confidence` | ≥ 0.85 | 0.55-0.85 | < 0.55 |
| `noul` | ≥ 0.85 or ≤ 0.15 | everything else | 0.40-0.60 when the pack is high-stakes |
| `score` | extreme band (≤0.25 or ≥0.75 of max level) and confidence ≥ 0.80 | mid | confidence < 0.55 |

Noul has no separate `confidence` field from Jev. Extremity is `abs(noul - 0.5) * 2`.

## Hard rules

1. Packs with `never_auto=True` or `ymyl_gate=True` always route `human` at the pack level, even if every question is extreme.
2. If any choice lands on `medical_ymyl`, `financial_ymyl`, `legal_ymyl`, or `ymyl`, the whole decision is `human`.
3. Questions listed in `never_auto_questions` cannot stay `auto`; they become `human`.
4. Pin `jev-1.13.0` in production. Do not retune thresholds on `jev-latest` drift.
5. Sample about 2% of `auto` purity rows weekly. Log overrides into the JSONL log (`event=override`).

## What the route means

- `auto` — write the disposition into the artifact. No LLM.
- `llm_escalate` — frontier model may re-judge or write narrative for this unit only.
- `human` — stop. Show answers + confidence. Do not publish.

## Thin state

If a pack's `required_evidence` is missing, the fabric refuses the row. Do not fill holes with an LLM and then pretend the result is a Jev judgment.
