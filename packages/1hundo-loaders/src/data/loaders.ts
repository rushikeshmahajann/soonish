import type { LoaderDef, ProceduralDef, SpriteDef, DelayFn } from '../types';
import { STORIES, COMM_LOADERS } from './stories';

const N = 8;

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

function hilbertOrder(n: number): number[] {
  function d2xy(n: number, d: number): [number, number] {
    let rx: number, ry: number, t = d, x = 0, y = 0;
    for (let s = 1; s < n; s *= 2) {
      rx = 1 & Math.floor(t / 2); ry = 1 & (t ^ rx);
      if (ry === 0) { if (rx === 1) { x = s-1-x; y = s-1-y; } [x,y] = [y,x]; }
      x += s * rx; y += s * ry; t = Math.floor(t / 4);
    }
    return [x, y];
  }
  const r: number[] = [];
  for (let d = 0; d < n*n; d++) { const [x,y] = d2xy(n,d); r.push(y*n+x); }
  return r;
}

function pongPath(n: number): number[] {
  const p: number[] = [];
  let x = 0, y = 0, dx = 1, dy = 1;
  for (let i = 0; i < 28; i++) {
    p.push(y*n+x);
    if (x+dx<0||x+dx>=n) dx=-dx;
    if (y+dy<0||y+dy>=n) dy=-dy;
    x+=dx; y+=dy;
  }
  return p;
}

const spiralOrd = spiralOrder(N);
const knightOrd = knightTour(N);
const hilbertOrd = hilbertOrder(N);
const pongOrd = pongPath(N);

// ---- Geometry helpers ----
const chebyshev = (x: number, y: number) => Math.max(Math.abs(x-3.5), Math.abs(y-3.5));
const manhattan  = (x: number, y: number) => Math.abs(x-3.5) + Math.abs(y-3.5);
const euclidean  = (x: number, y: number) => Math.hypot(x-3.5, y-3.5);

// ---- Builder helpers ----
function proc(name: string, animName: string, easing: string, duration: number, delay: DelayFn, skipOnNine = false): ProceduralDef {
  return { kind: 'procedural', name, animName, easing, duration, delay, skipOnNine };
}

// ---- Sprite color maps ----
const SC = { // Sprite Colors
  Y:'#eee5b7', R:'#e7b8bf', O:'#edcfaa', G:'#d7e9bd', C:'#bfe7df',
  M:'#e7c6df', V:'#c9d0f4', W:'#d8d8d8', P:'#edc8cf', N_:'#bee8dc', K:'#1a1a24',
};

function sprite(name: string, matrixAnim: string, matrixDuration: number, map: string[], colors: Record<string,string>, blinkChar?: string, detailChar?: string): SpriteDef {
  return { kind: 'sprite', name, matrixAnim, matrixDuration, map, colors, blinkChar, detailChar };
}

// ---- Registry ----
const DEFS: LoaderDef[] = [
  // Pulse wave loaders
  proc('Sweep',        'pg-pulse-cyan',     'linear',       1.6, (x)     => -(x/N)*1.6),
  proc('Diagonal',     'pg-pulse-magenta',  'linear',       1.8, (x,y)   => -((x+y)/(N*2-2))*1.8),
  proc('Ripple',       'pg-pulse-violet',   'ease-out',     1.6, (x,y)   => { const d=Math.hypot(x-3.5,y-3.5); return -(d/Math.hypot(3.5,3.5))*1.6; }),
  proc('Rain',         'pg-pulse-mint',     'linear',       1.8, (x,y)   => { const c=[0,.4,.8,.2,.6,.1,.5,.3]; return -((y/N)*1.8+c[x]); }),
  proc('Spiral',       'pg-pulse-pink',     'linear',       2.4, (x,y)   => { const i=spiralOrd.indexOf(y*N+x); return -(i/64)*2.4; }),
  proc('Snake',        'pg-pulse-lime',     'linear',       2.4, (x,y)   => { const c=(y%2===0)?x:(N-1-x); return -(y*N+c)/64*2.4; }),
  proc('Sparkle',      'pg-pulse-amber',    'ease-in-out',  1.8, (x,y,i) => { const r=Math.sin(i*9301+49297)*233280; return -((r-Math.floor(r))*1.8); }),
  proc('Heartbeat',    'pg-heartbeat',      'ease-in-out',  1.2, ()      => 0),
  proc('Scanner',      'pg-pulse-cyan',     'linear',       1.4, (x,y)   => -(y/N)*1.4),
  proc('Orbit',        'pg-pulse-yellow',   'linear',       3.2, (x,y)   => {
    const iB=(x===0||x===N-1||y===0||y===N-1);
    if(!iB) return 999;
    let i: number;
    if(y===0) i=x; else if(x===N-1) i=(N-1)+y; else if(y===N-1) i=(N-1)*2+(N-1-x); else i=(N-1)*3+(N-1-y);
    return -(i/((N-1)*4))*3.2;
  }, true),
  proc('Breathe',      'pg-pulse-violet',   'ease-in-out',  2.4, (x,y)   => -(Math.min(x,y,N-1-x,N-1-y)/4)*1.2),
  proc('Checker',      'pg-pulse-mint',     'ease-in-out',  1.4, (x,y)   => ((x+y)%2===0)?0:-0.7),
  proc('Stripes',      'pg-pulse-pink',     'linear',       1.6, (x,y)   => -(((x+y)%4)/4)*1.6),
  proc('Falling',      'pg-pulse-cyan',     'linear',       1.6, (x,y)   => -(y/N)*0.8-(x*0.05)),
  proc('Plasma',       'pg-plasma',         'ease-in-out',  3.0, (x,y)   => -((x+y)/(N*2-2))*3),
  proc('LoadBar',      'pg-pulse-lime',     'linear',       2.8, (x,y)   => -((y*N+x)/64)*2.8),
  proc('Knight Tour',  'pg-pulse-cyan',     'linear',       4.0, (x,y)   => { const i=knightOrd.indexOf(y*N+x); return i>=0?-(i/64)*4:0; }),
  proc('Hilbert',      'pg-pulse-violet',   'linear',       3.6, (x,y)   => { const i=hilbertOrd.indexOf(y*N+x); return -(i/64)*3.6; }),
  proc('Vortex',       'pg-pulse-magenta',  'linear',       2.4, (x,y)   => { const a=Math.atan2(y-3.5,x-3.5); const r=Math.hypot(x-3.5,y-3.5)/5; return -((((a+Math.PI)/(2*Math.PI))+r*.5)%1)*2.4; }),
  proc('Sine Wave',    'pg-pulse-mint',     'linear',       2.0, (x,y)   => { const w=(Math.sin((x/N)*Math.PI*2)*.5+.5)*(N-1); return -((x/N)-(Math.abs(y-w)/N)*.3)*2; }),
  proc('Life',         'pg-pulse-amber',    'ease-in-out',  2.0, (x,y)   => -(((x*3+y*5)%8)/8)*2),
  proc('Quadrants',    'pg-pulse-pink',     'ease-in-out',  1.6, (x,y)   => -(((x<4?0:1)+(y<4?0:2))/4)*1.6),
  proc('Crossfade',    'pg-pulse-cyan',     'linear',       1.8, (x,y)   => -(Math.min(Math.abs(x-y),Math.abs(x-(N-1-y)))/N)*1.8),
  proc('Glider',       'pg-pulse-lime',     'steps(4,end)', 1.8, (x,y)   => -(((x+y)%4)/4)*1.8),
  proc('Matrix',       'pg-rain-fade',      'linear',       2.0, (x,y)   => { const s=[0,.3,.7,.1,.5,.9,.2,.6]; return -((y/N)*2+s[x]); }),
  proc('Pong',         'pg-pulse-yellow',   'linear',       2.6, (x,y)   => { const i=pongOrd.indexOf(y*N+x); return i>=0?-(i/pongOrd.length)*2.6:999; }, true),
  proc('Concentric',   'pg-pulse-violet',   'ease-in-out',  2.0, (x,y)   => { const r=Math.min(x,y,N-1-x,N-1-y); return -(r/4)*1+(r%2)*.5; }),
  proc('Twin Spirals', 'pg-pulse-magenta',  'linear',       3.0, (x,y)   => { const a=Math.atan2(y-3.5,x-3.5); return -(((a*2+Math.PI*2)/(Math.PI*2))%1)*3; }),
  // AI/process
  proc('Thinking',     'pg-think',          'ease-in-out',  2.0, (x,y)   => -(Math.sin((y/N)*Math.PI)*.5+.5)*2-(x*.04)),
  proc('Searching',    'pg-search',         'ease-in-out',  1.6, (x,y)   => -((y/N)*1.6+(Math.abs(x-3.5)/4)*.3)),
  proc('Finding',      'pg-find',           'ease-in-out',  1.8, (x,y)   => { const d=Math.hypot(x-3.5,y-3.5); return -(1-d/Math.hypot(3.5,3.5))*1.8; }),
  proc('Consolidating','pg-consolidate',    'ease-in-out',  2.2, (x,y)   => -(Math.min(x,y,N-1-x,N-1-y)/4)*2.2),
  proc('Streaming',    'pg-stream',         'linear',       1.4, (x,y)   => -((x/N)*1.4+(y%3)*.15)),
  proc('Reasoning',    'pg-reason',         'ease-in-out',  2.0, (x)     => -(Math.min(x/N,(N-1-x)/N)*2)),
  proc('Indexing',     'pg-index',          'linear',       1.6, (x,y)   => -((x/N)*1.6+(y*.02))),
  proc('Connecting',   'pg-connect',        'ease-in-out',  2.0, (x,y)   => { const d=Math.hypot(x-3.5,y-3.5); return -(d/Math.hypot(3.5,3.5))*1-(((x+y)%2)*.5); }),
  proc('Generating',   'pg-generate',       'ease-out',     2.4, (x,y)   => -((y*N+x)/64)*2.4),
  proc('Reflecting',   'pg-reflect',        'ease-in-out',  2.0, (x,y)   => { const t=(y<4)?y:(N-1-y); return -(t/4)*1-(x*.05); }),
  // Scale loaders
  proc('Scale Ripple', 'pg-scale-cyan',     'ease-in-out',  1.8, (x,y)   => { const d=Math.hypot(x-3.5,y-3.5); return -(d/Math.hypot(3.5,3.5))*1.8; }),
  proc('Scale Wave',   'pg-scale-magenta',  'ease-in-out',  1.6, (x,y)   => -((x+y*.3)/N)*1.6),
  proc('Scale Diag',   'pg-scale-violet',   'ease-in-out',  2.0, (x,y)   => -((x+y)/(N*2-2))*2),
  proc('Scale Pop',    'pg-scale-amber',    'ease-in-out',  1.6, (x,y,i) => { const r=Math.sin(i*9301+49297)*233280; return -((r-Math.floor(r))*1.6); }),
  proc('Scale Ring',   'pg-scale-mint',     'ease-in-out',  2.0, (x,y)   => -(Math.min(x,y,N-1-x,N-1-y)/4)*2),
  proc('Scale Check',  'pg-scale-pink',     'ease-in-out',  1.4, (x,y)   => ((x+y)%2===0)?0:-0.7),
  // Funky scale
  proc('Twist',        'pg-twist',          'ease-in-out',  2.0, (x,y)   => -(Math.hypot(x-3.5,y-3.5)/5)*2),
  proc('Squash',       'pg-squash',         'ease-in-out',  1.4, (x)     => -(x/N)*1.4),
  proc('Jelly',        'pg-jelly',          'ease-in-out',  1.6, (x,y)   => -((x+y)/(N*2))*1.6),
  proc('Pop Rotate',   'pg-pop-rotate',     'cubic-bezier(.5,1.6,.4,1)', 2.4, (x,y,i) => { const r=Math.sin(i*12.9898+78.233)*43758.5453; return -((r-Math.floor(r))*2.4); }),
  proc('Skew',         'pg-skew',           'ease-in-out',  1.8, (x,y)   => -(y/N)*1.8),
  proc('Heartbeat Scale','pg-heartbeat',    'ease-in-out',  1.4, (x,y)   => -(Math.hypot(x-3.5,y-3.5)/6)*1.4),
  proc('Drop',         'pg-drop',           'cubic-bezier(.5,0,.5,1.6)', 1.6, (x,y) => -(x*.08+y*.12)),
  proc('Burst',        'pg-burst',          'steps(8,end)', 1.2, (x,y)   => -(Math.hypot(x-3.5,y-3.5)/6)*1.2),
  proc('Spiral Scale', 'pg-spiral',         'ease-in-out',  2.4, (x,y)   => { const a=Math.atan2(y-3.5,x-3.5); return -((a+Math.PI)/(Math.PI*2))*2.4; }),
  proc('Zigzag',       'pg-zigzag',         'ease-in-out',  1.6, (x,y)   => { const o=(y%2===0)?x:(N-1-x); return -(o/N)*1.6; }),

  // Emoji sprites
  sprite('Smiley',     'sprite-breathe', 2.4, ['..YYYY..', '.YYYYYY.', 'YYEYYEYY', 'YYYYYYYY', 'YYYYYYYY', 'YYDDDDYY', '.YYYYYY.', '..YYYY..'], {Y:SC.Y, E:SC.K, D:SC.K}, 'E', 'D'),
  sprite('Heart',      'sprite-breathe', 2.4, ['.RR..RR.', 'RRRRRRRR', 'RRRRRRRR', 'RRRRDRRR', '.RRRRRR.', '..RRRR..', '...RR...', '........'], {R:SC.R, D:SC.W}, undefined, 'D'),
  sprite('Star',       'sprite-flash',   1.0, ['...YY...', '...DD...', 'YYYYYYYY', '.YYYYYY.', '..YYYY..', '.YY..YY.', 'YY....YY', '........'], {Y:SC.Y, D:SC.W}, undefined, 'D'),
  sprite('Fire',       'sprite-flash',   1.0, ['...O....', '..OOO...', '..OOOO..', '.OODDO..', 'OOYYYYO.', 'OOYDDYOO', '.OYYYYO.', '..OOOO..'], {O:SC.O, Y:SC.Y, D:SC.W}, undefined, 'D'),
  sprite('Robot',      'sprite-blink',   2.4, ['.CCCCCC.', 'C.C..C.C', 'CCEEEECC', 'CCEEEECC', 'CCCCCCCC', '.CDDDDC.', '.C....C.', 'CC....CC'], {C:SC.C, E:SC.K, D:SC.K}, 'E', 'D'),
  sprite('Ghost',      'sprite-bounce',  1.2, ['..WWWW..', '.WWWWWW.', 'WWEWWEWW', 'WWWWWWWW', 'WWWDDWWW', 'WWWWWWWW', 'W.WW.WW.', '.W..W..W'], {W:SC.W, E:SC.K, D:SC.P}, 'E', 'D'),
  sprite('Lightning',  'sprite-flash',   1.0, ['....YY..', '...YY...', '..YY....', '.YYDD...', '....YY..', '...YY...', '..YY....', '.YY.....'], {Y:SC.Y, D:SC.W}, undefined, 'D'),
  sprite('Diamond',    'sprite-spin',    3.0, ['...CC...', '..CCCC..', '.CCDDCC.', 'CCDWWDCC', 'CCCCCCCC', '.CCCCCC.', '..CCCC..', '...CC...'], {C:SC.C, D:SC.W, W:SC.W}, undefined, 'D'),
  sprite('Skull',      'sprite-blink',   2.4, ['..WWWW..', '.WWWWWW.', 'WWEWWEWW', 'WWWWWWWW', 'WWDWWDWW', '.WWWWWW.', '.W.WW.W.', '..W..W..'], {W:SC.W, E:SC.K, D:SC.K}, 'E', 'D'),
  sprite('Pacman',     'sprite-flash',   1.0, ['..YYYY..', '.YYYYYY.', 'YYYDD...', 'YYY.....', 'YYYY....', '.YYYYYY.', '..YYYY..', '........'], {Y:SC.Y, D:SC.K}, undefined, 'D'),
  sprite('Mushroom',   'sprite-breathe', 2.4, ['..RRRR..', '.RDDRRR.', 'RDDRRRRR', 'RRRRRRRR', 'RRRRRRRR', '..WWWW..', '..WWWW..', '..WWWW..'], {R:SC.R, W:SC.W, D:SC.W}, undefined, 'D'),
  sprite('Crown',      'sprite-flash',   1.0, ['Y..YY..Y', 'Y..YY..Y', 'YYYYYYYY', 'YDOYYODY', 'YYYYYYYY', 'YYYYYYYY', '........', '........'], {Y:SC.Y, O:SC.O, D:SC.W}, undefined, 'D'),
  sprite('Rocket',     'sprite-bounce',  1.2, ['....C...', '...CCC..', '..CWWWC.', '..CWDWC.', '..CCCCC.', '..C.C.C.', '.O...O..', 'O.....O.'], {C:SC.C, W:SC.W, O:SC.O, D:SC.O}, undefined, 'D'),
  sprite('Coin',       'sprite-spin',    3.0, ['..YYYY..', '.YYYYYY.', 'YYYOOYYY', 'YYYDDYYY', 'YYYDDYYY', 'YYYOOYYY', '.YYYYYY.', '..YYYY..'], {Y:SC.Y, O:SC.O, D:SC.O}, undefined, 'D'),
  sprite('Bomb',       'sprite-blink',   2.4, ['......OY', '.....OD.', '....OO..', '..KKKK..', '.KKKKKK.', '.KKKKKK.', '.KKKKKK.', '..KKKK..'], {K:SC.K, O:SC.O, Y:SC.Y, D:SC.Y}, undefined, 'D'),
  sprite('Wave',       'sprite-flash',   1.0, ['........', '..CC.CC.', '.CCCCCCC', 'CC.CCC.C', 'CCCCCCCC', '.CCCCCC.', '..CCCC..', '........'], {C:SC.C}),
  sprite('Cat',        'sprite-breathe', 2.4, ['V......V', 'VV....VV', 'VVVVVVVV', 'VEVVVVEV', 'VVVVVVVV', 'VVDVVDVV', '.VVVVVV.', '..V..V..'], {V:SC.V, E:SC.Y, D:SC.P}, 'E', 'D'),
  sprite('Bug',        'sprite-bounce',  1.2, ['G......G', '.GGGGGG.', 'GGEEEEGG', 'GGGGGGGG', 'GGDDDDGG', '.GGGGGG.', 'G.G..G.G', 'G......G'], {G:SC.G, E:SC.K, D:SC.K}, 'E', 'D'),
  sprite('Battery',    'sprite-flash',   1.0, ['........', '...WWW..', '.WWWWWWW', '.WGGGDGW', '.WGGGDGW', '.WWWWWWW', '........', '........'], {W:SC.W, G:SC.G, D:SC.W}, undefined, 'D'),
  sprite('Bell',       'sprite-flash',   1.0, ['...YY...', '..YYYY..', '.YYYYYY.', '.YDDDDY.', 'YYYYYYYY', 'YYYYYYYY', 'YYYYYYYY', '...OO...'], {Y:SC.Y, O:SC.O, D:SC.W}, undefined, 'D'),

  // Mandalas
  proc('Round',          'pg-mandala-round',   'ease-in-out', 2.0, (x,y) => { const r=Math.round(euclidean(x,y)*1.5); return -(r/5)*2; }),
  proc('Square Mandala', 'pg-mandala-square',  'ease-in-out', 2.0, (x,y) => -(Math.floor(chebyshev(x,y))/4)*2),
  proc('Diamond Mandala','pg-mandala-diamond', 'ease-in-out', 2.0, (x,y) => -(Math.floor(manhattan(x,y))/7)*2),
  proc('Cross',          'pg-mandala-cross',   'ease-in-out', 1.8, (x,y) => { const on=(x===3||x===4||y===3||y===4); if(!on) return 999; return -(Math.max(Math.abs(x-3.5),Math.abs(y-3.5))/4)*1.8; }, true),
  proc('X Diagonal',     'pg-mandala-x',       'ease-in-out', 1.8, (x,y) => { const on=(x===y||x+y===7); if(!on) return 999; return -(Math.hypot(x-3.5,y-3.5)/5)*1.8; }, true),
  proc('Star Burst',     'pg-mandala-star',    'ease-in-out', 2.0, (x,y) => { const on=(x===3||x===4||y===3||y===4||x===y||x+y===7); if(!on) return 999; return -(Math.hypot(x-3.5,y-3.5)/5)*2; }, true),
  proc('Petal',          'pg-mandala-petal',   'ease-in-out', 2.4, (x,y) => { const m=['..PPPP..', '.P.PP.P.', 'PP.PP.PP', 'PPPPPPPP', 'PPPPPPPP', 'PP.PP.PP', '.P.PP.P.', '..PPPP..']; if(m[y][x]!=='P') return 999; return -(Math.hypot(x-3.5,y-3.5)/5)*2.4; }, true),
  proc('Snowflake',      'pg-mandala-snow',    'ease-in-out', 2.4, (x,y) => { const m=['...SS...', 'S..SS..S', '.S.SS.S.', 'SSSSSSSS', 'SSSSSSSS', '.S.SS.S.', 'S..SS..S', '...SS...']; if(m[y][x]!=='S') return 999; return -(Math.hypot(x-3.5,y-3.5)/5)*2.4; }, true),
  proc('Gear',           'pg-mandala-gear',    'ease-in-out', 2.0, (x,y) => { const m=['GG.GG.GG', 'GGGGGGGG', '.GG..GG.', 'GG.GG.GG', 'GG.GG.GG', '.GG..GG.', 'GGGGGGGG', 'GG.GG.GG']; if(m[y][x]!=='G') return 999; return -(Math.hypot(x-3.5,y-3.5)/5)*2; }, true),
  proc('Kaleido',        'pg-mandala-kaleido', 'ease-in-out', 2.4, (x,y) => -(Math.floor(chebyshev(x,y))/4)*2.4),
  proc('Spiral Mandala', 'pg-mandala-spiral',  'ease-in-out', 2.4, (x,y) => { const a=Math.atan2(y-3.5,x-3.5); return -((a+Math.PI)/(Math.PI*2))*2.4; }),
  proc('Pulse Square',   'pg-mandala-pulse',   'ease-in-out', 1.8, (x,y) => -(Math.floor(chebyshev(x,y))/8)*1.8),
  proc('Check Mandala',  'pg-mandala-checker', 'ease-in-out', 1.8, (x,y) => { if((x+y)%2!==0) return 999; return -(Math.floor(chebyshev(x,y))/4)*1.8; }, true),
  proc('Octagon',        'pg-mandala-oct',     'ease-in-out', 2.0, (x,y) => { const m=['..OOOO..', '.O....O.', 'O......O', 'O......O', 'O......O', 'O......O', '.O....O.', '..OOOO..']; if(m[y][x]!=='O') return 999; return -((Math.atan2(y-3.5,x-3.5)+Math.PI)/(Math.PI*2))*2; }, true),
  proc('Lotus',          'pg-mandala-lotus',   'ease-in-out', 3.0, (x,y) => { const m=['...LL...', '..LLLL..', '.LLLLLL.', 'LLLLLLLL', 'LLLLLLLL', '.LLLLLL.', '..LLLL..', '...LL...']; if(m[y][x]!=='L') return 999; return -(Math.floor(chebyshev(x,y))/4)*3; }, true),

  // Story and comm loaders
  ...STORIES,
  ...COMM_LOADERS,
];

// ---- Name-to-slug mapping ----
function toSlug(name: string): string {
  return name.toLowerCase().replace(/[\s.]+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export const LOADER_REGISTRY: Record<string, LoaderDef> = {};
for (const def of DEFS) {
  LOADER_REGISTRY[toSlug(def.name)] = def;
}

// Also map some common aliases
const ALIASES: Record<string, string> = {
  'knight': 'knight-tour',
  'sine': 'sine-wave',
  'twin': 'twin-spirals',
  'loadbar': 'loadbar',
  'heartbeat-scale': 'heartbeat-scale',
  'spiral-scale': 'spiral-scale',
  'diamond-mandala': 'diamond-mandala',
  'square-mandala': 'square-mandala',
};
for (const [alias, target] of Object.entries(ALIASES)) {
  if (!LOADER_REGISTRY[alias] && LOADER_REGISTRY[target]) {
    LOADER_REGISTRY[alias] = LOADER_REGISTRY[target];
  }
}
