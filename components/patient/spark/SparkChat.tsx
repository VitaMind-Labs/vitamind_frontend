"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Check, CircleDashed, ShieldAlert, ShieldCheck, Target, Timer, X, Zap } from "lucide-react";
import {
  LuminaComposer, LuminaMessage, LuminaMotes, TrustRow, TypingRow,
} from "@/components/patient/chat/LuminaParts";
import { ErrorState, GlassCard, PageIntro, Skeleton, SubscriptionGate } from "@/components/patient/ui/primitives";
import { Button } from "@/components/ui/button";
import { AudioProvider } from "@/contexts/AudioContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePatient } from "@/hooks/patient/usePatient";
import { useSparkChat, type SparkMessage } from "@/hooks/patient/useSpark";
import { usePatientCopy } from "@/hooks/usePatientCopy";
import type { SparkOutcomeName, SparkTask } from "@/lib/api/patient-types";
import { fill } from "@/lib/i18n/patient";
import { formatDay, localDay } from "@/lib/patient/format";

const FRAME = "h-[calc(100dvh-12.5rem)] min-h-[34rem] lg:h-[calc(100dvh-7.75rem)]";
const COLUMN = "mx-auto w-full max-w-3xl";
const OUTCOMES: SparkOutcomeName[] = ["DONE", "PARTIAL", "TOO_HARD", "INTERRUPTED"];

/**
 * Spark, the ADHD assistant. It is Lumina's specialist, so it sits in the same reading pane and
 * uses the same message, composer and safety parts; the difference is the task list beside the
 * conversation and the small "next step" card under each plan. Everything shown is restored from
 * the backend - nothing lives in this component or in the agent.
 */
export function SparkChat() {
  return (
    <AudioProvider>
      <SparkScreen />
    </AudioProvider>
  );
}

function SparkScreen() {
  const copy = usePatientCopy();
  const { language } = useLanguage();
  const router = useRouter();
  const { refreshProfile } = usePatient();
  const chat = useSparkChat();
  const [draft, setDraft] = useState("");
  const bottom = useRef<HTMLDivElement>(null);
  const { messages, isLoading, isSending, notAllowed } = chat;

  // The backend refused Spark for this patient (their track is not ADHD): leave, and re-read the profile.
  useEffect(() => {
    if (!notAllowed) return;
    void refreshProfile();
    router.replace("/dashboard");
  }, [notAllowed, refreshProfile, router]);

  useLayoutEffect(() => {
    bottom.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [messages.length, isSending]);

  const rows = useMemo(
    () =>
      messages.map((message, index) => {
        const dayKey = localDay(new Date(message.createdAt));
        const previous = index > 0 ? localDay(new Date(messages[index - 1].createdAt)) : null;
        return { message, dayKey, showDay: dayKey !== previous };
      }),
    [messages],
  );

  function send(text = draft) {
    const value = text.trim();
    if (!value || isSending) return;
    setDraft("");
    void chat.send(value);
  }

  if (notAllowed) return null;
  if (chat.subscriptionRequired) return <SubscriptionGate />;

  const empty = !isLoading && messages.length === 0 && !chat.loadError;
  const latestPlanId = [...messages].reverse().find((message) => message.turn?.plan?.nextAction)?.id;

  return (
    <div className={`lm-rise flex flex-col ${FRAME}`}>
      <PageIntro className="mb-4" eyebrow={copy.shell.eyebrows.spark} icon={Zap} title={copy.spark.title} subtitle={copy.spark.subtitle} />

      <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <section aria-label={copy.spark.title} className="lm-sanctuary flex min-h-0 flex-col">
          <LuminaMotes />

          <div role="log" aria-live="polite" aria-label={copy.spark.title} tabIndex={0} className="diagnostic-scroll-area flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-teal-500">
            {chat.loadError && <div className={`${COLUMN} p-4`}><ErrorState onRetry={() => void chat.reload()} /></div>}

            {isLoading ? (
              <div className={`${COLUMN} space-y-6 px-4 py-8`} aria-hidden>
                <div className="flex gap-4"><Skeleton className="size-10 shrink-0 rounded-full" /><Skeleton className="h-24 w-3/4" /></div>
                <Skeleton className="ms-auto h-12 w-1/2" />
              </div>
            ) : empty ? (
              <Welcome disabled={isSending} onStart={(prompt) => send(prompt)} />
            ) : (
              <div className={`${COLUMN} space-y-7 px-4 py-6 sm:px-6 sm:py-8`}>
                {chat.hasMore && (
                  <div className="flex justify-center"><Button variant="ghost" size="sm" onClick={() => void chat.loadOlder()}>{copy.chat.older}</Button></div>
                )}
                {rows.map(({ message, dayKey, showDay }, index) => (
                  <div key={message.id} className="space-y-4">
                    {showDay && (
                      <p className="flex items-center gap-3 text-xs font-medium text-muted-foreground before:h-px before:flex-1 before:bg-ink/10 after:h-px after:flex-1 after:bg-ink/10">
                        {dayKey === localDay() ? copy.chat.today : formatDay(new Date(message.createdAt), language, { weekday: "short", month: "short", day: "numeric" })}
                      </p>
                    )}
                    <LuminaMessage message={message} index={index} onRetry={() => void chat.retry(message.id)} />
                    {message.id === latestPlanId && <PlanCard message={message} onOutcome={(outcome) => chat.recordOutcome(message.id, outcome)} />}
                  </div>
                ))}
                <AnimatePresence>{isSending && <TypingRow key="typing" />}</AnimatePresence>
                {chat.unavailable && <p role="status" className="text-sm text-ink-muted">{copy.spark.errors.unavailable}</p>}
                <div ref={bottom} />
              </div>
            )}
          </div>

          <AnimatePresence>
            {chat.support && (
              <motion.div role="alert" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className={`${COLUMN} overflow-hidden px-3 sm:px-6`}>
                <div className="flex items-start gap-3 rounded-2xl border border-rose-100 bg-rose-50/95 px-4 py-3.5">
                  <ShieldAlert className="mt-0.5 size-5 shrink-0 text-rose-700" aria-hidden />
                  <div className="min-w-0 flex-1 text-sm text-rose-700">
                    <p className="font-semibold">{copy.chat.crisisTitle}</p>
                    <p className="mt-0.5">{copy.chat.crisisBody}</p>
                    {chat.support.emergencyResources.length > 0 && (
                      <ul className="mt-1.5 list-inside list-disc" dir="auto">{chat.support.emergencyResources.map((resource) => <li key={resource}>{resource}</li>)}</ul>
                    )}
                  </div>
                  <button type="button" onClick={chat.dismissSupport} aria-label={copy.common.close} className="rounded-full p-1 text-rose-700 hover:bg-rose-100"><X className="size-4" aria-hidden /></button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className={`${COLUMN} px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 sm:px-6 sm:pb-5`}>
            <LuminaComposer value={draft} onChange={setDraft} onSend={() => send()} busy={isSending} placeholder={copy.spark.placeholder} hint={copy.spark.hint} />
            <p className="mt-2 px-2 text-[0.6875rem] leading-snug text-muted-foreground">{copy.spark.disclaimer}</p>
            <TrustRow />
          </div>
        </section>

        <TaskPanel tasks={chat.tasks} loading={isLoading} onComplete={(id) => void chat.completeTask(id)} />
      </div>
    </div>
  );
}

function Welcome({ onStart, disabled }: { onStart: (prompt: string) => void; disabled: boolean }) {
  const copy = usePatientCopy();
  return (
    <div className={`${COLUMN} flex flex-1 flex-col items-center justify-center px-4 py-10 text-center`}>
      <span className="mb-4 inline-flex size-14 items-center justify-center rounded-full bg-gold-50 text-gold-700"><Zap className="size-6" aria-hidden /></span>
      <h2 className="text-xl font-semibold text-ink">{copy.spark.welcome.title}</h2>
      <p className="mt-2 max-w-md text-sm text-ink-muted">{copy.spark.welcome.body}</p>
      <div className="mt-6 grid w-full max-w-xl gap-2 sm:grid-cols-2">
        {copy.spark.welcome.starters.map((prompt) => (
          <button
            key={prompt}
            type="button"
            disabled={disabled}
            onClick={() => onStart(prompt)}
            className="rounded-2xl border border-white/90 bg-white/70 px-4 py-3 text-start text-sm font-medium text-ink-soft shadow-soft transition-colors hover:bg-white hover:text-teal-800 focus-visible:outline-2 focus-visible:outline-teal-500 disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}

/** The next step Spark suggests, the focus block, and a one-tap "how did it go?". */
function PlanCard({ message, onOutcome }: { message: SparkMessage; onOutcome: (outcome: SparkOutcomeName) => Promise<void> }) {
  const copy = usePatientCopy();
  const [noted, setNoted] = useState(false);
  const plan = message.turn?.plan;
  const focus = message.turn?.focusSession;
  if (!plan?.nextAction) return null;

  return (
    <GlassCard className="ms-12 space-y-3 p-4 sm:ms-14">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-teal-800"><Target className="size-3.5" aria-hidden />{copy.spark.plan.nextStep}</p>
      <p className="text-[0.9375rem] font-medium text-ink" dir="auto">{plan.nextAction.text}</p>
      {focus && (
        <p className="flex items-start gap-2 text-sm text-ink-muted">
          <Timer className="mt-0.5 size-4 shrink-0 text-gold-700" aria-hidden />
          <span><span className="font-medium text-ink">{fill(copy.spark.plan.focus, { n: focus.minutes })}</span> — {copy.spark.plan.focusBasis}</span>
        </p>
      )}
      <div className="flex flex-wrap items-center gap-2 border-t border-ink/10 pt-3">
        {noted ? (
          <p role="status" className="flex items-center gap-1.5 text-sm text-teal-800"><Check className="size-4" aria-hidden />{copy.spark.plan.thanks}</p>
        ) : (
          <>
            <span className="text-xs font-medium text-ink-muted">{copy.spark.plan.howDidItGo}</span>
            {OUTCOMES.map((outcome) => (
              <button
                key={outcome}
                type="button"
                onClick={() => void onOutcome(outcome).then(() => setNoted(true), () => undefined)}
                className="rounded-full border border-line-strong bg-white/80 px-3 py-1 text-xs font-medium text-ink-soft transition-colors hover:border-teal-300 hover:text-teal-800 focus-visible:outline-2 focus-visible:outline-teal-500"
              >
                {copy.spark.plan.outcomes[outcome as "DONE" | "PARTIAL" | "TOO_HARD" | "INTERRUPTED"]}
              </button>
            ))}
          </>
        )}
      </div>
    </GlassCard>
  );
}

/** The patient's open tasks, straight from the database. */
function TaskPanel({ tasks, loading, onComplete }: { tasks: SparkTask[]; loading: boolean; onComplete: (id: string) => void }) {
  const copy = usePatientCopy();
  const { language } = useLanguage();
  const { today, tomorrow } = useMemo(() => {
    const now = new Date();
    const next = new Date(now);
    next.setDate(now.getDate() + 1);
    return { today: localDay(now), tomorrow: localDay(next) };
  }, []);

  function when(task: SparkTask) {
    const day = task.scheduledDate ?? task.deadline;
    if (!day) return copy.spark.tasks.noDate;
    if (day === today) return copy.spark.tasks.today;
    if (day === tomorrow) return copy.spark.tasks.tomorrow;
    return formatDay(day, language);
  }

  return (
    <aside aria-label={copy.spark.tasks.title} className="lm-glass flex min-h-0 flex-col rounded-3xl p-4 max-lg:max-h-72">
      <div className="mb-3 flex items-baseline justify-between gap-2">
        <h2 className="text-base font-semibold text-ink">{copy.spark.tasks.title}</h2>
        {!loading && tasks.length > 0 && <span className="text-xs text-ink-muted">{fill(copy.spark.tasks.openCount, { n: tasks.length })}</span>}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {loading ? (
          <div className="space-y-2" aria-hidden><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /></div>
        ) : tasks.length === 0 ? (
          <p className="flex items-start gap-2 text-sm text-ink-muted"><CircleDashed className="mt-0.5 size-4 shrink-0" aria-hidden />{copy.spark.tasks.empty}</p>
        ) : (
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li key={task.id} className="flex items-start gap-3 rounded-2xl border border-white/80 bg-white/60 px-3 py-2.5">
                <button
                  type="button"
                  onClick={() => onComplete(task.id)}
                  aria-label={fill(copy.spark.tasks.markDone, { title: task.title })}
                  className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full border-2 border-teal-500 text-transparent transition-colors hover:bg-teal-50 hover:text-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
                >
                  <Check className="size-3" aria-hidden />
                </button>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink" dir="auto">{task.title}</p>
                  <p className="mt-0.5 text-xs text-ink-muted">
                    {when(task)}{task.startTime ? ` · ${task.startTime.slice(0, 5)}` : ""}{task.postponedCount > 0 ? ` · ${fill(copy.spark.tasks.postponed, { n: task.postponedCount })}` : ""}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-[0.6875rem] text-ink-muted"><ShieldCheck className="size-3.5 shrink-0" aria-hidden />{copy.spark.memory}</p>
    </aside>
  );
}
