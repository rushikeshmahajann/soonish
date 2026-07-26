"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "./nav";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="w-60 shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto py-8 pr-4 hidden md:block">
      <div className="space-y-6">
        {NAV.map((section) => (
          <div key={section.title}>
            <p className="mb-2 px-3 text-xs font-semibold tracking-widest uppercase"
               style={{ color: "#52525b" }}>
              {section.title}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="flex items-center px-3 py-1.5 rounded-md text-sm transition-colors"
                      style={{
                        color: active ? "#fafafa" : "#a1a1aa",
                        background: active ? "rgba(255,255,255,0.06)" : "transparent",
                        fontWeight: active ? 500 : 400,
                      }}
                    >
                      {item.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}
