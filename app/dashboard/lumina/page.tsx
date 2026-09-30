"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LuminaChat } from "@/components/patient/chat/LuminaChat";
import { OnboardingChat } from "@/components/patient/chat/OnboardingChat";
import { LogoLoader } from "@/components/shared/LogoLoader";
import { usePatient } from "@/hooks/patient/usePatient";

function LuminaScreen() {
  const { profile } = usePatient();
  const params = useSearchParams();
  const prompt = params.get("prompt") ?? undefined;
  // A patient who has not had their first conversation starts there; everyone else gets the full chat.
  const firstConversation = !profile.hasCompletedOnboarding && profile.hasLuminaAccess;
  return firstConversation ? <OnboardingChat /> : <LuminaChat initialPrompt={prompt} />;
}

export default function LuminaPage() {
  return (
    <Suspense fallback={<LogoLoader className="min-h-[60dvh]" />}>
      <LuminaScreen />
    </Suspense>
  );
}
