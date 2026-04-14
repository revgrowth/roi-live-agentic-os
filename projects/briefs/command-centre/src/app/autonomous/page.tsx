"use client";

import { useState, useEffect, useCallback } from "react";
import { useChatStore } from "@/store/chat-store";
import { useTaskStore } from "@/store/task-store";
import { useGsdSync } from "@/hooks/use-gsd-sync";
import { useSSE } from "@/hooks/use-sse";
import { FeedView } from "@/components/board/feed-view";
import { BrandContextBanner } from "@/components/board/brand-context-banner";
import { ChatPanel } from "@/components/autonomous/chat-panel";
import { TaskModal } from "@/components/modal/task-modal";
import type { DashboardSummary } from "@/types/dashboard";

function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return String(n);
}

function TokenBadge({ usage, weekCost }: {
  usage: DashboardSummary["claudeUsage"];
  weekCost: number;
}) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      fontSize: 11,
      fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
      color: "#5E5E65",
    }}>
      <span>
        Today <strong style={{ color: "#1B1C1B", fontWeight: 600 }}>{formatTokens(usage.todayTokens)}</strong>
      </span>
      <span style={{ width: 1, height: 12, backgroundColor: "rgba(218, 193, 185, 0.3)" }} />
      <span>
        Week <strong style={{ color: "#1B1C1B", fontWeight: 600 }}>{formatTokens(usage.weekTokens)}</strong>
      </span>
      {weekCost > 0 && (
        <>
          <span style={{ width: 1, height: 12, backgroundColor: "rgba(218, 193, 185, 0.3)" }} />
          <span>
            <strong style={{ color: "#1B1C1B", fontWeight: 600 }}>${weekCost.toFixed(2)}</strong>
          </span>
        </>
      )}
    </div>
  );
}

export default function AutonomousPage() {
  useSSE();
  useGsdSync();

  const fetchTasks = useTaskStore((s) => s.fetchTasks);
  const loadOrCreateConversation = useChatStore((s) => s.loadOrCreateConversation);
  const [usage, setUsage] = useState<DashboardSummary["claudeUsage"] | null>(null);
  const [weekCost, setWeekCost] = useState(0);

  useEffect(() => {
    fetchTasks();
    loadOrCreateConversation();
  }, [fetchTasks, loadOrCreateConversation]);

  // Fetch token usage
  useEffect(() => {
    fetch("/api/dashboard/summary")
      .then((r) => r.ok ? r.json() : null)
      .then((data: DashboardSummary | null) => {
        if (data) {
          setUsage(data.claudeUsage);
          setWeekCost(data.weekStats.totalCostUsd);
        }
      })
      .catch(() => {});
  }, []);

  // switchTab is a no-op here since we don't have sub-tabs, but FeedView expects it
  const switchTab = useCallback(() => {}, []);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FCF9F7" }}>
      {/* Top bar — matches the Feed page exactly */}
      <header style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        height: 52,
        position: "sticky",
        top: 0,
        zIndex: 50,
        backgroundColor: "rgba(252, 249, 247, 0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(218, 193, 185, 0.15)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <h1 style={{
            fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
            fontWeight: 700,
            fontSize: 18,
            color: "#93452A",
            letterSpacing: "-0.02em",
            margin: 0,
            whiteSpace: "nowrap",
          }}>
            Agentic OS
          </h1>
        </div>
        {usage && <TokenBadge usage={usage} weekCost={weekCost} />}
      </header>
      <BrandContextBanner />

      {/* Content: Feed (left) + Chat panel (right) */}
      <div style={{
        display: "flex",
        gap: 0,
        padding: "16px 0 24px 24px",
        alignItems: "flex-start",
      }}>
        {/* Feed — same as the main page */}
        <main style={{ flex: 1, minWidth: 0, paddingRight: 24 }}>
          <FeedView onSwitchTab={switchTab} />
        </main>

        {/* Chat panel — docked right */}
        <ChatPanel />
      </div>

      <TaskModal />
    </div>
  );
}
