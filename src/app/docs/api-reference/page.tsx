import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import { PropsTable } from "@/components/docs/PropsTable";
import { OnThisPage } from "@/components/docs/OnThisPage";

const TOC = [
  { id: "loader",       title: "<Loader />",       level: 2 as const },
  { id: "props",        title: "Props",            level: 2 as const },
  { id: "loader-name",  title: "LoaderName type",  level: 2 as const },
  { id: "typescript",   title: "TypeScript",       level: 2 as const },
];

export default function ApiReferencePage() {
  return (
    <>
      <main className="flex-1 min-w-0 py-10 px-8">
        <p className="text-xs mb-6" style={{ color: "#52525b", fontFamily: "monospace" }}>
          Reference
        </p>

        <h1 className="text-4xl font-bold tracking-tight mb-3" style={{ letterSpacing: "-0.03em" }}>
          API Reference
        </h1>
        <p className="text-lg mb-8" style={{ color: "#a1a1aa", lineHeight: 1.6 }}>
          Complete reference for all exported components and types.
        </p>

        <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.06)", marginBottom: "2rem" }} />

        {/* Loader component */}
        <div className="flex items-center gap-3 mb-4">
          <h2 id="loader" className="text-2xl font-semibold" style={{ letterSpacing: "-0.02em" }}>
            {"<Loader />"}
          </h2>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ background: "rgba(255,255,255,0.06)", color: "#d8d8d8" }}
          >
            Client Component
          </span>
        </div>

        <p className="mb-4 text-sm" style={{ color: "#a1a1aa", lineHeight: 1.7 }}>
          The primary export. Renders a single 5×5 pixel loader by name. Accepts props
          for color, size, gap, and speed customization.
        </p>

        <CodeBlock
          filename="usage.tsx"
          lang="tsx"
          code={`import { Loader } from '1hundo-loaders';

<Loader
  name="ripple"
  color="#c9d0f4"
  size={24}
  dotSize={3}
  speed={0.8}
  className="my-loader"
  style={{ opacity: 0.9 }}
/>`}
        />

        {/* Props */}
        <h2 id="props" className="text-2xl font-semibold mb-3 mt-8" style={{ letterSpacing: "-0.02em" }}>
          Props
        </h2>

        <PropsTable
          props={[
            {
              name: "name",
              type: "LoaderName",
              required: true,
              description: "The loader to display. See LoaderName for all 68 valid values.",
            },
            {
              name: "color",
              type: "string",
              default: "loader's pastel",
              description:
                "Override the animation color. Accepts any CSS color value (hex, rgb, hsl).",
            },
            {
              name: "size",
              type: "number",
              default: "24",
              description:
                "Total width and height of the whole matrix, in pixels — not the dot. The gap between dots is derived from this so the footprint stays fixed as dotSize changes.",
            },
            {
              name: "dotSize",
              type: "number",
              default: "3",
              description: "Width and height of a single dot, in pixels.",
            },
            {
              name: "cellPadding",
              type: "number",
              description:
                "Fix the gap between dots explicitly, in pixels. When set, size is ignored and the matrix grows to fit. Leave unset to let the gap be derived from size.",
            },
            {
              name: "speed",
              type: "number",
              default: "1",
              description:
                "Animation speed multiplier. 1 = normal speed. 2 = twice as fast. 0.5 = half speed.",
            },
            {
              name: "className",
              type: "string",
              description: "Additional CSS class names applied to the outermost wrapper element.",
            },
            {
              name: "style",
              type: "React.CSSProperties",
              description: "Additional inline styles applied to the outermost wrapper element.",
            },
          ]}
        />

        {/* LoaderName */}
        <h2 id="loader-name" className="text-2xl font-semibold mb-3 mt-8" style={{ letterSpacing: "-0.02em" }}>
          LoaderName type
        </h2>
        <p className="mb-4 text-sm" style={{ color: "#a1a1aa", lineHeight: 1.7 }}>
          A TypeScript union of all 100 valid loader name strings. Your editor will
          autocomplete the full list when you type the{" "}
          <code style={{ fontFamily: "monospace", color: "#b7b7b7" }}>name</code> prop.
        </p>
        <CodeBlock
          lang="ts"
          code={`type LoaderName =
  // Pulse wave loaders
  | 'sweep' | 'diagonal' | 'ripple' | 'rain' | 'spiral' | 'snake'
  | 'sparkle' | 'heartbeat' | 'scanner' | 'orbit' | 'breathe' | 'checker'
  | 'stripes' | 'falling' | 'plasma' | 'loadbar' | 'knight-tour'
  | 'vortex' | 'sine-wave' | 'life' | 'quadrants' | 'crossfade' | 'glider'
  | 'matrix' | 'pong' | 'concentric' | 'twin-spirals'
  // AI / process loaders
  | 'thinking' | 'searching' | 'finding' | 'consolidating' | 'streaming'
  | 'reasoning' | 'indexing' | 'connecting' | 'generating' | 'reflecting'
  // Scale loaders
  | 'scale-ripple' | 'scale-wave' | 'scale-diag' | 'scale-pop'
  | 'scale-ring' | 'scale-check'
  // Funky scale
  | 'twist' | 'squash' | 'jelly' | 'pop-rotate' | 'skew'
  | 'heartbeat-scale' | 'drop' | 'burst' | 'spiral-scale' | 'zigzag'
  // Mandalas
  | 'round' | 'square-mandala' | 'diamond-mandala' | 'cross' | 'x-diagonal'
  | 'star-burst' | 'petal' | 'snowflake' | 'gear' | 'kaleido'
  | 'spiral-mandala' | 'pulse-square' | 'check-mandala' | 'octagon' | 'lotus';`}
        />

        {/* TypeScript */}
        <h2 id="typescript" className="text-2xl font-semibold mb-3 mt-8" style={{ letterSpacing: "-0.02em" }}>
          TypeScript
        </h2>
        <p className="mb-4 text-sm" style={{ color: "#a1a1aa", lineHeight: 1.7 }}>
          The package ships full TypeScript types. Import{" "}
          <code style={{ fontFamily: "monospace", color: "#d8d8d8" }}>LoaderName</code> and{" "}
          <code style={{ fontFamily: "monospace", color: "#d8d8d8" }}>LoaderProps</code> directly if
          you need them in your own types.
        </p>
        <CodeBlock
          filename="types-example.tsx"
          lang="tsx"
          code={`import type { LoaderName, LoaderProps } from '1hundo-loaders';
import { Loader } from '1hundo-loaders';

// Use LoaderName as a prop type in your own components
interface ButtonProps {
  loaderName?: LoaderName;
  isLoading: boolean;
}

function Button({ loaderName = 'sweep', isLoading }: ButtonProps) {
  return (
    <button>
      {isLoading ? <Loader name={loaderName} size={20} /> : 'Submit'}
    </button>
  );
}

// Or spread LoaderProps
function MyLoader(props: LoaderProps) {
  return <Loader {...props} />;
}`}
        />

        <Callout type="note">
          TypeScript 5 or later is recommended. The package uses{" "}
          <code style={{ fontFamily: "monospace" }}>moduleResolution: bundler</code> in its tsconfig,
          compatible with all modern bundlers.
        </Callout>
      </main>

      <OnThisPage items={TOC} />
    </>
  );
}
