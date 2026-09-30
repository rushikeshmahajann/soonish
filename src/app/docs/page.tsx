import type { Metadata } from "next";
import Link from "next/link";
import { Callout } from "@/components/docs/Callout";
import { PlaygroundCard } from "@/components/docs/PlaygroundCard";
import { A, C, DocPage, H2, P, Strong } from "@/components/docs/Prose";
import { Loader, type LoaderName } from "soonish";
import { TOTAL } from "../loaders/groups";

export const metadata: Metadata = {
  title: "Introduction",
  description: "What soonish is and what it gives you.",
};

// Each feature is fronted by a live soonish loader as its icon, so the cards
// show the library off rather than just describing it.
const FEATURES: { title: string; desc: string; loader: LoaderName }[] = [
  { title: `${TOTAL} loaders`, desc: "Pulse waves, AI states, scale effects, mandalas and more.", loader: "sparkle" },
  { title: "Yours to edit", desc: "The source is copied into your project. No dependency to update.", loader: "loadbar" },
  { title: "Five simple props", desc: "Color, size, dot size, spacing and speed.", loader: "scale-pop" },
  { title: "Typed names", desc: "Loader names are typed, so your editor autocompletes them.", loader: "indexing" },
  { title: "Plain CSS", desc: "Animated with transform and opacity only. No canvas, no JavaScript loop.", loader: "ripple" },
  { title: "Server Components", desc: "No hooks, so it works in Server and Client Components.", loader: "streaming" },
];

const NEXT = [
  { href: "/docs/installation", label: "Installation", desc: "Add soonish with the shadcn CLI." },
  { href: "/docs/quick-start", label: "Quick Start", desc: "Your first loader in a minute." },
  { href: "/docs/customization", label: "Customization", desc: "Color, size, spacing and speed." },
];

export default function IntroductionPage() {
  return (
    <DocPage>
      {/* The page has no header, so its first heading is the h1. */}
      <H2 id="what-is" as="h1">
        What is soonish?
      </H2>
      <P>
        <Strong>soonish</Strong> gives you {TOTAL} loading animations for React. Each one is drawn on the same 5×5 grid
        of dots and animated with plain CSS.
      </P>
      <P>
        You install it with the shadcn CLI, which copies the code into your project — so it&apos;s yours to change.
        Then use <C>{"<Loader />"}</C> anywhere in your app.
      </P>

      <H2 id="features">Features</H2>
      <div className="mb-8 grid gap-3 sm:grid-cols-2">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="group rounded-md bg-white/2 p-5 transition-colors hover:bg-white/3"
          >
            <Loader name={f.loader} size={22} dotSize={3} speed={0.7} color="var(--brand)" />
            <p className="mt-4 mb-1 font-mori text-sm font-medium text-white/85 transition-colors group-hover:text-white">
              {f.title}
            </p>
            <p className="text-sm leading-6 text-white/45">{f.desc}</p>
          </div>
        ))}
        {/* Spans both columns, under the six feature tiles. */}
        <PlaygroundCard />
      </div>

      <Callout type="tip">
        Browse all {TOTAL} loaders on the <A href="/">home page</A>. Hover one to copy its install command.
      </Callout>

      <H2 id="next-steps">Next steps</H2>
      <div className="grid gap-3 sm:grid-cols-3">
        {NEXT.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group block rounded-md bg-white/2 p-4 transition-colors outline-none hover:bg-white/4 focus-visible:ring-2 focus-visible:ring-white/40"
          >
            <p className="mb-1 font-mori text-sm font-medium text-white/85 transition-colors group-hover:text-white">
              {card.label} →
            </p>
            <p className="text-xs leading-5 text-white/40">{card.desc}</p>
          </Link>
        ))}
      </div>
    </DocPage>
  );
}
