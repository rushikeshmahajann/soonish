"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "./nav";

// Reading order is the sidebar's order, so Back/Next always agree with it and
// pick up new pages without edits here.
const PAGES = NAV.flatMap((s) => s.items);

/** Back / Next links at the end of a docs page, in the site's tile style. */
export function DocPager() {
  const pathname = usePathname();
  const i = PAGES.findIndex((p) => p.href === pathname);
  if (i === -1) return null;
  const prev = PAGES[i - 1];
  const next = PAGES[i + 1];

  const card =
    "group flex flex-1 flex-col gap-1 rounded-md bg-white/2 px-4 py-3.5 transition-colors outline-none hover:bg-white/4 focus-visible:ring-2 focus-visible:ring-white/40";

  return (
    <nav aria-label="Pagination" className="mt-24 flex gap-3 border-t border-white/6 pt-10">
      {prev ? (
        <Link href={prev.href} rel="prev" className={card}>
          <span className="font-mono text-xs text-white/35">← Back</span>
          <span className="font-mori text-sm font-medium text-white/80 transition-colors group-hover:text-white">
            {prev.title}
          </span>
        </Link>
      ) : (
        // Keeps a lone Next card on the right half.
        <span className="flex-1" />
      )}
      {next ? (
        <Link href={next.href} rel="next" className={`${card} items-end text-right`}>
          <span className="font-mono text-xs text-white/35">Next →</span>
          <span className="font-mori text-sm font-medium text-white/80 transition-colors group-hover:text-white">
            {next.title}
          </span>
        </Link>
      ) : (
        <span className="flex-1" />
      )}
    </nav>
  );
}
