"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId, useLayoutEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { NAV } from "./nav";

/*
 * Docs navigation as a tree with drawn connectors (after the tree-connector
 * reference): a dot per row on a vertical line, S-curves where the depth
 * changes, and a glowing segment that trails into the current page's dot and
 * glides along the line when you navigate.
 *
 * Geometry. The reference used 48px rows with an 18px indent; this is scaled
 * to a docs column at the same indent-to-row ratio (≈0.375), which is what
 * keeps the curves smooth rather than kinked.
 */
const ROW_H = 36;
const LINE_BASE = 14; // x of the depth-1 connector column
const INDENT = 14; // x step per depth
const LABEL_GAP = 16; // dot → label
const DOT_R = 3;
const ACCENT_LEN = 34; // length of the glowing tail (~one row)
// The pointer's glide between pages: a timed ease-in-out, so it lifts off
// gently, travels, and settles — rather than snapping away and creeping in.
const GLIDE_MS = 400;
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
// Bezier control-point offset above/below each bend's midpoint. 0 is the
// formula's floor: both control points sit on the midpoint, which gives the
// tightest bend it can make. Clamped per segment in buildPath so it can never
// overshoot.
const ZONE = 0;

type Row = { label: string; depth: 1 | 2; href?: string };

// Each section as a group, with its pages one level deeper.
const ROWS: Row[] = NAV.flatMap((s) => [
  { label: s.title, depth: 1 as const },
  ...s.items.map((i) => ({ label: i.title, depth: 2 as const, href: i.href })),
]);

const colX = (depth: number) => LINE_BASE + (Math.max(depth, 1) - 1) * INDENT;
const rowY = (i: number) => i * ROW_H + ROW_H / 2;

// Every row sits on the connector, in order.
const CONN = ROWS.map((r, i) => ({ ...r, i }));

function buildPath(zone: number) {
  const p = CONN.map((r) => ({ x: colX(r.depth), y: rowY(r.i) }));
  let d = `M ${p[0].x} ${p[0].y}`;
  for (let k = 1; k < p.length; k++) {
    const a = p[k - 1];
    const b = p[k];
    if (a.x === b.x) {
      d += ` L ${b.x} ${b.y}`;
    } else {
      // Control points `zone` px either side of the midpoint, at the entry and
      // exit columns. Clamped so they never cross — no cusp or loop.
      const mid = (a.y + b.y) / 2;
      const z = Math.min(zone, Math.abs(b.y - a.y) / 2 - 0.5);
      d += ` C ${a.x} ${mid - z}, ${b.x} ${mid + z}, ${b.x} ${b.y}`;
    }
  }
  return d;
}

const PATH = buildPath(ZONE);
const HEIGHT = ROWS.length * ROW_H;
const SVG_W = colX(2) + DOT_R * 4;

export function Sidebar() {
  const pathname = usePathname();
  const target = ROWS.findIndex((r) => r.href === pathname);

  const gradId = `sidebar-glow-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const hlRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);
  const gradRef = useRef<SVGLinearGradientElement>(null);
  // Animation state lives in a ref: frames write straight to the SVG, so a
  // navigation costs one React render, not one per frame.
  const anim = useRef<{ y: number | null; tailAbove: boolean; raf: number }>({ y: null, tailAbove: true, raf: 0 });

  useLayoutEffect(() => {
    const hl = hlRef.current;
    const dot = dotRef.current;
    const grad = gradRef.current;
    if (!hl || !dot || !grad) return;
    const s = anim.current;
    const total = hl.getTotalLength();

    // The path only ever moves downward, so length is monotonic in y: a
    // bisection finds the length at which it reaches a given y.
    const lengthAtY = (y: number) => {
      let lo = 0;
      let hi = total;
      for (let n = 0; n < 20; n++) {
        const m = (lo + hi) / 2;
        if (hl.getPointAtLength(m).y < y) lo = m;
        else hi = m;
      }
      return (lo + hi) / 2;
    };

    const draw = (selY: number | null) => {
      if (selY == null) {
        hl.style.strokeDasharray = `0 ${total}`;
        dot.style.opacity = "0";
        return;
      }
      const lDot = lengthAtY(selY);
      // The tail trails behind the direction of travel.
      const endY = s.tailAbove ? selY - ACCENT_LEN : selY + ACCENT_LEN;
      const lEnd = lengthAtY(endY);
      const lo = Math.min(lDot, lEnd);
      const hi = Math.max(lDot, lEnd);
      hl.style.strokeDasharray = `${Math.max(0, hi - lo)} ${total}`;
      hl.style.strokeDashoffset = `${-lo}`;
      // Transparent at the tail end, full accent at the dot.
      grad.setAttribute("y1", String(endY));
      grad.setAttribute("y2", String(selY));
      const pt = hl.getPointAtLength(lDot);
      dot.setAttribute("cx", String(pt.x));
      dot.setAttribute("cy", String(pt.y));
      dot.style.opacity = "1";
    };

    const tgt = target >= 0 ? rowY(target) : null;
    cancelAnimationFrame(s.raf);
    if (tgt == null) {
      s.y = null;
      draw(null);
      return;
    }
    // First paint, or reduced motion: land on the page directly.
    if (s.y == null || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      s.y = tgt;
      draw(tgt);
      return;
    }
    if (tgt > s.y + 1) s.tailAbove = true;
    else if (tgt < s.y - 1) s.tailAbove = false;

    // Tween from wherever the pointer is now — mid-glide included, if the
    // visitor clicks again before it lands — to the new page.
    const from = s.y;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / GLIDE_MS);
      s.y = from + (tgt - from) * easeInOutCubic(t);
      draw(s.y);
      if (t < 1) s.raf = requestAnimationFrame(step);
    };
    s.raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(s.raf);
  }, [target]);

  return (
    <nav
      aria-label="Docs"
      className="sticky top-16 hidden h-[calc(100vh-4rem)] w-60 shrink-0 overflow-y-auto pt-14 pb-12 pr-2 md:block"
    >
      <div className="rounded-xl px-2 py-3">
        <div className="relative" style={{ height: HEIGHT }}>
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute top-0 left-0 overflow-visible"
            width={SVG_W}
            height={HEIGHT}
            viewBox={`0 0 ${SVG_W} ${HEIGHT}`}
          >
            <defs>
              <linearGradient ref={gradRef} id={gradId} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" style={{ stopColor: "var(--brand)", stopOpacity: 0 }} />
                <stop offset="0.55" style={{ stopColor: "var(--brand)", stopOpacity: 0.55 }} />
                <stop offset="1" style={{ stopColor: "var(--brand)", stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            {/* The trunk: every row's connector. */}
            <path
              d={PATH}
              fill="none"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth={1.4}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* The glowing tail, dashed down to one segment by the effect. */}
            <path
              ref={hlRef}
              d={PATH}
              fill="none"
              stroke={`url(#${gradId})`}
              strokeWidth={2}
              strokeLinecap="round"
              style={{ strokeDasharray: "0 99999", filter: "drop-shadow(0 0 3px var(--brand))" }}
            />
            {CONN.map((r) => (
              <circle
                key={r.i}
                cx={colX(r.depth)}
                cy={rowY(r.i)}
                r={DOT_R}
                fill={r.depth === 1 ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.25)"}
              />
            ))}
            <circle
              ref={dotRef}
              r={DOT_R + 1}
              cx={-99}
              cy={-99}
              style={{
                fill: "var(--brand)",
                opacity: 0,
                filter: "drop-shadow(0 0 4px var(--brand)) drop-shadow(0 0 9px var(--brand))",
              }}
            />
          </svg>

          {ROWS.map((r, i) => {
            const padding = colX(r.depth) + LABEL_GAP;
            const rowClass = "relative z-10 flex w-full items-center rounded-md pr-3 font-mori text-sm";

            if (!r.href) {
              // Section group: a label on the tree, not a page.
              return (
                <div key={i} className={cn(rowClass, "font-medium text-white/85")} style={{ height: ROW_H, paddingLeft: padding }}>
                  {r.label}
                </div>
              );
            }
            const active = i === target;
            return (
              <Link
                key={i}
                href={r.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  rowClass,
                  "transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white/40",
                  active ? "font-medium text-white" : "text-white/50 hover:text-white",
                )}
                style={{ height: ROW_H, paddingLeft: padding }}
              >
                {r.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
