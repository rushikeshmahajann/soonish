"use client";

import { useState } from "react";

interface CodeBlockProps {
  code: string;
  lang?: string;
  filename?: string;
}

export function CodeBlock({ code, lang = "tsx", filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="rounded-lg overflow-hidden text-sm my-5"
      style={{ border: "1px solid rgba(255,255,255,0.08)", background: "#111113" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#18181b" }}
      >
        <div className="flex items-center gap-2.5">
          {filename ? (
            <span className="text-xs font-medium" style={{ color: "#a1a1aa", fontFamily: "var(--font-jetbrains-mono, monospace)" }}>
              {filename}
            </span>
          ) : (
            <span
              className="text-xs px-1.5 py-0.5 rounded"
              style={{ background: "rgba(255,255,255,0.08)", color: "#71717a", fontFamily: "monospace" }}
            >
              {lang}
            </span>
          )}
        </div>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 text-xs transition-colors px-2 py-1 rounded"
          style={{
            color: copied ? "#d8d8d8" : "#71717a",
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        >
          {copied ? (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Copied
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code */}
      <pre className="overflow-x-auto p-4 leading-relaxed" style={{ margin: 0 }}>
        <code
          className="text-sm"
          style={{ color: "#e4e4e7", fontFamily: "var(--font-jetbrains-mono, 'JetBrains Mono', monospace)" }}
        >
          {code.trim()}
        </code>
      </pre>
    </div>
  );
}
