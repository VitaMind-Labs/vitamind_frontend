"use client";

import Link from "next/link";
import { ArrowRight, CircleDashed, Zap } from "lucide-react";
import { useTaskWhen } from "@/components/patient/spark/useTaskWhen";
import { ErrorState, GlassCard, SectionTitle, Skeleton } from "@/components/patient/ui/primitives";
import { useSparkTasks } from "@/hooks/patient/useSpark";
import { usePatientCopy } from "@/hooks/usePatientCopy";
import { fill } from "@/lib/i18n/patient";

const SHOWN = 4;

/**
 * Home, ADHD track only: the tasks Spark is keeping, nearest first as the backend orders them,
 * with a way into Spark. Mounted only for patients with `hasSpark`, so nobody else ever
 * triggers a Spark request (the API would refuse it anyway).
 */
export function SparkHomeCard() {
  const copy = usePatientCopy();
  const text = copy.spark;
  const tasks = useSparkTasks();
  const when = useTaskWhen();
  const open = tasks.data ?? [];

  return (
    <GlassCard aria-labelledby="spark-home-title">
      <SectionTitle
        title={text.tasks.title}
        subtitle={text.homeCard.subtitle}
        action={
          <Link href="/dashboard/spark" className="chip shrink-0 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500">
            <Zap className="size-3" aria-hidden />{text.homeCard.open}
          </Link>
        }
      />
      <h2 id="spark-home-title" className="sr-only">{text.tasks.title}</h2>
      {tasks.isLoading ? (
        <div className="space-y-2.5" aria-hidden><Skeleton className="h-12" /><Skeleton className="h-12" /></div>
      ) : tasks.error && !tasks.data ? (
        <ErrorState onRetry={() => void tasks.refresh()} />
      ) : open.length === 0 ? (
        <Link href="/dashboard/spark" className="flex items-start gap-2 rounded-2xl border border-dashed border-teal-200 bg-white/50 px-3.5 py-3 text-sm text-ink-muted hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500">
          <CircleDashed className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span className="flex-1">{text.homeCard.add}</span>
          <ArrowRight className="mt-0.5 size-4 shrink-0 rtl:rotate-180" aria-hidden />
        </Link>
      ) : (
        <>
          <ul className="space-y-2">
            {open.slice(0, SHOWN).map((task) => (
              <li key={task.id} className="flex items-start gap-3 rounded-2xl border border-white/80 bg-white/70 px-3.5 py-2.5">
                <span className="mt-1 size-2 shrink-0 rounded-full bg-teal-500" aria-hidden />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-ink first-letter:uppercase" dir="auto">{task.title}</p>
                  <p className="mt-0.5 text-xs text-ink-muted">{when(task)}{task.startTime ? ` · ${task.startTime.slice(0, 5)}` : ""}</p>
                </div>
              </li>
            ))}
          </ul>
          {open.length > SHOWN && <p className="mt-2.5 text-xs text-ink-muted">{fill(text.homeCard.more, { n: open.length - SHOWN })}</p>}
        </>
      )}
    </GlassCard>
  );
}
