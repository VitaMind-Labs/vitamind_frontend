"use client";

import { ShieldCheck } from "lucide-react";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { BRAND } from "@/lib/config/brand";
import { cn } from "@/lib/utils";

type MinimalFooterProps = {
  note?: string;
  /** Off when the page's header already carries the language control. */
  showLanguage?: boolean;
  className?: string;
};

/** Closing line for focused flows (support): reassurance + copyright, never marketing navigation. */
export function MinimalFooter({ note, showLanguage = true, className }: MinimalFooterProps) {
  return (
    <footer className={cn("page-container flex flex-col items-center gap-3 py-6 text-xs text-ink-muted sm:flex-row sm:justify-between", className)}>
      <p className="inline-flex items-center gap-2 text-center">
        <ShieldCheck className="h-4 w-4 shrink-0 text-sage-700" aria-hidden />
        <span>{note ?? `© ${new Date().getFullYear()} ${BRAND.name}`}</span>
      </p>
      {showLanguage ? <LanguageSwitcher /> : note ? <span>© {new Date().getFullYear()} {BRAND.name}</span> : null}
    </footer>
  );
}
