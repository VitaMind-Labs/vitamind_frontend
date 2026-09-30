"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Plus, Zap } from "lucide-react";
import { useTaskWhen } from "@/components/patient/spark/useTaskWhen";
import { ErrorState, GlassCard, Skeleton } from "@/components/patient/ui/primitives";
import { Button } from "@/components/ui/button";
import { useSparkTasks } from "@/hooks/patient/useSpark";
import { invalidatePatientData } from "@/hooks/usePatientResource";
import { usePatientCopy } from "@/hooks/usePatientCopy";
import { sparkApi } from "@/lib/api/patient";
import { fill } from "@/lib/i18n/patient";
import { localDay } from "@/lib/patient/format";
import { cn } from "@/lib/utils";

const SHOWN = 5;

/**
 * Home, ADHD track: Spark at its smallest. The open tasks Spark keeps (tick one off), a box to
 * hand Spark a new one, and a way into the full Spark chat. Mounted only for `hasSpark`
 * patients, so nobody else triggers a Spark request.
 */
export function SparkPanel() {
  const copy = usePatientCopy();
  const text = copy.spark;
  const tasks = useSparkTasks();
  const when = useTaskWhen();
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const [nextStep, setNextStep] = useState<string | null>(null);
  const [finishing, setFinishing] = useState<string[]>([]);
  const open = (tasks.data ?? []).filter((task) => !finishing.includes(task.id));

  const add = async (event: FormEvent) => {
    event.preventDefault();
    const value = draft.trim();
    if (!value || busy) return;
    setBusy(true);
    setFailed(false);
    try {
      const now = new Date();
      const reply = await sparkApi.chat({
        text: value,
        clientMessageId: crypto.randomUUID(),
        // The patient's own clock: "tomorrow" means their tomorrow.
        localDate: localDay(now),
        localTime: now.toTimeString().slice(0, 5),
      });
      setDraft("");
      setNextStep(reply.plan?.nextAction?.text ?? null);
      invalidatePatientData("spark:tasks");
      invalidatePatientData("spark:memories");
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  };

  const finish = async (id: string) => {
    setFinishing((current) => [...current, id]);
    try {
      await sparkApi.completeTask(id);
      invalidatePatientData("spark:tasks");
    } catch {
      setFinishing((current) => current.filter((item) => item !== id));
    }
  };

  return (
    <GlassCard as="aside" aria-labelledby="spark-panel-title" className="flex h-full flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="stat-tile size-11 shrink-0"><Zap className="size-5" aria-hidden /></span>
        <div className="min-w-0 flex-1">
          <h2 id="spark-panel-title" className="text-base font-semibold leading-tight text-ink">{text.panel.title}</h2>
          <p className="text-xs text-muted-foreground">{text.panel.subtitle}</p>
        </div>
        {open.length > 0 && <span className="chip shrink-0">{fill(text.panel.count, { n: tasks.data?.length ?? open.length })}</span>}
      </div>

      <form onSubmit={add} className="flex items-center gap-2 rounded-full border border-white/80 bg-white/80 p-1.5 ps-4 focus-within:border-teal-400">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={text.panel.placeholder}
          aria-label={text.panel.placeholder}
          maxLength={500}
          dir="auto"
          disabled={busy}
          className="min-w-0 flex-1 bg-transparent py-2 text-sm text-ink outline-none placeholder:text-muted-foreground"
        />
        <Button type="submit" size="icon" aria-label={text.panel.add} disabled={!draft.trim() || busy}>
          <Plus aria-hidden />
        </Button>
      </form>
      <p role="status" className={cn("-mt-2 text-xs", failed ? "text-rose-700" : "text-ink-muted", !busy && !failed && "sr-only")}>
        {failed ? text.panel.error : busy ? text.panel.adding : ""}
      </p>

      {nextStep && !busy && (
        <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-teal-50/80 px-3.5 py-2.5 text-sm text-teal-800" dir="auto">
          <span className="block text-[0.6875rem] font-semibold uppercase tracking-wide text-teal-700 rtl:tracking-normal">{text.panel.next}</span>
          {nextStep}
        </motion.p>
      )}

      <div className="flex-1">
        {tasks.isLoading ? (
          <div className="space-y-2.5" aria-hidden><Skeleton className="h-12" /><Skeleton className="h-12" /><Skeleton className="h-12" /></div>
        ) : tasks.error && !tasks.data ? (
          <ErrorState onRetry={() => void tasks.refresh()} />
        ) : open.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-teal-200 bg-white/50 px-3.5 py-4 text-sm text-ink-muted">{text.panel.empty}</p>
        ) : (
          <ul className="space-y-2">
            <AnimatePresence initial={false}>
              {open.slice(0, SHOWN).map((task) => (
                <motion.li
                  key={task.id}
                  layout
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-start gap-3 overflow-hidden rounded-2xl border border-white/80 bg-white/70 px-3 py-2.5"
                >
                  <button
                    type="button"
                    onClick={() => void finish(task.id)}
                    aria-label={fill(text.panel.done, { title: task.title })}
                    className="group mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-teal-300 text-transparent transition-colors hover:border-teal-600 hover:bg-teal-50 hover:text-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
                  >
                    <Check className="size-3.5" aria-hidden />
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium leading-snug text-ink first-letter:uppercase" dir="auto">{task.title}</p>
                    <p className="mt-0.5 text-xs text-ink-muted">{when(task)}{task.startTime ? ` · ${task.startTime.slice(0, 5)}` : ""}</p>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
        {open.length > SHOWN && <p className="mt-2.5 text-xs text-ink-muted">{fill(text.homeCard.more, { n: open.length - SHOWN })}</p>}
      </div>

      <Button asChild variant="default" size="lg" className="w-full">
        <Link href="/dashboard/spark">{text.panel.openSpark}<ArrowRight className="rtl:-scale-x-100" aria-hidden /></Link>
      </Button>
    </GlassCard>
  );
}
