"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { EASE_OUT, REVEAL_VIEWPORT, fadeUp, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useInView, useMotionTemplate, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { BookOpen, Check, ClipboardCheck, HeartPulse, Lock, Minus, Target, TrendingUp, X, type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { pad } from "./accents";
import { HomeSection } from "./HomeSection";
import { SectionHeader } from "./SectionHeader";
import { BODY, BODY_SM, DISPLAY_M, LABEL, SERIF } from "./typography";

/* The brand teal and the hairline, as hex: framer animates colour, not CSS variables. */
const TEAL = "#2b7080";
const TRACK = "#dfe9ea";

/** An illustrative day, as in the daily check-in: 1–5 scales and sleep in hours. */
const DAY = { values: [3, 2, 2, 4], sleep: 5.5 } as const;
/** Weekly focus across a month (1–5), against a personal baseline of 3.7. */
const FOCUS = [3.8, 3.5, 3.1, 2.8] as const;
const BASELINE = 3.7;

const GOAL_ICONS: LucideIcon[] = [Check, Minus, X];
const GOAL_TONES = ["bg-teal-600 text-white", "bg-teal-200 text-teal-800", "bg-surface-muted text-ink-muted ring-1 ring-line-strong"] as const;
const OUTCOME_ICONS: LucideIcon[] = [TrendingUp, ClipboardCheck, Lock];

/** Splits `text` around the given marks (kept in reading order). */
function segments(text: string, marks: readonly string[]) {
  const found = marks
    .map((mark) => ({ mark, at: text.indexOf(mark) }))
    .filter((item) => item.at >= 0)
    .sort((a, b) => a.at - b.at);
  const out: { text: string; marked: boolean }[] = [];
  let cursor = 0;
  for (const { mark, at } of found) {
    if (at < cursor) continue;
    if (at > cursor) out.push({ text: text.slice(cursor, at), marked: false });
    out.push({ text: mark, marked: true });
    cursor = at + mark.length;
  }
  if (cursor < text.length) out.push({ text: text.slice(cursor), marked: false });
  return out;
}

/** Five answers, in a few seconds: each row fills its dots in turn once the card is in view. */
function CheckinBody() {
  const { dictionary } = useLanguage();
  const copy = dictionary.homeLanding.ritual.capture.checkin;
  const reduce = useReducedMotion();
  const ref = useRef<HTMLUListElement>(null);
  const seen = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const on = seen || !!reduce;

  return (
    <ul ref={ref} className="space-y-3.5">
      {copy.rows.map((row, r) => {
        const sleep = r === copy.rows.length - 1;
        return (
          <li key={row} className="flex items-center gap-3">
            <span className="w-[4.5rem] shrink-0 text-[0.8125rem] font-medium text-ink-soft">{row}</span>
            {sleep ? (
              <span className="relative h-2 flex-1 overflow-hidden rounded-full" style={{ background: TRACK }}>
                <motion.span
                  className="absolute inset-y-0 start-0 rounded-full bg-teal-600"
                  initial={reduce ? false : { width: 0 }}
                  animate={{ width: on ? `${(DAY.sleep / 10) * 100}%` : 0 }}
                  transition={{ duration: 1, delay: r * 0.12, ease: EASE_OUT }}
                />
              </span>
            ) : (
              <span className="flex flex-1 items-center gap-1.5" dir="ltr">
                {[0, 1, 2, 3, 4].map((dot) => (
                  <motion.span
                    key={dot}
                    className="h-2 flex-1 rounded-full"
                    initial={reduce ? false : { backgroundColor: TRACK }}
                    animate={{ backgroundColor: on && dot < DAY.values[r] ? TEAL : TRACK }}
                    transition={{ duration: 0.5, delay: r * 0.12 + dot * 0.07, ease: EASE_OUT }}
                  />
                ))}
              </span>
            )}
            <span className="w-10 shrink-0 text-end text-[0.8125rem] tabular-nums text-ink" dir="ltr">
              {sleep ? `${DAY.sleep}${copy.hoursUnit}` : `${DAY.values[r]}/5`}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

/** The sentence, with the words it is read from marked as they are noticed, then the context drawn from it. */
function JournalBody() {
  const { dictionary } = useLanguage();
  const copy = dictionary.homeLanding.ritual.capture.journal;
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const on = seen || !!reduce;
  const parts = segments(copy.entry, copy.marks);
  let markIndex = 0;

  return (
    <div ref={ref}>
      <p className="font-[family-name:var(--font-home-serif)] text-[1.1875rem] font-light leading-[1.75] text-ink rtl:font-sans rtl:leading-[2]">
        {parts.map((part, i) => {
          if (!part.marked) return <span key={i}>{part.text}</span>;
          const order = markIndex++;
          return (
            <motion.mark
              key={i}
              className="rounded-sm bg-transparent bg-[linear-gradient(var(--color-teal-200),var(--color-teal-200))] bg-no-repeat px-0.5 text-ink [background-position:left_100%] rtl:[background-position:right_100%]"
              initial={reduce ? false : { backgroundSize: "0% 100%" }}
              animate={{ backgroundSize: on ? "100% 100%" : "0% 100%" }}
              transition={{ duration: 0.9, delay: 0.5 + order * 0.6, ease: EASE_OUT }}
            >
              {part.text}
            </motion.mark>
          );
        })}
      </p>
      <ul className="mt-5 flex flex-wrap gap-2">
        {copy.chips.map((chip, i) => (
          <motion.li
            key={chip}
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: on ? 1 : 0, y: on ? 0 : 6 }}
            transition={{ duration: 0.5, delay: 1.5 + i * 0.12, ease: EASE_OUT }}
            className="rounded-full border border-teal-200 bg-white px-3 py-1 text-[0.8125rem] font-medium text-teal-800"
          >
            {chip}
          </motion.li>
        ))}
      </ul>
      <p className="mt-4 text-[0.8125rem] leading-6 text-ink-muted">{copy.note}</p>
    </div>
  );
}

/** Each goal resolves to one of its states — here completed, partial, missed. */
function GoalsBody() {
  const { dictionary } = useLanguage();
  const copy = dictionary.homeLanding.ritual.capture.goals;
  const reduce = useReducedMotion();
  const ref = useRef<HTMLUListElement>(null);
  const seen = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const on = seen || !!reduce;

  return (
    <ul ref={ref} className="space-y-3">
      {copy.items.map((goal, i) => {
        const Icon = GOAL_ICONS[i];
        return (
          <li key={goal} className="flex items-center gap-3 rounded-xl border border-line bg-white px-3.5 py-3">
            <motion.span
              aria-hidden
              initial={reduce ? false : { scale: 0.4, opacity: 0 }}
              animate={{ scale: on ? 1 : 0.4, opacity: on ? 1 : 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.4 + i * 0.4 }}
              className={cn("flex size-7 shrink-0 items-center justify-center rounded-full", GOAL_TONES[i])}
            >
              <Icon className="size-3.5" strokeWidth={2.25} />
            </motion.span>
            <span className="min-w-0 flex-1 text-[0.9375rem] text-ink">{goal}</span>
            <motion.span
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: on ? 1 : 0 }}
              transition={{ duration: 0.5, delay: 0.6 + i * 0.4 }}
              className="shrink-0 text-[0.75rem] font-medium text-ink-muted"
            >
              {copy.statuses[i]}
            </motion.span>
          </li>
        );
      })}
    </ul>
  );
}

const CHART = { width: 480, height: 200, top: 24, scale: 80, max: 4.4, xs: [60, 180, 300, 420] as const };
const yOf = (value: number) => CHART.top + (CHART.max - value) * CHART.scale;
const segment = (index: number) => {
  const [x1, x2] = [CHART.xs[index], CHART.xs[index + 1]];
  const [y1, y2] = [yOf(FOCUS[index]), yOf(FOCUS[index + 1])];
  const mid = (x1 + x2) / 2;
  return `M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`;
};

/** Weeks, one by one: your own line against your own baseline. Drag the scrubber, or let it play once. */
function Understand() {
  const { dictionary } = useLanguage();
  const copy = dictionary.homeLanding.ritual.understand;
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });
  const [week, setWeek] = useState(1);
  const [touched, setTouched] = useState(false);
  const shown = reduce && !touched ? FOCUS.length : week;

  useEffect(() => {
    if (!seen || reduce || touched) return;
    const timers = [2, 3, 4].map((next, i) => window.setTimeout(() => setWeek(next), 900 + i * 1300));
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [seen, reduce, touched]);

  const bandTop = yOf(BASELINE + 0.4);
  const bandBottom = yOf(BASELINE - 0.4);
  const fill = ((shown - 1) / (FOCUS.length - 1)) * 100;

  return (
    <motion.div
      ref={ref}
      variants={fadeUp(0, 28)}
      className="relative mt-5 grid gap-10 overflow-hidden rounded-panel border border-line bg-white p-6 sm:p-9 lg:grid-cols-12 lg:gap-12 lg:p-12"
    >
      <span aria-hidden className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-teal-300 via-gold to-gold-100" />

      <div className="lg:col-span-5">
        <p className={cn(LABEL, "flex items-center gap-3 text-gold-700")}>
          <span aria-hidden className="h-px w-8 bg-gold" />
          {copy.eyebrow}
        </p>
        <h3 className="mt-5 font-[family-name:var(--font-home-serif)] text-[clamp(1.75rem,1.6vw+1.3rem,2.5rem)] font-light leading-[1.12] tracking-[-0.02em] text-ink rtl:font-sans rtl:font-semibold rtl:tracking-normal">
          {copy.name}
        </h3>
        <p className="mt-4 max-w-md text-[1.0625rem] leading-8 text-ink-soft">{copy.body}</p>

        <ul className="mt-6 flex flex-wrap gap-2">
          {copy.tags.map((tag) => (
            <li key={tag} className="rounded-full border border-teal-200 bg-teal-50 px-3.5 py-1.5 text-[0.8125rem] font-medium text-teal-800">
              {tag}
            </li>
          ))}
        </ul>

        <div className="mt-8 rounded-2xl border border-line bg-surface-muted p-5">
          <p className="text-[0.9375rem] leading-7 text-ink-soft">{copy.pattern}</p>
          <p className={cn(LABEL, "mt-3 text-ink-muted")}>{copy.illustrative}</p>
        </div>
      </div>

      <div className="lg:col-span-7">
        <div className="flex items-baseline justify-between gap-4">
          <p className="text-[0.9375rem] font-semibold text-ink">{copy.metric}</p>
          <p className="text-[0.8125rem] tabular-nums text-ink-soft" dir="ltr">
            {copy.week} {shown} · <span className="font-semibold text-ink">{FOCUS[shown - 1].toFixed(1)}</span> / 5
          </p>
        </div>

        <div dir="ltr" className="mt-4">
          <svg viewBox={`0 0 ${CHART.width} ${CHART.height}`} role="img" aria-label={`${copy.metric}: ${FOCUS.join(" → ")}`} className="h-auto w-full overflow-visible">
            {/* Personal baseline: the usual range, and its centre */}
            <rect x="0" y={bandTop} width={CHART.width} height={bandBottom - bandTop} rx="10" fill="var(--color-teal-100)" opacity="0.7" />
            <line x1="0" x2={CHART.width} y1={yOf(BASELINE)} y2={yOf(BASELINE)} stroke="var(--color-teal-400)" strokeWidth="1.25" strokeDasharray="4 5" />

            {[0, 1, 2].map((index) => (
              <motion.path
                key={index}
                d={segment(index)}
                fill="none"
                stroke="var(--color-teal-600)"
                strokeWidth="3"
                strokeLinecap="round"
                initial={reduce ? false : { pathLength: 0 }}
                animate={{ pathLength: shown > index + 1 ? 1 : 0 }}
                transition={{ duration: 0.9, ease: EASE_OUT }}
              />
            ))}

            {FOCUS.map((value, index) => {
              const reached = index < shown;
              const current = index === shown - 1;
              return (
                <g key={index}>
                  <motion.circle
                    cx={CHART.xs[index]}
                    cy={yOf(value)}
                    r={current ? 7 : 5}
                    fill="#ffffff"
                    stroke="var(--color-teal-600)"
                    strokeWidth="2.5"
                    initial={reduce ? false : { opacity: 0 }}
                    animate={{ opacity: reached ? 1 : 0.25 }}
                    transition={{ duration: 0.4 }}
                  />
                  {current ? <circle cx={CHART.xs[index]} cy={yOf(value)} r="3" className="fill-gold" /> : null}
                </g>
              );
            })}
          </svg>

          <div className="grid grid-cols-4 text-center text-[0.75rem] font-medium text-ink-muted">
            {FOCUS.map((_, index) => (
              <span key={index} className={cn("transition-colors duration-500", index === shown - 1 && "text-ink")}>
                {copy.week} {index + 1}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.8125rem] text-ink-soft">
          <span className="inline-flex items-center gap-2">
            <span aria-hidden className="h-px w-6 border-t border-dashed border-teal-400" />
            {copy.baseline}
          </span>
          <span className="inline-flex items-center gap-2">
            <span aria-hidden className="h-2.5 w-6 rounded-sm bg-teal-100" />
            {copy.baseline} ±
          </span>
        </div>

        <div className="mt-6" dir="ltr">
          <label htmlFor="ritual-scrub" className="sr-only">
            {copy.scrub}
          </label>
          <input
            id="ritual-scrub"
            type="range"
            min={1}
            max={FOCUS.length}
            step={1}
            value={shown}
            onChange={(event) => {
              setTouched(true);
              setWeek(Number(event.target.value));
            }}
            aria-valuetext={`${copy.week} ${shown}`}
            style={{ ["--fill" as string]: `${fill}%` }}
            className="range-teal w-full"
          />
        </div>

        <p aria-live="polite" className="mt-5 min-h-[3.25rem] text-[1rem] leading-7 text-ink">
          {copy.notes[shown - 1]}
        </p>
      </div>
    </motion.div>
  );
}

type MomentKey = "MORNING" | "MIDDAY" | "EVENING";
type Feature = "checkin" | "goals" | "journal";

/**
 * The three moments of a day. Morning is champagne light, midday is aqua, evening is deep teal — the panel's colours,
 * the light source and the numeral all travel with the scroll.
 */
const MOMENTS: { key: MomentKey; feature: Feature; icon: LucideIcon; Body: () => ReactNode; stack: string; ink: "dark" | "light" }[] = [
  { key: "MORNING", feature: "checkin", icon: HeartPulse, Body: CheckinBody, stack: "bg-[linear-gradient(155deg,#f6eed8,#e6d5aa)]", ink: "dark" },
  { key: "MIDDAY", feature: "goals", icon: Target, Body: GoalsBody, stack: "bg-[linear-gradient(155deg,#dcedef,#bfdde1)]", ink: "dark" },
  { key: "EVENING", feature: "journal", icon: BookOpen, Body: JournalBody, stack: "bg-teal-900", ink: "light" },
];

/** Stops are held across each third of the scroll and blend between them. */
const STOPS = [0, 0.2, 0.46, 0.54, 0.8, 1];
const PANEL = ["#f3e8c6", "#f3e8c6", "#c9e4e7", "#c9e4e7", "#114c61", "#114c61"];
const LIGHT = ["#fff3cf", "#fff3cf", "#ffffff", "#ffffff", "#5b9091", "#5b9091"];

/** One segment of the gold progress indicator. */
function Segment({ progress, index, count }: { progress: MotionValue<number>; index: number; count: number }) {
  const fill = useTransform(progress, [index / count, (index + 1) / count], [0, 1]);
  return (
    <span className="relative h-0.5 flex-1 overflow-hidden rounded-full bg-line-strong">
      <motion.span style={{ scaleX: fill }} className="absolute inset-0 origin-left bg-gold rtl:origin-right" />
    </span>
  );
}

/** The glass card that holds a moment's live visual. */
function MomentCard({ moment, label }: { moment: (typeof MOMENTS)[number]; label: string }) {
  const Icon = moment.icon;
  return (
    <div className="rounded-[1.75rem] border border-white/70 bg-white/85 p-5 sm:p-7">
      <div className="mb-5 flex items-center justify-between gap-3">
        <span className="flex size-10 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
          <Icon className="size-[1.125rem]" strokeWidth={1.5} aria-hidden />
        </span>
        <span className={cn(LABEL, "inline-flex items-center gap-2 text-teal-700")}>
          <span aria-hidden className="size-1.5 rounded-full bg-gold" />
          {label}
        </span>
      </div>
      <moment.Body />
    </div>
  );
}

/** Wide screens: one panel stays put while the day moves through it. */
function Sticky({ className }: { className?: string }) {
  const { dictionary } = useLanguage();
  const copy = dictionary.homeLanding.ritual.capture;
  const chapters = dictionary.diagnostic.chapters;
  const track = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = Math.min(MOMENTS.length - 1, Math.max(0, Math.floor(value * MOMENTS.length)));
    setActive((current) => (current === next ? current : next));
  });

  const panel = useTransform(scrollYProgress, STOPS, PANEL);
  const light = useTransform(scrollYProgress, STOPS, LIGHT);
  const lightLeft = useTransform(scrollYProgress, [0, 0.5, 1], ["80%", "50%", "18%"]);
  const lightTop = useTransform(scrollYProgress, [0, 0.5, 1], ["16%", "8%", "78%"]);
  const lightBackground = useMotionTemplate`radial-gradient(closest-side, ${light}, transparent)`;

  const moment = MOMENTS[active];
  const item = copy[moment.feature];

  return (
    <div ref={track} className={cn("relative h-[320svh]", className)}>
      <div className="sticky top-0 flex h-svh items-center py-24">
        <div className="grid w-full grid-cols-12 items-center gap-10 xl:gap-16">
          <div className="col-span-5">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={moment.key}
                initial={{ opacity: 0, y: 36 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -28 }}
                transition={{ duration: 0.7, ease: EASE_OUT }}
              >
                <span aria-hidden className={cn(SERIF, "block text-[clamp(7rem,13vw,12rem)] font-extralight leading-[0.85] tracking-[-0.05em] text-teal-900 rtl:tracking-normal")}>
                  {pad(active + 1)}
                </span>
                <p className={cn(LABEL, "mt-6 flex items-center gap-3 text-gold-700")}>
                  <span aria-hidden className="h-px w-8 bg-gold" />
                  {chapters[moment.key]}
                </p>
                <h3 className={cn(DISPLAY_M, "mt-4 text-ink")}>{item.name}</h3>
                <p className={cn(BODY, "mt-4 max-w-md")}>{item.body}</p>
              </motion.div>
            </AnimatePresence>

            <div className="mt-10 flex max-w-xs items-center gap-3" aria-hidden>
              {MOMENTS.map((m, index) => (
                <Segment key={m.key} progress={scrollYProgress} index={index} count={MOMENTS.length} />
              ))}
              <span className="ps-1 text-[0.8125rem] font-medium tabular-nums text-ink-soft" dir="ltr">
                {pad(active + 1)} / {pad(MOMENTS.length)}
              </span>
            </div>
          </div>

          <div className="col-span-7">
            <motion.div
              style={{ backgroundColor: panel }}
              className="relative isolate flex min-h-[min(36rem,72svh)] items-center overflow-hidden rounded-[2.5rem] p-8 xl:p-12"
            >
              {/* The light source: a sun that climbs, a noon sky, a soft moon low in the corner */}
              <motion.span aria-hidden style={{ left: lightLeft, top: lightTop, background: lightBackground }} className="pointer-events-none absolute -z-10 size-[34rem] -translate-x-1/2 -translate-y-1/2" />

              <div className="w-full">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={moment.key}
                    initial={{ opacity: 0, y: 24, scale: 0.985 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -16, scale: 0.99 }}
                    transition={{ duration: 0.6, ease: EASE_OUT }}
                  >
                    <MomentCard moment={moment} label={chapters[moment.key]} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Small screens and reduced motion: the same three moments, one after the other, each in its own colour. */
function Stacked({ className }: { className?: string }) {
  const { dictionary } = useLanguage();
  const copy = dictionary.homeLanding.ritual.capture;
  const chapters = dictionary.diagnostic.chapters;

  return (
    <ol className={cn("space-y-5", className)}>
      {MOMENTS.map((moment, index) => {
        const item = copy[moment.feature];
        const light = moment.ink === "light";
        return (
          <li key={moment.key} className={cn("overflow-hidden rounded-[2rem] p-5 sm:p-8", moment.stack)}>
            <div className="flex items-start gap-4">
              <span aria-hidden className={cn(SERIF, "text-[4.5rem] font-extralight leading-[0.85] tracking-[-0.05em] rtl:tracking-normal", light ? "text-white" : "text-teal-900")}>
                {pad(index + 1)}
              </span>
              <div className="min-w-0 pt-1">
                <p className={cn(LABEL, "flex items-center gap-3", light ? "text-gold-100" : "text-gold-700")}>
                  <span aria-hidden className="h-px w-6 bg-gold" />
                  {chapters[moment.key]}
                </p>
                <h3 className={cn(DISPLAY_M, "mt-3 text-[1.75rem]", light ? "text-white" : "text-ink")}>{item.name}</h3>
              </div>
            </div>
            <p className={cn(BODY_SM, "mt-4", light ? "text-teal-100" : "text-ink-soft")}>{item.body}</p>
            <div className="mt-6">
              <MomentCard moment={moment} label={chapters[moment.key]} />
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/**
 * Lumina's daily ritual as a day: a morning check-in, a midday goal, an evening journal — told on one panel that stays
 * in place while its colours, light and content move with the hours — then the weeks that make sense of them.
 * Everything is drawn live; no product screen is imitated.
 */
export function DailyRitual() {
  const { dictionary } = useLanguage();
  const copy = dictionary.homeLanding.ritual;
  const reduce = useReducedMotion();

  return (
    <HomeSection id="ritual" labelledBy="ritual-title" className="border-t border-line">
      <SectionHeader variant="editorial" align="center" id="ritual-title" eyebrow={copy.eyebrow} titleA={copy.titleA} titleB={copy.titleB} intro={copy.intro} />

      <div className="mt-14 md:mt-20">
        {reduce ? (
          <Stacked />
        ) : (
          <>
            <Sticky className="hidden lg:block" />
            <Stacked className="lg:hidden" />
          </>
        )}
      </div>

      <motion.div variants={stagger(0.1)} initial="hidden" whileInView="show" viewport={REVEAL_VIEWPORT} className="mt-8 lg:mt-0">
        <Understand />
      </motion.div>

      <motion.ul
        variants={stagger(0.1)}
        initial="hidden"
        whileInView="show"
        viewport={REVEAL_VIEWPORT}
        className="mt-14 grid divide-y divide-line border-y border-line md:mt-16 md:grid-cols-3 md:divide-x md:divide-y-0 rtl:md:divide-x-reverse"
      >
        {copy.outcomes.map(([title, text], index) => {
          const Icon = OUTCOME_ICONS[index % OUTCOME_ICONS.length];
          return (
            <motion.li key={title} variants={fadeUp(0, 14)} className="flex gap-4 py-6 md:px-8 md:first:ps-0 md:last:pe-0">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-teal-200 bg-teal-50 text-teal-700">
                <Icon className="size-[1.125rem]" strokeWidth={1.6} aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-[1rem] font-semibold text-ink">{title}</p>
                <p className={cn(BODY_SM, "mt-1")}>{text}</p>
              </div>
            </motion.li>
          );
        })}
      </motion.ul>
    </HomeSection>
  );
}
