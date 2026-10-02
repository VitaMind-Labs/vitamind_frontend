"use client";

import { useSyncExternalStore } from "react";

/** Tracks whose patients should never see drifting, rising or floating motion: a calm fade only. */
const CALM_TRACKS = new Set(["SCHIZOPHRENIA", "PSYCHOSIS"]);

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-track"] });
  return () => observer.disconnect();
}

const read = () => CALM_TRACKS.has(document.documentElement.dataset.track ?? "");

/**
 * True while the app is tinted for a schizophrenia / psychosis track (`<html data-track>`, set by the
 * patient provider). Motion then becomes opacity only. Reduced-motion is handled separately, as before.
 */
export function useCalmTrack() {
  return useSyncExternalStore(subscribe, read, () => false);
}
