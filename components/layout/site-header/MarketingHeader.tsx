"use client";

import { LayoutGroup, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { ROUTES } from "@/lib/config/routes";
import { SPRING_SOFT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { AgentsMenu } from "./AgentsMenu";
import { PRIMARY_LINKS, isActivePath } from "./agents";
import { HeaderShell } from "./HeaderShell";
import { MobileNavigation } from "./MobileNavigation";

export const NAV_ITEM =
  "relative inline-flex h-10 cursor-pointer items-center rounded-full px-3.5 text-sm font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500";

/** Sliding surface behind the current / hovered destination. */
function ActivePill() {
  return (
    <motion.span
      layoutId="site-nav-pill"
      transition={SPRING_SOFT}
      aria-hidden
      className="absolute inset-0 rounded-full border border-line bg-white shadow-xs"
    />
  );
}

/**
 * Public header: product destinations (agents, plans, support) rather than
 * in-page home anchors. Part of the page at the top, a quiet surface on scroll.
 */
export function MarketingHeader() {
  const pathname = usePathname();
  const { dictionary } = useLanguage();
  const copy = dictionary.header;
  const [menuOpen, setMenuOpen] = useState(false);
  const [agentsOpen, setAgentsOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  const activeId = PRIMARY_LINKS.find((link) => link.href && isActivePath(pathname, link.href))?.id ?? null;
  // The pill follows the pointer, rests on the current page, and sits under "AI agents" while its panel is open.
  const pillId = agentsOpen ? "agents" : (hovered ?? activeId);

  return (
    <HeaderShell
      position={pathname === ROUTES.home ? "fixed" : "sticky"}
      solid={menuOpen || agentsOpen}
      innerClassName="grid grid-cols-[1fr_auto] lg:grid-cols-[1fr_auto_1fr]"
    >
      <BrandLogo size="md" className="justify-self-start" />

      <nav aria-label={dictionary.nav.mainNav} className="relative hidden lg:block" onPointerLeave={() => setHovered(null)}>
        <LayoutGroup id="site-nav">
          <ul className="flex items-center gap-1 rounded-full border border-line/70 bg-white/70 p-1">
            {PRIMARY_LINKS.map((link) => {
              const showPill = pillId === link.id;
              const tone = activeId === link.id || showPill ? "text-ink" : "text-ink-muted hover:text-ink";

              if (!link.href) {
                return (
                  <li key={link.id} onPointerEnter={() => setHovered(link.id)}>
                    <AgentsMenu
                      triggerClassName={cn(NAV_ITEM, tone)}
                      indicator={showPill ? <ActivePill /> : null}
                      onOpenChange={setAgentsOpen}
                    />
                  </li>
                );
              }

              const current = activeId === link.id;
              return (
                <li key={link.id} onPointerEnter={() => setHovered(link.id)}>
                  <Link href={link.href} aria-current={current ? "page" : undefined} className={cn(NAV_ITEM, tone)}>
                    {showPill && <ActivePill />}
                    <span className="relative">{copy.links[link.id]}</span>
                    {current && (
                      <span aria-hidden className="absolute bottom-1 start-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary rtl:translate-x-1/2" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </LayoutGroup>
      </nav>

      <div className="flex items-center gap-2 justify-self-end sm:gap-3">
        <LanguageSwitcher className="hidden sm:inline-flex" />
        <Link
          href={ROUTES.signIn}
          className="group hidden min-h-10 items-center gap-1.5 rounded-full border border-line bg-white/80 px-4 text-sm font-semibold text-ink-soft shadow-xs transition-[color,border-color,box-shadow,transform] duration-200 ease-out-soft hover:border-teal-200 hover:text-teal-800 hover:shadow-card active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500 lg:inline-flex"
        >
          {dictionary.nav.signIn}
          <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-out-soft group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" aria-hidden />
        </Link>
        <MobileNavigation activeId={activeId} open={menuOpen} onOpenChange={setMenuOpen} className="lg:hidden" />
      </div>
    </HeaderShell>
  );
}
