"""Jev 1.13 token price. Confirmed from TypeSafe's models page. Do not invent a rate."""

from __future__ import annotations

# https://docs.typesafe.ai/models — fetched 2026-09-25
# Current models table: Jev 1.13 | jev-1.13.0 | Price (per Btok / per Mtok) | $42 / $0.042
# "Charged per input token. Output tokens are free."
PRICE_STATUS = "confirmed"
PRICE_SOURCE = "https://docs.typesafe.ai/models"
PRICE_NOTE = "Jev 1.13 (jev-1.13.0): $0.042 per million input tokens, $0 output. Confirmed 2026-09-25."
INPUT_USD_PER_MILLION = 0.042
OUTPUT_USD_PER_MILLION = 0.0


def usd_for_tokens(input_tokens: int, output_tokens: int) -> float:
    """Dollar cost for one System One call. Output is free on this confirmed rate."""
    return (int(input_tokens) / 1_000_000) * INPUT_USD_PER_MILLION + (
        int(output_tokens) / 1_000_000
    ) * OUTPUT_USD_PER_MILLION
