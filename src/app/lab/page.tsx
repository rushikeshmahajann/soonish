import type { Metadata } from "next";
import "./lab.css";

export const metadata: Metadata = {
  title: "Lab — Appearance panel",
  description:
    "Recreation of the experiment-01 settings panel: gradient borders, shadow ladders and :has() theming.",
};

const THEMES = [
  { id: "dark", label: "Dark theme" },
  { id: "light", label: "Light theme" },
  { id: "gold", label: "Golden theme" },
] as const;

export default function LabPage() {
  return (
    <div className="lab-page">
      <main className="lab-main">
        {/* Radios live at the top so `.lab-main:has(#tp-gold:checked)` can theme
            the whole subtree. Pure CSS — no state, no client component. */}
        {THEMES.map((t) => (
          <input
            key={t.id}
            className="lab-sr"
            id={`tp-${t.id}`}
            type="radio"
            name="theme-picker"
            defaultChecked={t.id === "dark"}
            aria-label={t.label}
          />
        ))}

        <div className="lab-container">
          <header className="lab-header">
            <h2 className="lab-title">Appearance</h2>
            <button className="lab-btn lab-btn-icon" aria-label="Close">
              <svg viewBox="0 0 18 18" width="18" height="18" aria-hidden="true">
                <g fill="currentColor">
                  <path d="M4,14.75c-.192,0-.384-.073-.53-.22-.293-.293-.293-.768,0-1.061L13.47,3.47c.293-.293,.768-.293,1.061,0s.293,.768,0,1.061L4.53,14.53c-.146,.146-.338,.22-.53,.22Z" />
                  <path d="M14,14.75c-.192,0-.384-.073-.53-.22L3.47,4.53c-.293-.293-.293-.768,0-1.061s.768-.293,1.061,0L14.53,13.47c.293,.293,.293,1.061,0,1.061-.146,.146-.338,.22-.53,.22Z" />
                </g>
              </svg>
            </button>
          </header>

          <div className="lab-body">
            <section className="lab-section">
              <h3 className="lab-text">Theme</h3>
              <p className="lab-text-subtle">Customize UI colors</p>

              <div className="lab-theme-picker">
                {THEMES.map((t) => (
                  <label key={t.id} className="lab-swatch" htmlFor={`tp-${t.id}`}>
                    {/* Stands in for the original's PNG previews. */}
                    <span className={`lab-swatch-img lab-swatch-${t.id}`} />
                  </label>
                ))}
              </div>
            </section>

            <div className="lab-row">
              <span className="lab-row-label">
                <span className="lab-text">Sidebar</span>
                <span className="lab-text-subtle">Make the sidebar transparent</span>
              </span>

              <label className="lab-switch" htmlFor="sidebar-switch">
                <input className="lab-switch-input" type="checkbox" id="sidebar-switch" />
                <span className="lab-switch-marker" aria-hidden="true" />
              </label>
            </div>
          </div>

          <footer className="lab-footer">
            <button className="lab-btn-secondary">Cancel</button>
            <button className="lab-btn">Save</button>
          </footer>
        </div>

        {/* Two blurred white orbs on `overlay` — these light the panel edges. */}
        <div className="lab-light lab-light-top" aria-hidden="true" />
        <div className="lab-light lab-light-bottom" aria-hidden="true" />

        {/* feTurbulence grain, screened over everything. */}
        <div className="lab-noise" aria-hidden="true">
          <svg>
            <filter id="lab-noise-fx">
              <feTurbulence baseFrequency="0.8" />
            </filter>
          </svg>
        </div>
      </main>
    </div>
  );
}
