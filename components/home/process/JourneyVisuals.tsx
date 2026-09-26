"use client";

import { motion, useReducedMotion, useTransform, type MotionValue } from "framer-motion";
import { Brain, Check, Fingerprint, HeartPulse, Lock, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * One visual per journey step. Every visual is driven by `progress` (0 → 1),
 * which is scroll-scrubbed on desktop and time-animated on mobile.
 */
export type JourneyVisualProps = { progress: MotionValue<number>; details: readonly string[] };

/** Opacity/offset that fade an element in across a slice of the step's progress. */
function useAppear(progress: MotionValue<number>, from: number, to = from + 0.25, distance = 14) {
  const opacity = useTransform(progress, [from, to], [0, 1]);
  const y = useTransform(progress, [from, to], [distance, 0]);
  return { opacity, y };
}

function Chip({ progress, from, className, children }: { progress: MotionValue<number>; from: number; className?: string; children: React.ReactNode }) {
  const style = useAppear(progress, from);
  return (
    <motion.span
      style={style}
      className={cn(
        "absolute inline-flex max-w-[14rem] items-center gap-2 rounded-full border border-line bg-white/95 px-3.5 py-2 text-[0.8125rem] font-medium text-ink shadow-raised backdrop-blur",
        className,
      )}
    >
      {children}
    </motion.span>
  );
}

/* ───────────────────────── 01 · Connect ───────────────────────── */

export function ConnectVisual({ progress, details }: JourneyVisualProps) {
  const reduce = useReducedMotion();
  const lockScale = useTransform(progress, [0, 0.35], [0.6, 1]);
  const scanY = useTransform(progress, [0, 1], ["-40%", "140%"]);
  const lockBadge = useAppear(progress, 0.3, 0.5, 8);

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      {!reduce &&
        [0, 1, 2].map((i) => (
          <motion.span
            key={i}
            aria-hidden
            className="absolute h-32 w-32 rounded-full border border-teal-300"
            initial={{ scale: 1, opacity: 0 }}
            animate={{ scale: [1, 2.8], opacity: [0.55, 0] }}
            transition={{ duration: 3.6, repeat: Infinity, delay: i * 1.2, ease: "easeOut" }}
          />
        ))}
      <span aria-hidden className="absolute h-56 w-56 rounded-full border border-dashed border-teal-200" />

      <motion.div style={{ scale: lockScale }} className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-[2rem] bg-[linear-gradient(145deg,var(--color-teal-500),var(--color-teal-800))] text-white shadow-brand">
        <Fingerprint className="h-14 w-14" strokeWidth={1.25} aria-hidden />
        <motion.span aria-hidden style={{ top: scanY }} className="absolute inset-x-0 h-8 bg-gradient-to-b from-transparent via-white/35 to-transparent" />
      </motion.div>

      <motion.span style={lockBadge} className="absolute top-[calc(50%-5rem)] start-[calc(50%+2.75rem)] flex h-9 w-9 items-center justify-center rounded-full bg-ink text-white shadow-raised">
        <Lock className="h-4 w-4" aria-hidden />
      </motion.span>

      <Chip progress={progress} from={0.15} className="start-[6%] top-[14%]">
        <ShieldCheck className="h-4 w-4 shrink-0 text-sage-700" aria-hidden />
        {details[0]}
      </Chip>
      <Chip progress={progress} from={0.35} className="bottom-[26%] end-[5%]">
        <Check className="h-4 w-4 shrink-0 text-teal-600" aria-hidden />
        {details[1]}
      </Chip>
      <Chip progress={progress} from={0.55} className="bottom-[14%] start-[16%]">
        <Sparkles className="h-4 w-4 shrink-0 text-gold-600" aria-hidden />
        {details[2]}
      </Chip>
    </div>
  );
}

/* ───────────────────────── 02 · Understand ───────────────────────── */

const NODES: [number, number, "teal" | "gold" | "sage"][] = [
  [70, 70, "teal"], [190, 40, "gold"], [300, 90, "teal"], [120, 175, "sage"],
  [250, 200, "gold"], [360, 180, "sage"], [410, 70, "teal"], [60, 260, "gold"], [330, 275, "teal"],
];
const EDGES: [number, number][] = [[0, 1], [1, 2], [0, 3], [3, 4], [2, 4], [4, 5], [2, 6], [5, 6], [3, 7], [4, 8], [5, 8], [1, 3], [7, 4]];
const HUB: [number, number] = [230, 150];
const FILL = { teal: "var(--color-teal-500)", gold: "var(--color-gold)", sage: "var(--color-sage)" } as const;

function Edge({ progress, a, b, i }: { progress: MotionValue<number>; a: [number, number]; b: [number, number]; i: number }) {
  const start = 0.05 + i * 0.04;
  const pathLength = useTransform(progress, [start, start + 0.3], [0, 1]);
  return <motion.line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="var(--color-teal-300)" strokeWidth="1.5" strokeLinecap="round" style={{ pathLength }} />;
}

function Node({ progress, x, y, tone, i }: { progress: MotionValue<number>; x: number; y: number; tone: keyof typeof FILL; i: number }) {
  const start = i * 0.05;
  const scale = useTransform(progress, [start, start + 0.2], [0, 1]);
  return (
    <motion.g style={{ scale, transformOrigin: `${x}px ${y}px` }}>
      <circle cx={x} cy={y} r="16" fill={FILL[tone]} opacity="0.14" />
      <circle cx={x} cy={y} r="6.5" fill={FILL[tone]} stroke="#fff" strokeWidth="2.5" />
    </motion.g>
  );
}

function Spoke({ progress, to, i }: { progress: MotionValue<number>; to: [number, number]; i: number }) {
  const pathLength = useTransform(progress, [0.45 + i * 0.03, 0.8], [0, 1]);
  return <motion.line x1={HUB[0]} y1={HUB[1]} x2={to[0]} y2={to[1]} stroke="var(--color-teal-500)" strokeOpacity="0.35" strokeWidth="1" strokeDasharray="3 5" style={{ pathLength }} />;
}

export function UnderstandVisual({ progress, details }: JourneyVisualProps) {
  const hubScale = useTransform(progress, [0.35, 0.6], [0.5, 1]);
  const hubOpacity = useTransform(progress, [0.35, 0.5], [0, 1]);

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <svg viewBox="0 0 470 320" className="h-full max-h-[22rem] w-full" aria-hidden>
        {EDGES.map(([a, b], i) => (
          <Edge key={`${a}-${b}`} progress={progress} a={[NODES[a][0], NODES[a][1]]} b={[NODES[b][0], NODES[b][1]]} i={i} />
        ))}
        {[0, 2, 4, 6, 8].map((n, i) => (
          <Spoke key={n} progress={progress} to={[NODES[n][0], NODES[n][1]]} i={i} />
        ))}
        {NODES.map(([x, y, tone], i) => (
          <Node key={`${x}-${y}`} progress={progress} x={x} y={y} tone={tone} i={i} />
        ))}
      </svg>
      <motion.span
        style={{ scale: hubScale, opacity: hubOpacity, left: `${(HUB[0] / 470) * 100}%`, top: `${(HUB[1] / 320) * 100}%` }}
        className="absolute flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-primary text-white shadow-brand"
      >
        <Brain className="h-8 w-8" strokeWidth={1.4} aria-hidden />
      </motion.span>

      <Chip progress={progress} from={0.55} className="start-[4%] top-[6%]">
        <span className="h-2 w-2 rounded-full bg-gold" aria-hidden />
        {details[0]}
      </Chip>
      <Chip progress={progress} from={0.65} className="bottom-[8%] end-[4%]">
        <span className="h-2 w-2 rounded-full bg-sage" aria-hidden />
        {details[1]}
      </Chip>
      <Chip progress={progress} from={0.75} className="bottom-[26%] start-[2%]">
        <span className="h-2 w-2 rounded-full bg-teal-500" aria-hidden />
        {details[2]}
      </Chip>
    </div>
  );
}

/* ───────────────────────── 03 · Take action ───────────────────────── */

function ActionCard({ progress, index, children }: { progress: MotionValue<number>; index: number; children: string }) {
  const from = 0.2 + index * 0.18;
  const { opacity, y } = useAppear(progress, from, from + 0.2, 22);
  const tick = useTransform(progress, [from + 0.15, from + 0.28], [0, 1]);
  const fillOpacity = useTransform(progress, [from + 0.15, from + 0.28], [0, 1]);

  return (
    <motion.li style={{ opacity, y }} className="flex items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3.5 shadow-card">
      <span className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-teal-200">
        <motion.span style={{ opacity: fillOpacity }} className="absolute inset-[-2px] rounded-full bg-primary" />
        <svg viewBox="0 0 16 16" className="relative h-3.5 w-3.5" aria-hidden>
          <motion.path d="M3.5 8.5l3 3 6-7" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ pathLength: tick }} />
        </svg>
      </span>
      <span className="min-w-0 text-sm font-medium text-ink">{children}</span>
      <span className="ms-auto text-xs tabular-nums text-ink-subtle" dir="ltr">0{index + 1}</span>
    </motion.li>
  );
}

export function ActionVisual({ progress, details }: JourneyVisualProps) {
  const reduce = useReducedMotion();
  const orbOpacity = useTransform(progress, [0, 0.2], [0, 1]);

  return (
    <div className="grid h-full w-full grid-cols-[auto_minmax(0,1fr)] items-center gap-8 px-2 xl:gap-12">
      <motion.div style={{ opacity: orbOpacity }} className="relative flex h-44 w-44 items-center justify-center xl:h-52 xl:w-52">
        {/* Breathing orb — the 4-4 rhythm of a calm breath. */}
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-full bg-[radial-gradient(circle,var(--color-teal-200),transparent_70%)]"
          animate={reduce ? undefined : { scale: [0.78, 1.08, 0.78] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.span
          aria-hidden
          className="absolute inset-[18%] rounded-full border border-teal-300"
          animate={reduce ? undefined : { scale: [0.9, 1.12, 0.9] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary text-white shadow-brand">
          <HeartPulse className="h-9 w-9" strokeWidth={1.4} aria-hidden />
        </span>
      </motion.div>
      <ul className="space-y-3">
        {details.map((detail, i) => (
          <ActionCard key={detail} progress={progress} index={i}>
            {detail}
          </ActionCard>
        ))}
      </ul>
    </div>
  );
}

/* ───────────────────────── 04 · Track ───────────────────────── */

const TRACK: [number, number][] = [[20, 210], [80, 190], [130, 200], [190, 160], [240, 170], [300, 120], [350, 130], [410, 80], [460, 60]];

function curve(points: [number, number][]) {
  return points.reduce((d, p, i, all) => {
    if (i === 0) return `M ${p[0]} ${p[1]}`;
    const p0 = all[i - 2] ?? all[i - 1];
    const p1 = all[i - 1];
    const p3 = all[i + 1] ?? p;
    return `${d} C ${p1[0] + (p[0] - p0[0]) / 6} ${p1[1] + (p[1] - p0[1]) / 6}, ${p[0] - (p3[0] - p1[0]) / 6} ${p[1] - (p3[1] - p1[1]) / 6}, ${p[0]} ${p[1]}`;
  }, "");
}
const TRACK_LINE = curve(TRACK);
const TRACK_AREA = `${TRACK_LINE} L 460 250 L 20 250 Z`;
const MILESTONES = [2, 5, 8] as const;

function Milestone({ progress, point, index, label }: { progress: MotionValue<number>; point: [number, number]; index: number; label: string }) {
  const from = 0.3 + index * 0.2;
  const scale = useTransform(progress, [from, from + 0.12], [0, 1]);
  const labelStyle = useAppear(progress, from + 0.05, from + 0.2, 8);
  return (
    <>
      <motion.g style={{ scale, transformOrigin: `${point[0]}px ${point[1]}px` }}>
        <circle cx={point[0]} cy={point[1]} r="14" fill="var(--color-gold)" opacity="0.18" />
        <circle cx={point[0]} cy={point[1]} r="6" fill="var(--color-gold-600)" stroke="#fff" strokeWidth="2.5" />
      </motion.g>
      <foreignObject x={Math.min(point[0] - 70, 330)} y={point[1] - 58} width="150" height="40">
        <motion.div style={labelStyle} className="flex justify-center">
          <span className="rounded-full border border-line bg-white px-2.5 py-1 text-[11px] font-medium text-ink shadow-card">{label}</span>
        </motion.div>
      </foreignObject>
    </>
  );
}

export function TrackVisual({ progress, details }: JourneyVisualProps) {
  const pathLength = useTransform(progress, [0.05, 0.85], [0, 1]);
  const areaOpacity = useTransform(progress, [0.4, 0.9], [0, 1]);
  const badge = useAppear(progress, 0.75, 0.95, 10);

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <svg viewBox="0 0 480 260" className="h-full max-h-[20rem] w-full overflow-visible" aria-hidden>
        <defs>
          <linearGradient id="journey-track-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--color-teal-500)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--color-teal-500)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[70, 130, 190].map((y) => (
          <line key={y} x1="10" x2="470" y1={y} y2={y} stroke="var(--color-line)" strokeDasharray="2 6" />
        ))}
        <motion.path d={TRACK_AREA} fill="url(#journey-track-fill)" style={{ opacity: areaOpacity }} />
        <motion.path d={TRACK_LINE} fill="none" stroke="var(--color-teal-600)" strokeWidth="3" strokeLinecap="round" style={{ pathLength }} />
        {MILESTONES.map((pointIndex, i) => (
          <Milestone key={pointIndex} progress={progress} point={TRACK[pointIndex]} index={i} label={details[i] ?? ""} />
        ))}
      </svg>
      <motion.span style={badge} className="absolute end-[4%] top-[4%] flex h-11 w-11 items-center justify-center rounded-2xl bg-ink text-white shadow-raised">
        <TrendingUp className="h-5 w-5" aria-hidden />
      </motion.span>
    </div>
  );
}

export const JOURNEY_VISUALS = [ConnectVisual, UnderstandVisual, ActionVisual, TrackVisual] as const;
