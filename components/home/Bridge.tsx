"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { homeBridgeCopy, type HomeBridgeCopy } from "@/lib/i18n/homeStory";
import { EASE_OUT, REVEAL_VIEWPORT, fadeUp, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Check, HeartPulse, Stethoscope, type LucideIcon } from "lucide-react";
import { useRef } from "react";
import { HomeSection } from "./HomeSection";
import { TiltCard } from "./Interactions";
import { SectionHeader } from "./SectionHeader";
import { DISPLAY_S, LABEL } from "./typography";

type Side = HomeBridgeCopy["patient"];

/** One end of the bridge: who it is for, one line, and three short points that settle in one after another. */
function SideCard({ side, icon: Icon, tone }: { side: Side; icon: LucideIcon; tone: "teal" | "sage" }) {
  const sage = tone === "sage";
  return (
    <motion.div variants={fadeUp(0, 26)} className="h-full">
      <TiltCard className="h-full rounded-panel" max={4}>
        <div
          className={cn(
            "group relative h-full overflow-hidden rounded-panel border p-6 transition-[border-color,box-shadow] duration-500 ease-out-soft hover:shadow-soft-hover sm:p-8",
            sage ? "border-sage-100 bg-[linear-gradient(150deg,var(--color-sage-50),#ffffff_78%)] hover:border-sage" : "border-teal-200 bg-[linear-gradient(150deg,var(--color-teal-50),#ffffff_78%)] hover:border-teal-400",
          )}
        >
          <span
            className={cn(
              "flex size-12 items-center justify-center rounded-2xl bg-white shadow-xs ring-1 transition-transform duration-500 ease-out-soft motion-safe:group-hover:-rotate-6 motion-safe:group-hover:scale-105",
              sage ? "text-sage-700 ring-sage-100" : "text-teal-700 ring-teal-100",
            )}
          >
            <Icon className="size-6" strokeWidth={1.6} aria-hidden />
          </span>
          <p className={cn(LABEL, "mt-6", sage ? "text-sage-700" : "text-teal-700")}>{side.label}</p>
          <h3 className={cn(DISPLAY_S, "mt-2 text-ink")}>{side.title}</h3>
          <motion.ul variants={stagger(0.12, 0.3)} className="mt-6 space-y-3">
            {side.points.map((point) => (
              <motion.li key={point} variants={fadeUp(0, 10)} className="flex items-start gap-3 text-[0.9375rem] leading-6 text-ink-soft">
                <span aria-hidden className={cn("mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-white", sage ? "bg-sage-700" : "bg-teal-600")}>
                  <Check className="size-3" strokeWidth={3} />
                </span>
                {point}
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </TiltCard>
    </motion.div>
  );
}

/**
 * The bridge itself. A line fills teal to gold as it arrives, a gold light carries what the patient shares across to the
 * clinician and a teal one carries support back. Vertical between the stacked cards, horizontal beside them (mirrored in RTL).
 */
function Connector({ label }: { label: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { margin: "0px 0px -10% 0px" });
  const run = !reduce && visible;

  return (
    <motion.div ref={ref} variants={fadeUp(0, 12)} className="relative flex flex-col items-center justify-center py-8 lg:w-60 lg:px-5 lg:py-0">
      <span aria-hidden className="absolute inset-y-0 start-1/2 w-px -translate-x-1/2 bg-line-strong lg:inset-x-0 lg:inset-y-auto lg:start-0 lg:top-1/2 lg:h-px lg:w-full lg:translate-x-0 lg:-translate-y-1/2 rtl:lg:-scale-x-100">
        <motion.span
          className="absolute inset-0 origin-top bg-gradient-to-b from-teal-600 to-gold lg:origin-left lg:bg-gradient-to-r"
          initial={reduce ? false : { scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={REVEAL_VIEWPORT}
          transition={{ duration: 1.6, delay: 0.2, ease: EASE_OUT }}
        />
        {run ? (
          <>
            {/* Vertical (stacked): top to bottom, then back */}
            <motion.span
              className="absolute start-1/2 size-2.5 -translate-x-1/2 rounded-full bg-gold shadow-[0_0_14px_3px_rgb(201_175_111/0.6)] lg:hidden"
              animate={{ top: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 3.2, delay: 1.4, repeat: Infinity, repeatDelay: 2.2, ease: "easeInOut" }}
            />
            <motion.span
              className="absolute start-1/2 size-2 -translate-x-1/2 rounded-full bg-teal-400 shadow-[0_0_12px_3px_rgb(134_186_188/0.6)] lg:hidden"
              animate={{ top: ["100%", "0%"], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 3.2, delay: 4.2, repeat: Infinity, repeatDelay: 2.2, ease: "easeInOut" }}
            />
            {/* Horizontal (side by side) */}
            <motion.span
              className="absolute top-1/2 hidden size-2.5 -translate-y-1/2 rounded-full bg-gold shadow-[0_0_14px_3px_rgb(201_175_111/0.6)] lg:block"
              animate={{ left: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 3.2, delay: 1.4, repeat: Infinity, repeatDelay: 2.2, ease: "easeInOut" }}
            />
            <motion.span
              className="absolute top-1/2 hidden size-2 -translate-y-1/2 rounded-full bg-teal-400 shadow-[0_0_12px_3px_rgb(134_186_188/0.6)] lg:block"
              animate={{ left: ["100%", "0%"], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 3.2, delay: 4.2, repeat: Infinity, repeatDelay: 2.2, ease: "easeInOut" }}
            />
          </>
        ) : null}
      </span>

      <span className="relative z-10 flex max-w-[16rem] items-center gap-2.5 rounded-full border border-gold/50 bg-white px-4 py-2.5 text-center text-[0.8125rem] font-semibold leading-snug text-ink shadow-soft">
        <span aria-hidden className="relative flex size-2.5 shrink-0">
          {reduce ? null : <span className="absolute inset-0 animate-ping rounded-full bg-gold opacity-60" />}
          <span className="relative size-2.5 rounded-full bg-gold" />
        </span>
        {label}
      </span>
    </motion.div>
  );
}

const CONDITION_DOTS = ["bg-teal-500", "bg-gold", "bg-sage-700"] as const;

/** Why VitaMind exists, in one picture: everyday life on one side, clinical care on the other, a bridge between. */
export const Bridge = () => {
  const { language } = useLanguage();
  const copy = homeBridgeCopy[language];

  return (
    <HomeSection id="why" labelledBy="why-title" tone="base">
      <SectionHeader variant="editorial" id="why-title" layout="split" counter="01 / 03" eyebrow={copy.eyebrow} titleA={copy.titleA} titleB={copy.titleB} intro={copy.intro} />

      <motion.div variants={stagger(0.14, 0.05)} initial="hidden" whileInView="show" viewport={REVEAL_VIEWPORT} className="mt-12 flex flex-col lg:mt-16 lg:flex-row lg:items-stretch">
        <div className="lg:flex-1">
          <SideCard side={copy.patient} icon={HeartPulse} tone="teal" />
        </div>
        <Connector label={copy.link} />
        <div className="lg:flex-1">
          <SideCard side={copy.clinician} icon={Stethoscope} tone="sage" />
        </div>
      </motion.div>

      <motion.div variants={stagger(0.1, 0.1)} initial="hidden" whileInView="show" viewport={REVEAL_VIEWPORT} className="mt-10 lg:mt-14">
        <motion.p variants={fadeUp(0, 10)} className={cn(LABEL, "text-ink-soft")}>
          {copy.conditions.label}
        </motion.p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {copy.conditions.items.map((item, index) => (
            <motion.li
              key={item.name}
              variants={fadeUp(0, 14)}
              className="group flex items-center gap-4 rounded-2xl border border-line bg-canvas p-4 transition-[border-color,transform,background-color] duration-500 ease-out-soft hover:-translate-y-1 hover:border-teal-300 hover:bg-white"
            >
              <span aria-hidden className="relative flex size-3 shrink-0">
                <span className={cn("absolute inset-0 rounded-full opacity-50 motion-safe:animate-ping", CONDITION_DOTS[index])} />
                <span className={cn("relative size-3 rounded-full", CONDITION_DOTS[index])} />
              </span>
              <span className="min-w-0">
                <span className="block text-[1rem] font-semibold text-ink">{item.name}</span>
                <span className="block text-[0.875rem] leading-5 text-ink-soft">{item.line}</span>
              </span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </HomeSection>
  );
};
