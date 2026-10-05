import type { Metadata } from "next";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import { PropsTable } from "@/components/docs/PropsTable";
import { C, DocHeader, DocPage, H2, P } from "@/components/docs/Prose";
import { GROUPS, TOTAL } from "../../loaders/groups";

export const metadata: Metadata = {
  title: "API Reference",
  description: "The Loader component, its props and its TypeScript types.",
};

// Generated from the same groups the site renders, so the union shown here can
// never fall out of step with the loaders that actually exist.
const LOADER_NAME_UNION = [
  "type LoaderName =",
  ...GROUPS.flatMap((g) => {
    const lines: string[] = [`  // ${g.title}`];
    for (let i = 0; i < g.names.length; i += 5) {
      lines.push("  | " + g.names.slice(i, i + 5).map((n) => `'${n}'`).join(" | "));
    }
    return lines;
  }),
].join("\n") + ";";

export default function ApiReferencePage() {
  return (
    <DocPage>
      <DocHeader eyebrow="Reference" title="API Reference">
        The <C>Loader</C> component, its props and its types.
      </DocHeader>

      <div className="mb-3 flex items-baseline gap-3">
        <H2 id="loader" className="mb-0">
          {"<Loader />"}
        </H2>
        {/* It really is: no hooks, no browser APIs — pure CSS animation. */}
        <span className="font-mono text-xs text-white/35">Server Component safe</span>
      </div>
      <P>
        Renders one loader by name. It has no hooks, so it works in Server and Client Components.
      </P>
      <CodeBlock
        filename="usage.tsx"
        lang="tsx"
        code={`import { Loader } from '@/components/soonish';

<Loader
  name="ripple"
  color="oklch(0.864 0.05 276.62)"
  size={24}
  dotSize={3}
  speed={0.8}
  className="my-loader"
  style={{ opacity: 0.9 }}
/>`}
      />

      <H2 id="props">Props</H2>
      <PropsTable
        props={[
          {
            name: "name",
            type: "LoaderName",
            required: true,
            description: `Which loader to show. Any of the ${TOTAL} LoaderName values.`,
          },
          {
            name: "color",
            type: "string",
            default: "loader's pastel",
            description: "Any CSS color: hex, rgb, hsl or var(--token).",
          },
          {
            name: "size",
            type: "number",
            default: "24",
            description:
              "Width of the whole loader in pixels, not of one dot. The gap between dots adjusts to fit.",
          },
          {
            name: "dotSize",
            type: "number",
            default: "3",
            description: "Size of each dot, in pixels.",
          },
          {
            name: "cellPadding",
            type: "number",
            description:
              "Gap between dots, in pixels. Overrides size; the loader grows to fit.",
          },
          {
            name: "speed",
            type: "number",
            default: "1",
            description: "Playback speed. 2 is twice as fast, 0.5 is half.",
          },
          {
            name: "className",
            type: "string",
            description: "Class names for the outer wrapper.",
          },
          {
            name: "style",
            type: "React.CSSProperties",
            description: "Inline styles for the outer wrapper.",
          },
        ]}
      />

      <H2 id="loader-name">LoaderName type</H2>
      <P>
        A union of all {TOTAL} loader names. Your editor autocompletes it on the <C>name</C> prop.
      </P>
      <CodeBlock lang="ts" code={LOADER_NAME_UNION} />

      <H2 id="typescript">TypeScript</H2>
      <P>
        The types ship with the source. Import <C>LoaderName</C> and <C>LoaderProps</C> to use them in your own
        components.
      </P>
      <CodeBlock
        filename="types-example.tsx"
        lang="tsx"
        code={`import type { LoaderName, LoaderProps } from '@/components/soonish';
import { Loader } from '@/components/soonish';

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
        TypeScript 5 or later is recommended. The files compile with your own tsconfig — there&apos;s no separate
        build to keep in sync.
      </Callout>
    </DocPage>
  );
}
