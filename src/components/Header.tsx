import { useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV } from "../config";
import { skills } from "../data";

export default function Header({ shown }: { shown: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b border-white/8 bg-black/30 px-6 py-6 backdrop-blur-md transition-all duration-1000 md:px-10 md:py-8 ${
        shown ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
      }`}
    >
      <a
        href="#top"
        className="text-[17px] font-semibold tracking-tight text-white no-underline"
      >
        Skills For Real Engineers
      </a>

      <nav className="liquid-glass absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full px-2 py-2 xl:flex">
        {NAV.map((n) => (
          <a
            key={n.href}
            href={n.href}
            className="rounded-full px-4 py-1.5 text-[11px] font-medium tracking-[0.12em] text-white/90 no-underline transition-colors duration-200 hover:text-white"
          >
            {n.label}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <a
          href="#skills"
          className="liquid-glass hidden rounded-full px-5 py-2.5 text-[11px] font-medium tracking-[0.12em] text-white/90 no-underline transition-colors duration-200 hover:text-white sm:block"
        >
          BROWSE {skills.length} SKILLS
        </a>
        <button
          className="liquid-glass rounded-full p-2.5 text-white/90 xl:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={16} strokeWidth={1.5} /> : <Menu size={16} strokeWidth={1.5} />}
        </button>
      </div>

      {open && (
        <nav className="glass-panel absolute left-6 right-6 top-20 flex flex-col rounded-2xl bg-black/80 p-3 xl:hidden">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 text-[11px] font-medium tracking-[0.12em] text-white/90 no-underline hover:bg-white/5"
            >
              {n.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
