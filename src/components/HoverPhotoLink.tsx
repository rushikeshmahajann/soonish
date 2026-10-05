"use client";

import Image from "next/image";
import { useEffect, useState, type PointerEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useIsClient } from "@/lib/useIsClient";
import { AnimatePresence, MotionConfig, motion, useMotionValue, useSpring, useTransform, useVelocity } from "motion/react";

// The follow is a spring, not a 1:1 track — the photo lags a touch behind the
// cursor and catches up, which is what reads as "magnetic".
const FOLLOW = { stiffness: 320, damping: 26, mass: 0.6 };

/**
 * A link that shows a photo above the cursor while it is hovered. The photo
 * fades and scales in, trails the pointer on a spring, tilts slightly in the
 * direction it is moving, and fades out when the pointer leaves.
 *
 * Portalled to <body> with position: fixed, because the footer is
 * overflow-hidden (it keeps the wordmark flush with the page bottom) and would
 * clip anything that rises above it. Pointer-only by nature: touch screens
 * have no hover, so they just get the link.
 */
export function HoverPhotoLink({
  href,
  src,
  width,
  height,
  children,
}: {
  href: string;
  src: string;
  /** Rendered size of the photo, in px. */
  width: number;
  height: number;
  children: ReactNode;
}) {
  const [hover, setHover] = useState(false);
  // Only portal once we are in the browser (document.body exists).
  const mounted = useIsClient();
  useEffect(() => {
    // Warm the cache now, so the photo is decoded before the first hover
    // instead of popping in blank.
    const img = new window.Image();
    img.src = src;
  }, [src]);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, FOLLOW);
  const sy = useSpring(y, FOLLOW);
  // Lean into the direction of travel, clamped so it never gets silly.
  const rotate = useTransform(useVelocity(sx), [-1200, 0, 1200], [-10, 0, 10], { clamp: true });

  const track = (e: PointerEvent) => {
    x.set(e.clientX);
    y.set(e.clientY);
  };

  return (
    <>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-white/80 transition-colors ease-in-out hover:text-white"
        onPointerEnter={(e) => {
          if (e.pointerType !== "mouse") return;
          // Start at the cursor rather than springing in from wherever the
          // photo was last.
          x.jump(e.clientX);
          y.jump(e.clientY);
          sx.jump(e.clientX);
          sy.jump(e.clientY);
          setHover(true);
        }}
        onPointerMove={track}
        onPointerLeave={() => setHover(false)}
      >
        {children}
      </a>
      {mounted &&
        createPortal(
          <MotionConfig reducedMotion="user">
            <AnimatePresence>
              {hover && (
                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none fixed top-0 left-0 z-[400]"
                  style={{ x: sx, y: sy }}
                >
                  {/* Offsets live on an inner element so they don't fight the
                      motion transform: centred on the cursor, 14px above it. */}
                  <motion.div
                    className="-translate-x-1/2 -translate-y-full"
                    style={{ marginTop: -14, rotate }}
                    initial={{ opacity: 0, scale: 0.85, filter: "blur(6px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Image
                      src={src}
                      alt=""
                      width={width}
                      height={height}
                      // Small (~24 KB) and preloaded above; served as-is so it
                      // is already in the cache the moment it mounts.
                      unoptimized
                      loading="eager"
                      className="rounded-lg shadow-[0_14px_9px_oklch(0_0_0/0.1),0_6px_6px_oklch(0_0_0/0.2),0_2px_4px_oklch(0_0_0/0.3)] ring-1 ring-white/10"
                    />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </MotionConfig>,
          document.body,
        )}
    </>
  );
}
