"use client";

import { Button } from "@/components/ui/button";
import { CheckoutLayout } from "@/components/subscription/CheckoutLayout";
import { CheckoutSteps } from "@/components/subscription/CheckoutSteps";
import { PlanComparison } from "@/components/subscription/PlanComparison";
import { useLanguage } from "@/contexts/LanguageContext";
import { EASE_OUT, SPRING_SOFT, fadeUp, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Brain, Calendar, Check, CreditCard, Crown, ShieldCheck, Sparkles, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { PLANS, formatAed, planCopyKey, type PlanId } from "@/lib/config/plans";

const planMeta = [
  { id: "basic", icon: Brain },
  { id: "pro", icon: Crown },
  { id: "parents", icon: Users },
] as const;

const POPULAR_PLAN: PlanId = "pro";

export default function SubscriptionPage() {
  const { dictionary, direction } = useLanguage();
  const searchParams = useSearchParams();
  const copy = dictionary.subscription;
  const nudge = direction === "rtl" ? -6 : 6;
  const [selectedId, setSelectedId] = useState<PlanId>(() => {
    const requestedPlan = searchParams.get("plan");
    return PLANS.some((plan) => plan.id === requestedPlan) ? (requestedPlan as PlanId) : POPULAR_PLAN;
  });

  const selectedPlan = PLANS.find((plan) => plan.id === selectedId)!;
  const selectedCopy = copy[planCopyKey(selectedId)];

  return (
    <CheckoutLayout backHref="/" backLabel={dictionary.nav.backHome} footerNote={copy.trialInfo}>
      <CheckoutSteps current={0} />

      <motion.section variants={stagger(0.08, 0.1)} initial="hidden" animate="show" className="mx-auto mt-12 max-w-3xl text-center sm:mt-14">
        <motion.p variants={fadeUp()} className="home-eyebrow home-eyebrow-pill">
          <Sparkles className="h-3.5 w-3.5 text-gold-600" aria-hidden />
          {copy.selectPlan}
        </motion.p>
        <motion.h1 variants={fadeUp()} className="home-heading mt-5 text-display font-light">
          {copy.mainHeading} <span className="home-heading-accent font-normal">{copy.mainSubheading}</span>
        </motion.h1>
        <motion.p variants={fadeUp()} className="home-body mx-auto mt-5 max-w-xl">
          {copy.mainDescription}
        </motion.p>
      </motion.section>

      <fieldset className="mx-auto mt-12 max-w-xl sm:mt-14 lg:max-w-none">
        <legend className="sr-only">{copy.selectPlan}</legend>
        <div className="grid gap-4 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {planMeta.map((meta, index) => {
            const plan = PLANS.find((item) => item.id === meta.id)!;
            const planCopy = copy[planCopyKey(meta.id)];
            const Icon = meta.icon;
            const selected = selectedId === meta.id;
            const popular = meta.id === POPULAR_PLAN;

            return (
              <motion.label
                key={meta.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 + index * 0.08, ease: EASE_OUT }}
                className={cn(
                  "surface-card surface-card-interactive group relative isolate flex min-w-0 cursor-pointer flex-col p-6 sm:p-7",
                  "has-[input:focus-visible]:ring-4 has-[input:focus-visible]:ring-teal-500/30",
                  selected ? "border-transparent" : "hover:border-teal-200",
                )}
              >
                <input type="radio" name="plan" value={meta.id} checked={selected} onChange={() => setSelectedId(meta.id)} className="sr-only" />

                {/* The selection surface glides between cards (shared layout). */}
                {selected && (
                  <motion.span
                    layoutId="plan-selection"
                    transition={SPRING_SOFT}
                    aria-hidden
                    className="absolute inset-0 -z-10 overflow-hidden rounded-[inherit] bg-[linear-gradient(155deg,var(--color-teal-800),var(--color-ink)_58%,#1f2e2c)] shadow-float"
                  >
                    <span className="absolute -top-20 start-[-20%] h-56 w-56 rounded-full bg-teal-500/40 blur-3xl" />
                    <span className="absolute -bottom-24 end-[-20%] h-56 w-56 rounded-full bg-gold/20 blur-3xl" />
                  </motion.span>
                )}

                <div className="flex items-start justify-between gap-3">
                  <span
                    className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-xl border transition-colors duration-300",
                      selected ? "border-white/15 bg-white/10 text-gold-300" : popular ? "border-gold-100 bg-gold-50 text-gold-700" : "border-teal-100 bg-teal-50 text-teal-700",
                    )}
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                  </span>
                  <span className="flex items-center gap-2">
                    {popular && (
                      <span
                        className={cn(
                          "rounded-full border px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] transition-colors duration-300",
                          selected ? "border-gold/30 bg-gold/15 text-gold-300" : "border-gold-100 bg-gold-50 text-gold-700",
                        )}
                      >
                        {copy.popular}
                      </span>
                    )}
                    <span
                      aria-hidden
                      className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors duration-300",
                        selected ? "border-gold bg-gold text-ink" : "border-line-strong bg-white",
                      )}
                    >
                      <AnimatePresence>
                        {selected && (
                          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={SPRING_SOFT}>
                            <Check className="h-3.5 w-3.5" strokeWidth={3} />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </span>
                  </span>
                </div>

                <div className="mt-5">
                  <h2 className={cn("text-xl font-semibold tracking-[-0.01em] transition-colors duration-300", selected ? "text-white" : "text-ink")}>{planCopy.name}</h2>
                  <p className={cn("mt-1.5 text-[0.9375rem] leading-6 transition-colors duration-300 lg:min-h-12", selected ? "text-teal-100/80" : "text-ink-muted")}>{planCopy.desc}</p>
                </div>

                <div className={cn("mt-5 flex flex-wrap items-baseline gap-x-1.5 gap-y-1 border-y py-5 transition-colors duration-300", selected ? "border-white/12" : "border-line")}>
                  <span dir="ltr" className={cn("tabular-nums text-[2.25rem] font-light leading-none tracking-[-0.03em] transition-colors duration-300", selected ? "text-white" : "text-ink")}>
                    {formatAed(plan.priceAed)}
                    <span className={cn("ms-1.5 text-base font-medium tracking-normal", selected ? "text-teal-100/80" : "text-ink-soft")}>AED</span>
                  </span>
                  <span className={cn("text-sm", selected ? "text-teal-100/70" : "text-ink-muted")}>{copy.perMonth}</span>
                </div>

                <ul className="mt-5 flex-1 space-y-3">
                  {planCopy.features.map((feature, f) => (
                    <motion.li
                      key={feature}
                      initial={false}
                      animate={selected ? { x: [nudge, 0], opacity: [0.6, 1] } : { x: 0, opacity: 1 }}
                      transition={{ duration: 0.35, delay: selected ? f * 0.04 : 0, ease: EASE_OUT }}
                      className={cn("flex items-start gap-3 text-[0.9375rem] leading-6 transition-colors duration-300", selected ? "text-teal-50/90" : "text-ink-soft")}
                    >
                      <span className={cn("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-colors duration-300", selected ? "bg-white/10 text-sage" : "bg-sage-100 text-sage-700")}>
                        <Check className="h-3 w-3" strokeWidth={2.5} aria-hidden />
                      </span>
                      <span className="min-w-0">{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                <span
                  aria-hidden
                  className={cn(
                    "mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full border text-sm font-semibold transition-colors duration-300",
                    selected ? "border-white bg-white text-ink" : "border-line text-ink-soft group-hover:border-teal-200 group-hover:text-teal-700",
                  )}
                >
                  {selected && <Check className="h-4 w-4 text-sage-700" strokeWidth={2.5} />}
                  {selected ? copy.selected : planCopy.cta}
                </span>
              </motion.label>
            );
          })}
        </div>
      </fieldset>

      {/* Selection summary — sticks to the bottom edge on small screens so the next step is always visible. */}
      <div className="sticky bottom-3 z-20 mx-auto mt-6 max-w-xl sm:bottom-4 lg:static lg:mt-8 lg:max-w-3xl">
        <div className="flex flex-col gap-3 rounded-3xl border border-line bg-white/95 p-3 shadow-float backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:p-3.5 sm:ps-6 lg:shadow-raised">
          <div className="min-w-0 px-2 sm:px-0" aria-live="polite">
            <p className="text-xs font-medium text-ink-muted">{copy.selectedPlan}</p>
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={selectedId}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: EASE_OUT }}
                className="truncate text-base font-semibold text-ink"
              >
                {selectedCopy.name}
                <span className="mx-2 text-ink-subtle" aria-hidden>·</span>
                <span dir="ltr" className="tabular-nums">{formatAed(selectedPlan.priceAed)} AED</span>
                <span className="text-sm font-normal text-ink-muted">{copy.perMonth}</span>
              </motion.p>
            </AnimatePresence>
          </div>
          <Button asChild variant="default" size="lg" className="group shrink-0">
            <Link href={`/subscription/payment?plan=${selectedId}`}>
              {selectedCopy.cta}
              <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" aria-hidden />
            </Link>
          </Button>
        </div>
      </div>

      <ul className="mx-auto mt-10 grid max-w-xl gap-3 text-sm text-ink-soft sm:grid-cols-3 sm:gap-4 lg:max-w-4xl">
        {[
          { icon: ShieldCheck, text: copy.securePrivate },
          { icon: Calendar, text: copy.trialBadge },
          { icon: CreditCard, text: copy.ctaSubtitle },
        ].map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-center gap-3 rounded-2xl border border-line bg-white/70 px-4 py-3">
            <Icon className="h-4 w-4 shrink-0 text-gold-600" aria-hidden />
            <span className="min-w-0">{text}</span>
          </li>
        ))}
      </ul>

      <PlanComparison selectedId={selectedId} onSelect={setSelectedId} />

      <section className="mx-auto mt-20 max-w-2xl text-center sm:mt-24">
        <h2 className="text-title font-medium tracking-[-0.02em] text-ink">{copy.ctaTitle}</h2>
        <p className="home-body mx-auto mt-2 max-w-lg">{copy.ctaDescription}</p>
        <Button asChild variant="outline" size="lg" className="mt-6">
          <Link href="/auth/signup">{copy.continueToDashboard}</Link>
        </Button>
      </section>
    </CheckoutLayout>
  );
}
