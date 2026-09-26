"use client";

import { ShieldCheck } from "lucide-react";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { BRAND } from "@/lib/config/brand";
import { cn } from "@/lib/utils";

/**
 * Footer for focused flows (auth, subscription, payment) whose header carries
 * no navigation: keeps language switching reachable without cluttering the header.
 */
export function MinimalFooter({ note, className }: { note?: string; className?: string }) {
  return (
    <footer className={cn("page-container flex flex-col items-center gap-3 py-6 text-xs text-ink-muted sm:flex-row sm:justify-between", className)}>
      <p className="inline-flex items-center gap-2 text-center">
        <ShieldCheck className="h-4 w-4 shrink-0 text-sage-700" aria-hidden />
        <span>{note ?? `© ${new Date().getFullYear()} ${BRAND.name}`}</span>
      </p>
      <LanguageSwitcher />
    </footer>
  );
}
