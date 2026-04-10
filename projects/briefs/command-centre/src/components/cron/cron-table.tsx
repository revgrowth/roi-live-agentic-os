"use client";

import { useEffect, useState } from "react";
import { Plus, Clock } from "lucide-react";
import { useCronStore } from "@/store/cron-store";
import { useClientStore } from "@/store/client-store";
import { CronRow } from "./cron-row";
import { CreateJobPanel } from "./create-job-panel";
import type { CronSystemStatus } from "@/types/cron";

function SchedulerStatusBanner({
  systemStatus,
  selectedClientId,
}: {
  systemStatus: CronSystemStatus;
  selectedClientId: string | null;
}) {
  const isInstalled = systemStatus.installed;
  const title = isInstalled
    ? "Scheduler installed for the root workspace"
    : "Scheduler not installed for the root workspace";
  const description = isInstalled
    ? "UI-created jobs only run automatically after the OS scheduler is installed. The root dispatcher is currently registered."
    : "Jobs can be created from the UI, but they will not run automatically until the root dispatcher is installed on this machine.";

  const cardStyle: React.CSSProperties = {
    marginBottom: 20,
    padding: "16px 18px",
    borderRadius: "0.5rem",
    backgroundColor: isInstalled ? "#F4FBF6" : "#FFF7ED",
    border: `1px solid ${isInstalled ? "#D1FADF" : "#FED7AA"}`,
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    color: isInstalled ? "#166534" : "#9A3412",
    marginBottom: 6,
  };

  const valueStyle: React.CSSProperties = {
    fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
    fontWeight: 700,
    fontSize: 16,
    color: "#1B1C1B",
    marginBottom: 8,
  };

  const bodyStyle: React.CSSProperties = {
    fontFamily: "var(--font-inter), Inter, sans-serif",
    fontSize: 13,
    lineHeight: 1.5,
    color: "#5E5E65",
    margin: 0,
  };

  const codeStyle: React.CSSProperties = {
    display: "inline-block",
    marginTop: 8,
    padding: "6px 8px",
    borderRadius: "0.375rem",
    backgroundColor: "#FFFFFF",
    border: "1px solid rgba(0, 0, 0, 0.06)",
    color: "#390C00",
    fontFamily: "var(--font-space-grotesk), Space Grotesk, monospace",
    fontSize: 12,
    wordBreak: "break-all",
  };

  return (
    <div style={cardStyle}>
      <div style={labelStyle}>{systemStatus.scheduler}</div>
      <div style={valueStyle}>{title}</div>
      <p style={bodyStyle}>{description}</p>
      <div style={bodyStyle}>
        Identifier: <strong>{systemStatus.identifier}</strong>
      </div>
      <div style={codeStyle}>
        {isInstalled ? systemStatus.uninstallCommand : systemStatus.installCommand}
      </div>
      {selectedClientId && selectedClientId !== "root" && (
        <p style={{ ...bodyStyle, marginTop: 8 }}>
          The banner reflects the root workspace only. Client workspaces still need their own scheduler setup if you want automatic runs there.
        </p>
      )}
    </div>
  );
}

export function CronJobsView() {
  const jobs = useCronStore((s) => s.jobs);
  const isLoading = useCronStore((s) => s.isLoading);
  const fetchJobs = useCronStore((s) => s.fetchJobs);
  const setShowCreatePanel = useCronStore((s) => s.setShowCreatePanel);
  const moveJob = useCronStore((s) => s.moveJob);
  const selectedClientId = useClientStore((s) => s.selectedClientId);

  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [systemStatus, setSystemStatus] = useState<CronSystemStatus | null>(null);
  const [systemStatusError, setSystemStatusError] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(index));
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex !== null && dragIndex !== index) {
      moveJob(dragIndex, index);
    }
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs, selectedClientId]);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/cron/system-status")
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch scheduler status");
        }

        const data = (await response.json()) as CronSystemStatus;
        if (!cancelled) {
          setSystemStatus(data);
          setSystemStatusError(null);
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setSystemStatusError(
            error instanceof Error ? error.message : "Failed to fetch scheduler status"
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const activeCount = jobs.filter((j) => j.active).length;
  const pausedCount = jobs.filter((j) => !j.active).length;
  const todayStr = new Date().toISOString().slice(0, 10);
  const runsToday = jobs.filter(
    (j) => j.lastRun?.lastRun && j.lastRun.lastRun.startsWith(todayStr)
  ).length;

  const statCardStyle: React.CSSProperties = {
    backgroundColor: "#FFFFFF",
    borderRadius: "0.375rem",
    padding: "14px 20px",
    flex: 1,
    minWidth: 0,
  };

  const statValueStyle: React.CSSProperties = {
    fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
    fontSize: 22,
    fontWeight: 700,
    color: "#1B1C1B",
  };

  const statLabelStyle: React.CSSProperties = {
    fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
    fontSize: 10,
    textTransform: "uppercase" as const,
    letterSpacing: "0.12em",
    color: "#5E5E65",
    marginTop: 2,
  };

  return (
    <div>
      {systemStatus && (
        <SchedulerStatusBanner
          systemStatus={systemStatus}
          selectedClientId={selectedClientId}
        />
      )}

      {systemStatusError && (
        <div
          style={{
            marginBottom: 20,
            padding: "12px 14px",
            borderRadius: "0.5rem",
            backgroundColor: "#FEF2F2",
            border: "1px solid #FECACA",
            fontFamily: "var(--font-inter), Inter, sans-serif",
            fontSize: 13,
            color: "#991B1B",
          }}
        >
          {systemStatusError}
        </div>
      )}

      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <div style={statCardStyle}>
          <div style={statValueStyle}>{activeCount}</div>
          <div style={statLabelStyle}>Active Jobs</div>
        </div>
        <div style={statCardStyle}>
          <div style={statValueStyle}>{pausedCount}</div>
          <div style={statLabelStyle}>Paused Jobs</div>
        </div>
        <div style={statCardStyle}>
          <div style={statValueStyle}>{runsToday}</div>
          <div style={statLabelStyle}>Runs Today</div>
        </div>
        <div style={statCardStyle}>
          <div style={{ ...statValueStyle, fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif" }}>
            $0.00
          </div>
          <div style={statLabelStyle}>Today&apos;s Spend</div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
            fontWeight: 700,
            fontSize: 18,
            color: "#1B1C1B",
            margin: 0,
          }}
        >
          Scheduled Tasks
        </h3>
        <button
          onClick={() => setShowCreatePanel(true)}
          style={{
            background: "linear-gradient(135deg, #93452A 0%, #B25D3F 100%)",
            color: "#FFFFFF",
            fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
            fontWeight: 600,
            padding: "8px 16px",
            borderRadius: "0.375rem",
            border: "none",
            cursor: "pointer",
            fontSize: 13,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Plus size={14} />
          Create Job
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr 0.8fr 0.8fr 0.7fr 90px 110px",
          gap: 12,
          padding: "8px 16px",
          fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: "#5E5E65",
          marginBottom: 10,
        }}
      >
        <span style={{ paddingLeft: 22 }}>Name</span>
        <span>Schedule</span>
        <span>Last Run</span>
        <span>Next Run</span>
        <span>Avg Duration</span>
        <span>Status</span>
        <span>Actions</span>
      </div>

      {isLoading && (
        <div
          style={{
            textAlign: "center",
            padding: 40,
            fontFamily: "var(--font-inter), Inter, sans-serif",
            fontSize: 14,
            color: "#5E5E65",
          }}
        >
          Loading scheduled tasks...
        </div>
      )}

      {!isLoading && jobs.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            fontFamily: "var(--font-inter), Inter, sans-serif",
          }}
        >
          <Clock size={48} color="#5E5E65" style={{ marginBottom: 16 }} />
          <h4
            style={{
              fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
              fontWeight: 600,
              fontSize: 16,
              color: "#1B1C1B",
              margin: "0 0 8px 0",
            }}
          >
            No scheduled tasks configured yet
          </h4>
          <p
            style={{
              fontSize: 14,
              color: "#5E5E65",
              maxWidth: 320,
              margin: "0 auto 20px",
            }}
          >
            Set up recurring tasks to automate your regular workflows.
          </p>
          <button
            onClick={() => setShowCreatePanel(true)}
            style={{
              background: "linear-gradient(135deg, #93452A 0%, #B25D3F 100%)",
              color: "#FFFFFF",
              fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
              fontWeight: 600,
              padding: "10px 20px",
              borderRadius: "0.375rem",
              border: "none",
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            Create First Job
          </button>
        </div>
      )}

      {!isLoading &&
        jobs.map((job, i) => (
          <CronRow
            key={job.slug}
            job={job}
            index={i}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
            isDragOver={dragOverIndex === i}
            isDragging={dragIndex === i}
          />
        ))}

      <CreateJobPanel />
    </div>
  );
}
