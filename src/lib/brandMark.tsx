// The soonish mark — an S lit on a 5×5 dot grid — as plain flexbox divs, so
// next/og's ImageResponse can render it for the apple-icon and the social
// preview image. (app/icon.svg is the same mark as a static SVG.)
const S = ["01111", "10000", "01110", "00001", "11110"];

export const MARK_LIT = "#CDC868";
export const MARK_UNLIT = "#3A3A3A";

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
                background: cell === "1" ? MARK_LIT : MARK_UNLIT,
                boxShadow: cell === "1" ? `0 0 ${dot * 0.6}px ${MARK_LIT}66` : "none",
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
