"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { HeaderShell } from "./HeaderShell";
import { MarketingHeader } from "./MarketingHeader";

/**
 * One header system, one variant per page context. Auth has no header here —
 * it owns a dedicated minimal shell (`AuthLayout`).
 */
type SiteHeaderProps =
  /** Full marketing navigation — landing and public content. */
  | { variant: "public" }
  /** Focused checkout: Back · logo · language — /subscription/*. */
  | { variant: "checkout"; backHref: string; backLabel: string }
  /** Support pages share the public header (Support shows as the current destination). */
  | { variant: "support" }
  /** Application chrome — logo, optional centre content, trailing controls (orientation). */
  | { variant: "app"; center?: ReactNode; actions?: ReactNode; position?: "sticky" | "static" };

export function SiteHeader(props: SiteHeaderProps) {
  switch (props.variant) {
    case "public":
    case "support":
      return <MarketingHeader />;

    case "checkout":
      return (
        <HeaderShell innerClassName="grid grid-cols-[1fr_auto_1fr]">
          <Button asChild variant="ghost" size="sm" className="group min-h-10 min-w-0 max-w-full justify-self-start px-2 text-ink-soft hover:bg-transparent hover:text-teal-800 sm:px-3">
            <Link href={props.backHref}>
              <ArrowLeft className="transition-transform duration-300 ease-out-soft group-hover:-translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:translate-x-0.5" aria-hidden />
              <span className="hidden truncate sm:inline">{props.backLabel}</span>
              <span className="sr-only sm:hidden">{props.backLabel}</span>
            </Link>
          </Button>
          <BrandLogo size="md" />
          <LanguageSwitcher className="justify-self-end" />
        </HeaderShell>
      );

    case "app":
      return (
        // Flat application chrome over the misted canvas: a hairline, no floating pill.
        <HeaderShell position={props.position ?? "sticky"} className="border-b border-white/70" innerClassName="max-w-chat grid grid-cols-[auto_1fr_auto]">
          <BrandLogo size="md" />
          <div className="flex min-w-0 justify-center">{props.center}</div>
          <div className="flex items-center gap-1 sm:gap-1.5">{props.actions}</div>
        </HeaderShell>
      );
  }
}
