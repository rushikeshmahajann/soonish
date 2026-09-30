import { ImageResponse } from "next/og";
import { BrandMark } from "@/lib/brandMark";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Home-screen icon: the S mark on the site's near-black tile. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#141414" }}>
        <BrandMark dot={22} gap={8} />
      </div>
    ),
    size,
  );
}
