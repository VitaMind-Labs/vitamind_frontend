"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { SERIF } from "@/components/home/typography";
import { useLanguage } from "@/contexts/LanguageContext";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** Plan → Payment → Confirmation. `current` is 0-based; steps before it render as done. */
export function CheckoutSteps({ current, className }: { current: 0 | 1 | 2; className?: string }) {
  const { dictionary } = useLanguage();
  const steps = dictionary.subscription.steps;

  return (
    <nav aria-label={steps.join(" · ")} className={cn("mx-auto w-full max-w-2xl", className)}>
      <ol className="flex items-center">
        {steps.map((label, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <li key={label} className={cn("flex items-center", i < steps.length - 1 && "flex-1")} aria-current={active ? "step" : undefined}>
              <span className="flex items-center gap-3">
                <motion.span
                  initial={false}
                  animate={{ scale: active ? 1.08 : 1 }}
                  transition={{ duration: 0.5, ease: EASE_OUT }}
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-full border text-[1.0625rem] tabular-nums transition-[background-color,border-color,color,box-shadow] duration-500 ease-out-soft",
                    SERIF,
                    done && "border-teal-800 bg-teal-800 text-white",
                    active && "border-teal-800 bg-white font-medium text-ink shadow-[0_0_0_5px_rgb(201_175_111/0.22)]",
                    !done && !active && "border-line-strong bg-white/80 text-ink-muted",
                  )}
                >
                  {done ? <Check className="size-4" strokeWidth={2.5} aria-hidden /> : i + 1}
                </motion.span>
                <span className={cn("hidden text-[0.9375rem] sm:inline", active ? "font-semibold text-ink" : "text-ink-soft")}>{label}</span>
                <span className="sr-only sm:hidden">{label}</span>
              </span>
              {i < steps.length - 1 && (
                <span aria-hidden className="mx-3 h-px flex-1 overflow-hidden bg-line-strong sm:mx-5">
                  <motion.span
                    className="block h-full origin-left bg-gold rtl:origin-right"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: done ? 1 : active ? 0.4 : 0 }}
                    transition={{ duration: 1, delay: 0.2, ease: EASE_OUT }}
                  />
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
