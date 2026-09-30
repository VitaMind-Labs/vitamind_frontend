"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { EASE_OUT, fadeUp, stagger } from "@/lib/motion";
import { motion } from "framer-motion";
import { BrainCircuit, HeartHandshake, Quote, ShieldCheck } from "lucide-react";
import Image from "next/image";

const POINT_ICONS = [BrainCircuit, ShieldCheck, HeartHandshake] as const;

/**
 * Desktop-only storytelling column for /auth/*.
 * Artwork sits at the base under a canvas fade so copy keeps full contrast.
 */
export function AuthBrandPanel() {
  const { dictionary } = useLanguage();
  const brand = dictionary.auth.brand;

  return (
    <motion.aside
      aria-labelledby="auth-brand-title"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: EASE_OUT }}
      className="relative isolate hidden min-h-[36rem] flex-col overflow-hidden rounded-[2rem] border border-white/80 bg-surface-muted p-10 lg:flex xl:p-14"
    >
      <motion.div
        aria-hidden
        className="absolute inset-0 -z-20"
        initial={{ scale: 1.06 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.6, ease: EASE_OUT }}
      >
        <Image
          src="/assets/hero-bg.png"
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 1px"
          className="object-cover object-[center_75%] rtl:-scale-x-100"
        />
      </motion.div>
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,var(--color-canvas)_0%,rgb(248_249_251/0.95)_45%,rgb(248_249_251/0.6)_72%,rgb(248_249_251/0.15)_100%)]"
      />

      <motion.div variants={stagger(0.08, 0.2)} initial="hidden" animate="show" className="flex flex-1 flex-col">
        <motion.p variants={fadeUp(0, 10)} className="home-eyebrow inline-flex items-center gap-3">
          <span aria-hidden className="h-px w-8 bg-gold-600" />
          {brand.eyebrow}
        </motion.p>

        <motion.h2
          id="auth-brand-title"
          variants={fadeUp(0, 12)}
          className="home-heading mt-6 max-w-[16ch] text-[clamp(2rem,1.8vw+1.25rem,3.125rem)] font-light rtl:font-normal"
        >
          {brand.titleA} <span className="home-heading-accent font-normal">{brand.titleB}</span>
        </motion.h2>

        <motion.p variants={fadeUp(0, 12)} className="mt-5 max-w-md text-base leading-7 text-ink-muted">
          {brand.body}
        </motion.p>

        <motion.ul variants={fadeUp(0, 12)} className="mt-9 flex max-w-md flex-col gap-3.5">
          {brand.points.map((point, index) => {
            const Icon = POINT_ICONS[index % POINT_ICONS.length];
            return (
              <li key={point} className="flex items-center gap-3.5 text-sm font-medium text-ink-soft">
                <span className="home-icon h-10 w-10 rounded-xl bg-white/85">
                  <Icon className="h-[1.125rem] w-[1.125rem]" aria-hidden />
                </span>
                {point}
              </li>
            );
          })}
        </motion.ul>

        <motion.figure
          variants={fadeUp(0, 12)}
          className="mt-auto max-w-sm rounded-2xl border border-white/70 bg-white/75 p-5 backdrop-blur-md"
        >
          <Quote className="h-5 w-5 text-gold-600 rtl:-scale-x-100" aria-hidden />
          <blockquote className="mt-2.5 text-[0.9375rem] leading-6 text-ink">{brand.quote}</blockquote>
        </motion.figure>
      </motion.div>
    </motion.aside>
  );
}
