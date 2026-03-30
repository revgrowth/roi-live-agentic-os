import { create } from "zustand";
import type { Conversation, Message, AgentDecision, ChatEvent } from "@/types/chat";

interface ChatState {
  /** The active conversation (only one at a time) */
  conversation: Conversation | null;
  /** Messages in the active conversation, ordered by createdAt */
  messages: Message[];
  /** Agent decisions for the active conversation */
  decisions: AgentDecision[];
  /** Whether the orchestrator is currently processing */
  isProcessing: boolean;
  /** Pending questions from sub-agents that need user reply */
  pendingQuestions: Message[];

  // Actions
  loadOrCreateConversation: (clientId?: string | null) => Promise<Conversation>;
  sendMessage: (content: string) => Promise<void>;
  replyToQuestion: (messageId: string, content: string) => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  applyChatSSE: (event: ChatEvent) => void;
  setProcessing: (v: boolean) => void;
  archiveConversation: () => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversation: null,
  messages: [],
  decisions: [],
  isProcessing: false,
  pendingQuestions: [],

  loadOrCreateConversation: async (clientId?: string | null) => {
    // Try to load the most recent active conversation
    const params = new URLSearchParams();
    if (clientId) params.set("clientId", clientId);
    params.set("status", "active");

    const res = await fetch(`/api/chat/conversations?${params}`);
    if (res.ok) {
      const conversations: Conversation[] = await res.json();
      if (conversations.length > 0) {
        const conv = conversations[0];
        set({ conversation: conv });
        await get().fetchMessages(conv.id);
        return conv;
      }
    }

    // No active conversation — create one
    const createRes = await fetch("/api/chat/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId }),
    });
    const conv: Conversation = await createRes.json();
    set({ conversation: conv, messages: [], decisions: [], pendingQuestions: [] });
    return conv;
  },

  sendMessage: async (content: string) => {
    const { conversation } = get();
    if (!conversation) return;

    const now = new Date().toISOString();
    const tempId = `temp-${crypto.randomUUID()}`;

    // Optimistic add
    const optimistic: Message = {
      id: tempId,
      conversationId: conversation.id,
      taskId: null,
      role: "user",
      content,
      metadata: null,
      parentMessageId: null,
      createdAt: now,
    };
    set((s) => ({ messages: [...s.messages, optimistic], isProcessing: true }));

    try {
      const res = await fetch("/api/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: conversation.id,
          content,
        }),
      });

      if (!res.ok) {
        console.error("Failed to send message:", res.status);
        set((s) => ({
          messages: s.messages.filter((m) => m.id !== tempId),
          isProcessing: false,
        }));
        return;
      }

      const data = await res.json();

      // Single atomic set: replace temp with real, add orchestrator, dedupe
      set((s) => {
        // Replace temp message with real one from API
        let msgs = s.messages.map((m) => m.id === tempId ? data.userMessage : m);

        // Add orchestrator response if present and not already there
        if (data.orchestratorMessage && !msgs.some((m) => m.id === data.orchestratorMessage.id)) {
          msgs = [...msgs, data.orchestratorMessage];
        }

        return { messages: msgs, isProcessing: false };
      });
    } catch (err) {
      console.error("Send message error:", err);
      set((s) => ({
        messages: s.messages.filter((m) => m.id !== tempId),
        isProcessing: false,
      }));
    }
  },

  replyToQuestion: async (messageId: string, content: string) => {
    const { conversation } = get();
    if (!conversation) return;

    const now = new Date().toISOString();
    const replyMsg: Message = {
      id: `temp-${crypto.randomUUID()}`,
      conversationId: conversation.id,
      taskId: null,
      role: "user",
      content,
      metadata: { replyToMessageId: messageId },
      parentMessageId: messageId,
      createdAt: now,
    };

    set((s) => ({
      messages: [...s.messages, replyMsg],
      pendingQuestions: s.pendingQuestions.filter((q) => q.id !== messageId),
    }));

    try {
      await fetch("/api/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: conversation.id,
          content,
          replyToMessageId: messageId,
        }),
      });
    } catch (err) {
      console.error("Reply to question error:", err);
    }
  },

  fetchMessages: async (conversationId: string) => {
    try {
      const res = await fetch(`/api/chat/conversations/${conversationId}/messages`);
      if (!res.ok) return;
      const data = await res.json();
      const messages: Message[] = data.messages || [];
      const pendingQuestions = messages.filter(
        (m) => m.role === "sub_agent" && m.metadata?.questionText && !messages.some(
          (r) => r.parentMessageId === m.id && r.role === "user"
        )
      );
      set({ messages, pendingQuestions });
    } catch (err) {
      console.error("Fetch messages error:", err);
    }
  },

  applyChatSSE: (event: ChatEvent) => {
    if (event.type === "chat:message" && event.message) {
      const msg = event.message;
      set((s) => {
        // Skip if already present (by real ID or content match for temp messages)
        if (s.messages.some((m) => m.id === msg.id)) return s;
        const newMessages = [...s.messages, msg];
        const newPending = msg.role === "sub_agent" && msg.metadata?.questionText
          ? [...s.pendingQuestions, msg]
          : s.pendingQuestions;
        return {
          messages: newMessages,
          pendingQuestions: newPending,
          isProcessing: msg.role === "orchestrator" ? false : s.isProcessing,
        };
      });
    } else if (event.type === "chat:decision" && event.decision) {
      set((s) => ({
        decisions: [...s.decisions, event.decision!],
      }));
    }
  },

  setProcessing: (v: boolean) => set({ isProcessing: v }),

  archiveConversation: async () => {
    const { conversation } = get();
    if (!conversation) return;

    await fetch(`/api/chat/conversations/${conversation.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "archived" }),
    });

    set({ conversation: null, messages: [], decisions: [], pendingQuestions: [] });
  },
}));
