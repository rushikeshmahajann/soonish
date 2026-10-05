"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useAccent } from "@/components/AccentProvider";

// ssr: false — the slats are a WebGL canvas, so there is nothing to prerender,
// and it keeps the shader out of the page's initial bundle.
const MicroSlats = dynamic(() => import("@/components/MicroSlats"), { ssr: false });

// The tile surface (bg-white/2) over the page's oklch(0.145 0 0), as a solid
// colour — the shader paints its own background, so it has to match the
// other cards. The scrim below needs it with alpha.
const TILE_BG = "oklch(0.168 0 0)";
const tileWithAlpha = (alpha: number) => TILE_BG.replace(")", ` / ${alpha})`);

/**
 * "Playground — coming soon", a full-width feature card on a live MicroSlats
 * background. The slats take the page accent (the shader parses a real
 * colour, not a CSS variable, so it reads the hex from context) and recolour
 * with the accent menu. Mounted once the browser is idle so it never competes
 * with first paint; MicroSlats itself pauses off-screen and honours reduced
 * motion.
 */
export function PlaygroundCard() {
  const { accent } = useAccent();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(() => setReady(true), { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(() => setReady(true), 200);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div className="relative isolate overflow-hidden rounded-md sm:col-span-2" style={{ background: TILE_BG }}>
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        {ready && (
          <MicroSlats
            preset="swell"
            color={accent.accent}
            glintColor="oklch(1 0 0)"
            backgroundColor={TILE_BG}
            // Square slats sized like the loaders' own dots — 6px with a 3px
            // gap and a 1px corner (0.33 of the half-size) — so the card reads
            // as one big soonish matrix. They stay square: the swell preset
            // has no stretch, so every slat draws at full height.
            slatWidth={6}
            slatHeight={6}
            gap={3}
            roundness={0.33}
            interactive
            cursorStrength={1}
            cursorSize={40}
            trail={1.4}
            intro
            introDuration={1.5}
          />
        )}
      </div>
      {/* Scrim: near-solid under the copy (which runs ~60% of the card's
          width), fading out so the shader shows at full strength on the right. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: `linear-gradient(90deg, ${TILE_BG} 0%, ${tileWithAlpha(0.95)} 52%, ${tileWithAlpha(0)} 90%)` }}
      />

      <div className="pointer-events-none flex min-h-56 max-w-md flex-col justify-end gap-2 p-6">
        {/* The site's label style — small mono at low contrast — with an accent
            dot like the sidebar's current-page marker, rather than a pill. */}
        <span className="flex items-center gap-2 font-mono text-xs text-white/40">
          <span aria-hidden="true" className="size-1.5 rounded-full" style={{ background: "var(--brand)", boxShadow: "0 0 6px var(--brand)" }} />
          Coming soon
        </span>
        <p className="font-mori text-xl font-medium tracking-tight text-white">Playground</p>
        <p className="text-sm leading-6 text-white/55">Build your own loader, then install it with one command.</p>
      </div>
    </div>
  );
}
