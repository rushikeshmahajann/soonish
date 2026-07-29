import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The loader package is consumed as source: its package.json entry points at
  // src/index.ts and transpilePackages compiles it. No resolveAlias needed —
  // an absolute path there silently failed to apply under Turbopack, which then
  // fell back to a stale dist/ build and broke `next build`.
  transpilePackages: ["soonish"],

  // Pin the workspace root. A stray ~/package-lock.json otherwise makes Next
  // infer the home directory, which mangles every resolved path.
  turbopack: {
    root: path.join(import.meta.dirname),
  },
};

export default nextConfig;
