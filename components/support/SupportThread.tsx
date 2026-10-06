"use client";

import { LABEL } from "@/components/home/typography";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { Clock } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type ThreadCopy = { you: string; question: string; team: string; reply: string; eta: string };

/** question → the team is reflecting → the reply and its deadline; then a pause and again. Only while on screen. */
const STEP_MS = [2200, 1800, 4200] as const;

/**
 * A small conversation that plays on the support page: a person asks something, the care-support team answers, and a ring
 * draws round the promised delay. It shows what writing to the team is like before anyone types. The question is one the
 * product can answer truthfully (consent over the journal). Under reduced motion it rests on the finished exchange.
 */
export function SupportThread({ copy, className }: { copy: ThreadCopy; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const visible = useInView(ref, { margin: "-10% 0px -10% 0px" });
  const [step, setStep] = useState(0);
  // The question arrives again at the start of every round, not on the way to the reply.
  const [round, setRound] = useState(0);

  useEffect(() => {
    if (reduce || !visible) return;
    const timer = window.setTimeout(() => {
      if (step === STEP_MS.length - 1) setRound((value) => value + 1);
      setStep((value) => (value + 1) % STEP_MS.length);
    }, STEP_MS[step]);
    return () => window.clearTimeout(timer);
  }, [reduce, visible, step]);

  const shown = reduce ? 2 : step;

  return (
    <div ref={ref} aria-hidden className={cn("rounded-panel border border-line bg-white p-5 shadow-card sm:p-6", className)}>
      <div className="grid min-h-[12.5rem] content-start gap-3.5">
        <motion.div
          key={round}
          initial={reduce ? false : { opacity: 0, y: 12, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
          className="max-w-[88%] self-end justify-self-end"
        >
          <p className={cn(LABEL, "mb-1.5 text-end text-[0.625rem] text-ink-muted")}>{copy.you}</p>
          <p className="rounded-2xl rounded-ee-md bg-teal-600 px-4 py-3 text-[0.9375rem] leading-6 text-white">{copy.question}</p>
        </motion.div>

        <div className="min-h-[6.5rem] max-w-[92%]">
          <AnimatePresence mode="wait" initial={false}>
            {shown === 1 ? (
              <motion.div key="typing" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="inline-flex gap-1.5 rounded-full bg-canvas px-4 py-3 ring-1 ring-line">
                {[0, 1, 2].map((dot) => (
                  <motion.span key={dot} className="size-1.5 rounded-full bg-teal-400" animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }} transition={{ duration: 0.9, delay: dot * 0.15, repeat: Infinity }} />
                ))}
              </motion.div>
            ) : null}
            {shown === 2 ? (
              <motion.div key="reply" initial={reduce ? false : { opacity: 0, y: 12, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: EASE_OUT }}>
                <p className={cn(LABEL, "mb-1.5 text-[0.625rem] text-teal-700")}>{copy.team}</p>
                <p className="rounded-2xl rounded-es-md bg-canvas px-4 py-3 text-[0.9375rem] leading-6 text-ink ring-1 ring-line">{copy.reply}</p>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3 border-t border-line pt-4">
        <span className="relative flex size-9 shrink-0 items-center justify-center rounded-full bg-gold-50 text-gold-700">
          <svg viewBox="0 0 36 36" className="absolute inset-0 size-full -rotate-90 rtl:rotate-90 rtl:-scale-x-100">
            <circle cx="18" cy="18" r="16" fill="none" className="stroke-gold-100" strokeWidth="2" />
            <motion.circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              className="stroke-gold-600"
              strokeWidth="2"
              strokeLinecap="round"
              initial={false}
              animate={{ pathLength: shown === 2 ? 1 : 0.04 }}
              transition={{ duration: shown === 2 ? 3.4 : 0.4, ease: "linear" }}
            />
          </svg>
          <Clock className="size-4" strokeWidth={1.75} />
        </span>
        <p className="text-[0.875rem] font-medium text-ink-soft">{copy.eta}</p>
      </div>
    </div>
  );
}
