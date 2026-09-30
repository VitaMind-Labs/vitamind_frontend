"use client";

import { HeartPulse } from "lucide-react";
import { CheckinFlow } from "@/components/patient/checkin/CheckinFlow";
import { PageIntro } from "@/components/patient/ui/primitives";
import { usePatientCopy } from "@/hooks/usePatientCopy";

export default function CheckinPage() {
  const copy = usePatientCopy();
  return (
    <div className="lm-rise">
      <PageIntro eyebrow={copy.shell.eyebrows.checkin} icon={HeartPulse} title={copy.checkin.title} subtitle={copy.checkin.subtitle} />
      <CheckinFlow />
    </div>
  );
}
