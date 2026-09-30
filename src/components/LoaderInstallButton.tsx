"use client";

import { installCommand } from "@/lib/registry";
import { CopyButton } from "./CopyButton";
import { usePackageManager } from "./PackageToggle";

/**
 * Copies the shadcn install command for one loader, in the package manager
 * selected in the Install section.
 *
 * The origin is read at click time from the page itself, so the command always
 * points at the registry this very site serves — localhost in dev, the real
 * domain in production — with no URL to configure.
 */
export function LoaderInstallButton({ name, className }: { name: string; className?: string }) {
  const { pm } = usePackageManager();
  return (
    <CopyButton
      value={() => installCommand(name, window.location.origin, pm)}
      label={`install command for ${name}`}
      className={className}
    />
  );
}
