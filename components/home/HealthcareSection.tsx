"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { ROUTES } from "@/lib/config/routes";
import { healthcareCopy, type HealthcareCopy } from "@/lib/i18n/healthcare";
import { EASE_OUT, REVEAL_VIEWPORT, fadeUp, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Lock, ShieldAlert, Stethoscope } from "lucide-react";
import Link from "next/link";
import { Grain, WaveLines } from "./Atmosphere";
import { DrawCheck } from "./DrawCheck";
import { HomeSection } from "./HomeSection";
import { SectionHeader } from "./SectionHeader";
import { DISPLAY_S } from "./typography";

const ONCE = { once: true, margin: "0px 0px -10% 0px" } as const;

/** A report as the clinician meets it: its sections fill in, then the professional's tick lands on it. Illustrative only. */
function ReportPreview({ copy }: { copy: HealthcareCopy["mock"] }) {
  const reduce = useReducedMotion();
  return (
    <div aria-hidden className="relative rounded-2xl border border-teal-100 bg-[linear-gradient(160deg,#ffffff,var(--color-teal-50))] p-4 shadow-card">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[0.75rem] font-semibold text-ink">{copy.report}</span>
        <span className="flex gap-1">
          <span className="size-1.5 rounded-full bg-teal-300" />
          <span className="size-1.5 rounded-full bg-gold" />
        </span>
      </div>
      <div className="mt-4 space-y-2.5">
        {[92, 70, 84, 56].map((width, index) => (
          <motion.span
            key={width}
            className={cn("block h-2 origin-left rounded-full rtl:origin-right", index === 0 ? "bg-teal-500" : index === 2 ? "bg-gold-100" : "bg-teal-100")}
            style={{ width: `${width}%` }}
            initial={reduce ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={ONCE}
            transition={{ duration: 0.8, delay: 0.3 + index * 0.12, ease: EASE_OUT }}
          />
        ))}
      </div>
      <svg viewBox="0 0 120 30" className="mt-4 h-8 w-full overflow-visible rtl:-scale-x-100">
        <motion.path
          d="M 2 22 C 18 20, 26 12, 40 14 S 62 24, 76 16 S 100 6, 118 9"
          fill="none"
          className="stroke-teal-600"
          strokeWidth="2"
          strokeLinecap="round"
          initial={reduce ? false : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={ONCE}
          transition={{ duration: 1.2, delay: 0.6, ease: EASE_OUT }}
        />
      </svg>
      <motion.div
        initial={reduce ? false : { opacity: 0, scale: 0.9, y: 6 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={ONCE}
        transition={{ duration: 0.5, delay: 1.5, ease: EASE_OUT }}
        className="mt-3 flex items-center gap-2 rounded-xl bg-deep px-3 py-2 text-[0.75rem] font-semibold text-white"
      >
        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-gold text-teal-900">
          <DrawCheck className="size-3" strokeWidth={3.5} delay={1.8} />
        </span>
        <span className="min-w-0 leading-tight">{copy.acknowledged}</span>
      </motion.div>
    </div>
  );
}

/** Consent, by category: three switches turn on one by one; a lock holds the rest. Illustrative only. */
function ConsentPreview() {
  const reduce = useReducedMotion();
  const on = [true, true, false];
  return (
    <div aria-hidden className="mt-6 space-y-2 rounded-2xl border border-line bg-white p-3">
      {on.map((enabled, index) => (
        <div key={index} className="flex items-center gap-3 rounded-xl bg-canvas px-3 py-2.5">
          <span className="h-2 flex-1 rounded-full bg-line" style={{ maxWidth: `${[62, 78, 54][index]}%` }} />
          <span className="flex-1" />
          {enabled ? (
            <span className="relative flex h-5 w-9 shrink-0 items-center rounded-full bg-line-strong p-0.5">
              <motion.span
                className="absolute inset-0 rounded-full bg-sage-700"
                initial={reduce ? false : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={ONCE}
                transition={{ duration: 0.3, delay: 0.6 + index * 0.4 }}
              />
              <motion.span
                className="relative size-4 rounded-full bg-white shadow-card"
                initial={reduce ? false : { x: 0 }}
                whileInView={{ x: 16 }}
                viewport={ONCE}
                transition={{ type: "spring", stiffness: 380, damping: 24, delay: 0.6 + index * 0.4 }}
              />
            </span>
          ) : (
            <span className="flex h-5 w-9 shrink-0 items-center justify-center rounded-full bg-line text-ink-subtle">
              <Lock className="size-3" strokeWidth={2.5} />
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

/**
 * The serious-case path on deep teal, read like a timeline: a gold light runs along the line and each step lights as it
 * arrives. Horizontal on wide screens, vertical on small ones. The alert step wears its response-deadline ring.
 */
function SafetyPath({ copy, due }: { copy: HealthcareCopy["escalation"]; due: string }) {
  const reduce = useReducedMotion();
  const steps = copy.steps.length;
  const run = 0.6 * (steps - 1) + 0.2;

  return (
    <motion.div
      variants={fadeUp(0, 24)}
      initial="hidden"
      whileInView="show"
      viewport={REVEAL_VIEWPORT}
      className="relative isolate overflow-hidden rounded-panel bg-deep p-6 text-white shadow-float sm:p-8 lg:col-span-12 lg:p-10"
    >
      <Grain />
      <WaveLines tone="deep" className="inset-y-0 opacity-70" />

      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-start gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-gold-300">
            <ShieldAlert className="size-6" strokeWidth={1.75} aria-hidden />
          </span>
          <div>
            <h3 className={cn(DISPLAY_S, "text-white")}>{copy.title}</h3>
            <p className="mt-1 text-[0.9375rem] leading-[1.7] text-teal-100">{copy.intro}</p>
          </div>
        </div>
      </div>

      <motion.ol variants={stagger(0.6, 0.4)} initial="hidden" whileInView="show" viewport={REVEAL_VIEWPORT} className="relative mt-10 grid gap-7 lg:mt-12 lg:grid-cols-4 lg:gap-6">
        {/* Vertical line (small screens) */}
        <span aria-hidden className="absolute bottom-5 start-[1.1875rem] top-5 w-px bg-white/20 lg:hidden">
          <motion.span
            className="absolute inset-0 origin-top bg-gradient-to-b from-gold-300 to-gold"
            initial={reduce ? false : { scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={REVEAL_VIEWPORT}
            transition={{ duration: run, delay: 0.4, ease: "linear" }}
          />
        </span>
        {/* Horizontal line (wide screens) */}
        <span aria-hidden className="absolute end-[calc(25%-2.375rem)] start-5 top-5 hidden h-px bg-white/20 lg:block">
          <motion.span
            className="absolute inset-0 origin-left bg-gradient-to-r from-gold-300 to-gold rtl:origin-right rtl:bg-gradient-to-l"
            initial={reduce ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={REVEAL_VIEWPORT}
            transition={{ duration: run, delay: 0.4, ease: "linear" }}
          />
        </span>

        {copy.steps.map(([title, line], index) => {
          const alert = index === 2;
          return (
            <motion.li key={title} variants={fadeUp(0, 14)} className="relative flex items-start gap-4 lg:flex-col lg:gap-5">
              <span className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border border-gold/50 bg-teal-900 text-[0.9375rem] font-medium tabular-nums text-gold-300">
                <span className="sr-only">{copy.stepLabel} </span>
                <span dir="ltr">{index + 1}</span>
                {alert ? (
                  <svg aria-hidden viewBox="0 0 48 48" className="absolute -inset-1.5 size-[calc(100%+0.75rem)] -rotate-90">
                    <motion.circle
                      cx="24"
                      cy="24"
                      r="22"
                      fill="none"
                      className="stroke-gold-300"
                      strokeWidth="2"
                      strokeLinecap="round"
                      initial={reduce ? false : { pathLength: 1 }}
                      whileInView={{ pathLength: 0.3 }}
                      viewport={REVEAL_VIEWPORT}
                      transition={{ duration: 3, delay: 0.4 + run, ease: "linear" }}
                    />
                  </svg>
                ) : null}
              </span>
              <div className="min-w-0 pt-1 lg:pt-0">
                <p className="text-[1rem] font-semibold text-white">{title}</p>
                <p className="mt-1 text-[0.9375rem] leading-6 text-teal-100">{line}</p>
                {alert ? (
                  <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[0.6875rem] font-semibold text-gold-300 ring-1 ring-white/15">
                    <span className="size-1.5 rounded-full bg-gold-300 motion-safe:animate-pulse" aria-hidden />
                    {due}
                  </span>
                ) : null}
              </div>
            </motion.li>
          );
        })}
      </motion.ol>
    </motion.div>
  );
}

/**
 * How healthcare professionals are involved, for a patient and for a clinic or a health authority: the professional stays
 * in charge (and reviews every report), patient information is governed by consent, and a serious case always reaches a
 * human. The full trust pillars live on /trust.
 */
export const HealthcareSection = () => {
  const { language } = useLanguage();
  const copy = healthcareCopy[language];

  return (
    <HomeSection id="healthcare" labelledBy="healthcare-title" tone="tint">
      <SectionHeader variant="editorial" id="healthcare-title" layout="split" counter="04 / 04" eyebrow={copy.eyebrow} titleA={copy.titleA} titleB={copy.titleB} intro={copy.intro} />

      <div className="mt-12 grid gap-5 md:mt-16 lg:grid-cols-12 lg:gap-6">
          {/* The professional stays in charge */}
          <motion.div variants={fadeUp(0, 24)} initial="hidden" whileInView="show" viewport={REVEAL_VIEWPORT} className="grid gap-6 rounded-panel border border-teal-200 bg-white p-6 shadow-card sm:grid-cols-[1fr_minmax(0,15rem)] sm:p-8 lg:col-span-7">
            <div>
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
            </div>
            <div className="self-center">
              <ReportPreview copy={copy.mock} />
            </div>
          </motion.div>

          {/* Patient information, governed */}
          <motion.div variants={fadeUp(0.14, 24)} initial="hidden" whileInView="show" viewport={REVEAL_VIEWPORT} className="flex flex-col rounded-panel border border-line bg-white p-6 shadow-card sm:p-8 lg:col-span-5">
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
            <ConsentPreview />
            <Link href={ROUTES.trust} className="mt-auto inline-flex min-h-10 items-center gap-2 self-start rounded-md pt-6 text-[0.9375rem] font-semibold text-teal-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-500">
              <span className="home-link-line">{copy.governance.link}</span>
              <ArrowRight className="size-4 shrink-0 rtl:-scale-x-100" aria-hidden />
            </Link>
          </motion.div>

        <SafetyPath copy={copy.escalation} due={copy.mock.due} />
      </div>
    </HomeSection>
  );
};
