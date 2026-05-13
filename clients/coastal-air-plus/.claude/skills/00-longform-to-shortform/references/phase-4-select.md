# Phase 4: SELECT

Reference: `.claude/skills/vid-clip-selection/SKILL.md` (phases 1-4 only, skip Phase 5 human review)

```bash
PHASE_START=$(date +%s)
```

1. Read the SRT transcript
2. Identify candidate clips using the 5-category scoring framework:
   - **Hook Strength** (0-20): Does it grab attention in first 3 seconds?
   - **Standalone Value** (0-25): Does it make sense without context?
   - **Emotional Resonance** (0-20): Does it provoke reaction?
   - **Information Density** (0-20): Insight-per-second ratio
   - **Shareability** (0-15): Would someone share this?
3. Score each candidate (total out of 100)
4. Respect `duration_range` from config for clip boundaries
5. Write `{run_dir}/clip_candidates.json`:

```json
[
  {
    "id": 1,
    "title": "descriptive-clip-title",
    "start_time": "00:05:23",
    "end_time": "00:06:48",
    "duration_seconds": 85,
    "scores": {
      "hook_strength": 18,
      "standalone_value": 22,
      "emotional_resonance": 16,
      "information_density": 18,
      "shareability": 12
    },
    "total_score": 86,
    "hook_line": "The first line of the clip",
    "summary": "Brief description of the clip content"
  }
]
```

```bash
PHASE_END=$(date +%s)
echo "Phase 4 SELECT: $((PHASE_END - PHASE_START))s" >> "$RUN_DIR/phase-timings.txt"
```
