import { books } from "../data";

export default function Books() {
  return (
    <div className="border-t border-white/10">
      {books.map((row, i) => (
        <article
          key={row[0]}
          className="reveal grid gap-3 border-b border-white/10 py-7 md:grid-cols-[1.1fr_1.4fr] md:gap-10"
          style={{ transitionDelay: `${i * 60}ms` }}
        >
          <div>
            <h3
              className="text-white"
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: "21px",
                lineHeight: 1.2,
              }}
            >
              {row[0]}
            </h3>
            <p className="mt-1.5 text-[12px] tracking-[0.08em] text-white/35">
              {row[1].toUpperCase()}
            </p>
          </div>
          <p className="text-[14.5px] leading-relaxed text-white/55">{row[2]}</p>
        </article>
      ))}
    </div>
  );
}
