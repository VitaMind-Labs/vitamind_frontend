"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DiagnosticHeader } from "./DiagnosticHeader";
import { OrientationBackdrop } from "./OrientationBackdrop";
import { OrientationSkeleton } from "./OrientationSkeleton";
import { MiraChatExperience } from "./MiraChatExperience";
import { createChatId } from "../lib/chat";
import type { Lang } from "@/lib/i18n/config";
import { ROUTES } from "@/lib/config/routes";
import { hasValidSession } from "@/lib/api/tokens";

const noSubscribe = () => () => {};

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
  const [languageSwitch, setLanguageSwitch] = useState<{ id: number; language: Lang } | null>(null);
  // A signed-in patient has already completed the orientation (read after mount: the token
  // lives in localStorage). Known before the chat mounts, so no session is ever started.
  const isPatient = useSyncExternalStore(noSubscribe, hasValidSession, () => null);

  useEffect(() => {
    if (chatId) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("chatId", createChatId());
    router.replace(`${ROUTES.orientation}?${params.toString()}`);
  }, [chatId, router, searchParams]);

  if (!chatId || isPatient === null) return <OrientationSkeleton />;

  return (
    // One viewport-tall column: shared header in flow, experience fills the rest and owns the only scroll area.
    <div className="relative flex h-dvh flex-col overflow-hidden">
      <OrientationBackdrop />
      <DiagnosticHeader chatId={chatId} onLanguageChange={(nextLanguage) => setLanguageSwitch({ id: Date.now(), language: nextLanguage })} />
      {/* ACTIVE: Mira v5 flow (REST /api/mira → Nest /api/v1/mira/* → Mira agent /api/v1/mira/*). */}
      <MiraChatExperience chatId={chatId} languageSwitch={languageSwitch} locked={isPatient} />
    </div>
  );
}
