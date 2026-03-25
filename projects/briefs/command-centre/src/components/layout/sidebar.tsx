"use client";

const navItems = [
  { label: "Board", active: true },
  { label: "Cron Jobs", active: false },
  { label: "Context", active: false },
  { label: "Brand", active: false },
  { label: "Skills", active: false },
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
          padding: "24px 16px 16px",
        }}
      >
        <h1
          style={{
            fontSize: 18,
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
        {navItems.map((item) => (
          <div
            key={item.label}
            style={{
              height: 40,
              display: "flex",
              alignItems: "center",
              padding: "0 12px",
              borderRadius: 6,
              cursor: item.active ? "default" : "not-allowed",
              backgroundColor: item.active ? "#EFF6FF" : "transparent",
              position: "relative",
              marginBottom: 2,
            }}
          >
            {item.active && (
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 8,
                  bottom: 8,
                  width: 3,
                  borderRadius: 2,
                  backgroundColor: "#3B82F6",
                }}
              />
            )}
            <span
              style={{
                fontSize: 14,
                fontWeight: item.active ? 500 : 400,
                color: item.active ? "#3B82F6" : "#9CA3AF",
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
        ))}
      </nav>

      {/* Client switcher placeholder */}
      <div
        style={{
          padding: "16px",
          borderTop: "1px solid #F3F4F6",
        }}
      >
        <span
          style={{
            fontSize: 12,
            color: "#9CA3AF",
          }}
        >
          All Clients
        </span>
      </div>
    </aside>
  );
}
