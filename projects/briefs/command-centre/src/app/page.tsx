"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Sunrise, Moon } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { GreetingHeader } from "@/components/dashboard/greeting-header";
import { ActivityPulse } from "@/components/dashboard/activity-pulse";
import { AwaitingReview } from "@/components/dashboard/awaiting-review";
import { ActiveProjects } from "@/components/dashboard/active-projects";
import { RecentCompletions } from "@/components/dashboard/recent-completions";
import { SystemHealth } from "@/components/dashboard/system-health";
import { ClientBreakdown } from "@/components/dashboard/client-breakdown";
import { useClientStore } from "@/store/client-store";
import { useTaskStore } from "@/store/task-store";
import type { DashboardSummary, ClientStats } from "@/types/dashboard";

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [clientStats, setClientStats] = useState<ClientStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const selectedClientId = useClientStore((s) => s.selectedClientId);
  const clients = useClientStore((s) => s.clients);
  const fetchClients = useClientStore((s) => s.fetchClients);

  const createTask = useTaskStore((s) => s.createTask);
  const updateTask = useTaskStore((s) => s.updateTask);
  const [quickStarting, setQuickStarting] = useState<"start-here" | "wrap-up" | null>(null);
  const [cooldown, setCooldown] = useState(false);

  const isRootView = selectedClientId === null;
  const hasClients = clients.length > 0;

  const handleQuickStart = useCallback(async (type: "start-here" | "wrap-up") => {
    if (quickStarting || cooldown) return;
    setQuickStarting(type);
    setCooldown(true);
    try {
      const taskTitle = type === "start-here" ? "Start Here" : "Wrap Up";
      const taskDesc = type === "start-here" ? "Run /start-here" : "Run /wrap-up";
      await createTask(taskTitle, taskDesc, "task");
      const tasks = useTaskStore.getState().tasks;
      const newTask = tasks.find(
        (t) => t.title === taskTitle && t.status === "backlog"
      );
      if (newTask) {
        await updateTask(newTask.id, { status: "queued" });
      }
      router.push("/board");
    } finally {
      setQuickStarting(null);
      setTimeout(() => setCooldown(false), 5000);
    }
  }, [quickStarting, cooldown, createTask, updateTask, router]);

  const loadDashboard = useCallback(() => {
    setIsLoading(true);
    const params = selectedClientId ? `?clientId=${encodeURIComponent(selectedClientId)}` : "";

    const fetches: Promise<void>[] = [
      fetch(`/api/dashboard/summary${params}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch dashboard");
          return res.json();
        })
        .then(setData)
        .catch((err) => console.error("Dashboard fetch error:", err)),
    ];

    if (isRootView && hasClients) {
      fetches.push(
        fetch("/api/dashboard/clients")
          .then((res) => {
            if (!res.ok) throw new Error("Failed to fetch client stats");
            return res.json();
          })
          .then(setClientStats)
          .catch((err) => console.error("Client stats fetch error:", err))
      );
    }

    Promise.all(fetches).finally(() => setIsLoading(false));
  }, [selectedClientId, isRootView, hasClients]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const hasAttention = data
    ? (data.awaitingReview.reviewCount + data.awaitingReview.needsInputCount + data.awaitingReview.errorCount) > 0
    : false;

  return (
    <AppShell title="Overview" hideStatsBar>
      <div style={{ padding: "32px 40px", width: "100%", boxSizing: "border-box" }}>
        <GreetingHeader userName={data?.userName ?? null} />

        {isLoading ? (
          <p style={loadingStyle}>Loading...</p>
        ) : data ? (
          <>
            {/* ── Quick actions ── */}
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <button
                onClick={() => handleQuickStart("start-here")}
                disabled={quickStarting !== null || cooldown}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "5px 12px",
                  fontSize: 12,
                  fontWeight: 500,
                  fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
                  border: "1px solid rgba(218, 193, 185, 0.3)",
                  borderRadius: 6,
                  backgroundColor: "transparent",
                  color: "#93452A",
                  cursor: quickStarting || cooldown ? "not-allowed" : "pointer",
                  opacity: quickStarting || cooldown ? 0.4 : 1,
                  transition: "all 150ms ease",
                }}
                onMouseEnter={(e) => { if (!quickStarting && !cooldown) e.currentTarget.style.backgroundColor = "rgba(147, 69, 42, 0.06)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
              >
                <Sunrise size={13} />
                {quickStarting === "start-here" ? "Queued — opening board..." : "Start Here"}
              </button>
              <button
                onClick={() => handleQuickStart("wrap-up")}
                disabled={quickStarting !== null || cooldown}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "5px 12px",
                  fontSize: 12,
                  fontWeight: 500,
                  fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
                  border: "1px solid rgba(218, 193, 185, 0.3)",
                  borderRadius: 6,
                  backgroundColor: "transparent",
                  color: "#5E5E65",
                  cursor: quickStarting || cooldown ? "not-allowed" : "pointer",
                  opacity: quickStarting || cooldown ? 0.4 : 1,
                  transition: "all 150ms ease",
                }}
                onMouseEnter={(e) => { if (!quickStarting && !cooldown) e.currentTarget.style.backgroundColor = "rgba(94, 94, 101, 0.06)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
              >
                <Moon size={13} />
                {quickStarting === "wrap-up" ? "Queued — opening board..." : "Wrap Up"}
              </button>
            </div>

            {/* ── 1. SNAPSHOT: Usage + Recent Completions + System Health ── */}
            <section style={{ marginBottom: 32 }}>
              <div style={threeColStyle}>
                <ActivityPulse weekStats={data.weekStats} claudeUsage={data.claudeUsage} />
                <RecentCompletions recentTasks={data.recentTasks} />
                <SystemHealth system={data.system} />
              </div>
            </section>

            {/* ── 2. DIVIDER ─────────────────────────────────────── */}
            <div style={dividerStyle} />

            {/* ── 3. ACTIVE PROJECTS + AWAITING REVIEW ────────────── */}
            <section style={{ marginBottom: 32 }}>
              <div style={twoColStyle}>
                <ActiveProjects activeProjects={data.activeProjects} />
                {hasAttention && (
                  <AwaitingReview awaitingReview={data.awaitingReview} />
                )}
              </div>
            </section>

            {/* ── 4. CLIENTS ──────────────────────────────────────── */}
            {isRootView && hasClients && clientStats.length > 0 && (
              <>
                <div style={dividerStyle} />
                <section>
                  <div style={sectionHeaderStyle}>Clients</div>
                  <ClientBreakdown clientStats={clientStats} />
                </section>
              </>
            )}
          </>
        ) : (
          <p style={loadingStyle}>Could not load dashboard data.</p>
        )}
      </div>
    </AppShell>
  );
}

const threeColStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  gap: 16,
};

const twoColStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 16,
};

const dividerStyle: React.CSSProperties = {
  height: 1,
  backgroundColor: "rgba(218, 193, 185, 0.25)",
  marginBottom: 24,
};

const sectionHeaderStyle: React.CSSProperties = {
  fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
  fontSize: 10,
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  color: "#9C9CA0",
  marginBottom: 14,
};

const loadingStyle: React.CSSProperties = {
  fontFamily: "var(--font-inter), Inter, sans-serif",
  fontSize: 14,
  color: "#9C9CA0",
};
