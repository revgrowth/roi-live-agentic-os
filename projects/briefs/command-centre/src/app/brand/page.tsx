"use client";

import { useEffect, useState } from "react";
import { Sparkles, FileText } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { useClientStore } from "@/store/client-store";

interface BrandFile {
  name: string;
  path: string;
  size: number;
  modifiedAt: string;
}

export default function BrandPage() {
  const [files, setFiles] = useState<BrandFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const selectedClientId = useClientStore((s) => s.selectedClientId);

  useEffect(() => {
    setIsLoading(true);
    const url = selectedClientId
      ? `/api/brand?clientId=${encodeURIComponent(selectedClientId)}`
      : "/api/brand";

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
          Brand Context
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
            Loading brand context...
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
            <Sparkles size={48} color="#5E5E65" style={{ marginBottom: 16 }} />
            <h4
              style={{
                fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
                fontWeight: 600,
                fontSize: 16,
                color: "#1B1C1B",
                margin: "0 0 8px 0",
              }}
            >
              No brand context files found
            </h4>
            <p
              style={{
                fontSize: 14,
                color: "#5E5E65",
                maxWidth: 320,
                margin: "0 auto",
              }}
            >
              Brand context files like voice profile, positioning, and ICP will appear here once created.
            </p>
          </div>
        )}

        {!isLoading && files.length > 0 && (
          <div>
            {files.map((file) => (
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
                  {file.name}
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
                <span
                  style={{
                    fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
                    fontSize: 11,
                    color: "#9C9CA0",
                  }}
                >
                  {new Date(file.modifiedAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
