import { GROUPS, TOTAL } from "./loaders/groups";
import {
  PackageManagerProvider,
  PackageToggle,
} from "@/components/PackageToggle";
import { InstallField } from "@/components/InstallField";
import { UsageBlock } from "@/components/UsageBlock";
import { LazyLoader } from "@/components/LazyLoader";
import { AccentProvider } from "@/components/AccentProvider";
import { AccentMenu } from "@/components/AccentMenu";
import { WordmarkBand } from "@/components/WordmarkBand";
import { Footer } from "@/components/Footer";
import { LoaderInstallButton } from "@/components/LoaderInstallButton";
import { registryOrigin } from "@/lib/registry";
import { SiteNav } from "@/components/SiteNav";

// The whole set, taken from the same module the /loaders workbench reads, so
// the landing page can never fall behind the package. GROUPS is typed as
// LoaderName[], so a rename in the package fails the build here instead of
// silently rendering nothing.
const ALL_LOADERS = GROUPS.flatMap((g) => g.names);

export default function Home() {
  // Not pure #000 — on OLED that switches pixels fully off, which smears on
  // scroll and hard-edges against content.
  return (
    <AccentProvider>
      <PackageManagerProvider>
        <main className="relative min-h-screen w-full bg-[var(--bg)]">
          {/* Floats over the hero shader: absolutely placed so the hero keeps
              its full height and the wordmark stays centred. z-20 clears the
              band's blur (z-5) and wordmark (z-10). */}
          <SiteNav className="absolute inset-x-0 top-0 z-20 py-5" />
          <WordmarkBand />

          {/* Full width with a gutter on phones, capped on tablets, 40vw from lg up
              (40vw alone is ~156px on a phone). */}
          <div className="mx-auto flex w-full max-w-2xl flex-col items-left justify-center gap-8 px-6 py-2 lg:max-w-[40vw] lg:px-0">
            {/* Install */}
            <div className="flex flex-col gap-4">
              <h2 className="font-mori text-2xl tracking-tight font-medium px-1 text-white">
                Install
              </h2>
              <PackageToggle />

              {/* Installs the engine with every loader via the shadcn registry.
              The toggle above also sets the runner for each tile's copy button. */}
              <InstallField origin={registryOrigin()} />
              <p className="px-1 text-xs text-white/40">
                Adds all {TOTAL} loaders to{" "}
                <code className="font-mono text-white/60">
                  components/soonish
                </code>
                . Want just one? Hover a loader below and copy its command.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <h2 className="font-mori text-2xl tracking-tight font-medium px-1 text-white mt-4">
                Usage
              </h2>
              {/* Tabs + panel live together in a client component because the view is
              stateful; the snippet and the preview are both derived there from one
              loader name so they cannot disagree. */}
              <UsageBlock />
            </div>

            {/* flex + justify-between pushes the count to the far edge of the column.
            items-baseline rather than items-center so the small mono count sits
            on the same baseline as the 2xl heading instead of floating at its
            vertical middle. align-middle is dropped — it is an inline-layout
            property and does nothing on a flex item. */}
            <h2 className="flex items-baseline justify-between font-mori text-2xl tracking-tight font-medium px-1 text-white mt-4">
              Loaders
              <span className="font-mono text-sm text-white/35">{TOTAL}</span>
            </h2>

            {/* Bare loaders — no card, so the matrices are the grid items themselves.
            `justify-items-center` is what centres them: each Loader renders at a
            fixed 42px span, narrower than its track, and grid items with an
            explicit width would otherwise sit hard against the track's start.

            Five columns, as before — the set is just 91 items deep now instead
            of one row. */}
            <div className="grid grid-cols-4 w-full items-center justify-items-center gap-3">
              {ALL_LOADERS.map((name) => (
                // Each tile is its own containment root, and the matrix inside is a
                // LazyLoader: only tiles near the viewport mount their 25 animated
                // dots. content-visibility alone was not enough — it skips paint,
                // but every dot was still in the DOM to hydrate and style before
                // first paint. containIntrinsicSize reserves the collapsed size, so
                // the scrollbar does not jump as tiles come into view.
                <div
                  key={name}
                  title={name}
                  // w-full rather than letting the tile size to its content: the
                  // label is wider than the 42px matrix and varies per loader, so
                  // content-sizing would make every tile a different width and the
                  // matrices would stop lining up in a column.
                  className="group relative flex w-full flex-col items-center justify-center gap-2 py-8 bg-white/2 rounded-md"
                  style={{
                    contentVisibility: "auto",
                    // Matrix + gap + label + padding. An estimate only — it reserves
                    // the collapsed height so the scrollbar does not jump as tiles
                    // come into view.
                    containIntrinsicSize: "42px 92px",
                  }}
                >
                  {/* size is a budget, not the rendered span: the resolver floors the
                  gap so every dot edge lands on a whole pixel. 44/6 gives a 3px
                  gap and a 42px matrix. */}
                  <LazyLoader
                    name={name}
                    size={44}
                    dotSize={6}
                    speed={0.65}
                    color="var(--brand)"
                  />
                  {/* truncate needs the min-w-0 that w-full gives it here; the tile
                  carries the full name in `title`, so a clipped label is still
                  readable on hover. */}
                  <span className="w-full truncate text-center font-mono text-[10px] leading-none tracking-tight text-white/30">
                    {name}
                  </span>
                  {/* Copies `npx shadcn add …/r/<name>.json`. Hidden until the tile
                  is hovered so 91 icons don't clutter the grid, but always shown
                  on touch screens (no hover) and whenever it has keyboard focus. */}
                  <LoaderInstallButton
                    name={name}
                    className="absolute top-1.5 right-1.5 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 [@media(hover:none)]:opacity-100"
                  />
                </div>
              ))}
            </div>
          </div>
          <Footer />
          {/* Fixed to the viewport corner; re-themes hero, wordmark, loaders and the footer icon. */}
          <AccentMenu />
        </main>
      </PackageManagerProvider>
    </AccentProvider>
  );
}
