import Link from "next/link";
import { LiveLoaderGrid } from "@/components/docs/LiveLoader";
import { OnThisPage } from "@/components/docs/OnThisPage";
import type { LoaderName } from "1hundo-loaders";

const TOC = [
  { id: "pulse",    title: "Pulse Wave",  level: 2 as const },
  { id: "ai",       title: "AI / Process",level: 2 as const },
  { id: "scale",    title: "Scale",       level: 2 as const },
  { id: "sprites",  title: "Sprites",     level: 2 as const },
  { id: "mandalas", title: "Mandalas",    level: 2 as const },
  { id: "stories",  title: "Stories",     level: 2 as const },
];

function Section({ id, title, count, desc, loaders, size = 7, gap = 1 }: {
  id: string; title: string; count: number; desc: string;
  loaders: { name: LoaderName; label?: string }[];
  size?: number; gap?: number;
}) {
  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-2">
        <h2 id={id} className="text-2xl font-semibold" style={{ letterSpacing: "-0.02em" }}>
          {title}
        </h2>
        <span
          className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{ background: "rgba(255,255,255,0.06)", color: "#d8d8d8", fontFamily: "monospace" }}
        >
          {count}
        </span>
      </div>
      <p className="text-sm mb-5" style={{ color: "#71717a", lineHeight: 1.6 }}>{desc}</p>
      <LiveLoaderGrid loaders={loaders} size={size} gap={gap} />
    </section>
  );
}

export default function LoadersPage() {
  return (
    <>
      <main className="flex-1 min-w-0 py-10 px-8">
        <p className="text-xs mb-6" style={{ color: "#52525b", fontFamily: "monospace" }}>
          Reference
        </p>

        <h1 className="text-4xl font-bold tracking-tight mb-3" style={{ letterSpacing: "-0.03em" }}>
          All Loaders
        </h1>
        <p className="text-lg mb-4" style={{ color: "#a1a1aa", lineHeight: 1.6 }}>
          100 loaders across 5 categories. All built on the same 64-pixel grid.
        </p>
        <p className="text-sm mb-8" style={{ color: "#52525b" }}>
          For the full interactive gallery with pagination,{" "}
          <Link href="/" style={{ color: "#d8d8d8", textDecoration: "underline" }}>visit the showcase →</Link>
        </p>

        <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.06)", marginBottom: "2.5rem" }} />

        <Section
          id="pulse"
          title="Pulse Wave"
          count={28}
          desc="Brightness-pulse animations. Each pixel lights up in sequence, creating waves, ripples, spirals, and patterns."
          loaders={[
            { name: "sweep",       label: "sweep" },
            { name: "diagonal",    label: "diagonal" },
            { name: "ripple",      label: "ripple" },
            { name: "rain",        label: "rain" },
            { name: "spiral",      label: "spiral" },
            { name: "snake",       label: "snake" },
            { name: "sparkle",     label: "sparkle" },
            { name: "heartbeat",   label: "heartbeat" },
            { name: "scanner",     label: "scanner" },
            { name: "orbit",       label: "orbit" },
            { name: "breathe",     label: "breathe" },
            { name: "checker",     label: "checker" },
          ]}
        />

        <Section
          id="ai"
          title="AI / Process"
          count={10}
          desc="Named for AI states — thinking, searching, streaming, reasoning. Great for AI-powered apps."
          loaders={[
            { name: "thinking",      label: "thinking" },
            { name: "searching",     label: "searching" },
            { name: "finding",       label: "finding" },
            { name: "consolidating", label: "consolidating" },
            { name: "streaming",     label: "streaming" },
            { name: "reasoning",     label: "reasoning" },
            { name: "indexing",      label: "indexing" },
            { name: "connecting",    label: "connecting" },
            { name: "generating",    label: "generating" },
            { name: "reflecting",    label: "reflecting" },
          ]}
        />

        <Section
          id="scale"
          title="Scale"
          count={16}
          desc="Pixels scale in and out instead of pulsing brightness. Includes twist, jelly, bounce, pop-rotate, and more."
          loaders={[
            { name: "scale-ripple", label: "scale-ripple" },
            { name: "scale-wave",   label: "scale-wave" },
            { name: "twist",        label: "twist" },
            { name: "squash",       label: "squash" },
            { name: "jelly",        label: "jelly" },
            { name: "pop-rotate",   label: "pop-rotate" },
            { name: "drop",         label: "drop" },
            { name: "burst",        label: "burst" },
            { name: "zigzag",       label: "zigzag" },
          ]}
        />

        <Section
          id="sprites"
          title="Sprites"
          count={20}
          desc="Fixed color pixel maps — emoji and icons. These loaders use multi-color pixel art rather than animation color. The color prop has no effect."
          loaders={[
            { name: "smiley",    label: "smiley" },
            { name: "heart",     label: "heart" },
            { name: "star",      label: "star" },
            { name: "fire",      label: "fire" },
            { name: "robot",     label: "robot" },
            { name: "ghost",     label: "ghost" },
            { name: "rocket",    label: "rocket" },
            { name: "cat",       label: "cat" },
            { name: "skull",     label: "skull" },
            { name: "mushroom",  label: "mushroom" },
            { name: "lightning", label: "lightning" },
            { name: "diamond",   label: "diamond" },
          ]}
        />

        <Section
          id="mandalas"
          title="Mandalas"
          count={15}
          desc="Symmetric patterns where only pixels in a specific geometric path light up. Includes round, snowflake, gear, octagon, lotus, and more."
          loaders={[
            { name: "round",         label: "round" },
            { name: "snowflake",     label: "snowflake" },
            { name: "gear",          label: "gear" },
            { name: "octagon",       label: "octagon" },
            { name: "lotus",         label: "lotus" },
            { name: "cross",         label: "cross" },
            { name: "x-diagonal",    label: "x-diagonal" },
            { name: "star-burst",    label: "star-burst" },
            { name: "petal",         label: "petal" },
          ]}
        />

        <Section
          id="stories"
          title="Stories & Communication"
          count={11}
          desc="Multi-frame animations that cycle like pixel films. Stories tell tiny narratives; comm loaders are icon-sized status indicators."
          loaders={[
            { name: "mountain",   label: "mountain" },
            { name: "fishing",    label: "fishing" },
            { name: "astronaut",  label: "astronaut" },
            { name: "treadmill",  label: "treadmill" },
            { name: "envelope",   label: "envelope" },
            { name: "bubble",     label: "bubble" },
          ]}
          size={8}
        />
      </main>

      <OnThisPage items={TOC} />
    </>
  );
}
