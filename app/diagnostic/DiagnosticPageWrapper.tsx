"use client";

import { AudioProvider } from "@/contexts/AudioContext";
import { DiagnosticPageClient } from "@/features/diagnostic";
import { Suspense } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2 } from "lucide-react";

function LoadingFallback() {
    const { dictionary } = useLanguage();
    const diagnosticText = dictionary.diagnostic;

    return (
        <div className="flex min-h-dvh items-center justify-center bg-surface-muted px-4" role="status">
            <div className="inline-flex items-center gap-3 rounded-full border border-line bg-white px-5 py-3 text-sm font-medium text-ink shadow-card">
                <Loader2 className="h-4 w-4 shrink-0 animate-spin text-teal-600" aria-hidden />
                {diagnosticText.preparing || "Preparing your diagnostic session…"}
            </div>
        </div>
    );
}

export function DiagnosticPageWrapper() {
    return (
        <AudioProvider>
            <Suspense fallback={<LoadingFallback />}>
                <DiagnosticPageClient />
            </Suspense>
        </AudioProvider>
    );
}
