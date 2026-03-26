"use client";

import { Kanban, Clock, FileText, Palette, Zap, ChevronDown } from "lucide-react";

const navItems = [
  { label: "Board", icon: Kanban, active: true },
  { label: "Cron Jobs", icon: Clock, active: false },
  { label: "Context", icon: FileText, active: false },
  { label: "Brand", icon: Palette, active: false },
  { label: "Skills", icon: Zap, active: false },
];

export function Sidebar() {
  return (
    <aside
      style={{
        width: 240,
        backgroundColor: "#FFFFFF",
        borderRight: "1px solid #F3F4F6",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
    >
      {/* Logo / Title */}
      <div
        style={{
          height: 56,
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
        }}
      >
        <Kanban size={18} color="#3B82F6" style={{ marginRight: 8 }} />
        <h1
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: "#111827",
            margin: 0,
          }}
        >
          Command Centre
        </h1>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "0 8px" }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              style={{
                height: 36,
                display: "flex",
                alignItems: "center",
                padding: "0 16px",
                borderRadius: 6,
                cursor: item.active ? "default" : "not-allowed",
                backgroundColor: item.active ? "#EFF6FF" : "transparent",
                position: "relative",
                marginBottom: 4,
              }}
            >
              {item.active && (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 6,
                    bottom: 6,
                    width: 2,
                    borderRadius: 2,
                    backgroundColor: "#3B82F6",
                  }}
                />
              )}
              <Icon
                size={18}
                color={item.active ? "#3B82F6" : "#9CA3AF"}
                style={{ marginRight: 8, flexShrink: 0 }}
              />
              <span
                style={{
                  fontSize: 14,
                  fontWeight: item.active ? 500 : 400,
                  color: item.active ? "#3B82F6" : "#4B5563",
                }}
              >
                {item.label}
              </span>
              {!item.active && (
                <span
                  style={{
                    fontSize: 11,
                    color: "#D1D5DB",
                    marginLeft: "auto",
                  }}
                >
                  Soon
                </span>
              )}
            </div>
          );
        })}
      </nav>

      {/* Client switcher */}
      <div
        style={{
          padding: "12px 16px",
          borderTop: "1px solid #F3F4F6",
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
        }}
      >
        <span
          style={{
            fontSize: 13,
            color: "#4B5563",
            flex: 1,
          }}
        >
          Root
        </span>
        <ChevronDown size={14} color="#9CA3AF" />
      </div>
    </aside>
  );
}
