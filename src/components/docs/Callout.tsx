import type { ReactNode } from "react";

type CalloutType = "note" | "warning" | "tip" | "important";

const LABEL: Record<CalloutType, string> = {
  note: "Note",
  tip: "Good to know",
  warning: "Warning",
  important: "Important",
};

/**
 * An aside on the tile surface, marked by a short accent bar. The bar uses
 * --brand, so callouts follow the colour picked in the accent menu like the
 * loaders do; warnings keep a fixed amber so they never read as decoration.
 */
export function Callout({ type = "note", children }: { type?: CalloutType; children: ReactNode }) {
  return (
    <div className="my-7 flex gap-4 rounded-md px-5 py-4 text-sm leading-7">
      <span
        aria-hidden="true"
        className="mt-1.5 h-4 w-0.5 shrink-0 rounded-full"
        style={{ background: type === "warning" ? "oklch(0.871 0.059 72.741)" : "var(--brand)" }}
      />
      <div className="text-white/50">
        <span className="mr-1.5 font-mori font-medium text-white/85">{LABEL[type]}:</span>
        {children}
      </div>
    </div>
  );
}
