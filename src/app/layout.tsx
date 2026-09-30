import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Pixelify_Sans } from "next/font/google";
import localFont from "next/font/local";
// Self-hosted by the `geist` package rather than fetched from Google, so it
// needs no next/font call of its own — it ships a ready-made NextFontWithVariable
// bound to --font-geist-mono. The variable face is ~30kb; geist/font/mono-non-variable
// is the ~300kb fallback for browsers without variable-font support.
import { GeistMono } from "geist/font/mono";
import GradualBlur from "@/components/GradualBlur";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ACCENT_BOOT_SCRIPT } from "@/lib/accents";
import { registryOrigin } from "@/lib/registry";
import { TOTAL } from "./loaders/groups";

// Inter is the sans face and also backs --font-sans, so the `font-sans`
// utility resolves to it rather than to a second, never-rendered sans.
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
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

// Only PP Mori Regular is loaded — it is the only face the site renders
// (font-medium falls back to it). The Extralight, SemiBold and italic cuts
// were preloaded on every page without ever being used; if a heavier weight
// is needed later, re-add that one file rather than the whole family.
const ppMori = localFont({
  variable: "--font-pp-mori",
  display: "swap",
  src: [{ path: "./fonts/PPMori-Regular.otf", weight: "400", style: "normal" }],
});

const DESCRIPTION = `${TOTAL} loading animations for React, each on a 5×5 grid of dots and animated with plain CSS. Install with the shadcn CLI — the code is yours.`;

export const metadata: Metadata = {
  // Absolute URLs for the OpenGraph image etc. Same origin the registry uses.
  metadataBase: new URL(registryOrigin()),
  title: {
    default: "soonish — 5×5 pixel loaders for React",
    // Child routes set just their own name: "Installation · soonish".
    template: "%s · soonish",
  },
  description: DESCRIPTION,
  openGraph: { title: "soonish", description: DESCRIPTION, type: "website", siteName: "soonish" },
  twitter: { card: "summary_large_image", title: "soonish", description: DESCRIPTION },
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
      className={cn(inter.className, inter.variable, GeistMono.variable, jetbrainsMono.variable, pixelifySans.variable, ppMori.variable, "font-sans")}
      suppressHydrationWarning
    >
      <head>
        {/* Applies a saved accent colour before the body paints — a plain
            synchronous script, since next/script's strategies all run too late
            to prevent a flash of the default yellow. It sets inline styles on
            <html>, which the suppressHydrationWarning above already covers. */}
        <script dangerouslySetInnerHTML={{ __html: ACCENT_BOOT_SCRIPT }} />
      </head>
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
