"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { EASE_IN_OUT, EASE_OUT } from "@/lib/motion";

type CinematicIntroProps = {
  onComplete: () => void;
};

export const CinematicIntro = ({ onComplete }: CinematicIntroProps) => {
  const [startExit, setStartExit] = useState(false);
  const { dictionary, direction } = useLanguage();
  const copy = dictionary.homeLanding.intro;

  useEffect(() => {
    const timer = setTimeout(() => setStartExit(true), 3400);
    const completeTimer = setTimeout(() => onComplete(), 4100);
    return () => {
      clearTimeout(timer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  const lines = [copy.lineA.split(" "), copy.lineB.split(" ")];
  const lineOffsets = [0, lines[0].length];

  return (
    <motion.div
      dir={direction}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.9, ease: EASE_IN_OUT } }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-white"
    >
      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: [0, 0.5, 0.35], scale: [0.6, 1.4, 1.8] }}
        transition={{ duration: 3.8, ease: "easeOut" }}
        className="absolute left-1/2 top-1/2 h-[60vmax] w-[60vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(81_133_145/0.18),rgb(227_176_28/0.08)_45%,transparent_70%)]"
      />

      <motion.div
        animate={{ opacity: startExit ? 0 : 1, y: startExit ? -12 : 0 }}
        transition={{ duration: 0.7, ease: EASE_IN_OUT }}
        className="relative px-6 text-center"
      >
        {lines.map((words, lineIndex) => (
          <p key={lineIndex} className="flex flex-wrap justify-center gap-x-[0.28em] overflow-hidden pb-[0.1em] text-[clamp(2.5rem,7vw,6.5rem)] font-extralight leading-[1.1] tracking-[-0.03em] text-ink">
            {words.map((word, i) => {
              const delay = 0.25 + (lineOffsets[lineIndex] + i) * 0.1;
              return (
                <motion.span
                  key={`${lineIndex}-${word}`}
                  initial={{ opacity: 0, y: "60%" }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay, ease: EASE_OUT }}
                  className={lineIndex === 1 ? "home-heading-accent inline-block" : "inline-block"}
                >
                  {word}
                </motion.span>
              );
            })}
          </p>
        ))}

        <motion.span
          aria-hidden
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, delay: 1, ease: EASE_OUT }}
          className="mx-auto mt-8 block h-px w-40 bg-teal-500"
        />
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.25, ease: EASE_OUT }}
          className="mt-5 text-xs font-medium uppercase tracking-[0.28em] text-ink-muted"
        >
          {copy.tagline}
        </motion.p>
      </motion.div>
    </motion.div>
  );
};
