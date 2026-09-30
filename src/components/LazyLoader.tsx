"use client";

import { useEffect, useRef, useState } from "react";
import { Loader, getMatrix5Layout } from "soonish";
import type { LoaderProps } from "soonish";

// One observer for every LazyLoader on the page rather than one each — the
// landing grid has ~90 of them, and a single observer batches all their
// intersection changes into one callback.
const listeners = new WeakMap<Element, (visible: boolean) => void>();
let sharedObserver: IntersectionObserver | null = null;

function getObserver() {
  sharedObserver ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) listeners.get(entry.target)?.(entry.isIntersecting);
    },
    // Mount a little before the tile scrolls in, so it is already animating
    // by the time it is seen.
    { rootMargin: "200px 0px" },
  );
  return sharedObserver;
}

/**
 * A Loader that only exists in the DOM while it is near the viewport.
 *
 * Every matrix is 25 animated dots, so rendering the whole set up front means
 * thousands of nodes to hydrate and style before first paint. Off-screen, this
 * renders a single placeholder sized by the same layout resolver as the real
 * matrix, so the tile does not jump when the loader mounts.
 */
export function LazyLoader(props: LoaderProps) {
  const { size = 24, dotSize = 3, cellPadding } = props;
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const { matrixSpan } = getMatrix5Layout(size, dotSize, cellPadding);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      // No observer to tell us when it is on screen: just show it, a tick later.
      const id = window.setTimeout(() => setVisible(true), 0);
      return () => window.clearTimeout(id);
    }

    const observer = getObserver();
    listeners.set(node, setVisible);
    observer.observe(node);
    return () => {
      observer.unobserve(node);
      listeners.delete(node);
    };
  }, []);

  return (
    <div ref={ref} style={{ width: matrixSpan, height: matrixSpan }}>
      {visible ? (
        <Loader {...props} />
      ) : (
        <div
          aria-hidden="true"
          style={{ width: matrixSpan, height: matrixSpan, borderRadius: 4, background: "rgba(255,255,255,0.04)" }}
        />
      )}
    </div>
  );
}
