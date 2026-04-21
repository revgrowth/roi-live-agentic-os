import type { ChatAttachment, ChatPastedBlock } from "@/types/chat-composer";

export function expandComposerPastedBlocks(message: string, pastedBlocks: ChatPastedBlock[]): string {
  let expanded = message;
  for (const block of pastedBlocks) {
    expanded = expanded.replace(block.label, block.text);
  }
  return expanded;
}

export function composeMessageWithAttachments(message: string, attachments: ChatAttachment[]): string {
  const trimmed = message.trim();
  if (attachments.length === 0) {
    return trimmed;
  }

  const attachmentLines = attachments.map((attachment) => `- ${attachment.relativePath}`).join("\n");
  if (!trimmed) {
    return `Attached files:\n${attachmentLines}`;
  }
  return `${trimmed}\n\nAttached files:\n${attachmentLines}`;
}

export function hasComposerContent(message: string, attachments: ChatAttachment[]): boolean {
  return message.trim().length > 0 || attachments.length > 0;
}

export function getMessageTitleSource(message: string, attachments: ChatAttachment[]): string {
  const trimmed = message.trim();
  if (trimmed) return trimmed;
  if (attachments.length === 1) {
    return `Attached ${attachments[0].fileName}`;
  }
  if (attachments.length > 1) {
    return `Attached ${attachments.length} files`;
  }
  return "";
}
