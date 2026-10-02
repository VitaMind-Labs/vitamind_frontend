"use client";

import { Grain, WaveLines } from "@/components/home/Atmosphere";

/**
 * The calm canvas shared by Mira (orientation + result) and checkout: a calm, light, living backdrop in the home page's palette.
 * Misted white, three soft pools of teal / gold / sage light that drift very slowly, hairline wave
 * lines and two turning rings. Everything is transform-only (no blur filters), pauses under
 * `prefers-reduced-motion`, and never prints.
 */
export function CalmBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 isolate overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,var(--color-teal-50)_58%,#ffffff_100%)] print:hidden">
      {/* Pools of light — drift via the shared reflection keyframes */}
      <span className="absolute -start-[14rem] -top-[16rem] size-[52rem] rounded-full bg-[radial-gradient(closest-side,rgb(81_133_145/0.2),transparent_72%)] will-change-transform motion-safe:animate-[vm-reflet-a_28s_ease-in-out_infinite]" />
      <span className="absolute -bottom-[14rem] -end-[10rem] size-[44rem] rounded-full bg-[radial-gradient(closest-side,rgb(227_176_28/0.16),transparent_72%)] will-change-transform motion-safe:animate-[vm-reflet-b_34s_ease-in-out_infinite]" />
      <span className="absolute end-[14%] top-[28%] size-[34rem] rounded-full bg-[radial-gradient(closest-side,rgb(125_168_158/0.18),transparent_72%)] will-change-transform motion-safe:animate-[vm-reflet-c_31s_ease-in-out_infinite]" />

      {/* Hairline waves, flowing slowly */}
      <WaveLines tone="light" className="inset-y-[8%] opacity-80" />

      {/* Orbit rings, partly off-screen — the orb motif from the home page */}
      <svg viewBox="0 0 800 800" className="absolute -bottom-[22rem] -start-[18rem] size-[54rem] text-teal-300/50 motion-safe:animate-[spin_160s_linear_infinite]">
        <circle cx="400" cy="400" r="396" fill="none" stroke="currentColor" strokeWidth="1" />
        <circle cx="400" cy="400" r="300" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 10" />
        <circle cx="400" cy="400" r="210" fill="none" stroke="currentColor" strokeWidth="1" />
        <circle cx="400" cy="4" r="6" className="fill-gold" />
      </svg>
      <svg viewBox="0 0 800 800" className="absolute -end-[16rem] -top-[20rem] size-[44rem] text-gold-300/45 motion-safe:animate-[spin_200s_linear_infinite_reverse]">
        <circle cx="400" cy="400" r="396" fill="none" stroke="currentColor" strokeWidth="1" />
        <circle cx="400" cy="400" r="260" fill="none" stroke="currentColor" strokeWidth="1" />
        <circle cx="796" cy="400" r="5" className="fill-teal-400" />
      </svg>

      {/* A veil keeps the reading surfaces calm: colour shows at the edges, not behind the text. */}
      <div className="absolute inset-0 bg-[radial-gradient(60%_55%_at_50%_45%,rgb(255_255_255/0.5),transparent_80%)]" />
      <Grain tone="light" className="-z-0" />
    </div>
  );
}
