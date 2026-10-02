"use client";

import { Grain, WaveLines } from "@/components/home/Atmosphere";
import { ACCENT_DARK, DISPLAY_L, LABEL } from "@/components/home/typography";
import { useLanguage } from "@/contexts/LanguageContext";
import { EASE_OUT, fadeUp, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { BrainCircuit, HeartHandshake, Quote, ShieldCheck } from "lucide-react";

const POINT_ICONS = [BrainCircuit, ShieldCheck, HeartHandshake] as const;

/**
 * Desktop-only storytelling column for /auth/*: one deep-teal sheet with the home page's grain and wave lines.
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
      className="relative isolate hidden min-h-[36rem] flex-col overflow-hidden rounded-[2rem] bg-[linear-gradient(160deg,var(--color-teal-900),var(--color-ink)_95%)] p-10 text-white shadow-float lg:flex xl:p-14"
    >
      <Grain />
      <WaveLines tone="deep" className="inset-y-0" />
      <span aria-hidden className="pointer-events-none absolute -end-24 -top-24 -z-10 size-80 rounded-full bg-gold/20 blur-3xl" />

      <motion.div variants={stagger(0.08, 0.2)} initial="hidden" animate="show" className="flex flex-1 flex-col">
        <motion.p variants={fadeUp(0, 10)} className={cn(LABEL, "inline-flex items-center gap-3 text-teal-200")}>
          <span aria-hidden className="h-px w-8 bg-gold-300" />
          {brand.eyebrow}
        </motion.p>

        <motion.h2 id="auth-brand-title" variants={fadeUp(0, 14)} className={cn(DISPLAY_L, "mt-7 max-w-[14ch] text-[clamp(2.25rem,2.4vw+1.3rem,3.75rem)] text-white")}>
          {brand.titleA} <span className={ACCENT_DARK}>{brand.titleB}</span>
        </motion.h2>

        <motion.p variants={fadeUp(0, 12)} className="mt-6 max-w-md text-[1.0625rem] leading-8 text-teal-100">
          {brand.body}
        </motion.p>

        <motion.ul variants={fadeUp(0, 12)} className="mt-9 flex max-w-md flex-col gap-4">
          {brand.points.map((point, index) => {
            const Icon = POINT_ICONS[index % POINT_ICONS.length];
            return (
              <li key={point} className="flex items-center gap-4 text-[0.9375rem] font-medium text-white/90">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-gold-300">
                  <Icon className="size-[1.125rem]" strokeWidth={1.5} aria-hidden />
                </span>
                {point}
              </li>
            );
          })}
        </motion.ul>

        <motion.figure variants={fadeUp(0, 12)} className="mt-auto max-w-sm rounded-2xl border border-white/15 bg-white/[0.07] p-5 backdrop-blur-sm">
          <Quote className="size-5 text-gold-300 rtl:-scale-x-100" aria-hidden />
          <blockquote className="mt-3 text-[0.9375rem] leading-7 text-white/90">{brand.quote}</blockquote>
        </motion.figure>
      </motion.div>
    </motion.aside>
  );
}
