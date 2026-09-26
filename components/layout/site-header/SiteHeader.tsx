"use client";

import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { HeaderShell } from "./HeaderShell";
import { PublicHeader } from "./PublicHeader";

type SiteHeaderProps =
  /** Full navigation — landing and public content. */
  | { variant: "public" }
  /** Logo only, centered — /auth/*. */
  | { variant: "auth" }
  /** Logo + one Back action — /subscription/*. */
  | { variant: "checkout"; backHref: string; backLabel: string }
  /** Logo + one Get started action — /support/*. */
  | { variant: "support" }
  /** Application chrome — logo, optional centre content, trailing controls (diagnostic). */
  | { variant: "app"; center?: ReactNode; actions?: ReactNode; position?: "sticky" | "static" };

export function SiteHeader(props: SiteHeaderProps) {
  const { dictionary } = useLanguage();

  switch (props.variant) {
    case "public":
      return <PublicHeader />;

    case "auth":
      return (
        <HeaderShell position="static" surface="bare" innerClassName="justify-center">
          <BrandLogo size="lg" />
        </HeaderShell>
      );

    case "checkout":
      return (
        <HeaderShell innerClassName="grid grid-cols-[1fr_auto_1fr]">
          <Button asChild variant="ghost" size="sm" className="min-h-10 min-w-0 max-w-full justify-self-start px-3 text-ink-soft hover:text-teal-800">
            <Link href={props.backHref}>
              <ArrowLeft className="rtl:-scale-x-100" aria-hidden />
              <span className="truncate">{props.backLabel}</span>
            </Link>
          </Button>
          <BrandLogo size="md" />
          <span aria-hidden />
        </HeaderShell>
      );

    case "support":
      return (
        <HeaderShell>
          <BrandLogo size="md" className="ms-1" />
          <Button asChild variant="nav" size="sm" className="group ms-auto px-4">
            <Link href="/diagnostic">
              {dictionary.homeLanding.nav.getStarted}
              <ArrowUpRight className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" aria-hidden />
            </Link>
          </Button>
        </HeaderShell>
      );

    case "app":
      return (
        <HeaderShell position={props.position ?? "sticky"} innerClassName="grid grid-cols-[auto_1fr_auto]">
          <BrandLogo size="md" className="ms-1" />
          <div className="flex min-w-0 justify-center">{props.center}</div>
          <div className="flex items-center gap-1 sm:gap-1.5">{props.actions}</div>
        </HeaderShell>
      );
  }
}
