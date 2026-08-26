import { useEffect, useMemo, useRef, useState } from "react";
import { Search, Plus, Minus, Copy, Check } from "lucide-react";
import { skills, type Skill } from "../data";
import { inline } from "../markdown";

/* Counts come off the array. Typed out, they drift the moment the Markdown
   changes, and the page would then disagree with its own source. */
const BUCKETS = Array.from(new Set(skills.map((s) => s.bucket)));
const countOf = (key: "bucket" | "mode", value: string) =>
  skills.filter((s) => s[key] === value).length;

const FILTERS = [
  ...BUCKETS.map((b) => ({
    key: "bucket" as const,
    value: b,
    label: `${b.replace(/-/g, " ").toUpperCase()} ${countOf("bucket", b)}`,
  })),
  { key: "mode" as const, value: "user", label: `USER INVOKED ${countOf("mode", "user")}` },
  { key: "mode" as const, value: "model", label: `MODEL INVOKED ${countOf("mode", "model")}` },
];

function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setDone(false), 1800);
    return () => clearTimeout(t);
  }, [done]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // The clipboard API needs a secure context. Fall back to a throwaway
      // textarea so the button still works over plain http.
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.top = "-1000px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setDone(true);
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={done ? "Copied to clipboard" : "Copy the source text"}
      className="absolute right-2 top-2 z-10 flex items-center gap-1.5 rounded-lg bg-white/8 px-2.5 py-1.5 text-[10px] font-medium tracking-[0.12em] text-white/60 backdrop-blur transition-colors duration-200 hover:bg-white/15 hover:text-white"
    >
      {done ? <Check size={11} strokeWidth={2} /> : <Copy size={11} strokeWidth={1.75} />}
      {done ? "COPIED" : "COPY"}
    </button>
  );
}

/** The skill's own SKILL.md, exactly as vendored, ready to be lifted out. */
function SourceBlock({ text }: { text: string }) {
  return (
    <div className="relative">
      <CopyButton text={text} />
      <pre className="max-h-80 overflow-y-auto overflow-x-hidden whitespace-pre-wrap break-words rounded-xl border border-white/8 bg-black/40 py-3.5 pl-4 pr-4 text-[11.5px] leading-relaxed text-white/55">
        <code style={{ fontFamily: "ui-monospace, monospace" }}>{text}</code>
      </pre>
    </div>
  );
}

function Card({ skill, forceOpen }: { skill: Skill; forceOpen: boolean }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (forceOpen) setOpen(true);
  }, [forceOpen]);

  return (
    <article
      id={`s-${skill.name}`}
      className={`glass-panel reveal flex scroll-mt-32 flex-col rounded-2xl transition-shadow duration-500 ${
        forceOpen ? "shadow-[0_0_36px_2px_rgba(255,255,255,0.16)]" : ""
      }`}
    >
      <div
        className={`h-[3px] w-full rounded-t-2xl ${
          skill.mode === "user" ? "bg-white/85" : "bg-white/35"
        }`}
      />

      <div className="flex flex-1 flex-col p-6">
        {/* The head reserves the same space on every card: one line of command,
            one line of meta, three lines of purpose. Card heights then match
            across the grid whatever the length of the text inside them. */}
        <span
          className="block truncate text-[15px] font-medium tracking-tight text-white"
          style={{ fontFamily: "ui-monospace, monospace" }}
        >
          {skill.invocation}
        </span>

        <div className="mt-2 flex min-h-[15px] flex-wrap items-center gap-x-3 gap-y-1">
          <span className="text-[10px] tracking-[0.14em] text-white/35">
            {skill.bucket.replace(/-/g, " ").toUpperCase()}
          </span>
          <span className="text-[10px] tracking-[0.14em] text-white/30">
            {skill.mode === "user" ? "USER" : "MODEL"}
          </span>
          {!skill.plugin && (
            <span className="text-[10px] tracking-[0.14em] text-white/30">NOT IN PLUGIN</span>
          )}
        </div>

        <p
          className={`mt-3 min-h-[69px] text-[14px] leading-relaxed text-white/60 ${
            open ? "" : "line-clamp-3"
          }`}
        >
          {inline(skill.purpose)}
        </p>

        <button
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls={`d-${skill.name}`}
          className="mt-5 flex items-center gap-2 self-start text-[11px] font-medium tracking-[0.12em] text-white/45 transition-colors hover:text-white"
        >
          {open ? <Minus size={12} strokeWidth={1.5} /> : <Plus size={12} strokeWidth={1.5} />}
          {open ? "CLOSE" : "LOOK INSIDE"}
        </button>

        {open && (
          <div id={`d-${skill.name}`} className="mt-5 border-t border-white/8 pt-4">
            <dl>
              {skill.fields.map((f) => (
                <div key={f.label} className="mb-4">
                  <dt className="text-[10px] font-medium tracking-[0.14em] text-white/40">
                    {f.label.toUpperCase()}
                  </dt>
                  {f.value && (
                    <dd className="mt-1.5 text-[13.5px] leading-relaxed text-white/65">
                      {inline(f.value)}
                    </dd>
                  )}
                  {f.items && (
                    <dd className="mt-2">
                      <ul className="flex flex-col gap-2">
                        {f.items.map((it, i) => (
                          <li key={i} className="flex gap-2.5">
                            <span className="mt-[9px] h-[3px] w-[3px] shrink-0 rounded-full bg-white/35" />
                            <span className="text-[13.5px] leading-relaxed text-white/65">
                              {inline(it)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </dd>
                  )}
                </div>
              ))}
            </dl>

            <p
              className="break-all text-[11px] text-white/25"
              style={{ fontFamily: "ui-monospace, monospace" }}
            >
              {skill.path}
            </p>

            <div className="mt-5">
              <div className="mb-2 text-[10px] font-medium tracking-[0.14em] text-white/40">
                SOURCE TEXT
              </div>
              <SourceBlock text={skill.source} />
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

export default function SkillBrowser({ jumpTo }: { jumpTo: string | null }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Record<string, Set<string>>>({
    bucket: new Set(),
    mode: new Set(),
  });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (document.activeElement as HTMLElement)?.tagName;
      if (e.key === "/" && tag !== "INPUT") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape" && tag === "INPUT") {
        setQuery("");
        inputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // A jump from a failure-mode chip clears every filter so the target is visible.
  useEffect(() => {
    if (!jumpTo) return;
    setQuery("");
    setActive({ bucket: new Set(), mode: new Set() });
    const t = setTimeout(() => {
      document.getElementById(`s-${jumpTo}`)?.scrollIntoView({ block: "center" });
    }, 90);
    return () => clearTimeout(t);
  }, [jumpTo]);

  const toggle = (key: string, value: string) => {
    setActive((prev) => {
      const next = new Set(prev[key]);
      next.has(value) ? next.delete(value) : next.add(value);
      return { ...prev, [key]: next };
    });
  };

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    return skills.filter((s) => {
      if (active.bucket.size && !active.bucket.has(s.bucket)) return false;
      if (active.mode.size && !active.mode.has(s.mode)) return false;
      if (!q) return true;
      const hay = (
        s.name +
        " " +
        s.purpose +
        " " +
        s.fields.map((f) => f.label + " " + f.value + " " + (f.items ?? []).join(" ")).join(" ") +
        " " +
        s.source
      ).toLowerCase();
      return hay.includes(q);
    });
  }, [query, active]);

  return (
    <>
      <div className="sticky top-[84px] z-30 -mx-2 mb-10 px-2">
        <div className="glass-panel rounded-2xl p-4 md:p-5">
          <div className="relative">
            <Search
              size={15}
              strokeWidth={1.5}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/35"
            />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, purpose, or when you would reach for it"
              aria-label="Search skills"
              className="w-full rounded-full bg-white/5 py-3 pl-11 pr-16 text-[14px] text-white placeholder:text-white/30 focus:bg-white/8 focus:outline-none"
            />
            <kbd className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 rounded border border-white/15 px-1.5 py-0.5 text-[10px] text-white/40 sm:block">
              /
            </kbd>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {FILTERS.map((f) => {
              const on = active[f.key].has(f.value);
              return (
                <button
                  key={f.value}
                  onClick={() => toggle(f.key, f.value)}
                  aria-pressed={on}
                  className={`rounded-full px-3.5 py-1.5 text-[10.5px] font-medium tracking-[0.1em] transition-colors duration-200 ${
                    on
                      ? "bg-white text-black"
                      : "bg-white/5 text-white/50 hover:text-white"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
            <span className="ml-auto text-[11px] tracking-[0.1em] text-white/35">
              {results.length === skills.length
                ? `ALL ${skills.length}`
                : `${results.length} OF ${skills.length}`}
            </span>
          </div>
        </div>
      </div>

      {results.length === 0 ? (
        <p className="py-16 text-center text-[15px] text-white/45">
          Nothing matches that. Clear the filters or try another word.
        </p>
      ) : (
        /* items-start keeps a closed card at its natural height when a sibling
           in the same row is open, so opening one card cannot stretch the rest. */
        <div className="grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((s) => (
            <Card key={s.name} skill={s} forceOpen={jumpTo === s.name} />
          ))}
        </div>
      )}
    </>
  );
}
