"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { homeBridgeCopy } from "@/lib/i18n/homeStory";
import { REVEAL_VIEWPORT, fadeUp, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { HomeSection } from "./HomeSection";
import { BridgeScene } from "./BridgeScene";
import { SectionHeader } from "./SectionHeader";
import { LABEL } from "./typography";

const CONDITION_DOTS = ["bg-teal-500", "bg-gold", "bg-sage-700"] as const;

/** Why VitaMind exists, in one picture: everyday life on one side, clinical care on the other, a bridge between. */
export const Bridge = () => {
  const { language } = useLanguage();
  const copy = homeBridgeCopy[language];

  return (
    <HomeSection id="why" labelledBy="why-title" tone="base">
      <SectionHeader variant="editorial" id="why-title" layout="split" counter="01 / 03" eyebrow={copy.eyebrow} titleA={copy.titleA} titleB={copy.titleB} intro={copy.intro} />

      <BridgeScene copy={copy} />

      <motion.div variants={stagger(0.1, 0.1)} initial="hidden" whileInView="show" viewport={REVEAL_VIEWPORT} className="mt-10 lg:mt-8">
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
