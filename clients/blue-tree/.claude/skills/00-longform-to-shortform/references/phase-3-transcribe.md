# Phase 3: TRANSCRIBE (Full Video)

Reference: `.claude/skills/tool-transcription/SKILL.md`

## Provider Selection

Read `transcription.provider` from `pipeline.config.yaml` (default: `"local"`).

| Provider | When | Speed | Cost |
|----------|------|-------|------|
| `"local"` | Default — most accurate word alignment | 15-30 min (CPU) | Free |
| `"groq"` | Fast cloud transcription | ~22s for 60 min | $0.04/hr |
| `"auto"` | Groq if `GROQ_API_KEY` set, else local | Depends | Depends |

### Resolve provider

```bash
PHASE_START=$(date +%s)

PROVIDER="$TRANSCRIPTION_PROVIDER"  # from config, default "local"
if [ "$PROVIDER" = "auto" ]; then
  if [ -n "$GROQ_API_KEY" ]; then
    PROVIDER="groq"
  else
    PROVIDER="local"
  fi
fi
```

---

## Provider: Groq API

```bash
# Extract audio as compressed MP3 (Groq has 25MB file limit)
ffmpeg -i "$SOURCE_VIDEO" -vn -acodec libmp3lame -q:a 4 "$RUN_DIR/source.mp3"

# Check file size — if over 25MB, use lower bitrate
FILE_SIZE=$(stat -f%z "$RUN_DIR/source.mp3" 2>/dev/null || stat -c%s "$RUN_DIR/source.mp3")
if [ "$FILE_SIZE" -gt 26214400 ]; then
  ffmpeg -y -i "$SOURCE_VIDEO" -vn -acodec libmp3lame -q:a 8 "$RUN_DIR/source.mp3"
fi

# Call Groq API with word-level timestamps (Python stdlib — curl is denied by Claude Code permissions)
python3 << 'PYEOF'
import http.client, json, os, mimetypes, uuid

api_key = os.environ["GROQ_API_KEY"]
run_dir = os.environ.get("RUN_DIR", ".")
audio_path = f"{run_dir}/source.mp3"

boundary = uuid.uuid4().hex
parts = []
for name, value in [("model", "whisper-large-v3-turbo"), ("response_format", "verbose_json"), ("timestamp_granularities[]", "word")]:
    parts.append(f"--{boundary}\r\nContent-Disposition: form-data; name=\"{name}\"\r\n\r\n{value}\r\n".encode())
with open(audio_path, "rb") as f:
    file_data = f.read()
parts.append(f"--{boundary}\r\nContent-Disposition: form-data; name=\"file\"; filename=\"source.mp3\"\r\nContent-Type: audio/mpeg\r\n\r\n".encode() + file_data + b"\r\n")
parts.append(f"--{boundary}--\r\n".encode())
body = b"".join(parts)

conn = http.client.HTTPSConnection("api.groq.com")
conn.request("POST", "/openai/v1/audio/transcriptions", body=body, headers={
    "Authorization": f"Bearer {api_key}",
    "Content-Type": f"multipart/form-data; boundary={boundary}",
})
resp = conn.getresponse()
data = resp.read()
if resp.status != 200:
    raise RuntimeError(f"Groq API error {resp.status}: {data.decode()}")
with open(f"{run_dir}/transcript-groq.json", "w") as f:
    f.write(data.decode())
print("Groq transcription saved")
PYEOF

# Convert Groq word-level JSON -> SRT for Phase 4 compatibility
# The Groq response has .words[] with {word, start, end} entries
# Group words into subtitle segments (max ~10 words or ~4 seconds per segment)
# Write to source.srt in standard SRT format

# Keep the raw Groq JSON at transcript-groq.json for Phase 7 word-level editing
```

**SRT conversion logic:** Group consecutive words into segments of max 10 words or 4 seconds, whichever comes first. Each SRT entry gets the start time of its first word and end time of its last word.

**If file is still over 25MB after re-encoding:** Split audio into chunks with ffmpeg, transcribe each chunk separately, merge transcripts with offset adjustment.

---

## Provider: Local WhisperX

```bash
source projects/tools/venv.sh
whisperx "$SOURCE_VIDEO" \
  --model "$WHISPER_MODEL" \
  --output_dir "$RUN_DIR" \
  --output_format srt \
  --language en
```

Use `device='cpu'` on macOS, `device='cuda'` on Linux with GPU. Use `compute_type='int8'` on CPU, `compute_type='float16'` on CUDA.

---

## Timing

```bash
PHASE_END=$(date +%s)
echo "Phase 3 TRANSCRIBE ($PROVIDER): $((PHASE_END - PHASE_START))s" >> "$RUN_DIR/phase-timings.txt"
```

Output: `{run_dir}/source.srt` (both providers produce this)
