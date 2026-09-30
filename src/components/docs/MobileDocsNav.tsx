"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV } from "./nav";

const PAGES = NAV.flatMap((s) => s.items);

/**
 * Docs navigation for phones, where the tree sidebar is hidden (below md). A
 * single row of page links that scrolls sideways, pinned under the header,
 * with the current page lit in the accent colour.
 */
export function MobileDocsNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Docs"
      className="sticky top-16 z-40 overflow-x-auto bg-(--bg)/80 px-6 py-2.5 backdrop-blur-xl [scrollbar-width:none] md:hidden"
    >
      <ul className="flex w-max gap-1.5">
        {PAGES.map((p) => {
          const active = p.href === pathname;
          return (
            <li key={p.href}>
              <Link
                href={p.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1 font-mori text-sm whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white/40",
                  active ? "bg-white/6 text-white" : "text-white/50 hover:text-white",
                )}
              >
                {active && <span aria-hidden="true" className="size-1 rounded-full" style={{ background: "var(--brand)" }} />}
                {p.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
