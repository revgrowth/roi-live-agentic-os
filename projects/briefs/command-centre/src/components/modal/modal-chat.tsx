"use client";

import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { ArrowUp } from "lucide-react";
import type { Task, LogEntry, PermissionMode } from "@/types/task";
import { ChatEntry, TextGroup, ToolSummaryBlock, FileOutputCard, isFileOutputEntry, parseFileOutput } from "./chat-entry";
import {
  parseQuestionSpecs,
  serializeAnswersToProse,
  type QuestionSpec,
  type QuestionAnswers,
} from "@/types/question-spec";
import { QuestionModal } from "@/components/shared/question-modal";

/* ── Claude-style spinner verbs ─────────────────────────────────────── */

const SPINNER_VERBS = [
  "Accomplishing", "Actioning", "Actualizing", "Architecting", "Baking",
  "Beaming", "Beboppin'", "Befuddling", "Billowing", "Blanching",
  "Bloviating", "Boogieing", "Boondoggling", "Booping", "Bootstrapping",
  "Brewing", "Bunning", "Burrowing", "Calculating", "Canoodling",
  "Caramelizing", "Cascading", "Catapulting", "Cerebrating", "Channeling",
  "Choreographing", "Churning", "Clauding", "Coalescing", "Cogitating",
  "Combobulating", "Composing", "Computing", "Concocting", "Considering",
  "Contemplating", "Cooking", "Crafting", "Creating", "Crunching",
  "Crystallizing", "Cultivating", "Deciphering", "Deliberating",
  "Dilly-dallying", "Discombobulating", "Doodling", "Drizzling",
  "Ebbing", "Effecting", "Elucidating", "Embellishing", "Enchanting",
  "Envisioning", "Evaporating", "Fermenting", "Fiddle-faddling",
  "Finagling", "Flambe-ing", "Flibbertigibbeting", "Flowing",
  "Flummoxing", "Fluttering", "Forging", "Forming", "Frolicking",
  "Frosting", "Gallivanting", "Galloping", "Garnishing", "Generating",
  "Gesticulating", "Germinating", "Grooving", "Gusting", "Harmonizing",
  "Hashing", "Hatching", "Herding", "Honking", "Hullaballooing",
  "Hyperspacing", "Ideating", "Imagining", "Improvising", "Incubating",
  "Inferring", "Infusing", "Ionizing", "Jitterbugging", "Julienning",
  "Kneading", "Leavening", "Levitating", "Lollygagging", "Manifesting",
  "Marinating", "Meandering", "Metamorphosing", "Misting", "Moonwalking",
  "Moseying", "Mulling", "Mustering", "Musing", "Nebulizing", "Nesting",
  "Noodling", "Nucleating", "Orbiting", "Orchestrating", "Osmosing",
  "Perambulating", "Percolating", "Perusing", "Philosophising",
  "Photosynthesizing", "Pollinating", "Pondering", "Pontificating",
  "Pouncing", "Precipitating", "Prestidigitating", "Processing",
  "Proofing", "Propagating", "Puttering", "Puzzling", "Quantumizing",
  "Razzle-dazzling", "Razzmatazzing", "Recombobulating", "Reticulating",
  "Roosting", "Ruminating", "Sauteing", "Scampering", "Schlepping",
  "Scurrying", "Seasoning", "Shenaniganing", "Shimmying", "Simmering",
  "Skedaddling", "Sketching", "Slithering", "Smooshing", "Sock-hopping",
  "Spelunking", "Spinning", "Sprouting", "Stewing", "Sublimating",
  "Swirling", "Swooping", "Symbioting", "Synthesizing", "Tempering",
  "Thinking", "Thundering", "Tinkering", "Tomfoolering", "Topsy-turvying",
  "Transfiguring", "Transmuting", "Twisting", "Undulating", "Unfurling",
  "Unravelling", "Vibing", "Waddling", "Wandering", "Warping",
  "Whatchamacalliting", "Whirlpooling", "Whirring", "Whisking",
  "Wibbling", "Working", "Wrangling", "Zesting", "Zigzagging",
];

function randomVerb(): string {
  return SPINNER_VERBS[Math.floor(Math.random() * SPINNER_VERBS.length)];
}

/** Claude-style spinner: cycles through random verbs with a spinning asterisk. */
function SpinnerVerb({ startedAt, activityLabel }: { startedAt?: string | null; activityLabel?: string | null }) {
  const [verb, setVerb] = useState(randomVerb);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setVerb(randomVerb()), 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!startedAt) return;
    const start = new Date(startedAt).getTime();
    if (isNaN(start)) return;
    const tick = () => setElapsed(Math.floor((Date.now() - start) / 1000));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [startedAt]);

  return (
    <>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 2px",
      }}
    >
      <span
        style={{
          display: "inline-block",
          fontSize: 16,
          color: "#C4784E",
          animation: "spin 1.5s linear infinite",
        }}
      >
        ✳
      </span>
      <span
        style={{
          fontSize: 14,
          fontFamily: "'DM Mono', monospace",
          color: "#C4784E",
          fontWeight: 500,
        }}
      >
        {verb}…
      </span>
      {elapsed > 0 && (
        <span
          style={{
            fontSize: 12,
            fontFamily: "'DM Mono', monospace",
            color: "#b5b3b0",
            fontWeight: 400,
          }}
        >
          {formatDuration(elapsed)}
        </span>
      )}
    </div>
    {activityLabel && (
      <div
        style={{
          fontSize: 11,
          fontFamily: "'DM Mono', monospace",
          color: "#b5b3b0",
          paddingLeft: 24,
          marginTop: -4,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {activityLabel}
      </div>
    )}
    </>
  );
}

/** Format seconds into "Xm Ys" or "Xs". */
function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

/** Convert "Sauteing" → "Sautéed", "Cooking" → "Cooked", etc. */
function toPastTense(verb: string): string {
  // Special cases
  const specials: Record<string, string> = {
    "Sauteing": "Sautéed", "Beboppin'": "Bebopped", "Clauding": "Clauded",
    "Flambe-ing": "Flambéed", "Sock-hopping": "Sock-hopped",
  };
  if (specials[verb]) return specials[verb];
  // Remove "ing" and figure out the past tense
  let stem = verb.replace(/ing$/, "");
  // Double consonant: "Running" → "Runn" → "Ran" (but we just add "ed")
  // Words ending in consonant+consonant: "Hashing" → "Hash" → "Hashed"
  if (stem.endsWith("ll") || stem.endsWith("tt") || stem.endsWith("pp") || stem.endsWith("rr") || stem.endsWith("ss") || stem.endsWith("zz") || stem.endsWith("nn") || stem.endsWith("mm") || stem.endsWith("dd") || stem.endsWith("gg") || stem.endsWith("bb")) {
    return stem + "ed";
  }
  // Words like "Cascading" → "Cascad" → need "Cascaded"
  // Words like "Creating" → "Creat" → "Created"
  // If stem ends in consonant, check if the original word had a trailing "e" before "ing"
  const lastChar = stem.slice(-1);
  if (!"aeiou".includes(lastChar.toLowerCase())) {
    // Try adding "ed" directly
    return stem + "ed";
  }
  // Stem ends in vowel — likely had trailing "e": "Composing" → "Compos" → "Composed"
  return stem + "d";
}

/** Persist random verbs across re-renders by taskId */
const completedVerbCache = new Map<string, string>();

/** "Sautéed for Xm Ys · 2,847 tokens · $0.47" — shown after a task completes. */
function CompletedVerb({
  durationSeconds,
  costUsd,
  tokensUsed,
  taskId,
  isReview,
}: {
  durationSeconds: number;
  costUsd?: number | null;
  tokensUsed?: number | null;
  taskId?: string;
  isReview?: boolean;
}) {
  const [verb] = useState(() => {
    if (taskId && completedVerbCache.has(taskId)) return completedVerbCache.get(taskId)!;
    const v = randomVerb();
    if (taskId) completedVerbCache.set(taskId, v);
    return v;
  });

  const accentColor = "#93452A";
  const mutedColor = "#b5b3b0";
  const color = isReview ? accentColor : mutedColor;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 2px",
        flexWrap: "wrap",
      }}
    >
      <span style={{ fontSize: 14, color }}>✳</span>
      <span
        style={{
          fontSize: 14,
          fontFamily: "'DM Mono', monospace",
          color,
          fontWeight: isReview ? 500 : 400,
        }}
      >
        {isReview ? "Your turn · " : ""}{toPastTense(verb)} for {formatDuration(durationSeconds)}
        {tokensUsed != null && tokensUsed > 0 && (
          <span style={{ color: mutedColor, fontWeight: 400 }}> · {tokensUsed.toLocaleString()} tokens</span>
        )}
        {costUsd != null && costUsd > 0 && (
          <span style={{ color: mutedColor, fontWeight: 400 }}> · ${costUsd.toFixed(2)}</span>
        )}
      </span>
    </div>
  );
}

/** Red error banner shown when a task fails. */
function ErrorBanner({ message }: { message: string }) {
  return (
    <div
      style={{
        background: "#FFF5F3",
        borderLeft: "3px solid #DC2626",
        borderRadius: "0 0.5rem 0.5rem 0",
        padding: "10px 14px",
        marginBottom: 4,
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
          fontWeight: 600,
          color: "#DC2626",
          marginBottom: 4,
        }}
      >
        Error
      </div>
      <div
        style={{
          fontSize: 12,
          fontFamily: "'DM Mono', monospace",
          color: "#1B1C1B",
          lineHeight: 1.5,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {message}
      </div>
    </div>
  );
}

/**
 * Group consecutive entries for business-focused rendering:
 * - Consecutive text entries → TextGroup (merged prose)
 * - Consecutive tool_use / tool_result entries → ToolSummaryBlock (collapsed summary)
 * - Everything else (question, user_reply, system) → individual ChatEntry
 */
type RenderItem =
  | { kind: "text-group"; entries: LogEntry[] }
  | { kind: "tool-group"; entries: LogEntry[] }
  | { kind: "file-output"; entry: LogEntry }
  | { kind: "single"; entry: LogEntry }
  | { kind: "child-question"; childTask: Task; entry: LogEntry }
  | { kind: "child-review"; childTask: Task };

/** A merged timeline entry with a sort key */
type TimelineEntry =
  | { kind: "parent"; entry: LogEntry }
  | { kind: "child-question"; childTask: Task; entry: LogEntry }
  | { kind: "child-review"; childTask: Task; timestamp: string };

function groupEntries(entries: LogEntry[]): RenderItem[] {
  const items: RenderItem[] = [];
  let currentTextGroup: LogEntry[] = [];
  let currentToolGroup: LogEntry[] = [];

  const flushTextGroup = () => {
    if (currentTextGroup.length > 0) {
      items.push({ kind: "text-group", entries: [...currentTextGroup] });
      currentTextGroup = [];
    }
  };

  const flushToolGroup = () => {
    if (currentToolGroup.length > 0) {
      items.push({ kind: "tool-group", entries: [...currentToolGroup] });
      currentToolGroup = [];
    }
  };

  for (const entry of entries) {
    if (entry.type === "text") {
      flushToolGroup();
      currentTextGroup.push(entry);
    } else if (entry.type === "tool_use" || entry.type === "tool_result") {
      flushTextGroup();
      // File writes/edits get their own inline card in-line with surrounding tools
      if (entry.type === "tool_use" && isFileOutputEntry(entry)) {
        flushToolGroup();
        items.push({ kind: "file-output", entry });
      } else {
        currentToolGroup.push(entry);
      }
    } else if (
      entry.type === "system" &&
      currentToolGroup.length > 0 &&
      /permission|approved|denied|waiting for|plan approval/i.test(entry.content)
    ) {
      // Absorb permission/tool-related system messages into the current
      // tool group so they don't break the collapsed summary into many
      // small blocks separated by permission lines.
      currentToolGroup.push(entry);
    } else {
      flushTextGroup();
      flushToolGroup();
      items.push({ kind: "single", entry });
    }
  }
  flushTextGroup();
  flushToolGroup();

  return items;
}

/**
 * Build a merged timeline of parent log entries and child task events,
 * then group the parent entries as before while inserting child events
 * at the correct chronological position.
 */
function buildMergedTimeline(
  parentEntries: LogEntry[],
  childTasks: Task[],
  childLogEntries: Record<string, LogEntry[]>,
): RenderItem[] {
  // Collect all timeline entries
  const timeline: TimelineEntry[] = [];

  // Add all parent entries
  for (const entry of parentEntries) {
    timeline.push({ kind: "parent", entry });
  }

  // Add child question entries and review banners
  for (const child of childTasks) {
    const childLogs = childLogEntries[child.id] || [];
    for (const entry of childLogs) {
      if (entry.type === "question") {
        timeline.push({ kind: "child-question", childTask: child, entry });
      }
    }
    // If child is in review status, add a review banner
    if (child.status === "review") {
      timeline.push({
        kind: "child-review",
        childTask: child,
        timestamp: child.updatedAt,
      });
    }
  }

  // Sort by timestamp
  timeline.sort((a, b) => {
    const tsA = a.kind === "parent" ? a.entry.timestamp
      : a.kind === "child-question" ? a.entry.timestamp
      : a.timestamp;
    const tsB = b.kind === "parent" ? b.entry.timestamp
      : b.kind === "child-question" ? b.entry.timestamp
      : b.timestamp;
    return tsA.localeCompare(tsB);
  });

  // Now group: collect consecutive parent entries and group them,
  // insert child events as standalone items
  const result: RenderItem[] = [];
  let parentBuffer: LogEntry[] = [];

  const flushParentBuffer = () => {
    if (parentBuffer.length > 0) {
      result.push(...groupEntries(parentBuffer));
      parentBuffer = [];
    }
  };

  for (const item of timeline) {
    if (item.kind === "parent") {
      parentBuffer.push(item.entry);
    } else if (item.kind === "child-question") {
      flushParentBuffer();
      result.push({ kind: "child-question", childTask: item.childTask, entry: item.entry });
    } else if (item.kind === "child-review") {
      flushParentBuffer();
      result.push({ kind: "child-review", childTask: item.childTask });
    }
  }
  flushParentBuffer();

  return result;
}

/** Compact inline reply input for child task questions */
function ChildReplyInput({ childTaskId, onReplySent }: { childTaskId: string; onReplySent: (childId: string, message: string) => void }) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = useCallback(async () => {
    const trimmed = message.trim();
    if (!trimmed || isSending) return;

    setIsSending(true);
    setMessage("");

    try {
      const res = await fetch(`/api/tasks/${childTaskId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      if (res.ok) {
        onReplySent(childTaskId, trimmed);
      }
    } catch {
      // Silently fail
    } finally {
      setIsSending(false);
    }
  }, [message, isSending, childTaskId, onReplySent]);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
        }}
        placeholder="Reply to this subtask..."
        style={{
          flex: 1,
          fontSize: 13,
          fontFamily: "var(--font-inter), Inter, sans-serif",
          padding: "6px 10px",
          backgroundColor: "#FFFFFF",
          border: "1px solid rgba(218, 193, 185, 0.4)",
          borderRadius: "0.375rem",
          color: "#1B1C1B",
          outline: "none",
          lineHeight: 1.4,
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = "#93452A"; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(218, 193, 185, 0.4)"; }}
      />
      <button
        onClick={handleSubmit}
        disabled={!message.trim() || isSending}
        style={{
          width: 28,
          height: 28,
          borderRadius: "0.375rem",
          border: "none",
          background: message.trim() && !isSending
            ? "linear-gradient(135deg, #93452A, #B25D3F)"
            : "#EAE8E6",
          color: message.trim() && !isSending ? "#FFFFFF" : "#5E5E65",
          cursor: message.trim() && !isSending ? "pointer" : "default",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transition: "background 150ms ease",
        }}
      >
        <ArrowUp size={14} />
      </button>
    </div>
  );
}

interface ModalChatProps {
  taskId: string;
  logEntries: LogEntry[];
  isRunning: boolean;
  needsInput: boolean;
  status: string;
  childTasks?: Task[];
  childLogEntries?: Record<string, LogEntry[]>;
  onPreviewFile?: (file: { relativePath: string; extension: string; fileName: string }) => void;
  activePreviewPath?: string | null;
  /**
   * Read-only mode: used when this chat is rendered as a parent "aggregated
   * activity" surface. Hides inline child reply inputs — the user replies to
   * subtasks by drilling into them directly.
   */
  readOnly?: boolean;
  /** When set, scroll to the first log entry from this source task ID. */
  scrollToTaskId?: string | null;
  /** Called after the scroll completes (so parent can clear the state). */
  onScrollComplete?: () => void;
  /** Permission mode of the task — shown on user reply bubbles. */
  permissionMode?: PermissionMode;
  /** Current activity label from Claude (e.g. "Reading file...", "Writing code...") */
  activityLabel?: string | null;
  /** ISO timestamp when the task started running — used for elapsed timer */
  startedAt?: string | null;
  /** Cost in USD from Claude API */
  costUsd?: number | null;
  /** Total tokens used */
  tokensUsed?: number | null;
  /** Error message if the task failed */
  errorMessage?: string | null;
  /** Actual Claude CLI compute time in ms (accumulated across turns) */
  durationMs?: number | null;
}

export function ModalChat({
  taskId,
  logEntries,
  isRunning,
  needsInput,
  status,
  childTasks = [],
  childLogEntries = {},
  onPreviewFile,
  activePreviewPath,
  readOnly = false,
  scrollToTaskId,
  onScrollComplete,
  permissionMode,
  activityLabel,
  startedAt,
  costUsd,
  tokensUsed,
  errorMessage,
  durationMs,
}: ModalChatProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showJumpButton, setShowJumpButton] = useState(false);
  const prevLengthRef = useRef(logEntries.length);

  // Use the actual Claude CLI compute time (durationMs) when available.
  // Falls back to log-based estimation, capped per-turn to avoid wall-clock inflation.
  const totalWorkSeconds = useMemo(() => {
    if (durationMs != null && durationMs > 0) {
      return Math.round(durationMs / 1000);
    }
    // Fallback: estimate from log timestamps, but cap each turn at 30 min
    // to avoid counting idle time as compute time.
    const MAX_TURN_MS = 30 * 60 * 1000;
    if (logEntries.length === 0) return 0;
    let total = 0;
    let runStart: number | null = null;
    for (const entry of logEntries) {
      const ts = new Date(entry.timestamp).getTime();
      if (isNaN(ts)) continue;
      if (entry.type === "user_reply") {
        if (runStart !== null) {
          total += Math.min(ts - runStart, MAX_TURN_MS);
          runStart = null;
        }
      } else {
        if (runStart === null) runStart = ts;
      }
    }
    // If still in a run, cap it too
    if (runStart !== null) {
      total += Math.min(Date.now() - runStart, MAX_TURN_MS);
    }
    return Math.round(total / 1000);
  }, [durationMs, logEntries]);
  // Ref mirror of auto-scroll state — read synchronously inside effects
  // and scroll handlers so we don't fight the user with stale closure state
  // while entries stream in rapidly.
  const isAutoScrollingRef = useRef(true);
  // Flag set just before programmatic scrolls so the onScroll handler
  // knows to ignore them (otherwise they'd be misread as user input).
  const isProgrammaticScrollRef = useRef(false);

  // Auto-scroll on new entries
  useEffect(() => {
    if (logEntries.length > prevLengthRef.current && isAutoScrollingRef.current) {
      const el = scrollRef.current;
      if (el) {
        isProgrammaticScrollRef.current = true;
        el.scrollTop = el.scrollHeight;
      }
    }
    prevLengthRef.current = logEntries.length;
  }, [logEntries.length]);

  // Jump to the bottom (most recent message) when the chat first mounts
  // and when the user switches to a different task. Otherwise opening a
  // long transcript would start at the top, hiding recent context.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    // Defer to next frame so the log entries have laid out.
    requestAnimationFrame(() => {
      if (!scrollRef.current) return;
      isProgrammaticScrollRef.current = true;
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      isAutoScrollingRef.current = true;
      prevLengthRef.current = logEntries.length;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  // Detect user scroll
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    // Ignore scroll events triggered by our own programmatic scrolling
    if (isProgrammaticScrollRef.current) {
      isProgrammaticScrollRef.current = false;
      return;
    }
    const isNearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 40;
    isAutoScrollingRef.current = isNearBottom;
    setShowJumpButton(!isNearBottom);
  }, []);

  const jumpToLatest = useCallback(() => {
    const el = scrollRef.current;
    if (el) {
      isProgrammaticScrollRef.current = true;
      el.scrollTop = el.scrollHeight;
    }
    isAutoScrollingRef.current = true;
    setShowJumpButton(false);
  }, []);

  // Scroll to a specific subtask's entries when scrollToTaskId is set
  useEffect(() => {
    if (!scrollToTaskId || !scrollRef.current) return;
    const target = scrollRef.current.querySelector(`[data-source-task="${scrollToTaskId}"]`);
    if (target) {
      isProgrammaticScrollRef.current = true;
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      // Briefly highlight the target
      (target as HTMLElement).style.outline = "2px solid rgba(147, 69, 42, 0.3)";
      (target as HTMLElement).style.borderRadius = "8px";
      setTimeout(() => {
        (target as HTMLElement).style.outline = "none";
      }, 2000);
    }
    onScrollComplete?.();
  }, [scrollToTaskId, onScrollComplete]);

  // Track child replies sent inline so they appear immediately
  const [childReplies, setChildReplies] = useState<Record<string, string[]>>({});

  const handleChildReplySent = useCallback((childId: string, message: string) => {
    setChildReplies((prev) => ({
      ...prev,
      [childId]: [...(prev[childId] || []), message],
    }));
  }, []);

  const hasChildren = childTasks.length > 0;
  const hasEntries = logEntries.length > 0;
  const neverStarted = status === "backlog" || status === "queued";
  const showEmpty = !hasEntries && !hasChildren && neverStarted;
  const showLoading = !hasEntries && !hasChildren && !neverStarted && !isRunning;
  const showTyping = isRunning && !hasEntries && !needsInput;

  // Build merged timeline when there are child tasks, otherwise use simple grouping
  const renderItems = hasChildren
    ? buildMergedTimeline(logEntries, childTasks, childLogEntries)
    : groupEntries(logEntries);

  // Set of child task IDs that currently need input (have unanswered questions)
  const childrenNeedingInput = new Set(
    childTasks.filter((c) => c.needsInput).map((c) => c.id)
  );

  // Surface the most recent question so the drill-in view makes it obvious
  // WHY a task is waiting and WHAT it asked. Without this, a subtask blocked
  // on (e.g.) a permission prompt looks identical to one just still running.
  const latestQuestionEntry =
    needsInput && !readOnly
      ? [...logEntries]
          .reverse()
          .find((e) => e.type === "question" || e.type === "structured_question")
      : null;
  const latestQuestionSnippet = latestQuestionEntry
    ? (latestQuestionEntry.content || "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 160)
    : null;

  // Detect pending structured questions for inline rendering at the bottom
  // of the chat — more prominent than relying on the timeline entry alone.
  const pendingStructuredEntry = useMemo(() => {
    for (let i = logEntries.length - 1; i >= 0; i--) {
      const e = logEntries[i];
      if (e.type === "structured_question" && !e.questionAnswers) {
        try {
          const specs = e.questionSpec
            ? parseQuestionSpecs(JSON.parse(e.questionSpec))
            : [];
          if (specs.length > 0) return { entryId: e.id, specs, content: e.content };
        } catch { /* ignore */ }
      }
    }
    return null;
  }, [logEntries]);

  const [inlineSubmitted, setInlineSubmitted] = useState(false);
  // Reset submitted state when the pending question changes
  useEffect(() => {
    setInlineSubmitted(false);
  }, [pendingStructuredEntry?.entryId]);

  const handleInlineQuestionSubmit = useCallback(async (answers: QuestionAnswers) => {
    if (!taskId || !pendingStructuredEntry) return;
    const prose = serializeAnswersToProse(pendingStructuredEntry.specs, answers);
    try {
      await fetch(`/api/tasks/${taskId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prose }),
      });
      setInlineSubmitted(true);
    } catch { /* allow retry */ }
  }, [taskId, pendingStructuredEntry]);

  const showInlineQuestionForm = pendingStructuredEntry && !inlineSubmitted;

  return (
    <div
      style={{
        flex: 1,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {needsInput && !readOnly && (
        <button
          type="button"
          onClick={jumpToLatest}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            textAlign: "left",
            cursor: "pointer",
            margin: "12px 24px 0",
            padding: "10px 14px",
            border: "1px solid rgba(232, 149, 109, 0.55)",
            borderRadius: 10,
            background: "#fffaf6",
            color: "#93452A",
            fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
            fontSize: 12,
            lineHeight: 1.4,
          }}
        >
          <span
            aria-hidden
            style={{
              display: "inline-block",
              width: 8,
              height: 8,
              borderRadius: 999,
              background: "#e8956d",
              flexShrink: 0,
            }}
          />
          <span style={{ flex: 1, minWidth: 0 }}>
            <strong style={{ fontWeight: 600 }}>Waiting for your reply</strong>
            {latestQuestionSnippet ? (
              <>
                {" · "}
                <span style={{ color: "#6b4a3d", fontStyle: "italic" }}>
                  {latestQuestionSnippet}
                  {latestQuestionEntry && (latestQuestionEntry.content || "").length > 160 ? "…" : ""}
                </span>
              </>
            ) : (
              <span style={{ color: "#6b4a3d" }}>
                {" "}· tap to jump to the question
              </span>
            )}
          </span>
        </button>
      )}

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "24px 24px 16px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {/* Empty state */}
        {showEmpty && (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontSize: 14,
                fontFamily: "var(--font-inter), Inter, sans-serif",
                color: "#5E5E65",
              }}
            >
              Task has not been executed yet
            </span>
          </div>
        )}

        {/* Loading state */}
        {showLoading && (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontSize: 14,
                fontFamily: "var(--font-inter), Inter, sans-serif",
                color: "#5E5E65",
              }}
            >
              Loading logs...
            </span>
          </div>
        )}

        {/* Typing indicator — before any entries arrive */}
        {showTyping && <SpinnerVerb startedAt={startedAt} activityLabel={activityLabel} />}

        {/* Log entries — business-focused grouping with child task events */}
        {renderItems.map((item) => {
          // Derive source task ID from the first entry in each group
          const sourceId =
            "entries" in item ? item.entries[0]?.sourceTaskId
            : "entry" in item ? item.entry?.sourceTaskId
            : undefined;

          if (item.kind === "text-group") {
            return (
              <div key={item.entries[0].id} data-source-task={sourceId}>
                <TextGroup
                  entries={item.entries}
                  onPreviewFile={onPreviewFile}
                />
              </div>
            );
          }
          if (item.kind === "tool-group") {
            return (
              <div key={item.entries[0].id} data-source-task={sourceId}>
                <ToolSummaryBlock
                  entries={item.entries}
                />
              </div>
            );
          }
          if (item.kind === "file-output") {
            const info = parseFileOutput(item.entry);
            const active = !!info && activePreviewPath === info.relativePath;
            return (
              <div key={item.entry.id} data-source-task={sourceId}>
                <FileOutputCard
                  entry={item.entry}
                  isActive={active}
                  onPreview={
                    onPreviewFile && info
                      ? (p) => onPreviewFile({ ...p, fileName: info.fileName })
                      : undefined
                  }
                />
              </div>
            );
          }
          if (item.kind === "child-question") {
            const replied = (childReplies[item.childTask.id] || []).length > 0;
            const showReplyInput = !readOnly && childrenNeedingInput.has(item.childTask.id) && !replied;
            return (
              <div
                key={`child-q-${item.entry.id}`}
                style={{
                  width: "100%",
                  backgroundColor: "#FFF5F0",
                  borderLeft: "3px solid #93452A",
                  borderRadius: "0 0.5rem 0.5rem 0",
                  padding: "12px 16px",
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
                    fontWeight: 600,
                    color: "#93452A",
                    marginBottom: 6,
                    textTransform: "uppercase",
                    letterSpacing: "0.02em",
                  }}
                >
                  {item.childTask.title} is asking:
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontFamily: "var(--font-inter), Inter, sans-serif",
                    color: "#1B1C1B",
                    lineHeight: 1.6,
                  }}
                >
                  {item.entry.content}
                </div>
                {/* Show inline replies already sent */}
                {(childReplies[item.childTask.id] || []).map((reply, ri) => (
                  <div
                    key={`cr-${ri}`}
                    style={{
                      marginTop: 8,
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: "rgba(147, 69, 42, 0.06)",
                        border: "1px solid rgba(218, 193, 185, 0.3)",
                        color: "#1B1C1B",
                        borderRadius: "0.5rem 0.5rem 0.25rem 0.5rem",
                        padding: "6px 10px",
                        fontSize: 13,
                        fontFamily: "var(--font-inter), Inter, sans-serif",
                        maxWidth: "80%",
                      }}
                    >
                      {reply}
                    </div>
                  </div>
                ))}
                {showReplyInput && (
                  <ChildReplyInput
                    childTaskId={item.childTask.id}
                    onReplySent={handleChildReplySent}
                  />
                )}
              </div>
            );
          }
          if (item.kind === "child-review") {
            return (
              <div
                key={`child-rev-${item.childTask.id}`}
                style={{
                  width: "100%",
                  backgroundColor: "#FFF5F0",
                  borderLeft: "3px solid #93452A",
                  borderRadius: "0 0.5rem 0.5rem 0",
                  padding: "10px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    fontFamily: "var(--font-inter), Inter, sans-serif",
                    color: "#1B1C1B",
                    lineHeight: 1.5,
                  }}
                >
                  <strong style={{ color: "#93452A" }}>{item.childTask.title}</strong> is ready for review
                </span>
              </div>
            );
          }
          if (item.kind === "single") {
            return (
              <div key={item.entry.id} data-source-task={sourceId}>
                <ChatEntry entry={item.entry} permissionMode={permissionMode} taskId={taskId} readOnly={readOnly} />
              </div>
            );
          }
          return null;
        })}

        {/* Spinner verb — shown while Claude is actively working */}
        {isRunning && !needsInput && <SpinnerVerb startedAt={startedAt} activityLabel={activityLabel} />}

        {/* Error banner — shown when task failed */}
        {errorMessage && <ErrorBanner message={errorMessage} />}

        {/* Completed verb — shown when task is done, with total work time */}
        {!isRunning && (status === "done" || status === "review") && totalWorkSeconds != null && totalWorkSeconds > 0 && (
          <CompletedVerb
            durationSeconds={totalWorkSeconds}
            costUsd={costUsd}
            tokensUsed={tokensUsed}
            taskId={taskId}
            isReview={status === "review"}
          />
        )}

        {/* Inline structured question form */}
        {showInlineQuestionForm && (
          <div style={{ padding: "8px 0" }}>
            {pendingStructuredEntry.content && (
              <div style={{
                fontSize: 13,
                fontFamily: "var(--font-inter), Inter, sans-serif",
                color: "#1B1C1B",
                marginBottom: 12,
                fontWeight: 500,
              }}>
                {pendingStructuredEntry.content}
              </div>
            )}
            <QuestionModal
              questions={pendingStructuredEntry.specs}
              variant="inline"
              hideFooter={false}
              submitLabel="Reply"
              onSubmit={handleInlineQuestionSubmit}
            />
          </div>
        )}

        {/* Question indicator — only show when no structured form is visible */}
        {needsInput === true && logEntries.length > 0 && !showInlineQuestionForm && (
          <div
            style={{
              fontSize: 12,
              fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
              color: "#93452A",
              fontStyle: "italic",
              textAlign: "center",
              padding: "8px 0",
            }}
          >
            Waiting for your reply...
          </div>
        )}
      </div>

      {/* Jump to latest button */}
      {showJumpButton && hasEntries && (
        <button
          onClick={jumpToLatest}
          style={{
            position: "absolute",
            bottom: 16,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
            backgroundColor: "rgba(252, 249, 247, 0.9)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(218, 193, 185, 0.3)",
            borderRadius: "1rem",
            padding: "8px 16px",
            fontSize: 12,
            fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
            color: "#93452A",
            cursor: "pointer",
          }}
        >
          Jump to latest
        </button>
      )}
    </div>
  );
}
