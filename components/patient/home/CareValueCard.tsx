"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, Zap } from "lucide-react";
import { CountUp } from "@/components/home/CountUp";
import { DISPLAY_S, SERIF } from "@/components/home/typography";
import { LuminaLogo } from "@/components/patient/ui/LuminaLogo";
import { ErrorState, GlassCard, SectionTitle, Skeleton } from "@/components/patient/ui/primitives";
import { effectiveStatus } from "@/components/subscription/CurrentSubscription";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSubscription } from "@/hooks/patient/useCare";
import { usePatient } from "@/hooks/patient/usePatient";
import { usePatientCopy } from "@/hooks/usePatientCopy";
import { formatMoney, planFeatureLines, tierCopyKey } from "@/lib/config/plans";
import { LANGS } from "@/lib/i18n/config";
import { fill } from "@/lib/i18n/patient";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

const DAY_MS = 86_400_000;
const RING = 104;
const STROKE = 8;

/** Days left in the current period as a ring in the track's accent: the plan's time, made visible. */
function PlanRing({ days, fraction, label }: { days: number; fraction: number; label: string }) {
  const reduce = useReducedMotion();
  const radius = (RING - STROKE) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="relative shrink-0" style={{ width: RING, height: RING }} role="img" aria-label={`${days} ${label}`}>
      <svg width={RING} height={RING} viewBox={`0 0 ${RING} ${RING}`} className="-rotate-90 rtl:rotate-90" aria-hidden>
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
          transition={{ duration: reduce ? 0 : 1.2, ease: EASE_OUT, delay: 0.2 }}
        />
      </svg>
      <span aria-hidden className="absolute inset-0 flex flex-col items-center justify-center">
        <CountUp value={String(days)} className={cn(SERIF, "text-[1.75rem] font-light leading-none tabular-nums text-ink")} />
        <span className="mt-1 text-[0.75rem] text-ink-soft">{label}</span>
      </span>
    </div>
  );
}

function Companion({ icon, name, body, included }: { icon: React.ReactNode; name: string; body: string; included: string }) {
  return (
    <li className="flex items-start gap-3 lm-inset px-3.5 py-3">
      <span className="mt-0.5 shrink-0">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-sm font-semibold text-ink">{name}</span>
          <span className="chip chip-success"><Check className="size-3" aria-hidden />{included}</span>
        </span>
        <span className="mt-1 block text-[0.8125rem] leading-snug text-ink-soft">{body}</span>
      </span>
    </li>
  );
}

/**
 * What the patient's plan gives them, in one place: the time that is left, what it costs per day
 * of support, and the companions it keeps ready (Lumina for everyone, Spark on the ADHD track).
 * The numbers come from the plan the patient actually holds, never from marketing copy.
 */
export function CareValueCard() {
  const copy = usePatientCopy();
  const care = copy.home.care;
  const { dictionary, language } = useLanguage();
  const { profile } = usePatient();
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
    return <GlassCard aria-label={care.title}><Skeleton className="h-64" /></GlassCard>;
  }
  if (subscription.error) {
    return <GlassCard aria-label={care.title}><ErrorState onRetry={() => void subscription.refresh()} /></GlassCard>;
  }

  if (!sub || !plan || !running || !period) {
    return (
      <GlassCard aria-label={care.title} className="text-center">
        <SectionTitle title={care.title} subtitle={care.subtitle} />
        <p className="text-sm font-semibold text-ink">{care.none}</p>
        <p className="mx-auto mt-1 max-w-xs text-sm leading-relaxed text-ink-soft">{care.noneBody}</p>
        <Button asChild className="mt-4"><Link href="/subscription">{care.plans}</Link></Button>
      </GlassCard>
    );
  }

  const planName = dictionary.subscription[tierCopyKey(plan.tier)].name;
  const perDay = plan.durationDays > 0 ? plan.price / plan.durationDays : 0;
  const features = planFeatureLines(plan, dictionary.subscription.planFeature);

  return (
    <GlassCard aria-label={care.title} className="relative overflow-hidden">
      <span aria-hidden className="absolute inset-x-0 top-0 h-0.5" style={{ background: "var(--cond)" }} />
      <SectionTitle
        title={care.title}
        subtitle={care.subtitle}
        action={<span className="chip chip-success shrink-0">{care.status[status ?? "ACTIVE"]}</span>}
      />

      <div className="flex flex-wrap items-center gap-5">
        <PlanRing days={period.days} fraction={period.fraction} label={care.daysLeft} />
        <div className="min-w-0 flex-1 basis-48">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-ink-soft rtl:tracking-normal">{care.plan}</p>
          <p className={cn(DISPLAY_S, "mt-1 text-ink")}>{planName}</p>
          <p className="mt-1 text-sm text-ink-soft">
            <span dir="ltr" className="font-semibold tabular-nums text-ink">{formatMoney(plan.price, plan.currency, locale)}</span>{" "}
            {dictionary.subscription.perMonth}
          </p>
          {perDay > 0 && (
            <p className="mt-1 text-[0.8125rem] leading-snug text-ink-soft">
              {fill(care.perDay, { amount: formatMoney(perDay, plan.currency, locale) })}
            </p>
          )}
          <p className="mt-1 text-[0.8125rem] text-ink-muted">{fill(period.trial ? care.trialEnds : care.renews, { date: period.date })}</p>
        </div>
      </div>

      <ul className="mt-5 space-y-2.5">
        {profile.hasLuminaAccess && (
          <Companion icon={<LuminaLogo size={36} />} name={care.lumina.name} body={care.lumina.body} included={care.included} />
        )}
        {profile.hasSpark && (
          <Companion
            icon={<span className="flex size-9 items-center justify-center rounded-full border text-ink" style={{ borderColor: "var(--cond)" }}><Zap className="size-4" aria-hidden /></span>}
            name={care.spark.name}
            body={care.spark.body}
            included={care.included}
          />
        )}
      </ul>

      {features.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {features.map((feature) => (
            <li key={feature} className="chip">{feature}</li>
          ))}
        </ul>
      )}

      <Button asChild variant="ghost" size="sm" className="mt-4 -ms-2">
        <Link href="/subscription">{care.manage}<ArrowRight className="rtl:-scale-x-100" aria-hidden /></Link>
      </Button>
    </GlassCard>
  );
}
