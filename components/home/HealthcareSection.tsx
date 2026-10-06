"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { ROUTES } from "@/lib/config/routes";
import { healthcareCopy, type HealthcareCopy } from "@/lib/i18n/healthcare";
import { REVEAL_VIEWPORT, fadeUp, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Lock, ShieldAlert, Stethoscope } from "lucide-react";
import Link from "next/link";
import { Grain, WaveLines } from "./Atmosphere";
import { DrawCheck } from "./DrawCheck";
import { HomeSection } from "./HomeSection";
import { SectionHeader } from "./SectionHeader";
import { DISPLAY_S } from "./typography";

/** The serious-case path on deep teal: a gold light runs down the line and each step lights as it arrives. */
function SafetyPath({ copy }: { copy: HealthcareCopy["escalation"] }) {
  const reduce = useReducedMotion();
  const steps = copy.steps.length;

  return (
    <motion.div
      variants={fadeUp(0, 24)}
      initial="hidden"
      whileInView="show"
      viewport={REVEAL_VIEWPORT}
      className="relative isolate flex flex-col overflow-hidden rounded-panel bg-deep p-6 text-white shadow-float sm:p-8 lg:col-span-7 lg:p-10"
    >
      <Grain />
      <WaveLines tone="deep" className="inset-y-0 opacity-80" />

      <span className="flex size-12 items-center justify-center rounded-2xl bg-white/10 text-gold-300">
        <ShieldAlert className="size-6" strokeWidth={1.75} aria-hidden />
      </span>
      <h3 className={cn(DISPLAY_S, "mt-6 text-white")}>{copy.title}</h3>
      <p className="mt-2 max-w-xl text-[0.9375rem] leading-[1.7] text-teal-100 lg:mb-9">{copy.intro}</p>

      <motion.ol variants={stagger(0.7, 0.4)} initial="hidden" whileInView="show" viewport={REVEAL_VIEWPORT} className="relative mt-9 space-y-7 lg:my-auto lg:space-y-9">
        {/* The line, the gold fill that follows the light, and the light itself */}
        <span aria-hidden className="absolute bottom-5 start-[1.1875rem] top-5 w-px bg-white/20">
          <motion.span
            className="absolute inset-0 origin-top bg-gradient-to-b from-gold-300 to-gold"
            initial={reduce ? false : { scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={REVEAL_VIEWPORT}
            transition={{ duration: 0.7 * (steps - 1) + 0.2, delay: 0.5, ease: "linear" }}
          />
          {reduce ? null : (
            <motion.span
              className="absolute -inset-x-[3.5px] size-2 rounded-full bg-gold-300 shadow-[0_0_14px_3px_rgb(201_175_111/0.6)]"
              initial={{ top: "0%", opacity: 0 }}
              whileInView={{ top: "100%", opacity: [0, 1, 1, 0] }}
              viewport={REVEAL_VIEWPORT}
              transition={{ duration: 0.7 * (steps - 1) + 0.2, delay: 0.5, ease: "linear" }}
            />
          )}
        </span>

        {copy.steps.map(([title, line], index) => (
          <motion.li key={title} variants={fadeUp(0, 14)} className="relative flex items-start gap-4">
            <span className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border border-gold/50 bg-teal-900 text-[0.9375rem] font-medium tabular-nums text-gold-300">
              <span className="sr-only">{copy.stepLabel} </span>
              <span dir="ltr">{index + 1}</span>
            </span>
            <div className="min-w-0 pt-1">
              <p className="text-[1rem] font-semibold text-white">{title}</p>
              <p className="mt-1 text-[0.9375rem] leading-6 text-teal-100">{line}</p>
            </div>
          </motion.li>
        ))}
      </motion.ol>
    </motion.div>
  );
}

function useCopy() {
  const { language } = useLanguage();
  return healthcareCopy[language];
}

/**
 * The section a clinic, a hospital or a health authority reads once it wants to know who is accountable: the professional
 * stays in charge, patient information is governed, and a serious case is never left to AI alone. What VitaMind is and what
 * each side gets are told above; the trust pillars open in full on /trust.
 */
export const HealthcareSection = () => {
  const copy = useCopy();

  return (
    <HomeSection id="healthcare" labelledBy="healthcare-title" tone="base">
      <SectionHeader variant="editorial" id="healthcare-title" layout="split" counter="03 / 03" eyebrow={copy.eyebrow} titleA={copy.titleA} titleB={copy.titleB} intro={copy.intro} />

      <div className="mt-12 grid gap-5 md:mt-16 lg:grid-cols-12 lg:gap-6">
        <motion.div variants={stagger(0.12)} initial="hidden" whileInView="show" viewport={REVEAL_VIEWPORT} className="grid gap-5 md:grid-cols-2 lg:col-span-5 lg:flex lg:flex-col lg:gap-6">
          <motion.div variants={fadeUp(0, 24)} className="rounded-panel border border-teal-200 bg-white p-6 shadow-card sm:p-8">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
              <Stethoscope className="size-6" strokeWidth={1.75} aria-hidden />
            </span>
            <h3 className={cn(DISPLAY_S, "mt-6 text-ink")}>{copy.charge.title}</h3>
            <ul className="mt-5 space-y-3">
              {copy.charge.points.map((point, index) => (
                <li key={point} className="flex items-start gap-3 text-[0.9375rem] leading-6 text-ink-soft">
                  <DrawCheck className="mt-1 size-4 shrink-0 text-teal-700" strokeWidth={2.5} delay={0.3 + index * 0.18} />
                  {point}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeUp(0, 24)} className="flex flex-1 flex-col rounded-panel border border-line bg-canvas p-6 sm:p-8">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-sage-50 text-sage-700">
              <Lock className="size-6" strokeWidth={1.75} aria-hidden />
            </span>
            <h3 className={cn(DISPLAY_S, "mt-6 text-ink")}>{copy.governance.title}</h3>
            <ul className="mt-5 space-y-3">
              {copy.governance.points.map((point, index) => (
                <li key={point} className="flex items-start gap-3 text-[0.9375rem] leading-6 text-ink-soft">
                  <DrawCheck className="mt-1 size-4 shrink-0 text-sage-700" strokeWidth={2.5} delay={0.5 + index * 0.18} />
                  {point}
                </li>
              ))}
            </ul>
            <Link href={ROUTES.trust} className="mt-auto inline-flex min-h-10 items-center gap-2 self-start rounded-md pt-6 text-[0.9375rem] font-semibold text-teal-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-500">
              <span className="home-link-line">{copy.governance.link}</span>
              <ArrowRight className="size-4 shrink-0 rtl:-scale-x-100" aria-hidden />
            </Link>
          </motion.div>
        </motion.div>

        <SafetyPath copy={copy.escalation} />
      </div>
    </HomeSection>
  );
};
