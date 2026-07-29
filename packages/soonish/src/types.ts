import type { CSSProperties } from 'react';

export type LoaderName =
  // Pulse wave loaders
  | 'sweep' | 'diagonal' | 'ripple' | 'rain' | 'spiral' | 'snake'
  | 'sparkle' | 'heartbeat' | 'scanner' | 'orbit' | 'breathe' | 'checker'
  | 'stripes' | 'falling' | 'plasma' | 'loadbar' | 'knight-tour'
  | 'vortex' | 'sine-wave' | 'life' | 'quadrants' | 'crossfade' | 'glider'
  | 'matrix' | 'pong' | 'concentric' | 'twin-spirals'
  // AI/process loaders
  | 'thinking' | 'searching' | 'finding' | 'consolidating' | 'streaming'
  | 'reasoning' | 'indexing' | 'connecting' | 'generating' | 'reflecting'
  // Scale loaders
  | 'scale-ripple' | 'scale-wave' | 'scale-diag' | 'scale-pop' | 'scale-ring' | 'scale-check'
  // Funky scale
  | 'twist' | 'squash' | 'jelly' | 'pop-rotate' | 'skew'
  | 'heartbeat-scale' | 'drop' | 'burst' | 'spiral-scale' | 'zigzag'
  // Mandalas
  | 'round' | 'square-mandala' | 'diamond-mandala' | 'cross' | 'x-diagonal'
  | 'star-burst' | 'petal' | 'snowflake' | 'gear' | 'kaleido' | 'spiral-mandala'
  | 'pulse-square' | 'check-mandala' | 'octagon' | 'lotus'
  // Geometric masks ported from the dot-matrix pattern set
  | 'outline' | 'rings' | 'rose'
  // Compiled brightness fields (engine/) — per-dot curve shapes
  | 'front-sweep' | 'ripple-echo' | 'pulse-beat' | 'lumen-bloom'
  | 'raindrop' | 'pendulum' | 'firefly' | 'halo'
  // New patterns
  | 'sonar' | 'pinwheel' | 'domino' | 'corners' | 'frame'
  // Ported from the dot-matrix reference
  | 'neon-drift' | 'core-spiral' | 'twin-orbit' | 'prism-sweep'
  | 'flux-columns' | 'echo-ring' | 'origin-wave';

/** Grid is a fixed 5x5 matrix — 25 pixels. */
export const GRID = 5;
export const CELLS = GRID * GRID;

export interface LoaderProps {
  /** Which loader to display */
  name: LoaderName;
  /** Override the animation color (hex or any CSS color value) */
  color?: string;
  /** Total width/height of the whole matrix in px — not the dot. Default: 24 */
  size?: number;
  /** Size of one dot in px. Default: 3 */
  dotSize?: number;
  /**
   * Fix the gap between dots explicitly, in px. When set, `size` is ignored and
   * the matrix grows to fit. Leave unset to let the gap be derived from `size`,
   * which keeps the footprint fixed and the dot-to-gap ratio consistent.
   */
  cellPadding?: number;
  /** Animation speed multiplier. 1 = normal, 2 = twice as fast. Default: 1 */
  speed?: number;
  /** Extra CSS class on the wrapper */
  className?: string;
  /** Extra inline styles on the wrapper */
  style?: CSSProperties;
}

// ---- Internal types ----

export type DelayFn = (x: number, y: number, i: number) => number;

export interface ProceduralDef {
  kind: 'procedural';
  name: string;
  animName: string;
  easing: string;
  duration: number;
  delay: DelayFn;
  skipOnNine?: boolean; // pixels with delay 999 get animation:none
  /** True when the keyframe scales, so the grid needs a static placeholder behind each dot. */
  placeholder?: boolean;
}

/**
 * A field compiled ahead of time into per-dot easing curves.
 *
 * Unlike ProceduralDef — where every dot shares one keyframe and only the delay
 * differs — each dot here may reference a differently *shaped* curve, which is
 * what makes position-dependent brightness expressible.
 */
export interface CompiledDef {
  kind: 'compiled';
  name: string;
  slug: string;
  duration: number;
  /** d = element-level (opacity+scale) rule index, g = glow rule index or -1. */
  dots: { d: number; g: number; offset: number }[];
}

export type LoaderDef = ProceduralDef | CompiledDef;
