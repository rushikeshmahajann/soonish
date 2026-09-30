// Shared by the registry build script and the site, so the command a tile
// copies always points at a file the build actually produced.

/** Registry item holding the loader engine; every per-loader item depends on it. */
export const REGISTRY_CORE = "soonish";

/**
 * The site's public origin, baked into the registry at build time.
 *
 * Set REGISTRY_URL explicitly for a custom domain. On Vercel the production
 * domain is picked up automatically; locally it falls back to the dev server.
 */
export function registryOrigin(): string {
  const explicit = process.env.REGISTRY_URL ?? process.env.NEXT_PUBLIC_REGISTRY_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "http://localhost:3000";
}

export const PACKAGE_MANAGERS = ["pnpm", "npm", "yarn", "bun"] as const;
export type PackageManager = (typeof PACKAGE_MANAGERS)[number];

// How each package manager runs a one-off CLI without installing it.
const RUNNERS: Record<PackageManager, string> = {
  pnpm: "pnpm dlx",
  npm: "npx",
  yarn: "yarn dlx",
  bun: "bunx --bun",
};

/**
 * The install command for a registry item — one loader, or REGISTRY_CORE for
 * the whole engine.
 *
 * Uses the item's full URL so it works for anyone today. Once the registry is
 * listed in shadcn's public directory, this can become the shorter
 * `<runner> shadcn@latest add @soonish/<name>` with no other change.
 */
export function installCommand(name: string, origin: string, pm: PackageManager = "npm"): string {
  return `${RUNNERS[pm]} shadcn@latest add ${origin}/r/${name}.json`;
}
