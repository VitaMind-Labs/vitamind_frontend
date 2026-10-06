"use client";

import { pad } from "@/components/home/accents";
import { HomeSection } from "@/components/home/HomeSection";
import { SectionHeader } from "@/components/home/SectionHeader";
import { BODY, DISPLAY_M, LABEL } from "@/components/home/typography";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { EASE_OUT, REVEAL_VIEWPORT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { StepStories, SwipeArea } from "../StepStories";
import { PhoneFrame } from "../frames";
import { useAgentPage } from "../shared";
import { DaysScreen, HelloScreen, ResultScreen, SafetyScreen } from "./MiraScreens";

/** How long each step is shown while the tour plays itself below lg. */
const STEP_SECONDS = 6;

/**
 * The walk-through, told by one phone. From lg the phone stays put while the steps scroll past and its screen follows
 * the step in view. Below lg the steps are a story above the phone: they play by themselves while the
 * section is on screen, a swipe or a tap takes over for good, and the phone's screen follows.
 */
export function MiraProcess() {
  const { page, copy } = useAgentPage("mira");
  const { screens, chapters } = copy.mira.preview;
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);
  const items = useRef<(HTMLLIElement | null)[]>([]);
  const stage = useRef<HTMLDivElement>(null);
  const steps = page.flow.steps;
  const wide = useMediaQuery("(min-width: 1024px)");
  const inView = useInView(stage, { margin: "-15% 0px -15% 0px" });
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

  const screen = [
    <HelloScreen key="hello" copy={screens.hello} />,
    <DaysScreen key="days" copy={screens.days} chapters={chapters} />,
    <SafetyScreen key="safety" copy={screens.safety} />,
    <ResultScreen key="result" copy={screens.result} />,
  ][active];

  return (
    <HomeSection id="flow" labelledBy="flow-title" tone="deep">
      <span aria-hidden className="pointer-events-none absolute -top-40 end-[-12%] -z-10 size-[44rem] rounded-full bg-[radial-gradient(closest-side,rgb(134_186_188/0.26),transparent)]" />
      <SectionHeader variant="editorial" tone="dark" id="flow-title" counter="02 / 03" eyebrow={page.flow.eyebrow} titleA={page.flow.titleA} titleB={page.flow.titleB} />

      <SwipeArea onStep={step} className="mt-10 lg:contents">
        <div ref={stage} className="grid gap-8 lg:mt-20 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            {/* Below lg: the story above the phone */}
            <motion.div
              className="lg:hidden"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={REVEAL_VIEWPORT}
              transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.1 }}
            >
              <StepStories steps={steps} active={active} playing={playing} seconds={STEP_SECONDS} stepLabel={page.flow.stepLabel} tone="dark" onSelect={choose} />
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
                    {page.flow.stepLabel} {pad(index + 1)}
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
            className="lg:col-span-7 lg:sticky lg:top-[max(5rem,calc(50svh-20.5rem))] lg:self-start"
          >
          <div className="relative mx-auto flex max-w-md items-center justify-center py-4">
            <span aria-hidden className="pointer-events-none absolute inset-x-[-10%] top-1/2 aspect-square -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(163_205_209/0.28),transparent)]" />
            <PhoneFrame className="max-w-[min(15.5rem,calc((100svh-17rem)*0.4865))] sm:max-w-[clamp(16.5rem,calc((100svh-7rem)*0.4865),20rem)]">
              {/* The next screen fades in over the one leaving, so the phone is never blank between steps. */}
              <AnimatePresence initial={false}>
                <motion.div
                  key={active}
                  className="absolute inset-0"
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: EASE_OUT } }}
                  exit={{ opacity: 0, transition: { duration: 0.3 } }}
                >
                  {screen}
                </motion.div>
              </AnimatePresence>
            </PhoneFrame>
          </div>
          <p className="mt-4 text-center text-[0.75rem] text-teal-200">{copy.mira.preview.caption}</p>
          </motion.div>
        </div>
      </SwipeArea>
    </HomeSection>
  );
}
