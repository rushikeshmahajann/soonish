import type { Metadata } from "next";
import { Example } from "@/components/docs/Example";
import { Callout } from "@/components/docs/Callout";
import { LiveLoader, LiveLoaderGrid } from "@/components/docs/LiveLoader";
import { C, DocHeader, DocPage, H2, P } from "@/components/docs/Prose";

export const metadata: Metadata = {
  title: "Customization",
  description: "Change a loader's color, size, dot size, spacing and speed.",
};

export default function CustomizationPage() {
  return (
    <DocPage>
      <DocHeader eyebrow="Guides" title="Customization">
        Every loader takes the same five props: <C>color</C>, <C>size</C>, <C>dotSize</C>, <C>cellPadding</C> and{" "}
        <C>speed</C>. All are optional.
      </DocHeader>

      <H2 id="color">Color</H2>
      <P>
        Pass any CSS color to <C>color</C>. Leave it out and each loader uses its own soft pastel. CSS variables work
        too, so a loader can follow your theme: <C>color=&quot;var(--primary)&quot;</C>.
      </P>
      {/* Preview and Code are two views of one example, so they show the
          same five loaders in the same order. */}
      <Example
        filename="color-example.tsx"
        code={`import { Loader } from '@/components/soonish';

// A theme token — here, the site accent
<Loader name="sweep" color="var(--brand)" />

// Custom colors
<Loader name="sweep" color="oklch(0.871 0.059 72.741)" />
<Loader name="ripple" color="oklch(0.864 0.05 276.62)" />
<Loader name="diagonal" color="oklch(0.909 0.061 125.704)" />
<Loader name="vortex" color="oklch(0.866 0.043 5.208)" />`}
      >
        {/* Previews run at the landing preview's size (40px, 6px dots) — the
            prop on show here is colour, so size is free to be legible. */}
        <LiveLoaderGrid
          bare
          size={40}
          dotSize={6}
          loaders={[
            { name: "sweep", label: "var(--brand)", color: "var(--brand)" },
            { name: "sweep", label: "oklch(0.871 0.059 72.741)", color: "oklch(0.871 0.059 72.741)" },
            { name: "ripple", label: "oklch(0.864 0.05 276.62)", color: "oklch(0.864 0.05 276.62)" },
            { name: "diagonal", label: "oklch(0.909 0.061 125.704)", color: "oklch(0.909 0.061 125.704)" },
            { name: "vortex", label: "oklch(0.866 0.043 5.208)", color: "oklch(0.866 0.043 5.208)" },
          ]}
        />
      </Example>

      <H2 id="size">Size and dot size</H2>
      <P>
        <C>size</C> is the width of the whole loader in pixels, not of one dot. The default is <C>24</C>.{" "}
        <C>dotSize</C> sets each dot, default <C>3</C>. The gap between dots adjusts on its own, so the loader stays
        the same size when you change <C>dotSize</C>.
      </P>
      <Example
        filename="size-example.tsx"
        code={`<Loader name="breathe" size={18} />               // compact
<Loader name="breathe" />                         // default — 24px
<Loader name="breathe" size={40} dotSize={6} />   // large`}
      >
        {/* Real sizes, not enlarged: the pixel size is what this shows. */}
        <div className="grid grid-cols-1 items-center gap-y-4 sm:grid-cols-3">
          {([18, 24, 40] as const).map((s) => (
            <LiveLoader bare key={s} name="breathe" size={s} dotSize={s >= 40 ? 6 : 3} label={`size=${s}`} />
          ))}
        </div>
      </Example>

      <H2 id="spacing">Spacing</H2>
      <P>
        To set the gap between dots yourself, pass <C>cellPadding</C> in pixels. It overrides <C>size</C>, and the
        loader grows to fit. <C>0</C> makes the dots touch.
      </P>
      <Example
        filename="spacing-example.tsx"
        code={`<Loader name="checker" cellPadding={0} />   // solid — dots touch
<Loader name="checker" cellPadding={2} />   // airy
<Loader name="checker" cellPadding={4} />   // spacious
<Loader name="checker" cellPadding={6} />   // very sparse`}
      >
        {/* cellPadding sets the footprint, so the dots are enlarged instead. */}
        <div className="grid grid-cols-1 items-center gap-y-4 sm:grid-cols-2">
          {([0, 2, 4, 6] as const).map((g) => (
            <LiveLoader bare key={g} name="checker" dotSize={6} cellPadding={g} label={`cellPadding=${g}`} />
          ))}
        </div>
      </Example>

      <H2 id="speed">Speed</H2>
      <P>
        <C>speed</C> multiplies the playback speed. <C>1</C> is normal (the default), <C>2</C> is twice as fast,{" "}
        <C>0.5</C> is half.
      </P>
      <Example
        filename="speed-example.tsx"
        code={`<Loader name="scanner" speed={0.5} />   // half speed — slow & calm
<Loader name="scanner" speed={1}   />   // normal
<Loader name="scanner" speed={1.5} />   // faster
<Loader name="scanner" speed={2}   />   // fast`}
      >
        <div className="grid grid-cols-1 items-center gap-y-4 sm:grid-cols-2">
          {([0.5, 1, 1.5, 2] as const).map((sp) => (
            <LiveLoader bare key={sp} name="scanner" size={40} dotSize={6} speed={sp} label={`speed=${sp}`} />
          ))}
        </div>
      </Example>
      <Callout type="tip">
        Every dot&apos;s timing scales together, so changing the speed never distorts the pattern.
      </Callout>

      <H2 id="combine">Combining props</H2>
      <P>Props combine freely. A few real-world setups:</P>
      <Example
        filename="combined.tsx"
        code={`import { Loader } from '@/components/soonish';

// Subtle background indicator
<Loader name="breathe" color="oklch(0.882 0 0)" size={20} speed={0.6} />

// Bold AI thinking indicator
<Loader name="thinking" color="oklch(0.864 0.05 276.62)" size={32} dotSize={4} speed={0.9} />

// Inline loading spinner
<Loader name="ripple" color="oklch(0.909 0.061 125.704)" size={18} />

// Large hero animation
<Loader name="plasma" size={48} dotSize={6} speed={0.7} />`}
      >
        {/* Real sizes, as written in the code — each combination is the point. */}
        <div className="grid grid-cols-1 items-center gap-y-4 sm:grid-cols-2">
          <LiveLoader bare name="breathe" color="oklch(0.882 0 0)" size={20} speed={0.6} label="subtle" />
          <LiveLoader bare name="thinking" color="oklch(0.864 0.05 276.62)" size={32} dotSize={4} speed={0.9} label="ai thinking" />
          <LiveLoader bare name="ripple" color="oklch(0.909 0.061 125.704)" size={18} label="inline spinner" />
          <LiveLoader bare name="plasma" size={48} dotSize={6} speed={0.7} label="hero" />
        </div>
      </Example>
    </DocPage>
  );
}
