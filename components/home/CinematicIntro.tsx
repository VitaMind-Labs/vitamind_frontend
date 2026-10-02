"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { EASE_IN_OUT, EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { WordReveal } from "./AnimationUtilities";
import { Grain } from "./Atmosphere";
import { ACCENT_LIGHT, LABEL, SERIF } from "./typography";

type CinematicIntroProps = {
  onComplete: () => void;
};

const EXIT_AT_MS = 3600;
const COMPLETE_AT_MS = 4300;

/** Rings that draw themselves around the sentence, then keep turning very slowly. */
function Rings() {
  const reduce = useReducedMotion();
  return (
    <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[min(120vmin,56rem)] -translate-x-1/2 -translate-y-1/2">
      <svg viewBox="0 0 800 800" className="size-full overflow-visible">
        {[390, 300, 210].map((r, i) => (
          <motion.circle
            key={r}
            cx="400"
            cy="400"
            r={r}
            fill="none"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            className={i === 1 ? "stroke-gold-300" : "stroke-teal-300"}
            strokeOpacity={i === 1 ? 0.8 : 0.55}
            initial={{ pathLength: 0, rotate: -90 }}
            animate={{ pathLength: 1, rotate: reduce ? -90 : [-90, -90 + (i % 2 ? -30 : 30)] }}
            transition={{ pathLength: { duration: 2.2, delay: 0.2 + i * 0.25, ease: EASE_OUT }, rotate: { duration: 8, ease: "linear" } }}
            style={{ transformOrigin: "400px 400px" }}
          />
        ))}
        <motion.circle
          cx="400"
          cy="10"
          r="6"
          className="fill-gold"
          initial={{ opacity: 0 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, rotate: 360 }}
          transition={{ opacity: { delay: 1.2, duration: 0.6 }, rotate: { duration: 28, repeat: Infinity, ease: "linear" } }}
          style={{ transformOrigin: "400px 400px" }}
        />
      </svg>
    </div>
  );
}

export const CinematicIntro = ({ onComplete }: CinematicIntroProps) => {
  const [startExit, setStartExit] = useState(false);
  const { dictionary, direction } = useLanguage();
  const reduce = useReducedMotion();
  const copy = dictionary.homeLanding.intro;

  // Latest callback without restarting the timeline when the parent re-renders.
  const done = useRef(onComplete);
  useEffect(() => {
    done.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const exit = setTimeout(() => setStartExit(true), reduce ? 1400 : EXIT_AT_MS);
    const complete = setTimeout(() => done.current(), reduce ? 1900 : COMPLETE_AT_MS);
    return () => {
      clearTimeout(exit);
      clearTimeout(complete);
    };
  }, [reduce]);

  // Anyone in a hurry can move on: a tap, a click, or Escape.
  const skip = useCallback(() => done.current(), []);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && skip();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [skip]);

  const wordsA = copy.lineA.split(" ").length;

  return (
    <motion.div
      dir={direction}
      onClick={skip}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.9, ease: EASE_IN_OUT } }}
      className="fixed inset-0 z-50 isolate flex cursor-pointer items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#ffffff,var(--color-teal-50)_70%,#ffffff)]"
    >
      <Grain tone="light" />
      <Rings />
      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: [0, 0.6, 0.4], scale: [0.6, 1.2, 1.5] }}
        transition={{ duration: 3.8, ease: "easeOut" }}
        className="absolute left-1/2 top-1/2 -z-10 size-[60vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(227_176_28/0.14),rgb(81_133_145/0.14)_42%,transparent_70%)]"
      />

      <motion.div
        animate={{ opacity: startExit ? 0 : 1, y: startExit ? -18 : 0 }}
        transition={{ duration: 0.7, ease: EASE_IN_OUT }}
        className="relative px-6 text-center"
      >
        <h1 className={cn(SERIF, "text-[clamp(2.75rem,8.6vw,8rem)] font-light leading-[1.02] tracking-[-0.04em] text-ink rtl:tracking-normal")}>
          <span className="block">
            <WordReveal delay={0.35} step={0.09}>
              {copy.lineA}
            </WordReveal>
          </span>
          <span className="block">
            <WordReveal className={ACCENT_LIGHT} delay={0.35 + wordsA * 0.09 + 0.12} step={0.09}>
              {copy.lineB}
            </WordReveal>
          </span>
        </h1>

        <motion.span
          aria-hidden
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay: 1.5, ease: EASE_OUT }}
          className="mx-auto mt-10 block h-px w-44 bg-gold"
        />
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8, ease: EASE_OUT }}
          className={cn(LABEL, "mt-6 text-ink-soft")}
        >
          {copy.tagline}
        </motion.p>
      </motion.div>
    </motion.div>
  );
};
