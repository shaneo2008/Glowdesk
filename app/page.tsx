"use client";

import { useState } from "react";

// Placeholder data shaped like MockProvider output (src/adapters/skin-analysis/mock.ts).
// Swap for a real consultation record once M2 wires up the adapter.
const CONCERNS = [
  { concern: "moisture", score: 74 },
  { concern: "texture", score: 61 },
  { concern: "redness", score: 88 },
  { concern: "pores", score: 55 },
  { concern: "spots", score: 92 },
  { concern: "wrinkles", score: 80 },
];

const OVERALL_SCORE = 87;
const CLIENT_INITIALS = "M.O";

export default function Home() {
  const [filmSafe, setFilmSafe] = useState(true);

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-between px-6 py-8">
      {/* Header */}
      <header className="flex items-center justify-between">
        <span className="font-mono text-sm text-ink-soft">
          {filmSafe ? CLIENT_INITIALS : "Michelle O'Connor"}
        </span>
        <button
          onClick={() => setFilmSafe((v) => !v)}
          className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-xs font-body"
        >
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: filmSafe ? "var(--accent)" : "#8E8390" }}
          />
          Film-safe
        </button>
      </header>

      {/* The Ring */}
      <section className="flex flex-1 flex-col items-center justify-center gap-8 py-12">
        <div className="relative flex h-64 w-64 items-center justify-center rounded-full bg-pearl">
          <svg viewBox="0 0 200 200" className="absolute h-full w-full -rotate-90">
            {CONCERNS.map((c, i) => {
              const gap = 6; // degrees between arcs
              const arcLength = 360 / CONCERNS.length - gap;
              const startAngle = i * (360 / CONCERNS.length);
              const r = 90;
              const circumference = 2 * Math.PI * r;
              const dash = (arcLength / 360) * circumference;
              return (
                <circle
                  key={c.concern}
                  cx="100"
                  cy="100"
                  r={r}
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${(c.score / 100) * dash} ${circumference}`}
                  strokeDashoffset={-((startAngle / 360) * circumference)}
                  opacity={0.3 + (c.score / 100) * 0.7}
                />
              );
            })}
          </svg>
          <div className="flex flex-col items-center rounded-full bg-noir/90 px-8 py-8">
            <span className="font-display text-5xl text-porcelain">{OVERALL_SCORE}</span>
            <span className="font-body text-xs text-ink-soft">overall</span>
          </div>
        </div>

        <div className="grid w-full grid-cols-3 gap-x-4 gap-y-3 font-mono text-xs text-ink-soft">
          {CONCERNS.map((c) => (
            <div key={c.concern} className="flex justify-between">
              <span className="capitalize">{c.concern}</span>
              <span className="text-porcelain">{c.score}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Thumb-zone primary action */}
      <button className="w-full rounded-full bg-accent py-4 font-body text-base font-medium text-noir">
        Save scan
      </button>
    </main>
  );
}
