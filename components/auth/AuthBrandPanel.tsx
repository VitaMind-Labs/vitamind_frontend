"use client";

import { ACCENT_LIGHT, DISPLAY_L, LABEL } from "@/components/home/typography";
import { useLanguage } from "@/contexts/LanguageContext";
import { EASE_OUT, fadeUp, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { BrainCircuit, HeartHandshake, Quote, ShieldCheck } from "lucide-react";

const POINT_ICONS = [BrainCircuit, ShieldCheck, HeartHandshake] as const;

/**
 * Desktop-only storytelling column for /auth/*: a white sheet with a still teal hairline grid fading from the top —
 * the points read as a Vercel-style list of rules, the quote closes the panel.
 */
export function AuthBrandPanel() {
  const { dictionary } = useLanguage();
  const brand = dictionary.auth.brand;

  return (
    <motion.aside
      aria-labelledby="auth-brand-title"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: EASE_OUT }}
      className="relative isolate hidden min-h-[min(36rem,calc(100dvh-16rem))] flex-col overflow-hidden rounded-[1.75rem] border border-line bg-white p-10 text-ink lg:flex xl:p-14 2xl:p-16"
    >
      {/* Still hairline grid, strongest at the top; teal into gold along the edge */}
      <span aria-hidden className="grid-hairline pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(80%_70%_at_85%_0%,black,transparent_80%)]" />
      <span aria-hidden className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-teal-300 via-gold to-gold-100" />

      <motion.div variants={stagger(0.08, 0.2)} initial="hidden" animate="show" className="flex flex-1 flex-col">
        <motion.p variants={fadeUp(0, 10)} className={cn(LABEL, "inline-flex items-center gap-3 text-teal-700")}>
          <span aria-hidden className="h-px w-8 bg-gold" />
          {brand.eyebrow}
        </motion.p>

        <motion.h2 id="auth-brand-title" variants={fadeUp(0, 14)} className={cn(DISPLAY_L, "mt-7 max-w-[14ch] text-[clamp(2.25rem,2.4vw+1.3rem,3.75rem)] text-ink")}>
          {brand.titleA} <span className={ACCENT_LIGHT}>{brand.titleB}</span>
        </motion.h2>

        <motion.p variants={fadeUp(0, 12)} className="mt-6 max-w-md text-[1.0625rem] leading-8 text-ink-soft 2xl:max-w-lg">
          {brand.body}
        </motion.p>

        <motion.ul variants={fadeUp(0, 12)} className="mt-9 max-w-md 2xl:max-w-lg divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface-muted">
          {brand.points.map((point, index) => {
            const Icon = POINT_ICONS[index % POINT_ICONS.length];
            return (
              <li key={point} className="flex items-center gap-4 px-4 py-3.5 text-[0.9375rem] font-medium text-ink">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-teal-200 bg-white text-teal-700">
                  <Icon className="size-[1.0625rem]" strokeWidth={1.5} aria-hidden />
                </span>
                {point}
              </li>
            );
          })}
        </motion.ul>

        <motion.figure variants={fadeUp(0, 12)} className="mt-auto max-w-sm pt-10">
          <Quote className="size-5 text-gold-600 rtl:-scale-x-100" aria-hidden />
          <blockquote className="mt-3 border-s border-gold ps-4 text-[0.9375rem] leading-7 text-ink-soft">{brand.quote}</blockquote>
        </motion.figure>
      </motion.div>
    </motion.aside>
  );
}
