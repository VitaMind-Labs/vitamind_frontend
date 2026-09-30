"use client";

import { PatientGate } from "@/components/patient/shell/PatientShell";
import { WelcomeExperience } from "@/components/patient/welcome/WelcomeExperience";

/** First-registration welcome: an immersive, Lumina-only screen (no dashboard chrome). */
export default function WelcomePage() {
  return (
    <PatientGate>
      <WelcomeExperience />
    </PatientGate>
  );
}
