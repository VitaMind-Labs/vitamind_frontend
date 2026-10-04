"use client";

import { animate, useInView, useMotionValue, useReducedMotion, useTransform, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { EASE_OUT } from "@/lib/motion";

/** "98%" → counts 0 → 98 once visible and keeps its "%" suffix. Values with no leading number render as-is. */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const match = value.match(/^(\d+(?:\.\d+)?)(.*)$/);
  const target = match ? Number(match[1]) : 0;
  const suffix = match ? match[2] : "";
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const count = useMotionValue(reduce ? target : 0);
  const rounded = useTransform(count, (latest) => String(Math.round(latest)));

  useEffect(() => {
    if (!match || reduce || !inView) return;
    const controls = animate(count, target, { duration: 1.8, ease: EASE_OUT });
    return () => controls.stop();
  }, [count, inView, match, reduce, target]);

  if (!match) return <span className={className}>{value}</span>;

  return (
    <span ref={ref} className={className} aria-label={value}>
      <motion.span aria-hidden>{rounded}</motion.span>
      <span aria-hidden>{suffix}</span>
    </span>
  );
}
