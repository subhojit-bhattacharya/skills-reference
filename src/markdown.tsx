import type { ReactNode } from "react";

/**
 * Render the small inline markdown the reference uses: code, bold, italic.
 *
 * The reference writes file names and commands as `code`. Anything that prints
 * one of those strings straight into JSX shows the backticks to the reader,
 * which is how `AGENTS.md` and `docs/adr/` ended up on the page wearing them.
 * Every component that prints text out of data.ts should come through here.
 */
export function inline(text: string): ReactNode[] {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g);

  return parts.map((p, i) => {
    if (p.startsWith("`") && p.endsWith("`"))
      return (
        <code
          key={i}
          className="rounded bg-white/8 px-1.5 py-0.5 text-[12.5px] text-white/85"
          style={{ fontFamily: "ui-monospace, monospace" }}
        >
          {p.slice(1, -1)}
        </code>
      );

    if (p.startsWith("**") && p.endsWith("**"))
      return (
        <strong key={i} className="font-medium text-white">
          {p.slice(2, -2)}
        </strong>
      );

    if (p.startsWith("*") && p.endsWith("*") && p.length > 2)
      return (
        <em key={i} className="italic">
          {p.slice(1, -1)}
        </em>
      );

    return <span key={i}>{p}</span>;
  });
}
