"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

/** Fine film grain: a tiled noise tile, tinted white on deep surfaces and ink on light ones. */
const GRAIN = {
  deep: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .6 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
  light: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .17 0 0 0 0 .24 0 0 0 0 .23 0 0 0 .6 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
} as const;

export function Grain({ tone = "deep", className }: { tone?: keyof typeof GRAIN; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 -z-10", tone === "deep" ? "opacity-[0.07]" : "opacity-[0.05]", className)}
      style={{ backgroundImage: GRAIN[tone] }}
    />
  );
}

type Wave = { y: number; amp: number; period: number; seconds: number; className: string };

const VIEW_W = 1440;
const VIEW_H = 480;

/** The wave lines — hairlines at different depths, each drifting at its own slow pace. */
const WAVES: Record<"light" | "deep", Wave[]> = {
  light: [
    { y: 120, amp: 26, period: 960, seconds: 90, className: "text-teal-300/60" },
    { y: 170, amp: 34, period: 720, seconds: 74, className: "text-teal-400/40" },
    { y: 225, amp: 22, period: 1200, seconds: 110, className: "text-gold-300/70" },
    { y: 280, amp: 38, period: 840, seconds: 82, className: "text-teal-300/50" },
    { y: 335, amp: 24, period: 1080, seconds: 100, className: "text-sage/40" },
    { y: 385, amp: 30, period: 780, seconds: 88, className: "text-teal-300/40" },
  ],
  deep: [
    { y: 120, amp: 26, period: 960, seconds: 90, className: "text-teal-300/18" },
    { y: 175, amp: 34, period: 720, seconds: 74, className: "text-teal-200/20" },
    { y: 230, amp: 22, period: 1200, seconds: 110, className: "text-gold-300/35" },
    { y: 285, amp: 38, period: 840, seconds: 82, className: "text-teal-300/25" },
    { y: 340, amp: 24, period: 1080, seconds: 100, className: "text-sage/25" },
  ],
};

/** A sine ribbon as smooth quadratics, long enough to slide exactly one period and loop seamlessly. */
function wavePath({ y, amp, period }: Wave) {
  const half = period / 2;
  const count = Math.ceil((VIEW_W + period * 2) / half);
  let d = `M ${-period} ${y} Q ${-period + half / 2} ${y - amp} ${-period + half} ${y}`;
  for (let k = 2; k <= count; k += 1) d += ` T ${-period + k * half} ${y}`;
  return d;
}

/**
 * Flowing hairlines for a section background. Pure SVG transforms — pauses off-screen and
 * holds still under `prefers-reduced-motion`.
 */
export function WaveLines({ tone = "light", className }: { tone?: "light" | "deep"; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const visible = useInView(ref, { margin: "20% 0px 20% 0px" });
  const run = visible && !reduce;

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn("pointer-events-none absolute inset-x-0 -z-10 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_22%,black_72%,transparent)]", className)}
    >
      <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="none" className="h-full w-full">
        {WAVES[tone].map((wave) => (
          <motion.g
            key={wave.y}
            className={wave.className}
            animate={run ? { x: [0, -wave.period] } : { x: 0 }}
            transition={run ? { duration: wave.seconds, ease: "linear", repeat: Infinity } : { duration: 0 }}
          >
            <path d={wavePath(wave)} fill="none" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          </motion.g>
        ))}
      </svg>
    </div>
  );
}
