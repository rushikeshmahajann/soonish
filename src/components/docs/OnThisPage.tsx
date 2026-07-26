"use client";

import { useEffect, useRef, useState } from "react";

export interface TocItem {
  id: string;
  title: string;
  level: 2 | 3;
}

export function OnThisPage({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: "0px 0px -70% 0px", threshold: 0 }
    );
    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });
    return () => observerRef.current?.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <aside className="w-52 shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto py-8 pl-4 hidden xl:block">
      <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#52525b" }}>
        On this page
      </p>
      <ul className="space-y-1.5">
        {items.map((item) => {
          const isActive = active === item.id;
          return (
            <li key={item.id} style={{ paddingLeft: item.level === 3 ? "12px" : "0" }}>
              <a
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
                  setActive(item.id);
                }}
                className="block text-xs leading-relaxed transition-colors"
                style={{
                  color: isActive ? "#d8d8d8" : "#71717a",
                  borderLeft: isActive ? "2px solid #d8d8d8" : "2px solid transparent",
                  paddingLeft: "8px",
                }}
              >
                {item.title}
              </a>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
