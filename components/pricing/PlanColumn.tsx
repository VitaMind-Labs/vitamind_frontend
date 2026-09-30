"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatAed, formatMoney, planCopyKey, type Plan, type PlanId } from "@/lib/config/plans";
import { SPRING_SOFT } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Shared pricing primitives — the home PricingSection and /subscription are built from these,
 * so plans look and behave the same wherever they appear.
 */

export const FEATURED_PLAN_ID: PlanId = "pro";

/** One comparison surface divided by hairlines: columns on desktop, stacked sections below. */
export const PLAN_GRID_CLASS = "mx-auto w-full max-w-6xl overflow-hidden rounded-[1.75rem] border border-line bg-white lg:grid lg:grid-cols-3";

/** A column of the plan surface. `emphasis` = the plan in focus (featured on home, selected in checkout). */
export function planColumnClass(emphasis: boolean, className?: string) {
  return cn(
    "relative flex min-w-0 flex-col border-t border-line p-6 transition-colors duration-300 ease-out-soft first:border-t-0 sm:p-8 lg:border-s lg:border-t-0 lg:p-9 lg:first:border-s-0",
    emphasis ? "bg-teal-50/60" : "hover:bg-canvas/70 focus-within:bg-canvas/70",
    className,
  );
}

/** The 2px brand bar on the emphasised column. With a `layoutId` it glides between columns. */
export function PlanEmphasisBar({ layoutId }: { layoutId?: string }) {
  return <motion.span layoutId={layoutId} transition={SPRING_SOFT} aria-hidden className="absolute inset-x-0 top-0 z-10 h-0.5 bg-primary" />;
}

export function PlanTag({ tone, children }: { tone: "featured" | "current"; children: ReactNode }) {
  return tone === "featured" ? (
    <span className="home-label rounded-full bg-primary px-2.5 py-1 text-white">{children}</span>
  ) : (
    <span className="home-label inline-flex items-center gap-1.5 rounded-full border border-sage-100 bg-sage-50 px-2.5 py-1 text-sage-700">
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-sage-700" />
      {children}
    </span>
  );
}

/** A monthly price. Marketing plans are quoted in AED; database plans in whatever currency the API says. */
export function PlanPrice({
  plan,
  amount = plan?.priceAed ?? 0,
  currency = "AED",
  size = "lg",
  className,
}: {
  plan?: Plan;
  amount?: number;
  currency?: string;
  size?: "lg" | "sm";
  className?: string;
}) {
  const { dictionary } = useLanguage();
  return (
    <p className={cn("flex items-baseline gap-1.5", className)}>
      <span
        dir="ltr"
        className={cn(
          "font-light leading-none tracking-[-0.03em] tabular-nums text-ink",
          size === "lg" ? "text-[clamp(2.5rem,1.5vw+2rem,3.25rem)]" : "text-[1.75rem]",
        )}
      >
        {currency === "AED" ? formatAed(amount) : formatMoney(amount, currency)}
      </span>
      <span className="text-sm text-ink-muted">{currency === "AED" ? "AED " : ""}{dictionary.subscription.perMonth}</span>
    </p>
  );
}

export function PlanBenefits({ features, emphasis = false, className }: { features: readonly string[]; emphasis?: boolean; className?: string }) {
  return (
    <ul className={cn("space-y-3", className)}>
      {features.map((feature) => (
        <li key={feature} className="flex items-start gap-3">
          <span
            className={cn(
              "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-colors duration-300",
              emphasis ? "bg-primary text-white" : "bg-sage-100 text-sage-700",
            )}
          >
            <Check className="h-3 w-3" strokeWidth={2.5} aria-hidden />
          </span>
          <span className="min-w-0 text-[0.9375rem] leading-6 text-ink-soft">{feature}</span>
        </li>
      ))}
    </ul>
  );
}

type PlanColumnBodyProps = {
  plan: Plan;
  emphasis: boolean;
  headingId: string;
  /** Badges beside the plan name (featured / current). */
  tags?: ReactNode;
  /** The column's action: a link on home, a selection indicator in checkout. */
  action: ReactNode;
};

/**
 * Plan content in priority order — name, price, value, benefits, action.
 * Tablet reflows to summary + action | benefits; mobile and desktop read as one column.
 */
export function PlanColumnBody({ plan, emphasis, headingId, tags, action }: PlanColumnBodyProps) {
  const { dictionary } = useLanguage();
  const planCopy = dictionary.subscription[planCopyKey(plan.id)];

  return (
    <div className="flex flex-1 flex-col md:grid md:grid-cols-2 md:grid-rows-[auto_1fr] md:gap-x-10 lg:flex lg:flex-col">
      <div className="md:col-start-1 md:row-start-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 id={headingId} className="text-lg font-semibold text-ink">
            {planCopy.name}
          </h3>
          {tags ? <span className="flex flex-wrap items-center gap-1.5">{tags}</span> : null}
        </div>
        <PlanPrice plan={plan} className="mt-5" />
        <p className="mt-4 text-[0.9375rem] leading-6 text-ink-muted">{planCopy.desc}</p>
      </div>

      <PlanBenefits
        features={planCopy.features}
        emphasis={emphasis}
        className="mt-6 border-t border-line pt-6 md:col-start-2 md:row-span-2 md:row-start-1 md:mt-0 md:border-t-0 md:pt-1 lg:mt-7 lg:flex-1 lg:border-t lg:pt-7"
      />

      <div className="mt-8 md:col-start-1 md:row-start-2 md:mt-6 md:self-end lg:mt-8">{action}</div>
    </div>
  );
}
