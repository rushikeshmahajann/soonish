"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, type ComponentProps } from "react";
import type PixelBlastComponent from "./PixelBlast";
import { useAccent } from "./AccentProvider";

// ssr: false because the effect is a WebGL canvas — there is nothing to
// prerender, and it keeps OGL and the shader out of the initial bundle.
const PixelBlast = dynamic(() => import("./PixelBlast"), { ssr: false });

/**
 * PixelBlast, mounted only once the browser is idle.
 *
 * The hero is decoration behind the heading, so it should never compete with
 * first paint: the chunk is not even requested until the main thread has
 * settled, and the page's real content paints without waiting on it.
 *
 * Its colour follows the page accent. A WebGL uniform cannot read a CSS
 * variable, so this is the one consumer that takes the hex from context.
 */
export function DeferredPixelBlast(props: Omit<ComponentProps<typeof PixelBlastComponent>, "color">) {
  const [ready, setReady] = useState(false);
  const { accent } = useAccent();

  useEffect(() => {
    // Safari has no requestIdleCallback; a short timeout is close enough.
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(() => setReady(true), { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(() => setReady(true), 200);
    return () => window.clearTimeout(id);
  }, []);

  return ready ? <PixelBlast {...props} color={accent.accent} /> : null;
}
