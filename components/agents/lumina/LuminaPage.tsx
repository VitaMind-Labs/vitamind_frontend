"use client";

import { AgentShell, Boundaries, Closing } from "../shared";
import { LuminaHero } from "./LuminaHero";
import { LuminaProcess } from "./LuminaProcess";
import { LuminaRoles } from "./LuminaRoles";
import { LuminaTracks } from "./LuminaTracks";

/** /lumina — her own app: today in a window, an index of what she holds, the care tracks, a day told as four screens. */
export function LuminaPage() {
  return (
    <AgentShell>
      <LuminaHero />
      <LuminaRoles />
      <LuminaTracks />
      <LuminaProcess />
      <Boundaries agent="lumina" counter="04 / 04" tone="base" />
      <Closing agent="lumina" tone="champagne" />
    </AgentShell>
  );
}
