import type { Metadata } from "next";
import { BRAND } from "@/lib/config/brand";
import { ROOT_SOCIAL, SITE } from "@/lib/config/site";
import { cookies } from "next/headers";
import { HomeExperience } from "@/components/home/HomeExperience";
import { HOME_INTRO_COOKIE } from "@/lib/config/home";

export const metadata: Metadata = {
  title: { absolute: SITE.title },
  description: SITE.description,
  alternates: { canonical: "/" },
  ...ROOT_SOCIAL,
};

const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE.url}/#organization`,
      name: BRAND.name,
      url: SITE.url,
      logo: `${SITE.url}/assets/vitamind-mark-3d.png`,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE.url}/#website`,
      url: SITE.url,
      name: BRAND.name,
      description: SITE.description,
      inLanguage: ["en", "ar"],
      publisher: { "@id": `${SITE.url}/#organization` },
    },
  ],
};

export default async function Page() {
  const introSeen = (await cookies()).get(HOME_INTRO_COOKIE)?.value === "1";
  return (
    <>
      <script
        type="application/ld+json"
        // Static, server-built object: nothing user-controlled is serialised.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA).replace(/</g, "\\u003c") }}
      />
      <HomeExperience introSeen={introSeen} />
    </>
  );
}
