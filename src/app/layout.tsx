import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Pixelify_Sans } from "next/font/google";
import localFont from "next/font/local";
import GradualBlur from "@/components/GradualBlur";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

// Pixelify Sans is variable across wght 400–700, so no weight is needed.
const pixelifySans = Pixelify_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-pixelify-sans",
});

// PP Mori ships only three weights (200 / 400 / 600), each with an italic.
// Asking for 300, 500, 700 etc. in CSS makes the browser synthesize them from
// the nearest real face rather than loading a dedicated file.
const ppMori = localFont({
  variable: "--font-pp-mori",
  display: "swap",
  src: [
    { path: "./fonts/PPMori-Extralight.otf", weight: "200", style: "normal" },
    { path: "./fonts/PPMori-ExtralightItalic.otf", weight: "200", style: "italic" },
    { path: "./fonts/PPMori-Regular.otf", weight: "400", style: "normal" },
    { path: "./fonts/PPMori-RegularItalic.otf", weight: "400", style: "italic" },
    { path: "./fonts/PPMori-SemiBold.otf", weight: "600", style: "normal" },
    { path: "./fonts/PPMori-SemiBoldItalic.otf", weight: "600", style: "italic" },
  ],
});

export const metadata: Metadata = {
  title: "Pixel Loaders — 5×5 Matrix Animations",
  description:
    "A library of 68 compact 5×5 matrix loading animations. Pure CSS with muted pastel colors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Browser extensions inject attributes on <html>/<body> before hydration
    // (e.g. cz-shortcut-listen, data-dex-recorder-ready), which React reports
    // as a mismatch. Suppression is one level deep, so real mismatches inside
    // the tree still surface.
    <html
      lang="en"
      className={`${inter.className} ${jetbrainsMono.variable} ${pixelifySans.variable} ${ppMori.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        {children}
        {/* Site-wide bottom fade. target="page" makes it position:fixed, so it
            pins to the viewport bottom on every route instead of anchoring to
            a parent. The component adds +100 to zIndex when target is "page",
            so this lands at 200 — above the docs header (z-50), below nothing
            that matters. pointerEvents is none, so it never blocks clicks. */}
        <GradualBlur
          target="page"
          position="bottom"
          height="7rem"
          strength={1}
          saturation={1.5}
          divCount={5}
          curve="bezier"
          exponential
          opacity={1}
          zIndex={100}
        />
      </body>
    </html>
  );
}
