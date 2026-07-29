import type { LoaderDef, ProceduralDef, CompiledDef, DelayFn } from '../types';
import { FIELD_DOTS } from '../engine/generated';
import { GRID } from '../types';

const N = GRID;                        // 5
const C = (N - 1) / 2;                 // 2   — centre coordinate
const MAXR = Math.hypot(C, C);         // 2.83 — max radius from centre
const MAXMAN = C * 2;                  // 4   — max manhattan from centre
const RINGS = Math.floor(N / 2);       // 2   — outermost ring index
const TOTAL = N * N;                   // 25
const BORDER = (N - 1) * 4;            // 16  — pixels on the perimeter

// ---- Path helpers (computed once) ----

function spiralOrder(n: number): number[] {
  const r: number[] = [];
  let t = 0, b = n - 1, l = 0, ri = n - 1;
  while (t <= b && l <= ri) {
    for (let i = l; i <= ri; i++) r.push(t * n + i); t++;
    for (let i = t; i <= b; i++) r.push(i * n + ri); ri--;
    if (t <= b) { for (let i = ri; i >= l; i--) r.push(b * n + i); b--; }
    if (l <= ri) { for (let i = b; i >= t; i--) r.push(i * n + l); l++; }
  }
  return r;
}

// Warnsdorff's rule. A 5x5 board has an open knight's tour from a corner;
// the fallback below keeps the sequence complete if the heuristic dead-ends.
function knightTour(n: number): number[] {
  const mv = [[1,2],[2,1],[2,-1],[1,-2],[-1,-2],[-2,-1],[-2,1],[-1,2]];
  const vis = Array(n * n).fill(false);
  const ord: number[] = [];
  let x = 0, y = 0;
  for (let s = 0; s < n * n; s++) {
    ord.push(y * n + x); vis[y * n + x] = true;
    let best: [number, number] | null = null, bc = 99;
    for (const [dx, dy] of mv) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= n || ny >= n || vis[ny * n + nx]) continue;
      let c = 0;
      for (const [ddx, ddy] of mv) { const ax = nx+ddx, ay = ny+ddy; if (ax>=0&&ay>=0&&ax<n&&ay<n&&!vis[ay*n+ax]) c++; }
      if (c < bc) { bc = c; best = [nx, ny]; }
    }
    if (best) { [x, y] = best; } else { const i = vis.indexOf(false); if (i < 0) break; x = i % n; y = Math.floor(i / n); }
  }
  return ord;
}

// Diagonal bounce. On a 5x5 the path closes after 8 steps, so 16 covers two
// full sweeps and every cell the ball actually touches.
function pongPath(n: number): number[] {
  const p: number[] = [];
  let x = 0, y = 0, dx = 1, dy = 1;
  for (let i = 0; i < 16; i++) {
    p.push(y*n+x);
    if (x+dx<0||x+dx>=n) dx=-dx;
    if (y+dy<0||y+dy>=n) dy=-dy;
    x+=dx; y+=dy;
  }
  return p;
}

const spiralOrd = spiralOrder(N);
const knightOrd = knightTour(N);
const pongOrd = pongPath(N);

// ---- Geometry helpers ----
const chebyshev = (x: number, y: number) => Math.max(Math.abs(x-C), Math.abs(y-C));
const manhattan  = (x: number, y: number) => Math.abs(x-C) + Math.abs(y-C);
const euclidean  = (x: number, y: number) => Math.hypot(x-C, y-C);

// ---- Path orderings ported from the dot-matrix reference (core/grid-paths.ts) ----

/** Spiral inward from the top-left, clockwise. order[cellIndex] = step. */
const SPIRAL_INWARD_ORDER: number[] = (() => {
  const o = new Array(TOTAL).fill(0);
  spiralOrd.forEach((cell, step) => { o[cell] = step; });
  return o;
})();

/** Anti-diagonals traversed alternately, so the sweep serpentines. */
const DIAGONAL_SNAKE_ORDER: number[] = (() => {
  const o = new Array(TOTAL).fill(0);
  let t = 0;
  for (let d = 0; d <= (N - 1) * 2; d++) {
    const rowStart = Math.max(0, d - (N - 1));
    const rowEnd = Math.min(N - 1, d);
    if (d % 2 === 0) {
      for (let r = rowEnd; r >= rowStart; r--) o[r * N + (d - r)] = t++;
    } else {
      for (let r = rowStart; r <= rowEnd; r++) o[r * N + (d - r)] = t++;
    }
  }
  return o;
})();

/** Perimeter, clockwise from the top-left. -1 for cells off the ring. */
const OUTER_RING_ORDER: number[] = (() => {
  const o = new Array(TOTAL).fill(-1);
  const coords: [number, number][] = [
    [0,0],[0,1],[0,2],[0,3],[0,4],[1,4],[2,4],[3,4],
    [4,4],[4,3],[4,2],[4,1],[4,0],[3,0],[2,0],[1,0],
  ];
  coords.forEach(([r, c], t) => { o[r * N + c] = t; });
  return o;
})();

/** The 3x3 ring, anti-clockwise. -1 for cells off the ring. */
const MIDDLE_RING_ORDER: number[] = (() => {
  const o = new Array(TOTAL).fill(-1);
  const coords: [number, number][] = [[1,1],[2,1],[3,1],[3,2],[3,3],[2,3],[1,3],[1,2]];
  coords.forEach(([r, c], t) => { o[r * N + c] = t; });
  return o;
})();

/**
 * The reference applies a POSITIVE animation-delay, which stalls a dot before it
 * first animates. A negative delay of -(1 - f) is equivalent for an infinite
 * loop but starts immediately, so nothing sits dark on mount.
 */
const lead = (frac: number, duration: number) => -(1 - (frac % 1)) * duration;

/**
 * The reference runs every CSS-driven loader on one shared 1500ms cycle
 * (`--dmx-cycle`), so they read as a single family. Its per-loader cycleMsBase
 * values (1400-2000ms) belong to the rAF-driven loaders, which we did not port.
 */
const DMX = 1.5;

// ---- Builder helpers ----

/**
 * Keyframes that animate `transform`, so their dots shrink out of existence and
 * need a placeholder behind them. Derived once here rather than flagged per
 * loader, so there is a single list to keep in step with the stylesheet.
 */
const SCALING_ANIMS = new Set([
  'pg-scale-cyan', 'pg-scale-magenta', 'pg-scale-violet', 'pg-scale-amber',
  'pg-scale-mint', 'pg-scale-pink', 'pg-twist', 'pg-squash', 'pg-jelly',
  'pg-pop-rotate', 'pg-skew', 'pg-drop', 'pg-burst', 'pg-spiral', 'pg-zigzag',
  'pg-mandala-round', 'pg-mandala-square', 'pg-mandala-diamond', 'pg-mandala-cross',
  'pg-mandala-x', 'pg-mandala-star', 'pg-mandala-petal', 'pg-mandala-snow',
  'pg-mandala-gear', 'pg-mandala-kaleido', 'pg-mandala-spiral', 'pg-mandala-pulse',
  'pg-mandala-checker', 'pg-mandala-oct', 'pg-mandala-lotus',
  'pg-domino', 'pg-frame',
]);

function proc(name: string, animName: string, easing: string, duration: number, delay: DelayFn, skipOnNine = false): ProceduralDef {
  return {
    kind: 'procedural', name, animName, easing, duration, delay, skipOnNine,
    placeholder: SCALING_ANIMS.has(animName),
  };
}

// ---- Registry ----
const DEFS: LoaderDef[] = [
  // Pulse wave loaders
  proc('Sweep',        'pg-pulse-cyan',     'linear',       1.6, (x)     => -(x/N)*1.6),
  proc('Diagonal',     'pg-pulse-magenta',  'linear',       1.8, (x,y)   => -((x+y)/(N*2-2))*1.8),
  proc('Ripple',       'pg-pulse-violet',   'ease-out',     1.6, (x,y)   => -(euclidean(x,y)/MAXR)*1.6),
  proc('Rain',         'pg-pulse-mint',     'linear',       1.8, (x,y)   => { const c=[0,.4,.8,.2,.6]; return -((y/N)*1.8+c[x]); }),
  proc('Spiral',       'pg-pulse-pink',     'linear',       2.4, (x,y)   => { const i=spiralOrd.indexOf(y*N+x); return -(i/TOTAL)*2.4; }),
  proc('Snake',        'pg-pulse-lime',     'linear',       2.4, (x,y)   => { const c=(y%2===0)?x:(N-1-x); return -((y*N+c)/TOTAL)*2.4; }),
  proc('Sparkle',      'pg-pulse-amber',    'ease-in-out',  1.8, (x,y,i) => { const r=Math.sin(i*9301+49297)*233280; return -((r-Math.floor(r))*1.8); }),
  proc('Heartbeat',    'pg-heartbeat',      'ease-in-out',  1.2, ()      => 0),
  proc('Scanner',      'pg-pulse-cyan',     'linear',       1.4, (x,y)   => -(y/N)*1.4),
  proc('Orbit',        'pg-pulse-yellow',   'linear',       3.2, (x,y)   => {
    const iB=(x===0||x===N-1||y===0||y===N-1);
    if(!iB) return 999;
    let i: number;
    if(y===0) i=x; else if(x===N-1) i=(N-1)+y; else if(y===N-1) i=(N-1)*2+(N-1-x); else i=(N-1)*3+(N-1-y);
    return -(i/BORDER)*3.2;
  }, true),
  proc('Breathe',      'pg-pulse-violet',   'ease-in-out',  2.4, (x,y)   => -(Math.min(x,y,N-1-x,N-1-y)/RINGS)*1.2),
  proc('Checker',      'pg-pulse-mint',     'ease-in-out',  1.4, (x,y)   => ((x+y)%2===0)?0:-0.7),
  proc('Stripes',      'pg-pulse-pink',     'linear',       1.6, (x,y)   => -(((x+y)%3)/3)*1.6),
  proc('Falling',      'pg-pulse-cyan',     'linear',       1.6, (x,y)   => -(y/N)*0.8-(x*0.08)),
  proc('Plasma',       'pg-plasma',         'ease-in-out',  3.0, (x,y)   => -((x+y)/(N*2-2))*3),
  proc('LoadBar',      'pg-pulse-lime',     'linear',       2.8, (x,y)   => -((y*N+x)/TOTAL)*2.8),
  proc('Knight Tour',  'pg-pulse-cyan',     'linear',       4.0, (x,y)   => { const i=knightOrd.indexOf(y*N+x); return i>=0?-(i/TOTAL)*4:0; }),
  proc('Vortex',       'pg-pulse-magenta',  'linear',       2.4, (x,y)   => { const a=Math.atan2(y-C,x-C); const r=euclidean(x,y)/MAXR; return -((((a+Math.PI)/(2*Math.PI))+r*.5)%1)*2.4; }),
  proc('Sine Wave',    'pg-pulse-mint',     'linear',       2.0, (x,y)   => { const w=(Math.sin((x/N)*Math.PI*2)*.5+.5)*(N-1); return -((x/N)-(Math.abs(y-w)/N)*.3)*2; }),
  proc('Life',         'pg-pulse-amber',    'ease-in-out',  2.0, (x,y)   => -(((x*3+y*5)%5)/5)*2),
  proc('Quadrants',    'pg-pulse-pink',     'ease-in-out',  1.6, (x,y)   => -(((x<C?0:1)+(y<C?0:2))/4)*1.6),
  proc('Crossfade',    'pg-pulse-cyan',     'linear',       1.8, (x,y)   => -(Math.min(Math.abs(x-y),Math.abs(x-(N-1-y)))/N)*1.8),
  proc('Glider',       'pg-pulse-lime',     'steps(4,end)', 1.8, (x,y)   => -(((x+y)%4)/4)*1.8),
  proc('Matrix',       'pg-rain-fade',      'linear',       2.0, (x,y)   => { const s=[0,.3,.7,.1,.5]; return -((y/N)*2+s[x]); }),
  proc('Pong',         'pg-pulse-yellow',   'linear',       2.6, (x,y)   => { const i=pongOrd.indexOf(y*N+x); return i>=0?-(i/pongOrd.length)*2.6:999; }, true),
  proc('Concentric',   'pg-pulse-violet',   'ease-in-out',  2.0, (x,y)   => { const r=Math.min(x,y,N-1-x,N-1-y); return -(r/RINGS)*1+(r%2)*.5; }),
  proc('Twin Spirals', 'pg-pulse-magenta',  'linear',       3.0, (x,y)   => { const a=Math.atan2(y-C,x-C); return -(((a*2+Math.PI*2)/(Math.PI*2))%1)*3; }),
  // AI/process
  proc('Thinking',     'pg-think',          'ease-in-out',  2.0, (x,y)   => -(Math.sin((y/N)*Math.PI)*.5+.5)*2-(x*.06)),
  proc('Searching',    'pg-search',         'ease-in-out',  1.6, (x,y)   => -((y/N)*1.6+(Math.abs(x-C)/C)*.3)),
  proc('Finding',      'pg-find',           'ease-in-out',  1.8, (x,y)   => -(1-euclidean(x,y)/MAXR)*1.8),
  proc('Consolidating','pg-consolidate',    'ease-in-out',  2.2, (x,y)   => -(Math.min(x,y,N-1-x,N-1-y)/RINGS)*2.2),
  proc('Streaming',    'pg-stream',         'linear',       1.4, (x,y)   => -((x/N)*1.4+(y%3)*.15)),
  proc('Reasoning',    'pg-reason',         'ease-in-out',  2.0, (x)     => -(Math.min(x/N,(N-1-x)/N)*2)),
  proc('Indexing',     'pg-index',          'linear',       1.6, (x,y)   => -((x/N)*1.6+(y*.03))),
  proc('Connecting',   'pg-connect',        'ease-in-out',  2.0, (x,y)   => -(euclidean(x,y)/MAXR)*1-(((x+y)%2)*.5)),
  proc('Generating',   'pg-generate',       'ease-out',     2.4, (x,y)   => -((y*N+x)/TOTAL)*2.4),
  proc('Reflecting',   'pg-reflect',        'ease-in-out',  2.0, (x,y)   => { const t=(y<C)?y:(N-1-y); return -(t/RINGS)*1-(x*.07); }),
  // Scale loaders
  proc('Scale Ripple', 'pg-scale-cyan',     'ease-in-out',  1.8, (x,y)   => -(euclidean(x,y)/MAXR)*1.8),
  proc('Scale Wave',   'pg-scale-magenta',  'ease-in-out',  1.6, (x,y)   => -((x+y*.3)/N)*1.6),
  proc('Scale Diag',   'pg-scale-violet',   'ease-in-out',  2.0, (x,y)   => -((x+y)/(N*2-2))*2),
  proc('Scale Pop',    'pg-scale-amber',    'ease-in-out',  1.6, (x,y,i) => { const r=Math.sin(i*9301+49297)*233280; return -((r-Math.floor(r))*1.6); }),
  proc('Scale Ring',   'pg-scale-mint',     'ease-in-out',  2.0, (x,y)   => -(Math.min(x,y,N-1-x,N-1-y)/RINGS)*2),
  proc('Scale Check',  'pg-scale-pink',     'ease-in-out',  1.4, (x,y)   => ((x+y)%2===0)?0:-0.7),
  // Funky scale
  proc('Twist',        'pg-twist',          'ease-in-out',  2.0, (x,y)   => -(euclidean(x,y)/MAXR)*2),
  proc('Squash',       'pg-squash',         'ease-in-out',  1.4, (x)     => -(x/N)*1.4),
  proc('Jelly',        'pg-jelly',          'ease-in-out',  1.6, (x,y)   => -((x+y)/(N*2))*1.6),
  proc('Pop Rotate',   'pg-pop-rotate',     'cubic-bezier(.5,1.6,.4,1)', 2.4, (x,y,i) => { const r=Math.sin(i*12.9898+78.233)*43758.5453; return -((r-Math.floor(r))*2.4); }),
  proc('Skew',         'pg-skew',           'ease-in-out',  1.8, (x,y)   => -(y/N)*1.8),
  proc('Heartbeat Scale','pg-heartbeat',    'ease-in-out',  1.4, (x,y)   => -(euclidean(x,y)/MAXR)*1.4),
  proc('Drop',         'pg-drop',           'cubic-bezier(.5,0,.5,1.6)', 1.6, (x,y) => -(x*.1+y*.16)),
  proc('Burst',        'pg-burst',          'steps(8,end)', 1.2, (x,y)   => -(euclidean(x,y)/MAXR)*1.2),
  proc('Spiral Scale', 'pg-spiral',         'ease-in-out',  2.4, (x,y)   => { const a=Math.atan2(y-C,x-C); return -((a+Math.PI)/(Math.PI*2))*2.4; }),
  proc('Zigzag',       'pg-zigzag',         'ease-in-out',  1.6, (x,y)   => { const o=(y%2===0)?x:(N-1-x); return -(o/N)*1.6; }),

  // Mandalas — 5x5 has a true centre pixel, so these land symmetrically.
  proc('Round',          'pg-mandala-round',   'ease-in-out', 2.0, (x,y) => -(euclidean(x,y)/MAXR)*2),
  proc('Square Mandala', 'pg-mandala-square',  'ease-in-out', 2.0, (x,y) => -(chebyshev(x,y)/RINGS)*2),
  proc('Diamond Mandala','pg-mandala-diamond', 'ease-in-out', 2.0, (x,y) => -(manhattan(x,y)/MAXMAN)*2),
  proc('Cross',          'pg-mandala-cross',   'ease-in-out', 1.8, (x,y) => { if(x!==C&&y!==C) return 999; return -(chebyshev(x,y)/RINGS)*1.8; }, true),
  proc('X Diagonal',     'pg-mandala-x',       'ease-in-out', 1.8, (x,y) => { if(x!==y&&x+y!==N-1) return 999; return -(euclidean(x,y)/MAXR)*1.8; }, true),
  proc('Star Burst',     'pg-mandala-star',    'ease-in-out', 2.0, (x,y) => { const on=(x===C||y===C||x===y||x+y===N-1); if(!on) return 999; return -(euclidean(x,y)/MAXR)*2; }, true),
  proc('Petal',          'pg-mandala-petal',   'ease-in-out', 2.4, (x,y) => { const m=['.P.P.','PPPPP','.PPP.','PPPPP','.P.P.']; if(m[y][x]!=='P') return 999; return -(euclidean(x,y)/MAXR)*2.4; }, true),
  proc('Snowflake',      'pg-mandala-snow',    'ease-in-out', 2.4, (x,y) => { const m=['S.S.S','.SSS.','SSSSS','.SSS.','S.S.S']; if(m[y][x]!=='S') return 999; return -(euclidean(x,y)/MAXR)*2.4; }, true),
  proc('Gear',           'pg-mandala-gear',    'ease-in-out', 2.0, (x,y) => { const m=['.G.G.','GGGGG','GG.GG','GGGGG','.G.G.']; if(m[y][x]!=='G') return 999; return -(euclidean(x,y)/MAXR)*2; }, true),
  proc('Kaleido',        'pg-mandala-kaleido', 'ease-in-out', 2.4, (x,y) => -(chebyshev(x,y)/RINGS)*2.4),
  proc('Spiral Mandala', 'pg-mandala-spiral',  'ease-in-out', 2.4, (x,y) => { const a=Math.atan2(y-C,x-C); return -((a+Math.PI)/(Math.PI*2))*2.4; }),
  proc('Pulse Square',   'pg-mandala-pulse',   'ease-in-out', 1.8, (x,y) => -(chebyshev(x,y)/(RINGS*2))*1.8),
  proc('Check Mandala',  'pg-mandala-checker', 'ease-in-out', 1.8, (x,y) => { if((x+y)%2!==0) return 999; return -(chebyshev(x,y)/RINGS)*1.8; }, true),
  proc('Octagon',        'pg-mandala-oct',     'ease-in-out', 2.0, (x,y) => { const m=['.OOO.','O...O','O...O','O...O','.OOO.']; if(m[y][x]!=='O') return 999; return -((Math.atan2(y-C,x-C)+Math.PI)/(Math.PI*2))*2; }, true),
  proc('Lotus',          'pg-mandala-lotus',   'ease-in-out', 3.0, (x,y) => { const m=['..L..','.LLL.','LLLLL','.LLL.','..L..']; if(m[y][x]!=='L') return 999; return -(chebyshev(x,y)/RINGS)*3; }, true),

  // Geometric masks ported from the dot-matrix pattern set. Each is expressed as
  // the original predicate rather than a hand-drawn string, so the shape stays
  // derived from its maths.
  //
  // The full perimeter including corners — unlike Octagon, which cuts them.
  // Delay keys off euclidean distance, so corners (2.83) lag the edge midpoints
  // (2.0) and the ring breathes in and out instead of pulsing flat.
  proc('Outline',        'pg-mandala-oct',     'ease-in-out', 2.0, (x,y) => {
    if (x !== 0 && x !== N - 1 && y !== 0 && y !== N - 1) return 999;
    return -(euclidean(x, y) / MAXR) * 2;
  }, true),
  // Cells whose radius rounds to 1 or 2 — drops the centre and the four
  // corners, leaving two concentric bands that pulse outward.
  proc('Rings',          'pg-mandala-round',   'ease-in-out', 2.2, (x,y) => {
    const r = Math.round(euclidean(x, y));
    if (r !== 1 && r !== 2) return 999;
    return -((r - 1) / 1) * 1.1;
  }, true),
  // A three-petal rose curve, |sin(3θ)| thresholded, with the centre excluded.
  // Delay follows the angle so the petals sweep round.
  proc('Rose',           'pg-mandala-petal',   'ease-in-out', 2.6, (x,y) => {
    const dx = x - C, dy = y - C;
    const radius = Math.hypot(dx, dy);
    if (Math.abs(Math.sin(3 * Math.atan2(dy, dx))) <= 0.6 || radius < 1) return 999;
    return -((Math.atan2(dy, dx) + Math.PI) / (Math.PI * 2)) * 2.6;
  }, true),
// ---- Ported from the dot-matrix reference (~/Desktop/matrix) ----
  // Each was a shared @keyframes plus a per-dot animation-delay derived from a
  // path ordering — i.e. a pure phase shift, which is exactly what proc() is.
  // Delay formulas are the reference's, converted to lead-in form.

  // dotm-square-1. Anti-diagonal sweep from top-right, alternating parity so
  // neighbouring diagonals fire half a cycle apart.
  proc('Neon Drift',   'dmx-neon-drift',   'linear', DMX, (x,y) => {
    const slice = y + (N - 1 - x);
    return lead(slice / ((N - 1) * 2) * 0.2 + (slice % 2) * 0.5, DMX);
  }),
  // dotm-square-3. A decaying tail chasing the spiral inward.
  proc('Core Spiral',  'dmx-snake-trail',  'linear', DMX, (x,y) =>
    lead(SPIRAL_INWARD_ORDER[y * N + x] * 0.04, DMX)),
  // dotm-square-4. Outer ring clockwise, inner ring anti-clockwise, centre dark.
  proc('Twin Orbit',   'dmx-snake-trail',  'linear', DMX, (x,y) => {
    const i = y * N + x;
    if (x === C && y === C) return 999;
    const outer = OUTER_RING_ORDER[i];
    if (outer >= 0) return lead(outer / 16, DMX);
    return lead(1 - MIDDLE_RING_ORDER[i] / 8, DMX);
  }, true),
  // dotm-square-5. Same tail, serpentining across the anti-diagonals.
  proc('Prism Sweep',  'dmx-snake-trail',  'linear', DMX, (x,y) =>
    lead(DIAGONAL_SNAKE_ORDER[y * N + x] * 0.04, DMX)),
  // dotm-square-6. Equaliser columns: each column runs bottom-up or top-down by
  // parity, stepped so the levels read as discrete bars.
  proc('Flux Columns', 'dmx-flux-columns', 'steps(5, end)', DMX, (x,y) =>
    lead(((x % 2 === 0 ? N - 1 - y : y) * 0.2), DMX)),
  // dotm-square-11. Manhattan rings, with a parity nudge so alternating rings
  // separate slightly instead of moving as one front.
  proc('Echo Ring',    'dmx-ripple-echo',  'ease-in-out', DMX, (x,y) => {
    const ring = Math.min(4, Math.abs(y - C) + Math.abs(x - C));
    return lead(ring * 0.14 + (ring % 2) * 0.03, DMX);
  }),
  // dotm-square-12. Same idea but the origin is off-centre at (1,1), so the wave
  // is asymmetric across the grid.
  proc('Origin Wave',  'dmx-origin-wave',  'ease-in-out', DMX, (x,y) => {
    const ring = Math.min(6, Math.abs(y - 1) + Math.abs(x - 1));
    return lead(ring * 0.16, DMX);
  }),
// ---- New patterns ----

  // A beam sweeping around the centre, leaving a decaying wake. The centre has
  // no meaningful angle, so it holds steady as the pivot.
  proc('Sonar',      'pg-sonar',  'linear', 2.4, (x,y) => {
    if (x === C && y === C) return 0;
    return -((Math.atan2(y - C, x - C) + Math.PI) / (Math.PI * 2)) * 2.4;
  }),
  // Four two-cell arms with 4-fold rotational symmetry, phased by angle so the
  // whole pinwheel appears to turn.
  proc('Pinwheel',   'pg-sonar',  'linear', 2.0, (x,y) => {
    const m = ['.PP..', '....P', 'P.P.P', 'P....', '..PP.'];
    if (m[y][x] !== 'P') return 999;
    if (x === C && y === C) return 0;
    return -((Math.atan2(y - C, x - C) + Math.PI) / (Math.PI * 2)) * 2.0;
  }, true),
  // Topples along the serpentine path, each cell tipping into the next.
  proc('Domino',     'pg-domino', 'ease-in-out', 2.4, (x,y) => {
    const col = (y % 2 === 0) ? x : (N - 1 - x);
    return -((y * N + col) / TOTAL) * 2.4;
  }),
  // Four runners starting at the corners and converging on the centre.
  proc('Corners',    'pg-frame',  'ease-in-out', 1.8, (x,y) => {
    const d = Math.min(
      Math.hypot(x, y), Math.hypot(N - 1 - x, y),
      Math.hypot(x, N - 1 - y), Math.hypot(N - 1 - x, N - 1 - y),
    );
    return -(d / Math.hypot(C, C)) * 1.8;
  }),
  // Nested square frames snapping on from the outside in.
  proc('Frame',      'pg-frame',  'ease-in-out', 2.0, (x,y) =>
    -((RINGS - chebyshev(x, y)) / RINGS) * 2.0),
];

// ---- Name-to-slug mapping ----
function toSlug(name: string): string {
  return name.toLowerCase().replace(/[\s.]+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export const LOADER_REGISTRY: Record<string, LoaderDef> = {};
for (const def of DEFS) {
  LOADER_REGISTRY[toSlug(def.name)] = def;
}

// Compiled fields. Only the sampled curve data reaches the browser — everything
// in engine/field.ts and engine/compile.ts runs at build time.
for (const [slug, f] of Object.entries(FIELD_DOTS)) {
  const def: CompiledDef = { kind: 'compiled', name: f.name, slug, duration: f.duration, dots: f.dots };
  LOADER_REGISTRY[slug] = def;
}

/** Every registered loader slug, in registry order. */
export const LOADER_NAMES: string[] = [...DEFS.map(d => toSlug(d.name)), ...Object.keys(FIELD_DOTS)];

// Also map some common aliases
const ALIASES: Record<string, string> = {
  'knight': 'knight-tour',
  'sine': 'sine-wave',
  'twin': 'twin-spirals',
};
for (const [alias, target] of Object.entries(ALIASES)) {
  if (!LOADER_REGISTRY[alias] && LOADER_REGISTRY[target]) {
    LOADER_REGISTRY[alias] = LOADER_REGISTRY[target];
  }
}
