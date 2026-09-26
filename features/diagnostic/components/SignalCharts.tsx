"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  PolarAngleAxis as RAAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

export type SignalDatum = { key: string; label: string; percent: number; raw: number };

/**
 * Primary comparison chart: a radar/spider chart is the right chart type here
 * because we're comparing 3+ named dimensions (condition scores) against the
 * same 0–100 scale at once — a shape a stack of bars can't show as directly.
 */
export function SignalRadar({ data, label }: { data: SignalDatum[]; label: string }) {
  const reduceMotion = useReducedMotion();
  const chartData = data.map((d) => ({ subject: d.label, value: d.percent, fullMark: 100 }));

  return (
    <div className="h-64 w-full sm:h-72" role="img" aria-label={label}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={chartData} margin={{ top: 8, right: 24, bottom: 8, left: 24 }}>
          <PolarGrid stroke="var(--color-line)" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: "var(--color-ink-soft)", fontSize: 11, fontWeight: 600 }}
          />
          <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name={label}
            dataKey="value"
            stroke="var(--color-teal-600)"
            fill="var(--color-teal-500)"
            fillOpacity={0.32}
            strokeWidth={2}
            isAnimationActive={!reduceMotion}
            animationDuration={900}
            animationEasing="ease-out"
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Exact numeric readout that pairs with the radar — accessible list, one row per condition. */
export function SignalList({ data }: { data: SignalDatum[] }) {
  return (
    <ul className="space-y-1">
      {data.map((item, i) => {
        const strongest = i === 0;
        return (
          <li
            key={item.key}
            title={`${item.label}: ${item.raw.toFixed(3)}`}
            className="flex items-center justify-between gap-3 rounded-xl px-3 py-2 transition-colors duration-200 hover:bg-surface-muted"
          >
            <span className="flex min-w-0 items-center gap-2">
              <span
                aria-hidden
                className={cn("h-1.5 w-1.5 shrink-0 rounded-full", strongest ? "bg-teal-700" : "bg-teal-300")}
              />
              <span className={cn("min-w-0 truncate text-sm", strongest ? "font-semibold text-ink" : "text-ink-soft")}>
                {item.label}
              </span>
            </span>
            <span className="shrink-0 text-sm font-semibold tabular-nums text-ink" dir="ltr">
              {item.percent}
              <span className="text-xs font-normal text-ink-muted">/100</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export function SignalGauge({ percent, label, caption }: { percent: number; label: string; caption: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <figure className="flex flex-col items-center text-center">
      <div className="relative h-32 w-32 sm:h-36 sm:w-36">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            data={[{ name: label, value: percent }]}
            innerRadius="78%"
            outerRadius="100%"
            startAngle={90}
            endAngle={-270}
            barSize={10}
          >
            <RAAxis type="number" domain={[0, 100]} tick={false} axisLine={false} />
            <RadialBar
              dataKey="value"
              cornerRadius={6}
              fill="var(--color-teal-600)"
              background={{ fill: "var(--color-teal-100)" }}
              isAnimationActive={!reduceMotion}
              animationDuration={1100}
              animationEasing="ease-out"
            />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-semibold tabular-nums leading-none text-ink" dir="ltr">
            {percent}
          </span>
          <span className="mt-1 text-[0.6875rem] text-ink-muted">/100</span>
        </div>
      </div>
      <figcaption className="mt-2.5">
        <span className="block text-xs text-ink-muted">{caption}</span>
        <span className="mt-0.5 block text-sm font-semibold text-ink">{label}</span>
      </figcaption>
    </figure>
  );
}

const LEVELS = ["LOW", "MODERATE", "HIGH"] as const;

export function MatchStrengthMeter({
  level,
  label,
  levelLabel,
}: {
  level: (typeof LEVELS)[number];
  label: string;
  levelLabel: string;
}) {
  const filled = LEVELS.indexOf(level) + 1;
  return (
    <div className="min-w-0">
      <p className="text-xs text-ink-muted">{label}</p>
      <div className="mt-1.5 flex items-center gap-3">
        <div
          role="meter"
          aria-label={label}
          aria-valuemin={1}
          aria-valuemax={3}
          aria-valuenow={filled}
          aria-valuetext={levelLabel}
          className="flex gap-1"
        >
          {LEVELS.map((step, i) => (
            <span key={step} className="h-2 w-8 overflow-hidden rounded-full bg-teal-100">
              <motion.span
                className="block h-full origin-left rounded-full bg-teal-600 rtl:origin-right"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: i < filled ? 1 : 0 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.12, ease: EASE_OUT }}
              />
            </span>
          ))}
        </div>
        <span className="text-sm font-semibold text-ink">{levelLabel}</span>
      </div>
    </div>
  );
}