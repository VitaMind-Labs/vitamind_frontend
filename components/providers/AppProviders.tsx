"use client";

import { type ReactNode } from "react";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { DiseaseProvider } from "@/lib/disease-context";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    // <SmoothScrollProvider>
    <LanguageProvider>
      <DiseaseProvider>{children}</DiseaseProvider>
    </LanguageProvider>
    // {/* </SmoothScrollProvider> */ }
  );
}
