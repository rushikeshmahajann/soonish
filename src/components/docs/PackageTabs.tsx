"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { CodeBlock } from "./CodeBlock";

const MANAGERS = [
  { id: "npm", command: "npm install soonish" },
  { id: "pnpm", command: "pnpm add soonish" },
  { id: "yarn", command: "yarn add soonish" },
  { id: "bun", command: "bun add soonish" },
] as const;

type Manager = (typeof MANAGERS)[number]["id"];

/**
 * Segmented control with a sliding indicator.
 *
 * The mechanism is lifted from the Day/Week/Month control: rather than giving
 * each tab its own background, there is a SINGLE absolutely-positioned pill whose
 * `translateX` and `width` are measured from the active tab's bounding rect,
 * relative to the container.
 *
 *   const c = container.getBoundingClientRect();
 *   const i = activeTab.getBoundingClientRect();
 *   indicator.style.transform = `translateX(${i.left - c.left}px)`;
 *   indicator.style.width = `${i.width}px`;
 *
 * Measuring instead of computing is what lets the tabs have different widths —
 * "pnpm" is wider than "npm" — and the pill still lands exactly on each one. Then
 * `transition: transform, width` animates between measurements, so the pill
 * appears to travel and stretch.
 */
export function PackageTabs() {
  const [active, setActive] = useState<Manager>("npm");
  const [pill, setPill] = useState({ left: 0, width: 0 });

  const listRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const measure = useCallback(() => {
    const list = listRef.current;
    const tab = tabRefs.current[active];
    if (!list || !tab) return;
    const c = list.getBoundingClientRect();
    const i = tab.getBoundingClientRect();
    // Subtract the container's left border. getBoundingClientRect gives the
    // BORDER box, but `left: 0` on an absolutely positioned child resolves
    // against the PADDING box, so without this every offset is one border too
    // large and the pill sits 1px right of its tab.
    setPill({ left: i.left - c.left - list.clientLeft, width: i.width });
  }, [active]);

  // Layout effect so the pill is positioned before the browser paints.
  useLayoutEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    // A ResizeObserver rather than a window resize listener: the container can
    // change width without the window doing so (sidebar toggles, font swaps).
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    return () => ro.disconnect();
  }, [measure]);

  // Arrow keys, as a tablist is expected to support.
  const onKeyDown = (e: React.KeyboardEvent) => {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const i = MANAGERS.findIndex((m) => m.id === active);
    const next = MANAGERS[(i + dir + MANAGERS.length) % MANAGERS.length];
    setActive(next.id);
    tabRefs.current[next.id]?.focus();
  };

  // Derived rather than stored: width 0 means we have not measured yet, so the
  // transition stays off for the first paint. Without this the pill visibly
  // slides in from nothing on mount — which the reference actually does.
  const ready = pill.width > 0;
  const command = MANAGERS.find((m) => m.id === active)!.command;

  return (
    <div className="my-5">
      <div
        ref={listRef}
        role="tablist"
        aria-label="Package manager"
        onKeyDown={onKeyDown}
        className="relative inline-flex items-center gap-1 rounded-full p-1"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* The single travelling pill. */}
        <span
          aria-hidden="true"
          className="absolute rounded-full"
          style={{
            left: 0,
            top: 4,
            bottom: 4,
            width: pill.width,
            transform: `translateX(${pill.left}px)`,
            background: "rgba(255,255,255,0.09)",
            boxShadow:
              "0 1px 2px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.08)",
            // transform is composited; width is not, but on a ~60px element the
            // repaint is negligible and it is what allows variable-width tabs.
            transitionProperty: ready ? "transform, width" : "none",
            transitionDuration: "200ms",
            transitionTimingFunction: "cubic-bezier(0, 0, 0.2, 1)",
            willChange: "transform, width",
          }}
        />

        {MANAGERS.map((m) => {
          const selected = m.id === active;
          return (
            <button
              key={m.id}
              ref={(el) => {
                tabRefs.current[m.id] = el;
              }}
              role="tab"
              type="button"
              aria-selected={selected}
              // Only the active tab is in the tab order; arrows move between them.
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(m.id)}
              className="relative z-10 cursor-pointer rounded-full px-4 py-1.5 text-xs transition-colors"
              style={{
                fontFamily: "monospace",
                color: selected ? "#fafafa" : "#71717a",
                background: "transparent",
              }}
            >
              {m.id}
            </button>
          );
        })}
      </div>

      <CodeBlock lang="bash" code={command} />
    </div>
  );
}
