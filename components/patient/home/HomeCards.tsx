"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  Activity, ArrowRight, BatteryMedium, Brain, CalendarCheck2, Check, ChevronRight, Clock, Flame, HeartPulse, House,
  Link2, Moon, Repeat, Target, TrendingUp, Users, Wind, Zap,
} from "lucide-react";
import { LuminaLogo } from "@/components/patient/ui/LuminaLogo";
import { ErrorState, GlassCard, SectionTitle, Skeleton } from "@/components/patient/ui/primitives";
import { ExerciseSession } from "@/components/patient/ui/ExerciseSession";
import { ScoreRing } from "@/components/patient/ui/ScoreRing";
import { Sparkline, TrendChart } from "@/components/patient/ui/TrendChart";
import { Button } from "@/components/ui/button";
import { usePatient } from "@/hooks/patient/usePatient";
import { useCheckinHistory, useTodayCheckin } from "@/hooks/patient/useCheckin";
import { useAssignedExercises, useCompleteExercise, useCompletedToday, useExerciseCatalog } from "@/hooks/patient/useCare";
import { useLuminaState } from "@/hooks/patient/useLumina";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePatientCopy } from "@/hooks/usePatientCopy";
import type { Exercise } from "@/lib/api/patient-types";
import { fill } from "@/lib/i18n/patient";
import { addDaysLocal, formatDay, localDay } from "@/lib/patient/format";
import { localizeExercise, recommendExercise, suggestedExercises, type LocalizedExercise } from "@/lib/patient/exercises";
import { bandLabel, deriveSignals, readWellbeing, WELLBEING_BY_TRACK, type SignalTone, type WellbeingKey } from "@/lib/patient/home";
import { scaleColor } from "@/lib/patient/moods";
import { cn } from "@/lib/utils";

const DIM_ICON: Record<WellbeingKey | "consistency", typeof Activity> = {
  mood: HeartPulse, energy: Zap, stress: Wind, sleep: Moon, focus: Target, routine: Repeat, social: Users, tasks: CalendarCheck2, consistency: Flame,
};

const EXERCISE_ICON: Record<Exercise["type"], typeof Activity> = {
  BREATHING: Wind, GROUNDING: Link2, SLEEP: Moon, RELAXATION: BatteryMedium, ACTIVITY: Activity, OTHER: Brain,
};

const TONE_CLASS: Record<SignalTone, string> = {
  positive: "bg-sage-100 text-sage-700",
  neutral: "bg-teal-100 text-teal-700",
  attention: "bg-gold-100 text-gold-700",
};

/** The aurora hero: Lumina's welcome to the day, with the one action that matters now. */
export function HeroCard() {
  const copy = usePatientCopy();
  const today = useTodayCheckin();
  const history = useCheckinHistory(30);
  const state = useLuminaState();
  const checkedIn = Boolean(today.data);
  const capacity = state.data?.data?.capacity;
  const hero = copy.home.hero;

  return (
    <section aria-labelledby="hero-title" className="lm-hero">
      <div className="relative flex flex-col gap-6 p-6 sm:p-8">
        <div className="relative z-10 flex items-start gap-4">
          <LuminaLogo size={72} presence float className="shrink-0" />
          <div className="min-w-0">
            {today.isLoading ? (
              <>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="mt-2 h-4 w-64 max-w-full" />
              </>
            ) : (
              <>
                <h2 id="hero-title" className="text-xl font-semibold leading-tight tracking-tight text-ink sm:text-2xl">
                  {checkedIn ? hero.doneTitle : hero.readyTitle}
                </h2>
                <p className="mt-1.5 max-w-md text-sm leading-relaxed text-ink-soft">{checkedIn ? hero.doneBody : hero.readyBody}</p>
              </>
            )}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {capacity && capacity !== "UNKNOWN" && (
                <span className="chip chip-success">{copy.capacity[capacity as keyof typeof copy.capacity] ?? capacity}</span>
              )}
              {history.streak >= 2 && (
                <span className="chip chip-pending"><Flame className="size-3" aria-hidden />{fill(hero.streak, { n: history.streak })}</span>
              )}
            </div>
          </div>
        </div>
        <div className="relative z-10">
          <Button asChild size="lg" disabled={today.isLoading}>
            <Link href={checkedIn ? "/dashboard/lumina" : "/dashboard/check-in"}>
              {checkedIn ? hero.doneCta : hero.readyCta}
              <ArrowRight className="rtl:-scale-x-100" aria-hidden />
            </Link>
          </Button>
        </div>
        <svg aria-hidden viewBox="0 0 400 90" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 bottom-0 h-16 w-full opacity-70">
          <path d="M0 60 C60 30 110 80 180 55 S300 20 400 50 V90 H0Z" fill="rgb(255 255 255 / 0.45)" />
          <path d="M0 75 C80 50 140 90 220 68 S330 45 400 70 V90 H0Z" fill="rgb(255 255 255 / 0.55)" />
        </svg>
      </div>
    </section>
  );
}

/** Today's four rings, chosen for the patient's track. */
export function WellbeingCard() {
  const copy = usePatientCopy();
  const { profile } = usePatient();
  const today = useTodayCheckin();
  const keys = WELLBEING_BY_TRACK[profile.track];

  return (
    <GlassCard aria-labelledby="wellbeing-title">
      <SectionTitle title={copy.home.wellbeing.title} subtitle={copy.home.wellbeing.subtitle} />
      <h2 id="wellbeing-title" className="sr-only">{copy.home.wellbeing.title}</h2>
      {today.error ? (
        <ErrorState onRetry={() => void today.refresh()} />
      ) : (
        <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-4">
          {keys.map((key) => {
            const reading = readWellbeing(key, today.data ?? null);
            const Icon = DIM_ICON[key];
            return (
              <div key={key} className="flex flex-col items-center gap-2 text-center">
                {today.isLoading ? (
                  <Skeleton className="size-[76px] rounded-full" />
                ) : (
                  <ScoreRing value={reading.value} inverted={reading.inverted} label={copy.dimensions[key]} icon={<Icon className="size-5" aria-hidden />} />
                )}
                <div>
                  <p className="text-sm font-semibold text-ink">{copy.dimensions[key]}</p>
                  <p className="text-sm tabular-nums text-ink-soft">{reading.display}</p>
                  <p className="text-xs" style={{ color: scaleColor(reading.value, reading.inverted) }}>{bandLabel(reading, copy)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {!today.isLoading && today.data === null && (
        <p className="mt-4 rounded-xl bg-teal-50/80 px-3 py-2 text-center text-xs text-teal-800">{copy.home.wellbeing.checkinFirst}</p>
      )}
    </GlassCard>
  );
}

/** Seven days of mood with the week-on-week change. */
export function TrendCard() {
  const copy = usePatientCopy();
  const { language } = useLanguage();
  const history = useCheckinHistory(14);

  const { series, percent, hasData } = useMemo(() => {
    const byDay = new Map((history.data ?? []).map((row) => [row.checkinDate.slice(0, 10), row.moodScore]));
    const daily = (offset: number) => localDay(addDaysLocal(new Date(), -offset));
    const week = Array.from({ length: 7 }, (_, i) => {
      const date = addDaysLocal(new Date(), -(6 - i));
      return { label: formatDay(date, language, { weekday: "short" }), value: byDay.get(localDay(date)) ?? null };
    });
    const avg = (values: (number | null)[]) => {
      const nums = values.filter((v): v is number => v !== null);
      return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : null;
    };
    const current = avg(week.map((p) => p.value));
    const previous = avg(Array.from({ length: 7 }, (_, i) => byDay.get(daily(7 + i)) ?? null));
    return {
      series: week,
      hasData: week.some((p) => p.value !== null),
      percent: current !== null && previous !== null && previous > 0 ? Math.round(((current - previous) / previous) * 100) : null,
    };
  }, [history.data, language]);

  return (
    <GlassCard aria-labelledby="trend-title">
      <SectionTitle
        title={copy.home.trend.title}
        subtitle={copy.home.trend.subtitle}
        action={
          percent !== null && (
            <span className={cn("chip shrink-0", percent >= 0 ? "chip-success" : "chip-pending")}>
              <TrendingUp className={cn("size-3", percent < 0 && "-scale-y-100")} aria-hidden />
              {percent > 0 ? "+" : ""}{percent}% <span className="hidden font-normal sm:inline">{copy.home.trend.vsLast}</span>
            </span>
          )
        }
      />
      <h2 id="trend-title" className="sr-only">{copy.home.trend.title}</h2>
      {history.error ? (
        <ErrorState onRetry={() => void history.refresh()} />
      ) : history.isLoading ? (
        <Skeleton className="h-44 w-full" />
      ) : hasData ? (
        <TrendChart data={series} height={190} />
      ) : (
        <p className="rounded-xl bg-white/60 px-4 py-10 text-center text-sm text-muted-foreground">{copy.home.trend.empty}</p>
      )}
    </GlassCard>
  );
}

export function SignalsCard() {
  const copy = usePatientCopy();
  const state = useLuminaState();
  const history = useCheckinHistory(14);
  const signals = useMemo(() => deriveSignals(state.data?.data, history.data ?? [], copy), [state.data, history.data, copy]);
  const loading = state.isLoading || history.isLoading;

  return (
    <GlassCard aria-labelledby="signals-title">
      <SectionTitle title={copy.home.signals.title} />
      <h2 id="signals-title" className="sr-only">{copy.home.signals.title}</h2>
      {loading ? (
        <div className="space-y-3"><Skeleton className="h-12" /><Skeleton className="h-12" /><Skeleton className="h-12" /></div>
      ) : signals.length ? (
        <ul className="space-y-2.5">
          {signals.map((signal, index) => {
            const Icon = DIM_ICON[signal.dimension];
            return (
              <motion.li
                key={signal.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06, duration: 0.35 }}
                className="flex items-center gap-3 rounded-2xl border border-white/80 bg-white/70 px-3.5 py-3"
              >
                <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-xl", TONE_CLASS[signal.tone])}><Icon className="size-4" aria-hidden /></span>
                <p className="min-w-0 text-sm leading-snug text-ink">{signal.text}</p>
              </motion.li>
            );
          })}
        </ul>
      ) : (
        <p className="rounded-xl bg-white/60 px-4 py-6 text-center text-sm text-muted-foreground">{copy.home.signals.empty}</p>
      )}
    </GlassCard>
  );
}

type PlanRow = { exercise: Exercise; assignmentId?: string; assigned: boolean };

/** Today's plan: what the care team assigned first, then Lumina's suggestions for this track. */
export function PlanCard() {
  const copy = usePatientCopy();
  const { language } = useLanguage();
  const { profile } = usePatient();
  const assigned = useAssignedExercises();
  const catalog = useExerciseCatalog();
  const doneToday = useCompletedToday();
  const { complete } = useCompleteExercise();
  const [active, setActive] = useState<PlanRow | null>(null);
  const [open, setOpen] = useState(false);

  const rows = useMemo<PlanRow[]>(() => {
    const own = (assigned.data ?? []).map((item) => ({ exercise: item.exercise, assignmentId: item.id, assigned: true }));
    const taken = new Set(own.map((row) => row.exercise.id));
    const suggested = suggestedExercises(catalog.data ?? [], profile.track, undefined, 6)
      .filter((exercise) => !taken.has(exercise.id))
      .map((exercise) => ({ exercise, assigned: false }));
    return [...own, ...suggested].slice(0, 4);
  }, [assigned.data, catalog.data, profile.track]);

  const loading = assigned.isLoading || catalog.isLoading;
  const localized = active ? localizeExercise(active.exercise, language) : null;

  return (
    <GlassCard aria-labelledby="plan-title">
      <SectionTitle title={copy.home.plan.title} subtitle={copy.home.plan.subtitle} />
      <h2 id="plan-title" className="sr-only">{copy.home.plan.title}</h2>
      {loading ? (
        <div className="space-y-3"><Skeleton className="h-16" /><Skeleton className="h-16" /><Skeleton className="h-16" /></div>
      ) : rows.length ? (
        <ul className="space-y-2.5">
          {rows.map((row) => {
            const item = localizeExercise(row.exercise, language);
            const Icon = EXERCISE_ICON[row.exercise.type];
            const done = doneToday.data?.includes(row.exercise.id) ?? false;
            return (
              <li key={row.exercise.id}>
                <button
                  type="button"
                  onClick={() => {
                    setActive(row);
                    setOpen(true);
                  }}
                  className="group flex w-full items-center gap-3 rounded-2xl border border-white/80 bg-white/70 px-3.5 py-3 text-start transition-all hover:-translate-y-0.5 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
                >
                  <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", done ? "bg-sage-100 text-sage-700" : "bg-teal-100 text-teal-700")}>
                    {done ? <Check className="size-4" aria-hidden /> : <Icon className="size-[1.125rem]" aria-hidden />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-ink">{item.title}</span>
                    <span className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                      {item.minutes ? <><Clock className="size-3" aria-hidden />{fill(copy.common.min, { n: item.minutes })} ·</> : null}
                      {done ? copy.home.plan.completed : row.assigned ? copy.home.plan.assigned : copy.home.plan.suggested}
                    </span>
                  </span>
                  <ChevronRight className="size-4 shrink-0 text-ink-subtle transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" aria-hidden />
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="rounded-xl bg-white/60 px-4 py-6 text-center text-sm text-muted-foreground">{copy.home.plan.empty}</p>
      )}
      <ExerciseSession
        exercise={localized}
        open={open}
        onClose={() => setOpen(false)}
        onFinish={(durationSeconds) =>
          active ? complete({ exerciseId: active.exercise.id, assignmentId: active.assignmentId, durationSeconds }) : undefined
        }
      />
    </GlassCard>
  );
}

/** One recommended exercise, picked from how the patient is doing right now. */
export function RecommendedExerciseCard() {
  const copy = usePatientCopy();
  const { language } = useLanguage();
  const { profile } = usePatient();
  const catalog = useExerciseCatalog();
  const today = useTodayCheckin();
  const { complete } = useCompleteExercise();
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  const exercise = useMemo(
    () =>
      recommendExercise(catalog.data ?? [], profile.track, {
        stress: today.data?.anxietyLevel ?? null,
        sleepHours: today.data?.sleepHours ?? null,
      }),
    [catalog.data, profile.track, today.data],
  );
  const item: LocalizedExercise | null = exercise ? localizeExercise(exercise, language) : null;

  if (catalog.isLoading) {
    return <GlassCard><Skeleton className="h-52" /></GlassCard>;
  }
  if (!item || !exercise) return null;

  return (
    <GlassCard className="overflow-hidden p-0" aria-labelledby="exercise-title">
      <div className="lm-hero relative flex min-h-32 items-end rounded-none border-0 p-5" style={{ boxShadow: "none" }}>
        <motion.span
          aria-hidden
          className="lm-orb absolute end-5 top-4"
          style={{ "--orb": "4.5rem" } as React.CSSProperties}
          animate={reduce ? undefined : { scale: [1, 1.08, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative">
          <p className="lm-eyebrow">{copy.home.exercise.title}</p>
          <p className="mt-0.5 text-xs text-ink-soft">{copy.home.exercise.subtitle}</p>
        </div>
      </div>
      <div className="p-5">
        <h2 id="exercise-title" className="text-lg font-semibold text-ink">{item.title}</h2>
        <p className="mt-1 text-sm leading-relaxed text-ink-soft">{item.description}</p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="flex items-center gap-3 text-xs text-muted-foreground">
            {item.minutes ? <span className="inline-flex items-center gap-1"><Clock className="size-3.5" aria-hidden />{fill(copy.common.min, { n: item.minutes })}</span> : null}
            <span className="inline-flex items-center gap-1"><House className="size-3.5" aria-hidden />{copy.home.exercise.low}</span>
          </p>
          <Button onClick={() => setOpen(true)}>{copy.home.exercise.start}</Button>
        </div>
      </div>
      <ExerciseSession
        exercise={item}
        open={open}
        onClose={() => setOpen(false)}
        onFinish={(durationSeconds) => complete({ exerciseId: exercise.id, durationSeconds })}
      />
    </GlassCard>
  );
}

/** A quiet strip that turns the streak into encouragement. */
export function ProgressStrip() {
  const copy = usePatientCopy();
  const history = useCheckinHistory(14);
  const days = useMemo(() => {
    const set = new Set((history.data ?? []).map((row) => row.checkinDate.slice(0, 10)));
    return Array.from({ length: 7 }, (_, i) => set.has(localDay(addDaysLocal(new Date(), -i)))).filter(Boolean).length;
  }, [history.data]);
  const spark = useMemo(() => {
    const byDay = new Map((history.data ?? []).map((row) => [row.checkinDate.slice(0, 10), row.moodScore]));
    return Array.from({ length: 14 }, (_, i) => byDay.get(localDay(addDaysLocal(new Date(), -(13 - i)))) ?? null);
  }, [history.data]);

  return (
    <GlassCard className="flex flex-col gap-4 sm:flex-row sm:items-center" aria-labelledby="progress-title">
      <span className="stat-tile stat-tile-sage shrink-0"><Flame className="size-5" aria-hidden /></span>
      <div className="min-w-0 flex-1">
        <h2 id="progress-title" className="text-base font-semibold text-ink">{copy.home.progress.title}</h2>
        {history.isLoading ? <Skeleton className="mt-2 h-4 w-72 max-w-full" /> : (
          <p className="mt-0.5 text-sm leading-relaxed text-ink-soft">{fill(copy.home.progress.body, { n: days })}</p>
        )}
      </div>
      <div className="w-full sm:w-48">
        <p className="mb-1 text-xs text-muted-foreground">{copy.home.progress.moodTrend}</p>
        <Sparkline values={spark} color="var(--color-teal-600)" height={44} />
      </div>
    </GlassCard>
  );
}
