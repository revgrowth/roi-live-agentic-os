"use client";

import { useState, useRef, useEffect, useCallback, KeyboardEvent } from "react";
import { Send, Paperclip, X, Image, FileType, FileText } from "lucide-react";
import { PermissionPicker } from "@/components/shared/permission-picker";
import { ModelPicker } from "@/components/shared/model-picker";
import { PastedTextCard } from "@/components/shared/pasted-text-card";
import type { PermissionMode, ClaudeModel } from "@/types/task";
import {
  insertTextareaNewline,
  shouldInsertModifierNewline,
  shouldSubmitOnPlainEnter,
  syncComposerTextareaHeight,
} from "@/lib/composer";
import {
  appendPendingPastedText,
  insertPastedTextAtSelection,
  removePendingPastedText,
  shouldCapturePastedText,
  type PendingPastedTextBlock,
} from "@/lib/pasted-text";
import { useComposerResize } from "@/hooks/use-composer-resize";

// ── Attachment helpers ──────────────────────────────────────────

interface Attachment {
  fileName: string;
  relativePath: string;
  extension: string;
  sizeBytes: number;
}

const IMAGE_EXTS = new Set(["png", "jpg", "jpeg", "gif", "webp", "svg"]);

function getAttachmentIcon(ext: string) {
  if (IMAGE_EXTS.has(ext)) return Image;
  if (ext === "pdf") return FileType;
  return FileText;
}

interface ChatInputProps {
  onSend: (message: string, options: { permissionMode: PermissionMode; model: ClaudeModel | null }) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ onSend, disabled, placeholder }: ChatInputProps) {
  const [value, setValue] = useState("");
  const [permissionMode, setPermissionMode] = useState<PermissionMode>("bypassPermissions");
  const [model, setModel] = useState<ClaudeModel | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [pastedTextBlocks, setPastedTextBlocks] = useState<PendingPastedTextBlock[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const minHeight = 60;
  const maxHeight = 320;
  const { composerHeight, hasUserResized, handleResizePointerDown } = useComposerResize({
    minHeight,
    maxHeight,
    initialHeight: minHeight,
  });

  useEffect(() => {
    syncComposerTextareaHeight(textareaRef.current, {
      maxHeight,
      minHeight,
      targetHeight: hasUserResized ? composerHeight : null,
    });
  }, [composerHeight, hasUserResized, maxHeight, minHeight, value]);

  const handleFileUpload = useCallback(async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("dir", ".tmp/attachments");
      const res = await fetch("/api/files/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const result: Attachment = await res.json();
      setAttachments((prev) => [...prev, result]);
    } catch { /* silently fail */ } finally {
      setIsUploading(false);
    }
  }, []);

  const removeAttachment = useCallback((relativePath: string) => {
    setAttachments((prev) => prev.filter((a) => a.relativePath !== relativePath));
  }, []);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) handleFileUpload(file);
        return;
      }
    }
    const text = e.clipboardData?.getData("text/plain") ?? "";
    if (shouldCapturePastedText(text)) {
      e.preventDefault();
      setPastedTextBlocks((prev) => [...prev, { id: crypto.randomUUID(), text }]);
    }
  }, [handleFileUpload]);

  const focusTextarea = useCallback((selectionStart?: number, selectionEnd = selectionStart) => {
    requestAnimationFrame(() => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      textarea.focus();
      if (selectionStart == null || selectionEnd == null) return;
      textarea.setSelectionRange(selectionStart, selectionEnd);
    });
  }, []);

  const handleInsertPastedText = useCallback((block: PendingPastedTextBlock) => {
    const textarea = textareaRef.current;
    const selectionStart = textarea?.selectionStart ?? value.length;
    const selectionEnd = textarea?.selectionEnd ?? selectionStart;
    const insertion = insertPastedTextAtSelection(
      value,
      block.text,
      selectionStart,
      selectionEnd,
    );

    setValue(insertion.value);
    setPastedTextBlocks((prev) => removePendingPastedText(prev, block.id));
    focusTextarea(insertion.selectionStart, insertion.selectionEnd);
    requestAnimationFrame(() => {
      syncComposerTextareaHeight(textareaRef.current, {
        minHeight,
        maxHeight,
        targetHeight: hasUserResized ? composerHeight : null,
      });
    });
  }, [composerHeight, focusTextarea, hasUserResized, maxHeight, minHeight, value]);

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed && attachments.length === 0 && pastedTextBlocks.length === 0) return;
    if (disabled) return;

    let finalMessage = appendPendingPastedText(trimmed, pastedTextBlocks);
    if (attachments.length > 0) {
      const attachmentLines = attachments.map((a) => `- ${a.relativePath}`).join("\n");
      finalMessage = finalMessage
        ? `${finalMessage}\n\nAttached files:\n${attachmentLines}`
        : `Attached files:\n${attachmentLines}`;
    }

    onSend(finalMessage, { permissionMode, model });
    setValue("");
    setAttachments([]);
    setPastedTextBlocks([]);
  }, [attachments, disabled, model, onSend, pastedTextBlocks, permissionMode, value]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (shouldInsertModifierNewline(e)) {
      e.preventDefault();
      insertTextareaNewline(e.currentTarget, setValue);
      return;
    }
    if (shouldSubmitOnPlainEnter(e)) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  return (
    <div style={{
      padding: "12px 16px",
      borderTop: "1px solid rgba(218, 193, 185, 0.15)",
      backgroundColor: "#FFFFFF",
    }}>
      <div style={{
        backgroundColor: "#F6F3F1",
        borderRadius: 12,
        border: "1px solid rgba(218, 193, 185, 0.2)",
        transition: "border-color 150ms ease",
      }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "8px 12px 0" }}>
          <button
            type="button"
            aria-label="Drag to resize input"
            onPointerDown={handleResizePointerDown}
            style={{
              width: 44,
              height: 8,
              border: "none",
              borderRadius: 999,
              backgroundColor: "rgba(156, 156, 160, 0.32)",
              cursor: "ns-resize",
            }}
          />
        </div>

        {(pastedTextBlocks.length > 0 || attachments.length > 0) && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "8px 12px 0" }}>
            {pastedTextBlocks.map((block) => (
              <PastedTextCard
                key={block.id}
                text={block.text}
                onInsert={() => handleInsertPastedText(block)}
                onRemove={() => setPastedTextBlocks((prev) => removePendingPastedText(prev, block.id))}
              />
            ))}
            {attachments.map((att) => {
              const Icon = getAttachmentIcon(att.extension);
              return (
                <div
                  key={att.relativePath}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "3px 8px",
                    borderRadius: 6,
                    backgroundColor: "rgba(218, 193, 185, 0.15)",
                    fontSize: 11,
                    fontFamily: "'DM Mono', monospace",
                    color: "#5E5E65",
                  }}
                >
                  <Icon size={12} />
                  <span style={{ maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {att.fileName}
                  </span>
                  <button
                    onClick={() => removeAttachment(att.relativePath)}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", color: "#9C9CA0" }}
                  >
                    <X size={10} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <div style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 8,
          padding: "8px 12px",
          minWidth: 0,
        }}>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder={placeholder || "Type a message..."}
            disabled={disabled}
            rows={1}
            style={{
              flex: 1,
              border: "none",
              background: "transparent",
              resize: "none",
              outline: "none",
              fontFamily: "var(--font-inter), Inter, sans-serif",
              fontSize: 14,
              lineHeight: "20px",
              color: "#1B1C1B",
              boxSizing: "border-box" as const,
              minHeight,
              maxHeight: hasUserResized ? composerHeight : maxHeight,
              maxWidth: "100%",
              whiteSpace: "pre-wrap",
              overflowWrap: "anywhere",
              wordBreak: "break-word",
              overflowX: "hidden",
              overflowY: "auto",
              padding: "2px 0",
            }}
          />
          <button
            onClick={handleSend}
            disabled={disabled || (!value.trim() && attachments.length === 0 && pastedTextBlocks.length === 0)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 32,
              height: 32,
              borderRadius: 8,
              border: "none",
              backgroundColor: (value.trim() || attachments.length > 0 || pastedTextBlocks.length > 0) && !disabled ? "#93452A" : "rgba(147, 69, 42, 0.15)",
              color: (value.trim() || attachments.length > 0 || pastedTextBlocks.length > 0) && !disabled ? "#FFFFFF" : "#9C9CA0",
              cursor: (value.trim() || attachments.length > 0 || pastedTextBlocks.length > 0) && !disabled ? "pointer" : "default",
              flexShrink: 0,
              transition: "all 120ms ease",
            }}
          >
            <Send size={16} />
          </button>
        </div>
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileUpload(file);
            e.target.value = "";
          }}
          style={{ display: "none" }}
          accept="image/*,.pdf,.md,.txt,.csv,.json,.html"
        />

        {/* Toolbar with permission and model pickers */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          padding: "4px 8px 6px",
          borderTop: "1px solid rgba(218, 193, 185, 0.15)",
        }}>
          {/* Attach file */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "4px 6px",
              border: "none",
              borderRadius: 5,
              backgroundColor: "transparent",
              color: isUploading ? "#bbb" : "#5E5E65",
              cursor: isUploading ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(e) => { if (!isUploading) e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.04)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
            title="Attach file"
          >
            <Paperclip size={14} />
          </button>
          <ModelPicker value={model} onChange={setModel} />
          <PermissionPicker value={permissionMode} onChange={setPermissionMode} />
        </div>
      </div>
    </div>
  );
}
