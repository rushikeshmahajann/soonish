"use client";

import { useEffect, useRef } from "react";
import { STORIES, COMM_LOADERS, buildStoryTile } from "@/lib/stories";

export default function LoadersGallery() {
  const gridRef = useRef<HTMLDivElement>(null);
  const pageInfoRef = useRef<HTMLSpanElement>(null);
  const pageRangeRef = useRef<HTMLSpanElement>(null);
  const pageDotsRef = useRef<HTMLDivElement>(null);
  const prevBtnRef = useRef<HTMLButtonElement>(null);
  const nextBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const N = 8;
    const activeTileCleanups = new Set<() => void>();
    const visibilityObserver = "IntersectionObserver" in window
      ? new IntersectionObserver((entries) => {
          for (const entry of entries) {
            const tile = entry.target as HTMLElement;
            const shouldPause = !entry.isIntersecting || document.hidden;
            tile.classList.toggle("is-paused", shouldPause);
            tile.dispatchEvent(new Event(shouldPause ? "loader:pause" : "loader:resume"));
          }
        }, { rootMargin: "160px 0px", threshold: 0.01 })
      : null;

    function watchTile(tile: HTMLElement) {
      visibilityObserver?.observe(tile);
      const cleanupStory = (tile as HTMLElement & { _cleanupStory?: () => void })._cleanupStory;
      const cleanup = () => {
        visibilityObserver?.unobserve(tile);
        cleanupStory?.();
      };
      activeTileCleanups.add(cleanup);
      return tile;
    }

    function cleanupRenderedTiles() {
      for (const cleanup of activeTileCleanups) cleanup();
      activeTileCleanups.clear();
    }

    const onVisibilityChange = () => {
      document.body.classList.toggle("animations-paused", document.hidden);
      const tiles = gridRef.current?.querySelectorAll<HTMLElement>(".tile") ?? [];
      for (const tile of tiles) {
        const shouldPause = document.hidden || tile.classList.contains("is-paused");
        tile.dispatchEvent(new Event(shouldPause ? "loader:pause" : "loader:resume"));
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);

    /* ---- helper functions ---- */
    function spiralOrder(n: number): number[] {
      const result: number[] = [];
      let top = 0, bottom = n - 1, left = 0, right = n - 1;
      while (top <= bottom && left <= right) {
        for (let i = left; i <= right; i++) result.push(top * n + i);
        top++;
        for (let i = top; i <= bottom; i++) result.push(i * n + right);
        right--;
        if (top <= bottom) {
          for (let i = right; i >= left; i--) result.push(bottom * n + i);
          bottom--;
        }
        if (left <= right) {
          for (let i = bottom; i >= top; i--) result.push(i * n + left);
          left++;
        }
      }
      return result;
    }

    function knightTour(n: number): number[] {
      const moves = [[1,2],[2,1],[2,-1],[1,-2],[-1,-2],[-2,-1],[-2,1],[-1,2]];
      const visited = Array(n * n).fill(false);
      const order: number[] = [];
      let x = 0, y = 0;
      for (let step = 0; step < n * n; step++) {
        order.push(y * n + x);
        visited[y * n + x] = true;
        let best: [number, number] | null = null, bestCount = 99;
        for (const [dx, dy] of moves) {
          const nx = x + dx, ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= n || ny >= n || visited[ny * n + nx]) continue;
          let count = 0;
          for (const [ddx, ddy] of moves) {
            const ax = nx + ddx, ay = ny + ddy;
            if (ax < 0 || ay < 0 || ax >= n || ay >= n || visited[ay * n + ax]) continue;
            count++;
          }
          if (count < bestCount) { bestCount = count; best = [nx, ny]; }
        }
        if (best) { [x, y] = best; } else {
          const idx = visited.indexOf(false);
          if (idx < 0) break;
          x = idx % n; y = Math.floor(idx / n);
        }
      }
      return order;
    }

    function d2xy(n: number, d: number): [number, number] {
      let rx: number, ry: number, t = d, x = 0, y = 0;
      for (let s = 1; s < n; s *= 2) {
        rx = 1 & Math.floor(t / 2);
        ry = 1 & (t ^ rx);
        if (ry === 0) {
          if (rx === 1) { x = s - 1 - x; y = s - 1 - y; }
          [x, y] = [y, x];
        }
        x += s * rx;
        y += s * ry;
        t = Math.floor(t / 4);
      }
      return [x, y];
    }

    function hilbertOrder(n: number): number[] {
      const order: number[] = [];
      for (let d = 0; d < n * n; d++) {
        const [x, y] = d2xy(n, d);
        order.push(y * n + x);
      }
      return order;
    }

    function pongPath(n: number): number[] {
      const path: number[] = [];
      let x = 0, y = 0, dx = 1, dy = 1;
      for (let i = 0; i < 28; i++) {
        path.push(y * n + x);
        if (x + dx < 0 || x + dx >= n) dx = -dx;
        if (y + dy < 0 || y + dy >= n) dy = -dy;
        x += dx; y += dy;
      }
      return path;
    }

    function chebyshev(x: number, y: number) { return Math.max(Math.abs(x - 3.5), Math.abs(y - 3.5)); }
    function manhattan(x: number, y: number) { return Math.abs(x - 3.5) + Math.abs(y - 3.5); }
    function euclidean(x: number, y: number) { return Math.hypot(x - 3.5, y - 3.5); }

    /* ---- emoji sprites ---- */
    function emojiSprites() {
      const Y = '#eee5b7';
      const R = '#e7b8bf';
      const O = '#edcfaa';
      const G = '#d7e9bd';
      const C = '#bfe7df';
      const V = '#c9d0f4';
      const W = '#d8d8d8';
      const P = '#edc8cf';
      const K = '#1a1a24';

      const sprites = [
        { name: 'Smiley', anim: 'sprite-breathe', map: ['..YYYY..', '.YYYYYY.', 'YYEYYEYY', 'YYYYYYYY', 'YYYYYYYY', 'YYDDDDYY', '.YYYYYY.', '..YYYY..'], colors: { Y, E: K, D: K }, blink: 'E', detail: 'D' },
        { name: 'Heart', anim: 'sprite-breathe', map: ['.RR..RR.', 'RRRRRRRR', 'RRRRRRRR', 'RRRRDRRR', '.RRRRRR.', '..RRRR..', '...RR...', '........'], colors: { R, D: W }, detail: 'D' },
        { name: 'Star', anim: 'sprite-flash', map: ['...YY...', '...DD...', 'YYYYYYYY', '.YYYYYY.', '..YYYY..', '.YY..YY.', 'YY....YY', '........'], colors: { Y, D: W }, detail: 'D' },
        { name: 'Fire', anim: 'sprite-flash', map: ['...O....', '..OOO...', '..OOOO..', '.OODDO..', 'OOYYYYO.', 'OOYDDYOO', '.OYYYYO.', '..OOOO..'], colors: { O, Y, D: W }, detail: 'D' },
        { name: 'Robot', anim: 'sprite-blink', map: ['.CCCCCC.', 'C.C..C.C', 'CCEEEECC', 'CCEEEECC', 'CCCCCCCC', '.CDDDDC.', '.C....C.', 'CC....CC'], colors: { C, E: K, D: K }, blink: 'E', detail: 'D' },
        { name: 'Ghost', anim: 'sprite-bounce', map: ['..WWWW..', '.WWWWWW.', 'WWEWWEWW', 'WWWWWWWW', 'WWWDDWWW', 'WWWWWWWW', 'W.WW.WW.', '.W..W..W'], colors: { W, E: K, D: P }, blink: 'E', detail: 'D' },
        { name: 'Lightning', anim: 'sprite-flash', map: ['....YY..', '...YY...', '..YY....', '.YYDD...', '....YY..', '...YY...', '..YY....', '.YY.....'], colors: { Y, D: W }, detail: 'D' },
        { name: 'Diamond', anim: 'sprite-spin', map: ['...CC...', '..CCCC..', '.CCDDCC.', 'CCDWWDCC', 'CCCCCCCC', '.CCCCCC.', '..CCCC..', '...CC...'], colors: { C, D: W, W }, detail: 'D' },
        { name: 'Skull', anim: 'sprite-blink', map: ['..WWWW..', '.WWWWWW.', 'WWEWWEWW', 'WWWWWWWW', 'WWDWWDWW', '.WWWWWW.', '.W.WW.W.', '..W..W..'], colors: { W, E: K, D: K }, blink: 'E', detail: 'D' },
        { name: 'Pacman', anim: 'sprite-flash', map: ['..YYYY..', '.YYYYYY.', 'YYYDD...', 'YYY.....', 'YYYY....', '.YYYYYY.', '..YYYY..', '........'], colors: { Y, D: K }, detail: 'D' },
        { name: 'Mushroom', anim: 'sprite-breathe', map: ['..RRRR..', '.RDDRRR.', 'RDDRRRRR', 'RRRRRRRR', 'RRRRRRRR', '..WWWW..', '..WWWW..', '..WWWW..'], colors: { R, W, D: W }, detail: 'D' },
        { name: 'Crown', anim: 'sprite-flash', map: ['Y..YY..Y', 'Y..YY..Y', 'YYYYYYYY', 'YDOYYODY', 'YYYYYYYY', 'YYYYYYYY', '........', '........'], colors: { Y, O, D: W }, detail: 'D' },
        { name: 'Rocket', anim: 'sprite-bounce', map: ['....C...', '...CCC..', '..CWWWC.', '..CWDWC.', '..CCCCC.', '..C.C.C.', '.O...O..', 'O.....O.'], colors: { C, W, O, D: O }, detail: 'D' },
        { name: 'Coin', anim: 'sprite-spin', map: ['..YYYY..', '.YYYYYY.', 'YYYOOYYY', 'YYYDDYYY', 'YYYDDYYY', 'YYYOOYYY', '.YYYYYY.', '..YYYY..'], colors: { Y, O, D: O }, detail: 'D' },
        { name: 'Bomb', anim: 'sprite-blink', map: ['......OY', '.....OD.', '....OO..', '..KKKK..', '.KKKKKK.', '.KKKKKK.', '.KKKKKK.', '..KKKK..'], colors: { K, O, Y, D: Y }, detail: 'D' },
        { name: 'Wave', anim: 'sprite-flash', map: ['........', '..CC.CC.', '.CCCCCCC', 'CC.CCC.C', 'CCCCCCCC', '.CCCCCC.', '..CCCC..', '........'], colors: { C } },
        { name: 'Cat', anim: 'sprite-breathe', map: ['V......V', 'VV....VV', 'VVVVVVVV', 'VEVVVVEV', 'VVVVVVVV', 'VVDVVDVV', '.VVVVVV.', '..V..V..'], colors: { V, E: Y, D: P }, blink: 'E', detail: 'D' },
        { name: 'Bug', anim: 'sprite-bounce', map: ['G......G', '.GGGGGG.', 'GGEEEEGG', 'GGGGGGGG', 'GGDDDDGG', '.GGGGGG.', 'G.G..G.G', 'G......G'], colors: { G, E: K, D: K }, blink: 'E', detail: 'D' },
        { name: 'Battery', anim: 'sprite-flash', map: ['........', '...WWW..', '.WWWWWWW', '.WGGGDGW', '.WGGGDGW', '.WWWWWWW', '........', '........'], colors: { W, G, D: W }, detail: 'D' },
        { name: 'Bell', anim: 'sprite-flash', map: ['...YY...', '..YYYY..', '.YYYYYY.', '.YDDDDY.', 'YYYYYYYY', 'YYYYYYYY', 'YYYYYYYY', '...OO...'], colors: { Y, O, D: W }, detail: 'D' },
      ];

      return sprites.map((s) => ({
        name: s.name,
        cls: `sprite ${s.anim}`,
        isSprite: true,
        map: s.map,
        colors: s.colors as unknown as Record<string, string>,
        blink: s.blink,
        detail: s.detail,
      }));
    }

    /* ---- mandala loaders ---- */
    function mandalaLoaders() {
      return [
        { name: 'Round', cls: 'pg-86', duration: 2, delay: (x: number, y: number) => { const d = euclidean(x, y); const ring = Math.round(d * 1.5); return -(ring / 5) * 2; } },
        { name: 'Square Mandala', cls: 'pg-87', duration: 2, delay: (x: number, y: number) => { const ring = Math.floor(chebyshev(x, y)); return -(ring / 4) * 2; } },
        { name: 'Diamond', cls: 'pg-88', duration: 2, delay: (x: number, y: number) => { const ring = Math.floor(manhattan(x, y)); return -(ring / 7) * 2; } },
        { name: 'Cross', cls: 'pg-89', duration: 1.8, skipMissing: true, delay: (x: number, y: number) => { const onAxis = (x === 3 || x === 4 || y === 3 || y === 4); if (!onAxis) return 999; const d = Math.max(Math.abs(x - 3.5), Math.abs(y - 3.5)); return -(d / 4) * 1.8; } },
        { name: 'X Diagonal', cls: 'pg-90', duration: 1.8, skipMissing: true, delay: (x: number, y: number) => { const onDiag = (x === y || x + y === 7); if (!onDiag) return 999; const d = Math.hypot(x - 3.5, y - 3.5); return -(d / 5) * 1.8; } },
        { name: 'Star Burst', cls: 'pg-91', duration: 2, skipMissing: true, delay: (x: number, y: number) => { const onAxis = (x === 3 || x === 4 || y === 3 || y === 4); const onDiag = (x === y || x + y === 7); if (!onAxis && !onDiag) return 999; const d = Math.hypot(x - 3.5, y - 3.5); return -(d / 5) * 2; } },
        { name: 'Petal', cls: 'pg-92', duration: 2.4, skipMissing: true, delay: (x: number, y: number) => { const mask = ['..PPPP..', '.P.PP.P.', 'PP.PP.PP', 'PPPPPPPP', 'PPPPPPPP', 'PP.PP.PP', '.P.PP.P.', '..PPPP..']; if (mask[y][x] !== 'P') return 999; const d = Math.hypot(x - 3.5, y - 3.5); return -(d / 5) * 2.4; } },
        { name: 'Snowflake', cls: 'pg-93', duration: 2.4, skipMissing: true, delay: (x: number, y: number) => { const mask = ['...SS...', 'S..SS..S', '.S.SS.S.', 'SSSSSSSS', 'SSSSSSSS', '.S.SS.S.', 'S..SS..S', '...SS...']; if (mask[y][x] !== 'S') return 999; const d = Math.hypot(x - 3.5, y - 3.5); return -(d / 5) * 2.4; } },
        { name: 'Gear', cls: 'pg-94', duration: 2, skipMissing: true, delay: (x: number, y: number) => { const mask = ['GG.GG.GG', 'GGGGGGGG', '.GG..GG.', 'GG.GG.GG', 'GG.GG.GG', '.GG..GG.', 'GGGGGGGG', 'GG.GG.GG']; if (mask[y][x] !== 'G') return 999; const d = Math.hypot(x - 3.5, y - 3.5); return -(d / 5) * 2; } },
        { name: 'Kaleido', cls: 'pg-95', duration: 2.4, delay: (x: number, y: number) => { const ring = Math.floor(chebyshev(x, y)); return -(ring / 4) * 2.4; } },
        { name: 'Spiral M.', cls: 'pg-96', duration: 2.4, delay: (x: number, y: number) => { const angle = Math.atan2(y - 3.5, x - 3.5); const norm = (angle + Math.PI) / (Math.PI * 2); return -norm * 2.4; } },
        { name: 'Pulse Square', cls: 'pg-97', duration: 1.8, delay: (x: number, y: number) => { const ring = Math.floor(chebyshev(x, y)); return -(ring / 8) * 1.8; } },
        { name: 'Check Mandala', cls: 'pg-98', duration: 1.8, skipMissing: true, delay: (x: number, y: number) => { if ((x + y) % 2 !== 0) return 999; const ring = Math.floor(chebyshev(x, y)); return -(ring / 4) * 1.8; } },
        { name: 'Octagon', cls: 'pg-99', duration: 2, skipMissing: true, delay: (x: number, y: number) => { const mask = ['..OOOO..', '.O....O.', 'O......O', 'O......O', 'O......O', 'O......O', '.O....O.', '..OOOO..']; if (mask[y][x] !== 'O') return 999; const angle = Math.atan2(y - 3.5, x - 3.5); const norm = (angle + Math.PI) / (Math.PI * 2); return -norm * 2; } },
        { name: 'Lotus', cls: 'pg-100', duration: 3, skipMissing: true, delay: (x: number, y: number) => { const mask = ['...LL...', '..LLLL..', '.LLLLLL.', 'LLLLLLLL', 'LLLLLLLL', '.LLLLLL.', '..LLLL..', '...LL...']; if (mask[y][x] !== 'L') return 999; const ring = Math.floor(chebyshev(x, y)); return -(ring / 4) * 3; } },
      ];
    }

    /* ---- loader registry ---- */
    const spiralOrd = spiralOrder(N);
    const knightOrd = knightTour(N);
    const hilbertOrd = hilbertOrder(N);
    const pongOrd = pongPath(N);

    type Loader = {
      name: string;
      cls?: string;
      duration?: number;
      delay?: (x: number, y: number, i: number) => number;
      isSprite?: boolean;
      isStory?: boolean;
      story?: unknown;
      map?: string[];
      colors?: Record<string, string>;
      blink?: string;
      detail?: string;
      skipNonBorder?: boolean;
      skipNonPath?: boolean;
      skipMissing?: boolean;
    };

    const loaders: Loader[] = [
      { name: 'Sweep', cls: 'pg-01', duration: 1.6, delay: (x) => -(x / N) * 1.6 },
      { name: 'Diagonal', cls: 'pg-02', duration: 1.8, delay: (x, y) => -((x + y) / (N * 2 - 2)) * 1.8 },
      { name: 'Ripple', cls: 'pg-03', duration: 1.6, delay: (x, y) => { const cx = 3.5, cy = 3.5; const d = Math.hypot(x - cx, y - cy); const maxD = Math.hypot(3.5, 3.5); return -(d / maxD) * 1.6; } },
      { name: 'Rain', cls: 'pg-04', duration: 1.8, delay: (x, y) => { const colOffsets = [0, 0.4, 0.8, 0.2, 0.6, 0.1, 0.5, 0.3]; return -((y / N) * 1.8 + colOffsets[x]); } },
      { name: 'Spiral', cls: 'pg-05', duration: 2.4, delay: (x, y) => { const idx = spiralOrd.indexOf(y * N + x); return -(idx / 64) * 2.4; } },
      { name: 'Snake', cls: 'pg-06', duration: 2.4, delay: (x, y) => { const colInRow = (y % 2 === 0) ? x : (N - 1 - x); const idx = y * N + colInRow; return -(idx / 64) * 2.4; } },
      { name: 'Sparkle', cls: 'pg-07', duration: 1.8, delay: (x, y, i) => { const r = Math.sin(i * 9301 + 49297) * 233280; return -((r - Math.floor(r)) * 1.8); } },
      { name: 'Heartbeat', cls: 'pg-08', duration: 1.2, delay: () => 0 },
      { name: 'Scanner', cls: 'pg-09', duration: 1.4, delay: (x, y) => -(y / N) * 1.4 },
      { name: 'Orbit', cls: 'pg-10', duration: 3.2, skipNonBorder: true, delay: (x, y) => { const isBorder = (x === 0 || x === N - 1 || y === 0 || y === N - 1); if (!isBorder) return 999; let idx; if (y === 0) idx = x; else if (x === N - 1) idx = (N - 1) + y; else if (y === N - 1) idx = (N - 1) * 2 + (N - 1 - x); else idx = (N - 1) * 3 + (N - 1 - y); const total = (N - 1) * 4; return -(idx / total) * 3.2; } },
      { name: 'Breathe', cls: 'pg-11', duration: 2.4, delay: (x, y) => { const ring = Math.min(x, y, N - 1 - x, N - 1 - y); return -(ring / 4) * 1.2; } },
      { name: 'Checker', cls: 'pg-12', duration: 1.4, delay: (x, y) => ((x + y) % 2 === 0) ? 0 : -0.7 },
      { name: 'Stripes', cls: 'pg-13', duration: 1.6, delay: (x, y) => -(((x + y) % 4) / 4) * 1.6 },
      { name: 'Falling', cls: 'pg-14', duration: 1.6, delay: (x, y) => -(y / N) * 0.8 - (x * 0.05) },
      { name: 'Plasma', cls: 'pg-15', duration: 3, delay: (x, y) => -((x + y) / (N * 2 - 2)) * 3 },
      { name: 'LoadBar', cls: 'pg-16', duration: 2.8, delay: (x, y) => -((y * N + x) / 64) * 2.8 },
      { name: 'Knight Tour', cls: 'pg-17', duration: 4, delay: (x, y) => { const idx = knightOrd.indexOf(y * N + x); return idx >= 0 ? -(idx / 64) * 4 : 0; } },
      { name: 'Hilbert', cls: 'pg-18', duration: 3.6, delay: (x, y) => { const idx = hilbertOrd.indexOf(y * N + x); return -(idx / 64) * 3.6; } },
      { name: 'Vortex', cls: 'pg-19', duration: 2.4, delay: (x, y) => { const cx = 3.5, cy = 3.5; const angle = Math.atan2(y - cy, x - cx); const r = Math.hypot(x - cx, y - cy) / 5; const t = ((angle + Math.PI) / (2 * Math.PI)) + r * 0.5; return -(t % 1) * 2.4; } },
      { name: 'Sine Wave', cls: 'pg-20', duration: 2, delay: (x, y) => { const wave = (Math.sin((x / N) * Math.PI * 2) * 0.5 + 0.5); const targetRow = wave * (N - 1); const dist = Math.abs(y - targetRow) / N; return -((x / N) - dist * 0.3) * 2; } },
      { name: 'Life', cls: 'pg-21', duration: 2, delay: (x, y) => { const phase = ((x * 3 + y * 5) % 8) / 8; return -phase * 2; } },
      { name: 'Quadrants', cls: 'pg-22', duration: 1.6, delay: (x, y) => { const q = (x < 4 ? 0 : 1) + (y < 4 ? 0 : 2); return -(q / 4) * 1.6; } },
      { name: 'Crossfade', cls: 'pg-23', duration: 1.8, delay: (x, y) => { const d1 = Math.abs(x - y); const d2 = Math.abs(x - (N - 1 - y)); const d = Math.min(d1, d2); return -(d / N) * 1.8; } },
      { name: 'Glider', cls: 'pg-24', duration: 1.8, delay: (x, y) => { const phase = ((x + y) % 4) / 4; return -phase * 1.8; } },
      { name: 'Matrix', cls: 'pg-25', duration: 2, delay: (x, y) => { const colSeed = [0, 0.3, 0.7, 0.1, 0.5, 0.9, 0.2, 0.6]; return -((y / N) * 2 + colSeed[x]); } },
      { name: 'Pong', cls: 'pg-26', duration: 2.6, skipNonPath: true, delay: (x, y) => { const idx = pongOrd.indexOf(y * N + x); return idx >= 0 ? -(idx / pongOrd.length) * 2.6 : 999; } },
      { name: 'Concentric', cls: 'pg-27', duration: 2, delay: (x, y) => { const ring = Math.min(x, y, N - 1 - x, N - 1 - y); return -(ring / 4) * 1 + (ring % 2) * 0.5; } },
      { name: 'Twin Spirals', cls: 'pg-28', duration: 3, delay: (x, y) => { const cx = 3.5, cy = 3.5; const angle = Math.atan2(y - cy, x - cx); const t = ((angle * 2 + Math.PI * 2) / (Math.PI * 2)) % 1; return -t * 3; } },
      { name: 'Thinking', cls: 'pg-29', duration: 2, delay: (x, y) => { const phase = Math.sin((y / N) * Math.PI) * 0.5 + 0.5; return -phase * 2 - (x * 0.04); } },
      { name: 'Searching', cls: 'pg-30', duration: 1.6, delay: (x, y) => { const sweep = (y / N) * 1.6; const focus = Math.abs(x - 3.5) / 4 * 0.3; return -(sweep + focus); } },
      { name: 'Finding', cls: 'pg-31', duration: 1.8, delay: (x, y) => { const cx = 3.5, cy = 3.5; const d = Math.hypot(x - cx, y - cy); const maxD = Math.hypot(3.5, 3.5); return -(1 - d / maxD) * 1.8; } },
      { name: 'Consolidating', cls: 'pg-32', duration: 2.2, delay: (x, y) => { const ring = Math.min(x, y, N - 1 - x, N - 1 - y); return -(ring / 4) * 2.2; } },
      { name: 'Streaming', cls: 'pg-33', duration: 1.4, delay: (x, y) => { const rowOffset = (y % 3) * 0.15; return -((x / N) * 1.4 + rowOffset); } },
      { name: 'Reasoning', cls: 'pg-34', duration: 2, delay: (x) => { const fromLeft = (x / N); const fromRight = ((N - 1 - x) / N); const t = Math.min(fromLeft, fromRight); return -(t * 2); } },
      { name: 'Indexing', cls: 'pg-35', duration: 1.6, delay: (x, y) => -((x / N) * 1.6 + (y * 0.02)) },
      { name: 'Connecting', cls: 'pg-36', duration: 2, delay: (x, y) => { const cx = 3.5, cy = 3.5; const d = Math.hypot(x - cx, y - cy); const maxD = Math.hypot(3.5, 3.5); return -(d / maxD) * 1 - ((x + y) % 2) * 0.5; } },
      { name: 'Generating', cls: 'pg-37', duration: 2.4, delay: (x, y) => { const idx = y * N + x; return -(idx / 64) * 2.4; } },
      { name: 'Reflecting', cls: 'pg-38', duration: 2, delay: (x, y) => { const fromTop = (y < 4) ? y : (N - 1 - y); return -(fromTop / 4) * 1 - (x * 0.05); } },
      // Scale-based
      { name: 'Scale Ripple', cls: 'pg-59', duration: 1.8, delay: (x, y) => { const cx = 3.5, cy = 3.5; const d = Math.hypot(x - cx, y - cy); const maxD = Math.hypot(3.5, 3.5); return -(d / maxD) * 1.8; } },
      { name: 'Scale Wave', cls: 'pg-60', duration: 1.6, delay: (x, y) => -((x + y * 0.3) / N) * 1.6 },
      { name: 'Scale Diag', cls: 'pg-61', duration: 2, delay: (x, y) => -((x + y) / (N * 2 - 2)) * 2 },
      { name: 'Scale Pop', cls: 'pg-62', duration: 1.6, delay: (x, y, i) => { const r = Math.sin(i * 9301 + 49297) * 233280; return -((r - Math.floor(r)) * 1.6); } },
      { name: 'Scale Ring', cls: 'pg-63', duration: 2, delay: (x, y) => { const ring = Math.min(x, y, N - 1 - x, N - 1 - y); return -(ring / 4) * 2; } },
      { name: 'Scale Check', cls: 'pg-64', duration: 1.4, delay: (x, y) => ((x + y) % 2 === 0) ? 0 : -0.7 },
      // Funky scale
      { name: 'Twist', cls: 'pg-65', duration: 2, delay: (x, y) => { const d = Math.hypot(x - 3.5, y - 3.5); return -(d / 5) * 2; } },
      { name: 'Squash', cls: 'pg-66', duration: 1.4, delay: (x) => -(x / N) * 1.4 },
      { name: 'Jelly', cls: 'pg-67', duration: 1.6, delay: (x, y) => -((x + y) / (N * 2)) * 1.6 },
      { name: 'Pop Rotate', cls: 'pg-68', duration: 2.4, delay: (x, y, i) => { const r = Math.sin(i * 12.9898 + 78.233) * 43758.5453; return -((r - Math.floor(r)) * 2.4); } },
      { name: 'Skew', cls: 'pg-69', duration: 1.8, delay: (x, y) => -(y / N) * 1.8 },
      { name: 'Heartbeat', cls: 'pg-70', duration: 1.4, delay: (x, y) => { const d = Math.hypot(x - 3.5, y - 3.5); return -(d / 6) * 1.4; } },
      { name: 'Drop', cls: 'pg-71', duration: 1.6, delay: (x, y) => -((x * 0.08 + y * 0.12)) },
      { name: 'Burst', cls: 'pg-72', duration: 1.2, delay: (x, y) => { const d = Math.hypot(x - 3.5, y - 3.5); return -(d / 6) * 1.2; } },
      { name: 'Spiral', cls: 'pg-73', duration: 2.4, delay: (x, y) => { const angle = Math.atan2(y - 3.5, x - 3.5); const norm = (angle + Math.PI) / (Math.PI * 2); return -norm * 2.4; } },
      { name: 'Zigzag', cls: 'pg-74', duration: 1.6, delay: (x, y) => { const offset = (y % 2 === 0) ? x : (N - 1 - x); return -(offset / N) * 1.6; } },
      ...emojiSprites(),
      ...mandalaLoaders(),
      ...STORIES.map((s: { name: string }) => ({ name: s.name, isStory: true, story: s })),
      ...COMM_LOADERS.map((s: { name: string }) => ({ name: s.name, isStory: true, story: s })),
    ];

    /* ---- tile builders ---- */
    function buildTile(L: Loader, globalIdx: number): HTMLElement {
      const tile = document.createElement('div');
      tile.className = 'tile';

      const stage = document.createElement('div');
      stage.style.cssText = 'flex:1;display:flex;align-items:center;justify-content:center;width:100%;';

      const matrix = document.createElement('div');
      matrix.className = `matrix ${L.cls}`;

      if (L.isSprite) {
        for (let i = 0; i < N * N; i++) {
          const x = i % N, y = Math.floor(i / N);
          const px = document.createElement('div');
          px.className = 'px';
          const ch = L.map![y]?.[x] || '.';
          if (ch !== '.' && L.colors![ch]) {
            px.classList.add('on');
            px.style.setProperty('--c', L.colors![ch]);
            if (L.blink && ch === L.blink) {
              px.classList.add('blink-eye');
            } else if (L.detail && ch === L.detail) {
              px.classList.add('detail');
              px.style.animationDelay = `${(x * 0.05 + y * 0.07).toFixed(2)}s`;
            } else {
              px.style.animationDelay = `${((x + y) * 0.08).toFixed(2)}s`;
            }
          }
          matrix.appendChild(px);
        }
      } else {
        for (let i = 0; i < N * N; i++) {
          const x = i % N, y = Math.floor(i / N);
          const px = document.createElement('div');
          px.className = 'px';
          const d = L.delay!(x, y, i);
          if ((L.skipNonBorder || L.skipNonPath || L.skipMissing) && d === 999) {
            px.style.animation = 'none';
          } else {
            px.style.animationDelay = `${d}s`;
          }
          matrix.appendChild(px);
        }
      }

      stage.appendChild(matrix);
      tile.appendChild(stage);

      const label = document.createElement('div');
      label.className = 'label';
      label.innerHTML = `<span class="num">${String(globalIdx + 1).padStart(2, '0')}</span><span class="name">${L.name}</span>`;
      tile.appendChild(label);
      return tile;
    }

    /* ---- pagination ---- */
    const grid = gridRef.current!;
    const PER_PAGE = 16;
    let currentPage = 0;
    const totalPages = Math.ceil(loaders.length / PER_PAGE);

    function renderPage(page: number) {
      cleanupRenderedTiles();
      grid.innerHTML = '';
      const start = page * PER_PAGE;
      const end = Math.min(start + PER_PAGE, loaders.length);
      for (let i = start; i < end; i++) {
        const L = loaders[i];
        if (L.isStory) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          grid.appendChild(watchTile(buildStoryTile(L.story as any, i)));
        } else {
          grid.appendChild(watchTile(buildTile(L, i)));
        }
      }
      if (pageInfoRef.current) pageInfoRef.current.textContent = `${page + 1} / ${totalPages}`;
      if (pageRangeRef.current) pageRangeRef.current.textContent = `${String(start + 1).padStart(2, '0')}–${String(end).padStart(2, '0')}`;
      if (prevBtnRef.current) prevBtnRef.current.disabled = page === 0;
      if (nextBtnRef.current) nextBtnRef.current.disabled = page >= totalPages - 1;

      const dots = pageDotsRef.current!;
      dots.innerHTML = '';
      for (let p = 0; p < totalPages; p++) {
        const d = document.createElement('button');
        d.className = 'page-dot' + (p === page ? ' active' : '');
        d.setAttribute('aria-label', `Page ${p + 1}`);
        d.onclick = () => { currentPage = p; renderPage(p); };
        dots.appendChild(d);
      }
    }

    const prevBtn = prevBtnRef.current!;
    const nextBtn = nextBtnRef.current!;

    const onPrev = () => { if (currentPage > 0) { currentPage--; renderPage(currentPage); } };
    const onNext = () => { if (currentPage < totalPages - 1) { currentPage++; renderPage(currentPage); } };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && currentPage > 0) { currentPage--; renderPage(currentPage); }
      if (e.key === 'ArrowRight' && currentPage < totalPages - 1) { currentPage++; renderPage(currentPage); }
    };

    prevBtn.addEventListener('click', onPrev);
    nextBtn.addEventListener('click', onNext);
    document.addEventListener('keydown', onKey);

    renderPage(0);

    return () => {
      cleanupRenderedTiles();
      visibilityObserver?.disconnect();
      prevBtn.removeEventListener('click', onPrev);
      nextBtn.removeEventListener('click', onNext);
      document.removeEventListener('keydown', onKey);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return (
    <>
      <header className="header">
        <div>
          <div className="brand">
            <div className="brand-mark">
              <i /><i /><i /><i /><i /><i /><i /><i /><i />
            </div>
            <span>PIXEL LOADERS / 8×8 / V1.0</span>
          </div>
          <div className="title-block">
            <h1>
              One hundred <em>pixel</em> loaders.<br />One 8×8 grid each.
            </h1>
            <p>
              A library of 8×8 matrix loading animations. Every loader is built on the same 64-pixel
              grid — only the timing function and per-pixel delay change. Pure CSS, paint-light,
              and tuned for calmer motion.
            </p>
          </div>
        </div>
        <div className="meta">
          <span>
            <span className="dot-live" />
            LIVE
          </span>
          <span>100 / 100</span>
          <span>8×8 · COMPACT</span>
        </div>
      </header>

      <main className="grid" ref={gridRef} />

      <nav className="pagination">
        <button className="page-btn" ref={prevBtnRef} aria-label="Previous page">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>PREV</span>
        </button>
        <div className="page-status">
          <span className="page-range" ref={pageRangeRef}>01–16</span>
          <div className="page-dots" ref={pageDotsRef} />
          <span className="page-info" ref={pageInfoRef}>1 / 9</span>
        </div>
        <button className="page-btn" ref={nextBtnRef} aria-label="Next page">
          <span>NEXT</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5 2L10 7L5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </nav>

      <footer className="footer">
        <span>PIXEL LOADERS · 8×8 ANIMATION LIBRARY</span>
        <span>PURE CSS · LOW GLOW · COMPACT MOTION</span>
      </footer>
    </>
  );
}
