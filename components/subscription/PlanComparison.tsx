"use client";

import { motion } from "framer-motion";
import { Check, Minus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { planCopyKey, type PlanId } from "@/lib/config/plans";
import { EASE_OUT, REVEAL_VIEWPORT } from "@/lib/motion";
import { cn } from "@/lib/utils";

const PLAN_ORDER: PlanId[] = ["basic", "pro", "parents"];

function Cell({ value }: { value: string | boolean }) {
  if (value === true) {
    return (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-sage-100 text-sage-700">
        <Check className="h-3.5 w-3.5" strokeWidth={2.75} aria-label="✓" />
      </span>
    );
  }
  if (value === false) return <Minus className="mx-auto h-4 w-4 text-ink-subtle" aria-label="—" />;
  return <span className="font-medium text-ink">{value}</span>;
}

/** Side-by-side comparison; the selected plan's column is highlighted and headers select a plan. */
export function PlanComparison({ selectedId, onSelect }: { selectedId: PlanId; onSelect: (id: PlanId) => void }) {
  const { dictionary } = useLanguage();
  const copy = dictionary.subscription;
  const selectedIndex = PLAN_ORDER.indexOf(selectedId);

  return (
    <motion.section
      aria-labelledby="compare-title"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={REVEAL_VIEWPORT}
      transition={{ duration: 0.7, ease: EASE_OUT }}
      className="mx-auto mt-20 max-w-4xl sm:mt-24"
    >
      <div className="text-center">
        <h2 id="compare-title" className="text-title font-medium tracking-[-0.02em] text-ink">{copy.compareTitle}</h2>
        <p className="mt-2 text-sm text-ink-muted">{copy.compareSubtitle}</p>
      </div>

      <div className="surface-card mt-8 overflow-hidden p-1.5 sm:p-2">
        <table className="w-full table-fixed border-separate border-spacing-0 text-[0.8125rem] sm:text-sm">
          <colgroup>
            <col className="w-[34%] sm:w-[40%]" />
            <col />
            <col />
            <col />
          </colgroup>
          <thead>
            <tr>
              <th scope="col" className="px-3 py-4 text-start text-xs font-medium text-ink-muted sm:px-5">
                {copy.compareFeature}
              </th>
              {PLAN_ORDER.map((id, i) => {
                const selected = i === selectedIndex;
                return (
                  <th key={id} scope="col" className={cn("rounded-t-2xl px-1 py-3 transition-colors duration-300", selected && "bg-teal-50")}>
                    <button
                      type="button"
                      onClick={() => onSelect(id)}
                      aria-pressed={selected}
                      className={cn(
                        "inline-flex min-h-9 w-full cursor-pointer items-center justify-center rounded-full px-2 text-[0.8125rem] font-semibold transition-colors duration-200 sm:text-sm",
                        selected ? "text-teal-800" : "text-ink-soft hover:text-teal-700",
                      )}
                    >
                      {copy[planCopyKey(id)].name}
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {copy.compareRows.map((row, r) => {
              const [label, ...values] = row;
              const last = r === copy.compareRows.length - 1;
              return (
                <tr key={String(label)}>
                  <th scope="row" className={cn("border-t border-line px-3 py-3.5 text-start font-normal text-ink-soft sm:px-5", last && "rounded-bs-2xl")}>
                    {label}
                  </th>
                  {values.map((value, i) => (
                    <td
                      key={i}
                      className={cn(
                        "border-t border-line px-1 py-3.5 text-center transition-colors duration-300",
                        i === selectedIndex && "bg-teal-50",
                        i === selectedIndex && last && "rounded-b-2xl",
                      )}
                    >
                      <Cell value={value} />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.section>
  );
}
