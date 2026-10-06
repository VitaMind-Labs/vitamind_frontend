import type { Metadata } from "next";
import { AgentJsonLd } from "@/components/agents/AgentJsonLd";
import { TracksPage } from "@/components/tracks/TracksPage";
import { ROUTES } from "@/lib/config/routes";
import { pageMetadata } from "@/lib/config/site";
import { tracksCopy } from "@/lib/i18n/tracks";

const { seo } = tracksCopy.en;

export const metadata: Metadata = pageMetadata({ title: seo.title, description: seo.description, path: ROUTES.tracks });

export default function Page() {
  return (
    <>
      <AgentJsonLd path={ROUTES.tracks} name={seo.title} description={seo.description} />
      <TracksPage />
    </>
  );
}
