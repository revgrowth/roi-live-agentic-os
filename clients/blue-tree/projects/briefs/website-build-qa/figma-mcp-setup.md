---
project: website-build-qa
purpose: One-time setup so Claude Code can query Figma directly for the Phase 0 visual audit
created: 2026-05-13
status: action-required (Jason)
estimated_time: 5 minutes
---

# Figma MCP Setup — Claude Code

## Why this file exists

Session 2026-05-13 verified that **no Figma MCP server is configured** in this Claude Code instance. The available MCPs this session are ClickUp, Gmail, Google Calendar, and Google Drive only. The "Figma MCP hit Starter plan rate limit" note from yesterday's audit was likely a misattribution — there is no `figma-*` server in either user-scope `~/.claude.json` or project-scope `.claude/settings.json`. The audit needs Figma access restored before it can resume on Home / About / Our Story / Our Process.

## Claude chat / Desktop vs Claude Code — they are not the same MCP pool

Claude chat (claude.ai web) and Claude Desktop reach Figma through **server-side connectors** that Anthropic hosts and curates. You manage them at `claude.ai/settings → Connectors`. Claude Code sessions inherit a subset of those connectors at session start (currently visible in this session: Canva, Zapier, Gmail, Calendar, Drive, ClickUp).

**Verified 2026-05-13:** Jason's Customize → Connectors panel shows Figma as **Connected** under "Web" connectors with 13 tools (1 interactive: Generate Diagram; 12 read-only: Get Screenshot, Get Metadata, Get Design Context, Get Variable Definitions, Get FigJam Content, Get Code Connect Mapping, Create Design System Rules, Who Am I, +3 more). This means the connector is enabled at the account level. The reason it isn't surfacing in the current Code session is the session was launched before the connector was enabled.

### Path A — Restart Claude Code (try first, faster)

1. Close this Claude Code window completely
2. Reopen Claude Code in `clients/blue-tree/`
3. First prompt: "List your available Figma tools"
4. If `mcp__claude_ai_Figma__*` tools appear → proceed straight to `deliverables/figma-audit.md`. Skip Path B.
5. If they still don't appear → the claude.ai Figma connector isn't exposed to the Code surface yet (Anthropic-side restriction). Fall to Path B.

### Path B — Local MCP (fallback, works regardless)

If Path A fails, run the steps in the next section. Local MCPs run on this machine and don't depend on Anthropic's per-surface connector catalog. ~5 minutes.

Claude Desktop's local MCP config (`%APPDATA%\Claude\claude_desktop_config.json`) currently has only `obsidian-vault` and `seo-utils` — no Figma local server there. Desktop's Figma access is purely via the server-side connector, same as chat.

## Recommended: `figma-developer-mcp` (GLips, community)

Works on the **Figma free/Starter plan**. Uses Figma's REST API with a personal access token. No desktop app required, no paid Dev seat needed. This is the right pick given the Blue Tree workspace is on Starter.

The alternative is Figma's official Dev Mode MCP server, which requires a paid Dev or Full seat and the Figma desktop app running with the file open. Not needed for visual audit.

## Setup steps (5 min)

### 1. Generate a Figma personal access token

1. Go to https://www.figma.com/settings
2. Scroll to **Personal access tokens**
3. Click **Generate new token**
4. Name it `claude-code-blue-tree`
5. Scopes (minimum needed for this audit):
   - **File content** → Read
   - **Library content** → Read
   - **Library analytics** → Read (optional, lets us spot component reuse)
6. Click **Generate token**
7. **Copy the token immediately** — Figma only shows it once

### 2. Add the MCP server

Pick one of two scopes:

**User-scope (recommended)** — available in every Claude Code project, every client folder:

```
claude mcp add --scope user figma-developer-mcp -e FIGMA_API_KEY=PASTE_TOKEN_HERE -- npx -y figma-developer-mcp --stdio
```

**Project-scope** — only available inside `clients/blue-tree/`:

```
claude mcp add figma-developer-mcp -e FIGMA_API_KEY=PASTE_TOKEN_HERE -- npx -y figma-developer-mcp --stdio
```

Replace `PASTE_TOKEN_HERE` with the token from step 1. Run from PowerShell or Bash, doesn't matter — `claude` is the same binary either way.

### 3. Restart Claude Code

Close this Claude Code instance and reopen it. The Figma MCP tools will register on startup (look for `mcp__figma-developer-mcp__*` tool names appearing in the deferred-tools list).

### 4. Verify

In the new session, paste this prompt:

> "Confirm Figma MCP is loaded — list available figma-developer-mcp tools and pull the file metadata for `https://www.figma.com/design/leXDzLrKd1zucGnwQbTWOB/Blue-Tree`."

Expected outcome: tools appear, file metadata returns Blue Tree file name + last-modified timestamp.

### 5. Resume the audit

Next prompt:

> "Resume Phase 0 Figma audit — Home, About, Our Story, Our Process. Use `deliverables/figma-audit.md` as the scaffold."

The scaffold at `projects/briefs/website-build-qa/deliverables/figma-audit.md` is pre-filled with target nodes and severity schema. Claude will populate findings node-by-node.

## Rate-limit discipline (avoid yesterday's failure mode)

Figma's REST API has token-level cost limits, not plan-tier limits. The "Starter plan rate limit" terminology was wrong — it's a per-token, per-time-window budget. To stay under it:

- **Batch reads.** Pull a single page's worth of nodes per call, not 17 pages at once.
- **Cache locally.** Once a node tree is fetched, write it to `deliverables/figma-cache/{page-slug}.json` and re-read from disk rather than re-querying.
- **Pace.** ~30 seconds between calls on heavy fetches is safe.
- **Watch for `429` responses.** If hit, back off 60 seconds before retry.

The scaffold enforces this pattern.

## File reference

- **Figma file URL:** https://www.figma.com/design/leXDzLrKd1zucGnwQbTWOB/Blue-Tree
- **Figma file ID:** `leXDzLrKd1zucGnwQbTWOB`
- **Frame families in scope today:** Home (1), About (3 — About / Our Story / Our Process)

## Security

- The personal access token grants read access to **every Figma file the token owner can see**. Treat it like a password.
- Stored only as an env var via `claude mcp add -e` — does not get written to git.
- Revoke at https://www.figma.com/settings if the laptop is ever compromised.
- Do **not** commit the raw token to `.env`, `.mcp.json`, or any markdown file in this repo.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `mcp__figma-developer-mcp__*` tools not appearing after restart | Token has typo or wrong scopes | Re-run `claude mcp add` with corrected token |
| Tools appear but every call returns `401` | Token revoked or expired | Generate new token, re-run `claude mcp add` |
| `429 Too Many Requests` | REST API rate limit | Back off 60s, then resume; batch reads per the discipline above |
| `Forbidden` on a specific file | Token owner doesn't have access to that file | Confirm Jason is shared on the Blue Tree Figma file |
| `npx` cannot find `figma-developer-mcp` | Node/npm not installed or PATH issue | Run `npm install -g figma-developer-mcp` then retry |

---

*Once steps 1-4 are complete, this file can be archived. The audit scaffold at `deliverables/figma-audit.md` becomes the active workspace.*
