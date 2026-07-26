import GradualBlur from "@/components/GradualBlur";
import PixelBlast from "@/components/PixelBlast";

export default function Home() {
  // Not pure #000 — on OLED that switches pixels fully off, which smears on
  // scroll and hard-edges against content.
  return <main className="min-h-screen w-full bg-[#161616]">

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
        <h1 className="relative z-10 text-center text-8xl tracking-[-4.8px] font-pixel bg-linear-to-b/srgb from-[#FFF3B7] from-[39.13%] to-[#FFE748] to-[76.52%] bg-clip-text text-transparent">soonish</h1>

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
      <div className="flex items-center justify-center gap-4 py-12  ">
        <div className="bg-white/8 h-max w-max flex justify-center gap-2 items-center rounded-full p-2">
          <button className="custom-button font-mori tracking-tight px-6 py-2 rounded-full ">This</button>
          <button className="custom-button font-mori tracking-tight px-6 py-2 rounded-full ">is</button>
          <button className="custom-button font-mori tracking-tight px-6 py-2 rounded-full ">Tuff</button>
        </div>

      </div>
  </main>;
}
