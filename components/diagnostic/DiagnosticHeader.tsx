"use client";

import Image from "next/image";
import Link from "next/link";
import { Volume2, VolumeX, ShieldCheck, ChevronDown, ArrowLeft, Home } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAudio } from "@/contexts/AudioContext";
import { stopDiagnosticVoice, warmUpDiagnosticVoice } from "@/lib/diagnosticVoice";
import { stopAllSpeech } from "@/hooks/useSpeech";
import { LANGS, type Lang } from "@/lib/i18n";

export function DiagnosticHeader({ chatId, onLanguageChange }: { chatId: string; onLanguageChange?: (language: Lang) => void }) {
  const { language, setLanguage, dictionary, direction } = useLanguage();
  const { isSoundEnabled, setIsSoundEnabled } = useAudio();
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isLanguageOpen) return;
    const onDown = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setIsLanguageOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsLanguageOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [isLanguageOpen]);

  return (
    <header dir={direction} className="fixed inset-x-0 top-0 z-50 px-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-4 sm:pt-[max(1rem,env(safe-area-inset-top))] pointer-events-none">
      <div
        className={`pointer-events-auto mx-auto flex h-14 sm:h-[64px] w-full max-w-5xl items-center justify-between gap-2 rounded-full border px-2 sm:px-3 shadow-[0_8px_32px_rgba(15,23,42,0.08)] backdrop-blur-2xl transition-all duration-300 ${scrolled ? "bg-white/85 border-white/70 shadow-[0_12px_40px_rgba(15,23,42,0.12)]" : "bg-white/55 border-white/60"
          }`}
      >
        {/* LEFT - Logo */}
        <Link
          href="/"
          aria-label={dictionary.brand}
          className="flex items-center gap-2 sm:gap-2.5 shrink-0 rounded-full focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
        >
          <span className="relative overflow-hidden rounded-full bg-white/80 border border-white/70 p-1 sm:p-1.5 shadow-[0_4px_16px_rgba(81,133,145,0.12)] backdrop-blur-md flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="VitaMind Logo"
              width={36}
              height={36}
              className="h-7 w-7 sm:h-8 sm:w-8 rounded-full object-contain"
              priority
            />
          </span>
          <span className="hidden min-[380px]:inline font-display text-[13px] sm:text-[15px] font-bold tracking-tight text-[#2c3e3b] leading-none">
            VitaMind
          </span>
          <span
            className="hidden min-[900px]:inline-flex items-center gap-1 rounded-full bg-primary/8 border border-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-primary"
            aria-hidden
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Mira
          </span>
        </Link>

        {/* CENTER - Confidential badge + session · enhanced with copy */}
        <div className="hidden lg:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
          <span className="hidden xl:inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3.5 py-2 text-[10px] font-bold uppercase tracking-wide text-[#5a7d76] border border-white/60 shadow-sm backdrop-blur-xl">
            <ShieldCheck className="h-3.5 w-3.5 text-[#7da89e]" aria-hidden />
            {diagnostic.confidential}
          </span>
          <button
            type="button"
            onClick={handleCopySession}
            title={copied ? (language === "ar" ? "تم النسخ" : "Copied") : `${diagnostic.session}: ${chatId}`}
            aria-label={`Copy ${diagnostic.session} ${chatId.slice(0, 8)}`}
            className="hidden xl:inline-flex items-center gap-1.5 rounded-full bg-white/80 border border-white/70 px-2.5 py-1.5 text-[10px] font-mono font-medium text-primary/80 shadow-sm backdrop-blur-xl transition-all hover:bg-white hover:text-primary hover:shadow-md active:scale-[0.98]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden />
            {diagnostic.session}: {chatId.slice(0, 8)}
            <span className={`text-[9px] font-sans tracking-wide transition-colors ${copied ? "text-emerald-600" : "text-gray-400"}`}>
              {copied ? "✓" : "⧉"}
            </span>
          </button>
        </div>

        {/* RIGHT - Controls */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Confidential icon only on mid screens */}
          <span className="hidden sm:inline-flex lg:hidden h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/60 text-[#7da89e] backdrop-blur-md">
            <ShieldCheck className="h-4 w-4" aria-hidden />
          </span>

          {/* Sound */}
          <button
            onClick={toggleSound}
            aria-pressed={isSoundEnabled}
            aria-label={isSoundEnabled ? diagnostic.mute : diagnostic.unmute}
            title={isSoundEnabled ? diagnostic.mute : diagnostic.unmute}
            className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-200 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${isSoundEnabled
                ? "border-primary/20 bg-primary text-white shadow-[0_4px_16px_rgba(81,133,145,0.25)]"
                : "border-white/60 bg-white/60 text-gray-500 hover:text-gray-700 hover:bg-white/80"
              }`}
          >
            {isSoundEnabled ? <Volume2 className="h-[16px] w-[16px] sm:h-[18px] sm:w-[18px]" /> : <VolumeX className="h-[16px] w-[16px] sm:h-[18px] sm:w-[18px]" />}
          </button>

          {/* Language */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              aria-expanded={isLanguageOpen}
              aria-haspopup="listbox"
              aria-label="Select language"
              className="flex h-9 sm:h-10 items-center gap-1 rounded-full border border-white/60 bg-white/70 px-2.5 sm:px-3 text-[11px] sm:text-xs font-bold tracking-wide text-gray-700 backdrop-blur-md transition-all hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <span className="min-w-[22px] text-center">{LANGS.find((i) => i.code === language)?.flag || language.toUpperCase()}</span>
              <ChevronDown className={`h-3 w-3 text-gray-400 transition-transform duration-200 ${isLanguageOpen ? "rotate-180" : ""}`} aria-hidden />
            </button>

            <AnimatePresence>
              {isLanguageOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.98 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  role="listbox"
                  aria-label="Language"
                  className="absolute end-0 top-[calc(100%+8px)] w-48 rounded-[18px] border border-white/60 bg-white/90 shadow-[0_16px_48px_rgba(15,23,42,0.14)] backdrop-blur-2xl overflow-hidden z-50"
                >
                  {LANGS.map((lang) => {
                    const active = lang.code === language;
                    return (
                      <button
                        key={lang.code}
                        role="option"
                        aria-selected={active}
                        onClick={() => {
                          setLanguage(lang.code);
                          onLanguageChange?.(lang.code);
                          setIsLanguageOpen(false);
                        }}
                        className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-sm font-medium transition-colors text-start focus-visible:outline-2 focus-visible:outline-primary ${active ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-50"
                          }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold border ${active ? "bg-white/20 border-white/30 text-white" : "bg-gray-100 border-gray-200 text-gray-600"}`}>
                            {lang.flag}
                          </span>
                          {lang.label}
                        </span>
                        {active && <span className="h-1.5 w-1.5 rounded-full bg-white" aria-hidden />}
                      </button>
                    );
                  })}
                  <div className="px-3 py-2 bg-gray-50/70 border-t border-gray-100 text-[10px] text-center text-gray-400 font-medium">
                    {language === "ar" ? "اختر لغتك" : "Choose your language"}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Divider */}
          <span aria-hidden className="hidden sm:block h-6 w-px bg-gray-200/60 mx-0.5" />

          {/* Back Home */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 sm:gap-2 min-h-9 sm:min-h-10 rounded-full border border-white/60 bg-white/70 px-2.5 sm:px-4 text-xs font-semibold text-gray-700 backdrop-blur-md transition-all hover:bg-white hover:text-primary hover:border-primary/20 hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5 rtl:rotate-180 shrink-0" aria-hidden />
            <span className="hidden sm:inline">{dictionary.nav.backHome}</span>
            <span className="sm:hidden">
              <Home className="h-3.5 w-3.5" aria-hidden />
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
