"use client";

import { SectionHeader } from "@/components/home/SectionHeader";
import { PlanBenefits, PlanEmphasisBar, PlanPrice, PlanTag } from "@/components/pricing/PlanColumn";
import { Button } from "@/components/ui/button";
import { CheckoutLayout } from "@/components/subscription/CheckoutLayout";
import { CheckoutSteps } from "@/components/subscription/CheckoutSteps";
import { CurrentSubscription, effectiveStatus } from "@/components/subscription/CurrentSubscription";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrentSubscription } from "@/hooks/useCurrentSubscription";
import { usePlans } from "@/hooks/usePlans";
import type { ApiPlan } from "@/lib/api/billing";
import { planFeatureLines, tierCopyKey } from "@/lib/config/plans";
import { REVEAL_VIEWPORT, fadeUp, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, CircleAlert, CreditCard, ShieldCheck } from "lucide-react";
import Link from "next/link";

/** The one plan, straight from the database: its price, currency, trial and feature list. */
function PlanCard({ plan, ownsIt, needsRenewal }: { plan: ApiPlan; ownsIt: boolean; needsRenewal: boolean }) {
  const { dictionary } = useLanguage();
  const copy = dictionary.subscription;
  const tierCopy = copy[tierCopyKey(plan.tier)];
  const features = planFeatureLines(plan, copy.planFeature);

  return (
    <motion.article
      variants={fadeUp(0, 16)}
      aria-labelledby="plan-title"
      className="relative mx-auto flex w-full max-w-xl flex-col overflow-hidden rounded-[1.75rem] border border-line bg-teal-50/60 p-6 sm:p-8"
    >
      <PlanEmphasisBar />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="plan-title" className="text-lg font-semibold text-ink">
          {tierCopy.name}
        </h2>
        {ownsIt && <PlanTag tone="current">{copy.currentPlan}</PlanTag>}
      </div>
      <PlanPrice amount={plan.price} currency={plan.currency} className="mt-5" />
      <p className="mt-4 text-[0.9375rem] leading-6 text-ink-muted">{tierCopy.desc}</p>
      <PlanBenefits features={features} emphasis className="mt-6 border-t border-line pt-6" />

      <div className="mt-8">
        {ownsIt ? (
          <Button size="lg" variant="outline" disabled className="w-full">
            {copy.currentPlan}
          </Button>
        ) : (
          <Button asChild size="lg" className="group w-full">
            <Link href={`/subscription/payment?plan=${plan.id}`}>
              {needsRenewal ? copy.renewPlan : tierCopy.cta}
              <ArrowRight className="transition-transform duration-300 ease-out-soft group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" aria-hidden />
            </Link>
          </Button>
        )}
      </div>
    </motion.article>
  );
}

function PlanSkeleton() {
  return (
    <div aria-hidden className="mx-auto w-full max-w-xl animate-pulse rounded-[1.75rem] border border-line bg-white p-8">
      <div className="h-5 w-24 rounded-full bg-surface-muted" />
      <div className="mt-6 h-12 w-40 rounded-xl bg-surface-muted" />
      <div className="mt-6 space-y-3">
        {[0, 1, 2, 3].map((row) => (
          <div key={row} className="h-4 w-full rounded-full bg-surface-muted" />
        ))}
      </div>
      <div className="mt-8 h-12 w-full rounded-full bg-surface-muted" />
    </div>
  );
}

export default function SubscriptionPage() {
  const { dictionary } = useLanguage();
  const copy = dictionary.subscription;
  const plans = usePlans();
  const current = useCurrentSubscription();

  const subscription = current.data ?? null;
  const status = subscription ? effectiveStatus(subscription) : null;
  const plan = plans.plan;
  // The plan is "owned" only while a paid period runs; an expired one is offered again to renew.
  const ownsIt = !!plan && status === "ACTIVE" && subscription?.subscriptionPlanId === plan.id;
  const needsRenewal = !!subscription && subscription.subscriptionStatus === "ACTIVE" && status === "EXPIRED";

  return (
    <CheckoutLayout backHref="/" backLabel={dictionary.nav.backHome} footerNote={copy.trialInfo}>
      <CheckoutSteps current={0} />

      <SectionHeader
        id="subscription-title"
        as="h1"
        align="center"
        eyebrow={copy.selectPlan}
        titleA={copy.mainHeading}
        titleB={copy.mainSubheading}
        intro={copy.mainDescription}
        className="mt-12 sm:mt-14"
      />

      {subscription && <CurrentSubscription subscription={subscription} />}

      <motion.div variants={stagger(0.08, 0.15)} initial="hidden" animate="show" className="mt-10 md:mt-12">
        {plan ? (
          <PlanCard plan={plan} ownsIt={ownsIt} needsRenewal={needsRenewal} />
        ) : plans.isLoading ? (
          <PlanSkeleton />
        ) : (
          <div role="alert" className="mx-auto flex w-full max-w-xl flex-col items-center gap-3 rounded-[1.75rem] border border-rose-100 bg-rose-50 p-8 text-center">
            <CircleAlert className="h-6 w-6 text-rose-700" aria-hidden />
            <p className="font-semibold text-ink">{copy.plansUnavailableTitle}</p>
            <p className="text-sm text-ink-soft">{copy.plansUnavailableBody}</p>
            <Button variant="outline" onClick={() => void plans.refresh()}>
              {copy.retry}
            </Button>
          </div>
        )}
      </motion.div>

      <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-ink-muted">
        {[
          { icon: ShieldCheck, text: copy.securePrivate, tone: "text-teal-600" },
          { icon: Calendar, text: plan ? copy.planFeature.trial.replace("{n}", String(plan.trialDays)) : copy.trialBadge, tone: "text-sage-700" },
          { icon: CreditCard, text: copy.ctaSubtitle, tone: "text-sage-700" },
        ].map(({ icon: Icon, text, tone }) => (
          <li key={text} className="flex items-center gap-2">
            <Icon className={cn("h-4 w-4 shrink-0", tone)} aria-hidden />
            {text}
          </li>
        ))}
      </ul>

      {!subscription && (
        <motion.section
          aria-labelledby="subscription-closing-title"
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={REVEAL_VIEWPORT}
          className="mx-auto mt-20 max-w-2xl text-center sm:mt-24"
        >
          <motion.h2 variants={fadeUp(0, 12)} id="subscription-closing-title" className="text-title font-medium tracking-[-0.02em] text-ink">
            {copy.ctaTitle}
          </motion.h2>
          <motion.p variants={fadeUp(0, 12)} className="home-body mx-auto mt-2 max-w-lg">
            {copy.ctaDescription}
          </motion.p>
          <motion.div variants={fadeUp(0, 12)}>
            <Button asChild variant="outline" size="lg" className="mt-6 w-full sm:w-auto">
              <Link href="/auth/signup">{copy.continueToDashboard}</Link>
            </Button>
          </motion.div>
        </motion.section>
      )}
    </CheckoutLayout>
  );
}
