# soonish

91 loading animations for React, each on a 5×5 grid of dots and animated with plain CSS. They ship through a [shadcn](https://ui.shadcn.com) registry, so installing one copies the source into your project:

```bash
npx shadcn@latest add https://soonish.rushikeshmahajan.com/r/thinking.json
```

This repo is the website (landing page, docs and registry) plus the loader source itself.

## Layout

| Path | What it is |
| --- | --- |
| `packages/soonish/` | The loader library — `Loader`, loader data and CSS. This is what the registry ships. |
| `src/app/` | The Next.js site: landing page (`/`), docs (`/docs/*`) and the loader workbench (`/loaders`). |
| `scripts/build-registry.ts` | Generates the registry — one item per loader plus the core — into `public/r/`. |
| `design/` | Source artwork. Not served. |

## Develop

```bash
pnpm install
pnpm dev              # http://localhost:3000
pnpm registry:build   # regenerate public/r/ (needed for install commands to work locally)
pnpm lint
```

`pnpm build` runs `registry:build` first, so a production build always ships a fresh registry. `public/r/` and `registry/` are generated and gitignored.

## Deploy

The registry links are baked in at build time, so the build needs to know the site's public URL:

- **`REGISTRY_URL`** — set it to the production URL, e.g. `https://soonish.rushikeshmahajan.com`. On Vercel it falls back to the production domain automatically, but setting it explicitly keeps published links stable.

It also sets `metadataBase`, so OpenGraph image URLs point at the same origin. Redeploy after changing the domain.
