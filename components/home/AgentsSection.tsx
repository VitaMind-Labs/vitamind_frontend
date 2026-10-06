"use client";

import { AgentAvatar, AGENTS } from "@/components/layout/site-header";
import { useLanguage } from "@/contexts/LanguageContext";
import { agentPagesCopy } from "@/lib/i18n/agents";
import { homeStoryCopy, type HomeStoryCopy } from "@/lib/i18n/homeStory";
import { EASE_OUT, REVEAL_VIEWPORT, fadeUp, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowRight, Clock3, Info, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { DrawCheck } from "./DrawCheck";
import { HomeSection } from "./HomeSection";
import { StageRise, TiltCard } from "./Interactions";
import { SectionHeader } from "./SectionHeader";
import { BODY, DISPLAY_L, LABEL } from "./typography";

/**
 * A step counter that runs only while its block is on screen, and loops. Under reduced motion it rests on the last step,
 * so every mock shows its finished state.
 */
function useLoop(steps: number, ms: number) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { margin: "-15% 0px -15% 0px" });
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduce || !visible) return;
    const timer = window.setInterval(() => setStep((current) => (current + 1) % steps), ms);
    return () => window.clearInterval(timer);
  }, [reduce, visible, steps, ms]);

  return { ref, step: reduce ? steps - 1 : step };
}

/** The window both mocks sit in: a soft panel in the agent's colours, a caption under it. */
function MockShell({ tone, caption, children }: { tone: "mira" | "lumina"; caption: string; children: ReactNode }) {
  return (
    <figure className="relative">
      <span
        aria-hidden
        className={cn(
          "absolute -inset-4 -z-10 rounded-[2.5rem] blur-2xl sm:-inset-8",
          tone === "mira" ? "bg-[radial-gradient(closest-side,rgb(191_221_225/0.8),transparent)]" : "bg-[radial-gradient(closest-side,rgb(230_213_170/0.7),transparent)]",
        )}
      />
      <div
        aria-hidden
        className={cn(
          "relative overflow-hidden rounded-[2rem] border p-4 shadow-float sm:p-6",
          tone === "mira" ? "border-teal-200 bg-[linear-gradient(160deg,#ffffff,var(--color-teal-50))]" : "border-gold-100 bg-[linear-gradient(160deg,#ffffff,var(--color-gold-50))]",
        )}
      >
        {children}
      </div>
      <figcaption className="mt-3 text-center text-[0.75rem] text-ink-muted">{caption}</figcaption>
    </figure>
  );
}

/** Mira: the four chapters fill one by one, a question arrives, Mira reflects, the answer lands, the safety check stays on. */
function MiraMock() {
  const { language } = useLanguage();
  const preview = agentPagesCopy[language].mira.preview;
  const { ref, step } = useLoop(4, 2200);
  const chapter = Math.min(2, step + 1);

  return (
    <div ref={ref}>
      <MockShell tone="mira" caption={preview.caption}>
        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-2.5">
            <AgentAvatar agent="mira" className="size-9 rounded-xl ring-1 ring-teal-100" />
            <span className="text-[0.875rem] font-semibold text-ink">{preview.chat.title}</span>
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-sage-50 px-2.5 py-1 text-[0.6875rem] font-semibold text-sage-700 ring-1 ring-sage-100">
            <span className="relative flex size-1.5">
              <span className="absolute inset-0 rounded-full bg-sage-700 opacity-60 motion-safe:animate-ping" />
              <span className="relative size-1.5 rounded-full bg-sage-700" />
            </span>
            <span className="max-[359px]:hidden">{preview.safetyChip}</span>
            <ShieldCheck className="size-3.5 min-[360px]:hidden" />
          </span>
        </div>

        {/* Chapters */}
        <div className="mt-5 grid grid-cols-4 gap-1.5">
          {preview.chapters.map((name, index) => (
            <div key={name} className="min-w-0">
              <div className="h-1.5 overflow-hidden rounded-full bg-teal-100">
                <motion.div
                  className="h-full origin-left rounded-full bg-teal-600 rtl:origin-right"
                  animate={{ scaleX: index < chapter ? 1 : index === chapter ? 0.45 : 0 }}
                  transition={{ duration: 0.8, ease: EASE_OUT }}
                />
              </div>
              <p className={cn("mt-1.5 truncate text-[0.6875rem] font-medium", index <= chapter ? "text-teal-800" : "text-ink-subtle")}>{name}</p>
            </div>
          ))}
        </div>

        {/* Conversation */}
        <div className="mt-5 flex min-h-[13.5rem] flex-col gap-3 sm:min-h-[12.5rem]">
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-[88%] self-start rounded-2xl rounded-ss-md bg-white px-4 py-3 text-[0.875rem] leading-6 text-ink shadow-card ring-1 ring-teal-100"
          >
            <span className={cn(LABEL, "mb-1 block text-[0.625rem] text-teal-700")}>{preview.chat.chapter}</span>
            {preview.chat.question}
          </motion.div>
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="typing"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 self-start rounded-full bg-white/80 px-3.5 py-2 text-[0.75rem] text-ink-muted ring-1 ring-teal-100"
              >
                <span className="flex gap-1">
                  {[0, 1, 2].map((dot) => (
                    <motion.span key={dot} className="size-1.5 rounded-full bg-teal-400" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, delay: dot * 0.15, repeat: Infinity }} />
                  ))}
                </span>
                {preview.chat.typing}
              </motion.div>
            ) : null}
            {step >= 2 ? (
              <motion.div
                key="answer"
                initial={{ opacity: 0, y: 10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: EASE_OUT }}
                className="max-w-[80%] self-end rounded-2xl rounded-se-md bg-teal-600 px-4 py-3 text-[0.875rem] leading-6 text-white"
              >
                {preview.chat.answer}
              </motion.div>
            ) : null}
          </AnimatePresence>
          <AnimatePresence>
            {step === 3 ? (
              <motion.div
                key="summary"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: EASE_OUT }}
                className="mt-auto flex items-center justify-between gap-3 rounded-2xl bg-deep px-4 py-3 text-white"
              >
                <span className="min-w-0">
                  <span className="block truncate text-[0.8125rem] font-semibold">{preview.screens.result.title}</span>
                  <span className="block truncate text-[0.75rem] text-teal-100">
                    {preview.screens.result.review} · {preview.screens.result.reviewValue}
                  </span>
                </span>
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gold text-teal-900">
                  <DrawCheck className="size-4" strokeWidth={2.75} />
                </span>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </MockShell>
    </div>
  );
}

/** Thirty illustrative days around a baseline: a gentle wave that stays inside the usual range. */
const TREND = Array.from({ length: 30 }, (_, day) => 50 + Math.sin(day / 2.6) * 11 + Math.sin(day * 1.7) * 4);

function trendPath(width: number, height: number) {
  return TREND.map((value, day) => `${day === 0 ? "M" : "L"} ${(day / (TREND.length - 1)) * width} ${height - (value / 100) * height}`).join(" ");
}

/** Lumina: five signals are checked in, the month's line draws itself inside the baseline band, journal themes appear. */
function LuminaMock() {
  const { language } = useLanguage();
  const preview = agentPagesCopy[language].lumina.preview;
  const { ref, step } = useLoop(4, 2000);
  const levels = [3, 2, 4, 1, 3];

  return (
    <div ref={ref}>
      <MockShell tone="lumina" caption={preview.caption}>
        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-2.5">
            <AgentAvatar agent="lumina" className="size-9 rounded-xl ring-1 ring-gold-100" />
            <span className="text-[0.875rem] font-semibold text-ink">{preview.greeting}</span>
          </span>
          <span className="rounded-full bg-white px-2.5 py-1 text-[0.6875rem] font-semibold text-gold-700 ring-1 ring-gold-100">{preview.today}</span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 sm:gap-3">
          {/* Check-in */}
          <div className="min-w-0 rounded-2xl bg-white p-3 shadow-card ring-1 ring-gold-100 sm:p-4">
            <p className="text-[0.75rem] font-semibold text-ink">{preview.views.checkin.title}</p>
            <ul className="mt-3 space-y-2.5">
              {preview.signals.map((signal, row) => (
                <li key={signal} className="flex items-center justify-between gap-2">
                  <span className="truncate text-[0.75rem] text-ink-soft">{signal}</span>
                  <span className="flex shrink-0 gap-0.5 sm:gap-1">
                    {[0, 1, 2, 3, 4].map((dot) => (
                      <motion.span
                        key={dot}
                        className="size-2 rounded-full sm:size-2.5"
                        initial={false}
                        animate={{
                          backgroundColor: step >= 1 && dot <= levels[row] ? "#c9af6f" : "#f3e8c6",
                          scale: step >= 1 && dot === levels[row] ? [1, 1.35, 1] : 1,
                        }}
                        transition={{ duration: 0.4, delay: step >= 1 ? row * 0.12 + dot * 0.03 : 0 }}
                      />
                    ))}
                  </span>
                </li>
              ))}
            </ul>
            <AnimatePresence>
              {step >= 1 ? (
                <motion.p key="saved" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.8 }} className="mt-3 flex items-center gap-1.5 text-[0.6875rem] font-semibold text-sage-700">
                  <DrawCheck className="size-3.5" strokeWidth={3} /> {preview.saved}
                </motion.p>
              ) : null}
            </AnimatePresence>
          </div>

          {/* Trend against the baseline */}
          <div className="flex min-w-0 flex-col rounded-2xl bg-white p-3 shadow-card ring-1 ring-gold-100 sm:p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[0.75rem] font-semibold text-ink">{preview.views.trend.title}</p>
              <span className="hidden truncate text-[0.6875rem] text-ink-muted sm:block">{preview.views.trend.baseline}</span>
            </div>
            <svg viewBox="0 0 200 80" className="mt-3 w-full flex-1 overflow-visible rtl:-scale-x-100">
              <rect x="0" y="26" width="200" height="30" rx="6" className="fill-teal-50" />
              <line x1="0" x2="200" y1="41" y2="41" className="stroke-teal-200" strokeDasharray="3 4" vectorEffect="non-scaling-stroke" />
              <motion.path
                d={trendPath(200, 80)}
                fill="none"
                className="stroke-gold-600"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={false}
                animate={{ pathLength: step >= 2 ? 1 : 0.08 }}
                transition={{ duration: step >= 2 ? 1.6 : 0.4, ease: EASE_OUT }}
              />
            </svg>
            <p className={cn("mt-2 flex items-center gap-1.5 text-[0.6875rem] font-semibold text-teal-700 transition-opacity duration-500", step >= 2 ? "opacity-100" : "opacity-0")}>
              <span className="size-1.5 rounded-full bg-teal-500" />
              {preview.views.trend.verdict}
            </p>
          </div>

          {/* Journal */}
          <div className="col-span-2 rounded-2xl bg-white p-3 shadow-card ring-1 ring-gold-100 sm:p-4">
            <p className="text-[0.75rem] font-semibold text-ink">{preview.views.journal.title}</p>
            <p className="mt-2 line-clamp-2 text-[0.8125rem] leading-6 text-ink-soft">{preview.views.journal.entry}</p>
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              {preview.views.journal.themes.map((theme, index) => (
                <motion.span
                  key={theme}
                  initial={false}
                  animate={{ opacity: step >= 3 ? 1 : 0, y: step >= 3 ? 0 : 6 }}
                  transition={{ duration: 0.4, delay: step >= 3 ? index * 0.12 : 0, ease: EASE_OUT }}
                  className="rounded-full bg-gold-50 px-2.5 py-0.5 text-[0.6875rem] font-semibold text-gold-700 ring-1 ring-gold-100"
                >
                  {theme}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </MockShell>
    </div>
  );
}

type Chapter = HomeStoryCopy["agents"]["mira"];

/** One agent: name, when you meet it, what it does in three lines, its boundary, and the page that explains it. */
function AgentChapter({ id, agent, name, copy, mock, flip }: { id: string; agent: (typeof AGENTS)[number]; name: string; copy: Chapter; mock: ReactNode; flip?: boolean }) {
  const mira = agent.id === "mira";
  return (
    <div id={id} className="grid scroll-mt-24 gap-10 lg:grid-cols-12 lg:items-start lg:gap-12">
      <motion.div variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={REVEAL_VIEWPORT} className={cn("lg:col-span-5", flip && "lg:order-2 lg:col-start-8")}>
        <motion.div variants={fadeUp(0, 14)} className="flex flex-wrap items-center gap-x-4 gap-y-3">
          <AgentAvatar agent={agent.id} className="size-16 rounded-[1.25rem] shadow-card ring-1 ring-white" />
          <div>
            <p className={cn(LABEL, agent.tone.text)}>{copy.role}</p>
            <p className="mt-1 inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-ink-muted">
              <Clock3 className="size-3.5" aria-hidden />
              {copy.when}
            </p>
          </div>
        </motion.div>
        <motion.h3 variants={fadeUp(0, 18)} className={cn(DISPLAY_L, "mt-6 text-ink")}>
          {name}
        </motion.h3>
        <motion.p variants={fadeUp(0, 14)} className={cn(BODY, "mt-3 max-w-md")}>
          {copy.lead}
        </motion.p>

        <motion.ul variants={stagger(0.1)} className="mt-7 space-y-3">
          {copy.does.map((line, index) => (
            <motion.li key={line} variants={fadeUp(0, 10)} className="flex items-start gap-3 text-[1rem] leading-7 text-ink">
              <span className={cn("mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full", mira ? "bg-teal-100 text-teal-700" : "bg-gold-50 text-gold-700 ring-1 ring-gold-100")}>
                <DrawCheck className="size-3.5" strokeWidth={3} delay={0.3 + index * 0.15} />
              </span>
              {line}
            </motion.li>
          ))}
        </motion.ul>

        <motion.p variants={fadeUp(0, 10)} className="mt-6 flex items-start gap-2.5 border-s-2 border-gold ps-3 text-[0.875rem] leading-6 text-ink-soft">
          <Info className="mt-1 size-3.5 shrink-0 text-gold-600" aria-hidden />
          {copy.boundary}
        </motion.p>

        <motion.div variants={fadeUp(0, 10)} className="mt-8">
          <Link
            href={agent.href}
            className={cn(
              "group inline-flex min-h-12 items-center gap-3 rounded-full border bg-white py-1.5 pe-1.5 ps-5 text-[0.9375rem] font-semibold text-ink shadow-card outline-none transition-[border-color,box-shadow] duration-300 hover:shadow-soft-hover focus-visible:ring-2 focus-visible:ring-teal-500",
              agent.tone.border,
            )}
          >
            {copy.cta}
            <span aria-hidden className={cn("flex size-9 items-center justify-center rounded-full transition-colors duration-300", agent.tone.arrow)}>
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" />
            </span>
          </Link>
        </motion.div>
      </motion.div>

      <StageRise className={cn("mx-auto w-full max-w-xl lg:sticky lg:top-28 lg:col-span-6 lg:max-w-none lg:self-start", flip ? "lg:order-1 lg:col-start-1" : "lg:col-start-7")}>
        <TiltCard max={4}>{mock}</TiltCard>
      </StageRise>
    </div>
  );
}

/** Between the two chapters: Mira hands over to Lumina. A gold light runs down the thread. */
function Handoff({ label }: { label: string }) {
  const reduce = useReducedMotion();
  return (
    <div aria-hidden className="relative mx-auto my-14 flex h-28 w-px flex-col items-center justify-center bg-gradient-to-b from-teal-400 via-gold-300 to-gold md:my-20 md:h-36">
      {reduce ? null : (
        <motion.span
          className="absolute left-1/2 size-2 -translate-x-1/2 rounded-full bg-gold shadow-[0_0_12px_3px_rgb(201_175_111/0.55)]"
          animate={{ top: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.6 }}
        />
      )}
      <span className="relative whitespace-nowrap rounded-full border border-line bg-white px-4 py-1.5 text-[0.75rem] font-semibold text-ink-soft shadow-card">{label}</span>
    </div>
  );
}

/** What Mira does and what Lumina does, one chapter each, each with a small working picture of it. */
export const AgentsSection = () => {
  const { language, dictionary } = useLanguage();
  const copy = homeStoryCopy[language].agents;
  const names = dictionary.header.agents.items;
  const [mira, lumina] = AGENTS;

  return (
    <HomeSection id="agents" labelledBy="agents-title" tone="base">
      <SectionHeader variant="editorial" id="agents-title" layout="split" eyebrow={copy.eyebrow} titleA={copy.titleA} titleB={copy.titleB} intro={copy.intro} />

      <div className="mt-14 md:mt-20">
        <AgentChapter id="mira" agent={mira} name={names.mira.name} copy={copy.mira} mock={<MiraMock />} />
        <Handoff label={copy.then} />
        <AgentChapter id="lumina" agent={lumina} name={names.lumina.name} copy={copy.lumina} mock={<LuminaMock />} flip />
      </div>
    </HomeSection>
  );
};
