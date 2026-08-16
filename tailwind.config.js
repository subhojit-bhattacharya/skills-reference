/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // Tailwind's default opacity scale jumps 5 -> 10 -> 20. The glass
      // treatment needs finer steps, so /8 and /12 are registered here.
      // Without this they generate no CSS at all and borders vanish silently.
      opacity: {
        2: "0.02",
        3: "0.03",
        8: "0.08",
        12: "0.12",
        15: "0.15",
      },
      fontFamily: {
        display: ["Dirtyline", "Instrument Serif", "serif"],
        serif: ["Instrument Serif", "Georgia", "serif"],
        body: ["Barlow", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
