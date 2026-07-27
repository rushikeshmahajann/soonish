import { GRID } from './types';

export interface MatrixLayout {
  /** Space between adjacent dots, in px. */
  gap: number;
  /** Total width/height of the matrix, in px. */
  matrixSpan: number;
}

/**
 * Resolve dot spacing for a GRID x GRID matrix.
 *
 * Two modes:
 *
 * 1. **Span-driven (default).** You give a target `size` and a `dotSize`; the gap
 *    absorbs whatever is left over, keeping the dot-to-gap ratio stable across
 *    sizes. `size` is a budget — the returned span is the largest whole-pixel
 *    layout that fits inside it.
 *
 * 2. **Gap-driven.** Pass `cellPadding` to fix the gap explicitly; the span is
 *    then derived from dots + padding and the footprint grows with the dots.
 *
 * Mode 1 is what makes the dots read as separate dots: at `size=24, dotSize=3`
 * the gap works out to 2, so each dot covers ~60% of its cell pitch. Specifying
 * a tiny fixed gap instead pushes coverage toward 90%, where the grid reads as a
 * solid block and per-pixel animation stops being legible.
 */
export function getMatrix5Layout(
  size: number,
  dotSize: number,
  cellPadding?: number,
): MatrixLayout {
  const n = GRID;
  if (cellPadding != null) {
    const gap = Math.max(0, cellPadding);
    return { gap, matrixSpan: dotSize * n + gap * (n - 1) };
  }
  const gap = Math.max(1, Math.floor((size - dotSize * n) / (n - 1)));

  // Span is the exact content width, NOT the requested `size`.
  //
  // The gap is floored, so dots + gaps rarely add up to `size` exactly. Padding
  // the difference out to `size` and centring would split an odd remainder into
  // half-pixel offsets (40px box, 37px content -> 1.5px a side), landing every
  // dot on a fractional boundary. The browser then antialiases each one and
  // rounds them inconsistently, so identical 3px gaps *render* unequal.
  //
  // Treating `size` as a budget and reporting the true span keeps every edge on
  // a whole pixel. Actual span is therefore <= size.
  return { gap, matrixSpan: dotSize * n + gap * (n - 1) };
}
