"use client";

import { motion } from "framer-motion";
import { BadgeCheck, CircleAlert } from "lucide-react";
import { DISPLAY_S, LABEL, SERIF } from "@/components/home/typography";
import { useLanguage } from "@/contexts/LanguageContext";
import type { MySubscription, SubscriptionStatus } from "@/lib/api/billing";
import { formatMoney, tierCopyKey } from "@/lib/config/plans";
import { LANGS } from "@/lib/i18n/config";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

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

/** The patient's subscription, as a white sheet with a hairline status edge. */
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
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.2 }}
      className="relative mx-auto mt-12 w-full max-w-4xl overflow-hidden rounded-panel border border-line bg-white shadow-[var(--shadow-soft)] sm:mt-14"
    >
      <span aria-hidden className={cn("absolute inset-y-0 start-0 w-1", running ? "bg-[linear-gradient(180deg,var(--color-sage),var(--color-gold))]" : "bg-rose")} />
      <div className="grid gap-6 p-6 sm:p-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-12 md:px-10">
        <div className="flex min-w-0 items-center gap-5">
          <span className={cn("flex size-12 shrink-0 items-center justify-center rounded-2xl", running ? "bg-sage-50 text-sage-700" : "bg-rose-50 text-rose-700")}>
            {running ? <BadgeCheck className="size-6" strokeWidth={1.5} aria-hidden /> : <CircleAlert className="size-6" strokeWidth={1.5} aria-hidden />}
          </span>
          <div className="min-w-0">
            <h2 id="current-subscription-title" className={cn(LABEL, "text-ink-soft")}>
              {copy.yourSubscription}
            </h2>
            <p className="mt-2 flex flex-wrap items-center gap-3">
              <span className={cn(DISPLAY_S, "text-ink")}>{planName}</span>
              <span
                className={cn(
                  LABEL,
                  "inline-flex items-center gap-2 rounded-full border px-3 py-1.5",
                  running ? "border-sage-100 bg-sage-50 text-sage-700" : "border-rose-100 bg-rose-50 text-rose-700",
                )}
              >
                <span aria-hidden className={cn("size-1.5 rounded-full", running ? "bg-sage-700" : "bg-rose")} />
                {copy.subscriptionStatus[status]}
              </span>
            </p>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-8 sm:flex sm:gap-12">
          {plan ? (
            <div className="min-w-0">
              <dt className="text-[0.875rem] text-ink-soft">{copy.priceLabel}</dt>
              <dd className="mt-1.5">
                <span dir="ltr" className={cn(SERIF, "text-[1.75rem] font-light tracking-[-0.03em] tabular-nums text-ink")}>
                  {formatMoney(plan.price, plan.currency, locale)}
                </span>{" "}
                <span className="text-[0.875rem] text-ink-soft">{copy.perMonth}</span>
              </dd>
            </div>
          ) : null}
          {formattedDate ? (
            <div className="min-w-0">
              <dt className="text-[0.875rem] text-ink-soft">{dateLabel}</dt>
              <dd className="mt-1.5 text-[1.0625rem] font-semibold text-ink">{formattedDate}</dd>
            </div>
          ) : null}
        </dl>
      </div>
    </motion.section>
  );
}

export { effectiveStatus };
