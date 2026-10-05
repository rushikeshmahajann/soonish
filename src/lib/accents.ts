// Landing-page accent palette.
//
// Every entry is the original yellow rotated around the OKLCH hue wheel, so
// they share its perceived lightness and saturation instead of being picked by
// eye. Yellow sits at the edge of the sRGB gamut, so for the bright gradient
// stops some hues trade a little lightness to keep their colourfulness —
// otherwise blue, violet and pink wash out to near-white.
//
//   accent — loaders and the PixelBlast background (was #CDC868)
//   from   — top of the heading gradient            (was #FFF3B7)
//   to     — bottom of the heading gradient         (was #FFE748)
//   dot    — a lit dot in the soonish icon: [highlight, body, edge], the
//            radial gradient of each glass bead (was #FFFFF0 / #F5E97A /
//            #C8B820). Body doubles as the glow, edge as the drop shadow.
export const ACCENTS = [
  { id: "yellow", label: "Yellow", accent: "oklch(0.817 0.119 106.075)", from: "oklch(0.959 0.077 98.126)", to: "oklch(0.921 0.17 100.422)", dot: ["oklch(0.996 0.02 106.75)", "oklch(0.921 0.133 103.122)", "oklch(0.772 0.155 102.784)"] },
  { id: "mint", label: "Mint", accent: "oklch(0.818 0.119 164.69)", from: "oklch(0.951 0.077 156.636)", to: "oklch(0.903 0.16 159.13)", dot: ["oklch(0.989 0.016 166.743)", "oklch(0.916 0.133 161.803)", "oklch(0.773 0.154 161.739)"] },
  { id: "cyan", label: "Cyan", accent: "oklch(0.818 0.118 205.454)", from: "oklch(0.951 0.07 197.139)", to: "oklch(0.885 0.148 199.644)", dot: ["oklch(0.985 0.014 202.46)", "oklch(0.9 0.116 202.109)", "oklch(0.775 0.132 202.261)"] },
  { id: "blue", label: "Blue", accent: "oklch(0.798 0.106 250.479)", from: "oklch(0.929 0.036 242.973)", to: "oklch(0.849 0.08 244.376)", dot: ["oklch(0.984 0.006 255.474)", "oklch(0.873 0.066 247.211)", "oklch(0.757 0.132 246.811)"] },
  { id: "violet", label: "Violet", accent: "oklch(0.806 0.107 294.748)", from: "oklch(0.925 0.036 287.363)", to: "oklch(0.838 0.086 289.571)", dot: ["oklch(0.987 0.007 295.454)", "oklch(0.871 0.069 292.239)", "oklch(0.757 0.136 291.898)"] },
  { id: "pink", label: "Pink", accent: "oklch(0.818 0.118 344.849)", from: "oklch(0.93 0.05 337.46)", to: "oklch(0.85 0.112 339.145)", dot: ["oklch(0.989 0.005 345.276)", "oklch(0.865 0.095 342.151)", "oklch(0.773 0.154 341.598)"] },
  { id: "coral", label: "Coral", accent: "oklch(0.806 0.11 24.532)", from: "oklch(0.917 0.042 16.158)", to: "oklch(0.846 0.084 19.872)", dot: ["oklch(0.984 0.006 17.266)", "oklch(0.872 0.068 21.902)", "oklch(0.756 0.146 21.614)"] },
  { id: "orange", label: "Orange", accent: "oklch(0.819 0.118 60.077)", from: "oklch(0.93 0.04 51.458)", to: "oklch(0.843 0.1 54.597)", dot: ["oklch(0.987 0.006 59.654)", "oklch(0.868 0.084 56.407)", "oklch(0.771 0.154 56.516)"] },
] as const;

export type Accent = (typeof ACCENTS)[number];
export type AccentId = Accent["id"];

export const DEFAULT_ACCENT: Accent = ACCENTS[0];

export const ACCENT_STORAGE_KEY = "soonish-accent";

/** Writes an accent's three CSS variables onto an element (normally <html>). */
export function applyAccent(el: HTMLElement, a: Accent) {
  el.style.setProperty("--brand", a.accent);
  el.style.setProperty("--brand-from", a.from);
  el.style.setProperty("--brand-to", a.to);
  el.style.setProperty("--brand-dot-light", a.dot[0]);
  el.style.setProperty("--brand-dot", a.dot[1]);
  el.style.setProperty("--brand-dot-dark", a.dot[2]);
}

// Inlined into <head> by the root layout and run before the body paints, so a
// saved accent is applied on the very first frame instead of flashing yellow
// until React hydrates. It carries its own copy of the palette because nothing
// else has loaded yet; generating it from ACCENTS keeps the two from drifting.
export const ACCENT_BOOT_SCRIPT = `try{var a=${JSON.stringify(
  Object.fromEntries(ACCENTS.map((a) => [a.id, [a.accent, a.from, a.to, ...a.dot]])),
)}[localStorage.getItem(${JSON.stringify(ACCENT_STORAGE_KEY)})];if(a){var s=document.documentElement.style;s.setProperty("--brand",a[0]);s.setProperty("--brand-from",a[1]);s.setProperty("--brand-to",a[2]);s.setProperty("--brand-dot-light",a[3]);s.setProperty("--brand-dot",a[4]);s.setProperty("--brand-dot-dark",a[5]);}}catch(e){}`;
