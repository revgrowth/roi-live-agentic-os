"use client";

import { LayoutDashboard, Clock, Brain, Sparkles, Cpu, Plus } from "lucide-react";

const navItems = [
  { label: "Board", icon: LayoutDashboard, active: true },
  { label: "Cron Jobs", icon: Clock, active: false },
  { label: "Context", icon: Brain, active: false },
  { label: "Brand", icon: Sparkles, active: false },
  { label: "Skills", icon: Cpu, active: false },
];

export function Sidebar() {
  return (
    <aside
      style={{
        width: 256,
        backgroundColor: "#F6F3F1",
        display: "flex",
        flexDirection: "column",
        padding: 16,
        gap: 24,
        flexShrink: 0,
        fontFamily: "var(--font-inter), Inter, sans-serif",
        fontSize: 14,
        fontWeight: 500,
      }}
    >
      {/* Branding */}
      <div style={{ padding: "16px 8px" }}>
        <h1
          style={{
            fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
            fontWeight: 700,
            fontSize: 22,
            color: "#93452A",
            letterSpacing: "-0.02em",
            margin: 0,
          }}
        >
          Agentic OS
        </h1>
        <p
          style={{
            fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "#5E5E65",
            marginTop: 4,
          }}
        >
          Operational Intelligence
        </p>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 12px",
                borderRadius: 12,
                cursor: item.active ? "default" : "pointer",
                backgroundColor: item.active ? "#FFFFFF" : "transparent",
                color: item.active ? "#93452A" : "#5E5E65",
                textDecoration: "none",
                transition: "all 200ms ease",
                boxShadow: item.active
                  ? "0px 4px 12px rgba(147, 69, 42, 0.06)"
                  : "none",
              }}
            >
              <Icon size={20} />
              <span style={{ fontWeight: 500 }}>{item.label}</span>
            </a>
          );
        })}
      </nav>

      {/* New Agent button */}
      <button
        style={{
          background: "linear-gradient(135deg, #93452A 0%, #B25D3F 100%)",
          color: "#FFFFFF",
          fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
          fontWeight: 600,
          padding: "12px 16px",
          borderRadius: 12,
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          fontSize: 14,
          transition: "all 200ms ease",
        }}
      >
        <Plus size={16} />
        New Agent
      </button>
    </aside>
  );
}
