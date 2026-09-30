import { highlight } from "sugar-high";
import { CopyButton } from "@/components/CopyButton";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  /** "tsx" | "ts" | "js" are highlighted; "tree" is a file listing; anything else is plain. */
  lang?: string;
  filename?: string;
  /** Show the copy button. Defaults to on, except for "tree" — nobody copies a file listing. */
  copy?: boolean;
  /** Drop the block's own surface and margin — for use inside a panel that has one (PreviewTabs). */
  bare?: boolean;
}

const HIGHLIGHTED = new Set(["tsx", "ts", "jsx", "js"]);

/**
 * A minimal code sample: one quiet surface, no header bar. The filename (if
 * any) sits as a small label inside the block, and the copy button floats in
 * the corner, showing on hover — always shown on touch screens and on focus.
 *
 * Highlighting is sugar-high, run here on the server, so no highlighter ships
 * to the browser. Its token colours are CSS variables (.code-block in
 * globals.css): mostly white at different strengths, with strings in the page
 * accent so code follows the accent menu too.
 */
export function CodeBlock({ code, lang = "tsx", filename, copy, bare = false }: CodeBlockProps) {
  const source = code.trim();
  const showCopy = copy ?? lang !== "tree";
  const html = HIGHLIGHTED.has(lang) ? highlight(source) : null;

  return (
    <div className={cn("group code-block relative", !bare && "my-7 rounded-lg bg-white/2 ring-1 ring-white/4 ring-inset")}>
      {filename && <div className="px-5 pt-4 font-mono text-xs text-white/30">{filename}</div>}
      {showCopy && (
        <CopyButton
          value={source}
          label={filename ? `${filename} code` : "code"}
          className="absolute top-2.5 right-2.5 rounded-md opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 [@media(hover:none)]:opacity-100"
        />
      )}
      {/* overflow-x-auto keeps long lines inside the block rather than widening the column. */}
      <pre className={cn("overflow-x-auto px-5 pb-4 text-[13px] leading-[1.7]", filename ? "pt-2.5" : "pt-4")}>
        {html ? (
          <code className="font-mono" dangerouslySetInnerHTML={{ __html: html }} />
        ) : lang === "tree" ? (
          // File listing: names at body strength, `# notes` dimmed like comments.
          <code className="font-mono text-white/60">
            {source.split("\n").map((line, i) => {
              const at = line.indexOf("#");
              return (
                <span key={i} className="block">
                  {at === -1 ? line : line.slice(0, at)}
                  {at !== -1 && <span className="text-white/28">{line.slice(at)}</span>}
                </span>
              );
            })}
          </code>
        ) : (
          <code className="font-mono text-white/60">{source}</code>
        )}
      </pre>
    </div>
  );
}
