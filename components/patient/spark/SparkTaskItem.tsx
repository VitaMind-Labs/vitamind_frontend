"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, ChevronDown, Clock, CornerDownRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePatientCopy } from "@/hooks/usePatientCopy";
import type { SparkTask } from "@/lib/api/patient-types";
import { fill } from "@/lib/i18n/patient";
import { cn } from "@/lib/utils";

type Actions = {
  onFinish: (id: string) => void;
  onDefer: (id: string) => void;
  onRemove: (id: string) => void;
  onTick: (id: string, index: number, done: boolean) => void;
};

/** The sentence for where a task sits: the engine's own words when it planned just now, else the saved reason code. */
export function useReasonText() {
  const copy = usePatientCopy().spark.reasons as Record<string, string>;
  return (task: Pick<SparkTask, "reason" | "reasonCode">) => task.reason ?? copy[task.reasonCode] ?? copy.default;
}

function Steps({ task, onTick }: { task: SparkTask; onTick: Actions["onTick"] }) {
  return (
    <ul className="mt-3 space-y-1.5">
      {task.steps.map((step, index) => (
        <li key={`${index}-${step.text}`}>
          <button
            type="button"
            onClick={() => onTick(task.id, index, !step.done)}
            aria-pressed={step.done}
            className="lm-inset flex w-full items-center gap-3 px-3 py-2.5 text-start"
          >
            <span className={cn("flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors", step.done ? "border-sage-700 bg-sage-700 text-white" : "border-teal-300 bg-white")}>
              {step.done && <Check className="size-3" aria-hidden />}
            </span>
            <span className={cn("min-w-0 flex-1 text-sm leading-snug", step.done ? "text-muted-foreground line-through" : "text-ink")}>{step.text}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

/**
 * One task. The "now" task is the big card (steps open, the reason visible); the rest are quiet rows that
 * open to their steps. Finishing is one tap; "Not today" moves it to later without any penalty wording.
 */
export function SparkTaskItem({ task, variant, busy, ...actions }: { task: SparkTask; variant: "now" | "row"; busy: boolean } & Actions) {
  const copy = usePatientCopy().spark;
  const reasonOf = useReasonText();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(variant === "now");
  const done = task.steps.filter((step) => step.done).length;
  const category = (copy.categories as Record<string, string>)[task.category] ?? task.category;
  const now = variant === "now";

  return (
    <motion.li
      layout={!reduce}
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduce ? undefined : { opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("list-none", now ? "lm-soft p-4 sm:p-5" : "lm-inset p-3.5 sm:p-4")}
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => actions.onFinish(task.id)}
          disabled={busy}
          aria-label={`${copy.actions.finish}: ${task.title}`}
          className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border-2 border-teal-300 bg-white text-transparent transition-colors hover:border-teal-600 hover:bg-teal-50 hover:text-teal-600 focus-visible:text-teal-600 disabled:opacity-60"
        >
          <Check className="size-4" aria-hidden />
        </button>
        <div className="min-w-0 flex-1">
          {now && <p className="lm-eyebrow mb-1">{copy.today.now}</p>}
          <p className={cn("font-medium leading-snug text-ink", now ? "text-lg" : "text-[0.9375rem]")}>{task.title}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Clock className="size-3" aria-hidden />{fill(copy.focus.minutes, { n: task.estimateMin })}</span>
            <span>{category}</span>
            {task.rounds > 1 && <span>{fill(copy.actions.round, { n: task.rounds, m: Math.round(task.estimateMin / task.rounds) })}</span>}
            {task.steps.length > 0 && <span>{fill(copy.actions.steps, { a: done, b: task.steps.length })}</span>}
          </div>
          <p className="mt-2 flex items-start gap-1.5 text-[0.8125rem] leading-snug text-ink-soft">
            <CornerDownRight className="mt-0.5 size-3.5 shrink-0 text-teal-600 rtl:-scale-x-100" aria-hidden />
            <span>{reasonOf(task)}</span>
          </p>
        </div>
        {task.steps.length > 0 && !now && (
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label={open ? copy.actions.hideSteps : copy.actions.showSteps}
            className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-white hover:text-ink"
          >
            <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} aria-hidden />
          </button>
        )}
      </div>

      <AnimatePresence initial={false}>
        {open && task.steps.length > 0 && (
          <motion.div initial={reduce ? false : { opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={reduce ? undefined : { opacity: 0, height: 0 }} className="overflow-hidden ps-10">
            <Steps task={task} onTick={actions.onTick} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className={cn("mt-3 flex flex-wrap items-center gap-2 ps-10", now && "mt-4")}>
        {now && (
          <Button size="sm" onClick={() => actions.onFinish(task.id)} disabled={busy}>
            <Check aria-hidden />{copy.actions.finish}
          </Button>
        )}
        <Button size="sm" variant="ghost" onClick={() => actions.onDefer(task.id)} disabled={busy}>{copy.actions.notToday}</Button>
        <Button size="sm" variant="ghost" onClick={() => actions.onRemove(task.id)} disabled={busy} aria-label={`${copy.actions.remove}: ${task.title}`}>
          <Trash2 aria-hidden /><span className="sr-only sm:not-sr-only">{copy.actions.remove}</span>
        </Button>
      </div>
    </motion.li>
  );
}
