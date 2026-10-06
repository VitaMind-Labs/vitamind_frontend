"use client";

import { AgentShell, Boundaries, Closing } from "../shared";
import { LuminaBento } from "./LuminaBento";
import { LuminaHero } from "./LuminaHero";
import { LuminaProcess } from "./LuminaProcess";
import { LuminaTracks } from "./LuminaTracks";

/** /lumina — a dashboard: today as a ring, a bento of what she does, the month told as four views of one window. */
export function LuminaPage() {
  return (
    <AgentShell>
      <LuminaHero />
      <LuminaBento />
      <LuminaTracks />
      <LuminaProcess />
      <Boundaries agent="lumina" counter="04 / 04" tone="base" />
      <Closing agent="lumina" tone="champagne" />
    </AgentShell>
  );
}
