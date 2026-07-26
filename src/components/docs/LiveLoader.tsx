"use client";

import { useEffect, useRef, useState } from "react";
import { Loader } from "1hundo-loaders";
import type { LoaderName } from "1hundo-loaders";

interface LiveLoaderProps {
  name: LoaderName;
  color?: string;
  size?: number;
  gap?: number;
  speed?: number;
  label?: string;
}

export function LiveLoader({ name, color, size = 7, gap = 1, speed = 0.65, label }: LiveLoaderProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const matrixSize = size * 8 + gap * 7;

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

  return (
    <div
      ref={previewRef}
      className="flex flex-col items-center justify-center gap-3 rounded-lg p-6"
      style={{
        border: "1px solid rgba(255,255,255,0.08)",
        background: "#0a0a0a",
        contain: "layout paint style",
        contentVisibility: "auto",
        containIntrinsicSize: "150px",
      }}
    >
      {isVisible ? (
        <Loader name={name} color={color} size={size} gap={gap} speed={speed} />
      ) : (
        <div
          aria-hidden="true"
          style={{
            width: matrixSize,
            height: matrixSize,
            borderRadius: 4,
            background: "rgba(255,255,255,0.04)",
          }}
        />
      )}
      {label && (
        <span className="text-xs font-medium tracking-widest uppercase" style={{ color: "#52525b", fontFamily: "monospace" }}>
          {label}
        </span>
      )}
    </div>
  );
}

interface LiveLoaderGridProps {
  loaders: { name: LoaderName; label?: string; color?: string }[];
  size?: number;
  gap?: number;
  speed?: number;
}

export function LiveLoaderGrid({ loaders, size = 7, gap = 1, speed = 0.8 }: LiveLoaderGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 2xl:grid-cols-6 gap-3 my-5">
      {loaders.map(({ name, label, color }) => (
        <LiveLoader key={name} name={name} color={color} size={size} gap={gap} speed={speed} label={label ?? name} />
      ))}
    </div>
  );
}
