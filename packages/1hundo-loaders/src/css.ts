let _injected = false;

/**
 * Base grid + pixel styling.
 *
 * Pixels fill their grid track rather than reading a `--pixel` variable, so the
 * `size` prop is the single source of truth for cell size.
 */
const BASE_CSS = `
.hl-matrix {
  contain: layout paint style;
  isolation: isolate;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  will-change: transform;
}
.hl-matrix .hl-px {
  width: 100%;
  height: 100%;
  border-radius: 1px;
  background: var(--loader-color, #bfe7df);
  opacity: 0.16;
  box-shadow: none;
  will-change: auto;
  transform-origin: center;
  backface-visibility: hidden;
}
`;

/**
 * Every animation is expressed purely as opacity + transform, which keeps the
 * whole grid on the compositor. Colour comes from the static `--loader-color`
 * background above, never from the keyframes.
 */
const ANIMATION_CSS = `
@keyframes pg-pulse-cyan {
  0%, 100% { opacity: 0.16; transform: scale(0.86); }
  35%, 55% { opacity: 1; transform: scale(1); }
}
@keyframes pg-pulse-magenta {
  0%, 100% { opacity: 0.16; transform: scale(0.86); }
  35%, 55% { opacity: 1; transform: scale(1); }
}
@keyframes pg-pulse-violet {
  0%, 100% { opacity: 0.16; transform: scale(0.86); }
  35%, 55% { opacity: 1; transform: scale(1); }
}
@keyframes pg-pulse-mint {
  0%, 100% { opacity: 0.16; transform: scale(0.86); }
  35%, 55% { opacity: 1; transform: scale(1); }
}
@keyframes pg-pulse-pink {
  0%, 100% { opacity: 0.16; transform: scale(0.86); }
  35%, 55% { opacity: 1; transform: scale(1); }
}
@keyframes pg-pulse-lime {
  0%, 100% { opacity: 0.16; transform: scale(0.86); }
  35%, 55% { opacity: 1; transform: scale(1); }
}
@keyframes pg-pulse-amber {
  0%, 100% { opacity: 0.16; transform: scale(0.86); }
  50% { opacity: 1; transform: scale(1); }
}
@keyframes pg-pulse-yellow {
  0%, 100% { opacity: 0.14; transform: scale(0.84); }
  10%, 18% { opacity: 1; transform: scale(1); }
}
@keyframes pg-rain-fade {
  0%, 100% { opacity: 0.16; transform: translateY(-2px); }
  20% { opacity: 1; transform: translateY(0); }
  60% { opacity: 0.38; transform: translateY(1px); }
}
@keyframes pg-think {
  0%, 100% { opacity: 0.16; transform: scale(0.9); }
  30%, 50% { opacity: 1; transform: scale(1); }
}
@keyframes pg-search {
  0%, 100% { opacity: 0.16; transform: scaleX(0.82); }
  20%, 30% { opacity: 1; transform: scaleX(1); }
}
@keyframes pg-find {
  0%, 100% { opacity: 0.16; transform: scale(0.86); }
  60%, 80% { opacity: 1; transform: scale(1); }
}
@keyframes pg-consolidate {
  0%, 100% { opacity: 0.16; transform: scale(0.88); }
  40%, 60% { opacity: 1; transform: scale(1); }
}
@keyframes pg-stream {
  0%, 100% { opacity: 0.14; transform: translateX(-2px); }
  20% { opacity: 1; transform: translateX(0); }
  40% { opacity: 0.45; transform: translateX(1px); }
}
@keyframes pg-reason {
  0%, 100% { opacity: 0.16; transform: scale(0.9); }
  40%, 60% { opacity: 1; transform: scale(1); }
}
@keyframes pg-index {
  0%, 100% { opacity: 0.16; transform: scaleY(0.75); }
  10%, 25% { opacity: 1; transform: scaleY(1); }
}
@keyframes pg-connect {
  0%, 100% { opacity: 0.16; transform: scale(0.85); }
  40%, 60% { opacity: 1; transform: scale(1); }
}
@keyframes pg-generate {
  0%, 100% { opacity: 0.16; transform: scale(0.86); }
  40%, 70% { opacity: 1; transform: scale(1); }
}
@keyframes pg-reflect {
  0%, 100% { opacity: 0.16; transform: scale(0.9); }
  40%, 60% { opacity: 1; transform: scale(1); }
}
@keyframes pg-plasma {
  0%, 100% { opacity: 1; }
  33% { opacity: 0.72; }
  66% { opacity: 0.92; }
}
@keyframes pg-scale-cyan {
  0%, 100% { transform: scale(0.2); opacity: 0.28; }
  50% { transform: scale(1); opacity: 1; }
}
@keyframes pg-scale-magenta {
  0%, 100% { transform: scale(0.2); opacity: 0.28; }
  50% { transform: scale(1); opacity: 1; }
}
@keyframes pg-scale-violet {
  0%, 100% { transform: scale(0.2); opacity: 0.28; }
  50% { transform: scale(1.15); opacity: 1; }
}
@keyframes pg-scale-amber {
  0%, 100% { transform: scale(0.1); opacity: 0; }
  50% { transform: scale(1.2); opacity: 1; }
}
@keyframes pg-scale-mint {
  0%, 100% { transform: scale(0.3); opacity: 0.35; }
  50% { transform: scale(1); opacity: 1; }
}
@keyframes pg-scale-pink {
  0%, 100% { transform: scale(0.1); opacity: 0; }
  50% { transform: scale(1); opacity: 1; }
}
@keyframes pg-twist {
  0%, 100% { transform: scale(0.2) rotate(0deg); opacity: 0.2; }
  50% { transform: scale(1) rotate(180deg); opacity: 1; border-radius: 0; }
}
@keyframes pg-squash {
  0%, 100% { transform: scaleY(0.2) scaleX(1.4); opacity: 0.2; }
  50% { transform: scaleY(1.4) scaleX(0.7); opacity: 1; }
}
@keyframes pg-jelly {
  0%, 100% { transform: scale(1, 1); opacity: 1; }
  25% { transform: scale(1.4, 0.6); }
  50% { transform: scale(0.6, 1.4); opacity: 0.7; }
  75% { transform: scale(1.2, 0.8); }
}
@keyframes pg-pop-rotate {
  0%, 100% { transform: scale(0) rotate(-180deg); opacity: 0; }
  30%, 70% { transform: scale(1.1) rotate(0deg); opacity: 1; }
}
@keyframes pg-skew {
  0%, 100% { transform: skewX(-30deg) scale(0.4); opacity: 0.2; }
  50% { transform: skewX(30deg) scale(1); opacity: 1; }
}
@keyframes pg-heartbeat {
  0%, 100% { opacity: 0.25; transform: scale(0.92); }
  20% { opacity: 1; transform: scale(1); }
  40% { opacity: 0.5; transform: scale(0.95); }
  60% { opacity: 1; transform: scale(1); }
}
@keyframes pg-drop {
  0%, 100% { transform: translateY(-20px) scale(0); opacity: 0; }
  40%, 60% { transform: translateY(0) scale(1); opacity: 1; }
}
@keyframes pg-burst {
  0% { transform: scale(0); opacity: 0; }
  20% { transform: scale(1.4); opacity: 1; }
  40% { transform: scale(0.6); opacity: 0.7; }
  60% { transform: scale(1); opacity: 1; }
  80% { transform: scale(0.3); opacity: 0.3; }
  100% { transform: scale(0); opacity: 0; }
}
@keyframes pg-spiral {
  0%, 100% { transform: scale(0) rotate(0); opacity: 0; }
  50% { transform: scale(1) rotate(360deg); opacity: 1; border-radius: 50%; }
}
@keyframes pg-zigzag {
  0%, 100% { transform: rotate(-15deg) scale(0.3); opacity: 0.2; }
  50% { transform: rotate(15deg) scale(1); opacity: 1; }
}
@keyframes pg-mandala-round {
  0%, 100% { transform: scale(0.2); opacity: 0; }
  50% { transform: scale(1); opacity: 1; }
}
@keyframes pg-mandala-square {
  0%, 100% { transform: scale(0.2); opacity: 0; }
  50% { transform: scale(1); opacity: 1; }
}
@keyframes pg-mandala-diamond {
  0%, 100% { transform: scale(0.2); opacity: 0; }
  50% { transform: scale(1.1); opacity: 1; }
}
@keyframes pg-mandala-cross {
  0%, 100% { transform: scale(0.1); opacity: 0; }
  50% { transform: scale(1); opacity: 1; }
}
@keyframes pg-mandala-x {
  0%, 100% { transform: scale(0.1); opacity: 0; }
  50% { transform: scale(1); opacity: 1; }
}
@keyframes pg-mandala-star {
  0%, 100% { transform: scale(0.2) rotate(0deg); opacity: 0; }
  50% { transform: scale(1) rotate(45deg); opacity: 1; }
}
@keyframes pg-mandala-petal {
  0%, 100% { transform: scale(0.1); opacity: 0; }
  50% { transform: scale(1); opacity: 1; }
}
@keyframes pg-mandala-snow {
  0%, 100% { transform: scale(0.1) rotate(-90deg); opacity: 0; }
  50% { transform: scale(1) rotate(0deg); opacity: 1; }
}
@keyframes pg-mandala-gear {
  0% { transform: scale(0.3) rotate(0deg); opacity: 0.3; }
  50% { transform: scale(1) rotate(45deg); opacity: 1; }
  100% { transform: scale(0.3) rotate(90deg); opacity: 0.3; }
}
@keyframes pg-mandala-kaleido {
  0%, 100% { transform: scale(0.2); opacity: 0; }
  50% { transform: scale(1); opacity: 1; }
  75% { opacity: 0.8; }
}
@keyframes pg-mandala-spiral {
  0%, 100% { transform: scale(0) rotate(0); opacity: 0; }
  50% { transform: scale(1) rotate(360deg); opacity: 1; }
}
@keyframes pg-mandala-pulse {
  0%, 100% { transform: scale(0.4); opacity: 0.3; }
  50% { transform: scale(1.1); opacity: 1; }
}
@keyframes pg-mandala-checker {
  0%, 100% { transform: scale(0.2); opacity: 0; }
  50% { transform: scale(1); opacity: 1; }
}
@keyframes pg-mandala-oct {
  0%, 100% { transform: scale(0.2); opacity: 0; }
  50% { transform: scale(1); opacity: 1; }
}
@keyframes pg-mandala-lotus {
  0%, 100% { transform: scale(0.1) rotate(-45deg); opacity: 0; }
  35% { opacity: 0.65; }
  50% { transform: scale(1.1) rotate(0deg); opacity: 1; }
  65% { opacity: 0.75; }
}
@media (prefers-reduced-motion: reduce) {
  .hl-matrix,
  .hl-matrix .hl-px {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
  }
}
`;

export const LOADER_CSS = BASE_CSS + ANIMATION_CSS;

export function injectCSS(): void {
  if (_injected || typeof document === 'undefined') return;
  _injected = true;
  const style = document.createElement('style');
  style.setAttribute('data-1hundo-loaders', '');
  style.textContent = LOADER_CSS;
  document.head.appendChild(style);
}
