"use client";

import { pad } from "@/components/home/accents";
import { DISPLAY_S, LABEL } from "@/components/home/typography";
import { useLanguage } from "@/contexts/LanguageContext";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

type Step = readonly [title: string, line: string];

/**
 * The walk-through for small screens: one segment per step that fills while the step plays (like a story), the step's
 * name and line beneath, arrows for a mouse and a swipe for a thumb. Picking a step is handled by the page, which also
 * owns the timer: the fill here is only the picture of it, so it can sit beside a desktop layout without a second clock.
 */
export function StepStories({
  steps,
  active,
  playing,
  seconds,
  stepLabel,
  tone = "light",
  counted = true,
  onSelect,
  className,
}: {
  /** Show "Step 02 / 04". Off: the current step's name stands in its place. */
  counted?: boolean;
  steps: readonly Step[];
  active: number;
  /** The tour is advancing by itself: the current segment fills over `seconds`. */
  playing: boolean;
  seconds: number;
  stepLabel: string;
  tone?: "light" | "dark";
  onSelect: (index: number) => void;
  className?: string;
}) {
  const dark = tone === "dark";
  const reduce = useReducedMotion();
  const total = steps.length;
  const go = (delta: number) => onSelect((active + delta + total) % total);

  return (
    <div className={cn("w-full", className)}>
      <ol className="flex gap-1.5" aria-label={stepLabel}>
        {steps.map(([name], index) => {
          const current = index === active;
          const filling = current && playing && !reduce;
          return (
            <li key={name} className="min-w-0 flex-1">
              <button
                type="button"
                onClick={() => onSelect(index)}
                aria-label={`${stepLabel} ${index + 1}: ${name}`}
                aria-current={current ? "step" : undefined}
                className={cn(
                  "group flex h-10 w-full cursor-pointer items-center rounded-md outline-none focus-visible:outline-2 focus-visible:outline-offset-2",
                  dark ? "focus-visible:outline-gold-300" : "focus-visible:outline-teal-500",
                )}
              >
                <span className={cn("relative block h-[3px] w-full overflow-hidden rounded-full transition-[height] duration-300 group-hover:h-1", dark ? "bg-white/20" : "bg-line-strong")}>
                  <motion.span
                    key={`${index}-${active}-${filling}`}
                    className={cn("absolute inset-0 origin-left rounded-full rtl:origin-right", dark ? "bg-gold-300" : "bg-gold")}
                    initial={filling ? { scaleX: 0 } : false}
                    animate={{ scaleX: index < active || current ? 1 : 0 }}
                    transition={filling ? { duration: seconds, ease: "linear" } : { duration: 0.35, ease: EASE_OUT }}
                  />
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="mt-3 flex items-center justify-between gap-3">
        <p className={cn(LABEL, "flex items-center gap-2.5", dark ? "text-teal-200" : "text-teal-700")}>
          <span aria-hidden className={cn("h-px w-6", dark ? "bg-gold-300" : "bg-gold")} />
          {counted ? (
            <>
              {stepLabel}
              <span dir="ltr" className="font-mono tabular-nums">
                {pad(active + 1)} / {pad(total)}
              </span>
            </>
          ) : (
            steps[active][0]
          )}
        </p>
        <div className="flex gap-2">
          {[-1, 1].map((delta) => (
            <button
              key={delta}
              type="button"
              onClick={() => go(delta)}
              aria-label={`${stepLabel} ${((active + delta + total) % total) + 1}`}
              className={cn(
                "flex size-10 cursor-pointer items-center justify-center rounded-full border outline-none transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2",
                dark
                  ? "border-white/25 text-white hover:bg-white/10 focus-visible:outline-gold-300"
                  : "border-line-strong bg-white text-ink hover:border-teal-300 hover:text-teal-800 focus-visible:outline-teal-500",
              )}
            >
              {delta < 0 ? <ChevronLeft className="size-4 rtl:-scale-x-100" aria-hidden /> : <ChevronRight className="size-4 rtl:-scale-x-100" aria-hidden />}
            </button>
          ))}
        </div>
      </div>

      {/* Every step's text shares one grid cell, so the block is as tall as the longest and nothing below it jumps. */}
      <div aria-live="polite" className="mt-4 grid">
        {steps.map(([name, text], index) => {
          const current = index === active;
          return (
            <motion.div
              key={name}
              aria-hidden={!current}
              className={cn("col-start-1 row-start-1", !current && "pointer-events-none select-none")}
              initial={false}
              animate={{ opacity: current ? 1 : 0, y: current || reduce ? 0 : 10 }}
              transition={{ duration: current ? 0.45 : 0.2, delay: current ? 0.12 : 0, ease: EASE_OUT }}
            >
              <h3 className={cn(DISPLAY_S, dark ? "text-white" : "text-ink")}>{name}</h3>
              <p className={cn("mt-2 text-[1.0625rem] leading-7", dark ? "text-teal-100" : "text-ink-soft")}>{text}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * A swipe on a thumb moves the tour one step, in the reading direction of the language. Vertical drags still scroll the
 * page (`touch-pan-y`), and only a clearly horizontal gesture counts.
 */
export function SwipeArea({ onStep, children, className }: { onStep: (delta: 1 | -1) => void; children: ReactNode; className?: string }) {
  const { direction } = useLanguage();
  const sign = direction === "rtl" ? -1 : 1;

  return (
    <motion.div
      className={cn("touch-pan-y", className)}
      onPanEnd={(_, info) => {
        const { x, y } = info.offset;
        if (Math.abs(x) < 48 || Math.abs(x) < Math.abs(y) * 1.2) return;
        onStep(x * sign < 0 ? 1 : -1);
      }}
    >
      {children}
    </motion.div>
  );
}
