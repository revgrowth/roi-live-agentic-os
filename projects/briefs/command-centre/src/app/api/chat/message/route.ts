import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { emitTaskEvent } from "@/lib/event-bus";
import { getActivePermissionMode, getExecutionPermissionMode } from "@/lib/permission-mode";
import type { Message } from "@/types/chat";
import type { ClaudeModel, PermissionMode, Task } from "@/types/task";

const VALID_MODELS: ClaudeModel[] = ["opus", "sonnet", "haiku"];

export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();
    const { conversationId, content, replyToMessageId, permissionMode: requestedPermissionMode, model: requestedModel } = body as {
      conversationId?: string;
      content?: string;
      replyToMessageId?: string;
      permissionMode?: PermissionMode;
      model?: ClaudeModel | null;
    };

    if (!conversationId || !content?.trim()) {
      return NextResponse.json(
        { error: "conversationId and content are required" },
        { status: 400 }
      );
    }

    // Verify conversation exists
    const conv = db.prepare("SELECT * FROM conversations WHERE id = ?").get(conversationId);
    if (!conv) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    const now = new Date().toISOString();

    // Save the user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      conversationId,
      taskId: null,
      role: "user",
      content: content.trim(),
      metadata: replyToMessageId ? { replyToMessageId } : null,
      parentMessageId: replyToMessageId || null,
      createdAt: now,
    };

    db.prepare(
      `INSERT INTO messages (id, conversationId, taskId, role, content, metadata, parentMessageId, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      userMessage.id,
      userMessage.conversationId,
      userMessage.taskId,
      userMessage.role,
      userMessage.content,
      userMessage.metadata ? JSON.stringify(userMessage.metadata) : null,
      userMessage.parentMessageId,
      userMessage.createdAt
    );

    // Update conversation timestamp and title (first message becomes title)
    const msgCount = db.prepare(
      "SELECT COUNT(*) as count FROM messages WHERE conversationId = ? AND role = 'user'"
    ).get(conversationId) as { count: number };

    if (msgCount.count <= 1) {
      const title = content.trim().length > 80
        ? content.trim().slice(0, 77) + "..."
        : content.trim();
      db.prepare("UPDATE conversations SET title = ?, updatedAt = ? WHERE id = ?")
        .run(title, now, conversationId);
    } else {
      db.prepare("UPDATE conversations SET updatedAt = ? WHERE id = ?")
        .run(now, conversationId);
    }

    // NOTE: No SSE emit here — the caller (chat-store sendMessage) handles
    // messages from the API response directly. SSE is only for messages that
    // originate outside the sender's flow (sub-agent questions, Phase 3+).

    // Handle reply routing: if this is a reply to a sub-agent question, route it
    if (replyToMessageId) {
      const parentMsg = db.prepare("SELECT * FROM messages WHERE id = ?").get(replyToMessageId) as Record<string, unknown> | undefined;
      if (parentMsg && parentMsg.role === "sub_agent" && parentMsg.taskId) {
        try {
          const taskId = parentMsg.taskId as string;
          await fetch(new URL(`/api/tasks/${taskId}/reply`, request.url), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: content.trim(),
              permissionMode: requestedPermissionMode,
              model: requestedModel ?? undefined,
            }),
          });
        } catch (err) {
          console.error("Failed to route reply to task:", err);
        }
      }
    }

    // Phase 1: Simple task creation passthrough
    // In Phase 2, the orchestrator LLM will make scoping decisions here
    let orchestratorMessage: Message | null = null;
    let createdTask: Task | null = null;

    if (!replyToMessageId) {
      // Check if there's a task waiting for input from this conversation
      // If so, route this message as a reply instead of creating a new task
      const pendingTask = db.prepare(
        `SELECT * FROM tasks
         WHERE conversationId = ? AND needsInput = 1 AND status IN ('running', 'review')
         ORDER BY updatedAt DESC LIMIT 1`
      ).get(conversationId) as Task | undefined;

      if (pendingTask) {
        // Route as reply to the pending task
        try {
          const replyUrl = new URL(`/api/tasks/${pendingTask.id}/reply`, request.url);
          await fetch(replyUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: content.trim(),
              permissionMode: requestedPermissionMode,
              model: requestedModel ?? undefined,
            }),
          });

          orchestratorMessage = {
            id: crypto.randomUUID(),
            conversationId,
            taskId: pendingTask.id,
            role: "orchestrator",
            content: `Sent your reply to "${pendingTask.title}".`,
            metadata: null,
            parentMessageId: userMessage.id,
            createdAt: new Date().toISOString(),
          };

          db.prepare(
            `INSERT INTO messages (id, conversationId, taskId, role, content, metadata, parentMessageId, createdAt)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
          ).run(
            orchestratorMessage.id, orchestratorMessage.conversationId,
            orchestratorMessage.taskId, orchestratorMessage.role,
            orchestratorMessage.content, null,
            orchestratorMessage.parentMessageId, orchestratorMessage.createdAt
          );
        } catch (err) {
          console.error("Failed to route reply to pending task:", err);
        }

        return NextResponse.json({
          userMessage,
          orchestratorMessage,
          task: null,
        }, { status: 201 });
      }

      // No pending task — create a new one
      const taskId = crypto.randomUUID();
      const permissionMode = getActivePermissionMode(requestedPermissionMode, "bypassPermissions");
      const executionPermissionMode = getExecutionPermissionMode(requestedPermissionMode, "bypassPermissions");
      const model =
        requestedModel === null
          ? null
          : requestedModel && VALID_MODELS.includes(requestedModel)
            ? requestedModel
            : null;
      const task: Task = {
        id: taskId,
        title: content.trim().length > 100
          ? content.trim().slice(0, 97) + "..."
          : content.trim(),
        description: content.trim(),
        status: "queued",
        level: "task",
        parentId: null,
        projectSlug: null,
        columnOrder: -1,
        createdAt: now,
        updatedAt: now,
        costUsd: null,
        tokensUsed: null,
        durationMs: null,
        activityLabel: null,
        errorMessage: null,
        startedAt: null,
        completedAt: null,
        clientId: (conv as Record<string, unknown>).clientId as string | null,
        needsInput: false,
        phaseNumber: null,
        gsdStep: null,
        contextSources: null,
        cronJobSlug: null,
        claudeSessionId: null,
        permissionMode,
        executionPermissionMode,
        model,
        lastReplyAt: null,
        goalGroup: null,
        tag: null,
        pinnedAt: null,
        conversationId,
        originMessageId: userMessage.id,
      };

      db.prepare(
        `INSERT INTO tasks (id, title, description, status, level, parentId, projectSlug, columnOrder, createdAt, updatedAt, clientId, needsInput, permissionMode, executionPermissionMode, model, conversationId, originMessageId)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).run(
        task.id, task.title, task.description, task.status, task.level,
        task.parentId, task.projectSlug, task.columnOrder,
        task.createdAt, task.updatedAt, task.clientId, 0, task.permissionMode, task.executionPermissionMode,
        task.model,
        task.conversationId, task.originMessageId
      );

      createdTask = task;

      // Emit task created event (triggers queue watcher to execute it)
      emitTaskEvent({
        type: "task:created",
        task,
        timestamp: now,
      });

      // Create orchestrator acknowledgment message
      orchestratorMessage = {
        id: crypto.randomUUID(),
        conversationId,
        taskId: task.id,
        role: "orchestrator",
        content: `Queued "${task.title}" — it'll start executing shortly.`,
        metadata: null,
        parentMessageId: userMessage.id,
        createdAt: new Date().toISOString(),
      };

      db.prepare(
        `INSERT INTO messages (id, conversationId, taskId, role, content, metadata, parentMessageId, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      ).run(
        orchestratorMessage.id,
        orchestratorMessage.conversationId,
        orchestratorMessage.taskId,
        orchestratorMessage.role,
        orchestratorMessage.content,
        null,
        orchestratorMessage.parentMessageId,
        orchestratorMessage.createdAt
      );
    }

    return NextResponse.json({
      userMessage,
      orchestratorMessage,
      task: createdTask,
    }, { status: 201 });
  } catch (error) {
    console.error("POST /api/chat/message error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
