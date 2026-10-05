"use client";

import { useMemo, type ReactNode } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CalendarClock, Coins, Crown, type LucideIcon } from "lucide-react";
import { CountUp } from "@/components/home/CountUp";
import { SERIF } from "@/components/home/typography";
import { GlassCard, Skeleton } from "@/components/patient/ui/primitives";
import { effectiveStatus } from "@/components/subscription/CurrentSubscription";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSubscription } from "@/hooks/patient/useCare";
import { usePatientCopy } from "@/hooks/usePatientCopy";
import { formatMoney, tierCopyKey } from "@/lib/config/plans";
import { LANGS } from "@/lib/i18n/config";
import { fill } from "@/lib/i18n/patient";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

const DAY_MS = 86_400_000;
const RING = 56;
const STROKE = 6;

/** Days left in the period as a small ring in the track's accent. */
function MiniRing({ fraction }: { fraction: number }) {
  const reduce = useReducedMotion();
  const radius = (RING - STROKE) / 2;
  const circumference = 2 * Math.PI * radius;
  return (
    <svg width={RING} height={RING} viewBox={`0 0 ${RING} ${RING}`} className="shrink-0 -rotate-90 rtl:rotate-90" aria-hidden>
      <circle cx={RING / 2} cy={RING / 2} r={radius} fill="none" strokeWidth={STROKE} className="lm-ring-track" />
      <motion.circle
        cx={RING / 2}
        cy={RING / 2}
        r={radius}
        fill="none"
        stroke="var(--cond)"
        strokeWidth={STROKE}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: reduce ? circumference * (1 - fraction) : circumference }}
        animate={{ strokeDashoffset: circumference * (1 - fraction) }}
        transition={{ duration: reduce ? 0 : 1.1, ease: EASE_OUT, delay: 0.2 }}
      />
    </svg>
  );
}

function Tile({ icon: Icon, label, children, aside }: { icon?: LucideIcon; label: string; children: ReactNode; aside?: ReactNode }) {
  return (
    <GlassCard as="div" className="flex min-w-0 items-center gap-3.5 !p-4 sm:!p-5">
      {aside ??
        (Icon ? (
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl border text-ink" style={{ borderColor: "var(--cond)" }}>
            <Icon className="size-5" aria-hidden />
          </span>
        ) : null)}
      <div className="min-w-0 flex-1">
        <p className="truncate text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-ink-soft rtl:tracking-normal">{label}</p>
        {children}
      </div>
    </GlassCard>
  );
}

/**
 * The paid plan, followed at a glance: four small cards — the plan and its status, the days left, what it costs,
 * and when it renews. Numbers come from the plan the patient actually holds.
 */
export function PlanTracker() {
  const copy = usePatientCopy();
  const care = copy.home.care;
  const { dictionary, language } = useLanguage();
  const subscription = useSubscription();
  const locale = LANGS.find((item) => item.code === language)?.bcp47 ?? "en-US";
  const sub = subscription.data ?? null;
  const plan = sub?.subscriptionPlan ?? null;
  const status = sub ? effectiveStatus(sub) : null;
  const running = status === "ACTIVE" || status === "TRIAL";

  const period = useMemo(() => {
    if (!sub || !plan || !running) return null;
    const trial = status === "TRIAL";
    const end = trial ? sub.trialEndDate : sub.subscriptionEndDate;
    const total = trial ? plan.trialDays : plan.durationDays;
    const endTime = end ? new Date(end).getTime() : NaN;
    if (!Number.isFinite(endTime)) return null;
    const days = Math.max(0, Math.ceil((endTime - new Date().getTime()) / DAY_MS));
    return {
      days,
      fraction: total > 0 ? Math.min(1, days / total) : 1,
      date: new Date(endTime).toLocaleDateString(locale, { month: "long", day: "numeric", numberingSystem: "latn" }),
      trial,
    };
  }, [sub, plan, running, status, locale]);

  if (subscription.isLoading) {
    return (
      <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[5.5rem] rounded-[1.25rem]" />
        ))}
      </div>
    );
  }
  if (subscription.error) return null;

  if (!sub || !plan || !running || !period) {
    return (
      <GlassCard aria-label={care.plan} className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-ink">{care.none}</p>
          <p className="mt-0.5 max-w-xl text-sm leading-relaxed text-ink-soft">{care.noneBody}</p>
        </div>
        <Button asChild className="shrink-0">
          <Link href="/subscription">{care.plans}</Link>
        </Button>
      </GlassCard>
    );
  }

  const planName = dictionary.subscription[tierCopyKey(plan.tier)].name;
  const perDay = plan.durationDays > 0 ? plan.price / plan.durationDays : 0;

  return (
    <section aria-label={care.plan}>
      <ul className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 xl:grid-cols-4 lg:gap-4">
        <li className="min-w-0">
          <Tile icon={Crown} label={care.plan}>
            <p className={cn(SERIF, "mt-1 truncate text-[1.25rem] font-normal leading-tight text-ink rtl:font-sans rtl:font-semibold")}>{planName}</p>
            <span className="chip chip-success mt-1.5">{care.status[status ?? "ACTIVE"]}</span>
          </Tile>
        </li>
        <li className="min-w-0">
          <Tile label={care.daysLeft} aside={<MiniRing fraction={period.fraction} />}>
            <p className="mt-1 flex items-baseline gap-1.5">
              <CountUp value={String(period.days)} className={cn(SERIF, "text-[1.75rem] font-light leading-none tabular-nums text-ink")} />
              <span className="text-[0.8125rem] text-ink-soft">{care.daysLeft}</span>
            </p>
          </Tile>
        </li>
        <li className="min-w-0">
          <Tile icon={Coins} label={dictionary.subscription.perMonth}>
            <p dir="ltr" className="mt-1 truncate text-start text-[1.25rem] font-semibold tabular-nums leading-tight text-ink rtl:text-end">
              {formatMoney(plan.price, plan.currency, locale)}
            </p>
            {perDay > 0 && <p className="mt-0.5 line-clamp-2 text-[0.75rem] leading-snug text-ink-soft">{fill(care.perDay, { amount: formatMoney(perDay, plan.currency, locale) })}</p>}
          </Tile>
        </li>
        <li className="min-w-0">
          <Tile icon={CalendarClock} label={period.trial ? care.trialEnds.split("{date}")[0].trim() || care.plan : care.renews.split("{date}")[0].trim() || care.plan}>
            <p className="mt-1 truncate text-[1.25rem] font-semibold leading-tight text-ink">{period.date}</p>
            <Link href="/subscription" className="mt-1 inline-flex items-center gap-1 text-[0.8125rem] font-medium text-teal-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500">
              {care.manage}
              <ArrowRight className="size-3.5 rtl:-scale-x-100" aria-hidden />
            </Link>
          </Tile>
        </li>
      </ul>
    </section>
  );
}
