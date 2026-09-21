"use client";

import Image from "next/image";
import Link from "next/link";
import { Volume2, VolumeX, ShieldCheck, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAudio } from "@/contexts/AudioContext";
import { stopDiagnosticVoice, warmUpDiagnosticVoice } from "@/lib/diagnosticVoice";
import { stopAllSpeech } from "@/hooks/useSpeech";
import { LANGS } from "@/lib/i18n";

export function DiagnosticHeader({ chatId }: { chatId: string }) {
  const { language, setLanguage, dictionary, direction } = useLanguage();
  const { isSoundEnabled, setIsSoundEnabled } = useAudio();
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const diagnostic = dictionary.diagnostic;

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
    <header dir={direction} className="fixed top-0 left-0 right-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      {/* Compact floating rounded header - single elegant glass container */}
      <div className="mx-auto flex h-14 sm:h-16 w-full max-w-5xl items-center justify-between rounded-full border border-white/60 bg-white/50 px-2.5 shadow-[0_8px_32px_rgba(15,23,42,0.08)] backdrop-blur-2xl sm:px-3">
        
        {/* LEFT - Logo and brand name */}
        <Link href="/" aria-label={dictionary.brand} className="flex items-center gap-2.5 shrink-0 rounded-full transition-transform duration-300 hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-primary">
          <div className="relative overflow-hidden rounded-full bg-white/75 border border-white/60 p-1 shadow-[0_4px_16px_rgba(81,133,145,0.12)] backdrop-blur-md">
            <Image
              src="/logo.png"
              alt="VitaMind Logo"
              width={36}
              height={36}
              className="h-8 w-8 rounded-full object-contain md:h-9 md:w-9"
              priority
            />
          </div>
          <span className="hidden font-display text-[14px] font-semibold tracking-tight text-[#2c3e3b] min-[420px]:inline">
            VitaMind
          </span>
        </Link>

        {/* CENTER - Confidentiality badge (desktop only) */}
        <div className="hidden lg:flex items-center absolute left-1/2 -translate-x-1/2">
          <span className="flex items-center gap-1.5 rounded-full bg-white/55 px-3.5 py-2 text-[10px] font-semibold text-[#5a7d76] border border-white/60 shadow-[0_2px_12px_rgba(15,23,42,0.04)] backdrop-blur-xl">
            <ShieldCheck className="h-3.5 w-3.5 text-[#7da89e]" aria-hidden />
            {diagnostic.confidential}
          </span>
        </div>

        {/* RIGHT - Controls: sound, language, back home */}
        <div className="flex items-center gap-1">
          {/* Sound toggle */}
          <button
            onClick={toggleSound}
            aria-pressed={isSoundEnabled}
            className={`flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-300 active:scale-90 focus-visible:outline-2 focus-visible:outline-primary ${
              isSoundEnabled
                ? "border-primary/25 bg-primary/8 text-primary shadow-[0_2px_12px_rgba(81,133,145,0.15)]"
                : "border-white/60 bg-white/55 text-gray-400 hover:text-gray-500"
            }`}
            aria-label={isSoundEnabled ? diagnostic.mute : diagnostic.unmute}
            title={isSoundEnabled ? diagnostic.mute : diagnostic.unmute}
          >
            {isSoundEnabled ? <Volume2 className="h-[18px] w-[18px]" /> : <VolumeX className="h-[18px] w-[18px]" />}
          </button>

          {/* Language selector */}
          <div className="relative">
            <button
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              aria-expanded={isLanguageOpen}
              aria-haspopup="listbox"
              className="flex h-10 px-3 items-center justify-center gap-1 rounded-full border border-white/60 bg-white/55 text-gray-600 text-xs font-bold transition-all duration-300 hover:bg-white/75 backdrop-blur-md focus-visible:outline-2 focus-visible:outline-primary"
            >
              {LANGS.find((item) => item.code === language)?.flag || language.toUpperCase()}
              <ChevronDown className={`h-3 w-3 text-gray-400 transition-transform duration-300 ${isLanguageOpen ? "rotate-180" : ""}`} />
            </button>

            {isLanguageOpen && (
              <div role="listbox" className="absolute end-0 mt-2 w-44 rounded-[18px] border border-white/60 bg-white/85 shadow-[0_16px_48px_rgba(15,23,42,0.12)] overflow-hidden z-50 backdrop-blur-2xl">
                {LANGS.map((lang) => (
                  <button
                    key={lang.code}
                    role="option"
                    aria-selected={language === lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsLanguageOpen(false);
                    }}
                    aria-label={lang.label}
                    className={`w-full px-4 py-2.5 min-h-[46px] text-start text-sm font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-primary ${language === lang.code
                      ? "bg-gradient-to-r from-primary to-primary/80 text-white"
                      : "text-gray-600 hover:bg-gray-50/80"
                      }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Back Home */}
          <Link
            href="/"
            className="hidden sm:flex min-h-[38px] rounded-full border border-white/60 bg-white/55 px-3.5 py-2 text-[12px] font-semibold text-gray-600 transition-all duration-300 hover:bg-white/75 hover:text-primary backdrop-blur-md focus-visible:outline-2 focus-visible:outline-primary"
          >
            {dictionary?.nav?.backHome || "Back home"}
          </Link>
        </div>
      </div>
    </header>
  );
}
