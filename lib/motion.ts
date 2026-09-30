import type { Transition, Variants } from "framer-motion";

/** Shared motion tokens — mirror `--ease-*` in globals.css. */
export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const EASE_IN_OUT: [number, number, number, number] = [0.65, 0, 0.35, 1];

export const DURATION = {
  fast: 0.2,
  base: 0.45,
  slow: 0.7,
} as const;

export const SPRING_SOFT: Transition = { type: "spring", stiffness: 320, damping: 30 };

/** Viewport config for reveal-on-scroll: once, triggered slightly before entering. */
export const REVEAL_VIEWPORT = { once: true, margin: "0px 0px -12% 0px" } as const;

export const fadeUp = (delay = 0, distance = 18): Variants => ({
  hidden: { opacity: 0, y: distance },
  show: { opacity: 1, y: 0, transition: { duration: DURATION.slow, ease: EASE_OUT, delay } },
});

export const stagger = (step = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: step, delayChildren } },
});
