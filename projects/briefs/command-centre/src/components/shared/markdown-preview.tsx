"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

export function MarkdownPreview({ content, className }: MarkdownPreviewProps) {
  return (
    <div className={className} style={{ maxWidth: 720, lineHeight: 1.6, fontFamily: "var(--font-inter), Inter, sans-serif" }}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 style={{ fontFamily: "var(--font-epilogue), Epilogue, sans-serif", color: "#1B1C1B", fontSize: 28, fontWeight: 700, margin: "24px 0 12px" }}>
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 style={{ fontFamily: "var(--font-epilogue), Epilogue, sans-serif", color: "#1B1C1B", fontSize: 22, fontWeight: 700, margin: "20px 0 10px" }}>
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 style={{ fontFamily: "var(--font-epilogue), Epilogue, sans-serif", color: "#1B1C1B", fontSize: 18, fontWeight: 600, margin: "16px 0 8px" }}>
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p style={{ margin: "8px 0", color: "#1B1C1B" }}>{children}</p>
          ),
          a: ({ href, children }) => (
            <a href={href} style={{ color: "#93452A", textDecoration: "underline" }} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
          code: ({ children, className: codeClassName }) => {
            const isInline = !codeClassName;
            if (isInline) {
              return (
                <code style={{ backgroundColor: "#F6F3F1", padding: "2px 6px", borderRadius: "0.25rem", fontFamily: "var(--font-space-grotesk), Space Grotesk, monospace", fontSize: 13 }}>
                  {children}
                </code>
              );
            }
            return (
              <code style={{ fontFamily: "var(--font-space-grotesk), Space Grotesk, monospace", fontSize: 13 }}>
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre style={{ backgroundColor: "#F6F3F1", padding: 16, borderRadius: "0.375rem", overflow: "auto", margin: "12px 0" }}>
              {children}
            </pre>
          ),
          table: ({ children }) => (
            <table style={{ width: "100%", borderCollapse: "collapse", margin: "12px 0" }}>
              {children}
            </table>
          ),
          thead: ({ children }) => (
            <thead style={{ backgroundColor: "#F6F3F1" }}>{children}</thead>
          ),
          tr: ({ children }) => (
            <tr style={{ borderBottom: "1px solid rgba(218, 193, 185, 0.2)" }}>{children}</tr>
          ),
          th: ({ children }) => (
            <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, fontSize: 13 }}>{children}</th>
          ),
          td: ({ children }) => (
            <td style={{ padding: "8px 12px", fontSize: 14 }}>{children}</td>
          ),
          ul: ({ children }) => (
            <ul style={{ paddingLeft: 24, margin: "8px 0" }}>{children}</ul>
          ),
          ol: ({ children }) => (
            <ol style={{ paddingLeft: 24, margin: "8px 0" }}>{children}</ol>
          ),
          li: ({ children }) => (
            <li style={{ margin: "4px 0" }}>{children}</li>
          ),
          blockquote: ({ children }) => (
            <blockquote style={{ borderLeft: "3px solid #93452A", paddingLeft: 16, margin: "12px 0", color: "#5E5E65", fontStyle: "italic" }}>
              {children}
            </blockquote>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
