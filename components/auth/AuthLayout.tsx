"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { AuthBrandPanel } from "@/components/auth/AuthBrandPanel";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { LogoLoader } from "@/components/shared/LogoLoader";
import { HEADER_HEIGHT } from "@/components/layout/site-header";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLanguageTransition } from "@/hooks/useLanguageTransition";
import { BRAND } from "@/lib/config/brand";
import { EASE_OUT } from "@/lib/motion";

/**
 * Dedicated shell for /auth/* — no marketing header or footer.
 * Top: brand + language. Mobile/tablet: the form is the whole experience.
 * Desktop: brand story + auth column, mirrored by reading direction via grid order.
 */
export function AuthLayout({ children }: { children: ReactNode }) {
  const { direction, dictionary } = useLanguage();
  const scope = useLanguageTransition<HTMLElement>();

  return (
    <div dir={direction} className="relative isolate flex min-h-dvh flex-col overflow-x-clip bg-canvas text-ink">
      <div aria-hidden className="canvas-glow pointer-events-none absolute inset-0 -z-10" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 opacity-30 [mask-image:linear-gradient(to_bottom,black,transparent)] lg:hidden"
      >
        <Image src="/assets/hero-bg.png" alt="" fill sizes="100vw" className="object-cover" />
      </div>

      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE_OUT }}
        className={`page-container flex items-center justify-between gap-3 pt-[env(safe-area-inset-top)] ${HEADER_HEIGHT}`}
      >
        <BrandLogo size="md" />
        <LanguageSwitcher />
      </motion.header>

      <main
        ref={scope}
        className="page-container flex flex-1 flex-col pb-10 pt-3 sm:pb-14 sm:pt-6 lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,28rem)] lg:gap-10 lg:pt-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] xl:gap-16"
      >
        <AuthBrandPanel />
        <div className="mx-auto flex w-full max-w-[28rem] flex-1 flex-col justify-start sm:justify-center lg:max-w-none lg:py-4">
          {children}
        </div>
      </main>

      <footer className="page-container flex flex-wrap items-center justify-center gap-x-4 gap-y-1 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-xs text-ink-muted sm:justify-between">
        <p className="inline-flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 shrink-0 text-sage-700" aria-hidden />
          © {new Date().getFullYear()} {BRAND.name}
        </p>
        <Link href="/support" className="inline-flex min-h-10 items-center rounded-md transition-colors duration-200 hover:text-teal-700">
          <span className="home-link-line">{dictionary.nav.support}</span>
        </Link>
      </footer>
    </div>
  );
}

export function AuthLoading() {
  return (
    <LogoLoader size={64} className="min-h-[20rem] w-full" />
  );
}
