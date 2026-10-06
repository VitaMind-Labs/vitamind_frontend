"use client";

import { HomeSection } from "@/components/home/HomeSection";
import { SectionHeader } from "@/components/home/SectionHeader";
import { EASE_OUT } from "@/lib/motion";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { StickyTour } from "../StickyTour";
import { useAgentPage } from "../shared";
import { AppWindow, type AppScreen } from "./AppWindow";
import { CheckinView, JournalView, ReportView, TrendView } from "./LuminaViews";

/** The rail item each step lights: check-in, journal, home (the month), reports. */
const RAIL: readonly AppScreen[] = [1, 2, 0, 4];

/**
 * A day with Lumina, told by its own app on the deep section, like /mira's phone: the window stays put while the steps scroll
 * past, the rail's marker glides to the screen of the step in view, and the screen draws itself again.
 */
export function LuminaProcess() {
  const { page, copy } = useAgentPage("lumina");
  const preview = copy.lumina.preview;
  const reduce = useReducedMotion();

  const views = [
    <CheckinView key="checkin" copy={preview} />,
    <JournalView key="journal" copy={preview} />,
    <TrendView key="trend" copy={preview} />,
    <ReportView key="report" copy={preview} />,
  ];

  return (
    <HomeSection id="flow" labelledBy="flow-title" tone="deep">
      <span aria-hidden className="pointer-events-none absolute -top-40 end-[-12%] -z-10 size-[44rem] rounded-full bg-[radial-gradient(closest-side,rgb(201_175_111/0.22),transparent)]" />
      <SectionHeader variant="editorial" tone="dark" id="flow-title" counter="03 / 04" eyebrow={page.flow.eyebrow} titleA={page.flow.titleA} titleB={page.flow.titleB} />

      <StickyTour
        steps={page.flow.steps}
        stepLabel={page.flow.stepLabel}
        caption={preview.caption}
        glow="rgb(230_213_170/0.2)"
        stage={(active) => (
          <AppWindow active={RAIL[active]}>
            <div className="min-h-[22rem] sm:min-h-[26rem]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_OUT } }}
                  exit={{ opacity: 0, transition: { duration: 0.16 } }}
                >
                  {views[active]}
                </motion.div>
              </AnimatePresence>
            </div>
          </AppWindow>
        )}
      />
    </HomeSection>
  );
}
