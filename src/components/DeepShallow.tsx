import { useState } from "react";

type Shape = "deep" | "shallow";

/* ------------------------------------------------------------------ layout
   Canvas is 720 x 640. Both layouts sit inside x 40..680, y 40..580, so the
   two states occupy the same box and cross-fade in place.                  */

const DEEP_BOXES = [
  { x: 40, y: 40, w: 300, h: 258 },
  { x: 354, y: 40, w: 326, h: 122 },
  { x: 354, y: 176, w: 326, h: 122 },
  { x: 40, y: 312, w: 300, h: 268 },
  { x: 354, y: 312, w: 326, h: 150 },
  { x: 354, y: 476, w: 326, h: 104 },
];

const CAP_H = 15;

// 12 columns by 11 rows, with a wider gutter down the middle of the grid.
const COLS = 12;
const ROWS = 11;
const CELL = 38;
const GAP = 12;
const MID_GAP = 20;
const GRID_X = 56;
const GRID_Y = 41;

const SHALLOW_CELLS = Array.from({ length: ROWS }, (_, row) =>
  Array.from({ length: COLS }, (_, col) => ({
    x: GRID_X + col * (CELL + GAP) + (col >= COLS / 2 ? MID_GAP : 0),
    y: GRID_Y + row * (CELL + GAP),
  }))
).flat();

/* Counts are read off the layouts above rather than written out, so the labels
   and the drawing cannot disagree. Change a layout and the copy follows. */
const DEEP_N = DEEP_BOXES.length;
const SHALLOW_N = SHALLOW_CELLS.length;

const COPY: Record<Shape, { toggle: string; title: string; body: string }> = {
  deep: {
    toggle: `${DEEP_N} DEEP MODULES`,
    title: `${DEEP_N} interfaces to learn.`,
    body: "A large amount of behaviour sits behind each small interface. The agent reads a handful of boundaries and can work. You design those interfaces carefully and delegate most of the implementation.",
  },
  shallow: {
    toggle: `${SHALLOW_N} SHALLOW MODULES`,
    title: `${SHALLOW_N} interfaces to learn.`,
    body: "Little behind each one. The agent bounces between them, loses the dependencies, and starts guessing. Agents are very good at producing exactly this shape when left alone.",
  },
};

export default function DeepShallow() {
  const [shape, setShape] = useState<Shape>("deep");
  const isDeep = shape === "deep";

  return (
    <div className="glass-panel reveal overflow-hidden rounded-2xl">
      <div className="flex flex-wrap items-center gap-4 px-6 py-5 md:px-9">
        <div className="liquid-glass inline-flex rounded-full p-1">
          {(["deep", "shallow"] as Shape[]).map((s) => (
            <button
              key={s}
              onClick={() => setShape(s)}
              aria-pressed={shape === s}
              className={`rounded-full px-4 py-1.5 text-[11px] font-medium tracking-[0.1em] transition-colors duration-300 ${
                shape === s ? "bg-white text-black" : "text-white/60 hover:text-white"
              }`}
            >
              {COPY[s].toggle}
            </button>
          ))}
        </div>
        <p className="text-[12px] tracking-[0.06em] text-white/40">
          Same behaviour. Different shape. Watch the interface.
        </p>
      </div>

      <div className="px-6 pb-2 md:px-9">
        <svg
          viewBox="0 0 720 640"
          className="mx-auto block h-auto max-h-[460px] w-full"
          role="img"
          aria-label={
            isDeep
              ? `${DEEP_N} large modules, each with a thin interface strip across the top`
              : `A dense grid of ${SHALLOW_N} small modules`
          }
        >
          {/* deep: few large modules, each with a thin interface strip */}
          <g
            style={{
              opacity: isDeep ? 1 : 0,
              transition: "opacity 450ms cubic-bezier(.4,0,.2,1)",
              pointerEvents: "none",
            }}
          >
            {DEEP_BOXES.map((b, i) => (
              <g key={i}>
                <rect
                  x={b.x}
                  y={b.y}
                  width={b.w}
                  height={b.h}
                  rx={10}
                  fill="rgba(255,255,255,0.05)"
                  stroke="rgba(255,255,255,0.85)"
                  strokeWidth={2}
                />
                <line
                  x1={b.x}
                  y1={b.y + CAP_H}
                  x2={b.x + b.w}
                  y2={b.y + CAP_H}
                  stroke="rgba(255,255,255,0.85)"
                  strokeWidth={2}
                />
              </g>
            ))}
          </g>

          {/* shallow: many small modules, interface and implementation the same size */}
          <g
            style={{
              opacity: isDeep ? 0 : 1,
              transition: "opacity 450ms cubic-bezier(.4,0,.2,1)",
              pointerEvents: "none",
            }}
          >
            {SHALLOW_CELLS.map((c, i) => (
              <rect
                key={i}
                x={c.x}
                y={c.y}
                width={CELL}
                height={CELL}
                rx={9}
                fill="rgba(255,255,255,0.05)"
                stroke="rgba(255,255,255,0.85)"
                strokeWidth={2}
              />
            ))}
          </g>

          <text
            x={40}
            y={618}
            fill="rgba(255,255,255,0.35)"
            style={{ fontFamily: "Barlow, sans-serif", fontSize: 12, letterSpacing: "0.1em" }}
          >
            INTERFACE ABOVE. IMPLEMENTATION BELOW.
          </text>
        </svg>
      </div>

      <div className="border-t border-white/8 px-6 py-6 md:px-9">
        <p className="max-w-[70ch] text-[15px] leading-relaxed text-white/55">
          <span className="text-white">{COPY[shape].title}</span> {COPY[shape].body}
        </p>
      </div>
    </div>
  );
}
