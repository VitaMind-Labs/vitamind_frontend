"use client";

import { AgentStatusPill } from "@/components/agents/AgentStatusPill";
import { AGENTS, AgentAvatar } from "@/components/layout/site-header";
import { useLanguage } from "@/contexts/LanguageContext";
import { agentPagesCopy } from "@/lib/i18n/agents";
import { REVEAL_VIEWPORT, fadeUp, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { HomeSection } from "./HomeSection";
import { SectionHeader } from "./SectionHeader";
import { BODY_SM, DISPLAY_M, LABEL } from "./typography";

/**
 * The two agents as two doors: each card is one link to the agent's own page. Mira (teal and aqua) and Lumina
 * (champagne and gold) wear their own colours, and Lumina sits a little lower so the pair reads as a sequence.
 */
export const AgentsSection = () => {
  const { dictionary, language } = useLanguage();
  const copy = agentPagesCopy[language].home;
  const items = dictionary.header.agents.items;

  return (
    <HomeSection id="agents" labelledBy="agents-title" tone="tint">
      <SectionHeader variant="editorial" id="agents-title" layout="split" counter="03 / 07" eyebrow={copy.eyebrow} titleA={copy.titleA} titleB={copy.titleB} intro={copy.intro} />

      <motion.ul variants={stagger(0.12)} initial="hidden" whileInView="show" viewport={REVEAL_VIEWPORT} className="mt-12 grid gap-5 md:mt-16 lg:grid-cols-2 lg:gap-6">
        {AGENTS.map((agent, index) => {
          const item = items[agent.id];
          const card = copy.cards[agent.id];

          return (
            <motion.li key={agent.id} variants={fadeUp(0, 28)} className={cn(index === 1 && "lg:mt-14")}>
              <Link
                href={agent.href}
                className={cn(
                  "group relative isolate flex h-full min-h-[26rem] flex-col overflow-hidden rounded-[2rem] border p-7 outline-none transition-[transform,border-color,box-shadow] duration-500 ease-out-soft hover:-translate-y-1.5 hover:shadow-soft-hover focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas sm:p-9",
                  agent.tone.surface,
                  agent.tone.border,
                )}
              >
                <span aria-hidden className={cn("pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-700 ease-out-soft group-hover:opacity-100", agent.tone.wash)} />
                <span aria-hidden className={cn("pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r", agent.tone.edge)} />

                <div className="flex items-start justify-between gap-3">
                  <AgentAvatar agent={agent.id} className="size-20 rounded-3xl bg-white/80 ring-1 ring-white transition-transform duration-500 ease-out-soft motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:scale-[1.05]" />
                  <AgentStatusPill agent={agent} label={item.status} />
                </div>

                <h3 className={cn(DISPLAY_M, "mt-8 text-ink")}>{item.name}</h3>
                <p className={cn(LABEL, "mt-3", agent.tone.text)}>{item.role}</p>
                <p className={cn(BODY_SM, "mt-4 max-w-md text-[1rem]")}>{item.tagline}</p>

                <ul className="mt-6 space-y-2.5">
                  {card.points.map((point) => (
                    <li key={point} className="flex items-start gap-3 text-[0.9375rem] leading-6 text-ink-soft">
                      <Check className={cn("mt-1 size-4 shrink-0", agent.tone.text)} strokeWidth={2} aria-hidden />
                      {point}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto flex items-center justify-between gap-4 pt-9">
                  <span className="text-[0.8125rem] font-medium text-ink-muted">{item.meta}</span>
                  <span className={cn("inline-flex items-center gap-3 text-[0.9375rem] font-semibold", agent.tone.text)}>
                    {card.cta}
                    <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-full transition-colors duration-300", agent.tone.arrow)} aria-hidden>
                      <ArrowRight className="size-[1.125rem] transition-transform duration-300 ease-out-soft group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" />
                    </span>
                  </span>
                </div>
              </Link>
            </motion.li>
          );
        })}
      </motion.ul>
    </HomeSection>
  );
};
