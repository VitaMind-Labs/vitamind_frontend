"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { ROUTES } from "@/lib/config/routes";
import { EASE_OUT, fadeUp, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { AgentCard } from "./AgentCard";
import { AGENTS, PRIMARY_LINKS, type PrimaryLinkId } from "./agents";

/** Two lines that fold into an X — shared by the trigger and the in-panel close so the switch reads as one control. */
function MenuGlyph({ open }: { open: boolean }) {
  return (
    <span aria-hidden className="relative block h-3 w-[1.125rem]">
      <span className={cn("absolute inset-x-0 top-0 h-[1.5px] rounded-full bg-current transition-transform duration-300 ease-out-soft", open && "translate-y-[5.25px] rotate-45")} />
      <span className={cn("absolute inset-x-0 bottom-0 h-[1.5px] rounded-full bg-current transition-transform duration-300 ease-out-soft", open && "-translate-y-[5.25px] -rotate-45")} />
    </span>
  );
}

const ROUND_CONTROL =
  "relative inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-line bg-white/80 text-ink backdrop-blur-sm transition-colors duration-200 hover:border-teal-200 hover:text-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500";

type MobileNavigationProps = {
  activeId: PrimaryLinkId | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
};

/**
 * Mobile & tablet navigation: a calm full-screen sheet.
 * Agents first (the product), then destinations, then language and actions.
 */
export function MobileNavigation({ activeId, open, onOpenChange, className }: MobileNavigationProps) {
  const { dictionary, direction } = useLanguage();
  const copy = dictionary.header;
  const nav = dictionary.homeLanding.nav;
  const close = () => onOpenChange(false);

  // Never leave a mobile menu open behind the desktop layout.
  useEffect(() => {
    if (!open) return;
    const query = window.matchMedia("(min-width: 1024px)");
    const onChange = (event: MediaQueryListEvent) => event.matches && onOpenChange(false);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [open, onOpenChange]);

  // Deterministic page lock while open (the home page manages body overflow inline, so don't rely on defaults).
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const links = PRIMARY_LINKS.flatMap((link) => (link.href ? [{ ...link, href: link.href }] : []));

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>
        <button type="button" aria-label={nav.menu} className={cn(ROUND_CONTROL, className)}>
          <MenuGlyph open={false} />
        </button>
      </Dialog.Trigger>

      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Content forceMount asChild aria-describedby={undefined}>
              <motion.div
                dir={direction}
                data-lenis-prevent
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.28, ease: EASE_OUT } }}
                exit={{ opacity: 0, transition: { duration: 0.18, ease: EASE_OUT } }}
                className="fixed inset-0 z-[60] flex flex-col overflow-y-auto overscroll-contain bg-canvas lg:hidden"
              >
                <Dialog.Title className="sr-only">{dictionary.nav.mainNav}</Dialog.Title>
                <div aria-hidden className="canvas-glow pointer-events-none absolute inset-0 -z-10" />

                {/* Mirrors the header row so the menu opens "in place". */}
                <div className="pt-[env(safe-area-inset-top)]">
                  <div className="page-container flex h-16 items-center justify-between gap-3">
                    <BrandLogo size="md" href={null} />
                    <Dialog.Close asChild>
                      <button type="button" aria-label={nav.close} className={ROUND_CONTROL}>
                        <MenuGlyph open />
                      </button>
                    </Dialog.Close>
                  </div>
                </div>

                <motion.nav
                  aria-label={dictionary.nav.mainNav}
                  variants={stagger(0.06, 0.06)}
                  initial="hidden"
                  animate="show"
                  className="page-container mt-4 flex-1 sm:mt-6"
                >
                  <motion.p variants={fadeUp(0, 10)} className="home-label text-teal-700">
                    {copy.agents.eyebrow}
                  </motion.p>
                  <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
                    {AGENTS.map((agent) => (
                      <motion.li key={agent.id} variants={fadeUp(0, 12)}>
                        <AgentCard agent={agent} variant="compact" onNavigate={close} />
                      </motion.li>
                    ))}
                  </ul>

                  <ul className="mt-8 border-t border-line">
                    {links.map((link) => {
                      const active = link.id === activeId;
                      return (
                        <motion.li key={link.id} variants={fadeUp(0, 12)}>
                          <Link
                            href={link.href}
                            onClick={close}
                            aria-current={active ? "page" : undefined}
                            className="group flex min-h-16 items-center gap-4 border-b border-line py-3 outline-none focus-visible:bg-white/70 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-500"
                          >
                            <span className="min-w-0 flex-1 text-[clamp(1.375rem,4.5vw,1.75rem)] font-light leading-tight tracking-[-0.02em] text-ink rtl:font-normal">
                              {copy.links[link.id]}
                            </span>
                            {active ? <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" /> : null}
                            <ArrowRight
                              className="h-5 w-5 shrink-0 text-ink-subtle transition-[translate,color] duration-300 ease-out-soft group-hover:translate-x-1 group-hover:text-teal-700 rtl:-scale-x-100 rtl:group-hover:-translate-x-1"
                              aria-hidden
                            />
                          </Link>
                        </motion.li>
                      );
                    })}
                  </ul>
                </motion.nav>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_OUT, delay: 0.3 } }}
                  className="page-container pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-10"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-medium text-ink-soft">{dictionary.nav.language}</span>
                    <LanguageSwitcher size="md" />
                  </div>
                  <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
                    <Button asChild size="lg" className="group w-full">
                      <Link href={ROUTES.signIn} onClick={close}>
                        {dictionary.nav.signIn}
                        <ArrowRight className="transition-transform duration-300 ease-out-soft group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" aria-hidden />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="w-full">
                      <Link href={ROUTES.signUp} onClick={close}>
                        {dictionary.nav.signUp}
                      </Link>
                    </Button>
                  </div>
                  <p className="mt-6 text-xs leading-5 text-ink-muted">{dictionary.home.disclaimer}</p>
                </motion.div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
