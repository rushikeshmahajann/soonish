import { GRID, CELLS } from '../types';
import { clamp01, type Field, type MultiField, type Channel } from './field';

/** Channels a dot can animate independently. Each maps to its own keyframe. */
export const CHANNELS: Channel[] = ['o', 'g', 's'];

const CHANNEL_KEYFRAME: Record<Channel, string> = {
  o: 'hl-field',
  g: 'hl-field-glow',
  s: 'hl-field-scale',
};

export interface CompiledDot {
  /**
   * Index into `combos` — the element-level (opacity, scale) pairing.
   *
   * These two MUST be emitted as one rule with comma-separated animation lists.
   * Two rules each setting `animation-name` on the same element do not combine;
   * the later one silently wins and the other channel never animates.
   */
  d: number;
  /** Glow curve index, or -1. Safe as its own rule: it targets ::after. */
  g: number;
  /** Fraction of the loop to offset by, in [0, 1). Shared across channels. */
  offset: number;
}

/** A unique element-level channel pairing. -1 means that channel is static. */
export interface Combo {
  o: number;
  s: number;
}

export interface CompiledField {
  name: string;
  slug: string;
  duration: number;
  /** Unique curves per channel. */
  curves: Record<Channel, number[][]>;
  /** Unique (opacity, scale) pairings, one emitted rule each. */
  combos: Combo[];
  dots: CompiledDot[];
}

/** Round hard enough that float noise does not defeat deduplication. */
const q = (v: number) => Math.round(clamp01(v) * 1000) / 1000;

const key = (curve: number[]) => curve.join(',');

/** Read a closed curve at a continuous loop position, interpolating between samples. */
function sampleAt(curve: number[], phase: number): number {
  const n = curve.length - 1;
  const p = ((phase % 1) + 1) % 1;
  const f = p * n;
  const i = Math.floor(f);
  const frac = f - i;
  const a = curve[i % n];
  const b = curve[(i + 1) % n];
  return a + (b - a) * frac;
}

/**
 * Find a phase offset at which `candidate` reproduces `target`, or null.
 *
 * Integer-rotation matching only works when the true offset lands on a sample
 * boundary. A field offsetting by `x/5` is 7.2 samples at K=36 — never integral —
 * so a one-curve field used to compile to five. Searching sub-sample offsets fixes it.
 */
function findPhaseMatch(candidate: number[], target: number[], eps = 0.02): number | null {
  const n = target.length - 1;
  const steps = n * 8;
  let best: { offset: number; err: number } | null = null;
  for (let s = 0; s < steps; s++) {
    const offset = s / steps;
    let err = 0;
    for (let i = 0; i < n && err <= eps; i++) {
      err = Math.max(err, Math.abs(sampleAt(candidate, i / n + offset) - target[i]));
    }
    if (err <= eps && (best === null || err < best.err)) best = { offset, err };
  }
  return best ? best.offset : null;
}

/** True when a channel never leaves its resting value, so it needs no animation. */
const isFlat = (curve: number[]) => curve.every((v) => v === curve[0]);

/**
 * Sample a multi-channel field into per-dot curves, deduplicating within each
 * channel on two axes: exact equality, and equality under a phase offset.
 *
 * Channels are compiled independently, so a dot's opacity, glow and scale can
 * each follow a differently shaped curve — the thing a single shared keyframe
 * plus animation-delay cannot express.
 */
export function compileField(
  name: string,
  slug: string,
  field: Field | MultiField,
  opts: { duration: number; samples?: number },
): CompiledField {
  const samples = opts.samples ?? 36;
  const curves: Record<Channel, number[][]> = { o: [], g: [], s: [] };
  const byKey: Record<Channel, Map<string, number>> = { o: new Map(), g: new Map(), s: new Map() };
  const combos: Combo[] = [];
  const comboIndex = new Map<string, number>();
  const dots: CompiledDot[] = [];

  // Normalise a plain Field (returns a number) to the multi-channel shape.
  const evaluate = (x: number, y: number, t: number): Partial<Record<Channel, number>> => {
    const v = (field as MultiField)(x, y, t);
    return typeof v === 'number' ? { o: v } : v;
  };

  for (let i = 0; i < CELLS; i++) {
    const x = i % GRID;
    const y = Math.floor(i / GRID);

    const raw: Record<Channel, number[] | null> = { o: null, g: null, s: null };
    for (const ch of CHANNELS) {
      const series: number[] = [];
      let present = false;
      for (let s = 0; s <= samples; s++) {
        const out = evaluate(x, y, s / samples);
        if (out[ch] !== undefined) present = true;
        series.push(q(out[ch] ?? 0));
      }
      series[series.length - 1] = series[0];
      // A channel the field never sets, or one that never moves, is skipped —
      // no wasted animation on the element.
      raw[ch] = present && !isFlat(series) ? series : null;
    }

    const chosen: Record<Channel, number> = { o: -1, g: -1, s: -1 };
    let offset = 0;
    let offsetSet = false;

    for (const ch of CHANNELS) {
      const series = raw[ch];
      if (!series) continue;

      const exact = byKey[ch].get(key(series));
      if (exact !== undefined) {
        chosen[ch] = exact;
        continue;
      }

      let matched = false;
      for (let ci = 0; ci < curves[ch].length; ci++) {
        const found = findPhaseMatch(curves[ch][ci], series);
        // One offset is shared across a dot's channels (they animate in lockstep),
        // so only reuse a rotated curve if it agrees with the offset already set.
        if (found !== null && (!offsetSet || Math.abs(found - offset) < 1e-6)) {
          chosen[ch] = ci;
          offset = found;
          offsetSet = true;
          matched = true;
          break;
        }
      }
      if (matched) continue;

      const idx = curves[ch].length;
      curves[ch].push(series);
      byKey[ch].set(key(series), idx);
      chosen[ch] = idx;
    }

    const comboKey = `${chosen.o}|${chosen.s}`;
    let d = comboIndex.get(comboKey);
    if (d === undefined) {
      d = combos.length;
      combos.push({ o: chosen.o, s: chosen.s });
      comboIndex.set(comboKey, d);
    }

    dots.push({ d, g: chosen.g, offset });
  }

  return { name, slug, duration: opts.duration, curves, combos, dots };
}

/**
 * Emit CSS for a compiled field.
 *
 * Each channel becomes its own animation with its own `linear()` timing function.
 * Glow targets the ::after pseudo-element so the shadow itself never re-renders —
 * only a pre-painted layer's opacity changes.
 */
export function emitCSS(compiled: CompiledField): string {
  const { slug, curves, combos } = compiled;
  const lines: string[] = [];
  const total = CHANNELS.reduce((n, ch) => n + curves[ch].length, 0);
  lines.push(
    `/* ${compiled.name} — ${total} curve(s), ${combos.length} element rule(s), ${curves.g.length} glow rule(s) */`,
  );

  // Element-level channels in ONE declaration each. Duration and delay come from
  // custom properties set inline on the dot; ::after inherits them, which inline
  // styles cannot reach.
  combos.forEach((combo, k) => {
    const parts: { keyframe: string; curve: number[] }[] = [];
    if (combo.o >= 0) parts.push({ keyframe: CHANNEL_KEYFRAME.o, curve: curves.o[combo.o] });
    if (combo.s >= 0) parts.push({ keyframe: CHANNEL_KEYFRAME.s, curve: curves.s[combo.s] });
    if (!parts.length) return;
    const n = parts.length;
    lines.push(
      `.hl-f-${slug} .hl-d${k} { ` +
        `animation-name: ${parts.map((p) => p.keyframe).join(',')}; ` +
        `animation-duration: ${Array(n).fill('var(--hl-dur)').join(',')}; ` +
        `animation-delay: ${Array(n).fill('var(--hl-delay,0s)').join(',')}; ` +
        `animation-iteration-count: ${Array(n).fill('infinite').join(',')}; ` +
        `animation-fill-mode: ${Array(n).fill('both').join(',')}; ` +
        `animation-timing-function: ${parts.map((p) => `linear(${p.curve.join(',')})`).join(',')}; }`,
    );
  });

  // Glow is its own rule because it targets ::after — no conflict possible.
  curves.g.forEach((curve, i) => {
    lines.push(
      `.hl-f-${slug} .hl-g${i}::after { animation-name: ${CHANNEL_KEYFRAME.g}; ` +
        `animation-duration: var(--hl-dur); animation-delay: var(--hl-delay,0s); ` +
        `animation-iteration-count: infinite; animation-fill-mode: both; ` +
        `animation-timing-function: linear(${curve.join(',')}); }`,
    );
  });

  return lines.join('\n');
}
