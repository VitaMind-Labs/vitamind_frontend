"use client";

import { AgentAvatar } from "@/components/layout/site-header";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuthSession } from "@/hooks/useAuthSession";
import { ROUTES, agentEntryHref } from "@/lib/config/routes";
import { homeStoryCopy } from "@/lib/i18n/homeStory";
import { EASE_OUT, REVEAL_VIEWPORT, fadeUp, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Building2, Landmark, Stethoscope } from "lucide-react";
import Link from "next/link";
import { HomeSection } from "./HomeSection";
import { SectionHeader } from "./SectionHeader";
import { BODY_SM, DISPLAY_M, DISPLAY_S, LABEL } from "./typography";

/** One colour per condition, the same three the care tracks use: teal, gold, sage. */
const CONDITION_TONE = [
  { dot: "bg-teal-500", sweep: "bg-teal-50", text: "group-hover:text-teal-700" },
  { dot: "bg-gold", sweep: "bg-gold-50", text: "group-hover:text-gold-700" },
  { dot: "bg-sage-700", sweep: "bg-sage-50", text: "group-hover:text-sage-700" },
] as const;

const PRO_ICONS = [Stethoscope, Building2, Landmark] as const;

/** A condition as an editorial row: a rule draws in, the name rises; on hover the row's colour sweeps across. */
function ConditionRow({ index, name, line }: { index: number; name: string; line: string }) {
  const reduce = useReducedMotion();
  const tone = CONDITION_TONE[index];
  return (
    <motion.li variants={fadeUp(0, 18)} className="relative">
      <motion.span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px origin-left bg-line-strong rtl:origin-right"
        initial={reduce ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.2 + index * 0.15, ease: EASE_OUT }}
      />
      <Link
        href={ROUTES.tracks}
        className="group relative isolate flex items-center gap-4 overflow-hidden rounded-2xl px-2 py-5 outline-none focus-visible:ring-2 focus-visible:ring-teal-500 sm:gap-6 sm:px-4 sm:py-6"
      >
        <span aria-hidden className={cn("absolute inset-0 -z-10 origin-left scale-x-0 rounded-2xl transition-transform duration-700 ease-out-soft group-hover:scale-x-100 group-focus-visible:scale-x-100 rtl:origin-right", tone.sweep)} />
        <span dir="ltr" aria-hidden className="w-7 shrink-0 font-mono text-[0.8125rem] tabular-nums text-ink-subtle">
          0{index + 1}
        </span>
        <span aria-hidden className="relative flex size-2.5 shrink-0">
          <span className={cn("absolute inset-0 rounded-full opacity-50 motion-safe:animate-ping", tone.dot)} />
          <span className={cn("relative size-2.5 rounded-full", tone.dot)} />
        </span>
        <span className="min-w-0 flex-1">
          <span className={cn(DISPLAY_M, "block text-ink transition-colors duration-500", tone.text)}>{name}</span>
          <span className="mt-1.5 block text-[0.9375rem] leading-6 text-ink-soft">{line}</span>
        </span>
        <ArrowUpRight
          aria-hidden
          className="size-5 shrink-0 text-ink-subtle transition-[transform,color] duration-500 ease-out-soft group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
        />
      </Link>
    </motion.li>
  );
}

/**
 * Who VitaMind is for, on one screen: the three conditions (each opens its care track), a way in for someone who is not
 * sure yet (Mira), and the professionals and organisations on the other side.
 */
export const AudienceSection = () => {
  const { language } = useLanguage();
  const { signedIn } = useAuthSession();
  const copy = homeStoryCopy[language].audience;

  return (
    <HomeSection id="for" labelledBy="for-title" tone="tint">
      <SectionHeader variant="editorial" id="for-title" layout="split" counter="02 / 04" eyebrow={copy.eyebrow} titleA={copy.titleA} titleB={copy.titleB} intro={copy.intro} />

      <div className="mt-12 grid gap-6 md:mt-16 lg:grid-cols-12 lg:gap-8">
        {/* People */}
        <motion.div variants={stagger(0.1)} initial="hidden" whileInView="show" viewport={REVEAL_VIEWPORT} className="lg:col-span-7">
          <motion.p variants={fadeUp(0, 10)} className={cn(LABEL, "text-teal-700")}>
            {copy.people.label} <span className="text-ink-subtle">· {copy.people.title}</span>
          </motion.p>
          <ul className="mt-4">
            {copy.people.conditions.map(([name, line], index) => (
              <ConditionRow key={name} index={index} name={name} line={line} />
            ))}
          </ul>
          <motion.div variants={fadeUp(0, 10)} className="border-t border-line-strong pt-5">
            <Link href={ROUTES.tracks} className="inline-flex min-h-10 items-center gap-2 rounded-md text-[0.9375rem] font-semibold text-teal-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-500">
              <span className="home-link-line">{copy.people.link}</span>
              <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden />
            </Link>
          </motion.div>
        </motion.div>

        <motion.div variants={stagger(0.14, 0.2)} initial="hidden" whileInView="show" viewport={REVEAL_VIEWPORT} className="grid gap-5 sm:grid-cols-2 lg:col-span-5 lg:flex lg:flex-col">
          {/* Not sure yet: Mira */}
          <motion.div variants={fadeUp(0, 22)}>
            <Link
              href={agentEntryHref("mira", signedIn)}
              className="group relative isolate flex h-full flex-col overflow-hidden rounded-panel border border-teal-200 bg-[linear-gradient(150deg,var(--color-teal-100),#ffffff_74%)] p-6 outline-none transition-[transform,box-shadow,border-color] duration-500 ease-out-soft hover:-translate-y-1 hover:border-teal-400 hover:shadow-soft-hover focus-visible:ring-2 focus-visible:ring-teal-500 sm:p-7"
            >
              <span aria-hidden className="pointer-events-none absolute -end-10 -top-10 -z-10 size-40 rounded-full bg-[radial-gradient(closest-side,rgb(134_186_188/0.35),transparent)] transition-transform duration-700 ease-out-soft group-hover:scale-125" />
              <div className="flex items-center gap-4">
                <AgentAvatar agent="mira" className="size-12 rounded-2xl ring-1 ring-white" />
                <h3 className={cn(DISPLAY_S, "text-ink")}>{copy.unsure.title}</h3>
              </div>
              <p className={cn(BODY_SM, "mt-4")}>{copy.unsure.line}</p>
              <span className="mt-auto inline-flex items-center gap-3 pt-6 text-[0.9375rem] font-semibold text-teal-700">
                {copy.unsure.cta}
                <span aria-hidden className="flex size-9 items-center justify-center rounded-full bg-teal-600 text-white transition-colors duration-300 group-hover:bg-teal-800">
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" />
                </span>
              </span>
            </Link>
          </motion.div>

          {/* Professionals */}
          <motion.div variants={fadeUp(0, 22)} className="flex flex-1 flex-col rounded-panel border border-line bg-white p-6 shadow-card sm:p-7">
            <p className={cn(LABEL, "text-sage-700")}>{copy.pros.label}</p>
            <h3 className={cn(DISPLAY_S, "mt-3 text-ink")}>{copy.pros.title}</h3>
            <ul className="mt-5 space-y-4">
              {copy.pros.items.map(([title, line], index) => {
                const Icon = PRO_ICONS[index];
                return (
                  <li key={title} className="flex items-start gap-3.5">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sage-50 text-sage-700">
                      <Icon className="size-[1.125rem]" strokeWidth={1.75} aria-hidden />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[0.9375rem] font-semibold text-ink">{title}</span>
                      <span className="block text-[0.875rem] leading-6 text-ink-soft">{line}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
            <a href="#healthcare" className="mt-auto inline-flex min-h-10 items-center gap-2 self-start rounded-md pt-6 text-[0.9375rem] font-semibold text-teal-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-500">
              <span className="home-link-line">{copy.pros.cta}</span>
              <ArrowRight className="size-4 shrink-0 rtl:-scale-x-100" aria-hidden />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </HomeSection>
  );
};
