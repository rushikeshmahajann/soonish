'use client';

// Component inspired by github.com/zavalit/bayer-dithering-webgl-demo
//
// Rendered with OGL rather than three.js + postprocessing. The effect is one
// full-screen shader, so three's scene graph and the postprocessing composer
// were ~150 KB gzipped of runtime for what OGL does in a fraction of that.
// The liquid and noise post-passes went with them — nothing used them.

import { Color, Mesh, Program, Renderer, Triangle } from 'ogl';
import React, { useEffect, useRef } from 'react';
import { parseOklch } from '@/lib/color';
import './PixelBlast.css';

// OGL's Color parses hex and a few names, not oklch(). Site colours are all
// oklch, so resolve them to channels here and let OGL handle anything else.
const toColor = (value: string) => {
  const rgb = parseOklch(value);
  return rgb ? new Color([rgb[0], rgb[1], rgb[2]]) : new Color(value);
};

type PixelBlastVariant = 'square' | 'circle' | 'triangle' | 'diamond';

type PixelBlastProps = {
  variant?: PixelBlastVariant;
  pixelSize?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
  antialias?: boolean;
  patternScale?: number;
  patternDensity?: number;
  pixelSizeJitter?: number;
  enableRipples?: boolean;
  rippleIntensityScale?: number;
  rippleThickness?: number;
  rippleSpeed?: number;
  autoPauseOffscreen?: boolean;
  speed?: number;
  transparent?: boolean;
  edgeFade?: number;
};

const SHAPE_MAP: Record<PixelBlastVariant, number> = {
  square: 0,
  circle: 1,
  triangle: 2,
  diamond: 3
};

const MAX_CLICKS = 10;

const VERTEX_SRC = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAGMENT_SRC = `#version 300 es
precision highp float;

uniform vec3  uColor;
uniform vec2  uResolution;
uniform float uTime;
uniform float uPixelSize;
uniform float uScale;
uniform float uDensity;
uniform float uPixelJitter;
uniform int   uEnableRipples;
uniform float uRippleSpeed;
uniform float uRippleThickness;
uniform float uRippleIntensity;
uniform float uEdgeFade;

uniform int   uShapeType;
const int SHAPE_SQUARE   = 0;
const int SHAPE_CIRCLE   = 1;
const int SHAPE_TRIANGLE = 2;
const int SHAPE_DIAMOND  = 3;

const int   MAX_CLICKS = ${MAX_CLICKS};

uniform vec2  uClickPos  [MAX_CLICKS];
uniform float uClickTimes[MAX_CLICKS];

out vec4 fragColor;

float Bayer2(vec2 a) {
  a = floor(a);
  return fract(a.x / 2. + a.y * a.y * .75);
}
#define Bayer4(a) (Bayer2(.5*(a))*0.25 + Bayer2(a))
#define Bayer8(a) (Bayer4(.5*(a))*0.25 + Bayer2(a))

#define FBM_OCTAVES     5
#define FBM_LACUNARITY  1.25
#define FBM_GAIN        1.0

float hash11(float n){ return fract(sin(n)*43758.5453); }

float vnoise(vec3 p){
  vec3 ip = floor(p);
  vec3 fp = fract(p);
  float n000 = hash11(dot(ip + vec3(0.0,0.0,0.0), vec3(1.0,57.0,113.0)));
  float n100 = hash11(dot(ip + vec3(1.0,0.0,0.0), vec3(1.0,57.0,113.0)));
  float n010 = hash11(dot(ip + vec3(0.0,1.0,0.0), vec3(1.0,57.0,113.0)));
  float n110 = hash11(dot(ip + vec3(1.0,1.0,0.0), vec3(1.0,57.0,113.0)));
  float n001 = hash11(dot(ip + vec3(0.0,0.0,1.0), vec3(1.0,57.0,113.0)));
  float n101 = hash11(dot(ip + vec3(1.0,0.0,1.0), vec3(1.0,57.0,113.0)));
  float n011 = hash11(dot(ip + vec3(0.0,1.0,1.0), vec3(1.0,57.0,113.0)));
  float n111 = hash11(dot(ip + vec3(1.0,1.0,1.0), vec3(1.0,57.0,113.0)));
  vec3 w = fp*fp*fp*(fp*(fp*6.0-15.0)+10.0);
  float x00 = mix(n000, n100, w.x);
  float x10 = mix(n010, n110, w.x);
  float x01 = mix(n001, n101, w.x);
  float x11 = mix(n011, n111, w.x);
  float y0  = mix(x00, x10, w.y);
  float y1  = mix(x01, x11, w.y);
  return mix(y0, y1, w.z) * 2.0 - 1.0;
}

float fbm2(vec2 uv, float t){
  vec3 p = vec3(uv * uScale, t);
  float amp = 1.0;
  float freq = 1.0;
  float sum = 1.0;
  for (int i = 0; i < FBM_OCTAVES; ++i){
    sum  += amp * vnoise(p * freq);
    freq *= FBM_LACUNARITY;
    amp  *= FBM_GAIN;
  }
  return sum * 0.5 + 0.5;
}

float maskCircle(vec2 p, float cov){
  float r = sqrt(cov) * .25;
  float d = length(p - 0.5) - r;
  float aa = 0.5 * fwidth(d);
  return cov * (1.0 - smoothstep(-aa, aa, d * 2.0));
}

float maskTriangle(vec2 p, vec2 id, float cov){
  bool flip = mod(id.x + id.y, 2.0) > 0.5;
  if (flip) p.x = 1.0 - p.x;
  float r = sqrt(cov);
  float d  = p.y - r*(1.0 - p.x);
  float aa = fwidth(d);
  return cov * clamp(0.5 - d/aa, 0.0, 1.0);
}

float maskDiamond(vec2 p, float cov){
  float r = sqrt(cov) * 0.564;
  return step(abs(p.x - 0.49) + abs(p.y - 0.49), r);
}

void main(){
  float pixelSize = uPixelSize;
  vec2 fragCoord = gl_FragCoord.xy - uResolution * .5;
  float aspectRatio = uResolution.x / uResolution.y;

  vec2 pixelId = floor(fragCoord / pixelSize);
  vec2 pixelUV = fract(fragCoord / pixelSize);

  float cellPixelSize = 8.0 * pixelSize;
  vec2 cellId = floor(fragCoord / cellPixelSize);
  vec2 cellCoord = cellId * cellPixelSize;
  vec2 uv = cellCoord / uResolution * vec2(aspectRatio, 1.0);

  float base = fbm2(uv, uTime * 0.05);
  base = base * 0.5 - 0.65;

  float feed = base + (uDensity - 0.5) * 0.3;

  float speed     = uRippleSpeed;
  float thickness = uRippleThickness;
  const float dampT     = 1.0;
  const float dampR     = 10.0;

  if (uEnableRipples == 1) {
    for (int i = 0; i < MAX_CLICKS; ++i){
      vec2 pos = uClickPos[i];
      if (pos.x < 0.0) continue;
      float cellPixelSize = 8.0 * pixelSize;
      vec2 cuv = (((pos - uResolution * .5 - cellPixelSize * .5) / (uResolution))) * vec2(aspectRatio, 1.0);
      float t = max(uTime - uClickTimes[i], 0.0);
      float r = distance(uv, cuv);
      float waveR = speed * t;
      float ring  = exp(-pow((r - waveR) / thickness, 2.0));
      float atten = exp(-dampT * t) * exp(-dampR * r);
      feed = max(feed, ring * atten * uRippleIntensity);
    }
  }

  float bayer = Bayer8(fragCoord / uPixelSize) - 0.5;
  float bw = step(0.5, feed + bayer);

  float h = fract(sin(dot(floor(fragCoord / uPixelSize), vec2(127.1, 311.7))) * 43758.5453);
  float jitterScale = 1.0 + (h - 0.5) * uPixelJitter;
  float coverage = bw * jitterScale;
  float M;
  if      (uShapeType == SHAPE_CIRCLE)   M = maskCircle (pixelUV, coverage);
  else if (uShapeType == SHAPE_TRIANGLE) M = maskTriangle(pixelUV, pixelId, coverage);
  else if (uShapeType == SHAPE_DIAMOND)  M = maskDiamond(pixelUV, coverage);
  else                                   M = coverage;

  // Bottom-only fade. gl_FragCoord has its origin at the bottom-left, so
  // norm.y == 0.0 is the bottom edge and the ramp finishes at uEdgeFade.
  if (uEdgeFade > 0.0) {
    float norm = gl_FragCoord.y / uResolution.y;
    float fade = smoothstep(0.0, uEdgeFade, norm);
    M *= fade;
  }

  // uColor arrives as the raw sRGB hex values. three.js converted the hex to
  // linear on the CPU and this shader converted it back, which nets out to
  // the same thing — so there is no gamma step here any more.
  //
  // Premultiplied output into a premultipliedAlpha context. This is the only
  // draw and the canvas is cleared to transparent first, so writing the
  // premultiplied value directly is exactly what blending onto the cleared
  // buffer would produce, without enabling blending at all.
  fragColor = vec4(uColor * M, M);
}
`;

const PixelBlast: React.FC<PixelBlastProps> = ({
  variant = 'square',
  pixelSize = 3,
  color = 'oklch(0.722 0.086 307.923)',
  className,
  style,
  antialias = true,
  patternScale = 2,
  patternDensity = 1,
  pixelSizeJitter = 0,
  enableRipples = true,
  rippleIntensityScale = 1,
  rippleThickness = 0.1,
  rippleSpeed = 0.3,
  autoPauseOffscreen = true,
  speed = 0.5,
  transparent = true,
  edgeFade = 0.5
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const programRef = useRef<Program | null>(null);
  const dprRef = useRef(1);
  // Read by the render loop and the resize handler, so prop changes take
  // effect without tearing down the GL context.
  const speedRef = useRef(speed);
  const pixelSizeRef = useRef(pixelSize);
  const autoPauseRef = useRef(autoPauseOffscreen);

  // Context lifetime. Only options baked into the WebGL context itself
  // (antialias, alpha) force a rebuild; everything else is a uniform.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    dprRef.current = dpr;
    const renderer = new Renderer({
      dpr,
      antialias,
      // An opaque context composites the dithered pixels onto black, matching
      // the old non-transparent clear colour.
      alpha: transparent,
      premultipliedAlpha: true,
      depth: false,
      powerPreference: 'high-performance'
    });
    const gl = renderer.gl;
    const canvas = gl.canvas as HTMLCanvasElement;
    gl.clearColor(0, 0, 0, transparent ? 0 : 1);
    container.appendChild(canvas);

    // Uniform arrays must be plain Arrays: OGL only resolves `uClickPos[0]`
    // against an Array value, not a Float32Array.
    const clickPos: number[] = new Array(MAX_CLICKS * 2).fill(-1);
    const clickTimes: number[] = new Array(MAX_CLICKS).fill(0);
    const program = new Program(gl, {
      vertex: VERTEX_SRC,
      fragment: FRAGMENT_SRC,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uResolution: { value: [1, 1] },
        uTime: { value: 0 },
        uColor: { value: toColor(color) },
        uClickPos: { value: clickPos },
        uClickTimes: { value: clickTimes },
        uShapeType: { value: 0 },
        uPixelSize: { value: pixelSize * dpr },
        uScale: { value: 0 },
        uDensity: { value: 0 },
        uPixelJitter: { value: 0 },
        uEnableRipples: { value: 0 },
        uRippleSpeed: { value: 0 },
        uRippleThickness: { value: 0 },
        uRippleIntensity: { value: 0 },
        uEdgeFade: { value: 0 }
      }
    });
    programRef.current = program;
    const u = program.uniforms;
    // One oversized triangle covers the viewport with no diagonal seam.
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    const setSize = () => {
      renderer.setSize(container.clientWidth || 1, container.clientHeight || 1);
      u.uResolution.value = [gl.canvas.width, gl.canvas.height];
      u.uPixelSize.value = pixelSizeRef.current * dpr;
    };
    setSize();
    const ro = new ResizeObserver(setSize);
    ro.observe(container);

    const timeOffset = Math.random() * 1000;
    const start = performance.now();
    let clickIx = 0;

    const onPointerDown = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const fx = (e.clientX - rect.left) * (gl.canvas.width / rect.width);
      const fy = (rect.height - (e.clientY - rect.top)) * (gl.canvas.height / rect.height);
      clickPos[clickIx * 2] = fx;
      clickPos[clickIx * 2 + 1] = fy;
      clickTimes[clickIx] = u.uTime.value;
      clickIx = (clickIx + 1) % MAX_CLICKS;
    };
    canvas.addEventListener('pointerdown', onPointerDown, { passive: true });

    // The loop stops outright while the hero is off-screen or the tab is
    // hidden, instead of spinning a rAF that renders nothing.
    let raf = 0;
    let onScreen = true;
    const render = () => {
      u.uTime.value = timeOffset + ((performance.now() - start) / 1000) * speedRef.current;
      renderer.render({ scene: mesh });
      raf = requestAnimationFrame(render);
    };
    const sync = () => {
      const run = !document.hidden && (onScreen || !autoPauseRef.current);
      if (run && !raf) raf = requestAnimationFrame(render);
      else if (!run && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };
    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    });
    io.observe(container);
    document.addEventListener('visibilitychange', sync);
    sync();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', sync);
      canvas.removeEventListener('pointerdown', onPointerDown);
      programRef.current = null;
      program.remove();
      mesh.geometry.remove();
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      if (canvas.parentElement === container) container.removeChild(canvas);
    };
    // `color` and `pixelSize` seed the first frame; the effect below keeps
    // them current, so they must not rebuild the context.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [antialias, transparent]);

  // Everything that is just a uniform or a ref: update in place.
  useEffect(() => {
    speedRef.current = speed;
    pixelSizeRef.current = pixelSize;
    autoPauseRef.current = autoPauseOffscreen;
    const program = programRef.current;
    if (!program) return;
    const u = program.uniforms;
    u.uShapeType.value = SHAPE_MAP[variant] ?? 0;
    u.uPixelSize.value = pixelSize * dprRef.current;
    u.uColor.value = toColor(color);
    u.uScale.value = patternScale;
    u.uDensity.value = patternDensity;
    u.uPixelJitter.value = pixelSizeJitter;
    u.uEnableRipples.value = enableRipples ? 1 : 0;
    u.uRippleIntensity.value = rippleIntensityScale;
    u.uRippleThickness.value = rippleThickness;
    u.uRippleSpeed.value = rippleSpeed;
    u.uEdgeFade.value = edgeFade;
  }, [
    antialias,
    transparent,
    variant,
    pixelSize,
    color,
    patternScale,
    patternDensity,
    pixelSizeJitter,
    enableRipples,
    rippleIntensityScale,
    rippleThickness,
    rippleSpeed,
    edgeFade,
    speed,
    autoPauseOffscreen
  ]);

  return (
    <div
      ref={containerRef}
      className={`pixel-blast-container ${className ?? ''}`}
      style={style}
      aria-label="PixelBlast interactive background"
    />
  );
};

export default PixelBlast;
