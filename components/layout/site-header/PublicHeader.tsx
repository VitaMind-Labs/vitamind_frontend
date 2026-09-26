"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { EASE_OUT, SPRING_SOFT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { HeaderShell } from "./HeaderShell";

const SECTIONS = ["home", "features", "how-it-works", "pricing"] as const;

function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState<string>("home");

  useEffect(() => {
    if (!enabled) return;
    const onScroll = () => {
      for (const id of [...SECTIONS].reverse()) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 180) {
          setActive(id);
          return;
        }
      }
      setActive("home");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [enabled]);

  return active;
}

/** Public variant: full navigation. Used by the landing page and public content pages. */
export function PublicHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const activeSection = useActiveSection(isHome);
  const { dictionary, direction } = useLanguage();
  const copy = dictionary.homeLanding.nav;

  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const links = [
    { id: "home", label: copy.home },
    { id: "features", label: copy.features },
    { id: "how-it-works", label: copy.process },
    { id: "pricing", label: copy.pricing },
  ].map((link) => ({ ...link, href: isHome ? `#${link.id}` : `/#${link.id}` }));

  return (
    <>
      <HeaderShell position={isHome ? "fixed" : "sticky"}>
        <BrandLogo size="md" className="ms-1" />

        <nav aria-label="Primary" className="mx-auto hidden items-center gap-0.5 lg:flex">
          {links.map((link) => {
            const active = isHome && activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                aria-current={active ? "true" : undefined}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-teal-500",
                  active ? "text-teal-800" : "text-ink-muted hover:text-ink",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="public-nav-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-teal-50 ring-1 ring-teal-100"
                    transition={SPRING_SOFT}
                    aria-hidden
                  />
                )}
                {link.label}
              </a>
            );
          })}
        </nav>

        <div className="ms-auto flex shrink-0 items-center gap-1.5 sm:gap-2 lg:ms-0">
          <LanguageSwitcher className="hidden sm:inline-flex" />
          <Link
            href="/auth/signin"
            className="hidden rounded-full px-3 py-2 text-sm font-semibold text-ink-soft transition-colors hover:text-teal-700 xl:inline-flex"
          >
            {dictionary.nav.signIn}
          </Link>
          <Button asChild variant="nav" size="sm" className="group hidden px-4 sm:inline-flex">
            <Link href="/diagnostic">
              {copy.getStarted}
              <ArrowUpRight className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" aria-hidden />
            </Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label={menuOpen ? copy.close : copy.menu}
            aria-expanded={menuOpen}
            aria-controls="public-mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
            className="h-11 w-11 min-h-11 border-line lg:hidden"
          >
            {menuOpen ? <X aria-hidden /> : <Menu aria-hidden />}
          </Button>
        </div>
      </HeaderShell>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-ink/25 backdrop-blur-[2px] lg:hidden"
              onClick={() => setMenuOpen(false)}
              aria-hidden
            />
            <motion.div
              id="public-mobile-menu"
              dir={direction}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.24, ease: EASE_OUT }}
              data-lenis-prevent
              className="fixed inset-x-3 top-[calc(max(0.75rem,env(safe-area-inset-top))+4.5rem)] z-50 max-h-[calc(100dvh-6rem)] overflow-y-auto rounded-3xl border border-line bg-white p-4 shadow-float sm:inset-x-4 sm:p-5 lg:hidden"
            >
              <nav aria-label="Mobile" className="flex flex-col gap-1">
                {links.map((link) => (
                  <a
                    key={link.id}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex min-h-12 items-center justify-between rounded-2xl px-4 text-[0.9375rem] font-medium text-ink transition-colors hover:bg-teal-50 hover:text-teal-800"
                  >
                    {link.label}
                    <ArrowUpRight className="h-4 w-4 text-ink-subtle rtl:-scale-x-100" aria-hidden />
                  </a>
                ))}
              </nav>

              <div className="mt-4 grid gap-2.5 border-t border-line pt-4">
                <Button asChild variant="default" size="lg" className="w-full">
                  <Link href="/diagnostic" onClick={() => setMenuOpen(false)}>
                    {copy.getStarted}
                    <ArrowUpRight className="rtl:-scale-x-100" aria-hidden />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full">
                  <Link href="/auth/signin" onClick={() => setMenuOpen(false)}>
                    {dictionary.nav.signIn}
                  </Link>
                </Button>
                <div className="flex justify-center pt-1 sm:hidden">
                  <LanguageSwitcher />
                </div>
              </div>

              <p className="mt-4 text-center text-xs leading-5 text-ink-muted">{dictionary.home.disclaimer}</p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
