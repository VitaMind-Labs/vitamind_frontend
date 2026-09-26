"use client";

import type { ReactNode } from "react";
import { MinimalFooter } from "@/components/layout/MinimalFooter";
import { SiteHeader } from "@/components/layout/site-header";
import { useLanguage } from "@/contexts/LanguageContext";

type CheckoutLayoutProps = {
  backHref: string;
  backLabel: string;
  footerNote?: string;
  children: ReactNode;
};

/** Shared shell for /subscription/*: logo + Back header, calm canvas, minimal footer. */
export function CheckoutLayout({ backHref, backLabel, footerNote, children }: CheckoutLayoutProps) {
  const { direction } = useLanguage();

  return (
    <div dir={direction} className="relative isolate flex min-h-dvh flex-col overflow-x-clip bg-canvas text-ink">
      <div aria-hidden className="canvas-glow pointer-events-none absolute inset-0 -z-10" />

      <SiteHeader variant="checkout" backHref={backHref} backLabel={backLabel} />

      <main className="page-container flex-1 pb-16 pt-8 sm:pt-12 lg:pb-24">{children}</main>

      <MinimalFooter note={footerNote} className="border-t border-line" />
    </div>
  );
}
