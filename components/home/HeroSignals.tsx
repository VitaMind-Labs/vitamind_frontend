"use client";

import { AgentAvatar } from "@/components/layout/site-header";
import { EASE_OUT } from "@/lib/motion";
import { motion, useReducedMotion, useTransform, type MotionValue } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Two small glass cards beside the headline: one side of the bridge each (a check-in, a trend with a flag). They are
 * the first glimpse of the story told further down, so they carry no words. They drift on their own, lean away from the
 * pointer and rise a little faster than the headline on scroll. Wide screens only; decorative.
 */

type SignalProps = {
  /** Pointer position over the hero, 0 → 100 on each axis. */
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  /** Scroll progress through the hero, 0 → 1. */
  scroll: MotionValue<number>;
};

function Float({ children, className, delay, depth, rise, drift, ...pointer }: SignalProps & { children: ReactNode; className: string; delay: number; depth: number; rise: number; drift: number }) {
  const reduce = useReducedMotion();
  const x = useTransform(pointer.pointerX, [0, 100], reduce ? [0, 0] : [depth, -depth]);
  const y = useTransform(pointer.pointerY, [0, 100], reduce ? [0, 0] : [depth * 0.7, -depth * 0.7]);
  const lift = useTransform(pointer.scroll, [0, 1], [0, reduce ? 0 : rise]);

  return (
    <motion.div aria-hidden style={{ x, y: lift }} className={className}>
      <motion.div style={{ y }}>
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 28, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.4, delay, ease: EASE_OUT }}
        >
          <motion.div
            animate={reduce ? undefined : { y: [0, -drift, 0] }}
            transition={{ duration: 7 + drift / 3, repeat: Infinity, ease: "easeInOut", delay: delay + 1 }}
            className="rounded-2xl border border-white/80 bg-white/70 p-3.5 shadow-float backdrop-blur-md"
          >
            {children}
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

const TREND = "M0 22 C 14 18, 22 26, 36 21 S 58 17, 72 22 S 94 28, 108 40 S 128 56, 144 52";

function Trend() {
  const reduce = useReducedMotion();
  return (
    <svg viewBox="0 0 144 64" className="block h-auto w-full overflow-visible rtl:-scale-x-100">
      <rect x="0" y="12" width="144" height="22" rx="7" className="fill-sage-100/80" />
      <motion.path
        d={TREND}
        fill="none"
        className="stroke-teal-600"
        strokeWidth="2.25"
        strokeLinecap="round"
        initial={reduce ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2.2, delay: 2.1, ease: EASE_OUT }}
      />
      <motion.g
        initial={reduce ? false : { opacity: 0, scale: 0.4 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 3.5, ease: EASE_OUT }}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      >
        <circle cx="108" cy="40" r="7" className="fill-gold/25" />
        {reduce ? null : (
          <motion.circle cx="108" cy="40" r="4" className="fill-none stroke-gold" strokeWidth="1.25" animate={{ r: [4, 11], opacity: [0.8, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut", delay: 4 }} />
        )}
        <circle cx="108" cy="40" r="3.5" className="fill-gold stroke-white" strokeWidth="1.5" />
      </motion.g>
    </svg>
  );
}

function CheckIn() {
  const reduce = useReducedMotion();
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2.5">
        <AgentAvatar agent="lumina" className="size-8 rounded-lg ring-1 ring-teal-100" />
        <span className="h-1.5 w-14 rounded-full bg-teal-100" />
      </div>
      <div className="flex items-center justify-between gap-1.5">
        {[0, 1, 2, 3, 4].map((step) => (
          <span key={step} className="relative flex size-7 items-center justify-center rounded-full border border-teal-200 bg-white">
            {step === 3 ? (
              <>
                {reduce ? null : (
                  <motion.span className="absolute inset-0 rounded-full border border-teal-400" animate={{ scale: [1, 1.9], opacity: [0.55, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut", delay: 3 }} />
                )}
                <motion.span
                  className="absolute -inset-px rounded-full bg-teal-600"
                  initial={reduce ? false : { scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 14, delay: 2.6 }}
                />
                <span className="relative size-1.5 rounded-full bg-white" />
              </>
            ) : (
              <span className="size-1 rounded-full bg-teal-200" />
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

export function HeroSignals(props: SignalProps) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 hidden xl:block">
      <Float {...props} delay={1.5} depth={14} rise={-190} drift={9} className="absolute start-[5%] top-[30%] w-[13.5rem] 2xl:start-[9%]">
        <CheckIn />
      </Float>
      <Float {...props} delay={1.9} depth={22} rise={-130} drift={12} className="absolute end-[5%] top-[44%] w-[13.5rem] 2xl:end-[9%]">
        <Trend />
      </Float>
    </div>
  );
}
