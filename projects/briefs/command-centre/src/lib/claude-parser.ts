import type { LogEntry } from "@/types/task";

export interface ProgressData {
  costUsd?: number;
  tokensUsed?: number;
  activityLabel?: string;
}

export interface CompleteData {
  costUsd: number;
  tokensUsed: number;
  durationMs: number;
  sessionId?: string;
}

export interface ClaudeParserCallbacks {
  onProgress: (data: ProgressData) => void;
  onComplete: (data: CompleteData) => void;
  onError: (error: string) => void;
  onLogEntry?: (entry: LogEntry) => void;
  onQuestion?: (questionText: string) => void;
}

/**
 * Parses Claude CLI streaming JSON output (--output-format stream-json).
 * Each line is a newline-delimited JSON object with a `type` field.
 */
export class ClaudeOutputParser {
  private callbacks: ClaudeParserCallbacks;
  private completed = false;

  constructor(callbacks: ClaudeParserCallbacks) {
    this.callbacks = callbacks;
  }

  /**
   * Feed a single line of Claude CLI JSON output.
   * Handles: assistant (text chunks), result (completion), error.
   */
  feedLine(line: string): void {
    const trimmed = line.trim();
    if (!trimmed) return;

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(trimmed);
    } catch {
      console.warn("[claude-parser] Malformed JSON line, skipping:", trimmed.slice(0, 120));
      return;
    }

    const type = parsed.type as string | undefined;
    if (!type) return;

    switch (type) {
      case "assistant": {
        this.handleAssistant(parsed);
        break;
      }
      case "tool_use": {
        this.handleToolUse(parsed);
        break;
      }
      case "tool_result": {
        this.handleToolResult(parsed);
        break;
      }
      case "result": {
        this.handleResult(parsed);
        break;
      }
      case "error": {
        this.handleError(parsed);
        break;
      }
    }
  }

  private handleAssistant(parsed: Record<string, unknown>): void {
    // Extract text content from assistant message
    // Format: { type: "assistant", message: { content: [{ type: "text", text: "..." }] } }
    const message = parsed.message as Record<string, unknown> | undefined;
    if (!message) return;

    const content = message.content as Array<Record<string, unknown>> | undefined;
    if (!Array.isArray(content)) return;

    // Find text blocks (skip tool_use blocks)
    const textBlocks = content.filter((block) => block.type === "text" && typeof block.text === "string");
    if (textBlocks.length === 0) return;

    const lastText = textBlocks[textBlocks.length - 1].text as string;
    const activityLabel = extractActivityLabel(lastText);

    if (activityLabel) {
      this.callbacks.onProgress({ activityLabel });
    }

    // Emit log entry for text content
    const fullText = textBlocks.map((b) => b.text as string).join("");
    if (fullText.trim()) {
      this.callbacks.onLogEntry?.({
        id: crypto.randomUUID(),
        type: "text",
        timestamp: new Date().toISOString(),
        content: fullText,
      });

      // Question detection
      const questionText = detectQuestion(fullText);
      if (questionText) {
        this.callbacks.onQuestion?.(questionText);
      }
    }
  }

  private handleToolUse(parsed: Record<string, unknown>): void {
    const name = (parsed.name as string) || "unknown_tool";
    const input = parsed.input ?? {};

    this.callbacks.onLogEntry?.({
      id: crypto.randomUUID(),
      type: "tool_use",
      timestamp: new Date().toISOString(),
      content: name,
      toolName: name,
      toolArgs: JSON.stringify(input),
      isCollapsed: true,
    });
  }

  private handleToolResult(parsed: Record<string, unknown>): void {
    const content = parsed.content as string | Array<Record<string, unknown>> | undefined;
    let resultText = "";

    if (typeof content === "string") {
      resultText = content;
    } else if (Array.isArray(content)) {
      resultText = content
        .filter((b) => b.type === "text" && typeof b.text === "string")
        .map((b) => b.text as string)
        .join("");
    }

    this.callbacks.onLogEntry?.({
      id: crypto.randomUUID(),
      type: "tool_result",
      timestamp: new Date().toISOString(),
      content: resultText || "(no output)",
      toolResult: resultText || undefined,
    });
  }

  private handleResult(parsed: Record<string, unknown>): void {
    if (this.completed) return;
    this.completed = true;

    const costUsd = typeof parsed.cost_usd === "number" ? parsed.cost_usd : 0;
    const durationMs = typeof parsed.duration_ms === "number" ? parsed.duration_ms : 0;

    // Token count: check total_tokens first, then sum input_tokens + output_tokens
    let tokensUsed = 0;
    const usage = parsed.usage as Record<string, unknown> | undefined;
    if (usage && typeof usage.total_tokens === "number") {
      tokensUsed = usage.total_tokens;
    } else if (usage && typeof usage.input_tokens === "number") {
      tokensUsed = usage.input_tokens + (typeof usage.output_tokens === "number" ? usage.output_tokens : 0);
    } else if (typeof parsed.total_tokens === "number") {
      tokensUsed = parsed.total_tokens;
    } else if (typeof parsed.input_tokens === "number") {
      tokensUsed = parsed.input_tokens + (typeof parsed.output_tokens === "number" ? parsed.output_tokens : 0);
    }

    const sessionId = typeof parsed.session_id === "string" ? parsed.session_id : undefined;

    this.callbacks.onComplete({ costUsd, tokensUsed, durationMs, sessionId });
  }

  private handleError(parsed: Record<string, unknown>): void {
    if (this.completed) return;
    this.completed = true;

    const errorMsg =
      typeof parsed.error === "string"
        ? parsed.error
        : typeof parsed.message === "string"
          ? parsed.message
          : "Unknown Claude CLI error";

    this.callbacks.onError(errorMsg);
  }

  /** Whether a result or error has already been processed. */
  get isCompleted(): boolean {
    return this.completed;
  }
}

/**
 * Detect if Claude is asking the user a question.
 * Returns the question text if detected, null otherwise.
 */
function detectQuestion(text: string): string | null {
  const trimmed = text.trim();
  const lines = trimmed.split("\n").filter((l) => l.trim());
  const lastLine = lines[lines.length - 1]?.trim() || "";

  // Check last line for literal question mark
  if (lastLine.endsWith("?")) return lastLine;

  // Check last few lines for question patterns (Claude sometimes puts the
  // question a line or two before the final line)
  const lastFewLines = lines.slice(-4).map((l) => l.trim());
  for (const line of lastFewLines) {
    if (line.endsWith("?") && line.length > 10) return line;
  }

  // Check for common Claude question/action-request patterns in last few lines
  const questionPatterns = [
    /would you like me to/i,
    /shall I/i,
    /do you want me to/i,
    /please (confirm|choose|select|specify|provide)/i,
    /which (one|option|approach)/i,
    /let me know (if|when|what|which|how)/i,
    /needs? your (approval|input|confirmation|permission|review)/i,
    /you should be seeing a prompt/i,
    /waiting for (your|you to)/i,
    /paste (it |.{0,20} )here/i,
    /if you'd (rather|like to|prefer)/i,
    /alternatively,? (you can|if you)/i,
    /approve (it|the|this)/i,
    /ready when you are/i,
    /once you (approve|confirm|provide|add|set)/i,
  ];

  const searchText = lastFewLines.join(" ");
  for (const pattern of questionPatterns) {
    if (pattern.test(searchText)) {
      // Return the most relevant line
      for (const line of lastFewLines.reverse()) {
        if (pattern.test(line)) return line;
      }
      return lastFewLines[lastFewLines.length - 1] || lastLine;
    }
  }
  return null;
}

/**
 * Extract a short, plain-English activity label from assistant text.
 * Strips technical noise (file paths, code, markers) and returns
 * a business-readable summary of what Claude is doing or has done.
 */
function extractActivityLabel(text: string): string | null {
  // Clean up the text
  let cleaned = text
    .replace(/```[\s\S]*?```/g, "")              // remove code blocks
    .replace(/\[SILENT\]/gi, "")                  // remove silent markers
    .replace(/`[^`]+`/g, "")                      // remove inline code
    .replace(/[#*_~]/g, "")                       // remove markdown formatting
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")      // [text](url) → text
    .replace(/(?:\/[\w.-]+){2,}/g, "")            // remove file paths like /foo/bar/baz.md
    .replace(/[\w.-]+\/[\w.-]+\/[\w.-]+/g, "")    // remove relative paths like projects/ops-cron/file.md
    .replace(/\b\w+\.(md|json|ts|tsx|js|jsx|py|sh|yaml|yml|csv|txt|log|pdf|png|svg)\b/gi, "")  // remove filenames
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned || cleaned.length < 5) return null;

  // Split into sentences and pick the last substantive one
  const sentences = cleaned.split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 8)
    // Skip sentences that are mostly technical
    .filter((s) => !/^(saved|wrote|created|updated|deleted|reading|writing|running|executed)\s+(to|from|at|in)\b/i.test(s))
    .filter((s) => !/^(Report|Output|File|Log|Result) saved/i.test(s));

  // Fallback to any sentence if all were filtered
  const fallbackSentences = cleaned.split(/[.!?]+/).map((s) => s.trim()).filter((s) => s.length > 8);
  const pool = sentences.length > 0 ? sentences : fallbackSentences;
  const label = pool.length > 0 ? pool[pool.length - 1] : cleaned;

  if (!label || label.length < 5) return null;

  return label.length > 100 ? label.slice(0, 97) + "..." : label;
}
