import type { Config } from "tailwindcss";

// Tokens sourced from docs/UI-SPEC.md — keep in sync if the spec changes.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        noir: "#211721",
        porcelain: "#FBF7F3",
        accent: "var(--accent)", // tenant-configurable, defaults in globals.css
        "ink-soft": "#8E8390",
      },
      backgroundImage: {
        pearl:
          "linear-gradient(135deg, #F6E9E4 0%, #E8E4F2 50%, #DFF0EE 100%)",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
    },
  },
  plugins: [],
};

export default config;
