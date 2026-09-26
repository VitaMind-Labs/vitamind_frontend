"use client";

import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { MinimalFooter } from "@/components/layout/MinimalFooter";
import { SiteHeader } from "@/components/layout/site-header";
import { useLanguage } from "@/contexts/LanguageContext";

/** Shared shell for /auth/*: logo-only header, calm canvas, centred form, minimal footer. */
export function AuthLayout({ children }: { children: ReactNode }) {
  const { direction } = useLanguage();

  return (
    <div dir={direction} className="relative isolate flex min-h-dvh flex-col overflow-x-clip bg-canvas text-ink">
      <div aria-hidden className="canvas-glow pointer-events-none absolute inset-0 -z-10" />

      <SiteHeader variant="auth" />

      <main className="flex flex-1 items-start justify-center px-4 pb-12 pt-4 sm:items-center sm:px-6 sm:pb-16">
        <div className="w-full max-w-[28rem]">{children}</div>
      </main>

      <MinimalFooter className="border-t border-line" />
    </div>
  );
}

export function AuthLoading() {
  return (
    <div className="flex min-h-[20rem] w-full items-center justify-center" role="status" aria-label="Loading">
      <Loader2 className="h-7 w-7 animate-spin text-teal-700" aria-hidden />
    </div>
  );
}
