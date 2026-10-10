"use client";

import { AgentShell, Boundaries, Closing } from "../shared";
import { PsyHero } from "./PsyHero";
import { PsyProcess } from "./PsyProcess";
import { PsyRoles } from "./PsyRoles";

/** /psy — the clinician's own app: a window on today, an index of what it holds, a day told as four screens. */
export function PsyPage() {
  return (
    <AgentShell>
      <PsyHero />
      <PsyRoles />
      <PsyProcess />
      <Boundaries agent="psy" counter="03 / 03" tone="base" />
      <Closing agent="psy" tone="deep" />
    </AgentShell>
  );
}
