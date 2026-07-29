"use client";

import { useState } from "react";
import { LiveLoaderGrid } from "@/components/docs/LiveLoader";
import { GROUPS, TOTAL } from "./groups";

/**
 * Six-swatch palette. `brand` is the yellow from the landing page heading and is
 * the default, so the whole workbench reads as one family rather than the
 * per-loader pastels the package falls back to.
 */
const PALETTE = [
  { name: "yellow", value: "#FFE748" },
  { name: "cream", value: "#FFF3B7" },
  { name: "mint", value: "#BEE8DC" },
  { name: "violet", value: "#C9D0F4" },
  { name: "pink", value: "#EDC8CF" },
  { name: "lime", value: "#D7E9BD" },
] as const;

export function LoaderExplorer() {
  const [color, setColor] = useState<string>(PALETTE[0].value);

  return (
    <>
      <p className="mb-6 text-xs" style={{ color: "#52525b", fontFamily: "monospace" }}>
        Workbench
      </p>

      <div className="mb-3 flex items-baseline gap-3">
        <h1 className="font-pixel text-4xl" style={{ letterSpacing: "-0.03em", color }}>
          loaders
        </h1>
        <span
          className="rounded-full px-2 py-0.5 text-xs font-medium"
          style={{ background: "rgba(255,255,255,0.06)", color: "#d8d8d8", fontFamily: "monospace" }}
        >
          {TOTAL}
        </span>
      </div>

      <p className="mb-6 max-w-2xl text-sm" style={{ color: "#71717a", lineHeight: 1.6 }}>
        Every loader in the package, grouped by category. Each one is a 5×5 grid of 25 divs —
        only the timing function and per-pixel delay differ. Tiles mount lazily as they scroll
        into view.
      </p>

      {/* Colour picker. Every loader takes `color`, so one value restyles all 91. */}
      <div className="mb-10 flex items-center gap-3">
        <span className="text-xs" style={{ color: "#52525b", fontFamily: "monospace" }}>
          colour
        </span>
        <div className="flex gap-2">
          {PALETTE.map((c) => {
            const active = c.value === color;
            return (
              <button
                key={c.value}
                type="button"
                onClick={() => setColor(c.value)}
                aria-label={c.name}
                aria-pressed={active}
                title={c.name}
                className="h-6 w-6 rounded-full transition-transform"
                style={{
                  background: c.value,
                  // A ring rather than a border, so the swatch size never shifts.
                  boxShadow: active
                    ? `0 0 0 2px #050505, 0 0 0 3.5px ${c.value}`
                    : "0 0 0 1px rgba(255,255,255,0.18)",
                  transform: active ? "scale(1.08)" : undefined,
                  cursor: "pointer",
                }}
              />
            );
          })}
        </div>
        <code className="text-xs" style={{ color: "#52525b", fontFamily: "monospace" }}>
          {color}
        </code>
      </div>

      <nav className="mb-12 flex flex-wrap gap-2">
        {GROUPS.map((g) => (
          <a
            key={g.id}
            href={`#${g.id}`}
            className="rounded-md px-3 py-1.5 text-xs transition-colors"
            style={{
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.03)",
              color: "#a1a1aa",
              fontFamily: "monospace",
            }}
          >
            {g.title} <span style={{ color: "#52525b" }}>{g.names.length}</span>
          </a>
        ))}
      </nav>

      {GROUPS.map((g) => (
        <section key={g.id} className="mb-14 scroll-mt-8" id={g.id}>
          <div className="mb-2 flex items-center gap-3">
            <h2 className="text-2xl font-semibold" style={{ letterSpacing: "-0.02em" }}>
              {g.title}
            </h2>
            <span
              className="rounded-full px-2 py-0.5 text-xs font-medium"
              style={{ background: "rgba(255,255,255,0.06)", color: "#d8d8d8", fontFamily: "monospace" }}
            >
              {g.names.length}
            </span>
          </div>
          <p className="mb-5 text-sm" style={{ color: "#71717a", lineHeight: 1.6 }}>
            {g.desc}
          </p>
          {/* Span-driven: gap is derived so dots stay ~62% of cell pitch. */}
          <LiveLoaderGrid
            loaders={g.names.map((name) => ({ name }))}
            size={g.size ?? 40}
            dotSize={5}
            color={color}
          />
        </section>
      ))}
    </>
  );
}
