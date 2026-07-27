import type { LoaderDef, ProceduralDef, DelayFn } from '../types';
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

// ---- Builder helpers ----
function proc(name: string, animName: string, easing: string, duration: number, delay: DelayFn, skipOnNine = false): ProceduralDef {
  return { kind: 'procedural', name, animName, easing, duration, delay, skipOnNine };
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
];

// ---- Name-to-slug mapping ----
function toSlug(name: string): string {
  return name.toLowerCase().replace(/[\s.]+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export const LOADER_REGISTRY: Record<string, LoaderDef> = {};
for (const def of DEFS) {
  LOADER_REGISTRY[toSlug(def.name)] = def;
}

/** Every registered loader slug, in registry order. */
export const LOADER_NAMES: string[] = DEFS.map(d => toSlug(d.name));

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
