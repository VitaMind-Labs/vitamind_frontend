"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { PlanBenefits, PlanEmphasisBar, PlanPrice, PlanTag } from "@/components/pricing/PlanColumn";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import type { ApiPlan } from "@/lib/api/billing";
import { planFeatureLines, tierCopyKey } from "@/lib/config/plans";
import { fadeUp } from "@/lib/motion";

/**
 * The one plan, straight from the database: its price, currency, trial and feature list.
 * /subscription and the home PricingSection both render this, so they can never disagree.
 */
export function PlanOfferCard({
  plan,
  href,
  ownsIt = false,
  needsRenewal = false,
}: {
  plan: ApiPlan;
  /** Where the action leads: checkout on /subscription, the plan page from the home page. */
  href: string;
  ownsIt?: boolean;
  needsRenewal?: boolean;
}) {
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
            <Link href={href}>
              {needsRenewal ? copy.renewPlan : tierCopy.cta}
              <ArrowRight className="transition-transform duration-300 ease-out-soft group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" aria-hidden />
            </Link>
          </Button>
        )}
      </div>
    </motion.article>
  );
}

export function PlanOfferSkeleton() {
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
