"use client";

import { type ReactNode } from "react";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { SmoothScrollProvider } from "./SmoothScrollProvider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SmoothScrollProvider>
      <LanguageProvider>{children}</LanguageProvider>
    </SmoothScrollProvider>
  );
}
