"use client";

import type { ReactNode } from "react";
import { MinimalFooter } from "@/components/layout/MinimalFooter";
import { SiteHeader } from "@/components/layout/site-header";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLanguageTransition } from "@/hooks/useLanguageTransition";

type CheckoutLayoutProps = {
  backHref: string;
  backLabel: string;
  footerNote?: string;
  children: ReactNode;
};

/** Focused shell for /subscription/*: Back · logo · language, calm canvas, a reassurance line instead of a marketing footer. */
export function CheckoutLayout({ backHref, backLabel, footerNote, children }: CheckoutLayoutProps) {
  const { direction } = useLanguage();
  const scope = useLanguageTransition<HTMLElement>();

  return (
    <div dir={direction} className="relative isolate flex min-h-dvh flex-col overflow-x-clip bg-canvas text-ink">
      <div aria-hidden className="canvas-glow pointer-events-none absolute inset-0 -z-10" />

      <SiteHeader variant="checkout" backHref={backHref} backLabel={backLabel} />

      <main ref={scope} className="page-container flex-1 pb-16 pt-6 sm:pt-10 lg:pb-24">
        {children}
      </main>

      <MinimalFooter note={footerNote} showLanguage={false} className="border-t border-line" />
    </div>
  );
}
