import type { Metadata } from "next";
import { LoaderExplorer } from "./explorer";
import { TOTAL } from "./groups";

export const metadata: Metadata = {
  title: `Loaders — all ${TOTAL}`,
  description: "Every loader in the soonish package, grouped by category.",
};

// Stays a Server Component so metadata works; the colour picker needs state, so
// the body lives in a client component.
export default function LoadersPage() {
  return (
    <main className="min-h-screen w-full px-6 py-12 md:px-10" style={{ background: "var(--bg)", color: "#fafafa" }}>
      <div className="mx-auto max-w-screen-xl">
        <LoaderExplorer />
      </div>
    </main>
  );
}
