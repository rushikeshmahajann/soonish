import Link from "next/link";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import { OnThisPage } from "@/components/docs/OnThisPage";
import { LiveLoader } from "@/components/docs/LiveLoader";

const TOC = [
  { id: "basic-usage",    title: "Basic usage",      level: 2 as const },
  { id: "nextjs",         title: "Next.js App Router",level: 2 as const },
  { id: "vite",           title: "Vite / CRA",       level: 2 as const },
  { id: "pick-a-loader",  title: "Pick a loader",    level: 2 as const },
];

export default function QuickStartPage() {
  return (
    <>
      <main className="flex-1 min-w-0 py-10 px-8">
        <p className="text-xs mb-6" style={{ color: "#52525b", fontFamily: "monospace" }}>
          Getting Started
        </p>

        <h1 className="text-4xl font-bold tracking-tight mb-3" style={{ letterSpacing: "-0.03em" }}>
          Quick Start
        </h1>
        <p className="text-lg mb-8" style={{ color: "#a1a1aa", lineHeight: 1.6 }}>
          Get your first loader on screen in under a minute.
        </p>

        <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.06)", marginBottom: "2rem" }} />

        {/* Basic usage */}
        <h2 id="basic-usage" className="text-2xl font-semibold mb-3" style={{ letterSpacing: "-0.02em" }}>
          Basic usage
        </h2>
        <p className="mb-4 text-sm" style={{ color: "#a1a1aa", lineHeight: 1.7 }}>
          Import <code style={{ fontFamily: "monospace", color: "#d8d8d8" }}>Loader</code> and pass a{" "}
          <code style={{ fontFamily: "monospace", color: "#b7b7b7" }}>name</code> prop.
          That&apos;s it — no extra setup.
        </p>
        <CodeBlock
          filename="component.tsx"
          lang="tsx"
          code={`import { Loader } from 'soonish';

export function MyComponent() {
  return <Loader name="sweep" />;
}`}
        />

        <div className="my-6">
          <p className="text-xs mb-3" style={{ color: "#52525b", fontFamily: "monospace" }}>LIVE PREVIEW</p>
          <LiveLoader name="sweep" label="sweep" />
        </div>

        {/* Next.js */}
        <h2 id="nextjs" className="text-2xl font-semibold mb-3 mt-8" style={{ letterSpacing: "-0.02em" }}>
          Next.js App Router
        </h2>
        <p className="mb-4 text-sm" style={{ color: "#a1a1aa", lineHeight: 1.7 }}>
          Because <code style={{ fontFamily: "monospace", color: "#d8d8d8" }}>soonish</code> uses React
          hooks internally, it must run in a client component. The package ships with{" "}
          <code style={{ fontFamily: "monospace" }}>&quot;use client&quot;</code> already at the top of its bundle,
          so any component that imports it becomes a client component automatically.
        </p>
        <CodeBlock
          filename="app/loading.tsx"
          lang="tsx"
          code={`// This is a React Server Component — importing a client-boundary
// component is fine. Next.js handles the boundary automatically.
import { Loader } from 'soonish';

export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Loader name="ripple" size={16} />
    </div>
  );
}`}
        />
        <Callout type="tip">
          Next.js <code style={{ fontFamily: "monospace" }}>loading.tsx</code> files are a great place to use
          loaders — they display automatically while page data is streaming.
        </Callout>

        {/* Vite */}
        <h2 id="vite" className="text-2xl font-semibold mb-3 mt-8" style={{ letterSpacing: "-0.02em" }}>
          Vite / Create React App
        </h2>
        <p className="mb-4 text-sm" style={{ color: "#a1a1aa", lineHeight: 1.7 }}>
          No special configuration needed. Just import and use.
        </p>
        <CodeBlock
          filename="src/App.tsx"
          lang="tsx"
          code={`import { Loader } from 'soonish';

function App() {
  return (
    <div>
      <Loader name="thinking" />
    </div>
  );
}`}
        />

        {/* Pick a loader */}
        <h2 id="pick-a-loader" className="text-2xl font-semibold mb-3 mt-8" style={{ letterSpacing: "-0.02em" }}>
          Pick a loader
        </h2>
        <p className="mb-4 text-sm" style={{ color: "#a1a1aa", lineHeight: 1.7 }}>
          The <code style={{ fontFamily: "monospace", color: "#b7b7b7" }}>name</code> prop accepts any of the 100
          loader names. Your editor will autocomplete them all.
        </p>
        <CodeBlock
          filename="examples.tsx"
          lang="tsx"
          code={`import { Loader } from 'soonish';

// Pulse waves
<Loader name="sweep" />
<Loader name="ripple" />
<Loader name="spiral" />

// AI/process
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
        <p className="mt-4 text-sm" style={{ color: "#a1a1aa" }}>
          See all 68 in the{" "}
          <Link href="/docs/loaders" style={{ color: "#d8d8d8", textDecoration: "underline" }}>All Loaders →</Link> page,
          or visit the{" "}
          <Link href="/" style={{ color: "#d8d8d8", textDecoration: "underline" }}>live showcase →</Link>
        </p>
      </main>

      <OnThisPage items={TOC} />
    </>
  );
}
