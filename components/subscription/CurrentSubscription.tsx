"use client";

import { motion } from "framer-motion";
import { BadgeCheck, CircleAlert } from "lucide-react";
import { PlanTag } from "@/components/pricing/PlanColumn";
import { useLanguage } from "@/contexts/LanguageContext";
import type { MySubscription, SubscriptionStatus } from "@/lib/api/billing";
import { formatMoney, tierCopyKey } from "@/lib/config/plans";
import { LANGS } from "@/lib/i18n/config";
import { EASE_OUT } from "@/lib/motion";

/**
 * What the patient's subscription really is right now. The stored status can say ACTIVE or
 * TRIAL after its dates have passed, so the shown status follows what the patient can actually
 * use (`hasActiveSubscription` / `hasAccess`), the same rule the API enforces.
 */
function effectiveStatus(subscription: MySubscription): SubscriptionStatus {
  const stored = subscription.subscriptionStatus ?? "TRIAL";
  if (stored === "ACTIVE") return subscription.hasActiveSubscription ? "ACTIVE" : "EXPIRED";
  if (stored === "TRIAL") return subscription.hasAccess ? "TRIAL" : "EXPIRED";
  return stored;
}

/** The patient's subscription, in the same surface language as the plan card. */
export function CurrentSubscription({ subscription }: { subscription: MySubscription }) {
  const { dictionary, language } = useLanguage();
  const copy = dictionary.subscription;
  const locale = LANGS.find((item) => item.code === language)?.bcp47 ?? "en-US";
  const status = effectiveStatus(subscription);
  const running = status === "ACTIVE" || status === "TRIAL";
  const plan = subscription.subscriptionPlan;
  const planName = plan ? copy[tierCopyKey(plan.tier)].name : null;

  // ACTIVE renews, TRIAL ends, anything else has ended.
  const [dateLabel, dateValue] =
    status === "ACTIVE"
      ? [copy.renewsOn, subscription.subscriptionEndDate]
      : status === "TRIAL"
        ? [copy.trialEnds, subscription.trialEndDate]
        : [copy.endedOn, subscription.subscriptionEndDate ?? subscription.trialEndDate];
  const date = dateValue ? new Date(dateValue) : null;
  const formattedDate =
    date && !Number.isNaN(date.getTime())
      ? date.toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric", numberingSystem: "latn" })
      : null;

  return (
    <motion.section
      aria-labelledby="current-subscription-title"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.15 }}
      className="relative mx-auto mt-10 w-full max-w-3xl overflow-hidden rounded-[1.75rem] border border-line bg-white sm:mt-12"
    >
      <span aria-hidden className={`absolute inset-y-0 start-0 w-0.5 ${running ? "bg-sage" : "bg-rose"}`} />
      <div className="grid gap-5 p-5 sm:p-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-10 md:px-8">
        <div className="flex min-w-0 items-center gap-4">
          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${running ? "bg-sage-50 text-sage-700" : "bg-rose-50 text-rose-700"}`}
          >
            {running ? <BadgeCheck className="h-5 w-5" strokeWidth={1.75} aria-hidden /> : <CircleAlert className="h-5 w-5" strokeWidth={1.75} aria-hidden />}
          </span>
          <div className="min-w-0">
            <h2 id="current-subscription-title" className="home-label text-ink-muted">
              {copy.yourSubscription}
            </h2>
            <p className="mt-1 flex flex-wrap items-center gap-2 text-lg font-semibold text-ink">
              {planName}
              {running ? (
                <PlanTag tone="current">{copy.subscriptionStatus[status]}</PlanTag>
              ) : (
                <span className="home-label inline-flex items-center gap-1.5 rounded-full border border-rose-100 bg-rose-50 px-2.5 py-1 text-rose-700">
                  {copy.subscriptionStatus[status]}
                </span>
              )}
            </p>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-6 text-sm sm:flex sm:gap-10">
          {plan ? (
            <div className="min-w-0">
              <dt className="text-ink-muted">{copy.priceLabel}</dt>
              <dd className="mt-1 font-semibold text-ink">
                <span dir="ltr" className="tabular-nums">{formatMoney(plan.price, plan.currency, locale)}</span>{" "}
                <span className="font-normal text-ink-muted">{copy.perMonth}</span>
              </dd>
            </div>
          ) : null}
          {formattedDate ? (
            <div className="min-w-0">
              <dt className="text-ink-muted">{dateLabel}</dt>
              <dd className="mt-1 font-semibold text-ink">{formattedDate}</dd>
            </div>
          ) : null}
        </dl>
      </div>
    </motion.section>
  );
}

export { effectiveStatus };
