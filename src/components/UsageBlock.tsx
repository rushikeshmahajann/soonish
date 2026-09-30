"use client";

import { Loader } from "soonish";
import type { LoaderName } from "soonish";
import { PreviewTabs } from "./PreviewTabs";
import {AnimatedShinyText} from "./ui/animated-shiny-text";

// Each preview pairs a loader with the status line an agent might show while
// it runs, so the grid reads as agents mid-turn rather than specimens in a box.
interface PreviewLoader {
  name: LoaderName;
  loadertext: string;
}

const previewLoaders: PreviewLoader[] = [
  {
    name: "rain",
    loadertext: "Marinating..."
  },
  {
    name: "ripple",
    loadertext: "Noodling..."
  },
  {
    name: "scale-diag",
    loadertext: "Smooshing..."
  },
  {
    name: "firefly",
    loadertext: "Clauding..."
  },
];

// The snippet is generated from the first preview's name, so the code can
// never claim to render something the preview doesn't show. The import path is
// where the shadcn registry installs the engine (components/soonish).
const USAGE = `import { Loader } from "@/components/soonish";

<Loader name="${previewLoaders[0].name}" />`;


export function UsageBlock() {
  return (
    <PreviewTabs
      label="Usage view"
      code={
        // No `leading-0` here, unlike the single-line install input — it would
        // collapse line-height to zero and stack these three lines on top of
        // each other. overflow-x-auto keeps a long line inside the field
        // rather than widening the column.
        <pre className="w-full overflow-x-auto bg-transparent p-4 font-mono tracking-tight text-white/70 text-sm">
          <code>{USAGE}</code>
        </pre>
      }
      preview={
        // Loader where a caret would be, status text where typing would be —
        // an agent mid-thought rather than a specimen centred in a box.
        <div className="grid grid-cols-2 w-full items-center gap-2.5 py-8">
          {previewLoaders.map((loader) => (
            <div key={loader.name} className="flex gap-4 items-center justify-center px-4 rounded-md py-6">
              <Loader name={loader.name} size={40} dotSize={6} speed={0.65} color="var(--brand)" />
              <div>
                <AnimatedShinyText shimmerWidth={40} className="font-mori font-medium text-base tracking-tight text-white/30 [animation-duration:3s]">
                  <span>{loader.loadertext}</span>
                </AnimatedShinyText>
                <p className="text-sm text-white/70 capitalize">{loader.name.replace("-", " ")}</p>
              </div>
            </div>
          ))}
        </div>
      }
    />
  );
}
