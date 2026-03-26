"use client";

import { useState, useEffect, useCallback } from "react";
import { AlertCircle, Check, Save } from "lucide-react";

interface JsonEditorProps {
  apiEndpoint: string;
  title: string;
  description: string;
  emptyMessage: string;
}

function validateJson(text: string): string | null {
  try {
    JSON.parse(text);
    return null;
  } catch (e) {
    const msg = (e as Error).message;
    const posMatch = msg.match(/position (\d+)/);
    if (posMatch) {
      const pos = parseInt(posMatch[1], 10);
      const lineNum = text.slice(0, pos).split("\n").length;
      return `Invalid JSON (line ~${lineNum}): ${msg}`;
    }
    return `Invalid JSON: ${msg}`;
  }
}

export function JsonEditor({ apiEndpoint, title, description, emptyMessage }: JsonEditorProps) {
  const [content, setContent] = useState("");
  const [originalContent, setOriginalContent] = useState("");
  const [lastModified, setLastModified] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [exists, setExists] = useState(false);
  const [focused, setFocused] = useState(false);

  const loadContent = useCallback(async () => {
    try {
      const res = await fetch(apiEndpoint);
      const data = await res.json();
      setExists(data.exists);
      setLastModified(data.lastModified || null);

      if (data.exists && data.content) {
        let formatted = data.content;
        try {
          formatted = JSON.stringify(JSON.parse(data.content), null, 2);
        } catch {
          // Use raw content if not valid JSON
        }
        setContent(formatted);
        setOriginalContent(formatted);
      } else {
        setContent("");
        setOriginalContent("");
      }
    } catch {
      setError("Failed to load file");
    } finally {
      setLoading(false);
    }
  }, [apiEndpoint]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setContent("");
    setOriginalContent("");
    setSaveSuccess(false);
    setExists(false);
    loadContent();
  }, [loadContent]);

  const handleChange = (value: string) => {
    setContent(value);
    if (value.trim() === "") {
      setError(null);
    } else {
      setError(validateJson(value));
    }
  };

  const handleSave = async () => {
    if (error || saving) return;

    setSaving(true);
    try {
      const res = await fetch(apiEndpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, lastModified }),
      });

      if (res.status === 400) {
        const data = await res.json();
        setError(data.error || "Invalid JSON");
        return;
      }

      if (res.status === 409) {
        setError("File was modified externally. Reload the page to see changes.");
        return;
      }

      if (!res.ok) {
        setError("Failed to save file");
        return;
      }

      const data = await res.json();
      setLastModified(data.lastModified);
      setOriginalContent(content);
      setExists(true);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch {
      setError("Failed to save file");
    } finally {
      setSaving(false);
    }
  };

  const handleCreateFile = () => {
    const initial = "{}";
    setContent(initial);
    setOriginalContent("");
    setExists(true);
    setError(null);
  };

  const isDirty = content !== originalContent;
  const saveDisabled = !isDirty || saving || !!error;

  if (loading) {
    return (
      <div style={{ padding: 20 }}>
        <div
          style={{
            height: 500,
            backgroundColor: "#F6F3F1",
            borderRadius: 8,
            animation: "pulse-badge 2s ease-in-out infinite",
          }}
        />
      </div>
    );
  }

  if (!exists && !content) {
    return (
      <div
        style={{
          padding: 40,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div
          style={{
            color: "#5E5E65",
            fontFamily: "var(--font-inter), Inter, sans-serif",
            fontSize: 14,
            textAlign: "center",
          }}
        >
          {emptyMessage}
        </div>
        <button
          onClick={handleCreateFile}
          style={{
            padding: "8px 20px",
            backgroundColor: "#93452A",
            color: "#FFFFFF",
            border: "none",
            borderRadius: 8,
            fontFamily: "var(--font-inter), Inter, sans-serif",
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
            transition: "background-color 150ms ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#7A3823";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#93452A";
          }}
        >
          Create File
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 20px",
          borderBottom: "1px solid rgba(218, 193, 185, 0.2)",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
              fontSize: 16,
              fontWeight: 600,
              color: "#1B1C1B",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 12,
              color: "#5E5E65",
              marginTop: 4,
            }}
          >
            {description}
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saveDisabled}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 20px",
            backgroundColor: saveDisabled ? "#D4C4BD" : "#93452A",
            color: "#FFFFFF",
            border: "none",
            borderRadius: 8,
            fontFamily: "var(--font-inter), Inter, sans-serif",
            fontSize: 13,
            fontWeight: 500,
            cursor: saveDisabled ? "not-allowed" : "pointer",
            transition: "background-color 150ms ease",
            opacity: saveDisabled ? 0.6 : 1,
          }}
          onMouseEnter={(e) => {
            if (!saveDisabled) {
              e.currentTarget.style.backgroundColor = "#7A3823";
            }
          }}
          onMouseLeave={(e) => {
            if (!saveDisabled) {
              e.currentTarget.style.backgroundColor = "#93452A";
            }
          }}
        >
          {saveSuccess ? (
            <>
              <Check size={14} />
              Saved
            </>
          ) : saving ? (
            "Saving..."
          ) : (
            <>
              <Save size={14} />
              Save
            </>
          )}
        </button>
      </div>

      {/* Editor */}
      <div style={{ padding: 20 }}>
        <textarea
          value={content}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          spellCheck={false}
          autoComplete="off"
          style={{
            width: "100%",
            minHeight: 500,
            padding: 20,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 13,
            lineHeight: 1.6,
            color: "#1B1C1B",
            backgroundColor: "#FAFBFC",
            border: error
              ? "1px solid #dc2626"
              : focused
                ? "1px solid #93452A"
                : "1px solid rgba(218, 193, 185, 0.3)",
            borderRadius: 8,
            resize: "vertical",
            outline: "none",
            boxShadow: focused && !error ? "0 0 0 2px rgba(147, 69, 42, 0.1)" : "none",
            boxSizing: "border-box",
            display: "block",
          }}
        />

        {/* Error display */}
        {error && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "#dc2626",
              fontSize: 12,
              fontFamily: "monospace",
              padding: "8px 0",
              marginTop: 8,
            }}
          >
            <AlertCircle size={14} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}
