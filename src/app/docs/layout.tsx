import { Sidebar } from "@/components/docs/Sidebar";
import { MobileDocsNav } from "@/components/docs/MobileDocsNav";
import { AccentProvider } from "@/components/AccentProvider";
import { AccentMenu } from "@/components/AccentMenu";
import { PackageManagerProvider } from "@/components/PackageToggle";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";

/**
 * Docs shell, in the landing page's design language: the same navbar, accent
 * colour, footer and accent menu. The accent persists across routes (it is
 * stored and applied before paint), so the docs open in whatever colour the
 * visitor picked on the landing page.
 */
export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <AccentProvider>
      <PackageManagerProvider>
        <div className="min-h-screen bg-(--bg) text-white">
          {/* The landing navbar as a fixed header. Content scrolls under it,
              so it gets the frosted page colour instead of the
              hero's transparency. h-16 is what the sidebar and "On this page"
              rail stick below (top-16). */}
          <SiteNav className="fixed inset-x-0 top-0 z-50 h-16 bg-(--bg)/80 backdrop-blur-xl" />

          {/* Clears the fixed header. */}
          <div aria-hidden="true" className="h-16" />
          {/* Phones only (the tree sidebar is hidden below md). A direct child of
              this full-height wrapper, so its sticky positioning lasts the
              whole page rather than ending with a short parent. */}
          <MobileDocsNav />
          <div className="mx-auto flex max-w-7xl px-6">
            <Sidebar />
            {children}
            {/* Mirror of the sidebar's width (w-60), so the content column sits
                centred on the page rather than centred in the space beside the
                sidebar. xl+ only: below that, a second 240px column would
                squeeze the 680px reading column. */}
            <div aria-hidden="true" className="hidden w-60 shrink-0 xl:block" />
          </div>

          <Footer />
          <AccentMenu />
        </div>
      </PackageManagerProvider>
    </AccentProvider>
  );
}
