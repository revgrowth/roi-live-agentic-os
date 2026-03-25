/**
 * Fixture test for ClaudeOutputParser.
 * Run: npx tsx scripts/test-parser.ts
 */
import { ClaudeOutputParser } from "../src/lib/claude-parser";

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    passed++;
    console.log(`  PASS: ${message}`);
  } else {
    failed++;
    console.error(`  FAIL: ${message}`);
  }
}

// ---- Test 1: Assistant message extracts activity label ----
console.log("\nTest 1: Assistant message");
{
  let progressData: { costUsd?: number; tokensUsed?: number; activityLabel?: string } | null = null;
  const parser = new ClaudeOutputParser({
    onProgress: (data) => { progressData = data; },
    onComplete: () => {},
    onError: () => {},
  });

  const assistantLine = JSON.stringify({
    type: "assistant",
    message: {
      content: [
        { type: "text", text: "I'll help you write a test email. Let me draft something professional and concise." }
      ]
    }
  });

  parser.feedLine(assistantLine);
  assert(progressData !== null, "onProgress was called");
  assert(progressData!.activityLabel !== null && progressData!.activityLabel!.length > 0, "activityLabel is non-empty");
  assert(progressData!.activityLabel!.length <= 80, "activityLabel is <= 80 chars");
}

// ---- Test 2: Result message calls onComplete ----
console.log("\nTest 2: Result message");
{
  let completeData: { costUsd: number; tokensUsed: number; durationMs: number } | null = null;
  const parser = new ClaudeOutputParser({
    onProgress: () => {},
    onComplete: (data) => { completeData = data; },
    onError: () => {},
  });

  const resultLine = JSON.stringify({
    type: "result",
    cost_usd: 0.0234,
    duration_ms: 15000,
    usage: { total_tokens: 1500 }
  });

  parser.feedLine(resultLine);
  assert(completeData !== null, "onComplete was called");
  assert(completeData!.costUsd === 0.0234, `costUsd is 0.0234 (got ${completeData!.costUsd})`);
  assert(completeData!.tokensUsed === 1500, `tokensUsed is 1500 (got ${completeData!.tokensUsed})`);
  assert(completeData!.durationMs === 15000, `durationMs is 15000 (got ${completeData!.durationMs})`);
}

// ---- Test 3: Error message calls onError ----
console.log("\nTest 3: Error message");
{
  let errorMsg: string | null = null;
  const parser = new ClaudeOutputParser({
    onProgress: () => {},
    onComplete: () => {},
    onError: (error) => { errorMsg = error; },
  });

  const errorLine = JSON.stringify({
    type: "error",
    error: "Rate limit exceeded"
  });

  parser.feedLine(errorLine);
  assert(errorMsg === "Rate limit exceeded", `error message matches (got "${errorMsg}")`);
}

// ---- Test 4: Malformed JSON is skipped gracefully ----
console.log("\nTest 4: Malformed JSON");
{
  let called = false;
  const parser = new ClaudeOutputParser({
    onProgress: () => { called = true; },
    onComplete: () => { called = true; },
    onError: () => { called = true; },
  });

  parser.feedLine("this is not json{{{");
  parser.feedLine("");
  parser.feedLine("   ");
  assert(!called, "No callbacks fired for malformed/empty lines");
}

// ---- Test 5: isCompleted flag ----
console.log("\nTest 5: isCompleted flag");
{
  const parser = new ClaudeOutputParser({
    onProgress: () => {},
    onComplete: () => {},
    onError: () => {},
  });

  assert(!parser.isCompleted, "Not completed initially");

  parser.feedLine(JSON.stringify({ type: "result", cost_usd: 0, duration_ms: 0, usage: { total_tokens: 0 } }));
  assert(parser.isCompleted, "Completed after result");
}

// ---- Test 6: Duplicate result/error ignored ----
console.log("\nTest 6: Duplicate result ignored");
{
  let completeCount = 0;
  const parser = new ClaudeOutputParser({
    onProgress: () => {},
    onComplete: () => { completeCount++; },
    onError: () => {},
  });

  parser.feedLine(JSON.stringify({ type: "result", cost_usd: 0.01, duration_ms: 1000, usage: { total_tokens: 100 } }));
  parser.feedLine(JSON.stringify({ type: "result", cost_usd: 0.02, duration_ms: 2000, usage: { total_tokens: 200 } }));
  assert(completeCount === 1, `onComplete called exactly once (got ${completeCount})`);
}

// ---- Test 7: Activity label truncation ----
console.log("\nTest 7: Long activity label truncation");
{
  let label: string | null = null;
  const parser = new ClaudeOutputParser({
    onProgress: (data) => { label = data.activityLabel ?? null; },
    onComplete: () => {},
    onError: () => {},
  });

  const longText = "A".repeat(200);
  parser.feedLine(JSON.stringify({
    type: "assistant",
    message: { content: [{ type: "text", text: longText }] }
  }));

  assert(label !== null && label.length <= 80, `Label truncated to <= 80 (got length ${label?.length})`);
  assert(label !== null && label.endsWith("..."), "Label ends with ellipsis");
}

// ---- Summary ----
console.log(`\n${"=".repeat(40)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
console.log("All parser tests passed!");
