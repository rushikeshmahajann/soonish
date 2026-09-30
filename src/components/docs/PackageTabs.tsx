"use client";

import { PACKAGE_MANAGERS, REGISTRY_CORE, type PackageManager } from "@/lib/registry";
import { InstallField } from "@/components/InstallField";
import { usePackageManager } from "@/components/PackageToggle";
import { SlidingTabs } from "@/components/SlidingTabs";

const MANAGERS = PACKAGE_MANAGERS.map((id) => ({ id, label: id }));

/**
 * Package-manager switcher plus install command — the landing page's Install
 * block, reused. The selection lives in PackageManagerProvider (in the docs
 * layout), so every PackageTabs on a page switches together.
 */
export function PackageTabs({
  origin,
  item = REGISTRY_CORE,
}: {
  /** Build-time registry origin, so the prerendered command is real. */
  origin: string;
  /** Registry item to install — the whole engine by default. */
  item?: string;
}) {
  const { pm, setPm } = usePackageManager();
  return (
    <div className="my-7 flex flex-col gap-3">
      <SlidingTabs items={MANAGERS} value={pm} onChange={(id) => setPm(id as PackageManager)} label="Package manager" />
      <InstallField origin={origin} item={item} />
    </div>
  );
}
