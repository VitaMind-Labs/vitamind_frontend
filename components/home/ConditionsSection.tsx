"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { EASE_OUT, REVEAL_VIEWPORT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Activity, Brain, Eye, Info, Sparkles } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

const ICONS = [Brain, Activity, Eye] as const;

const ACCENTS = [
  { rule: "bg-teal-500", icon: "bg-teal-50 text-teal-700", ghost: "text-teal-500", note: "bg-teal-50/70", label: "text-teal-700" },
  { rule: "bg-gold", icon: "bg-gold-50 text-gold-700", ghost: "text-gold-600", note: "bg-gold-50", label: "text-gold-700" },
  { rule: "bg-sage", icon: "bg-sage-50 text-sage-700", ghost: "text-sage-700", note: "bg-sage-50", label: "text-sage-700" },
] as const;

/* Asymmetric editorial rhythm on large screens; a single calm column below. */
const LAYOUT = [
  "lg:col-span-7 lg:col-start-1",
  "lg:col-span-5 lg:col-start-8 lg:mt-24",
  "lg:col-span-8 lg:col-start-3",
] as const;

export const ConditionsSection = () => {
  const { language, dictionary } = useLanguage();
  const copy = dictionary.homeLanding.conditions;

  return (
    <section id="conditions" className="section-y relative overflow-hidden bg-canvas">
      <div className="page-container">
        <SectionHeader
          eyebrow={copy.eyebrow}
          icon={<Sparkles className="h-3.5 w-3.5 text-gold-600" aria-hidden />}
          titleA={copy.titleA}
          titleB={copy.titleB}
          intro={copy.intro}
        />

        <div className="mt-14 grid gap-6 md:mt-20 lg:grid-cols-12 lg:gap-8">
          {copy.items.map((condition, i) => {
            const Icon = ICONS[i];
            const accent = ACCENTS[i];

            return (
              <motion.article
                key={condition.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={REVEAL_VIEWPORT}
                transition={{ duration: 0.7, delay: i * 0.08, ease: EASE_OUT }}
                className={cn("group relative min-w-0", LAYOUT[i])}
              >
                <div className="surface-card surface-card-interactive relative overflow-hidden p-6 sm:p-8 md:p-10">
                  <span aria-hidden className={cn("absolute start-0 top-0 h-1 w-16 rounded-ee-full transition-[width] duration-700 ease-out-soft group-hover:w-40", accent.rule)} />

                  <span
                    aria-hidden
                    className={cn(
                      "pointer-events-none absolute -bottom-8 -end-3 select-none text-[8rem] font-extralight leading-none tabular-nums opacity-[0.08] transition-[opacity,translate] duration-700 ease-out-soft group-hover:-translate-y-2 group-hover:opacity-[0.14] md:text-[11rem]",
                      accent.ghost,
                    )}
                  >
                    {condition.number}
                  </span>

                  <div className="relative flex flex-wrap items-center justify-between gap-3">
                    <span className={cn("flex h-12 w-12 items-center justify-center rounded-2xl", accent.icon)}>
                      <Icon className="h-6 w-6" strokeWidth={1.6} aria-hidden />
                    </span>
                    <span className="rounded-full border border-line bg-white px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-ink-muted">
                      {condition.category}
                    </span>
                  </div>

                  <h3 className="relative mt-7 max-w-md text-title font-medium tracking-[-0.02em] text-ink">{condition.title}</h3>
                  <p className="relative mt-4 max-w-xl leading-7 text-ink-muted" lang={language}>
                    {condition.definition}
                  </p>

                  <div className={cn("relative z-10 mt-7 rounded-2xl p-5", accent.note)}>
                    <p className={cn("text-[0.6875rem] font-semibold uppercase tracking-[0.14em]", accent.label)}>{copy.quickLabel}</p>
                    <p className="mt-1.5 text-sm leading-6 text-ink-soft" lang={language}>
                      {condition.fact}
                    </p>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        <p className="mt-10 inline-flex max-w-full items-start gap-2 rounded-2xl border border-line bg-white px-4 py-3 text-xs leading-5 text-ink-muted">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-600" aria-hidden />
          <span className="min-w-0">{copy.disclaimer}</span>
        </p>
      </div>
    </section>
  );
};
