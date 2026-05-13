"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { DiagnosticHeader } from "@/components/diagnostic/DiagnosticHeader";
import { ChatExperience } from "@/components/diagnostic/ChatExperience";
import { createChatId } from "@/lib/chat";

export function DiagnosticPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const chatId = searchParams.get("chatId");
  const { dictionary } = useLanguage();
  const diagnosticText = dictionary.diagnostic;

  useEffect(() => {
    if (chatId) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("chatId", createChatId());
    router.replace(`/diagnostic?${params.toString()}`);
  }, [chatId, router, searchParams]);

  if (!chatId) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-background">
        <div className="inline-flex items-center gap-3 rounded-full border border-surface/70 bg-surface/80 px-5 py-3 text-sm font-medium text-on-background shadow-[0_16px_32px_rgba(16,40,35,0.08)] backdrop-blur-sm">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          {diagnosticText.preparing || "Preparing your diagnostic session…"}
        </div>
      </div>
    );
  }

  return (
    <>

      <DiagnosticHeader chatId={chatId} />
      <ChatExperience chatId={chatId} />
    </>
  );
}

