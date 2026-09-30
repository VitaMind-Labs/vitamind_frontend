"use client";

import { motion } from "framer-motion";
import { Check, Minus } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useLanguage } from "@/contexts/LanguageContext";
import { planCopyKey, type PlanId } from "@/lib/config/plans";
import { EASE_OUT, REVEAL_VIEWPORT } from "@/lib/motion";
import { cn } from "@/lib/utils";

const PLAN_ORDER: PlanId[] = ["basic", "pro", "parents"];

function Cell({ value, included, notIncluded }: { value: string | boolean; included: string; notIncluded: string }) {
  if (value === true) {
    return (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-sage-100 text-sage-700">
        <Check className="h-3.5 w-3.5" strokeWidth={2.75} aria-hidden />
        <span className="sr-only">{included}</span>
      </span>
    );
  }
  if (value === false) {
    return (
      <span className="inline-flex h-6 items-center justify-center text-ink-subtle">
        <Minus className="h-4 w-4" aria-hidden />
        <span className="sr-only">{notIncluded}</span>
      </span>
    );
  }
  return <span className="font-medium text-ink">{value}</span>;
}

/** Expandable side-by-side comparison. The selected plan's column carries the same emphasis surface as its plan column. */
export function PlanComparison({ selectedId, onSelect }: { selectedId: PlanId; onSelect: (id: PlanId) => void }) {
  const { dictionary } = useLanguage();
  const copy = dictionary.subscription;
  const selectedIndex = PLAN_ORDER.indexOf(selectedId);
  const cell = (value: string | boolean) => <Cell value={value} included={copy.included} notIncluded={copy.notIncluded} />;

  return (
    <motion.section
      aria-labelledby="compare-title"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={REVEAL_VIEWPORT}
      transition={{ duration: 0.6, ease: EASE_OUT }}
      className="mx-auto mt-16 w-full max-w-6xl sm:mt-20"
    >
      <Accordion type="single" collapsible defaultValue="compare">
        <AccordionItem value="compare" className="overflow-hidden rounded-[1.75rem] border border-line bg-white">
          <AccordionTrigger className="gap-4 px-6 py-5 text-start hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-500 sm:px-8 sm:py-6 [&>svg]:h-5 [&>svg]:w-5 [&>svg]:text-ink-muted">
            <span className="min-w-0">
              <span id="compare-title" className="block text-title font-medium tracking-[-0.02em] text-ink">
                {copy.compareTitle}
              </span>
              <span className="mt-1 block text-sm font-normal text-ink-muted">{copy.compareSubtitle}</span>
            </span>
          </AccordionTrigger>

          <AccordionContent className="pb-0">
            {/* Tablet & desktop: table */}
            <div className="hidden px-4 pb-4 sm:block">
              <table className="w-full table-fixed border-separate border-spacing-0 text-sm">
                <colgroup>
                  <col className="w-[40%]" />
                  <col />
                  <col />
                  <col />
                </colgroup>
                <thead>
                  <tr>
                    <th scope="col" className="px-4 py-3 text-start text-xs font-medium text-ink-muted">
                      {copy.compareFeature}
                    </th>
                    {PLAN_ORDER.map((id, i) => {
                      const selected = i === selectedIndex;
                      return (
                        <th key={id} scope="col" className={cn("rounded-t-2xl px-1 py-2 transition-colors duration-300", selected && "bg-teal-50/70")}>
                          <button
                            type="button"
                            onClick={() => onSelect(id)}
                            aria-pressed={selected}
                            className={cn(
                              "inline-flex min-h-11 w-full cursor-pointer items-center justify-center rounded-full px-2 text-sm font-semibold transition-colors duration-200",
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
                        <th scope="row" className="border-t border-line px-4 py-3.5 text-start font-normal text-ink-soft">
                          {label}
                        </th>
                        {values.map((value, i) => (
                          <td
                            key={i}
                            className={cn(
                              "border-t border-line px-1 py-3.5 text-center transition-colors duration-300",
                              i === selectedIndex && "bg-teal-50/70",
                              i === selectedIndex && last && "rounded-b-2xl",
                            )}
                          >
                            {cell(value)}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile: one row per feature, plans side by side underneath — no cramped table. */}
            <dl className="divide-y divide-line border-t border-line px-5 sm:hidden">
              {copy.compareRows.map((row) => {
                const [label, ...values] = row;
                return (
                  <div key={String(label)} className="py-4">
                    <dt className="text-sm font-medium text-ink">{label}</dt>
                    <dd className="mt-2.5 grid grid-cols-3 gap-2">
                      {values.map((value, i) => (
                        <div
                          key={PLAN_ORDER[i]}
                          className={cn(
                            "flex min-w-0 flex-col items-center gap-1 rounded-xl px-1.5 py-2 text-center text-sm transition-colors duration-300",
                            i === selectedIndex ? "bg-teal-50 ring-1 ring-teal-100" : "bg-surface-muted/70",
                          )}
                        >
                          <span className="max-w-full truncate text-xs text-ink-muted">{copy[planCopyKey(PLAN_ORDER[i])].name}</span>
                          {cell(value)}
                        </div>
                      ))}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </motion.section>
  );
}
