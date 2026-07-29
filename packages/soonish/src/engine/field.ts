import { GRID } from '../types';

/**
 * A brightness field.
 *
 * `t` is normalised loop position in [0, 1] and MUST be periodic — f(x,y,0) has
 * to equal f(x,y,1) or the compiled animation will jump on loop. The return is
 * clamped to [0, 1] by the compiler.
 *
 * Fields are evaluated at compile time only. Nothing here ships to the browser.
 */
export type Field = (x: number, y: number, t: number) => number;

/** Independently animatable channels: opacity, glow, scale. */
export type Channel = 'o' | 'g' | 's';

/**
 * A field that drives several channels at once. Each returned channel compiles
 * to its own `linear()` easing, so opacity, glow and scale can follow
 * differently shaped curves on the same dot. Omit a channel to leave it static.
 */
export type MultiField = (
  x: number,
  y: number,
  t: number,
) => number | Partial<Record<Channel, number>>;

export const C = (GRID - 1) / 2;

// ---- scalar helpers ----

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Hermite ramp. The shoulders ease, unlike a hard threshold. */
export function smoothstep01(edge0: number, edge1: number, x: number): number {
  if (edge0 === edge1) return x < edge0 ? 0 : 1;
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

/** Gaussian falloff. Wider sigma reads softer and shimmers less. */
export const gauss = (d: number, sigma: number) => Math.exp(-(d * d) / (2 * sigma * sigma));

export const euclidean = (x: number, y: number) => Math.hypot(x - C, y - C);
export const manhattan = (x: number, y: number) => Math.abs(x - C) + Math.abs(y - C);
export const chebyshev = (x: number, y: number) => Math.max(Math.abs(x - C), Math.abs(y - C));

/** Loop-safe angle in [0,1) around the centre. */
export const angle01 = (x: number, y: number) =>
  (Math.atan2(y - C, x - C) + Math.PI) / (Math.PI * 2);

// ---- field builders ----

/**
 * A front that oscillates back and forth along one axis, with a soft Gaussian
 * edge.
 *
 * This is the shape that phase-shifting cannot express. Because the front
 * reverses, a dot near the centre is crossed twice per cycle at even spacing
 * while an edge dot is crossed once and dwells at the turnaround — so the two
 * dots need genuinely different brightness curves, not the same curve offset.
 */
export function oscillatingFront(opts: {
  axis: 'x' | 'y';
  lo?: number;
  hi?: number;
  sigma?: number;
}): Field {
  const { axis, lo = 0, hi = GRID - 1, sigma = 0.9 } = opts;
  const mid = (lo + hi) / 2;
  const amp = (hi - lo) / 2;
  return (x, y, t) => {
    const front = mid + amp * Math.cos(t * Math.PI * 2);
    return gauss((axis === 'x' ? x : y) - front, sigma);
  };
}

/**
 * N concentric rings expanding outward, summed. Each ring is offset in time, so
 * a dot is lit several times per cycle with radius-dependent spacing — again a
 * different curve shape per dot rather than a shared one.
 */
export function radialEcho(opts: { rings?: number; sigma?: number; maxR?: number }): Field {
  const { rings = 2, sigma = 0.55, maxR = Math.hypot(C, C) } = opts;
  return (x, y, t) => {
    const r = euclidean(x, y);
    let v = 0;
    for (let k = 0; k < rings; k++) {
      // each ring starts 1/rings of a cycle apart and sweeps 0 -> maxR
      const phase = (t + k / rings) % 1;
      v += gauss(r - phase * maxR, sigma) * (1 - phase * 0.55);
    }
    return v;
  };
}

/**
 * Two sine components at different frequencies whose phase offsets depend on
 * position in *different* ways. The interference pattern per dot is unique, so
 * this is not reducible to one curve plus a delay.
 */
export function beat(opts: { fastMul?: number; sigma?: number } = {}): Field {
  const { fastMul = 3 } = opts;
  return (x, y, t) => {
    const slow = 0.5 + 0.5 * Math.cos((t - euclidean(x, y) / 8) * Math.PI * 2);
    const fast = 0.5 + 0.5 * Math.cos((t * fastMul - manhattan(x, y) / 10) * Math.PI * 2);
    return smoothstep01(0.15, 0.95, slow * 0.65 + fast * 0.35);
  };
}
