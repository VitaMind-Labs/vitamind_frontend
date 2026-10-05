"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { DayWelcome } from "@/components/patient/home/DayWelcome";
import { PlanTracker } from "@/components/patient/home/PlanTracker";
import { ReadsBand } from "@/components/patient/home/ReadsBand";
import { PlanCard, ProgressStrip, RecommendedExerciseCard, SignalsCard, TrendCard, WellbeingCard } from "@/components/patient/home/HomeCards";
import { HomeSidePanel } from "@/components/patient/home/HomePanels";
import { useCalmTrack } from "@/hooks/useCalmTrack";
import { EASE_OUT } from "@/lib/motion";

/** One grid cell that settles into place a beat after the one before it (still, under reduced motion). */
function Cell({ index, className, children }: { index: number; className: string; children: ReactNode }) {
  const reduce = useReducedMotion();
  const calm = useCalmTrack();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : calm ? { opacity: 0 } : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.5 + index * 0.07 }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Home. The day's welcome first (greeting, three numbers that count up), then — for the tracks that have one — a warm band
 * of reading, the paid plan at a glance in four small cards, then a calm structured overview:
 * today's wellbeing, the trend and signals, a small plan and — beside them — today's goals.
 * Every card loads on its own, so the page fills in progressively.
 */
export default function HomePage() {
  return (
    <div>
      <DayWelcome />
      <ReadsBand />

      <div className="mb-5 lg:mb-6"><PlanTracker /></div>

      {/* Two columns from tablet; the goals panel joins as a third column only where there is real room (2xl). */}
      <div className="grid gap-5 md:grid-cols-2 lg:gap-6 2xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(21rem,25rem)] 2xl:items-start">
        <Cell index={0} className="order-1 min-w-0 md:col-span-2 2xl:order-none 2xl:col-span-1 2xl:col-start-1 2xl:row-start-1"><WellbeingCard /></Cell>
        <Cell index={1} className="order-2 min-w-0 md:col-span-2 2xl:order-none 2xl:col-span-1 2xl:col-start-3 2xl:row-span-3 2xl:row-start-1 2xl:sticky 2xl:top-4"><HomeSidePanel /></Cell>
        <Cell index={2} className="order-3 min-w-0 2xl:order-none 2xl:col-span-1 2xl:col-start-2 2xl:row-start-1"><TrendCard /></Cell>
        <Cell index={3} className="order-4 min-w-0 2xl:order-none 2xl:col-start-1 2xl:row-start-2"><PlanCard /></Cell>
        <Cell index={4} className="order-5 min-w-0 2xl:order-none 2xl:col-start-2 2xl:row-start-2"><SignalsCard /></Cell>
        <Cell index={5} className="order-6 min-w-0 2xl:order-none 2xl:col-start-1 2xl:row-start-3"><RecommendedExerciseCard /></Cell>
        <Cell index={6} className="order-7 min-w-0 md:col-span-2 2xl:order-none 2xl:col-span-1 2xl:col-start-2 2xl:row-start-3"><ProgressStrip /></Cell>
      </div>
    </div>
  );
}
