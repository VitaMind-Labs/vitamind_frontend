import { animate, type MotionValue, type Transition, type Variants } from "framer-motion";

/** Shared motion tokens — mirror `--ease-*` in globals.css. */
/** Entrances: a fast start that settles gently. Never overshoots. */
export const EASE_ENTER: [number, number, number, number] = [0.32, 0.72, 0, 1];
/** Exits and morphs: a slow start and a decisive finish. */
export const EASE_EXIT: [number, number, number, number] = [0.19, 1, 0.22, 1];
/** Kept for existing imports: every reveal uses the entrance curve. */
export const EASE_OUT = EASE_ENTER;
export const EASE_IN_OUT = EASE_EXIT;

/** Micro-interactions 0.3s, components 0.5s, page-level reveals 0.6–0.75s. */
export const DURATION = {
  fast: 0.3,
  base: 0.5,
  slow: 0.7,
} as const;

/** Name kept for existing imports; it is a weighted tween now — no spring, no overshoot. */
export const SPRING_SOFT: Transition = { duration: DURATION.base, ease: EASE_ENTER };

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

/** Eases a motion value to a target on the entrance curve: pointer-following without spring physics. */
export const glide = (value: MotionValue<number>, to: number, duration = 0.6) => animate(value, to, { duration, ease: EASE_ENTER });
