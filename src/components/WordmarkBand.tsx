import GradualBlur from "./GradualBlur";
import { DeferredPixelBlast } from "./DeferredPixelBlast";
import { cn } from "@/lib/utils";

/** The "soonish" wordmark look — pixel font, accent gradient. Shared with the footer. */
export const WORDMARK_CLASS =
  "text-center text-7xl tracking-[-4.8px] font-pixel bg-linear-to-b/srgb from-(--brand-from) from-[39.13%] to-(--brand-to) to-[76.52%] bg-clip-text text-transparent";

/**
 * The hero: the "soonish" wordmark over the dithered PixelBlast field, with a
 * blur dissolving the bottom edge.
 */
export function WordmarkBand({ className }: { className?: string }) {
  return (
    <div className={cn("relative flex h-[60vh] w-full items-center justify-center overflow-hidden", className)}>
      {/* Fills the box behind the heading; the container is 100%/100%,
          so it needs a sized, positioned parent. */}
      <div className="absolute inset-0" aria-hidden="true">
        <DeferredPixelBlast
          variant="square"
          pixelSize={4.2}
          patternScale={2}
          patternDensity={0.6}
          enableRipples
          rippleSpeed={0.4}
          rippleThickness={0.12}
          rippleIntensityScale={1.5}
          speed={0.5}
          edgeFade={1}
          transparent
        />
      </div>
      <h1 className={cn("relative z-10", WORDMARK_CLASS)}>
        soonish
      </h1>

      {/* zIndex 5 keeps this above the pixel canvas (z-auto) but below the
          heading (z-10), so it smears the background and never the text.
          The component's own default is 1000, which would blur the heading. */}
      <GradualBlur
        target="parent"
        position="bottom"
        height="7rem"
        strength={1}
        saturation={1.5}
        divCount={5}
        curve="bezier"
        exponential
        opacity={1}
        zIndex={5}
      />
    </div>
  );
}
