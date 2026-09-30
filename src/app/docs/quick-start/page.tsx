import type { Metadata } from "next";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import { LiveLoader } from "@/components/docs/LiveLoader";
import { Example } from "@/components/docs/Example";
import { A, C, DocHeader, DocPage, H2, P } from "@/components/docs/Prose";
import { TOTAL } from "../../loaders/groups";

export const metadata: Metadata = {
  title: "Quick Start",
  description: "Your first soonish loader on screen in under a minute, in Next.js or Vite.",
};

export default function QuickStartPage() {
  return (
    <DocPage>
      <DocHeader eyebrow="Getting Started" title="Quick Start">
        Get your first loader on screen in under a minute.
      </DocHeader>

      <H2 id="basic-usage">Basic usage</H2>
      <P>
        Import <C>Loader</C> and pass a <C>name</C>. That&apos;s it.
      </P>
      <Example
        filename="component.tsx"
        code={`import { Loader } from '@/components/soonish';

export function MyComponent() {
  return <Loader name="sweep" />;
}`}
      >
        {/* Shown at the landing preview's size (40px, 6px dots) so it reads as
            a real UI moment, not a speck; default speed, as in the code. */}
        <LiveLoader bare name="sweep" size={40} dotSize={6} speed={1} label="sweep" />
      </Example>

      <Callout type="note">
        The import path follows the <C>components</C> alias in your <C>components.json</C>. It&apos;s usually{" "}
        <C>@/components</C>, which makes it <C>@/components/soonish</C>.
      </Callout>

      <H2 id="nextjs">Next.js App Router</H2>
      <P>
        <C>Loader</C> has no hooks, so it works in Server Components without <C>&quot;use client&quot;</C>. That
        makes it a good fit for a route&apos;s <C>loading.tsx</C>:
      </P>
      <CodeBlock
        filename="app/loading.tsx"
        lang="tsx"
        code={`// A Server Component — no "use client" needed.
import { Loader } from '@/components/soonish';

export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Loader name="ripple" size={16} />
    </div>
  );
}`}
      />
      <Callout type="tip">
        Next.js shows <C>loading.tsx</C> automatically while the page streams in.
      </Callout>

      <H2 id="vite">Vite and other React apps</H2>
      <P>Nothing to configure. Import it and use it.</P>
      <CodeBlock
        filename="src/App.tsx"
        lang="tsx"
        code={`import { Loader } from '@/components/soonish';

function App() {
  return (
    <div>
      <Loader name="thinking" />
    </div>
  );
}`}
      />

      <H2 id="pick-a-loader">Pick a loader</H2>
      <P>
        <C>name</C> takes any of the {TOTAL} loader names, and your editor autocompletes them.
      </P>
      <CodeBlock
        filename="examples.tsx"
        lang="tsx"
        code={`import { Loader } from '@/components/soonish';

// Pulse waves
<Loader name="sweep" />
<Loader name="ripple" />
<Loader name="spiral" />

// AI / process
<Loader name="thinking" />
<Loader name="searching" />
<Loader name="generating" />

// Scale animations
<Loader name="twist" />
<Loader name="jelly" />
<Loader name="burst" />

// Mandalas
<Loader name="snowflake" />
<Loader name="lotus" />`}
      />
      <P className="mt-4">
        See all {TOTAL} on the <A href="/">home page</A>. Hover one to copy its install command.
      </P>
    </DocPage>
  );
}
