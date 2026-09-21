import type { Transition, Variants, ViewportOptions } from "framer-motion";

type RevealOptions = {
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  scale?: number;
  blur?: number;
  amount?: number;
};

type StaggerOptions = {
  delayChildren?: number;
  staggerChildren?: number;
};

export const premiumEase: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const premiumEaseSoft: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const premiumEaseMicro: [number, number, number, number] = [0.33, 1, 0.68, 1];

export const premiumViewport: ViewportOptions = {
  once: true,
  amount: 0.2,
};

export function createEnterTransition({
  delay = 0,
  duration = 0.95,
}: Pick<RevealOptions, "delay" | "duration"> = {}): Transition {
  return {
    delay,
    duration,
    ease: premiumEase,
  };
}

export function getRevealProps({
  delay = 0,
  duration = 0.95,
  x = 0,
  y = 36,
  scale = 0.985,
  blur = 10,
  // amount = premiumViewport.amount ?? 0.2,
}: RevealOptions = {}) {
  return {
    initial: {
      opacity: 0,
      x,
      y,
      scale,
      filter: `blur(${blur}px)`,
    },
    whileInView: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
    },
    viewport: {
      ...premiumViewport,
      // amount,
    },
    transition: createEnterTransition({ delay, duration }),
  };
}

export function createStaggerContainer({
  delayChildren = 0.08,
  staggerChildren = 0.12,
}: StaggerOptions = {}): Variants {
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren,
        staggerChildren,
      },
    },
  };
}

export function createStaggerItem({
  delay = 0,
  duration = 0.8,
  x = 0,
  y = 28,
  scale = 0.99,
  blur = 8,
}: RevealOptions = {}): Variants {
  return {
    hidden: {
      opacity: 0,
      x,
      y,
      scale,
      filter: `blur(${blur}px)`,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: createEnterTransition({ delay, duration }),
    },
  };
}

export function getCardHover(y = -8, scale = 1.01) {
  return {
    y,
    scale,
    transition: {
      duration: 0.28,
      ease: premiumEaseSoft,
    },
  };
}

export function getButtonHover(y = -2, scale = 1.025) {
  return {
    y,
    scale,
    transition: {
      duration: 0.24,
      ease: premiumEaseMicro,
    },
  };
}

export const buttonTap = { scale: 0.985 };

export const iconHover = {
  scale: 1.06,
  rotate: 3,
  transition: {
    duration: 0.24,
    ease: premiumEaseMicro,
  },
};

export function getIconHover() {
  return iconHover;
}

export const pulseDot = {
  scale: [1, 1.3, 1],
  opacity: [0.9, 1, 0.9],
};

export const pulseDotTransition: Transition = {
  duration: 2.2,
  repeat: Infinity,
  ease: "easeInOut",
};

export const ambientFloat = {
  y: [0, -12, 0],
  x: [0, 6, 0],
  scale: [1, 1.04, 1],
};

export const ambientFloatTransition: Transition = {
  duration: 13,
  repeat: Infinity,
  ease: "easeInOut",
};

export const ambientDrift = {
  x: [0, 18, -10, 0],
  y: [0, -12, 8, 0],
  scale: [1, 1.08, 0.98, 1],
};

export const ambientDriftTransition: Transition = {
  duration: 18,
  repeat: Infinity,
  ease: "easeInOut",
};

export const shimmerSweep = {
  x: ["-120%", "120%"],
  opacity: [0, 0.32, 0],
};

export const shimmerSweepTransition: Transition = {
  duration: 3.4,
  repeat: Infinity,
  ease: "easeInOut",
};
