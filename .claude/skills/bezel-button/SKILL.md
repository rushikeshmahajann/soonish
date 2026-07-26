---
name: bezel-button
description: House style for buttons in this repo — a dark raised "bezel" button with a masked gradient shine border, layered shadow ladder and a tactile press. Use whenever adding, restyling, or reviewing a <button>, CTA, pill, icon button, or any clickable surface that should look raised. Also use when asked for a glossy/shiny/3D/skeuomorphic button, a gradient border, or a shine edge on a rounded element.
---

# Bezel Button

The house button style. Already defined as `.custom-button` in `src/app/globals.css` —
**do not redefine it**, just apply the class.

## Usage

```tsx
<button className="custom-button font-mori tracking-tight px-6 py-2 rounded-full">
  Tuff
</button>
```

- `custom-button` — the bezel (surface, shine border, shadows, press)
- `font-mori tracking-tight` — house typeface, PP Mori
- `px-6 py-2` — standard padding; `px-4 py-1.5` for compact, `px-8 py-3` for hero
- `rounded-full` — pill. Any radius works; the shine inherits it automatically

For an icon-only button use a square footprint plus `rounded-full`:

```tsx
<button className="custom-button flex items-center justify-center h-[34px] w-[34px] rounded-full">
  <XIcon />
</button>
```

## What it is made of

Five layers, each doing a specific job. If a button looks flat, one is missing.

### 1. Off-centre light source

```css
background:
  radial-gradient(ellipse at -20px top, rgba(255,255,255,0.05), rgba(255,255,255,0)),
  var(--background-light-50, rgba(51,51,51,0.5));
```

The ellipse is anchored **outside** the element (`-20px`), so light rakes across
the top-left shoulder instead of sitting centred. This one line does most of the
"lit from above" read.

### 2. Shine border — light at BOTH ends

```css
.custom-button::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  border: 1.5px solid transparent;
  background: linear-gradient(180deg,
      rgba(255,255,255,0.75) 0%,    /* top: direct light */
      rgba(0,0,0,0.48) 41%,         /* sides: dark */
      rgba(0,0,0,0.26) 75%,
      rgba(255,255,255,0.25) 100%   /* bottom: bounce light, weaker */
    ) border-box;
  mix-blend-mode: overlay;
  -webkit-mask: linear-gradient(#000 0 0) padding-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#000 0 0) padding-box, linear-gradient(#000 0 0);
  mask-composite: exclude;
}
```

Four stops, **light at both ends with dark between**. Top edge catches direct
light, bottom edge catches weaker bounce light off the surface below, sides fall
dark. A single top-to-bottom fade reads flat.

`mix-blend-mode: overlay` is not optional — without it the dark stops paint flat
grey instead of darkening what is underneath, and the ring stops reading as
material.

### 3. Double rim

```css
inset 0 0 0 1px rgba(255,255,255,0.04),   /* top surface catching light */
0 0 0 1px rgba(0,0,0,0.45),               /* separation from the background */
```

### 4. Shadow ladder

```css
0 40px 11px rgba(0,0,0,0.01),
0 26px 10px rgba(0,0,0,0.025),
0 14px 9px  rgba(0,0,0,0.1),
0 6px  6px  rgba(0,0,0,0.15),
0 2px  4px  rgba(0,0,0,0.25);
```

Blur **decreases** as opacity **increases** — wide-and-faint through to
tight-and-dark. That gradient is contact occlusion. A single `0 4px 12px` shadow
cannot produce it.

### 5. Press

```css
transition:
  translate 0.24s cubic-bezier(0.22, 1, 0.36, 1),
  box-shadow 0.24s cubic-bezier(0.22, 1, 0.36, 1);

:active {
  translate: 0 1px;
  transition-duration: 0.06s;   /* press ~4x faster than release */
  /* + shadow ladder with every offset roughly halved */
}
```

Asymmetric timing is what makes it feel mechanical: snap down, ease back. The
shadow **must** compress along with the translate — moving the button while the
shadow stays put reads as a slide, not a press.

Text uses `text-shadow: 0 -1px 0 rgba(0,0,0,0.5)`. Negative Y engraves it, which
is correct for a dark surface lit from above. Flip to positive Y on light
surfaces.

## Traps

**Never write multiple `box-shadow` lines.** Same property, same selector, same
specificity means the last one wins and the rest are silently discarded. Figma
exports one shadow per line — always merge them comma-separated into a single
declaration.

**Never use `border-image` for a gradient border.** It ignores `border-radius`
and will square off a pill. The masked pseudo-element above is the only approach
that gives a gradient border on a rounded shape.

**Never use a plain `border` for the shine.** A border paints one flat colour the
whole way round and cannot vary top-to-bottom.

**Keep `mix-blend-mode: overlay`** on the ring, and `pointer-events: none` so it
never eats clicks.

## Related

`src/app/lab/lab.css` has a scoped copy (`.lab-btn`) for the experiment page.
The two are currently maintained separately — if the bezel changes here, update
both, or extract a shared `<Button>` component first.
