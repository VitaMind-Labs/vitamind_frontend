"use client";

import { AgentAvatar } from "@/components/layout/site-header";
import { HomeSection } from "@/components/home/HomeSection";
import { pad } from "@/components/home/accents";
import { SectionHeader } from "@/components/home/SectionHeader";
import { BODY_SM, DISPLAY_M, DISPLAY_S, LABEL, SERIF } from "@/components/home/typography";
import { EASE_OUT, REVEAL_VIEWPORT, fadeUp, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { FileText, LockKeyhole, Quote } from "lucide-react";
import type { ReactNode } from "react";
import { useAgentPage } from "../shared";
import { AGENT_THEME } from "../theme";
import { SIGNAL_LEVELS, monthSeries, smoothPath } from "./chartData";

const grow = (delay = 0) => ({ hidden: { scaleY: 0 }, show: { scaleY: 1, transition: { duration: 0.8, ease: EASE_OUT, delay } } });
const pop = (delay = 0) => ({ hidden: { opacity: 0, scale: 0.6 }, show: { opacity: 1, scale: 1, transition: { type: "spring" as const, stiffness: 320, damping: 20, delay } } });

type Tone = "deep" | "aqua" | "champagne" | "mist" | "ivory";
const TONES: Record<Tone, { surface: string; border: string; title: string; body: string; label: string; icon: string }> = {
  deep: { surface: "bg-teal-900", border: "border-teal-800", title: "text-white", body: "text-teal-100", label: "text-teal-200", icon: "border border-white/15 bg-white/10 text-teal-100" },
  aqua: { surface: "bg-[linear-gradient(155deg,var(--color-teal-100),#ffffff_94%)]", border: "border-teal-200", title: "text-ink", body: "text-ink-soft", label: "text-teal-700", icon: "bg-white text-teal-700" },
  champagne: { surface: "bg-[linear-gradient(155deg,var(--color-gold-50),#f6eed8_96%)]", border: "border-gold-100", title: "text-ink", body: "text-ink-soft", label: "text-gold-700", icon: "bg-white text-gold-700" },
  mist: { surface: "bg-[linear-gradient(155deg,var(--color-teal-50),var(--color-teal-100))]", border: "border-teal-200", title: "text-ink", body: "text-ink-soft", label: "text-teal-700", icon: "bg-white text-teal-700" },
  ivory: { surface: "bg-canvas", border: "border-line", title: "text-ink", body: "text-ink-soft", label: "text-teal-700", icon: "bg-white text-teal-700 ring-1 ring-line" },
};

function Tile({ index, tone, title, line, tag, className, children, large = false }: { index: number; tone: Tone; title: string; line: string; tag: string; className?: string; children: ReactNode; large?: boolean }) {
  const t = TONES[tone];
  const Icon = AGENT_THEME.lumina.icons[index % AGENT_THEME.lumina.icons.length];
  return (
    <motion.article
      variants={fadeUp(0, 26)}
      initial="hidden"
      whileInView="show"
      viewport={REVEAL_VIEWPORT}
      className={cn("group relative isolate flex min-h-[15rem] flex-col overflow-hidden rounded-panel border p-6 transition-[transform,border-color] duration-500 ease-out-soft hover:-translate-y-1 sm:p-7", t.surface, t.border, className)}
    >
      <div className="flex items-center justify-between gap-3">
        <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-2xl", t.icon)}>
          <Icon className="size-[1.125rem]" strokeWidth={1.5} aria-hidden />
        </span>
        <span className="flex items-center gap-2.5">
          <span className={cn(LABEL, t.label)}>{tag}</span>
          <span dir="ltr" className={cn("rounded-full border px-2 py-0.5 font-mono text-[0.6875rem] tabular-nums leading-none", tone === "deep" ? "border-white/20 text-teal-100" : "border-ink/15 text-ink-soft")}>
            {pad(index + 1)}
          </span>
        </span>
      </div>
      <div className="flex-1">{children}</div>
      <h3 className={cn(large ? DISPLAY_M : DISPLAY_S, "mt-6", t.title)}>{title}</h3>
      <p className={cn(BODY_SM, "mt-2", t.body)}>{line}</p>
    </motion.article>
  );
}

/** Dots for a week: five filled, today ringed. */
function Week({ label }: { label: string }) {
  return (
    <div>
      <p className="text-[0.75rem] font-medium text-teal-200">{label}</p>
      <ul className="mt-3 flex gap-2" aria-hidden>
        {[1, 1, 1, 0, 1, 1, 2].map((state, index) => (
          <motion.li
            key={index}
            variants={pop(0.3 + index * 0.07)}
            className={cn("size-7 rounded-full sm:size-8", state === 1 && "bg-gold", state === 0 && "border border-dashed border-white/30", state === 2 && "bg-gold ring-2 ring-white ring-offset-2 ring-offset-teal-900")}
          />
        ))}
      </ul>
    </div>
  );
}

function Ring({ value, label }: { value: number; label: string }) {
  const filled = value / 5;
  return (
    <div className="flex items-center gap-5" aria-hidden>
      <svg viewBox="0 0 100 100" className="size-24 shrink-0 -rotate-90 rtl:rotate-90 rtl:-scale-x-100">
        <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-line)" strokeWidth="9" />
        <motion.circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="var(--color-gold)"
          strokeWidth="9"
          strokeLinecap="round"
          variants={{ hidden: { pathLength: 0 }, show: { pathLength: filled, transition: { duration: 1.3, ease: EASE_OUT, delay: 0.3 } } }}
        />
      </svg>
      <p>
        <span dir="ltr" className={cn(SERIF, "block text-[2.5rem] font-light leading-none tracking-[-0.03em] text-ink")}>
          {value}/5
        </span>
        <span className="mt-1.5 block text-[0.8125rem] text-ink-soft">{label}</span>
      </p>
    </div>
  );
}

/** What Lumina does, as a bento: each tile one title, one line and a small picture of the thing itself. */
export function LuminaBento() {
  const { page, copy } = useAgentPage("lumina");
  const preview = copy.lumina.preview;
  const items = page.role.items;
  const spark = smoothPath(monthSeries(300, 22, 52));

  return (
    <HomeSection id="role" labelledBy="role-title" tone="tint">
      <SectionHeader variant="editorial" id="role-title" counter="01 / 03" eyebrow={page.role.eyebrow} titleA={page.role.titleA} titleB={page.role.titleB} />

      <motion.div variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={REVEAL_VIEWPORT} className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-5">
        <Tile index={0} tone="deep" title={items[0][0]} line={items[0][1]} tag={items[0][2]} large className="sm:col-span-2 lg:row-span-2">
          <div className="mt-8 flex items-center gap-4">
            <AgentAvatar agent="lumina" className="size-14 rounded-2xl ring-1 ring-white/20" />
            <p className={cn(SERIF, "text-[clamp(1.75rem,1.5vw+1.25rem,2.5rem)] font-light leading-tight tracking-[-0.02em] text-white rtl:font-normal rtl:tracking-normal")}>{preview.greeting}</p>
          </div>
          <div className="mt-8">
            <Week label={preview.bento.week} />
          </div>
        </Tile>

        <Tile index={1} tone="aqua" title={items[1][0]} line={items[1][1]} tag={items[1][2]}>
          <div className="mt-6 flex h-16 items-end gap-2" aria-hidden>
            {SIGNAL_LEVELS.map((level, index) => (
              <motion.span key={index} variants={grow(0.2 + index * 0.08)} style={{ height: `${(level / 5) * 100}%`, transformOrigin: "bottom" }} className="flex-1 rounded-t-lg bg-gradient-to-t from-teal-500 to-teal-300" />
            ))}
          </div>
        </Tile>

        <Tile index={2} tone="champagne" title={items[2][0]} line={items[2][1]} tag={items[2][2]}>
          <div className="mt-6" aria-hidden>
            <Quote className="size-5 text-gold-600" />
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {preview.views.journal.themes.map((theme, index) => (
                <motion.li key={theme} variants={pop(0.3 + index * 0.12)} className="rounded-full border border-gold-100 bg-white px-2.5 py-1 text-[0.75rem] font-medium text-gold-700">
                  {theme}
                </motion.li>
              ))}
            </ul>
          </div>
        </Tile>

        <Tile index={3} tone="mist" title={items[3][0]} line={items[3][1]} tag={items[3][2]} className="sm:col-span-2">
          <svg viewBox="0 0 300 70" className="mt-6 h-16 w-full overflow-visible" preserveAspectRatio="none" aria-hidden>
            <rect x="0" y="20" width="300" height="32" rx="8" fill="var(--color-teal-200)" opacity="0.55" />
            <motion.path d={spark} fill="none" stroke="var(--color-teal-700)" strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" variants={{ hidden: { pathLength: 0 }, show: { pathLength: 1, transition: { duration: 1.6, ease: EASE_OUT, delay: 0.2 } } }} />
          </svg>
        </Tile>

        <Tile index={4} tone="ivory" title={items[4][0]} line={items[4][1]} tag={items[4][2]} className="sm:col-span-2">
          <div className="mt-6">
            <Ring value={4} label={preview.bento.goals} />
          </div>
        </Tile>

        <Tile index={5} tone="champagne" title={items[5][0]} line={items[5][1]} tag={items[5][2]} className="sm:col-span-2">
          <div className="relative mt-6 h-16" aria-hidden>
            {[2, 1, 0].map((layer) => (
              <motion.span
                key={layer}
                variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT, delay: 0.2 + (2 - layer) * 0.12 } } }}
                className="absolute inset-y-0 w-24 rounded-xl border border-gold-100 bg-white shadow-soft"
                style={{ insetInlineStart: `${layer * 2.25}rem`, transform: `rotate(${(layer - 1) * 3}deg)` }}
              >
                {layer === 0 && <FileText className="m-3 size-5 text-gold-700" strokeWidth={1.5} />}
              </motion.span>
            ))}
            <span className="absolute end-0 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-ink text-white">
              <LockKeyhole className="size-5" strokeWidth={1.5} />
            </span>
          </div>
        </Tile>
      </motion.div>
    </HomeSection>
  );
}
