"use client";

import { useSyncExternalStore } from "react";
import { REGISTRY_CORE, installCommand } from "@/lib/registry";
import { CopyButton } from "./CopyButton";
import { usePackageManager } from "./PackageToggle";

const noopSubscribe = () => () => {};

/**
 * The install command for a registry item — the whole engine by default — in
 * the selected package manager.
 *
 * `origin` comes from the server (the build-time registry origin) so the
 * prerendered HTML already shows a real command; after hydration it switches
 * to the page's own origin, matching what the tile copy buttons use.
 */
export function InstallField({
  origin: serverOrigin,
  item = REGISTRY_CORE,
}: {
  origin: string;
  /** Registry item to install. */
  item?: string;
}) {
  const { pm } = usePackageManager();
  const origin = useSyncExternalStore(
    noopSubscribe,
    () => window.location.origin,
    () => serverOrigin,
  );

  const command = installCommand(item, origin, pm);

  return (
    <div className="flex items-center gap-2 rounded-md bg-white/4 pr-1.5 gradient-border gradient-border-from-white/14 gradient-border-via-white/6 gradient-border-to-white/6">
      {/* readOnly rather than defaultValue: the command changes with the
          toggle, and an editable field would drift from what Copy copies.
          It stays an input so the text can still be selected by hand. */}
      <input
        type="text"
        readOnly
        value={command}
        aria-label="Install command"
        onFocus={(e) => e.currentTarget.select()}
        className="min-w-0 flex-1 border-0 bg-transparent px-2 py-2 font-mono leading-0 tracking-tight text-white/70 text-sm outline-none"
      />
      <CopyButton value={command} />
    </div>
  );
}
