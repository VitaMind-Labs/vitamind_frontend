"use client";

import { AgentAvatar } from "@/components/layout/site-header";
import { useLanguage } from "@/contexts/LanguageContext";
import { homeStoryCopy, type HomeStoryCopy } from "@/lib/i18n/homeStory";
import { EASE_OUT, REVEAL_VIEWPORT, fadeUp, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { motion, useInView, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Lock, NotebookPen, Stethoscope } from "lucide-react";
import { useRef, type ReactNode } from "react";
import { Grain } from "./Atmosphere";
import { HomeSection } from "./HomeSection";
import { SectionHeader } from "./SectionHeader";
import { ACCENT_LIGHT, DISPLAY_M, DISPLAY_S, LABEL } from "./typography";

/** One word of the statement: dim until the reader reaches it. */
function Word({ progress, range, accent, children }: { progress: MotionValue<number>; range: [number, number]; accent: boolean; children: string }) {
  const reduce = useReducedMotion();
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <>
      <motion.span style={{ opacity: reduce ? 1 : opacity }} className={accent ? ACCENT_LIGHT : undefined}>
        {children}
      </motion.span>{" "}
    </>
  );
}

/** The definition, read at the reader's pace: each word lights as the paragraph scrolls through the screen. */
function ScrollStatement({ text, highlight }: { text: string; highlight: readonly string[] }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 88%", "end 52%"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className={cn(DISPLAY_M, "mt-10 max-w-5xl text-ink md:mt-14")}>
      {words.map((word, index) => (
        <Word key={`${word}-${index}`} progress={scrollYProgress} range={[index / words.length, (index + 1) / words.length]} accent={highlight.includes(word)}>
          {word}
        </Word>
      ))}
    </p>
  );
}

/**
 * The link between two nodes: a hairline that draws in, and small lights travelling along it. Vertical on small screens,
 * horizontal from `lg` (mirrored in RTL). `gate` puts the consent lock on the line.
 */
function Connector({ tone, gate }: { tone: "teal" | "gold"; gate?: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { margin: "0px 0px -10% 0px" });
  const run = visible && !reduce;
  const dot = tone === "teal" ? "bg-teal-500 shadow-[0_0_10px_2px_rgb(91_144_145/0.5)]" : "bg-gold shadow-[0_0_10px_2px_rgb(201_175_111/0.6)]";
  const line = tone === "teal" ? "from-teal-300 to-teal-500" : "from-teal-500 to-gold";

  return (
    <div ref={ref} aria-hidden className="relative flex h-20 items-center justify-center lg:h-auto lg:w-28 xl:w-36">
      {/* vertical (mobile) */}
      <motion.span
        className={cn("absolute inset-y-0 start-1/2 w-px origin-top bg-gradient-to-b lg:hidden", line)}
        initial={reduce ? false : { scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: EASE_OUT }}
      />
      {/* horizontal (desktop) */}
      <motion.span
        className={cn("absolute inset-x-0 top-1/2 hidden h-px origin-left bg-gradient-to-r lg:block rtl:origin-right rtl:bg-gradient-to-l", line)}
        initial={reduce ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: EASE_OUT }}
      />
      {run
        ? [0, 1.1].map((delay) => (
            <span key={delay}>
              <motion.span
                className={cn("absolute start-1/2 size-1.5 -translate-x-1/2 rounded-full lg:hidden rtl:translate-x-1/2", dot)}
                animate={{ top: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 2.2, delay, repeat: Infinity, ease: "easeInOut" }}
              />
              <span className="absolute inset-0 hidden lg:block rtl:-scale-x-100">
                <motion.span
                  className={cn("absolute top-1/2 size-1.5 -translate-y-1/2 rounded-full", dot)}
                  animate={{ left: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 2.2, delay, repeat: Infinity, ease: "easeInOut" }}
                />
              </span>
            </span>
          ))
        : null}
      {gate ? (
        <span className="relative z-10 flex items-center gap-1.5 rounded-full border border-gold-100 bg-white px-3 py-1.5 text-[0.75rem] font-semibold text-gold-700 shadow-card lg:max-w-[7.5rem] lg:flex-col lg:gap-1 lg:rounded-2xl lg:px-2.5 lg:py-2 lg:text-center lg:leading-tight">
          <Lock className="size-3.5 shrink-0" strokeWidth={2.25} />
          {gate}
        </span>
      ) : null}
    </div>
  );
}

type Node = HomeStoryCopy["what"]["nodes"][number];

function Points({ points, dark }: { points: readonly string[]; dark?: boolean }) {
  return (
    <ul className="mt-5 flex flex-wrap gap-2">
      {points.map((point) => (
        <li key={point} className={cn("rounded-full px-3 py-1 text-[0.8125rem] font-medium", dark ? "bg-white/10 text-teal-50 ring-1 ring-white/15" : "bg-canvas text-ink-soft ring-1 ring-line")}>
          {point}
        </li>
      ))}
    </ul>
  );
}

/** A side node: you, or your clinician. */
function SideNode({ node, icon }: { node: Node; icon: ReactNode }) {
  return (
    <motion.div variants={fadeUp(0, 22)} className="relative flex flex-col rounded-panel border border-line bg-white p-6 shadow-card sm:p-7">
      <div className="flex items-center justify-between gap-4">
        <p className={cn(LABEL, "text-teal-700")}>{node.label}</p>
        <span className="flex size-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">{icon}</span>
      </div>
      <h3 className={cn(DISPLAY_S, "mt-4 text-ink")}>{node.title}</h3>
      <Points points={node.points} />
    </motion.div>
  );
}

/** The middle node, SynQ itself: the two agent marks held by a slow gold orbit, on the deep teal. */
function CoreNode({ node }: { node: Node }) {
  const reduce = useReducedMotion();
  return (
    <motion.div variants={fadeUp(0, 22)} className="relative isolate flex flex-col overflow-hidden rounded-panel bg-deep p-6 text-white shadow-float sm:p-7">
      <Grain />
      <span aria-hidden className="absolute -end-16 -top-16 -z-10 size-56 rounded-full bg-[radial-gradient(closest-side,rgb(230_213_170/0.28),transparent)]" />
      <div className="flex items-center justify-between gap-4">
        <p className={cn(LABEL, "text-gold-300")}>{node.label}</p>
        <span aria-hidden className="relative flex h-14 w-24 items-center justify-center">
          <motion.span
            className="absolute inset-0 rounded-[50%] border border-dashed border-gold-300/60"
            animate={reduce ? undefined : { rotate: 360 }}
            transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
          />
          <AgentAvatar agent="mira" className="relative z-10 size-11 rounded-2xl ring-2 ring-teal-900" />
          <AgentAvatar agent="lumina" className="relative -ms-3 size-11 rounded-2xl ring-2 ring-teal-900" />
        </span>
      </div>
      <h3 className={cn(DISPLAY_S, "mt-4 text-white")}>{node.title}</h3>
      <Points points={node.points} dark />
    </motion.div>
  );
}

/**
 * What SynQ is, for someone who has never heard of it: one sentence read at their pace, then one picture: you,
 * SynQ, your clinician, and the consent gate between the last two.
 */
export const WhatSection = () => {
  const { language } = useLanguage();
  const copy = homeStoryCopy[language].what;
  const [you, core, clinician] = copy.nodes;

  return (
    <HomeSection id="what" labelledBy="what-title" tone="base">
      <SectionHeader variant="editorial" id="what-title" eyebrow={copy.eyebrow} titleA={copy.titleA} titleB={copy.titleB} />

      <ScrollStatement text={copy.statement} highlight={copy.highlight} />

      <motion.div
        variants={stagger(0.18, 0.1)}
        initial="hidden"
        whileInView="show"
        viewport={REVEAL_VIEWPORT}
        className="mt-14 flex flex-col md:mt-20 lg:grid lg:grid-cols-[1fr_auto_1.12fr_auto_1fr] lg:items-stretch"
      >
        <SideNode node={you} icon={<NotebookPen className="size-5" strokeWidth={1.75} aria-hidden />} />
        <Connector tone="teal" />
        <CoreNode node={core} />
        <Connector tone="gold" gate={copy.consent} />
        <SideNode node={clinician} icon={<Stethoscope className="size-5" strokeWidth={1.75} aria-hidden />} />
      </motion.div>

    </HomeSection>
  );
};
