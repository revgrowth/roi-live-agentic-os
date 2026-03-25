export interface ProgressData {
  costUsd?: number;
  tokensUsed?: number;
  activityLabel?: string;
}

export interface CompleteData {
  costUsd: number;
  tokensUsed: number;
  durationMs: number;
}

export interface ClaudeParserCallbacks {
  onProgress: (data: ProgressData) => void;
  onComplete: (data: CompleteData) => void;
  onError: (error: string) => void;
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
      case "result": {
        this.handleResult(parsed);
        break;
      }
      case "error": {
        this.handleError(parsed);
        break;
      }
      // Other message types (system, tool_use, tool_result) are ignored
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
  }

  private handleResult(parsed: Record<string, unknown>): void {
    if (this.completed) return;
    this.completed = true;

    const costUsd = typeof parsed.cost_usd === "number" ? parsed.cost_usd : 0;
    const durationMs = typeof parsed.duration_ms === "number" ? parsed.duration_ms : 0;

    // Token count can be in usage.total_tokens or at the top level
    let tokensUsed = 0;
    const usage = parsed.usage as Record<string, unknown> | undefined;
    if (usage && typeof usage.total_tokens === "number") {
      tokensUsed = usage.total_tokens;
    } else if (typeof parsed.total_tokens === "number") {
      tokensUsed = parsed.total_tokens;
    }

    this.callbacks.onComplete({ costUsd, tokensUsed, durationMs });
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
 * Extract a short activity label from assistant text.
 * Takes the last meaningful sentence/phrase, truncated to 80 chars.
 */
function extractActivityLabel(text: string): string | null {
  // Clean up the text: remove markdown formatting, collapse whitespace
  const cleaned = text
    .replace(/```[\s\S]*?```/g, "") // remove code blocks
    .replace(/[#*_`~]/g, "") // remove markdown formatting chars
    .replace(/\n+/g, " ") // collapse newlines
    .replace(/\s+/g, " ") // collapse whitespace
    .trim();

  if (!cleaned) return null;

  // Split into sentences and take the last non-empty one
  const sentences = cleaned.split(/[.!?]+/).filter((s) => s.trim().length > 5);
  const label = sentences.length > 0 ? sentences[sentences.length - 1].trim() : cleaned.trim();

  if (!label) return null;

  // Truncate to 80 chars
  if (label.length > 80) {
    return label.slice(0, 77) + "...";
  }
  return label;
}
