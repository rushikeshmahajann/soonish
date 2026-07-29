import React, { type CSSProperties } from 'react';
import { LOADER_REGISTRY } from './data/loaders';
// Static stylesheets. The bundler extracts these into a real <link>, so styles
// land before first paint and no JS is needed to apply them. This is also what
// keeps Loader free of hooks — and therefore usable as a Server Component.
import './styles/base.css';
import './styles/fields.generated.css';
import { GRID, CELLS } from './types';
import { getMatrix5Layout } from './layout';
import type { LoaderProps, ProceduralDef, CompiledDef } from './types';

const DEFAULT_ANIMATION_COLORS: Record<string, string> = {
  'pg-rain-fade': '#bee8dc',
  'pg-think': '#c9d0f4',
  'pg-search': '#bfe7df',
  'pg-find': '#d7e9bd',
  'pg-consolidate': '#edcfaa',
  'pg-stream': '#bee8dc',
  'pg-reason': '#edc8cf',
  'pg-index': '#eee5b7',
  'pg-connect': '#bfe7df',
  'pg-generate': '#e7c6df',
  'pg-reflect': '#c9d0f4',
  'pg-mandala-round': '#bfe7df',
  'pg-mandala-square': '#e7c6df',
  'pg-mandala-diamond': '#c9d0f4',
  'pg-mandala-cross': '#eee5b7',
  'pg-mandala-x': '#edc8cf',
  'pg-mandala-star': '#edcfaa',
  'pg-mandala-petal': '#edc8cf',
  'pg-mandala-snow': '#bfe7df',
  'pg-mandala-gear': '#bee8dc',
  'pg-mandala-kaleido': '#bfe7df',
  'pg-mandala-spiral': '#c9d0f4',
  'pg-mandala-pulse': '#edcfaa',
  'pg-mandala-checker': '#bee8dc',
  'pg-mandala-oct': '#eee5b7',
  'pg-mandala-lotus': '#edc8cf',
  'pg-scale-cyan': '#bfe7df',
  'pg-scale-magenta': '#e7c6df',
  'pg-scale-violet': '#c9d0f4',
  'pg-scale-amber': '#edcfaa',
  'pg-scale-mint': '#bee8dc',
  'pg-scale-pink': '#edc8cf',
  'pg-twist': '#bfe7df',
  'pg-squash': '#e7c6df',
  'pg-jelly': '#c9d0f4',
  'pg-pop-rotate': '#edcfaa',
  'pg-skew': '#bee8dc',
  'pg-heartbeat': '#edc8cf',
  'pg-drop': '#bfe7df',
  'pg-burst': '#eee5b7',
  'pg-spiral': '#c9d0f4',
  'pg-zigzag': '#e7c6df',
  'pg-pulse-cyan': '#bfe7df',
  'pg-pulse-magenta': '#e7c6df',
  'pg-pulse-violet': '#c9d0f4',
  'pg-pulse-mint': '#bee8dc',
  'pg-pulse-pink': '#edc8cf',
  'pg-pulse-lime': '#d7e9bd',
  'pg-pulse-amber': '#edcfaa',
  'pg-pulse-yellow': '#eee5b7',
  'pg-plasma': '#bfe7df',
};

// ---- Procedural loader ----
function ProceduralLoader({
  def, size, dotSize, cellPadding, speed, color, className, style,
}: { def: ProceduralDef; size: number; dotSize: number; cellPadding?: number; speed: number; color?: string; className?: string; style?: CSSProperties }) {
  const duration = def.duration / speed;
  const { gap, matrixSpan } = getMatrix5Layout(size, dotSize, cellPadding);

  const colorVars: Record<string, string> = {};
  colorVars['--loader-color'] = color ?? DEFAULT_ANIMATION_COLORS[def.animName] ?? '#bfe7df';

  return (
    <div
      className={`hl-matrix${def.placeholder ? ' hl-ph' : ''}${className ? ` ${className}` : ''}`}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${GRID}, ${dotSize}px)`,
        gridTemplateRows: `repeat(${GRID}, ${dotSize}px)`,
        gap: `${gap}px`,
        // Span-driven mode leaves a few px of slack when the gap rounds down;
        // centring the tracks keeps the matrix optically centred in its box.
        width: `${matrixSpan}px`,
        height: `${matrixSpan}px`,
        justifyContent: 'center',
        alignContent: 'center',
        ...colorVars,
        ...style,
      } as CSSProperties}
    >
      {Array.from({ length: CELLS }, (_, i) => {
        const x = i % GRID;
        const y = Math.floor(i / GRID);
        const delay = def.delay(x, y, i);
        const skip = def.skipOnNine && delay === 999;

        return (
          <div key={i} className="hl-cell">
            <div
              className="hl-px"
              style={
                skip
                  ? // A masked pixel never lights. Where a placeholder is drawn
                    // it supplies the dim square, so the dot itself is hidden to
                    // avoid stacking two dim layers; otherwise the dot keeps its
                    // own resting look so the grid still reads as 25 lamps.
                    def.placeholder
                    ? { animation: 'none', opacity: 0 }
                    : { animation: 'none' }
                  : {
                      animationName: def.animName,
                      animationDuration: `${duration}s`,
                      animationDelay: `${delay}s`,
                      animationTimingFunction: def.easing,
                      animationIterationCount: 'infinite',
                      animationFillMode: 'none',
                    }
              }
            />
          </div>
        );
      })}
    </div>
  );
}

// ---- Compiled-field loader ----
// Each dot points at a pre-sampled `linear()` easing curve. Dots may reference
// *differently shaped* curves, which is what a shared keyframe plus delay can't
// express. Still one CSS animation per dot, still entirely on the compositor.
function CompiledLoader({
  def, size, dotSize, cellPadding, speed, color, className, style,
}: { def: CompiledDef; size: number; dotSize: number; cellPadding?: number; speed: number; color?: string; className?: string; style?: CSSProperties }) {
  const { gap, matrixSpan } = getMatrix5Layout(size, dotSize, cellPadding);
  const duration = def.duration / speed;

  return (
    <div
      // Always placeholdered. Compiled curves are driven by `hl-field`, which
      // ramps from opacity 0, so a dot at the bottom of its curve is fully
      // invisible — unlike procedural keyframes, which floor at 0.16. Without a
      // placeholder the grid vanishes wherever the field is dark.
      className={`hl-matrix hl-ph hl-f-${def.slug}${className ? ` ${className}` : ''}`}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${GRID}, ${dotSize}px)`,
        gridTemplateRows: `repeat(${GRID}, ${dotSize}px)`,
        gap: `${gap}px`,
        width: `${matrixSpan}px`,
        height: `${matrixSpan}px`,
        justifyContent: 'center',
        alignContent: 'center',
        '--loader-color': color ?? '#bfe7df',
        ...style,
      } as CSSProperties}
    >
      {def.dots.map((d, i) => {
        // hl-d* carries opacity+scale in a single rule (two animation-name
        // declarations on one element would override rather than combine).
        // hl-g* is separate because it targets ::after.
        const cls = ['hl-px', `hl-d${d.d}`];
        if (d.g >= 0) cls.push(`hl-g${d.g}`);
        return (
          <div key={i} className="hl-cell">
            <div
              className={cls.join(' ')}
              style={{
                // Custom properties rather than animation-* directly: the glow
                // channel animates ::after, which inline styles cannot target,
                // but which inherits these.
                '--hl-dur': `${duration}s`,
                // Negative delay seeks into the loop, so a phase-shifted curve
                // reuses a sibling's easing instead of needing its own.
                '--hl-delay': `${(-d.offset * duration).toFixed(3)}s`,
              } as CSSProperties}
            />
          </div>
        );
      })}
    </div>
  );
}

// ---- Main export ----
export function Loader({
  name,
  color,
  size = 24,
  dotSize = 3,
  cellPadding,
  speed = 1,
  className,
  style,
}: LoaderProps) {
  const slug = name.toLowerCase();
  const def = LOADER_REGISTRY[slug];
  if (!def) return null;

  if (def.kind === 'compiled') {
    return (
      <CompiledLoader
        def={def}
        size={size}
        dotSize={dotSize}
        cellPadding={cellPadding}
        speed={speed}
        color={color}
        className={className}
        style={style}
      />
    );
  }

  return (
    <ProceduralLoader
      def={def}
      size={size}
      dotSize={dotSize}
      cellPadding={cellPadding}
      speed={speed}
      color={color}
      className={className}
      style={style}
    />
  );
}
