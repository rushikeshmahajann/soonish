import Link from "next/link";
import { SOCIALS } from "@/lib/socials";
import { cn } from "@/lib/utils";
import { GitHubStar } from "./GitHubStar";
import { SoonishIcon } from "./SoonishIcon";

/**
 * The site navbar: the icon as the home link on the left; Docs, X and a GitHub
 * star button (with the live count) on the right. Shared by the landing page (floating over the hero shader) and
 * the docs (a fixed header), so the two can never drift apart — only the
 * positioning differs, passed in as `className`.
 *
 * The icon's accessible name comes from the SVG's aria-label, so the home link
 * reads "soonish".
 */
export function SiteNav({ className }: { className?: string }) {
  return (
    <nav aria-label="Main" className={cn("flex items-center justify-between px-6 md:px-10", className)}>
      <Link href="/" className="rounded-[20.3125%] outline-none focus-visible:ring-2 focus-visible:ring-white/40">
        <SoonishIcon size={32} />
      </Link>
      <div className="flex items-center gap-2">
        {/* Frosted pills: the backdrop is blurred and darkened rather than
            covered, so whatever is behind (the hero shader, scrolled docs)
            still shows through while the labels stay legible. */}
        <Link
          href="/docs"
          className="flex items-center gap-1.5 rounded-full bg-black/80 px-3 py-1 text-sm text-white/90 backdrop-blur-xl transition-colors outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-white/40"
        >
          Docs
        </Link>
        {/* Same surface as Docs, as circles, so the set reads as one.
            Icon-only, so the name goes on the link. */}
        {[SOCIALS.x]
          .filter((s) => s.href)
          .map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              title={s.label}
              className="grid size-7 place-items-center rounded-full bg-black/80 text-white/90 backdrop-blur-xl transition-colors outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-white/40"
            >
              <s.icon size={14} aria-hidden="true" />
            </a>
          ))}
        <GitHubStar />
      </div>
    </nav>
  );
}
