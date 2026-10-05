"use client";

import { pad } from "@/components/home/accents";
import { HomeSection } from "@/components/home/HomeSection";
import { SectionHeader } from "@/components/home/SectionHeader";
import { BODY, DISPLAY_M, DISPLAY_S, LABEL } from "@/components/home/typography";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { PhoneFrame } from "../frames";
import { useAgentPage } from "../shared";
import { DaysScreen, HelloScreen, ResultScreen, SafetyScreen } from "./MiraScreens";

/**
 * The walk-through, told by one phone. From lg the phone stays put while the steps scroll past and its screen follows
 * the step in view; below lg the steps are numbered buttons and the phone changes on tap.
 */
export function MiraProcess() {
  const { page, copy } = useAgentPage("mira");
  const { screens, chapters } = copy.mira.preview;
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const items = useRef<(HTMLLIElement | null)[]>([]);
  const steps = page.flow.steps;

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

      <div className="mt-12 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          {/* Below lg: numbered buttons and the step they open */}
          <div className="lg:hidden">
            <div className="relative flex items-center justify-between">
              <span aria-hidden className="absolute inset-x-5 top-1/2 h-px -translate-y-1/2 bg-white/20" />
              <motion.span
                aria-hidden
                className="absolute start-5 top-1/2 h-px origin-left -translate-y-1/2 bg-gold-300 rtl:origin-right"
                style={{ width: "calc(100% - 2.5rem)" }}
                animate={{ scaleX: active / (steps.length - 1) }}
                transition={{ duration: 0.5, ease: EASE_OUT }}
              />
              {steps.map(([title], index) => (
                <button
                  key={title}
                  type="button"
                  aria-label={title}
                  aria-current={index === active ? "step" : undefined}
                  onClick={() => setActive(index)}
                  className={cn(
                    "relative flex size-11 cursor-pointer items-center justify-center rounded-full border font-mono text-[0.8125rem] tabular-nums transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-300",
                    index <= active ? "border-gold-300 bg-gold-300 text-teal-900" : "border-white/25 bg-teal-900 text-teal-100",
                  )}
                >
                  {pad(index + 1)}
                </button>
              ))}
            </div>
            <div aria-live="polite" className="mt-8 text-center">
              <p className={cn(DISPLAY_S, "text-white")}>{steps[active][0]}</p>
              <p className="mt-2 text-[1.0625rem] text-teal-100">{steps[active][1]}</p>
            </div>
          </div>

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

        <div className="lg:col-span-7 lg:sticky lg:top-[max(5rem,calc(50svh-20.5rem))] lg:self-start">
          <div className="relative mx-auto flex max-w-md items-center justify-center py-4">
            <span aria-hidden className="pointer-events-none absolute inset-x-[-10%] top-1/2 aspect-square -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(163_205_209/0.28),transparent)]" />
            <PhoneFrame className="max-w-[clamp(16.5rem,calc((100svh-7rem)*0.4865),20rem)]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active}
                  className="h-full"
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: EASE_OUT } }}
                  exit={{ opacity: 0, transition: { duration: 0.18 } }}
                >
                  {screen}
                </motion.div>
              </AnimatePresence>
            </PhoneFrame>
          </div>
          <p className="mt-4 text-center text-[0.75rem] text-teal-200">{copy.mira.preview.caption}</p>
        </div>
      </div>
    </HomeSection>
  );
}
