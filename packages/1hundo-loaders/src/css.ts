let _injected = false;

export const LOADER_CSS = ".hl-matrix .hl-px {\n  width: var(--pixel, 12px);\n  height: var(--pixel, 12px);\n  border-radius: 2px;\n  background: rgba(255, 255, 255, 0.04);\n  will-change: transform, opacity;\n}\n.hl-matrix.sprite .hl-px {\n  background: rgba(255, 255, 255, 0.02);\n  box-shadow: none;\n  transition: none;\n}\n\n.hl-matrix.sprite .hl-px.on {\n  background: var(--c, var(--loader-color,#eee5b7));\n  box-shadow: 0 0 4px var(--c, var(--loader-color,#eee5b7));\n}\n\n.hl-matrix.sprite .hl-px.detail {\n  animation: sprite-detail-fade 1.6s ease-in-out infinite;\n}\n\n.hl-matrix.sprite .hl-px.blink-eye {\n  animation: sprite-eye-blink 3s ease-in-out infinite;\n}\n\n.hl-matrix.sprite .hl-px.on:not(.detail):not(.blink-eye) {\n  animation: sprite-body-glow 2.4s ease-in-out infinite;\n}\n\n.hl-matrix.story .hl-px,\n.hl-matrix.story .hl-px.on {\n  animation: none !important;\n  transition: background 0.05s linear, box-shadow 0.05s linear;\n}\n\n.hl-matrix.story .hl-px.on {\n  background: var(--c);\n  box-shadow: 0 0 4px var(--c);\n}\n\n.hl-matrix.sprite-breathe { animation: sprite-breathe 1.6s ease-in-out infinite; }\n\n.hl-matrix.sprite-blink { animation: sprite-blink 2.4s ease-in-out infinite; }\n\n.hl-matrix.sprite-spin { animation: sprite-spin 3s linear infinite; }\n\n.hl-matrix.sprite-bounce { animation: sprite-bounce 1.2s ease-in-out infinite; }\n\n.hl-matrix.sprite-flash { animation: sprite-flash 1s ease-in-out infinite; }\n\n@keyframes brand-pulse {\n  0%, 100% { opacity: 0.3; }\n  50% { opacity: 1; }\n}\n\n@keyframes spin { to { transform: rotate(360deg); } }\n\n@keyframes pg-rain-fade {\n  0%, 100% { background: rgba(255,255,255,0.04); box-shadow: none; }\n  20% { background: var(--loader-color,#bee8dc); box-shadow: 0 0 10px var(--loader-color,#bee8dc); }\n  60% { background: rgba(190, 232, 220, 0.2); box-shadow: 0 0 2px var(--loader-color,#bee8dc); }\n}\n\n@keyframes pg-think {\n  0%, 100% { background: rgba(255,255,255,0.04); box-shadow: none; }\n  30%, 50% { background: var(--loader-color,#c9d0f4); box-shadow: 0 0 8px var(--loader-color,#c9d0f4); }\n}\n\n@keyframes pg-search {\n  0%, 100% { background: rgba(255,255,255,0.04); box-shadow: none; }\n  20%, 30% { background: var(--loader-color,#bfe7df); box-shadow: 0 0 10px var(--loader-color,#bfe7df); }\n}\n\n@keyframes pg-find {\n  0%, 100% { background: rgba(255,255,255,0.04); box-shadow: none; }\n  60%, 80% { background: var(--loader-color,#d7e9bd); box-shadow: 0 0 10px var(--loader-color,#d7e9bd); }\n}\n\n@keyframes pg-consolidate {\n  0% { background: rgba(255,255,255,0.04); box-shadow: none; }\n  40%, 60% { background: var(--loader-color,#edcfaa); box-shadow: 0 0 10px var(--loader-color,#edcfaa); }\n  100% { background: rgba(255,255,255,0.04); box-shadow: none; }\n}\n\n@keyframes pg-stream {\n  0%, 100% { background: rgba(255,255,255,0.04); box-shadow: none; }\n  20% { background: var(--loader-color,#bee8dc); box-shadow: 0 0 10px var(--loader-color,#bee8dc); }\n  40% { background: rgba(190, 232, 220, 0.3); box-shadow: 0 0 4px var(--loader-color,#bee8dc); }\n}\n\n@keyframes pg-reason {\n  0%, 100% { background: rgba(255,255,255,0.04); box-shadow: none; }\n  40%, 60% { background: var(--loader-color,#edc8cf); box-shadow: 0 0 10px var(--loader-color,#edc8cf); }\n}\n\n@keyframes pg-index {\n  0%, 100% { background: rgba(255,255,255,0.04); box-shadow: none; }\n  10%, 25% { background: var(--loader-color,#eee5b7); box-shadow: 0 0 10px var(--loader-color,#eee5b7); }\n}\n\n@keyframes pg-connect {\n  0%, 100% { background: rgba(255,255,255,0.04); box-shadow: none; }\n  40%, 60% { background: var(--loader-color,#bfe7df); box-shadow: 0 0 12px var(--loader-color,#bfe7df); }\n}\n\n@keyframes pg-generate {\n  0%, 100% { background: rgba(255,255,255,0.04); box-shadow: none; }\n  40%, 70% { background: var(--loader-color,#e7c6df); box-shadow: 0 0 8px var(--loader-color,#e7c6df); }\n}\n\n@keyframes pg-reflect {\n  0%, 100% { background: rgba(255,255,255,0.04); box-shadow: none; }\n  40%, 60% { background: var(--loader-color,#c9d0f4); box-shadow: 0 0 10px var(--loader-color,#c9d0f4); }\n}\n\n@keyframes sprite-detail-fade {\n  0%, 100% { opacity: 1; transform: scale(1); }\n  45% { opacity: 0.15; transform: scale(0.7); }\n  55% { opacity: 0.15; transform: scale(0.7); }\n}\n\n@keyframes sprite-eye-blink {\n  0%, 92%, 100% { opacity: 1; transform: scaleY(1); }\n  95%, 97% { opacity: 0.2; transform: scaleY(0.2); }\n}\n\n@keyframes sprite-body-glow {\n  0%, 100% {\n    background: var(--c);\n    box-shadow: 0 0 3px var(--c);\n  }\n  50% {\n    background: var(--c);\n    box-shadow: 0 0 8px var(--c), 0 0 14px var(--c);\n  }\n}\n\n@keyframes pg-mandala-round {\n  0%, 100% { transform: scale(0.2); opacity: 0; background: rgba(255,255,255,0.04); }\n  50% { transform: scale(1); opacity: 1; background: var(--loader-color,#bfe7df); box-shadow: 0 0 8px var(--loader-color,#bfe7df); }\n}\n\n@keyframes pg-mandala-square {\n  0%, 100% { transform: scale(0.2); opacity: 0; background: rgba(255,255,255,0.04); }\n  50% { transform: scale(1); opacity: 1; background: var(--loader-color,#e7c6df); box-shadow: 0 0 8px var(--loader-color,#e7c6df); }\n}\n\n@keyframes pg-mandala-diamond {\n  0%, 100% { transform: scale(0.2); opacity: 0; background: rgba(255,255,255,0.04); }\n  50% { transform: scale(1.1); opacity: 1; background: var(--loader-color,#c9d0f4); box-shadow: 0 0 8px var(--loader-color,#c9d0f4); }\n}\n\n@keyframes pg-mandala-cross {\n  0%, 100% { transform: scale(0.1); opacity: 0; background: rgba(255,255,255,0.04); }\n  50% { transform: scale(1); opacity: 1; background: var(--loader-color,#eee5b7); box-shadow: 0 0 8px var(--loader-color,#eee5b7); }\n}\n\n@keyframes pg-mandala-x {\n  0%, 100% { transform: scale(0.1); opacity: 0; background: rgba(255,255,255,0.04); }\n  50% { transform: scale(1); opacity: 1; background: var(--loader-color,#edc8cf); box-shadow: 0 0 8px var(--loader-color,#edc8cf); }\n}\n\n@keyframes pg-mandala-star {\n  0%, 100% { transform: scale(0.2) rotate(0deg); opacity: 0; }\n  50% { transform: scale(1) rotate(45deg); opacity: 1; background: var(--loader-color,#edcfaa); box-shadow: 0 0 8px var(--loader-color,#edcfaa); }\n}\n\n@keyframes pg-mandala-petal {\n  0%, 100% { transform: scale(0.1); opacity: 0; }\n  50% { transform: scale(1); opacity: 1; background: var(--loader-color,#edc8cf); box-shadow: 0 0 8px var(--loader-color,#edc8cf); }\n}\n\n@keyframes pg-mandala-snow {\n  0%, 100% { transform: scale(0.1) rotate(-90deg); opacity: 0; }\n  50% { transform: scale(1) rotate(0deg); opacity: 1; background: var(--loader-color,#bfe7df); box-shadow: 0 0 10px var(--loader-color,#bfe7df); }\n}\n\n@keyframes pg-mandala-gear {\n  0% { transform: scale(0.3) rotate(0deg); opacity: 0.3; }\n  50% { transform: scale(1) rotate(45deg); opacity: 1; background: var(--loader-color,#bee8dc); box-shadow: 0 0 8px var(--loader-color,#bee8dc); }\n  100% { transform: scale(0.3) rotate(90deg); opacity: 0.3; }\n}\n\n@keyframes pg-mandala-kaleido {\n  0%, 100% { transform: scale(0.2); opacity: 0; }\n  25% { background: var(--loader-color,#bfe7df); box-shadow: 0 0 8px var(--loader-color,#bfe7df); }\n  50% { transform: scale(1); opacity: 1; background: var(--loader-color,#e7c6df); box-shadow: 0 0 8px var(--loader-color,#e7c6df); }\n  75% { background: var(--loader-color,#c9d0f4); box-shadow: 0 0 8px var(--loader-color,#c9d0f4); }\n}\n\n@keyframes pg-mandala-spiral {\n  0%, 100% { transform: scale(0) rotate(0); opacity: 0; }\n  50% { transform: scale(1) rotate(360deg); opacity: 1; background: var(--loader-color,#c9d0f4); box-shadow: 0 0 8px var(--loader-color,#c9d0f4); }\n}\n\n@keyframes pg-mandala-pulse {\n  0%, 100% { transform: scale(0.4); opacity: 0.3; background: var(--loader-color,#edcfaa); box-shadow: none; }\n  50% { transform: scale(1.1); opacity: 1; background: var(--loader-color,#edcfaa); box-shadow: 0 0 10px var(--loader-color,#edcfaa); }\n}\n\n@keyframes pg-mandala-checker {\n  0%, 100% { transform: scale(0.2); opacity: 0; background: rgba(255,255,255,0.04); }\n  50% { transform: scale(1); opacity: 1; background: var(--loader-color,#bee8dc); box-shadow: 0 0 8px var(--loader-color,#bee8dc); }\n}\n\n@keyframes pg-mandala-oct {\n  0%, 100% { transform: scale(0.2); opacity: 0; }\n  50% { transform: scale(1); opacity: 1; background: var(--loader-color,#eee5b7); box-shadow: 0 0 8px var(--loader-color,#eee5b7); }\n}\n\n@keyframes pg-mandala-lotus {\n  0%, 100% { transform: scale(0.1) rotate(-45deg); opacity: 0; }\n  35% { background: var(--loader-color,#edc8cf); box-shadow: 0 0 8px var(--loader-color,#edc8cf); }\n  50% { transform: scale(1.1) rotate(0deg); opacity: 1; background: var(--loader-color,#e7c6df); box-shadow: 0 0 12px var(--loader-color,#e7c6df); }\n  65% { background: var(--loader-color,#c9d0f4); box-shadow: 0 0 8px var(--loader-color,#c9d0f4); }\n}\n\n@keyframes sprite-breathe {\n  0%, 100% { opacity: 0.85; transform: scale(1); }\n  50% { opacity: 1; transform: scale(1.05); }\n}\n\n@keyframes sprite-blink {\n  0%, 90%, 100% { opacity: 1; }\n  93%, 97% { opacity: 0.2; }\n}\n\n@keyframes sprite-spin { to { transform: rotate(360deg); } }\n\n@keyframes sprite-bounce {\n  0%, 100% { transform: translateY(0); }\n  50% { transform: translateY(-6px); }\n}\n\n@keyframes sprite-flash {\n  0%, 100% { filter: brightness(1) saturate(1); }\n  50% { filter: brightness(1.4) saturate(1.4); }\n}\n\n@keyframes pg-scale-cyan {\n  0%, 100% { transform: scale(0.2); opacity: 0.3; background: rgba(255,255,255,0.04); box-shadow: none; }\n  50% { transform: scale(1); opacity: 1; background: var(--loader-color,#bfe7df); box-shadow: 0 0 10px var(--loader-color,#bfe7df); }\n}\n\n@keyframes pg-scale-magenta {\n  0%, 100% { transform: scale(0.2); opacity: 0.3; background: rgba(255,255,255,0.04); box-shadow: none; }\n  50% { transform: scale(1); opacity: 1; background: var(--loader-color,#e7c6df); box-shadow: 0 0 10px var(--loader-color,#e7c6df); }\n}\n\n@keyframes pg-scale-violet {\n  0%, 100% { transform: scale(0.2); opacity: 0.3; background: rgba(255,255,255,0.04); box-shadow: none; }\n  50% { transform: scale(1.15); opacity: 1; background: var(--loader-color,#c9d0f4); box-shadow: 0 0 10px var(--loader-color,#c9d0f4); }\n}\n\n@keyframes pg-scale-amber {\n  0%, 100% { transform: scale(0.1); opacity: 0; background: rgba(255,255,255,0.04); box-shadow: none; }\n  50% { transform: scale(1.2); opacity: 1; background: var(--loader-color,#edcfaa); box-shadow: 0 0 12px var(--loader-color,#edcfaa); }\n}\n\n@keyframes pg-scale-mint {\n  0%, 100% { transform: scale(0.3); opacity: 0.4; background: rgba(255,255,255,0.04); box-shadow: none; }\n  50% { transform: scale(1); opacity: 1; background: var(--loader-color,#bee8dc); box-shadow: 0 0 10px var(--loader-color,#bee8dc); }\n}\n\n@keyframes pg-scale-pink {\n  0%, 100% { transform: scale(0.1); opacity: 0; }\n  50% { transform: scale(1); opacity: 1; background: var(--loader-color,#edc8cf); box-shadow: 0 0 10px var(--loader-color,#edc8cf); }\n}\n\n@keyframes pg-twist {\n  0%, 100% { transform: scale(0.2) rotate(0deg); background: rgba(255,255,255,0.04); box-shadow: none; }\n  50% { transform: scale(1) rotate(180deg); background: var(--loader-color,#bfe7df); box-shadow: 0 0 10px var(--loader-color,#bfe7df); border-radius: 0; }\n}\n\n@keyframes pg-squash {\n  0%, 100% { transform: scaleY(0.2) scaleX(1.4); background: rgba(255,255,255,0.04); box-shadow: none; }\n  50% { transform: scaleY(1.4) scaleX(0.7); background: var(--loader-color,#e7c6df); box-shadow: 0 0 10px var(--loader-color,#e7c6df); }\n}\n\n@keyframes pg-jelly {\n  0%, 100% { transform: scale(1, 1); background: var(--loader-color,#c9d0f4); box-shadow: 0 0 6px var(--loader-color,#c9d0f4); }\n  25% { transform: scale(1.4, 0.6); }\n  50% { transform: scale(0.6, 1.4); background: var(--loader-color,#bfe7df); box-shadow: 0 0 10px var(--loader-color,#bfe7df); }\n  75% { transform: scale(1.2, 0.8); }\n}\n\n@keyframes pg-pop-rotate {\n  0%, 100% { transform: scale(0) rotate(-180deg); opacity: 0; }\n  30%, 70% { transform: scale(1.1) rotate(0deg); opacity: 1; background: var(--loader-color,#edcfaa); box-shadow: 0 0 10px var(--loader-color,#edcfaa); }\n}\n\n@keyframes pg-skew {\n  0%, 100% { transform: skewX(-30deg) scale(0.4); background: rgba(255,255,255,0.04); }\n  50% { transform: skewX(30deg) scale(1); background: var(--loader-color,#bee8dc); box-shadow: 0 0 10px var(--loader-color,#bee8dc); }\n}\n\n@keyframes pg-heartbeat {\n  0%, 100% { transform: scale(0.4); background: rgba(237, 200, 207, 0.2); box-shadow: none; }\n  20% { transform: scale(1.1); background: var(--loader-color,#edc8cf); box-shadow: 0 0 12px var(--loader-color,#edc8cf); }\n  40% { transform: scale(0.7); }\n  60% { transform: scale(1.1); background: var(--loader-color,#edc8cf); box-shadow: 0 0 12px var(--loader-color,#edc8cf); }\n  80% { transform: scale(0.5); }\n}\n\n@keyframes pg-drop {\n  0%, 100% { transform: translateY(-20px) scale(0); opacity: 0; }\n  40%, 60% { transform: translateY(0) scale(1); opacity: 1; background: var(--loader-color,#bfe7df); box-shadow: 0 0 10px var(--loader-color,#bfe7df); }\n}\n\n@keyframes pg-burst {\n  0% { transform: scale(0); }\n  20% { transform: scale(1.4); background: var(--loader-color,#eee5b7); box-shadow: 0 0 14px var(--loader-color,#eee5b7); }\n  40% { transform: scale(0.6); background: var(--loader-color,#edcfaa); }\n  60% { transform: scale(1); background: var(--loader-color,#e7c6df); box-shadow: 0 0 10px var(--loader-color,#e7c6df); }\n  80% { transform: scale(0.3); }\n  100% { transform: scale(0); }\n}\n\n@keyframes pg-spiral {\n  0%, 100% { transform: scale(0) rotate(0); opacity: 0; }\n  50% { transform: scale(1) rotate(360deg); opacity: 1; background: var(--loader-color,#c9d0f4); box-shadow: 0 0 10px var(--loader-color,#c9d0f4); border-radius: 50%; }\n}\n\n@keyframes pg-zigzag {\n  0%, 100% { transform: rotate(-15deg) scale(0.3); background: rgba(255,255,255,0.04); }\n  50% { transform: rotate(15deg) scale(1); background: var(--loader-color,#e7c6df); box-shadow: 0 0 10px var(--loader-color,#e7c6df); }\n}\n\n@keyframes pg-pulse-cyan {\n  0%, 100% { background: rgba(255,255,255,0.04); box-shadow: none; }\n  35%, 55% { background: var(--loader-color,#bfe7df); box-shadow: 0 0 8px var(--loader-color,#bfe7df), 0 0 1px var(--loader-color,#bfe7df); }\n}\n\n@keyframes pg-pulse-magenta {\n  0%, 100% { background: rgba(255,255,255,0.04); box-shadow: none; }\n  35%, 55% { background: var(--loader-color,#e7c6df); box-shadow: 0 0 8px var(--loader-color,#e7c6df), 0 0 1px var(--loader-color,#e7c6df); }\n}\n\n@keyframes pg-pulse-violet {\n  0%, 100% { background: rgba(255,255,255,0.04); box-shadow: none; }\n  35%, 55% { background: var(--loader-color,#c9d0f4); box-shadow: 0 0 8px var(--loader-color,#c9d0f4), 0 0 1px var(--loader-color,#c9d0f4); }\n}\n\n@keyframes pg-pulse-mint {\n  0%, 100% { background: rgba(255,255,255,0.04); box-shadow: none; }\n  35%, 55% { background: var(--loader-color,#bee8dc); box-shadow: 0 0 8px var(--loader-color,#bee8dc), 0 0 1px var(--loader-color,#bee8dc); }\n}\n\n@keyframes pg-pulse-pink {\n  0%, 100% { background: rgba(255,255,255,0.04); box-shadow: none; }\n  35%, 55% { background: var(--loader-color,#edc8cf); box-shadow: 0 0 8px var(--loader-color,#edc8cf), 0 0 1px var(--loader-color,#edc8cf); }\n}\n\n@keyframes pg-pulse-lime {\n  0%, 100% { background: rgba(255,255,255,0.04); box-shadow: none; }\n  35%, 55% { background: var(--loader-color,#d7e9bd); box-shadow: 0 0 8px var(--loader-color,#d7e9bd), 0 0 1px var(--loader-color,#d7e9bd); }\n}\n\n@keyframes pg-pulse-amber {\n  0%, 100% { background: rgba(255,255,255,0.04); box-shadow: none; }\n  50% { background: var(--loader-color,#edcfaa); box-shadow: 0 0 8px var(--loader-color,#edcfaa), 0 0 1px var(--loader-color,#edcfaa); }\n}\n\n@keyframes pg-pulse-yellow {\n  0%, 100% { background: rgba(255,255,255,0.04); box-shadow: none; }\n  10%, 18% { background: var(--loader-color,#eee5b7); box-shadow: 0 0 10px var(--loader-color,#eee5b7), 0 0 2px var(--loader-color,#eee5b7); }\n}\n\n@keyframes pg-heartbeat {\n  0%, 100% { opacity: 0.25; transform: scale(0.92); }\n  20% { opacity: 1; transform: scale(1); }\n  40% { opacity: 0.5; transform: scale(0.95); }\n  60% { opacity: 1; transform: scale(1); }\n}\n\n@keyframes pg-plasma {\n  0%, 100% { background: var(--loader-color,#bfe7df); box-shadow: 0 0 4px var(--loader-color,#bfe7df); }\n  33% { background: var(--loader-color,#e7c6df); box-shadow: 0 0 4px var(--loader-color,#e7c6df); }\n  66% { background: var(--loader-color,#d7e9bd); box-shadow: 0 0 4px var(--loader-color,#d7e9bd); }\n}";

const PERFORMANCE_CSS = `
.hl-matrix {
  contain: layout paint style;
  isolation: isolate;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  will-change: transform;
}
.hl-matrix .hl-px {
  box-shadow: none !important;
  will-change: auto;
  transform-origin: center;
  backface-visibility: hidden;
}
.hl-matrix:not(.sprite) .hl-px {
  background: var(--loader-color,#bfe7df);
  opacity: 0.16;
}
.hl-matrix.sprite {
  will-change: opacity, transform;
}
.hl-matrix.sprite .hl-px.on {
  box-shadow: none;
}
.hl-matrix.story .hl-px,
.hl-matrix.story .hl-px.on {
  box-shadow: none;
  transition: opacity 0.08s linear;
}
@keyframes sprite-body-glow {
  0%, 100% { opacity: 0.82; transform: scale(0.96); }
  50% { opacity: 1; transform: scale(1); }
}
@keyframes sprite-flash {
  0%, 100% { opacity: 0.9; transform: scale(0.99); }
  50% { opacity: 1; transform: scale(1.03); }
}
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
  0%, 100% { transform: scale(0.2) rotate(0deg); }
  50% { transform: scale(1) rotate(180deg); border-radius: 0; }
}
@keyframes pg-squash {
  0%, 100% { transform: scaleY(0.2) scaleX(1.4); }
  50% { transform: scaleY(1.4) scaleX(0.7); }
}
@keyframes pg-jelly {
  0%, 100% { transform: scale(1, 1); }
  25% { transform: scale(1.4, 0.6); }
  50% { transform: scale(0.6, 1.4); }
  75% { transform: scale(1.2, 0.8); }
}
@keyframes pg-pop-rotate {
  0%, 100% { transform: scale(0) rotate(-180deg); opacity: 0; }
  30%, 70% { transform: scale(1.1) rotate(0deg); opacity: 1; }
}
@keyframes pg-skew {
  0%, 100% { transform: skewX(-30deg) scale(0.4); }
  50% { transform: skewX(30deg) scale(1); }
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
  0% { transform: scale(0); }
  20% { transform: scale(1.4); }
  40% { transform: scale(0.6); }
  60% { transform: scale(1); }
  80% { transform: scale(0.3); }
  100% { transform: scale(0); }
}
@keyframes pg-spiral {
  0%, 100% { transform: scale(0) rotate(0); opacity: 0; }
  50% { transform: scale(1) rotate(360deg); opacity: 1; border-radius: 50%; }
}
@keyframes pg-zigzag {
  0%, 100% { transform: rotate(-15deg) scale(0.3); }
  50% { transform: rotate(15deg) scale(1); }
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

export function injectCSS(): void {
  if (_injected || typeof document === 'undefined') return;
  _injected = true;
  const style = document.createElement('style');
  style.setAttribute('data-1hundo-loaders', '');
  style.textContent = LOADER_CSS + PERFORMANCE_CSS;
  document.head.appendChild(style);
}
