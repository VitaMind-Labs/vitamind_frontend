"use client";

import { cn } from "@/lib/utils";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";

/** A wave of the given height around y = 28; every height shares one command layout, so Framer can morph between them. */
const wave = (amp: number) => `M 2 28 Q 9.5 ${28 - amp} 17 28 T 32 28 T 47 28 T 54 28`;
const SCATTER = [
  [8, 14, 40, 18],
  [18, 40, 12, 34],
  [28, 20, 42, 12],
  [38, 38, 16, 40],
  [48, 16, 36, 22],
] as const;

/**
 * One small moving drawing per condition, each saying what the condition feels like and what a steady day looks like:
 * ADHD, attention that scatters and then lines up; bipolar disorder, a swing that narrows into the usual range; psychosis, a
 * quiet that holds. They run only while on screen, and rest on their calm frame under reduced motion.
 */
export function ConditionGlyph({ kind, className }: { kind: 0 | 1 | 2; className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const reduce = useReducedMotion();
  const visible = useInView(ref, { margin: "0px 0px -10% 0px" });
  const run = visible && !reduce;
  const loop = { repeat: Infinity, ease: "easeInOut" as const };

  return (
    <svg ref={ref} aria-hidden viewBox="0 0 56 56" className={cn("size-12 shrink-0 sm:size-14", className)}>
      {kind === 0 && (
        <>
          <line x1="4" x2="52" y1="28" y2="28" className="stroke-teal-200" strokeDasharray="2 4" strokeLinecap="round" />
          {SCATTER.map(([cx, ...ys], index) => (
            <motion.circle
              key={cx}
              cx={cx}
              r="3"
              className="fill-teal-500"
              initial={false}
              animate={run ? { cy: [ys[0], ys[1], 28, 28, ys[2], ys[0]] } : { cy: 28 }}
              transition={{ duration: 9, times: [0, 0.2, 0.42, 0.64, 0.82, 1], delay: index * 0.12, ...loop }}
            />
          ))}
        </>
      )}

      {kind === 1 && (
        <>
          <rect x="2" y="21" width="52" height="14" rx="7" className="fill-gold-100" />
          <motion.path
            d={wave(4)}
            fill="none"
            className="stroke-gold-600"
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={false}
            animate={run ? { d: [wave(4), wave(22), wave(8), wave(20), wave(4)] } : { d: wave(4) }}
            transition={{ duration: 10, times: [0, 0.25, 0.5, 0.7, 1], ...loop }}
          />
        </>
      )}

      {kind === 2 && (
        <>
          {[20, 13, 6].map((r, index) => (
            <motion.circle
              key={r}
              cx="28"
              cy="28"
              r={r}
              fill="none"
              className="stroke-sage"
              strokeWidth="1.75"
              style={{ transformOrigin: "28px 28px" }}
              initial={false}
              animate={run ? { scale: [1, 1.12, 1], opacity: [0.9, 0.35, 0.9] } : { scale: 1, opacity: 0.8 }}
              transition={{ duration: 7 + index, delay: index * 0.9, ...loop }}
            />
          ))}
          <circle cx="28" cy="28" r="2.5" className="fill-sage-700" />
        </>
      )}
    </svg>
  );
}
