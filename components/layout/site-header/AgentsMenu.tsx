"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronDown, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ROUTES } from "@/lib/config/routes";
import { EASE_OUT, SPRING_SOFT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { AgentCard } from "./AgentCard";
import { AGENTS } from "./agents";

const OPEN_DELAY = 80;
const CLOSE_DELAY = 160;

type AgentsMenuProps = {
  triggerClassName: string;
  /** Rendered inside the trigger (e.g. the shared active pill). */
  indicator?: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
};

/**
 * "AI agents" disclosure: opens on hover intent or click, closes on Escape,
 * outside click, focus leaving the region or navigation. The panel is a
 * showcase of links (not an ARIA menu), so plain Tab order applies inside it.
 */
export function AgentsMenu({ triggerClassName, indicator, onOpenChange }: AgentsMenuProps) {
  const { dictionary, direction } = useLanguage();
  const copy = dictionary.header;
  const reduce = useReducedMotion();
  const rise = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_OUT } },
  };
  const panelId = useId();
  const [open, setOpenState] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const timer = useRef<number | undefined>(undefined);

  const setOpen = useCallback(
    (next: boolean) => {
      window.clearTimeout(timer.current);
      setOpenState(next);
      onOpenChange?.(next);
    },
    [onOpenChange],
  );

  const schedule = (next: boolean) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(next), next ? OPEN_DELAY : CLOSE_DELAY);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    };
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open, setOpen]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <div
      ref={rootRef}
      // Not positioned: the panel anchors to the enclosing <nav> so it centres under the whole header.
      onPointerEnter={(event) => event.pointerType === "mouse" && schedule(true)}
      onPointerLeave={(event) => event.pointerType === "mouse" && schedule(false)}
      onBlur={(event) => {
        if (!rootRef.current?.contains(event.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(!open)}
        className={cn(triggerClassName, "gap-1.5", open && "text-ink")}
      >
        {indicator}
        {/* A quiet "live" beacon: the agents are the product, draw the eye without shouting. */}
        <span aria-hidden className="relative flex h-1.5 w-1.5">
          <span className="absolute inset-0 rounded-full bg-sage opacity-70 motion-safe:animate-ping" />
          <span className="relative h-1.5 w-1.5 rounded-full bg-sage" />
        </span>
        <span className="relative">{copy.links.agents}</span>
        <ChevronDown
          aria-hidden
          className={cn("relative h-4 w-4 transition-transform duration-300 ease-out-soft", open && "rotate-180 text-teal-700")}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={panelId}
            dir={direction}
            role="region"
            aria-label={copy.links.agents}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.97 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1, transition: SPRING_SOFT }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98, transition: { duration: 0.16, ease: EASE_OUT } }}
            style={{ transformOrigin: "top center" }}
            className="absolute start-1/2 top-full z-50 w-[min(42rem,calc(100vw-2rem))] -translate-x-1/2 pt-3 rtl:translate-x-1/2"
          >
            {/* pt-3 above bridges the gap under the trigger so hover intent survives the trip to the panel. */}
            <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-float ring-1 ring-line/60 backdrop-blur-2xl">
              <div aria-hidden className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

              <div className="flex items-end justify-between gap-6 px-6 pb-2 pt-5">
                <div>
                  <p className="home-label text-teal-700">{copy.agents.eyebrow}</p>
                  <p className="mt-1.5 max-w-md text-lg font-light leading-snug tracking-[-0.015em] text-ink rtl:font-normal">
                    {copy.agents.title}
                  </p>
                </div>
              </div>

              <motion.ul
                initial="hidden"
                animate="show"
                variants={{ hidden: {}, show: { transition: { staggerChildren: reduce ? 0 : 0.08, delayChildren: reduce ? 0 : 0.05 } } }}
                className="grid grid-cols-1 gap-3 p-3 pt-2 sm:grid-cols-2"
              >
                {AGENTS.map((agent) => (
                  <motion.li key={agent.id} variants={rise}>
                    <AgentCard agent={agent} onNavigate={() => setOpen(false)} />
                  </motion.li>
                ))}
              </motion.ul>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-surface-muted/70 px-6 py-3.5">
                <ul className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-medium text-ink-muted">
                  {copy.agents.trust.map((label, i) => (
                    <li key={label} className="inline-flex items-center gap-1.5">
                      {i === 0 ? (
                        <ShieldCheck className="h-3.5 w-3.5 text-teal-600" aria-hidden />
                      ) : (
                        <span aria-hidden className="h-1 w-1 rounded-full bg-line-strong" />
                      )}
                      <span dir={i === 2 ? "auto" : undefined}>{label}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={ROUTES.plans}
                  onClick={() => setOpen(false)}
                  className="group inline-flex min-h-9 items-center gap-1 rounded-full px-2 text-sm font-semibold text-teal-700 transition-colors duration-200 hover:text-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
                >
                  <span className="home-link-line">{copy.agents.allPlans}</span>
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-300 ease-out-soft group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
                    aria-hidden
                  />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
