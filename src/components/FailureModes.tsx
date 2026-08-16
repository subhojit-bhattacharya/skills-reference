import { failures } from "../data";

export default function FailureModes({ onJump }: { onJump: (name: string) => void }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {failures.map((row, i) => {
        const commands = row[4]
          .split(",")
          .map((c) => c.trim().replace(/`/g, ""))
          .filter(Boolean);

        return (
          <article
            key={row[0]}
            className="glass-panel reveal rounded-2xl p-7 md:p-9"
            style={{ transitionDelay: `${i * 90}ms` }}
          >
            <div className="flex items-baseline gap-3">
              <span
                className="text-white/25"
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontSize: "38px",
                  lineHeight: 1,
                }}
              >
                {row[0]}
              </span>
              <h3 className="text-[19px] font-medium leading-snug text-white">
                {row[1]}
              </h3>
            </div>

            <p className="mt-5 text-[14px] leading-relaxed text-white/45">
              <span className="text-white/70">Cause. </span>
              {row[2]}
            </p>
            <p className="mt-3 text-[14px] leading-relaxed text-white/75">
              <span className="text-white">Fix. </span>
              {row[3]}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {commands.map((c) => (
                <button
                  key={c}
                  onClick={() => onJump(c.replace("/", ""))}
                  className="liquid-glass rounded-full px-3.5 py-1.5 text-[11px] font-medium tracking-[0.08em] text-white/80 transition-colors hover:text-white"
                >
                  {c}
                </button>
              ))}
            </div>
          </article>
        );
      })}
    </div>
  );
}
