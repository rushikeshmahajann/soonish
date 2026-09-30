"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { PackageManager } from "@/lib/registry";
import { SlidingTabs } from "./SlidingTabs";

const MANAGERS = [
  { id: "pnpm", label: "pnpm" },
  { id: "npm", label: "npm" },
  { id: "bun", label: "bun" },
] as const satisfies readonly { id: PackageManager; label: string }[];

type PackageManagerContextValue = {
  pm: PackageManager;
  setPm: (pm: PackageManager) => void;
};

const PackageManagerContext = createContext<PackageManagerContextValue>({
  pm: "pnpm",
  setPm: () => {},
});

/**
 * Holds the selected package manager for the whole landing page, so the
 * Install field and every loader tile's copy button produce commands for the
 * same tool — pick bun once and every copy is a `bunx` command.
 */
export function PackageManagerProvider({ children }: { children: ReactNode }) {
  const [pm, setPm] = useState<PackageManager>("pnpm");
  return <PackageManagerContext.Provider value={{ pm, setPm }}>{children}</PackageManagerContext.Provider>;
}

export const usePackageManager = () => useContext(PackageManagerContext);

/**
 * Package-manager toggle. The sliding-indicator mechanism lives in
 * [SlidingTabs] — this only reads and writes the shared selection.
 */
export function PackageToggle() {
  const { pm, setPm } = usePackageManager();
  return (
    <SlidingTabs
      items={MANAGERS}
      value={pm}
      onChange={(id) => setPm(id as PackageManager)}
      label="Package manager"
    />
  );
}
