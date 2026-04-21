"use client";

import { useEffect, useCallback, useState, KeyboardEvent } from "react";
import { Paperclip, Send } from "lucide-react";
import { PermissionPicker } from "@/components/shared/permission-picker";
import { ModelPicker } from "@/components/shared/model-picker";
import { ChatAttachmentStrip } from "@/components/shared/chat-attachment-strip";
import { ComposerAssetTray } from "@/components/shared/composer-asset-tray";
import { useChatComposer } from "@/hooks/use-chat-composer";
import type { PermissionMode, ClaudeModel } from "@/types/task";
import type { ChatAttachment } from "@/types/chat-composer";
import {
  insertTextareaNewline,
  shouldInsertModifierNewline,
  shouldSubmitOnPlainEnter,
  syncComposerTextareaHeight,
} from "@/lib/composer";

interface ChatInputProps {
  scopeId?: string | null;
  onSend: (message: string, options: { permissionMode: PermissionMode; model: ClaudeModel | null; attachments: ChatAttachment[] }) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ scopeId, onSend, disabled, placeholder }: ChatInputProps) {
  const [permissionMode, setPermissionMode] = useState<PermissionMode>("bypassPermissions");
  const [model, setModel] = useState<ClaudeModel | null>(null);
  const composer = useChatComposer({
    surface: "conversation",
    scopeId,
  });
  const maxHeight = 160;
  const hasAssets = composer.attachments.length > 0 || composer.uploads.length > 0;

  useEffect(() => {
    syncComposerTextareaHeight(composer.textareaRef.current, { maxHeight });
  }, [composer.message, composer.textareaRef]);

  const handleSend = useCallback(() => {
    const submission = composer.buildSubmission();
    if ((!submission.message && submission.attachments.length === 0) || disabled) return;

    onSend(submission.message, {
      permissionMode,
      model,
      attachments: submission.attachments,
    });
    composer.clearComposer();
  }, [composer, disabled, model, onSend, permissionMode]);

  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (shouldInsertModifierNewline(event)) {
      event.preventDefault();
      insertTextareaNewline(event.currentTarget, composer.setMessage);
      return;
    }
    if (shouldSubmitOnPlainEnter(event)) {
      event.preventDefault();
      handleSend();
    }
  }, [composer.setMessage, handleSend]);

  return (
    <div
      onDragEnter={composer.handleDragEnter}
      onDragOver={composer.handleDragOver}
      onDragLeave={composer.handleDragLeave}
      onDrop={composer.handleDrop}
      style={{
        padding: "12px 16px",
        borderTop: "1px solid rgba(218, 193, 185, 0.15)",
        backgroundColor: "#FFFFFF",
      }}
    >
      <div style={{
        backgroundColor: "#F6F3F1",
        borderRadius: 12,
        border: composer.isDragging ? "1px solid rgba(147, 69, 42, 0.45)" : "1px solid rgba(218, 193, 185, 0.2)",
        boxShadow: composer.isDragging ? "0 0 0 3px rgba(147, 69, 42, 0.08)" : "none",
        transition: "border-color 150ms ease, box-shadow 150ms ease",
      }}>
        {hasAssets ? (
          <ComposerAssetTray>
            <ChatAttachmentStrip
              attachments={composer.attachments}
              uploads={composer.uploads}
              onRemoveAttachment={(attachment) => { void composer.removeAttachment(attachment); }}
              onRetryUpload={(uploadId) => { void composer.retryUpload(uploadId); }}
              onRemoveUpload={composer.removeUpload}
              padding="0"
            />
          </ComposerAssetTray>
        ) : null}
        <div style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 8,
          padding: "8px 12px",
        }}>
          <textarea
            ref={composer.textareaRef}
            value={composer.message}
            onChange={(event) => composer.setMessage(event.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={composer.handlePaste}
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
              maxHeight,
              overflowY: "hidden",
              padding: "2px 0",
            }}
          />
          <button
            onClick={handleSend}
            disabled={disabled || (!composer.message.trim() && composer.attachments.length === 0)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 32,
              height: 32,
              borderRadius: 8,
              border: "none",
              backgroundColor: (composer.message.trim() || composer.attachments.length > 0) && !disabled ? "#93452A" : "rgba(147, 69, 42, 0.15)",
              color: (composer.message.trim() || composer.attachments.length > 0) && !disabled ? "#FFFFFF" : "#9C9CA0",
              cursor: (composer.message.trim() || composer.attachments.length > 0) && !disabled ? "pointer" : "default",
              flexShrink: 0,
              transition: "all 120ms ease",
            }}
          >
            <Send size={16} />
          </button>
        </div>

        <input
          ref={composer.fileInputRef}
          type="file"
          multiple
          onChange={composer.handleFileInputChange}
          style={{ display: "none" }}
          accept={composer.accept}
        />

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          padding: "4px 8px 6px",
          borderTop: "1px solid rgba(218, 193, 185, 0.15)",
        }}>
          <button
            type="button"
            onClick={composer.openFilePicker}
            disabled={composer.isUploading || !scopeId}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "4px 6px",
              border: "none",
              borderRadius: 5,
              backgroundColor: "transparent",
              color: composer.isUploading || !scopeId ? "#bbb" : "#5E5E65",
              cursor: composer.isUploading || !scopeId ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(event) => { if (!composer.isUploading && scopeId) event.currentTarget.style.backgroundColor = "rgba(0,0,0,0.04)"; }}
            onMouseLeave={(event) => { event.currentTarget.style.backgroundColor = "transparent"; }}
            title={scopeId ? "Attach files" : "Chat is still loading"}
          >
            <Paperclip size={14} />
          </button>
          {composer.hasDraft && (
            <button
              type="button"
              onClick={() => { void composer.discardDraft(); }}
              style={{
                border: "none",
                background: "transparent",
                color: "#9C9CA0",
                fontSize: 11,
                fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
                cursor: "pointer",
                padding: "4px 6px",
              }}
            >
              Discard draft
            </button>
          )}
          <ModelPicker value={model} onChange={setModel} />
          <PermissionPicker value={permissionMode} onChange={setPermissionMode} />
        </div>
      </div>
    </div>
  );
}
