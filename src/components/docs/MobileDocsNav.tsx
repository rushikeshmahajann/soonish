"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, MotionConfig, motion, type Transition } from "motion/react";
import { LuPanelLeftClose, LuPanelLeftOpen, LuX } from "react-icons/lu";
import { DocsTree } from "./Sidebar";
import { NAV } from "./nav";

const PAGES = NAV.flatMap((s) => s.items);
// Quick and stiff, no bounce — the same feel as the accent menu.
const SPRING: Transition = { type: "spring", duration: 0.35, bounce: 0 };

/**
 * Docs navigation on phones (below md, where the pinned sidebar is hidden):
 * a bezel toggle pinned under the header, showing the current page, that
 * slides the same tree sidebar in from the left. The drawer closes when a
 * page is picked, the backdrop is tapped, or Escape is pressed, and the page
 * behind it can't scroll while it's open.
 */
export function MobileDocsNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const current = PAGES.find((p) => p.href === pathname)?.title ?? "Docs";

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const scroll = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = scroll;
    };
  }, [open]);

  return (
    <MotionConfig transition={SPRING} reducedMotion="user">
      <div className="sticky top-16 z-40 bg-(--bg)/80 px-6 py-2.5 backdrop-blur-xl md:hidden">
        <button
          type="button"
          aria-expanded={open}
          aria-controls="docs-drawer"
          aria-label={open ? "Hide docs menu" : "Show docs menu"}
          onClick={() => setOpen((o) => !o)}
          className="custom-button flex cursor-pointer items-center gap-2 rounded-full py-1.5 pr-4 pl-3 font-mori text-sm text-white/90 outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          {open ? <LuPanelLeftClose size={15} aria-hidden="true" /> : <LuPanelLeftOpen size={15} aria-hidden="true" />}
          <span aria-hidden="true" className="size-1 rounded-full" style={{ background: "var(--brand)" }} />
          {current}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop: dims and blurs the page; tapping it closes. */}
            <motion.div
              key="backdrop"
              aria-hidden="true"
              className="fixed inset-0 z-55 bg-black/50 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.nav
              key="drawer"
              id="docs-drawer"
              aria-label="Docs"
              className="fixed inset-y-0 left-0 z-60 w-72 max-w-[85vw] overflow-y-auto border-r border-white/6 bg-(--bg) px-4 pt-5 pb-10 md:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
            >
              {/* The toggle is under the backdrop while this is open, so the
                  drawer carries its own close control. */}
              <div className="mb-4 flex items-center justify-between pl-2">
                <span className="font-mono text-xs text-white/35">Docs</span>
                <button
                  type="button"
                  aria-label="Hide docs menu"
                  onClick={() => setOpen(false)}
                  className="custom-button grid size-8 cursor-pointer place-items-center rounded-full text-white/80 outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                >
                  <LuX size={15} aria-hidden="true" />
                </button>
              </div>
              <DocsTree onNavigate={() => setOpen(false)} />
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
