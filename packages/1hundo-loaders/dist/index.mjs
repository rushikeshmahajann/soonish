"use client";
var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};

// src/Loader.tsx
import { useEffect, useRef } from "react";

// src/css.ts
var _injected = false;
var LOADER_CSS = ".hl-matrix .hl-px {\n  width: var(--pixel, 12px);\n  height: var(--pixel, 12px);\n  border-radius: 2px;\n  background: rgba(255, 255, 255, 0.04);\n  will-change: transform, opacity, background-color;\n}\n.hl-matrix.sprite .hl-px {\n  background: rgba(255, 255, 255, 0.02);\n  box-shadow: none;\n  transition: none;\n}\n\n.hl-matrix.sprite .hl-px.on {\n  background: var(--c, var(--loader-color,#f8ff5e));\n  box-shadow: 0 0 4px var(--c, var(--loader-color,#f8ff5e));\n}\n\n.hl-matrix.sprite .hl-px.detail {\n  animation: sprite-detail-fade 1.6s ease-in-out infinite;\n}\n\n.hl-matrix.sprite .hl-px.blink-eye {\n  animation: sprite-eye-blink 3s ease-in-out infinite;\n}\n\n.hl-matrix.sprite .hl-px.on:not(.detail):not(.blink-eye) {\n  animation: sprite-body-glow 2.4s ease-in-out infinite;\n}\n\n.hl-matrix.story .hl-px,\n.hl-matrix.story .hl-px.on {\n  animation: none !important;\n  transition: background 0.05s linear, box-shadow 0.05s linear;\n}\n\n.hl-matrix.story .hl-px.on {\n  background: var(--c);\n  box-shadow: 0 0 4px var(--c);\n}\n\n.hl-matrix.sprite-breathe { animation: sprite-breathe 1.6s ease-in-out infinite; }\n\n.hl-matrix.sprite-blink { animation: sprite-blink 2.4s ease-in-out infinite; }\n\n.hl-matrix.sprite-spin { animation: sprite-spin 3s linear infinite; }\n\n.hl-matrix.sprite-bounce { animation: sprite-bounce 1.2s ease-in-out infinite; }\n\n.hl-matrix.sprite-flash { animation: sprite-flash 1s ease-in-out infinite; }\n\n@keyframes brand-pulse {\n  0%, 100% { opacity: 0.3; }\n  50% { opacity: 1; }\n}\n\n@keyframes spin { to { transform: rotate(360deg); } }\n\n@keyframes pg-rain-fade {\n  0%, 100% { background: rgba(255,255,255,0.04); box-shadow: none; }\n  20% { background: var(--loader-color,#36ffc8); box-shadow: 0 0 10px var(--loader-color,#36ffc8); }\n  60% { background: rgba(54, 255, 200, 0.2); box-shadow: 0 0 2px var(--loader-color,#36ffc8); }\n}\n\n@keyframes pg-think {\n  0%, 100% { background: rgba(255,255,255,0.04); box-shadow: none; }\n  30%, 50% { background: var(--loader-color,#8b5cff); box-shadow: 0 0 8px var(--loader-color,#8b5cff); }\n}\n\n@keyframes pg-search {\n  0%, 100% { background: rgba(255,255,255,0.04); box-shadow: none; }\n  20%, 30% { background: var(--loader-color,#00f0ff); box-shadow: 0 0 10px var(--loader-color,#00f0ff); }\n}\n\n@keyframes pg-find {\n  0%, 100% { background: rgba(255,255,255,0.04); box-shadow: none; }\n  60%, 80% { background: var(--loader-color,#b6ff3c); box-shadow: 0 0 10px var(--loader-color,#b6ff3c); }\n}\n\n@keyframes pg-consolidate {\n  0% { background: rgba(255,255,255,0.04); box-shadow: none; }\n  40%, 60% { background: var(--loader-color,#ffb547); box-shadow: 0 0 10px var(--loader-color,#ffb547); }\n  100% { background: rgba(255,255,255,0.04); box-shadow: none; }\n}\n\n@keyframes pg-stream {\n  0%, 100% { background: rgba(255,255,255,0.04); box-shadow: none; }\n  20% { background: var(--loader-color,#36ffc8); box-shadow: 0 0 10px var(--loader-color,#36ffc8); }\n  40% { background: rgba(54, 255, 200, 0.3); box-shadow: 0 0 4px var(--loader-color,#36ffc8); }\n}\n\n@keyframes pg-reason {\n  0%, 100% { background: rgba(255,255,255,0.04); box-shadow: none; }\n  40%, 60% { background: var(--loader-color,#ff5d9e); box-shadow: 0 0 10px var(--loader-color,#ff5d9e); }\n}\n\n@keyframes pg-index {\n  0%, 100% { background: rgba(255,255,255,0.04); box-shadow: none; }\n  10%, 25% { background: var(--loader-color,#f8ff5e); box-shadow: 0 0 10px var(--loader-color,#f8ff5e); }\n}\n\n@keyframes pg-connect {\n  0%, 100% { background: rgba(255,255,255,0.04); box-shadow: none; }\n  40%, 60% { background: var(--loader-color,#00f0ff); box-shadow: 0 0 12px var(--loader-color,#00f0ff); }\n}\n\n@keyframes pg-generate {\n  0%, 100% { background: rgba(255,255,255,0.04); box-shadow: none; }\n  40%, 70% { background: var(--loader-color,#ff2bd6); box-shadow: 0 0 8px var(--loader-color,#ff2bd6); }\n}\n\n@keyframes pg-reflect {\n  0%, 100% { background: rgba(255,255,255,0.04); box-shadow: none; }\n  40%, 60% { background: var(--loader-color,#8b5cff); box-shadow: 0 0 10px var(--loader-color,#8b5cff); }\n}\n\n@keyframes sprite-detail-fade {\n  0%, 100% { opacity: 1; transform: scale(1); }\n  45% { opacity: 0.15; transform: scale(0.7); }\n  55% { opacity: 0.15; transform: scale(0.7); }\n}\n\n@keyframes sprite-eye-blink {\n  0%, 92%, 100% { opacity: 1; transform: scaleY(1); }\n  95%, 97% { opacity: 0.2; transform: scaleY(0.2); }\n}\n\n@keyframes sprite-body-glow {\n  0%, 100% {\n    background: var(--c);\n    box-shadow: 0 0 3px var(--c);\n  }\n  50% {\n    background: var(--c);\n    box-shadow: 0 0 8px var(--c), 0 0 14px var(--c);\n  }\n}\n\n@keyframes pg-mandala-round {\n  0%, 100% { transform: scale(0.2); opacity: 0; background: rgba(255,255,255,0.04); }\n  50% { transform: scale(1); opacity: 1; background: var(--loader-color,#00f0ff); box-shadow: 0 0 8px var(--loader-color,#00f0ff); }\n}\n\n@keyframes pg-mandala-square {\n  0%, 100% { transform: scale(0.2); opacity: 0; background: rgba(255,255,255,0.04); }\n  50% { transform: scale(1); opacity: 1; background: var(--loader-color,#ff2bd6); box-shadow: 0 0 8px var(--loader-color,#ff2bd6); }\n}\n\n@keyframes pg-mandala-diamond {\n  0%, 100% { transform: scale(0.2); opacity: 0; background: rgba(255,255,255,0.04); }\n  50% { transform: scale(1.1); opacity: 1; background: var(--loader-color,#8b5cff); box-shadow: 0 0 8px var(--loader-color,#8b5cff); }\n}\n\n@keyframes pg-mandala-cross {\n  0%, 100% { transform: scale(0.1); opacity: 0; background: rgba(255,255,255,0.04); }\n  50% { transform: scale(1); opacity: 1; background: var(--loader-color,#f8ff5e); box-shadow: 0 0 8px var(--loader-color,#f8ff5e); }\n}\n\n@keyframes pg-mandala-x {\n  0%, 100% { transform: scale(0.1); opacity: 0; background: rgba(255,255,255,0.04); }\n  50% { transform: scale(1); opacity: 1; background: var(--loader-color,#ff5d9e); box-shadow: 0 0 8px var(--loader-color,#ff5d9e); }\n}\n\n@keyframes pg-mandala-star {\n  0%, 100% { transform: scale(0.2) rotate(0deg); opacity: 0; }\n  50% { transform: scale(1) rotate(45deg); opacity: 1; background: var(--loader-color,#ffb547); box-shadow: 0 0 8px var(--loader-color,#ffb547); }\n}\n\n@keyframes pg-mandala-petal {\n  0%, 100% { transform: scale(0.1); opacity: 0; }\n  50% { transform: scale(1); opacity: 1; background: var(--loader-color,#ff5d9e); box-shadow: 0 0 8px var(--loader-color,#ff5d9e); }\n}\n\n@keyframes pg-mandala-snow {\n  0%, 100% { transform: scale(0.1) rotate(-90deg); opacity: 0; }\n  50% { transform: scale(1) rotate(0deg); opacity: 1; background: var(--loader-color,#00f0ff); box-shadow: 0 0 10px var(--loader-color,#00f0ff); }\n}\n\n@keyframes pg-mandala-gear {\n  0% { transform: scale(0.3) rotate(0deg); opacity: 0.3; }\n  50% { transform: scale(1) rotate(45deg); opacity: 1; background: var(--loader-color,#36ffc8); box-shadow: 0 0 8px var(--loader-color,#36ffc8); }\n  100% { transform: scale(0.3) rotate(90deg); opacity: 0.3; }\n}\n\n@keyframes pg-mandala-kaleido {\n  0%, 100% { transform: scale(0.2); opacity: 0; }\n  25% { background: var(--loader-color,#00f0ff); box-shadow: 0 0 8px var(--loader-color,#00f0ff); }\n  50% { transform: scale(1); opacity: 1; background: var(--loader-color,#ff2bd6); box-shadow: 0 0 8px var(--loader-color,#ff2bd6); }\n  75% { background: var(--loader-color,#8b5cff); box-shadow: 0 0 8px var(--loader-color,#8b5cff); }\n}\n\n@keyframes pg-mandala-spiral {\n  0%, 100% { transform: scale(0) rotate(0); opacity: 0; }\n  50% { transform: scale(1) rotate(360deg); opacity: 1; background: var(--loader-color,#8b5cff); box-shadow: 0 0 8px var(--loader-color,#8b5cff); }\n}\n\n@keyframes pg-mandala-pulse {\n  0%, 100% { transform: scale(0.4); opacity: 0.3; background: var(--loader-color,#ffb547); box-shadow: none; }\n  50% { transform: scale(1.1); opacity: 1; background: var(--loader-color,#ffb547); box-shadow: 0 0 10px var(--loader-color,#ffb547); }\n}\n\n@keyframes pg-mandala-checker {\n  0%, 100% { transform: scale(0.2); opacity: 0; background: rgba(255,255,255,0.04); }\n  50% { transform: scale(1); opacity: 1; background: var(--loader-color,#36ffc8); box-shadow: 0 0 8px var(--loader-color,#36ffc8); }\n}\n\n@keyframes pg-mandala-oct {\n  0%, 100% { transform: scale(0.2); opacity: 0; }\n  50% { transform: scale(1); opacity: 1; background: var(--loader-color,#f8ff5e); box-shadow: 0 0 8px var(--loader-color,#f8ff5e); }\n}\n\n@keyframes pg-mandala-lotus {\n  0%, 100% { transform: scale(0.1) rotate(-45deg); opacity: 0; }\n  35% { background: var(--loader-color,#ff5d9e); box-shadow: 0 0 8px var(--loader-color,#ff5d9e); }\n  50% { transform: scale(1.1) rotate(0deg); opacity: 1; background: var(--loader-color,#ff2bd6); box-shadow: 0 0 12px var(--loader-color,#ff2bd6); }\n  65% { background: var(--loader-color,#8b5cff); box-shadow: 0 0 8px var(--loader-color,#8b5cff); }\n}\n\n@keyframes sprite-breathe {\n  0%, 100% { opacity: 0.85; transform: scale(1); }\n  50% { opacity: 1; transform: scale(1.05); }\n}\n\n@keyframes sprite-blink {\n  0%, 90%, 100% { opacity: 1; }\n  93%, 97% { opacity: 0.2; }\n}\n\n@keyframes sprite-spin { to { transform: rotate(360deg); } }\n\n@keyframes sprite-bounce {\n  0%, 100% { transform: translateY(0); }\n  50% { transform: translateY(-6px); }\n}\n\n@keyframes sprite-flash {\n  0%, 100% { filter: brightness(1) saturate(1); }\n  50% { filter: brightness(1.4) saturate(1.4); }\n}\n\n@keyframes pg-scale-cyan {\n  0%, 100% { transform: scale(0.2); opacity: 0.3; background: rgba(255,255,255,0.04); box-shadow: none; }\n  50% { transform: scale(1); opacity: 1; background: var(--loader-color,#00f0ff); box-shadow: 0 0 10px var(--loader-color,#00f0ff); }\n}\n\n@keyframes pg-scale-magenta {\n  0%, 100% { transform: scale(0.2); opacity: 0.3; background: rgba(255,255,255,0.04); box-shadow: none; }\n  50% { transform: scale(1); opacity: 1; background: var(--loader-color,#ff2bd6); box-shadow: 0 0 10px var(--loader-color,#ff2bd6); }\n}\n\n@keyframes pg-scale-violet {\n  0%, 100% { transform: scale(0.2); opacity: 0.3; background: rgba(255,255,255,0.04); box-shadow: none; }\n  50% { transform: scale(1.15); opacity: 1; background: var(--loader-color,#8b5cff); box-shadow: 0 0 10px var(--loader-color,#8b5cff); }\n}\n\n@keyframes pg-scale-amber {\n  0%, 100% { transform: scale(0.1); opacity: 0; background: rgba(255,255,255,0.04); box-shadow: none; }\n  50% { transform: scale(1.2); opacity: 1; background: var(--loader-color,#ffb547); box-shadow: 0 0 12px var(--loader-color,#ffb547); }\n}\n\n@keyframes pg-scale-mint {\n  0%, 100% { transform: scale(0.3); opacity: 0.4; background: rgba(255,255,255,0.04); box-shadow: none; }\n  50% { transform: scale(1); opacity: 1; background: var(--loader-color,#36ffc8); box-shadow: 0 0 10px var(--loader-color,#36ffc8); }\n}\n\n@keyframes pg-scale-pink {\n  0%, 100% { transform: scale(0.1); opacity: 0; }\n  50% { transform: scale(1); opacity: 1; background: var(--loader-color,#ff5d9e); box-shadow: 0 0 10px var(--loader-color,#ff5d9e); }\n}\n\n@keyframes pg-twist {\n  0%, 100% { transform: scale(0.2) rotate(0deg); background: rgba(255,255,255,0.04); box-shadow: none; }\n  50% { transform: scale(1) rotate(180deg); background: var(--loader-color,#00f0ff); box-shadow: 0 0 10px var(--loader-color,#00f0ff); border-radius: 0; }\n}\n\n@keyframes pg-squash {\n  0%, 100% { transform: scaleY(0.2) scaleX(1.4); background: rgba(255,255,255,0.04); box-shadow: none; }\n  50% { transform: scaleY(1.4) scaleX(0.7); background: var(--loader-color,#ff2bd6); box-shadow: 0 0 10px var(--loader-color,#ff2bd6); }\n}\n\n@keyframes pg-jelly {\n  0%, 100% { transform: scale(1, 1); background: var(--loader-color,#8b5cff); box-shadow: 0 0 6px var(--loader-color,#8b5cff); }\n  25% { transform: scale(1.4, 0.6); }\n  50% { transform: scale(0.6, 1.4); background: var(--loader-color,#00f0ff); box-shadow: 0 0 10px var(--loader-color,#00f0ff); }\n  75% { transform: scale(1.2, 0.8); }\n}\n\n@keyframes pg-pop-rotate {\n  0%, 100% { transform: scale(0) rotate(-180deg); opacity: 0; }\n  30%, 70% { transform: scale(1.1) rotate(0deg); opacity: 1; background: var(--loader-color,#ffb547); box-shadow: 0 0 10px var(--loader-color,#ffb547); }\n}\n\n@keyframes pg-skew {\n  0%, 100% { transform: skewX(-30deg) scale(0.4); background: rgba(255,255,255,0.04); }\n  50% { transform: skewX(30deg) scale(1); background: var(--loader-color,#36ffc8); box-shadow: 0 0 10px var(--loader-color,#36ffc8); }\n}\n\n@keyframes pg-heartbeat {\n  0%, 100% { transform: scale(0.4); background: rgba(255, 77, 109, 0.2); box-shadow: none; }\n  20% { transform: scale(1.1); background: var(--loader-color,#ff5d9e); box-shadow: 0 0 12px var(--loader-color,#ff5d9e); }\n  40% { transform: scale(0.7); }\n  60% { transform: scale(1.1); background: var(--loader-color,#ff5d9e); box-shadow: 0 0 12px var(--loader-color,#ff5d9e); }\n  80% { transform: scale(0.5); }\n}\n\n@keyframes pg-drop {\n  0%, 100% { transform: translateY(-20px) scale(0); opacity: 0; }\n  40%, 60% { transform: translateY(0) scale(1); opacity: 1; background: var(--loader-color,#00f0ff); box-shadow: 0 0 10px var(--loader-color,#00f0ff); }\n}\n\n@keyframes pg-burst {\n  0% { transform: scale(0); }\n  20% { transform: scale(1.4); background: var(--loader-color,#f8ff5e); box-shadow: 0 0 14px var(--loader-color,#f8ff5e); }\n  40% { transform: scale(0.6); background: var(--loader-color,#ffb547); }\n  60% { transform: scale(1); background: var(--loader-color,#ff2bd6); box-shadow: 0 0 10px var(--loader-color,#ff2bd6); }\n  80% { transform: scale(0.3); }\n  100% { transform: scale(0); }\n}\n\n@keyframes pg-spiral {\n  0%, 100% { transform: scale(0) rotate(0); opacity: 0; }\n  50% { transform: scale(1) rotate(360deg); opacity: 1; background: var(--loader-color,#8b5cff); box-shadow: 0 0 10px var(--loader-color,#8b5cff); border-radius: 50%; }\n}\n\n@keyframes pg-zigzag {\n  0%, 100% { transform: rotate(-15deg) scale(0.3); background: rgba(255,255,255,0.04); }\n  50% { transform: rotate(15deg) scale(1); background: var(--loader-color,#ff2bd6); box-shadow: 0 0 10px var(--loader-color,#ff2bd6); }\n}\n\n@keyframes pg-pulse-cyan {\n  0%, 100% { background: rgba(255,255,255,0.04); box-shadow: none; }\n  35%, 55% { background: var(--loader-color,#00f0ff); box-shadow: 0 0 8px var(--loader-color,#00f0ff), 0 0 1px var(--loader-color,#00f0ff); }\n}\n\n@keyframes pg-pulse-magenta {\n  0%, 100% { background: rgba(255,255,255,0.04); box-shadow: none; }\n  35%, 55% { background: var(--loader-color,#ff2bd6); box-shadow: 0 0 8px var(--loader-color,#ff2bd6), 0 0 1px var(--loader-color,#ff2bd6); }\n}\n\n@keyframes pg-pulse-violet {\n  0%, 100% { background: rgba(255,255,255,0.04); box-shadow: none; }\n  35%, 55% { background: var(--loader-color,#8b5cff); box-shadow: 0 0 8px var(--loader-color,#8b5cff), 0 0 1px var(--loader-color,#8b5cff); }\n}\n\n@keyframes pg-pulse-mint {\n  0%, 100% { background: rgba(255,255,255,0.04); box-shadow: none; }\n  35%, 55% { background: var(--loader-color,#36ffc8); box-shadow: 0 0 8px var(--loader-color,#36ffc8), 0 0 1px var(--loader-color,#36ffc8); }\n}\n\n@keyframes pg-pulse-pink {\n  0%, 100% { background: rgba(255,255,255,0.04); box-shadow: none; }\n  35%, 55% { background: var(--loader-color,#ff5d9e); box-shadow: 0 0 8px var(--loader-color,#ff5d9e), 0 0 1px var(--loader-color,#ff5d9e); }\n}\n\n@keyframes pg-pulse-lime {\n  0%, 100% { background: rgba(255,255,255,0.04); box-shadow: none; }\n  35%, 55% { background: var(--loader-color,#b6ff3c); box-shadow: 0 0 8px var(--loader-color,#b6ff3c), 0 0 1px var(--loader-color,#b6ff3c); }\n}\n\n@keyframes pg-pulse-amber {\n  0%, 100% { background: rgba(255,255,255,0.04); box-shadow: none; }\n  50% { background: var(--loader-color,#ffb547); box-shadow: 0 0 8px var(--loader-color,#ffb547), 0 0 1px var(--loader-color,#ffb547); }\n}\n\n@keyframes pg-pulse-yellow {\n  0%, 100% { background: rgba(255,255,255,0.04); box-shadow: none; }\n  10%, 18% { background: var(--loader-color,#f8ff5e); box-shadow: 0 0 10px var(--loader-color,#f8ff5e), 0 0 2px var(--loader-color,#f8ff5e); }\n}\n\n@keyframes pg-heartbeat {\n  0%, 100% { opacity: 0.25; transform: scale(0.92); }\n  20% { opacity: 1; transform: scale(1); }\n  40% { opacity: 0.5; transform: scale(0.95); }\n  60% { opacity: 1; transform: scale(1); }\n}\n\n@keyframes pg-plasma {\n  0%, 100% { background: var(--loader-color,#00f0ff); box-shadow: 0 0 4px var(--loader-color,#00f0ff); }\n  33% { background: var(--loader-color,#ff2bd6); box-shadow: 0 0 4px var(--loader-color,#ff2bd6); }\n  66% { background: var(--loader-color,#b6ff3c); box-shadow: 0 0 4px var(--loader-color,#b6ff3c); }\n}";
var PERFORMANCE_CSS = `
.hl-matrix {
  contain: layout paint style;
}
.hl-matrix .hl-px {
  box-shadow: none !important;
  will-change: auto;
}
.hl-matrix:not(.sprite) .hl-px {
  background: var(--loader-color,#00f0ff);
  opacity: 0.16;
}
.hl-matrix.sprite .hl-px.on {
  box-shadow: none;
}
.hl-matrix.story .hl-px,
.hl-matrix.story .hl-px.on {
  box-shadow: none;
  transition: opacity 0.05s linear;
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
function injectCSS() {
  if (_injected || typeof document === "undefined") return;
  _injected = true;
  const style = document.createElement("style");
  style.setAttribute("data-1hundo-loaders", "");
  style.textContent = LOADER_CSS + PERFORMANCE_CSS;
  document.head.appendChild(style);
}

// src/data/stories.ts
var PALETTE = {
  Y: "#f8ff5e",
  R: "#ff4d6d",
  O: "#ffb547",
  G: "#b6ff3c",
  C: "#00f0ff",
  B: "#4a8cff",
  M: "#ff2bd6",
  V: "#8b5cff",
  P: "#ff5d9e",
  N: "#36ffc8",
  W: "#ffffff",
  K: "#1a1a24",
  S: "#7a7a8c",
  T: "#ffc99e",
  E: "#8a5a3a",
  L: "#5cc14a"
};
var STORIES = [
  {
    kind: "story",
    name: "Mountain",
    duration: 5,
    palette: PALETTE,
    frames: [
      ["........", "....S...", "...SSS..", "..SSSSS.", "..SSSSS.", ".SSSSSSS", "YSSSSSSS", "SSSSSSSS"],
      ["........", "....S...", "...SSS..", "..SSSSS.", ".YSSSSS.", ".SSSSSSS", ".SSSSSSS", "SSSSSSSS"],
      ["........", "....S...", "...SSS..", "..YSSSS.", "..SSSSS.", ".SSSSSSS", ".SSSSSSS", "SSSSSSSS"],
      ["........", "....S...", "...YSS..", "..SSSSS.", "..SSSSS.", ".SSSSSSS", ".SSSSSSS", "SSSSSSSS"],
      ["....R...", "....R...", "....RYS.", "..SSSSS.", "..SSSSS.", ".SSSSSSS", ".SSSSSSS", "SSSSSSSS"],
      ["....RR..", "....R...", "....RYS.", "..SSSSS.", "..SSSSS.", ".SSSSSSS", ".SSSSSSS", "SSSSSSSS"],
      ["....R...", "....R...", "...SRYS.", "..SSSSS.", "..SSSSS.", ".SSSSSSS", ".SSSSSSS", "SSSSSSSS"],
      ["........", "....S...", "...SSYS.", "..SSSSS.", "..SSSSS.", ".SSSSSSS", ".SSSSSSS", "SSSSSSSS"]
    ]
  },
  {
    kind: "story",
    name: "Fishing",
    duration: 4,
    palette: PALETTE,
    frames: [
      ["Y.......", "YY......", "|.......", "|.......", "|.......", "|.......", "........", "WWWWWWWW"],
      ["Y.......", "YY......", "|.......", "|.......", "|.......", "|..C....", "........", "WWWWWWWW"],
      ["Y.......", "YY......", "|.......", "|.......", "|...C...", "|.......", "........", "WWWWWWWW"],
      ["Y.......", "YY......", "|.......", "|....C..", "|.......", "|.......", "........", "WWWWWWWW"],
      ["Y.......", "YY......", "|.....C.", "|.......", "|.......", "|.......", "........", "WWWWWWWW"],
      ["Y.......", "YY......", "|......C", "|......R", "|.......", "|.......", "........", "WWWWWWWW"],
      ["Y.......", "YY....RR", "|......C", "|.......", "|.......", "|.......", "........", "WWWWWWWW"],
      ["Y.......", "YY......", "|.......", "|.......", "|.......", "|.......", "........", "WWWWWWWW"]
    ]
  },
  {
    kind: "story",
    name: "Treadmill",
    duration: 3,
    palette: PALETTE,
    frames: [
      ["........", "..YY....", "..YY....", "..YY....", "..YY....", "KKKKKKKK", "........", "........"],
      ["........", "...YY...", "...YY...", "...YY...", "...YY...", "KKKKKKKK", "........", "........"],
      ["........", "....YY..", "....YY..", "....YY..", "....YY..", "KKKKKKKK", "........", "........"],
      ["........", ".....YY.", ".....YY.", ".....YY.", ".....YY.", "KKKKKKKK", "........", "........"],
      ["........", "......YY", "......YY", "......YY", "......YY", "KKKKKKKK", "........", "........"],
      ["........", "YY......", "YY......", "YY......", "YY......", "KKKKKKKK", "........", "........"],
      ["........", ".YY.....", "YYY.....", "YYY.....", ".YY.....", "KKKKKKKK", "........", "........"]
    ]
  },
  {
    kind: "story",
    name: "Chef",
    duration: 4,
    palette: PALETTE,
    frames: [
      ["..WWW...", "..YYY...", "..YYY...", "..YYY...", "..YYY...", "O.....O.", "........", "........"],
      ["..WWW...", "..YYY...", "..YYY...", "..YYY...", "..YYY...", "O.....O.", "...O....", "........"],
      ["..WWW...", "..YYY...", "..YYY...", "..YYY...", "..YYY...", "O.....O.", "...OO...", "........"],
      ["..WWW...", "..YYY...", "..YYY...", "..YYY...", "..YYY...", "O.....O.", "....OO..", "........"],
      ["..WWW...", "..YYY...", "..YYY...", "..YYY...", "..YYY...", "O.....O.", "........", "....O..."],
      ["..WWW...", "..YYY...", "..YYY...", "..YYY...", "..YYY...", "O.....O.", "........", "........"]
    ]
  },
  {
    kind: "story",
    name: "Plant",
    duration: 5,
    palette: PALETTE,
    frames: [
      ["........", "........", "........", "........", "........", "...K....", "...K....", "...KK..."],
      ["........", "........", "........", "........", "..L.....", "...K....", "...K....", "...KK..."],
      ["........", "........", "........", "..L.....", "..LL....", "...K....", "...K....", "...KK..."],
      ["........", "........", "....L...", "..LL....", "..LL....", "...K....", "...K....", "...KK..."],
      ["........", "....L...", "....LL..", "..LL....", "..LL....", "...K....", "...K....", "...KK..."],
      ["...L....", "....LL..", "....LL..", "..LLL...", "..LLL...", "...K....", "...K....", "...KK..."]
    ]
  },
  {
    kind: "story",
    name: "Astronaut",
    duration: 5,
    palette: PALETTE,
    frames: [
      ["........", "...WWW..", "..WCCWW.", "..WCWWW.", "..WWWW..", "...WW...", "...WW...", "........"],
      ["........", "...WWW..", "..WCCWW.", "..WCWWW.", "..WWWW..", "...WW...", "..W.W...", "........"],
      ["........", "...WWW..", "..WCCWW.", "..WCWWW.", "..WWWW..", ".W.WW...", "...WW...", "........"],
      ["........", "...WWW..", "..WCCWW.", "..WCWWW.", "..WWWW..", "...WWW..", "........", "........"],
      ["........", "...WWW..", "..WCCWW.", "..WCWWW.", "..WWWW..", "...WW..W", "........", "........"]
    ]
  }
];
var COMM_PALETTE = PALETTE;
var COMM_LOADERS = [
  {
    kind: "story",
    name: "Envelope",
    duration: 1.6,
    palette: COMM_PALETTE,
    frames: [
      ["........", ".WWWWWW.", ".W....W.", ".WW..WW.", ".WWWWWW.", "........", "........", "........"],
      ["........", ".WWWWWW.", ".WC...W.", ".WCW.WW.", ".WWWWWW.", "........", "........", "........"],
      ["........", ".WWWWWW.", ".WCC..W.", ".WCCWWW.", ".WWWWWW.", "........", "........", "........"],
      ["........", ".WWWWWW.", ".W....W.", ".WW..WW.", ".WWWWWW.", "...C....", "........", "........"],
      ["........", ".WWWWWW.", ".W....W.", ".WW..WW.", ".WWWWWW.", "........", "...C....", "........"]
    ]
  },
  {
    kind: "story",
    name: "Bubble",
    duration: 1.4,
    palette: COMM_PALETTE,
    frames: [
      ["........", "..CCCC..", "..C..C..", "..CCCC..", "...CC...", "........", "........", "........"],
      ["........", "..CCCC..", "..CWWC..", "..CCCC..", "...CC...", "........", "........", "........"],
      ["........", "..CCCC..", "..CWC...", "..CCCC..", "...CC...", "........", "........", "........"],
      ["........", "..CCCC..", "..C.C...", "..CCCC..", "...CC...", "........", "........", "........"]
    ]
  },
  {
    kind: "story",
    name: "Phone",
    duration: 1.8,
    palette: COMM_PALETTE,
    frames: [
      ["........", ".KKKK...", "K.WW.K..", "K.WW.K..", "K.....K.", "K.....K.", ".KKKKK..", "........"],
      ["........", ".KKKK...", "K.WW.K..", "K.WW.K..", "K.CC..K.", "K.CC..K.", ".KKKKK..", "........"],
      [".C......", ".KKKK...", "K.WW.K..", "K.WW.K..", "K.....K.", "K.....K.", ".KKKKK..", "........"],
      ["..C.....", "..C.....", ".KKKK...", "K.WW.K..", "K.WW.K..", "K.....K.", ".KKKKK..", "........"]
    ]
  },
  {
    kind: "story",
    name: "Bell Swing",
    duration: 1.6,
    palette: COMM_PALETTE,
    frames: [
      ["...YY...", "..YYYY..", "..YYYY..", "..YYYY..", "..YYYY..", "YYYYYYYY", "........", "...OO..."],
      ["..YY....", "..YYY...", "..YYYY..", "..YYYY..", ".YYYY...", "YYYYYYYY", "........", "...OO..."],
      ["...YY...", "...YYY..", "...YYYY.", "...YYYY.", "...YYYY.", "YYYYYYYY", "........", "...OO..."],
      ["...YY...", "..YYYY..", "..YYYY..", "..YYYY..", "..YYYY..", "YYYYYYYY", "........", "...OO..."]
    ]
  },
  {
    kind: "story",
    name: "At",
    duration: 2,
    palette: COMM_PALETTE,
    frames: [
      ["..CCCC..", "..C..C..", "..C.....", "..C.CC..", "..CCCC..", "..C..C..", "..CCCC..", "........"],
      ["..CCCC..", "..CW.C..", "..CW....", "..CWCC..", "..CCCC..", "..C..C..", "..CCCC..", "........"],
      ["..CCCC..", "..CWW...", "..CWW...", "..CWWC..", "..CCCC..", "..C..C..", "..CCCC..", "........"],
      ["..CCCC..", "..CWWW..", "..CCCC..", "..C.CC..", "..CCCC..", "..C..C..", "..CCCC..", "........"],
      ["..CCCC..", "..C.CC..", "..CCCC..", "..C.CC..", "..CCCC..", "..C..C..", "..CCCC..", "........"],
      ["..CCCC..", "..C..C..", "..C.....", "..C.CC..", "..CCCC..", "..C..C..", "..CCCC..", "........"]
    ]
  }
];

// src/data/loaders.ts
var N = 8;
function spiralOrder(n) {
  const r = [];
  let t = 0, b = n - 1, l = 0, ri = n - 1;
  while (t <= b && l <= ri) {
    for (let i = l; i <= ri; i++) r.push(t * n + i);
    t++;
    for (let i = t; i <= b; i++) r.push(i * n + ri);
    ri--;
    if (t <= b) {
      for (let i = ri; i >= l; i--) r.push(b * n + i);
      b--;
    }
    if (l <= ri) {
      for (let i = b; i >= t; i--) r.push(i * n + l);
      l++;
    }
  }
  return r;
}
function knightTour(n) {
  const mv = [[1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]];
  const vis = Array(n * n).fill(false);
  const ord = [];
  let x = 0, y = 0;
  for (let s = 0; s < n * n; s++) {
    ord.push(y * n + x);
    vis[y * n + x] = true;
    let best = null, bc = 99;
    for (const [dx, dy] of mv) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= n || ny >= n || vis[ny * n + nx]) continue;
      let c = 0;
      for (const [ddx, ddy] of mv) {
        const ax = nx + ddx, ay = ny + ddy;
        if (ax >= 0 && ay >= 0 && ax < n && ay < n && !vis[ay * n + ax]) c++;
      }
      if (c < bc) {
        bc = c;
        best = [nx, ny];
      }
    }
    if (best) {
      [x, y] = best;
    } else {
      const i = vis.indexOf(false);
      if (i < 0) break;
      x = i % n;
      y = Math.floor(i / n);
    }
  }
  return ord;
}
function hilbertOrder(n) {
  function d2xy(n2, d) {
    let rx, ry, t = d, x = 0, y = 0;
    for (let s = 1; s < n2; s *= 2) {
      rx = 1 & Math.floor(t / 2);
      ry = 1 & (t ^ rx);
      if (ry === 0) {
        if (rx === 1) {
          x = s - 1 - x;
          y = s - 1 - y;
        }
        [x, y] = [y, x];
      }
      x += s * rx;
      y += s * ry;
      t = Math.floor(t / 4);
    }
    return [x, y];
  }
  const r = [];
  for (let d = 0; d < n * n; d++) {
    const [x, y] = d2xy(n, d);
    r.push(y * n + x);
  }
  return r;
}
function pongPath(n) {
  const p = [];
  let x = 0, y = 0, dx = 1, dy = 1;
  for (let i = 0; i < 28; i++) {
    p.push(y * n + x);
    if (x + dx < 0 || x + dx >= n) dx = -dx;
    if (y + dy < 0 || y + dy >= n) dy = -dy;
    x += dx;
    y += dy;
  }
  return p;
}
var spiralOrd = spiralOrder(N);
var knightOrd = knightTour(N);
var hilbertOrd = hilbertOrder(N);
var pongOrd = pongPath(N);
var chebyshev = (x, y) => Math.max(Math.abs(x - 3.5), Math.abs(y - 3.5));
var manhattan = (x, y) => Math.abs(x - 3.5) + Math.abs(y - 3.5);
var euclidean = (x, y) => Math.hypot(x - 3.5, y - 3.5);
function proc(name, animName, easing, duration, delay, skipOnNine = false) {
  return { kind: "procedural", name, animName, easing, duration, delay, skipOnNine };
}
var SC = {
  // Sprite Colors
  Y: "#f8ff5e",
  R: "#ff4d6d",
  O: "#ffb547",
  G: "#b6ff3c",
  C: "#00f0ff",
  M: "#ff2bd6",
  V: "#8b5cff",
  W: "#ffffff",
  P: "#ff5d9e",
  N_: "#36ffc8",
  K: "#1a1a24"
};
function sprite(name, matrixAnim, matrixDuration, map, colors, blinkChar, detailChar) {
  return { kind: "sprite", name, matrixAnim, matrixDuration, map, colors, blinkChar, detailChar };
}
var DEFS = [
  // Pulse wave loaders
  proc("Sweep", "pg-pulse-cyan", "linear", 1.6, (x) => -(x / N) * 1.6),
  proc("Diagonal", "pg-pulse-magenta", "linear", 1.8, (x, y) => -((x + y) / (N * 2 - 2)) * 1.8),
  proc("Ripple", "pg-pulse-violet", "ease-out", 1.6, (x, y) => {
    const d = Math.hypot(x - 3.5, y - 3.5);
    return -(d / Math.hypot(3.5, 3.5)) * 1.6;
  }),
  proc("Rain", "pg-pulse-mint", "linear", 1.8, (x, y) => {
    const c = [0, 0.4, 0.8, 0.2, 0.6, 0.1, 0.5, 0.3];
    return -(y / N * 1.8 + c[x]);
  }),
  proc("Spiral", "pg-pulse-pink", "linear", 2.4, (x, y) => {
    const i = spiralOrd.indexOf(y * N + x);
    return -(i / 64) * 2.4;
  }),
  proc("Snake", "pg-pulse-lime", "linear", 2.4, (x, y) => {
    const c = y % 2 === 0 ? x : N - 1 - x;
    return -(y * N + c) / 64 * 2.4;
  }),
  proc("Sparkle", "pg-pulse-amber", "ease-in-out", 1.8, (x, y, i) => {
    const r = Math.sin(i * 9301 + 49297) * 233280;
    return -((r - Math.floor(r)) * 1.8);
  }),
  proc("Heartbeat", "pg-heartbeat", "ease-in-out", 1.2, () => 0),
  proc("Scanner", "pg-pulse-cyan", "linear", 1.4, (x, y) => -(y / N) * 1.4),
  proc("Orbit", "pg-pulse-yellow", "linear", 3.2, (x, y) => {
    const iB = x === 0 || x === N - 1 || y === 0 || y === N - 1;
    if (!iB) return 999;
    let i;
    if (y === 0) i = x;
    else if (x === N - 1) i = N - 1 + y;
    else if (y === N - 1) i = (N - 1) * 2 + (N - 1 - x);
    else i = (N - 1) * 3 + (N - 1 - y);
    return -(i / ((N - 1) * 4)) * 3.2;
  }, true),
  proc("Breathe", "pg-pulse-violet", "ease-in-out", 2.4, (x, y) => -(Math.min(x, y, N - 1 - x, N - 1 - y) / 4) * 1.2),
  proc("Checker", "pg-pulse-mint", "ease-in-out", 1.4, (x, y) => (x + y) % 2 === 0 ? 0 : -0.7),
  proc("Stripes", "pg-pulse-pink", "linear", 1.6, (x, y) => -((x + y) % 4 / 4) * 1.6),
  proc("Falling", "pg-pulse-cyan", "linear", 1.6, (x, y) => -(y / N) * 0.8 - x * 0.05),
  proc("Plasma", "pg-plasma", "ease-in-out", 3, (x, y) => -((x + y) / (N * 2 - 2)) * 3),
  proc("LoadBar", "pg-pulse-lime", "linear", 2.8, (x, y) => -((y * N + x) / 64) * 2.8),
  proc("Knight Tour", "pg-pulse-cyan", "linear", 4, (x, y) => {
    const i = knightOrd.indexOf(y * N + x);
    return i >= 0 ? -(i / 64) * 4 : 0;
  }),
  proc("Hilbert", "pg-pulse-violet", "linear", 3.6, (x, y) => {
    const i = hilbertOrd.indexOf(y * N + x);
    return -(i / 64) * 3.6;
  }),
  proc("Vortex", "pg-pulse-magenta", "linear", 2.4, (x, y) => {
    const a = Math.atan2(y - 3.5, x - 3.5);
    const r = Math.hypot(x - 3.5, y - 3.5) / 5;
    return -(((a + Math.PI) / (2 * Math.PI) + r * 0.5) % 1) * 2.4;
  }),
  proc("Sine Wave", "pg-pulse-mint", "linear", 2, (x, y) => {
    const w = (Math.sin(x / N * Math.PI * 2) * 0.5 + 0.5) * (N - 1);
    return -(x / N - Math.abs(y - w) / N * 0.3) * 2;
  }),
  proc("Life", "pg-pulse-amber", "ease-in-out", 2, (x, y) => -((x * 3 + y * 5) % 8 / 8) * 2),
  proc("Quadrants", "pg-pulse-pink", "ease-in-out", 1.6, (x, y) => -(((x < 4 ? 0 : 1) + (y < 4 ? 0 : 2)) / 4) * 1.6),
  proc("Crossfade", "pg-pulse-cyan", "linear", 1.8, (x, y) => -(Math.min(Math.abs(x - y), Math.abs(x - (N - 1 - y))) / N) * 1.8),
  proc("Glider", "pg-pulse-lime", "steps(4,end)", 1.8, (x, y) => -((x + y) % 4 / 4) * 1.8),
  proc("Matrix", "pg-rain-fade", "linear", 2, (x, y) => {
    const s = [0, 0.3, 0.7, 0.1, 0.5, 0.9, 0.2, 0.6];
    return -(y / N * 2 + s[x]);
  }),
  proc("Pong", "pg-pulse-yellow", "linear", 2.6, (x, y) => {
    const i = pongOrd.indexOf(y * N + x);
    return i >= 0 ? -(i / pongOrd.length) * 2.6 : 999;
  }, true),
  proc("Concentric", "pg-pulse-violet", "ease-in-out", 2, (x, y) => {
    const r = Math.min(x, y, N - 1 - x, N - 1 - y);
    return -(r / 4) * 1 + r % 2 * 0.5;
  }),
  proc("Twin Spirals", "pg-pulse-magenta", "linear", 3, (x, y) => {
    const a = Math.atan2(y - 3.5, x - 3.5);
    return -((a * 2 + Math.PI * 2) / (Math.PI * 2) % 1) * 3;
  }),
  // AI/process
  proc("Thinking", "pg-think", "ease-in-out", 2, (x, y) => -(Math.sin(y / N * Math.PI) * 0.5 + 0.5) * 2 - x * 0.04),
  proc("Searching", "pg-search", "ease-in-out", 1.6, (x, y) => -(y / N * 1.6 + Math.abs(x - 3.5) / 4 * 0.3)),
  proc("Finding", "pg-find", "ease-in-out", 1.8, (x, y) => {
    const d = Math.hypot(x - 3.5, y - 3.5);
    return -(1 - d / Math.hypot(3.5, 3.5)) * 1.8;
  }),
  proc("Consolidating", "pg-consolidate", "ease-in-out", 2.2, (x, y) => -(Math.min(x, y, N - 1 - x, N - 1 - y) / 4) * 2.2),
  proc("Streaming", "pg-stream", "linear", 1.4, (x, y) => -(x / N * 1.4 + y % 3 * 0.15)),
  proc("Reasoning", "pg-reason", "ease-in-out", 2, (x) => -(Math.min(x / N, (N - 1 - x) / N) * 2)),
  proc("Indexing", "pg-index", "linear", 1.6, (x, y) => -(x / N * 1.6 + y * 0.02)),
  proc("Connecting", "pg-connect", "ease-in-out", 2, (x, y) => {
    const d = Math.hypot(x - 3.5, y - 3.5);
    return -(d / Math.hypot(3.5, 3.5)) * 1 - (x + y) % 2 * 0.5;
  }),
  proc("Generating", "pg-generate", "ease-out", 2.4, (x, y) => -((y * N + x) / 64) * 2.4),
  proc("Reflecting", "pg-reflect", "ease-in-out", 2, (x, y) => {
    const t = y < 4 ? y : N - 1 - y;
    return -(t / 4) * 1 - x * 0.05;
  }),
  // Scale loaders
  proc("Scale Ripple", "pg-scale-cyan", "ease-in-out", 1.8, (x, y) => {
    const d = Math.hypot(x - 3.5, y - 3.5);
    return -(d / Math.hypot(3.5, 3.5)) * 1.8;
  }),
  proc("Scale Wave", "pg-scale-magenta", "ease-in-out", 1.6, (x, y) => -((x + y * 0.3) / N) * 1.6),
  proc("Scale Diag", "pg-scale-violet", "ease-in-out", 2, (x, y) => -((x + y) / (N * 2 - 2)) * 2),
  proc("Scale Pop", "pg-scale-amber", "ease-in-out", 1.6, (x, y, i) => {
    const r = Math.sin(i * 9301 + 49297) * 233280;
    return -((r - Math.floor(r)) * 1.6);
  }),
  proc("Scale Ring", "pg-scale-mint", "ease-in-out", 2, (x, y) => -(Math.min(x, y, N - 1 - x, N - 1 - y) / 4) * 2),
  proc("Scale Check", "pg-scale-pink", "ease-in-out", 1.4, (x, y) => (x + y) % 2 === 0 ? 0 : -0.7),
  // Funky scale
  proc("Twist", "pg-twist", "ease-in-out", 2, (x, y) => -(Math.hypot(x - 3.5, y - 3.5) / 5) * 2),
  proc("Squash", "pg-squash", "ease-in-out", 1.4, (x) => -(x / N) * 1.4),
  proc("Jelly", "pg-jelly", "ease-in-out", 1.6, (x, y) => -((x + y) / (N * 2)) * 1.6),
  proc("Pop Rotate", "pg-pop-rotate", "cubic-bezier(.5,1.6,.4,1)", 2.4, (x, y, i) => {
    const r = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
    return -((r - Math.floor(r)) * 2.4);
  }),
  proc("Skew", "pg-skew", "ease-in-out", 1.8, (x, y) => -(y / N) * 1.8),
  proc("Heartbeat Scale", "pg-heartbeat", "ease-in-out", 1.4, (x, y) => -(Math.hypot(x - 3.5, y - 3.5) / 6) * 1.4),
  proc("Drop", "pg-drop", "cubic-bezier(.5,0,.5,1.6)", 1.6, (x, y) => -(x * 0.08 + y * 0.12)),
  proc("Burst", "pg-burst", "steps(8,end)", 1.2, (x, y) => -(Math.hypot(x - 3.5, y - 3.5) / 6) * 1.2),
  proc("Spiral Scale", "pg-spiral", "ease-in-out", 2.4, (x, y) => {
    const a = Math.atan2(y - 3.5, x - 3.5);
    return -((a + Math.PI) / (Math.PI * 2)) * 2.4;
  }),
  proc("Zigzag", "pg-zigzag", "ease-in-out", 1.6, (x, y) => {
    const o = y % 2 === 0 ? x : N - 1 - x;
    return -(o / N) * 1.6;
  }),
  // Emoji sprites
  sprite("Smiley", "sprite-breathe", 2.4, ["..YYYY..", ".YYYYYY.", "YYEYYEYY", "YYYYYYYY", "YYYYYYYY", "YYDDDDYY", ".YYYYYY.", "..YYYY.."], { Y: SC.Y, E: SC.K, D: SC.K }, "E", "D"),
  sprite("Heart", "sprite-breathe", 2.4, [".RR..RR.", "RRRRRRRR", "RRRRRRRR", "RRRRDRRR", ".RRRRRR.", "..RRRR..", "...RR...", "........"], { R: SC.R, D: SC.W }, void 0, "D"),
  sprite("Star", "sprite-flash", 1, ["...YY...", "...DD...", "YYYYYYYY", ".YYYYYY.", "..YYYY..", ".YY..YY.", "YY....YY", "........"], { Y: SC.Y, D: SC.W }, void 0, "D"),
  sprite("Fire", "sprite-flash", 1, ["...O....", "..OOO...", "..OOOO..", ".OODDO..", "OOYYYYO.", "OOYDDYOO", ".OYYYYO.", "..OOOO.."], { O: SC.O, Y: SC.Y, D: SC.W }, void 0, "D"),
  sprite("Robot", "sprite-blink", 2.4, [".CCCCCC.", "C.C..C.C", "CCEEEECC", "CCEEEECC", "CCCCCCCC", ".CDDDDC.", ".C....C.", "CC....CC"], { C: SC.C, E: SC.K, D: SC.K }, "E", "D"),
  sprite("Ghost", "sprite-bounce", 1.2, ["..WWWW..", ".WWWWWW.", "WWEWWEWW", "WWWWWWWW", "WWWDDWWW", "WWWWWWWW", "W.WW.WW.", ".W..W..W"], { W: SC.W, E: SC.K, D: SC.P }, "E", "D"),
  sprite("Lightning", "sprite-flash", 1, ["....YY..", "...YY...", "..YY....", ".YYDD...", "....YY..", "...YY...", "..YY....", ".YY....."], { Y: SC.Y, D: SC.W }, void 0, "D"),
  sprite("Diamond", "sprite-spin", 3, ["...CC...", "..CCCC..", ".CCDDCC.", "CCDWWDCC", "CCCCCCCC", ".CCCCCC.", "..CCCC..", "...CC..."], { C: SC.C, D: SC.W, W: SC.W }, void 0, "D"),
  sprite("Skull", "sprite-blink", 2.4, ["..WWWW..", ".WWWWWW.", "WWEWWEWW", "WWWWWWWW", "WWDWWDWW", ".WWWWWW.", ".W.WW.W.", "..W..W.."], { W: SC.W, E: SC.K, D: SC.K }, "E", "D"),
  sprite("Pacman", "sprite-flash", 1, ["..YYYY..", ".YYYYYY.", "YYYDD...", "YYY.....", "YYYY....", ".YYYYYY.", "..YYYY..", "........"], { Y: SC.Y, D: SC.K }, void 0, "D"),
  sprite("Mushroom", "sprite-breathe", 2.4, ["..RRRR..", ".RDDRRR.", "RDDRRRRR", "RRRRRRRR", "RRRRRRRR", "..WWWW..", "..WWWW..", "..WWWW.."], { R: SC.R, W: SC.W, D: SC.W }, void 0, "D"),
  sprite("Crown", "sprite-flash", 1, ["Y..YY..Y", "Y..YY..Y", "YYYYYYYY", "YDOYYODY", "YYYYYYYY", "YYYYYYYY", "........", "........"], { Y: SC.Y, O: SC.O, D: SC.W }, void 0, "D"),
  sprite("Rocket", "sprite-bounce", 1.2, ["....C...", "...CCC..", "..CWWWC.", "..CWDWC.", "..CCCCC.", "..C.C.C.", ".O...O..", "O.....O."], { C: SC.C, W: SC.W, O: SC.O, D: SC.O }, void 0, "D"),
  sprite("Coin", "sprite-spin", 3, ["..YYYY..", ".YYYYYY.", "YYYOOYYY", "YYYDDYYY", "YYYDDYYY", "YYYOOYYY", ".YYYYYY.", "..YYYY.."], { Y: SC.Y, O: SC.O, D: SC.O }, void 0, "D"),
  sprite("Bomb", "sprite-blink", 2.4, ["......OY", ".....OD.", "....OO..", "..KKKK..", ".KKKKKK.", ".KKKKKK.", ".KKKKKK.", "..KKKK.."], { K: SC.K, O: SC.O, Y: SC.Y, D: SC.Y }, void 0, "D"),
  sprite("Wave", "sprite-flash", 1, ["........", "..CC.CC.", ".CCCCCCC", "CC.CCC.C", "CCCCCCCC", ".CCCCCC.", "..CCCC..", "........"], { C: SC.C }),
  sprite("Cat", "sprite-breathe", 2.4, ["V......V", "VV....VV", "VVVVVVVV", "VEVVVVEV", "VVVVVVVV", "VVDVVDVV", ".VVVVVV.", "..V..V.."], { V: SC.V, E: SC.Y, D: SC.P }, "E", "D"),
  sprite("Bug", "sprite-bounce", 1.2, ["G......G", ".GGGGGG.", "GGEEEEGG", "GGGGGGGG", "GGDDDDGG", ".GGGGGG.", "G.G..G.G", "G......G"], { G: SC.G, E: SC.K, D: SC.K }, "E", "D"),
  sprite("Battery", "sprite-flash", 1, ["........", "...WWW..", ".WWWWWWW", ".WGGGDGW", ".WGGGDGW", ".WWWWWWW", "........", "........"], { W: SC.W, G: SC.G, D: SC.W }, void 0, "D"),
  sprite("Bell", "sprite-flash", 1, ["...YY...", "..YYYY..", ".YYYYYY.", ".YDDDDY.", "YYYYYYYY", "YYYYYYYY", "YYYYYYYY", "...OO..."], { Y: SC.Y, O: SC.O, D: SC.W }, void 0, "D"),
  // Mandalas
  proc("Round", "pg-mandala-round", "ease-in-out", 2, (x, y) => {
    const r = Math.round(euclidean(x, y) * 1.5);
    return -(r / 5) * 2;
  }),
  proc("Square Mandala", "pg-mandala-square", "ease-in-out", 2, (x, y) => -(Math.floor(chebyshev(x, y)) / 4) * 2),
  proc("Diamond Mandala", "pg-mandala-diamond", "ease-in-out", 2, (x, y) => -(Math.floor(manhattan(x, y)) / 7) * 2),
  proc("Cross", "pg-mandala-cross", "ease-in-out", 1.8, (x, y) => {
    const on = x === 3 || x === 4 || y === 3 || y === 4;
    if (!on) return 999;
    return -(Math.max(Math.abs(x - 3.5), Math.abs(y - 3.5)) / 4) * 1.8;
  }, true),
  proc("X Diagonal", "pg-mandala-x", "ease-in-out", 1.8, (x, y) => {
    const on = x === y || x + y === 7;
    if (!on) return 999;
    return -(Math.hypot(x - 3.5, y - 3.5) / 5) * 1.8;
  }, true),
  proc("Star Burst", "pg-mandala-star", "ease-in-out", 2, (x, y) => {
    const on = x === 3 || x === 4 || y === 3 || y === 4 || x === y || x + y === 7;
    if (!on) return 999;
    return -(Math.hypot(x - 3.5, y - 3.5) / 5) * 2;
  }, true),
  proc("Petal", "pg-mandala-petal", "ease-in-out", 2.4, (x, y) => {
    const m = ["..PPPP..", ".P.PP.P.", "PP.PP.PP", "PPPPPPPP", "PPPPPPPP", "PP.PP.PP", ".P.PP.P.", "..PPPP.."];
    if (m[y][x] !== "P") return 999;
    return -(Math.hypot(x - 3.5, y - 3.5) / 5) * 2.4;
  }, true),
  proc("Snowflake", "pg-mandala-snow", "ease-in-out", 2.4, (x, y) => {
    const m = ["...SS...", "S..SS..S", ".S.SS.S.", "SSSSSSSS", "SSSSSSSS", ".S.SS.S.", "S..SS..S", "...SS..."];
    if (m[y][x] !== "S") return 999;
    return -(Math.hypot(x - 3.5, y - 3.5) / 5) * 2.4;
  }, true),
  proc("Gear", "pg-mandala-gear", "ease-in-out", 2, (x, y) => {
    const m = ["GG.GG.GG", "GGGGGGGG", ".GG..GG.", "GG.GG.GG", "GG.GG.GG", ".GG..GG.", "GGGGGGGG", "GG.GG.GG"];
    if (m[y][x] !== "G") return 999;
    return -(Math.hypot(x - 3.5, y - 3.5) / 5) * 2;
  }, true),
  proc("Kaleido", "pg-mandala-kaleido", "ease-in-out", 2.4, (x, y) => -(Math.floor(chebyshev(x, y)) / 4) * 2.4),
  proc("Spiral Mandala", "pg-mandala-spiral", "ease-in-out", 2.4, (x, y) => {
    const a = Math.atan2(y - 3.5, x - 3.5);
    return -((a + Math.PI) / (Math.PI * 2)) * 2.4;
  }),
  proc("Pulse Square", "pg-mandala-pulse", "ease-in-out", 1.8, (x, y) => -(Math.floor(chebyshev(x, y)) / 8) * 1.8),
  proc("Check Mandala", "pg-mandala-checker", "ease-in-out", 1.8, (x, y) => {
    if ((x + y) % 2 !== 0) return 999;
    return -(Math.floor(chebyshev(x, y)) / 4) * 1.8;
  }, true),
  proc("Octagon", "pg-mandala-oct", "ease-in-out", 2, (x, y) => {
    const m = ["..OOOO..", ".O....O.", "O......O", "O......O", "O......O", "O......O", ".O....O.", "..OOOO.."];
    if (m[y][x] !== "O") return 999;
    return -((Math.atan2(y - 3.5, x - 3.5) + Math.PI) / (Math.PI * 2)) * 2;
  }, true),
  proc("Lotus", "pg-mandala-lotus", "ease-in-out", 3, (x, y) => {
    const m = ["...LL...", "..LLLL..", ".LLLLLL.", "LLLLLLLL", "LLLLLLLL", ".LLLLLL.", "..LLLL..", "...LL..."];
    if (m[y][x] !== "L") return 999;
    return -(Math.floor(chebyshev(x, y)) / 4) * 3;
  }, true),
  // Story and comm loaders
  ...STORIES,
  ...COMM_LOADERS
];
function toSlug(name) {
  return name.toLowerCase().replace(/[\s.]+/g, "-").replace(/[^a-z0-9-]/g, "");
}
var LOADER_REGISTRY = {};
for (const def of DEFS) {
  LOADER_REGISTRY[toSlug(def.name)] = def;
}
var ALIASES = {
  "knight": "knight-tour",
  "sine": "sine-wave",
  "twin": "twin-spirals",
  "loadbar": "loadbar",
  "heartbeat-scale": "heartbeat-scale",
  "spiral-scale": "spiral-scale",
  "diamond-mandala": "diamond-mandala",
  "square-mandala": "square-mandala"
};
for (const [alias, target] of Object.entries(ALIASES)) {
  if (!LOADER_REGISTRY[alias] && LOADER_REGISTRY[target]) {
    LOADER_REGISTRY[alias] = LOADER_REGISTRY[target];
  }
}

// src/Loader.tsx
import { jsx } from "react/jsx-runtime";
var DEFAULT_ANIMATION_COLORS = {
  "pg-rain-fade": "#36ffc8",
  "pg-think": "#8b5cff",
  "pg-search": "#00f0ff",
  "pg-find": "#b6ff3c",
  "pg-consolidate": "#ffb547",
  "pg-stream": "#36ffc8",
  "pg-reason": "#ff5d9e",
  "pg-index": "#f8ff5e",
  "pg-connect": "#00f0ff",
  "pg-generate": "#ff2bd6",
  "pg-reflect": "#8b5cff",
  "pg-mandala-round": "#00f0ff",
  "pg-mandala-square": "#ff2bd6",
  "pg-mandala-diamond": "#8b5cff",
  "pg-mandala-cross": "#f8ff5e",
  "pg-mandala-x": "#ff5d9e",
  "pg-mandala-star": "#ffb547",
  "pg-mandala-petal": "#ff5d9e",
  "pg-mandala-snow": "#00f0ff",
  "pg-mandala-gear": "#36ffc8",
  "pg-mandala-kaleido": "#00f0ff",
  "pg-mandala-spiral": "#8b5cff",
  "pg-mandala-pulse": "#ffb547",
  "pg-mandala-checker": "#36ffc8",
  "pg-mandala-oct": "#f8ff5e",
  "pg-mandala-lotus": "#ff5d9e",
  "pg-scale-cyan": "#00f0ff",
  "pg-scale-magenta": "#ff2bd6",
  "pg-scale-violet": "#8b5cff",
  "pg-scale-amber": "#ffb547",
  "pg-scale-mint": "#36ffc8",
  "pg-scale-pink": "#ff5d9e",
  "pg-twist": "#00f0ff",
  "pg-squash": "#ff2bd6",
  "pg-jelly": "#8b5cff",
  "pg-pop-rotate": "#ffb547",
  "pg-skew": "#36ffc8",
  "pg-heartbeat": "#ff5d9e",
  "pg-drop": "#00f0ff",
  "pg-burst": "#f8ff5e",
  "pg-spiral": "#8b5cff",
  "pg-zigzag": "#ff2bd6",
  "pg-pulse-cyan": "#00f0ff",
  "pg-pulse-magenta": "#ff2bd6",
  "pg-pulse-violet": "#8b5cff",
  "pg-pulse-mint": "#36ffc8",
  "pg-pulse-pink": "#ff5d9e",
  "pg-pulse-lime": "#b6ff3c",
  "pg-pulse-amber": "#ffb547",
  "pg-pulse-yellow": "#f8ff5e",
  "pg-plasma": "#00f0ff"
};
function applyFrame(pixels, frame, palette) {
  var _a, _b;
  for (let y = 0; y < 8; y++) {
    const row = (_a = frame[y]) != null ? _a : "........";
    for (let x = 0; x < 8; x++) {
      const ch = (_b = row[x]) != null ? _b : ".";
      const px = pixels[y * 8 + x];
      if (!px) continue;
      if (ch === "." || !palette[ch]) {
        px.classList.remove("on");
        px.style.removeProperty("--c");
      } else {
        px.classList.add("on");
        px.style.setProperty("--c", palette[ch]);
      }
    }
  }
}
function StoryLoader({
  def,
  size,
  gap,
  speed,
  className,
  style
}) {
  const pixelRefs = useRef([]);
  const frameRef = useRef(0);
  useEffect(() => {
    applyFrame(pixelRefs.current, def.frames[0], def.palette);
    const ms = def.duration * 1e3 / def.frames.length / speed;
    const id = setInterval(() => {
      if (document.hidden) return;
      frameRef.current = (frameRef.current + 1) % def.frames.length;
      applyFrame(pixelRefs.current, def.frames[frameRef.current], def.palette);
    }, ms);
    return () => clearInterval(id);
  }, [def, speed]);
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `hl-matrix sprite story${className ? ` ${className}` : ""}`,
      style: __spreadValues({
        display: "grid",
        gridTemplateColumns: `repeat(8, ${size}px)`,
        gridTemplateRows: `repeat(8, ${size}px)`,
        gap: `${gap}px`
      }, style),
      children: Array.from({ length: 64 }, (_, i) => /* @__PURE__ */ jsx(
        "div",
        {
          className: "hl-px",
          ref: (el) => {
            pixelRefs.current[i] = el;
          }
        },
        i
      ))
    }
  );
}
function SpriteLoader({
  def,
  size,
  gap,
  speed,
  className,
  style
}) {
  const actualDuration = def.matrixDuration / speed;
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `hl-matrix sprite${className ? ` ${className}` : ""}`,
      style: __spreadValues({
        display: "grid",
        gridTemplateColumns: `repeat(8, ${size}px)`,
        gridTemplateRows: `repeat(8, ${size}px)`,
        gap: `${gap}px`,
        animationName: def.matrixAnim,
        animationDuration: `${actualDuration}s`,
        animationTimingFunction: "ease-in-out",
        animationIterationCount: "infinite"
      }, style),
      children: Array.from({ length: 64 }, (_, i) => {
        var _a, _b;
        const x = i % 8;
        const y = Math.floor(i / 8);
        const ch = (_b = (_a = def.map[y]) == null ? void 0 : _a[x]) != null ? _b : ".";
        const color = ch !== "." ? def.colors[ch] : void 0;
        const isBlink = color && def.blinkChar && ch === def.blinkChar;
        const isDetail = color && def.detailChar && ch === def.detailChar;
        const classes = ["hl-px"];
        if (color) classes.push("on");
        if (isBlink) classes.push("blink-eye");
        else if (isDetail) classes.push("detail");
        const pxStyle = {};
        if (color) pxStyle["--c"] = color;
        if (isDetail) pxStyle.animationDelay = `${(x * 0.05 + y * 0.07).toFixed(2)}s`;
        else if (color && !isBlink) pxStyle.animationDelay = `${((x + y) * 0.08).toFixed(2)}s`;
        return /* @__PURE__ */ jsx("div", { className: classes.join(" "), style: pxStyle }, i);
      })
    }
  );
}
function ProceduralLoader({
  def,
  size,
  gap,
  speed,
  color,
  className,
  style
}) {
  var _a;
  const duration = def.duration / speed;
  const colorVars = {};
  colorVars["--loader-color"] = (_a = color != null ? color : DEFAULT_ANIMATION_COLORS[def.animName]) != null ? _a : "#00f0ff";
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `hl-matrix${className ? ` ${className}` : ""}`,
      style: __spreadValues(__spreadValues({
        display: "grid",
        gridTemplateColumns: `repeat(8, ${size}px)`,
        gridTemplateRows: `repeat(8, ${size}px)`,
        gap: `${gap}px`
      }, colorVars), style),
      children: Array.from({ length: 64 }, (_, i) => {
        const x = i % 8;
        const y = Math.floor(i / 8);
        const delay = def.delay(x, y, i);
        const skip = def.skipOnNine && delay === 999;
        return /* @__PURE__ */ jsx(
          "div",
          {
            className: "hl-px",
            style: skip ? { animation: "none", background: "rgba(255,255,255,0.04)" } : {
              animationName: def.animName,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
              animationTimingFunction: def.easing,
              animationIterationCount: "infinite",
              animationFillMode: "none"
            }
          },
          i
        );
      })
    }
  );
}
function Loader({
  name,
  color,
  size = 12,
  gap = 2,
  speed = 1,
  className,
  style
}) {
  useEffect(() => {
    injectCSS();
  }, []);
  const slug = name.toLowerCase();
  const def = LOADER_REGISTRY[slug];
  if (!def) return null;
  if (def.kind === "story") {
    return /* @__PURE__ */ jsx(StoryLoader, { def, size, gap, speed, className, style });
  }
  if (def.kind === "sprite") {
    return /* @__PURE__ */ jsx(SpriteLoader, { def, size, gap, speed, className, style });
  }
  return /* @__PURE__ */ jsx(ProceduralLoader, { def, size, gap, speed, color, className, style });
}
export {
  Loader
};
