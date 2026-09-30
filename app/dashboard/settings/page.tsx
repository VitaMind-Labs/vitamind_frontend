"use client";

import { SlidersHorizontal } from "lucide-react";
import { MemorySection, PlanSection, PrivacySection, ProfileSection, ReminderSection, SessionSection } from "@/components/patient/settings/SettingsSections";
import { PageIntro } from "@/components/patient/ui/primitives";
import { usePatientCopy } from "@/hooks/usePatientCopy";

export default function SettingsPage() {
  const copy = usePatientCopy();
  return (
    <div className="lm-rise">
      <PageIntro eyebrow={copy.shell.eyebrows.settings} icon={SlidersHorizontal} title={copy.settings.title} subtitle={copy.settings.subtitle} />
      <div className="grid items-start gap-5 xl:grid-cols-2">
        <div className="space-y-5">
          <ProfileSection />
          <ReminderSection />
          <PlanSection />
          <SessionSection />
        </div>
        <div className="space-y-5">
          <PrivacySection />
          <MemorySection />
        </div>
      </div>
    </div>
  );
}
