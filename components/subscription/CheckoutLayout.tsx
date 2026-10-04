"use client";

import type { ReactNode } from "react";
import { Grain } from "@/components/home/Atmosphere";
import { homeSerif } from "@/components/home/fonts";
import { MinimalFooter } from "@/components/layout/MinimalFooter";
import { SiteHeader } from "@/components/layout/site-header";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLanguageTransition } from "@/hooks/useLanguageTransition";
import { cn } from "@/lib/utils";

type CheckoutLayoutProps = {
  backHref: string;
  backLabel: string;
  footerNote?: string;
  children: ReactNode;
};

/**
 * Focused shell for /subscription/*: a floating capsule header (Back · logo · language), the same still canvas as
 * /support, and a reassurance line instead of a marketing footer.
 */
export function CheckoutLayout({ backHref, backLabel, footerNote, children }: CheckoutLayoutProps) {
  const { direction } = useLanguage();
  const scope = useLanguageTransition<HTMLElement>();

  return (
    <div dir={direction} className={cn(homeSerif.variable, "relative isolate flex min-h-dvh flex-col overflow-x-clip bg-canvas text-ink")}>
      {/* The same canvas as /support: one still wash of light and a fine grain — nothing drifts behind a page people pay on. */}
      <div aria-hidden className="canvas-glow pointer-events-none absolute inset-0 -z-10" />
      <Grain tone="light" />

      <SiteHeader variant="checkout" backHref={backHref} backLabel={backLabel} />

      <main ref={scope} className="page-container relative flex-1 pb-20 pt-8 sm:pt-12 lg:pb-28">
        {children}
      </main>

      <div className="relative">
        <MinimalFooter note={footerNote} showLanguage={false} className="border-t border-line-strong/60 text-[0.875rem] text-ink-soft" />
      </div>
    </div>
  );
}
