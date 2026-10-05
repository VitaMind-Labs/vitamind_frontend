import type { MetadataRoute } from "next";
import { SITEMAP_ROUTES, SITE_URL } from "@/lib/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return SITEMAP_ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
