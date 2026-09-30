import { useId } from "react";
import { cn } from "@/lib/utils";

// The S, as the lit dots of a 5×5 matrix — the same grid the loaders use.
const S = [
  "01111",
  "10000",
  "01110",
  "00001",
  "11110",
];

// Dot centres and radius from the original 256×256 export
// (public/Soonish App Icon — SVG Export.svg).
const PITCH = 35.2;
const ORIGIN = 57.6;
const R = 13.2;

const DOTS = S.flatMap((row, y) => [...row].map((cell, x) => ({ x, y, lit: cell === "1" })));

// Opaque wherever the source has any alpha. The export re-derives this before
// every shadow pass; it is computed once here and referenced by name.
const HARD_ALPHA = "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0";

/**
 * The soonish app icon: a bezel tile with an S spelled in glowing glass dots.
 *
 * Rebuilt from the Figma export rather than inlined as-is. The export repeats
 * one gradient and one filter stack per dot (25 of each, 53 KB); every lit dot
 * is identical apart from position, as is every unlit one, so this declares
 * each style once in objectBoundingBox units and generates the grid from S.
 *
 * The lit dots follow the page accent. Their gradient stops and both halves of
 * their glow read --brand-dot-light / --brand-dot / --brand-dot-dark, which
 * AccentProvider updates — so the icon recolours with the loaders and needs no
 * client JS. The export baked the glow colour into feColorMatrix values, which
 * cannot read a CSS variable, so each glow is an feFlood clipped to the same
 * blurred mask instead: identical output, but flood-color is a CSS property.
 * The fallbacks are the original yellow.
 */
export function SoonishIcon({ size = 40, className }: { size?: number; className?: string }) {
  // Several icons can share a page, and filter/gradient ids are document-wide.
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const id = (name: string) => `soonish-${uid}-${name}`;

  return (
    // The tile is the house bezel — the same .custom-button surface, shine ring
    // and shadow ladder as the pnpm/npm/bun switcher — rather than the
    // export's own silver gradient, so the icon sits in the page's material
    // and follows the bezel if it changes. 20.3125% is the export's rx=52 on
    // 256, so the corner scales with `size`; the shine ring inherits it.
    //
    // Only the surface is overridden (inline, so it beats the unlayered
    // .custom-button rule): a radial glow just above centre, falling off to
    // a slightly darker edge than the bezel's flat ~#1E1E1E. The edge stays
    // above the page's #0A0A0A so the tile still reads as raised.
    <span
      className={cn("custom-button inline-block shrink-0", className)}
      style={{
        width: size,
        height: size,
        borderRadius: "20.3125%",
        background: "radial-gradient(circle at 50% 35%, #262626 0%, #171717 55%, #0F0F0F 100%)",
      }}
    >
      <svg width="100%" height="100%" viewBox="0 0 256 256" fill="none" role="img" aria-label="soonish" className="block">
      <defs>
        {/* Glass bead shading, shared by both dot kinds; only the colours differ.
            objectBoundingBox so one definition fits every dot. */}
        <radialGradient
          id={id("lit")}
          cx="0"
          cy="0"
          r="1"
          gradientTransform="matrix(0.65 0.2 0.15 0.7 0.35 0.3)"
        >
          <stop style={{ stopColor: "var(--brand-dot-light, #FFFFF0)" }} />
          <stop offset="0.4" style={{ stopColor: "var(--brand-dot, #F5E97A)" }} />
          <stop offset="1" style={{ stopColor: "var(--brand-dot-dark, #C8B820)" }} />
        </radialGradient>
        {/* Unlit bead: the export's #E0E0DB / #C7C9C4 / #949996 taken 0.18 darker
            in OKLCH lightness, so the "off" dots recede on the dark tile and
            the S reads as the only bright shape when it is lit. */}
        <radialGradient
          id={id("unlit")}
          cx="0"
          cy="0"
          r="1"
          gradientTransform="matrix(0.65 0.2 0.15 0.7 0.35 0.3)"
        >
          <stop stopColor="#A6A6A2" />
          <stop offset="0.4" stopColor="#8F918C" />
          <stop offset="1" stopColor="#5F6461" />
        </radialGradient>

        {/* Lit dot: wide accent glow, a tighter darker drop, a white rim. */}
        <filter
          id={id("lit-fx")}
          x="-0.5833"
          y="-0.5833"
          width="2.1667"
          height="2.1667"
          colorInterpolationFilters="sRGB"
        >
          <feColorMatrix in="SourceAlpha" type="matrix" values={HARD_ALPHA} result="hardAlpha" />
          <feMorphology in="SourceAlpha" operator="dilate" radius="2.2" />
          <feGaussianBlur stdDeviation="6.6" />
          <feComposite in2="hardAlpha" operator="out" result="glowMask" />
          <feFlood floodOpacity="0.6" style={{ floodColor: "var(--brand-dot, #F5E97A)" }} />
          <feComposite in2="glowMask" operator="in" result="glow" />
          <feOffset in="hardAlpha" dy="4.4" />
          <feGaussianBlur stdDeviation="4.4" />
          <feComposite in2="hardAlpha" operator="out" result="dropMask" />
          <feFlood floodOpacity="0.4" style={{ floodColor: "var(--brand-dot-dark, #C8B820)" }} />
          <feComposite in2="dropMask" operator="in" />
          <feBlend mode="normal" in2="glow" result="shadows" />
          <feBlend mode="normal" in="SourceGraphic" in2="shadows" result="shape" />
          <feOffset in="hardAlpha" dx="1.1" dy="2.2" />
          <feGaussianBlur stdDeviation="1.1" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.376471 0" />
          <feBlend mode="normal" in2="shape" />
        </filter>

        {/* Unlit dot: a soft grey drop, a light top-left rim, a dark bottom-right one. */}
        <filter
          id={id("unlit-fx")}
          x="-0.1667"
          y="-0.0833"
          width="1.3333"
          height="1.3333"
          colorInterpolationFilters="sRGB"
        >
          <feColorMatrix in="SourceAlpha" type="matrix" values={HARD_ALPHA} result="hardAlpha" />
          <feMorphology in="SourceAlpha" operator="erode" radius="1.1" />
          <feOffset dy="2.2" />
          <feGaussianBlur stdDeviation="2.75" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.3 0 0 0 0 0.31 0 0 0 0 0.3 0 0 0 0.24 0" result="drop" />
          <feBlend mode="normal" in="SourceGraphic" in2="drop" result="shape" />
          <feOffset in="hardAlpha" dx="-1.1" dy="-1.1" />
          <feGaussianBlur stdDeviation="1.1" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.38 0" />
          <feBlend mode="screen" in2="shape" result="rimLight" />
          <feOffset in="hardAlpha" dx="1.1" dy="1.1" />
          <feGaussianBlur stdDeviation="1.1" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.26 0 0 0 0 0.28 0 0 0 0 0.27 0 0 0 0.22 0" />
          <feBlend mode="multiply" in2="rimLight" />
        </filter>
      </defs>


      {/* Every position gets an unlit dot, so the S has something to switch
          on over. */}
      {DOTS.map(({ x, y }) => (
        <circle
          key={`off-${x}-${y}`}
          cx={ORIGIN + x * PITCH}
          cy={ORIGIN + y * PITCH}
          r={R}
          fill={`url(#${id("unlit")})`}
          filter={`url(#${id("unlit-fx")})`}
        />
      ))}

      {/* The S as one layer on top, so the flicker (soonish-icon-s in
          globals.css) animates a single group's opacity instead of 13 dots. */}
      <g className="soonish-icon-s">
        {DOTS.filter((d) => d.lit).map(({ x, y }) => (
          <circle
            key={`on-${x}-${y}`}
            cx={ORIGIN + x * PITCH}
            cy={ORIGIN + y * PITCH}
            r={R}
            fill={`url(#${id("lit")})`}
            filter={`url(#${id("lit-fx")})`}
          />
        ))}
      </g>
      </svg>
    </span>
  );
}
