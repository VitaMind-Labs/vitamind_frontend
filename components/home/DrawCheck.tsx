"use client";

import { EASE_OUT } from "@/lib/motion";
import { motion, useReducedMotion, type MotionValue } from "framer-motion";

type DrawCheckProps = {
  className?: string;
  strokeWidth?: number;
  /** Drive the tick from a 0 → 1 value (scroll scenes). Without it, the tick draws once when it scrolls into view. */
  progress?: MotionValue<number>;
  /** Seconds before the in-view tick starts. */
  delay?: number;
};

/** A tick that draws itself. Takes its colour from the text colour; sits still under reduced motion. */
export function DrawCheck({ className, strokeWidth = 3, progress, delay = 0 }: DrawCheckProps) {
  const reduce = useReducedMotion();
  const path = "M4.5 12.75 L9.75 18 L19.5 6.75";

  return (
    <svg viewBox="0 0 24 24" aria-hidden fill="none" className={className}>
      {progress ? (
        <motion.path d={path} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={{ pathLength: progress }} />
      ) : (
        <motion.path
          d={path}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduce ? false : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: "0px 0px -8% 0px" }}
          transition={{ duration: 0.6, delay, ease: EASE_OUT }}
        />
      )}
    </svg>
  );
}
