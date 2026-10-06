"use client";

import { AgentAvatar, AGENTS } from "@/components/layout/site-header";
import { useLanguage } from "@/contexts/LanguageContext";
import { ROUTES } from "@/lib/config/routes";
import { homeLoopCopy } from "@/lib/i18n/homeStory";
import { EASE_OUT, REVEAL_VIEWPORT, fadeUp, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowRight, Stethoscope, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { HomeSection } from "./HomeSection";
import { SectionHeader } from "./SectionHeader";
import { BODY_SM, DISPLAY_S, LABEL } from "./typography";

/** The third step has no agent of its own: the clinician is a person, so it wears the calm sage of the product. */
const CLINICIAN_TONE = {
  surface: "bg-[linear-gradient(150deg,var(--color-sage-50),#ffffff_74%)]",
  border: "border-sage-100 hover:border-sage",
  text: "text-sage-700",
  wash: "bg-[linear-gradient(150deg,rgb(220_235_234/0.7),transparent_70%)]",
  edge: "from-sage-100 via-sage to-sage-100",
  arrow: "bg-ink text-white group-hover:bg-teal-800",
} as const;

type Art = "arcs" | "bars" | "lines" | "pulse";

/** A small drawing per step, played once when it scrolls in: what the step does, in a few strokes. */
function Drawing({ art, strong, soft }: { art: Art; strong: string; soft: string }) {
  const reduce = useReducedMotion();
  const once = { once: true } as const;
  return (
    <svg viewBox="0 0 120 48" aria-hidden className="h-12 w-full overflow-visible">
      {art === "arcs" &&
        [
          { d: "M 20 44 A 40 40 0 0 1 100 44", to: 0.92 },
          { d: "M 32 44 A 28 28 0 0 1 88 44", to: 0.62 },
          { d: "M 44 44 A 16 16 0 0 1 76 44", to: 0.78 },
        ].map((arc, i) => (
          <g key={arc.d}>
            <path d={arc.d} fill="none" className={soft} strokeWidth="2" strokeLinecap="round" />
            <motion.path
              d={arc.d}
              fill="none"
              className={strong}
              strokeWidth="2.5"
              strokeLinecap="round"
              initial={reduce ? false : { pathLength: 0 }}
              whileInView={{ pathLength: arc.to }}
              viewport={once}
              transition={{ duration: 1.1, delay: 0.3 + i * 0.15, ease: EASE_OUT }}
            />
          </g>
        ))}

      {art === "bars" &&
        [26, 20, 14, 32, 22].map((height, i) => (
          <motion.rect
            key={i}
            x={10 + i * 22}
            y={44 - height}
            width="12"
            height={height}
            rx="3"
            className={i === 2 ? soft : strong}
            style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
            initial={reduce ? false : { scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={once}
            transition={{ duration: 0.8, delay: 0.3 + i * 0.08, ease: EASE_OUT }}
          />
        ))}

      {art === "pulse" && (
        <>
          <path d="M 6 30 H 114" fill="none" className={soft} stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 5" />
          <motion.path
            d="M 6 30 H 34 L 42 14 L 52 44 L 62 8 L 70 30 H 114"
            fill="none"
            className={strong}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={reduce ? false : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={once}
            transition={{ duration: 1.4, delay: 0.3, ease: EASE_OUT }}
          />
        </>
      )}

      {art === "lines" &&
        [78, 100, 62].map((width, i) => (
          <motion.rect
            key={width}
            x="10"
            y={8 + i * 13}
            width={width}
            height="6"
            rx="3"
            className={i === 0 ? strong : soft}
            style={{ transformBox: "fill-box", transformOrigin: "0% 50%" }}
            initial={reduce ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={once}
            transition={{ duration: 0.8, delay: 0.3 + i * 0.12, ease: EASE_OUT }}
          />
        ))}
    </svg>
  );
}

/**
 * The thread that joins the three steps. It fills teal to gold as the section arrives, then a soft light keeps
 * travelling along it. Horizontal on wide screens (mirrored in RTL), vertical beside the cards on small ones.
 */
function Thread({ axis, className }: { axis: "x" | "y"; className: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { margin: "0px 0px -10% 0px" });
  const horizontal = axis === "x";

  return (
    <div ref={ref} aria-hidden className={cn("absolute overflow-hidden rounded-full bg-line-strong", className)}>
      <motion.span
        className={cn("absolute inset-0 rounded-full", horizontal ? "origin-left bg-gradient-to-r from-teal-600 to-gold" : "origin-top bg-gradient-to-b from-teal-600 to-gold")}
        initial={reduce ? false : horizontal ? { scaleX: 0 } : { scaleY: 0 }}
        whileInView={horizontal ? { scaleX: 1 } : { scaleY: 1 }}
        viewport={REVEAL_VIEWPORT}
        transition={{ duration: 1.8, delay: 0.2, ease: EASE_OUT }}
      />
      {!reduce && visible ? (
        <motion.span
          className={cn("absolute", horizontal ? "inset-y-0 w-[12.5%] bg-gradient-to-r from-transparent via-white to-transparent" : "inset-x-0 h-[12.5%] bg-gradient-to-b from-transparent via-white to-transparent")}
          animate={horizontal ? { x: ["-100%", "800%"] } : { y: ["-100%", "800%"] }}
          transition={{ duration: 4.2, delay: 2.2, repeat: Infinity, repeatDelay: 1.4, ease: "easeInOut" }}
        />
      ) : null}
    </div>
  );
}

/** Numbered stop on the thread, with a ring that breathes out from it. */
function Marker({ index }: { index: number }) {
  const reduce = useReducedMotion();
  return (
    <span
      aria-hidden
      className="absolute start-0 top-0 z-10 flex size-12 items-center justify-center rounded-full border border-teal-600 bg-white font-mono text-[0.9375rem] font-medium tabular-nums text-teal-800 shadow-[0_0_0_5px_var(--color-teal-100)] lg:start-1/2 lg:-translate-x-1/2 lg:rtl:translate-x-1/2"
    >
      {!reduce && (
        <motion.span
          className="absolute inset-0 rounded-full border border-teal-400"
          animate={{ scale: [1, 1.7], opacity: [0.55, 0] }}
          transition={{ duration: 2.8, delay: 1.2 + index * 0.9, repeat: Infinity, ease: "easeOut" }}
        />
      )}
      <span dir="ltr">{index + 1}</span>
    </span>
  );
}

type Tone = { surface: string; border: string; text: string; wash: string; edge: string; arrow: string };

type StepCardProps = {
  href: string;
  tone: Tone;
  media: ReactNode;
  art: Art;
  strong: string;
  soft: string;
  kicker: string;
  name: string;
  role: string;
  body: string;
  cta: string;
};

/** One step: a single link. It lifts on hover and the neighbouring colour washes in. */
function StepCard({ href, tone, media, art, strong, soft, kicker, name, role, body, cta }: StepCardProps) {
  const className = cn(
    "group relative isolate flex h-full flex-col overflow-hidden rounded-[1.75rem] border p-6 outline-none transition-[transform,border-color,box-shadow] duration-500 ease-out-soft hover:-translate-y-1.5 hover:shadow-soft-hover focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas sm:p-7",
    tone.surface,
    tone.border,
  );
  const inner = (
    <>
      <span aria-hidden className={cn("pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-700 ease-out-soft group-hover:opacity-100", tone.wash)} />
      <span aria-hidden className={cn("pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r", tone.edge)} />

      <div className="flex items-center justify-between gap-4">
        <span className="transition-transform duration-500 ease-out-soft motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:scale-105">{media}</span>
        <div aria-hidden className="w-28 rounded-2xl bg-white/75 px-3 py-2 ring-1 ring-white sm:w-32">
          <Drawing art={art} strong={strong} soft={soft} />
        </div>
      </div>

      <p className={cn(LABEL, "mt-7", tone.text)}>{kicker}</p>
      <h3 className={cn(DISPLAY_S, "mt-2.5 text-ink")}>
        {name}
        {role ? <span className="ms-3 text-[0.9375rem] font-medium text-ink-muted rtl:font-normal">{role}</span> : null}
      </h3>
      <p className={cn(BODY_SM, "mt-3")}>{body}</p>

      <span className={cn("mt-auto inline-flex items-center gap-3 pt-7 text-[0.9375rem] font-semibold", tone.text)}>
        {cta}
        <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-full transition-colors duration-300", tone.arrow)} aria-hidden>
          <ArrowRight className="size-4 transition-transform duration-300 ease-out-soft group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" />
        </span>
      </span>
    </>
  );

  return href.startsWith("#") ? (
    <a href={href} className={className}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={className}>
      {inner}
    </Link>
  );
}

/** The first step has no agent either: it is the account, so it wears the plain teal of the product. */
const ACCOUNT_TONE = {
  surface: "bg-[linear-gradient(150deg,var(--color-teal-50),#ffffff_74%)]",
  border: "border-teal-100 hover:border-teal-400",
  text: "text-teal-700",
  wash: "bg-[linear-gradient(150deg,rgb(191_221_225/0.5),transparent_70%)]",
  edge: "from-teal-100 via-teal-400 to-teal-100",
  arrow: "bg-ink text-white group-hover:bg-teal-800",
} as const;

/**
 * "How it works": the whole journey in four steps, as one thread — account, Mira, Lumina, the clinician. It mirrors the
 * product exactly (see homeStory.ts). Each card links to the page that explains it, so the home page only draws the map.
 */
export const CareLoop = () => {
  const { language } = useLanguage();
  const copy = homeLoopCopy[language];
  const [mira, lumina] = AGENTS;
  const [account, miraStep, luminaStep, clinician] = copy.steps;
  const avatar = "size-14 rounded-2xl bg-white/80 ring-1 ring-white";

  const steps = [
    {
      href: ROUTES.signUp,
      tone: ACCOUNT_TONE,
      media: (
        <span className="flex size-14 items-center justify-center rounded-2xl bg-white text-teal-700 ring-1 ring-teal-100">
          <UserPlus className="size-7" strokeWidth={1.5} aria-hidden />
        </span>
      ),
      art: "lines" as Art,
      strong: "fill-teal-600",
      soft: "fill-teal-200",
      ...account,
    },
    { href: mira.href, tone: mira.tone, media: <AgentAvatar agent="mira" className={avatar} />, art: "arcs" as Art, strong: "stroke-teal-600", soft: "stroke-teal-200", ...miraStep },
    { href: lumina.href, tone: lumina.tone, media: <AgentAvatar agent="lumina" className={avatar} />, art: "bars" as Art, strong: "fill-gold", soft: "fill-gold-300", ...luminaStep },
    {
      href: "#healthcare",
      tone: CLINICIAN_TONE,
      media: (
        <span className="flex size-14 items-center justify-center rounded-2xl bg-sage-50 text-sage-700 ring-1 ring-white">
          <Stethoscope className="size-7" strokeWidth={1.5} aria-hidden />
        </span>
      ),
      art: "pulse" as Art,
      strong: "stroke-sage-700 text-sage-700",
      soft: "text-sage-100",
      ...clinician,
    },
  ];

  return (
    <HomeSection id="how" labelledBy="how-title" tone="tint">
      <SectionHeader variant="editorial" id="how-title" layout="split" counter="02 / 03" eyebrow={copy.eyebrow} titleA={copy.titleA} titleB={copy.titleB} intro={copy.intro} />

      <motion.ol variants={stagger(0.14, 0.1)} initial="hidden" whileInView="show" viewport={REVEAL_VIEWPORT} className="relative mt-14 grid gap-8 md:mt-20 lg:grid-cols-4 lg:gap-5">
        <Thread axis="x" className="inset-x-[calc(12.5%-0.5rem)] top-[1.4375rem] hidden h-0.5 lg:block rtl:-scale-x-100" />

        {steps.map((step, index) => (
          <motion.li key={step.name} variants={fadeUp(0, 28)} className="relative ps-16 lg:ps-0 lg:pt-20">
            {index < steps.length - 1 ? <Thread axis="y" className="-bottom-14 start-[1.4375rem] top-6 w-0.5 lg:hidden" /> : null}
            <Marker index={index} />
            <StepCard
              href={step.href}
              tone={step.tone}
              media={step.media}
              art={step.art}
              strong={step.strong}
              soft={step.soft}
              kicker={step.kicker}
              name={step.name}
              role={step.role}
              body={step.body}
              cta={step.cta}
            />
          </motion.li>
        ))}
      </motion.ol>

      <motion.p
        variants={fadeUp(0, 12)}
        initial="hidden"
        whileInView="show"
        viewport={REVEAL_VIEWPORT}
        className="mt-12 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-center text-[0.9375rem] text-ink-soft md:mt-16"
      >
        <span>{copy.note.text}</span>
        <Link href={ROUTES.trust} className="inline-flex items-center gap-2 rounded-md font-semibold text-teal-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-500">
          <span className="home-link-line">{copy.note.link}</span>
          <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden />
        </Link>
      </motion.p>
    </HomeSection>
  );
};
