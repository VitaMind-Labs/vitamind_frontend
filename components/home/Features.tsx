"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { EASE_OUT, REVEAL_VIEWPORT, fadeUp, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { motion, useInView } from "framer-motion";
import { Activity, BarChart3, BookOpen, Brain, Compass, FileText, HeartPulse, Target, type LucideIcon } from "lucide-react";
import { useRef } from "react";
import { ACCENTS, type Accent } from "./accents";
import { CountUp } from "./CountUp";
import { HomeSection } from "./HomeSection";
import { SectionHeader } from "./SectionHeader";
import { BODY, BODY_SM, DISPLAY_M, DISPLAY_S, LABEL, SERIF } from "./typography";

type Category = "core" | "insight" | "wellness";

const FEATURES_DATA: { icon: LucideIcon; stat: string; category: Category }[] = [
  { icon: Brain, stat: "5", category: "core" },
  { icon: Compass, stat: "3", category: "core" },
  { icon: HeartPulse, stat: "1min", category: "wellness" },
  { icon: BookOpen, stat: "2", category: "wellness" },
  { icon: Target, stat: "3", category: "wellness" },
  { icon: Activity, stat: "1", category: "insight" },
  { icon: BarChart3, stat: "4wk", category: "insight" },
  { icon: FileText, stat: "30d", category: "insight" },
];

const CATEGORY_INDEX: Record<Category, number> = { core: 0, insight: 1, wellness: 2 };
const CATEGORY_ACCENT: Record<Category, Accent> = { core: "teal", insight: "gold", wellness: "sage" };

type Tone = "deep" | "aqua" | "champagne" | "ivory" | "mist";

/**
 * Each card has its own soft surface from the logo's palette — one deep teal focal card, the rest pale aqua,
 * champagne, mist and ivory — and on hover the card takes a wash of its neighbour's colour.
 */
const TONES: Record<Tone, { surface: string; border: string; wash: string; title: string; body: string; label: string; icon: string; stat: string; rule: string; hoverBorder: string }> = {
  deep: {
    surface: "bg-teal-900",
    border: "border-teal-800",
    wash: "bg-[linear-gradient(150deg,rgb(43_112_128/0.6),transparent_72%)]",
    title: "text-white",
    body: "text-teal-100",
    label: "text-teal-200",
    icon: "border border-white/15 bg-white/10 text-teal-100",
    stat: "text-gold-100",
    rule: "bg-gold",
    hoverBorder: "hover:border-teal-600",
  },
  aqua: {
    surface: "bg-[linear-gradient(155deg,var(--color-teal-100),#ffffff_94%)]",
    border: "border-teal-200",
    wash: "bg-[linear-gradient(155deg,rgb(230_213_170/0.45),transparent_72%)]",
    title: "text-ink",
    body: "text-ink-soft",
    label: "text-teal-700",
    icon: "bg-white text-teal-700",
    stat: "text-teal-700",
    rule: "bg-gold",
    hoverBorder: "hover:border-gold-100",
  },
  champagne: {
    surface: "bg-[linear-gradient(155deg,var(--color-gold-50),#f6eed8_96%)]",
    border: "border-gold-100",
    wash: "bg-[linear-gradient(155deg,rgb(191_221_225/0.55),transparent_72%)]",
    title: "text-ink",
    body: "text-ink-soft",
    label: "text-teal-700",
    icon: "bg-white text-teal-700",
    stat: "text-teal-700",
    rule: "bg-gold",
    hoverBorder: "hover:border-teal-200",
  },
  mist: {
    surface: "bg-[linear-gradient(155deg,var(--color-teal-50),var(--color-teal-100))]",
    border: "border-teal-200",
    wash: "bg-[linear-gradient(155deg,rgb(230_213_170/0.4),transparent_72%)]",
    title: "text-ink",
    body: "text-ink-soft",
    label: "text-teal-700",
    icon: "bg-white text-teal-700",
    stat: "text-teal-700",
    rule: "bg-gold",
    hoverBorder: "hover:border-gold-100",
  },
  ivory: {
    surface: "bg-canvas",
    border: "border-line",
    wash: "bg-[linear-gradient(155deg,rgb(191_221_225/0.5),rgb(230_213_170/0.3)_70%,transparent)]",
    title: "text-ink",
    body: "text-ink-soft",
    label: "text-teal-700",
    icon: "bg-white text-teal-700 ring-1 ring-line",
    stat: "text-teal-700",
    rule: "bg-gold",
    hoverBorder: "hover:border-teal-200",
  },
};

/**
 * An asymmetric bento: the focal card is 7 wide and two rows tall beside a 5-wide pair; then 3 · 5 · 4; then 7 · 5.
 * Spans pair up on tablet and stack on phones.
 */
const BENTO: { span: string; tone: Tone }[] = [
  { span: "md:col-span-2 lg:col-span-7 lg:row-span-2", tone: "deep" },
  { span: "lg:col-span-5", tone: "aqua" },
  { span: "lg:col-span-5", tone: "champagne" },
  { span: "lg:col-span-3", tone: "ivory" },
  { span: "lg:col-span-5", tone: "mist" },
  { span: "lg:col-span-4", tone: "champagne" },
  { span: "lg:col-span-7", tone: "aqua" },
  { span: "md:col-span-2 lg:col-span-5", tone: "ivory" },
];

type Feature = (typeof FEATURES_DATA)[number] & { title: string; description: string; statLabel: string; layer: string; legend: string[] };

/* Illustrative "emotional map": nodes connect in sequence once visible. */
const NODES: [number, number, Category][] = [
  [40, 120, "core"], [120, 60, "insight"], [150, 150, "core"], [230, 95, "wellness"],
  [300, 160, "insight"], [330, 55, "core"], [410, 115, "wellness"], [470, 60, "insight"],
];
const EDGES: [number, number][] = [[0, 1], [0, 2], [1, 2], [1, 3], [2, 3], [3, 4], [3, 5], [4, 6], [5, 6], [5, 7], [6, 7], [2, 4]];

/** On the deep card the "core" teal lifts to the aqua step so it never sinks into the surface. */
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

function FeatureCard({ feature, layout, lead = false }: { feature: Feature; layout: (typeof BENTO)[number]; lead?: boolean }) {
  const tone = TONES[layout.tone];
  const Icon = feature.icon;
  const dark = layout.tone === "deep";

  return (
    <motion.article variants={fadeUp(0, lead ? 24 : 28)} className={cn("min-w-0", layout.span)}>
      <div
        className={cn(
          "group relative isolate flex h-full min-w-0 flex-col overflow-hidden rounded-panel border p-6 transition-[transform,border-color] duration-500 ease-out-soft hover:-translate-y-1.5 sm:p-7",
          lead && "sm:p-10",
          tone.surface,
          tone.border,
          tone.hoverBorder,
        )}
      >
        <span aria-hidden className={cn("pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-700 ease-out-soft group-hover:opacity-100", tone.wash)} />

        <div className="flex items-center justify-between gap-3">
          <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-2xl transition-transform duration-500 ease-out-soft group-hover:-translate-y-0.5", tone.icon)}>
            <Icon className="size-5" strokeWidth={1.5} aria-hidden />
          </span>
          <span className={cn(LABEL, tone.label)}>{feature.layer}</span>
        </div>

        <span aria-hidden className={cn("mt-7 block h-0.5 w-8 rounded-full", tone.rule, lead && "mt-8")} />
        <h3 className={cn(lead ? DISPLAY_M : DISPLAY_S, "mt-4 max-w-lg", tone.title)}>{feature.title}</h3>
        <p className={cn(lead ? cn(BODY, "text-[1.0625rem]") : BODY_SM, "mt-3 max-w-md", tone.body)}>{feature.description}</p>

        {lead ? (
          <div className="mt-10 flex flex-1 items-end">
            <NeuralMap />
          </div>
        ) : null}

        <div className={cn("mt-auto pt-8", lead && "mt-8 pt-0")}>
          <div className={cn("flex flex-wrap items-end justify-between gap-x-8 gap-y-5 border-t pt-5", dark ? "border-white/15" : "border-ink/10")}>
            <p className="flex items-baseline gap-3">
              <span dir="ltr">
                <CountUp
                  value={feature.stat}
                  className={cn(SERIF, "font-normal tabular-nums tracking-[-0.03em]", lead ? "text-[clamp(3rem,4vw+1rem,4.5rem)] font-light leading-none" : "text-[2rem] leading-none", tone.stat)}
                />
              </span>
              <span className={cn("text-[0.875rem]", dark ? "text-teal-100" : "text-ink-soft")}>{feature.statLabel}</span>
            </p>
            {lead ? (
              /* Legend for the map — the three layers, by label and colour. */
              <ul className="flex flex-wrap gap-x-5 gap-y-2">
                {(Object.keys(CATEGORY_INDEX) as Category[]).map((category) => (
                  <li key={category} className="inline-flex items-center gap-2 text-[0.8125rem] text-teal-100">
                    <span aria-hidden className="size-2 rounded-full" style={{ background: nodeFill(category) }} />
                    {feature.legend[CATEGORY_INDEX[category]]}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export const Features = () => {
  const { dictionary } = useLanguage();
  const copy = dictionary.homeLanding.features;
  const legend = copy.columns.map((column) => column.title);
  const features = FEATURES_DATA.map((feature, index) => ({
    ...feature,
    title: copy.cards[index][0],
    description: copy.cards[index][1],
    statLabel: copy.cards[index][2],
    layer: copy.columns[CATEGORY_INDEX[feature.category]].title,
    legend,
  }));

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
        {features.map((feature, index) => (
          <FeatureCard key={feature.title} feature={feature} layout={BENTO[index]} lead={index === 0} />
        ))}
      </motion.div>
    </HomeSection>
  );
};
