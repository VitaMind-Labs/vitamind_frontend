"use client";

import Image from "next/image";
import Link from "next/link";
import { Volume2, VolumeX, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAudio } from "@/contexts/AudioContext";
import { Button} from "@/components/ui/button";

export function DiagnosticHeader({ chatId }: { chatId: string }) {
    const { language, setLanguage, dictionary, direction } = useLanguage();
    const { isSoundEnabled, setIsSoundEnabled } = useAudio();
    const [isLanguageOpen, setIsLanguageOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const diagnostic = dictionary.diagnostic;

    useEffect(() => { setMounted(true); }, []);

    const languages = [
        { code: "en", label: "English" },
        { code: "fr", label: "Français" },
        { code: "ar", label: "العربية" },
    ];

    return (
        <header dir={direction} className="relative top-2 md:top-5 left-1/2 z-50 w-full -translate-x-1/2 px-2 sm:px-4">
            <div className="mx-auto flex h-[64px] md:h-[76px] w-full max-w-[1380px] items-center justify-between rounded-full border border-primary/10 bg-surface/70 px-3 shadow-[0_8px_40px_rgba(81,133,145,0.08)] backdrop-blur-2xl md:px-7">

                {/* LEFT - Logo */}
                <Link
                    href="/"
                    className="group flex items-center gap-3 transition-all duration-300"
                >
                    <div className="relative overflow-hidden rounded-2xl border border-primary/10 bg-surface p-2 shadow-sm">
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
                        <span className="flex items-center gap-1.5 rounded-full bg-primary/5 px-3 py-1.5 text-[11px] font-semibold text-primary border border-primary/10">
                            <ShieldCheck className="h-3 w-3 text-tertiary" />
                            {mounted ? diagnostic.confidential : "Loading..."}
                        </span>
                        <span className="rounded-full bg-primary/5 px-3 py-1.5 text-[11px] font-medium text-on-background/60 border border-primary/10">
                            ID: {chatId.slice(0, 6)}
                        </span>
                    </div>

                    {/* Sound Toggle */}
                    <Button
                        onClick={() => setIsSoundEnabled(!isSoundEnabled)}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/10 bg-surface text-on-background transition-all duration-300 hover:bg-primary/5 hover:border-primary/20"
                        aria-label={isSoundEnabled ? "Disable sound" : "Enable sound"}
                        title={isSoundEnabled ? "Disable sound" : "Enable sound"}
                    >
                        {isSoundEnabled ? (
                            <Volume2 className="h-5 w-5" />
                        ) : (
                            <VolumeX className="h-5 w-5" />
                        )}
                    </Button>

                    {/* Language Switcher */}
                    <div className="relative">
                        <Button
                            onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                            className="flex h-10 px-4 items-center justify-center rounded-full border border-primary/10 bg-surface text-on-background text-sm font-medium transition-all duration-300 hover:bg-primary/5 hover:border-primary/20"
                        >
                            {mounted ? language.toUpperCase() : "EN"}
                        </Button>

                        {isLanguageOpen && (
                            <div className="absolute right-0 mt-2 w-40 rounded-2xl border border-primary/10 bg-surface shadow-[0_8px_32px_rgba(81,133,145,0.12)] overflow-hidden z-50">
                                {languages.map((lang) => (
                                    <Button
                                        key={lang.code}
                                        onClick={() => {
                                            setLanguage(lang.code as any);
                                            setIsLanguageOpen(false);
                                        }}
                                        className={`w-full px-4 py-3 text-left text-sm font-medium transition-all duration-200 ${language === lang.code
                                            ? "bg-gradient-to-r from-primary to-tertiary text-white"
                                            : "text-on-background/70 hover:bg-primary/5"
                                            }`}
                                    >
                                        {lang.label}
                                    </Button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Exit Button */}
                    <Link
                        href="/"
                        className="hidden rounded-full border border-primary/10 bg-surface px-5 py-2 text-[13px] font-medium text-on-background transition-all duration-300 hover:border-primary/20 hover:bg-primary/5 md:flex"
                    >
                        {dictionary?.nav?.backHome || "Home"}
                    </Link>
                </div>
            </div>
        </header>
    );
}