"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { EASE_OUT, REVEAL_VIEWPORT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { motion, useMotionValue, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Activity, Brain, Eye, Info } from "lucide-react";
import { createRef, useEffect, useMemo, useState, type RefObject } from "react";
import { ACCENTS, type Accent } from "./accents";
import { HomeSection } from "./HomeSection";
import { SectionHeader } from "./SectionHeader";
import { BODY, DISPLAY_M, LABEL, SERIF } from "./typography";

const ICONS = [Brain, Activity, Eye] as const;
const ACCENT_ORDER: Accent[] = ["teal", "gold", "sage"];

type Condition = { number: string; title: string; category: string; definition: string; fact: string };

/** Each panel keeps its own quiet weather: a single wash of its accent, never a second palette. */
const ATMOSPHERE: Record<Accent, string> = {
  teal: "bg-[radial-gradient(70%_90%_at_0%_0%,var(--color-teal-100),transparent_65%),linear-gradient(180deg,#ffffff,var(--color-teal-50))]",
  gold: "bg-[radial-gradient(70%_90%_at_100%_0%,var(--color-gold-100),transparent_62%),linear-gradient(180deg,#ffffff,var(--color-gold-50))]",
  sage: "bg-[radial-gradient(70%_90%_at_0%_100%,var(--color-sage-100),transparent_65%),linear-gradient(180deg,#ffffff,var(--color-sage-50))]",
};

const ART_DRAW = { duration: 2.2, ease: EASE_OUT } as const;

/** Hand-drawn hint of each pattern: attention hopping, mood rhythm, layered perception. Hairline, drawn once. */
function ConditionArt({ index, accent }: { index: number; accent: Accent }) {
  const draw = { initial: { pathLength: 0 }, whileInView: { pathLength: 1 }, viewport: { once: true, margin: "0px 0px -10% 0px" }, transition: ART_DRAW } as const;
  const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1, vectorEffect: "non-scaling-stroke" } as const;

  return (
    <svg
      viewBox="0 0 420 320"
      aria-hidden
      className={cn("pointer-events-none absolute inset-y-0 end-0 -z-10 hidden h-full w-[46%] opacity-45 [mask-image:linear-gradient(to_right,transparent,black_40%)] rtl:[mask-image:linear-gradient(to_left,transparent,black_40%)] sm:block", ACCENTS[accent].text)}
      preserveAspectRatio="xMaxYMid slice"
    >
      {index === 0 && (
        <g>
          {/* Attention hopping from one point of interest to the next */}
          <motion.path d="M60 240 C 110 120, 150 260, 200 150 S 290 90, 330 200 S 370 80, 392 60" {...stroke} {...draw} />
          {[[60, 240, 7], [200, 150, 11], [330, 200, 8], [392, 60, 6], [140, 70, 4], [260, 270, 5]].map(([cx, cy, r]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill="currentColor" opacity={r > 6 ? 0.28 : 0.5} />
          ))}
        </g>
      )}
      {index === 1 && (
        <g>
          {/* Mood and energy: the same rhythm, wider and deeper */}
          <motion.path d="M0 160 C 50 60, 100 60, 150 160 S 250 260, 300 160 S 380 60, 420 140" {...stroke} {...draw} />
          <motion.path d="M0 170 C 60 110, 100 110, 160 170 S 250 220, 310 170 S 380 120, 420 160" opacity={0.6} {...stroke} {...draw} />
          <motion.path d="M0 150 C 40 20, 110 20, 160 150 S 260 290, 310 150 S 390 20, 420 120" opacity={0.35} {...stroke} {...draw} />
        </g>
      )}
      {index === 2 && (
        <g>
          {/* Perception in layers: circles that overlap without quite agreeing */}
          {[[250, 160, 110], [300, 140, 80], [215, 195, 60], [330, 205, 40]].map(([cx, cy, r], i) => (
            <motion.circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} opacity={0.85 - i * 0.15} {...stroke} {...draw} />
          ))}
        </g>
      )}
    </svg>
  );
}

/** The card's rendered height, so a card taller than the screen can pin by its bottom edge instead of being cut off. */
function useHeight(ref: RefObject<HTMLElement | null>) {
  const [height, setHeight] = useState(0);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => setHeight(Math.round(entry.contentRect.height)));
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref]);
  return height;
}

/**
 * One card of the stack. It pins just below the header; as the next card rises over it, this one
 * recedes — a little smaller, a little quieter — so the deck reads as depth, not as a list.
 */
function ConditionPanel({
  condition,
  index,
  quickLabel,
  lang,
  selfRef,
  nextRef,
  stack,
}: {
  condition: Condition;
  index: number;
  quickLabel: string;
  lang: string;
  selfRef: RefObject<HTMLLIElement | null>;
  nextRef?: RefObject<HTMLLIElement | null>;
  stack: boolean;
}) {
  const accent = ACCENT_ORDER[index];
  const Icon = ICONS[index];
  const idle = useMotionValue(0);
  const height = useHeight(selfRef);
  const { scrollYProgress } = useScroll({ target: nextRef ?? selfRef, offset: ["start end", "start 0.2"] });
  const covered = nextRef && stack ? scrollYProgress : idle;
  const scale = useTransform(covered, [0, 1], [1, 0.93]);
  const veil = useTransform(covered, [0, 1], [0, 0.5]);
  const lift = useTransform(covered, [0, 1], [0, -14]);

  return (
    <motion.li
      ref={selfRef}
      // Pins under the header; a card taller than the viewport pins by its bottom edge so all of it gets read.
      style={stack ? { top: `min(calc(6.5rem + ${index} * 1rem), calc(100svh - ${height}px - 1.25rem))`, scale, y: lift, transformOrigin: "50% 0%" } : undefined}
      className={stack ? "sticky" : undefined}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={REVEAL_VIEWPORT}
        transition={{ duration: 0.9, ease: EASE_OUT }}
        className={cn("relative isolate overflow-hidden rounded-panel border border-line p-7 shadow-[var(--shadow-soft)] sm:p-10 lg:p-14", ATMOSPHERE[accent])}
      >
        <ConditionArt index={index} accent={accent} />

        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 lg:col-span-3 lg:flex-col lg:items-start lg:justify-between">
            <span aria-hidden className={cn(SERIF, "select-none text-[clamp(4.5rem,8vw,8rem)] font-extralight leading-[0.85] tracking-[-0.05em] tabular-nums", ACCENTS[accent].text)}>
              {condition.number}
            </span>
            <span className="flex items-center gap-3">
              <span className={cn("flex size-11 items-center justify-center rounded-2xl", ACCENTS[accent].icon)}>
                <Icon className="size-5" strokeWidth={1.5} aria-hidden />
              </span>
              <span className={cn(LABEL, "text-ink-soft")}>{condition.category}</span>
            </span>
          </div>

          <div className="lg:col-span-8 lg:col-start-5">
            <h3 className={cn(DISPLAY_M, "max-w-xl text-ink")}>{condition.title}</h3>
            <p className={cn(BODY, "mt-6 max-w-2xl")} lang={lang}>
              {condition.definition}
            </p>
            <div className={cn("mt-9 max-w-2xl border-s-2 ps-5 sm:ps-6", ACCENTS[accent].border)}>
              <p className={cn(LABEL, ACCENTS[accent].text)}>{quickLabel}</p>
              <p className="mt-2 text-[1rem] leading-7 text-ink" lang={lang}>
                {condition.fact}
              </p>
            </div>
          </div>
        </div>

        {/* Dims as the next card covers it */}
        {stack && nextRef ? <motion.span aria-hidden style={{ opacity: veil }} className="pointer-events-none absolute inset-0 z-10 bg-ink" /> : null}
      </motion.div>
    </motion.li>
  );
}

export const ConditionsSection = () => {
  const { language, dictionary } = useLanguage();
  const copy = dictionary.homeLanding.conditions;
  const items = copy.items as readonly Condition[];
  const reduce = useReducedMotion();
  const stack = !reduce;
  const refs = useMemo(() => items.map(() => createRef<HTMLLIElement>()), [items]);

  return (
    <HomeSection id="conditions" labelledBy="conditions-title" tone="tint">
      <SectionHeader variant="editorial" id="conditions-title" layout="split" counter="04 / 06" eyebrow={copy.eyebrow} titleA={copy.titleA} titleB={copy.titleB} intro={copy.intro} />

      <ol className={cn("mt-14 flex flex-col md:mt-20", stack ? "gap-[14vh] lg:gap-[24vh]" : "gap-5 lg:gap-6")}>
        {items.map((condition, i) => (
          <ConditionPanel
            key={condition.title}
            condition={condition}
            index={i}
            quickLabel={copy.quickLabel}
            lang={language}
            selfRef={refs[i]}
            nextRef={refs[i + 1]}
            stack={stack}
          />
        ))}
      </ol>

      <p className="mt-10 flex max-w-2xl items-start gap-2.5 text-[0.875rem] leading-6 text-ink-soft lg:mt-14">
        <Info className="mt-0.5 size-4 shrink-0 text-gold-700" aria-hidden />
        <span className="min-w-0">{copy.disclaimer}</span>
      </p>
    </HomeSection>
  );
};
