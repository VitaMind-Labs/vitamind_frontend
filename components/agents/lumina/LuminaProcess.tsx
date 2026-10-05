"use client";

import { pad } from "@/components/home/accents";
import { HomeSection } from "@/components/home/HomeSection";
import { SectionHeader } from "@/components/home/SectionHeader";
import { DISPLAY_S } from "@/components/home/typography";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";
import { BrowserFrame } from "../frames";
import { useAgentPage } from "../shared";
import { CheckinView, JournalView, ReportView, TrendView } from "./LuminaViews";

/** How long each step is shown while the tour plays itself. */
const STEP_SECONDS = 7;

/**
 * The month, told as four views of one dashboard. Steps play by themselves while the section is on screen and
 * stop for good the moment the reader picks one; below lg the steps are a row of tabs above the window.
 */
export function LuminaProcess() {
  const { page, copy } = useAgentPage("lumina");
  const preview = copy.lumina.preview;
  const steps = page.flow.steps;
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-20% 0px -20% 0px" });
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);
  const playing = inView && !touched && !reduce;

  const views = [
    { title: preview.views.checkin.title, node: <CheckinView key="checkin" copy={preview} /> },
    { title: preview.views.journal.title, node: <JournalView key="journal" copy={preview} /> },
    { title: preview.views.trend.title, node: <TrendView key="trend" copy={preview} /> },
    { title: preview.views.report.title, node: <ReportView key="report" copy={preview} /> },
  ];

  const choose = (index: number) => {
    setTouched(true);
    setActive(index);
  };

  return (
    <HomeSection id="flow" labelledBy="flow-title">
      <SectionHeader variant="editorial" id="flow-title" counter="02 / 03" eyebrow={page.flow.eyebrow} titleA={page.flow.titleA} titleB={page.flow.titleB} />

      <div ref={ref} className="mt-12 grid gap-8 lg:mt-16 lg:grid-cols-12 lg:gap-12">
        <ol className="grid grid-cols-2 gap-2.5 lg:col-span-4 lg:grid-cols-1 lg:gap-3">
          {steps.map(([title, line], index) => {
            const current = index === active;
            return (
              <li key={title}>
                <button
                  type="button"
                  aria-current={current ? "step" : undefined}
                  onClick={() => choose(index)}
                  className={cn(
                    "relative flex w-full cursor-pointer items-start gap-3.5 overflow-hidden rounded-2xl border p-4 text-start outline-none transition-[background-color,border-color,box-shadow] duration-300 focus-visible:ring-2 focus-visible:ring-teal-500 sm:p-5",
                    current ? "border-gold-100 bg-[linear-gradient(155deg,var(--color-gold-50),#ffffff_80%)] shadow-soft-hover" : "border-line bg-canvas hover:border-teal-200",
                  )}
                >
                  <span dir="ltr" className={cn("flex size-9 shrink-0 items-center justify-center rounded-full font-mono text-[0.75rem] tabular-nums transition-colors duration-300", current ? "bg-ink text-white" : "bg-white text-ink-soft ring-1 ring-line")}>
                    {pad(index + 1)}
                  </span>
                  <span className="min-w-0">
                    <span className={cn(DISPLAY_S, "block text-[1.125rem] sm:text-[1.3125rem]", current ? "text-ink" : "text-ink-soft")}>{title}</span>
                    <span className={cn("block overflow-hidden text-[0.875rem] leading-6 text-ink-soft transition-[max-height,opacity,margin] duration-500 ease-out-soft", current ? "mt-1 max-h-12 opacity-100" : "max-h-0 opacity-0")}>{line}</span>
                  </span>
                  {current && playing && (
                    <motion.span
                      key={`${active}-progress`}
                      aria-hidden
                      className="absolute inset-x-0 bottom-0 h-[3px] origin-left bg-gold rtl:origin-right"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: STEP_SECONDS, ease: "linear" }}
                      onAnimationComplete={() => setActive((value) => (value + 1) % steps.length)}
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ol>

        <div className="relative lg:col-span-8">
          <span aria-hidden className="pointer-events-none absolute -inset-6 -z-10 rounded-[3rem] bg-[radial-gradient(60%_60%_at_50%_40%,rgb(230_213_170/0.4),transparent)]" />
          <BrowserFrame title={views[active].title}>
            <div className="min-h-[24rem] sm:min-h-[26rem]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_OUT } }}
                  exit={{ opacity: 0, transition: { duration: 0.16 } }}
                >
                  {views[active].node}
                </motion.div>
              </AnimatePresence>
            </div>
          </BrowserFrame>
          <p className="mt-4 text-center text-[0.75rem] text-ink-muted">{preview.caption}</p>
        </div>
      </div>
    </HomeSection>
  );
}
