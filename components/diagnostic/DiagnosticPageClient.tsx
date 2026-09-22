"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { DiagnosticHeader } from "@/components/diagnostic/DiagnosticHeader";
import { MiraChatExperience } from "@/components/diagnostic/MiraChatExperience";
// LEGACY: button-based flow (ChatExperience + socket.io + old /mira/chat endpoints)
// is preserved in the repo but inactive — the v5 ai-service no longer serves it.
// import { ChatExperience } from "@/components/diagnostic/ChatExperience";
import { createChatId } from "@/lib/chat";
import { ensureDiagnosticSession } from "@/lib/diagnosticSession";
import type { Lang } from "@/lib/i18n";

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
      <div className="flex min-h-[100dvh] min-h-[100svh] items-center justify-center bg-[#f4f6f5] px-4">
        <div className="inline-flex items-center gap-3 rounded-full border border-white/60 bg-white/80 px-5 sm:px-6 py-3 sm:py-3.5 text-sm font-medium text-[#2c3e3b] shadow-[0_16px_32px_rgba(16,40,35,0.08)] backdrop-blur-xl">
          <Loader2 className="h-4 w-4 animate-spin text-primary shrink-0" />
          <span className="text-center leading-snug">{diagnosticText.preparing || "Preparing your diagnostic session…"}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] min-h-[100svh] overflow-hidden bg-[#f4f6f5]">
      <DiagnosticHeader chatId={chatId} onLanguageChange={(nextLanguage) => setLanguageSwitch({ id: Date.now(), language: nextLanguage })} />
      {/* ACTIVE: Mira v5 flow (REST /api/mira → Nest /mira/* → ai-service /api/v1/mira/*). */}
      <MiraChatExperience chatId={chatId} languageSwitch={languageSwitch} />
    </div>
  );
}
