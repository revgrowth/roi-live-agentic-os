---
project: command-centre
status: active
level: 3
created: 2025-03-25
---

# Agentic OS Command Centre

## Goal

Replace the terminal as the daily working environment for non-technical Agentic OS users. A locally hosted dashboard where business users describe work, monitor agents, and download outputs — without ever touching the CLI.

## Deliverables

- [ ] Full Kanban dashboard with 5 columns (Backlog, Queued, Running, Review, Done)
- [ ] Three task levels (Task, Project, GSD) with visual distinction and drill-down
- [ ] Cron job scheduling and monitoring with run history
- [ ] Output file management with inline preview and download
- [ ] Cost and token tracking per task and global stats bar
- [ ] Context, Brand, and Skills management tabs
- [ ] Multi-client switching
- [ ] Claude CLI subprocess spawning from configurable agentic-os directory
- [ ] SSE-based live progress updates with file appearance notifications
- [ ] SQLite persistence, local-only, no accounts

## Acceptance Criteria

- A student can launch the command centre, create a task by describing it in plain language, watch it execute, and download the output — all without opening a terminal
- All Agentic OS context (skills, brand, memory, CLAUDE.md) is inherited by spawned sessions
- Multi-client scoping works across all views

## Constraints

- Local-only, no cloud dependency
- Design phase uses Google Stitch (handled separately before build)
- Must work as `npx`-style one-command install for eventual npm publish
- Target users are non-technical business owners and Academy students

## Planning

GSD artifacts: `.planning/`
