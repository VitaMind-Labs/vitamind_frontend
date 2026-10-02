"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { EASE_OUT, REVEAL_VIEWPORT, fadeUp, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { motion, useInView } from "framer-motion";
import { Activity, BarChart3, Brain, Eye, HeartPulse, Lightbulb, ShieldCheck, Zap, type LucideIcon } from "lucide-react";
import { useRef } from "react";
import { ACCENTS, type Accent } from "./accents";
import { Grain } from "./Atmosphere";
import { CountUp } from "./CountUp";
import { HomeSection } from "./HomeSection";
import { Spotlight } from "./Interactions";
import { SectionHeader } from "./SectionHeader";
import { BODY, BODY_SM, DISPLAY_M, DISPLAY_S, LABEL, SERIF } from "./typography";

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

/**
 * The bento: feature 0 is the large deep-teal anchor; the other seven are light cards.
 * Spans fill 12 columns on desktop (5+5 beside the anchor, 4+4+4, 6+6) and pair up on tablet.
 */
const BENTO: { span: string; mint?: boolean }[] = [
  { span: "md:col-span-2 lg:col-span-7 lg:row-span-2" },
  { span: "lg:col-span-5" },
  { span: "lg:col-span-5", mint: true },
  { span: "lg:col-span-4" },
  { span: "lg:col-span-4", mint: true },
  { span: "lg:col-span-4" },
  { span: "lg:col-span-6", mint: true },
  { span: "md:col-span-2 lg:col-span-6" },
];

type Feature = (typeof FEATURES_DATA)[number] & { title: string; description: string; statLabel: string; layer: string };

/* Illustrative "emotional map": nodes connect in sequence once visible. */
const NODES: [number, number, Category][] = [
  [40, 120, "core"], [120, 60, "insight"], [150, 150, "core"], [230, 95, "wellness"],
  [300, 160, "insight"], [330, 55, "core"], [410, 115, "wellness"], [470, 60, "insight"],
];
const EDGES: [number, number][] = [[0, 1], [0, 2], [1, 2], [1, 3], [2, 3], [3, 4], [3, 5], [4, 6], [5, 6], [5, 7], [6, 7], [2, 4]];

/** On deep teal the "core" teal lifts to a lighter step so it never sinks into the surface. */
const nodeFill = (category: Category) => (category === "core" ? "var(--color-teal-300)" : ACCENTS[CATEGORY_ACCENT[category]].fill);

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
          strokeOpacity="0.55"
          strokeWidth="1"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={start ? { pathLength: 1, opacity: 1 } : undefined}
          transition={{ duration: 1.2, delay: 0.2 + i * 0.07, ease: EASE_OUT }}
        />
      ))}
      {NODES.map(([x, y, category], i) => (
        <motion.g
          key={`${x}-${y}`}
          initial={{ scale: 0, opacity: 0 }}
          animate={start ? { scale: 1, opacity: 1 } : undefined}
          transition={{ duration: 0.7, delay: 0.1 + i * 0.08, ease: EASE_OUT }}
          style={{ transformOrigin: `${x}px ${y}px` }}
        >
          <motion.circle
            cx={x}
            cy={y}
            r="15"
            fill={nodeFill(category)}
            opacity="0.2"
            animate={start ? { r: [15, 21, 15], opacity: [0.2, 0.06, 0.2] } : undefined}
            transition={{ duration: 5 + (i % 3), delay: 1.5 + i * 0.4, repeat: Infinity, ease: "easeInOut" }}
          />
          <circle cx={x} cy={y} r="5.5" fill={nodeFill(category)} stroke="var(--color-teal-900)" strokeWidth="2" />
        </motion.g>
      ))}
    </svg>
  );
}

function FeatureIcon({ feature, dark = false }: { feature: Feature; dark?: boolean }) {
  const Icon = feature.icon;
  return (
    <span
      className={cn(
        "flex size-11 shrink-0 items-center justify-center rounded-2xl transition-transform duration-500 ease-out-soft group-hover:-translate-y-0.5",
        dark ? "border border-white/15 bg-white/10 text-teal-100" : ACCENTS[CATEGORY_ACCENT[feature.category]].icon,
      )}
    >
      <Icon className="size-5" strokeWidth={1.5} aria-hidden />
    </span>
  );
}

function Stat({ feature, dark = false, large = false }: { feature: Feature; dark?: boolean; large?: boolean }) {
  return (
    <p className="flex items-baseline gap-3">
      <span dir="ltr">
        <CountUp
          value={feature.stat}
          className={cn(SERIF, dark ? "font-light" : "font-normal", "tabular-nums tracking-[-0.03em]", large ? "text-[clamp(3rem,4vw+1rem,4.5rem)] leading-none" : "text-[2rem] leading-none", dark ? "text-gold-300" : ACCENTS[CATEGORY_ACCENT[feature.category]].text)}
        />
      </span>
      <span className={cn("text-[0.875rem]", dark ? "text-teal-100" : "text-ink-soft")}>{feature.statLabel}</span>
    </p>
  );
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
  const [lead, ...rest] = features;

  return (
    <HomeSection id="features" labelledBy="features-title">
      <SectionHeader variant="editorial" id="features-title" layout="split" eyebrow={copy.eyebrow} titleA={copy.titleA} titleB={copy.titleB} intro={copy.intro} />

      <motion.div
        variants={stagger(0.08)}
        initial="hidden"
        whileInView="show"
        viewport={REVEAL_VIEWPORT}
        className="mt-14 grid gap-4 md:mt-20 md:grid-cols-2 lg:grid-cols-12 lg:gap-5"
      >
        {/* ── The anchor: deep teal, the one place the grid asks you to focus ───── */}
        <motion.article
          variants={fadeUp(0, 24)}
          className={cn(
            "group relative isolate flex min-w-0 flex-col overflow-hidden rounded-panel border border-teal-800 bg-[linear-gradient(155deg,var(--color-teal-900),var(--color-ink)_95%)] p-7 text-white sm:p-10",
            BENTO[0].span,
          )}
        >
          <Grain />
          <span aria-hidden className="pointer-events-none absolute -end-24 -top-24 -z-10 size-80 rounded-full bg-gold/15 blur-3xl" />
          <span aria-hidden className="pointer-events-none absolute -bottom-32 -start-16 -z-10 size-80 rounded-full bg-teal-500/25 blur-3xl" />

          <div className="flex items-center justify-between gap-3">
            <FeatureIcon feature={lead} dark />
            <span className={cn(LABEL, "text-teal-200")}>{lead.layer}</span>
          </div>
          <h3 className={cn(DISPLAY_M, "mt-8 max-w-lg text-white")}>{lead.title}</h3>
          <p className={cn(BODY, "mt-4 max-w-md text-[1.0625rem] text-teal-100")}>{lead.description}</p>

          <div className="mt-10 flex flex-1 items-end">
            <NeuralMap />
          </div>

          <div className="mt-8 flex flex-wrap items-end justify-between gap-x-8 gap-y-5 border-t border-white/12 pt-6">
            <Stat feature={lead} dark large />
            {/* Legend for the map — the three layers, by label and colour. */}
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {(Object.keys(CATEGORY_INDEX) as Category[]).map((category) => (
                <li key={category} className="inline-flex items-center gap-2 text-[0.8125rem] text-teal-100">
                  <span aria-hidden className="size-2 rounded-full" style={{ background: nodeFill(category) }} />
                  {copy.columns[CATEGORY_INDEX[category]].title}
                </li>
              ))}
            </ul>
          </div>
        </motion.article>

        {/* ── The light cards ─────────────────────────────────────────────── */}
        {rest.map((feature, i) => {
          const layout = BENTO[i + 1];
          const accent = ACCENTS[CATEGORY_ACCENT[feature.category]];
          return (
            <motion.article
              key={feature.title}
              variants={fadeUp(0, 28)}
              className={cn("min-w-0", layout.span)}
            >
              <Spotlight
                tone={feature.category === "insight" ? "gold" : "teal"}
                className={cn(
                  "group flex h-full flex-col overflow-hidden rounded-panel border p-6 transition-[transform,box-shadow,border-color] duration-500 ease-out-soft hover:-translate-y-1.5 hover:shadow-[var(--shadow-soft-hover)] sm:p-7",
                  layout.mint ? "border-teal-100 bg-teal-50/70 hover:border-teal-200" : "border-line bg-white shadow-[var(--shadow-soft)] hover:border-teal-200",
                )}
              >
              <span
                aria-hidden
                className={cn("absolute inset-x-7 top-0 h-px origin-left scale-x-0 transition-transform duration-700 ease-out-soft group-hover:scale-x-100 rtl:origin-right", accent.rule)}
              />
              <div className="flex items-center justify-between gap-3">
                <FeatureIcon feature={feature} />
                <span className={cn(LABEL, accent.text)}>{feature.layer}</span>
              </div>
              <h3 className={cn(DISPLAY_S, "mt-7 text-ink")}>{feature.title}</h3>
              <p className={cn(BODY_SM, "mt-3 max-w-md")}>{feature.description}</p>
              <div className="mt-auto pt-8">
                <div className={cn("border-t pt-5", layout.mint ? "border-teal-100" : "border-line")}>
                  <Stat feature={feature} />
                </div>
              </div>
              </Spotlight>
            </motion.article>
          );
        })}
      </motion.div>
    </HomeSection>
  );
};
