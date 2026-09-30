"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";

export interface TabItem {
  id: string;
  label: string;
  /** Optional glyph rendered before the label. */
  icon?: ReactNode;
}

interface SlidingTabsProps {
  items: readonly TabItem[];
  value: string;
  onChange: (id: string) => void;
  /** Accessible name for the tablist. */
  label: string;
}

/**
 * Tab strip with a sliding indicator.
 *
 * Mechanism: rather than each button owning a background, ONE indicator's
 * position and width are measured from the active button's bounding rect,
 * relative to the container.
 *
 *   const c = container.getBoundingClientRect();
 *   const i = activeButton.getBoundingClientRect();
 *   left  = i.left - c.left;
 *   width = i.width;
 *
 * Measuring rather than computing is the point: "pnpm" is wider than "npm", and
 * the indicator still lands exactly on each. Transitioning transform and width
 * between two measurements makes it travel and stretch.
 *
 * The indicator wears `custom-button`, so it renders with exactly the styling an
 * active button would have. The buttons themselves are transparent — if each
 * kept its own background there would be nothing to animate, only a cross-fade.
 */
export function SlidingTabs({ items, value, onChange, label }: SlidingTabsProps) {
  const [pill, setPill] = useState({ left: 0, width: 0 });

  const listRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const measure = useCallback(() => {
    const list = listRef.current;
    const btn = btnRefs.current[value];
    if (!list || !btn) return;
    const c = list.getBoundingClientRect();
    const i = btn.getBoundingClientRect();
    // `clientLeft` is the container's left border width, and it has to come off.
    // getBoundingClientRect returns the BORDER box, but `left: 0` on an
    // absolutely positioned child resolves against the containing block's
    // PADDING box — inside the border. Without this correction every offset is
    // one border too large, so the indicator sits 1px right of its button: a gap
    // appears on the left of the first tab, and the last tab's indicator
    // overhangs and hides the right border.
    setPill({ left: i.left - c.left - list.clientLeft, width: i.width });
  }, [value]);

  // Layout effect so the indicator is placed before the browser paints.
  useLayoutEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    // A ResizeObserver, not a window resize listener: the container can change
    // width without the window doing so — PP Mori swapping in and reflowing the
    // labels, for instance.
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    return () => ro.disconnect();
  }, [measure]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const i = items.findIndex((t) => t.id === value);
    const next = items[(i + dir + items.length) % items.length];
    onChange(next.id);
    btnRefs.current[next.id]?.focus();
  };

  // Width 0 means we have not measured yet, so the transition stays off for the
  // first paint — otherwise the indicator visibly slides in from nothing.
  const ready = pill.width > 0;

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={label}
      onKeyDown={onKeyDown}
      // Radii step down with the box: a container radius left at rounded-lg
      // would look too soft once the control is this small.
      className="relative h-max w-max flex justify-center items-center rounded-lg border border-white/10"
    >
      <span
        aria-hidden="true"
        className="custom-button rounded-md"
        style={{
          // `position` MUST be inline. `.custom-button` declares
          // `position: relative` and sits later in the stylesheet than Tailwind's
          // `.absolute` utility, so on equal specificity `relative` wins —
          // leaving a zero-width relative box in the flex row and no visible
          // indicator at all. Inline styles outrank every class.
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: pill.width,
          transform: `translateX(${pill.left}px)`,
          // Not activatable. Combined with the press being scoped to
          // `button.custom-button:active`, there is no route by which a pressed
          // style can become this element's resting appearance.
          pointerEvents: "none",
          // Overrides the class's own transition, which only covers translate.
          transitionProperty: ready ? "transform, width" : "none",
          transitionDuration: "200ms",
          transitionTimingFunction: "cubic-bezier(0, 0, 0.2, 1)",
          willChange: "transform, width",
        }}
      />

      {items.map((tab) => {
        const selected = tab.id === value;
        return (
          <button
            key={tab.id}
            ref={(el) => {
              btnRefs.current[tab.id] = el;
            }}
            role="tab"
            type="button"
            aria-selected={selected}
            // Only the active tab is tabbable; arrows move between them.
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(tab.id)}
            // Scaled down by shrinking type and padding rather than applying a
            // `transform: scale()`. A transform would resample the indicator's
            // 1.5px shine ring and its shadow ladder to fractional pixels and
            // blur them; reducing the box keeps every hairline crisp.
            className={`relative z-10 flex items-center gap-1.5 cursor-pointer font-mori tracking-tight text-sm px-2.5 py-0.5 rounded-sm transition-colors ${
              selected ? "text-white" : "text-white/30"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
