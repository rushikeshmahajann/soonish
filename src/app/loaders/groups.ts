import type { LoaderName } from "soonish";

export type Group = {
  id: string;
  title: string;
  desc: string;
  size?: number;
  names: LoaderName[];
};

// Mirrors the category comments on the LoaderName union in
// packages/soonish/src/types.ts. Typed as LoaderName[], so a rename or
// typo in the package fails `tsc` here rather than rendering nothing.
export const GROUPS: Group[] = [
  {
    id: "pulse",
    title: "Pulse Wave",
    desc: "Brightness pulses travelling along a path or field.",
    names: [
      "sweep", "diagonal", "ripple", "rain", "spiral", "snake", "sparkle",
      "heartbeat", "scanner", "orbit", "breathe", "checker", "stripes",
      "falling", "plasma", "loadbar", "knight-tour", "vortex",
      "sine-wave", "life", "quadrants", "crossfade", "glider", "matrix",
      "pong", "concentric", "twin-spirals",
    ],
  },
  {
    id: "ai",
    title: "AI / Process",
    desc: "Named for agent states — thinking, searching, streaming.",
    names: [
      "thinking", "searching", "finding", "consolidating", "streaming",
      "reasoning", "indexing", "connecting", "generating", "reflecting",
    ],
  },
  {
    id: "scale",
    title: "Scale",
    desc: "Pixels scale in and out instead of pulsing brightness.",
    names: ["scale-ripple", "scale-wave", "scale-diag", "scale-pop", "scale-ring", "scale-check"],
  },
  {
    id: "funky",
    title: "Funky Scale",
    desc: "Scale variants with rotation, skew, squash and overshoot.",
    names: [
      "twist", "squash", "jelly", "pop-rotate", "skew", "heartbeat-scale",
      "drop", "burst", "spiral-scale", "zigzag",
    ],
  },
  {
    id: "mandalas",
    title: "Mandalas",
    desc: "Symmetric masks where only pixels on a geometric path animate.",
    names: [
      "round", "square-mandala", "diamond-mandala", "cross", "x-diagonal",
      "star-burst", "petal", "snowflake", "gear", "kaleido", "spiral-mandala",
      "pulse-square", "check-mandala", "octagon", "lotus",
      "outline", "rings", "rose",
    ],
  },
  {
    id: "patterns",
    title: "Patterns",
    desc: "Sweeps, topples, swings and blinks. Some are a shared keyframe phased by a path or angle; others needed a compiled field because their dots follow differently shaped curves.",
    names: ["sonar", "pinwheel", "domino", "corners", "frame", "raindrop", "pendulum", "firefly", "halo"],
  },
  {
    id: "ported",
    title: "Ported — dot-matrix",
    desc: "Ported from the dot-matrix reference. Each was a shared keyframe plus a per-dot animation-delay from a path ordering, so they map onto the same procedural model as the loaders above.",
    names: ["neon-drift", "core-spiral", "twin-orbit", "prism-sweep", "flux-columns", "echo-ring", "origin-wave"],
  },
  {
    id: "fields",
    title: "Compiled Fields",
    desc: "Brightness fields sampled at build time into per-dot linear() easings. Each dot can follow a differently shaped curve — and opacity, glow and scale animate on independent curves, which a single shared keyframe cannot express.",
    names: ["front-sweep", "ripple-echo", "pulse-beat", "lumen-bloom"],
  },
];

export const TOTAL = GROUPS.reduce((n, g) => n + g.names.length, 0);
