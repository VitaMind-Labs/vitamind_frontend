"use client";

import Image from "next/image";
import Link from "next/link";
import { Volume2, VolumeX, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAudio } from "@/contexts/AudioContext";

export function DiagnosticHeader({ chatId }: { chatId: string }) {
    const { language, setLanguage, dictionary } = useLanguage();
    const { isSoundEnabled, setIsSoundEnabled } = useAudio();
    const [isLanguageOpen, setIsLanguageOpen] = useState(false);
    const diagnostic = dictionary.diagnostic;

    const languages = [
        { code: "en", label: "English" },
        { code: "fr", label: "Français" },
        { code: "ar", label: "العربية" },
    ];

    return (
        <header className="fixed top-5 left-1/2 z-50 w-full -translate-x-1/2 px-4">
            <div className="mx-auto flex h-[76px] w-full max-w-[1380px] items-center justify-between rounded-full border border-black/5 bg-white/70 px-4 shadow-[0_8px_40px_rgba(0,0,0,0.06)] backdrop-blur-2xl md:px-7">

                {/* LEFT - Logo */}
                <Link
                    href="/"
                    className="group flex items-center gap-3 transition-all duration-300"
                >
                    <div className="relative overflow-hidden rounded-2xl border border-black/5 bg-white p-2 shadow-sm">
                        <Image
                            src="/logo.png"
                            alt="VitaMind Logo"
                            width={42}
                            height={42}
                            className="h-8 w-8 object-contain md:h-9 md:w-9"
                            priority
                        />
                    </div>
                </Link>

                {/* CENTER - Spacing */}
                <div className="flex-1" />

                {/* RIGHT - Controls */}
                <div className="flex items-center gap-3">
                    {/* Badges - Confidential & Chat ID */}
                    <div className="hidden md:flex items-center gap-2">
                        <span className="flex items-center gap-1.5 rounded-full bg-neutral-100/80 px-3 py-1.5 text-[11px] font-semibold text-neutral-600 border border-neutral-200">
                            <ShieldCheck className="h-3 w-3 text-emerald-600" />
                            {diagnostic.confidential}
                        </span>
                        <span className="rounded-full bg-neutral-100/80 px-3 py-1.5 text-[11px] font-medium text-neutral-500 border border-neutral-200">
                            ID: {chatId.slice(0, 6)}
                        </span>
                    </div>

                    {/* Sound Toggle */}
                    <button
                        onClick={() => setIsSoundEnabled(!isSoundEnabled)}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-black transition-all duration-300 hover:bg-black/[0.04] hover:border-black/20"
                        aria-label={isSoundEnabled ? "Disable sound" : "Enable sound"}
                        title={isSoundEnabled ? "Disable sound" : "Enable sound"}
                    >
                        {isSoundEnabled ? (
                            <Volume2 className="h-5 w-5" />
                        ) : (
                            <VolumeX className="h-5 w-5" />
                        )}
                    </button>

                    {/* Language Switcher */}
                    <div className="relative">
                        <button
                            onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                            className="flex h-10 px-4 items-center justify-center rounded-full border border-black/10 bg-white text-black text-sm font-medium transition-all duration-300 hover:bg-black/[0.04] hover:border-black/20"
                        >
                            {language.toUpperCase()}
                        </button>

                        {isLanguageOpen && (
                            <div className="absolute right-0 mt-2 w-40 rounded-2xl border border-black/10 bg-white shadow-[0_8px_32px_rgba(0,0,0,0.12)] overflow-hidden z-50">
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => {
                                            setLanguage(lang.code as any);
                                            setIsLanguageOpen(false);
                                        }}
                                        className={`w-full px-4 py-3 text-left text-sm font-medium transition-all duration-200 ${language === lang.code
                                            ? "bg-black text-white"
                                            : "text-black/70 hover:bg-black/[0.04]"
                                            }`}
                                    >
                                        {lang.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Exit Button */}
                    <Link
                        href="/"
                        className="hidden rounded-full border border-black/10 bg-white px-5 py-2 text-[13px] font-medium text-black transition-all duration-300 hover:border-black/20 hover:bg-black/[0.03] md:flex"
                    >
                        {dictionary?.nav?.backHome || "Home"}
                    </Link>
                </div>
            </div>
        </header>
    );
}
