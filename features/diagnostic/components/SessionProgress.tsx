"use client";

import { motion } from "framer-motion";
import { Check, ShieldCheck } from "lucide-react";
import { copy, type Lang } from "@/lib/i18n/config";
import { fill } from "@/lib/i18n/format";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { MiraChapter } from "../types";

export const CHAPTER_ORDER: MiraChapter[] = ["MORNING", "MIDDAY", "EVENING", "INNER_VOICE"];
const ESTIMATED_QUESTIONS = 10;

type ProgressProps = {
  chapter: MiraChapter;
  progress: number;
  language: Lang;
  className?: string;
};

function useProgressModel({ chapter, progress, language }: ProgressProps) {
  const diagnostic = copy[language].diagnostic;
  const percent = Math.round(Math.max(0, Math.min(1, progress)) * 100);
  const activeIndex = chapter === "COMPLETE" ? CHAPTER_ORDER.length : CHAPTER_ORDER.indexOf(chapter);
  const chapterLabel = diagnostic.chapters[chapter as keyof typeof diagnostic.chapters] ?? chapter;
  const remaining = progress < 1 ? fill(diagnostic.remaining, { count: Math.max(0, ESTIMATED_QUESTIONS - Math.round(progress * ESTIMATED_QUESTIONS)) }) : "";
  return { diagnostic, percent, activeIndex, chapterLabel, remaining };
}

/** Circular progress, animated with the brand teal on a lighter step of the same ramp. */
function ProgressRing({ percent }: { percent: number }) {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  return (
    <svg viewBox="0 0 80 80" className="h-20 w-20 -rotate-90" aria-hidden>
      <circle cx="40" cy="40" r={radius} fill="none" stroke="var(--color-teal-100)" strokeWidth="6" />
      <motion.circle
        cx="40"
        cy="40"
        r={radius}
        fill="none"
        stroke="var(--color-teal-500)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={false}
        animate={{ strokeDashoffset: circumference * (1 - percent / 100) }}
        transition={{ duration: 0.8, ease: EASE_OUT }}
      />
    </svg>
  );
}

/** Desktop side rail: title, progress ring, vertical chapter stepper, privacy note. */
export function SessionRail(props: ProgressProps) {
  const { diagnostic, percent, activeIndex, chapterLabel, remaining } = useProgressModel(props);

  return (
    <aside className={cn("flex min-h-0 flex-col gap-5 overflow-y-auto pb-2", props.className)} aria-label={diagnostic.stepsTitle}>
      <div>
        <p className="home-eyebrow">{diagnostic.assessmentLabel}</p>
        <h1 className="mt-2 text-2xl font-medium leading-tight tracking-[-0.02em] text-ink">{diagnostic.title}</h1>
        <p className="mt-2 text-sm leading-6 text-ink-muted">{diagnostic.subtitle}</p>
      </div>

      <div className="surface-card p-5">
        <div
          className="flex items-center gap-4"
          role="progressbar"
          aria-label={diagnostic.progressLabel}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
        >
          <div className="relative shrink-0">
            <ProgressRing percent={percent} />
            <span className="absolute inset-0 flex items-center justify-center text-lg font-semibold tabular-nums text-ink">
              {percent}%
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-xs text-ink-muted">{diagnostic.chapterLabel}</p>
            <p className="truncate text-base font-semibold text-teal-800">{chapterLabel}</p>
            {remaining && <p className="mt-0.5 text-xs text-ink-muted">{remaining}</p>}
          </div>
        </div>

        <ol className="mt-5 border-t border-line pt-5" aria-label={diagnostic.chapterLabel}>
          {CHAPTER_ORDER.map((step, i) => {
            const done = i < activeIndex;
            const current = i === activeIndex;
            const last = i === CHAPTER_ORDER.length - 1;
            return (
              <li key={step} className="relative flex gap-3 pb-4 last:pb-0" aria-current={current ? "step" : undefined}>
                {!last && (
                  <span aria-hidden className="absolute start-[0.6875rem] top-6 bottom-0 w-px bg-line">
                    <motion.span
                      className="block w-full origin-top bg-teal-500"
                      initial={false}
                      animate={{ height: done ? "100%" : "0%" }}
                      transition={{ duration: 0.5, ease: EASE_OUT }}
                    />
                  </span>
                )}
                <span
                  aria-hidden
                  className={cn(
                    "relative z-10 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-300",
                    done && "border-primary bg-primary text-white",
                    current && "border-teal-500 bg-white shadow-[0_0_0_4px_var(--color-teal-100)]",
                    !done && !current && "border-line-strong bg-white",
                  )}
                >
                  {done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : current ? <span className="h-2 w-2 rounded-full bg-teal-500" /> : null}
                </span>
                <span className={cn("pt-0.5 text-sm", current ? "font-semibold text-ink" : done ? "text-ink-soft" : "text-ink-muted")}>
                  {diagnostic.chapters[step]}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="rounded-2xl border border-sage-100 bg-sage-50 p-4">
        <p className="flex items-start gap-2.5 text-[0.8125rem] leading-5 text-sage-700">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <span>{diagnostic.privateNote}</span>
        </p>
        <p className="mt-2 ps-[1.625rem] text-xs text-ink-muted">{diagnostic.questionsHint}</p>
      </div>
    </aside>
  );
}

/** Compact progress for tablet/mobile, shown above the conversation. */
export function CompactProgress(props: ProgressProps) {
  const { diagnostic, percent, chapterLabel, remaining } = useProgressModel(props);

  return (
    <div className={cn("rounded-2xl border border-line bg-white/90 px-4 py-3 shadow-xs", props.className)}>
      <div className="flex items-baseline justify-between gap-3">
        <h1 className="min-w-0 truncate text-sm text-ink-muted">
          <span className="sr-only">{diagnostic.title} — </span>
          {diagnostic.chapterLabel} <span className="font-semibold text-teal-800">{chapterLabel}</span>
        </h1>
        <span className="shrink-0 text-sm font-semibold tabular-nums text-ink">
          {remaining && <span className="me-2 hidden text-xs font-normal text-ink-muted sm:inline">{remaining}</span>}
          {percent}%
        </span>
      </div>
      <div
        role="progressbar"
        aria-label={diagnostic.progressLabel}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        className="mt-2.5 flex gap-1"
      >
        {CHAPTER_ORDER.map((step, i) => (
          <span key={step} className="h-1.5 flex-1 overflow-hidden rounded-full bg-teal-100" title={diagnostic.chapters[step]}>
            <motion.span
              className="block h-full origin-left rounded-full bg-teal-500 rtl:origin-right"
              initial={false}
              animate={{ scaleX: Math.max(0, Math.min(1, (percent / 100) * CHAPTER_ORDER.length - i)) }}
              transition={{ duration: 0.5, ease: EASE_OUT }}
            />
          </span>
        ))}
      </div>
    </div>
  );
}
