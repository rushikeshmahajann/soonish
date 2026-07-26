import path from "node:path";
import type { NextConfig } from "next";

const loaderPackageSource = path.join(
  process.cwd(),
  "packages/1hundo-loaders/src/index.ts",
);

const nextConfig: NextConfig = {
  transpilePackages: ["1hundo-loaders"],
  turbopack: {
    resolveAlias: {
      "1hundo-loaders": loaderPackageSource,
    },
  },
  webpack(config) {
    config.resolve ??= {};
    config.resolve.alias ??= {};
    config.resolve.alias["1hundo-loaders"] = loaderPackageSource;
    return config;
  },
};

export default nextConfig;
