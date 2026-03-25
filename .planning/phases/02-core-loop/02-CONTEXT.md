# Phase 2: Core Loop - Context

**Gathered:** 2026-03-25
**Status:** Ready for planning

<domain>
## Phase Boundary

Infrastructure, Kanban board, task execution, and live updates working end-to-end. A user can create a task, watch it execute via a live Kanban board, and see the card move through columns in real time. Covers: Next.js scaffolding, SQLite schema, REST API, SSE streaming, Claude CLI process manager, and Kanban board UI with drag-and-drop.

</domain>

<decisions>
## Implementation Decisions

### Live update experience
- Running cards show **live counters + activity label**: real-time cost and token count ticking up, plus a one-line "currently doing" description (e.g., "Writing email draft...")
- Raw Claude terminal output is **hidden from the board** but available in the **slide-out detail panel** as a live-scrolling log when the user clicks a running card
- Completed tasks move to **Review column first** (not straight to Done) — user manually drags to Done after checking outputs. This is a human checkpoint.
- Errored tasks **auto-move to Review** with a red error badge and error message preview. User triages from Review.

### Design reference integration
- Build references Stitch designs **live via tool-stitch MCP** — executor fetches screen HTML/CSS from the Stitch project during build
- Fetch happens **per-component** as each component is being built (not a one-time batch). This ensures the executor always has the latest version if designs were iterated in Stitch.
- **Stitch project ID: `1180886342482325280`** — already set up with generated screens from Phase 1 prompts
- The stitch-prompt-*.md files from Phase 1 serve as supplementary text specs alongside the live Stitch designs

### Card & board behavior
- **All columns accept drag-and-drop freely** — no restrictions. The board is the user's workspace.
- Moving a card to **Queued auto-triggers execution** — the system picks it up and starts running it (FIFO). No manual "Run" button needed.
- **Unlimited concurrent tasks** — all queued tasks spawn immediately as parallel Claude sessions. No concurrency limit.
- **Project and GSD child tasks are separate cards** on the board, visually grouped under the parent with indent or connector. Each child moves through columns independently.

### Claude's Discretion
- Task creation input design (single-line vs multi-line, placement on board)
- Exact drag-and-drop animation and visual affordances
- SSE event format and API endpoint structure
- SQLite schema design
- Process manager implementation details
- How the "currently doing" activity label is derived from Claude's output stream

</decisions>

<specifics>
## Specific Ideas

- Review column serves as a human checkpoint for both completed and errored tasks — it's the "inbox" for things needing attention
- The Stitch designs are the visual source of truth — executor should match them closely, fetching per-component via `tool-stitch` MCP with project ID `1180886342482325280`
- Unlimited parallelism means the process manager needs to be robust — many Claude sessions running simultaneously
- Child tasks as separate cards means the board could get busy with large Projects/GSDs — visual grouping needs to be clear

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-core-loop*
*Context gathered: 2026-03-25*
