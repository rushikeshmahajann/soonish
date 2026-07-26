import React, { useEffect, useRef, type CSSProperties } from 'react';
import { injectCSS } from './css';
import { LOADER_REGISTRY } from './data/loaders';
import type { LoaderProps, ProceduralDef, SpriteDef, StoryDef } from './types';

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

// ---- Story frame renderer (pure, no React) ----
function applyFrame(
  pixels: (HTMLDivElement | null)[],
  frame: string[],
  palette: Record<string, string>,
) {
  for (let y = 0; y < 8; y++) {
    const row = frame[y] ?? '........';
    for (let x = 0; x < 8; x++) {
      const ch = row[x] ?? '.';
      const px = pixels[y * 8 + x];
      if (!px) continue;
      if (ch === '.' || !palette[ch]) {
        px.classList.remove('on');
        px.style.removeProperty('--c');
      } else {
        px.classList.add('on');
        px.style.setProperty('--c', palette[ch]);
      }
    }
  }
}

// ---- Story loader ----
function StoryLoader({
  def, size, gap, speed, className, style,
}: { def: StoryDef; size: number; gap: number; speed: number; className?: string; style?: CSSProperties }) {
  const pixelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const frameRef = useRef(0);

  useEffect(() => {
    applyFrame(pixelRefs.current, def.frames[0], def.palette);
    const ms = Math.max(160, (def.duration * 1000) / def.frames.length / speed);
    const id = setInterval(() => {
      if (document.hidden) return;
      frameRef.current = (frameRef.current + 1) % def.frames.length;
      applyFrame(pixelRefs.current, def.frames[frameRef.current], def.palette);
    }, ms);
    return () => clearInterval(id);
  }, [def, speed]);

  return (
    <div
      className={`hl-matrix sprite story${className ? ` ${className}` : ''}`}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(8, ${size}px)`,
        gridTemplateRows: `repeat(8, ${size}px)`,
        gap: `${gap}px`,
        ...style,
      } as CSSProperties}
    >
      {Array.from({ length: 64 }, (_, i) => (
        <div
          key={i}
          className="hl-px"
          ref={(el) => { pixelRefs.current[i] = el; }}
        />
      ))}
    </div>
  );
}

// ---- Sprite loader ----
function SpriteLoader({
  def, size, gap, speed, className, style,
}: { def: SpriteDef; size: number; gap: number; speed: number; className?: string; style?: CSSProperties }) {
  const actualDuration = def.matrixDuration / speed;

  return (
    <div
      className={`hl-matrix sprite${className ? ` ${className}` : ''}`}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(8, ${size}px)`,
        gridTemplateRows: `repeat(8, ${size}px)`,
        gap: `${gap}px`,
        animationName: def.matrixAnim,
        animationDuration: `${actualDuration}s`,
        animationTimingFunction: 'ease-in-out',
        animationIterationCount: 'infinite',
        ...style,
      } as CSSProperties}
    >
      {Array.from({ length: 64 }, (_, i) => {
        const x = i % 8;
        const y = Math.floor(i / 8);
        const ch = def.map[y]?.[x] ?? '.';
        const color = ch !== '.' ? def.colors[ch] : undefined;
        const isBlink = color && def.blinkChar && ch === def.blinkChar;
        const isDetail = color && def.detailChar && ch === def.detailChar;

        const classes = ['hl-px'];
        if (color) classes.push('on');
        if (isBlink) classes.push('blink-eye');
        else if (isDetail) classes.push('detail');

        const pxStyle: CSSProperties = {};
        if (color) (pxStyle as Record<string, string>)['--c'] = color;
        if (isDetail) pxStyle.animationDelay = `${(x * 0.05 + y * 0.07).toFixed(2)}s`;
        else if (color && !isBlink) pxStyle.animationDelay = `${((x + y) * 0.08).toFixed(2)}s`;

        return <div key={i} className={classes.join(' ')} style={pxStyle} />;
      })}
    </div>
  );
}

// ---- Procedural loader ----
function ProceduralLoader({
  def, size, gap, speed, color, className, style,
}: { def: ProceduralDef; size: number; gap: number; speed: number; color?: string; className?: string; style?: CSSProperties }) {
  const duration = def.duration / speed;

  const colorVars: Record<string, string> = {};
  colorVars['--loader-color'] = color ?? DEFAULT_ANIMATION_COLORS[def.animName] ?? '#bfe7df';

  return (
    <div
      className={`hl-matrix${className ? ` ${className}` : ''}`}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(8, ${size}px)`,
        gridTemplateRows: `repeat(8, ${size}px)`,
        gap: `${gap}px`,
        ...colorVars,
        ...style,
      } as CSSProperties}
    >
      {Array.from({ length: 64 }, (_, i) => {
        const x = i % 8;
        const y = Math.floor(i / 8);
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
  size = 7,
  gap = 1,
  speed = 1,
  className,
  style,
}: LoaderProps) {
  useEffect(() => { injectCSS(); }, []);

  const slug = name.toLowerCase();
  const def = LOADER_REGISTRY[slug];
  if (!def) return null;

  if (def.kind === 'story') {
    return <StoryLoader def={def} size={size} gap={gap} speed={speed} className={className} style={style} />;
  }
  if (def.kind === 'sprite') {
    return <SpriteLoader def={def} size={size} gap={gap} speed={speed} className={className} style={style} />;
  }
  return <ProceduralLoader def={def} size={size} gap={gap} speed={speed} color={color} className={className} style={style} />;
}
