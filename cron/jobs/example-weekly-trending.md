---
name: example-weekly-trending
schedule: "23 8 * * 1"
description: Weekly AI automation trending research (Mondays 8:23am)
model: sonnet
permission_mode: auto
max_budget_usd: 0.75
allowed_tools: "Read,Write,Grep,Glob,WebSearch,WebFetch"
enabled: false
---

You are running as an automated cron job for Agentic OS.

Read CLAUDE.md for system context. Read context/SOUL.md for voice guidelines.

Task: Research what's trending in AI automation over the last 7 days.
Focus on: Claude Code, n8n workflows, agentic systems, MCP servers.

Use the str-trending-research skill methodology:
1. Search Reddit for top threads in r/ClaudeAI, r/n8n, r/LocalLLaMA
2. Search X/Twitter for posts about Claude Code and n8n
3. Search web for recent blog posts and announcements

Save the research brief to:
projects/str-trending-research/weekly-ai-automation_{today's date in YYYY-MM-DD format}.md

Include in the brief:
- Top 5 Reddit discussions with upvote counts and key takeaways
- Top 5 X posts with engagement data
- Key themes and emerging patterns
- 3-5 content angles that could be turned into posts

If web search is unavailable, write a note to cron/logs/example-weekly-trending.log
explaining the failure and exit without creating the output file.
