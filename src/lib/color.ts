// oklch() → sRGB, for the few places that need real channel values rather
// than a CSS colour string: OGL's Color (PixelBlast), the MicroSlats shader
// uniforms, and next/og's ImageResponse (Satori), none of which parse oklch.
// Every colour in the product is authored as oklch; this is the one bridge
// back to numbers. Matches the CSS Color 4 reference conversion (Björn
// Ottosson's OKLab matrices), with sRGB clipping at the end.

export type Rgba = [r: number, g: number, b: number, a: number];

const OKLCH_RE =
  /^\s*oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+)(?:deg)?\s*(?:\/\s*([\d.]+)(%?)\s*)?\)\s*$/i;

const linearToSrgb = (c: number) =>
  c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;

/** Parses an oklch() string to sRGB channels in 0–1. Returns null for anything else. */
export function parseOklch(value: string): Rgba | null {
  const m = OKLCH_RE.exec(value);
  if (!m) return null;
  const L = Number(m[1]) / (m[2] ? 100 : 1);
  const C = Number(m[3]);
  const H = (Number(m[4]) * Math.PI) / 180;
  const alpha = m[5] === undefined ? 1 : Number(m[5]) / (m[6] ? 100 : 1);

  const a = C * Math.cos(H);
  const b = C * Math.sin(H);

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3;
  const mm = m_ ** 3;
  const s = s_ ** 3;

  const r = 4.0767416621 * l - 3.3077115913 * mm + 0.2309699292 * s;
  const g = -1.2684380046 * l + 2.6097574011 * mm - 0.3413193965 * s;
  const bl = -0.0041960863 * l - 0.7034186147 * mm + 1.707614701 * s;

  const clip = (c: number) => Math.min(1, Math.max(0, linearToSrgb(Math.min(1, Math.max(0, c)))));
  return [clip(r), clip(g), clip(bl), alpha];
}

/** oklch() → "#rrggbb" (alpha dropped), for libraries that only read hex. */
export function oklchToHex(value: string): string {
  const rgb = parseOklch(value);
  if (!rgb) throw new Error(`Expected an oklch() colour, got ${JSON.stringify(value)}`);
  return "#" + rgb.slice(0, 3).map((c) => Math.round(c * 255).toString(16).padStart(2, "0")).join("");
}

/** oklch() → "rgba(r, g, b, a)", with an optional alpha override. */
export function oklchToRgba(value: string, alpha?: number): string {
  const rgb = parseOklch(value);
  if (!rgb) throw new Error(`Expected an oklch() colour, got ${JSON.stringify(value)}`);
  const [r, g, b, a] = rgb;
  return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${alpha ?? a})`;
}
