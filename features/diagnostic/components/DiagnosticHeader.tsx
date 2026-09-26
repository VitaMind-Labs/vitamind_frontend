"use client";

import Link from "next/link";
import { Check, Copy, House, ShieldCheck, Volume2, VolumeX } from "lucide-react";
import { useState } from "react";
import { SiteHeader } from "@/components/layout/site-header";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAudio } from "@/contexts/AudioContext";
import { stopAllSpeech } from "@/hooks/useSpeech";
import type { Lang } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";
import { stopDiagnosticVoice, warmUpDiagnosticVoice } from "../lib/voice";

/** Diagnostic uses the shared application header; only its controls are specific. */
export function DiagnosticHeader({ chatId, onLanguageChange }: { chatId: string; onLanguageChange?: (language: Lang) => void }) {
  const { dictionary } = useLanguage();
  const { isSoundEnabled, setIsSoundEnabled } = useAudio();
  const [copied, setCopied] = useState(false);
  const diagnostic = dictionary.diagnostic;

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
        <div className="hidden items-center gap-2 lg:flex">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sage-50 px-3 py-1.5 text-xs font-medium text-sage-700">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
            {diagnostic.confidential}
          </span>
          <button
            type="button"
            onClick={handleCopySession}
            aria-label={`${diagnostic.copySession}: ${chatId}`}
            title={copied ? diagnostic.copiedMessage : diagnostic.copySession}
            className="inline-flex min-h-8 cursor-pointer items-center gap-1.5 rounded-full border border-line bg-white px-3 text-xs text-ink-muted transition-colors hover:border-teal-200 hover:text-teal-700 focus-visible:outline-2 focus-visible:outline-teal-500"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-sage" aria-hidden />
            <span className="font-mono" dir="ltr">{chatId.slice(0, 8)}</span>
            {copied ? <Check className="h-3.5 w-3.5 text-sage-700" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
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
              "h-10 w-10 border",
              isSoundEnabled
                ? "border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-100"
                : "border-line bg-white text-ink-muted hover:text-ink",
            )}
          >
            {isSoundEnabled ? <Volume2 aria-hidden /> : <VolumeX aria-hidden />}
          </Button>

          <LanguageSwitcher onChange={onLanguageChange} />

          <span aria-hidden className="mx-0.5 hidden h-6 w-px bg-line sm:block" />

          <Button asChild variant="outline" size="sm" className="min-h-10 border-line px-3 sm:px-4">
            <Link href="/" aria-label={dictionary.nav.backHome}>
              <House aria-hidden />
              <span className="hidden sm:inline">{dictionary.nav.backHome}</span>
            </Link>
          </Button>
        </>
      }
    />
  );
}
