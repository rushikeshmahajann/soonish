import Link from "next/link";
import { Sidebar } from "@/components/docs/Sidebar";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: "#050505", color: "#fafafa" }}>
      {/* Top nav */}
      <header
        className="fixed top-0 inset-x-0 z-50 h-14 flex items-center px-6 gap-6"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(5,5,5,0.92)", backdropFilter: "blur(12px)" }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 5px)", gap: "1px" }}>
            {Array.from({ length: 9 }, (_, i) => (
              <span
                key={i}
                style={{
                  width: 5, height: 5,
                  background: i === 4 ? "#f1f1f1" : "#8f8f8f",
                  boxShadow: "none",
                  borderRadius: 1,
                }}
              />
            ))}
          </div>
          <span className="text-sm font-semibold tracking-tight" style={{ fontFamily: "monospace", color: "#fafafa" }}>
            1hundo-loaders
          </span>
        </Link>

        <span style={{ width: 1, height: 20, background: "rgba(255,255,255,0.1)" }} />

        <Link href="/docs" className="text-sm" style={{ color: "#a1a1aa" }}>
          Docs
        </Link>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-4">
          <Link
            href="/"
            className="text-sm transition-colors"
            style={{ color: "#71717a" }}
          >
            Showcase →
          </Link>
          <a
            href="https://www.npmjs.com/package/1hundo-loaders"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 text-xs px-3 py-1.5 rounded-md transition-all font-medium"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#fafafa",
            }}
          >
            npm i 1hundo-loaders
          </a>
        </div>
      </header>

      {/* Body */}
      <div className="flex pt-14 max-w-screen-xl mx-auto px-6">
        <Sidebar />
        {children}
      </div>
    </div>
  );
}
