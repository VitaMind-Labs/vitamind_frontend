"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check, Lock, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { FEATURED_PLAN_ID, PlanPrice } from "@/components/pricing/PlanColumn";
import { PLANS, planCopyKey } from "@/lib/config/plans";
import { fill } from "@/lib/i18n/format";
import { EASE_OUT, REVEAL_VIEWPORT } from "@/lib/motion";
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

  return (
    <motion.section
      dir={direction}
      aria-labelledby="next-steps-title"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={REVEAL_VIEWPORT}
      transition={{ duration: 0.6, ease: EASE_OUT }}
      className="mx-auto mt-8 w-full max-w-5xl overflow-hidden rounded-[1.75rem] border border-line bg-white shadow-raised sm:mt-10 print:hidden"
    >
      <div className="grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        {/* ── Why continue + the path ── */}
        <div className="relative p-6 sm:p-10">
          <div aria-hidden className="canvas-glow pointer-events-none absolute inset-0" />
          <div className="relative">
            <p className="home-eyebrow-pill text-xs font-medium text-teal-700">
              <Sparkles className="h-3.5 w-3.5 text-gold-600" aria-hidden />
              {t.eyebrow}
            </p>
            <h2
              id="next-steps-title"
              className="mt-5 text-[clamp(1.5rem,1.2vw+1.1rem,2rem)] font-medium leading-tight tracking-[-0.02em]"
            >
              <span className="home-heading-accent">{t.title}</span>
            </h2>
            <p className="mt-3 max-w-md text-[0.9375rem] leading-7 text-ink-muted">{t.body}</p>

            <ol className="relative mt-7 space-y-4">
              <span aria-hidden className="absolute start-[1.0625rem] top-5 bottom-5 w-px bg-[linear-gradient(180deg,var(--color-teal-300),var(--color-line))]" />
              {t.steps.map((step, i) => (
                <li key={step} className="relative flex items-center gap-3.5">
                  <span
                    className={cn(
                      "relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold tabular-nums",
                      i === 0 ? "bg-primary text-white shadow-brand" : "border border-teal-200 bg-white text-teal-700",
                    )}
                  >
                    {i + 1}
                  </span>
                  <span className={cn("text-sm", i === 0 ? "font-semibold text-ink" : "font-medium text-ink-soft")}>{step}</span>
                </li>
              ))}
            </ol>

            <ul className="mt-7 space-y-2.5 border-t border-line pt-6">
              {t.benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2.5 text-sm leading-6 text-ink-soft">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sage-100 text-sage-700">
                    <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>

            <Button asChild size="lg" className="group mt-8 min-h-[3.25rem] w-full px-6 shadow-brand sm:w-auto">
              <Link href={buildSignupHref(sessionId)}>
                {t.cta}
                <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" aria-hidden />
              </Link>
            </Button>
            <p className="mt-3 text-xs text-ink-muted">{t.ctaHint}</p>
          </div>
        </div>

        {/* ── Plan previews ── */}
        <div className="border-t border-line bg-surface-muted/70 p-6 sm:p-8 lg:border-s lg:border-t-0">
          <p className="home-label text-ink-muted">{t.plansTitle}</p>
          <div className="mt-5 space-y-4">
            {RESULT_PLANS.map((plan) => {
              const featured = plan.id === FEATURED_PLAN_ID;
              const planCopy = subscription[planCopyKey(plan.id)];
              return (
                <div
                  key={plan.id}
                  className={cn(
                    "surface-card-interactive relative rounded-2xl border bg-white p-5",
                    featured ? "border-teal-300 shadow-raised ring-1 ring-teal-200" : "border-line shadow-xs",
                  )}
                >
                  {featured && (
                    <span className="absolute -top-2.5 end-4 rounded-full bg-primary px-2.5 py-0.5 text-[0.6875rem] font-semibold text-white shadow-brand">
                      {t.featured}
                    </span>
                  )}
                  <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
                    <div className="min-w-0">
                      <p className="text-base font-semibold text-ink">{planCopy.name}</p>
                      <p className="mt-0.5 text-xs leading-5 text-ink-muted">{planCopy.desc}</p>
                    </div>
                    <PlanPrice plan={plan} size="sm" className="shrink-0" />
                  </div>
                  <ul className="mt-3.5 space-y-1.5">
                    {planCopy.features.slice(0, 3).map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-[0.8125rem] leading-5 text-ink-soft">
                        <Check className={cn("mt-0.5 h-3.5 w-3.5 shrink-0", featured ? "text-teal-600" : "text-sage-700")} strokeWidth={2.5} aria-hidden />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button asChild variant={featured ? "default" : "outline"} size="lg" className="mt-4 w-full">
                    <Link href={buildSignupHref(sessionId, plan.id)}>{fill(t.choose, { plan: planCopy.name })}</Link>
                  </Button>
                </div>
              );
            })}
          </div>
          <p className="mt-5 flex items-start gap-2 text-xs leading-5 text-ink-muted">
            <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sage-700" aria-hidden />
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
      transition={{ duration: 0.5, delay: 1.2, ease: EASE_OUT }}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-float backdrop-blur-md lg:hidden print:hidden"
    >
      <div className="mx-auto flex max-w-xl items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-ink">{resultPage.sticky.title}</p>
          <p className="truncate text-xs text-ink-muted">{dictionary.subscription.trialBadge}</p>
        </div>
        <Button asChild size="lg" className="shrink-0 shadow-brand">
          <Link href={buildSignupHref(sessionId)}>{resultPage.sticky.cta}</Link>
        </Button>
      </div>
    </motion.div>
  );
}
