import type { ReactNode } from "react";
import { PreviewTabs } from "@/components/PreviewTabs";
import { CodeBlock } from "./CodeBlock";

/**
 * A live example: Preview / Code tabs over one panel, exactly like the landing
 * page's Usage block (both use PreviewTabs). `children` is the preview — bare
 * LiveLoaders, since the panel already provides the surface; the Code tab is
 * the highlighted snippet with its copy button.
 */
export function Example({
  code,
  filename,
  lang = "tsx",
  children,
}: {
  code: string;
  filename?: string;
  lang?: string;
  children: ReactNode;
}) {
  return (
    <div className="my-7 flex flex-col gap-3">
      <PreviewTabs
        preview={<div className="w-full px-4 py-8">{children}</div>}
        code={<CodeBlock bare code={code} filename={filename} lang={lang} />}
      />
    </div>
  );
}
