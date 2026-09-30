"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { AgentAvatar } from "./AgentAvatar";
import { AGENTS } from "./agents";

type Agent = (typeof AGENTS)[number];

export function StatusPill({ agent, label }: { agent: Agent; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white/90 px-2 py-0.5 text-[0.6875rem] font-semibold text-ink-soft">
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
  /** `feature` for the desktop panel, `compact` for the mobile menu. */
  variant?: "feature" | "compact";
  onNavigate?: () => void;
};

/** One agent presented as a product: portrait, role, status, what it does and what it changes for you. */
export function AgentCard({ agent, variant = "feature", onNavigate }: AgentCardProps) {
  const { dictionary } = useLanguage();
  const copy = dictionary.header.agents;
  const item = copy.items[agent.id];
  const compact = variant === "compact";

  return (
    <Link
      href={agent.href}
      onClick={onNavigate}
      className={cn(
        "group relative flex h-full flex-col rounded-[1.25rem] border border-transparent p-4 outline-none ring-1 ring-transparent transition-[background-color,box-shadow,border-color] duration-300 ease-out-soft",
        "hover:border-line hover:bg-white hover:shadow-soft-hover focus-visible:border-line focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-teal-500",
        agent.tone.ring,
        compact && "border-line bg-white/70 p-3.5",
      )}
    >
      <div className="flex items-start gap-3.5">
        <span className="relative shrink-0">
          <span
            aria-hidden
            className={cn(
              "absolute inset-1 rounded-[1.25rem] opacity-0 blur-lg transition-opacity duration-500 ease-out-soft group-hover:opacity-60",
              agent.id === "mira" ? "bg-teal-400" : "bg-gold",
            )}
          />
          <AgentAvatar
            agent={agent.id}
            className={cn(
              "relative transition-transform duration-500 ease-out-soft motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:scale-[1.04]",
              compact && "h-12 w-12",
            )}
          />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-base font-semibold tracking-[-0.01em] text-ink">{item.name}</span>
            <StatusPill agent={agent} label={item.status} />
          </div>
          <p className={cn("mt-0.5 text-xs font-semibold uppercase tracking-[0.08em] rtl:tracking-normal", agent.tone.text)}>{item.role}</p>
        </div>
      </div>

      {!compact && <p className="mt-3.5 text-sm leading-6 text-ink-muted">{item.description}</p>}

      <div className={cn("mt-3.5 rounded-2xl px-3.5 py-3", agent.tone.tint)}>
        <p className={cn("flex items-center gap-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.08em] rtl:tracking-normal", agent.tone.text)}>
          <Sparkles className="h-3.5 w-3.5" aria-hidden />
          {copy.impactLabel}
        </p>
        <p className="mt-1 text-sm leading-6 text-ink-soft">{item.impact}</p>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 pt-4">
        <span className="text-xs font-medium text-ink-subtle">{item.meta}</span>
        <span className={cn("inline-flex items-center gap-1 text-sm font-semibold", agent.tone.text)}>
          {item.cta}
          <ArrowRight
            className="h-4 w-4 transition-transform duration-300 ease-out-soft group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
            aria-hidden
          />
        </span>
      </div>
    </Link>
  );
}
