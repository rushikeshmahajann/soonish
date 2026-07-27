import React, { useEffect, type CSSProperties } from 'react';
import { injectCSS } from './css';
import { LOADER_REGISTRY } from './data/loaders';
import { GRID, CELLS } from './types';
import { getMatrix5Layout } from './layout';
import type { LoaderProps, ProceduralDef } from './types';

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
      className={`hl-matrix${className ? ` ${className}` : ''}`}
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
          <div
            key={i}
            className="hl-px"
            style={
              skip
                ? { animation: 'none', background: 'rgba(255,255,255,0.04)' }
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
  useEffect(() => { injectCSS(); }, []);

  const slug = name.toLowerCase();
  const def = LOADER_REGISTRY[slug];
  if (!def) return null;

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
