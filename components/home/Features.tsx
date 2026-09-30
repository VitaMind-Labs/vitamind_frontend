"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { EASE_OUT, REVEAL_VIEWPORT, fadeUp, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { motion, useInView } from "framer-motion";
import { Activity, BarChart3, Brain, Eye, HeartPulse, Lightbulb, ShieldCheck, Zap, type LucideIcon } from "lucide-react";
import { useRef } from "react";
import { ACCENTS, type Accent } from "./accents";
import { HomeSection } from "./HomeSection";
import { SectionHeader } from "./SectionHeader";

type Category = "core" | "insight" | "wellness";

const FEATURES_DATA: { icon: LucideIcon; stat: string; category: Category }[] = [
  { icon: Brain, stat: "98%", category: "core" },
  { icon: Lightbulb, stat: "40%", category: "insight" },
  { icon: ShieldCheck, stat: "2wk", category: "wellness" },
  { icon: Activity, stat: "30d", category: "insight" },
  { icon: HeartPulse, stat: "5min", category: "wellness" },
  { icon: Zap, stat: "24/7", category: "core" },
  { icon: Eye, stat: "94%", category: "insight" },
  { icon: BarChart3, stat: "89%", category: "core" },
];

const CATEGORY_INDEX: Record<Category, number> = { core: 0, insight: 1, wellness: 2 };
const CATEGORY_ACCENT: Record<Category, Accent> = { core: "teal", insight: "gold", wellness: "sage" };

/* Narrative order: the core capability leads, insight and care support it, the rest follow lighter. */
const SUPPORTING = [1, 2, 5] as const;
const SECONDARY = [3, 4, 6, 7] as const;

type Feature = (typeof FEATURES_DATA)[number] & { title: string; description: string; statLabel: string; layer: string };

/* Illustrative "emotional map": nodes connect in sequence once visible. */
const NODES: [number, number, Category][] = [
  [40, 120, "core"], [120, 60, "insight"], [150, 150, "core"], [230, 95, "wellness"],
  [300, 160, "insight"], [330, 55, "core"], [410, 115, "wellness"], [470, 60, "insight"],
];
const EDGES: [number, number][] = [[0, 1], [0, 2], [1, 2], [1, 3], [2, 3], [3, 4], [3, 5], [4, 6], [5, 6], [5, 7], [6, 7], [2, 4]];

function NeuralMap() {
  const ref = useRef<SVGSVGElement>(null);
  const start = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });

  return (
    <svg ref={ref} viewBox="0 0 510 210" className="h-auto w-full rtl:-scale-x-100" aria-hidden>
      {EDGES.map(([a, b], i) => (
        <motion.line
          key={`${a}-${b}`}
          x1={NODES[a][0]}
          y1={NODES[a][1]}
          x2={NODES[b][0]}
          y2={NODES[b][1]}
          stroke="var(--color-teal-300)"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={start ? { pathLength: 1, opacity: 1 } : undefined}
          transition={{ duration: 0.8, delay: 0.2 + i * 0.06, ease: EASE_OUT }}
        />
      ))}
      {NODES.map(([x, y, category], i) => (
        <motion.g
          key={`${x}-${y}`}
          initial={{ scale: 0, opacity: 0 }}
          animate={start ? { scale: 1, opacity: 1 } : undefined}
          transition={{ duration: 0.5, delay: 0.1 + i * 0.07, ease: EASE_OUT }}
          style={{ transformOrigin: `${x}px ${y}px` }}
        >
          <circle cx={x} cy={y} r="14" fill={ACCENTS[CATEGORY_ACCENT[category]].fill} opacity="0.14" />
          <circle cx={x} cy={y} r="6" fill={ACCENTS[CATEGORY_ACCENT[category]].fill} stroke="#fff" strokeWidth="2" />
        </motion.g>
      ))}
    </svg>
  );
}

function FeatureIcon({ feature, large = false }: { feature: Feature; large?: boolean }) {
  const Icon = feature.icon;
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-xl transition-transform duration-300 ease-out-soft group-hover:-translate-y-0.5",
        ACCENTS[CATEGORY_ACCENT[feature.category]].icon,
        large ? "h-12 w-12" : "h-10 w-10",
      )}
    >
      <Icon className={large ? "h-6 w-6" : "h-5 w-5"} strokeWidth={1.75} aria-hidden />
    </span>
  );
}

function Stat({ feature, className }: { feature: Feature; className?: string }) {
  return (
    <p className={cn("flex items-baseline gap-2", className)}>
      <span className={cn("font-semibold tabular-nums", ACCENTS[CATEGORY_ACCENT[feature.category]].text)} dir="ltr">
        {feature.stat}
      </span>
      <span className="text-xs text-ink-muted">{feature.statLabel}</span>
    </p>
  );
}

function LayerTag({ feature }: { feature: Feature }) {
  return <span className={cn("home-label", ACCENTS[CATEGORY_ACCENT[feature.category]].text)}>{feature.layer}</span>;
}

export const Features = () => {
  const { dictionary } = useLanguage();
  const copy = dictionary.homeLanding.features;
  const features: Feature[] = FEATURES_DATA.map((feature, index) => ({
    ...feature,
    title: copy.cards[index][0],
    description: copy.cards[index][1],
    statLabel: copy.cards[index][2],
    layer: copy.columns[CATEGORY_INDEX[feature.category]].title,
  }));
  const lead = features[0];

  return (
    <HomeSection id="features" labelledBy="features-title" spacing="bottom">
      <SectionHeader id="features-title" layout="split" eyebrow={copy.eyebrow} titleA={copy.titleA} titleB={copy.titleB} intro={copy.intro} />

      <div className="mt-12 grid gap-10 md:mt-16 lg:grid-cols-12 lg:gap-14">
        {/* ── Dominant feature ─────────────────────────────────────────── */}
        <motion.article
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={REVEAL_VIEWPORT}
          transition={{ duration: 0.7, ease: EASE_OUT }}
          className="home-panel group relative flex min-w-0 flex-col overflow-hidden bg-[linear-gradient(165deg,var(--color-teal-50),#ffffff_58%)] p-6 sm:p-8 lg:col-span-7 lg:p-10"
        >
          <div className="flex items-center justify-between gap-3">
            <FeatureIcon feature={lead} large />
            <LayerTag feature={lead} />
          </div>
          <h3 className="mt-6 text-title font-medium tracking-[-0.02em] text-ink">{lead.title}</h3>
          <p className="mt-3 max-w-md text-base leading-7 text-ink-muted">{lead.description}</p>

          <div className="mt-8 flex flex-1 items-end">
            <NeuralMap />
          </div>

          <div className="mt-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-4 border-t border-line pt-5">
            <Stat feature={lead} className="[&>span:first-child]:text-3xl [&>span:first-child]:font-light [&>span:first-child]:tracking-[-0.03em]" />
            {/* Legend for the map — the three layers, by label and colour. */}
            <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
              {(Object.keys(CATEGORY_INDEX) as Category[]).map((category) => (
                <li key={category} className="inline-flex items-center gap-2 text-xs text-ink-muted">
                  <span aria-hidden className={cn("h-2 w-2 rounded-full", ACCENTS[CATEGORY_ACCENT[category]].rule)} />
                  {copy.columns[CATEGORY_INDEX[category]].title}
                </li>
              ))}
            </ul>
          </div>
        </motion.article>

        {/* ── Supporting features ──────────────────────────────────────── */}
        <motion.ul
          variants={stagger(0.08, 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={REVEAL_VIEWPORT}
          className="flex flex-col divide-y divide-line lg:col-span-5 lg:justify-center"
        >
          {SUPPORTING.map((index) => {
            const feature = features[index];
            return (
              <motion.li key={feature.title} variants={fadeUp(0, 16)} className="group flex gap-4 py-6 first:pt-0 last:pb-0 sm:gap-5">
                <FeatureIcon feature={feature} />
                <div className="min-w-0 flex-1">
                  <LayerTag feature={feature} />
                  <h3 className="mt-1.5 text-[1.0625rem] font-semibold leading-snug text-ink">{feature.title}</h3>
                  <p className="mt-1.5 text-[0.9375rem] leading-6 text-ink-muted">{feature.description}</p>
                  <Stat feature={feature} className="mt-3 text-sm" />
                </div>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>

      {/* ── Secondary capabilities: lighter weight, hairline-separated ──── */}
      <motion.ul
        variants={stagger(0.07)}
        initial="hidden"
        whileInView="show"
        viewport={REVEAL_VIEWPORT}
        className="mt-14 grid gap-x-8 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4"
      >
        {SECONDARY.map((index) => {
          const feature = features[index];
          const accent = ACCENTS[CATEGORY_ACCENT[feature.category]];
          const Icon = feature.icon;
          return (
            <motion.li key={feature.title} variants={fadeUp(0, 14)} className="group relative border-t border-line py-6 sm:pb-2">
              <span
                aria-hidden
                className={cn(
                  "absolute -top-px start-0 h-px w-20 origin-left scale-x-50 transition-transform duration-500 ease-out-soft group-hover:scale-x-100 rtl:origin-right",
                  accent.rule,
                )}
              />
              <div className="flex items-center gap-3">
                <Icon className={cn("h-[1.125rem] w-[1.125rem] shrink-0 transition-transform duration-300 ease-out-soft group-hover:-translate-y-0.5", accent.text)} strokeWidth={1.75} aria-hidden />
                <h3 className="text-[0.9375rem] font-semibold leading-snug text-ink">{feature.title}</h3>
              </div>
              <p className="mt-2 text-sm leading-6 text-ink-muted">{feature.description}</p>
              <Stat feature={feature} className="mt-3 text-sm" />
            </motion.li>
          );
        })}
      </motion.ul>
    </HomeSection>
  );
};
