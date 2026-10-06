"use client";

import { AgentShell } from "@/components/agents/shared";
import { TracksCta } from "./TracksCta";
import { TracksExplorer } from "./TracksExplorer";
import { TracksHero } from "./TracksHero";
import { TracksMatrix } from "./TracksMatrix";

/** /tracks — the one page that describes ADHD, bipolar disorder and psychosis, and how the daily space leans for each. */
export function TracksPage() {
  return (
    <AgentShell>
      <TracksHero />
      <TracksExplorer />
      <TracksMatrix />
      <TracksCta />
    </AgentShell>
  );
}
