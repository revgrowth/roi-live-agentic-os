"use client";

import { useEffect, useState } from "react";
import { Brain, FileText } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { useClientStore } from "@/store/client-store";

interface ContextFile {
  name: string;
  path: string;
  size: number;
  modifiedAt: string;
  type: "memory" | "learnings" | "soul" | "user" | "other";
}

const typeLabels: Record<ContextFile["type"], string> = {
  memory: "Memory",
  learnings: "Learnings",
  soul: "Identity",
  user: "User",
  other: "Other",
};

export default function ContextPage() {
  const [files, setFiles] = useState<ContextFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const selectedClientId = useClientStore((s) => s.selectedClientId);

  useEffect(() => {
    setIsLoading(true);
    const url = selectedClientId
      ? `/api/context?clientId=${encodeURIComponent(selectedClientId)}`
      : "/api/context";

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setFiles(data);
        setIsLoading(false);
      })
      .catch(() => {
        setFiles([]);
        setIsLoading(false);
      });
  }, [selectedClientId]);

  const grouped = files.reduce<Record<string, ContextFile[]>>((acc, file) => {
    const key = file.type;
    if (!acc[key]) acc[key] = [];
    acc[key].push(file);
    return acc;
  }, {});

  return (
    <AppShell>
      <div>
        <h3
          style={{
            fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
            fontWeight: 700,
            fontSize: 18,
            color: "#1B1C1B",
            margin: "0 0 16px 0",
          }}
        >
          Context Files
        </h3>

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
            Loading context files...
          </div>
        )}

        {!isLoading && files.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              fontFamily: "var(--font-inter), Inter, sans-serif",
            }}
          >
            <Brain size={48} color="#5E5E65" style={{ marginBottom: 16 }} />
            <h4
              style={{
                fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
                fontWeight: 600,
                fontSize: 16,
                color: "#1B1C1B",
                margin: "0 0 8px 0",
              }}
            >
              No context files found
            </h4>
            <p
              style={{
                fontSize: 14,
                color: "#5E5E65",
                maxWidth: 320,
                margin: "0 auto",
              }}
            >
              Context files will appear here once your agentic-os project has memory, learnings, or identity files.
            </p>
          </div>
        )}

        {!isLoading &&
          Object.entries(grouped).map(([type, groupFiles]) => (
            <div key={type} style={{ marginBottom: 24 }}>
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
                {typeLabels[type as ContextFile["type"]] || type}
              </h4>
              {groupFiles.map((file) => (
                <div
                  key={file.path}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 16px",
                    backgroundColor: "#FFFFFF",
                    borderRadius: 6,
                    marginBottom: 4,
                  }}
                >
                  <FileText size={16} color="#5E5E65" />
                  <span
                    style={{
                      fontFamily: "var(--font-inter), Inter, sans-serif",
                      fontSize: 14,
                      color: "#1B1C1B",
                      flex: 1,
                    }}
                  >
                    {file.path}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
                      fontSize: 12,
                      color: "#5E5E65",
                    }}
                  >
                    {(file.size / 1024).toFixed(1)}KB
                  </span>
                </div>
              ))}
            </div>
          ))}
      </div>
    </AppShell>
  );
}
