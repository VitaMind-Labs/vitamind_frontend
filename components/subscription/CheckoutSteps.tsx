"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** Plan → Payment → Confirmation. `current` is 0-based; steps before it render as done. */
export function CheckoutSteps({ current, className }: { current: 0 | 1 | 2; className?: string }) {
  const { dictionary } = useLanguage();
  const steps = dictionary.subscription.steps;

  return (
    <nav aria-label={steps.join(" · ")} className={cn("mx-auto w-full max-w-xl", className)}>
      <ol className="flex items-center">
        {steps.map((label, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <li key={label} className={cn("flex items-center", i < steps.length - 1 && "flex-1")} aria-current={active ? "step" : undefined}>
              <span className="flex items-center gap-2.5">
                <motion.span
                  initial={false}
                  animate={{ scale: active ? 1.06 : 1 }}
                  transition={{ duration: 0.3, ease: EASE_OUT }}
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold tabular-nums transition-colors duration-300",
                    done && "border-primary bg-primary text-white",
                    active && "border-teal-500 bg-white text-teal-800 shadow-[0_0_0_4px_var(--color-teal-100)]",
                    !done && !active && "border-line-strong bg-white text-ink-subtle",
                  )}
                >
                  {done ? <Check className="h-4 w-4" strokeWidth={3} aria-hidden /> : i + 1}
                </motion.span>
                <span className={cn("hidden text-sm sm:inline", active ? "font-semibold text-ink" : done ? "text-ink-soft" : "text-ink-muted")}>{label}</span>
                <span className="sr-only sm:hidden">{label}</span>
              </span>
              {i < steps.length - 1 && (
                <span aria-hidden className="mx-3 h-0.5 flex-1 overflow-hidden rounded-full bg-line sm:mx-4">
                  <motion.span
                    className="block h-full origin-left rounded-full bg-teal-500 rtl:origin-right"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: done ? 1 : active ? 0.35 : 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: EASE_OUT }}
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
