"use client";

import Image from "next/image";
import Link from "next/link";
import { Volume2, VolumeX, ShieldCheck, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAudio } from "@/contexts/AudioContext";
import { stopDiagnosticVoice, warmUpDiagnosticVoice } from "@/lib/diagnosticVoice";
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
    else stopDiagnosticVoice();
  }

  return (
    <header dir={direction} className="fixed top-0 left-0 right-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <div className="mx-auto flex h-14 sm:h-[60px] w-full max-w-5xl items-center justify-between rounded-[20px] border border-white/60 bg-white/60 px-3 shadow-[0_4px_24px_rgba(0,0,0,0.04)] backdrop-blur-2xl sm:px-4 md:h-[64px] md:rounded-[24px] md:px-5">
        
        {/* LEFT — Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="relative overflow-hidden rounded-xl bg-white border border-gray-100 p-1.5 shadow-sm">
            <Image
              src="/logo.png"
              alt="VitaMind Logo"
              width={32}
              height={32}
              className="h-7 w-7 object-contain md:h-8 md:w-8"
              priority
            />
          </div>
        </Link>

        {/* CENTER — Confidential Badge (desktop) */}
        <div className="hidden md:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
          <span className="flex items-center gap-1.5 rounded-full bg-[#f3f6f5] px-3 py-1.5 text-[11px] font-semibold text-[#5a7d76] border border-[#e8eeec]">
            <ShieldCheck className="h-3 w-3 text-[#7da89e]" />
            {diagnostic.confidential}
          </span>
          <span className="rounded-full bg-[#f3f6f5] px-2.5 py-1.5 text-[11px] font-medium text-gray-400 border border-[#e8eeec]">
            ID: {chatId.slice(0, 6)}
          </span>
        </div>

        {/* RIGHT — Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Sound */}
          <button
            onClick={toggleSound}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-100 bg-white/80 text-gray-500 transition-all hover:bg-[#f3f6f5] hover:text-primary hover:border-[#e8eeec] backdrop-blur-sm"
            aria-label={isSoundEnabled ? diagnostic.mute : diagnostic.unmute}
            title={isSoundEnabled ? diagnostic.mute : diagnostic.unmute}
          >
            {isSoundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>

          {/* Language */}
          <div className="relative">
            <button
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              className="flex h-9 px-3 items-center justify-center gap-1 rounded-full border border-gray-100 bg-white/80 text-gray-600 text-xs font-semibold transition-all hover:bg-[#f3f6f5] hover:border-[#e8eeec] backdrop-blur-sm"
            >
              {LANGS.find((item) => item.code === language)?.flag || language.toUpperCase()}
              <ChevronDown className={`h-3 w-3 text-gray-400 transition-transform ${isLanguageOpen ? "rotate-180" : ""}`} />
            </button>

            {isLanguageOpen && (
              <div className="absolute right-0 mt-2 w-40 rounded-2xl border border-white/60 bg-white/80 shadow-[0_12px_40px_rgba(0,0,0,0.08)] overflow-hidden z-50 backdrop-blur-2xl">
                {LANGS.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsLanguageOpen(false);
                    }}
                    className={`w-full px-4 py-3 text-left text-sm font-medium transition-all duration-200 ${language === lang.code
                      ? "bg-gradient-to-r from-primary to-tertiary text-white"
                      : "text-gray-600 hover:bg-[#f3f6f5]"
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
            className="hidden sm:flex rounded-full border border-gray-100 bg-white/80 px-4 py-2 text-[13px] font-medium text-gray-600 transition-all hover:bg-[#f3f6f5] hover:text-primary hover:border-[#e8eeec] backdrop-blur-sm"
          >
            {dictionary?.nav?.backHome || "Back home"}
          </Link>
        </div>
      </div>
    </header>
  );
}