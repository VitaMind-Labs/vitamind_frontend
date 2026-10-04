"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { AgentAvatar } from "./AgentAvatar";
import { AGENTS } from "./agents";

type Agent = (typeof AGENTS)[number];

export function StatusPill({ agent, label, tone = "light" }: { agent: Agent; label: string; tone?: "light" | "dark" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[0.6875rem] font-semibold",
        tone === "dark" ? "border-white/20 bg-white/10 text-white" : "border-line bg-white/90 text-ink-soft",
      )}
    >
      <span aria-hidden className="relative flex h-1.5 w-1.5">
        {agent.status === "live" && (
          <span className={cn("absolute inset-0 rounded-full opacity-70 motion-safe:animate-ping", agent.tone.dot)} />
        )}
        <span className={cn("relative h-1.5 w-1.5 rounded-full", agent.tone.dot)} />
      </span>
      {label}
    </span>
  );
}

type AgentCardProps = {
  agent: Agent;
  /** `feature` for the desktop panel (a deep showcase), `compact` for the mobile menu. */
  variant?: "feature" | "compact";
  onNavigate?: () => void;
};

/** One agent presented as a product: portrait, role, status, what it does and what it changes for you. */
export function AgentCard({ agent, variant = "feature", onNavigate }: AgentCardProps) {
  const { dictionary } = useLanguage();
  const copy = dictionary.header.agents;
  const item = copy.items[agent.id];

  if (variant === "compact") {
    return (
      <Link
        href={agent.href}
        onClick={onNavigate}
        className="group relative flex h-full flex-col rounded-[1.25rem] border border-line bg-white/70 p-3.5 outline-none ring-1 ring-transparent transition-[background-color,box-shadow,border-color] duration-300 ease-out-soft hover:bg-white hover:shadow-soft-hover focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-teal-500"
      >
        <div className="flex items-start gap-3.5">
          <AgentAvatar agent={agent.id} className="h-12 w-12" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="text-base font-semibold tracking-[-0.01em] text-ink">{item.name}</span>
              <StatusPill agent={agent} label={item.status} />
            </div>
            <p className={cn("mt-0.5 text-xs font-semibold uppercase tracking-[0.08em] rtl:normal-case rtl:tracking-normal", agent.tone.text)}>{item.role}</p>
          </div>
        </div>

        <div className={cn("mt-3.5 rounded-2xl px-3.5 py-3", agent.tone.tint)}>
          <p className={cn("flex items-center gap-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.08em] rtl:normal-case rtl:tracking-normal", agent.tone.text)}>
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            {copy.impactLabel}
          </p>
          <p className="mt-1 text-sm leading-6 text-ink-soft">{item.impact}</p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <span className="text-xs font-medium text-ink-subtle">{item.meta}</span>
          <span className={cn("inline-flex items-center gap-1 text-sm font-semibold", agent.tone.text)}>
            {item.cta}
            <ArrowRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden />
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={agent.href}
      onClick={onNavigate}
      className={cn(
        "group relative isolate flex h-full min-h-[14rem] flex-col overflow-hidden rounded-[1.5rem] border p-5 outline-none transition-[transform,border-color,box-shadow] duration-500 ease-out-soft hover:-translate-y-0.5 hover:shadow-soft-hover focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:p-6",
        agent.tone.surface,
        agent.tone.border,
      )}
    >
      <span aria-hidden className={cn("pointer-events-none absolute -z-10 inset-0 opacity-0 transition-opacity duration-700 ease-out-soft group-hover:opacity-100", agent.tone.wash)} />
      <span aria-hidden className={cn("pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r", agent.tone.edge)} />

      <div className="flex items-start justify-between gap-3">
        <AgentAvatar
          agent={agent.id}
          className="size-14 rounded-2xl bg-white/80 ring-1 ring-white transition-transform duration-500 ease-out-soft motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:scale-[1.05]"
        />
        <StatusPill agent={agent} label={item.status} />
      </div>

      <p className="mt-5 font-[family-name:var(--font-home-serif)] text-[1.75rem] font-light leading-none tracking-[-0.02em] text-ink rtl:font-sans rtl:font-semibold rtl:tracking-normal">{item.name}</p>
      <p className={cn("mt-2 text-[0.75rem] font-semibold uppercase tracking-[0.14em] rtl:normal-case rtl:tracking-normal", agent.tone.text)}>{item.role}</p>
      <p className="mt-3 text-[0.9375rem] leading-6 text-ink-soft">{item.tagline}</p>

      <div className="mt-auto flex items-center justify-between gap-3 pt-5">
        <span className="text-[0.8125rem] font-medium text-ink-muted">{item.meta}</span>
        <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-full transition-colors duration-300", agent.tone.arrow)} aria-hidden>
          <ArrowRight className="size-[1.125rem] transition-transform duration-300 ease-out-soft group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" />
        </span>
      </div>
      <span className="sr-only">{item.cta}</span>
    </Link>
  );
}
