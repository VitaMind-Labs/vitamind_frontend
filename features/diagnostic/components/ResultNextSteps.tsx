"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check, Lock, Sparkles } from "lucide-react";
import { Grain } from "@/components/home/Atmosphere";
import { ACCENT_LIGHT, BODY_SM, DISPLAY_M, DISPLAY_S, LABEL, SERIF } from "@/components/home/typography";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { FEATURED_PLAN_ID } from "@/components/pricing/PlanColumn";
import { PLANS, formatAed, planCopyKey } from "@/lib/config/plans";
import { fill } from "@/lib/i18n/format";
import { EASE_OUT, REVEAL_VIEWPORT, fadeUp, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { buildSignupHref } from "../lib/funnel";

/** Individual plans offered right after an orientation (family plan stays on /subscription). */
const RESULT_PLANS = PLANS.filter((plan) => plan.id !== "parents");

/**
 * Post-orientation conversion: why continue, the 3-step path, and plan previews.
 * Screen-only (never part of the printed report) and each CTA carries the session id
 * so the orientation is linked to the account created at signup.
 */
export function ResultNextSteps({ sessionId }: { sessionId: string }) {
  const { dictionary, direction } = useLanguage();
  const t = dictionary.diagnostic.resultPage.nextSteps;
  const subscription = dictionary.subscription;

  // Title: the last words carry the olive-gold accent, as on the home page.
  const titleWords = t.title.split(" ");
  const titleLead = titleWords.slice(0, -2).join(" ");
  const titleAccent = titleWords.slice(-2).join(" ");

  return (
    <motion.section
      dir={direction}
      aria-labelledby="next-steps-title"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={REVEAL_VIEWPORT}
      transition={{ duration: 0.9, ease: EASE_OUT }}
      className="mx-auto mt-6 w-full max-w-5xl overflow-hidden rounded-[2rem] border border-line bg-white shadow-float sm:mt-8 print:hidden"
    >
      <div className="grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        {/* ── Why continue + the path ── */}
        <div className="relative p-7 sm:p-11">
          <div aria-hidden className="canvas-glow pointer-events-none absolute inset-0" />
          <motion.div variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={REVEAL_VIEWPORT} className="relative">
            <motion.p variants={fadeUp(0, 12)} className={cn(LABEL, "flex items-center gap-3 text-teal-700")}>
              <span aria-hidden className="h-px w-8 bg-gold" />
              <Sparkles className="size-4 text-gold-700" aria-hidden />
              {t.eyebrow}
            </motion.p>
            <motion.h2 variants={fadeUp(0, 16)} id="next-steps-title" className={cn(DISPLAY_M, "mt-6 text-[clamp(2rem,2vw+1.3rem,3rem)] text-ink")}>
              {titleLead ? <>{titleLead} </> : null}
              <span className={ACCENT_LIGHT}>{titleAccent}</span>
            </motion.h2>
            <motion.p variants={fadeUp(0, 12)} className="mt-5 max-w-md text-[1.0625rem] leading-8 text-ink-soft">
              {t.body}
            </motion.p>

            <ol className="relative mt-9 space-y-5">
              <span aria-hidden className="absolute start-[1.1875rem] bottom-5 top-5 w-px bg-[linear-gradient(180deg,var(--color-gold),var(--color-line))]" />
              {t.steps.map((step, i) => (
                <motion.li key={step} variants={fadeUp(0, 12)} className="relative flex items-center gap-4">
                  <span
                    className={cn(
                      "relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full text-[0.9375rem] font-medium tabular-nums",
                      i === 0 ? "bg-teal-800 text-white shadow-brand" : "border border-teal-200 bg-white text-teal-700",
                    )}
                  >
                    {i + 1}
                  </span>
                  <span className={cn("text-[1rem]", i === 0 ? "font-semibold text-ink" : "font-medium text-ink-soft")}>{step}</span>
                </motion.li>
              ))}
            </ol>

            <ul className="mt-9 space-y-3.5 border-t border-line pt-7">
              {t.benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3 text-[0.9375rem] leading-7 text-ink-soft">
                  <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full border border-gold-300/60 bg-gold-50 text-gold-700">
                    <Check className="size-3" strokeWidth={3} aria-hidden />
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>

            <motion.div variants={fadeUp(0, 12)}>
              <Button asChild size="lg" className="group mt-10 min-h-14 w-full px-8 shadow-brand sm:w-auto">
                <Link href={buildSignupHref(sessionId)}>
                  {t.cta}
                  <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" aria-hidden />
                </Link>
              </Button>
              <p className="mt-4 text-[0.875rem] text-ink-soft">{t.ctaHint}</p>
            </motion.div>
          </motion.div>
        </div>

        {/* ── Plan previews ── */}
        <div className="border-t border-line bg-teal-50/60 p-7 sm:p-9 lg:border-s lg:border-t-0">
          <p className={cn(LABEL, "text-ink-soft")}>{t.plansTitle}</p>
          <div className="mt-6 space-y-5">
            {RESULT_PLANS.map((plan) => {
              const featured = plan.id === FEATURED_PLAN_ID;
              const planCopy = subscription[planCopyKey(plan.id)];
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={REVEAL_VIEWPORT}
                  transition={{ duration: 0.8, ease: EASE_OUT }}
                  className={cn(
                    "relative isolate overflow-hidden rounded-panel p-6 transition-[transform,box-shadow] duration-500 ease-out-soft hover:-translate-y-1",
                    featured
                      ? "bg-[linear-gradient(160deg,var(--color-teal-900),var(--color-ink)_95%)] text-white shadow-float"
                      : "border border-line bg-white shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-soft-hover)]",
                  )}
                >
                  {featured && (
                    <>
                      <Grain />
                      <span aria-hidden className="pointer-events-none absolute -end-16 -top-20 -z-10 size-56 rounded-full bg-gold/25 blur-3xl" />
                      <span className={cn(LABEL, "absolute end-5 top-5 rounded-full border border-gold-300/40 bg-gold/10 px-3 py-1 text-gold-300")}>{t.featured}</span>
                    </>
                  )}
                  <div className="min-w-0">
                    <p className={cn(DISPLAY_S, featured ? "text-white" : "text-ink")}>{planCopy.name}</p>
                    <p className={cn(BODY_SM, "mt-1.5 max-w-xs", featured && "text-teal-100")}>{planCopy.desc}</p>
                  </div>

                  <p className="mt-5 flex items-baseline gap-2" dir="ltr">
                    <span className={cn(SERIF, "text-[clamp(2.5rem,2vw+1.8rem,3.25rem)] font-light leading-none tracking-[-0.04em] tabular-nums", featured ? "text-white" : "text-ink")}>
                      {formatAed(plan.priceAed)}
                    </span>
                    <span className={cn("text-[0.9375rem]", featured ? "text-teal-100" : "text-ink-soft")} dir="auto">
                      AED {subscription.perMonth}
                    </span>
                  </p>

                  <ul className="mt-5 space-y-2.5">
                    {planCopy.features.slice(0, 3).map((feature) => (
                      <li key={feature} className={cn("flex items-start gap-2.5 text-[0.9375rem] leading-6", featured ? "text-white/90" : "text-ink-soft")}>
                        <Check className={cn("mt-1 size-3.5 shrink-0", featured ? "text-gold-300" : "text-sage-700")} strokeWidth={2.5} aria-hidden />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    asChild
                    variant={featured ? "default" : "outline"}
                    size="lg"
                    className={cn("mt-6 min-h-13 w-full", featured && "bg-white text-ink shadow-[0_18px_36px_-18px_rgb(0_0_0/0.6)] hover:bg-gold-100 hover:text-ink focus-visible:ring-offset-ink")}
                  >
                    <Link href={buildSignupHref(sessionId, plan.id)}>{fill(t.choose, { plan: planCopy.name })}</Link>
                  </Button>
                </motion.div>
              );
            })}
          </div>
          <p className="mt-6 flex items-start gap-2.5 text-[0.875rem] leading-6 text-ink-soft">
            <Lock className="mt-0.5 size-4 shrink-0 text-sage-700" aria-hidden />
            {t.secure}
          </p>
        </div>
      </div>
    </motion.section>
  );
}

/** Mobile/tablet bottom bar keeping the account CTA within reach while reading the report. */
export function ResultStickyCta({ sessionId }: { sessionId: string }) {
  const { dictionary, direction } = useLanguage();
  const resultPage = dictionary.diagnostic.resultPage;

  return (
    <motion.div
      dir={direction}
      initial={{ y: "110%" }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, delay: 1.2, ease: EASE_OUT }}
      className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden print:hidden"
    >
      <div className="mx-auto flex max-w-xl items-center gap-3 rounded-full border border-white/70 bg-white/90 py-2 ps-5 pe-2 shadow-float ring-1 ring-line/50 backdrop-blur-xl">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[0.9375rem] font-semibold text-ink">{resultPage.sticky.title}</p>
          <p className="truncate text-[0.8125rem] text-ink-soft">{dictionary.subscription.trialBadge}</p>
        </div>
        <Button asChild size="lg" className="shrink-0 shadow-brand">
          <Link href={buildSignupHref(sessionId)}>{resultPage.sticky.cta}</Link>
        </Button>
      </div>
    </motion.div>
  );
}
