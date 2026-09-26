"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { EASE_OUT, REVEAL_VIEWPORT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { motion, useInView } from "framer-motion";
import {
  Activity,
  BarChart3,
  Brain,
  Eye,
  HeartPulse,
  Lightbulb,
  ShieldCheck,
  Sparkles,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useRef, type PointerEvent } from "react";
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

const ACCENT: Record<Category, { rule: string; icon: string; stat: string; label: string }> = {
  core: { rule: "bg-teal-500", icon: "bg-teal-50 text-teal-700", stat: "text-teal-700", label: "text-teal-700" },
  insight: { rule: "bg-gold", icon: "bg-gold-50 text-gold-700", stat: "text-gold-700", label: "text-gold-700" },
  wellness: { rule: "bg-sage", icon: "bg-sage-50 text-sage-700", stat: "text-sage-700", label: "text-sage-700" },
};

/* Bento rhythm: one hero tile, then a 5 / 4 / 6 cadence. */
const TILE = [
  "md:col-span-2 lg:col-span-7 lg:row-span-2",
  "lg:col-span-5",
  "lg:col-span-5",
  "lg:col-span-4",
  "lg:col-span-4",
  "lg:col-span-4",
  "lg:col-span-6",
  "md:col-span-2 lg:col-span-6",
] as const;

/** Soft light that follows the pointer across a tile (mouse only). */
function trackPointer(event: PointerEvent<HTMLElement>) {
  if (event.pointerType !== "mouse") return;
  const rect = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
  event.currentTarget.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
}

/* Illustrative "emotional map": nodes connect in sequence once visible. */
const NODES: [number, number, Category][] = [
  [40, 120, "core"], [120, 60, "insight"], [150, 150, "core"], [230, 95, "wellness"],
  [300, 160, "insight"], [330, 55, "core"], [410, 115, "wellness"], [470, 60, "insight"],
];
const EDGES: [number, number][] = [[0, 1], [0, 2], [1, 2], [1, 3], [2, 3], [3, 4], [3, 5], [4, 6], [5, 6], [5, 7], [6, 7], [2, 4]];
const NODE_FILL: Record<Category, string> = { core: "var(--color-teal-500)", insight: "var(--color-gold)", wellness: "var(--color-sage)" };

function NeuralMap() {
  const ref = useRef<SVGSVGElement>(null);
  const start = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });

  return (
    <svg ref={ref} viewBox="0 0 510 210" className="h-auto w-full" aria-hidden>
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
          transition={{ duration: 0.8, delay: 0.2 + i * 0.08, ease: EASE_OUT }}
        />
      ))}
      {NODES.map(([x, y, category], i) => (
        <motion.g
          key={`${x}-${y}`}
          initial={{ scale: 0, opacity: 0 }}
          animate={start ? { scale: 1, opacity: 1 } : undefined}
          transition={{ duration: 0.5, delay: 0.1 + i * 0.09, ease: EASE_OUT }}
          style={{ transformOrigin: `${x}px ${y}px` }}
        >
          <circle cx={x} cy={y} r="14" fill={NODE_FILL[category]} opacity="0.14" />
          <circle cx={x} cy={y} r="6" fill={NODE_FILL[category]} stroke="#fff" strokeWidth="2" />
        </motion.g>
      ))}
    </svg>
  );
}

export const Features = () => {
  const { dictionary } = useLanguage();
  const copy = dictionary.homeLanding.features;
  const features = FEATURES_DATA.map((feature, index) => ({
    ...feature,
    title: copy.cards[index][0],
    description: copy.cards[index][1],
    statLabel: copy.cards[index][2],
    layer: copy.columns[CATEGORY_INDEX[feature.category]].title,
  }));

  return (
    <section id="features" className="section-y relative overflow-hidden bg-white">
      <div className="page-container">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            eyebrow={copy.eyebrow}
            icon={<Sparkles className="h-3.5 w-3.5 text-gold-600" aria-hidden />}
            titleA={copy.titleA}
            titleB={copy.titleB}
            intro={copy.intro}
          />
          {/* Legend for the three layers — identity by label + colour, never colour alone. */}
          <ul className="flex flex-wrap gap-2 lg:max-w-sm lg:justify-end">
            {(Object.keys(CATEGORY_INDEX) as Category[]).map((category) => (
              <li key={category} className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink-soft">
                <span aria-hidden className={cn("h-2 w-2 rounded-full", ACCENT[category].rule)} />
                {copy.columns[CATEGORY_INDEX[category]].title}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12 grid gap-4 md:mt-16 md:grid-cols-2 lg:grid-cols-12 lg:gap-5">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            const accent = ACCENT[feature.category];
            const hero = idx === 0;
            return (
              <motion.article
                key={feature.title}
                onPointerMove={trackPointer}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={REVEAL_VIEWPORT}
                transition={{ duration: 0.65, delay: (idx % 3) * 0.08, ease: EASE_OUT }}
                className={cn(
                  "surface-card surface-card-interactive group relative flex min-w-0 flex-col overflow-hidden p-6 sm:p-7",
                  hero && "bg-[linear-gradient(165deg,var(--color-teal-50),#ffffff_55%)] lg:p-9",
                  TILE[idx],
                )}
              >
                {/* Pointer spotlight */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ background: "radial-gradient(22rem circle at var(--spot-x, 50%) var(--spot-y, 50%), rgb(81 133 145 / 0.08), transparent 70%)" }}
                />

                <div className="relative flex items-center justify-between gap-3">
                  <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 ease-out-soft group-hover:scale-105", accent.icon, hero && "h-12 w-12")}>
                    <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                  </span>
                  <span className={cn("text-[0.6875rem] font-semibold uppercase tracking-[0.12em]", accent.label)}>{feature.layer}</span>
                </div>

                <h3 className={cn("relative mt-5 font-semibold leading-snug text-ink", hero ? "text-title font-medium tracking-[-0.02em]" : "text-base")}>
                  {feature.title}
                </h3>
                <p className={cn("relative mt-2 text-ink-muted", hero ? "max-w-md text-base leading-7" : "text-sm leading-6")}>{feature.description}</p>

                {hero && (
                  <div className="relative mt-8 flex flex-1 items-end">
                    <NeuralMap />
                  </div>
                )}

                {!hero && <span aria-hidden className="min-h-5 flex-1" />}
                <p className={cn("relative flex items-baseline gap-2 border-t border-line pt-4", hero && "mt-6")}>
                  <span className={cn("font-semibold tabular-nums", accent.stat, hero ? "text-4xl font-light tracking-[-0.03em]" : "text-xl")} dir="ltr">
                    {feature.stat}
                  </span>
                  <span className="text-xs text-ink-muted">{feature.statLabel}</span>
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
