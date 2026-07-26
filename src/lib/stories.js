/* ============================================
   STORY LOADERS — multi-frame 8×8 sprite cycles
   ============================================
   Each story is an array of 8-row frame strings.
   The buildStoryTile() function swaps frames at
   stepped intervals so the whole grid animates
   like a tiny film. Color codes:
     . = off       Y = yellow      W = white
     R = red       O = orange      G = green
     C = cyan      B = blue        M = magenta
     V = violet    P = pink        N = mint
     K = dark      S = stone/gray  T = tan/skin
     E = earth     L = leaf
============================================ */

const STORY_PALETTE = {
  Y: '#eee5b7',
  R: '#e7b8bf',
  O: '#edcfaa',
  G: '#d7e9bd',
  C: '#bfe7df',
  B: '#bcccf0',
  M: '#e7c6df',
  V: '#c9d0f4',
  P: '#edc8cf',
  N: '#bee8dc',
  W: '#d8d8d8',
  K: '#1a1a24',
  S: '#7a7a8c',
  T: '#d7bea7',
  E: '#8b7363',
  L: '#b3d6a6',
};

/* ===== STORY 1: MOUNTAIN CLIMBER =====
   Dot climbs a stone mountain, plants red flag at peak,
   slides back down, climbs again. ~5s loop. */
const STORY_MOUNTAIN = {
  name: 'Mountain',
  duration: 5,
  frames: [
    // Frame 0: climber at base
    [
      '........',
      '....S...',
      '...SSS..',
      '..SSSSS.',
      '..SSSSS.',
      '.SSSSSSS',
      'YSSSSSSS',
      'SSSSSSSS',
    ],
    // Frame 1: climbing 1
    [
      '........',
      '....S...',
      '...SSS..',
      '..SSSSS.',
      '.YSSSSS.',
      '.SSSSSSS',
      '.SSSSSSS',
      'SSSSSSSS',
    ],
    // Frame 2: climbing 2
    [
      '........',
      '....S...',
      '...SSS..',
      '..YSSSS.',
      '..SSSSS.',
      '.SSSSSSS',
      '.SSSSSSS',
      'SSSSSSSS',
    ],
    // Frame 3: near top
    [
      '........',
      '....S...',
      '...YSS..',
      '..SSSSS.',
      '..SSSSS.',
      '.SSSSSSS',
      '.SSSSSSS',
      'SSSSSSSS',
    ],
    // Frame 4: at peak — flag planted
    [
      '....R...',
      '....R...',
      '....RYS.',
      '..SSSSS.',
      '..SSSSS.',
      '.SSSSSSS',
      '.SSSSSSS',
      'SSSSSSSS',
    ],
    // Frame 5: flag waves
    [
      '....RR..',
      '....R...',
      '....RYS.',
      '..SSSSS.',
      '..SSSSS.',
      '.SSSSSSS',
      '.SSSSSSS',
      'SSSSSSSS',
    ],
    // Frame 6: sliding down
    [
      '....R...',
      '....R...',
      '....RSS.',
      '..SSYSS.',
      '..SSSSS.',
      '.SSSSSSS',
      '.SSSSSSS',
      'SSSSSSSS',
    ],
    // Frame 7: sliding fast
    [
      '....R...',
      '....R...',
      '....RSS.',
      '..SSSSS.',
      '..SSSSS.',
      '.SSYSSSS',
      '.SSSSSSS',
      'SSSSSSSS',
    ],
    // Frame 8: back at base
    [
      '....R...',
      '....R...',
      '....RSS.',
      '..SSSSS.',
      '..SSSSS.',
      '.SSSSSSS',
      'YSSSSSSS',
      'SSSSSSSS',
    ],
  ],
};

/* ===== STORY 2: FISHING =====
   Person on dock casts line, waits, fish bites, reels in. */
const STORY_FISHING = {
  name: 'Fishing',
  duration: 4.5,
  frames: [
    // Frame 0: cast — line out
    [
      '..T.....',
      '..TT.K..',
      '..TKK...',
      '...K....',
      '....K...',
      '.....K..',
      'CCCCCKCC',
      'CCCCCCCC',
    ],
    // Frame 1: line in water
    [
      '..T.....',
      '..TT.K..',
      '..TKK...',
      '...K....',
      '....K...',
      '.....K..',
      'CCCCCKCC',
      'CCCCCCKC',
    ],
    // Frame 2: waiting (ripples)
    [
      '..T.....',
      '..TT.K..',
      '..TKK...',
      '...K....',
      '....K...',
      '.....K..',
      'CCCCCKCC',
      'CCCCCCKC',
    ],
    // Frame 3: fish approaches
    [
      '..T.....',
      '..TT.K..',
      '..TKK...',
      '...K....',
      '....K...',
      '..O..K..',
      'CCCCCKCC',
      'CCCCCCKC',
    ],
    // Frame 4: bite!
    [
      '..T.....',
      '..TT.K..',
      '..TKK...',
      '...K....',
      '....K...',
      '.....KO.',
      'CCCCCKOC',
      'CCCCCCCC',
    ],
    // Frame 5: reeling in
    [
      '..T.....',
      '..TT.K..',
      '..TKKO..',
      '...KO...',
      '....K...',
      '.....K..',
      'CCCCCKCC',
      'CCCCCCCC',
    ],
    // Frame 6: fish caught
    [
      '..T.....',
      '..TTOK..',
      '..TKK...',
      '...K....',
      '....K...',
      '.....K..',
      'CCCCCKCC',
      'CCCCCCCC',
    ],
    // Frame 7: holding fish up
    [
      '..TO....',
      '..TT.K..',
      '..TKK...',
      '...K....',
      '....K...',
      '.....K..',
      'CCCCCKCC',
      'CCCCCCCC',
    ],
  ],
};

/* ===== STORY 3: TREADMILL =====
   Character walks but is moving backward. Belt arrows scroll right,
   character drifts left. */
const STORY_TREADMILL = {
  name: 'Treadmill',
  duration: 3.6,
  frames: [
    // Frame 0
    [
      '........',
      '......T.',
      '.....TTT',
      '......T.',
      '.....TKT',
      '......T.',
      'KKKKKKKK',
      '>...>...',
    ],
    // Frame 1: legs swap, belt scrolls
    [
      '........',
      '......T.',
      '.....TTT',
      '......T.',
      '.....TKT',
      '......T.',
      'KKKKKKKK',
      '.>...>..',
    ],
    // Frame 2: char drifted left
    [
      '........',
      '.....T..',
      '....TTT.',
      '.....T..',
      '....TKT.',
      '.....T..',
      'KKKKKKKK',
      '..>...>.',
    ],
    // Frame 3
    [
      '........',
      '.....T..',
      '....TTT.',
      '.....T..',
      '....TKT.',
      '.....T..',
      'KKKKKKKK',
      '...>...>',
    ],
    // Frame 4: drifted further
    [
      '........',
      '....T...',
      '...TTT..',
      '....T...',
      '...TKT..',
      '....T...',
      'KKKKKKKK',
      '>...>...',
    ],
    // Frame 5
    [
      '........',
      '....T...',
      '...TTT..',
      '....T...',
      '...TKT..',
      '....T...',
      'KKKKKKKK',
      '.>...>..',
    ],
    // Frame 6: nearly fell off
    [
      '........',
      '...T....',
      '..TTT...',
      '...T....',
      '..TKT...',
      '...T....',
      'KKKKKKKK',
      '..>...>.',
    ],
    // Frame 7: snapped back to start
    [
      '........',
      '......T.',
      '.....TTT',
      '......T.',
      '.....TKT',
      '......T.',
      'KKKKKKKK',
      '...>...>',
    ],
  ],
};

/* ===== STORY 4: PANCAKE CHEF =====
   Chef tosses pancake. Sometimes catches, sometimes drops. */
const STORY_CHEF = {
  name: 'Chef',
  duration: 4,
  frames: [
    // Frame 0: pan held flat
    [
      '...W....',
      '..WTW...',
      '...T....',
      '..TTT...',
      '...T....',
      'OOOOOO..',
      'KKKKKKK.',
      '........',
    ],
    // Frame 1: tilt up — pancake leaving pan
    [
      '...W....',
      '..WTW...',
      '...T.O..',
      '..TTTOO.',
      '...T....',
      '..OOOOOO',
      '..KKKKKK',
      '........',
    ],
    // Frame 2: pancake mid-air
    [
      '...W.OO.',
      '..WTWO..',
      '...T....',
      '..TTT...',
      '...T....',
      'OOOOOO..',
      'KKKKKKK.',
      '........',
    ],
    // Frame 3: pancake at peak
    [
      '....OO..',
      '..W.O...',
      '..WTW...',
      '...T....',
      '..TTT...',
      '...T....',
      'OOOOOOKK',
      '........',
    ],
    // Frame 4: pancake falling
    [
      '...W....',
      '..WTW...',
      '...T.OO.',
      '..TTTO..',
      '...T....',
      'OOOOOO..',
      'KKKKKKK.',
      '........',
    ],
    // Frame 5: caught!
    [
      '...W....',
      '..WTW...',
      '...T....',
      '..TTT...',
      '...T....',
      'OOOOOO..',
      'OOOOOO..',
      'KKKKKKKK',
    ],
    // Frame 6: toss again
    [
      '...W....',
      '..WTW...',
      '...T.O..',
      '..TTTO..',
      '...T....',
      'OOOOOO..',
      'KKKKKKK.',
      '........',
    ],
    // Frame 7: dropped on floor (sad face)
    [
      '...W....',
      '..WKW...',
      '...T....',
      '..TTT...',
      '...T....',
      'OOOOOO..',
      'KKKKKKK.',
      '...OO...',
    ],
  ],
};

/* ===== STORY 5: PLANT LIFECYCLE =====
   Seed → sprout → grown → bloom → wilt → seed drops → repeat. */
const STORY_PLANT = {
  name: 'Plant',
  duration: 5,
  frames: [
    // Frame 0: seed in dirt
    [
      '........',
      '........',
      '........',
      '........',
      '........',
      '........',
      '...Y....',
      'EEEEEEEE',
    ],
    // Frame 1: sprout
    [
      '........',
      '........',
      '........',
      '........',
      '........',
      '...L....',
      '...L....',
      'EEEEEEEE',
    ],
    // Frame 2: grown
    [
      '........',
      '........',
      '........',
      '...L....',
      '..LLL...',
      '...L....',
      '...L....',
      'EEEEEEEE',
    ],
    // Frame 3: budding
    [
      '........',
      '...P....',
      '..LPL...',
      '...L....',
      '..LLL...',
      '...L....',
      '...L....',
      'EEEEEEEE',
    ],
    // Frame 4: bloomed!
    [
      '..PPP...',
      '.PYYYP..',
      '..PPP...',
      '...L....',
      '..LLL...',
      '...L....',
      '...L....',
      'EEEEEEEE',
    ],
    // Frame 5: full bloom (frame held)
    [
      '.PPMPP..',
      'PMYYYMP.',
      '.PPMPP..',
      '...L....',
      '..LLL...',
      '...L....',
      '...L....',
      'EEEEEEEE',
    ],
    // Frame 6: wilting
    [
      '........',
      '..PPP...',
      '.PYYP...',
      '..PPL...',
      '...LL...',
      '...L....',
      '...L....',
      'EEEEEEEE',
    ],
    // Frame 7: petals falling
    [
      '........',
      '........',
      '...P....',
      '....P.P.',
      '...LL...',
      '..L.L...',
      '...L....',
      'EEEEEEEE',
    ],
    // Frame 8: seed dropped
    [
      '........',
      '........',
      '........',
      '........',
      '........',
      '........',
      '..Y.Y...',
      'EEEEEEEE',
    ],
  ],
};

/* ===== STORY 6: ASTRONAUT =====
   Astronaut floats, tether visible, drifts further then yanked back. */
const STORY_ASTRONAUT = {
  name: 'Astronaut',
  duration: 5,
  frames: [
    // Frame 0: near ship, calm
    [
      'WW......',
      'WK......',
      'WW......',
      'W.K.....',
      '...K....',
      '....WCW.',
      '....WWW.',
      '.....W..',
    ],
    // Frame 1: drifting
    [
      'WW......',
      'WK......',
      'WW......',
      'W.K.....',
      '...KK...',
      '.....WCW',
      '.....WWW',
      '......W.',
    ],
    // Frame 2: drifting more
    [
      'WW......',
      'WK......',
      'WW......',
      'W.KK....',
      '...KKK..',
      '......WC',
      '......WW',
      '.......W',
    ],
    // Frame 3: tether stretched
    [
      'WW......',
      'WK......',
      'WW......',
      'W.KKK...',
      '...KKKK.',
      '.......W',
      '.......W',
      '........',
    ],
    // Frame 4: floating tilted
    [
      'WW......',
      'WK......',
      'WW......',
      'W.KKK...',
      '...KKKK.',
      '......CW',
      '......WW',
      '.......W',
    ],
    // Frame 5: tether snaps taut
    [
      'WW......',
      'WK......',
      'WW......',
      'W.KKKK..',
      '...KKK..',
      '.....WC.',
      '.....WW.',
      '......W.',
    ],
    // Frame 6: yanked back
    [
      'WW......',
      'WK......',
      'WW......',
      'W.KK....',
      '...KK...',
      '....WC..',
      '....WW..',
      '.....W..',
    ],
    // Frame 7: back home
    [
      'WW......',
      'WK......',
      'WW......',
      'W.K.....',
      '...K....',
      '....WCW.',
      '....WWW.',
      '.....W..',
    ],
  ],
};

const STORIES = [
  STORY_MOUNTAIN,
  STORY_FISHING,
  STORY_TREADMILL,
  STORY_CHEF,
  STORY_PLANT,
  STORY_ASTRONAUT,
];

/* ===== COMMUNICATION SPRITES =====
   Smaller frame counts, faster loops — these read as icons, not stories. */

const COMM_ENVELOPE = {
  name: 'Envelope',
  duration: 1.6,
  frames: [
    // Frame 0: closed envelope
    [
      '........',
      '.WWWWWW.',
      '.WKWWKW.',
      '.WWKKWW.',
      '.WWWWWW.',
      '.WWWWWW.',
      '.WWWWWW.',
      '........',
    ],
    // Frame 1: flap lifting
    [
      '........',
      '.WK..KW.',
      '.WWKKWW.',
      '.WKWWKW.',
      '.WWWWWW.',
      '.WWWWWW.',
      '.WWWWWW.',
      '........',
    ],
    // Frame 2: flap open, letter peeking
    [
      '.W....W.',
      '.WW..WW.',
      '.WWWWWW.',
      '.WYYYYW.',
      '.WYYYYW.',
      '.WWWWWW.',
      '.WWWWWW.',
      '........',
    ],
    // Frame 3: flap fully open with letter
    [
      'WW....WW',
      '.WW..WW.',
      '.WWWWWW.',
      '.WYYYYW.',
      '.WYRRYW.',
      '.WYYYYW.',
      '.WWWWWW.',
      '........',
    ],
    // Frame 4: flap closing
    [
      '........',
      '.WW..WW.',
      '.WWKKWW.',
      '.WYYYYW.',
      '.WYYYYW.',
      '.WWWWWW.',
      '.WWWWWW.',
      '........',
    ],
  ],
};

const COMM_BUBBLE = {
  name: 'Speech Bubble',
  duration: 1.2,
  frames: [
    // Frame 0: dot 1
    [
      '.WWWWWW.',
      'WWWWWWWW',
      'WWWWWWWW',
      'WWCKWWWW',
      'WWWWWWWW',
      'WWWWWWWW',
      '.WWWWWW.',
      '..WW....',
    ],
    // Frame 1: dot 2
    [
      '.WWWWWW.',
      'WWWWWWWW',
      'WWWWWWWW',
      'WWWKCKWW',
      'WWWWWWWW',
      'WWWWWWWW',
      '.WWWWWW.',
      '..WW....',
    ],
    // Frame 2: dot 3
    [
      '.WWWWWW.',
      'WWWWWWWW',
      'WWWWWWWW',
      'WWWWWWCK',
      'WWWWWWWW',
      'WWWWWWWW',
      '.WWWWWW.',
      '..WW....',
    ],
    // Frame 3: all three
    [
      '.WWWWWW.',
      'WWWWWWWW',
      'WWWWWWWW',
      'WWKWKWKW',
      'WWWWWWWW',
      'WWWWWWWW',
      '.WWWWWW.',
      '..WW....',
    ],
  ],
};

const COMM_PHONE = {
  name: 'Phone',
  duration: 0.9,
  frames: [
    // Frame 0: phone resting
    [
      '........',
      '.GG..GG.',
      '.GGGGGG.',
      '..GGGG..',
      '..GGGG..',
      '..GGGG..',
      '.GGGGGG.',
      '.GG..GG.',
    ],
    // Frame 1: small wiggle + tiny waves
    [
      '........',
      '.GG..GG.',
      'GGGGGGGG',
      '.GGGGGG.',
      'YGGGGGGY',
      '.GGGGGG.',
      'GGGGGGGG',
      '.GG..GG.',
    ],
    // Frame 2: ring! big waves
    [
      'Y......Y',
      '.YGG.GGY',
      'YGGGGGGY',
      'GGGGGGGG',
      'YGGGGGGY',
      'GGGGGGGG',
      '.YGGGGY.',
      'YYG..GYY',
    ],
    // Frame 3: waves pulse out
    [
      'Y......Y',
      'Y.GG.GG.',
      '.GGGGGG.',
      'YGGGGGGY',
      '.GGGGGG.',
      'YGGGGGGY',
      '.GGGGGG.',
      'YGG..GGY',
    ],
  ],
};

const COMM_BELL_SWING = {
  name: 'Bell Swing',
  duration: 1.6,
  frames: [
    // Frame 0: tilted left, wave on right
    [
      '..YY....',
      '.YYYY...',
      'YYYYYY..',
      'YYYYYY.C',
      'YYYYYYYY',
      'YYYYYY.C',
      'YYYYYY..',
      '...OO...',
    ],
    // Frame 1: centered, both waves
    [
      '...YY...',
      '..YYYY..',
      '.YYYYYY.',
      'CYYYYYYC',
      'YYYYYYYY',
      'CYYYYYYC',
      'YYYYYYYY',
      '...OO...',
    ],
    // Frame 2: tilted right, wave on left
    [
      '....YY..',
      '...YYYY.',
      '..YYYYYY',
      'C.YYYYYY',
      'YYYYYYYY',
      'C.YYYYYY',
      '..YYYYYY',
      '....OO..',
    ],
    // Frame 3: centered, larger waves
    [
      '...YY...',
      '..YYYY..',
      '.YYYYYY.',
      'YYYYYYYY',
      'YYYYYYYY',
      'YYYYYYYY',
      'CYYYYYYC',
      'C..OO..C',
    ],
  ],
};

const COMM_AT = {
  name: 'At Symbol',
  duration: 2.4,
  frames: [
    // Frame 0: tiny center dot
    [
      '........',
      '........',
      '........',
      '...CC...',
      '...CC...',
      '........',
      '........',
      '........',
    ],
    // Frame 1: small ring forming
    [
      '........',
      '........',
      '...CC...',
      '..C..C..',
      '..C.CC..',
      '...CC...',
      '........',
      '........',
    ],
    // Frame 2: medium ring
    [
      '........',
      '..CCCC..',
      '.C....C.',
      '.C.CCCC.',
      '.C.C..C.',
      '.C..CCC.',
      '..CCCC..',
      '........',
    ],
    // Frame 3: full @ symbol
    [
      '..CCCC..',
      '.C....C.',
      'C..CC..C',
      'C.C..C.C',
      'C.C..CCC',
      'C..CCC..',
      '.C......',
      '..CCCC..',
    ],
    // Frame 4: full symbol holds
    [
      '..CCCC..',
      '.C....C.',
      'C..CC..C',
      'C.C..C.C',
      'C.C..CCC',
      'C..CCC..',
      '.C......',
      '..CCCC..',
    ],
    // Frame 5: spiral fading
    [
      '........',
      '..CCCC..',
      '.C....C.',
      '.C.CCCC.',
      '.C.C..C.',
      '.C..CCC.',
      '..CCCC..',
      '........',
    ],
    // Frame 6: small ring
    [
      '........',
      '........',
      '...CC...',
      '..C..C..',
      '..C.CC..',
      '...CC...',
      '........',
      '........',
    ],
  ],
};

const COMM_LOADERS = [
  COMM_ENVELOPE,
  COMM_BUBBLE,
  COMM_PHONE,
  COMM_BELL_SWING,
  COMM_AT,
];

/* Build a story tile — swaps frames only while the tile is active. */
function buildStoryTile(story, globalIdx) {
  const tile = document.createElement('div');
  tile.className = 'tile';

  const stage = document.createElement('div');
  stage.style.cssText = 'flex:1;display:flex;align-items:center;justify-content:center;width:100%;';

  const matrix = document.createElement('div');
  matrix.className = 'matrix sprite story';

  // Build 64 pixel divs once
  const pixels = [];
  for (let i = 0; i < 64; i++) {
    const px = document.createElement('div');
    px.className = 'px';
    matrix.appendChild(px);
    pixels.push(px);
  }

  const frameCount = story.frames.length;
  const frameDuration = (story.duration * 1000) / frameCount;
  let currentFrame = 0;
  let timerId = null;

  function renderFrame(idx) {
    const frame = story.frames[idx];
    for (let y = 0; y < 8; y++) {
      const row = frame[y] || '........';
      for (let x = 0; x < 8; x++) {
        const ch = row[x] || '.';
        const px = pixels[y * 8 + x];
        if (ch === '.' || !STORY_PALETTE[ch]) {
          px.classList.remove('on');
          px.style.removeProperty('--c');
        } else {
          px.classList.add('on');
          px.style.setProperty('--c', STORY_PALETTE[ch]);
        }
      }
    }
  }

  // Render first frame immediately so the tile is never blank
  renderFrame(0);

  const start = () => {
    if (timerId !== null) return;
    timerId = window.setInterval(() => {
      if (!tile.isConnected) {
        stop();
        return;
      }
      if (tile.classList.contains('is-paused') || document.hidden) return;
      currentFrame = (currentFrame + 1) % frameCount;
      renderFrame(currentFrame);
    }, frameDuration);
  };

  const stop = () => {
    if (timerId === null) return;
    window.clearInterval(timerId);
    timerId = null;
  };

  start();

  tile.addEventListener('loader:resume', start);
  tile.addEventListener('loader:pause', stop);
  tile._cleanupStory = () => {
    stop();
    tile.removeEventListener('loader:resume', start);
    tile.removeEventListener('loader:pause', stop);
  };

  tile._renderNextStoryFrame = () => {
    currentFrame = (currentFrame + 1) % frameCount;
    renderFrame(currentFrame);
  };

  stage.appendChild(matrix);
  tile.appendChild(stage);

  const label = document.createElement('div');
  label.className = 'label';
  label.innerHTML = `<span class="num">${String(globalIdx + 1).padStart(2, '0')}</span><span class="name">${story.name}</span>`;
  tile.appendChild(label);
  return tile;
}

export { STORY_PALETTE, STORIES, COMM_LOADERS, buildStoryTile };
