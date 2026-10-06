"use client";

import { HomeSection } from "@/components/home/HomeSection";
import { SectionHeader } from "@/components/home/SectionHeader";
import { EASE_OUT } from "@/lib/motion";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { StickyTour } from "../StickyTour";
import { PhoneFrame } from "../frames";
import { useAgentPage } from "../shared";
import { DaysScreen, HelloScreen, ResultScreen, SafetyScreen } from "./MiraScreens";

/** The walk-through, told by one phone whose screen follows the step in view. */
export function MiraProcess() {
  const { page, copy } = useAgentPage("mira");
  const { screens, chapters, caption } = copy.mira.preview;
  const reduce = useReducedMotion();

  const screen = (active: number) =>
    [
      <HelloScreen key="hello" copy={screens.hello} />,
      <DaysScreen key="days" copy={screens.days} chapters={chapters} />,
      <SafetyScreen key="safety" copy={screens.safety} />,
      <ResultScreen key="result" copy={screens.result} />,
    ][active];

  return (
    <HomeSection id="flow" labelledBy="flow-title" tone="deep">
      <span aria-hidden className="pointer-events-none absolute -top-40 end-[-12%] -z-10 size-[44rem] rounded-full bg-[radial-gradient(closest-side,rgb(134_186_188/0.26),transparent)]" />
      <SectionHeader variant="editorial" tone="dark" id="flow-title" counter="02 / 03" eyebrow={page.flow.eyebrow} titleA={page.flow.titleA} titleB={page.flow.titleB} />

      <StickyTour
        steps={page.flow.steps}
        stepLabel={page.flow.stepLabel}
        caption={caption}
        stage={(active) => (
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
                {screen(active)}
              </motion.div>
            </AnimatePresence>
          </PhoneFrame>
        )}
      />
    </HomeSection>
  );
}
