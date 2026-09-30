"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { EASE_OUT, REVEAL_VIEWPORT, fadeUp, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { motion } from "framer-motion";
import { Activity, ArrowRight, Brain, Eye, Info } from "lucide-react";
import { useState } from "react";
import { ACCENTS, type Accent } from "./accents";
import { HomeSection } from "./HomeSection";
import { SectionHeader } from "./SectionHeader";

const ICONS = [Brain, Activity, Eye] as const;
const ACCENT_ORDER: Accent[] = ["teal", "gold", "sage"];

type Condition = { number: string; title: string; category: string; definition: string; fact: string };

/** Definition + quick note — the shared body of both the mobile story and the desktop focus panel. */
function ConditionBody({ condition, accent, quickLabel, lang, large = false }: { condition: Condition; accent: Accent; quickLabel: string; lang: string; large?: boolean }) {
  return (
    <>
      <p className={cn("text-ink-muted", large ? "home-body mt-5 max-w-2xl" : "mt-3 text-[0.9375rem] leading-7")} lang={lang}>
        {condition.definition}
      </p>
      <div className={cn("border-s-2 ps-4 sm:ps-5", ACCENTS[accent].border, large ? "mt-8" : "mt-6")}>
        <p className={cn("home-label", ACCENTS[accent].text)}>{quickLabel}</p>
        <p className="mt-1.5 text-sm leading-6 text-ink-soft" lang={lang}>
          {condition.fact}
        </p>
      </div>
    </>
  );
}

export const ConditionsSection = () => {
  const { language, direction, dictionary } = useLanguage();
  const copy = dictionary.homeLanding.conditions;
  const items = copy.items as readonly Condition[];
  const [active, setActive] = useState("0");

  return (
    <HomeSection id="conditions" labelledBy="conditions-title" tone="tint">
      <SectionHeader id="conditions-title" layout="split" eyebrow={copy.eyebrow} titleA={copy.titleA} titleB={copy.titleB} intro={copy.intro} />

      {/* ── Mobile & tablet: one calm vertical narrative ─────────────────── */}
      <ol className="mt-12 flex flex-col gap-4 md:mt-16 lg:hidden">
        {items.map((condition, i) => {
          const accent = ACCENT_ORDER[i];
          const Icon = ICONS[i];
          return (
            <motion.li
              key={condition.title}
              variants={stagger(0.06)}
              initial="hidden"
              whileInView="show"
              viewport={REVEAL_VIEWPORT}
              className="home-panel relative overflow-hidden p-6 sm:p-8"
            >
              <span aria-hidden className={cn("absolute start-0 top-0 h-0.5 w-16", ACCENTS[accent].rule)} />
              <motion.div variants={fadeUp(0, 12)} className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-3">
                  <span className={cn("text-sm font-semibold tabular-nums", ACCENTS[accent].text)}>{condition.number}</span>
                  <span className="home-label text-ink-muted">{condition.category}</span>
                </span>
                <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", ACCENTS[accent].icon)}>
                  <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                </span>
              </motion.div>
              <motion.div variants={fadeUp(0, 12)}>
                <h3 className="mt-5 text-title font-medium tracking-[-0.02em] text-ink">{condition.title}</h3>
                <ConditionBody condition={condition} accent={accent} quickLabel={copy.quickLabel} lang={language} />
              </motion.div>
            </motion.li>
          );
        })}
      </ol>

      {/* ── Desktop: chapter index + focused chapter ─────────────────────── */}
      <TabsPrimitive.Root
        value={active}
        onValueChange={setActive}
        orientation="vertical"
        dir={direction}
        className="mt-16 hidden gap-12 lg:grid lg:grid-cols-12 xl:gap-16"
      >
        <TabsPrimitive.List aria-label={copy.eyebrow} asChild>
          <motion.div
            variants={stagger(0.08)}
            initial="hidden"
            whileInView="show"
            viewport={REVEAL_VIEWPORT}
            className="flex flex-col self-start border-b border-line lg:col-span-5"
          >
            {items.map((condition, i) => {
              const accent = ACCENT_ORDER[i];
              return (
                <TabsPrimitive.Trigger key={condition.title} value={String(i)} asChild>
                  <motion.button
                    type="button"
                    variants={fadeUp(0, 14)}
                    className="group relative flex w-full cursor-pointer items-start gap-5 border-t border-line py-6 text-start outline-none focus-visible:bg-white/70 focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "absolute -top-px start-0 h-px w-full origin-left scale-x-0 transition-transform duration-500 ease-out-soft group-data-[state=active]:scale-x-100 rtl:origin-right",
                        ACCENTS[accent].rule,
                      )}
                    />
                    <span className={cn("pt-1 text-sm font-semibold tabular-nums text-ink-muted transition-colors duration-300", ACCENTS[accent].activeText)}>
                      {condition.number}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-lg font-medium leading-snug text-ink-muted transition-colors duration-300 group-hover:text-ink group-data-[state=active]:text-ink">
                        {condition.title}
                      </span>
                      <span className="home-label mt-1.5 block text-ink-muted">{condition.category}</span>
                    </span>
                    <ArrowRight
                      className="mt-1.5 h-4 w-4 shrink-0 text-teal-700 opacity-0 transition-[opacity,translate] duration-300 ease-out-soft group-hover:opacity-50 group-data-[state=active]:translate-x-0.5 group-data-[state=active]:opacity-100 rtl:-scale-x-100 rtl:group-data-[state=active]:-translate-x-0.5"
                      aria-hidden
                    />
                  </motion.button>
                </TabsPrimitive.Trigger>
              );
            })}
          </motion.div>
        </TabsPrimitive.List>


        <div className="lg:col-span-7">
          {items.map((condition, i) => {
            const accent = ACCENT_ORDER[i];
            const Icon = ICONS[i];
            return (
              <TabsPrimitive.Content
                key={condition.title}
                value={String(i)}
                className="outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-4 focus-visible:ring-offset-canvas rounded-card"
              >
                <motion.article
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: EASE_OUT }}
                  className="home-panel relative isolate overflow-hidden p-10 xl:p-12"
                >
                  <span
                    aria-hidden
                    className={cn("pointer-events-none absolute -bottom-10 -end-2 -z-10 select-none text-[11rem] font-extralight leading-none tabular-nums opacity-[0.07]", ACCENTS[accent].text)}
                  >
                    {condition.number}
                  </span>
                  <div className="flex items-center justify-between gap-4">
                    <span className={cn("flex h-12 w-12 items-center justify-center rounded-xl", ACCENTS[accent].icon)}>
                      <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
                    </span>
                    <span className="home-label text-ink-muted">{condition.category}</span>
                  </div>
                  <h3 className="mt-8 max-w-lg text-[clamp(1.75rem,1vw+1.25rem,2.25rem)] font-light leading-[1.15] tracking-[-0.025em] text-ink rtl:font-normal">
                    {condition.title}
                  </h3>
                  <ConditionBody condition={condition} accent={accent} quickLabel={copy.quickLabel} lang={language} large />
                </motion.article>
              </TabsPrimitive.Content>
            );
          })}
        </div>
      </TabsPrimitive.Root>

      <p className="mt-10 flex max-w-2xl items-start gap-2 text-xs leading-5 text-ink-muted lg:mt-12">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-700" aria-hidden />
        <span className="min-w-0">{copy.disclaimer}</span>
      </p>
    </HomeSection>
  );
};
