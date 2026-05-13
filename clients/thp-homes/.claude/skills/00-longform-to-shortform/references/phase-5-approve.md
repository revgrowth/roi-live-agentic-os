# Phase 5: AUTO-APPROVE

No human review. Automated filtering:

```bash
PHASE_START=$(date +%s)
```

1. Filter clips using `combined_score` when viral scores are present (Phase 3.5 ran), otherwise fall back to `total_score`. Threshold: `>= min_score` (from config, default 65)
2. Sort by `combined_score` descending (falls back to `total_score` if viral scores absent)
3. Take top `max_clips` (default 5)
4. **Safety net:** If fewer than `min_clips` (default 2) pass the threshold:
   - Lower threshold by 10 and re-filter
   - Repeat until `min_clips` met or floor of 45 reached
   - If still under `min_clips` at floor 45, take whatever passes
5. Write `{run_dir}/clip_definitions.json` (approved clips only, same format)
6. Log all decisions: which clips passed, which were cut, any threshold adjustments, and whether `combined_score` or `total_score` was used for ranking

```bash
PHASE_END=$(date +%s)
echo "Phase 5 AUTO-APPROVE: $((PHASE_END - PHASE_START))s" >> "$RUN_DIR/phase-timings.txt"
```
