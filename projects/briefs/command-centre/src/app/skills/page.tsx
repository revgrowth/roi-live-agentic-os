"use client";

import { useEffect, useState } from "react";
import { Cpu } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { useClientStore } from "@/store/client-store";

interface SkillEntry {
  name: string;
  folder: string;
  description: string;
  triggers: string;
  category: string;
}

const categoryColors: Record<string, string> = {
  mkt: "#93452A",
  str: "#2A6B93",
  ops: "#2A9359",
  viz: "#7B2A93",
  meta: "#5E5E65",
  tool: "#936B2A",
  acc: "#2A9389",
};

export default function SkillsPage() {
  const [skills, setSkills] = useState<SkillEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const selectedClientId = useClientStore((s) => s.selectedClientId);

  useEffect(() => {
    setIsLoading(true);
    const url = selectedClientId
      ? `/api/skills?clientId=${encodeURIComponent(selectedClientId)}`
      : "/api/skills";

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setSkills(data);
        setIsLoading(false);
      })
      .catch(() => {
        setSkills([]);
        setIsLoading(false);
      });
  }, [selectedClientId]);

  const grouped = skills.reduce<Record<string, SkillEntry[]>>((acc, skill) => {
    const key = skill.category;
    if (!acc[key]) acc[key] = [];
    acc[key].push(skill);
    return acc;
  }, {});

  return (
    <AppShell>
      <div>
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
            Skills
          </h3>
          <span
            style={{
              fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
              fontSize: 12,
              color: "#5E5E65",
            }}
          >
            {skills.length} installed
          </span>
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
            Loading skills...
          </div>
        )}

        {!isLoading && skills.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              fontFamily: "var(--font-inter), Inter, sans-serif",
            }}
          >
            <Cpu size={48} color="#5E5E65" style={{ marginBottom: 16 }} />
            <h4
              style={{
                fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
                fontWeight: 600,
                fontSize: 16,
                color: "#1B1C1B",
                margin: "0 0 8px 0",
              }}
            >
              No skills installed
            </h4>
            <p
              style={{
                fontSize: 14,
                color: "#5E5E65",
                maxWidth: 320,
                margin: "0 auto",
              }}
            >
              Skills will appear here once installed in the agentic-os project.
            </p>
          </div>
        )}

        {!isLoading &&
          Object.entries(grouped).map(([category, categorySkills]) => (
            <div key={category} style={{ marginBottom: 24 }}>
              <h4
                style={{
                  fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "#5E5E65",
                  marginBottom: 8,
                }}
              >
                {category}
              </h4>
              {categorySkills.map((skill) => (
                <div
                  key={skill.folder}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 16px",
                    backgroundColor: "#FFFFFF",
                    borderRadius: 6,
                    marginBottom: 4,
                    borderLeft: `3px solid ${categoryColors[skill.category] || "#5E5E65"}`,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontFamily: "var(--font-inter), Inter, sans-serif",
                        fontSize: 14,
                        fontWeight: 500,
                        color: "#1B1C1B",
                      }}
                    >
                      {skill.name}
                    </div>
                    {skill.description && (
                      <div
                        style={{
                          fontFamily: "var(--font-inter), Inter, sans-serif",
                          fontSize: 12,
                          color: "#5E5E65",
                          marginTop: 2,
                        }}
                      >
                        {skill.description}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
      </div>
    </AppShell>
  );
}
