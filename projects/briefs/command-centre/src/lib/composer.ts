import type { KeyboardEvent as ReactKeyboardEvent } from "react";

interface SyncComposerTextareaOptions {
  maxHeight?: number;
  minHeight?: number;
}

export function shouldSubmitOnPlainEnter(
  event: ReactKeyboardEvent<HTMLTextAreaElement>,
): boolean {
  return (
    event.key === "Enter" &&
    !event.shiftKey &&
    !event.ctrlKey &&
    !event.metaKey &&
    !event.altKey &&
    !event.nativeEvent.isComposing
  );
}

export function shouldInsertModifierNewline(
  event: ReactKeyboardEvent<HTMLTextAreaElement>,
): boolean {
  return (
    event.key === "Enter" &&
    (event.ctrlKey || event.metaKey) &&
    !event.shiftKey &&
    !event.altKey &&
    !event.nativeEvent.isComposing
  );
}

export function insertTextareaNewline(
  textarea: HTMLTextAreaElement,
  setValue: (value: string) => void,
): void {
  const selectionStart = textarea.selectionStart ?? textarea.value.length;
  const selectionEnd = textarea.selectionEnd ?? selectionStart;
  const nextValue =
    textarea.value.slice(0, selectionStart) +
    "\n" +
    textarea.value.slice(selectionEnd);
  const nextCursor = selectionStart + 1;

  setValue(nextValue);

  requestAnimationFrame(() => {
    textarea.focus();
    textarea.setSelectionRange(nextCursor, nextCursor);
  });
}

export function syncComposerTextareaHeight(
  textarea: HTMLTextAreaElement | null,
  { maxHeight = 160, minHeight = 0 }: SyncComposerTextareaOptions = {},
): void {
  if (!textarea) return;

  textarea.style.height = "auto";

  const nextHeight = Math.max(
    minHeight,
    Math.min(textarea.scrollHeight, maxHeight),
  );

  textarea.style.height = `${nextHeight}px`;
  textarea.style.overflowY = textarea.scrollHeight > maxHeight ? "auto" : "hidden";
}
