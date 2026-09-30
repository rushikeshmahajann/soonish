// Generates the shadcn registry for soonish, then builds it into public/r.
//
//   pnpm registry:build
//
// Two kinds of item come out of this:
//
//   soonish        The whole engine — <Loader name="…" /> plus every loader's
//                  data and CSS. Installing it alone gives you the full set.
//   <loader-name>  One per loader (thinking, rain, …): a tiny named wrapper,
//                  e.g. <ThinkingLoader />, that depends on `soonish`, so the
//                  CLI installs the engine alongside it the first time.
//
// Everything is derived from LOADER_NAMES, so a loader added to the package
// gets its own registry item on the next build with no edits here.
//
// registryDependencies must be absolute URLs — the shadcn CLI reads a "./"
// dependency as a local file path, not relative to the item's own URL — so
// the site's origin is baked in at build time (see REGISTRY_URL below).

import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { LOADER_NAMES } from "../packages/soonish/src/data/loaders";
import { GROUPS } from "../src/app/loaders/groups";
import { REGISTRY_CORE, registryOrigin } from "../src/lib/registry";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT_DIR = path.join(ROOT, "registry"); // generated, gitignored
const SRC = "packages/soonish/src";
// Where the files land in the user's project.
const TARGET = "components/soonish";

const origin = registryOrigin();

// Every loader the site shows must be installable, or a tile would offer a
// copy command that 404s.
const missing = GROUPS.flatMap((g) => g.names).filter((n) => !LOADER_NAMES.includes(n));
if (missing.length) {
  throw new Error(`Loaders shown on the site but missing from the package: ${missing.join(", ")}`);
}

// The runtime import graph of <Loader />, and nothing else: engine/fields.ts
// is build-time only (it generates the curves), so it is not shipped.
// compile.ts and field.ts come along because generated.ts imports a type from
// compile.ts, which in turn imports field.ts.
const CORE_FILES = [
  "index.ts",
  "Loader.tsx",
  "types.ts",
  "layout.ts",
  "data/loaders.ts",
  "engine/generated.ts",
  "engine/compile.ts",
  "engine/field.ts",
  "styles/base.css",
  "styles/fields.generated.css",
];

const pascal = (slug: string) =>
  slug.replace(/(^|-)([a-z0-9])/g, (_, __, c: string) => c.toUpperCase());

const wrapperSource = (slug: string) => `import { Loader, type LoaderProps } from "..";

export type ${pascal(slug)}LoaderProps = Omit<LoaderProps, "name">;

/** The "${slug}" loader from soonish. Accepts every <Loader /> prop except \`name\`. */
export function ${pascal(slug)}Loader(props: ${pascal(slug)}LoaderProps) {
  return <Loader name="${slug}" {...props} />;
}
`;

rmSync(OUT_DIR, { recursive: true, force: true });
mkdirSync(path.join(OUT_DIR, "loaders"), { recursive: true });

const items = [
  {
    name: REGISTRY_CORE,
    type: "registry:lib",
    title: "soonish",
    description: `The soonish loader engine: <Loader name="…" /> with all ${LOADER_NAMES.length} 5×5 pixel loaders.`,
    files: CORE_FILES.map((f) => ({
      path: `${SRC}/${f}`,
      type: "registry:file",
      target: `${TARGET}/${f}`,
    })),
  },
  ...LOADER_NAMES.map((slug) => {
    const file = `registry/loaders/${slug}.tsx`;
    writeFileSync(path.join(ROOT, file), wrapperSource(slug));
    return {
      name: slug,
      type: "registry:component",
      title: `${pascal(slug)} loader`,
      description: `The "${slug}" 5×5 pixel loader from soonish.`,
      registryDependencies: [`${origin}/r/${REGISTRY_CORE}.json`],
      files: [{ path: file, type: "registry:file", target: `${TARGET}/loaders/${slug}.tsx` }],
    };
  }),
];

const registryPath = path.join(OUT_DIR, "registry.json");
writeFileSync(
  registryPath,
  JSON.stringify(
    {
      $schema: "https://ui.shadcn.com/schema/registry.json",
      name: "soonish",
      homepage: origin,
      items,
    },
    null,
    2,
  ),
);

rmSync(path.join(ROOT, "public/r"), { recursive: true, force: true });
execFileSync("npx", ["shadcn@latest", "build", registryPath, "--output", "public/r"], {
  cwd: ROOT,
  stdio: "inherit",
});

console.log(`\nRegistry: ${items.length} items (${LOADER_NAMES.length} loaders + core) for ${origin}`);
