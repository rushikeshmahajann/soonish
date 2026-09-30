import Link from "next/link";
import { SOCIALS } from "@/lib/socials";
import { SoonishIcon } from "./SoonishIcon";
import { HoverPhotoLink } from "./HoverPhotoLink";
import { WORDMARK_CLASS } from "./WordmarkBand";

const LINKS = [
  { href: "/docs", label: "Docs" },
  { href: "/docs/installation", label: "Installation" },

] as const;


/**
 * Landing-page footer: the app icon, a one-line pitch, the main links, and a
 * giant wordmark that runs into the bottom edge of the page.
 *
 * The wordmark sitting flush with the page end is the point: the root layout
 * pins a GradualBlur over the bottom 7rem of the viewport on every route, so
 * at full scroll the bottom of the letters dissolves into it.
 */
export function Footer() {
  return (
    <footer className="mt-24 w-full overflow-hidden border-t border-white/6 pb-12 md:pb-0">
      {/* pb-12 on phones only: there the wordmark is ~60px tall, so flush with
          the page bottom it would sit entirely inside the 7rem page blur and
          smear into nothing. Lifted 48px, only its lower half dissolves — the
          same effect desktop gets by being flush (pb-0). */}
      <div className="flex flex-wrap items-start justify-between gap-8 px-6 pt-10 md:px-10">
        {/* Three columns from md up; on phones everything stacks, centred, with
            the icon on top. */}
        <div className="grid w-full grid-cols-1 items-center gap-10 md:grid-cols-3 md:gap-3">
          <div className="flex flex-col items-center gap-4 text-center md:items-start md:text-left">
            <p className="max-w-xs font-mori text-sm text-white/40">
              Built by{" "}
              {/* Hovering the name floats a photo above the cursor. 120×134 keeps
                  the source's 474×531 aspect. */}
              <HoverPhotoLink href="https://rushikeshmahajan.com" src="/images/rushikesh-hover.jpg" width={120} height={134}>
                Rushikesh Mahajan
              </HoverPhotoLink>
              . Copy the code, it&apos;s yours.
            </p>
            <ul className="flex items-center gap-4">
              {Object.values(SOCIALS).filter((s) => s.href).map((s) => (
                <li key={s.label}>
                  {/* Icon-only, so the label goes on the link for screen readers. */}
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    title={s.label}
                    className="block rounded-sm text-white/40 transition-colors outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-white/40"
                  >
                    {/* Font Awesome 6 brand marks, filled. They inherit currentColor,
                        so they share the link's grey and hover. */}
                    <s.icon size={18} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="order-first flex items-center justify-center md:order-none">
            {/* 140px on phones, 250px from md. `!` beats the icon's inline size. */}
            <SoonishIcon size={250} className="size-[140px]! md:size-[250px]!" />
          </div>
          <nav aria-label="Footer" className="flex justify-center gap-6 pt-1 text-sm md:flex-col md:items-end md:gap-5">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="text-white/50 font-mori transition-colors hover:text-white">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>


      </div>



      {/* The hero's wordmark on the plain page, closing the page on the same
          word it opens with. A <p>, not a second <h1> — the hero is the page
          heading — and aria-hidden since the name is already read out above. */}
      {/* -mb-[0.16em] pulls the box's bottom up to the ink. Pixelify Sans
          reserves 0.28em below the baseline for descenders "soonish" doesn't
          have, so with a 1em line the letters end at 0.832em and the rest of
          the box is empty. The glyph area (1.2em) also spills 0.1em past a 1em
          line, which the browser counts as scrollable space — overflow-hidden
          on the footer clips that. Both are in em, so they hold at any size. */}
      {/* min(250px, 25vw): 250px on desktop, shrinking so the whole word fits
          on narrow screens. */}
      <p aria-hidden="true" className={`mt-16 -mb-[0.16em] md:mt-24 ${WORDMARK_CLASS} text-[min(250px,25vw)] tracking-tighter`}>
        soonish
      </p>
    </footer>
  );
}
