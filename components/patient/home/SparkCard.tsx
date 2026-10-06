"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Pause, Play, RotateCcw, Zap } from "lucide-react";
import { GlassCard, SectionTitle } from "@/components/patient/ui/primitives";
import { Button } from "@/components/ui/button";
import { usePatient } from "@/hooks/patient/usePatient";
import { usePatientCopy } from "@/hooks/usePatientCopy";
import { fill } from "@/lib/i18n/patient";
import { sparkActions, splitIntoSteps, useSpark } from "@/lib/patient/spark";
import { cn } from "@/lib/utils";

const LENGTHS = [5, 10, 25] as const;
const RADIUS = 44;
const CIRC = 2 * Math.PI * RADIUS;

/** A round focus timer: pick 5, 10 or 25 minutes; a finished round is counted for today. */
function FocusTimer() {
  const copy = usePatientCopy().home.spark;
  const spark = useSpark();
  const reduce = useReducedMotion();
  const [minutes, setMinutes] = useState<(typeof LENGTHS)[number]>(10);
  const [left, setLeft] = useState(minutes * 60);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const endAt = useRef(0);

  // The clock is the source of truth (not the tick count), so a throttled background tab still ends on time.
  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      const remaining = Math.max(0, Math.ceil((endAt.current - Date.now()) / 1000));
      setLeft(remaining);
      if (remaining === 0) {
        window.clearInterval(timer);
        setRunning(false);
        setFinished(true);
        sparkActions.focusDone(minutes);
      }
    }, 250);
    return () => window.clearInterval(timer);
  }, [running, minutes]);

  const choose = (value: (typeof LENGTHS)[number]) => {
    setMinutes(value);
    setLeft(value * 60);
    setRunning(false);
    setFinished(false);
  };
  const toggle = () => {
    setFinished(false);
    if (running) {
      setRunning(false);
      return;
    }
    const start = left === 0 ? minutes * 60 : left;
    setLeft(start);
    endAt.current = Date.now() + start * 1000;
    setRunning(true);
  };
  const progress = 1 - left / (minutes * 60);
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");

  return (
    <div className="lm-soft flex flex-col items-center gap-4 p-4 sm:flex-row sm:gap-5">
      <div className="relative size-28 shrink-0" role="timer" aria-label={`${mm}:${ss}`}>
        <svg viewBox="0 0 100 100" className="size-full -rotate-90" aria-hidden>
          <circle cx="50" cy="50" r={RADIUS} fill="none" stroke="var(--color-teal-100)" strokeWidth="6" />
          <circle
            cx="50" cy="50" r={RADIUS} fill="none" stroke="var(--color-teal-600)" strokeWidth="6" strokeLinecap="round"
            strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - progress)} style={{ transition: reduce ? "none" : "stroke-dashoffset 1s linear" }}
          />
        </svg>
        <span className="absolute inset-0 flex flex-col items-center justify-center gap-1">
          <span className="text-2xl font-semibold tabular-nums text-ink" dir="ltr">{mm}:{ss}</span>
          {running && <span className="size-1.5 animate-pulse rounded-full bg-teal-500" aria-hidden />}
        </span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col items-center gap-3 sm:items-start">
        <div className="flex flex-wrap justify-center gap-1.5 sm:justify-start" role="group" aria-label={copy.focus}>
          {LENGTHS.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => choose(value)}
              aria-pressed={minutes === value}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
                minutes === value ? "border-teal-600 bg-teal-600 text-white" : "border-line-strong bg-white/60 text-ink-soft hover:bg-white",
              )}
            >
              {fill(copy.minutes, { n: value })}
            </button>
          ))}
        </div>
        <p className="text-center text-xs text-muted-foreground sm:text-start" aria-live="polite">
          {finished ? copy.finished : running ? copy.running : spark && spark.focusRuns ? fill(copy.today, { n: spark.focusRuns, m: spark.focusMinutes }) : copy.none}
        </p>
        <div className="flex gap-2">
          <Button size="sm" onClick={toggle}>
            {running ? <Pause aria-hidden /> : <Play aria-hidden />}{running ? copy.pause : copy.start}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => choose(minutes)}><RotateCcw aria-hidden />{copy.reset}</Button>
        </div>
      </div>
    </div>
  );
}

/**
 * Spark — shown to ADHD patients only: write one thing, get tiny steps to tick off, and a short
 * focus timer. Everything stays on this device and resets each day.
 */
export function SparkCard() {
  const copy = usePatientCopy().home.spark;
  const { profile } = usePatient();
  const spark = useSpark();
  const reduce = useReducedMotion();
  const [draft, setDraft] = useState("");

  if (profile.track !== "ADHD") return null;

  const steps = spark?.steps ?? [];
  const done = steps.filter((step) => step.done).length;
  const allDone = steps.length > 0 && done === steps.length;

  const submit = () => {
    const pieces = splitIntoSteps(draft, copy.template as unknown as readonly [string, string, string]);
    if (!pieces.length) return;
    sparkActions.plan(draft, pieces);
    setDraft("");
  };

  return (
    <GlassCard aria-labelledby="spark-title" className="relative overflow-hidden">
      <span aria-hidden className="pointer-events-none absolute -end-16 -top-16 size-48 rounded-full bg-gold-100/70 blur-3xl" />
      <div className="relative">
        <SectionTitle
          title={copy.title}
          subtitle={copy.subtitle}
          action={<span className="chip shrink-0"><Zap className="size-3" aria-hidden />{copy.badge}</span>}
        />
        <h2 id="spark-title" className="sr-only">{copy.title}</h2>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-start lg:gap-6">
        {steps.length === 0 ? (
          <form onSubmit={(event) => { event.preventDefault(); submit(); }} className="space-y-3">
            <label htmlFor="spark-task" className="block text-sm font-medium text-ink">{copy.ask}</label>
            <textarea
              id="spark-task" rows={2} maxLength={140} value={draft} onChange={(event) => setDraft(event.target.value)}
              placeholder={copy.placeholder}
              className="lm-inset block w-full resize-none px-4 py-3 text-sm text-ink outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-teal-500"
            />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="min-w-0 flex-1 basis-48 text-xs text-muted-foreground">{copy.hint}</p>
              <Button type="submit" disabled={!draft.trim()}><Zap aria-hidden />{copy.plan}</Button>
            </div>
          </form>
        ) : (
          <div className="space-y-3">
            <div>
              <div className="mb-1.5 flex items-baseline justify-between gap-3 text-xs text-muted-foreground">
                <span className="min-w-0 truncate font-semibold text-ink">{spark?.task}</span>
                <span className="shrink-0">{fill(copy.progress, { a: done, b: steps.length })}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-teal-100" role="progressbar" aria-valuemin={0} aria-valuemax={steps.length} aria-valuenow={done}>
                <motion.div className="h-full rounded-full bg-teal-600" initial={false} animate={{ width: `${(done / steps.length) * 100}%` }} transition={{ duration: reduce ? 0 : 0.5 }} />
              </div>
            </div>
            <ul className="space-y-2">
              {steps.map((step) => (
                <li key={step.id}>
                  <button
                    type="button" onClick={() => sparkActions.toggle(step.id)} aria-pressed={step.done}
                    className="lm-inset flex w-full items-center gap-3 px-3.5 py-3 text-start"
                  >
                    <span className={cn("flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors", step.done ? "border-sage-700 bg-sage-700 text-white" : "border-teal-300 bg-white")}>
                      <AnimatePresence initial={false}>
                        {step.done && <motion.span key="c" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><Check className="size-3.5" aria-hidden /></motion.span>}
                      </AnimatePresence>
                    </span>
                    <span className={cn("min-w-0 flex-1 text-sm leading-snug transition-colors", step.done ? "text-muted-foreground line-through" : "text-ink")}>{step.text}</span>
                  </button>
                </li>
              ))}
            </ul>
            {allDone && <p className="rounded-xl bg-sage-100 px-4 py-3 text-sm font-medium text-sage-700" role="status">{copy.allDone}</p>}
            <div className="flex justify-end">
              <Button variant="ghost" size="sm" onClick={() => sparkActions.reset()}><RotateCcw aria-hidden />{allDone ? copy.another : copy.restart}</Button>
            </div>
          </div>
        )}

        <FocusTimer />
        </div>
      </div>
    </GlassCard>
  );
}
