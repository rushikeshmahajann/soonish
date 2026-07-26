import type { CSSProperties } from 'react';

export type LoaderName =
  // Pulse wave loaders
  | 'sweep' | 'diagonal' | 'ripple' | 'rain' | 'spiral' | 'snake'
  | 'sparkle' | 'heartbeat' | 'scanner' | 'orbit' | 'breathe' | 'checker'
  | 'stripes' | 'falling' | 'plasma' | 'loadbar' | 'knight-tour' | 'hilbert'
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
  // Emoji sprites
  | 'smiley' | 'heart' | 'star' | 'fire' | 'robot' | 'ghost' | 'lightning'
  | 'diamond' | 'skull' | 'pacman' | 'mushroom' | 'crown' | 'rocket'
  | 'coin' | 'bomb' | 'wave' | 'cat' | 'bug' | 'battery' | 'bell'
  // Mandalas
  | 'round' | 'square-mandala' | 'diamond-mandala' | 'cross' | 'x-diagonal'
  | 'star-burst' | 'petal' | 'snowflake' | 'gear' | 'kaleido' | 'spiral-mandala'
  | 'pulse-square' | 'check-mandala' | 'octagon' | 'lotus'
  // Story loaders
  | 'mountain' | 'fishing' | 'treadmill' | 'chef' | 'plant' | 'astronaut'
  // Communication
  | 'envelope' | 'bubble' | 'phone' | 'bell-swing' | 'at';

export interface LoaderProps {
  /** Which loader to display */
  name: LoaderName;
  /** Override the animation color (hex or any CSS color value) */
  color?: string;
  /** Pixel size in px. Default: 12 */
  size?: number;
  /** Gap between pixels in px. Default: 2 */
  gap?: number;
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
}

export interface SpriteDef {
  kind: 'sprite';
  name: string;
  matrixAnim: string;   // sprite-breathe | sprite-blink | sprite-spin | sprite-bounce | sprite-flash
  matrixDuration: number; // duration of the matrix-level animation
  map: string[];
  colors: Record<string, string>;
  blinkChar?: string;
  detailChar?: string;
}

export interface StoryDef {
  kind: 'story';
  name: string;
  duration: number;     // total loop duration in seconds
  frames: string[][];
  palette: Record<string, string>;
}

export type LoaderDef = ProceduralDef | SpriteDef | StoryDef;
