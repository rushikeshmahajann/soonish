"use client";

import { useEffect, useRef, useState } from "react";
import { Loader, getMatrix5Layout } from "soonish";
import type { LoaderName } from "soonish";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";

// Status lines for the bare (Example) previews, in the spirit of the landing
// page's "Marinating… / Noodling…". Picked from the loader's name and label, so
// a given loader always gets the same line and server and client agree.
const MESSAGES = ["Marinating…", "Noodling…", "Smooshing…", "Pondering…", "Brewing…", "Percolating…", "Tinkering…", "Conjuring…"];
const messageFor = (key: string) => {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return MESSAGES[h % MESSAGES.length];
};

interface LiveLoaderProps {
  name: LoaderName;
  color?: string;
  /** Total matrix span in px. */
  size?: number;
  /** Dot size in px. */
  dotSize?: number;
  /** Explicit gap override; when set, size is ignored. */
  cellPadding?: number;
  speed?: number;
  label?: string;
  /**
   * No tile of its own — for use on a panel that already has the surface
   * (PreviewTabs). Laid out like the landing Usage preview: the loader, with a
   * shimmering status line beside it and the label underneath.
   */
  bare?: boolean;
  /** The bare layout's status line. Defaults to one picked from the name. */
  message?: string;
}

export function LiveLoader({ name, color, size = 24, dotSize = 3, cellPadding, speed = 0.65, label, bare = false, message }: LiveLoaderProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  // Placeholder must match the real matrix exactly or the tile jumps when the
  // loader mounts, so it goes through the same layout resolver.
  const { matrixSpan } = getMatrix5Layout(size, dotSize, cellPadding);

  useEffect(() => {
    const node = previewRef.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      const id = globalThis.setTimeout(() => setIsVisible(true), 0);
      return () => globalThis.clearTimeout(id);
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: "120px 0px", threshold: 0.01 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Defaults to the page accent, so docs previews follow the accent menu like
  // the landing grid. An explicit colour (the customization examples) wins.
  const tint = color ?? "var(--brand)";

  const matrix = isVisible ? (
    <Loader name={name} color={tint} size={size} dotSize={dotSize} cellPadding={cellPadding} speed={speed} />
  ) : (
    <div aria-hidden="true" className="shrink-0 rounded bg-white/4" style={{ width: matrixSpan, height: matrixSpan }} />
  );

  if (bare) {
    return (
      // Left-aligned with a shared inset, not centred per item: centring
      // each one would stagger the loaders by the width of their text.
      <div ref={previewRef} className="flex items-center gap-4 px-6 py-3">
        {matrix}
        <div className="min-w-0">
          <AnimatedShinyText
            shimmerWidth={40}
            className="block font-mori text-base font-medium tracking-tight whitespace-nowrap text-white/30 [animation-duration:3s]"
          >
            {message ?? messageFor(`${name}${label ?? ""}`)}
          </AnimatedShinyText>
          {label && <p className="truncate font-mono text-[11px] text-white/45">{label}</p>}
        </div>
      </div>
    );
  }

  return (
    // The landing page's loader tile: bg-white/2, rounded, no border, with the
    // name as a small mono label underneath.
    <div
      ref={previewRef}
      className="flex flex-col items-center justify-center gap-3 rounded-md bg-white/2 p-6"
      style={{ contain: "layout paint style", contentVisibility: "auto", containIntrinsicSize: "150px" }}
    >
      {matrix}
      {label && <span className="font-mono text-[10px] leading-none tracking-tight text-white/30">{label}</span>}
    </div>
  );
}

interface LiveLoaderGridProps {
  loaders: { name: LoaderName; label?: string; color?: string }[];
  size?: number;
  dotSize?: number;
  cellPadding?: number;
  speed?: number;
  /** Applied to every loader in the grid. A per-loader `color` still wins. */
  color?: string;
  /** Bare loaders with no margin — the preview side of an Example. */
  bare?: boolean;
}

export function LiveLoaderGrid({ loaders, size = 24, dotSize = 3, cellPadding, speed = 0.8, color: gridColor, bare = false }: LiveLoaderGridProps) {
  return (
    <div className={bare ? "grid grid-cols-1 gap-x-3 gap-y-4 sm:grid-cols-2" : "my-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"}>
      {/* Keyed by name + label: one loader can appear more than once in a
          grid (the colour examples show "sweep" three times). */}
      {loaders.map(({ name, label, color }) => (
        <LiveLoader key={`${name}-${label ?? ""}`} name={name} color={color ?? gridColor} size={size} dotSize={dotSize} cellPadding={cellPadding} speed={speed} label={label ?? name} bare={bare} />
      ))}
    </div>
  );
}
