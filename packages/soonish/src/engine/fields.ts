import { beat, C, euclidean, gauss, oscillatingFront, radialEcho, smoothstep01, type Field, type MultiField } from './field';

export interface FieldSpec {
  name: string;
  slug: string;
  duration: number;
  field: Field | MultiField;
}

/**
 * Fields that the `delay(x,y,i)` model cannot express.
 *
 * That model gives every dot the *same* curve at a different offset. Each field
 * below produces a genuinely different curve shape per dot, so no amount of
 * `animation-delay` reproduces it.
 */
export const FIELDS: FieldSpec[] = [
  {
    name: 'Front Sweep',
    slug: 'front-sweep',
    duration: 2.4,
    // Reverses direction, so centre dots are crossed twice per cycle at even
    // spacing while edge dots are crossed once and dwell at the turnaround.
    field: oscillatingFront({ axis: 'x', sigma: 0.85 }),
  },
  {
    name: 'Ripple Echo',
    slug: 'ripple-echo',
    duration: 2.8,
    // Two rings a half-cycle apart. The gap between a dot's two hits depends on
    // its radius, so inner and outer dots need different curves.
    field: radialEcho({ rings: 2, sigma: 0.5 }),
  },
  {
    name: 'Pulse Beat',
    slug: 'pulse-beat',
    duration: 3.2,
    // Two frequencies whose phases depend on euclidean vs manhattan distance —
    // the interference pattern is unique per dot.
    field: beat({ fastMul: 3 }),
  },
  {
    name: 'Lumen Bloom',
    slug: 'lumen-bloom',
    duration: 3.0,
    // Three channels on independent curves — impossible with one keyframe.
    // Glow lags opacity (a real lamp keeps radiating as it dims) and scale
    // peaks earlier still, so the dot swells, flares, then fades.
    field: (x, y, t): Partial<Record<'o' | 'g' | 's', number>> => {
      const r = euclidean(x, y) / Math.hypot(2, 2);
      const wave = (lag: number) => gauss(((t - r * 0.35 - lag) % 1 + 1) % 1 - 0.5, 0.16);
      return {
        s: smoothstep01(0, 1, wave(-0.04)) * 0.9 + 0.1,
        o: smoothstep01(0, 1, wave(0)),
        g: smoothstep01(0.1, 1, wave(0.07)) * 0.85,
      };
    },
  },
  {
    name: 'Raindrop',
    slug: 'raindrop',
    duration: 2.6,
    // Two separate events per loop: a drop falls down the centre column, then on
    // impact a ripple expands outward. A dot near the centre participates in
    // both; a corner dot only sees the ripple. Different event counts per dot is
    // exactly what a shared keyframe cannot do.
    field: (x, y, t) => {
      const column = gauss(x - C, 0.5);
      const fallT = 0.45;
      // starts above the grid so the curve is ~0 at t=0 and the loop closes clean
      const fall = t < fallT ? gauss(y - (-2 + (t / fallT) * (C + 2)), 0.55) * column : 0;
      const rt = (t - fallT) / (1 - fallT);
      const ripple =
        t >= fallT ? gauss(euclidean(x, y) - rt * Math.hypot(C, C) * 1.2, 0.5) * (1 - rt * 0.55) : 0;
      return Math.max(fall, ripple);
    },
  },
  {
    name: 'Pendulum',
    slug: 'pendulum',
    duration: 2.8,
    // An arm swinging about the centre. Because it reverses, dots near the
    // extremes are dwelt on while dots near the middle are crossed twice per
    // period — genuinely different curve shapes.
    field: (x, y, t) => {
      const r = euclidean(x, y);
      if (r < 0.9) return 0.3; // the pivot stays lit
      const a = Math.atan2(y - C, x - C);
      // +/-75 degrees, so the arc reaches nearly the full width
      const sweep = Math.PI / 2 + (Math.PI * 0.42) * Math.sin(t * Math.PI * 2);
      let d = Math.abs(a - sweep);
      if (d > Math.PI) d = Math.PI * 2 - d;
      return gauss(d, 0.42) * (0.45 + 0.55 * (r / Math.hypot(C, C)));
    },
  },
  {
    name: 'Firefly',
    slug: 'firefly',
    duration: 3.4,
    // Every dot blinks on its own schedule AND for its own duration. Random
    // phase alone would still be one shared curve; random *duty* makes each
    // dot's curve a different shape.
    field: (x, y, t) => {
      const i = y * 5 + x;
      const h = (n: number) => {
        const v = Math.sin(n * 127.1 + i * 311.7) * 43758.5453;
        return v - Math.floor(v);
      };
      const phase = h(1);
      // Quantised to 4 buckets: random phase costs nothing (it dedupes to an
      // offset), but a unique duty per dot would mean 25 unique curve shapes.
      const duty = 0.16 + Math.floor(h(2) * 4) * 0.07;
      const p = ((t - phase) % 1 + 1) % 1;
      if (p > duty) return 0.05;
      const u = p / duty;
      return smoothstep01(0, 0.35, u) * (1 - smoothstep01(0.55, 1, u));
    },
  },
  {
    name: 'Halo',
    slug: 'halo',
    duration: 2.6,
    // A ring expanding outward on all three channels, each offset: scale leads,
    // opacity follows, glow trails. The dot swells, lights, then keeps radiating.
    field: (x, y, t): Partial<Record<'o' | 'g' | 's', number>> => {
      const r = euclidean(x, y) / Math.hypot(2, 2);
      const ring = (lag: number) => {
        const tt = ((t - lag) % 1 + 1) % 1;
        return gauss(tt - r * 0.85, 0.13);
      };
      return {
        s: 0.3 + ring(-0.03) * 0.7,
        o: ring(0),
        g: ring(0.07) * 0.9,
      };
    },
  },
];
