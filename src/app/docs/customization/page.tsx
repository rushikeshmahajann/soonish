import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import { OnThisPage } from "@/components/docs/OnThisPage";
import { LiveLoader, LiveLoaderGrid } from "@/components/docs/LiveLoader";

const TOC = [
  { id: "color",  title: "Color",    level: 2 as const },
  { id: "size",   title: "Size",     level: 2 as const },
  { id: "gap",    title: "Gap",      level: 2 as const },
  { id: "speed",  title: "Speed",    level: 2 as const },
  { id: "combine", title: "Combining props", level: 2 as const },
];

export default function CustomizationPage() {
  return (
    <>
      <main className="flex-1 min-w-0 py-10 px-8">
        <p className="text-xs mb-6" style={{ color: "#52525b", fontFamily: "monospace" }}>
          Guides
        </p>

        <h1 className="text-4xl font-bold tracking-tight mb-3" style={{ letterSpacing: "-0.03em" }}>
          Customization
        </h1>
        <p className="text-lg mb-8" style={{ color: "#a1a1aa", lineHeight: 1.6 }}>
          Every loader accepts four customization props:{" "}
          <code style={{ fontFamily: "monospace", color: "#d8d8d8" }}>color</code>,{" "}
          <code style={{ fontFamily: "monospace", color: "#d8d8d8" }}>size</code>,{" "}
          <code style={{ fontFamily: "monospace", color: "#d8d8d8" }}>gap</code>, and{" "}
          <code style={{ fontFamily: "monospace", color: "#d8d8d8" }}>speed</code>.
        </p>

        <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.06)", marginBottom: "2rem" }} />

        {/* Color */}
        <h2 id="color" className="text-2xl font-semibold mb-3" style={{ letterSpacing: "-0.02em" }}>
          Color
        </h2>
        <p className="mb-4 text-sm" style={{ color: "#a1a1aa", lineHeight: 1.7 }}>
          Pass any CSS color string to <code style={{ fontFamily: "monospace", color: "#d8d8d8" }}>color</code> to
          override the loader&apos;s default pastel color. This works for all procedural and scale loaders.
        </p>
        <CodeBlock
          filename="color-example.tsx"
          lang="tsx"
          code={`import { Loader } from '1hundo-loaders';

// Default muted pastel
<Loader name="sweep" />

// Custom colors
<Loader name="sweep" color="#edcfaa" />
<Loader name="ripple" color="#c9d0f4" />
<Loader name="diagonal" color="#d7e9bd" />
<Loader name="vortex" color="#edc8cf" />`}
        />

        <LiveLoaderGrid
          loaders={[
            { name: "sweep",    label: "default" },
            { name: "sweep",    label: "#edcfaa",  color: "#edcfaa" },
            { name: "sweep",    label: "#c9d0f4",  color: "#c9d0f4" },
            { name: "ripple",   label: "#d7e9bd",  color: "#d7e9bd" },
            { name: "diagonal", label: "#edc8cf",  color: "#edc8cf" },
            { name: "vortex",   label: "#d8d8d8",  color: "#d8d8d8" },
          ]}
        />

        <Callout type="note">
          Sprite loaders (smiley, heart, robot, etc.) and story loaders (mountain, astronaut, etc.)
          use fixed multi-color pixel maps. The <code style={{ fontFamily: "monospace" }}>color</code> prop
          has no effect on these types.
        </Callout>

        {/* Size */}
        <h2 id="size" className="text-2xl font-semibold mb-3 mt-8" style={{ letterSpacing: "-0.02em" }}>
          Size
        </h2>
        <p className="mb-4 text-sm" style={{ color: "#a1a1aa", lineHeight: 1.7 }}>
          The <code style={{ fontFamily: "monospace", color: "#d8d8d8" }}>size</code> prop controls the width
          and height of each pixel in the grid (in pixels). Default is <code style={{ fontFamily: "monospace" }}>7</code>.
        </p>
        <CodeBlock
          filename="size-example.tsx"
          lang="tsx"
          code={`<Loader name="breathe" size={5}  />   // tiny
<Loader name="breathe" size={7}  />   // default
<Loader name="breathe" size={10} />   // medium
<Loader name="breathe" size={14} />   // large`}
        />

        <LiveLoaderGrid
          loaders={[
            { name: "breathe", label: "size={5}" },
            { name: "breathe", label: "size={7}" },
            { name: "breathe", label: "size={14}" },
          ]}
          size={undefined as unknown as number}
        />
        <div className="grid grid-cols-3 gap-3 my-5">
          {([5, 7, 14] as const).map((s) => (
            <LiveLoader key={s} name="breathe" size={s} label={`size=${s}`} />
          ))}
        </div>

        {/* Gap */}
        <h2 id="gap" className="text-2xl font-semibold mb-3 mt-8" style={{ letterSpacing: "-0.02em" }}>
          Gap
        </h2>
        <p className="mb-4 text-sm" style={{ color: "#a1a1aa", lineHeight: 1.7 }}>
          The <code style={{ fontFamily: "monospace", color: "#d8d8d8" }}>gap</code> prop sets the spacing
          between pixels in the grid (in pixels). Default is <code style={{ fontFamily: "monospace" }}>1</code>.
          Set to <code style={{ fontFamily: "monospace" }}>0</code> for a solid grid, higher values for
          a more airy look.
        </p>
        <CodeBlock
          filename="gap-example.tsx"
          lang="tsx"
          code={`<Loader name="checker" gap={0} />   // solid — pixels touch
<Loader name="checker" gap={1} />   // default
<Loader name="checker" gap={3} />   // airy
<Loader name="checker" gap={5} />   // spacious`}
        />

        <div className="grid grid-cols-4 gap-3 my-5">
          {([0, 1, 3, 5] as const).map((g) => (
            <LiveLoader key={g} name="checker" gap={g} label={`gap=${g}`} />
          ))}
        </div>

        {/* Speed */}
        <h2 id="speed" className="text-2xl font-semibold mb-3 mt-8" style={{ letterSpacing: "-0.02em" }}>
          Speed
        </h2>
        <p className="mb-4 text-sm" style={{ color: "#a1a1aa", lineHeight: 1.7 }}>
          The <code style={{ fontFamily: "monospace", color: "#d8d8d8" }}>speed</code> prop is a multiplier
          applied to the animation duration. Default is <code style={{ fontFamily: "monospace" }}>1</code>.
          A value of <code style={{ fontFamily: "monospace" }}>2</code> makes it twice as fast,{" "}
          <code style={{ fontFamily: "monospace" }}>0.5</code> makes it half as fast.
        </p>
        <CodeBlock
          filename="speed-example.tsx"
          lang="tsx"
          code={`<Loader name="scanner" speed={0.5} />   // half speed — slow & calm
<Loader name="scanner" speed={1}   />   // normal
<Loader name="scanner" speed={1.5} />   // faster
<Loader name="scanner" speed={2}   />   // fast`}
        />

        <div className="grid grid-cols-4 gap-3 my-5">
          {([0.5, 1, 1.5, 2] as const).map((sp) => (
            <LiveLoader key={sp} name="scanner" speed={sp} label={`speed=${sp}`} />
          ))}
        </div>

        <Callout type="tip">
          Speed also affects story loaders — it adjusts the frame interval, making
          the pixel animations play faster or slower.
        </Callout>

        {/* Combine */}
        <h2 id="combine" className="text-2xl font-semibold mb-3 mt-8" style={{ letterSpacing: "-0.02em" }}>
          Combining props
        </h2>
        <p className="mb-4 text-sm" style={{ color: "#a1a1aa", lineHeight: 1.7 }}>
          All props compose freely. Here are some real-world examples:
        </p>
        <CodeBlock
          filename="combined.tsx"
          lang="tsx"
          code={`import { Loader } from '1hundo-loaders';

// Subtle background indicator
<Loader name="breathe" color="#d8d8d8" size={7} gap={1} speed={0.6} />

// Bold AI thinking indicator
<Loader name="thinking" color="#c9d0f4" size={10} gap={1} speed={0.9} />

// Inline loading spinner
<Loader name="ripple" color="#d7e9bd" size={6} gap={1} speed={1} />

// Large hero animation
<Loader name="plasma" size={12} gap={2} speed={0.7} />`}
        />

        <div className="grid grid-cols-2 gap-3 my-5">
          <LiveLoader name="breathe"  color="#d8d8d8" size={7}  gap={1} speed={0.6} label="subtle" />
          <LiveLoader name="thinking" color="#c9d0f4" size={10} gap={1} speed={0.9} label="ai thinking" />
          <LiveLoader name="ripple"   color="#d7e9bd" size={6} gap={1} speed={1} label="inline spinner" />
          <LiveLoader name="plasma"   size={12} gap={2} speed={0.7} label="hero" />
        </div>
      </main>

      <OnThisPage items={TOC} />
    </>
  );
}
