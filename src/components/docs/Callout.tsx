import type { ReactNode } from "react";

type CalloutType = "note" | "warning" | "tip" | "important";

const CONFIG: Record<CalloutType, { icon: string; label: string; border: string; bg: string; text: string }> = {
  note:      { icon: "ℹ", label: "Note",      border: "#8a8a8a", bg: "rgba(255,255,255,0.04)", text: "#d8d8d8" },
  tip:       { icon: "✦", label: "Good to know", border: "#a9a9a9", bg: "rgba(255,255,255,0.04)", text: "#e0e0e0" },
  warning:   { icon: "⚠", label: "Warning",   border: "#b8aa92", bg: "rgba(255,255,255,0.04)", text: "#ded3c0" },
  important: { icon: "★", label: "Important", border: "#9f9f9f", bg: "rgba(255,255,255,0.04)", text: "#d0d0d0" },
};

export function Callout({ type = "note", children }: { type?: CalloutType; children: ReactNode }) {
  const c = CONFIG[type];
  return (
    <div
      className="flex gap-3 rounded-lg px-4 py-3.5 my-5 text-sm leading-relaxed"
      style={{ background: c.bg, borderLeft: `3px solid ${c.border}` }}
    >
      <span className="shrink-0 mt-px font-semibold" style={{ color: c.border }}>{c.icon}</span>
      <div>
        <span className="font-semibold mr-1.5" style={{ color: c.text }}>{c.label}:</span>
        <span style={{ color: "#a1a1aa" }}>{children}</span>
      </div>
    </div>
  );
}
