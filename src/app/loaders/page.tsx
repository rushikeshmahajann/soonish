import type { Metadata } from "next";
import type { LoaderName } from "1hundo-loaders";
import { LiveLoaderGrid } from "@/components/docs/LiveLoader";

export const metadata: Metadata = {
  title: "Loaders — all 68",
  description: "Every loader in the 1hundo-loaders package, grouped by category.",
};

type Group = {
  id: string;
  title: string;
  desc: string;
  size?: number;
  names: LoaderName[];
};

// Mirrors the category comments on the LoaderName union in
// packages/1hundo-loaders/src/types.ts. Typed as LoaderName[], so a rename or
// typo in the package fails `tsc` here rather than rendering nothing.
const GROUPS: Group[] = [
  {
    id: "pulse",
    title: "Pulse Wave",
    desc: "Brightness pulses travelling along a path or field.",
    names: [
      "sweep", "diagonal", "ripple", "rain", "spiral", "snake", "sparkle",
      "heartbeat", "scanner", "orbit", "breathe", "checker", "stripes",
      "falling", "plasma", "loadbar", "knight-tour", "vortex",
      "sine-wave", "life", "quadrants", "crossfade", "glider", "matrix",
      "pong", "concentric", "twin-spirals",
    ],
  },
  {
    id: "ai",
    title: "AI / Process",
    desc: "Named for agent states — thinking, searching, streaming.",
    names: [
      "thinking", "searching", "finding", "consolidating", "streaming",
      "reasoning", "indexing", "connecting", "generating", "reflecting",
    ],
  },
  {
    id: "scale",
    title: "Scale",
    desc: "Pixels scale in and out instead of pulsing brightness.",
    names: ["scale-ripple", "scale-wave", "scale-diag", "scale-pop", "scale-ring", "scale-check"],
  },
  {
    id: "funky",
    title: "Funky Scale",
    desc: "Scale variants with rotation, skew, squash and overshoot.",
    names: [
      "twist", "squash", "jelly", "pop-rotate", "skew", "heartbeat-scale",
      "drop", "burst", "spiral-scale", "zigzag",
    ],
  },
  {
    id: "mandalas",
    title: "Mandalas",
    desc: "Symmetric masks where only pixels on a geometric path animate.",
    names: [
      "round", "square-mandala", "diamond-mandala", "cross", "x-diagonal",
      "star-burst", "petal", "snowflake", "gear", "kaleido", "spiral-mandala",
      "pulse-square", "check-mandala", "octagon", "lotus",
    ],
  },
];

const TOTAL = GROUPS.reduce((n, g) => n + g.names.length, 0);

export default function LoadersPage() {
  return (
    <main className="min-h-screen w-full px-6 py-12 md:px-10" style={{ background: "#050505", color: "#fafafa" }}>
      <div className="mx-auto max-w-screen-xl">
        <p className="mb-6 text-xs" style={{ color: "#52525b", fontFamily: "monospace" }}>
          Workbench
        </p>

        <div className="mb-3 flex items-baseline gap-3">
          <h1 className="text-4xl font-bold tracking-tight" style={{ letterSpacing: "-0.03em" }}>
            Loaders
          </h1>
          <span
            className="rounded-full px-2 py-0.5 text-xs font-medium"
            style={{ background: "rgba(255,255,255,0.06)", color: "#d8d8d8", fontFamily: "monospace" }}
          >
            {TOTAL}
          </span>
        </div>

        <p className="mb-10 max-w-2xl text-sm" style={{ color: "#71717a", lineHeight: 1.6 }}>
          Every loader in the package, grouped by category. Each one is a 5×5 grid of 25 divs —
          only the timing function and per-pixel delay differ. Tiles mount lazily as they scroll
          into view.
        </p>

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
            <LiveLoaderGrid loaders={g.names.map((name) => ({ name }))} size={g.size ?? 40} dotSize={5} />
          </section>
        ))}
      </div>
    </main>
  );
}
