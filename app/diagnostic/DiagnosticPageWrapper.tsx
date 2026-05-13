"use client";

import { AudioProvider } from "@/contexts/AudioContext";
import { DiagnosticPageClient } from "@/components/diagnostic/DiagnosticPageClient";
import { Suspense } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2 } from "lucide-react";

function LoadingFallback() {
    const { dictionary } = useLanguage();
    const diagnosticText = dictionary.diagnostic;

    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <div className="inline-flex items-center gap-3 rounded-full border border-on-background/8 bg-surface/80 px-5 py-3 text-sm font-medium text-on-background shadow-sm backdrop-blur-sm">
                <Loader2 className="h-4 w-4 animate-spin rounded-full border-2 border-on-background/20 border-t-on-background/20" />
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
