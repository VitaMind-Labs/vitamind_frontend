"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CareValueCard } from "@/components/patient/home/CareValueCard";
import { DayWelcome } from "@/components/patient/home/DayWelcome";
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
 * Home. The day's welcome first (greeting, Lumina, three numbers that count up), then a calm,
 * structured overview: today's wellbeing, the trend and signals, a small plan, what the patient's
 * plan keeps ready for them, and — on the right — Lumina (chat, Spark or reads, by track).
 * Every card loads on its own, so the page fills in progressively.
 */
export default function HomePage() {
  return (
    <div>
      <DayWelcome />

      <div className="grid gap-5 md:grid-cols-2 lg:gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(21rem,26rem)] xl:items-start">
        <Cell index={0} className="order-1 md:col-span-2 xl:order-none xl:col-span-1 xl:col-start-1 xl:row-start-1"><WellbeingCard /></Cell>
        <Cell index={1} className="order-2 md:col-span-2 xl:order-none xl:col-span-1 xl:col-start-3 xl:row-span-4 xl:row-start-1 xl:sticky xl:top-4"><HomeSidePanel /></Cell>
        <Cell index={2} className="order-3 xl:order-none xl:col-start-2 xl:row-start-1"><TrendCard /></Cell>
        <Cell index={3} className="order-4 xl:order-none xl:col-start-1 xl:row-start-2"><PlanCard /></Cell>
        <Cell index={4} className="order-5 xl:order-none xl:col-start-2 xl:row-start-2"><SignalsCard /></Cell>
        <Cell index={5} className="order-6 xl:order-none xl:col-start-1 xl:row-start-3"><RecommendedExerciseCard /></Cell>
        <Cell index={6} className="order-7 xl:order-none xl:col-start-2 xl:row-start-3"><CareValueCard /></Cell>
        <Cell index={7} className="order-8 md:col-span-2 xl:order-none xl:col-span-2 xl:col-start-1 xl:row-start-4"><ProgressStrip /></Cell>
      </div>
    </div>
  );
}
