"use client";

import { AudioProvider } from "@/contexts/AudioContext";
import { DiagnosticPageClient } from "@/components/diagnostic/DiagnosticPageClient";
import { Suspense } from "react";

function LoadingFallback() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
            <div className="inline-flex items-center gap-3 rounded-full border border-black/8 bg-white/80 px-5 py-3 text-sm font-medium text-foreground shadow-sm backdrop-blur-sm">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                Preparing your diagnostic session…
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
