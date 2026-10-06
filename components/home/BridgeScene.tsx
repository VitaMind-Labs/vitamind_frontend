"use client";

import { AgentAvatar } from "@/components/layout/site-header";
import { type HomeBridgeCopy } from "@/lib/i18n/homeStory";
import { cn } from "@/lib/utils";
import { motion, useMotionValue, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Bell, FileText, HeartPulse, Lock, LockOpen, Stethoscope, type LucideIcon } from "lucide-react";
import { useRef, useSyncExternalStore, type ReactNode } from "react";
import { DrawCheck } from "./DrawCheck";
import { DISPLAY_S, LABEL } from "./typography";

/**
 * "The space between consultations", drawn as one short story that follows the scroll.
 *
 *   check-in → private journal → the patient chooses to share → the bridge opens and the data crosses →
 *   the clinician sees the trend leave the patient's own baseline → an alert with a deadline → a person acknowledges →
 *   a report arrives → support travels back.
 *
 * Everything is driven by one 0 → 1 `progress` value, so it can be scrubbed forwards and back. The drawings are
 * deliberately abstract (bars instead of words, no figures): they show how the product moves, not invented patient data.
 * The real copy is the two lists beside the windows; their markers fill as the story reaches them.
 */

type Scene = HomeBridgeCopy;

/** Where each beat of the story starts, as a share of the whole scroll. */
const BEAT = {
  checkin: 0.04,
  journal: 0.15,
  consent: 0.27,
  cross: 0.31,
  trend: 0.44,
  alert: 0.58,
  decide: 0.72,
  report: 0.79,
  support: 0.88,
} as const;

/** A viewport tall and wide enough to hold the pinned stage; anything smaller plays the story as it scrolls past. */
const PIN_QUERY = "(min-width: 1024px) and (min-height: 720px)";

function subscribePin(onChange: () => void) {
  const query = window.matchMedia(PIN_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function usePinnable() {
  return useSyncExternalStore(
    subscribePin,
    () => window.matchMedia(PIN_QUERY).matches,
    () => false,
  );
}

/** `progress` mapped onto [from, to] and clamped: 0 before the beat, 1 once it is over. */
function useBeat(progress: MotionValue<number>, from: number, to: number) {
  return useTransform(progress, [from, to], [0, 1], { clamp: true });
}

/** A rounded bar standing in for a word or a line of text. */
function Bar({ className }: { className?: string }) {
  return <span className={cn("block h-2 rounded-full bg-line-strong", className)} />;
}

/* ───────────────────────────── patient window ───────────────────────────── */

const SCALE = [0, 1, 2, 3, 4] as const;
const PICKED = 3;
const THUMB_TRAVEL = 20;

function PatientWindow({ progress }: { progress: MotionValue<number> }) {
  const tap = useBeat(progress, BEAT.checkin, BEAT.checkin + 0.05);
  const pick = useTransform(tap, [0, 0.6, 1], [0, 1.16, 1]);
  const ripple = useTransform(tap, [0.45, 1], [0, 1], { clamp: true });
  const rippleScale = useTransform(ripple, [0, 1], [0.8, 2]);
  const rippleOpacity = useTransform(ripple, [0, 1], [0.5, 0]);

  const write = useBeat(progress, BEAT.journal, BEAT.consent - 0.01);
  const line1 = useTransform(write, [0, 0.35], [0, 1], { clamp: true });
  const line2 = useTransform(write, [0.2, 0.55], [0, 1], { clamp: true });
  const line3 = useTransform(write, [0.45, 0.8], [0, 1], { clamp: true });
  const line4 = useTransform(write, [0.7, 1], [0, 1], { clamp: true });

  const flip = useBeat(progress, BEAT.consent, BEAT.consent + 0.03);
  const thumb = useTransform(flip, [0, 1], [0, THUMB_TRAVEL]);

  const comfort = useBeat(progress, BEAT.support, BEAT.support + 0.06);
  const comfortY = useTransform(comfort, [0, 1], [10, 0]);

  return (
    <div aria-hidden className="flex h-full flex-col gap-3 rounded-[1.5rem] border border-teal-200 bg-[linear-gradient(160deg,var(--color-teal-50),#ffffff_70%)] p-4 shadow-float sm:p-5">
      {/* Lumina's check-in: five steps, one gets picked */}
      <div className="flex items-center gap-3">
        <AgentAvatar agent="lumina" className="size-9 rounded-xl ring-1 ring-teal-100" />
        <Bar className="w-20 bg-teal-100" />
      </div>
      <div className="flex items-center justify-between gap-2 px-1">
        {SCALE.map((step) => (
          <span key={step} className="relative flex size-10 items-center justify-center rounded-full border border-teal-200 bg-white">
            {step === PICKED ? (
              <>
                <motion.span className="absolute inset-0 rounded-full border border-teal-400" style={{ scale: rippleScale, opacity: rippleOpacity }} />
                <motion.span className="absolute -inset-px rounded-full bg-teal-600 shadow-brand" style={{ scale: pick }} />
                <motion.span className="relative size-2 rounded-full bg-white" style={{ scale: tap }} />
              </>
            ) : (
              <span className="size-1.5 rounded-full bg-teal-200" />
            )}
          </span>
        ))}
      </div>

      {/* The private journal: lines that write themselves */}
      <div className="relative rounded-2xl border border-line bg-white p-4">
        <Lock className="absolute end-3 top-3 size-3.5 text-teal-500" strokeWidth={2} />
        <div className="space-y-2.5 pe-6">
          <motion.span className="block h-2 w-full origin-left rounded-full bg-teal-200 rtl:origin-right" style={{ scaleX: line1 }} />
          <motion.span className="block h-2 w-4/5 origin-left rounded-full bg-teal-100 rtl:origin-right" style={{ scaleX: line2 }} />
          <motion.span className="block h-2 w-3/5 origin-left rounded-full bg-teal-100 rtl:origin-right" style={{ scaleX: line3 }} />
          <motion.span className="block h-2 w-2/5 origin-left rounded-full bg-teal-100 rtl:origin-right" style={{ scaleX: line4 }} />
        </div>
      </div>

      {/* The patient's choice: nothing crosses until this is on */}
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-white px-3.5 py-2.5">
        <div className="flex items-center gap-2.5">
          <span className="flex size-7 items-center justify-center rounded-full bg-teal-50 text-teal-700">
            <Stethoscope className="size-3.5" strokeWidth={2} />
          </span>
          <Bar className="w-16" />
        </div>
        {/* Mirrored in RTL so the knob always travels from the reading start to the end. */}
        <span className="relative flex h-6 w-11 shrink-0 items-center rounded-full bg-line-strong p-0.5 rtl:-scale-x-100">
          <motion.span className="absolute inset-0 rounded-full bg-teal-600" style={{ opacity: flip }} />
          <motion.span className="relative size-5 rounded-full bg-white shadow-xs" style={{ x: thumb }} />
        </span>
      </div>

      {/* Support comes back: a soft card that settles in at the end */}
      <div className="relative mt-auto rounded-2xl border border-dashed border-teal-200 p-3">
        <motion.div style={{ opacity: comfort, y: comfortY }} className="flex items-center gap-3 rounded-xl bg-[linear-gradient(120deg,var(--color-gold-50),var(--color-teal-50))] p-3 ring-1 ring-gold/30">
          <span className="relative flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-gold-600">
            <Breath />
            <HeartPulse className="relative size-4" strokeWidth={2} />
          </span>
          <div className="min-w-0 flex-1 space-y-2">
            <Bar className="w-3/4 bg-gold/40" />
            <Bar className="w-1/2 bg-gold/25" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/** A ring that slowly breathes out from its parent. Still under reduced motion. */
function Breath() {
  const reduce = useReducedMotion();
  if (reduce) return <span className="absolute inset-0 rounded-full border border-gold/50" />;
  return (
    <motion.span
      className="absolute inset-0 rounded-full border border-gold"
      animate={{ scale: [1, 1.55], opacity: [0.6, 0] }}
      transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut" }}
    />
  );
}

/* ───────────────────────────── clinician window ──────────────────────────── */

/** One trend, day by day: steady inside the patient's own band, then it leaves it. */
const TREND = [50, 46, 51, 47, 49, 45, 50, 52, 57, 66, 75, 80, 78, 82] as const;
const CHART_W = 260;
const CHART_H = 96;
const BAND = { top: 34, bottom: 62 } as const;
const STEP = CHART_W / (TREND.length - 1);
/** The first day outside the band: where the flag lands. */
const FLAG_AT = TREND.findIndex((value) => value > BAND.bottom);

const POINTS = TREND.map((y, i) => [i * STEP, y] as const);

/** A smooth line through every point (Catmull-Rom as cubic Béziers), so the flag sits exactly on it. */
const TREND_PATH = POINTS.reduce((d, [x, y], i, all) => {
  if (i === 0) return `M ${x} ${y}`;
  const [x0, y0] = all[i - 2] ?? all[i - 1];
  const [x1, y1] = all[i - 1];
  const [x3, y3] = all[i + 1] ?? [x, y];
  const c1 = [x1 + (x - x0) / 6, y1 + (y - y0) / 6];
  const c2 = [x - (x3 - x1) / 6, y - (y3 - y1) / 6];
  return `${d} C ${c1[0].toFixed(1)} ${c1[1].toFixed(1)}, ${c2[0].toFixed(1)} ${c2[1].toFixed(1)}, ${x.toFixed(1)} ${y}`;
}, "");

/** How far along the line the flag is (by chord length), so the dot arrives as the stroke reaches it. */
const FLAG_SHARE = (() => {
  const chord = (to: number) => POINTS.slice(1, to + 1).reduce((sum, [x, y], i) => sum + Math.hypot(x - POINTS[i][0], y - POINTS[i][1]), 0);
  return chord(FLAG_AT) / chord(POINTS.length - 1);
})();

const RING = 2 * Math.PI * 13;

function ClinicianWindow({ progress }: { progress: MotionValue<number> }) {
  const draw = useBeat(progress, BEAT.trend, BEAT.alert - 0.02);
  const flag = useTransform(draw, [FLAG_SHARE - 0.02, FLAG_SHARE + 0.04], [0, 1], { clamp: true });
  const flagScale = useTransform(flag, [0, 0.6, 1], [0.4, 1.25, 1]);

  const raise = useBeat(progress, BEAT.alert, BEAT.alert + 0.04);
  const raiseY = useTransform(raise, [0, 1], [12, 0]);
  const wait = useBeat(progress, BEAT.alert + 0.02, BEAT.decide);
  const ringOffset = useTransform(wait, [0, 1], [0, RING * 0.62]);
  const decided = useBeat(progress, BEAT.decide, BEAT.decide + 0.04);
  const decidedScale = useTransform(decided, [0, 1], [0.6, 1]);

  const arrive = useBeat(progress, BEAT.report, BEAT.report + 0.05);
  const arriveX = useTransform(arrive, [0, 1], [-14, 0]);

  return (
    <div aria-hidden className="flex h-full flex-col gap-3 rounded-[1.5rem] border border-sage-100 bg-[linear-gradient(160deg,var(--color-sage-50),#ffffff_70%)] p-4 shadow-float sm:p-5">
      <div className="flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-xl bg-white text-sage-700 ring-1 ring-sage-100">
          <Stethoscope className="size-[1.125rem]" strokeWidth={1.75} />
        </span>
        <Bar className="w-24 bg-sage-100" />
      </div>

      {/* The trend, against this patient's own baseline */}
      <div className="rounded-2xl border border-line bg-white px-3 pb-2 pt-3">
        <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} className="block h-auto w-full overflow-visible rtl:-scale-x-100">
          <rect x="0" y={BAND.top} width={CHART_W} height={BAND.bottom - BAND.top} rx="8" className="fill-sage-100/70" />
          <line x1="0" x2={CHART_W} y1={(BAND.top + BAND.bottom) / 2} y2={(BAND.top + BAND.bottom) / 2} className="stroke-sage/60" strokeWidth="1" strokeDasharray="2 5" />
          <motion.path d={TREND_PATH} fill="none" className="stroke-teal-600" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ pathLength: draw }} />
          <motion.g style={{ opacity: flag, scale: flagScale, transformBox: "fill-box", transformOrigin: "center" }}>
            <circle cx={FLAG_AT * STEP} cy={TREND[FLAG_AT]} r="9" className="fill-gold/25" />
            <circle cx={FLAG_AT * STEP} cy={TREND[FLAG_AT]} r="4.5" className="fill-gold stroke-white" strokeWidth="2" />
          </motion.g>
        </svg>
      </div>

      {/* The alert, with a deadline that runs down until a person answers */}
      <motion.div style={{ opacity: raise, y: raiseY }} className="flex items-center gap-3 rounded-2xl border border-gold/40 bg-white px-3.5 py-2.5">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gold-50 text-gold-700">
          <Bell className="size-4" strokeWidth={2} />
        </span>
        <div className="min-w-0 flex-1 space-y-2">
          <Bar className="w-3/4 bg-gold/35" />
          <Bar className="w-1/2 bg-gold/20" />
        </div>
        <span className="relative flex size-9 shrink-0 items-center justify-center">
          <svg viewBox="0 0 32 32" className="absolute inset-0 size-full -rotate-90">
            <circle cx="16" cy="16" r="13" fill="none" className="stroke-line-strong" strokeWidth="3" />
            <motion.circle cx="16" cy="16" r="13" fill="none" className="stroke-gold" strokeWidth="3" strokeLinecap="round" strokeDasharray={RING} style={{ strokeDashoffset: ringOffset }} />
            <motion.circle cx="16" cy="16" r="13" fill="none" className="stroke-teal-600" strokeWidth="3" style={{ opacity: decided }} />
          </svg>
          <motion.span style={{ opacity: decided, scale: decidedScale }} className="relative text-teal-700">
            <DrawCheck progress={decided} className="size-4" />
          </motion.span>
        </span>
      </motion.div>

      {/* The report, only once the patient has agreed to share */}
      <div className="relative mt-auto rounded-2xl border border-dashed border-sage-100 p-3">
        <motion.div style={{ opacity: arrive, x: arriveX }} className="flex items-center gap-3 rounded-xl bg-white p-3 ring-1 ring-sage-100">
          <span className="relative flex size-9 shrink-0 items-center justify-center rounded-lg bg-sage-50 text-sage-700">
            <FileText className="size-[1.125rem]" strokeWidth={1.75} />
            <span className="absolute -bottom-1 -end-1 flex size-4 items-center justify-center rounded-full bg-teal-600 text-white ring-2 ring-white">
              <LockOpen className="size-2.5" strokeWidth={2.5} />
            </span>
          </span>
          <div className="min-w-0 flex-1 space-y-2">
            <Bar className="w-2/3 bg-sage-100" />
            <Bar className="w-2/5 bg-sage-100/70" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ──────────────────────────────── the bridge ─────────────────────────────── */

type Axis = "x" | "y";

/** A light that crosses the bridge, along whichever axis it currently runs. */
function Packet({ progress, start, end, back, tone, axis }: { progress: MotionValue<number>; start: number; end: number; back?: boolean; tone: "gold" | "teal"; axis: Axis }) {
  const t = useBeat(progress, start, end);
  const position = useTransform(t, [0, 1], back ? ["100%", "0%"] : ["0%", "100%"]);
  const opacity = useTransform(t, [0, 0.12, 0.88, 1], [0, 1, 1, 0]);
  return (
    <motion.span
      className={cn(
        "absolute rounded-full",
        axis === "x" ? "top-1/2 -translate-y-1/2" : "left-1/2 -translate-x-1/2",
        tone === "gold" ? "size-2.5 bg-gold shadow-[0_0_14px_3px_rgb(201_175_111/0.6)]" : "size-2 bg-teal-400 shadow-[0_0_12px_3px_rgb(134_186_188/0.6)]",
      )}
      style={axis === "x" ? { left: position, opacity } : { top: position, opacity }}
    />
  );
}

/** Both orientations of one packet: the bridge is vertical between stacked windows and horizontal beside them. */
function Packets({ progress, start, end, back, tone }: { progress: MotionValue<number>; start: number; end: number; back?: boolean; tone: "gold" | "teal" }) {
  return (
    <>
      <span className="lg:hidden">
        <Packet progress={progress} start={start} end={end} back={back} tone={tone} axis="y" />
      </span>
      <span className="hidden lg:block">
        <Packet progress={progress} start={start} end={end} back={back} tone={tone} axis="x" />
      </span>
    </>
  );
}

const DASHES_X = "bg-[repeating-linear-gradient(90deg,var(--color-line-strong)_0_6px,transparent_6px_12px)]";
const DASHES_Y = "bg-[repeating-linear-gradient(180deg,var(--color-line-strong)_0_6px,transparent_6px_12px)]";

function Bridge({ progress, label }: { progress: MotionValue<number>; label: string }) {
  const open = useBeat(progress, BEAT.consent + 0.02, BEAT.cross + 0.08);
  const gate = useBeat(progress, BEAT.consent + 0.01, BEAT.consent + 0.04);
  const closedOpacity = useTransform(gate, [0, 1], [1, 0]);
  const halo = useBeat(progress, BEAT.trend, BEAT.alert);

  return (
    <div className="relative flex flex-col items-center justify-center py-10 lg:block lg:h-full lg:py-0">
      {/* The line itself, mirrored for right-to-left reading, with everything that travels along it */}
      <span
        aria-hidden
        className="absolute inset-y-0 start-1/2 w-px -translate-x-1/2 lg:inset-x-0 lg:inset-y-auto lg:start-0 lg:top-1/2 lg:h-px lg:w-full lg:translate-x-0 lg:-translate-y-1/2 rtl:lg:-scale-x-100"
      >
        {/* Closed: dashes. Open: it fills teal to gold. */}
        <span className={cn("absolute inset-0 lg:hidden", DASHES_Y)} />
        <span className={cn("absolute inset-0 hidden lg:block", DASHES_X)} />
        <motion.span className="absolute inset-0 origin-top bg-gradient-to-b from-teal-600 to-gold lg:hidden" style={{ scaleY: open }} />
        <motion.span className="absolute inset-0 hidden origin-left bg-gradient-to-r from-teal-600 to-gold lg:block" style={{ scaleX: open }} />

        {/* The data crosses a little at a time, and support comes back */}
        {[0, 0.025, 0.05].map((offset) => (
          <Packets key={offset} progress={progress} start={BEAT.cross + offset} end={BEAT.cross + 0.13 + offset} tone="gold" />
        ))}
        <Packets progress={progress} start={BEAT.support - 0.02} end={BEAT.support + 0.1} back tone="teal" />
      </span>

      {/* The gate: closed until the patient agrees */}
      <span
        aria-hidden
        className="absolute start-1/2 top-3 z-10 flex size-9 -translate-x-1/2 items-center justify-center rounded-full border border-line-strong bg-white shadow-soft lg:start-0 lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-0"
      >
        <motion.span className="absolute text-ink-subtle" style={{ opacity: closedOpacity }}>
          <Lock className="size-4" strokeWidth={2} />
        </motion.span>
        <motion.span className="absolute text-teal-700" style={{ opacity: gate }}>
          <LockOpen className="size-4" strokeWidth={2} />
        </motion.span>
      </span>

      <span className="relative z-10 flex max-w-full items-center gap-2.5 rounded-full border border-gold/50 bg-white px-4 py-2.5 text-center text-[0.8125rem] font-semibold leading-snug text-ink shadow-soft lg:absolute lg:inset-x-3 lg:bottom-[calc(50%+1.5rem)] lg:mx-auto lg:w-fit lg:max-w-[calc(100%-1.5rem)]">
        <motion.span aria-hidden className="pointer-events-none absolute -inset-1.5 rounded-full border border-gold/60" style={{ opacity: halo }} />
        <span aria-hidden className="size-2.5 shrink-0 rounded-full bg-gold" />
        {label}
      </span>
    </div>
  );
}

/* ─────────────────────────── the two lists, in step ───────────────────────── */

/** One line of the real copy. Its marker fills (and draws its tick) when the story reaches it. */
function Point({ progress, at, tone, children }: { progress: MotionValue<number>; at: number; tone: "teal" | "sage"; children: ReactNode }) {
  const reached = useBeat(progress, at, at + 0.04);
  const pop = useTransform(reached, [0, 0.6, 1], [1, 1.2, 1]);
  const sage = tone === "sage";
  return (
    <li className="flex items-start gap-3 text-[0.9375rem] leading-6 text-ink-soft">
      <motion.span
        aria-hidden
        style={{ scale: pop }}
        className={cn("relative mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border bg-white", sage ? "border-sage" : "border-teal-300")}
      >
        <motion.span className={cn("absolute -inset-px rounded-full", sage ? "bg-sage-700" : "bg-teal-600")} style={{ opacity: reached }} />
        <motion.span className="relative flex text-white" style={{ opacity: reached }}>
          <DrawCheck progress={reached} className="size-3" />
        </motion.span>
      </motion.span>
      {children}
    </li>
  );
}

/* ───────────────────────────────── the stage ──────────────────────────────── */

type Side = Scene["patient"];

function SideHeader({ icon: Icon, side, tone, className }: { icon: LucideIcon; side: Side; tone: "teal" | "sage"; className?: string }) {
  const sage = tone === "sage";
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <span className={cn("flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-xs ring-1", sage ? "text-sage-700 ring-sage-100" : "text-teal-700 ring-teal-100")}>
        <Icon className="size-6" strokeWidth={1.6} aria-hidden />
      </span>
      <div className="min-w-0">
        <p className={cn(LABEL, sage ? "text-sage-700" : "text-teal-700")}>{side.label}</p>
        <h3 className={cn(DISPLAY_S, "mt-1 text-ink")}>{side.title}</h3>
      </div>
    </div>
  );
}

/** At which beat each line of copy is true, in the order the copy lists them. */
const PATIENT_AT = [BEAT.checkin, BEAT.journal, BEAT.support] as const;
const CLINICIAN_AT = [BEAT.trend, BEAT.alert, BEAT.report] as const;

function Stage({ progress, copy }: { progress: MotionValue<number>; copy: Scene }) {
  /* On a wide screen both sides and the bridge share three rows (heading, window, list), so the bridge meets the windows' middle. */
  return (
    <div className="grid w-full gap-5 lg:grid-cols-[minmax(0,1fr)_17rem_minmax(0,1fr)] lg:grid-rows-[auto_minmax(0,1fr)_auto] lg:gap-y-5">
      <div className="flex flex-col gap-5 lg:contents">
        <SideHeader icon={HeartPulse} side={copy.patient} tone="teal" className="lg:col-start-1 lg:row-start-1" />
        <div className="lg:col-start-1 lg:row-start-2 lg:h-full">
          <PatientWindow progress={progress} />
        </div>
        <ul className="space-y-3 lg:col-start-1 lg:row-start-3">
          {copy.patient.points.map((point, i) => (
            <Point key={point} progress={progress} tone="teal" at={PATIENT_AT[i] ?? BEAT.support}>
              {point}
            </Point>
          ))}
        </ul>
      </div>

      <div className="lg:col-start-2 lg:row-start-2 lg:h-full">
        <Bridge progress={progress} label={copy.link} />
      </div>

      <div className="flex flex-col gap-5 lg:contents">
        <SideHeader icon={Stethoscope} side={copy.clinician} tone="sage" className="lg:col-start-3 lg:row-start-1" />
        <div className="lg:col-start-3 lg:row-start-2 lg:h-full">
          <ClinicianWindow progress={progress} />
        </div>
        <ul className="space-y-3 lg:col-start-3 lg:row-start-3">
          {copy.clinician.points.map((point, i) => (
            <Point key={point} progress={progress} tone="sage" at={CLINICIAN_AT[i] ?? BEAT.report}>
              {point}
            </Point>
          ))}
        </ul>
      </div>
    </div>
  );
}

/**
 * Pins the stage while the story plays on a roomy screen; on anything smaller it is an ordinary block that plays as it
 * passes through the viewport. Under reduced motion the finished picture is simply shown.
 */
export function BridgeScene({ copy }: { copy: Scene }) {
  const reduce = useReducedMotion();
  const roomy = usePinnable();
  const pinned = roomy && !reduce;
  const mode = reduce ? "still" : pinned ? "pinned" : "flow";

  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  // Pinned: the whole scroll through the tall wrapper. Otherwise: the stage crossing the viewport.
  const { scrollYProgress: pinProgress } = useScroll({ target: wrapRef, offset: ["start 88px", "end end"] });
  const { scrollYProgress: flowProgress } = useScroll({ target: stageRef, offset: ["start 85%", "end 55%"] });
  const still = useMotionValue(1);
  const progress = mode === "still" ? still : mode === "pinned" ? pinProgress : flowProgress;

  return (
    <div ref={wrapRef} className={cn("mt-12 lg:mt-16", pinned && "h-[260svh]")}>
      <div ref={stageRef} className={cn(pinned && "sticky top-[88px] flex h-[calc(100svh-7rem)] items-center")}>
        {/* Keyed by mode: a different driver means a fresh set of derived values. */}
        <Stage key={mode} progress={progress} copy={copy} />
      </div>
    </div>
  );
}
