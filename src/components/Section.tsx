import type { ReactNode } from "react";

type Props = {
  id: string;
  eyebrow: string;
  title: string;
  intro?: string;
  children: ReactNode;
};

export default function Section({ id, eyebrow, title, intro, children }: Props) {
  return (
    <section id={id} className="relative z-20 px-6 py-28 md:px-10 md:py-36">
      <div className="mx-auto max-w-6xl">
        <div className="reveal mb-3 flex items-center gap-4">
          <span className="text-[11px] font-medium tracking-[0.16em] text-white/45">
            {eyebrow}
          </span>
          <span className="h-px flex-1 bg-white/12" />
        </div>

        <h2
          className="reveal max-w-[20ch] text-white"
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: "clamp(32px, 4.4vw, 56px)",
            lineHeight: 1.08,
            letterSpacing: "-0.015em",
          }}
        >
          {title}
        </h2>

        {intro && (
          <p className="reveal mt-5 max-w-[62ch] text-[15px] leading-relaxed text-white/55">
            {intro}
          </p>
        )}

        <div className="mt-14">{children}</div>
      </div>
    </section>
  );
}
