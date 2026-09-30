"use client";

import Link from "next/link";
import { Check, Copy, House, ShieldCheck, Volume2, VolumeX } from "lucide-react";
import { useState, useSyncExternalStore } from "react";
import { SiteHeader } from "@/components/layout/site-header";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAudio } from "@/contexts/AudioContext";
import { stopAllSpeech } from "@/hooks/useSpeech";
import { hasValidSession } from "@/lib/api/tokens";
import type { Lang } from "@/lib/i18n/config";
import { ROUTES } from "@/lib/config/routes";
import { cn } from "@/lib/utils";
import { stopDiagnosticVoice, warmUpDiagnosticVoice } from "../lib/voice";

/** Diagnostic uses the shared application header; only its controls are specific. */
export function DiagnosticHeader({ chatId, onLanguageChange }: { chatId: string; onLanguageChange?: (language: Lang) => void }) {
  const { dictionary } = useLanguage();
  const { isSoundEnabled, setIsSoundEnabled } = useAudio();
  const [copied, setCopied] = useState(false);
  const diagnostic = dictionary.diagnostic;
  // A signed-in patient returns to their own space; a visitor to the public home.
  const signedIn = useSyncExternalStore(() => () => undefined, hasValidSession, () => false);
  const backLabel = signedIn ? dictionary.nav.backToDashboard : dictionary.nav.backHome;

  const handleCopySession = async () => {
    try {
      await navigator.clipboard.writeText(chatId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  function toggleSound() {
    const next = !isSoundEnabled;
    setIsSoundEnabled(next);
    if (next) warmUpDiagnosticVoice();
    else {
      stopAllSpeech();
      stopDiagnosticVoice();
    }
  }

  return (
    <SiteHeader
      variant="app"
      center={
        <div className="hidden items-center gap-3 lg:flex">
          <span className="inline-flex min-h-11 items-center gap-2 rounded-full border border-teal-100/80 bg-teal-50/80 px-4 text-sm font-medium text-teal-800 shadow-xs">
            <ShieldCheck className="h-4 w-4" aria-hidden />
            {diagnostic.confidential}
          </span>
          <button
            type="button"
            onClick={handleCopySession}
            aria-label={`${diagnostic.copySession}: ${chatId}`}
            title={copied ? diagnostic.copiedMessage : diagnostic.copySession}
            className="inline-flex min-h-11 cursor-pointer items-center gap-2.5 rounded-full border border-white bg-white/80 px-4 text-sm text-ink-soft shadow-xs transition-[border-color,color,box-shadow] duration-200 hover:border-teal-200 hover:text-teal-800 hover:shadow-card focus-visible:outline-2 focus-visible:outline-teal-500"
          >
            <span className="h-2 w-2 rounded-full bg-sage" aria-hidden />
            <span dir="ltr">{chatId.slice(0, 8)}</span>
            {copied ? <Check className="h-4 w-4 text-sage-700" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
          </button>
        </div>
      }
      actions={
        <>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={toggleSound}
            aria-pressed={isSoundEnabled}
            aria-label={isSoundEnabled ? diagnostic.mute : diagnostic.unmute}
            title={isSoundEnabled ? diagnostic.mute : diagnostic.unmute}
            className={cn(
              "h-11 w-11 rounded-full border shadow-xs",
              isSoundEnabled
                ? "border-white bg-white/80 text-teal-800 hover:bg-white"
                : "border-white bg-white/60 text-ink-muted hover:bg-white hover:text-ink",
            )}
          >
            {isSoundEnabled ? <Volume2 aria-hidden /> : <VolumeX aria-hidden />}
          </Button>

          <LanguageSwitcher onChange={onLanguageChange} />

          <span aria-hidden className="mx-1 hidden h-7 w-px bg-line-strong/70 sm:block" />

          <Button asChild variant="outline" size="sm" className="min-h-11 rounded-full border-white bg-white/80 px-3 font-semibold text-ink shadow-xs hover:bg-white sm:px-5">
            <Link href={signedIn ? ROUTES.dashboard : ROUTES.home} aria-label={backLabel}>
              <House aria-hidden />
              <span className="hidden sm:inline">{backLabel}</span>
            </Link>
          </Button>
        </>
      }
    />
  );
}
