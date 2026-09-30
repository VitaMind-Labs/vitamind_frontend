"use client";

import { type ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { LanguageProvider } from "@/contexts/LanguageContext";
import type { Lang } from "@/lib/i18n/config";

export function AppProviders({ children, initialLanguage }: { children: ReactNode; initialLanguage: Lang }) {
  return (
    <LanguageProvider initialLanguage={initialLanguage}>
      {/* Honors prefers-reduced-motion for every Framer Motion transform. */}
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LanguageProvider>
  );
}
