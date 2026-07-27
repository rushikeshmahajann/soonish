import path from "node:path";
import type { NextConfig } from "next";

const loaderPackageSource = path.join(
  process.cwd(),
  "packages/soonish/src/index.ts",
);

const nextConfig: NextConfig = {
  transpilePackages: ["soonish"],
  turbopack: {
    resolveAlias: {
      "soonish": loaderPackageSource,
    },
  },
  webpack(config) {
    config.resolve ??= {};
    config.resolve.alias ??= {};
    config.resolve.alias["soonish"] = loaderPackageSource;
    return config;
  },
};

export default nextConfig;
