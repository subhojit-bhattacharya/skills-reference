import { BookOpen, ArrowDown } from "lucide-react";
import { SOURCE_REPO } from "../config";

export default function Hero({ shown, progress }: { shown: boolean; progress: number }) {
  // The hero recedes as the reference takes over.
  const fade = Math.max(0, 1 - progress * 1.6);
  const lift = progress * -60;

  return (
    <section id="top" className="relative z-20 h-screen">
      <div
        className="pointer-events-none fixed left-0 right-0 top-[120px] z-20 px-6 text-center"
        style={{ opacity: fade, transform: `translateY(${lift}px)` }}
      >
        <h1
          className={`transition-all duration-1000 ${
            shown ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 400,
            fontSize: "clamp(40px, 5.4vw, 72px)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
          }}
        >
          <span className="block text-white">Code is not cheap.</span>
          <span className="block" style={{ color: "rgba(255,255,255,0.55)" }}>
            Bad code costs more than ever.
          </span>
        </h1>
      </div>

      <div
        className={`pointer-events-none fixed bottom-14 left-0 right-0 z-20 flex flex-col items-center gap-6 px-6 transition-all delay-300 duration-1000 ${
          shown ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
        style={{ opacity: fade, transform: `translateY(${lift * 0.5}px)` }}
      >
        <p className="max-w-[620px] text-center text-[15px] leading-relaxed">
          <span className="text-white">
            Thirty-five agent skills, each one built to fix a specific way that work
            with an AI agent goes wrong.
          </span>
          <span className="text-white/55">
            {" "}
            Assembled from software design books that predate the agents by decades.
          </span>
        </p>

        <a
          href="#argument"
          className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-[15px] font-medium text-black no-underline transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_32px_4px_rgba(255,255,255,0.2)] active:scale-[0.97]"
        >
          Start with the argument
          <ArrowDown size={15} strokeWidth={2} />
        </a>

        <a
          href={SOURCE_REPO}
          target="_blank"
          rel="noreferrer"
          className="pointer-events-auto flex items-center gap-2 no-underline"
        >
          <BookOpen size={13} strokeWidth={1.5} className="text-white/70" />
          <span className="text-[11px] font-medium tracking-[0.14em] text-white/70 transition-colors hover:text-white">
            STUDY NOTES. SKILLS BY MATT POCOCK. MIT LICENSED.
          </span>
        </a>
      </div>
    </section>
  );
}
