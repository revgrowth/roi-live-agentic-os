"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Clock, Brain, Sparkles, Cpu, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { ClientSwitcher } from "./client-switcher";

const navItems = [
  { label: "Board", icon: LayoutDashboard, href: "/" },
  { label: "Cron Jobs", icon: Clock, href: "/cron" },
  { label: "Context", icon: Brain, href: "/context" },
  { label: "Brand", icon: Sparkles, href: "/brand" },
  { label: "Skills", icon: Cpu, href: "/skills" },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: collapsed ? 64 : 256,
        backgroundColor: "#F6F3F1",
        display: "flex",
        flexDirection: "column",
        padding: collapsed ? "16px 8px" : 16,
        gap: 24,
        flexShrink: 0,
        fontFamily: "var(--font-inter), Inter, sans-serif",
        fontSize: 14,
        fontWeight: 500,
        transition: "width 200ms ease, padding 200ms ease",
        overflow: "hidden",
      }}
    >
      {/* Branding */}
      <div style={{ padding: collapsed ? "16px 0" : "16px 8px", textAlign: collapsed ? "center" : "left" }}>
        {collapsed ? (
          <span
            style={{
              fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
              fontWeight: 700,
              fontSize: 22,
              color: "#93452A",
            }}
          >
            A
          </span>
        ) : (
          <>
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
          </>
        )}
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: collapsed ? "center" : "flex-start",
                gap: collapsed ? 0 : 12,
                padding: collapsed ? "10px 0" : "10px 12px",
                borderRadius: 12,
                cursor: isActive ? "default" : "pointer",
                backgroundColor: isActive ? "#FFFFFF" : "transparent",
                color: isActive ? "#93452A" : "#5E5E65",
                textDecoration: "none",
                transition: "all 200ms ease",
                boxShadow: isActive
                  ? "0px 4px 12px rgba(147, 69, 42, 0.06)"
                  : "none",
                width: collapsed ? 40 : "auto",
                height: 40,
                margin: collapsed ? "0 auto" : 0,
              }}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={20} />
              {!collapsed && <span style={{ fontWeight: 500, whiteSpace: "nowrap" }}>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#5E5E65",
          borderRadius: 8,
          transition: "color 150ms ease",
          margin: collapsed ? "0 auto" : 0,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = "#93452A"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = "#5E5E65"; }}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>

      {/* New Agent button */}
      <button
        style={{
          background: "linear-gradient(135deg, #93452A 0%, #B25D3F 100%)",
          color: "#FFFFFF",
          fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
          fontWeight: 600,
          padding: collapsed ? "12px 0" : "12px 16px",
          borderRadius: 12,
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: collapsed ? 0 : 8,
          fontSize: 14,
          transition: "all 200ms ease",
          width: collapsed ? 40 : "auto",
          height: 40,
          margin: collapsed ? "0 auto" : 0,
        }}
        title={collapsed ? "New Agent" : undefined}
      >
        <Plus size={16} />
        {!collapsed && "New Agent"}
      </button>

      {/* Client switcher divider */}
      <div style={{ borderTop: "1px solid rgba(218, 193, 185, 0.2)", margin: "16px 0" }} />

      {/* Client switcher */}
      <ClientSwitcher collapsed={collapsed} />
    </aside>
  );
}
