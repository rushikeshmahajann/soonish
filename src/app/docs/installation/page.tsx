import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import { OnThisPage } from "@/components/docs/OnThisPage";

const TOC = [
  { id: "requirements", title: "Requirements",     level: 2 as const },
  { id: "install",      title: "Install",          level: 2 as const },
  { id: "peer-deps",    title: "Peer dependencies",level: 2 as const },
  { id: "verify",       title: "Verify",           level: 2 as const },
];

export default function InstallationPage() {
  return (
    <>
      <main className="flex-1 min-w-0 py-10 px-8">
        <p className="text-xs mb-6" style={{ color: "#52525b", fontFamily: "monospace" }}>
          Getting Started
        </p>

        <h1 className="text-4xl font-bold tracking-tight mb-3" style={{ letterSpacing: "-0.03em" }}>
          Installation
        </h1>
        <p className="text-lg mb-8" style={{ color: "#a1a1aa", lineHeight: 1.6 }}>
          Install <code style={{ fontFamily: "monospace", color: "#d8d8d8" }}>soonish</code> from the npm registry.
          It takes less than 30 seconds.
        </p>

        <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.06)", marginBottom: "2rem" }} />

        <h2 id="requirements" className="text-2xl font-semibold mb-3" style={{ letterSpacing: "-0.02em" }}>
          Requirements
        </h2>
        <ul className="space-y-2 mb-8">
          {[
            ["React", "18 or later"],
            ["Node.js", "18 or later"],
            ["TypeScript", "5 or later (optional but recommended)"],
          ].map(([pkg, ver]) => (
            <li key={pkg} className="flex items-center gap-3 text-sm">
              <span style={{ color: "#d8d8d8", fontFamily: "monospace" }}>✓</span>
              <span style={{ color: "#a1a1aa" }}>
                <strong style={{ color: "#fafafa" }}>{pkg}</strong> {ver}
              </span>
            </li>
          ))}
        </ul>

        <h2 id="install" className="text-2xl font-semibold mb-3" style={{ letterSpacing: "-0.02em" }}>
          Install
        </h2>
        <p className="mb-2 text-sm" style={{ color: "#71717a" }}>npm</p>
        <CodeBlock lang="bash" code="npm install soonish" />
        <p className="mb-2 text-sm" style={{ color: "#71717a" }}>pnpm</p>
        <CodeBlock lang="bash" code="pnpm add soonish" />
        <p className="mb-2 text-sm" style={{ color: "#71717a" }}>yarn</p>
        <CodeBlock lang="bash" code="yarn add soonish" />
        <p className="mb-2 text-sm" style={{ color: "#71717a" }}>bun</p>
        <CodeBlock lang="bash" code="bun add soonish" />

        <h2 id="peer-deps" className="text-2xl font-semibold mt-8 mb-3" style={{ letterSpacing: "-0.02em" }}>
          Peer dependencies
        </h2>
        <p className="mb-4 text-sm" style={{ color: "#a1a1aa", lineHeight: 1.7 }}>
          <code style={{ fontFamily: "monospace", color: "#d8d8d8" }}>soonish</code> requires{" "}
          <code style={{ fontFamily: "monospace" }}>react</code> and{" "}
          <code style={{ fontFamily: "monospace" }}>react-dom</code> as peer dependencies.
          If your project already uses React you don&apos;t need to install them separately.
        </p>
        <CodeBlock
          lang="bash"
          code="npm install react react-dom"
        />
        <Callout type="note">
          The package ships its own styles. You do <strong>not</strong> need to import any CSS file — styles are
          automatically injected into the document head on first render.
        </Callout>

        <h2 id="verify" className="text-2xl font-semibold mb-3" style={{ letterSpacing: "-0.02em" }}>
          Verify the installation
        </h2>
        <p className="mb-4 text-sm" style={{ color: "#a1a1aa", lineHeight: 1.7 }}>
          Paste this snippet into any client component to confirm everything is working:
        </p>
        <CodeBlock
          filename="app/page.tsx"
          lang="tsx"
          code={`import { Loader } from 'soonish';

export default function Page() {
  return <Loader name="sweep" />;
}`}
        />
        <p className="text-sm" style={{ color: "#a1a1aa" }}>
          You should see a muted sweep animation. If you see a blank page, check the{" "}
          <a href="/docs/quick-start" style={{ color: "#d8d8d8", textDecoration: "underline" }}>Quick Start</a> guide
          for framework-specific setup.
        </p>
      </main>

      <OnThisPage items={TOC} />
    </>
  );
}
