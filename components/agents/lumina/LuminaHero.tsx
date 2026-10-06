"use client";

import { Magnetic, WordReveal } from "@/components/home/AnimationUtilities";
import { Grain } from "@/components/home/Atmosphere";
import { BODY, LABEL, SERIF } from "@/components/home/typography";
import { AgentAvatar } from "@/components/layout/site-header";
import { EASE_OUT, fadeUp, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { ArrowDown, Check, FileText, LockKeyhole } from "lucide-react";
import type { ReactNode } from "react";
import { MoodEmoji } from "@/components/patient/ui/MoodEmoji";
import { MOOD_LEVELS } from "@/lib/patient/moods";
import { AgentStatusPill } from "../AgentStatusPill";
import { PillLink, StatsStrip, useAgentPage } from "../shared";
import { SIGNAL_LEVELS } from "./chartData";

const SEGMENTS = 5;
const GAP = 9;
const SPAN = 360 / SEGMENTS;
const RADIUS = 80;
const rad = (degrees: number) => (degrees * Math.PI) / 180;
const polar = (degrees: number, radius = RADIUS) => `${(100 + radius * Math.cos(rad(degrees))).toFixed(2)} ${(100 + radius * Math.sin(rad(degrees))).toFixed(2)}`;
/** One arc of the ring: from the top, five equal segments with a small gap between them. */
const arc = (index: number) => {
  const start = -90 + index * SPAN + GAP / 2;
  const end = -90 + (index + 1) * SPAN - GAP / 2;
  return `M ${polar(start)} A ${RADIUS} ${RADIUS} 0 0 1 ${polar(end)}`;
};
/** Where each signal's label floats: just outside the middle of its arc, as a percentage of the square. */
const place = (index: number) => {
  const mid = -90 + index * SPAN + SPAN / 2;
  return { left: `${50 + 46 * Math.cos(rad(mid))}%`, top: `${50 + 46 * Math.sin(rad(mid))}%` };
};

function Glass({ children, delay = 0, seconds = 7 }: { children: ReactNode; delay?: number; seconds?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div initial={reduce ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1 + delay, ease: EASE_OUT }}>
      <motion.div animate={reduce ? undefined : { y: [0, -6, 0] }} transition={{ duration: seconds, repeat: Infinity, ease: "easeInOut", delay }} className="rounded-2xl border border-white/20 bg-white/10 p-3.5 shadow-[0_20px_40px_-20px_rgb(0_0_0/0.5)] backdrop-blur-md">
        {children}
      </motion.div>
    </motion.div>
  );
}

/**
 * Today as a ring of five arcs — one per signal, each filled to its level — with the signals named around it,
 * a slow dashed orbit carrying one gold light, and the journal and the report resting at the corners.
 */
function SignalRing() {
  const { copy } = useAgentPage("lumina");
  const preview = copy.lumina.preview;
  const reduce = useReducedMotion();

  // The ring leans a few degrees towards the pointer, then settles. Mouse only, and still under reduced motion.
  const tiltX = useSpring(useMotionValue(0), { stiffness: 90, damping: 18 });
  const tiltY = useSpring(useMotionValue(0), { stiffness: 90, damping: 18 });
  const lean = (event: React.PointerEvent<HTMLElement>) => {
    if (reduce || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    tiltY.set(((event.clientX - rect.left) / rect.width - 0.5) * 10);
    tiltX.set(-((event.clientY - rect.top) / rect.height - 0.5) * 10);
  };
  const settle = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  return (
    <figure className="relative mx-auto w-full max-w-[30rem]" onPointerMove={lean} onPointerLeave={settle}>
      <motion.div style={{ rotateX: tiltX, rotateY: tiltY, transformPerspective: 1100 }} className="relative aspect-square w-full">
        <div aria-hidden>
          {/* Orbit: a dashed ring that turns, with one gold light on it */}
          <motion.span className="absolute inset-[2%] rounded-full border border-dashed border-white/20" animate={reduce ? undefined : { rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }}>
            <span className="absolute start-1/2 top-0 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold shadow-[0_0_16px_4px_rgb(201_175_111/0.6)]" />
          </motion.span>
          <motion.span
            className="absolute inset-[16%] rounded-full bg-[radial-gradient(closest-side,rgb(43_112_128/0.55),rgb(17_76_97/0.2)_70%,transparent)]"
            animate={reduce ? undefined : { scale: [1, 1.06, 1], opacity: [0.85, 1, 0.85] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />

          <svg viewBox="0 0 200 200" className="absolute inset-[11%] size-[78%]">
            <defs>
              <linearGradient id="lumina-ring" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0" stopColor="var(--color-gold-100)" />
                <stop offset="1" stopColor="var(--color-teal-300)" />
              </linearGradient>
            </defs>
            {Array.from({ length: SEGMENTS }, (_, index) => (
              <g key={index}>
                <path d={arc(index)} fill="none" stroke="rgb(255 255 255 / 0.12)" strokeWidth="11" strokeLinecap="round" />
                <motion.path
                  d={arc(index)}
                  fill="none"
                  stroke="url(#lumina-ring)"
                  strokeWidth="11"
                  strokeLinecap="round"
                  initial={reduce ? false : { pathLength: 0 }}
                  animate={{ pathLength: SIGNAL_LEVELS[index] / 5 }}
                  transition={{ duration: 1.2, ease: EASE_OUT, delay: 0.5 + index * 0.18 }}
                />
              </g>
            ))}
          </svg>

          {/* The centre: today, saved */}
          <div className="absolute inset-[30%] flex flex-col items-center justify-center rounded-full border border-white/15 bg-[radial-gradient(closest-side,rgb(26_87_106),rgb(17_76_97))] text-center shadow-[inset_0_0_30px_rgb(0_0_0/0.25)]">
            <AgentAvatar agent="lumina" className="size-11 rounded-2xl sm:size-14" />
            <p className={cn(SERIF, "mt-2 text-[1.125rem] font-light text-white sm:text-[1.5rem] rtl:font-normal")}>{preview.today}</p>
            <p className="mt-0.5 inline-flex items-center gap-1 text-[0.6875rem] font-semibold text-gold-100 sm:text-[0.75rem]">
              <Check className="size-3" strokeWidth={3} />
              {preview.saved}
            </p>
          </div>
        </div>

        {preview.signals.map((signal, index) => (
          <div key={signal} className="absolute z-10 -translate-x-1/2 -translate-y-1/2" style={place(index)}>
            <motion.span
              initial={reduce ? false : { opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1 + index * 0.12, duration: 0.5 }}
              className="block"
            >
              <motion.span
                animate={reduce ? undefined : { y: [0, -5, 0] }}
                transition={{ duration: 5 + index * 0.6, repeat: Infinity, ease: "easeInOut", delay: index * 0.4 }}
                className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-white/25 bg-white/12 px-2.5 py-1.5 text-[0.75rem] font-semibold text-white shadow-[0_10px_24px_-12px_rgb(0_0_0/0.5)] backdrop-blur-md sm:px-3.5 sm:text-[0.8125rem]"
              >
                {signal}
                <span dir="ltr" className="font-mono text-gold-100">
                  {SIGNAL_LEVELS[index]}
                </span>
              </motion.span>
            </motion.span>
          </div>
        ))}
      </motion.div>

      {/* The journal and the report, resting under the ring */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
        <Glass delay={0} seconds={9}>
          <ul className="flex items-center gap-1" aria-hidden>
            {MOOD_LEVELS.map((level, index) => (
              <li key={level.level} className={cn("rounded-full p-1 text-[1.5rem] transition-transform duration-300", index === 3 ? "scale-110 bg-white/30 ring-1 ring-gold-100" : "bg-white/10 opacity-80")}>
                <MoodEmoji level={level} />
              </li>
            ))}
          </ul>
        </Glass>
        <Glass delay={0.2} seconds={7}>
          <ul className="flex gap-1.5" aria-hidden>
            {preview.views.journal.themes.map((theme) => (
              <li key={theme} className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[0.6875rem] font-medium text-white">
                <span className="size-1.5 rounded-full bg-gold" />
                {theme}
              </li>
            ))}
          </ul>
        </Glass>
        <Glass delay={0.7} seconds={8}>
          <p className="flex items-center gap-2 text-[0.75rem] font-semibold text-white" aria-hidden>
            <FileText className="size-4 text-gold-100" />
            {preview.views.report.title}
            <LockKeyhole className="size-3.5 text-teal-200" />
          </p>
        </Glass>
      </div>
      <figcaption className="mt-4 text-center text-[0.75rem] text-teal-200">{preview.caption}</figcaption>
    </figure>
  );
}

/** The opening, in the deep teal of the closing chapter: the headline, three numbers, and today as a ring. */
export function LuminaHero() {
  const { page, identity, config, primaryHref } = useAgentPage("lumina");

  return (
    <section aria-labelledby="agent-title" className="relative isolate overflow-hidden bg-deep pb-28 pt-10 text-white sm:pt-14 lg:pb-36 lg:pt-20">
      <Grain />
      <span aria-hidden className="pointer-events-none absolute -top-32 start-[-10%] -z-10 size-[40rem] rounded-full bg-[radial-gradient(closest-side,rgb(201_175_111/0.28),transparent)]" />
      <span aria-hidden className="pointer-events-none absolute bottom-[-12rem] end-[-8%] -z-10 size-[36rem] rounded-full bg-[radial-gradient(closest-side,rgb(134_186_188/0.26),transparent)]" />

      <div className="page-container grid items-center gap-16 lg:grid-cols-12 lg:gap-8">
        <motion.div variants={stagger(0.08)} initial="hidden" animate="show" className="lg:col-span-6">
          <motion.div variants={fadeUp(0, 10)} className="flex flex-wrap items-center gap-3">
            <AgentAvatar agent="lumina" className="size-12 rounded-2xl ring-1 ring-white/30" />
            <AgentStatusPill agent={config} label={identity.status} />
            <span className="text-[0.8125rem] font-medium text-teal-100">{identity.meta}</span>
          </motion.div>

          <motion.p variants={fadeUp()} className={cn(LABEL, "mt-8 flex items-center gap-3 text-teal-200")}>
            <span aria-hidden className="h-px w-8 bg-gold-300" />
            {page.hero.eyebrow}
          </motion.p>

          <h1 id="agent-title" className={cn(SERIF, "mt-6 text-[clamp(2.75rem,4.6vw+1rem,5rem)] font-light leading-[1.02] tracking-[-0.035em] text-white rtl:tracking-normal")}>
            <span className="block">
              <WordReveal>{page.hero.titleA}</WordReveal>
            </span>
            <span className="block">
              <WordReveal className="italic text-gold-100 rtl:not-italic" delay={0.12}>
                {page.hero.titleB}
              </WordReveal>
            </span>
          </h1>

          <motion.p variants={fadeUp()} className={cn(BODY, "mt-6 max-w-lg text-teal-100")}>
            {page.hero.body}
          </motion.p>

          <motion.div variants={fadeUp(0, 14)} className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Magnetic strength={0.12}>
              <PillLink href={primaryHref} tone="white">
                {page.hero.primary}
              </PillLink>
            </Magnetic>
            <a
              href="#flow"
              className="group inline-flex min-h-11 items-center gap-2 rounded-md text-[0.9375rem] font-semibold text-gold-100 transition-colors duration-200 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-300"
            >
              <span className="home-link-line">{page.hero.secondary}</span>
              <ArrowDown className="size-4 transition-transform duration-300 ease-out-soft group-hover:translate-y-0.5" aria-hidden />
            </a>
          </motion.div>

          <motion.div variants={fadeUp(0, 12)} className="mt-12 max-w-md">
            <StatsStrip stats={page.stats} tone="dark" />
          </motion.div>
        </motion.div>

        <div className="lg:col-span-6">
          <SignalRing />
        </div>
      </div>
    </section>
  );
}
