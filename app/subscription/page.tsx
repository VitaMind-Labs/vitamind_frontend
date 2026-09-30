"use client";

import { SectionHeader } from "@/components/home/SectionHeader";
import { PlanOfferCard, PlanOfferSkeleton } from "@/components/pricing/PlanOfferCard";
import { Button } from "@/components/ui/button";
import { CheckoutLayout } from "@/components/subscription/CheckoutLayout";
import { CheckoutSteps } from "@/components/subscription/CheckoutSteps";
import { CurrentSubscription, effectiveStatus } from "@/components/subscription/CurrentSubscription";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrentSubscription } from "@/hooks/useCurrentSubscription";
import { usePlans } from "@/hooks/usePlans";
import { REVEAL_VIEWPORT, fadeUp, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Calendar, CircleAlert, CreditCard, ShieldCheck } from "lucide-react";
import Link from "next/link";

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
          <PlanOfferCard plan={plan} href={`/subscription/payment?plan=${plan.id}`} ownsIt={ownsIt} needsRenewal={needsRenewal} />
        ) : plans.isLoading ? (
          <PlanOfferSkeleton />
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
