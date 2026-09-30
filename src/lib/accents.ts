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
  { id: "yellow", label: "Yellow", accent: "#CDC868", from: "#FFF3B7", to: "#FFE748", dot: ["#FFFFF0", "#F5E97A", "#C8B820"] },
  { id: "mint", label: "Mint", accent: "#71DCB0", from: "#C5FFDA", to: "#6FFFB8", dot: ["#F2FFF9", "#8AFFC8", "#39D396"] },
  { id: "cyan", label: "Cyan", accent: "#50D9E8", from: "#B7FEFF", to: "#1CF6FF", dot: ["#F0FDFE", "#72F5FF", "#00CEDA"] },
  { id: "blue", label: "Blue", accent: "#88C2FF", from: "#D4EBFE", to: "#A1D4FF", dot: ["#F7FAFE", "#B3DAFF", "#64B7FF"] },
  { id: "violet", label: "Violet", accent: "#C4B2FE", from: "#E4E3FE", to: "#C8C1FF", dot: ["#FBFAFF", "#D5CDFF", "#B29FFF"] },
  { id: "pink", label: "Pink", accent: "#FAA4D5", from: "#FFDCF4", to: "#FFB1E6", dot: ["#FEFAFC", "#FFBAE4", "#F68BD1"] },
  { id: "coral", label: "Coral", accent: "#FFA39C", from: "#FFD9DA", to: "#FFB7B6", dot: ["#FEF8F8", "#FFC4C1", "#FF8786"] },
  { id: "orange", label: "Orange", accent: "#FCB172", from: "#FFE1D0", to: "#FFBA8C", dot: ["#FEFAF7", "#FFC69E", "#FD9846"] },
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
