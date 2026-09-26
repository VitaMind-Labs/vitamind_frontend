"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { DiagnosticHeader } from "./DiagnosticHeader";
import { MiraChatExperience } from "./MiraChatExperience";
import { createChatId } from "../lib/chat";
import { ensureDiagnosticSession } from "../lib/session";
import type { Lang } from "@/lib/i18n/config";

export function DiagnosticPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Support legacy ?chatId, plus /diagnostic?{sessionID} via ?sessionId / ?sessionID / ?diagnostic
  const chatId =
    searchParams.get("chatId") ||
    searchParams.get("sessionId") ||
    searchParams.get("sessionID") ||
    searchParams.get("diagnostic") ||
    searchParams.get("session");
  const { dictionary, language } = useLanguage();
  const diagnosticText = dictionary.diagnostic;
  const [languageSwitch, setLanguageSwitch] = useState<{ id: number; language: Lang } | null>(null);

  useEffect(() => {
    if (chatId) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("chatId", createChatId());
    router.replace(`/diagnostic?${params.toString()}`);
  }, [chatId, router, searchParams]);

  useEffect(() => {
    if (!chatId) return;

    void ensureDiagnosticSession(chatId, language).catch((error) => {
      console.warn("Diagnostic session could not be persisted yet", error);
    });
  }, [chatId, language]);

  if (!chatId) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-surface-muted px-4" role="status">
        <div className="inline-flex items-center gap-3 rounded-full border border-line bg-white px-5 py-3 text-sm font-medium text-ink shadow-card sm:px-6">
          <Loader2 className="h-4 w-4 shrink-0 animate-spin text-teal-600" aria-hidden />
          <span className="text-center leading-snug">{diagnosticText.preparing || "Preparing your diagnostic session…"}</span>
        </div>
      </div>
    );
  }

  return (
    // One viewport-tall column: shared header in flow, experience fills the rest and owns the only scroll area.
    <div className="flex h-dvh flex-col overflow-hidden bg-surface-muted">
      <DiagnosticHeader chatId={chatId} onLanguageChange={(nextLanguage) => setLanguageSwitch({ id: Date.now(), language: nextLanguage })} />
      {/* ACTIVE: Mira v5 flow (REST /api/mira → Nest /mira/* → ai-service /api/v1/mira/*). */}
      <MiraChatExperience chatId={chatId} languageSwitch={languageSwitch} />
    </div>
  );
}
