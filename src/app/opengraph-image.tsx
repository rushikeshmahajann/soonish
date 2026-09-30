import { ImageResponse } from "next/og";
import { BrandMark } from "@/lib/brandMark";
import { TOTAL } from "./loaders/groups";

export const alt = `soonish — ${TOTAL} 5×5 pixel loaders for React`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** The social preview for every page: the mark, the name and the pitch. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 72,
          padding: "0 110px",
          background: "#0a0a0a",
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex", padding: 44, borderRadius: 48, background: "#141414" }}>
          <BrandMark dot={40} gap={14} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", fontSize: 96, fontWeight: 600, letterSpacing: -4 }}>soonish</div>
          {/* One string per line: next/og requires display:flex on any div
              with more than one child node, and "{TOTAL} text" is two. */}
          <div style={{ display: "flex", fontSize: 36, color: "rgba(255,255,255,0.55)" }}>
            {`${TOTAL} 5×5 pixel loaders for React`}
          </div>
          <div style={{ display: "flex", fontSize: 26, color: "rgba(255,255,255,0.35)" }}>
            {"npx shadcn add · copy the code, it's yours"}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
