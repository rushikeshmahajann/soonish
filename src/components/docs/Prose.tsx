import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { DocPager } from "./DocPager";

// Docs typography, in the landing page's language: PP Mori headings in white,
// body copy at white/50, small mono labels at white/35, and bg-white/2 surfaces
// with no borders. Pages compose these instead of repeating inline styles, so a
// change to the docs look is made here once.
//
// Spacing follows the shadcn / Vercel docs: a ~680px reading measure, 15px body
// at 1.75 line-height, headings with far more space above than below (so each
// sits with its own section), and one block rhythm — every code sample,
// callout, table and preview grid uses my-7.

/** A docs page: the article column, with Back/Next at its end. */
export function DocPage({ children }: { children: ReactNode }) {
  return (
    <main className="min-w-0 flex-1 px-4 pt-14 pb-24 md:px-12 xl:px-8">
      <article className="mx-auto max-w-[680px]">
        {children}
        <DocPager />
      </article>
    </main>
  );
}

/** Section label, page title and lead paragraph, closed by a hairline. */
export function DocHeader({
  eyebrow,
  title,
  children,
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("mb-14 border-b border-white/6 pb-10", className)}>
      <p className="mb-5 font-mono text-xs text-white/35">{eyebrow}</p>
      <h1 className="font-mori text-3xl font-medium tracking-tight text-white">{title}</h1>
      {children && <p className="mt-4 text-base leading-7 text-white/50">{children}</p>}
    </header>
  );
}

/** Section heading. `scroll-mt` keeps it clear of the fixed header when jumped to. */
export function H2({
  id,
  children,
  className,
  as: Tag = "h2",
}: {
  id: string;
  children: ReactNode;
  className?: string;
  /** Render as the page's h1 (a page with no DocHeader) while keeping the section-heading look. */
  as?: "h1" | "h2";
}) {
  return (
    <Tag id={id} className={cn("mt-16 mb-4 scroll-mt-24 font-mori text-2xl font-medium tracking-tight text-white first:mt-0", className)}>
      {children}
    </Tag>
  );
}

export function P({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("mb-5 text-[15px] leading-7 text-white/50", className)}>{children}</p>;
}

/** Emphasis inside body copy — brighter, not bolder, to match the landing page. */
export function Strong({ children }: { children: ReactNode }) {
  return <strong className="font-medium text-white/85">{children}</strong>;
}

/** Inline code. */
export function C({ children }: { children: ReactNode }) {
  return <code className="rounded bg-white/5 px-1 py-px font-mono text-[0.85em] text-white/80">{children}</code>;
}

/** Inline link; internal paths use next/link. */
export function A({ href, children }: { href: string; children: ReactNode }) {
  const className =
    "text-white/80 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white hover:decoration-white/60";
  return href.startsWith("/") ? (
    <Link href={href} className={className}>
      {children}
    </Link>
  ) : (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  );
}

/** Small mono label, e.g. above a live preview. */
export function Label({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("mb-4 font-mono text-xs text-white/35", className)}>{children}</p>;
}

/** Count badge next to a heading. */
export function Count({ children }: { children: ReactNode }) {
  return <span className="font-mono text-sm text-white/35">{children}</span>;
}

/** The landing page's tile surface: bg-white/2, rounded, no border. */
export function Surface({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-md bg-white/2", className)}>{children}</div>;
}
