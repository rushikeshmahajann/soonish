"use client";

import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";
import {
  ACCENTS,
  ACCENT_STORAGE_KEY,
  DEFAULT_ACCENT,
  applyAccent,
  type Accent,
  type AccentId,
} from "@/lib/accents";

type AccentContextValue = {
  accent: Accent;
  setAccent: (id: AccentId) => void;
};

const AccentContext = createContext<AccentContextValue>({
  accent: DEFAULT_ACCENT,
  setAccent: () => {},
});

// The chosen accent id lives in localStorage; React reads it as an external
// store. `memory` backs it when storage is blocked (private mode, site-data
// settings), so a pick still sticks for the visit.
let memory: string | null = null;
const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  // Another tab picking a colour updates this one too.
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

function readStoredId(): string | null {
  try {
    return localStorage.getItem(ACCENT_STORAGE_KEY) ?? memory;
  } catch {
    return memory;
  }
}

/**
 * Holds the landing page's accent colour.
 *
 * Most of the page reads it through CSS variables (--brand, --brand-from,
 * --brand-to) on <html>, so the 90-odd loaders and the heading recolour
 * without a React re-render. Only the WebGL background needs the actual hex
 * value, and it reads that from context via useAccent().
 *
 * The first paint is handled before React runs: globals.css holds the yellow
 * defaults and ACCENT_BOOT_SCRIPT applies a saved choice from <head>. So this
 * never writes the variables on mount — it only syncs its own state to what is
 * stored, and writes when the user actually picks a swatch.
 */
export function AccentProvider({ children }: { children: ReactNode }) {
  // The server snapshot is null (the default accent), so hydration matches;
  // React then re-reads the stored id on the client.
  const storedId = useSyncExternalStore(subscribe, readStoredId, () => null);
  const accent = ACCENTS.find((a) => a.id === storedId) ?? DEFAULT_ACCENT;

  const setAccent = (id: AccentId) => {
    const next = ACCENTS.find((a) => a.id === id);
    if (!next) return;
    applyAccent(document.documentElement, next);
    memory = next.id;
    try {
      localStorage.setItem(ACCENT_STORAGE_KEY, next.id);
    } catch {
      // Not persisted, but the page still recolours for this visit.
    }
    listeners.forEach((l) => l());
  };

  return <AccentContext.Provider value={{ accent, setAccent }}>{children}</AccentContext.Provider>;
}

export const useAccent = () => useContext(AccentContext);
