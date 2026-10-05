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
  'pg-rain-fade': 'oklch(0.898 0.047 175.965)',
  'pg-think': 'oklch(0.864 0.05 276.62)',
  'pg-search': 'oklch(0.897 0.043 181.815)',
  'pg-find': 'oklch(0.909 0.061 125.704)',
  'pg-consolidate': 'oklch(0.871 0.059 72.741)',
  'pg-stream': 'oklch(0.898 0.047 175.965)',
  'pg-reason': 'oklch(0.866 0.043 5.208)',
  'pg-index': 'oklch(0.918 0.061 98.216)',
  'pg-connect': 'oklch(0.897 0.043 181.815)',
  'pg-generate': 'oklch(0.862 0.05 334.509)',
  'pg-reflect': 'oklch(0.864 0.05 276.62)',
  'pg-mandala-round': 'oklch(0.897 0.043 181.815)',
  'pg-mandala-square': 'oklch(0.862 0.05 334.509)',
  'pg-mandala-diamond': 'oklch(0.864 0.05 276.62)',
  'pg-mandala-cross': 'oklch(0.918 0.061 98.216)',
  'pg-mandala-x': 'oklch(0.866 0.043 5.208)',
  'pg-mandala-star': 'oklch(0.871 0.059 72.741)',
  'pg-mandala-petal': 'oklch(0.866 0.043 5.208)',
  'pg-mandala-snow': 'oklch(0.897 0.043 181.815)',
  'pg-mandala-gear': 'oklch(0.898 0.047 175.965)',
  'pg-mandala-kaleido': 'oklch(0.897 0.043 181.815)',
  'pg-mandala-spiral': 'oklch(0.864 0.05 276.62)',
  'pg-mandala-pulse': 'oklch(0.871 0.059 72.741)',
  'pg-mandala-checker': 'oklch(0.898 0.047 175.965)',
  'pg-mandala-oct': 'oklch(0.918 0.061 98.216)',
  'pg-mandala-lotus': 'oklch(0.866 0.043 5.208)',
  'pg-scale-cyan': 'oklch(0.897 0.043 181.815)',
  'pg-scale-magenta': 'oklch(0.862 0.05 334.509)',
  'pg-scale-violet': 'oklch(0.864 0.05 276.62)',
  'pg-scale-amber': 'oklch(0.871 0.059 72.741)',
  'pg-scale-mint': 'oklch(0.898 0.047 175.965)',
  'pg-scale-pink': 'oklch(0.866 0.043 5.208)',
  'pg-twist': 'oklch(0.897 0.043 181.815)',
  'pg-squash': 'oklch(0.862 0.05 334.509)',
  'pg-jelly': 'oklch(0.864 0.05 276.62)',
  'pg-pop-rotate': 'oklch(0.871 0.059 72.741)',
  'pg-skew': 'oklch(0.898 0.047 175.965)',
  'pg-heartbeat': 'oklch(0.866 0.043 5.208)',
  'pg-drop': 'oklch(0.897 0.043 181.815)',
  'pg-burst': 'oklch(0.918 0.061 98.216)',
  'pg-spiral': 'oklch(0.864 0.05 276.62)',
  'pg-zigzag': 'oklch(0.862 0.05 334.509)',
  'pg-pulse-cyan': 'oklch(0.897 0.043 181.815)',
  'pg-pulse-magenta': 'oklch(0.862 0.05 334.509)',
  'pg-pulse-violet': 'oklch(0.864 0.05 276.62)',
  'pg-pulse-mint': 'oklch(0.898 0.047 175.965)',
  'pg-pulse-pink': 'oklch(0.866 0.043 5.208)',
  'pg-pulse-lime': 'oklch(0.909 0.061 125.704)',
  'pg-pulse-amber': 'oklch(0.871 0.059 72.741)',
  'pg-pulse-yellow': 'oklch(0.918 0.061 98.216)',
  'pg-plasma': 'oklch(0.897 0.043 181.815)',
};

// ---- Procedural loader ----
function ProceduralLoader({
  def, size, dotSize, cellPadding, speed, color, className, style,
}: { def: ProceduralDef; size: number; dotSize: number; cellPadding?: number; speed: number; color?: string; className?: string; style?: CSSProperties }) {
  const duration = def.duration / speed;
  const { gap, matrixSpan } = getMatrix5Layout(size, dotSize, cellPadding);

  const colorVars: Record<string, string> = {};
  colorVars['--loader-color'] = color ?? DEFAULT_ANIMATION_COLORS[def.animName] ?? 'oklch(0.897 0.043 181.815)';

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
        '--loader-color': color ?? 'oklch(0.897 0.043 181.815)',
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
