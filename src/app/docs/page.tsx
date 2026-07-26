import Link from "next/link";
import { OnThisPage } from "@/components/docs/OnThisPage";
import { Callout } from "@/components/docs/Callout";

const TOC = [
  { id: "what-is", title: "What is 1hundo-loaders?", level: 2 as const },
  { id: "features", title: "Features", level: 2 as const },
  { id: "loader-types", title: "Loader Types", level: 2 as const },
  { id: "next-steps", title: "Next Steps", level: 2 as const },
];

export default function IntroductionPage() {
  return (
    <>
      <main className="flex-1 min-w-0 py-10 px-8">
        {/* Breadcrumb */}
        <p className="text-xs mb-6" style={{ color: "#52525b", fontFamily: "monospace" }}>
          Getting Started
        </p>

        <h1 className="text-4xl font-bold tracking-tight mb-3" style={{ letterSpacing: "-0.03em" }}>
          Introduction
        </h1>
        <p className="text-lg mb-8" style={{ color: "#a1a1aa", lineHeight: 1.6 }}>
          A library of 68 animated 5×5 pixel grid loaders for React. Every loader is
          built on the same 25-pixel grid — only the timing and per-pixel delay changes.
        </p>

        <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.06)", marginBottom: "2rem" }} />

        {/* What is */}
        <h2 id="what-is" className="text-2xl font-semibold mb-3" style={{ letterSpacing: "-0.02em" }}>
          What is 1hundo-loaders?
        </h2>
        <p className="mb-4" style={{ color: "#a1a1aa", lineHeight: 1.7 }}>
          <strong style={{ color: "#fafafa" }}>1hundo-loaders</strong> is a zero-dependency React component library that
          ships 68 loading animations, all built on a 5×5 pixel grid. Each loader is a tiny
          25-pixel canvas animated entirely with CSS — no canvas, no SVG, no heavy runtime.
        </p>
        <p className="mb-8" style={{ color: "#a1a1aa", lineHeight: 1.7 }}>
          Drop a single <code style={{ color: "#d8d8d8", fontFamily: "monospace" }}>&lt;Loader&gt;</code> component
          anywhere in your app. Styles are auto-injected on first render — no separate CSS import required.
        </p>

        {/* Features */}
        <h2 id="features" className="text-2xl font-semibold mb-4" style={{ letterSpacing: "-0.02em" }}>
          Features
        </h2>
        <div className="grid sm:grid-cols-2 gap-3 mb-8">
          {[
            { icon: "⬡", title: "68 unique loaders",     desc: "Pulse, scale, AI-process, and mandala animations." },
            { icon: "⌘", title: "Zero config",           desc: "Styles inject automatically. No CSS import needed." },
            { icon: "◈", title: "Fully customizable",    desc: "Control color, size, gap, and speed via props." },
            { icon: "◻", title: "TypeScript first",      desc: "All 68 loader names are typed for IDE autocomplete." },
            { icon: "◎", title: "Low paint cost",         desc: "Transform and opacity motion without animated glow." },
            { icon: "◉", title: "Next.js App Router",    desc: "Works in client components out of the box." },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-lg p-4"
              style={{ border: "1px solid rgba(255,255,255,0.06)", background: "#111113" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span style={{ color: "#d8d8d8", fontSize: "1rem" }}>{f.icon}</span>
                <span className="font-medium text-sm">{f.title}</span>
              </div>
              <p className="text-sm" style={{ color: "#71717a", lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Loader types */}
        <h2 id="loader-types" className="text-2xl font-semibold mb-4" style={{ letterSpacing: "-0.02em" }}>
          Loader Types
        </h2>
        <div className="space-y-3 mb-8">
          {[
            { name: "Pulse Wave",  count: 27, desc: "Brightness-pulse animations — sweep, ripple, spiral, scanner, rain, and more." },
            { name: "AI / Process", count: 10, desc: "Named for agent states — thinking, searching, streaming, reasoning." },
            { name: "Scale",       count: 16, desc: "Pixels scale in and out with twist, jelly, bounce, pop-rotate, and zigzag effects." },
            { name: "Mandalas",    count: 15, desc: "Symmetric patterns — round, snowflake, gear, octagon, lotus, and more." },
          ].map((t) => (
            <div
              key={t.name}
              className="flex items-start gap-4 rounded-lg px-4 py-3"
              style={{ border: "1px solid rgba(255,255,255,0.06)", background: "#111113" }}
            >
              <span
                className="shrink-0 mt-0.5 text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ background: "rgba(255,255,255,0.06)", color: "#d8d8d8", fontFamily: "monospace" }}
              >
                {t.count}
              </span>
              <div>
                <p className="font-medium text-sm mb-0.5">{t.name}</p>
                <p className="text-sm" style={{ color: "#71717a", lineHeight: 1.6 }}>{t.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <Callout type="tip">
          All 68 loaders are previewed live in the{" "}
          <Link href="/" style={{ color: "#d8d8d8", textDecoration: "underline" }}>showcase →</Link>
        </Callout>

        {/* Next steps */}
        <h2 id="next-steps" className="text-2xl font-semibold mb-4" style={{ letterSpacing: "-0.02em" }}>
          Next Steps
        </h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { href: "/docs/installation", label: "Installation →", desc: "Install the package in your project." },
            { href: "/docs/quick-start",  label: "Quick Start →",  desc: "Your first loader in 60 seconds." },
            { href: "/docs/customization",label: "Customization →",desc: "Color, size, gap, and speed." },
          ].map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="block rounded-lg p-4 transition-all group"
              style={{ border: "1px solid rgba(255,255,255,0.06)", background: "#111113" }}
            >
              <p className="font-medium text-sm mb-1 group-hover:text-[#f1f1f1] transition-colors">
                {card.label}
              </p>
              <p className="text-xs" style={{ color: "#71717a" }}>{card.desc}</p>
            </Link>
          ))}
        </div>
      </main>

      <OnThisPage items={TOC} />
    </>
  );
}
