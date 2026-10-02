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
          <span className="inline-flex min-h-10 items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-4 text-[0.875rem] font-medium text-teal-800">
            <ShieldCheck className="size-4" aria-hidden />
            {diagnostic.confidential}
          </span>
          <button
            type="button"
            onClick={handleCopySession}
            aria-label={`${diagnostic.copySession}: ${chatId}`}
            title={copied ? diagnostic.copiedMessage : diagnostic.copySession}
            className="inline-flex min-h-10 cursor-pointer items-center gap-2.5 rounded-full border border-line bg-white px-4 text-[0.875rem] text-ink-soft transition-[border-color,color,box-shadow] duration-300 ease-out-soft hover:border-teal-200 hover:text-teal-800 hover:shadow-card focus-visible:outline-2 focus-visible:outline-teal-500"
          >
            <span className="size-2 rounded-full bg-sage" aria-hidden />
            <span dir="ltr" className="font-mono text-[0.8125rem]">{chatId.slice(0, 8)}</span>
            {copied ? <Check className="size-4 text-sage-700" aria-hidden /> : <Copy className="size-4" aria-hidden />}
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
              "size-10 min-h-10 rounded-full border",
              isSoundEnabled
                ? "border-teal-200 bg-teal-50 text-teal-800 hover:bg-teal-100"
                : "border-line bg-white text-ink-soft hover:border-teal-200 hover:text-ink",
            )}
          >
            {isSoundEnabled ? <Volume2 aria-hidden /> : <VolumeX aria-hidden />}
          </Button>

          <LanguageSwitcher onChange={onLanguageChange} />

          <span aria-hidden className="mx-1 hidden h-6 w-px bg-line-strong/70 sm:block" />

          <Link
            href={signedIn ? ROUTES.dashboard : ROUTES.home}
            aria-label={backLabel}
            className="group inline-flex min-h-10 items-center gap-2.5 rounded-full bg-ink px-3.5 text-sm font-semibold text-white shadow-[0_10px_24px_-12px_rgb(34_60_65/0.7)] transition-[background-color,transform] duration-300 ease-out-soft hover:bg-teal-800 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500 sm:px-5"
          >
            <House className="size-4 transition-transform duration-300 ease-out-soft group-hover:-translate-y-0.5" aria-hidden />
            <span className="hidden sm:inline">{backLabel}</span>
          </Link>
        </>
      }
    />
  );
}
