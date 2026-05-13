---
name: tool-publisher
version: 1.0.1
description: >
  Publishes a generated social media post via Zernio MCP.
  Reads from {output_base}/{date}/{slug}/ (default: {projects_base}/00-social-content/),
  handles image upload via Zernio browser flow, calls posts_publish_now, and
  updates post.yaml + publish-log.md.
  Triggers on: "post", "publish", "post now", "publish post",
  "I want to post", "post this", "publish this".
---

# tool-publisher

Publishes a draft post from `{output_base}/` (default: `{projects_base}/00-social-content/`) via the Zernio MCP.

## Prerequisites

Before running, verify:
1. Zernio MCP server is configured in `.mcp.json` at the repo root (already done)
2. `ZERNIO_API_KEY` is set in `{env_file}`
3. The target social account is connected at https://zernio.com/dashboard

If Zernio MCP tools are not available in the current session, stop immediately and tell the user:
```
Zernio MCP is not available in this session.
Check: ZERNIO_API_KEY in {env_file} and restart Claude Code.
Connect accounts at: https://zernio.com/dashboard
```

## Invocation

```
/tool-publisher                             ← lists draft posts, user picks one
/tool-publisher karpathy-quote              ← match by slug across dates
/tool-publisher 2026-05-02 karpathy-quote   ← exact date + slug
```

---

## Step 1: Identify the Post

### Resolve output path

Read `.claude/skills/tool-publisher/skill-pack/config/sys-config.md` → `## Paths` → `output_base` (and `decoupled_base`/`env_file` if needed). When this tool runs as part of `00-social-content`, the orchestrator's sys-config has the same values — installer keeps them in sync.
All slug resolution below uses `{output_base}/{date}/{slug}/` (date is the run date, slug is the post folder).

### With slug argument
Search `{output_base}/*/{slug}/post.yaml`. If multiple dates match, prefer the most recent. If not found, tell the user and stop.

### Without argument
Find all `post.yaml` files under `{output_base}/` where `status: draft` or `status: failed`.
Sort by date descending, limit to 30 days. List them, marking failed ones with `[failed]`:

```
Posts available to publish:

1. 2026-05-02-autoresearch-karpathy  —  linkedin · carousel · 4 slides
2. 2026-05-02-brucer-esa-arena-top1  —  linkedin · single image  [failed]

Which one do you want to publish? (number or slug)
```

If none found: "No posts with status draft or failed found in the last 30 days."

---

## Step 2: Load and Preview

Read:
- `{output_base}/{date}/{slug}/post.yaml` → `platform`, `format`, `slides` (if carousel)
- `{output_base}/{date}/{slug}/caption.md` → post text
- Detect images in `{output_base}/{date}/{slug}/`:
  - Single: `image.png`
  - Carousel: `slide-1.png`, `slide-2.png`, ... (enumerate until file not found)

Check `post.yaml` status field:
- If already `published`: warn the user — "This post has already been published. Do you want to publish it again?" — require explicit confirmation before continuing.
- If `failed`: proceed normally (retry).

Show preview:
```
---
{slug}
Platform: {platform} · Format: {single image | carousel — N slides}
Images: {count}
---
{first 150 chars of caption}...
---
Publish now? (yes / no)
```

If user says no: stop. No changes made.

---

## Step 3: Upload Images

### If post has images (image.png or slide-N.png exist)

### LinkedIn carousel → PDF option

If `platform` is `linkedin` AND `format` is `carousel`:

Ask the user:
```
LinkedIn carousels publish best as a PDF (swipeable document post).
How do you want to upload?
1. PDF (recommended — better engagement on LinkedIn)
2. Individual images (faster, works everywhere)
```

**If PDF:**
```bash
python .claude/skills/tool-publisher/scripts/slides_to_pdf.py "{output_base}/{date}/{slug}" --output "{output_base}/{date}/{slug}/carousel.pdf"
```
If the script fails (Pillow not installed or other error): fall back to individual images automatically and warn: "PDF packaging failed, uploading individual images instead."

Upload `carousel.pdf` as a single file instead of individual slides. Set `media_urls` from the single upload response.

**If individual images:** continue to step 1 below (upload normally).

For all other platforms or single-image posts: skip this section.

1. Call `media_generate_upload_link` → receive `upload_url` and `token`

2. Tell the user:
```
Open this link in your browser to upload the images:
{upload_url}

Files to upload (in order):
{list of filenames, one per line}

Files are located at: {output_base}/{date}/{slug}/

Confirm here when done.
```

3. Wait for user confirmation ("done", "ok", "ready")

4. Call `media_check_upload_status` with the token
   - If not complete yet: "Upload still processing, wait a few seconds and confirm again."
   - If complete: extract `media_urls` (comma-separated list of uploaded file URLs)

### If post has no images

Skip. Set `media_urls = ""`

---

## Step 4: Publish

Call `posts_publish_now` with:
- `content`: full text from `caption.md` (verbatim — no truncation)
- `platform`: value from `post.yaml`
- `media_urls`: from Step 3 (or `""` if no images)

If `posts_publish_now` is not available, call `posts_create` with `publish_now=true` and same parameters.

Capture the response: `post_id` and `post_url` (if returned).

---

## Step 5: Update post.yaml

### On success

Update `post.yaml` — change top-level `status` and add/update `publish` block:

```yaml
status: published

publish:
  status: published
  published_at: {ISO 8601 timestamp, e.g. 2026-05-02T14:32:00}
  platform_post_id: {post_id from Zernio response}
  post_url: {url if returned, else ~}
  error: ~
```

### On failure

```yaml
status: failed

publish:
  status: failed
  published_at: ~
  platform_post_id: ~
  post_url: ~
  error: "{error message}"
```

---

## Step 6: Log

Append one line to `{output_base}/publish-log.md`.

**Success:**
```
| {YYYY-MM-DDTHH:MM} | {platform} | {slug} | published | {post_url or —} |
```

**Failure:**
```
| {YYYY-MM-DDTHH:MM} | {platform} | {slug} | failed | {error summary} |
```

---

## Step 7: Report

### Success
```
Published to {platform}!
Post ID: {platform_post_id}
{post_url, if available}
```

### Failure
```
Failed to publish: {error}

post.yaml updated with status: failed.
```

Common fixes by error type:
- `401` / `Invalid API key`: check `ZERNIO_API_KEY` in `{env_file}`
- `No account connected`: connect `{platform}` at https://zernio.com/dashboard
- `Media upload failed` / `Upload not complete`: retry the upload
- `Rate limit`: wait a few minutes and try again
