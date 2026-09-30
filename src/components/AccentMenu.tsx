"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion, type Transition } from "motion/react";
import { ACCENTS } from "@/lib/accents";
import { cn } from "@/lib/utils";
import { useAccent } from "./AccentProvider";

// Every accent around a colour wheel, so the closed trigger reads as "pick a
// colour" rather than showing any one of them. Built from ACCENTS, so a new
// palette entry shows up here automatically.
const SPECTRUM = `conic-gradient(from 180deg, ${[...ACCENTS, ACCENTS[0]].map((a) => a.accent).join(", ")})`;

// Short and stiff so it feels snappy. No bounce: the surface is a physical
// bezel, and an overshooting panel reads as rubber rather than a drawer.
const SPRING: Transition = { type: "spring", duration: 0.25, bounce: 0 };

// Swatches, the spectrum and the highlight are all circles.
const SWATCH_RADIUS = "50%";

/**
 * Floating accent switcher, pinned to the bottom-right corner.
 *
 * Closed, it is one bezel button holding a spectrum circle. Opening it grows
 * that same surface leftward into a horizontal row of swatches — a layout
 * animation on the bezel itself, not a separate popover — with the trigger
 * staying put at the right-hand end. It stays open while you pick, so colours can be
 * compared one after another, and closes on Escape or a click elsewhere.
 */
export function AccentMenu() {
  const [open, setOpen] = useState(false);
  const { accent, setAccent } = useAccent();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    // reducedMotion="user": with the OS setting on, layout and transform
    // animations are skipped and only opacity fades remain.
    <MotionConfig transition={SPRING} reducedMotion="user">
      {/* Positioning lives on a plain wrapper: .custom-button is unlayered CSS
          that sets position: relative, which would beat Tailwind's `fixed`.
          z-300 clears the site-wide bottom GradualBlur (z-200). */}
      <div ref={rootRef} className="fixed right-5 bottom-5 z-300">
        {/* The bezel. `layout` animates its size as the swatch row mounts,
            and because it is anchored by `right`, it grows leftward. The radius
            goes through `style` so Motion can correct it while the box is
            being scaled — a Tailwind class would distort mid-animation. */}
        <motion.div
          layout
          className="custom-button flex flex-row items-center p-1"
          // Half the 36px height, so it is a circle when closed and a pill when open.
          style={{ borderRadius: 18 }}
        >
          <AnimatePresence initial={false} mode="popLayout">
            {open && (
              <motion.div
                key="swatches"
                layout
                role="radiogroup"
                aria-label="Accent colour"
                className="flex flex-row gap-0.5 pr-0.5"
                initial="hidden"
                animate="shown"
                exit="hidden"
                // The row fades in as the bezel grows rather than popping
                // in: it lags the layout spring slightly so the surface leads
                // and the colours settle into it, and on close it fades out
                // fast so nothing lingers while the bezel shrinks. Swatches
                // nearest the trigger still arrive first, so the fade reads as
                // sliding out of the button.
                variants={{
                  shown: {
                    opacity: 1,
                    transition: {
                      opacity: { duration: 0.15, ease: "easeOut", delay: 0.02 },
                      staggerChildren: 0.012,
                      staggerDirection: -1,
                    },
                  },
                  hidden: {
                    opacity: 0,
                    transition: { opacity: { duration: 0.08, ease: "easeIn" }, staggerChildren: 0.005 },
                  },
                }}
              >
                {ACCENTS.map((a) => {
                  const selected = a.id === accent.id;
                  return (
                    <motion.button
                      key={a.id}
                      layout
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      aria-label={a.label}
                      title={a.label}
                      onClick={() => setAccent(a.id)}
                      // Opacity only: the bezel's layout animation already
                      // carries the motion, so the swatches just fade.
                      variants={{
                        hidden: { opacity: 0 },
                        shown: { opacity: 1, transition: { duration: 0.12, ease: "easeOut" } },
                      }}
                      className="relative grid size-7 cursor-pointer place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                    >
                      {/* One shared highlight that glides between swatches
                          instead of blinking off one and on at the next. */}
                      {selected && (
                        <motion.span
                          layoutId="accent-selected"
                          aria-hidden="true"
                          className="absolute inset-0 bg-white/10"
                          style={{ borderRadius: SWATCH_RADIUS }}
                        />
                      )}
                      <span
                        aria-hidden="true"
                        className={cn(
                          "relative size-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)] transition-transform duration-150",
                          selected ? "scale-100" : "scale-90 hover:scale-100",
                        )}
                        style={{
                          borderRadius: SWATCH_RADIUS,
                          background: `linear-gradient(135deg, ${a.from} 0%, ${a.to} 45%, ${a.accent} 100%)`,
                        }}
                      />
                    </motion.button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* `layout` here too, so the trigger is counter-scaled while its
              parent animates rather than stretching with it. */}
          <motion.button
            ref={triggerRef}
            layout
            type="button"
            aria-label="Change accent colour"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="grid size-7 cursor-pointer place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            <motion.span
              aria-hidden="true"
              className="size-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)]"
              style={{ borderRadius: SWATCH_RADIUS, background: SPECTRUM }}
              // A quarter turn of the wheel as it opens — a small cue that the
              // button changed state, on top of the surface growing.
              animate={{ rotate: open ? 90 : 0 }}
            />
          </motion.button>
        </motion.div>
      </div>
    </MotionConfig>
  );
}
