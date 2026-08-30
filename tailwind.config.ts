import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        paper: "#FCFCFA",
        ink: "#16181D",
        "ink-soft": "#4A4C52",
        muted: "#8A8A82",
        fuchsia: "#C6005C",
        burnt: "#D6552E",
        line: "#DEDCD5",
      },
      fontFamily: {
        display: ["var(--font-fraunces)"],
        sans: ["var(--font-inter)"],
        mono: ["var(--font-plex-mono)"],
      },
      maxWidth: {
        content: "720px",
        wide: "900px",
      },
    },
  },
  plugins: [],
};

export default config;
