import { flow, onramps } from "../data";

const clean = (s: string) => s.replace(/`/g, "");

export default function Flow() {
  return (
    <>
      <ol className="relative ml-1 list-none border-l border-white/12 pl-0">
        {flow.map((row, i) => (
          <li
            key={row[0]}
            className="reveal relative pb-10 pl-9"
            style={{ transitionDelay: `${i * 70}ms` }}
          >
            <span className="absolute -left-[5px] top-[9px] h-[9px] w-[9px] rounded-full bg-white" />
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="text-[11px] tracking-[0.16em] text-white/35">
                STEP {row[0]}
              </span>
              <span className="text-[16px] font-medium tracking-tight text-white">
                {clean(row[1])}
              </span>
            </div>
            <p className="mt-2 max-w-[64ch] text-[14.5px] leading-relaxed text-white/55">
              {clean(row[2])}
            </p>
          </li>
        ))}
      </ol>

      <div className="reveal mt-8 flex items-center gap-4">
        <span className="text-[11px] font-medium tracking-[0.16em] text-white/45">
          ON-RAMPS
        </span>
        <span className="h-px flex-1 bg-white/12" />
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {onramps.map((row, i) => (
          <article
            key={row[0]}
            className="glass-panel reveal rounded-2xl p-7"
            style={{ transitionDelay: `${i * 90}ms` }}
          >
            <h4 className="text-[15px] font-medium leading-snug text-white">{row[0]}</h4>
            <p className="mt-3 text-[13px] tracking-[0.06em] text-white/70">
              {clean(row[1])}
            </p>
            <p className="mt-4 text-[13.5px] leading-relaxed text-white/45">
              {clean(row[2])}
            </p>
          </article>
        ))}
      </div>
    </>
  );
}
