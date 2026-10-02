"use client";

import { Grain } from "@/components/home/Atmosphere";
import { HomePlanCard, HomePlanSkeleton } from "@/components/home/PlanCard";
import { TiltCard } from "@/components/home/Interactions";
import { Orbits } from "@/components/home/Pricing";
import { SectionHeader } from "@/components/home/SectionHeader";
import { DISPLAY_M } from "@/components/home/typography";
import { Button } from "@/components/ui/button";
import { CheckoutLayout } from "@/components/subscription/CheckoutLayout";
import { CheckoutSteps } from "@/components/subscription/CheckoutSteps";
import { CurrentSubscription, effectiveStatus } from "@/components/subscription/CurrentSubscription";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrentSubscription } from "@/hooks/useCurrentSubscription";
import { usePlans } from "@/hooks/usePlans";
import { REVEAL_VIEWPORT, fadeUp, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Calendar, CircleAlert, CreditCard, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

export default function SubscriptionPage() {
  const { dictionary } = useLanguage();
  const copy = dictionary.subscription;
  const plans = usePlans();
  const current = useCurrentSubscription();
  const reduce = useReducedMotion();

  const subscription = current.data ?? null;
  const status = subscription ? effectiveStatus(subscription) : null;
  const plan = plans.plan;
  // The plan is "owned" only while a paid period runs; an expired one is offered again to renew.
  const ownsIt = !!plan && status === "ACTIVE" && subscription?.subscriptionPlanId === plan.id;
  const needsRenewal = !!subscription && subscription.subscriptionStatus === "ACTIVE" && status === "EXPIRED";

  // The warm glow behind the plan drifts against the scroll.
  const stage = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: stage, offset: ["start end", "end start"] });
  const glowY = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 60, reduce ? 0 : -60]);

  const reassurance = [
    { icon: ShieldCheck, text: copy.securePrivate },
    { icon: Calendar, text: plan ? copy.planFeature.trial.replace("{n}", String(plan.trialDays)) : copy.trialBadge },
    { icon: CreditCard, text: copy.ctaSubtitle },
  ];

  return (
    <CheckoutLayout backHref="/" backLabel={dictionary.nav.backHome} footerNote={copy.trialInfo}>
      <CheckoutSteps current={0} />

      {subscription && <CurrentSubscription subscription={subscription} />}

      <div className="mt-14 grid items-center gap-16 lg:mt-20 lg:grid-cols-12 lg:gap-12">
        {/* ── The question, in words ─────────────────────────────────────────────── */}
        <div className="lg:col-span-5">
          <SectionHeader
            variant="editorial"
            id="subscription-title"
            as="h1"
            eyebrow={copy.selectPlan}
            titleA={copy.mainHeading}
            titleB={copy.mainSubheading}
            intro={copy.mainDescription}
          />

          <motion.ul variants={stagger(0.1, 0.2)} initial="hidden" animate="show" className="mt-10 divide-y divide-line-strong/70 border-y border-line-strong/70">
            {reassurance.map(({ icon: Icon, text }) => (
              <motion.li key={text} variants={fadeUp(0, 12)} className="flex items-center gap-4 py-4 text-[1rem] text-ink">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-teal-200 bg-white text-teal-700">
                  <Icon className="size-4" strokeWidth={1.75} aria-hidden />
                </span>
                {text}
              </motion.li>
            ))}
          </motion.ul>
        </div>

        {/* ── The offer ──────────────────────────────────────────────────────────── */}
        <div ref={stage} className="relative lg:col-span-7">
          <motion.span
            aria-hidden
            style={{ y: glowY }}
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(227_176_28/0.28),rgb(81_133_145/0.16)_55%,transparent)]"
          />
          <Orbits />

          {plan ? (
            <TiltCard className="mx-auto max-w-xl">
              <HomePlanCard plan={plan} href={`/subscription/payment?plan=${plan.id}`} ownsIt={ownsIt} needsRenewal={needsRenewal} />
            </TiltCard>
          ) : plans.isLoading ? (
            <HomePlanSkeleton />
          ) : (
            <div role="alert" className="mx-auto flex w-full max-w-xl flex-col items-center gap-3 rounded-panel border border-rose-100 bg-rose-50 p-8 text-center">
              <CircleAlert className="h-6 w-6 text-rose-700" aria-hidden />
              <p className="font-semibold text-ink">{copy.plansUnavailableTitle}</p>
              <p className="text-[0.9375rem] text-ink-soft">{copy.plansUnavailableBody}</p>
              <Button variant="outline" onClick={() => void plans.refresh()}>
                {copy.retry}
              </Button>
            </div>
          )}
        </div>
      </div>

      {!subscription && (
        <motion.section
          aria-labelledby="subscription-closing-title"
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={REVEAL_VIEWPORT}
          className="relative isolate mx-auto mt-24 max-w-4xl overflow-hidden rounded-[2rem] bg-[linear-gradient(160deg,var(--color-teal-900),var(--color-ink)_95%)] p-9 text-center text-white shadow-float sm:mt-28 sm:p-14"
        >
          <Grain />
          <span aria-hidden className="pointer-events-none absolute -top-24 start-1/2 -z-10 size-80 -translate-x-1/2 rounded-full bg-gold/25 blur-3xl rtl:translate-x-1/2" />
          <motion.h2 variants={fadeUp(0, 14)} id="subscription-closing-title" className={cn(DISPLAY_M, "text-white")}>
            {copy.ctaTitle}
          </motion.h2>
          <motion.p variants={fadeUp(0, 14)} className="mx-auto mt-4 max-w-lg text-[1.0625rem] leading-8 text-teal-100">
            {copy.ctaDescription}
          </motion.p>
          <motion.div variants={fadeUp(0, 14)}>
            <Button asChild size="lg" className="mt-8 min-h-14 w-full bg-white px-8 text-ink shadow-[0_22px_44px_-18px_rgb(0_0_0/0.6)] hover:bg-gold-100 hover:text-ink focus-visible:ring-offset-ink sm:w-auto">
              <Link href="/auth/signup">{copy.continueToDashboard}</Link>
            </Button>
          </motion.div>
        </motion.section>
      )}
    </CheckoutLayout>
  );
}
