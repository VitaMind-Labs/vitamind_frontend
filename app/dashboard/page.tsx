"use client";

import { useMemo } from "react";
import { CalendarDays, Sun } from "lucide-react";
import { HeroCard, PlanCard, ProgressStrip, RecommendedExerciseCard, SignalsCard, TrendCard, WellbeingCard } from "@/components/patient/home/HomeCards";
import { HomeSidePanel } from "@/components/patient/home/HomePanels";
import { PageIntro } from "@/components/patient/ui/primitives";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePatient } from "@/hooks/patient/usePatient";
import { usePatientCopy } from "@/hooks/usePatientCopy";
import { fill } from "@/lib/i18n/patient";
import { dayPart, formatDay } from "@/lib/patient/format";

/**
 * Home. A calm, structured overview: Lumina's greeting, today's wellbeing, the trend and
 * signals, a small plan, and — on the right — Lumina (chat or reads, by track).
 * Every card loads on its own, so the page fills in progressively.
 */
export default function HomePage() {
  const copy = usePatientCopy();
  const { language } = useLanguage();
  const { name } = usePatient();
  const greeting = useMemo(() => fill(copy.shell.greeting[dayPart()], { name }), [copy, name]);

  return (
    <div className="lm-rise">
      <PageIntro
        eyebrow={copy.shell.eyebrows.home}
        icon={Sun}
        title={greeting}
        subtitle={copy.home.subtitle}
        action={
          <span className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/90 bg-white/70 px-4 text-sm font-medium text-ink-soft shadow-xs backdrop-blur-sm">
            <CalendarDays className="size-4 text-teal-700" aria-hidden />
            {formatDay(new Date(), language, { weekday: "long", month: "long", day: "numeric" })}
          </span>
        }
      />

      <div className="grid gap-5 md:grid-cols-2 lg:gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(21rem,26rem)] xl:items-start">
        <div className="order-1 md:col-span-2 xl:order-none xl:col-span-1 xl:col-start-1 xl:row-start-1"><HeroCard /></div>
        <div className="order-2 md:col-span-2 xl:order-none xl:col-span-1 xl:col-start-1 xl:row-start-2"><WellbeingCard /></div>
        <div className="order-3 md:col-span-2 xl:order-none xl:col-span-1 xl:col-start-3 xl:row-span-3 xl:row-start-1 xl:sticky xl:top-[5.5rem]"><HomeSidePanel /></div>
        <div className="order-4 xl:order-none xl:col-start-2 xl:row-start-1"><TrendCard /></div>
        <div className="order-5 xl:order-none xl:col-start-1 xl:row-start-3"><PlanCard /></div>
        <div className="order-6 xl:order-none xl:col-start-2 xl:row-start-2"><SignalsCard /></div>
        <div className="order-7 xl:order-none xl:col-start-2 xl:row-start-3"><RecommendedExerciseCard /></div>
        <div className="order-8 md:col-span-2 xl:order-none xl:col-span-2 xl:col-start-1 xl:row-start-4"><ProgressStrip /></div>
      </div>
    </div>
  );
}
