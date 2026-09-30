<div align="center">

<img src="design/soonish-icon.png" alt="soonish" width="140" />

# soonish

**91 loading animations for React, each on a 5×5 grid of dots.**

Plain CSS · no runtime · copied into your project with the shadcn CLI

[Website](https://soonish.rushikeshmahajan.com) · [Docs](https://soonish.rushikeshmahajan.com/docs) · [Installation](https://soonish.rushikeshmahajan.com/docs/installation)

![React](https://img.shields.io/badge/React-18%2B-0a0a0a?style=flat-square&logo=react&logoColor=CDC868)
![shadcn registry](https://img.shields.io/badge/shadcn-registry-0a0a0a?style=flat-square&logoColor=CDC868)
![Server Components](https://img.shields.io/badge/Server_Components-ready-0a0a0a?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-typed-0a0a0a?style=flat-square&logo=typescript&logoColor=CDC868)

</div>

---

## Install

Add everything — the engine and all 91 loaders:

```bash
npx shadcn@latest add https://soonish.rushikeshmahajan.com/r/soonish.json
```

Or add just the one you want. Every loader is its own registry item, with a named component — copy any loader's command from the [website](https://soonish.rushikeshmahajan.com):

```bash
npx shadcn@latest add https://soonish.rushikeshmahajan.com/r/thinking.json
```

The code lands in `components/soonish` and is yours to edit. No package to keep updated.

## Use

```tsx
import { Loader } from "@/components/soonish";

export default function Loading() {
  return <Loader name="thinking" color="#CDC868" size={40} dotSize={6} />;
}
```

`Loader` has no hooks, so it works in Server Components — a natural fit for a Next.js `loading.tsx`.

| Prop | Default | |
| --- | --- | --- |
| `name` | — | Any of the 91 loader names. Typed, so your editor autocompletes them. |
| `color` | loader's pastel | Any CSS color, including `var(--your-token)`. |
| `size` | `24` | Width of the whole loader in px. |
| `dotSize` | `3` | Size of each dot in px. |
| `cellPadding` | — | Gap between dots in px. Overrides `size`. |
| `speed` | `1` | Playback speed. `2` is twice as fast. |

## What's inside

| Family | | |
| --- | --- | --- |
| **Pulse Wave** | 27 | Brightness pulses along a path — sweep, ripple, rain, spiral, snake… |
| **AI / Process** | 10 | Named for agent states — thinking, searching, streaming, reasoning… |
| **Scale** · **Funky Scale** | 16 | Dots that grow and shrink — twist, jelly, pop-rotate, zigzag… |
| **Mandalas** | 18 | Symmetric patterns — snowflake, gear, lotus, octagon… |
| **Patterns** · **Ported** · **Fields** | 20 | Sonar, pinwheel, neon-drift, firefly, halo… |

Every loader is the same 25-dot grid — only the timing and the order the dots light up change.

---

## Develop

This repo is the website (landing page, docs, registry) and the loader source.

```bash
pnpm install
pnpm dev              # http://localhost:3000
pnpm registry:build   # regenerate public/r/ so install commands work locally
pnpm lint
```

| Path | |
| --- | --- |
| `packages/soonish/` | The loader library — `Loader`, loader data and CSS. What the registry ships. |
| `src/app/` | The Next.js site: `/`, `/docs/*` and the `/loaders` workbench. |
| `scripts/build-registry.ts` | Builds the registry — one item per loader plus the core — into `public/r/`. |
| `design/` | Source artwork. Not served. |

`pnpm build` runs `registry:build` first, so a production build always ships a fresh registry. `public/r/` and `registry/` are generated and gitignored.

### Deploy

Registry links are baked in at build time. Set **`REGISTRY_URL`** to the production URL (e.g. `https://soonish.rushikeshmahajan.com`) — it also sets `metadataBase` for the OpenGraph image. On Vercel it falls back to the production domain automatically. Redeploy after changing the domain.

---

<div align="center">

Built by [Rushikesh Mahajan](https://rushikeshmahajan.com) · [GitHub](https://github.com/rushikeshmahajann) · [X](https://x.com/rushy_0) · [LinkedIn](https://www.linkedin.com/in/rushikeshmahajann/)

<sub>Copy the code, it's yours.</sub>

</div>
