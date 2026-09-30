"use client";

import { Suspense } from "react";
import { AudioProvider } from "@/contexts/AudioContext";
import { DiagnosticPageClient } from "./DiagnosticPageClient";
import { OrientationSkeleton } from "./OrientationSkeleton";

/** /orientation — Mira's guided conversation. Search params resolve inside Suspense. */
export function OrientationPage() {
  return (
    <AudioProvider>
      <Suspense fallback={<OrientationSkeleton />}>
        <DiagnosticPageClient />
      </Suspense>
    </AudioProvider>
  );
}
