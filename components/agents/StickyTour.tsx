"use client";

import { pad } from "@/components/home/accents";
import { BODY, DISPLAY_M, LABEL } from "@/components/home/typography";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { EASE_OUT, REVEAL_VIEWPORT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { StepStories, SwipeArea } from "./StepStories";

/** How long each step is shown while the tour plays itself below lg. */
const STEP_SECONDS = 6;

/**
 * The walk-through of an agent page, told by one device on the deep section. From lg the device stays put while the steps
 * scroll past it and its screen follows the step in view. Below lg the steps are a story above the device: they play by
 * themselves while the section is on screen, a swipe or a tap takes over for good, and the screen follows.
 * `stage` draws the device for the step that is active.
 */
export function StickyTour({
  steps,
  stepLabel,
  caption,
  stage,
  glow = "rgb(163_205_209/0.28)",
}: {
  steps: readonly (readonly [title: string, line: string])[];
  stepLabel: string;
  caption: string;
  stage: (active: number) => ReactNode;
  /** The halo behind the device, as an rgb() with underscores for spaces. */
  glow?: string;
}) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);
  const items = useRef<(HTMLLIElement | null)[]>([]);
  const area = useRef<HTMLDivElement>(null);
  const wide = useMediaQuery("(min-width: 1024px)");
  const inView = useInView(area, { margin: "-15% 0px -15% 0px" });
  const playing = !wide && inView && !touched && !reduce;

  // The one clock of the small-screen tour: it moves on after STEP_SECONDS and stops for good once the reader takes over.
  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => setActive((value) => (value + 1) % steps.length), STEP_SECONDS * 1000);
    return () => window.clearTimeout(timer);
  }, [playing, active, steps.length]);

  const choose = (index: number) => {
    setTouched(true);
    setActive(index);
  };
  const step = (delta: 1 | -1) => choose((active + delta + steps.length) % steps.length);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && setActive(Number(entry.target.getAttribute("data-index")))),
      { rootMargin: "-45% 0px -45% 0px" },
    );
    items.current.forEach((node) => node && observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <SwipeArea onStep={step} className="mt-10 lg:contents">
      <div ref={area} className="grid gap-8 lg:mt-20 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          {/* Below lg: the story above the device */}
          <motion.div
            className="lg:hidden"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={REVEAL_VIEWPORT}
            transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.1 }}
          >
            <StepStories steps={steps} active={active} playing={playing} seconds={STEP_SECONDS} stepLabel={stepLabel} tone="dark" onSelect={choose} />
          </motion.div>

          {/* From lg: tall steps; the one in the middle of the screen is lit */}
          <ol className="relative hidden lg:block">
            <span aria-hidden className="absolute inset-y-0 start-[1.375rem] w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />
            {steps.map(([title, line], index) => (
              <li
                key={title}
                ref={(node) => {
                  items.current[index] = node;
                }}
                data-index={index}
                className={cn("relative flex min-h-[70vh] items-center ps-16 transition-opacity duration-500", index === active ? "opacity-100" : "opacity-30")}
              >
                <span
                  dir="ltr"
                  className={cn(
                    "absolute start-0 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border font-mono text-[0.8125rem] tabular-nums transition-colors duration-500",
                    index === active ? "border-gold-300 bg-gold-300 text-teal-900" : "border-white/25 bg-teal-900 text-teal-100",
                  )}
                >
                  {pad(index + 1)}
                </span>
                <div>
                  <p className={cn(LABEL, "text-teal-200")}>
                    {stepLabel} {pad(index + 1)}
                  </p>
                  <h3 className={cn(DISPLAY_M, "mt-3 text-white")}>{title}</h3>
                  <p className={cn(BODY, "mt-4 text-teal-100")}>{line}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 44, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={REVEAL_VIEWPORT}
          transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.1 }}
          className="lg:sticky lg:top-[max(5rem,calc(50svh-20.5rem))] lg:col-span-7 lg:self-start"
        >
          <div className="relative mx-auto flex max-w-xl items-center justify-center py-4 lg:max-w-none">
            <span aria-hidden style={{ background: `radial-gradient(closest-side, ${glow.replace(/_/g, " ")}, transparent)` }} className="pointer-events-none absolute inset-x-[-10%] top-1/2 aspect-square -translate-y-1/2 rounded-full" />
            <div className="relative w-full">{stage(active)}</div>
          </div>
          <p className="mt-4 text-center text-[0.75rem] text-teal-200">{caption}</p>
        </motion.div>
      </div>
    </SwipeArea>
  );
}
