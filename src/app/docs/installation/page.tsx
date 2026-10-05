import type { Metadata } from "next";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { PackageTabs } from "@/components/docs/PackageTabs";
import { Callout } from "@/components/docs/Callout";
import { A, C, DocHeader, DocPage, H2, P, Strong } from "@/components/docs/Prose";
import { registryOrigin } from "@/lib/registry";
import { TOTAL } from "../../loaders/groups";

export const metadata: Metadata = {
  title: "Installation",
  description: "Add soonish to your project with the shadcn CLI — everything, or one loader at a time.",
};

const REQUIREMENTS = [
  ["React", "18 or later"],
  ["A shadcn project", "one with a components.json"],
  ["TypeScript", "5 or later (optional but recommended)"],
];

export default function InstallationPage() {
  const origin = registryOrigin();

  return (
    <DocPage>
      <DocHeader eyebrow="Getting Started" title="Installation">
        soonish installs with the shadcn CLI. It copies the source into your project, so there&apos;s no package to
        update and you can edit anything.
      </DocHeader>

      <H2 id="requirements">Requirements</H2>
      <ul className="mb-4 space-y-2">
        {REQUIREMENTS.map(([pkg, ver]) => (
          <li key={pkg} className="flex items-center gap-3 text-sm">
            <span aria-hidden="true" className="size-1 rounded-full" style={{ background: "var(--brand)" }} />
            <span className="text-white/50">
              <Strong>{pkg}</Strong> {ver}
            </span>
          </li>
        ))}
      </ul>
      <P>
        No <C>components.json</C> yet? Run <C>npx shadcn@latest init</C> first.
      </P>

      <H2 id="install">Install</H2>
      <P className="mb-0">Add everything — all {TOTAL} loaders:</P>
      <PackageTabs origin={origin} />

      <H2 id="single">Add a single loader</H2>
      <P>
        Each loader is also available on its own, as a named component. The first one you add brings the core files
        with it; later ones skip files you already have.
      </P>
      <PackageTabs origin={origin} item="thinking" />
      <CodeBlock
        lang="tsx"
        code={`import { ThinkingLoader } from '@/components/soonish/loaders/thinking';

<ThinkingLoader color="oklch(0.817 0.119 106.075)" />`}
      />
      <P>
        Find the one you want on the <A href="/">home page</A>. Hover a loader to copy its command.
      </P>

      <H2 id="files">What gets added</H2>
      <CodeBlock
        lang="tree"
        code={`components/soonish/
├── index.ts            # exports Loader, getMatrix5Layout, types
├── Loader.tsx
├── types.ts · layout.ts
├── data/loaders.ts     # every loader's timing
├── engine/             # data for the field-based loaders
├── styles/             # base.css + fields.generated.css
└── loaders/            # one file per loader you add`}
      />
      <Callout type="note">
        The styles are plain CSS that <C>Loader.tsx</C> imports itself. There&apos;s no Tailwind config to change and
        no stylesheet to add. In a <C>src/</C> project, the files go in <C>src/components/soonish</C>.
      </Callout>

      <H2 id="verify">Check that it works</H2>
      <P>
        Drop this into any page:
      </P>
      <CodeBlock
        filename="app/page.tsx"
        lang="tsx"
        code={`import { Loader } from '@/components/soonish';

export default function Page() {
  return <Loader name="sweep" />;
}`}
      />
      <P>
        You should see the sweep animation. If the import fails, check your components alias — see{" "}
        <A href="/docs/quick-start">Quick Start</A>.
      </P>
    </DocPage>
  );
}
