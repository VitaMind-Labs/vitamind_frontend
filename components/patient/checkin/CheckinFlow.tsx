"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft, ArrowRight, BookOpen, CalendarCheck2, Check, Flame, HeartPulse, Info, Lock, MessageCircle, Moon,
  PencilLine, Pill, Repeat, ShieldAlert, Sparkles, Target, TrendingUp, Users, Wind, Zap,
} from "lucide-react";
import { LuminaLogo } from "@/components/patient/ui/LuminaLogo";
import { ErrorState, Skeleton, SubscriptionGate } from "@/components/patient/ui/primitives";
import { MoodPicker } from "@/components/patient/ui/MoodPicker";
import { ScaleSlider } from "@/components/patient/ui/ScaleSlider";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api/client";
import type { CheckinInput } from "@/lib/api/patient";
import type { CheckinItemKey, CheckinPlan, CheckinResult } from "@/lib/api/patient-types";
import { useCheckinPlan, useSubmitCheckin } from "@/hooks/patient/useCheckin";
import { usePatientCopy } from "@/hooks/usePatientCopy";
import { useLanguage } from "@/contexts/LanguageContext";
import { fill } from "@/lib/i18n/patient";
import { moodFor, type MoodLevel } from "@/lib/patient/moods";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { LogoSpinner } from "@/components/shared/LogoLoader";

type Answers = Partial<Record<CheckinPlan["items"][number]["field"], number | boolean>>;

const SLIDER_ITEMS: CheckinItemKey[] = ["energy", "stress", "focus", "tasks", "routine", "social"];

const STEP_ICON: Record<CheckinItemKey, typeof Zap> = {
  mood: HeartPulse, energy: Zap, stress: Wind, sleep: Moon, focus: Target, tasks: CalendarCheck2, routine: Repeat, social: Users, medication: Pill,
};

const VALUE_ICONS = [TrendingUp, Sparkles, Lock];

function initialAnswers(plan: CheckinPlan): { answers: Answers; touched: Set<string> } {
  const answers: Answers = {};
  const touched = new Set<string>();
  const prefill = plan.prefill;
  if (prefill) {
    for (const item of plan.items) {
      const value = prefill[item.field];
      if (value !== null && value !== undefined) {
        answers[item.field] = value;
        touched.add(item.field);
      }
    }
  }
  return { answers, touched };
}

/**
 * The daily check-in: one calm question at a time, in the order the backend plans for this
 * patient. The mood the patient picks re-colours the whole space (the stage's light and the
 * brand ramp inside it), and they can change it at any point — before, during or after.
 */
export function CheckinFlow() {
  const planResource = useCheckinPlan();
  const plan = planResource.data;

  if (planResource.error && !plan) return <ErrorState onRetry={() => void planResource.refresh()} />;
  if (!plan) return <CheckinSkeleton />;
  if (!plan.hasLuminaAccess) return <SubscriptionGate />;

  // Remounted per plan day so a stale answer set never leaks across days.
  return <CheckinStepper key={plan.date} plan={plan} />;
}

function CheckinSkeleton() {
  return (
    <div className="lm-mood-stage grid gap-6 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="space-y-5"><Skeleton className="h-3 w-full" /><Skeleton className="h-16 w-2/3" /><Skeleton className="h-36" /><Skeleton className="h-11 w-40" /></div>
      <div className="hidden space-y-4 lg:block"><Skeleton className="h-24" /><Skeleton className="h-48" /></div>
    </div>
  );
}

/** The light and colours of the chosen mood, around everything the check-in shows. */
function MoodStage({ mood, children, className }: { mood: MoodLevel | null; children: ReactNode; className?: string }) {
  return (
    <div data-mood={mood?.level ?? 3} className={cn("lm-mood-stage", className)}>
      {children}
    </div>
  );
}

function CheckinStepper({ plan }: { plan: CheckinPlan }) {
  const copy = usePatientCopy();
  const { direction } = useLanguage();
  const reduce = useReducedMotion();
  const { submit, isSubmitting, error, clearError } = useSubmitCheckin();

  const seed = useMemo(() => initialAnswers(plan), [plan]);
  const [answers, setAnswers] = useState<Answers>(seed.answers);
  const [touched, setTouched] = useState<Set<string>>(seed.touched);
  const [index, setIndex] = useState(0);
  const [heading, setHeading] = useState(1); // 1 = moving forward, -1 = back
  const [result, setResult] = useState<CheckinResult | null>(null);
  const [editing, setEditing] = useState(false);
  const [started, setStarted] = useState(false);

  const items = plan.items;
  const item = items[index];
  const last = index === items.length - 1;
  const sign = direction === "rtl" ? -1 : 1;
  const mood = moodFor(answers.moodScore as number | undefined);

  if (plan.alreadyCheckedIn && !editing && !result) {
    return <AlreadyDone plan={plan} onEdit={() => { setEditing(true); setStarted(true); }} />;
  }
  if (result) return <CheckinResultView result={result} plan={plan} answers={answers} />;
  if (!started) return <StartCard plan={plan} onBegin={() => setStarted(true)} />;

  const answered = touched.has(item.field);

  function set(field: string, value: number | boolean) {
    clearError();
    setAnswers((current) => ({ ...current, [field]: value }));
    setTouched((current) => new Set(current).add(field));
  }

  async function finish() {
    // Only what the patient actually answered is sent: an unanswered question stays missing.
    const payload: Record<string, number | boolean> = { moodScore: answers.moodScore as number };
    for (const entry of items) {
      const value = answers[entry.field];
      if (touched.has(entry.field) && value !== undefined) payload[entry.field] = value;
    }
    const saved = await submit(payload as unknown as CheckinInput);
    if (saved) setResult(saved);
  }

  function go(step: number) {
    setHeading(step > index ? 1 : -1);
    setIndex(Math.max(0, Math.min(items.length - 1, step)));
  }

  const q = copy.checkin.q[item.key];
  const progress = ((index + (answered ? 1 : 0)) / items.length) * 100;

  return (
    <MoodStage mood={mood} className="grid lg:grid-cols-[minmax(0,1fr)_21rem]">
      <section aria-label={copy.checkin.title} className="flex min-w-0 flex-col p-5 sm:p-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <p className="text-xs font-medium text-ink-muted" aria-live="polite">{fill(copy.checkin.step, { a: index + 1, b: items.length })}</p>
          <div className="h-1.5 w-32 overflow-hidden rounded-full bg-ink/10 sm:w-56" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}>
            <motion.div className="h-full rounded-full bg-gradient-to-r from-teal-400 to-teal-700 rtl:bg-gradient-to-l" animate={{ width: `${progress}%` }} transition={{ duration: reduce ? 0 : 0.5, ease: EASE_OUT }} />
          </div>
        </div>

        <AnimatePresence mode="wait" initial={false} custom={heading}>
          <motion.div
            key={item.key}
            custom={heading}
            initial={{ opacity: 0, x: reduce ? 0 : 28 * heading * sign }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: reduce ? 0 : -28 * heading * sign }}
            transition={{ duration: reduce ? 0 : 0.28, ease: EASE_OUT }}
            className="flex-1"
          >
            <span className="stat-tile mb-4 size-11">{(() => { const Icon = STEP_ICON[item.key]; return <Icon className="size-5" aria-hidden />; })()}</span>
            <h2 className="text-[clamp(1.375rem,1.1rem+1vw,1.875rem)] font-semibold leading-snug tracking-tight text-ink">{q.title}</h2>
            {item.key === "mood" && <p className="mt-1.5 text-sm text-ink-soft">{copy.checkin.companion.pickMood}</p>}

            <div className="mt-7">
              {item.key === "mood" && (
                <>
                  <MoodPicker
                    value={(answers.moodScore as number | undefined) ?? null}
                    onChange={(score) => set("moodScore", score)}
                    labels={copy.checkin.moods}
                    ariaLabel={q.title}
                  />
                  <AnimatePresence mode="wait">
                    {mood && (
                      <motion.p
                        key={mood.level}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-4 text-center text-xs font-semibold uppercase tracking-[0.14em] text-teal-700 rtl:tracking-normal"
                      >
                        {copy.moods.levels[mood.level - 1].tone}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </>
              )}
              {item.key === "sleep" && (
                <ScaleSlider
                  value={(answers.sleepHours as number | undefined) ?? 7}
                  onChange={(value) => set("sleepHours", value)}
                  min={0}
                  max={12}
                  step={0.5}
                  ariaLabel={q.title}
                  format={(value) => `${value}${copy.checkin.q.sleep.unit}`}
                />
              )}
              {SLIDER_ITEMS.includes(item.key) && (
                <ScaleSlider
                  value={(answers[item.field] as number | undefined) ?? 5}
                  onChange={(value) => set(item.field, value)}
                  inverted={item.key === "stress"}
                  ariaLabel={q.title}
                  lowLabel={"low" in q ? q.low : undefined}
                  highLabel={"high" in q ? q.high : undefined}
                />
              )}
              {item.key === "medication" && (
                <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label={q.title}>
                  {[true, false].map((value) => {
                    const active = answers.medicationTaken === value;
                    return (
                      <button
                        key={String(value)}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => set("medicationTaken", value)}
                        className={cn(
                          "flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl border px-3 text-sm font-semibold transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500",
                          active ? "border-transparent bg-gradient-to-br from-teal-500 to-teal-700 text-white shadow-brand" : "border-white/80 bg-white/70 text-ink hover:-translate-y-0.5 hover:bg-white",
                        )}
                      >
                        {value ? <Check className="size-5" aria-hidden /> : <Pill className="size-5" aria-hidden />}
                        {"yes" in q ? (value ? q.yes : q.no) : null}
                      </button>
                    );
                  })}
                </div>
              )}
              {item.key === "sleep" && "hint" in q && <p className="mt-3 text-center text-xs text-muted-foreground">{q.hint}</p>}
            </div>

            <p className="mt-7 flex items-start gap-2 rounded-xl bg-white/60 px-3.5 py-2.5 text-xs leading-relaxed text-teal-800">
              <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
              <span><span className="font-semibold">{copy.checkin.why}: </span>{q.why}</span>
            </p>
          </motion.div>
        </AnimatePresence>

        {error && (
          <p role="alert" className="mt-4 rounded-xl bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700">
            {error instanceof ApiError && error.status === 403 ? copy.checkin.subscriptionRequired : copy.checkin.error}
          </p>
        )}

        <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
          <Button variant="ghost" onClick={() => go(index - 1)} disabled={index === 0 || isSubmitting}>
            <ArrowLeft className="rtl:-scale-x-100" aria-hidden />{copy.checkin.back}
          </Button>
          <div className="flex items-center gap-2">
            {!item.required && !answered && !last && (
              <Button variant="ghost" onClick={() => go(index + 1)}>{copy.checkin.skip}</Button>
            )}
            {last ? (
              <Button size="lg" onClick={() => void finish()} disabled={isSubmitting || !touched.has("moodScore")}>
                {isSubmitting ? <LogoSpinner size={18} /> : <Check aria-hidden />}
                {isSubmitting ? copy.checkin.saving : copy.checkin.finish}
              </Button>
            ) : (
              <Button size="lg" onClick={() => go(index + 1)} disabled={!answered}>
                {copy.checkin.next}<ArrowRight className="rtl:-scale-x-100" aria-hidden />
              </Button>
            )}
          </div>
        </div>
        {last && !touched.has("moodScore") && <p className="mt-3 text-end text-xs text-muted-foreground">{copy.checkin.q.mood.title}</p>}
      </section>

      <CompanionPanel plan={plan} mood={mood}>
        <ol className="space-y-1.5" aria-label={copy.checkin.companion.path}>
          {items.map((entry, position) => {
            const Icon = STEP_ICON[entry.key];
            const value = answers[entry.field];
            const done = touched.has(entry.field);
            const current = position === index;
            const reachable = done || position <= index;
            const label = entry.key === "medication" ? copy.settings.privacy.categories.medication : copy.dimensions[entry.key];
            return (
              <li key={entry.key}>
                <button
                  type="button"
                  onClick={() => reachable && go(position)}
                  disabled={!reachable}
                  aria-current={current ? "step" : undefined}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-start text-sm transition-colors focus-visible:outline-2 focus-visible:outline-teal-500 disabled:cursor-default",
                    current ? "bg-white/85 shadow-xs" : reachable && "hover:bg-white/50",
                  )}
                >
                  <span className={cn("flex size-7 shrink-0 items-center justify-center rounded-full border", done ? "border-teal-200 bg-teal-100 text-teal-700" : current ? "border-transparent bg-teal-600 text-white" : "border-line-strong bg-white/60 text-ink-subtle")}>
                    {done && !current ? <Check className="size-3.5" aria-hidden /> : <Icon className="size-3.5" aria-hidden />}
                  </span>
                  <span className={cn("min-w-0 flex-1 truncate", current ? "font-semibold text-ink" : "text-ink-soft")}>{label}</span>
                  <span className="shrink-0 text-xs tabular-nums text-ink-muted">
                    {done && value !== undefined ? answerText(entry.key, value, copy) : current ? "" : copy.checkin.companion.upcoming}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </CompanionPanel>
    </MoodStage>
  );
}

function answerText(key: CheckinItemKey, value: number | boolean, copy: ReturnType<typeof usePatientCopy>): string {
  if (typeof value === "boolean") return value ? copy.checkin.q.medication.yes : copy.checkin.q.medication.no;
  if (key === "mood") return moodFor(value)?.emoji ?? String(value);
  if (key === "sleep") return `${value}${copy.checkin.q.sleep.unit}`;
  return `${value}/10`;
}

/**
 * The side of the check-in where Lumina keeps the patient company: a line that follows the
 * mood they chose, the path through today's questions, and why the minute is worth it.
 */
function CompanionPanel({ plan, mood, children }: { plan: CheckinPlan; mood: MoodLevel | null; children?: ReactNode }) {
  const copy = usePatientCopy();
  const c = copy.checkin.companion;
  const intro = plan.adaptations[0] ?? "DEFAULT";
  const line = mood ? copy.moods.levels[mood.level - 1].lumina : fill(copy.checkin.intro[intro as keyof typeof copy.checkin.intro] ?? copy.checkin.intro.DEFAULT, { n: plan.streak });
  return (
    <aside aria-label={c.title} className="flex flex-col gap-5 border-t border-white/70 bg-white/35 p-5 sm:p-6 lg:border-s lg:border-t-0">
      <div className="flex items-center gap-3">
        <LuminaLogo size={44} presence />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-ink">{c.title}</p>
          {mood && <p className="text-xs text-ink-muted">{copy.moods.label}: <span aria-hidden>{mood.emoji}</span> {copy.moods.levels[mood.level - 1].name}</p>}
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.p key={line} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="lm-bubble-lumina px-4 py-3 text-sm leading-relaxed text-ink" dir="auto">
          {line}
        </motion.p>
      </AnimatePresence>
      {children && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted rtl:tracking-normal">{c.path}</p>
          {children}
        </div>
      )}
      <div className="mt-auto">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted rtl:tracking-normal">{c.valueTitle}</p>
        <ul className="space-y-2">
          {c.value.map((text, index) => {
            const Icon = VALUE_ICONS[index] ?? Sparkles;
            return (
              <li key={text} className="flex items-start gap-2.5 text-xs leading-relaxed text-ink-soft">
                <Icon className="mt-0.5 size-3.5 shrink-0 text-teal-600" aria-hidden />{text}
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}

/**
 * Before the first question: what today's check-in covers, how long it takes and why it is worth
 * doing. The list is the backend's plan for this patient, so it never promises a question that
 * will not be asked.
 */
function StartCard({ plan, onBegin }: { plan: CheckinPlan; onBegin: () => void }) {
  const copy = usePatientCopy();
  const s = copy.checkin.start;
  return (
    <MoodStage mood={null} className="grid lg:grid-cols-[minmax(0,1fr)_21rem]">
      <section className="flex flex-col gap-7 p-6 sm:p-10" aria-labelledby="checkin-start-title">
        <LuminaLogo size={84} presence float glow />
        <div>
          <h2 id="checkin-start-title" className="text-[clamp(1.625rem,1.2rem+1.4vw,2.25rem)] font-semibold leading-tight tracking-tight text-ink">{s.title}</h2>
          <p className="mt-2 text-sm font-medium text-teal-800">{fill(s.duration, { n: plan.items.length })}</p>
        </div>

        <div>
          <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-ink-muted rtl:tracking-normal">{s.covers}</p>
          <ul className="flex flex-wrap gap-2">
            {plan.items.map((entry, position) => {
              const Icon = STEP_ICON[entry.key];
              return (
                <motion.li
                  key={entry.key}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + position * 0.05 }}
                  className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/75 px-3.5 py-2 text-sm font-medium text-ink shadow-xs"
                >
                  <Icon className="size-4 text-teal-700" aria-hidden />
                  {entry.key === "medication" ? copy.settings.privacy.categories.medication : copy.dimensions[entry.key]}
                </motion.li>
              );
            })}
          </ul>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button size="lg" onClick={onBegin}>{s.begin}<ArrowRight className="rtl:-scale-x-100" aria-hidden /></Button>
          {plan.streak >= 2 && <span className="chip chip-pending"><Flame className="size-3" aria-hidden />{fill(s.streak, { n: plan.streak })}</span>}
        </div>
      </section>
      <CompanionPanel plan={plan} mood={null} />
    </MoodStage>
  );
}

/** Already checked in: today's mood (changeable in one tap), Lumina's note and the way onward. */
function AlreadyDone({ plan, onEdit }: { plan: CheckinPlan; onEdit: () => void }) {
  const copy = usePatientCopy();
  const c = copy.checkin.companion;
  const { submit, isSubmitting, error } = useSubmitCheckin();
  const savedScore = plan.prefill?.moodScore ?? null;
  const [score, setScore] = useState<number | null>(savedScore);
  const [justSaved, setJustSaved] = useState(false);
  const mood = moodFor(score);
  const changed = score !== null && score !== savedScore;
  const message = plan.prefill?.luminaMessage;

  async function saveMood() {
    if (score === null) return;
    // Today's other answers stay as they were; only the mood changes.
    const payload: Record<string, number | boolean> = {};
    for (const entry of plan.items) {
      const value = plan.prefill?.[entry.field];
      if (value !== null && value !== undefined) payload[entry.field] = value;
    }
    payload.moodScore = score;
    const saved = await submit(payload as unknown as CheckinInput);
    if (saved) setJustSaved(true);
  }

  return (
    <MoodStage mood={mood} className="grid lg:grid-cols-[minmax(0,1fr)_21rem]">
      <section className="flex flex-col gap-6 p-6 sm:p-10">
        <div className="flex items-start gap-4">
          <span className="stat-tile stat-tile-sage size-12 shrink-0"><Check className="size-5" aria-hidden /></span>
          <div>
            <h2 className="text-2xl font-semibold leading-tight text-ink">{copy.checkin.alreadyTitle}</h2>
            <p className="mt-1 text-sm text-ink-soft">{copy.checkin.alreadyBody}</p>
          </div>
        </div>

        <div className="rounded-3xl border border-white/80 bg-white/55 p-5">
          <p className="mb-4 text-sm font-semibold text-ink">
            {c.alreadyMood}{mood && <> <span aria-hidden>{mood.emoji}</span> {copy.moods.levels[mood.level - 1].name.toLowerCase()}</>}
          </p>
          <MoodPicker value={score} onChange={(next) => { setScore(next); setJustSaved(false); }} labels={copy.checkin.moods} ariaLabel={copy.moods.changeLong} size="md" />
          <div className="mt-4 flex min-h-11 flex-wrap items-center justify-between gap-3">
            <p role="status" className="text-xs text-teal-800">{justSaved ? copy.moods.updated : error ? copy.checkin.error : ""}</p>
            {changed && !justSaved && (
              <Button onClick={() => void saveMood()} disabled={isSubmitting}>
                {isSubmitting ? <LogoSpinner size={18} /> : <HeartPulse aria-hidden />}{c.saveMood}
              </Button>
            )}
          </div>
        </div>

        {message && (
          <div className="flex items-start gap-3">
            <LuminaLogo size={40} />
            <div className="lm-bubble-lumina min-w-0 flex-1 px-4 py-3 text-sm leading-relaxed" dir="auto">
              <p className="mb-1 text-[0.6875rem] font-semibold uppercase tracking-wide text-teal-700 rtl:tracking-normal">{copy.checkin.result.luminaSays}</p>
              <p className="whitespace-pre-wrap">{message}</p>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Button asChild><Link href="/dashboard/lumina"><MessageCircle aria-hidden />{copy.checkin.result.talk}</Link></Button>
          <Button variant="outline" onClick={onEdit}><PencilLine aria-hidden />{copy.checkin.edit}</Button>
        </div>
      </section>
      <CompanionPanel plan={plan} mood={mood} />
    </MoodStage>
  );
}

function CheckinResultView({ result, plan, answers }: { result: CheckinResult; plan: CheckinPlan; answers: Answers }) {
  const copy = usePatientCopy();
  const mood = moodFor(result.checkin.moodScore);
  const streak = plan.alreadyCheckedIn ? plan.streak : plan.streak + 1;
  const crisis = result.lumina.safetyLevel === "CRISIS";

  return (
    <MoodStage mood={mood} className="grid lg:grid-cols-[minmax(0,1fr)_21rem]">
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: EASE_OUT }} className="flex flex-col gap-6 p-6 sm:p-10">
        <div className="flex flex-col items-start gap-3">
          <span className="text-6xl leading-none" aria-hidden>{mood?.emoji}</span>
          <h2 className="text-[clamp(1.625rem,1.2rem+1.4vw,2.25rem)] font-semibold leading-tight tracking-tight text-ink">{copy.checkin.result.title}</h2>
          {streak >= 2 && <span className="chip chip-pending"><Flame className="size-3" aria-hidden />{fill(copy.checkin.result.streak, { n: streak })}</span>}
        </div>

        {crisis && (
          <div role="alert" className="flex items-start gap-3 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3.5 text-sm text-rose-700">
            <ShieldAlert className="mt-0.5 size-4 shrink-0" aria-hidden />{copy.checkin.result.crisis}
          </div>
        )}

        <div className="flex items-start gap-3">
          <LuminaLogo size={44} />
          <div className="min-w-0 flex-1">
            <p className="mb-1.5 text-[0.6875rem] font-semibold uppercase tracking-wide text-teal-700 rtl:tracking-normal">{copy.checkin.result.luminaSays}</p>
            {result.lumina.status === "OK" && result.lumina.message ? (
              <div className="lm-bubble-lumina px-4 py-3 text-[0.9375rem] leading-relaxed text-ink" dir="auto">
                <p className="whitespace-pre-wrap">{result.lumina.message}</p>
              </div>
            ) : (
              <p className="rounded-2xl bg-gold-50 px-4 py-3 text-sm text-gold-700">{copy.checkin.result.unavailable}</p>
            )}
          </div>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-ink">{copy.checkin.result.snapshot}</p>
          <div className="flex flex-wrap gap-2">
            {plan.items.map((entry) => {
              const value = answers[entry.field];
              if (value === undefined || entry.key === "mood") return null;
              const label = entry.key === "medication" ? copy.settings.privacy.categories.medication : copy.dimensions[entry.key];
              return <span key={entry.key} className="chip">{label}: {answerText(entry.key, value, copy)}</span>;
            })}
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Button asChild size="lg"><Link href="/dashboard/lumina"><MessageCircle aria-hidden />{copy.checkin.result.talk}</Link></Button>
          <Button asChild size="lg" variant="outline"><Link href="/dashboard/journal"><BookOpen aria-hidden />{copy.checkin.result.journal}</Link></Button>
          <Button asChild size="lg" variant="ghost"><Link href="/dashboard">{copy.checkin.result.home}</Link></Button>
        </div>
      </motion.section>
      <CompanionPanel plan={plan} mood={mood} />
    </MoodStage>
  );
}
