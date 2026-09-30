"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, MotionConfig, motion, type Transition } from "motion/react";
import { SlidingTabs } from "./SlidingTabs";

const TABS = [
  { id: "preview", label: "Preview" },
  { id: "code", label: "Code" },
] as const;

// Quick and stiff, no bounce — the same feel as the accent menu.
const SPRING: Transition = { type: "spring", duration: 0.35, bounce: 0 };

/**
 * Preview / Code tabs over one panel — the landing page's Usage block, shared
 * so every live preview on the site (landing and docs) behaves the same.
 *
 * The two views usually differ a lot in height, so instead of jumping, the
 * panel animates between them with a layout animation. The radius goes through
 * `style`, not a class, so Motion keeps the corners true while the box is
 * scaled (8px is rounded-md). Returns a fragment so the caller controls the
 * gap between the tabs and the panel.
 */
export function PreviewTabs({ preview, code, label = "Example view" }: { preview: ReactNode; code: ReactNode; label?: string }) {
  const [view, setView] = useState<string>("preview");

  return (
    <>
      <SlidingTabs items={TABS} value={view} onChange={setView} label={label} />
      <MotionConfig transition={SPRING} reducedMotion="user">
        <motion.div layout className="relative flex min-h-20 items-center bg-white/2" style={{ borderRadius: 8 }}>
          {/* popLayout lifts the outgoing panel out of flow while it fades, so
              the wrapper starts resizing at once instead of waiting for it.
              `layout` on each panel counter-scales it against the wrapper, so
              text and loaders never stretch mid-animation. */}
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={view}
              layout
              className="w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.12 } }}
            >
              {view === "code" ? code : preview}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </MotionConfig>
    </>
  );
}
