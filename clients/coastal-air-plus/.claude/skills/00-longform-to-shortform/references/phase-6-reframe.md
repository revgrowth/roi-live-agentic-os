# Phase 6: REFRAME

Reference: `.claude/skills/vid-clip-extractor/SKILL.md`

## Tool

**Package:** `.claude/skills/00-longform-to-shortform/tools/reframe/`

FFmpeg pipe-based reframing with OpenCV DNN face detection and HSV scene detection. No MediaPipe, no crop_path.json, no external dependencies beyond opencv-python, numpy, scipy.

## CLI

```bash
# From repo root — PYTHONPATH points to the _systems package so python -m tools.reframe resolves
SYS_DIR=".claude/skills/_systems/00-longform-to-shortform"
PYTHONPATH="$SYS_DIR" python -m tools.reframe \
  --video "$SOURCE_VIDEO" \
  --output "$PROJECT_DIR/clips/clip-N/reframed.mp4" \
  --start "$CLIP_START" \
  --end "$CLIP_END" \
  --layout "$LAYOUT"
```

Where `$LAYOUT` comes from `input.layout` in pipeline config (default `split-screen`).

## Parallel Extraction

Read `performance.parallel_reframes` from `pipeline.config.yaml` (default: 3). Run individual clip reframes in parallel.

```bash
PHASE_START=$(date +%s)

MAX_PARALLEL=$PARALLEL_REFRAMES  # from config, default 3
RUNNING=0

SYS_DIR=".claude/skills/_systems/00-longform-to-shortform"

for CLIP in $(seq 1 $NUM_CLIPS); do
  PYTHONPATH="$SYS_DIR" python -m tools.reframe \
    --video "$SOURCE_VIDEO" \
    --output "$PROJECT_DIR/clips/clip-${CLIP}/reframed-${LAYOUT}.mp4" \
    --start "${CLIP_STARTS[$CLIP]}" \
    --end "${CLIP_ENDS[$CLIP]}" \
    --layout "$LAYOUT" &

  RUNNING=$((RUNNING + 1))

  if [ "$RUNNING" -ge "$MAX_PARALLEL" ]; then
    wait -n
    RUNNING=$((RUNNING - 1))
  fi
done

wait

PHASE_END=$(date +%s)
echo "Phase 6 REFRAME ($NUM_CLIPS clips, $MAX_PARALLEL parallel): $((PHASE_END - PHASE_START))s" >> "$RUN_DIR/phase-timings.txt"
```

## Layout Modes

| Layout | Behavior | Best for |
|--------|----------|----------|
| `split-screen` (default) | Top 50% = screen content (9:8 crop, opposite side to face). Bottom 50% = face zoom (3x face width). Talking-head scenes = single 9:16 face crop | Tutorials, demos, screen recordings with webcam |
| `cursor-track` | Screen-share scenes = wide 9:8 crop centered vertically. Talking-head scenes = tight 9:16 face crop | Screen recordings where cursor movement matters |
| `face-track` | 9:16 crop follows the speaker's face with motion-classified smoothing | Talking head, vlog, direct-to-camera |

## Output

Each clip reframe creates:
- `{run_dir}/clips/clip-N/raw.mp4` — stream-copy extract (when --start/--end used)
- `{run_dir}/clips/clip-N/reframed-{layout}.mp4` — reframed 1080x1920 output

## How It Works

1. FFmpeg decodes every frame as raw BGR via pipe
2. OpenCV DNN ResNet-10 SSD detects faces (every frame, full resolution)
3. HSV histogram scene detection classifies scene boundaries
4. Per-scene: face_width > 10% = talking-head, else screen-share
5. Motion-classified smoothing (stationary/panning/tracking) prevents jitter
6. Numpy crops/composites each frame per layout mode
7. FFmpeg encodes output via pipe (libx264, preset fast, crf 20)

## Performance

Expected render time per 90s clip: ~2-3 min (face detection + render).

Reframed clips are **intermediates** — FFmpeg re-encodes during the subtitle burn pass in Phase 7, so these don't need to be pixel-perfect.

## Quoting

Always quote variables in background commands: `"$VAR"` not `$VAR`, especially for paths with spaces.
