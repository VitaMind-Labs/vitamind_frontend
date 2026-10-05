"use client";

import { AgentShell, Boundaries, Closing } from "../shared";
import { MiraHero } from "./MiraHero";
import { MiraProcess } from "./MiraProcess";
import { MiraRoles } from "./MiraRoles";

/** /mira — a conversation: a phone with her chat, an index of what she does, the walk-through on one phone. */
export function MiraPage() {
  return (
    <AgentShell>
      <MiraHero />
      <MiraRoles />
      <MiraProcess />
      <Boundaries agent="mira" counter="03 / 03" />
      <Closing agent="mira" tone="deep" />
    </AgentShell>
  );
}
