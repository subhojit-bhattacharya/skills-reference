import { useMemo, useState } from "react";
import { vocab } from "../data";
import { inline } from "../markdown";
import { SEAM_TERM, SEAM_NOTE } from "../crab";

export default function Vocabulary() {
  const groups = useMemo(
    () => Array.from(new Set(vocab.map((v) => v.group))),
    []
  );
  const [group, setGroup] = useState<string | null>(null);
  const shown = group ? vocab.filter((v) => v.group === group) : vocab;

  return (
    <>
      <div className="reveal mb-10 flex flex-wrap gap-2">
        <button
          onClick={() => setGroup(null)}
          aria-pressed={group === null}
          className={`rounded-full px-3.5 py-1.5 text-[10.5px] font-medium tracking-[0.1em] transition-colors ${
            group === null ? "bg-white text-black" : "bg-white/5 text-white/50 hover:text-white"
          }`}
        >
          ALL {vocab.length}
        </button>
        {groups.map((g) => (
          <button
            key={g}
            onClick={() => setGroup(g === group ? null : g)}
            aria-pressed={group === g}
            className={`rounded-full px-3.5 py-1.5 text-[10.5px] font-medium tracking-[0.1em] transition-colors ${
              group === g ? "bg-white text-black" : "bg-white/5 text-white/50 hover:text-white"
            }`}
          >
            {g.toUpperCase()}
          </button>
        ))}
      </div>

      <dl className="grid gap-x-12 gap-y-8 md:grid-cols-2">
        {shown.map((v, i) => {
          const isSeam = v.term === SEAM_TERM;
          return (
            <div
              key={v.term}
              id={isSeam ? "seam" : undefined}
              className={`reveal scroll-mt-32 ${isSeam ? "md:col-span-2" : ""}`}
              style={{ transitionDelay: `${(i % 8) * 45}ms` }}
            >
              <dt
                className="text-[14px] font-medium tracking-tight text-white"
                style={{ fontFamily: "ui-monospace, monospace" }}
              >
                {v.term}
              </dt>
              <dd className="mt-2 max-w-[62ch] text-[14px] leading-relaxed text-white/50">
                {inline(v.definition)}
              </dd>

              {isSeam && (
                <p className="mt-4 max-w-[62ch] border-l border-white/25 pl-5 text-[14px] italic leading-relaxed text-white/40">
                  {SEAM_NOTE}
                </p>
              )}
            </div>
          );
        })}
      </dl>
    </>
  );
}
