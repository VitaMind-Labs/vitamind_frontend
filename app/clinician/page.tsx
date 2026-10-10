import type { Metadata } from "next";
import { AgentJsonLd } from "@/components/agents/AgentJsonLd";
import { PsyPage } from "@/components/agents/psy/PsyPage";
import { ROUTES } from "@/lib/config/routes";
import { pageMetadata } from "@/lib/config/site";
import { agentPagesCopy } from "@/lib/i18n/agents";

const { seo } = agentPagesCopy.en.psy;

export const metadata: Metadata = pageMetadata({ title: seo.title, description: seo.description, path: ROUTES.psy });

export default function Page() {
  return (
    <>
      <AgentJsonLd path={ROUTES.psy} name={seo.title} description={seo.description} />
      <PsyPage />
    </>
  );
}
