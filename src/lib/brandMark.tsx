// The soonish mark — an S lit on a 5×5 dot grid — as plain flexbox divs, so
// next/og's ImageResponse can render it for the apple-icon and the social
// preview image. (app/icon.svg is the same mark as a static SVG.)
//
// Satori does not parse oklch(), so the tokens are resolved to hex/rgba here;
// the oklch strings stay the source of truth.
import { oklchToHex, oklchToRgba } from "@/lib/color";

const S = ["01111", "10000", "01110", "00001", "11110"];

export const MARK_LIT = "oklch(0.817 0.119 106.075)";
export const MARK_UNLIT = "oklch(0.348 0 0)";

const LIT = oklchToHex(MARK_LIT);
const UNLIT = oklchToHex(MARK_UNLIT);
const GLOW = oklchToRgba(MARK_LIT, 0.4);

export function BrandMark({ dot, gap }: { dot: number; gap: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap }}>
      {S.map((row, y) => (
        <div key={y} style={{ display: "flex", gap }}>
          {[...row].map((cell, x) => (
            <div
              key={x}
              style={{
                width: dot,
                height: dot,
                borderRadius: dot / 2,
                background: cell === "1" ? LIT : UNLIT,
                boxShadow: cell === "1" ? `0 0 ${dot * 0.6}px ${GLOW}` : "none",
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
