import GradualBlur from "@/components/GradualBlur";
import PixelBlast from "@/components/PixelBlast";
import { PackageToggle } from "@/components/PackageToggle";


export default function Home() {
  // Not pure #000 — on OLED that switches pixels fully off, which smears on
  // scroll and hard-edges against content.
  return <main className="min-h-screen w-full bg-[var(--bg)]">

      <div className="relative overflow-hidden flex items-center justify-center h-[60vh] w-screen ">
        {/* Fills the box behind the heading; the container is 100%/100%,
            so it needs a sized, positioned parent. */}
        <div className="absolute inset-0" aria-hidden="true">
          <PixelBlast
            variant="square"
            pixelSize={4.2}
            color="#CDC868"
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
        <h1 className="relative z-10 text-center text-7xl tracking-[-4.8px] font-pixel bg-linear-to-b/srgb from-[#FFF3B7] from-[39.13%] to-[#FFE748] to-[76.52%] bg-clip-text text-transparent">soonish</h1>

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
      <div className="flex flex-col items-left justify-center gap-4 py-2  max-w-[40vw] mx-auto">
        <h2 className="font-mori text-xl tracking-tight font-medium px-1">Install</h2>
        <PackageToggle />
        {/* The gradient border lives on this WRAPPER, not on the input.

            `gradient-border` works by generating a ::before and masking its
            middle out, and an <input> is a replaced element — browsers refuse to
            generate pseudo-elements on it. Put the utility on the input directly
            and the classes still resolve, but there is no ::before to paint, so
            nothing shows up. Hence the wrapper: it owns the surface, the radius
            and the ring; the input keeps only type and padding.

            The ::before is `inset: 0` and would sit over the field, but its
            interior is masked away (only the 1px rim paints) and it carries
            `pointer-events: none`, so focus and typing are unaffected. */}
        <div className="rounded-sm bg-white/4 gradient-border gradient-border-from-white/14 gradient-border-via-white/6 gradient-border-to-white/6">
          <input
            type="text"
            defaultValue="npm i soonish"
            placeholder="npm i soonish"
            // bg-transparent + border-0 so the wrapper is the only surface, and
            // outline-none because the rim is now the visible edge.
            className="w-full rounded-sm border-0 bg-transparent px-2 py-2 font-mori leading-0 tracking-tight text-white/70 text-sm outline-none"
          />
        </div>

        {/* Static card — no `.t-resize`, no transition, no shrink/expand state.

            The edge is a gradient border rather than `border` + an inset shadow:
            the plugin's default angle is `to bottom`, so from-white/20 lights the
            top and via/to-white/6 keeps a faint edge round the rest. One
            mechanism gives both the shine and the outline, and it fades instead
            of stopping dead the way a 1px inset highlight does. */}
        <div className="size-20 rounded-md bg-white/2 gradient-border gradient-border-from-white/14 gradient-border-via-white/6 gradient-border-to-white/6" />
      </div>
  </main>;
}
