"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
// Free set, not @hugeicons-pro/core-stroke-rounded — that scope is paid and
// 404s on the public registry without an auth token. Same icon names.
import { Copy02Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

/**
 * Copy-to-clipboard control for the install command.
 *
 * Client-only because `navigator.clipboard` and the transient "copied" state
 * both need the browser — the icons themselves are plain SVG with no hooks, so
 * they would happily render on the server.
 */
export function CopyButton({
  value,
  label = "install command",
  className,
}: {
  /** The text to copy, or a function that builds it at click time (e.g. from window.location). */
  value: string | (() => string);
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clearing on unmount matters because the reset is scheduled 1.6s out: a
  // navigation inside that window would otherwise set state on a gone component.
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(typeof value === "function" ? value() : value);
    } catch {
      // writeText rejects on insecure origins and when the user has denied
      // clipboard access. Neither is actionable here, and throwing would break
      // the button, so the confirmation is simply skipped.
      return;
    }
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1600);
  }, [value]);

  return (
    <button
      type="button"
      onClick={copy}
      // The label carries the state because the icon swap alone says nothing to
      // a screen reader. aria-live announces the change without moving focus.
      aria-label={copied ? `Copied ${label}` : `Copy ${label}`}
      aria-live="polite"
      // Naked icon — no bezel, no outline. The p-1 is invisible but widens the
      // hit area past the 16px glyph, and outline-none would remove the focus
      // ring for keyboard users, so it is deliberately left alone.
      // Dim at rest so it stays subordinate to the command text, brightening
      // only on hover.
      className={cn(
        "flex shrink-0 cursor-pointer items-center justify-center p-1 text-white/40 transition-colors hover:text-white/80",
        className,
      )}
    >
      {/* currentColor means the icon inherits the text-white/40 above and its
          hover state, so colour is controlled in one place. */}
      <HugeiconsIcon
        icon={copied ? Tick02Icon : Copy02Icon}
        size={16}
        color="currentColor"
        strokeWidth={1.5}
      />
    </button>
  );
}
